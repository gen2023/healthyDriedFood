<?php
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use JSFactory;

class PlgJshoppingCustomsearch extends CMSPlugin
{
public function onBeforeQueryGetProductList($task, &$adv_result, &$adv_from, &$adv_query, &$order_query, &$filters)
{
    // die('2222222222222222');

    $search = trim($filters['search'] ?? '');
    if ($search === '') {
        return;
    }

    $searchByName = (bool)$this->params->get('searchByName', 1);
    $searchByCode = (bool)$this->params->get('searchByCode', 1);

    if (!$searchByName && !$searchByCode) {
        return;
    }

    $db = Factory::getDbo();
    $search = $db->escape($search, true);
    $lang = \JSFactory::getLang();
    $nameField = 'prod.`' . $lang->get('name') . '`';

    $where = [];

    if ($searchByName) {
        $where[] = "LOWER($nameField) LIKE " . $db->quote('%' . strtolower($search) . '%');
    }

    if ($searchByCode) {
        $where[] = "LOWER(prod.`product_ean`) LIKE " . $db->quote('%' . strtolower($search) . '%');
    }

    if (!empty($where)) {
        $adv_query .= " AND (" . implode(" OR ", $where) . ")";
        $filters['search'] = ''; // отключаем базовый поиск
    }
}

    
}
