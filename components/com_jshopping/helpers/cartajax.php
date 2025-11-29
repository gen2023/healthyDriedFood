<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Jshopping\Site\Helper\Helper;

defined('_JEXEC') or die;
class CartAjaxHelper {

    static $common_included = false;

    static function includeCommonCode() {
        if (!self::$common_included) {
            $jshopConfig = JSFactory::getConfig();
            $document = Factory::getDocument();
            $app = Factory::getApplication();
            $controller = $app->input->get('controller');
            if (!$controller && $app->input->get('option') == 'com_jshopping') {
                $controller = $app->input->get('view');
            }
            $addon = new AddonCore('cartajax');
            $addon->loadCss();
            $addon->loadJs();
            $document->addCustomTag('<script type="text/javascript">
                                        jshop.currency_code = "'.$jshopConfig->currency_code.'";
                                        jshop.format_currency = "'.$jshopConfig->format_currency[$jshopConfig->currency_format].'";
                                        jshop.decimal_count = "'.$jshopConfig->decimal_count.'";
                                        jshop.decimal_symbol = "'.$jshopConfig->decimal_symbol.'";
                                        jshop.thousand_separator = "'.$jshopConfig->thousand_separator.'";
                                        </script>');
            $document->addCustomTag('<script type="text/javascript">
                                        var cartajax = cartajax || {};
                                        cartajax.base = "'.Uri::base().'";
                                        cartajax.add_base = "'.Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=add&ajax=1',1).'";
                                        cartajax.remove_base = "'.Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=delete&ajax=1',1).'";
                                        cartajax.remove_base_wishlist = "'.Helper::SEFLink('index.php?option=com_jshopping&controller=wishlist&task=delete&ajax=1',1).'";
                                        cartajax.reload_base = "'.Helper::SEFLink('index.php?option=com_jshopping&controller=cart&ajax=1&format=json',1 , 1).'";
                                        cartajax.controller = "'.$controller.'";
                                        cartajax.form_base = "'.Helper::SEFLink('index.php?option=com_jshopping&controller=cartajaxattributes&ajax=1',1).'";
                                        cartajax.buy_base = "'.Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=add',1).'";
                                        cartajax.compare_base = "'.Helper::SEFLink('index.php?option=com_jshopping&controller=addon_compare&task=add',1).'";
                                        cartajax.images_base = "'.$jshopConfig->image_product_live_path.'";
                                        cartajax.decimal_count = '.(int)$jshopConfig->decimal_count.';
                                        cartajax.decimal_symbol = "'.$jshopConfig->decimal_symbol.'";
                                        cartajax.thousand_separator = "'.$jshopConfig->thousand_separator.'";
                                        cartajax.freeattributes = '.json_encode(self::_getFreeAttributes()).';
                                        </script>');            
            self::$common_included = true;
        }
    }
    
    static function _getFreeAttributes(){
        $result = [];
        $model_attributes = JSFactory::getModel('cartajaxattributes', 'jshop');
        $free_attributes = $model_attributes->getAllFreeAttributes();
        if (count($free_attributes) > 0) {
            foreach($free_attributes as $attribute) {
                $result[$attribute->id] = $attribute->name;
            }
        }
        return $result;
    }
}