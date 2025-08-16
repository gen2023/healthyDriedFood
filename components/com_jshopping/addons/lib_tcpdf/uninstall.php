<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
defined('_JEXEC') or die();

$addon = JSFactory::getTable('addon', 'jshop');
$addon->deleteFolders(array(
	'components/com_jshopping/addons/lib_tcpdf/',
    'components/com_jshopping/Lib/tcpdf/',
));