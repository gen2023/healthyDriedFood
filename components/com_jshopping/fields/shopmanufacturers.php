<?php
defined("JPATH_PLATFORM") or die;
JFormHelper::loadFieldClass("list");

class JFormFieldShopmanufacturers extends JFormFieldList{
	
    public $type = "shopmanufacturers";

    public function getOptions() {
		include_once JPATH_SITE."/components/com_jshopping/bootstrap.php";
        $options = [];		
		$list = \JSFactory::getTable('Manufacturer')->getAllManufacturers();
        foreach($list as $v){
            $options[$v->manufacturer_id] = $v->name;
        }        
        return $options;
    }
}