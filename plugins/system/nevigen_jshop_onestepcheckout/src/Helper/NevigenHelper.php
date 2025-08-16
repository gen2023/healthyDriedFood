<?php
/*
 * @package    Nevigen JShop OneStepCheckout Package
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\System\NevigenJshopOneStepCheckout\Helper;

use Joomla\CMS\Installer\Installer;

\defined('_JEXEC') or die;

class NevigenHelper
{
	protected static ?string $versionJS  = null;
	protected static ?bool $checkVersion  = null;

	public static function getJSVersion()
	{
		if (self::$versionJS === null)
		{
			$data = Installer::parseXMLInstallFile(JPATH_ROOT.'/administrator/components/com_jshopping/jshopping.xml');
			if (!empty($data) && !empty($data['version']))
			{
				self::$versionJS = $data['version'];
			}
		}

		return self::$versionJS;
	}
	public static function checkVersion(string $minVersion = null): ?bool
	{
		if (self::$checkVersion === null)
		{
			self::getJSVersion();
			if (!empty(self::$versionJS) && !empty($minVersion))
			{
				self::$checkVersion = self::versionCompare(self::$versionJS,$minVersion);
			}
		}

		return self::$checkVersion;
	}
	protected static function versionCompare(string $currentVersion = null,string $minVersion = null): ?bool
	{
		if (!empty($currentVersion) && !empty($minVersion))
		{
			return (version_compare($currentVersion, $minVersion) >= 0);
		}

		return false;
	}
}