<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Field\Date;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;
use Joomla\Registry\Registry;

class PeriodField extends FormField
{
	/**
	 * Field localization.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $locale = null;

	/**
	 * Name of the layout being used to render the field
	 *
	 * @var    string
	 *
	 * @since  1.0.0
	 */
	protected $layout = 'components.nevigen_audit.field.date.period';

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
		if (is_array($value))
		{
			$value = array_filter($value);
		}

		if (empty($value) && !empty((string) $element['default']))
		{
			$value = (string) $element['default'];
		}

		if (!empty($value) && is_string($value))
		{
			$value = $this->parseStringValue($value);
		}

		if ($return = parent::setup($element, $value, $group))
		{
			$locale  = Factory::getApplication()->getLanguage()->getLocale();
			$locales = [
				'ru' => 'ru',
				'uk_UA' => 'ua',
			];
			foreach ($locales as $lk => $lv)
			{
				if (in_array($lk, $locale))
				{
					$this->locale = $lv;
					break;
				}
			}
		}

		return $return;
	}

	/**
	 * Method to convert string value to array.
	 *
	 * @param   string|null  $string  String value.
	 *
	 * @return array Value array data.
	 *
	 * @since 1.0.0
	 */
	protected function parseStringValue(?string $string = null): array
	{
		$result = [];
		if (empty($string))
		{
			return $result;
		}

		if (strpos($string, '{') !== false)
		{
			return (new Registry($string))->toArray();
		}

		if (strpos($string, 'from') === false && strpos($string, 'to') === false)
		{
			return $result;
		}

		$parts = explode(';', $string, 2);
		foreach ($parts as $part)
		{
			list($type, $value) = explode(':', $part, 2);
			$type  = trim($type);
			$value = trim($value);
			if (empty($type) || empty($value))
			{
				continue;
			}

			if ($type === 'from' || $type === 'to')
			{
				$result[$type] = $value;
			}
		}

		return $result;
	}

	/**
	 * Method to get the field input markup.
	 *
	 * @throws \Exception
	 *
	 * @return  string  The field input markup.
	 *
	 * @since  1.0.0
	 */
	protected function getInput()
	{
		Factory::getApplication()->getLanguage()->load('com_nevigen_audit');

		return parent::getInput();
	}

	/**
	 * Method to get the data to be passed to the layout for rendering.
	 *
	 * @throws  \Exception
	 *
	 * @return  array Layout data array.
	 *
	 * @since  1.0.0
	 */
	protected function getLayoutData()
	{
		if ($data = parent::getLayoutData())
		{
			$data['locale'] = $this->locale;
		}

		return $data;
	}
}