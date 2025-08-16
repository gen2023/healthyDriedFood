<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Traits;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Toolbar\Toolbar;
use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;

trait EventsViewTrait
{
	/**
	 * Method to trigger `onNevigenAuditPrepareAdministratorListItem` event.
	 *
	 * @param   array        $items    List items array.
	 * @param   string|null  $context  Context selector string.
	 *
	 * @throws \Exception
	 *
	 * @since 1.0.0
	 */
	protected function triggerItemsPrepareEvent(array $items = [], ?string $context = null)
	{
		if (empty($context))
		{
			$context = Factory::getApplication()->input->getCmd('option', 'com_nevigen_audit') . '.'
				. $this->getName();

			if ($this->getLayout() === 'modal')
			{
				$context .= '.modal';
			}
		}

		if (!empty($items))
		{
			$event = 'onNevigenAuditPrepareAdministratorListItem';
			foreach ($items as $item)
			{
				$argc = [$context, &$item];

				PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], $event, $argc);
			}
		}
	}

	/**
	 * Method to trigger `onNevigenAuditPrepareAdministratorToolbar` event.
	 *
	 * @param   Toolbar      $toolbar  Toolbar object class.
	 * @param   string|null  $context  Context selector string.
	 *
	 * @throws \Exception
	 *
	 * @since 1.0.0
	 */
	protected function triggerToolbarPrepareEvent(Toolbar $toolbar, ?string $context = null)
	{
		if (empty($context))
		{
			$context = Factory::getApplication()->input->getCmd('option', 'com_nevigen_audit') . '.'
				. $this->getName();
		}

		// Trigger `onNevigenAuditPrepareAdministratorToolbar` event
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditPrepareAdministratorToolbar',
			[$context, $toolbar]);
	}

	/**
	 * Method to trigger `onNevigenAuditAdministratorViewAddTabs` event.
	 *
	 * @param   array        $tabs     Tabs array.
	 * @param   string|null  $context  Context selector string.
	 *
	 * @throws \Exception
	 *
	 * @since 1.0.0
	 */
	protected function triggerViewAddTabsEvent(array &$tabs, ?string $context = null)
	{
		if (empty($context))
		{
			$context = Factory::getApplication()->input->getCmd('option', 'com_nevigen_audit') . '.'
				. $this->getName();
		}

		// Trigger `onNevigenAuditAdministratorViewAddTabs` event
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditAdministratorViewAddTabs',
			[$context, &$tabs]);
	}
}