<?php
namespace Joomla\Component\Jshopping\Site\Controller;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Helper\Error as JSError;
use AddonCore;
/**
* @version      2.0.6 22.08.2012
* @author       MAXXmarketing GmbH
* @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
*/

defined( '_JEXEC' ) or die( 'Restricted access' );

class Cart_popupController extends BaseController{
   
    function display($cachable = false, $urlparams = false){
		$jshopConfig = JSFactory::getConfig();
        if ($jshopConfig->user_as_catalog || !Helper::getDisplayPriceShop()) return 0;
        header('Content-Type: text/html;charset=UTF-8');

        $cart = JSFactory::getModel('cart', 'jshop');
        $cart->load();
        $cart->addLinkToProducts(1);
        $cart->setDisplayFreeAttributes();

        $cartpreview = JSFactory::getModel('cartPreview', 'Site');
        $cartpreview->setCart($cart);
		$cartpreview->setCheckoutStep(0);

        PluginHelper::importPlugin('jshoppingcheckout');
        $dispatcher = Factory::getApplication();
        $dispatcher->triggerEvent('onBeforeDisplayCart', array(&$cart) );
        
        $addon = new AddonCore('cart_popup');
        $addon_params = $addon->getAddonParams();
        $addon_params['delete_all_products'] = $addon_params['delete_all_products'] ?? 0;
        $products = $cartpreview->getProductsPrepare($cartpreview->getProducts());

        $view = $addon->getView('default');
        $view->cart_popup = 1;
        $view->set('config', $jshopConfig);
        $view->set('products', $products);
        $view->set('summ', $cart->getPriceProducts());
        $view->set('image_product_path', $jshopConfig->image_product_live_path);
        $view->set('image_path', $jshopConfig->live_path);
        $view->set('no_image', 'noimage.gif');

        if ($jshopConfig->shop_user_guest==1){
            $view->set('href_checkout', Helper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=step2&check_login=1',1, 0, $jshopConfig->use_ssl));
        }else{
            $view->set('href_checkout', Helper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=step2',1, 0, $jshopConfig->use_ssl));
        }
        
        $tax_list = $cart->getTaxExt(0, 1);

        $show_percent_tax = 0;
        if (count($tax_list)>1 || $jshopConfig->show_tax_in_product) $show_percent_tax = 1;
        if ($jshopConfig->hide_tax) $show_percent_tax = 0;
        $hide_subtotal = 0;
        if (($jshopConfig->hide_tax || count($tax_list)==0) && !$cart->rabatt_summ) $hide_subtotal = 1;
        
        $view->set('discount', $cart->getDiscountShow());
        $view->set('free_discount', $cart->getFreeDiscount());
        $view->set('use_rabatt', $jshopConfig->use_rabatt_code);
        $view->set('tax_list', $cart->getTaxExt(0, 1));
        $view->set('fullsumm', $cart->getSum(0, 1));
        $view->set('show_percent_tax', $show_percent_tax);
        $view->set('hide_subtotal', $hide_subtotal);
        $view->set('weight', $cart->getWeightProducts());
        $view->set('shippinginfo', Helper::SEFLink('index.php?option=com_jshopping&controller=content&task=view&page=shipping',1));
        $view->addon_params = $addon_params;
        $view->_tmp_ext_html_cart_start = "";
        $view->_tmp_html_after_subtotal = "";
        $view->_tmp_html_after_total = "";
        $view->_tmp_ext_subtotal = "";
        $view->_tmp_html_before_buttons = "";
        $view->_tmp_html_after_buttons = "";
        $view->_tmp_ext_html_before_discount = "";
        $view->_tmp_ext_total = "";
        $view->_tmp_ext_discount_text = '';
        $view->_tmp_ext_discount = '';
        $dispatcher->triggerEvent('onBeforeDisplayCartView', array(&$view) );
        $view->display();
        die();
    }
    
    function error(){
        $message = Factory::getApplication()->input->getVar('message');
        $category_id = Factory::getApplication()->input->getVar('category_id');
        $product_id = Factory::getApplication()->input->getVar('product_id');
        JSError::raiseNotice('', $message);
        
        $this->setRedirect(Helper::SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id='.$category_id.'&product_id='.$product_id,1,1));
    }
}