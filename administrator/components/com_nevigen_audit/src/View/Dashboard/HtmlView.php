<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\View\Dashboard;

\defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\GenericDataException;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Toolbar\Toolbar;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;
use Joomla\Component\NevigenAudit\Administrator\Traits\EventsViewTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\LinkViewTrait;

class HtmlView extends BaseHtmlView
{
	use LinkViewTrait;
	use EventsViewTrait;

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse.
	 *
	 * @throws \Exception
	 *
	 * @since  1.0.0
	 */
	public function display($tpl = null)
	{

		$this->groups = $this->get('Groups');

		// Load orders chart statistics
		$this->get('OrdersStatisticsTotal');
		$this->get('OrdersStatisticsPaid');
		$this->get('OrdersStatisticsCancel');

		// Check for errors
		if (!empty($errors = $this->get('Errors')))
		{
			throw new GenericDataException(implode('\n', $errors), 500);
		}

		$this->dashboardTop         = '';
		$this->dashboardAfterOrders = '';
		$this->dashboardBottom      = '';

		// Trigger `onNevigenAuditAdministratorDashboard` event
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditAdministratorDashboard',
			[&$this->dashboardTop, &$this->dashboardAfterOrders, &$this->dashboardBottom]);

		if (!is_string($this->dashboardTop))
		{
			$this->dashboardTop = '';
		}

		if (!is_string($this->dashboardAfterOrders))
		{
			$this->dashboardAfterOrders = '';
		}

		if (!is_string($this->dashboardBottom))
		{
			$this->dashboardBottom = '';
		}

		// Load javascript constants
		Text::script('COM_NEVIGEN_AUDIT_LOADING_DATA');

		// Add title and toolbar
		$this->addToolbar();

		parent::display($tpl);
	}

	/**
	 * Add title and toolbar.
	 *
	 * @throws \Exception
	 *
	 * @since  1.0.0
	 */
	protected function addToolbar()
	{
		// Set page title
		ToolbarHelper::title(Text::_('COM_NEVIGEN_AUDIT')
			. ': ' . Text::_('COM_NEVIGEN_AUDIT_DASHBOARD'), 'chart-line fa-chart-line icon-fw');

		$toolbar = Toolbar::getInstance();

		// Trigger `onNevigenAuditPrepareAdministratorToolbar` event
		$this->triggerToolbarPrepareEvent($toolbar);
	}
}