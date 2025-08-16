<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\Task\NevigenAudit\Field\Table;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;

class StatusesField extends FormField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.2.0
	 */
	protected $type = 'table_statuses';

	/**
	 * Name of the layout being used to render the field
	 *
	 * @var    string
	 *
	 * @since 1.2.0
	 */
	protected $layout = 'plugins.task.nevigen_audit.field.table.statuses';

	protected ?array $items = null;

	protected function getLayoutData()
	{
		$data=  parent::getLayoutData();
		$data['items'] = $this->getStatuses();

		return $data;
	}

	protected function getStatuses()
	{
		if ($this->items !== null)
		{
			return $this->items;
		}

		$db          = $this->getDatabase();
		$lang        = Factory::getApplication()->getLanguage()->getTag();
		$query       = $db->getQuery(true)
			->select([$db->quoteName('s.status_id', 'id'), $db->quoteName('name_' . $lang, 'name')])
			->from($db->quoteName('#__jshopping_order_status', 's'))
			->order($db->escape('s.ordering') . ' ' . $db->escape('asc'));
		$items       = $db->setQuery($query)->loadAssocList();
		$this->items = $items;

		return $items;

	}

}