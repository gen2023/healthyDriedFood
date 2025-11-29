<?php
use Joomla\CMS\Form\FormHelper;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

defined("JPATH_PLATFORM") or die;
FormHelper::loadFieldClass("list");

class JFormFieldShopdeliverytimes extends JFormFieldList{
	
    public $type = "shopdeliverytimes";

    public function getOptions(){
        include_once JPATH_SITE."/components/com_jshopping/bootstrap.php";
        $options = [];		
		$list = JSFactory::getTable('deliveryTimes')->getDeliveryTimes();
        foreach($list as $v){
            $options[$v->id] = $v->name;
        } 
        return $options;
    }
}