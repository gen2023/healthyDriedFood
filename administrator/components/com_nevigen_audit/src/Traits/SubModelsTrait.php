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

trait SubModelsTrait
{
	/**
	 * Sub models cache.
	 *
	 * @var array|null
	 *
	 * @since 1.0.0
	 */
	protected ?array $_subModels = null;

	/**
	 * Method to get sub model.
	 *
	 * @param   string|null  $name    The model name.
	 * @param   string|null  $prefix  The class prefix.
	 * @param   array        $config  The array of possible config values.
	 *
	 * @throws \Exception
	 *
	 * @return  \Joomla\CMS\MVC\Model\BaseDatabaseModel|false  A model object.
	 *
	 * @since  1.0.0
	 */
	public function getSubModel(string $name = null, string $prefix = null, array $config = ['ignore_request' => true]): \Joomla\CMS\MVC\Model\BaseDatabaseModel
	{
		if ($this->_subModels === null)
		{
			$this->_subModels = [];
		}

		$hash = md5(implode('_', [$name, $prefix, serialize($config)]));
		if (!isset($this->_subModels[$hash]))
		{
			$this->_subModels[$hash] = $this->getMVCFactory()->createModel($name, $prefix, $config);
		}

		return $this->_subModels[$hash];
	}
}