<?php
/*
 * @package    Nevigen Installer Plugin
 * @version    2.1.1
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\Installer\Nevigen\Helper;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Installer\Installer;

\defined('_JEXEC') or die;

class ExtensionHelper
{
	protected static ?array $versionJS = null;
	protected static ?array $checkVersion = null;

	public static function getJSVersion($type = 'jshopping')
	{
		if (self::$versionJS === null)
		{
			self::$versionJS = [];
		}
		if (!isset(self::$versionJS[$type]))
		{
			self::$versionJS[$type] = '';
			if ($type == 'jshopping')
			{
				$data = Installer::parseXMLInstallFile(JPATH_ROOT . '/administrator/components/com_jshopping/jshopping.xml');
				if (!empty($data) && !empty($data['version']))
				{
					self::$versionJS[$type] = $data['version'];
				}
			}
			elseif ($type == 'nevigen_audit' && ComponentHelper::isInstalled('com_nevigen_audit') === 1)
			{
				$data = Installer::parseXMLInstallFile(JPATH_ROOT . '/administrator/components/com_nevigen_audit/nevigen_audit.xml');
				if (!empty($data) && !empty($data['version']))
				{
					self::$versionJS[$type] = $data['version'];
				}
			}
		}

		return self::$versionJS[$type];
	}

	public static function checkVersion(string $minVersion = null, string $component = 'jshopping'): ?bool
	{
		if (self::$checkVersion === null)
		{
			self::$checkVersion = [];
		}
		if (!isset(self::$checkVersion[$component]))
		{
			self::$checkVersion[$component] = false;
			self::getJSVersion($component);
			if (!empty(self::$versionJS[$component]) && !empty($minVersion))
			{
				self::$checkVersion[$component] = self::versionCompare(self::$versionJS[$component], $minVersion);
			}
		}

		return self::$checkVersion[$component];
	}

	public static function versionCompare(string $currentVersion = null, string $minVersion = null): ?bool
	{
		if (!empty($currentVersion) && !empty($minVersion))
		{
			return (version_compare($currentVersion, $minVersion) >= 0);
		}

		return false;
	}
}