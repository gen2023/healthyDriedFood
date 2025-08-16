<?php
defined("JPATH_PLATFORM") or die;
JFormHelper::loadFieldClass("list");

class JFormFieldShoplabels extends JFormFieldList{
	
    public $type = "shoplabels";

    public function getOptions(){
        include_once JPATH_SITE."/components/com_jshopping/bootstrap.php";
        $options = [];		
		$list = \JSFactory::getTable('ProductLabel')->getListLabels();
        foreach($list as $v){
            $options[$v->id] = $v->name;
        }        
        return $options;
    }
}