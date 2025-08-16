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

use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;

\defined('_JEXEC') or die;

trait ClassMapTrait
{
	/**
	 * Correct class names.
	 *
	 * @var array
	 *
	 * @since 1.0.0
	 */
	protected array $classMap = [

	];

	/**
	 * Method to fix class name case.
	 *
	 * @param $name string|null Source class name.
	 *
	 * @return string Correct class name.
	 *
	 * @since 1.0.0
	 */
	protected function fixClassName(string $name = null): string
	{
		if (empty($name))
		{
			return $name;
		}
		// Trigger `onNevigenAuditAdministratorClassMap` event
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditAdministratorClassMap',
			[&$this->classMap]);

		if (isset($this->classMap[$name]))
		{
			$name = $this->classMap[$name];
		}

		return $name;
	}
}