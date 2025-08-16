<?php

/**
 * @version      1.0.4
 * @author       Sofona
 * @copyright    Copyright (C) 2024 Sofona. All rights reserved.
 * @license      GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Filesystem\Folder;
use Joomla\CMS\Filesystem\File;

$element = 'mod_jshopping_searchajax';
$db = Factory::getDbo();

$query = $db->getQuery(true)
	->delete($db->quoteName('#__extensions'))
	->where($db->quoteName('element') . ' = ' . $db->quote($element))
	->where($db->quoteName('type') . ' = ' . $db->quote('module'));
$db->setQuery($query);
$db->execute();

$query = $db->getQuery(true)
	->select($db->quoteName('id'))
	->from($db->quoteName('#__modules'))
	->where($db->quoteName('module') . ' = ' . $db->quote($element));
$db->setQuery($query);
$moduleIds = $db->loadColumn();

if (!empty($moduleIds)) {
	$query = $db->getQuery(true)
		->delete($db->quoteName('#__modules_menu'))
		->where($db->quoteName('moduleid') . ' IN (' . implode(',', $moduleIds) . ')');
	$db->setQuery($query);
	$db->execute();

	$query = $db->getQuery(true)
		->delete($db->quoteName('#__modules'))
		->where($db->quoteName('id') . ' IN (' . implode(',', $moduleIds) . ')');
	$db->setQuery($query);
	$db->execute();
}

$folders = [
	'modules/' . $element . '/',
	'components/com_jshopping/addons/' . $element . '/',
	'components/com_jshopping/templates/addons/searchajax/',
	'components/com_jshopping/View/Searchajax/'
];

foreach ($folders as $folder) {
	Folder::delete(JPATH_ROOT . '/' . $folder);
}

$files = [
	'language/ru-RU/' . $element . '.ini',
	'language/ru-RU/' . $element . '.sys.ini',
	'language/en-GB/' . $element . '.ini',
	'language/en-GB/' . $element . '.sys.ini',	
	'language/uk-UA/' . $element . '.ini',
	'language/uk-UA/' . $element . '.sys.ini',	
	'components/com_jshopping/Controller/SearchajaxController.php',
	'components/com_jshopping/Model/Productlist/SearchajaxModel.php'
];

foreach ($files as $file) {
	File::delete(JPATH_ROOT . '/' . $file);
}