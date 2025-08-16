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

class ColumnsDBField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.1
	 */
	protected $type = 'columnsDB';

	/**
	 * Table name.
	 *
	 * @var  string
	 *
	 * @since  1.0.1
	 */
	protected $_table = null;

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
	 * @since  1.0.1
	 */
	public function setup(\SimpleXMLElement $element, $value, $group = null): bool
	{
		if ($return = parent::setup($element, $value, $group))
		{
			$this->_table = (!empty($this->element['table']))
				? $this->element['table'] : null;
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
	 * @since  1.0.1
	 */
	protected function getOptions(): ?array
	{
		// Get items
		$db = $this->getDatabase();

		// Prepare options
		$options = parent::getOptions();
		if (!empty($this->_table))
		{
			$items = $db->getTableColumns($this->_table);
			foreach ($items as $name => $type)
			{
				$option        = new \stdClass();
				$option->value = $name;
				$option->text  = $name;

				$options[] = $option;
			}
		}

		return $options;
	}
}