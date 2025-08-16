<?php
defined('_JEXEC') or die('Restricted access');
require_once JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php';

#[\AllowDynamicProperties]
class plgJshoppingProductsCartAjaxAttributes extends JPlugin {        

	public function __construct(&$subject, $config = array()) {
		\JFactory::getLanguage()->load('com_jshopping.addon_cartajax', JPATH_ROOT);
		parent::__construct($subject, $config);  
	}

	function onBeforeDisplayProductList(&$products) {
		$jshopConfig = \JSFactory::getConfig();
        $config_list = $jshopConfig->getProductListDisplayExtraFields();
        $lang = \JSFactory::getLang();
		if (count($products) > 0) {                
			if (!isset($this->scripts_included) && JFactory::getDocument()->getType() == 'html') {
				$preload_attribute_value = intval($this->params->get('preload_attribute_value', 0));
				CartAjaxHelper::includeCommonCode();
				$document = \JFactory::getDocument();
				$document->addCustomTag('<link type="text/css" rel="stylesheet" href="'.JURI::base().'plugins/jshoppingproducts/cartajaxattributes/cartajaxattributes_plugin.css" />');
				$document->addCustomTag('<script type="text/javascript">cartajax.preload_attribute_value='.$preload_attribute_value.';</script>');
				$document->addCustomTag('<script type="text/javascript" src="'.JURI::base().'plugins/jshoppingproducts/cartajaxattributes/cartajaxattributes_plugin.js"> </script>');
				$this->scripts_included = true;
			}
			
			$model_attributes = \JSFactory::getModel('cartajaxattributes', 'jshop', $products);
			foreach($products as $key => $product) {
				$products[$key]->_tmp_var_top_buttons .= $model_attributes->getProductAttributesForm($product->product_id, $product->category_id);
				$prod = $model_attributes->getProduct();
				$products[$key]->cart_ajax_attr_selected = $prod->attribute_active ?? null ;
				if (isset($prod)) {
					$prod->getPricePreview();
					$product->product_price = $prod->product_price_calculate;
					$product->product_old_price = $prod->product_old_price;
					$product->product_ean = $prod->getEan();
					$product->manufacturer_code = $prod->getManufacturerCode();
					if (method_exists($prod, 'getRealEan')) {
						$product->real_ean = $prod->getRealEan();
					}
					$product->qty_in_stock = \JSHelper::getDataProductQtyInStock($prod);
					if ($product->product_quantity > 0 && $prod->getQty() <= 0) {
						$product->_tmp_var_bottom_price .= '<div class="not_available">'.\JText::_('JSHOP_PRODUCT_NOT_AVAILABLE_THIS_OPTION').'</div>';
					}
					if ($jshopConfig->use_extend_attribute_data) {
						$images = $prod->getImages();
						if (isset($images[0])) {
							$product->image = \JSHelper::getPatchProductImage($images[0]->image_name, 'thumb', 1);
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
			}
		}
	}
}