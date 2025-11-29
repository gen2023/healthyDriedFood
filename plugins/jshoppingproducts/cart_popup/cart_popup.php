<?php
use Joomla\Component\Jshopping\Site\Helper\Error as JSError;
use Joomla\Component\Jshopping\Site\Helper\Helper;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die('Restricted access');

include_once __DIR__.'/helper.php';

class plgJshoppingProductscart_Popup extends CMSPlugin{
        
    public function onBeforeDisplayProduct() {
        if (!$this->checkLicKey()){
            JSError::raiseWarning('', 'Please enter license key (Cart Popup)');
            return 0;
        }
        JshoppingCart_PopupHelper::includeScripts();
    }
    
    public function onBeforeDisplayProductList(&$products) {
        JshoppingCart_PopupHelper::includeScripts();

        if (count($products) > 0){
            $addon = new AddonCore('cart_popup');
            $jshopConfig = JSFactory::getConfig();
            $params = $addon->getAddonParams();
            $params['prod_list_input_qty'] ??= 0;
            $minqty = $jshopConfig->min_count_order_one_product > 0 ? $jshopConfig->min_count_order_one_product : 1;
            foreach($products as $key => $product) {
                if ($product->product_quantity > 0 && $params['prod_list_input_qty']){
					$products[$key]->_tmp_var_top_buttons .= "<div class='cart_popup_quantity'>"
                        .Text::_('JSHOP_QUANTITY').': <input type="text" size="2" value="'.$minqty.'" name="cart_popup_quantity">'
                    .'</div>';
				} else {
                    $products[$key]->_tmp_var_top_buttons .= '<input type="hidden" value="'.$minqty.'" name="cart_popup_quantity">';
                }
                $products[$key]->_tmp_var_top_buttons .= '<input type="hidden" value="'.$product->product_id.'" name="cart_popup_product_id" >';
                $products[$key]->_tmp_var_top_buttons .= '<input type="hidden" value="'.$product->category_id.'" name="cart_popup_category_id" >';
            }
        }
    }

	function checkLicKey(){
		return Helper::compareX64(Helper::replaceWWW(Helper::getJHost()."cart_popup"), Helper::getLicenseKeyAddon('cart_popup'));
	}
}