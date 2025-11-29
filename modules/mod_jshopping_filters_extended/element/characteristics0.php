<?php
use Joomla\CMS\Form\FormField;
use Joomla\CMS\HTML\HTMLHelper;


use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

class JFormFieldCharacteristics0 extends FormField {

    public $type = 'characteristics0';
  
    protected function getInput(){
        require_once (JPATH_SITE.'/components/com_jshopping/bootstrap.php'); 
        $jshopConfig = JSFactory::getConfig(); 
        $db = Factory::getDBO();
        $ordering = "G.ordering, F.ordering";   
        $query = "SELECT F.id, F.`name_".$jshopConfig->frontend_lang ."` as name 
                  FROM `#__jshopping_products_extra_fields` as F 
                  left join `#__jshopping_products_extra_field_groups` as G on G.id=F.group 
                  WHERE F.type!=1
                  order by ".$ordering;
        $db->setQuery($query);
        $list = $db->loadObjectList('id');        
        $ctrl  =  $this->name;
        $ctrl .= '[]';         
        $value = empty($this->value) ? [] : $this->value;                

        return HTMLHelper::_('select.genericlist', $list, $ctrl,'class="inputbox" id="characteristic" multiple="multiple" size="6"', 'id','name', $value);
    }
}