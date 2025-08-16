<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Field;

\defined('_JEXEC') or die;

use Joomla\CMS\Form\Field\ListField;

class CurrenciesField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'currencies';

	/**
	 * Option value key.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $_valueKey = null;

	/**
	 * Method to attach a Form object to the field.
	 *
	 * @param   \SimpleXMLElement  $element  The SimpleXMLElement object representing the `<field>` tag.
	 * @param   mixed              $value    The form field value to validate.
	 * @param   string             $group    The field name group control value.
	 *
	 * @throws \Exception
	 *
	 * @return  bool  True on success.
	 *
	 * @since  1.0.0
	 */
	public function setup(\SimpleXMLElement $element, $value, $group = null): bool
	{
		if ($return = parent::setup($element, $value, $group))
		{
			$this->_valueKey = (!empty($this->element['valueKey']))
				? $this->element['valueKey'] : 'currency_id';
		}

		return $return;
	}

	/**
	 * Method to get the field options.
	 *
	 * @throws  \Exception
	 *
	 * @return  array  The field option objects.
	 *
	 * @since  1.0.0
	 */
	protected function getOptions(): ?array
	{
		// Get items
		$db    = $this->getDatabase();
		$query = $db->getQuery(true)
			->select(['c.'.$this->_valueKey, 'c.currency_name'])
			->from($db->quoteName('#__jshopping_currencies', 'c'));
		$items = $db->setQuery($query)->loadObjectList();

		// Prepare options
		$options = parent::getOptions();
		foreach ($items as $item)
		{
			$option        = new \stdClass();
			$option->value = $item->{$this->_valueKey};
			$option->text  = $item->currency_name;

			$options[] = $option;
		}

		return $options;
	}
}
