<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
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
use Joomla\Component\Jshopping\Site\Table\AddonTable;
use Joomla\Filesystem\File;
use Joomla\Filesystem\Folder;
use Joomla\Filesystem\Path;

return new class () implements InstallerScriptInterface {

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
	protected string $pathAddon = JPATH_ROOT . '/components/com_jshopping/addons/nevigen_onestepcheckout';

	/**
	 * Extension files.
	 *
	 * @var  array
	 *
	 * @since  1.0.0
	 */
	protected array $externalFiles = [
		[
			'src' => 'tmp/Controller/NevigenonestepcheckoutController.php',
			'dest' => JPATH_ROOT . '/components/com_jshopping/Controller/NevigenonestepcheckoutController.php',
			'type' => 'file',
		],
		[
			'src' => 'tmp/View/Nevigenonestepcheckout',
			'dest' => JPATH_ROOT . '/components/com_jshopping/View/Nevigenonestepcheckout',
			'type' => 'folder',
		],
		[
			'src' => 'tmp/tmpl/nevigenonestepcheckout',
			'dest' => JPATH_ROOT . '/components/com_jshopping/tmpl/nevigenonestepcheckout',
			'type' => 'folder',
		],
		[
			'src' => 'tmp/templates/nevigen_onestepcheckout/default',
			'dest' => JPATH_ROOT . '/components/com_jshopping/templates/addons/nevigen_onestepcheckout/default',
			'type' => 'folder',
		]
	];
	
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
		// Remove addon
		$this->removeAddon();

		// Remove external files
		$this->removeExternalFiles();

		return true;
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
		if (is_file($bootstrapFile))
		{

			/** @var AdministratorApplication $app */
			$app = Factory::getContainer()->get(AdministratorApplication::class);

			/** @var AddonTable $addon */
			$addon = $app->bootComponent('com_jshopping')->getMVCFactory()->createTable('Addon', 'Site');
			$addon->loadAlias($this->addon);

			if ($addon->get('id')) $addon->delete();
		}
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
		foreach ($this->externalFiles as $path) {
			// Actually delete the files/folders
			if (is_dir($path['dest'])) $val = Folder::delete($path['dest']);
			else $val = File::delete($path['dest']);

			if ($val === false) {
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
			// Set addon
			$this->setAddon();

			// Copy external files
			if ($this->copyExternalFiles($adapter->getParent())) {
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
			/** @var AdministratorApplication $app */
			$app = Factory::getContainer()->get(AdministratorApplication::class);

			$addon = $app->bootComponent('com_jshopping')->getMVCFactory()->createTable('Addon', 'Site');
			$addon->loadAlias($this->addon);
			$setName = true;
			$name    = $this->nameAddon;
			if ($addon->get('id'))
			{
				$setName = false;
				$id      = $addon->get('id');
				$name    = '<a href="index.php?option=com_jshopping&controller=addons&task=edit&id=' . $id . '">' . $this->nameAddon . '</a>';
			}
			$addon->set('name', $name);
			$addon->set('version', $this->versionAddon);
			$addon->set('uninstall', '/components/com_jshopping/addons/' . $this->addon . '/uninstall.php');
			$addon->store();

			if ($setName)
			{
				$addon->loadAlias($this->addon);
				$id   = $addon->get('id');
				$name = '<a href="index.php?option=com_jshopping&controller=addons&task=edit&id=' . $id . '">' . $this->nameAddon . '</a>';
				$addon->set('name', $name);
				$addon->store();
			}
		}
	}

	/**
	 * Method to copy external files.
	 *
	 * @param Installer $installer Installer calling object.
	 *
	 * @return  bool True on success, False on failure.
	 *
	 * @since  1.0.0
	 */
	public function copyExternalFiles(Installer $installer): bool
	{
		$copyFiles = array();
		foreach ($this->externalFiles as $path) {
			$path['src'] = Path::clean($this->pathAddon . '/' . $path['src']);
			$path['dest'] = Path::clean($path['dest']);
			if (basename($path['dest']) !== $path['dest']) {
				$newDir = dirname($path['dest']);
				if (!Folder::create($newDir)) {
					Log::add(Text::sprintf('JLIB_INSTALLER_ERROR_CREATE_DIRECTORY', $newDir), Log::WARNING, 'jerror');

					return false;
				}
			}

			$copyFiles[] = $path;
		}

		return $installer->copyFiles($copyFiles, true);
	}
};

