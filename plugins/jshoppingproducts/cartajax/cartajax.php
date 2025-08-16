<?php
use Joomla\CMS\HTML\HTMLHelper;

defined('_JEXEC') or die;
require_once JPATH_SITE . '/components/com_jshopping/helpers/cartajax.php';

#[\AllowDynamicProperties]
class plgJshoppingProductsCartAjax extends JPlugin {

    public $aQuantity = null;

    public function __construct(&$subject, $config = array()) {
        \JFactory::getLanguage()->load('com_jshopping.addon_cartajax', JPATH_ROOT);
        parent::__construct($subject, $config);  
    }
	
	protected function getHtmlModal() {
		$show_popup_message = $this->params->get('show_popup_message', 0);
		$html = '';
		if ($show_popup_message) {
			$html .= HTMLHelper::_(
				'bootstrap.renderModal',
				'cartajaxCartModal',
				array(
					'modal-dialog-scrollable' => true,
					'title'  => \JText::_('JSHOP_ADDED_TO_CART'),
					'footer' => '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">'.\JText::_('JSHOP_BACK_TO_SHOP').'</button>
								<button type="button" class="btn btn-primary" onclick="document.location=\''.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view',1,1).'\'">'.\JText::_('JSHOP_GO_TO_CART').'</button>',
				),
					'<div id="product_added_to_cart"></div>'
			);
			$html .= HTMLHelper::_(
				'bootstrap.renderModal',
				'cartajaxWishlistModal',
				array(
					'modal-dialog-scrollable' => true,
					'title'  => \JText::_('JSHOP_ADDED_TO_WISHLIST'),
					'footer' => '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">'.\JText::_('JSHOP_BACK_TO_SHOP').'</button>
								<button type="button" class="btn btn-primary" onclick="document.location=\''.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=wishlist&task=view',1,1).'\'">'.\JText::_('JSHOP_GO_TO_WISHLIST').'</button>',
				),
					'<div id="product_added_to_cart"></div>'
			);
		}
		return $html;
	}
	
    protected function _includeScripts() {
        if (!isset($this->scripts_included)) {
            $document = \JFactory::getDocument();
            $show_popup_message = $this->params->get('show_popup_message', 0);
            $jshopConfig = \JSFactory::getConfig();
            if ($document->getType() == 'html') {
				$ca_js_config = [
					'decimal_count' => $jshopConfig->decimal_count,
					'decimal_symbol' => $jshopConfig->decimal_symbol,
					'currency_code' => $jshopConfig->currency_code,
					'noimage' => $jshopConfig->noimage,
				];
                CartAjaxHelper::includeCommonCode();
                $document->addCustomTag("<script type='text/javascript'>
                                            var cartajax = cartajax || {};
                                            var cartajax_html = '" . \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cartajax', 1, 1) . "';
                                            var cartajax_added_product_id = null;
                                            cartajax.translate_not_available = " . json_encode(\JText::_('JSHOP_PRODUCT_NOT_AVAILABLE_THIS_OPTION')) . ";
                                            cartajax.old_price_description = " . ($jshopConfig->product_list_show_price_description ? json_encode(\JText::_('JSHOP_OLD_PRICE')) : "''") . ";
                                            cartajax.show_product_in_cart_message = " . $this->params->get('show_product_in_cart_message', 0) . ";                                            
                                            cartajax.show_popup_message = " . $show_popup_message . ";
											cartajax.show_popup_message_back_close = ".(int)$this->params->get('show_popup_message_back_close').";
                                            cartajax.config_add_to_wishlist = ".(int)$this->params->get('add_to_wishlist').";
                                            cartajax.jshopConfig = ".json_encode($ca_js_config).";
                                         </script>");
                $document->addCustomTag('<script type="text/javascript" src="'.JURI::base().'plugins/jshoppingproducts/cartajax/cartajax_plugin.js"></script>');
            }
            $this->scripts_included = true;
        }
    }

    function _getProductsInCart() {
        $cart = \JSFactory::getModel('cart', 'jshop');
        $cart->load();
        $products_in_cart = array();
        if (count($cart->products) > 0) {
            foreach ($cart->products as $v) {
                $products_in_cart[$v['product_id']] = $v['product_id'];
            }
        }
        return $products_in_cart;
    }

    function onBeforeDisplayProduct(&$product, &$view, &$product_images, &$product_videos, &$product_demofiles) {
		if (!$this->checkLicKey()){
			\JSError::raiseWarning('', 'Please enter license key (CartAjax)');
			return;
		}
        $this->_includeScripts();
        if ($this->params->get('show_product_in_cart_message', 0)) {
            $products_in_cart = $this->_getProductsInCart();
            $style = ' style="display: none"';
            if (in_array($product->product_id, $products_in_cart)) {
                $style = '';
            }
            if (!isset($view->_tmp_product_html_before_buttons))
                $view->_tmp_product_html_before_buttons = '';
            $view->_tmp_product_html_before_buttons .= '<span' . $style . ' class="product_in_cart red" id="product_in_cart_' . $product->product_id . '">' . \JText::_('JSHOP_ADDED_TO_CART') . '<br/></span>';
        }
		$view->_tmp_product_html_start .= $this->getHtmlModal();
    }

    function onBeforeDisplayProductList(&$products) {
        $config = \JSFactory::getConfig();
        $show_quant_in_list_prod = $this->params->get('show_quant_in_list_prod', 1);
		if (!$this->checkLicKey()){
			\JSError::raiseWarning('', 'Please enter license key (CartAjax)');
			return;
		}
        \JSFactory::loadJsFiles();
        $this->_includeScripts();
		
		$cart_msg_position_prod_list = $this->params->get('cart_msg_position_prod_list', '_tmp_var_top_buttons');
		$qty_position_prod_list = $this->params->get('qty_position_prod_list', '_tmp_var_top_buttons');
		
        if (count($products) > 0) {
            if ($this->params->get('show_product_in_cart_message', 0)) {
                $products_in_cart = $this->_getProductsInCart();				
                foreach ($products as $key => $product) {
                    $style = ' style="display: none"';
                    if (in_array($product->product_id, $products_in_cart)) {
                        $style = '';
                    }
                    $products[$key]->$cart_msg_position_prod_list .= '<span' . $style . ' class="product_in_cart red" id="product_in_cart_' . $product->product_id . '">' . \JText::_('JSHOP_ADDED_TO_CART') . '<br/></span>';
                }
            }

			$jinput = \JFactory::getApplication()->input;            
            $controller = $jinput->get("controller");
            if (!$controller) $controller = $jinput->get("view");

            if ($controller !== 'product') {
                $i = 0;
                foreach ($products as $key => $product) {
                    if ($i==0) {
                        $products[$key]->_tmp_var_start .= $this->getHtmlModal();
                    }
                    $i++;
                }
            }

            $minqty = $config->min_count_order_one_product;
            if ($minqty < 1)
                $minqty = 1;

            $listminqty = array();
            //addon_min_max_quantity_product
            if (file_exists(JPATH_ROOT . "/plugins/jshoppingproducts/addon_min_max_quantity_product/addon_min_max_quantity_product.php")) {
                $db = \JFactory::getDBO();
                $pids = array();
                foreach ($products as $key => $product) {
                    $pids[] = $product->product_id;
                }
                if (count($pids)) {
                    $query = "select product_id, min_count_product from #__jshopping_products where product_id in (" . implode(',', $pids) . ") ";
                    $db->setQuery($query);
                    $_rows = $db->loadObjectList();
                    foreach ($_rows as $v) {
                        $listminqty[$v->product_id] = $v->min_count_product;
                    }
                }
            }
            
            $instaddon_quantity_select_pview = 0;
            if (file_exists(JPATH_ROOT.'/plugins/jshoppingproducts/quantity_select_pview') && \JPluginHelper::isEnabled('jshoppingproducts', 'quantity_select_pview')){
                $instaddon_quantity_select_pview = 1;
            }

            $addon_quantity_controls = $this->getQuantityControlInList();
            
            foreach($products as $key => $product){                
                if ($instaddon_quantity_select_pview){
                    $productObject = \JSFactory::getTable('product', 'jshop');
                    $productObject->load($product->product_id);
                    $attributesDatas = $productObject->getAttributesDatas();
                    $productObject->setAttributeActive($attributesDatas['attributeActive']);
                    $this->_setStrToQuantity($productObject);
                    $attrQ = array();
                    $show = ' style="display:none;"';
                    if ($this->aQuantity !== null) {
                        $attrQ = $this->aQuantity;
                        $show = '';
                    }
                }
				
                if ($product->buy_link || (isset($product->to_order) && $product->to_order) ){
                    if (isset($listminqty[$product->product_id]) && $listminqty[$product->product_id]) {
                        $value = $listminqty[$product->product_id];
                    } else {
                        $value = $minqty;
                    }
                    if ($show_quant_in_list_prod) {
                        if ($instaddon_quantity_select_pview && count($attrQ)){
                            $products[$key]->$qty_position_prod_list .= '<span class="ca_qty_input">'.\JHTML::_('select.genericlist', $attrQ, 'quantity', 'class="inputbox"' . $show, 'attr_addon_quantity_select', 'name', $value,'addon_quantity_select').'</span>';
                        } elseif($addon_quantity_controls) {
                            $products[$key]->$qty_position_prod_list .= 
                            '<span class="quantityControlsListProduct">
                                <input class="quantity-minus" type="button" onclick="quantityNumber(-1, this);" value="-" />
                                <span class="ca_qty_input">
                                    <input type="text" class="quantityControls__input inputbox" name="quantity" value="'.$value.'">
                                </span>
                                <input class="quantity-plus" type="button" onclick="quantityNumber(1, this);" value="+" />
                            </span>';
                        } else {
                            $products[$key]->$qty_position_prod_list .= ' 
                            <span class="block_quantity">
                            <input class="quantity-minus" type="button" value="-" />
                                <span class="ca_qty_input">
                            <input type="text" size="2" value="' . $value . '" name="quantity" class="input-mini" /></span>
                                <input class="quantity-plus" type="button" value="+" /></span>';
                        }
                    } else {
                        $products[$key]->$qty_position_prod_list .= '<input type="hidden" value="' . $value . '" name="quantity" />';
                    }
                    
                }
                $products[$key]->$qty_position_prod_list .= '<input type="hidden" value="' . $product->product_id . '" name="product_id" />';
            }            
        }
    }

    private function getQuantityControlInList() {
        $addon_quantity_controls = JPluginHelper::isEnabled('jshoppingproducts', 'quantity_controls');
        if ($addon_quantity_controls) {
            $plugin = JPluginHelper::getPlugin('jshoppingproducts', 'quantity_controls');
            $addon_quantity_params = new JRegistry($plugin->params);
            $addon_quantity_controls = $addon_quantity_params->get('show_on_product_list', 0);
        }
        return $addon_quantity_controls;
    }

    public function onBeforeDisplayAjaxAttribCart(&$rows, &$product){
		$this->_setStrToQuantity($product);
		if($this->aQuantity !== null and count($this->aQuantity) > 0){
			$html = '';
			$qty = \JFactory::getApplication()->input->getVar('qty',1);
			foreach($this->aQuantity as $k=>$v){
				$selected = $k == $qty ? ' selected="selected"' : '';
				$html .= '<option value="'.$k.'"'.$selected.'>'.$v.'</option>';
			}
                        
			$rows->addon_quantity_select_options_html = $html;
		}		
	}
	
	function checkLicKey(){
        if (file_exists(JPATH_SITE.'/plugins/system/tmpl_gray/tmpl_gray.php')) {
            return 1;
        } else {
            //return \JSHelper::compareX64(\JSHelper::replaceWWW(\JSHelper::getJHost()."addon_cartajax"), \JSHelper::getLicenseKeyAddon('addon_cartajax'));
            return 1;
        }
	}

    protected function _setStrToQuantity($product) {

        $this->aQuantity = null;
        if (!empty($product->attribute_active_data) and ! empty($product->attribute_active_data->attr_addon_quantity_select)) {
            $attrQ = self::correctStrSep($product->attribute_active_data->attr_addon_quantity_select);
            if (count($attrQ) > 0) {
                $this->aQuantity = $attrQ;
            }
        }        
        if ($this->aQuantity === null and ! empty($product->addon_quantity_select)) {
            $attrQ = self::correctStrSep($product->addon_quantity_select);
            if (count($attrQ) > 0) {
                $this->aQuantity = $attrQ;
            }
        }
    }

    public static function correctStrSep($str, $arr = true, $reg = '/[^0-9]/', $sep = ',') {
        $astr = explode($sep, $str);
        if (count($astr) > 0) {
            $a = array();
            foreach ($astr as $as) {
                $as = preg_replace($reg, '', $as);
                if ($as != '')
                    $a[$as] = $as;
            }
            return !$arr ? implode($sep, $a) : $a;
        }else {
            return !$arr ? '' : array();
        }
    }

}