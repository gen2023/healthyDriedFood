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
use Joomla\CMS\Date\Date;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Component\NevigenAudit\Administrator\Traits\ContextModelTrait;
use Joomla\Component\NevigenAudit\Administrator\Traits\SubModelsTrait;

class DashboardModel extends BaseDatabaseModel
{

	use ContextModelTrait;
	use SubModelsTrait;

	/**
	 * Model context string.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $context = 'com_nevigen_audit.dashboard';

	public function getOrdersStatisticsTotal()
	{
		$app       = Factory::getApplication();
		$keyParams = 'com_nevigen_audit.chart.dashboard.orders.total';

		$orders = $this->getDataOrdersStatistics();

		$dataPoints = [];
		$totalSales = 0;
		$totalCount = 0;
		foreach ($orders as $data)
		{
			$timestamp    = strtotime($data['date']) * 1000;
			$dataPoints[] = ['x' => $timestamp, 'y' => (int) $data['count']];
			$totalSales   += (int) $data['total'];
			$totalCount += (int) $data['count'];
		}

		$chartConfig = [
			'chart'    => [
				'id'        => 'total',
				'group'     => 'orders',
				'type'      => 'area',
				'height'    => 140,
				'sparkline' => ['enabled' => true]
			],
			'stroke'   => [
				'curve' => 'monotoneCubic',
			],
			'fill'     => [
				'opacity' => 1
			],
			'series'   => [
				[
					'name' => Text::_('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_ORDERS_TOTAL_TOOLTIP'),
					'data' => $dataPoints
				]
			],
			'xaxis'    => [
				'type' => 'datetime'
			],
			'yaxis'    => [
				'min' => 0
			],
			'colors'   => ['#5f9de8'],
			'title'    => [
				'text'    => Helper::formatprice($totalSales),
				'align'   => 'left',
				'offsetX' => 20,
				'style'   => [
					'fontSize'   => '24px',
					'fontWeight' => 'bold',
					'color'      => '#333'
				]
			],
			'subtitle' => [
				'text'    => Text::sprintf('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_ORDERS_TOTAL',$totalCount),
				'align'   => 'left',
				'offsetX' => 20,
				'style'   => [
					'fontSize' => '14px',
					'color'    => '#666'
				]
			],
			'tooltip'  => [
				'enabled' => true,
				'theme' => 'dark',
				'x'       => [
					'format' => 'dd.MM.yyyy'
				],
				'marker'  => [
					'show' => true
				]
			],
			'markers'  => [
				'size'         => 4,
				'strokeWidth'  => 2,
				'strokeColors' => '#fff',
				'fillOpacity'  => 1,
				'hover'        => [
					'size' => 6
				]
			]
		];

		//dd($chartConfig);
		$app->getDocument()->addScriptOptions($keyParams, $chartConfig);
	}

	public function getOrdersStatisticsPaid()
	{

		$app       = Factory::getApplication();
		$keyParams = 'com_nevigen_audit.chart.dashboard.orders.paid';

		$orders = $this->getDataOrdersStatistics('paid');

		$dataPoints = [];
		$totalSales = 0;
		$totalCount = 0;
		foreach ($orders as $data)
		{
			$timestamp    = strtotime($data['date']) * 1000;
			$dataPoints[] = ['x' => $timestamp, 'y' => (int) $data['count']];
			$totalSales   += (int) $data['total'];
			$totalCount += (int) $data['count'];
		}

		$chartConfig = [
			'chart'    => [
				'id'        => 'total',
				'group'     => 'orders',
				'type'      => 'area',
				'height'    => 140,
				'sparkline' => ['enabled' => true]
			],
			'stroke'   => [
				'curve' => 'monotoneCubic',
			],
			'fill'     => [
				'opacity' => 1
			],
			'series'   => [
				[
					'name' => Text::_('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_ORDERS_PAID_TOOLTIP'),
					'data' => $dataPoints
				]
			],
			'xaxis'    => [
				'type' => 'datetime'
			],
			'yaxis'    => [
				'min' => 0
			],
			'colors'   => ['#84e85f'],
			'title'    => [
				'text'    => Helper::formatprice($totalSales),
				'align'   => 'left',
				'offsetX' => 20,
				'style'   => [
					'fontSize'   => '24px',
					'fontWeight' => 'bold',
					'color'      => '#333'
				]
			],
			'subtitle' => [
				'text'    => Text::sprintf('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_ORDERS_PAID',$totalCount),
				'align'   => 'left',
				'offsetX' => 20,
				'style'   => [
					'fontSize' => '14px',
					'color'    => '#666'
				]
			],
			'tooltip'  => [
				'enabled' => true,
				'theme' => 'dark',
				'x'       => [
					'format' => 'dd.MM.yyyy'
				],
				'marker'  => [
					'show' => true
				]
			],
			'markers'  => [
				'size'         => 4,
				'strokeWidth'  => 2,
				'strokeColors' => '#fff',
				'fillOpacity'  => 1,
				'hover'        => [
					'size' => 6
				]
			]
		];

		//dd($chartConfig);
		$app->getDocument()->addScriptOptions($keyParams, $chartConfig);
	}

	public function getOrdersStatisticsCancel()
	{

		$app       = Factory::getApplication();
		$keyParams = 'com_nevigen_audit.chart.dashboard.orders.cancel';

		$orders = $this->getDataOrdersStatistics('cancel');

		$dataPoints = [];
		$totalSales = 0;
		$totalCount = 0;

		foreach ($orders as $data)
		{
			$timestamp    = strtotime($data['date']) * 1000;
			$dataPoints[] = ['x' => $timestamp, 'y' => (int) $data['count']];
			$totalSales   += (int) $data['total'];
			$totalCount += (int) $data['count'];
		}

		$chartConfig = [
			'chart'    => [
				'id'        => 'total',
				'group'     => 'orders',
				'type'      => 'area',
				'height'    => 140,
				'sparkline' => ['enabled' => true]
			],
			'stroke'   => [
				'curve' => 'monotoneCubic',
			],
			'fill'     => [
				'opacity' => 1
			],
			'series'   => [
				[
					'name' => Text::_('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_ORDERS_CANCEL_TOOLTIP'),
					'data' => $dataPoints
				]
			],
			'xaxis'    => [
				'type' => 'datetime'
			],
			'yaxis'    => [
				'min' => 0
			],
			'colors'   => ['#f5b0c9'],
			'title'    => [
				'text'    => Helper::formatprice($totalSales),
				'align'   => 'left',
				'offsetX' => 20,
				'style'   => [
					'fontSize'   => '24px',
					'fontWeight' => 'bold',
					'color'      => '#333'
				]
			],
			'subtitle' => [
				'text'    => Text::sprintf('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_ORDERS_CANCEL',$totalCount),
				'align'   => 'left',
				'offsetX' => 20,
				'style'   => [
					'fontSize' => '14px',
					'color'    => '#666'
				]
			],
			'tooltip'  => [
				'enabled' => true,
				'theme' => 'dark',
				'x'       => [
					'format' => 'dd.MM.yyyy'
				],
				'marker'  => [
					'show' => true
				]
			],
			'markers'  => [
				'size'         => 4,
				'strokeWidth'  => 2,
				'strokeColors' => '#fff',
				'fillOpacity'  => 1,
				'hover'        => [
					'size' => 6
				]
			]
		];

		//dd($chartConfig);
		$app->getDocument()->addScriptOptions($keyParams, $chartConfig);
	}

	public function getGroups()
	{
		$data = [];
		$app  = Factory::getApplication();
		/** @var UsersModel $usersModel */
		$usersModel = $this->getSubModel('Users', 'Administrator');
		$usersModel->setContext($this->context);

		$groups = $usersModel->getGroupStatistic();
		if (!empty($groups)) {
			$keyParams = 'com_nevigen_audit.chart.dashboard.users.groups';
			$series    = [];
			$labels    = [];

			foreach ($groups as &$group) {
				$labels[]        = $group['name'];
				$series[]        = isset($group['amount']) ? $group['amount'] : 0;
			}

			$chartConfig = [
				'chart'  => [
					'type'   => 'donut',
					'height' => 300,
				],
				'series' => $series,
				'labels' => $labels,
				'dataLabels' => [
					'enabled' => true,
					'style'   => [
						'fontSize' => '14px',
						'fontWeight' => 'bold',
						'colors' => ['#ffffff']
					]
				],
				'legend' => [
					'position' => 'right',
					'fontSize' => '14px'
				]
			];

			$app->getDocument()->addScriptOptions($keyParams, $chartConfig);
		}

		return $groups;
	}


	protected function getDataOrdersStatistics($type = 'all'): array
	{
		$db     = $this->getDatabase();
		$params = ComponentHelper::getParams('com_nevigen_audit');

		$dates = [];
		$daysLimit = 6;
		for ($i = $daysLimit; $i >= 0; $i--)
		{
			$date = Factory::getDate()->modify('-' . $i . ' days')->format('Y-m-d');
			$dates[$date] = ['date' => $date, 'total' => 0, 'count' => 0];
		}



		$startDate = (new Date())->modify('-' .$daysLimit. 'days')->setTime(0,0)->toSql();
		$endDate   = (new Date())->setTime('23',59,59)->toSql();

		$query = $db->getQuery(true)
			->select([
				'DATE(order_date) AS date',
				'SUM(order_total / currency_exchange) AS total',
				'COUNT(order_id) AS count',
			])
			->from($db->quoteName('#__jshopping_orders'))
			->where('order_date BETWEEN :start AND :end')
			->where('order_created = 1')
			->group('DATE(order_date)')
			->order('date ASC');

		$query->bind(':start', $startDate)
			->bind(':end', $endDate);

		if ($type === 'paid')
		{
			$query->whereIn('order_status', (array) $params->get('status_paid', [6]));
		}
		elseif ($type === 'cancel')
		{
			$query->whereIn('order_status', (array) $params->get('status_cancel', [3,4]));
		}

		$data = $db->setQuery($query)->loadAssocList();

		foreach ($data as $row)
		{
			if (isset($dates[$row['date']]))
			{
				$dates[$row['date']] = $row;
			}
		}

		return array_values($dates);
	}
}