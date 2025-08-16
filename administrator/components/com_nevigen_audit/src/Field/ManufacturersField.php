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
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

class ManufacturersField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'manufacturers';

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
		$model = JSFactory::getModel('Manufacturers');
		$items = $model->getList();
		foreach ($items as $item)
		{
			if (empty($item->name)){
				continue;
			}
			$option        = new \stdClass();
			$option->value = $item->manufacturer_id;
			$option->text  = $item->name;

			$options[] = $option;
		}

		return $options;
	}
}