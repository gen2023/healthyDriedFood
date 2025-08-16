<?php

/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Module\NevigenAuditDashboard\Administrator\Dispatcher;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Dispatcher\AbstractModuleDispatcher;
use Joomla\CMS\Factory;
use Joomla\CMS\WebAsset\WebAssetManager;
use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;
use Joomla\Component\NevigenAudit\Administrator\Model\DashboardModel;
use Joomla\Registry\Registry;

\defined('_JEXEC') or die;

/**
 * Dispatcher class for mod_nevigen_audit_dashboard
 *
 * @since  1.1.0
 */
class Dispatcher extends AbstractModuleDispatcher
{
	protected ?Registry $params = null;

	/**
	 * Runs the dispatcher.
	 *
	 * @return  void
	 *
	 * @since   1.1.0
	 */
	public function dispatch()
	{
		if ($this->params === null)
		{
			$this->params = ComponentHelper::getParams('com_nevigen_audit');
		}
		if (empty($this->params) || (int) $this->params->get('show_joomla_dashboard', 1) === 0)
		{
			return;
		}
		$app    = Factory::getApplication();
		$option = $app->input->getCmd('option');
		$tmpl   = $app->input->getCmd('tmpl');
		if ($option === 'com_cpanel' && $tmpl === 'cpanel' && empty($app->input->getString('dashboard')))
		{
			$this->loadLanguage();

			// Load assets
			/** @var WebAssetManager $wa */
			$wa = $app->getDocument()->getWebAssetManager();
			$wa->getRegistry()->addExtensionRegistryFile('com_nevigen_audit');
			$wa->useScript('com_nevigen_audit.chart')
				->useStyle('com_nevigen_audit.administrator.main');

			parent::dispatch();
		}
	}

	/**
	 * Returns the layout data.
	 *
	 * @return  array
	 *
	 * @since   1.1.0
	 */
	protected function getLayoutData()
	{
		$data = parent::getLayoutData();
		/** @var \Joomla\CMS\MVC\Factory\MVCFactoryInterface $factory */
		$factory = Factory::getApplication()->bootComponent('nevigen_audit')->getMVCFactory();
		/** @var DashboardModel $model */
		$model = $factory->createModel('Dashboard', 'Administrator');
		$model->getOrdersStatisticsTotal();
		$model->getOrdersStatisticsPaid();
		$model->getOrdersStatisticsCancel();

		unset($factory, $model);

		$dashboardTop         = '';
		$dashboardAfterOrders = '';
		$dashboardBottom      = '';

		// Trigger `onNevigenAuditAdministratorModuleDashboard` event
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditAdministratorModuleDashboard',
			[&$dashboardTop, &$dashboardAfterOrders, &$dashboardBottom, $this->params]);

		if (!is_string($dashboardTop))
		{
			$dashboardTop = '';
		}

		if (!is_string($dashboardAfterOrders))
		{
			$dashboardAfterOrders = '';
		}

		if (!is_string($dashboardBottom))
		{
			$dashboardBottom = '';
		}
		$data['dashboardTop']         = $dashboardTop;
		$data['dashboardAfterOrders'] = $dashboardAfterOrders;
		$data['dashboardBottom']      = $dashboardBottom;

		return $data;
	}
}
