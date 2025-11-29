<?php
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die('Restricted access');
require_once JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php';

#[\AllowDynamicProperties]
class plgJshoppingProductsCartAjaxAttributes extends CMSPlugin {

	public function __construct(&$subject, $config = array()) {
		Factory::getLanguage()->load('com_jshopping.addon_cartajax', JPATH_ROOT);
		parent::__construct($subject, $config);  
	}

	function onBeforeDisplayProductList(&$products) {
		$jshopConfig = JSFactory::getConfig();
		$app = Factory::getApplication();
        $config_list = $jshopConfig->getProductListDisplayExtraFields();
        $lang = JSFactory::getLang();
		if (count($products) > 0) {
			if (!isset($this->scripts_included) && Factory::getDocument()->getType() == 'html') {
				$preload_attribute_value = intval($this->params->get('preload_attribute_value', 0));
				CartAjaxHelper::includeCommonCode();
				$document = Factory::getDocument();
                $addon = new AddonCore('cartajax');
                $addon->loadCss('_attributes');
                $addon->loadJs('_attributes');
				$document->addCustomTag('<script type="text/javascript">cartajax.preload_attribute_value='.$preload_attribute_value.';</script>');
				$this->scripts_included = true;
			}
            
			$model_attributes = JSFactory::getModel('cartajaxattributes', 'jshop', $products);
			foreach($products as $key => $product) {
				$htmlform = $model_attributes->getProductAttributesForm($product->product_id, $product->category_id);
				$prod = $model_attributes->getProduct();
				
				$app->triggerEvent('onBeforeDisplayCartAjaxAttribProduct', array(&$product, $prod));

				$products[$key]->_tmp_var_top_buttons .= $htmlform;
				$products[$key]->cart_ajax_attr_selected = $prod->attribute_active ?? null ;
				if ($product->product_quantity > 0) {
					$pr_available_text = Text::_('JSHOP_PRODUCT_AVAILABLE');
					$pr_available_class = 'available';
				} else {
					$pr_available_text = Text::_('JSHOP_PRODUCT_NOT_AVAILABLE');
					$pr_available_class = 'not_available';
					if (isset($product->to_order) && $product->to_order) {
						$pr_available_text = Text::_('PRODUCT_AVAILABLE_TO_ORDER');
					}
				}
				if (isset($prod)) {
					$prod->getPricePreview();
					$product->product_price = $prod->product_price_calculate;
					$product->product_old_price = $prod->product_old_price;
					$product->product_ean = $prod->getEan();
					$product->manufacturer_code = $prod->getManufacturerCode();
					if (method_exists($prod, 'getRealEan')) {
						$product->real_ean = $prod->getRealEan();
					}
					$product->qty_in_stock = Helper::getDataProductQtyInStock($prod);
					if ($product->product_quantity > 0 && $prod->getQty() <= 0) {
						$pr_available_text = Text::_('JSHOP_PRODUCT_NOT_AVAILABLE_THIS_OPTION');
						$pr_available_class = 'not_available';
						if (isset($product->to_order) && $product->to_order) {
							$pr_available_text = Text::_('PRODUCT_AVAILABLE_TO_ORDER');
						}
					}
					
					if ($jshopConfig->list_products_calc_basic_price_from_product_price){
						$product->basic_price_info = Helper::getProductBasicPriceInfo($product, $product->product_price_wp);
					}else{
						$product->basic_price_info = Helper::getProductBasicPriceInfo($product, $product->product_price);
					}

					if ($jshopConfig->use_extend_attribute_data) {
						$images = $prod->getImages();
						if (file_exists(JPATH_SITE."/plugins/jshoppingproducts/addon_quick_view_img/addon_quick_view_img.php")) {
							$product->images = $images;
						}
						if (isset($images[0])) {
							$product->image = Helper::getPatchProductImage($images[0]->image_name, 'thumb', 1);
						}
					}
                    if (file_exists(JPATH_SITE."/components/com_jshopping/addons/prod_attr_charactiristic/addonprod_attr_charactiristic.php")) {
                        $ext_prod = null;
						$extra_fields = null;
						if (isset($prod->attribute_active_data->ext_data)) {
                            $ext_prod = $prod->attribute_active_data->ext_data;
                            $ext_prod->product_categories = $prod->getCategories();
                        }
                        $field_name = $lang->get("name");
                        if (isset($ext_prod) && $ext_prod->$field_name) {
                            $product->name = $ext_prod->$field_name;
                        } else {
                            $product->name = $prod->$field_name;
                        }
                        $field_name = $lang->get("short_description");
                        if (isset($ext_prod) && $ext_prod->$field_name) {
                            $product->short_description = $ext_prod->$field_name;
                        } else {
                            $product->short_description = $prod->$field_name;
                        }
                        if (isset($ext_prod)) {
                            $extra_fields = $ext_prod->getExtraFields();
                            if (!$extra_fields) {
                                $extra_fields = $prod->getExtraFields();
                            }
                        } else {
                            $extra_fields = $prod->getExtraFields();
                        }
                        if ($extra_fields) {
                            foreach($extra_fields as $k=>$val){
                                if (!in_array($val['id'], $config_list)) unset($extra_fields[$k]);
                            }
                            $product->extra_field = $extra_fields;
                        }
                    }
				}
				if (!$jshopConfig->hide_text_product_not_available) {
					$product->_tmp_var_bottom_price .= '<div class="ca_block_available '.$pr_available_class.'">'.
						$pr_available_text.
					'</div>';
				}

				if ($product->product_old_price <= 0){
					$addonCore = new \AddonCore('cartajax');
					$view = $addonCore->getView('oldprice');
					$view->config = $jshopConfig;
					$view->product = $product;
					$product->_tmp_var_bottom_old_price .= $view->loadTemplate();
				}
				
				$app->triggerEvent('onAfterDisplayCartAjaxAttribProduct', array(&$product, $prod));
			}
		}

	}
}