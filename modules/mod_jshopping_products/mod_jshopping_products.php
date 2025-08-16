<?php
defined('_JEXEC') or die;

use Joomla\Database\DatabaseInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\Productlist\ListModel;
use Joomla\CMS\Pagination\Pagination;

if (!defined('JPATH_JOOMSHOPPING')) {
    define('JPATH_JOOMSHOPPING', JPATH_SITE . '/components/com_jshopping');
}

require_once JPATH_JOOMSHOPPING . '/bootstrap.php';

$app = Factory::getApplication();
$wa = $app->getDocument()->getWebAssetManager();

JSFactory::loadCssFiles();
JSFactory::loadLanguageFile();

$data['jshopConfig'] = JSFactory::getConfig();

$selectedType = $params->get('selected_type', 'select_type_all');
$categoryId = $params->get('categpry_id', 0);
$limit = (int) $params->get('cont_product', 10);
$sortField = $params->get('sort', 'product_id');
$orderDir = $params->get('ordering', 'asc');
$productIds = $params->get('product_ids', '');
$moduleclass_sfx = $params->get('moduleclass_sfx', '');
$excludeProductIds = $params->get('product_not_ids', '');
$excludeLabel = $params->get('product_id_label', '');
$use_swiper = (int) $params->get('use_swiper', 0);
$script_slider = $params->get('script_slider', '');
$show_in_stock = (int) $params->get('show_in_stock', 1);
$manufacturer_ids = $params->get('manufacturer_ids', '');
$use_inline_script = (int) $params->get('use_inline_script', 0);
$show_pagination = (int) $params->get('show_pagination', 0);
$moduleId = (int) $module->id;
$limitstart = (int) Factory::getApplication()->input->getInt("mod{$moduleId}_limitstart", 0);


$db = Factory::getContainer()->get(DatabaseInterface::class);
$query = $db->getQuery(true)
    ->select([
        'p.product_id',
        'COALESCE(SUM(oi.product_quantity), 0) AS sales_count',
    ])
    ->from($db->quoteName('#__jshopping_products', 'p'))
    ->leftJoin($db->quoteName('#__jshopping_order_item', 'oi') . ' ON oi.product_id = p.product_id')
    ->leftJoin($db->quoteName('#__jshopping_orders', 'o') . ' ON o.order_id = oi.order_id AND o.order_status = 6')
    ->where($db->quoteName('p.product_publish') . ' = 1');

if ($show_in_stock == 0 && $selectedType != 'list_by_product_id') {
    $query->where($db->quoteName('p.product_quantity') . ' > 0');
}

$query->group($db->quoteName('p.product_id'));

if (!empty($excludeProductIds) && $selectedType != 'list_by_product_id') {
    $excludeProductIds = array_filter(array_map('intval', explode(',', $excludeProductIds)));
    $query->where($db->quoteName('p.product_id') . ' NOT IN (' . implode(',', $excludeProductIds) . ')');
}

switch ($selectedType) {
    case 'list_product_randon':
        $query->order('RAND()');

        if (!empty($categoryId)) {
            $query->join('INNER', $db->quoteName('#__jshopping_products_to_categories', 'pc') . ' ON pc.product_id = p.product_id')
                ->where($db->quoteName('pc.category_id') . ' IN (' . implode(',', array_map('intval', (array) $categoryId)) . ')');
        }
        break;
    case 'list_popylar_order':
        $query->order('sales_count DESC');
        break;
    case 'list_popylar_view':
        $query->order($db->quoteName('p.hits') . ' DESC');
        break;
    case 'list_new':
        $query->order($db->quoteName('p.product_id') . ' DESC');
        break;
    case 'list_by_category':
        if (!empty($categoryId)) {
            $query->join('INNER', $db->quoteName('#__jshopping_products_to_categories', 'pc') . ' ON pc.product_id = p.product_id')
                ->where($db->quoteName('pc.category_id') . ' IN (' . implode(',', array_map('intval', $categoryId)) . ')');
        }
        break;
    case 'list_by_product_id':
        if (!empty($productIds)) {
            $query->where($db->quoteName('p.product_id') . ' IN (' . implode(',', array_map('intval', explode(',', $productIds))) . ')');
        }
        break;
    case 'list_product_label':
        if (!empty($excludeLabel)) {
            $query->where($db->quoteName('p.label_id') . ' IN (' . implode(',', array_map('intval', $excludeLabel)) . ')');
        }
        break;
    case 'list_product_manuf':
        if (!empty($manufacturer_ids)) {
            $query->where($db->quoteName('p.product_manufacturer_id') . ' IN (' . implode(',', array_map('intval', $manufacturer_ids)) . ')');
        }
        break;
}

$query->order($db->quoteName($sortField) . ' ' . strtoupper($orderDir));

$countQuery = clone $query;
$countQuery->clear('select')->clear('order')->clear('limit')->clear('group');
$countQuery->select('COUNT(DISTINCT p.product_id)');

if ($show_pagination) {
    $query->setLimit($limit, $limitstart);
} else {
    $query->setLimit($limit);
}

$db->setQuery($query);
$products = $db->loadObjectList();

$db->setQuery($countQuery);
$total = (int) $db->loadResult();

$pagination = new Pagination($total, $limitstart, $limit, "mod{$moduleId}_");
$data['pagination'] = $pagination;

$productIds = array_column($products, 'product_id');

/** @var ListModel $model */
$model = JSFactory::getModel('List', 'Site\\Productlist');
$app = Factory::getApplication();
if ($model) {
    $products = $model->getLoadProducts(['products' => $productIds]);
    $productOrder = array_flip($productIds);
    usort($products, function ($a, $b) use ($productOrder) {
        return $productOrder[$a->product_id] <=> $productOrder[$b->product_id];
    });

    if (!empty($products)) {
        $app->triggerEvent('onBeforeDisplayProductList', [&$products]);
        $view = new \stdClass();
        $view->rows = $products;
        $app->triggerEvent('onBeforeDisplayProductListView', [&$view, &$product]);
        $products = $view->rows;

        $data['products'] = $products;
        $data['noimage'] = $data['jshopConfig']->image_product_live_path . '/noimage.gif';
    }
}

if ($use_swiper == 1) {

    /** @var Joomla\CMS\WebAsset\WebAssetManager $wa */

    $wa->registerAndUseStyle('mod_slider_swiper_css', 'mod_jshopping_products/swiper.min.css', [], ['relative' => true]);
    $wa->registerAndUseScript('mod_slider_swiper_js', 'mod_jshopping_products/swiper.min.js', [], ['relative' => true, 'defer' => true]);
}

if ($use_inline_script == 1) {
    $wa->addInlineScript($script_slider);
}
extract($data);

require ModuleHelper::getLayoutPath('mod_jshopping_products', $params->get('layout', 'default'));
