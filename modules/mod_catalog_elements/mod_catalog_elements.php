<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\Component\Jshopping\Site\Helper\Helper;

if (!defined('JPATH_JOOMSHOPPING')) {
    define('JPATH_JOOMSHOPPING', JPATH_SITE . '/components/com_jshopping');
}
require_once JPATH_JOOMSHOPPING . '/bootstrap.php';

$app = Factory::getApplication();
$wa = $app->getDocument()->getWebAssetManager();

JSFactory::loadCssFiles();
JSFactory::loadLanguageFile();

$jshopConfig = JSFactory::getConfig();
$lang = JSFactory::getLang();
$db = Factory::getDbo();

// Параметры
$sourceType = $params->get('selected_type', 'list_manufacturer');
$show_image = (int) $params->get('show_image', 1);
$sort = $params->get('sort', 'id');
$ordering = $params->get('ordering', 'asc');
$use_swiper = (int) $params->get('use_swiper', 0);
$script_slider = $params->get('script_slider', '');
$use_inline_script = (int) $params->get('use_inline_script', 0);
$moduleclass_sfx = $params->get('moduleclass_sfx', '');
$swiperclass_sfx = $params->get('swiperclass_sfx', '');
$show_name = (int) $params->get('show_name', 0);
$navegation_slider = (int) $params->get('navegation_slider', 0);
$all_menu = (int) $params->get('all_menu', 0);
$count_products = (int) $params->get('count_products', 0);

$list = [];

if ($sourceType === 'list_manufacturer') {
    $manufacturer_ids = $params->get('manufacturer_ids', '');
    $manufacturer_ids_exclude = $params->get('manufacturer_ids_exclude', '');

    $ids = is_array($manufacturer_ids) ? array_map('intval', $manufacturer_ids) : array_filter(array_map('intval', explode(',', $manufacturer_ids)));
    $exclude_ids = is_array($manufacturer_ids_exclude) ? array_map('intval', $manufacturer_ids_exclude) : array_filter(array_map('intval', explode(',', $manufacturer_ids_exclude)));

    switch ($sort) {
        case 'name':
            $orderby = 'm.`' . $lang->get('name') . '`';
            break;
        case 'random':
            $orderby = 'RAND()';
            break;
        case 'id':
        default:
            $orderby = 'm.`manufacturer_id`';
            break;
    }

    $query = $db->getQuery(true)
        ->select([
            'm.manufacturer_id AS id',
            'm.manufacturer_logo AS image',
            'm.manufacturer_publish',
            'm.`' . $lang->get('name') . '` AS name',
            // 'm.`' . $lang->get('description') . '` AS description',
            // 'm.`' . $lang->get('short_description') . '` AS short_description',
            'm.img_alt',
            'm.img_title',
            'COUNT(p.product_id) AS product_count'
        ])
        ->from('#__jshopping_manufacturers AS m')
        ->leftJoin('#__jshopping_products AS p ON p.product_manufacturer_id = m.manufacturer_id AND p.product_publish = 1')
        ->where('m.manufacturer_publish = 1');

    if (!empty($ids)) {
        $query->where('m.manufacturer_id IN (' . implode(',', $ids) . ')');
    }

    if (!empty($exclude_ids)) {
        $query->where('m.manufacturer_id NOT IN (' . implode(',', $exclude_ids) . ')');
    }

    $query->group('m.manufacturer_id');

    $query->order($orderby . ' ' . strtoupper($ordering));
    $db->setQuery($query);
    $list = $db->loadObjectList();

    foreach ($list as &$curr) {
        $imageFile = $jshopConfig->image_manufs_path . '/' . $curr->image;
        $noImageUrl = $jshopConfig->image_manufs_live_path . '/' . $jshopConfig->noimage;

        if ($show_image && !empty($curr->image) && file_exists($imageFile)) {
            $curr->imgSrc = $jshopConfig->image_manufs_live_path . '/' . $curr->image;
        } else {
            $curr->imgSrc = $noImageUrl;
        }

        $curr->img_alt = $curr->img_alt ?: $curr->name;
        $curr->img_title = $curr->img_title ?: $curr->name;
        $curr->link = Helper::SEFLink('index.php?option=com_jshopping&controller=manufacturer&task=view&manufacturer_id=' . (int) $curr->id);

    }
    unset($curr);
} elseif ($sourceType === 'list_category') {
    $category_ids = $params->get('category_ids', '');
    $category_ids_exclude = $params->get('category_ids_exclude', '');
    $first_level_category = (int) $params->get('first_level_category', 0);

    $ids = is_array($category_ids) ? array_map('intval', $category_ids) : array_filter(array_map('intval', explode(',', $category_ids)));
    $exclude_ids = is_array($category_ids_exclude) ? array_map('intval', $category_ids_exclude) : array_filter(array_map('intval', explode(',', $category_ids_exclude)));

    switch ($sort) {
        case 'name':
            $orderby = 'c.`' . $lang->get('name') . '`';
            break;
        case 'random':
            $orderby = 'RAND()';
            break;
        case 'id':
        default:
            $orderby = 'c.category_id';
            break;
    }

    $query = $db->getQuery(true)
        ->select([
            'c.category_id AS id',
            'c.category_parent_id AS parent_id',
            'c.category_publish',
            'c.category_image AS image',
            'c.`' . $lang->get('name') . '` AS name',
            'c.`' . $lang->get('description') . '` AS description',
            'c.`' . $lang->get('short_description') . '` AS short_description',
            'c.img_alt',
            'c.img_title',
            'COUNT(p.product_id) AS product_count'
        ])
        ->from('#__jshopping_categories AS c')
        ->leftJoin('#__jshopping_products_to_categories AS pc ON pc.category_id = c.category_id')
        ->leftJoin('#__jshopping_products AS p ON p.product_id = pc.product_id AND p.product_publish = 1')
        ->where('c.category_publish = 1');


    if (!$all_menu) {
        if (!$first_level_category && !empty($ids)) {
            $query->where('c.category_id IN (' . implode(',', $ids) . ')');
        }

        if ($first_level_category) {
            $query->where('c.category_parent_id = 0');
        }
    }

    if (!empty($exclude_ids)) {
        $query->where('c.category_id NOT IN (' . implode(',', $exclude_ids) . ')');
    }

    $query->group('c.category_id');
    
    $query->order($orderby . ' ' . strtoupper($ordering));
    $db->setQuery($query);
    $categories = $db->loadObjectList();

    // var_dump($categories);

    foreach ($categories as &$curr) {
        $imageFile = $jshopConfig->image_category_path . '/' . $curr->image;
        $noImageUrl = $jshopConfig->image_category_live_path . '/' . $jshopConfig->noimage;

        $curr->imgSrc = ($show_image && !empty($curr->image) && file_exists($imageFile))
            ? $jshopConfig->image_category_live_path . '/' . $curr->image
            : $noImageUrl;

        $curr->img_alt = $curr->img_alt ?: $curr->name;
        $curr->img_title = $curr->img_title ?: $curr->name;
        $curr->link = Helper::SEFLink('index.php?option=com_jshopping&controller=category&task=view&category_id=' . (int) $curr->id);
    }
    unset($curr);

    $list = $categories;

}

if ($use_swiper == 1) {
    if (!$wa->assetExists('style', 'swiper_css')) {
        $wa->registerStyle('swiper_css', 'mod_catalog_elements/swiper.min.css', [], ['relative' => true]);
    }
    $wa->useStyle('swiper_css');

    if (!$wa->assetExists('script', 'swiper_js')) {
        $wa->registerScript('swiper_js', 'mod_catalog_elements/swiper.min.js', [], ['relative' => true, 'defer' => true]);
    }
    $wa->useScript('swiper_js');
}

if ($use_inline_script == 1) {
    $wa->addInlineScript($script_slider);
}

require ModuleHelper::getLayoutPath('mod_catalog_elements', $params->get('layout', 'default'));
