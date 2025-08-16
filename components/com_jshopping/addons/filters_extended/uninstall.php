<?php
defined('_JEXEC') or die('Restricted access');
$db = \JFactory::getDbo();

$name = "JoomShopping Plugin Filter extended";
$element = "filters_extended";

// delete plugin
$db->setQuery("DELETE FROM `#__extensions` WHERE element='".$element."' AND folder='jshoppingproducts'");
$db->execute();

$db->setQuery("DELETE FROM `#__extensions` WHERE element='".$element."' AND folder='jshoppingadmin'");
$db->execute();

$db->setQuery("DELETE FROM `#__extensions` WHERE element='".$element."' AND folder='jshoppingrouter'");
$db->execute();

// delete module
$mod = 'mod_jshopping_'.$element;
$db->setQuery("DELETE FROM `#__extensions` WHERE element='".$mod."' AND type='module'");
$db->execute();

$db->setQuery("select id from #__modules where module='".$mod."'");
if ($id_mod = $db->loadResult()){
	$db->setQuery("DELETE FROM `#__modules` WHERE id='".$id_mod."'");
	$db->execute();
	$db->setQuery("DELETE FROM `#__modules_menu` WHERE moduleid='".$id_mod."'");
	$db->execute();
}

// delete folder	
jimport('joomla.filesystem.folder');
foreach(array(
	'components/com_jshopping/addons/'.$element,
    '/modules/mod_jshopping_'.$element,
    '/plugins/jshoppingproducts/'.$element,
	'/plugins/jshoppingadmin/'.$element,
	'/plugins/jshoppingrouter/'.$element
    ) as $folder){
    \JFolder::delete(JPATH_ROOT.'/'.$folder);
}

// delete files
jimport('joomla.filesystem.file');
foreach(array(
	'language/de-DE/de-DE.mod_jshopping_'.$element.'.ini',
	'language/en-GB/en-GB.mod_jshopping_'.$element.'.ini',
	'language/ru-RU/ru-RU.mod_jshopping_'.$element.'.ini'
) as $file){
	\JFile::delete(JPATH_ROOT.'/'.$file);
}