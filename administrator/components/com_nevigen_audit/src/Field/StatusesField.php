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

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\ListField;

class StatusesField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'statuses';

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
		$lang  = Factory::getApplication()->getLanguage()->getTag();
		$query = $db->getQuery(true)
			->select(['s.status_id', $db->quoteName('name_' . $lang, 'title')])
			->from($db->quoteName('#__jshopping_order_status', 's'))
			->order($db->escape('s.ordering') . ' ' . $db->escape('asc'));
		$items = $db->setQuery($query)->loadObjectList();

		// Prepare options
		$options = parent::getOptions();
		foreach ($items as $item)
		{
			if (empty($item->title))
			{
				continue;
			}

			$option        = new \stdClass();
			$option->value = $item->status_id;
			$option->text  = $item->title;

			$options[] = $option;
		}

		return $options;
	}
}
