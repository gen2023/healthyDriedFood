<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;


class modJshoppingFiltersExtendedHelperFaf {

    public static function getFilter($page_params, $filter_active_fa) {
        $params = modJshopping_filters_extendedHelper::getModuleParams();
        $controller = $page_params['controller'];
        $category_id = $page_params['category_id'];

        $res = [];

        if (($params->show_manufacturers ?? 0) && $controller != 'manufacturer'){
            $items = modJshopping_filters_extendedHelperItems::getManufacturers($page_params, $filter_active_fa);            
            $res['manufacturer'] = self::getIdsByFilterItems($items, 'id');
        }

        if ($params->show_categorys ?? 0) {
            $show_categorys_in_category = $params->show_categorys_in_category ?? 0;
            $items = modJshopping_filters_extendedHelperItems::getCategorys($page_params, $show_categorys_in_category, $filter_active_fa);
            $res['category'] = self::getIdsByFilterItems($items, 'category_id');
        }

        if (($params->show_vendors ?? 0) && $controller!="vendor"){            
            $items = modJshopping_filters_extendedHelperItems::getVendors($page_params, $filter_active_fa);            
            $res['vendor'] = self::getIdsByFilterItems($items, 'id');
        }

        if ($params->show_prices_slider ?? 0) {
            $maxminPrices = modJshopping_filters_extendedHelperItems::getInProductsMaxMinPrice($page_params, $filter_active_fa);
            $res['min_price'] = $maxminPrices['min_price'] ?? 0;
            $res['max_price'] = $maxminPrices['max_price'] ?? 0;
        }

        if ($params->show_characteristics ?? 0){
            $addon = new AddonCore('filters_extended');
            $addonParams = $addon->getAddonParams();
            $show_characteristics_id_checkbox = $params->char_id_checkbox ?? [];
            $show_characteristics_id_select = $params->char_id_select ?? [];
            if ($category_id && ($addonParams['category_characteristics_settings'] ?? 0)) {
                $category = JSFactory::getTable('Category');
                $category->load($category_id);

                $category_char_id_checkbox = empty($category->char_id_checkbox) ? [] : json_decode($category->char_id_checkbox, true);
                $category_char_id_select = empty($category->char_id_select) ? [] : json_decode($category->char_id_select, true);

                if (count($category_char_id_checkbox)) {
                    $show_characteristics_id_checkbox = $category_char_id_checkbox;
                }
                
                if (count($category_char_id_select)) {
                    $show_characteristics_id_select = $category_char_id_select;
                }
                $show_sets = $category->sets_filter ?? 0;
            }

            $show_characteristics_id = array_unique(array_merge($show_characteristics_id_checkbox, $show_characteristics_id_select));
            $show_text_ch_as_list = $params->show_text_ch_as_list ?? 0;
            $characteristics = modJshopping_filters_extendedHelperItems::getCharacteristics($page_params, $show_characteristics_id, $show_text_ch_as_list, $filter_active_fa, 0);
            foreach($characteristics as $ch_id => $item) {
                $res['extra_field'][$ch_id] = self::getIdsByFilterItems($item->values, 'id');
            }
        }

        if ($params->show_labels ?? 0){
            $items = modJshopping_filters_extendedHelperItems::getLabels($page_params, $filter_active_fa);
            $res['label'] = self::getIdsByFilterItems($items, 'id');
        }

        if ($params->show_attributes ?? 0){
            $show_attributes_id_checkbox = $params->attr_id_checkbox ?? [];
            $show_attributes_id_select = $params->attr_id_select ?? [];
            $show_attributes_id = array_unique(array_merge($show_attributes_id_checkbox, $show_attributes_id_select));
            $listAttribut = modJshopping_filters_extendedHelperItems::getAttributs($page_params, $show_attributes_id, $filter_active_fa, 0);
            foreach($listAttribut as $item) {
                $res['attribute'][$item->attr_id] = self::getIdsByFilterItems($item->values, 'value_id');
            }
        }

        if ($params->show_delivery_time ?? 0) {
            $items = modJshopping_filters_extendedHelperItems::getDeliveryTimes($page_params, $filter_active_fa);
            $res['delivery_time'] = self::getIdsByFilterItems($items, 'id');
        }

        return $res;
    }

    public static function getIdsByFilterItems($items, $field = 'id') {        
        $ids = [];
        foreach($items as $item) {
            if (isset($item->disable) && $item->disable == 1) {
                continue;
            }
            $ids[] = (string)$item->$field;
        }
        return $ids;
    }

}