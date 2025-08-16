<?php
defined('_JEXEC') or die();
$db = \JFactory::getDbo();

$addon = \JSFactory::getTable('addon', 'jshop');
$addon->unInstallJoomlaExtension('plugin', 'sortingorderby', 'jshoppingproducts');


$addon->deleteFolders(array(
	'components/com_jshopping/addons/sortingorderby/',
	'components/com_jshopping/css/addons/sortingorderby/',
	'components/com_jshopping/js/addons/sortingorderby/',
	'components/com_jshopping/templates/addons/sortingorderby/',
    'plugins/jshoppingproducts/sortingorderby/'
));