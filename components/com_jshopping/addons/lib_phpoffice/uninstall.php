<?php
defined('_JEXEC') or die();
$db = \JFactory::getDbo();

$addon = \JSFactory::getTable('addon', 'jshop');

$addon->deleteFolders(array(
	'components/com_jshopping/addons/lib_phpoffice/',
	'components/com_jshopping/Lib/phpoffice/'
));
