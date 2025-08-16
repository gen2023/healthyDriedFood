<?php
/*
 * @package     RadicalMart Package
 * @subpackage  plg_system_radicalmart
 * @version     1.1.0
 * @author      Delo Design - delo-design.ru
 * @copyright   Copyright (c) 2023 Delo Design. All rights reserved.
 * @license     GNU/GPL license: https://www.gnu.org/copyleft/gpl.html
 * @link        https://delo-design.ru/
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Extension\PluginInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Database\DatabaseDriver;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use Joomla\Event\DispatcherInterface;
use Joomla\Plugin\System\NevigenJshopOneStepCheckout\Extension\NevigenJshopOneStepCheckout;

return new class implements ServiceProviderInterface {

	/**
	 * Registers the service provider with a DI container.
	 *
	 * @param   Container  $container  The DI container.
	 *
	 * @since   1.0.0
	 */
	public function register(Container $container)
	{
		$container->set(PluginInterface::class,
			function (Container $container) {
				$plugin  = PluginHelper::getPlugin('system', 'nevigen_jshop_onestepcheckout');
				$subject = $container->get(DispatcherInterface::class);

				$plugin = new NevigenJshopOneStepCheckout($subject, (array) $plugin);

				// Set application
				$plugin->setApplication(Factory::getApplication());

				// Set database
				$db = $container->get(DatabaseDriver::class);
				$plugin->setDatabase($db);

				return $plugin;
			}
		);
	}
};
