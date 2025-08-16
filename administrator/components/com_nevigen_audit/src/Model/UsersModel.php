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

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\CMS\MVC\Model\ListModel;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\User\UserFactoryInterface;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;
use Joomla\Component\NevigenAudit\Administrator\Traits\ContextModelTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\FilterPeriodModelTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\FilterSearchModelTrait;
use Joomla\Database\ParameterType;

class UsersModel extends ListModel
{
	use ContextModelTrait;
	use FilterSearchModelTrait;
	use FilterPeriodModelTrait;

	/**
	 * Model context string.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $context = 'com_nevigen_audit.users';

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
				'user_id', 'us.user_id',
				'usergroups', 'us.usergroup_id', 'u.block',
				'us.u_name', 'u_name',
				'u.lastvisitDate', 'lastvisitDate'
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

		// Set usergroups filter state
		$userGroups = $this->getUserStateFromRequest($this->context . '.filter.usergroups', 'filter_usergroups');
		$this->setState('filter.usergroups', $userGroups);

		// Set state filter state
		$state = $this->getUserStateFromRequest($this->context . '.filter.state', 'filter_state');
		$this->setState('filter.state', $state);

		// Set search filter state
		$search = $this->getUserStateFromRequest($this->context . '.filter.search', 'filter_search');
		$this->setState('filter.search', $search);

		// Set period filter state
		$period = $this->getUserStateFromRequest($this->context . '.filter.period', 'filter_period', '');
		$this->setState('filter.period', $period);


		// List state information
		$ordering  = empty($ordering) ? 'us.user_id' : $ordering;
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
		$id .= ':' . $this->getState('filter.usergroups');
		$id .= ':' . $this->getState('filter.state');
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . serialize($this->getState('filter.period'));

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
			->select([
				'us.*',
				'u.block', 'u.lastvisitDate',
				'ug.usergroup_name'
			])
			->from($db->quoteName('#__jshopping_users', 'us'))
			->leftJoin($db->quoteName('#__users', 'u'),
				$db->quoteName('us.user_id') . ' = ' . $db->quoteName('u.id'))
			->leftJoin($db->quoteName('#__jshopping_usergroups', 'ug'),
				$db->quoteName('us.usergroup_id') . ' = ' . $db->quoteName('ug.usergroup_id'));

		// Filter by usergroups state
		$userGroup = (string) $this->getState('filter.usergroups');
		if (is_numeric($userGroup))
		{
			$query->where($db->quoteName('us.usergroup_id') . ' = :usergroups')
				->bind(':usergroups', $userGroup, ParameterType::INTEGER);
		}

		// Filter by state
		$state = (string) $this->getState('filter.state');
		if (is_numeric($state))
		{
			$query->where($db->quoteName('u.block') . ' = :state')
				->bind(':state', $state, ParameterType::INTEGER);
		}

		// Add the list ordering clause
		$ordering  = $this->state->get('list.ordering', 'o.user_id');
		$direction = $this->state->get('list.direction', 'desc');
		$query->order($db->escape($ordering) . ' ' . $db->escape($direction));

		// Filter by period state
		$this->setPeriodQuery($query, 'u.lastvisitDate');

		// Filter by search in name.
		$this->setSearchQuery($query, [
			'key'   => 'us.',
			'table' => '#__jshopping_users',
		], [
			'us.email'         => ParameterType::STRING,
			'u.email'          => ParameterType::STRING,
			'us.u_name'        => ParameterType::STRING,
			'us.f_name'        => ParameterType::STRING,
			'us.l_name'        => ParameterType::STRING,
			'us.m_name'        => ParameterType::STRING,
			'us.d_f_name'      => ParameterType::STRING,
			'us.d_l_name'      => ParameterType::STRING,
			'us.d_m_name'      => ParameterType::STRING,
			'us.city'          => ParameterType::STRING,
			'us.d_city'        => ParameterType::STRING,
			'us.firma_name'    => ParameterType::STRING,
			'us.d_firma_name'  => ParameterType::STRING,
			'us.phone'         => ParameterType::STRING,
			'us.d_phone'       => ParameterType::STRING,
			'us.mobil_phone'   => ParameterType::STRING,
			'us.d_mobil_phone' => ParameterType::STRING,

		], [
			'id' => ['us.user_id' => ParameterType::INTEGER],
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
			$db = $this->getDatabase();
			foreach ($items as &$row)
			{
				$row->name = $row->f_name . ' ' . $row->m_name . ' ' . $row->l_name;
				if (empty($row->name))
				{
					$row->name = $row->d_f_name . ' ' . $row->d_m_name . ' ' . $row->d_l_name;
				}

				$row->tmp_html_col_after_email = '';
				$row->tmp_html_col_after_id    = '';
				if ($row->lastvisitDate == $db->getNullDate())
				{
					$row->lastvisitDate = '';
				}
			}

			$view       = new \stdClass();
			$view->rows = $items;

			// Trigger com_jshopping `onBeforeDisplayUsers` event
			PluginHelper::importPlugin('jshoppingproducts');
			PluginHelper::importPlugin('jshopping');
			$app = Factory::getApplication();
			$app->triggerEvent('onBeforeDisplayUsers', [&$view]);

			$items = $view->rows;

			unset($view);
		}

		return $items;
	}

	public function getModalData($pk)
	{
		if (empty($pk))
		{
			return false;
		}
		$db    = $this->getDatabase();
		$lang  = JSFactory::getLang();
		$query = $db->getQuery(true)
			->select([
				'us.user_id', 'us.u_name',
				'us.f_name', 'us.l_name', 'us.m_name',
				'us.d_f_name', 'us.d_l_name', 'us.d_m_name',
			])
			->from($db->quoteName('#__jshopping_users', 'us'))
			->where('us.user_id = :user')
			->bind(':user', $pk, ParameterType::INTEGER);

		$row = $db->setQuery($query)->loadObject();
		if (empty($row))
		{
			return false;
		}
		$row->name = $row->f_name . ' ' . $row->m_name . ' ' . $row->l_name;
		if (empty($row->name))
		{
			$row->name = $row->d_f_name . ' ' . $row->d_m_name . ' ' . $row->d_l_name;
		}

		return [
			'id'    => $row->user_id,
			'title' => $row->name,
		];
	}

	public function getStatistic()
	{
		$db    = $this->getDatabase();
		$query = $db->getQuery(true)
			->select([
				'SUM(CASE WHEN u.block = 0 THEN 1 ELSE 0 END) AS published',
				'SUM(CASE WHEN u.block = 1 THEN 1 ELSE 0 END) AS unpublished'
			])
			->from($db->quoteName('#__jshopping_users', 'j'))
			->innerJoin($db->quoteName('#__users', 'u') . ' ON j.user_id = u.id');

		$data = $db->setQuery($query)->loadAssoc();

		// Set total
		$data['total'] = $data['published'] + $data['unpublished'];

		//Get group statistic
		$data['groups'] = $this->getGroupStatistic();

		//Get Top users statistic
		$data['top'] = $this->getTop();

		$additional = [];
		// Trigger `onNevigenAuditAdministratorModelGetStatistic` event
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditAdministratorModelGetStatistic',
			[$this->context, &$additional, $data]);

		$data['additional'] = $additional;

		return $data;

	}

	public function getGroupStatistic()
	{
		$db   = $this->getDatabase();
		$lang = JSFactory::getLang();

		$query = $db->getQuery(true)
			->select([
				$db->quoteName('g.usergroup_id', 'id'),
				$db->quoteName($lang->get('name'), 'name'),
				'COUNT(u.user_id) AS amount',
			])
			->from($db->quoteName('#__jshopping_usergroups', 'g'))
			->leftJoin($db->quoteName('#__jshopping_users', 'u') . ' ON u.usergroup_id = g.usergroup_id')
			->group('g.usergroup_id');

		return $db->setQuery($query)->loadAssocList();
	}

	public function getExportUsers($cid = null)
	{
		$params = ComponentHelper::getParams('com_nevigen_audit');
		$select = ['*'];
		if ((int) $params->get('users_export_all', 1) == 0)
		{
			if (empty($params->get('users_export_fields')))
			{
				throw new \Exception('Export fields not set', 404);
			}
			else
			{
				$select = $params->get('users_export_fields');
			}
		}
		$db    = $this->getDatabase();
		$query = $db->getQuery(true)
			->select($select)
			->from($db->quoteName('#__jshopping_users'));
		if (!empty($cid) && is_array($cid))
		{
			$query->whereIn('user_id', $cid);
		}

		return $db->setQuery($query)->loadAssocList();
	}

	public function deleteList($cid = [])
	{
		$app    = Factory::getApplication();
		$user   = $this->getCurrentUser();
		$delete = false;
		if ($user->authorise('core.admin', 'com_jshopping'))
		{

			// Trigger com_jshopping event
			PluginHelper::importPlugin('jshoppingadmin');
			PluginHelper::importPlugin('jshopping');
			PluginHelper::importPlugin('nevigen_audit');

			$app->triggerEvent('onBeforeRemoveUser', array(&$cid));
			$delete = 0;
			foreach ($cid as $id)
			{
				$id = (int) $id;
				if ($user->id === $id)
				{

					$app->enqueueMessage(Text::_('COM_NEVIGEN_AUDIT_ERROR_USERS_CANNOT_DELETE_SELF'), 'error');

					continue;
				}

				try
				{
					/** @var UserFactoryInterface $userFactory */
					$userFactory = Factory::getContainer()->get(UserFactoryInterface::class);
					$user        = $userFactory->loadUserById($id);

					if ($user->id > 0)
					{
						$app->logout($id);
						$user->delete();
					}
				}
				catch (\Throwable $e)
				{

				}

				$user_shop = JSFactory::getTable('userShop');
				if ($user_shop->delete($id))
				{
					$delete++;
				}
			}

			$app->triggerEvent('onAfterRemoveUser', array(&$cid));
		}

		return $delete;
	}

	protected function getTop($limit = 10)
	{
		$db = $this->getDatabase();

		$query = $db->getQuery(true)
			->select([
				'u.user_id',
				'u.u_name',
				'u.l_name',
				'u.f_name',
				'COUNT(o.user_id) AS order_count'
			])
			->from($db->quoteName('#__jshopping_users', 'u'))
			->leftJoin($db->quoteName('#__jshopping_orders', 'o') . ' ON o.user_id = u.user_id')
			->group('u.user_id, u.u_name, u.l_name, u.f_name')
			->having('order_count > 0')
			->order('order_count DESC');

		return $db->setQuery($query, 0, $limit)->loadAssocList();

	}
}