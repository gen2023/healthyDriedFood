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

use Joomla\CMS\Factory;

class NevigenAuditHelper
{
	protected static ?string $_localeApexCharts = null;

	public static function getRGBColor($id, $type = null, $opacity = '0.4'): string
	{
		$hash = md5($id . '_' . $type);
		$r    = 60 + (hexdec(substr($hash, 0, 2)) % 190);
		$g    = 60 + (hexdec(substr($hash, 2, 2)) % 190);
		$b    = 60 + (hexdec(substr($hash, 4, 2)) % 190);

		$adjust = hexdec(substr($hash, 6, 2)) % 50;

		if (abs($r - $g) < 40 && abs($r - $b) < 40)
		{
			$r = ($r + $adjust + 80) % 255;
			$g = ($g + $adjust + 120) % 255;
			$b = ($b + $adjust + 160) % 255;
		}

		$color = 'rgba(' . $r . ', ' . $g . ', ' . $b . ',' . $opacity . ')';

		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditGetRGBColor', [$id, $type, &$color]);

		return $color;
	}

	public static function getLocaleApexCharts()
	{
		if (self::$_localeApexCharts === null)
		{
			$lang = Factory::getApplication()->getLanguage();
			if ($lang->getTag() === 'uk-UA')
			{
				self::$_localeApexCharts = 'ua';
			}
			elseif ($lang->getTag() === 'ru-RU')
			{
				self::$_localeApexCharts = 'ru';
			}
			else
			{
				self::$_localeApexCharts = false;
			}

			return self::$_localeApexCharts;
		}

	}

	public static function calculatePercentageChange($current, $previous, $returnHtml = true)
	{
		if ($previous == 0)
		{
			if ($current == 0)
			{
				return '';
			}

			if ($returnHtml === true)
			{
				return '<span class="small text-success ms-2">&#9650; +100%</span>';
			}
			else
			{
				return 100;
			}
		}

		$diff    = $current - $previous;
		$percent = round($diff / $previous * 100);

		if ($returnHtml === false)
		{
			if ($percent > 0)
			{
				return $percent;
			}
			elseif ($percent < 0)
			{
				return abs($percent);
			}
		}

		if ($percent > 0)
		{
			return '<span class="small text-success ms-2">&#9650; +' . $percent . '%</span>';
		}
		elseif ($percent < 0)
		{
			return '<span class="small text-danger ms-2">&#9660; ' . abs($percent) . '%</span>';
		}

		return '';
	}
}