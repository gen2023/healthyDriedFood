<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Field\Methods;

\defined('_JEXEC') or die;

use Joomla\CMS\Form\Field\ListField;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

class ShippingField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'methods_shipping';

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
		$lang  = JSFactory::getLang();
		$query = $db->getQuery(true)
			->select(['sm.shipping_id', $db->quoteName($lang->get('name'),'title')])
			->from($db->quoteName('#__jshopping_shipping_method', 'sm'))
			->whereIn('sm.published', [0, 1])
			->order($db->escape('sm.ordering') . ' ' . $db->escape('asc'));
		$items = $db->setQuery($query)->loadObjectList();

		// Prepare options
		$options = parent::getOptions();
		foreach ($items as $item)
		{
			$option        = new \stdClass();
			$option->value = $item->shipping_id;
			$option->text  = $item->title;

			$options[] = $option;
		}

		return $options;
	}
}
