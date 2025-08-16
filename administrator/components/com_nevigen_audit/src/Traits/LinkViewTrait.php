<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Traits;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Router\Route;

trait LinkViewTrait
{
	/**
	 * Method to get canonical administrator view link.
	 *
	 * @param   string|null  $link    Source view link
	 * @param   array        $params  Addition url get params.
	 *
	 * @throws \Exception
	 *
	 * @return string Canonical link.
	 *
	 * @since 1.0.0
	 */
	protected function getLink(string $link = null, array $params = []): string
	{
		$app = Factory::getApplication();
		if (empty($link))
		{
			$link = 'index.php?option=' . $app->input->getCmd('option')
				. '&view=' . $app->input->getCmd('view');
		}

		if (!empty($this->item) && !empty($this->item->id))
		{
			$link .= '&id=' . $this->item->id;
		}

		if (empty($params))
		{
			$params = [
				'tmpl'           => null,
				'layout'         => null,
				'params'         => null,
				'forcedLanguage' => null,
				'selector'       => null,
				'function'       => null
			];
		}

		foreach ($params as $name => $value)
		{
			if ($value === null)
			{
				$value = null;
				if ($name === 'layout')
				{
					$layout = $this->getLayout();
					if (!empty($layout) && $layout !== 'default')
					{
						$value = $layout;
					}
				}
				else
				{
					$value = $app->input->get($name, '', 'text');
				}

			}

			if (!empty($value))
			{
				$link .= '&' . $name . '=' . $value;
			}
		}

		return Route::_($link);
	}
}