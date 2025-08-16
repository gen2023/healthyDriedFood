<?php

/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Extension\PluginInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Database\DatabaseDriver;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use Joomla\Event\DispatcherInterface;
use Joomla\Plugin\Task\NevigenAudit\Extension\NevigenAudit;

return new class () implements ServiceProviderInterface {
    /**
     * Registers the service provider with a DI container.
     *
     * @param   Container  $container  The DI container.
     *
     * @return  void
     *
     * @since   1.2.0
     */
    public function register(Container $container): void
    {
	    $container->set(PluginInterface::class,
		    function (Container $container) {
			    // Create plugin class
			    $subject = $container->get(DispatcherInterface::class);
			    $config  = (array) PluginHelper::getPlugin('task', 'nevigen_audit');
			    $plugin  = new NevigenAudit($subject, $config);

			    // Set application
			    $app = Factory::getApplication();
			    $plugin->setApplication($app);

			    // Set database
			    $db = $container->get(DatabaseDriver::class);
			    $plugin->setDatabase($db);

			    return $plugin;
		    }
	    );
    }
};
