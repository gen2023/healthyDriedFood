<?php
/*
 * @package    Nevigen Installer Plugin
 * @version    2.1.1
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Extension\PluginInterface;
use Joomla\CMS\Extension\Service\Provider\MVCFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Database\DatabaseDriver;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use Joomla\Event\DispatcherInterface;
use Joomla\Plugin\Installer\Nevigen\Extension\Nevigen;

return new class implements ServiceProviderInterface {

	/**
	 * Registers the service provider with a DI container.
	 *
	 * @param   Container  $container  The DI container.
	 *
	 * @since   1.1.0
	 */
	public function register(Container $container)
	{
		// Register MVCFactory
		$container->registerServiceProvider(new MVCFactory('Joomla\\Component\\Installer'));
		$container->set(PluginInterface::class,
			function (Container $container) {
				// Create plugin class
				$subject = $container->get(DispatcherInterface::class);
				$config  = (array) PluginHelper::getPlugin('installer', 'nevigen');
				$plugin  = new Nevigen($subject, $config);

				// Set application
				$app = Factory::getApplication();
				$plugin->setApplication($app);

				// Set database
				$db = $container->get(DatabaseDriver::class);
				$plugin->setDatabase($db);

				// Set MVCFactory
				$mvcFactory = $container->get(MVCFactoryInterface::class);
				$plugin->setMVCFactory($mvcFactory);

				// Set language
				$plugin->setLanguage($app->getLanguage());

				$tag         = $app->getLanguage()->getTag();
				$supportLang = ['uk-UA', 'en-GB', 'ru-RU'];
				if (!in_array($tag, $supportLang))
				{
					// Load language
					$app->getLanguage()->load('plg_installer_nevigen', JPATH_ADMINISTRATOR, 'en-GB', true);
				}

				// Load component language
				$app->getLanguage()->load('com_installer', JPATH_ADMINISTRATOR, $tag, true);

				return $plugin;
			}
		);

	}
};
