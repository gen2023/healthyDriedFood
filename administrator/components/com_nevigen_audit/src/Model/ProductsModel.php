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
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\CMS\MVC\Model\ListModel;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;
use Joomla\Component\NevigenAudit\Administrator\Traits\ContextModelTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\FilterSearchModelTrait;
use Joomla\Database\ParameterType;

class ProductsModel extends ListModel
{
	use ContextModelTrait;
	use FilterSearchModelTrait;

	/**
	 * Model context string.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $context = 'com_nevigen_audit.products';

	/**
	 * Constructor.
	 *
	 * @param   array                     $config   An optional associative array of configuration settings.
	 * @param   MVCFactoryInterface|null  $factory  The factory.
	 *
	 * @throws \Exception
	 *
	 * @since  1.0.0
	 */
	public function __construct($config = [], MVCFactoryInterface $factory = null)
	{
		// Add the ordering filtering fields whitelist
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = [
				'product_id', 'p.product_id',
				'categories', 'p.product_publish', 'state',
				'p.name', 'name',
				'p.product_quantity', 'product_quantity',
				'p.product_price', 'product_price',
				'p.product_date_added', 'product_date_added',
				'pc.product_ordering', 'product_ordering','ordering',
			];
		}

		parent::__construct($config, $factory);
	}

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
		$app         = Factory::getApplication();
		$jshopConfig = JSFactory::getConfig();

		// Adjust the context to support modal layouts.
		if ($layout = $app->input->get('layout'))
		{
			$this->context .= '.' . $layout;
		}

		// Set state filter state
		$state = $this->getUserStateFromRequest($this->context . '.filter.state', 'filter_state');
		$this->setState('filter.state', $state);

		// Set search filter state
		$search = $this->getUserStateFromRequest($this->context . '.filter.search', 'filter_search');
		$this->setState('filter.search', $search);

		// Set image filter state
		$image = $this->getUserStateFromRequest($this->context . '.filter.image', 'filter_image');
		$this->setState('filter.image', $image);

		// Set categories filter state
		$categories = $this->getUserStateFromRequest($this->context . '.filter.categories', 'filter_categories');
		$this->setState('filter.categories', $categories);

		if ($jshopConfig->admin_show_product_labels)
		{
			// Set labels filter state
			$labels = $this->getUserStateFromRequest($this->context . '.filter.labels', 'filter_labels');
			$this->setState('filter.labels', $labels);
		}

		if (isset($jshopConfig->disable_admin['product_manufacturer'])
			&& $jshopConfig->disable_admin['product_manufacturer'] == 0)
		{
			// Set manufacturer filter state
			$manufacturer = $this->getUserStateFromRequest($this->context . '.filter.manufacturer', 'filter_manufacturer');
			$this->setState('filter.manufacturer', $manufacturer);
		}
		if ($jshopConfig->admin_show_vendors)
		{
			// Set vendor filter state
			$vendor = $this->getUserStateFromRequest($this->context . '.filter.vendor', 'filter_vendor');
			$this->setState('filter.vendor', $vendor);
		}

		// List state information
		$ordering  = empty($ordering) ? 'p.product_id' : $ordering;
		$direction = empty($direction) ? 'desc' : $direction;

		if (strpos($ordering,'product_ordering') !== false && (empty($categories) || count($categories) > 1) ){
			$ordering = 'p.product_id';
			$direction = 'desc';
			$this->setState('list.ordering', $ordering);
			$this->setState('list.direction', $direction);
		}

		parent::populateState($ordering, $direction);
	}

	/**
	 * Method to get a store id based on model configuration state.
	 *
	 * @param   string  $id  A prefix for the store id.
	 *
	 * @return  string  A store id.
	 *
	 * @since  1.0.0
	 */
	protected function getStoreId($id = ''): string
	{
		$jshopConfig = JSFactory::getConfig();

		$id .= ':' . $this->getState('filter.state');
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . $this->getState('filter.image');
		$id .= ':' . serialize($this->getState('filter.categories'));
		if (isset($jshopConfig->disable_admin['product_manufacturer'])
			&& $jshopConfig->disable_admin['product_manufacturer'] == 0)
		{
			$id .= ':' . $this->getState('filter.manufacturer');
		}
		if ($jshopConfig->admin_show_vendors)
		{
			$id .= ':' . $this->getState('filter.vendor');
		}
		if ($jshopConfig->admin_show_product_labels)
		{
			$id .= ':' . serialize($this->getState('filter.labels'));
		}

		return parent::getStoreId($id);
	}

	/**
	 * Method to get a DatabaseQuery object for retrieving the data set from a database.
	 *
	 * @throws  \Exception
	 *
	 * @return  \Joomla\Database\QueryInterface  A QueryInterface object to retrieve the data set.
	 *
	 * @since  1.0.0
	 */
	protected function getListQuery(): \Joomla\Database\QueryInterface
	{
		$db          = $this->getDatabase();
		$lang        = JSFactory::getLang();
		$jshopConfig = JSFactory::getConfig();
		$disable     = $jshopConfig->disable_admin;
		$query       = $db->getQuery(true)
			->select([
				'p.*',
				$db->quoteName('p.' . $lang->get('name'), 'name'),
				$db->quoteName('p.' . $lang->get('short_description'), 'short_description'),
				$db->quoteName('c.' . $lang->get('name'), 'category_name'),
				'GROUP_CONCAT(' . $db->quoteName('c.' . $lang->get('name')) . ' SEPARATOR ", ") AS all_category_names',
				'pc.product_ordering'
			])
			->from($db->quoteName('#__jshopping_products', 'p'))
			->leftJoin($db->quoteName('#__jshopping_products_to_categories', 'pc'),
				$db->quoteName('p.product_id') . ' = ' . $db->quoteName('pc.product_id'))
			->leftJoin($db->quoteName('#__jshopping_categories', 'c'),
				$db->quoteName('pc.category_id') . ' = ' . $db->quoteName('c.category_id'))
			->where($db->quoteName('p.parent_id') . ' = 0');
		if (isset($disable['product_manufacturer']) && $disable['product_manufacturer'] == 0)
		{
			$query->leftJoin($db->quoteName('#__jshopping_manufacturers', 'm'),
				$db->quoteName('p.product_manufacturer_id') . ' = ' . $db->quoteName('m.manufacturer_id'));
			$query->select($db->quoteName('m.' . $lang->get('name'), 'manufacturer_name'));


			// Filter by manufacturer state
			$manufacturer = (string) $this->getState('filter.manufacturer');
			if (is_numeric($manufacturer))
			{
				$query->where($db->quoteName('p.product_manufacturer_id') . ' = :manufacturer')
					->bind(':manufacturer', $manufacturer, ParameterType::INTEGER);
			}
		}
		if ($jshopConfig->admin_show_vendors)
		{
			$query->leftJoin($db->quoteName('#__jshopping_vendors', 'v'),
				$db->quoteName('p.vendor_id') . ' = ' . $db->quoteName('v.id'));
			$query->select('v.shop_name');

			// Filter by vendor state
			$vendor = (string) $this->getState('filter.vendor');
			if (is_numeric($vendor))
			{
				$query->where($db->quoteName('p.vendor_id') . ' = :vendor')
					->bind(':vendor', $vendor, ParameterType::INTEGER);
			}
		}

		// Filter by state
		$state = (string) $this->getState('filter.state');
		if (is_numeric($state))
		{
			$query->where($db->quoteName('p.product_publish') . ' = :state')
				->bind(':state', $state, ParameterType::INTEGER);
		}
		// Filter by image state
		$image = (string) $this->getState('filter.image');
		if (is_numeric($image))
		{
			$image = (int) $image;
			if ($image === 1)
			{
				$query->where($db->quoteName('p.image') . ' <> ""');
			}
			elseif ($image === 0)
			{
				$query->where($db->quoteName('p.image') . ' = ""');
			}
		}

		// Filter by categories state
		$categories = $this->getState('filter.categories');
		if (is_array($categories))
		{
			$query->whereIn('pc.category_id', $categories);
		}
		elseif (is_numeric($categories))
		{
			$query->where($db->quoteName('pc.category_id') . ' = :categories')
				->bind(':categories', $categories, ParameterType::INTEGER);
		}
		if ($jshopConfig->admin_show_product_labels)
		{
			// Filter by labels state
			$labels = $this->getState('filter.labels');
			if (is_array($labels))
			{
				$query->whereIn('p.label_id', $labels);
			}
			elseif (is_numeric($labels))
			{
				$query->where($db->quoteName('p.label_id') . ' = :labels')
					->bind(':labels', $labels, ParameterType::INTEGER);
			}
		}

		// Add the list ordering clause
		$ordering  = $this->state->get('list.ordering', 'p.product_id');
		$direction = $this->state->get('list.direction', 'desc');
		if (strpos($ordering,'product_ordering') !== false && (empty($categories) || count($categories) > 1) ){
			$ordering = 'p.product_id';
			$direction = 'desc';
		}

		$query->group('p.product_id');
		$query->order($db->escape($ordering) . ' ' . $db->escape($direction));


		// Filter by search in name.
		$this->setSearchQuery($query,
			[
				'key'   => 'p.',
				'table' => '#__jshopping_products',
			], [
				'p.' . $lang->get('name')              => ParameterType::STRING,
				'p.' . $lang->get('short_description') => ParameterType::STRING,
				'p.' . $lang->get('description')       => ParameterType::STRING,
				'p.product_ean'                        => ParameterType::STRING,
				'p.manufacturer_code'                  => ParameterType::STRING,
				'p.real_ean'                           => ParameterType::STRING,
			], [
				'id' => ['p.product_id' => ParameterType::INTEGER],
			]);

		// Trigger `onNevigenAuditAdminListQuery`
		PluginsHelper::triggerPlugins(['nevigen_audit','jshopping', 'system'], 'onNevigenAuditAdminListQuery',
			[$this->context, &$query]);

		return $query;
	}

	public function getItems()
	{
		$items = parent::getItems();

		if (!empty($items))
		{
			$jshopConfig = JSFactory::getConfig();
			foreach ($items as $item)
			{
				if (!$jshopConfig->admin_show_product_labels)
				{
					$item->label_id = false;
				}

				if ($item->label_id)
				{
					$image = Helper::getNameImageLabel($item->label_id);
					if ($image)
					{
						$item->_label_image = $jshopConfig->image_labels_live_path . '/' . $image;
					}
					$item->_label_name = Helper::getNameImageLabel($item->label_id, 2);
				}
			}
		}

		return $items;
	}

	public function getFilterForm($data = [], $loadData = true)
	{
		/** @var Form $form */
		$form        = parent::getFilterForm($data, $loadData);
		$jshopConfig = JSFactory::getConfig();
		if (!$jshopConfig->admin_show_vendors)
		{
			$form->removeField('vendor', 'filter');
		}
		if (!$jshopConfig->admin_show_product_labels)
		{
			$form->removeField('labels', 'filter');
		}
		if (isset($jshopConfig->disable_admin['product_manufacturer'])
			&& $jshopConfig->disable_admin['product_manufacturer'] != 0)
		{
			$form->removeField('manufacturer', 'filter');
		}

		return $form;
	}

	public function getStatistic()
	{
		$db     = $this->getDatabase();
		$config = JSFactory::getConfig();
		$query  = $db->getQuery(true)
			->select([
				'IFNULL(SUM(CASE WHEN p.product_publish = 1 THEN 1 ELSE 0 END), 0) AS published',
				'IFNULL(SUM(CASE WHEN p.product_publish = 0 THEN 1 ELSE 0 END), 0) AS unpublished',
				'IFNULL(SUM(CASE WHEN p.product_price = 0 OR product_price IS NULL THEN 1 ELSE 0 END), 0) AS without_price',
				'IFNULL(SUM(CASE WHEN p.product_quantity = 0 THEN 1 ELSE 0 END), 0) AS out_of_stock',
				'IFNULL(SUM(CASE WHEN p.label_id > 0 THEN 1 ELSE 0 END), 0) AS with_labels',
				'IFNULL(SUM(CASE WHEN p.product_is_add_price = 1 THEN 1 ELSE 0 END), 0) AS with_is_add_price',
				'IFNULL(SUM(CASE WHEN p.image IS NULL OR p.image = "" THEN 1 ELSE 0 END), 0) AS without_picture'
			])
			->from($db->quoteName('#__jshopping_products', 'p'))
			->where('parent_id = 0');

		if (isset($config->allow_reviews_prod) && (int) $config->allow_reviews_prod === 1)
		{
			$query->select('IFNULL(SUM(CASE WHEN reviews_count > 0 THEN 1 ELSE 0 END), 0) AS with_reviews');
		}

		$data = $db->setQuery($query)->loadAssoc();

		$data['total'] = $data['published'] + $data['unpublished'];

		$queryRelated = $db->getQuery(true)
			->select('COUNT(DISTINCT product_id) AS with_related')
			->from($db->quoteName('#__jshopping_products_relations'));

		$data['with_related'] = $db->setQuery($queryRelated)->loadResult();

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
		$columns         = $db->getTableColumns('#__jshopping_products');
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
			->from($db->quoteName('#__jshopping_products'))
			->where('parent_id = 0');

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
}