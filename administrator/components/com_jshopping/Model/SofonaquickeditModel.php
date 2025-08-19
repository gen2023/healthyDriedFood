<?php
namespace Joomla\Component\Jshopping\Administrator\Model;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Database\DatabaseInterface;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;

defined('_JEXEC') or die;

class SofonaquickeditModel extends BaseadminModel
{
    public function getItems()
    {
        return [];
    }
    function getAllProducts($filter, $limitstart = null, $limit = null, $order = null, $orderDir = null, $options = array(), $lang = null)
    {
        $jshopConfig = JSFactory::getConfig();

        if (!$lang) {
            $lang = JSFactory::getLang();
        }

        $db = Factory::getContainer()->get(DatabaseInterface::class);
        if ($limit > 0) {
            $limit_query = " LIMIT " . $limitstart . ", " . $limit;
        } else {
            $limit_query = "";
        }
        $category_id = $filter['category_id'] ?? '';
        $where = $this->_getAllProductsQueryForFilter($filter);

        $show_cat_name_uniq = 0;
        $query_filed = "";
        $query_join = "";
        if ($jshopConfig->admin_show_vendors) {
            $query_filed .= ", pr.vendor_id, V.f_name as v_f_name, V.l_name as v_l_name";
            $query_join .= " left join `#__jshopping_vendors` as V on pr.vendor_id=V.id ";
        }

        $query_filed .= ", pr.manufacturer_code, pr.real_ean";

        if (($filter['text_search'] ?? '') && $jshopConfig->admin_products_search_in_attribute) {
            $query_join .= " left join `#__jshopping_products_attr` as PA on PA.product_id=pr.product_id ";
            $show_cat_name_uniq = 1;
        }

        Helper::disableOnlyFullGroupByMysql();

        $fields = [
            'pr.product_id',
            'pr.product_publish',
            "pr.`" . $lang->get('name') . "` as name",
            "pr.`" . $lang->get('short_description') . "` as short_description",
            "man.`" . $lang->get('name') . "` as man_name",
            "pr.`" . $lang->get('meta_title') . "` as meta_title",
            "pr.`" . $lang->get('meta_description') . "` as meta_description",
            "pr.`" . $lang->get('meta_keyword') . "` as meta_keyword",
            "pr.product_ean as ean",
            "pr.product_quantity as qty",
            "pr.image as image",
            "pr.product_price",
            "pr.product_old_price",
            "pr.currency_id",
            "pr.hits",
            "pr.unlimited",
            "pr.product_date_added",
            "pr.date_modify",
            "pr.label_id"
        ];
        if ($category_id) {
            $fields[] = 'pr_cat.product_ordering';
        } else {
            if ($show_cat_name_uniq) {
                $fields[] = "GROUP_CONCAT(Distinct cat.`" . $lang->get('name') . "` SEPARATOR '<br>') AS namescats";
            } else {
                $fields[] = "GROUP_CONCAT(cat.`" . $lang->get('name') . "` SEPARATOR '<br>') AS namescats";
            }
        }
        $query_select_fields = implode(', ', $fields);
        $query_select_fields .= $query_filed;

        $query = "SELECT " . $query_select_fields . " FROM `#__jshopping_products` AS pr
                LEFT JOIN `#__jshopping_products_to_categories` AS pr_cat ON pr_cat.product_id=pr.product_id
                LEFT JOIN `#__jshopping_categories` AS cat ON pr_cat.category_id=cat.category_id
                LEFT JOIN `#__jshopping_manufacturers` AS man ON pr.product_manufacturer_id=man.manufacturer_id
                $query_join
                WHERE pr.parent_id=0 " . $where . " 
                GROUP BY pr.product_id " .
            $this->_allProductsOrder($order, $orderDir, $category_id) . " " .
            $limit_query;

        $db->setQuery($query);
        $rows = $db->loadObjectList();

        if (isset($options['label_image']) && $options['label_image']) {
            $this->loadLablelImageForProductList($rows);
        }
        if (isset($options['vendor_name']) && $options['vendor_name']) {
            $this->loadVendorNameForProductList($rows);
        }
        return $rows;
    }
    function getCountAllProducts($filter)
    {
        $jshopConfig = JSFactory::getConfig();
        $db = Factory::getDBO();
        if (isset($filter['category_id']))
            $category_id = $filter['category_id'];
        else
            $category_id = '';

        $query_join = '';
        $where = $this->_getAllProductsQueryForFilter($filter);
        $query_select_fields = "count(pr.product_id)";
        if ($category_id) {
            $query_join .= " LEFT JOIN `#__jshopping_products_to_categories` AS pr_cat USING (product_id) ";
        }
        if (($filter['text_search'] ?? '') && $jshopConfig->admin_products_search_in_attribute) {
            $query_join .= " left join `#__jshopping_products_attr` as PA on PA.product_id=pr.product_id ";
            $query_select_fields = "count(distinct pr.product_id)";
        }

        $query = "SELECT " . $query_select_fields . " FROM `#__jshopping_products` AS pr
                  LEFT JOIN `#__jshopping_manufacturers` AS man ON pr.product_manufacturer_id=man.manufacturer_id
                  " . $query_join . "
                  WHERE pr.parent_id=0 " .
            $where;

        $db->setQuery($query);
        return $db->loadResult();
    }
    function _getAllProductsQueryForFilter($filter)
    {
        $jshopConfig = JSFactory::getConfig();
        $lang = JSFactory::getLang();
        $db = Factory::getDBO();
        $where = "";
        if (isset($filter['without_product_id']) && $filter['without_product_id']) {
            $where .= " AND pr.product_id <> " . $db->q($filter['without_product_id']) . " ";
        }
        if (isset($filter['category_id']) && $filter['category_id']) {
            $category_id = $filter['category_id'];
            if ($category_id > 0) {
                $where .= " AND pr_cat.category_id = " . $db->q($filter['category_id']) . " ";
            }
            if ($category_id == -9) {
                $where .= " AND pr_cat.category_id IS NULL ";
            }
        }
        if (isset($filter['text_search']) && $filter['text_search']) {
            $text_search = $filter['text_search'];
            $fields_search = [
                "LOWER(pr.`" . $lang->get('name') . "`)",
                "LOWER(pr.`" . $lang->get('short_description') . "`)",
                "LOWER(pr.`" . $lang->get('description') . "`)",
                "pr.product_ean",
                "pr.product_id",
                "pr.manufacturer_code",
                "pr.real_ean"
            ];
            if ($jshopConfig->admin_products_search_in_attribute) {
                $fields_search[] = 'PA.ean';
                $fields_search[] = 'PA.manufacturer_code';
                $fields_search[] = 'PA.real_ean';
            }
            if ($jshopConfig->admin_products_search_by_words == 0) {
                $word = addcslashes($db->escape($text_search), "_%");
                $tmp = [];
                foreach ($fields_search as $fn) {
                    $tmp[] = $fn . " LIKE '%" . $word . "%'" . "\n";
                }
                if ($jshopConfig->admin_products_search_by_prod_id_range && preg_match('/^(\d+)\-(\d+)$/', $text_search, $matches)) {
                    $tmp[] = "(pr.product_id>=" . intval($matches[1]) . " AND pr.product_id<=" . intval($matches[2]) . ")";
                }
                $where .= "AND (" . implode(' OR ', $tmp) . ")";
            } else {
                $words = explode(' ', $text_search);
                $search_conditions = [];
                foreach ($words as $word) {
                    $escaped_word = addcslashes($db->escape($word), "_%");
                    $tmp = [];
                    foreach ($fields_search as $fn) {
                        $tmp[] = $fn . " LIKE '%" . $escaped_word . "%'" . "\n";
                    }
                    if ($jshopConfig->admin_products_search_by_prod_id_range && preg_match('/^(\d+)\-(\d+)$/', $word, $matches)) {
                        $tmp[] = "(pr.product_id>=" . intval($matches[1]) . " AND pr.product_id<=" . intval($matches[2]) . ")";
                    }
                    $search_conditions[] = "\n(" . implode(' OR ', $tmp) . ")\n";
                }
                $where .= " AND (" . implode(" AND ", $search_conditions) . ") ";
            }
        }

        if (isset($filter['manufacturer_id'])) {
            $manufacturerId = (int) $filter['manufacturer_id'];

            if ($manufacturerId > 0) {
                $where .= " AND pr.product_manufacturer_id = " . $db->q($manufacturerId) . " ";
            } elseif ($manufacturerId === -1) {
                $where .= " AND (pr.product_manufacturer_id IS NULL OR pr.product_manufacturer_id = 0) ";
            }
        }

        if (isset($filter['label_id'])) {
            $label_id = (int) $filter['label_id'];

            if ($label_id > 0) {
                $where .= " AND pr.label_id = " . $db->q($label_id) . " ";
            } elseif ($label_id === -1) {
                $where .= " AND (pr.label_id IS NULL OR pr.label_id = 0) ";
            }
        }

        if (isset($filter['publish']) && $filter['publish']) {
            if ($filter['publish'] == 1)
                $_publish = 1;
            else
                $_publish = 0;
            $where .= " AND pr.product_publish = " . $db->q($_publish) . " ";
        }
        if (isset($filter['vendor_id']) && $filter['vendor_id'] >= 0) {
            $where .= " AND pr.vendor_id = " . $db->q($filter['vendor_id']) . " ";
        }
        if (isset($filter['currency_id']) && $filter['currency_id']) {
            $where .= " AND pr.currency_id = " . $db->q($filter['currency_id']) . " ";
        }

        extract(Helper::js_add_trigger(get_defined_vars(), "after"));
        return $where;
    }

    function _allProductsOrder($order = null, $orderDir = null, $category_id = 0)
    {
        if ($order && $orderDir) {
            $fields = array(
                "product_id" => "pr.product_id",
                "name" => "name",
                "category" => "namescats",
                "manufacturer" => "man_name",
                "vendor" => "v_f_name",
                "ean" => "ean",
                "qty" => "qty",
                "price" => "pr.product_price",
                "price_old" => "pr.product_old_price",
                "hits" => "pr.hits",
                "date" => "pr.product_date_added",
                "product_name_image" => "pr.image",
                "product_manufacturer_id" => "pr.product_manufacturer_id",
                "currency" => "pr.currency_id",
                "date_modify" => "pr.date_modify",
                "real_ean" => "pr.real_ean",
                "label_id" => "pr.label_id",
                "manufacturer_code" => "pr.manufacturer_code"
            );

            if ($category_id)
                $fields['ordering'] = "pr_cat.product_ordering";
            if (strtolower($orderDir) != "asc")
                $orderDir = "desc";
            if ($orderDir == "desc")
                $fields['qty'] = 'pr.unlimited desc, qty';
            if (!isset($fields[$order]) || !$fields[$order])
                return "";
            return "order by " . $fields[$order] . " " . $orderDir;
        } else {
            return "";
        }
    }

    protected function loadLablelImageForProductList(&$rows)
    {
        $jshopConfig = JSFactory::getConfig();
        foreach ($rows as $key => $v) {
            if ($rows[$key]->label_id) {
                $image = Helper::getNameImageLabel($rows[$key]->label_id);
                if ($image) {
                    $rows[$key]->_label_image = $jshopConfig->image_labels_live_path . "/" . $image;
                }
                $rows[$key]->_label_name = Helper::getNameImageLabel($rows[$key]->label_id, 2);
            }
        }
    }

    protected function loadVendorNameForProductList(&$rows)
    {
        $main_vendor = JSFactory::getTable('vendor');
        $main_vendor->loadMain();
        foreach ($rows as $k => $v) {
            if ($v->vendor_id) {
                $rows[$k]->vendor_name = $v->v_f_name . " " . $v->v_l_name;
            } else {
                $rows[$k]->vendor_name = $main_vendor->f_name . " " . $main_vendor->l_name;
            }
        }
    }

    public function getProductById($productId)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select('*')
            ->from('#__jshopping_products')
            ->where('product_id = ' . (int) $productId);
        $db->setQuery($query);
        return $db->loadObject();
    }

    public function updateFieldProduct($product)
    {

        $db = Factory::getContainer()->get(DatabaseInterface::class);

        if (empty($product->product_id)) {
            return false;
        }

        $query = $db->getQuery(true);

        $fields = [];

        foreach (get_object_vars($product) as $field => $value) {
            if ($field === 'product_id') {
                continue;
            }

            $fieldName = $db->quoteName($field);
            $fieldValue = $db->quote($value);
            $fields[] = "$fieldName = $fieldValue";
        }
        // var_dump($fields);die;

        if (empty($fields)) {
            return false;
        }

        $query->update($db->quoteName('#__jshopping_products'))
            ->set($fields)
            ->where($db->quoteName('product_id') . ' = ' . (int) $product->product_id);

        $db->setQuery($query);

        try {
            $db->execute();
            return true;
        } catch (Exception $e) {
            // Логируем ошибку или обработаем по необходимости
            return false;
        }
    }

    public function updateFieldProductAll($product, $mode = 'all')
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        $query = $db->getQuery(true);

        $fields = [];
        foreach (get_object_vars($product) as $field => $value) {
            $fieldName = $db->quoteName($field);
            $fieldValue = $db->quote($value);
            $fields[] = "$fieldName = $fieldValue";
        }

        $query->update($db->quoteName('#__jshopping_products'))
            ->set($fields);

        switch ($mode) {
            case 'all_published':
                $query->where($db->quoteName('product_publish') . ' = 1');
                break;

            case 'all_not_published':
                $query->where($db->quoteName('product_publish') . ' = 0');
                break;

            case 'all':
            default:
                break;
        }

        $db->setQuery($query);

        try {
            $db->execute();
            return $db->getAffectedRows();
        } catch (\Exception $e) {
            // Обработка ошибок
            return 0;
        }
    }

    public function getProductFieldValue($product_id, $field)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        $query = $db->getQuery(true)
            ->select($db->quoteName($field))
            ->from($db->quoteName('#__jshopping_products'))
            ->where($db->quoteName('product_id') . ' = ' . (int) $product_id);

        $db->setQuery($query);

        return $db->loadResult();
    }
    public function getProductIdsByMode($mode)
    {

        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select($db->quoteName('product_id'))
            ->from($db->quoteName('#__jshopping_products'));

        switch ($mode) {
            case 'all_published':
                $query->where($db->quoteName('product_publish') . ' = 1');
                break;
            case 'all_not_published':
                $query->where($db->quoteName('product_publish') . ' = 0');
                break;
            case 'all':
            default:
                // без условия
                break;
        }

        $db->setQuery($query);

        return $db->loadColumn();
    }

    function deleteList(array $cid, $msg = 1)
    {
        $products = JSFactory::getModel("products");
        return $products->deleteList($cid, $msg);
    }

    function publish(array $cid, $flag)
    {
        $products = JSFactory::getModel("products");
        $products->publish($cid, $flag);
    }

    public function updateCategorys($product_id, $category_ids)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        $db->setQuery('DELETE FROM #__jshopping_products_to_categories WHERE product_id = ' . $product_id);
        $db->execute();

        foreach ($category_ids as $cat_id) {
            $columns = ['product_id', 'category_id'];
            $values = [(int) $product_id, (int) $cat_id];

            $query = $db->getQuery(true)
                ->insert('#__jshopping_products_to_categories')
                ->columns($db->quoteName($columns))
                ->values(implode(',', $db->quote($values)));
            $db->setQuery($query);
            $db->execute();
        }
    }

    public function getProductCategories($product_id)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select('category_id')
            ->from('#__jshopping_products_to_categories')
            ->where('product_id = ' . (int) $product_id);
        $db->setQuery($query);
        return $db->loadColumn();

    }

    public function getCategoryNames($ids)
    {
        if (empty($ids))
            return [];

        $lang = JSFactory::getLang();
        $db = Factory::getDbo();

        $query = $db->getQuery(true)
            ->select($db->quoteName($lang->get('name')))
            ->from($db->quoteName('#__jshopping_categories'))
            ->where('category_id IN (' . implode(',', array_map('intval', $ids)) . ')');

        $db->setQuery($query);
        return $db->loadColumn();
    }


    public function getProductManufacturerId($product_id)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select($db->quoteName('product_manufacturer_id'))
            ->from($db->quoteName('#__jshopping_products'))
            ->where($db->quoteName('product_id') . ' = ' . (int) $product_id);
        $db->setQuery($query);
        return (int) $db->loadResult();
    }

    public function getAllProductIds()
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select('product_id')
            ->from('#__jshopping_products');
        $db->setQuery($query);
        return $db->loadColumn();
    }

    public function getAllProductIdsByPublish($published = 1)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select('product_id')
            ->from('#__jshopping_products')
            ->where('product_publish = ' . (int) $published);
        $db->setQuery($query);
        return $db->loadColumn();
    }

    public function getProductLabelId($product_id)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select($db->quoteName('label_id'))
            ->from($db->quoteName('#__jshopping_products'))
            ->where($db->quoteName('product_id') . ' = ' . (int) $product_id);
        $db->setQuery($query);
        return (int) $db->loadResult();
    }

    public function getAdditionPrices($product_id)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true);

        $query->select('prp.price_id, prp.product_id, prp.discount, prp.product_quantity_start, prp.product_quantity_finish, pr.product_price')
            ->from($db->quoteName('#__jshopping_products_prices', 'prp'))
            ->join('LEFT', $db->quoteName('#__jshopping_products', 'pr') . ' ON pr.product_id = prp.product_id')
            ->where('prp.product_id = ' . (int) $product_id)
            ->order('prp.price_id ASC');

        $db->setQuery($query);
        return $db->loadAssocList();
    }

    public function deleteAdditionPrice($id)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true);

        $conditions = ['price_id = ' . (int) $id];
        $query->delete($db->quoteName('#__jshopping_products_prices'))
            ->where($conditions);

        $db->setQuery($query);

        try {
            $db->execute();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function addAdditionPrice($productId, $quantityStart, $quantityFinish, $discount)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true);

        $columns = ['product_id', 'product_quantity_start', 'product_quantity_finish', 'discount'];
        $values = [
            $db->quote($productId),
            $db->quote($quantityStart),
            $db->quote($quantityFinish),
            $db->quote($discount)
        ];

        $query
            ->insert('#__jshopping_products_prices')
            ->columns($db->quoteName($columns))
            ->values(implode(',', $values));

        try {
            $db->setQuery($query)->execute();
            return true;
        } catch (Exception $e) {
            Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
            return false;
        }
    }

    public function saveConfigsSettings($data)
    {
        $db = Factory::getContainer()->get('DatabaseDriver');
        $jshopConfig = JSFactory::getConfig();
        $jsonData = json_encode($data);

        $query = $db->getQuery(true)
            ->select('count(*)')
            ->from($db->quoteName('#__jshopping_configs'))
            ->where($db->quoteName('key') . ' = ' . $db->quote('quickEdit_columns'));

        $exists = $db->setQuery($query)->loadResult();

        if ($exists) {
            $query = $db->getQuery(true)
                ->update($db->quoteName('#__jshopping_configs'))
                ->set($db->quoteName('value') . ' = ' . $db->quote($jsonData))
                ->where($db->quoteName('key') . ' = ' . $db->quote('quickEdit_columns'));
        } else {
            $query = $db->getQuery(true)
                ->insert($db->quoteName('#__jshopping_configs'))
                ->columns(array($db->quoteName('key'), $db->quoteName('value')))
                ->values($db->quote('quickEdit_columns') . ',' . $db->quote($jsonData));
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
            ->where($db->quoteName('key') . ' = ' . $db->quote('quickEdit_columns'));

        try {
            $result = $db->setQuery($query)->loadResult();
            return $result ? json_decode($result, true) : [];
        } catch (\Exception $e) {
            Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
            return [];
        }
    }

    public function getAllProductIdsByfilter()
    {
        $app = Factory::getApplication();
        $context = "jshoping.list.admin.product";
        $lang = JSFactory::getLang();
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $jshopConfig = JSFactory::getConfig();

        $selectedCurrency = $app->getUserStateFromRequest($context . 'currency_id', 'currency_id', 0, 'int');
        $category_id = $app->getUserStateFromRequest($context . 'category_id', 'category_id', 0, 'int');
        $manufacturer_id = $app->getUserStateFromRequest($context . 'manufacturer_id', 'manufacturer_id', 0, 'int');
        $label_id = $app->getUserStateFromRequest($context . 'label_id', 'label_id', 0, 'int');
        $product_publish = $app->getUserStateFromRequest($context . 'publish', 'publish', 0, 'int');
        $search = $app->getUserStateFromRequest($context . 'text_search', 'text_search', '');

        $query = $db->getQuery(true)
            ->select('p.product_id')
            ->from($db->quoteName('#__jshopping_products', 'p'));

        $conditions = [];

        if ($selectedCurrency) {
            $conditions[] = 'p.currency_id = ' . (int) $selectedCurrency;
        }

        if ($category_id) {
            $query->join('INNER', $db->quoteName('#__jshopping_products_to_categories') . ' AS pc ON pc.product_id = p.product_id');
            $conditions[] = 'pc.category_id = ' . (int) $category_id;
        }

        if (isset($manufacturer_id)) {
            if ((int) $manufacturer_id > 0) {
                $conditions[] = 'p.product_manufacturer_id = ' . (int) $manufacturer_id;
            } elseif ((int) $manufacturer_id === -1) {
                $conditions[] = '(p.product_manufacturer_id IS NULL OR p.product_manufacturer_id = 0)';
            }
        }

        if (isset($label_id)) {
            if ((int) $label_id > 0) {
                $conditions[] = 'p.label_id = ' . (int) $label_id;
            } elseif ((int) $label_id === -1) {
                $conditions[] = '(p.label_id IS NULL OR p.label_id = 0)';
            }
        }

        if ($product_publish && in_array($product_publish, [1, 2])) {
            $conditions[] = 'p.product_publish = ' . (($product_publish == 1) ? 1 : 0);
        }

        if (!empty($search)) {
            $fields_search = [
                "LOWER(p.`" . $lang->get('name') . "`)",
                "LOWER(p.`" . $lang->get('short_description') . "`)",
                "LOWER(p.`" . $lang->get('description') . "`)",
                "p.product_ean",
                "p.product_id",
                "p.manufacturer_code",
                "p.real_ean"
            ];

            // Добавим поиск по атрибутам, если включено
            if ($jshopConfig->admin_products_search_in_attribute) {
                $query->leftJoin('#__jshopping_products_attr AS PA ON PA.product_id = p.product_id');
                $fields_search[] = 'PA.ean';
                $fields_search[] = 'PA.manufacturer_code';
                $fields_search[] = 'PA.real_ean';
            }

            if ($jshopConfig->admin_products_search_by_words == 0) {
                $word = addcslashes($db->escape($search), "_%");
                $tmp = [];
                foreach ($fields_search as $fn) {
                    $tmp[] = $fn . " LIKE '%" . $word . "%'";
                }
                if ($jshopConfig->admin_products_search_by_prod_id_range && preg_match('/^(\d+)\-(\d+)$/', $search, $matches)) {
                    $tmp[] = "(p.product_id >= " . (int) $matches[1] . " AND p.product_id <= " . (int) $matches[2] . ")";
                }
                $conditions[] = "(" . implode(' OR ', $tmp) . ")";
            } else {
                $words = explode(' ', $search);
                $search_conditions = [];
                foreach ($words as $word) {
                    $escaped_word = addcslashes($db->escape($word), "_%");
                    $tmp = [];
                    foreach ($fields_search as $fn) {
                        $tmp[] = $fn . " LIKE '%" . $escaped_word . "%'";
                    }
                    if ($jshopConfig->admin_products_search_by_prod_id_range && preg_match('/^(\d+)\-(\d+)$/', $word, $matches)) {
                        $tmp[] = "(p.product_id >= " . (int) $matches[1] . " AND p.product_id <= " . (int) $matches[2] . ")";
                    }
                    $search_conditions[] = "(" . implode(' OR ', $tmp) . ")";
                }
                $conditions[] = "(" . implode(' AND ', $search_conditions) . ")";
            }
        }


        if (!empty($conditions)) {
            $query->where($conditions);
        }

        $db->setQuery($query);
        return $db->loadColumn();
    }
    public function getLogChanges($filters = [])
    {
        $db = Factory::getDbo();
        $query = $db->getQuery(true);

        $query->select('*')
            ->from($db->quoteName('#__sofonaquickedit_log'))
            ->order($db->quoteName('date_modify') . ' DESC');

        $db->setQuery($query);
        return $db->loadObjectList();
    }

    public function addLogChange($log)
    {
        $db = Factory::getDbo();
        $columns = [
            'product_id',
            'old_value',
            'new_value',
            'field',
            'info',
            'date_modify'
        ];

        $values = [
            $log->product_id,
            $log->old_value,
            $log->new_value,
            $log->field,
            $log->info,
            $log->date_modify,
        ];

        $query = $db->getQuery(true)
            ->insert($db->quoteName('#__sofonaquickedit_log'))
            ->columns(array_map([$db, 'quoteName'], $columns))
            ->values(implode(',', array_map([$db, 'quote'], $values)));

        $db->setQuery($query)->execute();
    }

    public function restoreChange($id)
    {
        $db = Factory::getDbo();

        $query = $db->getQuery(true)
            ->select('*')
            ->from($db->quoteName('#__sofonaquickedit_log'))
            ->where($db->quoteName('id') . ' = ' . (int) $id);
        $db->setQuery($query);
        $log = $db->loadObject();

        if (!$log) {
            $this->setError('Запись не найдена');
            return false;
        }

        if (in_array($log->field, ['product_manufacturer_id', 'currency_id', 'label_id', 'unlimited'])) {
            $info = json_decode($log->info);
            if (json_last_error() === JSON_ERROR_NONE && isset($info->old_value_id)) {
                $log->old_value = $info->old_value_id;
            }
        }

        if ($log->field === 'category_id') {
            $info = json_decode($log->info);
            if (json_last_error() === JSON_ERROR_NONE && isset($info->old_value_id)) {
                $log->old_value = $info->old_value_id;
            }
            $oldCats = $log->old_value;
            if (!is_array($oldCats)) {
                $oldCats = array_map('intval', explode(',', $log->old_value));
            }

            $query = $db->getQuery(true)
                ->delete($db->quoteName('#__jshopping_products_to_categories'))
                ->where($db->quoteName('product_id') . ' = ' . (int) $log->product_id);
            $db->setQuery($query)->execute();

            foreach ($oldCats as $catId) {
                $insert = $db->getQuery(true)
                    ->insert($db->quoteName('#__jshopping_products_to_categories'))
                    ->columns([$db->quoteName('product_id'), $db->quoteName('category_id')])
                    ->values((int) $log->product_id . ',' . (int) $catId);
                $db->setQuery($insert)->execute();
            }
        } else {
            $query = $db->getQuery(true)
                ->update($db->quoteName('#__jshopping_products'))
                ->set($db->quoteName($log->field) . ' = ' . $db->quote($log->old_value))
                ->where($db->quoteName('product_id') . ' = ' . (int) $log->product_id);
            $db->setQuery($query)->execute();
            if ($log->field == 'unlimited' && $log->old_value == '1') {
                $query = $db->getQuery(true)
                    ->update($db->quoteName('#__jshopping_products'))
                    ->set($db->quoteName('product_quantity') . ' = 1')
                    ->where($db->quoteName('product_id') . ' = ' . (int) $log->product_id);
                $db->setQuery($query)->execute();
            }
        }

        $query = $db->getQuery(true)
            ->delete($db->quoteName('#__sofonaquickedit_log'))
            ->where($db->quoteName('id') . ' = ' . (int) $id);
        $db->setQuery($query)->execute();

        return true;
    }

    public function getCurrencyName($id)
    {
        if (!$id)
            return '';
        $db = \JFactory::getDbo();
        $query = $db->getQuery(true)
            ->select($db->quoteName('currency_name'))
            ->from($db->quoteName('#__jshopping_currencies'))
            ->where($db->quoteName('currency_id') . ' = ' . (int) $id);
        $db->setQuery($query);
        return $db->loadResult() ?: '';
    }

    public function getManufacturerName($id)
    {
        if (!$id)
            return '';
        $db = \JFactory::getDbo();
        $query = $db->getQuery(true)
            ->select($db->quoteName('name_ru-RU')) // или нужное поле с переводом
            ->from($db->quoteName('#__jshopping_manufacturers'))
            ->where($db->quoteName('manufacturer_id') . ' = ' . (int) $id);
        $db->setQuery($query);
        return $db->loadResult() ?: '';
    }

}