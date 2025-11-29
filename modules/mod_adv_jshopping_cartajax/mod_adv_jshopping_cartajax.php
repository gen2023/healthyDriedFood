<?php
use Joomla\Component\Jshopping\Site\Helper\Error as JSError;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Plugin\PluginHelper;

if (!file_exists(JPATH_SITE.'/components/com_jshopping/bootstrap.php')) {
    JSError::raiseError(500, "CartAjax module requires component \"joomshopping\"");
}
if (!file_exists(JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php')) {
    JSError::raiseError(500, "CartAjax module requires JoomShopping addon 'cartajax'");
}
require_once JPATH_SITE.'/components/com_jshopping/bootstrap.php';
require_once JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php';    
JSFactory::loadExtLanguageFile('addon_cart_ajax');
$jshopConfig = JSFactory::getConfig();
$cart = JSFactory::getModel('cart', 'jshop');
$cart->load('cart');
$document = Factory::getDocument();

global $cartajax_adv_module_scrips_loaded;
if (!isset($cartajax_adv_module_scrips_loaded)) {
    $cartajax_adv_module_scrips_loaded = true;
    JSFactory::loadJsFiles();
    JSFactory::loadLanguageFile();
    $ca_js_config = [
        'decimal_count' => $jshopConfig->decimal_count,
        'decimal_symbol' => $jshopConfig->decimal_symbol,
        'currency_code' => $jshopConfig->currency_code,
        'noimage' => $jshopConfig->noimage,
    ];
    CartAjaxHelper::includeCommonCode();
    $addon = new AddonCore('cartajax');
    $addon->loadCss('_adv');
    $addon->loadJs('_adv');

    $document->addCustomTag('<script type="text/javascript">
                                cartajax.empty_cart_text = '.json_encode(Text::_('JSHOP_NO_PRODUCTS_CART')).';
                                cartajax.showImage = '.$params->get("showImage", 1).';
                                cartajax.delay = '.$params->get("delay", 3000).';
                                cartajax.showEan = '.$params->get("showEan", 1).';
                                cartajax.open_info = '.$params->get("open_info", 0).';
                                cartajax.const_product_quantity = "'.Text::_('JSHOP_QUANTITY').': ";
                                cartajax.const_product_ean = "'.Text::_('JSHOP_EAN').': ";
                                cartajax.const_product_price = "'.Text::_('JSHOP_PRICE').': ";
                                cartajax.const_show_products = "'.Text::_('_JSHOP_CART_AJAX_SHOW_PRODUCTS').'";
                                cartajax.const_hide_products = "'.Text::_('_JSHOP_CART_AJAX_HIDE_PRODUCTS').'";
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
    $cart->cartAjaxHrefLink->link = Helper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=step2&'.($jshopConfig->shop_user_guest == 1 ? 'check_login=1' : ''), 1, 0, $jshopConfig->use_ssl);
    $cart->cartAjaxHrefLink->label = Text::_('JSHOP_CHECKOUT');
} else {
    $cart->cartAjaxHrefLink->link = Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view', 1, 0, $jshopConfig->use_ssl);
    $cart->cartAjaxHrefLink->label = Text::_('JSHOP_CART');
}

$pluginType = 'jshoppingcheckout';
$pluginName = 'addon_return_attr_cart';
if (PluginHelper::isEnabled($pluginType, $pluginName)) {
    foreach($cart->products as $key => &$value) {
        if(!count($value['attributes_value']))continue;    
        $attr = array();
        foreach($value['attributes_value'] as $row){
            $attr[] = 'attr['.$row->attr_id.']='.$row->value_id;
        }    
        $value['product_link'] = Helper::SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id='.$value['category_id'].'&product_id='.$value['product_id']."&".implode('&',$attr), 1);
    }
}
PluginHelper::importPlugin('jshoppingcheckout');
Factory::getApplication()->triggerEvent('onBeforeDisplayModCartAjax', array(&$cart));

require(ModuleHelper::getLayoutPath('mod_adv_jshopping_cartajax', $params->get('layout', 'default')));