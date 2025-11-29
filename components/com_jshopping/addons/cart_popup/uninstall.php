<?php
use Joomla\CMS\Factory;
use Joomla\CMS\Filesystem\Folder;
use Joomla\CMS\Filesystem\File;

defined('_JEXEC') or die('Restricted access');
$db = Factory::getDbo();

$db->setQuery("DELETE FROM `#__extensions` WHERE `element` = 'cart_popup' AND `folder` = 'jshoppingproducts' AND `type` = 'plugin'");
$db->execute();

$db->setQuery("DELETE FROM `#__extensions` WHERE `element` = 'cart_popup' AND `folder` = 'jshoppingcheckout' AND `type` = 'plugin'");
$db->execute();	


foreach(array(
    'components/com_jshopping/templates/addons/cart_popup/',		
    'plugins/jshoppingproducts/cart_popup/',
    'plugins/jshoppingcheckout/cart_popup/',
    'components/com_jshopping/addons/cart_popup/'
) as $folder){
    Folder::delete(JPATH_ROOT.'/'.$folder);
}
   

foreach(array(
    'components/com_jshopping/Controller/Cart_popupController.php',
    'components/com_jshopping/css/addons/cart_popup.css',
    'components/com_jshopping/js/addons/cart_popup.js'    
) as $file){
    File::delete(JPATH_ROOT.'/'.$file);
}
