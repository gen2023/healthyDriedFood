<?php
defined("JPATH_PLATFORM") or die;
\JFactory::getLanguage()->load('mod_jshopping_filters_extended', JPATH_ROOT);

class JFormFieldExtrafields extends JFormField{
	
    public $type = "extrafields";

    public function getInput() {
		include_once JPATH_SITE."/components/com_jshopping/bootstrap.php";
		require_once JPATH_SITE.'/modules/mod_jshopping_filters_extended/helper.php';
		$doc = \JFactory::getDocument();
		$doc->addStyleSheet(JURI::root().'components/com_jshopping/css/addons/menu_filter.css');

		$list = \JSFactory::getAllProductExtraField();		
		$values = JSFactory::getAllProductExtraFieldValueDetail();
		$module_params = modJshopping_filters_extendedHelper::getModuleParams();		
		$show_text_ch_as_list = $module_params->show_text_ch_as_list ?? 0;

		$html = '<div class="form_extrafields">';
		foreach($list as $k => $v) {
			if ($show_text_ch_as_list || $v->type == 0) {
				if ($v->type == 0) {
					$options = $values[$k];
					$name = $this->name.'['.$k.'][]';
					$value = $this->value[$k] ?? [];
				} else {
					$options = $this->getExtrafieldsTextValues($k);
					$name = $this->name.'[t_'.$k.'][]';
					$value = $this->value['t_'.$k] ?? [];
				}
				$data = [
					'autocomplete'   => $this->autocomplete,
					'autofocus'      => $this->autofocus,
					'class'          => $this->class,
					'description'    => '',
					'disabled'       => $this->disabled,
					'field'          => $this,
					'group'          => $this->group,
					'hidden'         => $this->hidden,
					'hint'           => '',
					'id'             => $this->id.'_'.$k,
					'label'          => '',
					'labelclass'     => $this->labelclass,
					'multiple'       => 1,
					'name'           => $name,
					'onchange'       => $this->onchange,
					'onclick'        => $this->onclick,
					'pattern'        => $this->pattern,
					'validationtext' => $this->validationtext,
					'readonly'       => $this->readonly,
					'repeat'         => $this->repeat,
					'required'       => (bool) $this->required,
					'size'           => $this->size,
					'spellcheck'     => $this->spellcheck,
					'validate'       => $this->validate,
					'value'          => $value,
					'dataAttribute'  => '',
					'dataAttributes' => $this->dataAttributes,
					'parentclass'    => $this->parentclass,
					'options' => $options
				];
				$this->layout = 'joomla.form.field.list-fancy-select';
				$html .= '<div class="control-group">';
					$html .= '<div class="control-label">'.$v->name.'</div>';
					$html .= '<div class="controls">';
						$html .= $this->getRenderer($this->layout)->render($data);		
					$html .= '</div>';
				$html .= '</div>';
			} else {
				$value = $this->value[$k] ?? '';
				$html .= '<div class="control-group">';
					$html .= '<div class="control-label">'.$v->name.'</div>';
					$html .= '<div class="controls">';
						$html .= '<input type="text" class="form-control" name="'.$this->name.'['.$k.']'.'" value="'.$value.'">';
					$html .= '</div>';
				$html .= '</div>';
			}
		}
		$html .= "</div>";

		return $html;
	}

	private function getExtrafieldsTextValues($id) {		
        $rows = array();
        $db = \JFactory::getDbo();
		$query = "SELECT distinct `extra_field_".$id."` as val FROM `#__jshopping_products` as p
		LEFT JOIN `#__jshopping_products_to_extra_fields` as ex ON ex.product_id = p.product_id
		WHERE `extra_field_".$id."`!='' 
		ORDER BY val";  
		$db->setQuery($query);
		$list = $db->loadObjectList();		
		foreach($list as $v){
			$rows[$v->val] = $v->val;
		}
		return $rows;
	}
	
}