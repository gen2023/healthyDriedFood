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

trait ContextModelTrait
{
	/**
	 * Method to set Model context.
	 *
	 * @param   string|null  $context  Context selector string.
	 *
	 * @throws \Exception
	 *
	 * @since 1.0.0
	 */
	public function setContext(?string $context = null)
	{
		if (!property_exists($this, 'context'))
		{
			$this->context = '';
		}

		if (empty($context))
		{
			$context = 'com_nevigen_audit.' . $this->getName();
		}

		$this->context = $context;
	}
}