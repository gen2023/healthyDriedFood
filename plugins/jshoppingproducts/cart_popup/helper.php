<?php
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Uri\Uri;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

class JshoppingCart_PopupHelper{

    public static function includeScripts() {
        static $loaded = 0;
        if (!$loaded) {
            $addon = new AddonCore('cart_popup');
            $addon->loadCss();
            $addon->loadJs();
            
            $document = Factory::getApplication()->getDocument();
            $document->addScriptDeclaration('
                var cart_popup = cart_popup || {};
                cart_popup.href_add = "'. Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=add&ajax=1', 1, 1) .'";
                cart_popup.href_view = "'. Helper::SEFLink('index.php?option=com_jshopping&controller=cart_popup', 1, 1) .'";
                cart_popup.href_remove = "'. Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=delete&ajax=1', 1, 1) .'";
                cart_popup.href_clear_cart = "'. Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=clear&ajax=1', 1, 1) .'";
                cart_popup.href_refresh = "'. Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=refresh&ajax=1', 1, 1) .'";
                cart_popup.href_remove_to_cart = "'. Helper::SEFLink('index.php?option=com_jshopping&controller=wishlist&task=remove_to_cart&ajax=1', 1, 1) .'";
                cart_popup.href_discount = "'. Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=discountsave&ajax=1', 1, 1) .'";
                cart_popup.href_error_attr = "'.Helper::SEFLink('index.php?option=com_jshopping&controller=cart_popup&task=error&category_id=_cid_&product_id=_pid_&message=_msg_', 1, 1) . '";
                cart_popup.confirm_remove = "' . Text::_('JSHOP_CONFIRM_REMOVE') . '";
                var base_url = "' . Uri::base() . '";
            ');            

            $modalHTML = \Joomla\CMS\HTML\HTMLHelper::_(
                'bootstrap.renderModal',
                'cart_popup',
                array(
                    'modal-dialog-scrollable' => true,
                    'title'       => Text::_('JSHOP_CART'),
                    'backdrop'    => 'static',
                    'height'      => '400px',
                    'width'       => '800px',
                    'bodyHeight'  => 80,
                    'modalWidth'  => 80,
                ),
                '<div class="cart_popup_content"><div class="cart_popup_error"></div><div class="cart_popup_content_html"></div></div>'
            );

            $document->addCustomTag($modalHTML);
            $loaded = 1;
        }
    }
}