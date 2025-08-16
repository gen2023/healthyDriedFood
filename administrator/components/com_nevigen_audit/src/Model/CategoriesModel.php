<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Model;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\MVC\Model\ListModel;
use Joomla\CMS\Pagination\Pagination;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;
use Joomla\Component\NevigenAudit\Administrator\Traits\ContextModelTrait;
use Joomla\Utilities\ArrayHelper;

class CategoriesModel extends ListModel
{
	use ContextModelTrait;

	/**
	 * Model context string.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $context = 'com_nevigen_audit.categories';

	/**
	 * Count products to categories.
	 *
	 * @var  array|null
	 *
	 * @since  1.0.0
	 */
	protected ?array $products = null;

	/**
	 * Pagination to categories.
	 *
	 * @var  Pagination|null
	 *
	 * @since  1.0.0
	 */
	protected ?Pagination $pagination= null;

	/**
	 * Method to auto-populate the model state.
	 *
	 * @param   string  $ordering   An optional ordering field.
	 * @param   string  $direction  An optional direction (asc|desc).
	 *
	 * @throws  \Exception
	 *
	 * @since  1.0.0
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		$app = Factory::getApplication();

		// Adjust the context to support modal layouts.
		if ($layout = $app->input->get('layout'))
		{
			$this->context .= '.' . $layout;
		}
		// Set search filter state
		$search = $this->getUserStateFromRequest($this->context . '.filter.search', 'filter_search');
		$this->setState('filter.search', $search);

			// List state information
		$ordering  = empty($ordering) ? 'ordering' : $ordering;
		$direction = empty($direction) ? 'asc' : $direction;

		parent::populateState($ordering, $direction);
	}


	public function getItems()
	{
		$_categories = JSFactory::getModel("Categories");

		$filter = ['text_search' => $this->getState('filter.search')];
		$categories = $_categories->getTreeAllCategories($filter, $this->getState('list.ordering'), $this->getState('list.direction'));
		$total = count($categories);
		$items = [];

		if ($this->pagination == null) {
			// Create the pagination object and add the object to the internal cache.
			$this->pagination = new Pagination($total, $this->getState('list.start'), $this->getState('list.limit'));
		}

		$categories = array_slice($categories, $this->pagination->limitstart, $this->pagination->limit);
		if (!empty($categories)) {
			$db    = $this->getDatabase();
			$query = $db->getQuery(true);
			$query->select([
				'c.category_id',
				'COUNT(c.product_id) AS count'
			])
				->from($db->quoteName('#__jshopping_products_to_categories', 'c'))
				->whereIn('c.category_id', ArrayHelper::getColumn($categories, 'category_id'))
				->group('c.category_id');
			$db->setQuery($query);
			$result = $db->loadAssocList('category_id');

			foreach ($categories as $category) {
				$category->products = 0;
				if (isset($result[$category->category_id])) {
					$category->products = $result[$category->category_id]['count'];
				}
				$margin = 10*$category->level;
				$category->separator = '';
				if ((int)$category->level > 1) {
					$category->separator = '<span class="d-inline-block" style="margin-left: '.$margin.'px"></span>';
				}
				$category->tmp_html_col_after_title = "";

			}
		}

		return $categories;
	}

	public function getStatistic()
	{
		$db   = $this->getDatabase();
		$lang = JSFactory::getLang();

		$short_description_field = $db->quoteName($lang->get('short_description'));
		$full_description_field  = $db->quoteName($lang->get('description'));

		$query = $db->getQuery(true)
			->select([
				'SUM(CASE WHEN c.category_publish = 1 THEN 1 ELSE 0 END) AS published',
				'SUM(CASE WHEN c.category_publish = 0 THEN 1 ELSE 0 END) AS unpublished',
				'SUM(CASE WHEN c.category_image IS NULL OR c.category_image = "" THEN 1 ELSE 0 END) AS without_image',
				'SUM(CASE WHEN ' . $short_description_field . ' IS NULL OR ' . $short_description_field . ' = "" THEN 1 ELSE 0 END) AS without_short_description',
				'SUM(CASE WHEN ' . $full_description_field . ' IS NULL OR ' . $full_description_field . ' = "" THEN 1 ELSE 0 END) AS without_full_description',
			])
			->from($db->quoteName('#__jshopping_categories', 'c'));


		$data = $db->setQuery($query)->loadAssoc();

		$data['total'] = $data['published'] + $data['unpublished'];

		$additional = [];
		// Trigger `onNevigenAuditAdministratorModelGetStatistic` event
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditAdministratorModelGetStatistic',
			[$this->context, &$additional, $data]);

		$data['additional'] = $additional;

		return $data;

	}

	public function getSeoAnalysis()
	{
		$db              = $this->getDatabase();
		$data            = [];
		$selectParts     = [];
		$columns         = $db->getTableColumns('#__jshopping_categories');
		$languages       = JSFactory::getModel('languages')->getAllLanguages(1);
		$availableFields = ['alias', 'meta_title', 'meta_description', 'meta_keyword'];

		foreach ($languages as $language)
		{
			foreach ($availableFields as $name)
			{
				$lang  = $name . '_' . $language->language;
				$field = $db->quoteName($lang);
				if (isset($columns[$lang]))
				{
					$selectParts[] = 'SUM(CASE WHEN ' . $field . ' = "" THEN 1 ELSE 0 END) AS '
						. $db->quote($language->language . '_' . $name);
				}
			}
		}

		$query = $db->getQuery(true)
			->select($selectParts)
			->from($db->quoteName('#__jshopping_categories'));

		$result = $db->setQuery($query)->loadAssoc();

		foreach ($availableFields as $name)
		{
			foreach ($languages as $language)
			{
				$langKey = $language->language . '_' . $name;
				if (isset($result[$langKey]))
				{
					$data[$name][$language->language] = $result[$langKey];
				}
			}
		}

		$additional = [];
		// Trigger `onNevigenAuditAdministratorModelGetSeoAnalysis` event
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditAdministratorModelGetSeoAnalysis',
			[$this->context, &$additional, $data]);

		$data['additional'] = $additional;

		return $data;
	}

	/**
	 * Get the filter form
	 *
	 * @param   array    $data      data
	 * @param   boolean  $loadData  load current data
	 *
	 * @return  Form|null  The \JForm object or null if the form can't be found
	 *
	 * @since   1.0.0
	 */
	public function getFilterForm($data = [], $loadData = true)
	{
		$this->filterFormName = 'filter_categories';

		if (empty($this->filterFormName)) {
			return null;
		}

		try {
			// Get the form.
			return $this->loadForm($this->context . '.filter', $this->filterFormName, ['control' => '', 'load_data' => $loadData]);
		} catch (\RuntimeException $e) {
		}

		return null;
	}

	/**
	 * Method to get a \JPagination object for the data set.
	 *
	 * @return  Pagination  A Pagination object for the data set.
	 *
	 * @since   1.0.0
	 */
	public function getPagination()
	{
		return $this->pagination;
	}

	/**
	 * Gets the value of a user state variable and sets it in the session
	 *
	 * This is the same as the method in Application except that this also can optionally
	 * force you back to the first page when a filter has changed
	 *
	 * @param   string   $key        The key of the user state variable.
	 * @param   string   $request    The name of the variable passed in a request.
	 * @param   string   $default    The default value for the variable if not found. Optional.
	 * @param   string   $type       Filter for the variable. Optional.
	 *                   @see        \Joomla\CMS\Filter\InputFilter::clean() for valid values.
	 * @param   boolean  $resetPage  If true, the limitstart in request is set to zero
	 *
	 * @return  mixed  The request user state.
	 *
	 * @since   1.0.0
	 */
	public function getUserStateFromRequest($key, $request, $default = null, $type = 'none', $resetPage = true)
	{
		$app       = Factory::getApplication();
		$input     = $app->getInput();
		$old_state = $app->getUserState($key);
		$cur_state = $old_state ?? $default;
		$new_state = $input->get($request, null, $type);

		// BC for Search Tools which uses different naming
		if ($new_state === null && strpos($request, 'filter_') === 0) {
			$name    = substr($request, 7);
			$filters = $app->getInput()->get('filter', [], 'array');

			if (isset($filters[$name])) {
				$new_state = $filters[$name];
			}
		}

		if ($cur_state != $new_state && $new_state !== null && $resetPage) {
			$input->set('limitstart', 0);
		}

		// Save the new value only if it is set in this request.
		if ($new_state !== null) {
			$app->setUserState($key, $new_state);
		} else {
			$new_state = $cur_state;
		}

		return $new_state;
	}

	/**
	 * Function to get the active filters
	 *
	 * @return  array  Associative array in the format: array('filter_published' => 0)
	 *
	 * @since   1.0.0
	 */
	public function getActiveFilters()
	{
		$activeFilters = [];

		if (!empty($this->filter_fields)) {
			foreach ($this->filter_fields as $filter) {
				$filterName = 'filter.' . $filter;

				if (!empty($this->state->get($filterName)) || is_numeric($this->state->get($filterName))) {
					$activeFilters[$filter] = $this->state->get($filterName);
				}
			}
		}

		return $activeFilters;
	}

}