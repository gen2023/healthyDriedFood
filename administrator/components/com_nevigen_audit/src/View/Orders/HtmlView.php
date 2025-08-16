<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\View\Orders;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\GenericDataException;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Toolbar\Toolbar;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\NevigenAudit\Administrator\Traits\EventsViewTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\LinkViewTrait;
use Joomla\Registry\Registry;

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
	 * Component params.
	 *
	 * @var  Registry
	 *
	 * @since  1.1.0
	 */
	protected $params;

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
		$this->state            = $this->get('State');
		$this->items            = $this->get('Items');
		$this->pagination       = $this->get('Pagination');
		$this->filterForm       = $this->get('FilterForm');
		$this->activeFilters    = $this->get('ActiveFilters');
		$this->link             = $this->getLink('index.php?option=com_nevigen_audit&view=orders');
		$this->params           = $this->state->params;
		$this->order_quick_view = (int)$this->params->get('order_quick_view', 1) === 1;
		$this->client_id = Factory::getApplication()->input->getInt('client_id',0);

		$this->statistic = $this->get('Statistic');
		$this->statuses  = $this->get('Statuses');
		$this->tabs      = [];


		// Check for errors
		if (!empty($errors = $this->get('Errors')))
		{
			throw new GenericDataException(implode('\n', $errors), 500);
		}

		// Add title and toolbar
		$this->addToolbar();

		// Trigger `onNevigenAuditAdministratorViewAddTabs` event
		$this->triggerViewAddTabsEvent($this->tabs, 'com_nevigen_audit.orders');

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
			. ': ' . Text::_('COM_NEVIGEN_AUDIT_ORDERS'), 'dashboard');

		$toolbar = Toolbar::getInstance();
		$toolbar->addNew('orders.add');
		$toolbar->delete('orders.delete')
			->text('JACTION_DELETE')
			->message('JGLOBAL_CONFIRM_DELETE')
			->listCheck(true);

		// Trigger `onNevigenAuditPrepareAdministratorToolbar` event
		$this->triggerToolbarPrepareEvent($toolbar);

		ToolbarHelper::inlinehelp();
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
			'o.order_id'           => Text::_('JSHOP_ID'),
			'o.order_number'       => Text::_('JSHOP_NUMBER'),
			'o.user_id'            => Text::_('JSHOP_USER'),
			'o.order_status'       => Text::_('JSHOP_STATUS'),
			'o.order_date'         => Text::_('JSHOP_DATE'),
			'o.shipping_method_id' => Text::_('JSHOP_SHIPPINGS'),
			'o.payment_method_id'  => Text::_('JSHOP_PAYMENT'),
			'o.order_total'        => Text::_('JSHOP_ORDER_TOTAL'),
		];
	}
}