<?php
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Component\Jshopping\Site\Helper\Error as JSError;


use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

defined('_JEXEC') or die('Restricted access');
include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/helper.php";

class plgJshoppingProductsFilters_extended extends CMSPlugin{

    private $clear_filter = 0;

    function __construct(&$subject, $config){
		parent::__construct($subject, $config);
        $app = Factory::getApplication();
        if ($app->input->get('filterres') == 'filter') {
            include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/helper_items.php";
            include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/helper_faf.php";
            include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/cache.php";
            $params = modJshopping_filters_extendedHelper::getModuleParams();
            $use_cache = $params->cache ?? 0;
            $cache = filterExtCache::getInstance();
            $cache->setEnabled($use_cache);
            $cache->setLang(Factory::getLanguage()->getTag());
            $page_params = modJshopping_filters_extendedHelper::getPageParams();
            $contextfilter = modJshopping_filters_extendedHelper::getContextFilter();
            $get_filter_only_url = $params->get_filter_only_url ?? 0;
            $filter_active = modJshopping_filters_extendedHelper::getFilterActive($get_filter_only_url, $contextfilter, 0);
            $res = modJshoppingFiltersExtendedHelperFaf::getFilter($page_params, $filter_active);
            $res['efilter'] = $app->input->get('efilter');
            print json_encode($res);
            die();
        }
	}

    private function get_filter_only_url() {
        return modJshopping_filters_extendedHelper::getModuleParamsfilter_only_url();
    }

    public function onBeforeLoadProductList(){
        $params = modJshopping_filters_extendedHelper::getModuleParams();
        $input = Factory::getApplication()->input;        
        if ($params->filter_reset 
			&& $this->clear_filter == 0 
			&& is_null($input->get('efilter')) 
			&& is_null($input->get('start')) 
			&& is_null($input->get('limit'))
			&& is_null($input->get('order'))
		) {
            $contextfilter = modJshopping_filters_extendedHelper::getContextFilter();
            modJshopping_filters_extendedHelper::clearPrevPageFilterActive($contextfilter);
            $this->clear_filter = 1;
        }
    }
    
    private function _getExtQuery($type, $adv_result, $adv_from, $adv_query, $filter_active){        
        $ext_query = "";    
        $db = Factory::getDBO();
        $jshopConfig = JSFactory::getConfig();
		
        $attribut_active_value = $filter_active['attribut_active_value'] ?? [];
        $quantity_filter = $filter_active['quantity_filter'] ?? 0;
        $photo_filter = $filter_active['photo_filter'] ?? 0;
        $review_filter = $filter_active['review_filter'] ?? 0;
        $rating_filter = $filter_active['rating_filter'] ?? 0;
        $sets_filter = $filter_active['sets_filter'] ?? 0;
        $delivery_time_active = $filter_active['delivery_time_active'] ?? [];
        $show_products_with_old_prices = $filter_active['show_products_with_old_prices'] ?? 0;
        $show_products_with_free_shipping = $filter_active['show_products_with_free_shipping'] ?? 0;
        
        if ($attribut_active_value && count($attribut_active_value)){
            $prod_by_attributs = modJshopping_filters_extendedHelper::getProductIdByAttributeVals($attribut_active_value);
            if (count($prod_by_attributs) > 0) {
                $ext_query .= " AND prod.product_id in (".implode(",", $prod_by_attributs).") "; 
            }
        }
        
        if ($quantity_filter == '1') $ext_query.=" AND (prod.product_quantity > '0' OR  prod.unlimited = '1') ";  
        if ($quantity_filter == '2') $ext_query.=" AND (prod.product_quantity = '0' AND prod.unlimited = '0') "; 

        if ($photo_filter == '1') $ext_query.=" AND prod.image != '' ";  
        if ($photo_filter == '2') $ext_query.=" AND prod.image = '' ";

        if ($review_filter == '1') $ext_query.=" AND prod.reviews_count > 0 ";
        if ($review_filter == '2') $ext_query.=" AND prod.reviews_count = 0 ";
        
        if ($sets_filter == '1') $ext_query.=" AND prod.use_sets = 1 ";
        if ($sets_filter == '2') $ext_query.=" AND prod.use_sets = 0 ";

        if ($rating_filter > 0){
            $ext_query.=" AND prod.average_rating >=".(int)$rating_filter." ";
        }
        
        if (count($delivery_time_active)>0){
            $ext_query.=" AND prod.delivery_times_id in (".implode(",", $delivery_time_active).") ";
        }
        
        if ($show_products_with_old_prices){
            $ext_query.=" AND prod.product_old_price>0 ";
        }

        if ($show_products_with_free_shipping){
            $ext_query.=" AND (prod.product_price / cr.currency_value) > ".$jshopConfig->summ_null_shipping." ";            
        }
        
        if ($type=='category') {
            $categorys = $filter_active['categorys'];
            if (count($categorys)){
                $ext_query .= " AND pr_cat.category_id in (".implode(',', $categorys).") ";
            }
        }
    return $ext_query;
    }
    
    function onBeforeQueryGetProductList($type, &$adv_result, &$adv_from, &$adv_query, &$order_query, &$filters){        
		if (
            !$this->checkLicKey() 
            && !file_exists(JPATH_SITE.'/plugins/system/tmpl_gray/tmpl_gray.php') 
            && !file_exists(JPATH_SITE.'/components/com_jshopping/templates/joomshopping_defaut_flex')
            && !file_exists(JPATH_SITE.'/components/com_jshopping/templates/joomshopping_green_flex')
			&& !file_exists(JPATH_SITE.'/components/com_jshopping/templates/flex9')
        ) {
            JSError::raiseError('', 'Please enter license key (JoomShopping Filter extended)');
            return 1;
        }
        $ext_query = $this->_getExtQuery($type, $adv_result, $adv_from, $adv_query, $filters);
        $adv_query .= $ext_query;

        if (substr_count($ext_query, 'cr.currency_value') && !substr_count($adv_from, '_jshopping_currencies')){
            $adv_from .= " LEFT JOIN `#__jshopping_currencies` AS cr USING (currency_id) ";
        }
    }
    
    function onBeforeQueryCountProductList($type, &$adv_result, &$adv_from, &$adv_query, &$filters){
        $ext_query = $this->_getExtQuery($type, $adv_result, $adv_from, $adv_query, $filters);
        $adv_query .= $ext_query;
        
        if (substr_count($ext_query, 'cr.currency_value') && !substr_count($adv_from, '_jshopping_currencies')){
            $adv_from .= " LEFT JOIN `#__jshopping_currencies` AS cr USING (currency_id) ";
        }
    }
    
    function onAfterWillBeUseFilterFunc(&$filters, &$res){
        $filter_active = $filters;
        $attribut_active_value = $filter_active['attribut_active_value'] ?? [];
        $quantity_filter = $filter_active['quantity_filter'] ?? null;
        $photo_filter = $filter_active['photo_filter'] ?? null;
        $review_filter = $filter_active['review_filter'] ?? null;
        $rating_filter = $filter_active['rating_filter'] ?? null;
        $delivery_time_active = $filter_active['delivery_time_active'] ?? [];
        $show_products_with_old_prices = $filter_active['show_products_with_old_prices'] ?? null;
        $show_products_with_free_shipping = $filter_active['show_products_with_free_shipping'] ?? null;
        
        if (count($attribut_active_value)) $res = 1;
        if (count($delivery_time_active)) $res = 1;
        if ($quantity_filter) $res = 1;
        if ($photo_filter) $res = 1;
		if (isset($filter_active['filter_search']) && $filter_active['filter_search']) $res = 1;
    }
    
    function checkLicKey(){
        return Helper::compareX64(Helper::replaceWWW(Helper::getJHost()."filters_extended"), Helper::getLicenseKeyAddon('filters_extended'));
    }
    
    function onBeforeDisplayProductListView(&$view, &$productlist){
        $session = Factory::getSession();
        $app  = Factory::getApplication();
		$stdFilter = [];
        $addon = new AddonCore('filters_extended');

        if (isset($view->display_list_products) && $view->display_list_products == false) {
			if (isset($productlist)) {
				$stdFilter = $productlist->getStandartFilterListProduct();
			}
            $res = 0;
            if ($view->filters['price_from']>0) $res = 1;
            if ($view->filters['price_to']>0) $res = 1;
            if (is_array($view->filters['categorys']) && count($view->filters['categorys'])>0 && !in_array('categorys', $stdFilter)) $res = 1;
            if (is_array($view->filters['manufacturers']) && count($view->filters['manufacturers'])>0 && !in_array('manufacturers', $stdFilter)) $res = 1;    
            if (is_array($view->filters['vendors']) && count($view->filters['vendors'])>0 && !in_array('vendors', $stdFilter)) $res = 1;    
            if (is_array($view->filters['labels']) && count($view->filters['labels'])>0 && !in_array('labels', $stdFilter)) $res = 1;
            if (is_array($view->filters['extra_fields']) && count($view->filters['extra_fields'])>0) $res = 1;

            $filter_active = $view->filters;
            $attribut_active_value = $filter_active['attribut_active_value'];
            $quantity_filter = $filter_active['quantity_filter'];
            $photo_filter = $filter_active['photo_filter'];
            $review_filter = $filter_active['review_filter'];
            $rating_filter = $filter_active['rating_filter'];
            $delivery_time_active = $filter_active['delivery_time_active'];
            $show_products_with_old_prices = $filter_active['show_products_with_old_prices'];
            $show_products_with_free_shipping = $filter_active['show_products_with_free_shipping'];
            if (isset($attribut_active_value) && count($attribut_active_value)) $res = 1;
            if (isset($delivery_time_active) && count($delivery_time_active)) $res = 1;
            if ($quantity_filter) $res = 1;
            if ($photo_filter) $res = 1;
			if ($filter_active['filter_search']) $res = 1;
			
            $session->set('show_mod_in_category', $res);   
        } else {
            $session->set('show_mod_in_category', 1);
        }
        $controller = $app->input->getCmd('controller', '');
        if (!$controller) {
            $controller = $app->input->getCmd('view', '');
        }   
        if ($controller != 'product') { 
            $contextfilter = modJshopping_filters_extendedHelper::getContextFilter();
            $session->set('contextfilter', $contextfilter); 
        }  
        $params = modJshopping_filters_extendedHelper::getModuleParams();
        if ($params->show_filter_active == '2') {
            Factory::getLanguage()->load('mod_jshopping_filters_extended');
            $view->_tmp_after_form_filter_html = $view->_tmp_after_form_filter_html ?? '';
            $view->_tmp_after_form_filter_html .= $addon->getView('filter_active_vals')->loadTemplate();
        }

        $addonParams = $addon->getAddonParams();  
        if (isset($addonParams['show_selected_attr_in_product']) && $addonParams['show_selected_attr_in_product'] == 1 && isset($view->filters['attribut_active_value'])) {
            $active_filters_ids = $view->filters['attribut_active_value'];
            $attr_get_params = '';
            foreach ($active_filters_ids as $k => $value) {
                $attr_id = $this->getAttrIdByAttrValue($value);
                if ($attr_id) {
                    $attr_get_params .= '&attr[' . $attr_id . ']=' . $value;  
                }         
            } 
            foreach ($view->rows as $product) {
                $product->product_link = Helper::SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id=' . $product->category_id . '&product_id=' . $product->product_id . $attr_get_params);
            }
        }
    }

    public function onAfterGetBuildFilterListProduct(&$filters,  &$no_filter) {        
		if (isset($filters['search'])) {
			return 0;
		}
		$filter_search = modJshopping_filters_extendedHelper::getFilterSearchActive();
        $contextfilter =  modJshopping_filters_extendedHelper::getContextFilter();
        $filters = modJshopping_filters_extendedHelper::getFilterActive($this->get_filter_only_url(), $contextfilter, 0);
		if ($filter_search) {
			$filters['search'] = $filter_search;
		}
        $app = Factory::getApplication();
        $extra_fields_sl = $app->getUserStateFromRequest($contextfilter.'extra_fields_sl', 'extra_fields_sl', []);
        foreach($extra_fields_sl as $ch_id => $val) {
            if ($val['min'] != '' && $val['max'] != '') {
                $list_ch_vals = modJshopping_filters_extendedHelper::getListExtraFieldValsByMinMax($ch_id, $val['min'], $val['max']);
                if ($list_ch_vals) {
                    $filters['extra_fields'][$ch_id] = $list_ch_vals;
                } else {
                    $filters['extra_fields'][$ch_id] = [-99];
                }
            }
        }
        
        foreach($no_filter as $filterkey){
            unset($filters[$filterkey]);
        }
    }

    public function onGetContextFilter(&$context, &$obj) {
        $extUConf = modJshopping_filters_extendedHelper::getExtUserConfig();     
        if (isset($extUConf['contextfilter_hash_query']) &&  $extUConf['contextfilter_hash_query']) {
            if ($_SERVER['QUERY_STRING']) {
                $qshash = ".h.".substr(md5($_SERVER['QUERY_STRING']), 0, 10);
            } else {
                $qshash = '';
            }
            $context = $context.$qshash;
        }
    }

    public function onBeforeLoadProduct(&$product_id, &$category_id, &$back_value) {
        $addon = new AddonCore('filters_extended');
        $input = Factory::getApplication()->input;
        if ($input->get('attr')) {
            return;
        }
		$params = $addon->getAddonParams();      
        if (isset($params['show_selected_attr_in_product']) && $params['show_selected_attr_in_product'] == 2) {
            $session = Factory::getSession();
            $contextfilter = $session->get('contextfilter');
            $filter = modJshopping_filters_extendedHelper::getFilterActive(0, $contextfilter);     
            if (isset($filter['attribut_active_value']) && is_array($filter['attribut_active_value']) && count($filter['attribut_active_value'])) {
                foreach ($filter['attribut_active_value'] as $attr_val_id) {
                    $attr_id = $this->getAttrIdByAttrValue($attr_val_id);
                    if ($attr_id !== null) {
                        $back_value['attr'][$attr_id] = $attr_val_id;
                    }
                }
            }
        }
    }

    private function getAttrIdByAttrValue($attr_val_id) {
        $table = JSFactory::getTable('attributvalue');
        $table->load($attr_val_id);
        return $table->attr_id;
    }
   
}