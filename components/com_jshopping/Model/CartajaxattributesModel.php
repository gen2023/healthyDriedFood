<?php
namespace Joomla\Component\Jshopping\Site\Model;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Factory;
use AddonCore;

defined('_JEXEC') or die();

#[\AllowDynamicProperties]
class CartAjaxAttributesModel extends BaseModel{
	
	public $product_ids = array();
	private $product = null;
	
	public function __construct($products) {
		$this->product_ids = array();
		if (count($products) > 0) {
			foreach($products as $product) {
				$this->product_ids[] = $product->product_id;
			}
		}
		$this->product_ids = array_unique($this->product_ids);
	}
	
	public function getProduct() {
		return $this->product;
	}
	
	public function getProductAttributesForm($product_id, $category_id, $attributes = array(), $free_attributes = array()) {
		$jshopConfig = JSFactory::getConfig();
		$this->product = null;
		$result = '';
		$addon = new AddonCore('cartajax');
		$aview = $addon->getView('attribute');
		$aview->product_id = $product_id;
		$aview->category_id = $category_id;
		$aview->active_free_attributes = $free_attributes;
		$aview->active_attributes = $attributes;
		$aview->free_attributes = [];
		$aview->attributes = [];
		$aview->free_attributes_upd_price = 0;

		if ($jshopConfig->admin_show_attributes && $this->getCountAttribute($product_id)) {			
			$product = JSFactory::getTable("product");
			$product->load($product_id);
			$this->product = $product;
			$attr_sel = $product->getInitLoadAttribute($attributes);
			//print_r($attr_sel); die();
			foreach($attr_sel as $v) {
				$v->selects = preg_replace('/onchange=\".*?\"/', '', $v->selects);
				$v->selects = preg_replace('/onclick=\".*?\"/', '', $v->selects);
			}
			$aview->product = $product;
			$aview->attributes = $attr_sel;			
		}
		if ($jshopConfig->admin_show_freeattributes) {
			$aview->free_attributes = $this->getProductFreeAttributes($product_id);
		}
		$dispatcher = Factory::getApplication();
		$dispatcher->triggerEvent('onBeforeCAgetProductAttributesForm', array(&$aview) );
		return $aview->loadTemplate();
	}

	public function getProductFreeAttributes($product_id) {
		$result = array();
		if (!isset($this->products_free_attributes)) {
			$this->products_free_attributes = array();            
			$lang = JSFactory::getLang();
			$db = Factory::getDBO(); 
			$query = "SELECT fa.id,pfa.product_id,fa.required,fa.`".$lang->get("name")."` AS name,fa.type 
					  FROM `#__jshopping_products_free_attr` as pfa 
					  LEFT JOIN `#__jshopping_free_attr` AS fa ON fa.id=pfa.attr_id
					  WHERE pfa.product_id IN ('".implode("','", $this->product_ids)."')
					  ORDER BY fa.ordering";
			$db->setQuery($query);
			$attributes = $db->loadObjectList();
			if (count($attributes) > 0) {
				foreach($attributes as $attribute) {
					$this->products_free_attributes[$attribute->product_id][] = $attribute;
				}
			}
		}
		if (isset($this->products_free_attributes[$product_id])) $result = $this->products_free_attributes[$product_id];
		return $result;
	}      
	
	public function getAllFreeAttributes() {
		if (!isset($this->all_free_attributes)) {
			$lang = JSFactory::getLang();
			$db = Factory::getDBO(); 
			$query = "SELECT fa.id,fa.required,fa.`".$lang->get("name")."` AS name,fa.type FROM `#__jshopping_free_attr` AS fa ORDER BY fa.ordering";
			$db->setQuery($query);
			$this->all_free_attributes = $db->loadObjectList();
		}
		return $this->all_free_attributes;
	}

	private function getCountAttribute() {
		/** Check for optimization query */
		return 1;
	}

}