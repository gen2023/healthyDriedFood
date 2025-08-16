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
use Joomla\CMS\Installer\Installer;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Installer\InstallerScriptInterface;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Log\Log;
use Joomla\Database\DatabaseDriver;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use Joomla\Filesystem\File;
use Joomla\Filesystem\Folder;
use Joomla\Filesystem\Path;
use Joomla\Registry\Registry;

return new class () implements ServiceProviderInterface {
	public function register(Container $container)
	{
		$container->set(InstallerScriptInterface::class, new class ($container->get(AdministratorApplication::class)) implements InstallerScriptInterface {
			/**
			 * The application object.
			 *
			 * @var  AdministratorApplication
			 *
			 * @since  1.0.0
			 */
			protected AdministratorApplication $app;

			/**
			 * The Database object.
			 *
			 * @var   DatabaseDriver
			 *
			 * @since  1.0.0
			 */
			protected DatabaseDriver $db;

			/**
			 * Extension params for check.
			 *
			 * @var  array
			 *
			 * @since  1.0.0
			 */
			protected array $extensionParams = [
				'sef_advanced'     => 1,
				'replace_lists'    => 1,
				'users_export_all' => 1,
				'status_paid'      => 6,
				'status_cancel'    => [3,4],
			];


			/**
			 * Extension files.
			 *
			 * @var  array
			 *
			 * @since  1.0.0
			 */
			protected array $externalFiles = [

			];

			/**
			 * Update methods.
			 *
			 * @var  array
			 *
			 * @since  1.0.0
			 */
			protected array $updateMethods = [
			];

			/**
			 * Constructor.
			 *
			 * @param   AdministratorApplication  $app  The application object.
			 *
			 * @since 1.0.0
			 */
			public function __construct(AdministratorApplication $app)
			{
				$this->app = $app;
				$this->db  = Factory::getContainer()->get('DatabaseDriver');
			}

			/**
			 * Function called after the extension is installed.
			 *
			 * @param   InstallerAdapter  $adapter  The adapter calling this method.
			 *
			 * @return  boolean  True on success
			 *
			 * @since   1.0.0
			 */
			public function install(InstallerAdapter $adapter): bool
			{
				return true;
			}

			/**
			 * Function called after the extension is updated.
			 *
			 * @param   InstallerAdapter  $adapter  The adapter calling this method.
			 *
			 * @return  boolean  True on success
			 *
			 * @since   1.0.0
			 */
			public function update(InstallerAdapter $adapter): bool
			{
				return true;
			}

			/**
			 * Function called after the extension is uninstalled.
			 *
			 * @param   InstallerAdapter  $adapter  The adapter calling this method.
			 *
			 * @return  boolean  True on success
			 *
			 * @since   1.0.0
			 */
			public function uninstall(InstallerAdapter $adapter): bool
			{
				return true;
			}

			/**
			 * Function called before extension installation/update/removal procedure commences.
			 *
			 * @param   string            $type     The type of change (install or discover_install, update, uninstall).
			 * @param   InstallerAdapter  $adapter  The adapter calling this method.
			 *
			 * @return  boolean  True on success
			 *
			 * @since   1.0.0
			 */
			public function preflight(string $type, InstallerAdapter $adapter): bool
			{
				return true;
			}

			/**
			 * Function called after extension installation/update/removal procedure commences.
			 *
			 * @param   string            $type     The type of change (install or discover_install, update, uninstall).
			 * @param   InstallerAdapter  $adapter  The adapter calling this method.
			 *
			 * @return  boolean  True on success
			 *
			 * @since   1.0.0
			 */
			public function postflight(string $type, InstallerAdapter $adapter): bool
			{
				$installer = $adapter->getParent();
				if ($type !== 'uninstall')
				{
					// Parse layouts
					$this->parseLayouts($installer->getManifest()->layouts, $installer);

					// Check databases
					$this->checkTables($adapter);

					// Check extension params
					$this->checkExtensionParams($adapter);

					// Copy external files
					$this->copyExternalFiles($installer);

					// Run updates script
					if ($type === 'update')
					{
						foreach ($this->updateMethods as $method)
						{
							if (method_exists($this, $method))
							{
								$this->$method($adapter);
							}
						}
					}
				}
				else
				{
					// Remove layouts
					$this->removeLayouts($installer->getManifest()->layouts);

					// Remove external files
					$this->removeExternalFiles();
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
			 * @since  1.0.0
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
			 * @since  1.0.0
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
			 * Method to create database tables in not exist.
			 *
			 * @param   InstallerAdapter  $adapter  Parent object calling object.
			 *
			 * @since  1.0.0
			 */
			protected function checkTables(InstallerAdapter $adapter)
			{
				if ($sql = file_get_contents($adapter->getParent()->getPath('extension_administrator')
					. '/sql/install.mysql.utf8.sql'))
				{
					$db = $this->db;
					foreach ($db->splitSql($sql) as $query)
					{
						$db->setQuery($db->convertUtf8mb4QueryToUtf8($query));
						try
						{
							$db->execute();
						}
						catch (JDataBaseExceptionExecuting $e)
						{
							Log::add(Text::sprintf('JLIB_INSTALLER_ERROR_SQL_ERROR', $e->getMessage()), Log::WARNING, 'jerror');
						}
					}
				}
			}

			/**
			 * Method to check extension params and set if needed.
			 *
			 * @param   InstallerAdapter  $adapter  Parent object calling object.
			 *
			 * @since  1.0.0
			 */
			protected function checkExtensionParams(InstallerAdapter $adapter)
			{
				if (!empty($this->extensionParams))
				{
					$element = $adapter->getElement();
					$folder  = (string) $adapter->getParent()->manifest->attributes()['group'];

					// Get extension
					$db    = $this->db;
					$query = $db->getQuery(true)
						->select(['extension_id', 'params'])
						->from($db->quoteName('#__extensions'))
						->where($db->quoteName('element') . ' = :element')
						->bind(':element', $element);
					if (!empty($folder))
					{
						$query->where($db->quoteName('folder') . ' = :folder')
							->bind(':folder', $folder);
					}
					if ($extension = $db->setQuery($query)->loadObject())
					{
						$extension->params = new Registry($extension->params);

						// Check params
						$needUpdate = false;
						foreach ($this->extensionParams as $path => $value)
						{
							if (!$extension->params->exists($path))
							{
								$needUpdate = true;
								$extension->params->set($path, $value);
							}
						}

						// Update
						if ($needUpdate)
						{
							$extension->params = (string) $extension->params;
							$db->updateObject('#__extensions', $extension, 'extension_id');
						}
					}
				}
			}


			/**
			 * Method to copy external files.
			 *
			 * @param   Installer  $installer  Installer calling object.
			 *
			 * @return  bool True on success, False on failure.
			 *
			 * @since  1.0.0
			 */
			public function copyExternalFiles(Installer $installer): bool
			{
				$copyFiles = [];
				foreach ($this->externalFiles as $path)
				{
					$path['src']  = Path::clean($path['src']);
					$path['dest'] = Path::clean($path['dest']);
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
			 * Method to delete external files.
			 *
			 * @return  bool  True on success.
			 *
			 * @since  1.0.0
			 */
			protected function removeExternalFiles(): bool
			{
				// Process each file in the $files array (children of $tagName).
				foreach ($this->externalFiles as $path)
				{
					// Actually delete the files/folders
					if (is_dir($path['dest']))
					{
						$val = Folder::delete($path['dest']);
					}
					else
					{
						$val = File::delete($path['dest']);
					}

					if ($val === false)
					{
						Log::add('Failed to delete ' . $path, Log::WARNING, 'jerror');

						return false;
					}
				}

				return true;
			}
		});
	}
};