<?php

if (!file_exists(JPATH_SITE.'/components/com_jshopping/bootstrap.php'))
	\JSError::raiseError(500, "CartAjax module requires component \"joomshopping\"");
if (!file_exists(JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php'))
	\JSError::raiseError(500, "CartAjax module requires JoomShopping addon 'cartajax'");

require_once JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php';
global $wishlist_module_scrips_loaded;
if (!isset($wishlist_module_scrips_loaded)) {
	JSFactory::loadJsFiles();
	JSFactory::loadLanguageFile();
	CartAjaxHelper::includeCommonCode();
	$document = JFactory::getDocument();
	$document->addCustomTag('<link rel="stylesheet" type="text/css" href="'.JURI::root().'modules/mod_jshopping_wishlistajax/wishlistajax.css" />');
	$document->addCustomTag('<script type="text/javascript" src="'.JURI::root().'modules/mod_jshopping_wishlistajax/wishlistajax.js"> </script>');
	$document->addCustomTag('<script type="text/javascript">
								cartajax.empty_text_wishlist = '.json_encode(\JText::_('JSHOP_WISHLIST_EMPTY')).';
								cartajax.showImage = '.$params->get("showImage", 1).';
								cartajax.showEan = '.$params->get("showEan", 1).';
								cartajax.const_product_quantity = "'.\JText::_('JSHOP_QUANTITY').': ";
								cartajax.const_product_ean = "'.\JText::_('JSHOP_EAN').': ";
								cartajax.const_product_price = "'.\JText::_('JSHOP_PRICE').': ";
							 </script>');
	$wishlist_module_scrips_loaded = true;
}

$jshopConfig = JSFactory::getConfig();
$cart = \JSFactory::getModel('cart', 'jshop');
$cart->load('cart');
$cart->setDisplayFreeAttributes();

$wishlist = JSFactory::getModel('cart', 'jshop')->init("wishlist", 1);

$cart->cartAjaxHrefLink = new stdClass();
if ($params->get('showLinkToCart', 1)){
	$cart->cartAjaxHrefLink->link = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=step2&'.($jshopConfig->shop_user_guest == 1 ? 'check_login=1' : ''), 1, 0, $jshopConfig->use_ssl);
	$cart->cartAjaxHrefLink->label = \JText::_('JSHOP_CHECKOUT');
} else {
	$cart->cartAjaxHrefLink->link = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view', 1, 0, $jshopConfig->use_ssl);
	$cart->cartAjaxHrefLink->label = \JText::_('JSHOP_CART');
}

require(JModuleHelper::getLayoutPath('mod_jshopping_wishlistajax', $params->get('layout', 'default')));