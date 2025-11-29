<?php
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Language\Text;


defined('_JEXEC') or die('Restricted access');

include_once __DIR__.'/../../jshoppingproducts/cart_popup/helper.php';

class plgJshoppingCheckoutcart_Popup extends CMSPlugin{
        
    public function onBeforeDisplayWishlistView(&$view) {
        JshoppingCart_PopupHelper::includeScripts();
        foreach ($view->products as $key_id=>$prod) {
            $view->products[$key_id]['_ext_price_html'] .= '<input type="hidden" value="'.$key_id.'" name="wishlist_prod_number_id">';
        }
    }

}