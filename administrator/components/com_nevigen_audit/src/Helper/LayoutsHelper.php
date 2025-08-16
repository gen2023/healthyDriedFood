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
use Joomla\CMS\Layout\FileLayout;
use Joomla\Filesystem\Path;
use Joomla\Registry\Registry;

class LayoutsHelper
{

	/**
	 * Is site layout override check cache.
	 *
	 * @var  array|null
	 *
	 * @since  1.0.0
	 */
	protected static ?array $_siteOverride = null;

	/**
	 * Site layouts paths cache.
	 *
	 * @var  array|null
	 *
	 * @since  1.0.0
	 */
	protected static ?array $_sitePaths = null;

	/**
	 * Active site templates cache.
	 *
	 * @var  array|null
	 *
	 * @since  1.0.0
	 */
	protected static ?array $_siteTemplates = null;

	/**
	 * Is administrator layout override cache.
	 *
	 * @var  array|null
	 *
	 * @since  1.0.0
	 */
	protected static ?array $_administratorOverride = null;

	/**
	 * Administrator layouts paths cache.
	 *
	 * @var  array|null
	 *
	 * @since  1.0.0
	 */
	protected static ?array $_administratorPaths = null;

	/**
	 * Active administrator templates cache.
	 *
	 * @var  array|null
	 *
	 * @since  1.0.0
	 */
	protected static ?array $_administratorTemplates = null;

	/**
	 * Method to render site layout.
	 *
	 * @param   string  $layoutId     Dot separated path to the layout file, relative to base path.
	 * @param   mixed   $displayData  Array of properties available for use inside the layout file to build the displayed output
	 *
	 * @throws \Exception
	 *
	 * @return  string  The necessary HTML to display the layout.
	 *
	 * @since  1.0.0
	 */
	public static function renderSiteLayout(string $layoutId, $displayData = null): string
	{
		$result = '';
		if ($paths = self::getSiteLayoutsPaths())
		{
			$layout = new FileLayout($layoutId);
			$layout->setIncludePaths($paths);

			$result = $layout->render($displayData);
		}

		return $result;
	}

	/**
	 * Method to check exist site layout override.
	 *
	 * @param   string  $layoutId  Dot separated path to the layout file, relative to base path.
	 *
	 * @throws \Exception
	 *
	 * @return bool True if layout file override, False if not.
	 *
	 * @since 1.0.0
	 */
	public static function isSiteLayoutOverride(string $layoutId): bool
	{
		if (self::$_siteOverride === null)
		{
			self::$_siteOverride = [];
		}

		if (!isset(self::$_siteOverride[$layoutId]))
		{
			$layout    = str_replace('.', '/', $layoutId) . '.php';
			$templates = self::getSiteActiveTemplates();
			foreach ($templates as $template)
			{
				$file = Path::clean(JPATH_ROOT . '/templates/' . $template . '/html/layouts/' . $layout);
				if (is_file($file))
				{
					self::$_siteOverride[$layoutId] = true;

					return true;
				}
			}

			self::$_siteOverride[$layoutId] = false;
		}

		return self::$_siteOverride[$layoutId];
	}

	/**
	 * Get the site layouts paths.
	 *
	 * @throws \Exception
	 *
	 * @return  array Paths array.
	 *
	 * @since  1.0.0
	 */
	public static function getSiteLayoutsPaths(): array
	{
		if (self::$_sitePaths === null)
		{
			self::$_sitePaths = [];

			// Add templates path
			$templates = self::getSiteActiveTemplates();
			foreach ($templates as $template)
			{
				self::$_sitePaths[] = JPATH_ROOT . '/templates/' . $template . '/html/layouts';
			}

			// Add default path
			self::$_sitePaths[] = JPATH_ROOT . '/layouts';
		}

		return self::$_sitePaths;
	}

	/**
	 * Method to get all site active templates.
	 *
	 * @throws \Exception
	 *
	 * @return array Site active templates names array.
	 *
	 * @since 1.0.0
	 */
	public static function getSiteActiveTemplates(): array
	{
		if (self::$_siteTemplates === null)
		{
			self::$_siteTemplates = [];

			// Get site templates
			$templates = Factory::getApplication()->bootComponent('templates')->getMVCFactory()
				->createModel('Style', 'Administrator')->getSiteTemplates();
			foreach ($templates as $item)
			{
				if ((int) $item->home === 1)
				{
					// Add YOOtheme Pro Child template.
					if ($item->template === 'yootheme')
					{
						$params = new Registry($item->params);
						$config = new Registry($params->get('config'));
						$child  = $config->get('child_theme');
						if (!empty($child))
						{
							self::$_siteTemplates[] = $item->template . '_' . $child;
						}
					}

					// Add template
					self::$_siteTemplates[] = $item->template;

					// Add paret template
					if (!empty($item->parent))
					{
						self::$_siteTemplates[] = $item->parent;
					}

					break;
				}
			}

			// Add system template
			self::$_siteTemplates[] = 'system';
		}

		return self::$_siteTemplates;
	}

	/**
	 * Method to render administrator layout.
	 *
	 * @param   string  $layoutId     Dot separated path to the layout file, relative to base path.
	 * @param   mixed   $displayData  Array of properties available for use inside the layout file to build the displayed output
	 *
	 * @throws \Exception
	 *
	 * @return  string  The necessary HTML to display the layout.
	 *
	 * @since  1.0.0
	 */
	public static function renderAdministratorLayout(string $layoutId, $displayData = null): string
	{
		$result = '';
		if ($paths = self::getAdministratorLayoutsPaths())
		{
			$layout = new FileLayout($layoutId);
			$layout->setIncludePaths($paths);

			$result = $layout->render($displayData);
		}

		return $result;
	}

	/**
	 * Method to check exist administrator layout override.
	 *
	 * @param   string  $layoutId  Dot separated path to the layout file, relative to base path.
	 *
	 * @throws \Exception
	 *
	 * @return bool True if layout file override, False if not.
	 *
	 * @since 1.0.0
	 */
	public static function isAdministratorOverride(string $layoutId): bool
	{
		if (self::$_administratorOverride === null)
		{
			self::$_administratorOverride = [];
		}

		if (!isset(self::$_administratorOverride[$layoutId]))
		{
			$layout    = str_replace('.', '/', $layoutId) . '.php';
			$templates = self::getAdministratorActiveTemplates();
			foreach ($templates as $template)
			{
				$file = Path::clean(JPATH_ADMINISTRATOR . '/templates/' . $template . '/html/layouts/' . $layout);
				if (is_file($file))
				{
					self::$_administratorOverride[$layoutId] = true;

					return true;
				}
			}

			self::$_administratorOverride[$layoutId] = false;
		}

		return self::$_administratorOverride[$layoutId];
	}

	/**
	 * Get the site layouts paths.
	 *
	 * @throws \Exception
	 *
	 * @return  array Paths array.
	 *
	 * @since  1.0.0
	 */
	public static function getAdministratorLayoutsPaths(): array
	{
		if (self::$_administratorPaths === null)
		{
			self::$_administratorPaths = [];

			// Add templates path
			$templates = self::getAdministratorActiveTemplates();
			foreach ($templates as $template)
			{
				self::$_administratorPaths[] = JPATH_ADMINISTRATOR . '/templates/' . $template . '/html/layouts';
			}

			// Add default path
			self::$_administratorPaths[] = JPATH_ROOT . '/layouts';
		}

		return self::$_administratorPaths;
	}

	/**
	 * Method to get all admin active templates.
	 *
	 * @throws \Exception
	 *
	 * @return array Admin active templates names array.
	 *
	 * @since 1.0.0
	 */
	public static function getAdministratorActiveTemplates(): array
	{
		if (self::$_administratorTemplates === null)
		{
			self::$_administratorTemplates = [];

			// Get admin template
			$item = Factory::getApplication()->bootComponent('templates')->getMVCFactory()
				->createModel('Style', 'Administrator')->getAdminTemplate(0);

			// Add template
			self::$_administratorTemplates[] = $item->template;

			// Add parent
			if (!empty($item->parent))
			{
				self::$_administratorTemplates[] = $item->parent;
			}
		}

		return self::$_administratorTemplates;
	}
}