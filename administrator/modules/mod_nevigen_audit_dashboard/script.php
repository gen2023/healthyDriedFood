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

use Joomla\CMS\Application\AdministratorApplication;
use Joomla\CMS\Factory;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Installer\InstallerScriptInterface;
use Joomla\Database\DatabaseDriver;
use Joomla\Database\ParameterType;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;

return new class () implements ServiceProviderInterface {
	public function register(Container $container)
	{
		$container->set(InstallerScriptInterface::class,
			new class ($container->get(AdministratorApplication::class)) implements InstallerScriptInterface {
				/**
				 * The application object
				 *
				 * @var  AdministratorApplication
				 *
				 * @since  1.1.0
				 */
				protected AdministratorApplication $app;

				/**
				 * The Database object.
				 *
				 * @var   DatabaseDriver
				 *
				 * @since  1.1.0
				 */
				protected DatabaseDriver $db;

				/**
				 * Language constant for errors.
				 *
				 * @var string
				 *
				 * @since 1.1.0
				 */
				protected string $constant = "";

				/**
				 * Update methods.
				 *
				 * @var  array
				 *
				 * @since  1.1.0
				 */
				protected array $updateMethods = [];

				/**
				 * Constructor.
				 *
				 * @param   AdministratorApplication  $app  The application object.
				 *
				 * @since 1.1.0
				 */
				public function __construct(AdministratorApplication $app)
				{
					$this->app = $app;
					$this->db  = Factory::getContainer()->get('DatabaseDriver');
				}

				/**
				 * Function called after the extension is installed.
				 *
				 * @param   InstallerAdapter  $adapter  The adapter calling this method
				 *
				 * @return  boolean  True on success
				 *
				 * @since   1.1.0
				 */
				public function install(InstallerAdapter $adapter): bool
				{
					return true;
				}

				/**
				 * Function called after the extension is updated.
				 *
				 * @param   InstallerAdapter  $adapter  The adapter calling this method
				 *
				 * @return  boolean  True on success
				 *
				 * @since   1.1.0
				 */
				public function update(InstallerAdapter $adapter): bool
				{
					return true;
				}

				/**
				 * Function called after the extension is uninstalled.
				 *
				 * @param   InstallerAdapter  $adapter  The adapter calling this method
				 *
				 * @return  boolean  True on success
				 *
				 * @since   1.1.0
				 */
				public function uninstall(InstallerAdapter $adapter): bool
				{
					return true;
				}

				/**
				 * Function called before extension installation/update/removal procedure commences.
				 *
				 * @param   string            $type     The type of change (install or discover_install, update, uninstall)
				 * @param   InstallerAdapter  $adapter  The adapter calling this method
				 *
				 * @return  boolean  True on success
				 *
				 * @since   1.1.0
				 */
				public function preflight(string $type, InstallerAdapter $adapter): bool
				{
					return true;
				}

				/**
				 * Function called after extension installation/update/removal procedure commences.
				 *
				 * @param   string            $type     The type of change (install or discover_install, update, uninstall)
				 * @param   InstallerAdapter  $adapter  The adapter calling this method
				 *
				 * @return  boolean  True on success
				 *
				 * @since   1.1.0
				 */
				public function postflight(string $type, InstallerAdapter $adapter): bool
				{
					if ($type !== 'uninstall')
					{
						// Enable module
						$this->enableModule($adapter, 'top');
					}

					return true;
				}

				/**
				 * Enable module after installation.
				 *
				 * @param   InstallerAdapter  $adapter   Parent object calling this method.
				 * @param   string            $position  Optional module position.
				 * @param   bool              $force     Force enable even if already enabled (default: false).
				 *
				 * @since   1.1.0
				 */
				protected function enableModule(InstallerAdapter $adapter, string $position = '', bool $force = false): void
				{
					$db         = $this->db;
					$moduleName = $adapter->getElement();

					// Determine client ID from manifest <client> tag (site or administrator)
					$clientAttr = (string) $adapter->getParent()->manifest->attributes()['client'];
					$clientId   = ($clientAttr === 'site') ? 0 : 1;


					if (!$force)
					{
						$query = $db->getQuery(true)
							->select('id')
							->from('#__modules')
							->where($db->quoteName('module') . ' = :module')
							->where($db->quoteName('client_id') . ' = :client')
							->where($db->quoteName('published') . ' = 0')
							->where('(' . $db->quoteName('position') . ' IS NULL OR '
								. $db->quoteName('position') . ' = ' . $db->quote('') . ')')
							->bind(':module', $moduleName)
							->bind(':client', $clientId, ParameterType::INTEGER);

						$exist = $db->setQuery($query)->loadResult();

						if (empty($exist))
						{
							return;
						}
					}

					$key = ['module', 'client_id'];

					// Prepare module object
					$module            = new \stdClass();
					$module->showtitle = 0;
					$module->module    = $moduleName;
					$module->client_id = $clientId;
					$module->published = 1;
					$module->position  = $position;

					if (!empty($exist))
					{
						$key[]      = 'id';
						$module->id = $exist;
						$module->params    = '{"layout":"_:default","moduleclass_sfx":"cpanel-modules","module_tag":"div","bootstrap_size":"0","header_tag":"h2","header_class":"","style":"Atum-well"}';
					}

					// Update record
					$db->updateObject('#__modules', $module, $key);
				}

			});
	}
};