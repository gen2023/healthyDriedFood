<?php
/**
 * @version      1.0.5
 * @author       Sofona
 * @copyright    Copyright (C) 2024 Sofona. All rights reserved.
 * @license      GNU/GPL
 */

 defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Component\Jshopping\Site\Helper\Error as JSError;

if (!file_exists(JPATH_SITE . '/components/com_jshopping/bootstrap.php')) {
    JSError::raiseError(500, "Please install component \"joomshopping\"");
}
if (!defined('JPATH_JOOMSHOPPING')) {
    define('JPATH_JOOMSHOPPING', JPATH_SITE . '/components/com_jshopping');
}

$document = Factory::getDocument();
$document->addStyleSheet(JURI::root() . 'media/mod_jshopping_searchajax/css/style.css');
$document->addScript(JURI::root() . 'media/mod_jshopping_searchajax/js/script.js');

$ajax_search = $params->get('ajax_search', 0); 
$adv_search = $params->get('advanced_search');
$show_btn = $params->get('show_btn');
$btn_icon = $params->get('btn_icon');
$search_type = $params->get('search_type', 'any');
$uniqid = $module->id;

$class_sfx  = htmlspecialchars($params->get('moduleclass_name', ''), ENT_COMPAT, 'UTF-8');

$input = Factory::getApplication()->input;
$category_id = 0;

if ((int) $params->get('active_cur_cat')) {
    if (!$category_id) {
        $category_id = $input->getInt('category_id');
    }
}

if ($adv_search)
    $adv_search_link = Helper::SEFLink('index.php?option=com_jshopping&controller=search', 1);
$jinput = Factory::getApplication()->input;
$search = $jinput->getString('search', '');

require(ModuleHelper::getLayoutPath('mod_jshopping_searchajax'));
