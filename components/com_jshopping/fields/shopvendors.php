<?php
defined("JPATH_PLATFORM") or die;
JFormHelper::loadFieldClass("list");

class JFormFieldShopvendors extends JFormFieldList{
	
    public $type = "shopvendors";

    public function getOptions(){
        $options = [];
        $db = \JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select("jv.id,jv.shop_name");
        $query->from("#__jshopping_vendors AS jv");
        $query->order("jv.shop_name ASC");        
        $db->setQuery($query);
        foreach($db->loadObjectList() as $vendor){
            $options[$vendor->id] = $vendor->shop_name;
        }        
        return $options;
    }
}