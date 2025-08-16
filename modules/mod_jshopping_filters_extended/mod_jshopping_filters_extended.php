<?php
/**
* @version      5.22.0
* @author       MAXXmarketing GmbH
* @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
* @license      MAXXmarketing
*/
defined('_JEXEC') or die('Restricted access');

if (!file_exists(JPATH_SITE.'/components/com_jshopping/bootstrap.php')){
    \JSError::raiseError(500, "Please install component \"joomshopping\"");
}

require_once (JPATH_SITE.'/components/com_jshopping/bootstrap.php'); 
require_once dirname(__FILE__).'/helper.php';
require_once dirname(__FILE__).'/helper_items.php';
require_once dirname(__FILE__).'/inputs/core.php';
require_once dirname(__FILE__).'/cache.php';

\JSFactory::loadCssFiles();
\JSFactory::loadLanguageFile();
$jshopConfig = \JSFactory::getConfig();
$db = \JFactory::getDBO();
$mainframe = \JFactory::getApplication();
$dispatcher = \JFactory::getApplication();
$addon = new \AddonCore('filters_extended');
$addonParams = $addon->getAddonParams();

$show_manufacturers = $params->get('show_manufacturers');
$show_manufacturer_img = $params->get('show_manufacturer_img', 0);
$show_categorys = $params->get('show_categorys');  
$show_categorys_in_category = $params->get('show_categorys_in_category', 0);  
$show_category_img = $params->get('show_category_img', 0);
$show_dropdown_list = $params->get('show_dropdown_list');
$show_vendors = $params->get('show_vendors');         
$show_prices = $params->get('show_prices');
$show_prices_slider = $params->get('show_prices_slider');
$show_products_with_old_prices_enabled = $params->get('show_products_with_old_prices');
$show_products_with_free_shipping_enabled = $params->get('show_products_with_free_shipping');
$show_labels = $params->get('show_labels');
$show_labels_img = $params->get('show_labels_img', 0);
$show_characteristics = $params->get('show_characteristics');
$show_characteristics_title = $params->get('show_characteristics_title', 0);
$show_characteristics_group = $params->get('show_characteristics_group', 0);
$show_attribute_image = (array)$params->get('show_attribute_image');  
$show_attributes = $params->get('show_attributes');
$show_attributes_title = $params->get('show_attributes_title');
$show_quantity = $params->get('show_quantity'); 
$show_photo_filter = $params->get('show_photo_filter');   
$show_delivery_time = $params->get('show_delivery_time');
$show_review = $params->get('show_review');
$show_rating = $params->get('show_rating');
$show_search = $params->get('show_search');
$show_sets = $params->get('show_sets', 0);
if ($show_sets) {
    $addon_sets = (int)JPluginHelper::isEnabled('jshopping', 'sets');
    if (!$addon_sets) $show_sets = 0;
}
$show_attributes_id_checkbox = $params->get('attr_id_checkbox', []);
$show_attributes_id_select = $params->get('attr_id_select', []);
$show_attributes_id = array_unique(array_merge($show_attributes_id_checkbox, $show_attributes_id_select));
$show_characteristics_id_checkbox = $params->get('char_id_checkbox', []);
$show_characteristics_id_select = $params->get('char_id_select', []);
$display_unavailable_value = $params->get('display_unavailable_value');
$_filter_order = $params->get('filter_order');
$filter_order = explode(',',$_filter_order);
$show_horizontal = $params->get('show_horizontal');
$params_columns_count = $params->get('columns_count', 1);
$span = $show_horizontal ? ' sblock'.$params_columns_count : '';
$show_characteristics_button = $params->get('show_characteristics_button');
$show_price_button = $params->get('show_price_button');
$use_select_chosen = $params->get('use_select_chosen');
$use_select_chosen_multiple = $params->get('use_select_chosen_multiple');
$auto_submit = $params->get('auto_submit');
$ajax_view = $params->get('ajax_view', 0);
$show_on_all_pages = $params->get('show_on_all_pages', 0);
$show_text_ch_as_list = $params->get('show_text_ch_as_list', 0);
$show_filter_active = $params->get('show_filter_active', 0);
$build_url_filter = $params->get('build_url_filter', 0);
$dependent_characteristic = (int)JPluginHelper::isEnabled('jshopping', 'dependent_characteristics');
$get_filter_only_url = $params->get('get_filter_only_url', 0);
$use_cache = $params->get('cache', 0);
$button_to_open = $params->get('button_to_open', 0);
$disable_mod_for_controllers = $params->get('disable_mod_for_controllers', '');
if ($ajax_view) $get_filter_only_url = 0;

$cache = filterExtCache::getInstance();
$cache->setEnabled($use_cache);

if ($build_url_filter) {
    $form_method = 'get';
} else {
    $form_method = 'post';
}

$session = JFactory::getSession();
$display_fileters = 0;
$page_params = modJshopping_filters_extendedHelper::getPageParams();
$controller = $page_params['controller'];
$category_id = $page_params['category_id'];

if (modJshopping_filters_extendedHelper::disable_mod_for_controllers($page_params, $disable_mod_for_controllers)) {
    return '';
}

if ($category_id && ($addonParams['category_characteristics_settings'] ?? 0)) {
    $category = \JSFactory::getTable('Category');
    $category->load($category_id);

    $category_char_id_checkbox = empty($category->char_id_checkbox) ? [] : json_decode($category->char_id_checkbox, true);
	$category_char_id_select = empty($category->char_id_select) ? [] : json_decode($category->char_id_select, true);

    if (count($category_char_id_checkbox)) {
        $show_characteristics_id_checkbox = $category_char_id_checkbox;
    }
    
    if (count($category_char_id_select)) {
        $show_characteristics_id_select = $category_char_id_select;
    }
    $show_sets = $category->sets_filter ?? 0;
}

$show_characteristics_id = array_unique(array_merge($show_characteristics_id_checkbox, $show_characteristics_id_select));

$listActiveFilter = [];

if (modJshopping_filters_extendedHelper::thisPageCanUsefilter($page_params)) {
    $display_fileters = 1;
    $form_action = $_SERVER['REQUEST_URI'];
    if ($get_filter_only_url) {
        $form_action = modJshopping_filters_extendedHelper::getFormActionBase($controller);
    }
}

if ($show_on_all_pages) $display_fileters = 1;

if (!$display_fileters) return "";

if (!isset($form_action) || $show_categorys_in_category){
	$form_action = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=products', 1, 1);
}

$document = \JFactory::getDocument(); 
$document->addScript(\JURI::base()."modules/mod_jshopping_filters_extended/js/script.js");
if (file_exists(__DIR__.'/css/mod_jshopping_filters_user.css')) {
	$document->addStyleSheet(\JURI::base()."modules/mod_jshopping_filters_extended/css/mod_jshopping_filters_user.css");
} else {
	$document->addStyleSheet(\JURI::base()."modules/mod_jshopping_filters_extended/css/mod_jshopping_filters.css");
}
$document->addStyleSheet(\JURI::base()."modules/mod_jshopping_filters_extended/css/chosen.css");
$document->addScript(\JURI::base()."modules/mod_jshopping_filters_extended/js/chosen.jquery.js");
$document->addScript(\JURI::base()."modules/mod_jshopping_filters_extended/js/chosen.js");

$contextfilter = modJshopping_filters_extendedHelper::getContextFilter();
$filter_active = modJshopping_filters_extendedHelper::getFilterActive($get_filter_only_url, $contextfilter, 0);

if ($show_manufacturers && $controller != 'manufacturer'){
    $manufacturers = $filter_active['manufacturers'];
    $filter_manufactures = modJshopping_filters_extendedHelperItems::getManufacturers($page_params);
}

if ($show_categorys) {	    
    $filter_categorys = modJshopping_filters_extendedHelperItems::getCategorys($page_params, $show_categorys_in_category);
	$categorys = ($controller == 'category' && $category_id) ? array($category_id) : $filter_active['categorys'];
}

if ($show_vendors && $controller!="vendor"){    
    $vendors = $filter_active['vendors'];
    $filter_vendors = modJshopping_filters_extendedHelperItems::getVendors($page_params);
}

$fprice_from = $filter_active['price_from'];
$fprice_to = $filter_active['price_to'];

if (isset($page_params['data']['show_products_with_old_prices'])) {
	$show_products_with_old_prices_enabled = 0;
}
$show_products_with_old_prices = $filter_active['show_products_with_old_prices'];

if (isset($page_params['data']['show_products_with_free_shipping'])) {
	$show_products_with_free_shipping_enabled = 0;
}
$show_products_with_free_shipping = $filter_active['show_products_with_free_shipping'];

$prices_list = array();
for($i=1; $i<=10; $i++) {
    $prices_list[$i] = array($params->get('pricef'.$i), $params->get('pricet'.$i));
    if (!$prices_list[$i][0] && !$prices_list[$i][1]) unset($prices_list[$i]);
}
if ($show_prices_slider){
    $maxminPrices = modJshopping_filters_extendedHelperItems::getInProductsMaxMinPrice($page_params);
    if ($maxminPrices['count'] > 1){
        $document->addStyleSheet(JURI::base()."modules/mod_jshopping_filters_extended/css/jquery-ui-slider.css");
        $document->addScript(JURI::base()."modules/mod_jshopping_filters_extended/js/jquery-ui.min-slider.js");
        $min_price = $fprice_from ? $fprice_from : $maxminPrices['min_price'];
        $max_price = $fprice_to ? $fprice_to : $maxminPrices['max_price'];
    }
}

if ($show_characteristics){
    $characteristics = modJshopping_filters_extendedHelperItems::getCharacteristics($page_params, $show_characteristics_id, $show_text_ch_as_list);
    $extra_fields_active = $filter_active['extra_fields'];
    $extra_fields_t_active = $filter_active['extra_fields_t'];

    $dispatcher->triggerEvent('onAfterLoadCharacteristicModFilter',array(&$characteristics, &$extra_fields_active));
}

if ($show_labels){    
    $listLabels = modJshopping_filters_extendedHelperItems::getLabels($page_params);
    $labels_active = $filter_active['labels'];

}
    
if ($show_attributes){
    $listAttribut = modJshopping_filters_extendedHelperItems::getAttributs($page_params, $show_attributes_id);
    $attribut_active = $filter_active['attribut_active_value'];
}

if (isset($page_params['data']['quantity_filter'])) {
	$show_quantity = 0;
}
if ($show_quantity) {
    $listAvailability = modJshopping_filters_extendedHelperItems::getAvailability();
    $quantity_filter = $filter_active['quantity_filter'];
}  

if (isset($page_params['data']['photo_filter'])) {
	$show_photo_filter = 0;
}
if ($show_photo_filter) {
    $listPhoto = modJshopping_filters_extendedHelperItems::getPhoto();
    $photo_filter = $filter_active['photo_filter'];
}

if ($show_sets) {
    $listSets = modJshopping_filters_extendedHelperItems::getSets();
    $sets_filter = $filter_active['sets_filter'];
}

if (isset($page_params['data']['review_filter'])) {
	$show_review = 0;
}
if ($show_review) {
    $listReview = modJshopping_filters_extendedHelperItems::getReview();
    $review_filter = $filter_active['review_filter'];
}

if (isset($page_params['data']['rating_filter'])) {
	$show_rating = 0;
}
if ($show_rating) {
    $listRating = modJshopping_filters_extendedHelperItems::getRating();
    $rating_filter = $filter_active['rating_filter'];
}
     
if ($show_delivery_time) {
    $listDeliveryTimes = modJshopping_filters_extendedHelperItems::getDeliveryTimes($page_params);    
    $delivery_time_active = $filter_active['delivery_time_active'];
}

$inputCore = new InputsFiltersExtendedCore();
$inputCore->set('use_select_chosen', $use_select_chosen);
$inputCore->set('use_select_chosen_multiple', $use_select_chosen_multiple);

require(JModuleHelper::getLayoutPath('mod_jshopping_filters_extended', $params->get('layout', 'default')));