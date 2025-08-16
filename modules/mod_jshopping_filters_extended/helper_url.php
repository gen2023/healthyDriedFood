<?php
include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/helper.php";

class modJshoppingFiltersExtendedHelperUrl {

    public static function getBuildSegmentUrl($all_data_url = []) {
        $segments = [];
		$alias_list = self::getFilterAliasList();
		$alias_list_value = self::getFilterAliasValueList();
		
        if (isset($all_data_url['manufacturers'])) {
            $_values = [];
			foreach($all_data_url['manufacturers'] as $mf_id) {                
				if ($mf_id) {
                    $_values[] = $alias_list_value['manufacturer'][$mf_id]['name'];
                }
			}
            if (count($_values)) {
                $name = $alias_list['manufacturer'];
                $segments[] = $name."-".implode(',', $_values);
            }
		}

        if (isset($all_data_url['categorys'])) {
            $_values = [];
			foreach($all_data_url['categorys'] as $c_id) {                
				if ($c_id) {
                    $_values[] = $alias_list_value['category'][$c_id]['name'];
                }
			}
            if (count($_values)) {
                $name = $alias_list['category'];
                $segments[] = $name."-".implode(',', $_values);
            }
		}

		if (isset($all_data_url['attr_val'])) {
			$xsegments = [];
			foreach($all_data_url['attr_val'] as $attr_val_id) {
				if ($attr_val_id) {
					$_data = $alias_list_value['attribut'][$attr_val_id];
					$name = $alias_list['attribut'][$_data['aid']];
					$value = $_data['name'];
					$xsegments[$name][] = $value;
				}
			}
			foreach($xsegments as $k => $v) {
				$segments[] = $k."-".implode(',', $v);
			}
		}

		if (isset($all_data_url['extra_fields'])) {
			foreach($all_data_url['extra_fields'] as $_id => $_vals) {
				$name = $alias_list['extra_field'][$_id];
				if (is_array($_vals)) {
					$_values = [];
					foreach($_vals as $_vid) {
						if ($_vid) {
							$_values[] = $alias_list_value['extra_field'][$_vid]['name'];
						}
					}
					if (count($_values)) {
						$value = implode(',', $_values);
						$segments[] = $name.'-'.$value;
					}
				} elseif ($_vals) {
					$segments[] = $name.'-'.self::getSanitizingVal($_vals);
				}
			}
		}

		if (isset($all_data_url['extra_fields_t'])) {
			foreach($all_data_url['extra_fields_t'] as $_id => $_vals) {
				$name = $alias_list['extra_field'][$_id];
				$_values = [];
				foreach($_vals as $_val) {
					if ($_val) {
						$_values[] = self::getSanitizingVal($_val);
					}
				}
				if (count($_values)) {
					$value = implode(',', $_values);
					$segments[] = $name.'-'.$value;
				}
			}
		}
        return $segments;
    }

    public static function getBuildQueryUrl($all_data_url) {
        $url_query = [];
		foreach($all_data_url as $k => $_vals) {
			if (in_array($k, ['vendors','labels','delivery_times'])) {
				$_values = [];
				foreach($_vals as $_val) {
					if ($_val) {
						$_values[] = $_val;
					}
				}
				if (count($_values)) {
					$url_query[$k] = $_values;
				}
			}
			if (in_array($k, ['show_products_with_old_prices', 'quantity_filter', 'photo_filter', 'show_products_with_free_shipping', 'review_filter', 'rating_filter', 'fprice_from', 'fprice_to','filter_search'])) {
				if ($_vals) {
					$url_query[$k] = $_vals;
				}
			}
		}
        return $url_query;
    }

    public static function getSanitizingVal($val) {
        return str_replace(',', '~~', $val);
    }

    public static function getUnSanitizingVal($val) {
        return str_replace('~~', ',', $val);
    }

    public static function getUnSanitizingVals($vals) {
        foreach($vals as $k => $v) {
            $vals[$k] = self::getUnSanitizingVal($v);
        }
        return $vals;
    }

    public static function getSanitizingFull($val) {
        $val = \JApplicationHelper::stringURLSafe($val);
        $val = str_replace([',', '-'], '', $val);
        return $val;
    }
    
    public static function getFilterAliasListId(){
		static $list;
        if (!isset($list)){
			$list = [];
			$params = modJshopping_filters_extendedHelper::getModuleParams();

			$list['brand'] = ['name' => 'manufacturers', 'id' => 0, 'type' => 'manufacturer', 'type_val' => 'ids'];
			$list['cat'] = ['name' => 'categorys', 'id' => 0, 'type' => 'category', 'type_val' => 'ids'];

			$list_attributes = JSFactory::getAllAttributes();
			foreach($list_attributes as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list[$_alias] = ['name' => 'attr_val', 'id' => $v->attr_id, 'type' => 'attribut', 'type_val' => 'ids'];
			}

			$list_ch = JSFactory::getAllProductExtraField();                
			foreach($list_ch as $v) {
				$_alias = self::getSanitizingFull($v->name);
				if ($v->type == 0) {
					$list[$_alias] = ['name' => 'extra_fields', 'id' => $v->id, 'type'=> 'extra_field', 'type_val' => 'ids'];
				} else {
					if ($params->show_text_ch_as_list == 1) {
						$list[$_alias] = ['name' => 'extra_fields_t', 'id' => $v->id, 'type'=> 'extra_field', 'type_val' => 'texts'];
					} else {
						$list[$_alias] = ['name' => 'extra_fields', 'id' => $v->id, 'type'=> 'extra_field', 'type_val' => 'text'];
					}
				}
			}
		}
        return $list;
    }

    public static function getFilterAliasValueListId(){
		static $list;
        if (!isset($list)){
			$list = ['manufacturer' => [], 'category' => [], 'attribut' => [], 'extra_field' => []];

			$list_mf = self::getManufacturerList();
			foreach($list_mf as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['manufacturer'][0][$_alias] = $v->id;
			}

			$list_cat = self::getCategoryList();
			foreach($list_cat as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['category'][0][$_alias.'.'.$v->id] = $v->id;
			}

			$_attrib = \JSFactory::getTable("attributvalue");
			$list_attr = $_attrib->getAllAttributeValues();        
			foreach($list_attr as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['attribut'][$v->attr_id][$_alias] = $v->value_id;
			}

			$_productfieldvalue = \JSFactory::getTable("productfieldvalue");
			$list_ch = $_productfieldvalue->getAllList();
			foreach($list_ch as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['extra_field'][$v->field_id][$_alias] = $v->id;
			}
		}
        return $list;
    }

	public static function getFilterAliasList(){   
		static $list;
        if (!isset($list)){
			$list = ['manufacturer' => 'brand', 'category' => 'cat', 'attribut' => [], 'extra_field' => []];

			$list_attributes = JSFactory::getAllAttributes();
			foreach($list_attributes as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['attribut'][$v->attr_id] = $_alias;
			}

			$list_ch = JSFactory::getAllProductExtraField();                
			foreach($list_ch as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['extra_field'][$v->id] = $_alias;
			}
		}
        return $list;
    }

	public static function getFilterAliasValueList(){
		static $list;
        if (!isset($list)){
			$list = ['manufacturer' => [], 'category' => [], 'attribut' => [], 'extra_field' => []];

			$list_mf = self::getManufacturerList();
			foreach($list_mf as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['manufacturer'][$v->id] = ['name' => $_alias];
			}

			$list_cat = self::getCategoryList();
			foreach($list_cat as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['category'][$v->id] = ['name' => $_alias.'.'.$v->id];
			}

			$_attrib = \JSFactory::getTable("attributvalue");
			$list_attr = $_attrib->getAllAttributeValues();
			foreach($list_attr as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['attribut'][$v->value_id] = ['name' => $_alias, 'aid' => $v->attr_id];
			}

			$_productfieldvalue = \JSFactory::getTable("productfieldvalue");
			$list_ch = $_productfieldvalue->getAllList();
			foreach($list_ch as $v) {
				$_alias = self::getSanitizingFull($v->name);
				$list['extra_field'][$v->id] = ['name' => $_alias, 'efid' => $v->field_id];
			}
        }
        return $list;
    }

    public static function getManufacturerList() {
        static $list;
        if (!isset($list)){
            $lang = \JSFactory::getLang();
            $db = \JFactory::getDBO();
            $query = "SELECT manufacturer_id as id, `".$lang->get('name')."` as name FROM `#__jshopping_manufacturers`";
            $db->setQuery($query);
            $list = $db->loadObJectList();
        }
        return $list;
    }

    public static function getCategoryList() {
        static $list;
        if (!isset($list)){
            $lang = \JSFactory::getLang();
            $db = \JFactory::getDBO();
            $query = "SELECT category_id as id, `".$lang->get('name')."` as name FROM `#__jshopping_categories`";
            $db->setQuery($query);
            $list = $db->loadObJectList();
        }
        return $list;
    }

}