<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Helper;

\defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\Component\NevigenAudit\Administrator\Traits\StaticDatabaseTrait;
use Joomla\Registry\Registry;

class ParamsHelper
{
	use StaticDatabaseTrait;

	/**
	 * Global Params.
	 *
	 * @var  Registry|null
	 *
	 * @since  1.0.0
	 */
	public static ?Registry $_component = null;
	

	/**
	 * Menu item params.
	 *
	 * @var  Registry[]
	 *
	 * @since  1.0.0
	 */
	public static ?array $_menu = null;

	/**
	 * Menu items ids.
	 *
	 * @var  int[]
	 *
	 * @since  1.0.0
	 */
	public static ?array $_menuItems = null;

	/**
	 * Method to get component params.
	 *
	 * @return   Registry Component params.
	 *
	 * @since  1.0.0
	 */
	public static function getComponentParams(): Registry
	{
		if (self::$_component === null)
		{
			self::$_component = ComponentHelper::getParams('com_nevigen_audit');
		}

		return self::$_component;
	}
	
	/**
	 * Method to correct merge params.
	 *
	 * @param   array  $array  Merging Params array.
	 *
	 * @return Registry
	 *
	 * @since 1.0.0
	 */
	public static function merge(array $array = []): Registry
	{
		$result = new Registry();

		foreach ($array as $params)
		{
			if (!$params instanceof Registry)
			{
				$params = new Registry($params);
			}

			foreach (array_keys($params->toArray()) as $path)
			{
				$value = $params->get($path);
				if (!$result->exists($path))
				{
					$result->set($path, $value);
				}
				elseif ((string)$value !== '')
				{
					$result->set($path, $value);
				}
			}
		}

		return $result;
	}

	/**
	 * Method to clean static variables value from RAM.
	 *
	 * @since 1.0.0
	 */
	public static function reset()
	{
		self::$_component      = null;
		self::$_menu           = null;
		self::$_menuItems      = null;
	
	}
}