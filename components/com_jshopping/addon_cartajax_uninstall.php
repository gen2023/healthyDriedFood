<?php
defined('_JEXEC') or die('Restricted access');
$db = \JFactory::getDbo();
$db->setQuery("DELETE FROM `#__extensions` WHERE element IN ('cartajax','cartajaxattributes','mod_jshopping_cartajax','mod_adv_jshopping_cartajax')");
$db->execute();
$db->setQuery("DELETE FROM `#__modules` WHERE module='mod_jshopping_cartajax'");
$db->execute();
$db->setQuery("DELETE FROM `#__modules` WHERE module='mod_adv_jshopping_cartajax'");
$db->execute();
$db->setQuery("DELETE FROM `#__modules` WHERE module='mod_jshopping_wishlistajax'");
$db->execute();
jimport('joomla.filesystem.folder');
foreach(array(
	'components/com_jshopping/templates/addons/cartajax/',	
	'modules/mod_jshopping_cartajax/',
	'modules/mod_jshopping_wishlistajax/',
	'modules/mod_adv_jshopping_cartajax/',
	'plugins/jshoppingproducts/cartajax/',
	'plugins/jshoppingcheckout/cartajax/',
	'plugins/jshoppingproducts/cartajaxattributes/',
) as $folder){\JFolder::delete(JPATH_ROOT."/".$folder);}
jimport('joomla.filesystem.file');
foreach(array(
	'components/com_jshopping/Controller/CartajaxController.php',
	'components/com_jshopping/Controller/CartajaxattributesController.php',
	'components/com_jshopping/css/cartajax.css',
	'components/com_jshopping/helpers/cartajax.php',
	'components/com_jshopping/images/cartajax-loading.gif',
	'components/com_jshopping/js/cartajax.js',
	'components/com_jshopping/Model/CartajaxattributesModel.php',
	'components/com_jshopping/addon_cartajax_uninstall.php',
	'language/en-GB/com_jshopping.addon_cartajax.ini',
	'language/de-DE/com_jshopping.addon_cartajax.ini',
	'language/ru-RU/com_jshopping.addon_cartajax.ini',
) as $file){\JFile::delete(JPATH_ROOT."/".$file);}