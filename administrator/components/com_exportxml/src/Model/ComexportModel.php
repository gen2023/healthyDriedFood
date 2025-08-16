<?php
namespace Sofona\Component\ExportXml\Administrator\Model;

use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use Exception;
use Lcobucci\JWT\Signer\Key\FileCouldNotBeRead;

class ComexportModel extends BaseDatabaseModel
{
    protected $db;

    protected $lang;

    public function __construct($config = [])
    {
        parent::__construct($config);
        $this->db = Factory::getContainer()->get(DatabaseInterface::class);
        $this->lang = Factory::getApplication()->getLanguage()->getTag();

    }

    public function getGoogleCategoriesInfo($search = '')
    {
        $query = $this->db->getQuery(true)
            ->select($this->db->quoteName(['google_base_category_id', 'name']))
            ->from($this->db->quoteName('#__google_base_category'))
            ->where($this->db->quoteName('name') . ' LIKE ' . $this->db->quote('%' . $search . '%'))
            ->order($this->db->quoteName('name') . ' ASC');

        return $this->db->setQuery($query)->loadObjectList();
    }

    public function getJoomShoppingProducts($search = '')
    {
        $query = $this->db->getQuery(true)
            ->select($this->db->quoteName(['product_id', 'name_' . $this->lang], ['product_id', 'name']))
            ->from($this->db->quoteName('#__jshopping_products'))
            ->where($this->db->quoteName('name_' . $this->lang) . ' LIKE ' . $this->db->quote('%' . $search . '%'))
            ->where($this->db->quoteName('product_publish') . ' = 1')
            ->order($this->db->quoteName('name_' . $this->lang) . ' ASC');

        return $this->db->setQuery($query)->loadObjectList();
    }

    public function getJoomShoppingCategories($search = '')
    {
        $categories = $this->fetchJoomShoppingCategories($this->lang);
        $categoryMap = $this->createCategoryMap($categories);

        return $this->filterCategories($categories, $categoryMap, $search);
    }

    protected function fetchJoomShoppingCategories($lang)
    {
        $query = $this->db->getQuery(true)
            ->select($this->db->quoteName(['category_id', 'category_parent_id', 'name_' . $lang], ['category_id', 'parent_id', 'name']))
            ->from($this->db->quoteName('#__jshopping_categories'))
            ->order($this->db->quoteName('name_' . $lang) . ' ASC');

        return $this->db->setQuery($query)->loadAssocList();
    }

    protected function createCategoryMap($categories)
    {
        $map = [];
        foreach ($categories as $category) {
            $map[$category['category_id']] = $category;
        }
        return $map;
    }

    protected function filterCategories($categories, $categoryMap, $search)
    {
        $result = [];
        $added = [];

        foreach ($categories as $category) {
            if ($search === '' || stripos($category['name'], $search) !== false) {
                $this->addCategoryWithParents($category, $categoryMap, $result, $added);
            }
        }
        return $result;
    }

    protected function addCategoryWithParents($category, $categoryMap, &$result, &$added)
    {
        $parentId = $category['parent_id'];
        while ($parentId != 0 && isset($categoryMap[$parentId])) {
            $parent = $categoryMap[$parentId];
            if (!isset($added[$parent['category_id']])) {
                $result[] = (object) [
                    'category_id' => $parent['category_id'],
                    'name' => $this->buildCategoryPath($parent, $categoryMap)
                ];
                $added[$parent['category_id']] = true;
            }
            $parentId = $parent['parent_id'];
        }

        if (!isset($added[$category['category_id']])) {
            $result[] = (object) [
                'category_id' => $category['category_id'],
                'name' => $this->buildCategoryPath($category, $categoryMap)
            ];
            $added[$category['category_id']] = true;
        }
    }

    protected function buildCategoryPath($category, $categoryMap)
    {
        $path = [$category['name']];
        while ($category['parent_id'] != 0 && isset($categoryMap[$category['parent_id']])) {
            $category = $categoryMap[$category['parent_id']];
            array_unshift($path, $category['name']);
        }
        return implode(' > ', $path);
    }

    protected function executeQuery($query)
    {
        $this->db->setQuery($query);
        try {
            $this->db->execute();
            return ['success' => true, 'insert_id' => $this->db->insertid()];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    public function getCategoryProductExclude($export_type)
    {

        $query = $this->db->getQuery(true)
            ->select([
                'ex.id',
                'ex.category_id',
                'ex.product_id',
                'c.`name_' . $this->lang . '` AS category_name',
                'p.`name_' . $this->lang . '` AS product_name'
            ])
            ->from($this->db->quoteName('#__com_export_category_exclude', 'ex'))
            ->join('LEFT', $this->db->quoteName('#__jshopping_categories', 'c') . ' ON c.category_id = ex.category_id')
            ->join('LEFT', $this->db->quoteName('#__jshopping_products', 'p') . ' ON p.product_id = ex.product_id')
            ->where($this->db->quoteName('export_type') . ' = ' . $this->db->quote($export_type));

        $this->db->setQuery($query);

        try {
            return $this->db->loadAssocList();
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function getBinding($export_type)
    {

        $query = $this->db->getQuery(true)
            ->select([
                'eb.id',
                'eb.category_id',
                'eb.product_id',
                'c.`name_' . $this->lang . '` AS category_name',
                'p.`name_' . $this->lang . '` AS product_name',
                'g.name AS google_category_name',
            ])
            ->from($this->db->quoteName('#__com_export_binding', 'eb'))
            ->join('LEFT', $this->db->quoteName('#__jshopping_categories', 'c') . ' ON c.category_id = eb.category_id')
            ->join('LEFT', $this->db->quoteName('#__jshopping_products', 'p') . ' ON p.product_id = eb.product_id')
            ->join('LEFT', $this->db->quoteName('#__google_base_category', 'g') . ' ON g.google_base_category_id = eb.google_base_category_id')
            ->where($this->db->quoteName('export_type') . ' = ' . $this->db->quote($export_type));

        $this->db->setQuery($query);

        try {
            return $this->db->loadAssocList();
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    public function addCategoryProductExclude($category_id, $product_id, $export_type)
    {
        $query = $this->db->getQuery(true)
            ->insert($this->db->quoteName('#__com_export_category_exclude'))
            ->columns([$this->db->quoteName('category_id'), $this->db->quoteName('product_id'), $this->db->quoteName('export_type')])
            ->values(implode(',', [$this->db->quote($category_id), $this->db->quote($product_id), $this->db->quote($export_type)]));

        return $this->executeQuery($query);
    }

    public function deleteExclude($id)
    {
        $query = $this->db->getQuery(true)
            ->delete($this->db->quoteName('#__com_export_category_exclude'))
            ->where($this->db->quoteName('id') . ' = ' . (int) $id);

        return $this->executeQuery($query);
    }

    public function addBinding($google_base_category_id, $category_id, $product_id, $export_type)
    {
        $query = $this->db->getQuery(true)
            ->insert($this->db->quoteName('#__com_export_binding'))
            ->columns([$this->db->quoteName('google_base_category_id'), $this->db->quoteName('category_id'), $this->db->quoteName('product_id'), $this->db->quoteName('export_type')])
            ->values(implode(',', [
                $this->db->quote($google_base_category_id),
                $this->db->quote($category_id),
                $this->db->quote($product_id),
                $this->db->quote($export_type)
            ]));

        return $this->executeQuery($query);
    }

    public function deleteBinding($id)
    {
        $query = $this->db->getQuery(true)
            ->delete($this->db->quoteName('#__com_export_binding'))
            ->where($this->db->quoteName('id') . ' = ' . (int) $id);

        return $this->executeQuery($query);
    }

    public function getExtraFields()
    {

        $query = $this->db->getQuery(true)
            ->select([
                $this->db->quoteName('id'),
                $this->db->quoteName('name_' . $this->lang, 'name')
            ])
            ->from($this->db->quoteName('#__jshopping_products_extra_fields'));

        $this->db->setQuery($query);
        return $this->db->loadAssocList();
    }
    public function addParamsProduct($params, $google_param_id, $export_type)
    {
        $query = $this->db->getQuery(true)
            ->insert($this->db->quoteName('#__com_export_params_product'))
            ->columns([$this->db->quoteName('params'), $this->db->quoteName('google_param_id'), $this->db->quoteName('export_type')])
            ->values(implode(',', [
                $this->db->quote($params),
                $this->db->quote($google_param_id),
                $this->db->quote($export_type)
            ]));

        return $this->executeQuery($query);
    }

    public function getParamsProduct($export_type)
    {

        $query = $this->db->getQuery(true)
            ->select([
                'pp.' . $this->db->quoteName('id'),
                $this->db->quoteName('params'),
                $this->db->quoteName('google_param_id'),
                'pg.' . $this->db->quoteName('google_param')
            ])
            ->from($this->db->quoteName('#__com_export_params_product', 'pp'))
            ->join('LEFT', $this->db->quoteName('#__com_export_params_google', 'pg') . ' ON pp.google_param_id = pg.id')

            ->where($this->db->quoteName('export_type') . ' = ' . $this->db->quote($export_type));

        $this->db->setQuery($query);
        return $this->db->loadAssocList();
    }

    public function deleteParamsProduct($id)
    {
        $query = $this->db->getQuery(true)
            ->delete($this->db->quoteName('#__com_export_params_product'))
            ->where($this->db->quoteName('id') . ' = ' . (int) $id);

        return $this->executeQuery($query);
    }

    public function getGoogleParams()
    {
        $query = $this->db->getQuery(true)
            ->select([
                $this->db->quoteName('id'),
                $this->db->quoteName('google_param')
            ])
            ->from($this->db->quoteName('#__com_export_params_google'));

        $this->db->setQuery($query);
        return $this->db->loadAssocList();
    }

}
