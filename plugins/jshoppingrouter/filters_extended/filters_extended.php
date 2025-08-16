<?php
defined('_JEXEC') or die('Restricted access');
include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/helper.php";
include_once JPATH_SITE."/modules/mod_jshopping_filters_extended/helper_url.php";

class plgJshoppingrouterFilters_extended extends JPlugin {

    public function onAfterBuildRoute(&$query, &$segments) {        
        if (!modJshopping_filters_extendedHelper::getModuleParamsfilter_only_url()) {
            return;
        }
        $newsegment = modJshoppingFiltersExtendedHelperUrl::getBuildSegmentUrl($query);
        if ($newsegment) {
            $segments = array_merge($segments, $newsegment);
            if (isset($query['manufacturers'])) unset($query['manufacturers']);
            if (isset($query['categorys'])) unset($query['categorys']);
            if (isset($query['attr_val'])) unset($query['attr_val']);
            if (isset($query['extra_fields'])) unset($query['extra_fields']);
            if (isset($query['extra_fields_t'])) unset($query['extra_fields_t']);
        }
    }
    
    public function onBeforeParseRoute(&$vars, &$segments) {
        if (!modJshopping_filters_extendedHelper::getModuleParamsfilter_only_url()) {
            return;
        }
        $reservedFirstAlias = \JSFactory::getReservedFirstAlias();
        $filter_segment_index = null;
        foreach($segments as $k => $v) {
            if (!substr_count($v, '-')) {
                continue;
            }
            if ($k == 0) {
                if (in_array($v, $reservedFirstAlias)) {
                    continue;
                }
                $catalias = \JSFactory::getAliasCategory();
                if (array_search($v, $catalias, true)) {
                    continue;
                }
                $manalias = \JSFactory::getAliasManufacturer();
                if (array_search($v, $manalias, true)) {
                    continue;
                }
            }
            $filter_segment_index = $k;
            break;           
        }
        if (isset($filter_segment_index)) {
            $alias_list = modJshoppingFiltersExtendedHelperUrl::getFilterAliasListId();
            $alias_value_list = modJshoppingFiltersExtendedHelperUrl::getFilterAliasValueListId();            
            foreach($segments as $k => $v) {
                if ($k < $filter_segment_index) {
                    continue;
                }
                $alias_data = explode('-', $v);
                if (!isset($alias_data[1]) || !isset($alias_list[$alias_data[0]])) {
                    continue;
                }
                $alias_data_key = $alias_data[0];
                $alias_data_val = substr($v, (strlen($alias_data_key) + 1));
                $atype = $alias_list[$alias_data_key];

                if ($atype['type_val'] == 'ids') {
                    $avalue = [];
                    $alias_data_vals = explode(',', $alias_data_val);                    
                    foreach($alias_data_vals as $_aval) {
                        $avalue[] = $alias_value_list[$atype['type']][$atype['id']][$_aval];
                    }                    
                }
                if ($atype['type_val'] == 'id') {
                    $avalue = $alias_value_list[$atype['type']][$atype['id']][$alias_data_val];
                }
                if ($atype['type_val'] == 'text') {
                    $avalue = modJshoppingFiltersExtendedHelperUrl::getUnSanitizingVal($alias_data_val);
                }                
                if ($atype['type_val'] == 'texts') {
                    $avalue = explode(',', $alias_data_val);
                    $avalue = modJshoppingFiltersExtendedHelperUrl::getUnSanitizingVals($avalue);
                }

                if ($atype['type'] == 'manufacturer') {
                    $vars[$atype['name']] = $avalue;
                }
                if ($atype['type'] == 'category') {
                    $vars[$atype['name']] = $avalue;
                }
                if ($atype['type'] == 'attribut') {                    
                    if (!isset($vars[$atype['name']])) {                    
                        $vars[$atype['name']] = $avalue;
                    } else {
                        $vars[$atype['name']] = array_merge($vars[$atype['name']], $avalue);
                    }
                }
                if ($atype['type'] == 'extra_field') {
                    $vars[$atype['name']][$atype['id']] = $avalue;
                }
                unset($segments[$k]);
            }            
        }
        //print_r($vars);
        //print_r($segments);  
    }

}