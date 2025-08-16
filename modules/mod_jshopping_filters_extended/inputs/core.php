<?php
class InputsFiltersExtendedCore {

    private $use_select_chosen = 0;
    private $use_select_chosen_multiple = 0;
    private $filter_number = 1;
    private $element = null;
    private $folder = '';

    function __construct($params = array()){
        foreach($params as $k=>$v){
            $this->$k = $v;
        }
    }

    function set($k, $v){
        $this->$k = $v;
    }

    function setFolder($dir) {
        $this->folder = $dir;
    }

    function getSelect($name, $values, $selected = '', $image = '', $imagedir = '', $field_id = 'id', $css_class = ''){
        if ($this->use_select_chosen && $this->use_select_chosen_multiple) {
            $first_name = '';
        } else {
            $first_name = \JText::_('JALL');
        }

        $values = array_merge(
            [(object)[$field_id => '', 'name' => $first_name]],
            $values
        );
        $css_class_select = $css_class;
        $multiple = '';
        if ($this->use_select_chosen){
            $css_class_select .= ' chosen-select ';
            if ($this->use_select_chosen_multiple){
                $multiple = 'multiple="multiple"';         
            }
        }
        foreach($values as $k => $value){
            if (is_array($selected) && in_array($value->$field_id, $selected)) {
                $values[$k]->checked = ' selected="selected" ';
            } elseif ($value->$field_id == $selected) {
                $values[$k]->checked = ' selected="selected" ';
            } else {
                $values[$k]->checked = "";
            }
            if (isset($value->disable) && $value->disable){
                $values[$k]->disabled = ' disabled="disabled" ';
            } else {
                $values[$k]->disabled = "";
            }
        }
        ob_start();
        include $this->folder."/".'inputs_select.php';
        $html .= ob_get_contents();
        ob_end_clean();        
        return $html;
    }

    function getRadio($name, $values, $selected = '', $image = '', $imagedir = '', $field_id = 'id', $css_class = ''){
        $html = '';
        $values = array_merge(
            [(object)[$field_id => '', 'name' => \JText::_('JALL')]],
            $values
        );
        foreach($values as $key => $value){            
            $disabled = "";                
            $checked = "";
            if (is_array($selected) && in_array($value->$field_id, $selected)) {
                $checked='checked="checked"' ;
            } elseif ($value->$field_id == $selected || ($value->$field_id == '' && (int)$value->$field_id == (int)$selected)) {
                $checked='checked="checked"' ;
            }
            if (isset($value->disable) && $value->disable) $disabled = ' disabled="disabled" ';
            ob_start();
            include $this->folder."/".'inputs_radio.php';
            $html .= ob_get_contents();
            ob_end_clean();
        }
        return $html;
    }

    function getCheckboxs($name, $values, $selected = '', $image = '', $imagedir = '', $field_id = 'id', $css_class = ''){
        $html = '';
        foreach($values as $key => $value){            
            $disabled = "";                
            $checked = "";
            if (is_array($selected) && in_array($value->$field_id, $selected)) {
                $checked='checked="checked"' ;
            } elseif ($value->$field_id == $selected) {
                $checked='checked="checked"' ;
            }
            if (isset($value->disable) && $value->disable) $disabled = ' disabled="disabled" ';
            ob_start();
            include $this->folder."/".'inputs_checkbox.php';
            $html .= ob_get_contents();
            ob_end_clean();
        }
        return $html;        
    }

}