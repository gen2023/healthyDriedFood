<?php
defined('_JEXEC') or die;
class CartAjaxHelper {

    static $common_included = false;

    static function includeCommonCode() {
        if (!self::$common_included) {
            $jshopConfig = \JSFactory::getConfig();
            $document = \JFactory::getDocument();
            $document->addCustomTag('<link type="text/css" rel="stylesheet" href="'.JURI::base().'components/com_jshopping/css/cartajax.css" />');
            $document->addCustomTag('<script type="text/javascript">
                                        jshop.currency_code = "'.$jshopConfig->currency_code.'";
                                        jshop.format_currency = "'.$jshopConfig->format_currency[$jshopConfig->currency_format].'";
                                        jshop.decimal_count = "'.$jshopConfig->decimal_count.'";
                                        jshop.decimal_symbol = "'.$jshopConfig->decimal_symbol.'";
                                        jshop.thousand_separator = "'.$jshopConfig->thousand_separator.'";
                                        </script>');
            $document->addCustomTag('<script type="text/javascript">
                                        var cartajax = cartajax || {};
                                        cartajax.base = "'.JURI::base().'";
                                        cartajax.add_base = "'.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=add&ajax=1',1).'";
                                        cartajax.remove_base = "'.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=delete&ajax=1',1).'";
                                        cartajax.remove_base_wishlist = "'.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=wishlist&task=delete&ajax=1',1).'";
                                        cartajax.reload_base = "'.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&ajax=1&format=json',1 , 1).'";
                                        cartajax.controller = "'.\JFactory::getApplication()->input->get('controller').'";
                                        cartajax.form_base = "'.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=cartajaxattributes&ajax=1',1).'";
                                        cartajax.buy_base = "'.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=add',1).'";
                                        cartajax.compare_base = "'.\JSHelper::SEFLink('index.php?option=com_jshopping&controller=addon_compare&task=add',1).'";
                                        cartajax.images_base = "'.$jshopConfig->image_product_live_path.'";
                                        cartajax.decimal_count = '.(int)$jshopConfig->decimal_count.';
                                        cartajax.decimal_symbol = "'.$jshopConfig->decimal_symbol.'";
                                        cartajax.thousand_separator = "'.$jshopConfig->thousand_separator.'";
                                        cartajax.freeattributes = '.json_encode(self::_getFreeAttributes()).';
                                        </script>');
            $document->addCustomTag('<script type="text/javascript" src="'.JURI::base().'components/com_jshopping/js/cartajax.js"> </script>');
            self::$common_included = true;
        }
    }
    
    static function _getFreeAttributes(){
        $result = [];
        $model_attributes = \JSFactory::getModel('cartajaxattributes', 'jshop');
        $free_attributes = $model_attributes->getAllFreeAttributes();
        if (count($free_attributes) > 0) {
            foreach($free_attributes as $attribute) {
                $result[$attribute->id] = $attribute->name;
            }
        }
        return $result;
    }
}