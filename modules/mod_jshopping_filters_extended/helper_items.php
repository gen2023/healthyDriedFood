<?php
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Language\Text;

use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

defined('_JEXEC') or die;

class modJshopping_filters_extendedHelperItems {
	
	public static function getItemForProduct($res_type, $page_params, $options = []) {
		$db = Factory::getDbo();
		$app = Factory::getApplication();
		$user = Factory::getUser();
		$jshopConfig = JSFactory::getConfig();
		$groups = implode(',', $user->getAuthorisedViewLevels());
		$join = [];
		$where = ' AND p.access IN ('.$groups.')';
		if (isset($options['where'])) {
			$where .= " ".$options['where'];
		}
		if ($jshopConfig->hide_product_not_avaible_stock){
			$where .= " AND (p.product_quantity > '0' OR  p.unlimited = '1') ";
		}
		if (isset($page_params['data']['categorys'])) {
			$join['pc'] = " LEFT JOIN `#__jshopping_products_to_categories` as pc ON (pc.product_id=p.product_id) ";
			$where .= " AND pc.category_id IN (".implode(',', $page_params['data']['categorys']).") ";
		}        
		if (isset($page_params['data']['manufacturers'])) {
			$where .= " AND p.product_manufacturer_id IN (".implode(',', $page_params['data']['manufacturers']).") ";
		}
		if (isset($page_params['data']['vendors'])) {
			$join['v'] = " LEFT JOIN `#__jshopping_vendors` as v on (p.vendor_id=v.id OR (p.vendor_id=0 AND v.main=1) ) ";
			$where .= " AND v.id IN (".implode(',', $page_params['data']['vendors']).") ";
		}
		if (isset($page_params['data']['labels'])) {			
			$where .= " AND p.label_id IN (".implode(',', $page_params['data']['labels']).") ";
		}
		if (isset($page_params['data']['delivery_times'])) {			
			$where .= " AND p.delivery_times_id IN (".implode(',', $page_params['data']['delivery_times']).") ";
		}
		if (isset($page_params['data']['photo_filter'])) {
        	if ($page_params['data']['photo_filter'] == '1') $where .= " AND p.image != '' ";  
        	if ($page_params['data']['photo_filter'] == '2') $where .= " AND p.image = '' ";			
		}
		if (isset($page_params['data']['review_filter'])) {
        	if ($page_params['data']['review_filter'] == '1') $where .= " AND p.reviews_count > 0 ";  
        	if ($page_params['data']['review_filter'] == '2') $where .= " AND p.reviews_count = 0 ";			
		}
		if (isset($page_params['data']['quantity_filter'])) {
        	if ($page_params['data']['quantity_filter'] == '1') $where .= " AND (p.product_quantity > '0' OR  p.unlimited = '1') ";  
        	if ($page_params['data']['quantity_filter'] == '2') $where .= " AND (p.product_quantity = '0' AND p.unlimited = '0') ";			
		}
		if (isset($page_params['data']['rating_filter'])) {
            $where .= " AND p.average_rating >=".(int)$page_params['data']['rating_filter']." ";
        }
		if (isset($page_params['data']['show_products_with_old_prices'])) {
            $where .= " AND p.product_old_price > 0 ";
        }
		if (isset($page_params['data']['fprice_from'])){
			$join['cr'] = " LEFT JOIN `#__jshopping_currencies` AS cr USING (currency_id) ";
            $where .= " AND (p.product_price / cr.currency_value) >= ".(int)$page_params['data']['fprice_from']." ";
        }
		if (isset($page_params['data']['fprice_to'])){
			$join['cr'] = " LEFT JOIN `#__jshopping_currencies` AS cr USING (currency_id) ";
            $where .= " AND (p.product_price / cr.currency_value) <= ".(int)$page_params['data']['fprice_to']." ";
        }
		if (isset($page_params['data']['show_products_with_free_shipping'])){
			$join['cr'] = " LEFT JOIN `#__jshopping_currencies` AS cr USING (currency_id) ";
            $where .= " AND (p.product_price / cr.currency_value) > ".$jshopConfig->summ_null_shipping." ";            
        }
		if (isset($page_params['data']['extra_fiels'])) {
			$join['ex'] = " LEFT JOIN `#__jshopping_products_to_extra_fields` as ex ON ex.product_id = p.product_id ";
			if (isset($page_params['data']['extra_fiels']['list']) && count($page_params['data']['extra_fiels']['list'])) {
				foreach($page_params['data']['extra_fiels']['list'] as $f_id => $vals){
					if (is_array($vals) && count($vals)){
						$tmp = array();
						foreach($vals as $val_id){
							$tmp[] = " find_in_set('".$db->escape($val_id)."', ex.`extra_field_".(int)$f_id."`) ";
						}
						$mchfilterlogic = 'OR';
						if (isset($jshopConfig->mchfilterlogic_and[$f_id]) && $jshopConfig->mchfilterlogic_and[$f_id]) $mchfilterlogic = 'AND';
						$app->triggerEvent('onGetItemForProductFiltersExtendedHelperExtraFiels', array(&$tmp, &$f_id, &$vals, &$mchfilterlogic, &$join, &$where, &$page_params));
						$_tmp_adv_query = implode(' '.$mchfilterlogic.' ', $tmp);
						$where .= " AND (".$_tmp_adv_query.")";
					}elseif(is_string($vals) && $vals!=""){
						$where .= " AND ex.`extra_field_".(int)$f_id."`='".$db->escape($vals)."'";
					}
				}
			}
			if (isset($page_params['data']['extra_fiels']['text']) && count($page_params['data']['extra_fiels']['text'])) {
				foreach($page_params['data']['extra_fiels']['text'] as $f_id=>$vals){
					if (is_array($vals) && count($vals)){
						$tmp = array();
						foreach($vals as $val){
							$tmp[] = " ex.`extra_field_".(int)$f_id."`='".$db->escape($val)."'";
						}
						$mchfilterlogic = 'OR';
						if (isset($jshopConfig->mchfilterlogic_and[$f_id]) && $jshopConfig->mchfilterlogic_and[$f_id]) $mchfilterlogic = 'AND';
						$_tmp_adv_query = implode(' '.$mchfilterlogic.' ', $tmp);
						$where .= " AND (".$_tmp_adv_query.")";
					}
				}
			}
		}
		if (isset($page_params['data']['attributes'])){
			$prod_by_attributs = modJshopping_filters_extendedHelper::getProductIdByAttributeVals($page_params['data']['attributes']);
			if (count($prod_by_attributs) > 0) {
                $where .= " AND p.product_id in (".implode(",", $prod_by_attributs).") "; 
            }
		}
	
		if ($page_params['controller'] == 'products' && $page_params['task'] == 'label') {
			$where .= " AND p.label_id != 0 ";
		}

		if ($res_type == 'manufacturer') {
			$select = 'distinct `product_manufacturer_id` as id';
		}
		if ($res_type == 'category') {
			$join['pc'] = " LEFT JOIN `#__jshopping_products_to_categories` as pc ON (pc.product_id=p.product_id) ";
			$select = 'distinct pc.category_id as id';
		}
		if ($res_type == 'vendor') {
			$select = 'distinct p.vendor_id as id';
		}
		if ($res_type == 'label') {
			$select = 'distinct p.label_id as id';
		}
		if ($res_type == 'delivery_time') {
			$select = 'distinct p.delivery_times_id as id';
		}
		if ($res_type == 'product') {
			$select = 'distinct p.product_id as id';
		}
		if ($res_type == 'extra_fields') {
			$join['ex'] = " LEFT JOIN `#__jshopping_products_to_extra_fields` as ex ON ex.product_id = p.product_id ";
		}
		if ($res_type == 'products_attr2') {
			$select = 'distinct a2.attr_value_id as id';
			$join['a2'] = " LEFT JOIN `#__jshopping_products_attr2` as a2 ON a2.product_id=p.product_id ";
			if (isset($options['attr_id'])) {
				$where .= " AND a2.attr_id = ".$db->q($options['attr_id']);
			}
		}
		if ($res_type == 'products_attr') {
			$join['a'] = " LEFT JOIN `#__jshopping_products_attr` as a ON a.product_id=p.product_id ";
		}
		if (isset($options['query_select_field'])) {
			$select = $options['query_select_field'];
		}
		$app->triggerEvent('onGetItemForProductFiltersExtendedHelperBeforeQuery', array(&$join, &$where, &$res_type, &$page_params, &$options, &$select));
		$query = "SELECT ".$select." FROM `#__jshopping_products` as p "
				 .implode(' ', $join)
				 ." WHERE p.product_publish='1' "
				 .$where;
		if (isset($options['order'])) {
			$query .= " ".$options['order'];
		}
		if ($res_type == 'extra_fields') {
			//print $query."<br>\n\n";
		}
		$db->setQuery($query);
		if (isset($options['res_loadObjectList'])) {
			$res = $db->loadObjectList();
		} else {
			$res = $db->loadColumn();
		}
		$app->triggerEvent('onGetItemForProductFiltersExtendedHelperBeforeRes', array(&$res_type, &$page_params, &$options, &$res));
		return $res;
	}

	public static function getPageParamsPlusActFilterFor($for_type, $page_params, $filter_active, $item_id = null){
		$params = $page_params;

		foreach($filter_active as $k => $v) {
			if ($for_type == 'manufacturer' && $k == 'manufacturers') continue;
			if ($for_type == 'category' && $k == 'categorys') continue;
			if ($for_type == 'vendor' && $k == 'vendors') continue;
			if ($for_type == 'ProductsMaxMinPrice' && $k == 'price_from') continue;
			if ($for_type == 'ProductsMaxMinPrice' && $k == 'price_to') continue;
			if ($for_type == 'label' && $k == 'labels') continue;
			if ($for_type == 'delivery_time' && $k == 'delivery_time_active') continue;
			if ($for_type == 'extra_fields' && $k == 'extra_fields') {
				if ($item_id) {
					unset($v[$item_id]);
				}
			}
			if ($for_type == 'extra_fields_t' && $k == 'extra_fields_t') {
				if ($item_id) {
					unset($v[$item_id]);
				}
			}
			if ($for_type == 'products_attr2' && $k == 'attribut_active_value') {
				$vals = self::getAttributeValuesIdByAttr($item_id);
				$v = array_diff($v, $vals);
			}
			if ($for_type == 'products_attr' && $k == 'attribut_active_value') {
				$vals = self::getAttributeValuesIdByAttr($item_id);
				$v = array_diff($v, $vals);
			}

			if ($for_type == 'delivery_time' && $k == 'delivery_time_active') continue;

			if (is_array($v) && count($v)) {
				if ($k == 'extra_fields') {
					$params['data']['extra_fiels']['list'] = $v;
				} elseif ($k == 'extra_fields_t') {
					$params['data']['extra_fiels']['text'] = $v;
				} elseif ($k == 'delivery_time_active') {
					$params['data']['delivery_times'] = $v;	
				} elseif ($k == 'attribut_active_value') {
					$params['data']['attributes'] = $v;	
				} else {
					$params['data'][$k] = $v;
				}
			} elseif ($v) {
				if ($k == 'price_from') {
					$params['data']['fprice_from'] = $v;
				} elseif ($k == 'price_to') {
					$params['data']['fprice_to'] = $v;
				} else {
					$params['data'][$k] = $v;
				}
			}
		}
		return $params;
	}

	public static function getManufacturers($page_params, $filter_active = null) {
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('manufacturer', $page_params, $filter_active);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getManufacturers', [$page_params['data'], $filter_active]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$jshopConfig = JSFactory::getConfig();
		$_manufacturers = JSFactory::getTable('manufacturer');  
		$ordering = $jshopConfig->manufacturer_sorting==1 ? 'ordering' : 'name';
		if (modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
			$ordering = 'name';
		}
		$list = $_manufacturers->getAllManufacturers(1, $ordering);
		foreach ($list as $k => $v) {
			$list[$k]->id = $list[$k]->manufacturer_id;
		}
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('manufacturer', $page_params);
		foreach($list as $k => $v) {
			if (isset($page_params['data']['manufacturers']) && in_array($v->id, $page_params['data']['manufacturers'])) {
				unset($list[$k]);
				continue;
			}
            if (isset($filter_active['manufacturers']) && in_array($v->id, $filter_active['manufacturers'])){
                continue;
            }
			if (!in_array($v->id, $items)) {
				if ($params->display_unavailable_value == 1) {
					$list[$k]->disable = 1;
				} else {
					unset($list[$k]);
				}
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getCategorys($page_params, $show_categorys_in_category = 0, $filter_active = null) {
		if (($page_params['controller'] == 'category' && $page_params['category_id']) && $show_categorys_in_category == 0) {
			return [];
		}
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('category', $page_params, $filter_active);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getCategorys', [$page_params['data'], $show_categorys_in_category, $filter_active]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$list = Helper::buildTreeCategory(1);
		$list_img = self::getCategoryImages();		
		foreach ($list as $k => $v) {
			$list[$k]->id = $list[$k]->category_id;
			$list[$k]->image = $list_img[$v->category_id]->category_image;
		}
		$show_by_product = 1;
		if (in_array($page_params['controller'], ['category'])) {
			$show_by_product = 0;
		}
		if ($page_params['controller'] == 'products' && $page_params['task'] == 'display' && empty($page_params['data'])) {
			$show_by_product = 0;
		}		
		if (empty($page_params['data']) && $page_params['task'] != 'label') {
			$show_by_product = 0;
		}

		if ($show_by_product) {
			$params = modJshopping_filters_extendedHelper::getModuleParams();
			$items = self::getItemForProduct('category', $page_params);
			foreach ($list as $k => $v) {
				if (isset($page_params['data']['categorys']) && in_array($v->id, $page_params['data']['categorys'])) {
					unset($list[$k]);
					continue;
				}
                if (isset($filter_active['categorys']) && in_array($v->id, $filter_active['categorys'])){
                    continue;
                }
				$list[$k]->name = ltrim($v->name, '-- ');
				if (!in_array($v->id , $items)) {
					if ($params->display_unavailable_value == 1) {
						$list[$k]->disable = 1;
					} else {
						unset($list[$k]);
					}
				}
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getVendors($page_params, $filter_active = null) {
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('vendor', $page_params, $filter_active);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getVendors', [$page_params['data'], $filter_active]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$vendor = JSFactory::getTable('vendor');
		$ordering = null;
		if (modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
			$ordering = 'shop_name';
		}
		$list = $vendor->getAllVendors(1, 0, 0, $ordering);
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('vendor', $page_params);
		foreach ($list as $k => $v) {
			$list[$k]->name = $v->shop_name;
			if (isset($page_params['data']['vendors']) && in_array($v->id, $page_params['data']['vendors'])) {
				unset($list[$k]);
				continue;
			}
            if (isset($filter_active['vendors']) && in_array($v->id, $filter_active['vendors'])){
                continue;
            }
			if (!in_array($v->id , $items)) {
				if ($v->main == 1 && in_array(0, $items)) {
					continue;
				}
				if ($params->display_unavailable_value == 1) {
					$list[$k]->disable = 1;
				} else {
					unset($list[$k]);
				}
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getCharacteristics($page_params, $show_characteristics_id, $show_text_ch_as_list, $filter_active = null, $hide_empty = 1){
		$characteristic_fields = JSFactory::getAllProductExtraField(1);
		if (!in_array(0, $show_characteristics_id)) {
			foreach($characteristic_fields as $k=>$val){
				if (!in_array($val->id, $show_characteristics_id)) {
					unset($characteristic_fields[$k]);
				}
			}
		}
		if ($page_params['controller'] == "category" && isset($page_params['data']['categorys'])){
			foreach($characteristic_fields as $k=>$val){
				$_display = 0;
				if ($val->allcats){
					$_display = 1; 
				}else{
					foreach($page_params['data']['categorys'] as $v){
						if (in_array($v, $val->cats)){
							$_display = 1;
						}
					}
				}
				if (!$_display) unset($characteristic_fields[$k]);
			}
		}

		foreach($characteristic_fields as $k=>$val){
			if ($val->type != 1) {
				$val->values = self::getCharacteristicValuesT0($val->id, $page_params, $filter_active, $val->multilist);
				if ($hide_empty && !count($val->values)) {
					unset($characteristic_fields[$k]);
					continue;
				}
				foreach($val->values as $k2 => $v2) {
					$val->values[$k2]->image = modJshopping_filters_extendedHelper::getCharactiristicValueImage($v2->id);
				}
			} else {
				$ch_values = self::getCharacteristicValuesT1($val->id, $page_params, $filter_active);
				if ($hide_empty && !count($ch_values)) {
					unset($characteristic_fields[$k]);
					continue;
				}
				if ($show_text_ch_as_list){
					$val->values = $ch_values;
				} else {
					$characteristic_fields[$k]->use_as_text = 1;
				}		
			}
		}
		return $characteristic_fields;
	}

	public static function getCharacteristicValuesT0($ch_id, $page_params, $filter_active = null, $multilist = 0) {
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('extra_fields', $page_params, $filter_active, $ch_id);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getCharacteristicVals_'.$ch_id, [$page_params['data'], $filter_active]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$ordering = null;
		if (modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
			$ordering = 'name';
		}
		$list = self::getExtraFieldValuesDB($ch_id, $ordering);
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('extra_fields', $page_params, ['query_select_field' => "distinct ex.extra_field_".$ch_id]);
		if ($multilist) {
			$items = self::fixListForMultiExtraFields($items);
		}
		foreach($list as $k => $v) {
			if (isset($page_params['data']['extra_fiels']['list'][$ch_id]) && in_array($v->id, $page_params['data']['extra_fiels']['list'][$ch_id])) {
				unset($list[$k]);
				continue;
			}
            if (isset($filter_active['extra_fields'][$ch_id]) && in_array($v->id, $filter_active['extra_fields'][$ch_id])) {
				continue;
			}
			if (!in_array($v->id, $items)) {
				if ($params->display_unavailable_value == 1) {
					$list[$k]->disable = 1;
				} else {
					unset($list[$k]);
				}
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getCharacteristicValuesT1($ch_id, $page_params, $filter_active = null) {
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('extra_fields_t', $page_params, $filter_active, $ch_id);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getCharacteristicVals_'.$ch_id, [$page_params['data'], $filter_active]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$items = self::getItemForProduct('extra_fields', $page_params, ['query_select_field' => "distinct ex.extra_field_".$ch_id." as val", "order" => "ORDER BY val"]);
		$list = [];
        $vals = [];
		foreach($items as $k => $v) {
			if (isset($v) && trim($v)) {
				if (isset($page_params['data']['extra_fiels']['text'][$ch_id]) && in_array($v, $page_params['data']['extra_fiels']['text'][$ch_id])) {
					continue;
				}
				$list[] = (object)['id' => $v, 'name' => $v];
                $vals[] = $v;
			}
		}
        if (isset($filter_active['extra_fields_t'][$ch_id])) {
            foreach($filter_active['extra_fields_t'][$ch_id] as $v) {
                if (!in_array($v, $vals)) {
                    $list[] = (object)['id' => $v, 'name' => $v];
                }
            }
        }
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getLabels($page_params, $filter_active = null) {
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('label', $page_params, $filter_active);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getLabels', [$page_params['data'], $filter_active]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$productLabel = JSFactory::getTable('productLabel');
    	$list = $productLabel->getListLabels();
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('label', $page_params);
		foreach($list as $k => $v) {
			if (isset($page_params['data']['labels']) && in_array($v->id, $page_params['data']['labels'])) {
				unset($list[$k]);
				continue;
			}
            if (isset($filter_active['labels']) && in_array($v->id, $filter_active['labels'])){
                continue;
            }
			if (!in_array($v->id, $items)) {
				if ($params->display_unavailable_value == 1) {
					$list[$k]->disable = 1;
				} else {
					unset($list[$k]);
				}
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getAttributs($page_params, $show_attributes_id, $filter_active = null, $hide_empty = 1) {
		$attribut = JSFactory::getTable('attribut');		
		$listAttribut = $attribut->getAllAttributes(1, ['publish' => 1]);
		foreach($listAttribut as $key=>$value) {
			if ($page_params['controller'] == "category" && isset($page_params['data']['categorys'])) {
				$_display = 0;
				if ($value->allcats){
					$_display = 1; 
				}else{
					foreach($page_params['data']['categorys'] as $v){
						if (in_array($v, $value->cats)){
							$_display = 1;
						}
					}
				}
				if (!$_display) {
					unset($listAttribut[$key]);
					continue;
				}
			}
			if (in_array($value->attr_id, $show_attributes_id) || in_array(0, $show_attributes_id)){
				if ($value->independent) {
					$values_for_attribut = self::getAttributValuesND($value->attr_id, $page_params, $filter_active);
				} else {
					$values_for_attribut = self::getAttributValuesD($value->attr_id, $page_params, $filter_active);
				}
				if ($hide_empty && !count($values_for_attribut)){
					unset($listAttribut[$key]);
					continue;
				}
				$listAttribut[$key]->values = $values_for_attribut;
			} else {
				unset($listAttribut[$key]);
			}
		}
		return $listAttribut;
	}

	public static function getAttributValuesND($aid, $page_params, $filter_active = null) {
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('products_attr2', $page_params, $filter_active, $aid);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getAttributValuesND_'.$aid, [$page_params['data'], $filter_active]);
		$attributvalue = JSFactory::getTable('attributvalue');
		$ordering = null;
		if (modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
			$ordering = 'name';
		}
		$list = $attributvalue->getAllValues($aid, $ordering, ['publish' => 1]);
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('products_attr2', $page_params, ['attr_id' => $aid]);
		foreach($list as $k => $v) {
			if (isset($page_params['data']['attributes']) && in_array($v->value_id, $page_params['data']['attributes'])) {
				unset($list[$k]);
				continue;
			}
            if (isset($filter_active['attribut_active_value']) && in_array($v->value_id, $filter_active['attribut_active_value'])) {
                continue;
            }
			if (!in_array($v->value_id, $items)) {
				if ($params->display_unavailable_value == 1) {
					$list[$k]->disable = 1;
				} else {
					unset($list[$k]);
				}
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getAttributValuesD($aid, $page_params, $filter_active = null) {
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('products_attr', $page_params, $filter_active, $aid);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getAttributValuesD_'.$aid, [$page_params['data'], $filter_active]);
		$jshopConfig = JSFactory::getConfig();
		$attributvalue = JSFactory::getTable('attributvalue');
		$ordering = null;
		if (modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
			$ordering = 'name';
		}
		$list = $attributvalue->getAllValues($aid, $ordering, ['publish' => 1]);
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		
		if ($jshopConfig->hide_product_not_avaible_stock){
			$where = " AND a.count>0 ";
		} else {
			$where = null;
		}
		$items = self::getItemForProduct('products_attr', $page_params, ['query_select_field' => "distinct a.attr_".$aid." as val", "where" => $where]);
		foreach($list as $k => $v) {
			if (isset($page_params['data']['attributes']) && in_array($v->value_id, $page_params['data']['attributes'])) {
				unset($list[$k]);
				continue;
			}
            if (isset($filter_active['attribut_active_value']) && in_array($v->value_id, $filter_active['attribut_active_value'])) {
                continue;
            }
			if (!in_array($v->value_id, $items)) {
				if ($params->display_unavailable_value == 1) {
					$list[$k]->disable = 1;
				} else {
					unset($list[$k]);
				}
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getDeliveryTimes($page_params, $filter_active = null) {		
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('delivery_time', $page_params, $filter_active);
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getDeliveryTimes', [$page_params['data'], $filter_active]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$deliveryTimes = JSFactory::getTable('deliveryTimes');
    	$list = $deliveryTimes->getDeliveryTimes();
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('delivery_time', $page_params);
		foreach($list as $k => $v) {
			if (isset($page_params['data']['delivery_times']) && in_array($v->id, $page_params['data']['delivery_times'])) {
				unset($list[$k]);
				continue;
			}
            if (isset($filter_active['delivery_time_active']) && in_array($v->id, $filter_active['delivery_time_active'])){
                continue;
            }
			if (!in_array($v->id, $items)) {
				if ($params->display_unavailable_value == 1) {
					$list[$k]->disable = 1;
				} else {
					unset($list[$k]);
				}
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getAvailability() {
		$list = [];
		$list[] = (object)['id' => 1, 'name' => Text::_('IN_STOCK')];
		$list[] = (object)['id' => 2, 'name' => Text::_('UNAVAILABLE')];
		return  $list;
	}

	public static function getPhoto() {
		$list = [];
		$list[] = (object)['id' => 1, 'name' => Text::_('With_photo')];
		$list[] = (object)['id' => 2, 'name' => Text::_('Without_photo')];
		return  $list;
	}

	public static function getSets() {
		$list = [];
		$list[] = (object)['id' => 1, 'name' => Text::_('With_sets')];
		$list[] = (object)['id' => 2, 'name' => Text::_('Without_sets')];
		return  $list;
	}

	public static function getReview() {
		$list = [];
		$list[] = (object)['id' => 1, 'name' => Text::_('With_review')];
		$list[] = (object)['id' => 2, 'name' => Text::_('Without_review')];
		return  $list;
	}

	public static function getRating() {
		$jshopConfig = JSFactory::getConfig();
		$list = [];
		for ($i=1; $i<=$jshopConfig->max_mark; $i++) {
			$list[] = (object)['id' => $i, 'name' => modJshopping_filters_extendedHelper::getFilterNameRating($i)];	
		}	
		return  $list;
	}

	public static function getInProductsMaxMinPrice($page_params, $filter_active = null) {		
		if ($filter_active) {
			$page_params = self::getPageParamsPlusActFilterFor('ProductsMaxMinPrice', $page_params, $filter_active);
		}		
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getInProductsMaxMinPrice', $page_params['data']);		
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$items = self::getItemForProduct('product', $page_params);
		$arr = array();
		$minprice = 0;
		$maxprice = 0;
		foreach ($items as $k => $product_id) {
			$prod = JSFactory::getTable('product');
			$prod->load($product_id); 
			$active_price = $prod->getPrice();
			if ($active_price > $maxprice)
				$maxprice = $active_price;
			if ($active_price < $minprice || $k == 0)
				$minprice = $active_price; 
			unset($prod);
		}		
		$arr['min_price'] = (int)$minprice;
		$arr['max_price'] = (int)$maxprice+1;
		$arr['count'] = count($items);
		$cache->set($cache_name, $arr);
		return  $arr;
	}

	public static function getExtraFieldsIdForType($type = 1) {
		$db = Factory::getDbo();
		if ($type == 1) {
			$where = 'type = 1';
		} else {
			$where = 'type != 1';
		}
		$query = 'SELECT id FROM `#__jshopping_products_extra_fields` WHERE '.$where;
		$db->setQuery($query);
		return $db->loadColumn();
	}

	public static function getCategoryChildrenAnyNode($id){
        $db = Factory::getDBO();
        if ($id==0){
            return NULL;
        }
        $ids = $id;
        $all_ids = Array();
        $all_ids[] = $ids;
        do{
            $query = "SELECT category_id FROM #__jshopping_categories WHERE category_parent_id IN ($ids)";
            $db->setQuery($query);
            $cats = $db->loadObjectList();

            $arr_ids = Array();
            if ( count($cats) > 0 ){
                foreach ($cats as $c) {
                    $arr_ids[] = $c->category_id;
                    $all_ids[] = $c->category_id;
                }
            }
            $ids = implode(",", $arr_ids);
        }
        while ( count($cats) > 0 );
        
        return $all_ids;
    }

	public static function getCategoryImages() {
		$db = Factory::getDBO();
		$query = "SELECT category_id, category_image FROM #__jshopping_categories";
		$db->setQuery($query);
		return $db->loadObjectList('category_id');
	}

	public static function getExtraFieldValuesDB($ch_id, $ordering = null) {
		$db = Factory::getDBO();
        $lang = JSFactory::getLang(); 
        $query = "SELECT id, `".$lang->get("name")."` as name FROM `#__jshopping_products_extra_field_values`
			WHERE `field_id`=".$db->q($ch_id)." AND `publish`=1 ";
		if (!$ordering) {
			$ordering = 'ordering';
		}
		$query .= "ORDER BY ".$db->qn($ordering);		
        $db->setQuery($query);        
        return $db->loadObJectList('id');
	}

	public static function getAttributeValuesIdByAttr($aid) {
		$attributvalue = JSFactory::getTable('attributvalue');		
		$_vals = $attributvalue->getAllValues($aid);
		$vals = [];
		foreach($_vals as $_av) {
			$vals[] = $_av->value_id;
		}
		return $vals;
	}

	public static function fixListForMultiExtraFields($list){
		$res = [];
		foreach($list as $v) {
			if ($v) {
				$vals = explode(',', $v);
				foreach($vals as $item) {
					if (!in_array($item, $res)) {
						$res[] = $item;
					}
				}
			} else {
				$res[] = $v;
			}
		}
		return $res;
	}

}