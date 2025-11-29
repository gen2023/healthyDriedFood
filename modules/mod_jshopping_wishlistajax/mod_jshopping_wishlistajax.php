<?php
use Joomla\Component\Jshopping\Site\Helper\Error as JSError;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Plugin\PluginHelper;


if (!file_exists(JPATH_SITE.'/components/com_jshopping/bootstrap.php'))
	JSError::raiseError(500, "CartAjax module requires component \"joomshopping\"");
if (!file_exists(JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php'))
	JSError::raiseError(500, "CartAjax module requires JoomShopping addon 'cartajax'");

require_once JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php';
global $wishlist_module_scrips_loaded;
if (!isset($wishlist_module_scrips_loaded)) {
	JSFactory::loadJsFiles();
	JSFactory::loadLanguageFile();
	CartAjaxHelper::includeCommonCode();
    $addon = new AddonCore('cartajax');            
    $addon->loadCss('_wishlist');
    $addon->loadJs('_wishlist');
	$document = Factory::getDocument();	
	$document->addCustomTag('<script type="text/javascript">
								cartajax.empty_text_wishlist = '.json_encode(Text::_('JSHOP_WISHLIST_EMPTY')).';
								cartajax.showImage = '.$params->get("showImage", 1).';
								cartajax.showEan = '.$params->get("showEan", 1).';
								cartajax.const_product_quantity = "'.Text::_('JSHOP_QUANTITY').': ";
								cartajax.const_product_ean = "'.Text::_('JSHOP_EAN').': ";
								cartajax.const_product_price = "'.Text::_('JSHOP_PRICE').': ";
							 </script>');
	$wishlist_module_scrips_loaded = true;
}

$jshopConfig = JSFactory::getConfig();
$cart = JSFactory::getModel('cart', 'jshop');
$cart->load('cart');
$cart->setDisplayFreeAttributes();

$wishlist = JSFactory::getModel('cart', 'jshop')->init("wishlist", 1);
if (method_exists($wishlist, 'deleteUnpublishedProducts')) {
    $wishlist->deleteUnpublishedProducts();
}

$cart->cartAjaxHrefLink = new stdClass();
if ($params->get('showLinkToCart', 1)){
	$cart->cartAjaxHrefLink->link = Helper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=step2&'.($jshopConfig->shop_user_guest == 1 ? 'check_login=1' : ''), 1, 0, $jshopConfig->use_ssl);
	$cart->cartAjaxHrefLink->label = Text::_('JSHOP_CHECKOUT');
} else {
	$cart->cartAjaxHrefLink->link = Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view', 1, 0, $jshopConfig->use_ssl);
	$cart->cartAjaxHrefLink->label = Text::_('JSHOP_CART');
}
PluginHelper::importPlugin('jshoppingcheckout');
Factory::getApplication()->triggerEvent('onBeforeDisplayModWishlistAjax', array(&$wishlist));

require(ModuleHelper::getLayoutPath('mod_jshopping_wishlistajax', $params->get('layout', 'default')));