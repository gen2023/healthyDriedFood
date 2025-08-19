<?php
namespace Joomla\Component\Jshopping\Administrator\Model;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use Joomla\Component\Jshopping\Site\Helper\Helper;

class SofonareportsModel extends BaseDatabaseModel
{
  public function getAllClients()
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $query = $db->getQuery(true)
      ->select('u.user_id AS id, CONCAT(u.f_name, " ", u.l_name, " (", u.email, ")") AS name')
      ->from('#__jshopping_users AS u')
      ->order('u.f_name ASC');
    $db->setQuery($query);

    return $db->loadObjectList();
  }

  public function getAllBuyers($type = 'all')
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $query1 = $db->getQuery(true)
      ->select('u.user_id AS id, CONCAT(u.f_name, " ", u.l_name, " (", u.email, ")") AS name')
      ->from('#__jshopping_users AS u');

    $query2 = $db->getQuery(true)
      ->select('CONCAT("g_", MD5(CONCAT(o.email, o.phone, o.f_name, o.l_name))) AS id, CONCAT(o.f_name, " ", o.l_name, " (", o.email, ")") AS name')
      ->from('#__jshopping_orders AS o')
      ->where('(o.user_id < 1 OR o.user_id IS NULL)')
      ->group('o.f_name, o.l_name, o.email');


    if ($type === 'registered') {
      $query = $query1;
    } elseif ($type === 'guests') {
      $query = $query2;
    } else { // all
      $query = $db->getQuery(true)
        ->select('*')
        ->from('((' . $query1->__toString() . ') UNION (' . $query2->__toString() . ')) AS clients')
        ->order('name ASC');
    }

    if ($type !== 'all') {
      $query->order('name ASC');
    }

    $db->setQuery($query);

    return $db->loadObjectList();
  }

  public function getClientsReportCount($filter = [])
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $idExpression = "IF(o.user_id > 0, 
                        CAST(o.user_id AS CHAR), 
                        CONCAT('g_', MD5(CONCAT(o.email, o.phone, o.f_name, o.l_name)))
                      )";

    $query = $db->getQuery(true)
      ->select("COUNT(DISTINCT $idExpression)")
      ->from('#__jshopping_orders AS o')
      ->leftJoin('#__jshopping_users AS u ON u.user_id = o.user_id')
      ->where('o.order_status NOT IN (0, -1)');

    $query = $this->applyFilter($query, $filter);

    $db->setQuery($query);
    return (int) $db->loadResult();
  }

  public function getClientsReport($filter = [], $limitstart = 0, $limit = 20, $orderBy = 'total_sum', $orderDir = 'DESC')
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $idExpression = "IF(o.user_id > 0, 
                        CAST(o.user_id AS CHAR), 
                        CONCAT('g_', MD5(CONCAT(o.email, o.phone, o.f_name, o.l_name)))
                      )";

    if (!empty($filter['currency_id']) && (int) $filter['currency_id'] > 0) {
      $query = $db->getQuery(true)
        ->select("
                $idExpression AS user_id,
                IF(o.user_id > 0, CONCAT(u.f_name, ' ', u.l_name), CONCAT(o.f_name, ' ', o.l_name)) AS client_name,
                IF(o.user_id > 0, u.email, o.email) AS email,
                IF(o.user_id > 0, u.phone, o.phone) AS phone,
                COUNT(o.order_id) AS total_orders,
                ROUND(SUM(o.order_total / IF(o.currency_exchange = 0, 1, o.currency_exchange) * c.currency_value), 2) AS total_sum,
                MAX(o.order_date) AS last_order_date,
                MIN(o.order_date) AS first_order_date,
                c.currency_code AS currency_name
            ")
        ->from('#__jshopping_orders AS o')
        ->leftJoin('#__jshopping_users AS u ON u.user_id = o.user_id')
        ->leftJoin('#__jshopping_currencies AS c ON c.currency_id = ' . (int) $filter['currency_id'])
        ->where('o.order_status NOT IN (0, -1)');
    } else {
      $query = $db->getQuery(true)
        ->select("
                $idExpression AS user_id,
                IF(o.user_id > 0, CONCAT(u.f_name, ' ', u.l_name), CONCAT(o.f_name, ' ', o.l_name)) AS client_name,
                IF(o.user_id > 0, u.email, o.email) AS email,
                IF(o.user_id > 0, u.phone, o.phone) AS phone,
                COUNT(o.order_id) AS total_orders,
                ROUND(SUM(o.order_total / IF(o.currency_exchange = 0, 1, o.currency_exchange)), 2) AS total_sum,
                MAX(o.order_date) AS last_order_date,
                MIN(o.order_date) AS first_order_date,
                o.currency_code AS currency_name
            ")
        ->from('#__jshopping_orders AS o')
        ->leftJoin('#__jshopping_users AS u ON u.user_id = o.user_id')
        ->where('o.order_status NOT IN (0, -1)');
    }

    $query = $this->applyFilter($query, $filter);

    $query->group('user_id, client_name, email, phone');

    $allowedSort = ['client_name', 'email', 'phone', 'total_orders', 'total_sum', 'last_order_date', 'first_order_date', 'user_id'];
    if (!in_array($orderBy, $allowedSort)) {
      $orderBy = 'total_sum';
    }

    $query->order($orderBy . ' ' . $db->escape($orderDir));

    $db->setQuery($query, $limitstart, $limit);

    return $db->loadObjectList();
  }

  public function saveConfigsSettings($data)
  {
    $db = Factory::getContainer()->get('DatabaseDriver');
    $jshopConfig = JSFactory::getConfig();
    $jsonData = json_encode($data);

    $query = $db->getQuery(true)
      ->select('count(*)')
      ->from($db->quoteName('#__jshopping_configs'))
      ->where($db->quoteName('key') . ' = ' . $db->quote('report_columns'));

    $exists = $db->setQuery($query)->loadResult();

    if ($exists) {
      $query = $db->getQuery(true)
        ->update($db->quoteName('#__jshopping_configs'))
        ->set($db->quoteName('value') . ' = ' . $db->quote($jsonData))
        ->where($db->quoteName('key') . ' = ' . $db->quote('report_columns'));
    } else {
      $query = $db->getQuery(true)
        ->insert($db->quoteName('#__jshopping_configs'))
        ->columns(array($db->quoteName('key'), $db->quoteName('value')))
        ->values($db->quote('report_columns') . ',' . $db->quote($jsonData));
    }

    try {
      $db->setQuery($query)->execute();
      return true;
    } catch (\Exception $e) {
      Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
      return false;
    }
  }

  public function getConfigsSettings()
  {
    $db = Factory::getContainer()->get('DatabaseDriver');

    $query = $db->getQuery(true)
      ->select($db->quoteName('value'))
      ->from($db->quoteName('#__jshopping_configs'))
      ->where($db->quoteName('key') . ' = ' . $db->quote('report_columns'));

    try {
      $result = $db->setQuery($query)->loadResult();
      return $result ? json_decode($result, true) : [];
    } catch (\Exception $e) {
      Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
      return [];
    }
  }

  public function getProductsReportCount($filter = [], $mergeLang = true)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $query = $db->getQuery(true);

    if ($mergeLang) {
      $query->select('COUNT(DISTINCT oi.product_id)');
    } else {
      $query->select('COUNT(DISTINCT CONCAT(oi.product_id, "-", oi.product_name))');
    }

    $query->from('#__jshopping_order_item AS oi')
      ->innerJoin('#__jshopping_orders AS o ON oi.order_id = o.order_id')
      ->leftJoin('#__jshopping_products_to_categories AS pc ON pc.product_id = oi.product_id')
      ->where('o.order_status NOT IN (0, -1)');

    $query = $this->applyFilter($query, $filter);

    $db->setQuery($query);
    return (int) $db->loadResult();
  }

  public function getProductsReport($filter = [], $limitstart = 0, $limit = 20, $orderBy = 'total_sum', $orderDir = 'DESC', $mergeLang = true)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $langCode = Factory::getApplication()->getLanguage()->getTag();

    $productName = $mergeLang
      ? "COALESCE(p.`name_{$langCode}`, oi.product_name) AS product_name"
      : "oi.product_name";

    if (!empty($filter['currency_id']) && (int) $filter['currency_id'] > 0) {
      $query = $db->getQuery(true)
        ->select("
                oi.product_id,
                $productName,
                p.product_ean,
                p.hits,
                p.manufacturer_code,
                COUNT(DISTINCT oi.order_id) AS orders_count,
                SUM(oi.product_quantity) AS total_quantity,
                ROUND(SUM(oi.product_quantity * oi.product_item_price / 
                    IF(o.currency_exchange = 0, 1, o.currency_exchange) * c.currency_value
                ), 2) AS total_sum,
                c.currency_code AS currency_name
            ")
        ->from('#__jshopping_order_item AS oi')
        ->innerJoin('#__jshopping_orders AS o ON oi.order_id = o.order_id')
        ->leftJoin('(SELECT product_id, MIN(category_id) as category_id FROM #__jshopping_products_to_categories GROUP BY product_id) AS pc ON pc.product_id = oi.product_id')
        ->leftJoin('#__jshopping_products AS p ON p.product_id = oi.product_id')
        ->leftJoin('#__jshopping_currencies AS c ON c.currency_id = ' . (int) $filter['currency_id'])
        ->where('o.order_status NOT IN (0, -1)');
    } else {
      $query = $db->getQuery(true)
        ->select("
                oi.product_id,
                $productName,
                p.product_ean,
                p.hits,
                p.manufacturer_code,
                COUNT(DISTINCT oi.order_id) AS orders_count,
                SUM(oi.product_quantity) AS total_quantity,
                ROUND(SUM(oi.product_quantity * oi.product_item_price / 
                    IF(o.currency_exchange = 0, 1, o.currency_exchange)
                ), 2) AS total_sum,
                o.currency_code AS currency_name
            ")
        ->from('#__jshopping_order_item AS oi')
        ->innerJoin('#__jshopping_orders AS o ON oi.order_id = o.order_id')
        ->leftJoin('(SELECT product_id, MIN(category_id) as category_id FROM #__jshopping_products_to_categories GROUP BY product_id) AS pc ON pc.product_id = oi.product_id')
        ->leftJoin('#__jshopping_products AS p ON p.product_id = oi.product_id')
        ->where('o.order_status NOT IN (0, -1)');
    }

    $query = $this->applyFilter($query, $filter);

    if ($mergeLang) {
      $query->group('oi.product_id, p.product_ean, p.manufacturer_code, p.hits, currency_name');
    } else {
      $query->group('oi.product_id, oi.product_name, p.product_ean, p.manufacturer_code, p.hits, currency_name');
    }

    $allowedSort = [
      'total_quantity',
      'total_sum',
      'product_name',
      'orders_count',
      'product_id',
      'product_ean',
      'hits',
      'manufacturer_code'
    ];

    if (!in_array($orderBy, $allowedSort)) {
      $orderBy = 'total_sum';
    }

    $query->order($db->escape($orderBy) . ' ' . $db->escape($orderDir));

    $db->setQuery($query, $limitstart, $limit);
    return $db->loadObjectList();
  }

public function getCountAllOrders($filters)
{
    $db = Factory::getDBO();
    $conditions = $this->_getAllOrdersQueryForFilter($filters);

    if (!empty($filters['vendor_id'])) {
        $query = $db->getQuery(true)
            ->select('COUNT(DISTINCT O.order_id)')
            ->from($db->quoteName('#__jshopping_orders', 'O'))
            ->leftJoin($db->quoteName('#__jshopping_order_item', 'OI') . ' ON OI.order_id = O.order_id');
    } else {
        $query = $db->getQuery(true)
            ->select('COUNT(O.order_id)')
            ->from($db->quoteName('#__jshopping_orders', 'O'));
    }

    // Добавляем условия
    if (!empty($conditions)) {
        foreach ($conditions as $cond) {
            $query->where($cond);
        }
    }

    $db->setQuery($query);
    return (int) $db->loadResult();
}

public function getAllOrders($limitstart, $limit, $filters, $filter_order, $filter_order_Dir)
{
    $db = Factory::getDBO();
    $conditions = $this->_getAllOrdersQueryForFilter($filters);

    // Защищаем сортировку
    $order = $db->escape($filter_order) . ' ' . $db->escape($filter_order_Dir);

    $query = $db->getQuery(true);

    if (!empty($filters['vendor_id'])) {
        $query->select('DISTINCT O.*')
              ->from($db->quoteName('#__jshopping_orders', 'O'))
              ->leftJoin($db->quoteName('#__jshopping_order_item', 'OI') . ' ON OI.order_id = O.order_id');
    } else {
        $query->select('O.*, V.l_name AS v_name, V.f_name AS v_fname, CONCAT(O.f_name, " ", O.l_name) AS name')
              ->from($db->quoteName('#__jshopping_orders', 'O'))
              ->leftJoin($db->quoteName('#__jshopping_vendors', 'V') . ' ON V.id = O.vendor_id');
    }

    if (!empty($filters['currency_id']) && (int)$filters['currency_id'] > 0) {
        $subQuery = $db->getQuery(true)
            ->select('currency_code')
            ->from($db->quoteName('#__jshopping_currencies'))
            ->where('currency_id = ' . (int)$filters['currency_id']);

        $query->where('O.currency_code = (' . $subQuery . ')');
    }

    if (!empty($conditions)) {
        foreach ($conditions as $cond) {
            $query->where($cond);
        }
    }

    $query->order($order);

    $db->setQuery($query, $limitstart, $limit);

    return $db->loadObjectList();
}

protected function _getAllOrdersQueryForFilter($filters)
{
    $jshopConfig = JSFactory::getConfig();
    $db = Factory::getDBO();

    $conditions = [];

    if (!empty($filters['status_id'])) {
        $conditions[] = "O.order_status = " . $db->q($filters['status_id']);
    }

    if (!empty($filters['user_id'])) {
        if (strpos($filters['user_id'], 'g_') === 0) {
            $guestHash = substr($filters['user_id'], 2);
            $conditions[] = "MD5(CONCAT(O.email, O.phone, O.f_name, O.l_name)) = " . $db->quote($guestHash);
        } else {
            $conditions[] = "O.user_id = " . $db->q($filters['user_id']);
        }
    }

    if (!empty($filters['client_type'])) {
        if ($filters['client_type'] == 'registered') {
            $conditions[] = "O.user_id > 0";
        } elseif ($filters['client_type'] == 'guests') {
            $conditions[] = "O.user_id < 1";
        }
    }

    if (!empty($filters['text_search'])) {
        $search = $db->escape($filters['text_search']);
        $conditions[] = "(
            O.order_number LIKE '%" . $search . "%' OR
            O.f_name LIKE '%" . $search . "%' OR
            O.l_name LIKE '%" . $search . "%' OR
            CONCAT(O.f_name, ' ', O.l_name) LIKE '%" . $search . "%' OR
            O.email LIKE '%" . $search . "%' OR
            O.firma_name LIKE '%" . $search . "%' OR
            O.d_f_name LIKE '%" . $search . "%' OR
            O.d_l_name LIKE '%" . $search . "%' OR
            CONCAT(O.d_f_name, ' ', O.d_l_name) LIKE '%" . $search . "%' OR
            O.d_firma_name LIKE '%" . $search . "%' OR
            O.order_add_info LIKE '%" . $search . "%'
        )";
    }

    $filters['notfinished'] = $filters['notfinished'] ?? 0;
    if ($filters['notfinished'] == 2) {
        $conditions[] = "O.order_created = 0";
    } elseif ($filters['notfinished'] < 1) {
        $conditions[] = "O.order_created = 1";
    }

    if (!empty($filters['date_from'])) {
        $date = Helper::getJsDateDB($filters['date_from'], $jshopConfig->store_date_format);
        $conditions[] = 'O.order_date >= "' . $db->escape($date) . '"';
    }

    if (!empty($filters['date_to'])) {
        $date = Helper::getJsDateDB($filters['date_to'], $jshopConfig->store_date_format);
        $conditions[] = 'O.order_date <= "' . $db->escape($date) . ' 23:59:59"';
    }

    if (!empty($filters['payment_id'])) {
        $conditions[] = "O.payment_method_id = " . $db->q($filters['payment_id']);
    }

    if (!empty($filters['shipping_id'])) {
        $conditions[] = "O.shipping_method_id = " . $db->q($filters['shipping_id']);
    }

    if (!empty($filters['vendor_id'])) {
        $conditions[] = "OI.vendor_id = " . $db->q($filters['vendor_id']);
    }

    return $conditions;
}

  protected function applyFilter($query, $filter)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    // Фильтр по клиенту
    if (!empty($filter['client_id'])) {
      if (strpos($filter['client_id'], 'g_') === 0) {
        $guestHash = substr($filter['client_id'], 2);
        $query->where("MD5(CONCAT(o.email, o.phone, o.f_name, o.l_name)) = " . $db->quote($guestHash));
      } else {
        $query->where('o.user_id = ' . (int) $filter['client_id']);
      }
    }
    

    // Фильтры по датам
    if (!empty($filter['date_from'])) {
      $query->where('o.order_date >= ' . $db->quote($filter['date_from'] . ' 00:00:00'));
    }
    if (!empty($filter['date_to'])) {
      $query->where('o.order_date <= ' . $db->quote($filter['date_to'] . ' 23:59:59'));
    }

    if (!empty($filter['usergroup_id']) && (int) $filter['usergroup_id'] > 0) {
      $query->where('u.usergroup_id = ' . (int) $filter['usergroup_id']);
    }

    if (!empty($filter['client_type']) && $filter['client_type'] === 'registered') {
      $query->where('o.user_id > 0');
    }
    if (!empty($filter['client_type']) && $filter['client_type'] === 'guests') {
      $query->where('(o.user_id <= 0 OR o.user_id IS NULL)');
    }

    if (!empty($filter['statusOrder_id']) && is_array($filter['statusOrder_id'])) {
      if (!(count($filter['statusOrder_id']) === 1 && $filter['statusOrder_id'][0] === '0')) {
        $escapedStatuses = array_map(function ($status) use ($db) {
          return $db->quote((int) $status);
        }, $filter['statusOrder_id']);
        $query->where('o.order_status IN (' . implode(',', $escapedStatuses) . ')');
      }
    }

    if (!empty($filter['category_id']) && (int) $filter['category_id'] > 0) {
      $query->where('pc.category_id = ' . (int) $filter['category_id']);
    }

    return $query;
  }

}
