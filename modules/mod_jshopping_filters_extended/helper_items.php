<?php
defined('_JEXEC') or die;

class modJshopping_filters_extendedHelperItems
{

	public static function getItemForProduct($res_type, $page_params, $options = [])
	{
		$db = \JFactory::getDbo();
		$app = JFactory::getApplication();
		$user = \JFactory::getUser();
		$jshopConfig = \JSFactory::getConfig();
		$groups = implode(',', $user->getAuthorisedViewLevels());
		$join = [];
		$where = ' AND p.access IN (' . $groups . ')';
		if (isset($options['where'])) {
			$where .= " " . $options['where'];
		}
		if ($jshopConfig->hide_product_not_avaible_stock) {
			$where .= " AND (p.product_quantity > '0' OR  p.unlimited = '1') ";
		}
		if (isset($page_params['data']['categorys'])) {
			$join['pc'] = " LEFT JOIN `#__jshopping_products_to_categories` as pc ON (pc.product_id=p.product_id) ";
			$where .= " AND pc.category_id IN (" . implode(',', $page_params['data']['categorys']) . ") ";
		}
		if (isset($page_params['data']['manufacturers'])) {
			$where .= " AND p.product_manufacturer_id IN (" . implode(',', $page_params['data']['manufacturers']) . ") ";
		}
		if (isset($page_params['data']['vendors'])) {
			$join['v'] = " LEFT JOIN `#__jshopping_vendors` as v on (p.vendor_id=v.id OR (p.vendor_id=0 AND v.main=1) ) ";
			$where .= " AND v.id IN (" . implode(',', $page_params['data']['vendors']) . ") ";
		}
		if (isset($page_params['data']['labels'])) {
			$where .= " AND p.label_id IN (" . implode(',', $page_params['data']['labels']) . ") ";
		}
		if (isset($page_params['data']['delivery_times'])) {
			$where .= " AND p.delivery_times_id IN (" . implode(',', $page_params['data']['delivery_times']) . ") ";
		}
		if (isset($page_params['data']['photo_filter'])) {
			if ($page_params['data']['photo_filter'] == '1')
				$where .= " AND p.image != '' ";
			if ($page_params['data']['photo_filter'] == '2')
				$where .= " AND p.image = '' ";
		}
		if (isset($page_params['data']['review_filter'])) {
			if ($page_params['data']['review_filter'] == '1')
				$where .= " AND p.reviews_count > 0 ";
			if ($page_params['data']['review_filter'] == '2')
				$where .= " AND p.reviews_count = 0 ";
		}
		if (isset($page_params['data']['quantity_filter'])) {
			if ($page_params['data']['quantity_filter'] == '1')
				$where .= " AND (p.product_quantity > '0' OR  p.unlimited = '1') ";
			if ($page_params['data']['quantity_filter'] == '2')
				$where .= " AND (p.product_quantity = '0' AND p.unlimited = '0') ";
		}
		if (isset($page_params['data']['rating_filter'])) {
			$where .= " AND p.average_rating >=" . (int) $page_params['data']['rating_filter'] . " ";
		}
		if (isset($page_params['data']['show_products_with_old_prices'])) {
			$where .= " AND p.product_old_price > 0 ";
		}
		if (isset($page_params['data']['fprice_from'])) {
			$join['cr'] = " LEFT JOIN `#__jshopping_currencies` AS cr USING (currency_id) ";
			$where .= " AND (p.product_price / cr.currency_value) >= " . (int) $page_params['data']['fprice_from'] . " ";
		}
		if (isset($page_params['data']['fprice_to'])) {
			$join['cr'] = " LEFT JOIN `#__jshopping_currencies` AS cr USING (currency_id) ";
			$where .= " AND (p.product_price / cr.currency_value) <= " . (int) $page_params['data']['fprice_to'] . " ";
		}
		if (isset($page_params['data']['show_products_with_free_shipping'])) {
			$join['cr'] = " LEFT JOIN `#__jshopping_currencies` AS cr USING (currency_id) ";
			$where .= " AND (p.product_price / cr.currency_value) > " . $jshopConfig->summ_null_shipping . " ";
		}
		if (isset($page_params['data']['extra_fiels'])) {
			$join['ex'] = " LEFT JOIN `#__jshopping_products_to_extra_fields` as ex ON ex.product_id = p.product_id ";
			if (count($page_params['data']['extra_fiels']['list'])) {
				foreach ($page_params['data']['extra_fiels']['list'] as $f_id => $vals) {
					if (is_array($vals) && count($vals)) {
						$tmp = array();
						foreach ($vals as $val_id) {
							$tmp[] = " find_in_set('" . $db->escape($val_id) . "', ex.`extra_field_" . (int) $f_id . "`) ";
						}
						$mchfilterlogic = 'OR';
						if (isset($jshopConfig->mchfilterlogic_and[$f_id]) && $jshopConfig->mchfilterlogic_and[$f_id])
							$mchfilterlogic = 'AND';
						$app->triggerEvent('onGetItemForProductFiltersExtendedHelperExtraFiels', array(&$tmp, &$f_id, &$vals, &$mchfilterlogic, &$join, &$where, &$page_params));
						$_tmp_adv_query = implode(' ' . $mchfilterlogic . ' ', $tmp);
						$where .= " AND (" . $_tmp_adv_query . ")";
					} elseif (is_string($vals) && $vals != "") {
						$where .= " AND ex.`extra_field_" . (int) $f_id . "`='" . $db->escape($vals) . "'";
					}
				}
			}
			if (count($page_params['data']['extra_fiels']['text'])) {
				foreach ($page_params['data']['extra_fiels']['text'] as $f_id => $vals) {
					if (is_array($vals) && count($vals)) {
						$tmp = array();
						foreach ($vals as $val) {
							$tmp[] = " ex.`extra_field_" . (int) $f_id . "`='" . $db->escape($val) . "'";
						}
						$mchfilterlogic = 'OR';
						if (isset($jshopConfig->mchfilterlogic_and[$f_id]) && $jshopConfig->mchfilterlogic_and[$f_id])
							$mchfilterlogic = 'AND';
						$_tmp_adv_query = implode(' ' . $mchfilterlogic . ' ', $tmp);
						$where .= " AND (" . $_tmp_adv_query . ")";
					}
				}
			}
		}
		if (isset($page_params['data']['attributes'])) {
			$prod_by_attributs = modJshopping_filters_extendedHelper::getProductIdByAttributeVals($page_params['data']['attributes']);
			if (count($prod_by_attributs) > 0) {
				$where .= " AND p.product_id in (" . implode(",", $prod_by_attributs) . ") ";
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
			$select = $options['query_select_field'];
			$join['ex'] = " LEFT JOIN `#__jshopping_products_to_extra_fields` as ex ON ex.product_id = p.product_id ";
		}
		if ($res_type == 'products_attr2') {
			$select = 'distinct a2.attr_value_id as id';
			$join['a2'] = " LEFT JOIN `#__jshopping_products_attr2` as a2 ON a2.product_id=p.product_id ";
		}
		if ($res_type == 'products_attr') {
			$select = $options['query_select_field'];
			$join['a'] = " LEFT JOIN `#__jshopping_products_attr` as a ON a.product_id=p.product_id ";
		}
		$app->triggerEvent('onGetItemForProductFiltersExtendedHelperBeforeQuery', array(&$join, &$where, &$res_type, &$page_params, &$options, &$select));
		$query = "SELECT " . $select . " FROM `#__jshopping_products` as p "
			. implode(' ', $join)
			. " WHERE p.product_publish='1' "
			. $where;
		if (isset($options['order'])) {
			$query .= " " . $options['order'];
		}
		$db->setQuery($query);
		if (isset($options['res_loadObjectList'])) {
			$res = $db->loadObjectList();
		} else {
			$res = $db->loadColumn();
		}
		return $res;
	}

	// public static function getManufacturers($page_params) {
	// 	$cache = filterExtCache::getInstance();
	// 	$cache_name = $cache->getCacheName('getManufacturers', $page_params['data']);
	// 	if ($res = $cache->get($cache_name)) {
	// 		return $res;
	// 	}
	// 	$jshopConfig = \JSFactory::getConfig();
	// 	$_manufacturers = \JSFactory::getTable('manufacturer');  
	// 	$ordering = $jshopConfig->manufacturer_sorting==1 ? 'ordering' : 'name';
	// 	if (modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
	// 		$ordering = 'name';
	// 	}
	// 	$list = $_manufacturers->getAllManufacturers(1, $ordering);
	// 	foreach ($list as $k => $v) {
	// 		$list[$k]->id = $list[$k]->manufacturer_id;
	// 	}
	// 	$params = modJshopping_filters_extendedHelper::getModuleParams();
	// 	$items = self::getItemForProduct('manufacturer', $page_params);		
	// 	foreach($list as $k => $v) {
	// 		if (isset($page_params['data']['manufacturers']) && in_array($v->id, $page_params['data']['manufacturers'])) {
	// 			unset($list[$k]);
	// 			continue;
	// 		}
	// 		if (!in_array($v->id, $items)) {
	// 			if ($params->display_unavailable_value == 1) {
	// 				$list[$k]->disable = 1;
	// 			} else {
	// 				unset($list[$k]);
	// 			}
	// 		}
	// 	}
	// 	$cache->set($cache_name, $list);
	// 	return $list;
	// }
	public static function getManufacturers($page_params)
	{
		// var_dump($page_params);die;//array(6) { ["controller"]=> string(8) "category" ["task"]=> string(4) "view" ["category_id"]=> int(75) ["manufacturer_id"]=> int(0) ["vendor_id"]=> int(0) ["data"]=> array(1) { ["categorys"]=> array(1) { [0]=> int(75) } } }
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getManufacturers', $page_params['data']);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}

		$jshopConfig = \JSFactory::getConfig();
		$_manufacturers = \JSFactory::getTable('manufacturer');
		$ordering = $jshopConfig->manufacturer_sorting == 1 ? 'ordering' : 'name';
		if (modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
			$ordering = 'name';
		}

		$list = $_manufacturers->getAllManufacturers(1, $ordering);
		foreach ($list as $k => $v) {
			$list[$k]->id = $list[$k]->manufacturer_id;
		}

		$db = \JFactory::getDbo();
		$categoryId = (int) ($page_params['category_id'] ?? 0);

		$query = $db->getQuery(true)
			->select('p.product_manufacturer_id, COUNT(*) as count')
			->from($db->qn('#__jshopping_products', 'p'))
			->innerJoin($db->qn('#__jshopping_products_to_categories', 'pc') . ' ON pc.product_id = p.product_id')
			->where('pc.category_id = ' . $categoryId)
			->group('p.product_manufacturer_id');
		$db->setQuery($query);
		$counts = $db->loadAssocList('product_manufacturer_id');

		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('manufacturer', $page_params);

		foreach ($list as $k => $v) {
			$v->product_count = isset($counts[$v->id]) ? (int) $counts[$v->id]['count'] : 0;

			if (isset($page_params['data']['manufacturers']) && in_array($v->id, $page_params['data']['manufacturers'])) {
				unset($list[$k]);
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

	public static function getCategorys($page_params, $show_categorys_in_category = 0)
	{
		if (($page_params['controller'] == 'category' && $page_params['category_id']) && $show_categorys_in_category == 0) {
			return [];
		}
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getCategorys', [$page_params['data'], $show_categorys_in_category]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$list = \JSHelper::buildTreeCategory(1);
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
				$list[$k]->name = ltrim($v->name, '-- ');
				if (!in_array($v->id, $items)) {
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

	public static function getVendors($page_params)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getVendors', $page_params['data']);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$vendor = \JSFactory::getTable('vendor');
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
			if (!in_array($v->id, $items)) {
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

	public static function getCharacteristics($page_params, $show_characteristics_id, $show_text_ch_as_list)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getCharacteristics', [$page_params['data'], $show_characteristics_id]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$characteristic_fields = \JSFactory::getAllProductExtraField();
		if (!in_array(0, $show_characteristics_id)) {
			foreach ($characteristic_fields as $k => $val) {
				if (!in_array($val->id, $show_characteristics_id)) {
					unset($characteristic_fields[$k]);
				}
			}
		}
		if ($page_params['controller'] == "category" && isset($page_params['data']['categorys'])) {
			foreach ($characteristic_fields as $k => $val) {
				$_display = 0;
				if ($val->allcats) {
					$_display = 1;
				} else {
					foreach ($page_params['data']['categorys'] as $v) {
						if (in_array($v, $val->cats)) {
							$_display = 1;
						}
					}
				}
				if (!$_display)
					unset($characteristic_fields[$k]);
			}
		}

		$values = self::getCharacteristicsValuesT0($page_params, $show_characteristics_id);
		if ($show_text_ch_as_list) {
			$list_ch_text = self::getListCharacteristicTextVal($page_params, $show_characteristics_id);
		} else {
			$fieldtextInProducts = self::getInProductsCharacteristicText($page_params, $show_characteristics_id);
		}
		foreach ($characteristic_fields as $k => $val) {
			if (isset($values[$k])) {
				$characteristic_fields[$k]->values = $values[$k];
				foreach ($characteristic_fields[$k]->values as $k2 => $v2) {
					$characteristic_fields[$k]->values[$k2]->image = modJshopping_filters_extendedHelper::getCharactiristicValueImage($v2->id);
				}
			} elseif (isset($list_ch_text[$k])) {
				$characteristic_fields[$k]->values = $list_ch_text[$k];
			} elseif (isset($fieldtextInProducts) && in_array($k, $fieldtextInProducts)) {
				$characteristic_fields[$k]->use_as_text = 1;
			}
			if (!isset($characteristic_fields[$k]->values) && !isset($characteristic_fields[$k]->use_as_text)) {
				unset($characteristic_fields[$k]);
			}
			if (isset($characteristic_fields[$k]->values) && modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
				uasort($characteristic_fields[$k]->values, function ($a, $b) {
					return $a->name <=> $b->name;
				});
			}
		}
		$cache->set($cache_name, $characteristic_fields);
		return $characteristic_fields;
	}

	public static function getCharacteristicsValuesT0($page_params, $show_characteristics_id)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getCharacteristicsValuesT0', [$page_params['data'], $show_characteristics_id]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$list = JSFactory::getAllProductExtraFieldValueDetail();
		foreach ($list as $k => $ch_vals) {
			foreach ($ch_vals as $chv_id => $chv_name) {
				$list[$k][$chv_id] = new stdClass();
				$list[$k][$chv_id]->id = $chv_id;
				$list[$k][$chv_id]->name = $chv_name;
			}
		}

		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getInProductsCharacteristicT0($page_params, $show_characteristics_id);

		foreach ($list as $k => $ch_vals) {
			foreach ($ch_vals as $chv_id => $chv_name) {
				if (isset($page_params['data']['extra_fiels']['list'][$k]) && in_array($chv_id, $page_params['data']['extra_fiels']['list'][$k])) {
					unset($list[$k][$chv_id]);
					continue;
				}
				if (!in_array($chv_id, $items)) {
					if ($params->display_unavailable_value == 1) {
						$list[$k][$chv_id]->disable = 1;
					} else {
						unset($list[$k][$chv_id]);
					}
				}
			}
			if (!count($list[$k])) {
				unset($list[$k]);
			}
		}
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getListCharacteristicTextVal($page_params, $show_characteristics_id)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getListCharacteristicTextVal', [$page_params['data'], $show_characteristics_id]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$_list_extrafields = self::getExtraFieldsIdForType(1);
		if (count($_list_extrafields) == 0)
			return [];
		$rows = [];
		foreach ($_list_extrafields as $id) {
			$items = self::getItemForProduct(
				'extra_fields',
				$page_params,
				['query_select_field' => "distinct `extra_field_" . $id . "` as val", "order" => "ORDER BY val"],
			);
			foreach ($items as $v) {
				if (isset($v) && trim($v) != '') {
					if (isset($page_params['data']['extra_fiels']['text'][$id]) && in_array($v, $page_params['data']['extra_fiels']['text'][$id])) {
						continue;
					}
					if (!isset($rows[$id]))
						$rows[$id] = [];
					$rows[$id][] = (object) ['id' => $v, 'name' => $v];
				}
			}
		}
		$cache->set($cache_name, $rows);
		return $rows;
	}

	public static function getLabels($page_params)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getLabels', $page_params['data']);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$productLabel = \JSFactory::getTable('productLabel');
		$list = $productLabel->getListLabels();
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('label', $page_params);
		foreach ($list as $k => $v) {
			if (isset($page_params['data']['labels']) && in_array($v->id, $page_params['data']['labels'])) {
				unset($list[$k]);
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

	public static function getAttributs($page_params, $show_attributes_id)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getAttributs', [$page_params['data'], $show_attributes_id]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$attribut = \JSFactory::getTable('attribut');
		$attributvalue = \JSFactory::getTable('attributvalue');
		$listAttribut = $attribut->getAllAttributes();

		$attr_val_ordering = null;
		if (modJshopping_filters_extendedHelper::getModuleParamsAlphabet_sorting()) {
			$attr_val_ordering = 'name';
		}

		foreach ($listAttribut as $key => $value) {
			if ($page_params['controller'] == "category" && isset($page_params['data']['categorys'])) {
				$_display = 0;
				if ($value->allcats) {
					$_display = 1;
				} else {
					foreach ($page_params['data']['categorys'] as $v) {
						if (in_array($v, $value->cats)) {
							$_display = 1;
						}
					}
				}
				if (!$_display) {
					unset($listAttribut[$key]);
					continue;
				}
			}

			if (in_array($value->attr_id, $show_attributes_id) || in_array(0, $show_attributes_id)) {
				$values_for_attribut = $attributvalue->getAllValues($value->attr_id, $attr_val_ordering);
				if (!count($values_for_attribut)) {
					unset($listAttribut[$key]);
					continue;
				}
				$listAttribut[$key]->values = $values_for_attribut;
			} else {
				unset($listAttribut[$key]);
			}
		}

		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getInProductsAttribut($page_params, $show_attributes_id);
		foreach ($listAttribut as $k => $attr) {
			foreach ($attr->values as $k2 => $attr_values) {
				if (isset($page_params['data']['attributes']) && in_array($attr_values->value_id, $page_params['data']['attributes'])) {
					unset($listAttribut[$k]->values[$k2]);
					continue;
				}
				if (!in_array($attr_values->value_id, $items)) {
					if ($params->display_unavailable_value == 1) {
						$listAttribut[$k]->values[$k2]->disable = 1;
					} else {
						unset($listAttribut[$k]->values[$k2]);
					}
				}
			}
		}
		foreach ($listAttribut as $k => $attr) {
			if (!count($attr->values)) {
				unset($listAttribut[$k]);
			}
		}
		$cache->set($cache_name, $listAttribut);
		return $listAttribut;
	}

	public static function getDeliveryTimes($page_params)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getDeliveryTimes', $page_params['data']);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$deliveryTimes = \JSFactory::getTable('deliveryTimes');
		$list = $deliveryTimes->getDeliveryTimes();
		$params = modJshopping_filters_extendedHelper::getModuleParams();
		$items = self::getItemForProduct('delivery_time', $page_params);
		foreach ($list as $k => $v) {
			if (isset($page_params['data']['delivery_times']) && in_array($v->id, $page_params['data']['delivery_times'])) {
				unset($list[$k]);
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

	public static function getAvailability()
	{
		$list = [];
		$list[] = (object) ['id' => 1, 'name' => \JText::_('IN_STOCK')];
		$list[] = (object) ['id' => 2, 'name' => \JText::_('UNAVAILABLE')];
		return $list;
	}

	public static function getPhoto()
	{
		$list = [];
		$list[] = (object) ['id' => 1, 'name' => \JText::_('With_photo')];
		$list[] = (object) ['id' => 2, 'name' => \JText::_('Without_photo')];
		return $list;
	}

	public static function getSets()
	{
		$list = [];
		$list[] = (object) ['id' => 1, 'name' => \JText::_('With_sets')];
		$list[] = (object) ['id' => 2, 'name' => \JText::_('Without_sets')];
		return $list;
	}

	public static function getReview()
	{
		$list = [];
		$list[] = (object) ['id' => 1, 'name' => \JText::_('With_review')];
		$list[] = (object) ['id' => 2, 'name' => \JText::_('Without_review')];
		return $list;
	}

	public static function getRating()
	{
		$jshopConfig = \JSFactory::getConfig();
		$list = [];
		for ($i = 1; $i <= $jshopConfig->max_mark; $i++) {
			$list[] = (object) ['id' => $i, 'name' => modJshopping_filters_extendedHelper::getFilterNameRating($i)];
		}
		return $list;
	}

	public static function getInProductsMaxMinPrice($page_params)
	{
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
			$prod = \JSFactory::getTable('product');
			$prod->load($product_id);
			$active_price = $prod->getPrice();
			if ($active_price > $maxprice)
				$maxprice = $active_price;
			if ($active_price < $minprice || $k == 0)
				$minprice = $active_price;
			unset($prod);
		}
		$arr['min_price'] = (int) $minprice;
		$arr['max_price'] = (int) $maxprice + 1;
		$arr['count'] = count($items);
		$cache->set($cache_name, $arr);
		return $arr;
	}

	public static function getListExtraFieldInProduct($page_params, $show_characteristics_id, $_list_extrafields)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getListExtraFieldInProduct', [$page_params['data'], $show_characteristics_id, $_list_extrafields]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$app = JFactory::getApplication();
		$tmp = array();
		foreach ($_list_extrafields as $key => $_extrafield_id) {
			if (in_array($_extrafield_id, $show_characteristics_id) || in_array(0, $show_characteristics_id)) {
				$tmp[] = "ex.extra_field_" . $_extrafield_id;
			}
		}
		$app->triggerEvent('onGetListExtraFieldInProductFiltersExtendedHelper', array(&$tmp, &$page_params, &$show_characteristics_id, &$_list_extrafields));
		if (count($tmp) == 0) {
			return array();
		}
		$query_field_product = "distinct " . implode(", ", $tmp);
		$list = self::getItemForProduct(
			'extra_fields',
			$page_params,
			['query_select_field' => $query_field_product, 'res_loadObjectList' => 1]
		);
		$cache->set($cache_name, $list);
		return $list;
	}

	public static function getInProductsCharacteristicT0($page_params, $show_characteristics_id)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getInProductsCharacteristicT0', [$page_params['data'], $show_characteristics_id]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$_list_extrafields = self::getExtraFieldsIdForType(0);
		if (count($_list_extrafields) == 0)
			return array();
		$list_product_extra_fields = self::getListExtraFieldInProduct($page_params, $show_characteristics_id, $_list_extrafields);
		$_list_active_values = array();
		foreach ($list_product_extra_fields as $fieldsval) {
			$test = array();
			foreach ($fieldsval as $k => $v) {
				if ($v != '') {
					$test[] = $v;
				}
			}
			if (count($test)) {
				$_list_active_values = array_merge($_list_active_values, array(implode(',', $test)));
			}
		}
		$_list_active_values = array_unique($_list_active_values);

		$list_active_values = array();
		foreach ($_list_active_values as $k => $v) {
			$list_active_values = array_merge($list_active_values, explode(",", $v));
		}
		$list_active_values = array_unique($list_active_values);
		$cache->set($cache_name, $list_active_values);
		return $list_active_values;
	}

	public static function getInProductsCharacteristicText($page_params, $show_characteristics_id)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getInProductsCharacteristicText', [$page_params['data'], $show_characteristics_id]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$_list_extrafields = self::getExtraFieldsIdForType(1);
		if (count($_list_extrafields) == 0)
			return array();
		$list_product_extra_fields = self::getListExtraFieldInProduct($page_params, $show_characteristics_id, $_list_extrafields);
		$_list_active_values = array();
		foreach ($list_product_extra_fields as $fieldsval) {
			$test = array();
			foreach ($_list_extrafields as $v) {
				if ($fieldsval->{'extra_field_' . $v} != '') {
					$test[] = $v;
				}
			}
			if (count($test)) {
				$_list_active_values = array_merge($_list_active_values, array(implode(',', $test)));
			}
		}
		$_list_active_values = array_unique($_list_active_values);
		$list_active_values = array();
		foreach ($_list_active_values as $k => $v) {
			$list_active_values = array_merge($list_active_values, explode(",", $v));
		}
		$list_active_values = array_unique($list_active_values);
		$cache->set($cache_name, $list_active_values);
		return $list_active_values;
	}

	public static function getExtraFieldsIdForType($type = 1)
	{
		$db = \JFactory::getDbo();
		if ($type == 1) {
			$where = 'type = 1';
		} else {
			$where = 'type != 1';
		}
		$query = 'SELECT id FROM `#__jshopping_products_extra_fields` WHERE ' . $where;
		$db->setQuery($query);
		return $db->loadColumn();
	}

	public static function getInProductsAttribut($page_params, $show_attributes_id)
	{
		$cache = filterExtCache::getInstance();
		$cache_name = $cache->getCacheName('getInProductsAttribut', [$page_params['data'], $show_attributes_id]);
		if ($res = $cache->get($cache_name)) {
			return $res;
		}
		$db = \JFactory::getDbo();
		$jshopConfig = JSFactory::getConfig();

		$arr_independent = self::getItemForProduct('products_attr2', $page_params);

		//depended
		$query = "SELECT `attr_id` FROM `#__jshopping_attr` WHERE `independent`='0'";
		$db->setQuery($query);
		$alldependattr = $db->loadColumn();

		$arr_dependent = [];
		if ($jshopConfig->hide_product_not_avaible_stock) {
			$where = " AND a.count>0 ";
		} else {
			$where = null;
		}

		foreach ($alldependattr as $attr) {
			if (in_array($attr, $show_attributes_id) || in_array(0, $show_attributes_id)) {
				$tmplist = self::getItemForProduct(
					'products_attr',
					$page_params,
					['query_select_field' => "distinct a.attr_" . $attr . " as val", "where" => $where],
				);
				$arr_dependent = array_merge($arr_dependent, $tmplist);
			}
		}
		$arr_dependent = array_unique($arr_dependent);

		$res = array_merge($arr_independent, $arr_dependent);
		$cache->set($cache_name, $res);
		return $res;
	}

	public static function getCategoryChildrenAnyNode($id)
	{
		$db = \JFactory::getDBO();
		if ($id == 0) {
			return NULL;
		}
		$ids = $id;
		$all_ids = array();
		$all_ids[] = $ids;
		do {
			$query = "SELECT category_id FROM #__jshopping_categories WHERE category_parent_id IN ($ids)";
			$db->setQuery($query);
			$cats = $db->loadObjectList();

			$arr_ids = array();
			if (count($cats) > 0) {
				foreach ($cats as $c) {
					$arr_ids[] = $c->category_id;
					$all_ids[] = $c->category_id;
				}
			}
			$ids = implode(",", $arr_ids);
		}
		while (count($cats) > 0);

		return $all_ids;
	}

	public static function getCategoryImages()
	{
		$db = \JFactory::getDBO();
		$query = "SELECT category_id, category_image FROM #__jshopping_categories";
		$db->setQuery($query);
		return $db->loadObjectList('category_id');
	}

}