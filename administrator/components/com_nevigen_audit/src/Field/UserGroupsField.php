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

class UserGroupsField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'userGroups';

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
			->select(['usergroup_id', 'usergroup_name', $db->quoteName($lang->get('name'), 'name')])
			->from($db->quoteName('#__jshopping_usergroups'));
		$items = $db->setQuery($query)->loadObjectList();

		// Prepare options
		$options = parent::getOptions();
		foreach ($items as $item)
		{
			$name = $item->usergroup_name;
			if (!empty($item->name))
			{
				$name = $item->name;
			}
			$option        = new \stdClass();
			$option->value = $item->usergroup_id;
			$option->text  = $name;

			$options[] = $option;
		}

		return $options;
	}
}
