<?php
if (!file_exists(JPATH_SITE.'/components/com_jshopping/bootstrap.php')) {
    \JSError::raiseError(500, "CartAjax module requires component \"joomshopping\"");
}
if (!file_exists(JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php')) {
    \JSError::raiseError(500, "CartAjax module requires JoomShopping addon 'cartajax'");
}
require_once JPATH_SITE.'/components/com_jshopping/bootstrap.php';
require_once JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php';    
\JSFactory::loadExtLanguageFile('addon_cart_ajax');
$jshopConfig = \JSFactory::getConfig();
$cart = \JSFactory::getModel('cart', 'jshop');
$cart->load('cart');
$document = \JFactory::getDocument();

global $cartajax_adv_module_scrips_loaded;
if (!isset($cartajax_adv_module_scrips_loaded)) {
	if (file_exists(JPATH_ROOT."/modules/mod_adv_jshopping_cartajax/cartajax_adv_module_user.js")) {
		$document->addScript(JURI::base().'modules/mod_adv_jshopping_cartajax/cartajax_adv_module_user.js');
	} else {
		$document->addScript(JURI::base().'modules/mod_adv_jshopping_cartajax/cartajax_adv_module.js');
	}
    $cartajax_adv_module_scrips_loaded = true;
    \JSFactory::loadJsFiles();
    \JSFactory::loadLanguageFile();
    $ca_js_config = [
        'decimal_count' => $jshopConfig->decimal_count,
        'decimal_symbol' => $jshopConfig->decimal_symbol,
        'currency_code' => $jshopConfig->currency_code,
        'noimage' => $jshopConfig->noimage,
    ];
    CartAjaxHelper::includeCommonCode();
	
	if (file_exists(JPATH_ROOT."/modules/mod_adv_jshopping_cartajax/cartajax_adv_module_user.css")) {
		$document->addStyleSheet(JURI::base().'modules/mod_adv_jshopping_cartajax/cartajax_adv_module_user.css');
	} else {
		$document->addStyleSheet(JURI::base().'modules/mod_adv_jshopping_cartajax/cartajax_adv_module.css');
	}    
    $document->addCustomTag('<script type="text/javascript">
                                cartajax.empty_cart_text = '.json_encode(\JText::_('JSHOP_NO_PRODUCTS_CART')).';
                                cartajax.showImage = '.$params->get("showImage", 1).';
                                cartajax.delay = '.$params->get("delay", 3000).';
                                cartajax.showEan = '.$params->get("showEan", 1).';
                                cartajax.open_info = '.$params->get("open_info", 0).';
                                cartajax.const_product_quantity = "'.\JText::_('JSHOP_QUANTITY').': ";
                                cartajax.const_product_ean = "'.\JText::_('JSHOP_EAN').': ";
                                cartajax.const_product_price = "'.\JText::_('JSHOP_PRICE').': ";
                                cartajax.const_show_products = "'.\JText::_('_JSHOP_CART_AJAX_SHOW_PRODUCTS').'";
                                cartajax.const_hide_products = "'.\JText::_('_JSHOP_CART_AJAX_HIDE_PRODUCTS').'";
                                cartajax.count_products = ' . $cart->count_product . ';
                                cartajax.jshopConfig = '.json_encode($ca_js_config).';
                                </script>');
    $cartajax_module_scrips_loaded = true;
}
$document->addCustomTag('<script type="text/javascript">
                            if (jQuery.isArray(cartajax.advModules)){
                                cartajax.advModules.push("'.$module->id.'");
                            } else {
                                cartajax.advModules = new Array("'.$module->id.'");
                            }
                        </script>');

$cart->setDisplayFreeAttributes();
$cart->cartAjaxHrefLink = new stdClass();
if ($params->get('showLinkToCart', 1)){
    $cart->cartAjaxHrefLink->link = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=step2&'.($jshopConfig->shop_user_guest == 1 ? 'check_login=1' : ''), 1, 0, $jshopConfig->use_ssl);
    $cart->cartAjaxHrefLink->label = \JText::_('JSHOP_CHECKOUT');
} else {
    $cart->cartAjaxHrefLink->link = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view', 1, 0, $jshopConfig->use_ssl);
    $cart->cartAjaxHrefLink->label = \JText::_('JSHOP_CART');
}

require(JModuleHelper::getLayoutPath('mod_adv_jshopping_cartajax', $params->get('layout', 'default')));