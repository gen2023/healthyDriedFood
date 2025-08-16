<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
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

return new class () implements ServiceProviderInterface {
	public function register(Container $container)
	{
		$container->set(InstallerScriptInterface::class, new class ($container->get(AdministratorApplication::class)) implements InstallerScriptInterface {
			/**
			 * The application object
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
			 * Key  addon.
			 *
			 * @var  string
			 *
			 * @since  1.0.0
			 */
			protected string $addon = '';
			/**
			 * Name  addon.
			 *
			 * @var  string
			 *
			 * @since  1.0.0
			 */
			protected string $nameAddon = '';

			/**
			 * Version  addon.
			 *
			 * @var  string
			 *
			 * @since  1.0.0
			 */
			protected string $versionAddon = '';

			/**
			 * Path  addon.
			 *
			 * @var  string
			 *
			 * @since  1.0.0
			 */
			protected string $pathAddon = JPATH_ROOT . '/components/com_jshopping/addons/nevigen_novaposhta';

			/**
			 * Table  addon.
			 *
			 * @var  \Joomla\Component\Jshopping\Site\Table\AddonTable
			 *
			 * @since  1.0.0
			 */
			protected ?\Joomla\Component\Jshopping\Site\Table\AddonTable $addonTable = null;
			/**
			 * Extension files.
			 *
			 * @var  array
			 *
			 * @since  1.0.0
			 */
			protected array $externalFiles = [
				[
					'src'  => 'tmp/shippingform/NevigenNovaposhtaCourierShippingForm',
					'dest' => JPATH_ROOT . '/components/com_jshopping/shippingform/NevigenNovaposhtaCourierShippingForm',
					'type' => 'folder',
				],
				[
					'src'  => 'tmp/shippingform/NevigenNovaposhtaPickupShippingForm',
					'dest' => JPATH_ROOT . '/components/com_jshopping/shippingform/NevigenNovaposhtaPickupShippingForm',
					'type' => 'folder',
				],
				[
					'src'  => 'tmp/shippingform/NevigenNovaposhtaPostomatShippingForm',
					'dest' => JPATH_ROOT . '/components/com_jshopping/shippingform/NevigenNovaposhtaPostomatShippingForm',
					'type' => 'folder',
				],
				[
					'src'  => 'tmp/shippings/nevigen_novaposhta',
					'dest' => JPATH_ROOT . '/components/com_jshopping/shippings/nevigen_novaposhta',
					'type' => 'folder',
				],
				[
					'src'  => 'tmp/Controller/NevigenNovaposhtaController.php',
					'dest' => JPATH_ROOT . '/components/com_jshopping/Controller/NevigenNovaposhtaController.php',
					'type' => 'file',
				],

			];

			/**
			 * Methods name.
			 *
			 * @var  array
			 *
			 * @since  1.0.0
			 */
			protected array $methodsName = [
				'NevigenNovaposhtaPickupShippingForm',
				'NevigenNovaposhtaPostomatShippingForm',
				'NevigenNovaposhtaCourierShippingForm'
			];

			/**
			 * Constructor.
			 *
			 * @param   AdministratorApplication  $app  The applications object.
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
			 * @param   InstallerAdapter  $adapter  The adapter calling this method
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
			 * @param   InstallerAdapter  $adapter  The adapter calling this method
			 *
			 * @return  boolean  True on success
			 *
			 * @since   1.0.0
			 */
			public function update(InstallerAdapter $adapter): bool
			{

				return true;
			}

			protected function addTrackingField(): void
			{
				$add     = true;
				$table   = '#__jshopping_orders';
				$columns = $this->db->getTableColumns($table);
				if ($this->addon)
				{
					$currentVersion = '';
					$minVersion     = '1.3.0';
					$this->addonTable->loadAlias($this->addon);
					if (!empty($this->addonTable->version))
					{
						$currentVersion = $this->addonTable->version;
					}

					if (!empty($currentVersion) && version_compare($currentVersion, $minVersion, '<'))
					{
						if (isset($columns['nevigen_novaposhta_tracking']))
						{
							$this->addonTable->deleteFieldTable($table, 'nevigen_novaposhta_tracking');
						}

						if (isset($columns['nevigen_ukrposhta_tracking']))
						{
							$query = 'ALTER TABLE ' . $this->db->quoteName($table)
								. ' CHANGE ' . $this->db->quoteName('nevigen_ukrposhta_tracking')
								. ' ' . $this->db->quoteName('nevigen_tracking') . ' varchar(50)';

							$this->db->setQuery($query);
							$this->db->execute();

							$add = false;
						}

					}

				}

				if ($add)
				{
					if (!isset($columns['nevigen_tracking']))
					{
						$this->addonTable->addFieldTable('#__jshopping_orders', 'nevigen_tracking',
							'varchar(50) default null');
					}
				}
			}

			/**
			 * Function called after the extension is uninstalled.
			 *
			 * @param   InstallerAdapter  $adapter  The adapter calling this method
			 *
			 * @return  boolean  True on success
			 *
			 * @since   1.0.0
			 */
			public function uninstall(InstallerAdapter $adapter): bool
			{
				// Remove shipping method
				$this->removeShipping();

				// Remove addon
				$this->removeAddon();

				// Remove external files
				$this->removeExternalFiles();

				return true;
			}

			/**
			 * Method to delete external files.
			 *
			 * @return  boolean  True on success.
			 *
			 * @since  1.0.0
			 */
			protected function removeExternalFiles(): bool
			{
				// Process each file in the $files array (children of $tagName).
				foreach ($this->externalFiles as $path)
				{
					// Actually delete the files/folders
					if (is_dir($path['dest'])) $val = Folder::delete($path['dest']);
					else $val = File::delete($path['dest']);

					if ($val === false)
					{
						Log::add('Failed to delete ' . $path, Log::WARNING, 'jerror');

						return false;
					}
				}

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
			 * @since   1.0.0
			 */
			public function preflight(string $type, InstallerAdapter $adapter): bool
			{
				$manifest = $adapter->getManifest();

				$this->nameAddon    = (string) $manifest->name;
				$this->addon        = (string) $manifest->addon;
				$this->versionAddon = (string) $manifest->version;

				if ($this->addon)
				{
					$this->addonTable = $this->app->bootComponent('com_jshopping')
						->getMVCFactory()->createTable('Addon', 'Site');
				}

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
			 * @since   1.0.0
			 */
			public function postflight(string $type, InstallerAdapter $adapter): bool
			{
				if ($type !== 'uninstall')
				{
					// Set shipping
					$this->setShipping();

					// Set addon
					$this->setAddon();

					// Copy external files
					if ($this->copyExternalFiles($adapter->getParent()))
					{
						$tmp = $this->pathAddon . '/tmp';
						if (is_dir($tmp)) Folder::delete($tmp);
					}
				}

				return true;
			}

			/**
			 * Runs right after any installation action.
			 *
			 * @throws  Exception
			 *
			 * @return  void
			 *
			 * @since  1.0.0
			 */
			public function setAddon(): void
			{
				if ($this->addon)
				{
					$this->addonTable->loadAlias($this->addon);
					$setName = true;
					$name    = $this->nameAddon;
					if ($this->addonTable->get('id'))
					{
						$setName = false;
						$id      = $this->addonTable->get('id');
						$name    = '<a href="index.php?option=com_jshopping&controller=addons&task=edit&id=' . $id . '">'
							. $this->nameAddon . '</a>';
					}
					$this->addonTable->set('name', $name);
					$this->addonTable->set('version', $this->versionAddon);
					$this->addonTable->set('uninstall', '/components/com_jshopping/addons/' . $this->addon . '/uninstall.php');
					$this->addonTable->store();

					if ($setName)
					{
						$this->addonTable->loadAlias($this->addon);
						$id   = $this->addonTable->get('id');
						$name = '<a href="index.php?option=com_jshopping&controller=addons&task=edit&id=' . $id . '">' . $this->nameAddon . '</a>';
						$this->addonTable->set('name', $name);
						$this->addonTable->store();
					}
				}
			}

			public function setShipping()
			{
				$bootstrap = JPATH_SITE . '/components/com_jshopping/bootstrap.php';
				if (!is_file($bootstrap)) return;

				if (!class_exists('JSFactory') || !class_exists('JSHelper'))
				{
					require_once($bootstrap);
				}
				$lang    = \JSHelper::getAllLanguages();
				$dataExt = [
					'name'      => 'Nevigen Novaposhta',
					'alias'     => 'nevigen_novaposhta',
					'shipping'  => [],
					'published' => '1',
				];

				//Get country
				$query      = $this->db->getQuery(true)
					->select($this->db->quoteName('country_id'))
					->from($this->db->quoteName('#__jshopping_countries'))
					->where($this->db->quoteName('country_code') . ' = ' . $this->db->quote('UKR'))
					->where($this->db->quoteName('country_code_2') . ' = ' . $this->db->quote('UA'));
				$country_id = $this->db->setQuery($query)->loadResult();
				foreach ($this->methodsName as $shipping)
				{
					/** @var \Joomla\Component\Jshopping\Site\Table\ShippingMethodTable $shippingMethod */
					$shippingMethod = \JSFactory::getTable('shippingMethod', 'jshop');
					if ($shipping === 'NevigenNovaposhtaPickupShippingForm')
					{
						$name = 'Нова пошта відділення';
					}
					elseif ($shipping === 'NevigenNovaposhtaPostomatShippingForm')
					{
						$name = 'Нова пошта поштомат';
					}
					else
					{
						$name = 'Нова пошта кур’єр';
					}
					if (!$shippingMethod->load(['alias' => $shipping]))
					{
						$shippingMethodData = [
							'alias'     => $shipping,
							'published' => 0,
						];
						foreach ($lang as $data)
						{
							$shippingMethodData['name_' . $data->language] = $name;
						}
						$shippingMethod->bind($shippingMethodData);

						if ($shippingMethod->store())
						{
							$dataExt['shipping'][$shippingMethod->shipping_id] = 1;
							$insertPrice                                       = new \stdClass();
							$insertPrice->sh_pr_method_id                      = 0;
							$insertPrice->shipping_method_id                   = $shippingMethod->shipping_id;

							$this->db->insertObject('#__jshopping_shipping_method_price', $insertPrice, 'sh_pr_method_id');

							// Set country
							if (!empty($country_id) && !empty($insertPrice->sh_pr_method_id))
							{
								$insertPriceCountry                     = new \stdClass();
								$insertPriceCountry->sh_pr_method_id    = $insertPrice->sh_pr_method_id;
								$insertPriceCountry->country_id = $country_id;

								$this->db->insertObject('#__jshopping_shipping_method_price_countries',
									$insertPriceCountry);
							}


						}
						else
						{
							$this->app->enqueueMessage(Text::_('JSHOP_ERROR_SAVE_DATABASE'), 'warning');
						}
					}
				}

				if (!empty($dataExt['shipping']))
				{
					/** @var \Joomla\Component\Jshopping\Site\Table\ShippingExtTable $shippingext */
					$shippingext = \JSFactory::getTable('shippingExt');

					$shippingext->load(['alias' => $dataExt['alias']]);
					$shippingext->bind($dataExt);
					$shippingext->setShippingMethod($dataExt['shipping']);
					$shippingext->setParams('');
					if (!$shippingext->store())
					{
						$this->app->enqueueMessage(Text::_('JSHOP_ERROR_SAVE_DATABASE'), 'warning');
					}
				}

				$this->addTrackingField();
			}

			public function removeShipping()
			{
				$bootstrap = JPATH_ROOT . '/components/com_jshopping/bootstrap.php';
				if (!is_file($bootstrap)) return;

				if (!class_exists('JSFactory') || !class_exists('JSHelper'))
				{
					require_once($bootstrap);
				}

				/** @var \Joomla\Component\Jshopping\Site\Table\ShippingExtTable $shippingext */
				$shippingext = \JSFactory::getTable('shippingExt');
				if ($shippingext->loadFromAlias('nevigen_novaposhta'))
				{
					$shippingext->delete();
				}
				foreach ($this->methodsName as $shipping)
				{
					$shippingMethod = \JSFactory::getTable('shippingMethod', 'jshop');
					if ($shippingMethod->load(['alias' => $shipping]))
					{
						$query = $this->db->getQuery(true);
						$query->delete($this->db->quoteName('#__jshopping_shipping_method_price'));
						$query->where([
							$this->db->quoteName('shipping_method_id') . ' = ' . $shippingMethod->shipping_id
						]);
						$query->setQuery($query);
						$this->db->execute();

						$shippingMethod->delete($shippingMethod->shipping_id);
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
				$copyFiles = array();
				foreach ($this->externalFiles as $path)
				{
					$path['src']  = Path::clean($this->pathAddon . '/' . $path['src']);
					$path['dest'] = Path::clean($path['dest']);
					if (basename($path['dest']) !== $path['dest'])
					{
						$newDir = dirname($path['dest']);
						if (!Folder::create($newDir))
						{
							Log::add(Text::sprintf('JLIB_INSTALLER_ERROR_CREATE_DIRECTORY', $newDir), Log::WARNING, 'jerror');

							return false;
						}
					}

					$copyFiles[] = $path;
				}

				return $installer->copyFiles($copyFiles, true);
			}

			/**
			 * Method to delete addon.
			 *
			 * @return  void  True on success.
			 *
			 * @since  1.0.0
			 */
			protected function removeAddon(): void
			{
				$bootstrapFile = JPATH_SITE . '/components/com_jshopping/bootstrap.php';
				if (is_file($bootstrapFile) && $this->addonTable)
				{
					$this->addonTable->loadAlias($this->addon);

					if ($this->addonTable->get('id'))
					{
						$this->addonTable->delete();
					}
				}
			}
		});
	}
};
