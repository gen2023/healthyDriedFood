<?php
use Joomla\CMS\Form\FormField;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;


class JFormFieldAttributes extends FormField {

    public $type = 'attributes';
  
    protected function getInput(){
        require_once (JPATH_SITE.'/components/com_jshopping/bootstrap.php');
        $jshopConfig = JSFactory::getConfig(); 
         
        $db = Factory::getDBO(); 
        $query = "SELECT attr_id, `name_".$jshopConfig->frontend_lang ."` as name FROM `#__jshopping_attr` ORDER BY attr_ordering";
        $db->setQuery($query);
        $listAttribut = $db->loadObjectList();
        
        $tmp = new stdClass();  
        $tmp->attr_id = "0";
        $tmp->name = Text::_('JALL');
        $attr_1  = array($tmp);
        $attribut_select =array_merge($attr_1 , $listAttribut);    

        $ctrl  =  $this->name;
        $ctrl .= '[]'; 
        
        $value = empty($this->value) ? [] : $this->value;    

        return HTMLHelper::_('select.genericlist', $attribut_select,$ctrl,'class="inputbox" id="attribut_ordering" multiple="multiple" size="6"','attr_id','name', $value );
    }
}