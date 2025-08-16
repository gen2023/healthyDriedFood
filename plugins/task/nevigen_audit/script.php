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
use Joomla\CMS\Date\Date;
use Joomla\CMS\Factory;
use Joomla\CMS\Installer\Installer;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Installer\InstallerScriptInterface;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Log\Log;
use Joomla\Database\DatabaseDriver;
use Joomla\Database\ParameterType;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use Joomla\Filesystem\File;
use Joomla\Filesystem\Folder;
use Joomla\Filesystem\Path;
use Joomla\Utilities\ArrayHelper;

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
				 * @since  1.2.0
				 */
				protected AdministratorApplication $app;

				/**
				 * The Database object.
				 *
				 * @var   DatabaseDriver
				 *
				 * @since  1.2.0
				 */
				protected DatabaseDriver $db;

				protected array $tasks = [
					[
						'title' => 'PLG_TASK_NEVIGEN_AUDIT_CHANGE_ORDER_STATUS_TITLE',
						'type'  => 'nevigen_audit.change_order_status',
					]
				];

				/**
				 * Constructor.
				 *
				 * @param   AdministratorApplication  $app  The application object.
				 *
				 * @since 1.2.0
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
				 * @since   1.2.0
				 */
				public function install(InstallerAdapter $adapter): bool
				{
					$this->enablePlugin($adapter);
					$this->addTasks();

					return true;
				}

				/**
				 * Function called after the extension is updated.
				 *
				 * @param   InstallerAdapter  $adapter  The adapter calling this method
				 *
				 * @return  boolean  True on success
				 *
				 * @since   1.2.0
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
				 * @since   1.2.0
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
				 * @since   1.2.0
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
				 * @since   1.2.0
				 */
				public function postflight(string $type, InstallerAdapter $adapter): bool
				{
					$installer = $adapter->getParent();
					if ($type !== 'uninstall')
					{
						// Parse layouts
						$this->parseLayouts($installer->getManifest()->layouts, $installer);
					}
					else
					{
						// Remove layouts
						$this->removeLayouts($installer->getManifest()->layouts);

						//  Remove tasks
						$this->removeTasks();
					}

					return true;
				}

				/**
				 * Method to parse through a layouts element of the installation manifest and take appropriate action.
				 *
				 * @param   SimpleXMLElement|null  $element    The XML node to process.
				 * @param   Installer|null         $installer  Installer calling object.
				 *
				 * @return  bool  True on success.
				 *
				 * @since  1.2.0
				 */
				public function parseLayouts(SimpleXMLElement $element = null, Installer $installer = null): bool
				{
					if (!$element || !count($element->children()))
					{
						return false;
					}

					// Get destination
					$folder      = ((string) $element->attributes()->destination) ? '/' . $element->attributes()->destination : null;
					$destination = Path::clean(JPATH_ROOT . '/layouts' . $folder);

					// Get source
					$folder = (string) $element->attributes()->folder;
					$source = ($folder && file_exists($installer->getPath('source') . '/' . $folder))
						? $installer->getPath('source') . '/' . $folder : $installer->getPath('source');

					// Prepare files
					$copyFiles = [];
					foreach ($element->children() as $file)
					{
						$path['src']  = Path::clean($source . '/' . $file);
						$path['dest'] = Path::clean($destination . '/' . $file);

						// Is this path a file or folder?
						$path['type'] = $file->getName() === 'folder' ? 'folder' : 'file';
						if (basename($path['dest']) !== $path['dest'])
						{
							$newdir = dirname($path['dest']);
							if (!Folder::create($newdir))
							{
								Log::add(Text::sprintf('JLIB_INSTALLER_ERROR_CREATE_DIRECTORY', $newdir), Log::WARNING, 'jerror');

								return false;
							}
						}

						$copyFiles[] = $path;
					}

					return $installer->copyFiles($copyFiles, true);
				}

				/**
				 * Method to parse through a layouts element of the installation manifest and remove the files that were installed.
				 *
				 * @param   SimpleXMLElement|null  $element  The XML node to process.
				 *
				 * @return  bool  True on success.
				 *
				 * @since  1.2.0
				 */
				protected function removeLayouts(SimpleXMLElement $element = null): bool
				{
					if (!$element || !count($element->children()))
					{
						return false;
					}

					// Get the array of file nodes to process
					$files = $element->children();

					// Get source
					$folder = ((string) $element->attributes()->destination) ? '/' . $element->attributes()->destination : null;
					$source = Path::clean(JPATH_ROOT . '/layouts' . $folder);

					// Process each file in the $files array (children of $tagName).
					foreach ($files as $file)
					{
						$path = Path::clean($source . '/' . $file);

						// Actually delete the files/folders
						if (is_dir($path))
						{
							$val = Folder::delete($path);
						}
						else
						{
							$val = File::delete($path);
						}

						if ($val === false)
						{
							Log::add('Failed to delete ' . $path, Log::WARNING, 'jerror');

							return false;
						}
					}

					if (!empty($folder))
					{
						Folder::delete($source);
					}

					return true;
				}


				/**
				 * Enable plugin after installation.
				 *
				 * @param   InstallerAdapter  $adapter  Parent object calling object.
				 *
				 * @since  1.2.0
				 */
				protected function enablePlugin(InstallerAdapter $adapter)
				{
					// Prepare plugin object
					$plugin          = new \stdClass();
					$plugin->type    = 'plugin';
					$plugin->element = $adapter->getElement();
					$plugin->folder  = (string) $adapter->getParent()->manifest->attributes()['group'];
					$plugin->enabled = 1;

					// Update record
					$this->db->updateObject('#__extensions', $plugin, ['type', 'element', 'folder']);
				}

				/**
				 * Creates tasks if they do not already exist.
				 *
				 * @return void
				 *
				 * @since 1.2.0
				 */
				protected function addTasks(): void
				{
					$db    = $this->db;
					$model = $this->app->bootComponent('com_scheduler')
						->getMVCFactory()->createModel('Task', 'Administrator');
					if (!$model)
					{
						return;
					}

					foreach ($this->tasks as $taskData)
					{
						$type = $taskData['type'];
						// Skip if task already exists
						$query = $db->getQuery(true)
							->select($db->quoteName('id'))
							->from($db->quoteName('#__scheduler_tasks'))
							->where($db->quoteName('type') . ' = ' . $db->quote($type));
						$db->setQuery($query);

						if ($db->loadResult())
						{
							continue;
						}

						// Translate title
						$taskData['title']           = Text::_($taskData['title']);
						$taskData['start_date']      = (new Date())->format('Y-m-d H:i:s');
						$taskData['note']            = 'Automatically created by plugin installer';
						$taskData['execution_rules'] = [
							'rule-type' => 'manual',
							'exec-day'  => 0,
							'exec-time' => '00:00',
						];
						$taskData['state']           = 0;
						$taskData['priority']        = 0;
						$taskData['cli_exclusive']   = 0;

						try
						{
							$model->save($taskData);
						}
						catch (Exception $e)
						{
							continue;
						}
					}
				}

				/**
				 * Removes tasks created by this plugin.
				 *
				 * @return void
				 *
				 * @since 1.2.0
				 */
				protected function removeTasks(): void
				{
					if (empty($this->tasks))
					{
						return;
					}

					$db    = $this->db;
					$types = ArrayHelper::getColumn($this->tasks, 'type');
					if (empty($types))
					{
						return;
					}

					$query = $db->getQuery(true)
						->delete($db->quoteName('#__scheduler_tasks'))
						->whereIn('type', $types, ParameterType::STRING);

					$db->setQuery($query)->execute();
				}
			});
	}
};