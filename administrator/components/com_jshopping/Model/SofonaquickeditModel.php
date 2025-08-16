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
    function getAllProducts($filter, $limitstart = null, $limit = null, $order = null, $orderDir = null, $options = array())
    {
        $jshopConfig = JSFactory::getConfig();
        $lang = JSFactory::getLang();
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
    function _getAllProductsQueryForFilter($filter)
    {
        $products = JSFactory::getModel("products");

        return $products->_getAllProductsQueryForFilter($filter);
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


}