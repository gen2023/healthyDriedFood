<?php
defined("JPATH_PLATFORM") or die;
JFormHelper::loadFieldClass("list");
class JFormFieldShopcategories extends JFormFieldList{
	
    public $type = "shopcategories";

    public function getOptions() {
        //print_r((array)$this->getLayoutData()); die();
		include_once JPATH_SITE."/components/com_jshopping/bootstrap.php";
        $options = [];
        foreach(\JSHelper::buildTreeCategory(0) as $category){
            $options[$category->category_id] = $category->name;
        }        
        return $options;
    }
}