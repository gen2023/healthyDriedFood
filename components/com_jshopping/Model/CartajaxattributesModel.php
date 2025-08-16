<?php
namespace Joomla\Component\Jshopping\Site\Model;
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
	
	function getProductAttributesForm($product_id, $category_id, $attributes = array(), $free_attributes = array()) {
		$this->product = null;
		$result = '';
		$jshopConfig = \JSFactory::getConfig();
		if ($jshopConfig->admin_show_attributes)
		{
			$product_attributes_data = $this->getProductAttributesData($product_id, $attributes);
			if (count($product_attributes_data) > 0)
			{
				$product = \JSFactory::getTable("product");
				$product->load($product_id);
						
				$product_attribute_values = (array)$product_attributes_data['attributeValues'];
				$product_attributes_active = (array)$product_attributes_data['attributeSelected'];
				
				$product->setAttributeActive($product_attributes_active);
				$this->product = $product;

				$all_attributes = \JSFactory::getAllAttributes();
				$userShop = \JSFactory::getUserShop();
				$group_name = '';
				$group_num = 1;
				$this->listAttributeFilters($all_attributes, $product_attribute_values);                
				foreach($all_attributes as $key => $attribute){
					$options = (array)$product_attribute_values[$attribute->attr_id];
					
					foreach($options as $k=>$v){
						if (!isset($options[$k]->addprice)) {
							$options[$k]->addprice = 0;
						}
						$options[$k]->addprice = \JSHelper::getPriceFromCurrency($options[$k]->addprice, $product->currency_id);
						$options[$k]->addprice = \JSHelper::getPriceCalcParamsTax($options[$k]->addprice, $product->product_tax_id);
						if ($userShop->percent_discount){
							$options[$k]->addprice = \JSHelper::getPriceDiscount($options[$k]->addprice, $userShop->percent_discount);
						}
					}
					
					if ($attribute->groupstart){
						$result .= '<div class="cartajax_attr_group_'.$attribute->groupnum.'">';
					}
					$result .= '<span class="cartajaxattributes-fieldset-wrapper cartajaxattributes-fieldset-wrapper-'.$attribute->attr_id.'"><fieldset><legend>'.$attribute->name.'<span class="cartajax-required">*</span></legend>';
					
					if ($attribute->attr_type == 3){
						$ext_price_info = "";        
						if (isset($options[1]->price_mod) && ($options[1]->price_mod == "+" || $options[1]->price_mod == "-") && $options[1]->addprice > 0){
							$ext_price_info = " (".$options[1]->price_mod.\JSHelper::formatprice($options[1]->addprice, null, 1).")";
						}
						if ($product_attributes_active[$attribute->attr_id] == $options[1]->val_id){
							$checked = "checked='checked'";
						}else{
							$checked = "";
						}
						$result .= '<input type="hidden" name="jshop_attr_id['.$attribute->attr_id.']" id="jshop_attr_id_'.$attribute->attr_id.'_hidden" value="'.$options[0]->val_id.'">';
						$result .= '<input type="checkbox" name="jshop_attr_id['.$attribute->attr_id.']"  id="jshop_attr_id_'.$attribute->attr_id.'_checkbox" value="'.$options[1]->val_id.'" '.$checked.'>'.$ext_price_info;
					} else {
						if ($attribute->attr_type == 1)
						{
							if ($jshopConfig->product_attribut_first_value_empty)$options = array_merge(array(\JHTML::_('select.option', '0', \JText::_('JSHOP_SELECT'), 'val_id', 'value_name')), $options);
							$result .= '<select name="jshop_attr_id['.$attribute->attr_id.']" class="input-medium">';
						}
						$attribute_image = '';
						foreach($options as $option)
						{
							$add_price = '';
							if ($jshopConfig->attr_display_addprice && $option->addprice > 0)
							{                 
								if (in_array($option->price_mod, array('+','-')))$add_price .= '&nbsp;('.$option->price_mod.\JSHelper::formatprice($option->addprice, null, 1).')';
								if (in_array($option->price_mod, array('*','/')))$add_price .= '&nbsp;('.$option->price_mod.' '.$option->addprice.')';
							}
							$selected = $product_attributes_active[$attribute->attr_id] == $option->val_id ? ($attribute->attr_type == 1 ? 'selected="selected"' : 'checked="checked"') : '';
							if ($attribute->attr_type == 1)
							{
								$result .= '<option value="'.$option->val_id.'" '.$selected.'>'.$option->value_name.$add_price.'&nbsp;</option>';
								if ($option->val_id == $product_attributes_active[$attribute->attr_id])$attribute_image = $option->image;
							}
							else
							{
								if (!empty($option->image))$result .= '<img src="'.$jshopConfig->image_attributes_live_path.'/'.$option->image.'" width="20" alt="'.$option->value_name.'" />';
								$input_id = 'cartajaxattributes-input-'.$product_id.$option->val_id.time();
								$result .= '<label for="'.$input_id.'"><span>'.$option->value_name.$add_price.'&nbsp;</span><input type="radio" id="'.$input_id.'" name="jshop_attr_id['.$attribute->attr_id.']" value="'.$option->val_id.'" '.$selected.' /></label>';
								$result .= $jshopConfig->radio_attr_value_vertical ? '<br/>' : '';
							}
						}
						if ($attribute->attr_type == 1)
						{
							$result .= '</select>';                                
							if (!empty($attribute_image))$result .= '<img src="'.$jshopConfig->image_attributes_live_path.'/'.$attribute_image.'" width="20" alt="'.$option->value_name.'" />';
						}
					}
					
					$result .= '</fieldset></span>';
					if ($attribute->groupstop){
						$result .= '</div>';
					}
				
				}
			}
		}
		if ($jshopConfig->admin_show_freeattributes) {
			$product_free_attributes = $this->getProductFreeAttributes($product_id); 
			if (count($product_free_attributes) > 0) {
				foreach($product_free_attributes as $key => $attribute) {
					$result .= '<span class="cartajaxattributes-fieldset-wrapper cartajaxattributes-fieldset-wrapper-freeattribute-'.$attribute->id.'"><fieldset><legend>'.$attribute->name.($attribute->required ? '<span class="cartajax-required">*</span>' : '').'</legend>
								   <input type="text" class="input-medium" name="freeattribut['.$attribute->id.']" value="'.(isset($free_attributes[$attribute->id]) ? $free_attributes[$attribute->id] : '').'" />
								</fieldset></span>';
				}
				$result .= '<div class="cartajax-required">* '.\JText::_('JSHOP_REQUIRED').'</div>';
			}
		}
		if (!empty($result)) {
			$result = '<form class="cartajaxattributes" name="cartajaxattributes-'.$product_id.'" id="cartajaxattributes-'.$product_id.'">
						   <input type="hidden" name="product_id" value="'.$product_id.'" />
						   <input type="hidden" name="category_id" value="'.$category_id.'" />
						   <div class="cart_pls_sel_options"><b>'.\JText::_('JSHOP_SELECT_PRODUCT_OPTIONS').'</b></div>'.$result;
			$result .= '</form>';
		}
		return $result;
	}
	
	function getProductAttributeOptions($product_id, $attribute_id, $attribute_values_filter = array(), $only_available = false)
	{
		$result = array();
		$db = \JFactory::getDbo();
		$lang = \JSFactory::getLang();
        $jshopConfig = \JSFactory::getConfig();
		$all_attributes = \JSFactory::getAllAttributes(1);
		if ($all_attributes[$attribute_id]->independent == 0) {
			if (!isset($this->product_dependent_attribute_values)) {
				$attribute_fields = array();
				$on = array();         
				if (count($all_attributes) > 0) {
					foreach($all_attributes as $attr) {
						if ($attr->independent==0) {
							$attribute_fields[] = " PA.attr_".$attr->attr_id." ";
							$on[] = " PA.attr_".$attr->attr_id."=V.value_id ";
						}
					}    
				}
                $sorting = $jshopConfig->attribut_dep_sorting_in_product;
                if ($sorting=="") $sorting = "V.value_ordering";
                if ($sorting=="PA.product_attr_id") $sorting = "PA.product_attr_id";
				$query = "SELECT PA.product_id, PA.count, V.attr_id,".implode(',', $attribute_fields).", V.`".$lang->get('name')."` as value_name, V.image
						  FROM #__jshopping_products_attr AS PA
						  LEFT JOIN #__jshopping_attr_values AS V ON ".implode(' OR ', $on)."
						  WHERE PA.product_id IN ('".implode("','", $this->product_ids)."')
						  ORDER BY ".$sorting;				
				$db->setQuery($query);
				$all_attribute_values = (array)$db->loadObjectList();				
				if (count($all_attribute_values) > 0) {
					foreach($all_attribute_values as $attribute_value) {
						if ($attribute_value->attr_id) {
							$value_id_field = 'attr_'.$attribute_value->attr_id;
							$attribute_value->val_id = $attribute_value->$value_id_field;
							$this->product_dependent_attribute_values[$attribute_value->product_id][$attribute_value->attr_id][] = $attribute_value;
						}
					}
				}                        
			}
			if (isset($this->product_dependent_attribute_values[$product_id][$attribute_id])) {            
				$attribute_values = $this->product_dependent_attribute_values[$product_id][$attribute_id];
				if (count($attribute_values) > 0) {
					$ids = array();
					foreach($attribute_values as $attribute_value) {
						if (in_array($attribute_value->val_id, $ids))continue;
						$filtered = $only_available && $attribute_value->count == 0;
						if (count($attribute_values_filter) > 0) {
							foreach($attribute_values_filter as $other_attribute_key => $other_attribute_value) {
								$attribute_field = 'attr_'.$other_attribute_key;
								if ($attribute_value->$attribute_field != $other_attribute_value) {
									$filtered = true;
									break;
								}
							}
						}
						if (!$filtered) {
							$result[] = (object)array(
								'val_id' => $attribute_value->val_id,
								'value_name' => $attribute_value->value_name,
								'image' => $attribute_value->image
							);
							$ids[] = $attribute_value->val_id;
						}
					}                            
				}
			}
		}
		else
		{
			if (!isset($this->product_independent_attribute_values))
			{
                $sorting = $jshopConfig->attribut_nodep_sorting_in_product;
                if ($sorting=="") $sorting = "V.value_ordering";
				$query = "SELECT PA.product_id, PA.attr_id, PA.attr_value_id as val_id, V.`".$lang->get('name')."` as value_name, V.image, PA.price_mod, PA.addprice
						  FROM #__jshopping_products_attr2 as PA
						  INNER JOIN #__jshopping_attr_values as V ON PA.attr_value_id=V.value_id
						  WHERE PA.product_id IN ('".implode("','", $this->product_ids)."')
						  ORDER BY ".$sorting;
				$db->setQuery($query);
				$all_attribute_values = $db->loadObjectList();
				if (count($all_attribute_values) > 0)
				{
					foreach($all_attribute_values as $attribute_value)
					{
						$this->product_independent_attribute_values[$attribute_value->product_id][$attribute_value->attr_id][] = $attribute_value;
					}
				}
			}
			if (isset($this->product_independent_attribute_values[$product_id][$attribute_id]))
			{
				$result = $this->product_independent_attribute_values[$product_id][$attribute_id];
			}
		}
		return $result;
	}
	
	function getProductAttributes($product_id)
	{
		$result = array();
		if (!isset($this->products_attributes))
		{
			$this->products_attributes = array();
			$db = \JFactory::getDbo();
			$query = "SELECT * FROM `#__jshopping_products_attr` 
					  WHERE product_id IN ('".implode("','", $this->product_ids)."')
					  ORDER BY product_attr_id";
			$db->setQuery($query);
			$attributes = $db->loadObjectList();
			if (count($attributes) > 0)
			{
				foreach($attributes as $key => $attribute)
				{
					$this->products_attributes[$attribute->product_id][] = $attribute;
				}
			}
		}
		if (isset($this->products_attributes[$product_id]))$result = $this->products_attributes[$product_id];
		return $result;
	}
	
	function getProductAttributes2($product_id)
	{
		$result = array();
		if (!isset($this->products_attributes_2))
		{
			$this->products_attributes_2 = array();
			$db = \JFactory::getDbo();
			$query = "SELECT * FROM `#__jshopping_products_attr2` 
					  WHERE product_id IN ('".implode("','", $this->product_ids)."')
					  ORDER BY id";
			$db->setQuery($query);
			$attributes = $db->loadObjectList();
			if (count($attributes) > 0)
			{
				foreach($attributes as $key => $attribute)
				{
					$this->products_attributes_2[$attribute->product_id][] = $attribute;
				}
			}
		}
		if (isset($this->products_attributes_2[$product_id]))$result = $this->products_attributes_2[$product_id];
		return $result;
	}   
	
	function getProductFreeAttributes($product_id)
	{
		$result = array();
		if (!isset($this->products_free_attributes))
		{
			$this->products_free_attributes = array();            
			$lang = \JSFactory::getLang();
			$db = \JFactory::getDBO(); 
			$query = "SELECT fa.id,pfa.product_id,fa.required,fa.`".$lang->get("name")."` AS name,fa.type 
					  FROM `#__jshopping_products_free_attr` as pfa 
					  LEFT JOIN `#__jshopping_free_attr` AS fa ON fa.id=pfa.attr_id
					  WHERE pfa.product_id IN ('".implode("','", $this->product_ids)."')
					  ORDER BY fa.ordering";
			$db->setQuery($query);
			$attributes = $db->loadObjectList();
			if (count($attributes) > 0)
			{
				foreach($attributes as $attribute)
				{
					$this->products_free_attributes[$attribute->product_id][] = $attribute;
				}
			}
		}
		if (isset($this->products_free_attributes[$product_id]))$result = $this->products_free_attributes[$product_id];
		return $result;
	}      
	
	function getAllFreeAttributes()
	{
		if (!isset($this->all_free_attributes))
		{
			$lang = \JSFactory::getLang();
			$db = \JFactory::getDBO(); 
			$query = "SELECT fa.id,fa.required,fa.`".$lang->get("name")."` AS name,fa.type
					  FROM `#__jshopping_free_attr` AS fa
					  ORDER BY fa.ordering";
			$db->setQuery($query);
			$this->all_free_attributes = $db->loadObjectList();
		}
		return $this->all_free_attributes;
	}        
	
	function getProductRequiredAttributes($product_id)
	{
		$result = array();
		$allattribs = \JSFactory::getAllAttributes(2);
		$dependent_attr = $allattribs['dependent'];
		$independent_attr = $allattribs['independent'];                    
		if (count($dependent_attr))
		{
			$prodAttribVal = $this->getProductAttributes($product_id);
			if (count($prodAttribVal))
			{
				$prodAtrtib = $prodAttribVal[0];
				foreach($dependent_attr as $attrib)
				{
					$field = "attr_".$attrib->attr_id;
					if ($prodAtrtib->$field)$result[] = $attrib->attr_id;
				}
			}
		}            
		if (count($independent_attr))
		{
			$prodAttribVal2 = $this->getProductAttributes2($product_id);
			foreach($prodAttribVal2 as $attrib)
			{
				if (!in_array($attrib->attr_id, $result))
				{
					$result[] = $attrib->attr_id;    
				}
			}
		}
		return $result;
	}

	function getProductAttributesData($product_id, $selected_attributes = array())
	{
		$result = array();
		$jshopConfig = \JSFactory::getConfig();        
		$required_attributes = $this->getProductRequiredAttributes($product_id);
		if (count($required_attributes) > 0) {
			$active = array();
			foreach($required_attributes as $attr_id) {      
				$options = $this->getProductAttributeOptions($product_id, $attr_id, $active, $jshopConfig->hide_product_not_avaible_stock);
				$result['attributeValues'][$attr_id] = $options;
				if (!$jshopConfig->product_attribut_first_value_empty) {
					$active[$attr_id] = $options[0]->val_id;   
				}
				$selected_value = isset($selected_attributes[$attr_id]) ? (int)$selected_attributes[$attr_id] : 0;
				if ($selected_value > 0) {
					foreach($options as $option) {
						if ($option->val_id == $selected_value) {
							$active[$attr_id] = $selected_value;
							break;
						}
					}
				}
			}
			if (count($required_attributes) == count($active)) $result['attributeActive'] = $active;
			$result['attributeSelected'] = $active;
		}
		return $result;
	}
	
	function listAttributeFilters(&$all_attributes, $product_attribute_values){
		foreach($all_attributes as $key => $attribute){
			$options = isset($product_attribute_values[$attribute->attr_id]) ? (array)$product_attribute_values[$attribute->attr_id] : [];
			if (!count($options)) {
				unset($all_attributes[$key]);
			}
		}
		$groupname = '-defaultgroupname-';
		$groupnum = 1;
        $all_attributes = array_values($all_attributes);
		foreach($all_attributes as $key => $attribute){
            $all_attributes[$key]->groupstart = 0;
            $all_attributes[$key]->groupstop = 0;
			if ($groupname != $attribute->groupname){
				$all_attributes[$key]->groupstart = 1;
				$all_attributes[$key]->groupnum = $groupnum;
				if ($key > 0){
					$all_attributes[$key-1]->groupstop = 1;
				}
				$groupname = $attribute->groupname;
				$groupnum++;
			}
			if ($key == (count($all_attributes)-1)){
				$all_attributes[$key]->groupstop = 1;
			}
		}
	}
}