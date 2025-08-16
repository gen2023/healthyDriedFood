<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\View\Users;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\GenericDataException;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Toolbar\Toolbar;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\NevigenAudit\Administrator\Traits\EventsViewTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\LinkViewTrait;

class HtmlView extends BaseHtmlView
{
	use LinkViewTrait;
	use EventsViewTrait;

	/**
	 * Model state variables.
	 *
	 * @var  \Joomla\CMS\Object\CMSObject
	 *
	 * @since  1.0.0
	 */
	protected $state;

	/**
	 * An array of items.
	 *
	 * @var  array
	 *
	 * @since  1.0.0
	 */
	protected $items;

	/**
	 * Pagination object.
	 *
	 * @var  \Joomla\CMS\Pagination\Pagination
	 *
	 * @since  1.0.0
	 */
	protected $pagination;

	/**
	 * Form object for search filters.
	 *
	 * @var  \Joomla\CMS\Form\Form;
	 *
	 * @since  1.0.0
	 */
	public $filterForm;

	/**
	 * The active search filters.
	 *
	 * @var  array
	 *
	 * @since  1.0.0
	 */
	public $activeFilters;

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
		$this->state         = $this->get('State');
		$this->items         = $this->get('Items');
		$this->pagination    = $this->get('Pagination');
		$this->filterForm    = $this->get('FilterForm');
		$this->activeFilters = $this->get('ActiveFilters');
		$this->canDo         = ContentHelper::getActions('com_users');
		$this->link          = $this->getLink('index.php?option=com_nevigen_audit&view=users');

		$this->statistic = $this->get('Statistic');
		$this->tabs      = [];

		// Check for errors
		if (!empty($errors = $this->get('Errors')))
		{
			throw new GenericDataException(implode('\n', $errors), 500);
		}

		if ($this->getLayout() !== 'modal')
		{
			// Add title and toolbar
			$this->addToolbar();

			// Trigger `onNevigenAuditAdministratorViewAddTabs` event
			$this->triggerViewAddTabsEvent($this->tabs, 'com_nevigen_audit.users');
		}

		Factory::getApplication()->getLanguage()->load('com_users');


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
			. ': ' . Text::_('COM_NEVIGEN_AUDIT_USERS_AUDIT'), 'cart');

		$toolbar = Toolbar::getInstance();
		$user    = $this->getCurrentUser();

		$toolbar->addNew('users.add');
		$toolbar->unpublish('users.block', 'COM_USERS_TOOLBAR_BLOCK')
			->listCheck(true);
		$toolbar->standardButton('unblock', 'COM_USERS_TOOLBAR_UNBLOCK', 'users.unblock')
			->listCheck(true);
		$toolbar->delete('users.delete')
			->text('JACTION_DELETE')
			->message('JGLOBAL_CONFIRM_DELETE')
			->listCheck(true);

		if (!empty($this->items))
		{
			$toolbar->standardButton('export', 'COM_NEVIGEN_AUDIT_USERS_EXPORT',
				'users.exportToCSV')->icon('fa fa-file-export');
		}

		// Trigger `onNevigenAuditPrepareAdministratorToolbar` event
		$this->triggerToolbarPrepareEvent($toolbar);

		// Add preferences button
		if ($user->authorise('core.admin', 'com_nevigen_audit')
			|| $user->authorise('core.options', 'com_nevigen_audit'))
		{
			$toolbar->preferences('com_nevigen_audit');
		}
	}

	/**
	 * Returns an array of fields the table can be sorted by.
	 *
	 * @return  array  Array containing the field name to sort by as the key and display text as value.
	 *
	 * @since  1.0.0
	 */
	protected function getSortFields()
	{
		return [
			'us.user_id'      => Text::_('JGRID_HEADING_ID'),
			'us.u_name'       => Text::_('JSHOP_USERNAME'),
			'u.lastvisitDate' => Text::_('COM_NEVIGEN_AUDIT_USERS_LOGIN_DATE'),
		];
	}
}