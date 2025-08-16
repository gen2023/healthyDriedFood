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

class PaymentField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'methods_payment';

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
			->select(['pm.payment_id', $db->quoteName($lang->get('name'),'title')])
			->from($db->quoteName('#__jshopping_payment_method', 'pm'))
			->whereIn('pm.payment_publish', [0, 1])
			->order($db->escape('pm.payment_ordering') . ' ' . $db->escape('asc'));
		$items = $db->setQuery($query)->loadObjectList();

		// Prepare options
		$options = parent::getOptions();
		foreach ($items as $item)
		{
			$option        = new \stdClass();
			$option->value = $item->payment_id;
			$option->text  = $item->title;

			$options[] = $option;
		}

		return $options;
	}
}
