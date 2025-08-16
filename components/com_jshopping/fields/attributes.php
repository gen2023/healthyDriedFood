<?php
defined("JPATH_PLATFORM") or die;
\JFactory::getLanguage()->load('mod_jshopping_filters_extended', JPATH_ROOT);

class JFormFieldAttributes extends JFormField{
	
    public $type = "attributes";

    public function getInput() {
		include_once JPATH_SITE."/components/com_jshopping/bootstrap.php";
		$doc = \JFactory::getDocument();		
		$doc->addStyleSheet(JURI::root().'components/com_jshopping/css/addons/menu_filter.css');

		$list = \JSFactory::getAllAttributes();
		$attributvalue = \JSFactory::getTable('attributvalue');	

		$html = '<div class="form_attributs">';
		foreach($list as $k => $v) {
			$attr_values = $attributvalue->getAllValues($v->attr_id);
			$options = [];
			foreach($attr_values as $_aval) {
				$options[$_aval->value_id] = $_aval->name;
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
				'id'             => $this->id.'_'.$v->attr_id,
				'label'          => '',
				'labelclass'     => $this->labelclass,
				'multiple'       => 1,
				'name'           => $this->name.'[]',//$this->name.'['.$v->attr_id.'][]',
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
				'value'          => $this->value ?? [],//$this->value[$k] ?? [],
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
			
		}
		$html .= "</div>";

		return $html;
	}

	
}