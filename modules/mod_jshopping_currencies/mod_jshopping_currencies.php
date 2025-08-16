<?php
/**
* @version      5.0.1 10.04.2022
* @author       MAXXmarketing GmbH
* @package      Jshopping
* @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
* @license      GNU/GPL
*/

defined('_JEXEC') or die('Restricted access');
error_reporting(error_reporting() & ~E_NOTICE);

if (!file_exists(JPATH_SITE.'/components/com_jshopping/bootstrap.php')){
    \JSError::raiseError(500, "Please install component \"joomshopping\"");
}

require_once (JPATH_SITE.'/components/com_jshopping/bootstrap.php');
\JSFactory::loadCssFiles();

$currency = \JSFactory::getTable('currency', 'jshop');
$currencies_list = $currency->getAllCurrencies('1');

$jshopConfig = \JSFactory::getConfig();
$jshopConfig->loadCurrencyValue();

$current_currency_id = $jshopConfig->cur_currency;
$current_currency_name = '';
$currencies_html = '';

foreach ($currencies_list as $cur) {
    $link = JRoute::_("index.php?option=com_jshopping&id_currency=".$cur->currency_id."&back=".urlencode($_SERVER['REQUEST_URI']));

    if ($cur->currency_id == $current_currency_id) {
        $current_currency_name = $cur->currency_name;
    } else {
    $currencies_html .= '<div class="item"><a href="'.$link.'">'.$cur->currency_name.'</a></div>';
    }
}
require(JModuleHelper::getLayoutPath('mod_jshopping_currencies'));  

?>