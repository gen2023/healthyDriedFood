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

\defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\CMS\MVC\Model\ListModel;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;
use Joomla\Component\NevigenAudit\Administrator\Traits\ContextModelTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\FilterPeriodModelTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\FilterSearchModelTrait;
use Joomla\Database\ParameterType;

class OrdersModel extends ListModel
{
	use ContextModelTrait;
	use FilterPeriodModelTrait;
	use FilterSearchModelTrait;

	/**
	 * Model context string.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $context = 'com_nevigen_audit.orders';

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
				'order_id', 'o.order_id',
				'order_number', 'o.order_number',
				'user_id', 'o.user_id',
				'status_id', 'o.order_status', 'status',
				'created', 'order_date', 'o.order_date',
				'shipping', 'shipping_method', 'o.shipping_method_id',
				'payment', 'payment_method', 'o.payment_method_id',
				'currency', 'o.currency_code_iso',
				'order_total', 'o.order_total',
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
		$app = Factory::getApplication();

		// Adjust the context to support modal layouts.
		if ($layout = $app->input->get('layout'))
		{
			$this->context .= '.' . $layout;
		}

		// Set params
		$this->setState('params', ComponentHelper::getParams('com_nevigen_audit'));

		// Set order created filter state
		$order_created = $this->getUserStateFromRequest($this->context . '.filter.order_created',
			'filter_order_created', 1);
		$this->setState('filter.order_created', $order_created);

		// Set status filter state
		$status = $this->getUserStateFromRequest($this->context . '.filter.status', 'filter_status');
		$this->setState('filter.status', $status);

		// Set currency filter state
		$currency = $this->getUserStateFromRequest($this->context . '.filter.currency', 'filter_currency');
		$this->setState('filter.currency', $currency);

		// Set search filter state
		$search = $this->getUserStateFromRequest($this->context . '.filter.search', 'filter_search');
		$this->setState('filter.search', $search);


		// Set shipping filter state
		$shipping = $this->getUserStateFromRequest($this->context . '.filter.shipping', 'filter_shipping', '');
		$this->setState('filter.shipping', $shipping);

		// Set payment filter state
		$payment = $this->getUserStateFromRequest($this->context . '.filter.payment', 'filter_payment', '');
		$this->setState('filter.payment', $payment);

		// Set period filter state
		$period = $this->getUserStateFromRequest($this->context . '.filter.period', 'filter_period', '');
		$this->setState('filter.period', $period);


		// Set user filter state
		$user = $this->getUserStateFromRequest($this->context . '.filter.user', 'filter_user', '');
		$this->setState('filter.user', $user);


		// List state information
		$ordering  = empty($ordering) ? 'o.order_id' : $ordering;
		$direction = empty($direction) ? 'desc' : $direction;

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
		$id .= ':' . $this->getState('filter.status');
		$id .= ':' . $this->getState('filter.currency');
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . $this->getState('filter.shipping');
		$id .= ':' . $this->getState('filter.payment');
		$id .= ':' . serialize($this->getState('filter.period'));
		$id .= ':' . $this->getState('filter.order_created');
		$id .= ':' . $this->getState('filter.user');


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
		$db    = $this->getDatabase();
		$lang  = JSFactory::getLang();
		$query = $db->getQuery(true)
			->select(['o.*',
				$db->quoteName('s.' . $lang->get('name'), 'status_name'),
				$db->quoteName('sm.' . $lang->get('name'), 'shipping_name'),
				$db->quoteName('pm.' . $lang->get('name'), 'payment_name'),
			])
			->from($db->quoteName('#__jshopping_orders', 'o'))
			->leftJoin($db->quoteName('#__jshopping_order_status', 's'),
				$db->quoteName('s.status_id') . ' = ' . $db->quoteName('o.order_status'))
			->leftJoin($db->quoteName('#__jshopping_shipping_method', 'sm'),
				$db->quoteName('sm.shipping_id') . ' = ' . $db->quoteName('o.shipping_method_id'))
			->leftJoin($db->quoteName('#__jshopping_payment_method', 'pm'),
				$db->quoteName('pm.payment_id') . ' = ' . $db->quoteName('o.payment_method_id'));

		// Filter by status state
		$order_created = (string) $this->getState('filter.order_created');

		if (is_numeric($order_created) && $order_created != 2)
		{
			$query->where($db->quoteName('o.order_created') . ' = :order_created')
				->bind(':order_created', $order_created, ParameterType::INTEGER);
		}
		// Filter by status state
		$status = (string) $this->getState('filter.status');
		if (is_numeric($status))
		{
			$query->where($db->quoteName('o.order_status') . ' = :status')
				->bind(':status', $status, ParameterType::INTEGER);
		}
		// Filter by user state
		$user = (string) $this->getState('filter.user');
		if (is_numeric($user))
		{
			$query->where($db->quoteName('o.user_id') . ' = :user')
				->bind(':user', $user, ParameterType::INTEGER);
		}

		// Filter by currency state
		$currency = (string) $this->getState('filter.currency');
		if (!empty($currency))
		{
			$query->where($db->quoteName('o.currency_code_iso') . ' = :currency')
				->bind(':currency', $currency);
		}

		// Filter by shipping state
		$shipping = $this->getState('filter.shipping');
		if (is_numeric($shipping) && !empty($shipping))
		{
			$query->where($db->quoteName('o.shipping_method_id') . ' = :shipping')
				->bind(':shipping', $shipping);
		}

		// Filter by payment state
		$payment = $this->getState('filter.payment');
		if (is_numeric($payment) && !empty($payment))
		{
			$query->where($db->quoteName('o.payment_method_id') . ' = :payment')
				->bind(':payment', $payment);
		}

		// Filter by period state
		$this->setPeriodQuery($query, 'o.order_date');

		// Filter by search in text
		$search = $this->getState('filter.search');

		if (!empty($search) && strpos($search, 'product:') !== false)
		{
			list($searchKey, $searchText) = explode(':', $search, 2);
			$searchText = trim($searchText);
			$searchText = str_replace(' ', '%', $searchText);
			$searchText = '%' . $searchText . '%';

			$query->leftJoin($db->quoteName('#__jshopping_order_item', 'oi') . ' ON oi.order_id = o.order_id')
				->where($db->quoteName('oi.product_name') . ' LIKE ' . $db->quote($searchText));
		}
		else
		{
			$this->setSearchQuery($query, [
				'key'   => 'o.',
				'table' => '#__jshopping_orders',
			], [
				'o.email'           => ParameterType::STRING,
				'o.order_number'    => ParameterType::STRING,
				'o.shipping_params' => ParameterType::STRING,
				'o.f_name'          => ParameterType::STRING,
				'o.l_name'          => ParameterType::STRING,
				'o.m_name'          => ParameterType::STRING,
				'o.d_f_name'        => ParameterType::STRING,
				'o.d_l_name'        => ParameterType::STRING,
				'o.d_m_name'        => ParameterType::STRING,
				'o.phone'           => ParameterType::STRING,
				'o.d_phone'         => ParameterType::STRING,
				'o.mobil_phone'     => ParameterType::STRING,
				'o.d_mobil_phone'   => ParameterType::STRING,
			], [
				'id'     => ['o.order_id' => ParameterType::INTEGER],
				'number' => ['o.order_number' => ParameterType::STRING],
			]);
		}

		// Add the list ordering clause
		$ordering  = $this->state->get('list.ordering', 'o.order_id');
		$direction = $this->state->get('list.direction', 'desc');
		$query->order($db->escape($ordering) . ' ' . $db->escape($direction))
			->group($db->quoteName('o.order_id'));


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
			$jshopConfig                = JSFactory::getConfig();
			$id_vendor_cuser            = HelperAdmin::getIdVendorForCUser();
			$display_info_only_my_order = 0;
			if ($jshopConfig->admin_show_vendors && $id_vendor_cuser)
			{
				$display_info_only_my_order = 1;
			}

			foreach ($items as &$row)
			{
				$row->name = $row->f_name . ' ' . $row->l_name;
				if (empty($row->name))
				{
					$row->name = $row->d_f_name . ' ' . $row->d_l_name;
				}
				if ($row->vendor_id > 0 && isset($row->v_fname) && !empty($row->v_name))
				{
					$vendor_name = $row->v_fname . ' ' . $row->v_name;
				}
				else
				{
					$vendor_name = '-';
				}
				$row->vendor_name = $vendor_name;

				$display_info_order = 1;
				if ($display_info_only_my_order && $id_vendor_cuser != $row->vendor_id)
				{
					$display_info_order = 0;
				}
				$row->display_info_order = $display_info_order;

				$blocked = 0;
				if (HelperAdmin::orderBlocked($row) || !$display_info_order)
				{
					$blocked = 1;
				}
				$row->blocked = $blocked;

				if ($row->currency_exchange == 0)
				{
					$row->currency_exchange = 1;
				}

				$row->_tmp_ext_info_order_number = '';
				$row->_tmp_cols_1                = '';
				$row->_tmp_cols_after_user       = '';
				$row->_tmp_cols_3                = '';
				$row->_tmp_cols_4                = '';
				$row->_tmp_cols_5                = '';
				$row->_tmp_cols_6                = '';
				$row->_tmp_cols_7                = '';
				$row->_tmp_cols_8                = '';
				$row->_tmp_ext_info_status       = '';
				$row->_tmp_ext_info_update       = '';
				$row->_tmp_ext_info_order_total  = '';
			}

			// Trigger com_jshopping `onBeforeDisplayListOrderAdmin` event
			PluginHelper::importPlugin('jshoppingorder');
			PluginHelper::importPlugin('jshopping');
			$app = Factory::getApplication();
			$app->triggerEvent('onBeforeDisplayListOrderAdmin', [&$rows]);

		}

		return $items;
	}

	public function getStatuses()
	{
		$db    = $this->getDatabase();
		$lang  = JSFactory::getLang();
		$query = $db->getQuery(true)
			->select([
				$db->quoteName('status_id', 'id'),
				$db->quoteName($lang->get('name'), 'name')
			])
			->from($db->quoteName('#__jshopping_order_status'));

		$db->setQuery($query);

		return $db->loadAssocList();
	}

	public function getStatistic()
	{
		$data['today'] = $this->getOrderStatistics('day');
		$data['week']  = $this->getOrderStatistics('week');
		$data['month'] = $this->getOrderStatistics('month');
		$data['year']  = $this->getOrderStatistics('year');


		return $data;
	}

	public function getOrderStatistics($type = null)
	{
		$db = $this->getDatabase();

		$query = $db->getQuery(true)
			->select([
				'ord.order_status',
				'COUNT(ord.order_id) AS amount',
				'SUM(CASE WHEN ord.currency_exchange > 0 THEN ord.order_total / ord.currency_exchange ELSE 0 END) AS total_sum'
			])
			->from($db->quoteName('#__jshopping_orders', 'ord'))
			->group('ord.order_status')
			->order('ord.order_status ASC');

		if ($type === 'day')
		{
			$query->where('DATE(ord.order_date) = CURDATE()');
		}
		elseif ($type === 'week')
		{
			$query->where('WEEK(ord.order_date, 1) = WEEK(CURDATE(), 1)')
				->where('YEAR(ord.order_date) = YEAR(CURDATE())');
		}
		elseif ($type === 'month')
		{
			$query->where('MONTH(ord.order_date) = MONTH(CURDATE())')
				->where('YEAR(ord.order_date) = YEAR(CURDATE())');
		}
		elseif ($type === 'year')
		{
			$query->where('YEAR(ord.order_date) = YEAR(CURDATE())');
		}
		else
		{
			return [];
		}

		return $db->setQuery($query)->loadAssocList('order_status');
	}
}