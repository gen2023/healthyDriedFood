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
use Joomla\CMS\Factory;
use Joomla\CMS\Language\LanguageFactoryInterface;
use Joomla\CMS\Language\LanguageHelper;

class LanguagesHelper
{
	/**
	 * Method to change current language.
	 *
	 * @param   string|null  $tag  Language tag.
	 *
	 * @throws \Exception
	 *
	 * @return array Change data array ['old'=> 'TAG', 'new'=>'TAG']
	 *
	 * @since 1.0.0
	 */
	public static function changeLanguage(?string $tag = null): array
	{
		$app      = Factory::getApplication();
		$language = $app->getLanguage();
		$current  = $language->getTag();

		$languages = [];
		foreach (LanguageHelper::getInstalledLanguages() as $clientLanguages)
		{
			$languages = array_merge($languages, array_keys($clientLanguages));
		}
		$languages = array_unique($languages);

		if (empty($tag) || $tag === $current || !in_array($tag, $languages))
		{
			return [
				'old' => $current,
				'new' => $current
			];
		}

		$extensions = array_keys($language->getPaths());
		if (isset(Factory::$language))
		{
			$extensions = array_unique(array_merge($extensions, array_keys(Factory::getLanguage()->getPaths())));
		}

		$reloadLanguage = (method_exists($app, 'loadLanguage'));
		$newLanguage    = Factory::getContainer()->get(LanguageFactoryInterface::class)->createLanguage($tag);
		foreach ($extensions as $extension)
		{
			// Get base Path
			$basePath = ($app->isClient('site')) ? JPATH_ROOT : JPATH_ADMINISTRATOR;
			if (strpos($extension, 'plg_') !== false)
			{
				$basePath = JPATH_ADMINISTRATOR;
			}

			// Load language
			$newLanguage->load($extension, $basePath, $tag, true);

			// Load to language
			if (!$reloadLanguage)
			{
				$language->load($extension, $basePath, $tag, true);
			}
		}

		// Reload language
		if ($reloadLanguage)
		{
			$app->loadLanguage($newLanguage);
		}

		if (isset(Factory::$language))
		{
			Factory::$language = $newLanguage;
		}

		return [
			'old' => $current,
			'new' => $tag
		];
	}


	/**
	 * Method to get user language tag.
	 *
	 * @param   string|null  $client  Site client string.
	 *
	 * @throws \Exception
	 *
	 * @return string Default language tag.
	 *
	 * @since 1.0.0
	 */
	public static function getDefaultTag(?string $client = null): string
	{
		if (empty($client))
		{
			$client = Factory::getApplication()->getName();
		}

		$path = ($client === 'site') ? 'site' : 'administrator';

		return ComponentHelper::getParams('com_languages')->get($path, 'en-GB');
	}
}