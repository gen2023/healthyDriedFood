<?php
    
if (!file_exists(JPATH_SITE.'/components/com_jshopping/bootstrap.php'))
	\JSError::raiseError(500, "CartAjax module requires component \"joomshopping\"");
if (!file_exists(JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php'))
	\JSError::raiseError(500, "CartAjax module requires JoomShopping addon 'cartajax'");
require_once JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php';
require_once JPATH_SITE.'/components/com_jshopping/bootstrap.php';

global $cartajax_module_scrips_loaded;
$jshopConfig = \JSFactory::getConfig();
if (!isset($cartajax_module_scrips_loaded)) {
	\JSFactory::loadJsFiles();
	\JSFactory::loadLanguageFile();
	$ca_js_config = [
		'decimal_count' => $jshopConfig->decimal_count,
		'decimal_symbol' => $jshopConfig->decimal_symbol,
		'currency_code' => $jshopConfig->currency_code,
		'noimage' => $jshopConfig->noimage,
	];
	CartAjaxHelper::includeCommonCode();
	$document = \JFactory::getDocument();
	$document->addCustomTag('<link rel="stylesheet" type="text/css" href="'.JURI::base().'modules/mod_jshopping_cartajax/cartajax_module.css" />');
	$document->addCustomTag('<script type="text/javascript" src="'.JURI::base().'modules/mod_jshopping_cartajax/cartajax_module.js"> </script>');
	$document->addCustomTag('<script type="text/javascript">
								cartajax.empty_cart_text = '.json_encode(\JText::_('JSHOP_NO_PRODUCTS_CART')).';
								cartajax.showImage = '.$params->get("showImage", 1).';
								cartajax.showEan = '.$params->get("showEan", 1).';
								cartajax.const_product_quantity = "";
								cartajax.const_product_ean = "";
								cartajax.const_product_price = "";
								cartajax.jshopConfig = '.json_encode($ca_js_config).';
							 </script>');
	$cartajax_module_scrips_loaded = true;
}

$cart = \JSFactory::getModel('cart', 'jshop')->init('cart');
$cart->cartAjaxHrefLink = new stdClass();
if ($params->get('showLinkToCart', 1)){
	$cart->cartAjaxHrefLink->link = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=step2&'.($jshopConfig->shop_user_guest == 1 ? 'check_login=1' : ''), 1, 0, $jshopConfig->use_ssl);
	$cart->cartAjaxHrefLink->label = \JText::_('JSHOP_CHECKOUT');
} else {
	$cart->cartAjaxHrefLink->link = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view', 1, 0, $jshopConfig->use_ssl);
	$cart->cartAjaxHrefLink->label = \JText::_('JSHOP_CART');
}

if (file_exists(JPATH_ROOT.'/plugins/jshoppingproducts/cart_popup/helper.php') && \JPluginHelper::isEnabled('jshoppingproducts', 'cart_popup')){
    include_once JPATH_ROOT.'/plugins/jshoppingproducts/cart_popup/helper.php';
    JshoppingCart_PopupHelper::includeScripts();
    \JSFactory::loadCssFiles();
}

require(JModuleHelper::getLayoutPath('mod_jshopping_cartajax', $params->get('layout', 'default')));