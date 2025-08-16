<?php
defined('_JEXEC') or die;
include_once JPATH_SITE.'/components/com_jshopping/bootstrap.php';
include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/helper_url.php";

class modJshopping_filters_extendedHelper {

	public static function getPageParams() {
		$session = JFactory::getSession();
		$jinput = \JFactory::getApplication()->input;
		$task = $jinput->get('task');
		$controller = $jinput->get("controller");
		if (!$controller) $controller = $jinput->get("view");
		if ($task=="") $task = "display";
		$category_id = $jinput->getInt('category_id', 0);
		$manufacturer_id = $jinput->getInt('manufacturer_id', 0);
		$vendor_id = $jinput->getInt("vendor_id", 0);
		$label_id = $jinput->getInt('label_id', 0);		
		$price_from = $jinput->getInt('price_from', 0);
		$price_to = $jinput->getInt('price_to', 0);

		$data = [];
		if ($category_id) {
			$data['categorys'] = [$category_id];
			//addon Product category and subcategory
			if (class_exists('plgJshoppingAllproducts') && plgJshoppingAllproducts::$active_subcats && count(plgJshoppingAllproducts::$active_subcats)) {
				$data['categorys'] = array_merge($data['categorys'], plgJshoppingAllproducts::$active_subcats);
				$data['categorys'] = array_unique($data['categorys']);
			}
		}
		if ($controller == "category" && $category_id && !$session->get('show_mod_in_category')) {
			/* show filter data for empty category */
			unset($data['categorys']);
		}
		if ($manufacturer_id) {
			$data['manufacturers'] = [$manufacturer_id];
		}
		if ($vendor_id) {
			$data['vendors'] = [$vendor_id];
		}
		if ($label_id) {
			$data['labels'] = [$label_id];
		}
		if ($price_from) {
			$data['fprice_from'] = $price_from;
		}
		if ($price_to) {
			$data['fprice_to'] = $price_to;
		}
		$params = \JFactory::getApplication()->getParams();		
		if ($params->get('categorys')) $data['categorys'] = $params->get('categorys');
		if ($params->get('manufacturers')) $data['manufacturers'] = $params->get('manufacturers');
		if ($params->get('labels')) $data['labels'] = $params->get('labels');
		if ($params->get('vendors')) $data['vendors'] = $params->get('vendors');
		if ($params->get('delivery_times')) $data['delivery_times'] = $params->get('delivery_times');
		if ($params->get('photo_filter')) $data['photo_filter'] = $params->get('photo_filter');
		if ($params->get('quantity_filter')) $data['quantity_filter'] = $params->get('quantity_filter');
		if ($params->get('review_filter')) $data['review_filter'] = $params->get('review_filter');
		if ($params->get('show_products_with_old_prices')) $data['show_products_with_old_prices'] = $params->get('show_products_with_old_prices');
		if ($params->get('show_products_with_free_shipping')) $data['show_products_with_free_shipping'] = $params->get('show_products_with_free_shipping');
		if ($params->get('rating_filter')) $data['rating_filter'] = $params->get('rating_filter');
		if ($params->get('fprice_from')) $data['fprice_from'] = $params->get('fprice_from');
		if ($params->get('fprice_to')) $data['fprice_to'] = $params->get('fprice_to');
		if ($params->get('extra_fiels')) $data['extra_fiels'] = self::getDefaultFilterExtra_fiels();
		if ($params->get('attributes')) $data['attributes'] = $params->get('attributes');
		$res = [
			'controller' => $controller,
			'task' => $task,
			'category_id'=> $category_id,
			'manufacturer_id' => $manufacturer_id,
			'vendor_id' => $vendor_id,
			'data' => $data
		];
		return $res;
	}

	public static function thisPageCanUsefilter($page_params) {
		$session = JFactory::getSession();
		$task = $page_params['task'];
		$controller = $page_params['controller'];
		$category_id = $page_params['category_id'];
		$manufacturer_id = $page_params['manufacturer_id'];
		$vendor_id = $page_params['vendor_id'];

		if (($controller=="category" && $category_id && $session->get('show_mod_in_category')) ||
			($controller=="manufacturer" && $manufacturer_id) ||
			($controller=="vendor" && $vendor_id) ||
			($controller=="products" && ($task=="display" || $task=="label")) ||
			($controller=="productsfilter")
		){
			return 1;
		} else {
			return 0;
		}
	}

	public static function disable_mod_for_controllers($page_params, $disable_mod_for_controllers) {
		if ($disable_mod_for_controllers == '') {
			return 0;
		}
		$disable_mod_for_controllers_list = explode(',', $disable_mod_for_controllers);
		$disable_mod_for_controllers_list = array_map('trim', $disable_mod_for_controllers_list);
		if (in_array($page_params['controller'], $disable_mod_for_controllers_list)) {
			return 1;
		}
		return 0;
	}
	
	public static function getTemplateStaticTextTemplate($alias){
		$staticText = static::getStaticTextByAlias($alias);
		return static::renderTemplateTooltip($staticText);
	}

	protected static function getStaticTextByAlias($alias){
		$db = \JFactory::getDBo();
		$JSlangCode = JSFactory::getLang()->lang;
		$sqlGetStaticTextTitle = 'SELECT `text_' . $JSlangCode . '` FROM `#__jshopping_config_statictext` WHERE `alias` = '.$db->q($alias);
		$db->setQuery($sqlGetStaticTextTitle);
		return $db->loadResult();
	}

	protected static function renderTemplateTooltip($text = null) {
		if ( empty($text) ) {
			return;
		}
		$pathToTemplate = __DIR__ . '/tmpl/_tooltip.php';
		ob_start();
			include $pathToTemplate;
			$content = ob_get_contents();
		ob_end_clean();
		return $content;
	}

	public static function addScrollingClass(array $listItems, $scrollingLimit = null) {
	    $params = static::getModuleParams();
	    if ( empty($scrollingLimit) ) {
	        $scrollingLimit = $params->filter_scrolling_number;
	    }
	    if ( count($listItems) > $scrollingLimit && !empty($scrollingLimit) ) {
	        return 'filters-scrolling';           
	    }
	}

	public static function getModuleParams(){
		static $res;
		if (!isset($res)){
			$db = \JFactory::getDbo();
			$sql = "SELECT `params` FROM `#__modules` WHERE `module` = 'mod_jshopping_filters_extended' and `published`=1";
			$db->setQuery($sql);
			$result = $db->loadResult();
			if ($result) {
				$res = json_decode($result);
			} else {
				$res = new stdClass();
			}
			$res->filter_reset = $res->filter_reset ?? 0;
			$res->show_filter_active = $res->show_filter_active ?? 0;
			
		}
		return $res;
	}

	public static function getModuleParamsfilter_only_url() {
		static $get_filter_only_url;
        if (!isset($get_filter_only_url)) {
            $params = self::getModuleParams();
            $get_filter_only_url = $params->get_filter_only_url ?? 0;
            if (isset($params->ajax_view) && $params->ajax_view) {
                $get_filter_only_url = 0;
            }
        }
        return $get_filter_only_url;
	}

	public static function getModuleParamsAlphabet_sorting() {
		$params = self::getModuleParams();
		return $params->alphabet_sorting ?? 0;
	}

    static function getFilterNameAvailability($val){
        if ($val==1){
            return \JText::_('In_stock');
        }elseif ($val==2){
            return \JText::_('UNAVAILABLE');
        }else{
            return '';
        }
    }

    static function getFilterNameFoto($val){
        if ($val==1){
            return \JText::_('With_photo');
        }elseif ($val==2){
            return \JText::_('Without_photo');
        }else{
            return '';
        }
    }

    static function getFilterNameReview($val){
        if ($val==1){
            return \JText::_('With_review');
        }elseif ($val==2){
            return \JText::_('Without_review');
        }else{
            return '';
        }
    }

    static function getFilterNameRating($val){
        $jshopConfig = JSFactory::getConfig();
        $rating_filter_name = $val;
        if ($val < $jshopConfig->max_mark){
            $rating_filter_name.=' +';
        }
        return $rating_filter_name;
    }
    
    static function getAddonParams(){
        static $params;
        if (!isset($params)){
            $addon = \JSFactory::getTable('addon');
            $addon->loadAlias('filters_extended');
            $params = $addon->getParams();
        }
        return $params;
    }

    static function getModHint($type, $id){
        $lang = JFactory::getLanguage()->getTag();
        $params = self::getAddonParams();
        if (isset($params[$type][$id][$lang])){
            return $params[$type][$id][$lang];
        }else{
            return '';
        }
    }

    static function getCategoryNames($cats_ids = array()){
        $db = \JFactory::getDBO();
        if (!count($cats_ids)){
            return array();
        }
        $lang = JSFactory::getLang();
        $query = "SELECT distinct cat.category_id as id, cat.`".$lang->get('name')."` as name FROM `#__jshopping_categories` as cat
                  WHERE cat.category_id in (".implode(',', $cats_ids).")
                  order by name";
        $db->setQuery($query);
        return $db->loadObjectList();
    }
	
	static function getListCharactiristicImage(){
		static $characteristic_images;
		if (!isset($characteristic_images)){
			$db = \JFactory::getDBO();
			$query = "SELECT id, image FROM `#__jshopping_products_extra_fields`";
			$db->setQuery($query);
			$rows = $db->loadObjectList();
			$characteristic_images = array();
			foreach($rows as $data):
				$characteristic_images[$data->id] = $data->image;
			endforeach;
		}
		return $characteristic_images;
	}
	
	static function getListCharactiristicValueImage(){
		static $characteristic_images;
		if (!isset($characteristic_images)){
			$db = \JFactory::getDBO();
			$query = "SELECT id, image FROM `#__jshopping_products_extra_field_values`";
			$db->setQuery($query);
			$rows = $db->loadObjectList();
			$characteristic_images = array();
			foreach($rows as $data):
				$characteristic_images[$data->id] = $data->image;
			endforeach;
		}
		return $characteristic_images;
	}
	
	static function getCharactiristicImage($id){
		if (JPluginHelper::isEnabled('jshoppingproducts', 'addon_field_images')){
			$jshopConfig = JSFactory::getConfig();
			$list = self::getListCharactiristicImage();
			if ($list[$id]){
				return "<span class='charactiristic_image'>".
				\JHTML::_('image', $jshopConfig->image_attributes_live_path.'/'.$list[$id], '', 'height="20px" width="20px"').
				"</span> ";
			}else{
				return '';
			}
		}
	}
	
	static function getCharactiristicValueImage($id){
		if (JPluginHelper::isEnabled('jshoppingproducts', 'addon_field_images')){
			$list = self::getListCharactiristicValueImage();
			if ($list[$id]){
				return $list[$id];
			}else{
				return '';
			}
		}
		return '';
	}

	static function getContextFilter() {
        $jinput = \JFactory::getApplication()->input;
		$category_id = $jinput->getInt('category_id', 0);
		$manufacturer_id = $jinput->getInt('manufacturer_id', 0);
		$vendor_id = $jinput->getInt('vendor_id', 0);
		$controller = $jinput->get("controller");
		if (!$controller) $controller = $jinput->get("view");

		$contextfilter = '';
		if ($controller=='category'){
			$contextfilter = 'jshoping.list.front.product.cat.'.$category_id;
		}
		if ($controller=='manufacturer'){
			$contextfilter = 'jshoping.list.front.product.manf.'.$manufacturer_id;
		}    
		if ($controller=='vendor'){
			$contextfilter = 'jshoping.list.front.product.vendor.'.$vendor_id;  
		}  
		if ($controller=='products'){
			$contextfilter = 'jshoping.list.front.product.fulllist';   
		}
		if ($controller=='productsfilter'){
			$mid = $jinput->getInt('Itemid');
			$contextfilter = "jshoping.list.front.productsfilter.".$mid;
		}
		return $contextfilter;
	}

	static function getStateFromRequest($context, $key, $default = null) {
		$session = JFactory::getSession();
		$input = \JFactory::getApplication()->input;
		$val = $input->get($key);
		$val_session = $session->get($context);
		if (isset($val)) {
			$tmp = ['data' => $val];
			$session->set($context, $tmp);
			return $val;
		} elseif (isset($val_session)) {
			return $val_session['data'];
		} else {
			return $default;
		}
	}

	static function clearPrevPageFilterActive($prev_context) {
		$session = JFactory::getSession();
		$registry = $session->get('registry');
		if ($registry !== null) {
			$registry->set($prev_context.'categorys', []);
			$registry->set($prev_context.'manufacturers', []);
			$registry->set($prev_context.'vendors', []);
			$registry->set($prev_context.'extra_fiels', []);
			$registry->set($prev_context.'labels', []);
			$registry->set($prev_context.'extra_fields_t', []);
			$registry->set($prev_context.'delivery_times', []);
			$registry->set($prev_context.'attr_val', []);
			$registry->set($prev_context.'fprice_from', '');
			$registry->set($prev_context.'fprice_to', '');
			$registry->set($prev_context.'quantity_filter', '');
			$registry->set($prev_context.'photo_filter', '');
			$registry->set($prev_context.'sets_filter', '');
			$registry->set($prev_context.'review_filter', '');
			$registry->set($prev_context.'rating_filter', '');
			$registry->set($prev_context.'show_products_with_old_prices', '');
			$registry->set($prev_context.'show_products_with_free_shipping', '');
			$registry->set($prev_context.'filter_search', '');
		}
	}

	static function getDefaultFilterExtra_fiels() {
		$params = \JFactory::getApplication()->getParams();
		$def_extra_fiels = $params->get('extra_fiels', []);
		$res = ['list' => [], 'text' => []];
		foreach($def_extra_fiels as $k => $v) {
			if (preg_match('/t_(\d+)/', $k, $matches)) {
				$res['text'][$matches[1]] = $v;
			} else {
				$res['list'][$k] = $v;
			}
		}
		return $res;
	}
	
	static function getFilterActive($filter_only_url = 0, $contextfilter = '', $core_filter = 0) {
		$app = \JFactory::getApplication();
        $input = $app->input;
        $jshopConfig = \JSFactory::getConfig();
		$params = \JFactory::getApplication()->getParams();
		$def_extra_fiels = self::getDefaultFilterExtra_fiels();

        $category_id = $input->getInt('category_id');
        $manufacturer_id = $input->getInt('manufacturer_id');
        $label_id = $input->getInt('label_id');
        $vendor_id = $input->getInt('vendor_id');
        $price_from = \JSHelper::saveAsPrice($input->getVar('price_from'));
        $price_to = \JSHelper::saveAsPrice($input->getVar('price_to'));		
		if ($filter_only_url) {
        	$categorys = $input->get('categorys', $params->get('categorys', []));
		} else {
			$categorys = $app->getUserStateFromRequest($contextfilter.'categorys', 'categorys', []);
			$categorys = array_merge($categorys, $params->get('categorys', []));
		}
        $categorys = \JSHelper::filterAllowValue($categorys, "int+");
        $tmpcd = \JSHelper::getListFromStr($input->getVar('category_id'));
        if (is_array($tmpcd) && !$categorys) $categorys = $tmpcd;

		if ($filter_only_url) {
        	$manufacturers = $input->get('manufacturers', $params->get('manufacturers', []));
		} else {
			$manufacturers = $app->getUserStateFromRequest($contextfilter.'manufacturers', 'manufacturers', []);
			$manufacturers = array_merge($manufacturers, $params->get('manufacturers', []));
		}
        $manufacturers = \JSHelper::filterAllowValue($manufacturers, "int+");
        $tmp = \JSHelper::getListFromStr($input->getVar('manufacturer_id'));
        if (is_array($tmp) && !$manufacturers) $manufacturers = $tmp;

		if ($filter_only_url) {
        	$labels = $input->get('labels', $params->get('labels', []));
		} else {
			$labels = $app->getUserStateFromRequest($contextfilter.'labels', 'labels', []);
			$labels = array_merge($labels, $params->get('labels', []));
		}
        $labels = \JSHelper::filterAllowValue($labels, "int+");
        $tmplb = \JSHelper::getListFromStr($input->getVar('label_id'));
        if (is_array($tmplb) && !$labels) $labels = $tmplb;

		if ($filter_only_url) {
        	$vendors = $input->get('vendors', $params->get('vendors', []));
		} else {
			$vendors = $app->getUserStateFromRequest($contextfilter.'vendors', 'vendors', []);
			$vendors = array_merge($vendors, $params->get('vendors', []));
		}
        $vendors = \JSHelper::filterAllowValue($vendors, "int+");
        $tmp = \JSHelper::getListFromStr($input->getVar('vendor_id'));
        if (is_array($tmp) && !$vendors) $vendors = $tmp;

        if ($jshopConfig->admin_show_product_extra_field){
			if ($filter_only_url) {
            	$extra_fields = $input->get('extra_fields', $def_extra_fiels['list']);
			} else {
				$extra_fields = $app->getUserStateFromRequest($contextfilter.'extra_fields', 'extra_fields', $def_extra_fiels['list']);
			}
			foreach($def_extra_fiels['list'] as $_ch_id => $_vals) {
				foreach($_vals as $_k => $_v) {
					if (!isset($extra_fields[$_ch_id])) $extra_fields[$_ch_id] = [];
					if (!in_array($_v, $extra_fields[$_ch_id])) {
						$extra_fields[$_ch_id][] = $_v;
					}
				}
			}
            $extra_fields = \JSHelper::filterAllowValue($extra_fields, "array_int_k_v+");
			if ($filter_only_url) {
            	$extra_fields_t = $input->getString('extra_fields_t', $def_extra_fiels['text']);
			} else {
				$extra_fields_t = $app->getUserStateFromRequest($contextfilter.'extra_fields_t', 'extra_fields_t', $def_extra_fiels['text']);
			}
			foreach($def_extra_fiels['text'] as $_ch_id => $_vals) {
				foreach($_vals as $_k => $_v) {
					if (!isset($extra_fields_t[$_ch_id])) $extra_fields_t[$_ch_id] = [];
					if (!in_array($_v, $extra_fields_t[$_ch_id])) {
						$extra_fields_t[$_ch_id][] = $_v;
					}
				}
			}
            $extra_fields_t = \JSHelper::filterAllowValue($extra_fields_t, "array_int_k_v_not_empty");
        }
		if ($filter_only_url) {
        	$fprice_from = $input->get('fprice_from', $params->get('fprice_from'));
		} else {
			$fprice_from = self::getStateFromRequest($contextfilter.'fprice_from', 'fprice_from', $params->get('fprice_from'));
		}
        $fprice_from = \JSHelper::saveAsPrice($fprice_from);
        if (!$fprice_from) $fprice_from = $price_from;
		if ($filter_only_url) {
        	$fprice_to = $input->get('fprice_to', $params->get('fprice_to', ''));
		} else {
			$fprice_to = self::getStateFromRequest($contextfilter.'fprice_to', 'fprice_to', $params->get('fprice_to'));
		}
        $fprice_to = \JSHelper::saveAsPrice($fprice_to);
        if (!$fprice_to) $fprice_to = $price_to;

		//addon Product category and subcategory
		if (class_exists('plgJshoppingAllproducts') && plgJshoppingAllproducts::$active_subcats && count(plgJshoppingAllproducts::$active_subcats)) {
			$categorys = array_merge($categorys, plgJshoppingAllproducts::$active_subcats);
			$categorys = array_unique($categorys);
		}

        $filters = array();
        $filters['categorys'] = $categorys;
        $filters['manufacturers'] = $manufacturers;
        $filters['price_from'] = $fprice_from;
        $filters['price_to'] = $fprice_to;
        $filters['labels'] = $labels;
        $filters['vendors'] = $vendors;
        if ($jshopConfig->admin_show_product_extra_field){
            $filters['extra_fields'] = $extra_fields;
            $filters['extra_fields_t'] = $extra_fields_t;
        }
        if ($category_id && !$filters['categorys']){
            $filters['categorys'][] = $category_id;
        }
        if ($manufacturer_id && !$filters['manufacturers']){
            $filters['manufacturers'][] = $manufacturer_id;
        }
        if ($label_id && !$filters['labels']){
            $filters['labels'][] = $label_id;
        }
        if ($vendor_id && !$filters['vendors']){
            $filters['vendors'][] = $vendor_id;
        }
        if (is_array($filters['vendors'])){
            $main_vendor = \JSFactory::getMainVendor();
            foreach($filters['vendors'] as $vid){
                if ($vid == $main_vendor->id){
                    $filters['vendors'][] = 0;
                }
            }
        }
		if ($core_filter) {
			return $filters;
		}

		if ($filter_only_url) {
            $attribut_active_value = $input->get('attr_val', $params->get('attributes', []));
        } else {
            $attribut_active_value = $app->getUserStateFromRequest($contextfilter.'attr_val', 'attr_val', $params->get('attributes', []));
        }
		foreach($params->get('attributes', []) as $_av_id) {
			if (!in_array($_av_id, $attribut_active_value)) {
				$attribut_active_value[] = $_av_id;
			}
		}
        $filters['attribut_active_value'] = \JSHelper::filterAllowValue($attribut_active_value, "int+");
        
		if ($filter_only_url) {
			$quantity_filter = $input->get('quantity_filter', $params->get('quantity_filter'));
		} else {
			$quantity_filter = $app->getUserStateFromRequest($contextfilter.'quantity_filter', 'quantity_filter', $params->get('quantity_filter'));
		}
		$filters['quantity_filter'] = $quantity_filter;
        
		if ($filter_only_url) {
			$photo_filter = $input->get('photo_filter', $params->get('photo_filter'));
		} else {
			$photo_filter = $app->getUserStateFromRequest($contextfilter.'photo_filter', 'photo_filter', $params->get('photo_filter'));
		}
		$filters['photo_filter'] = $photo_filter;

		if ($filter_only_url) {
			$sets_filter = $input->get('sets_filter', $params->get('sets_filter'));
		} else {
			$sets_filter = $app->getUserStateFromRequest($contextfilter.'sets_filter', 'sets_filter', $params->get('sets_filter'));
		}
		$filters['sets_filter'] = $sets_filter;

		if ($filter_only_url) {
			$review_filter = $input->get('review_filter', $params->get('review_filter'));
		} else {
        	$review_filter = $app->getUserStateFromRequest($contextfilter.'review_filter', 'review_filter', $params->get('review_filter'));
		}
		$filters['review_filter'] = $review_filter;

		if ($filter_only_url) {
			$rating_filter = $input->get('rating_filter', $params->get('rating_filter'));
		} else {
        	$rating_filter = $app->getUserStateFromRequest($contextfilter.'rating_filter', 'rating_filter', $params->get('rating_filter'));
		}
		$filters['rating_filter'] = $rating_filter;
        
		if ($filter_only_url) {
			$delivery_time_active = $input->get('delivery_times', $params->get('delivery_times', []));
		} else {
        	$delivery_time_active = $app->getUserStateFromRequest($contextfilter.'delivery_times', 'delivery_times', []);
			$delivery_time_active = array_merge($delivery_time_active, $params->get('delivery_times', []));
		}
        $delivery_time_active = \JSHelper::filterAllowValue($delivery_time_active, "int+");
		$filters['delivery_time_active'] = $delivery_time_active;
        
		if ($filter_only_url) {
			$show_products_with_old_prices = $input->get('show_products_with_old_prices', $params->get('show_products_with_old_prices'));
		} else {
			$show_products_with_old_prices = $app->getUserStateFromRequest($contextfilter.'show_products_with_old_prices', 'show_products_with_old_prices', $params->get('show_products_with_old_prices'));
		}
		$filters['show_products_with_old_prices'] = $show_products_with_old_prices;

		if ($filter_only_url) {
			$show_products_with_free_shipping = $input->get('show_products_with_free_shipping', $params->get('show_products_with_free_shipping'));
		} else {
			$show_products_with_free_shipping = $app->getUserStateFromRequest($contextfilter.'show_products_with_free_shipping', 'show_products_with_free_shipping', $params->get('show_products_with_free_shipping'));
		}
		$filters['show_products_with_free_shipping'] = $show_products_with_free_shipping;
		
		if ($filter_only_url) {
        	$filter_search = $input->get('filter_search', '');
		} else {
			$filter_search = $app->getUserStateFromRequest($contextfilter.'filter_search', 'filter_search', '');
		}
		$filters['filter_search'] = $filter_search;

		return $filters;
	}
	
	static function getFilterSearchActive() {		
		$app = \JFactory::getApplication();
        $input = $app->input;
		if (self::getModuleParamsfilter_only_url()) {
			$filter_search = $input->get('filter_search', '');
		} else {
			$contextfilter = self::getContextFilter();
			$filter_search = $app->getUserStateFromRequest($contextfilter.'filter_search', 'filter_search', '');
		}
		return $filter_search;
	}

	static function getFormActionBase($controller) {
		$jinput = \JFactory::getApplication()->input;
		$category_id = $jinput->getInt('category_id', 0);
		$manufacturer_id = $jinput->getInt('manufacturer_id', 0);
		$vendor_id = $jinput->getInt('vendor_id', 0);
		if ($controller == 'category') {
			$action = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=category&task=view&category_id='.$category_id, 1, 1);
		}
		if ($controller == 'manufacturer') {
			$action = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=manufacturer&task=view&manufacturer_id='.$manufacturer_id, 1, 1);
		}
		if ($controller == 'vendor') {
			$action = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=vendor&task=products&vendor_id='.$vendor_id, 1, 1);
		}
		if ($controller == 'products') {
			$action = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=products', 1, 1);
		}
		if (!isset($action)) {
			$link = "index.php?Itemid=".$jinput->get('Itemid');
			$action = \JRoute::_($link);
		}
		return $action;
	}

	static function getProductIdByAttributeVals($attribut_active_value) {
		$db = \JFactory::getDBO(); 
        $jshopConfig = \JSFactory::getConfig();
		$products = [];

		if ($attribut_active_value && count($attribut_active_value)){
            $query = " SELECT `attr_id` FROM `#__jshopping_attr_values` WHERE `value_id` in (".implode(",", $attribut_active_value).") GROUP BY attr_id";  
            $db->setQuery($query); 
            $attr_id = $db->loadColumn();  
        }
        
        if (isset($attr_id) && $attr_id) {
            //independent attribut 
            $query = "SELECT a.attr_id, av.value_id, ap.product_id FROM `#__jshopping_attr` AS a 
            LEFT JOIN  `#__jshopping_attr_values` AS av ON (av.attr_id=a.attr_id)
            LEFT JOIN  `#__jshopping_products_attr2` AS ap ON (av.value_id=ap.attr_value_id) 
            WHERE av.value_id in (".implode(",", $attribut_active_value).") AND a.independent=1 ORDER BY a.attr_id";  
            $db->setQuery($query);
            $attr_array_independent = $db->loadObjectList();            

			$attr_ind = [];
            if ($attr_array_independent) {
                foreach ($attr_array_independent AS $_attr_arr) {
					if (!isset($attr_ind[$_attr_arr->attr_id])) $attr_ind[$_attr_arr->attr_id] = [];
                    $attr_ind[$_attr_arr->attr_id][] = $_attr_arr->product_id;
                }
            }
			if (count($attr_ind) == 1) {
				$products = array_shift($attr_ind);
			} elseif (count($attr_ind) > 1) {
            	$products = array_intersect(...$attr_ind);
			}

            //dependent attribut 
            $query = " SELECT `attr_id` FROM `#__jshopping_attr` WHERE `attr_id` in (".implode(",", $attr_id).") AND `independent`=0";  
            $db->setQuery($query); 
            $attr_id_depend = $db->loadColumn();

            if (count($attr_id_depend) > 0) {
                $_attr_id_depend = implode(",", $attribut_active_value); 
                $_where = "";
                foreach ($attr_id_depend as $key => $attr_key) {
                    $_where .= " `attr_".$attr_key."` in (".$_attr_id_depend.") ";
                    if ($key < count($attr_id_depend)-1) $_where .= " AND "; 
                }
                if ($jshopConfig->hide_product_not_avaible_stock){
                    $_where.=" and `count`>0 ";
                }
                if ($_where!="") $_where = " WHERE ".$_where;

                $query = " SELECT distinct `product_id` FROM `#__jshopping_products_attr` ".$_where;
                $db->setQuery($query); 
                $product_id_depend = $db->loadColumn(); 
                  
                if (count($product_id_depend) > 0) {
					if ($products) {
						$products = array_intersect($products, $product_id_depend);
                        if (count($products) == 0) {
                            $products = [0];
                        }
					} else {
						$products = $product_id_depend;
					}
				} else {
                    $products = [0];
				}
            }
        }
		return array_unique($products);
	}

}

class modJshoppingFiltersExtendedHelper {

	public static function getAjax() {
		$app = \JFactory::getApplication();
        $input = $app->input;
		$all_data_url = $input->getArray();
		$segments = modJshoppingFiltersExtendedHelperUrl::getBuildSegmentUrl($all_data_url);
		$url_query = modJshoppingFiltersExtendedHelperUrl::getBuildQueryUrl($all_data_url);
		$url = implode('/', $segments);
		if ($url_query) {
			$url .= '?' . http_build_query($url_query);
		}
		return $url;
	}
	
}