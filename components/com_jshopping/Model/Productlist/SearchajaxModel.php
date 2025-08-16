<?php
/**
 * @version      1.0.4
 * @author       Sofona
 * @copyright    Copyright (C) 2024 Sofona. All rights reserved.
 * @license      GNU/GPL
 */

namespace Joomla\Component\Jshopping\Site\Model\Productlist;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Jshopping\Site\Helper\Helper;

class SearchajaxModel extends BaseDatabaseModel
{
    protected $db;

    public function __construct($config = [])
    {
        parent::__construct($config);
        $this->db = Factory::getDbo();
    }

    public function searchProductsByName($searchQuery, $data, $limit = 10)
    {
        $lang = JSFactory::getLang();
        $name = $lang->get('name');
        $alias = $lang->get('alias');
        $jshopConfig = JSFactory::getConfig();

        $query = $this->db->getQuery(true);

        $query->select('p.product_id, p.`' . $name . '` as name, p.image, p.product_price, p.`' . $alias . '` as alias, c.category_id, c.category_parent_id')
            ->from('#__jshopping_products AS p')
            ->join('LEFT', '#__jshopping_products_to_categories AS pc ON p.product_id = pc.product_id')
            ->join('LEFT', '#__jshopping_categories AS c ON pc.category_id = c.category_id');

        $conditions = [];

        if (!empty($data['searchByName'])) {
            $conditions[] = 'p.`' . $name . '` LIKE ' . $this->db->quote('%' . $searchQuery . '%');
        }

        if (!empty($data['searchByKode'])) {
            $conditions[] = 'p.product_ean LIKE ' . $this->db->quote('%' . $searchQuery . '%');
        }

        if (empty($conditions)) {
            return []; // Ни одно условие не выбрано — возвращаем пустой результат
        }

        $query->where('(' . implode(' OR ', $conditions) . ')');
        $query->order('p.`' . $name . '` ASC')->setLimit($limit);

        $this->db->setQuery($query);
        $rows = $this->db->loadObjectList();

        $productsGrouped = [];

        foreach ($rows as $row) {
            $id = $row->product_id;
            if (!isset($productsGrouped[$id])) {
                $productsGrouped[$id] = [];
            }
            $productsGrouped[$id][] = $row;
        }

        $results = [];
        foreach ($productsGrouped as $group) {
            $child = null;
            foreach ($group as $item) {
                if ((int) $item->category_parent_id > 0) {
                    $child = $item;
                    break;
                }
            }

            $selected = $child ?: $group[0];

            if (empty($selected->image) || !file_exists(JPATH_ROOT . '/components/com_jshopping/files/img_products/thumb_' . $selected->image)) {
                $selected->image = '/components/com_jshopping/files/img_products/' . $jshopConfig->noimage;
            } else {
                $selected->image = '/components/com_jshopping/files/img_products/thumb_' . $selected->image;
            }

            $selected->product_link = Helper::SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id=' . $selected->category_id . '&product_id=' . $selected->product_id, 1);

            $results[] = $selected;
        }

        return $results;
    }


}
