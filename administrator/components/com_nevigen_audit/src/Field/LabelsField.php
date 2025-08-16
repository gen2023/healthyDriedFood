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

use Joomla\CMS\Form\Field\ListField;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

class LabelsField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'labels';

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
		// Prepare options
		$options = parent::getOptions();
		$labels = JSFactory::getModel('Productlabels');
		$items = $labels->getList();

		foreach ($items as $item)
		{
			if (empty($item->name)){
				continue;
			}

			$option        = new \stdClass();
			$option->value = $item->id;
			$option->text  = $item->name;

			$options[] = $option;
		}

		return $options;
	}
}