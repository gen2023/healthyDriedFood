<?php
defined('_JEXEC') or die;

class JFormFieldOrder extends JFormField {

    public $type = 'order';

    protected function getInput(){
        require_once (JPATH_SITE.'/components/com_jshopping/bootstrap.php');
        $language = \JFactory::getLanguage();
        $language->load('mod_jshopping_filters_extended');
        $lang ['manufacturer']= \JText::_('_JSHOP_MANUFACTURERS_FILTER');
        $lang ['categories']= \JText::_('_JSHOP_CATEGORIES_FILTER');
        $lang ['vendors']= \JText::_('_JSHOP_VENDORS_FILTER');
        $lang ['price']= \JText::_('_JSHOP_PRICE_FILTER');
        $lang ['characteristic']= \JText::_('_JSHOP_CHARACTER_FILTER');
        $lang ['label']= \JText::_('_JSHOP_LABEL_FILTER');
        $lang ['availability']= \JText::_('_JSHOP_IN_STOCK_FILTER');
        $lang ['photo_filter']= \JText::_('_JSHOP_PHOTO_FILTER');
        $lang ['delivery_time']= \JText::_('_JSHOP_DELIVERY_TIME_FILTER');
        $lang ['attribute']= \JText::_('_JSHOP_ATTRIBUTES_FILTER');
        $lang ['review']= \JText::_('_JSHOP_REVIEW_FILTER');
        $lang ['rating']= \JText::_('_JSHOP_RATING_FILTER');
        $lang ['shipping']= \JText::_('_JSHOP_SHIPPING_FILTER');
		$lang ['search']= \JText::_('_JSHOP_SEARCH_FILTER');
        $lang ['sets']= \JText::_('_JSHOP_SETS_FILTER');
		
		Joomla\CMS\HTML\HTMLHelper::_('jquery.framework');
        
        $document = \JFactory::getDocument();
        if (version_compare(JVERSION,'3.0.0','<')) {
            $document->addScript(JURI::root().'modules/mod_jshopping_filters_extended/js/jquery.min.js');
            $document->addScript(JURI::root().'modules/mod_jshopping_filters_extended/js/jquery-noconflict.js');
        }
        $document->addScript(JURI::root().'modules/mod_jshopping_filters_extended/js/jquery.nestable.js');
        $document->addScript(JURI::root().'modules/mod_jshopping_filters_extended/js/script-admin.js');
        $document->addStyleSheet(JURI::root().'modules/mod_jshopping_filters_extended/css/mod_jshopping_filters_admin.css');
        $value_arr = explode(',',$this->value);
        $output = '<br/><br /><div class="dd"><ol class="dd-list">';
        foreach ($value_arr as $v) {
            $output .= '<li class="dd-item" data-id="'.$v.'"><div class="dd-handle">'.$lang[$v].'</div></li>';
        }
        $output .= '</ol></div>';
        $input = '<input type="hidden" name="'.$this->name.'" id="jform_params_filter_order" value="'.$this->value.'"/>';
        return $output.'<br />'.$input;
    }
}
