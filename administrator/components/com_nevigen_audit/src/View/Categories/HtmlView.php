<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\View\Categories;

\defined('_JEXEC') or die;

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
	 * Categories statistic array
	 *
	 * @var array|null
	 *
	 * @since 1.0.0
	 */
	protected ?array $statistic = null;

	/**
	 * Additional tabs array
	 *
	 * @var array|null
	 *
	 * @since 1.0.0
	 */
	protected ?array $tabs = null;

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
		$this->link          = $this->getLink('index.php?option=com_nevigen_audit&view=categories');

		$this->statistic   = $this->get('Statistic');
		$this->seoAnalysis = $this->get('SeoAnalysis');
		$this->tabs        = [];

		// Check for errors
		if (!empty($errors = $this->get('Errors')))
		{
			throw new GenericDataException(implode('\n', $errors), 500);
		}

		// Add title and toolbar
		$this->addToolbar();

		// Trigger `onNevigenAuditAdministratorViewAddTabs` event
		$this->triggerViewAddTabsEvent($this->tabs,'com_nevigen_audit.categories');


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
			. ': ' . Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT'), 'cart');

		$toolbar = Toolbar::getInstance();
		$user    = $this->getCurrentUser();

		$toolbar->addNew('categories.add');
		$toolbar->publish('categories.publish')->listCheck(true);
		$toolbar->unpublish('categories.unpublish')->listCheck(true);
		$toolbar->delete('categories.delete')
			->text('JACTION_DELETE')
			->message('JGLOBAL_CONFIRM_DELETE')
			->listCheck(true);

		// Trigger `onNevigenAuditPrepareAdministratorToolbar` event
		$this->triggerToolbarPrepareEvent($toolbar);

		// Add preferences button
		if ($user->authorise('core.admin', 'com_nevigen_audit')
			|| $user->authorise('core.options', 'com_nevigen_audit'))
		{
			$toolbar->preferences('com_nevigen_audit');
		}
	}
}