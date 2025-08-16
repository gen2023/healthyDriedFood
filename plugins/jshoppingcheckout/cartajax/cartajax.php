<?php
defined('_JEXEC') or die('');

require_once JPATH_SITE . '/components/com_jshopping/helpers/cartajax.php';

class plgJshoppingCheckoutCartajax extends JPlugin {
    public function __construct(&$subject, $config = array()){
        \JFactory::getLanguage()->load('com_jshopping.addon_cartajax', JPATH_ROOT);
        parent::__construct($subject, $config);  
    }

    public function onBeforeSaveNewProductToCart(&$cart, &$temp_product, &$product){
        $temp_product['product_link'] = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id='.$product->category_id.'&product_id='.$product->product_id, 1);
    }
}