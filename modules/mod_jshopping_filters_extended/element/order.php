<?php
use Joomla\CMS\Form\FormField;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

defined('_JEXEC') or die;

class JFormFieldOrder extends FormField {

    public $type = 'order';

    protected function getInput(){
        require_once (JPATH_SITE.'/components/com_jshopping/bootstrap.php');
        $language = Factory::getLanguage();
        $language->load('mod_jshopping_filters_extended');
        $lang ['manufacturer']= Text::_('_JSHOP_MANUFACTURERS_FILTER');
        $lang ['categories']= Text::_('_JSHOP_CATEGORIES_FILTER');
        $lang ['vendors']= Text::_('_JSHOP_VENDORS_FILTER');
        $lang ['price']= Text::_('_JSHOP_PRICE_FILTER');
        $lang ['characteristic']= Text::_('_JSHOP_CHARACTER_FILTER');
        $lang ['label']= Text::_('_JSHOP_LABEL_FILTER');
        $lang ['availability']= Text::_('_JSHOP_IN_STOCK_FILTER');
        $lang ['photo_filter']= Text::_('_JSHOP_PHOTO_FILTER');
        $lang ['delivery_time']= Text::_('_JSHOP_DELIVERY_TIME_FILTER');
        $lang ['attribute']= Text::_('_JSHOP_ATTRIBUTES_FILTER');
        $lang ['review']= Text::_('_JSHOP_REVIEW_FILTER');
        $lang ['rating']= Text::_('_JSHOP_RATING_FILTER');
        $lang ['shipping']= Text::_('_JSHOP_SHIPPING_FILTER');
		$lang ['search']= Text::_('_JSHOP_SEARCH_FILTER');
        $lang ['sets']= Text::_('_JSHOP_SETS_FILTER');
		
		Joomla\CMS\HTML\HTMLHelper::_('jquery.framework');
        
        $document = Factory::getDocument();
        if (version_compare(JVERSION,'3.0.0','<')) {
            $document->addScript(Uri::root().'modules/mod_jshopping_filters_extended/js/jquery.min.js');
            $document->addScript(Uri::root().'modules/mod_jshopping_filters_extended/js/jquery-noconflict.js');
        }
        $document->addScript(Uri::root().'modules/mod_jshopping_filters_extended/js/jquery.nestable.js');
        $document->addScript(Uri::root().'modules/mod_jshopping_filters_extended/js/script-admin.js');
        $document->addStyleSheet(Uri::root().'modules/mod_jshopping_filters_extended/css/mod_jshopping_filters_admin.css');
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
