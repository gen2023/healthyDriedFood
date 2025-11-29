<?php
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Helper\Helper;

defined('_JEXEC') or die('');

class plgJshoppingCheckoutCartajax extends CMSPlugin {
    public function __construct(&$subject, $config = array()){
        Factory::getLanguage()->load('com_jshopping.addon_cartajax', JPATH_ROOT);
        parent::__construct($subject, $config);  
    }

    public function onBeforeSaveNewProductToCart(&$cart, &$temp_product, &$product){
        $temp_product['product_link'] = Helper::SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id='.$product->category_id.'&product_id='.$product->product_id, 1);
    }
}