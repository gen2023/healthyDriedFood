<?php
defined('_JEXEC') or die('Restricted access');
include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/helper.php";

class plgJshoppingProductsFilters_extended extends JPlugin{

    private $clear_filter = 0;

    private function get_filter_only_url() {
        return modJshopping_filters_extendedHelper::getModuleParamsfilter_only_url();
    }

    public function onBeforeLoadProductList(){
        $params = modJshopping_filters_extendedHelper::getModuleParams();
        $input = JFactory::getApplication()->input;        
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
        $db = \JFactory::getDBO();
        $jshopConfig = \JSFactory::getConfig();
		
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
        ) {
            \JSError::raiseError('', 'Please enter license key (JoomShopping Filter extended)');
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
        //return \JSHelper::compareX64(\JSHelper::replaceWWW(\JSHelper::getJHost()."filters_extended"), \JSHelper::getLicenseKeyAddon('filters_extended'));
        return 1;
    }
    
    function onBeforeDisplayProductListView(&$view, &$productlist){
        $session = JFactory::getSession();
		$stdFilter = [];

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
            if (count($attribut_active_value)) $res = 1;
            if (count($delivery_time_active)) $res = 1;
            if ($quantity_filter) $res = 1;
            if ($photo_filter) $res = 1;
			if ($filter_active['filter_search']) $res = 1;
			
            $session->set('show_mod_in_category', $res);   
        } else {
            $session->set('show_mod_in_category', 1);
        }

        $params = modJshopping_filters_extendedHelper::getModuleParams();
        if ($params->show_filter_active == '2') {
            $addon = new AddonCore('filters_extended');            
            \JFactory::getLanguage()->load('mod_jshopping_filters_extended');
            $view->_tmp_after_form_filter_html = $view->_tmp_after_form_filter_html ?? '';
            $view->_tmp_after_form_filter_html .= $addon->getView('filter_active_vals')->loadTemplate();
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
        foreach($no_filter as $filterkey){
            unset($filters[$filterkey]);
        }
    }
}