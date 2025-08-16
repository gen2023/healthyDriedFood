<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\System\NevigenJshopOneStepCheckout\Field;

use Joomla\CMS\Form\FormField;

class SortingField extends FormField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'sorting';

	/**
	 * Name of the layout being used to render the field
	 *
	 * @var    string
	 *
	 * @since  1.0.0
	 */
	protected $layout = 'plugins.system.nevigen_jshop_onestepcheckout.field.sorting';
	/**
	 * Fields address jshop
	 *
	 * @var    array|null
	 *
	 * @since  1.0.0
	 */
	protected ?array $fields = null;


	/**
	 * Method to attach a Form object to the field.
	 *
	 * @param   \SimpleXMLElement  $element  The SimpleXMLElement object representing the `<field>` tag for the form field object.
	 * @param   mixed              $value    The form field value to validate.
	 * @param   string             $group    The field name group control value. This acts as as an array container for the field.
	 *                                       For example if the field has name="foo" and the group value is set to "bar" then the
	 *                                       full field name would end up being "bar[foo]".
	 *
	 * @return  boolean  True on success.
	 *
	 * @since   1.0.0
	 */
	public function setup(\SimpleXMLElement $element, $value, $group = null)
	{
		if ($return = parent::setup($element, $value, $group))
		{
			if ($this->fields === null)
			{
				$jshopConfig  = \JSFactory::getConfig();
				$tmp          = $jshopConfig->getListFieldsRegister();
				$this->fields = $tmp['address'];

				unset($jshopConfig);
				unset($tmp);
			}
			if (empty($this->value))
			{
				$this->value = $this->fields;
			}
		}

		return $return;
	}

	/**
	 * Method to get the data to be passed to the layout for rendering.
	 *
	 * @return  array
	 *
	 * @since 1.0.0
	 */
	protected function getLayoutData()
	{
		$data           = parent::getLayoutData();
		$data['fields'] = $this->fields;

		return $data;
	}
}
