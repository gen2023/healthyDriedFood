<?php

namespace Sofona\Component\ExportXml\Site\Model;

use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;

class ProductModel extends BaseDatabaseModel
{
    protected $db;

    public function __construct($config = [])
    {
        parent::__construct($config);
        $this->db = Factory::getContainer()->get(DatabaseInterface::class);
    }
    public function getActiveProducts()
    {
        $query = $this->db->getQuery(true)
            ->select('*')
            ->from('#__jshopping_products')
            ->where('product_publish = 1');
        $this->db->setQuery($query);

        $products = $this->db->loadAssocList();

        foreach ($products as &$product) {
            $product['additional_images'] = $this->getAdditionalImages($product['product_id']);
            $product['extra_fields'] = $this->getExtraFieldsProducts($product['product_id']);
            $product['product_attr'] = $this->getAtributeProduct($product['product_id']);
        }

        return $products;
    }

    public function getManufacturerNameById($id){

        $query = $this->db->getQuery(true)
            ->select('*')
            ->from($this->db->quoteName('#__jshopping_manufacturers'))
            ->where($this->db->quoteName('manufacturer_id') . ' = ' . (int) $id);
    
        $this->db->setQuery($query);
        return $this->db->loadAssoc();
    }

    public function buildCategoryPaths($categoryId)
    {
        $categories = [];
    
        while ($categoryId) {
            $query = $this->db->getQuery(true)
                ->select('*')
                ->from('#__jshopping_categories')
                ->where('category_id = ' . (int) $categoryId);
    
                $this->db->setQuery($query);
                $category = $this->db->loadAssoc();
        
                if (!$category) {
                    break;
                }
        
                foreach ($category as $key => $value) {
                    if (strpos($key, 'name_') === 0) {
                        if (!isset($categoryNames[$key])) {
                            $categoryNames[$key] = [];
                        }
                        array_unshift($categoryNames[$key], $value);
                    }
                }
        
                $categoryId = $category['category_parent_id'];
            }
        
            foreach ($categoryNames as $langKey => $nameList) {
                $categoryNames[$langKey] = implode(' &gt; ', $nameList);
            }
        
            return $categoryNames;
        }
    
    private function getAdditionalImages($productId)
    {
        $query = $this->db->getQuery(true)
            ->select('image_name')
            ->from('#__jshopping_products_images')
            ->where('product_id = ' . (int) $productId);

        $this->db->setQuery($query);
        $images = $this->db->loadColumn();

        return array_map(function ($image) {
            return \JUri::root() . 'components/com_jshopping/files/img_products/' . $image;
        }, $images);
    }

    public function getBindings($export_type)
    {
        $query = $this->db->getQuery(true)
            ->select('*')
            ->from('#__com_export_binding')
            ->where($this->db->quoteName('export_type') . ' = ' . $this->db->quote($export_type));

        $this->db->setQuery($query);

        return $this->db->loadAssocList();
    }    
    
    public function getExecult($export_type){
        $query = $this->db->getQuery(true)
            ->select('*')
            ->from('#__com_export_category_exclude')
            ->where($this->db->quoteName('export_type') . ' = ' . $this->db->quote($export_type));

        $this->db->setQuery($query);

        return $this->db->loadAssocList();
    }
    public function getActiveLang(){
        $query = $this->db->getQuery(true)
            ->select('*')
            ->from('#__jshopping_languages')
            ->where('publish = 1');

        $this->db->setQuery($query);

        return $this->db->loadAssocList();
    }
    public function getCategoriesShop()
    {
        $query = $this->db->getQuery(true)
            ->select('*')
            ->from('#__jshopping_categories')
            ->where('category_publish = 1');

        $this->db->setQuery($query);

        return $this->db->loadAssocList();
    }
    public function getExtraFields(){
   
        $query = $this->db->getQuery(true)
            ->select('*')
            ->from($this->db->quoteName('#__jshopping_products_extra_fields'));
    
        $this->db->setQuery($query);
        return $this->db->loadAssocList();
    }
    public function getParamsProduct($export_type){

        $query = $this->db->getQuery(true)
            ->select([
                'pp.'.$this->db->quoteName('id'), 
                $this->db->quoteName('params'),
                $this->db->quoteName('google_param_id'),
                'pg.'.$this->db->quoteName('google_param')
            ])
            ->from($this->db->quoteName('#__com_export_params_product','pp'))
            ->join('LEFT', $this->db->quoteName('#__com_export_params_google', 'pg') . ' ON pp.google_param_id = pg.id')

            ->where($this->db->quoteName('export_type') . ' = ' . $this->db->quote($export_type));

            $this->db->setQuery($query);
            return $this->db->loadAssocList();
    }

    public function getExtraFieldsProducts($product_id) {
        $query = $this->db->getQuery(true)
        ->select('*')
        ->from($this->db->quoteName('#__jshopping_products_to_extra_fields'))
        ->where($this->db->quoteName('product_id') . ' = ' . $this->db->quote($product_id));
        
        $this->db->setQuery($query);
        return $this->db->loadAssoc();
    }
    public function getExtraFieldsItems($extra_fields) {
        $query = $this->db->getQuery(true)
        ->select('*')
        ->from($this->db->quoteName('#__jshopping_products_extra_field_values'))
        ->where($this->db->quoteName('id') . ' = ' . $this->db->quote($extra_fields));
        
        $this->db->setQuery($query);
        return $this->db->loadAssocList();
    }

    public function getAtributeProduct($product_id){
        
        $query = $this->db->getQuery(true)
        ->select('*')
        ->from($this->db->quoteName('#__jshopping_products_attr'))
        ->where($this->db->quoteName('product_id') . ' = ' . $this->db->quote($product_id));
        
        $this->db->setQuery($query);
        $results=$this->db->loadAssocList();

        foreach ($results as &$value) {
            foreach ($value as $attrKey => $element) {
                if (strpos($attrKey, 'attr_') === 0) {
                    $attributeData = $this->getAtributeName($element);
                    
                    if ($attributeData) {
                        $value['info_attr'] = $attributeData;
                    }
                }
            }
        }

        return $results;
    }

    public function getAtributeName($value_id ) {
        $query = $this->db->getQuery(true)
        ->select('*')
        ->from($this->db->quoteName('#__jshopping_attr_values'))
        ->where($this->db->quoteName('value_id') . ' = ' . $this->db->quote($value_id ));
        
        $this->db->setQuery($query);
        return $this->db->loadAssoc();
    }
}
