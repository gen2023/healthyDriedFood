<?php

/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Dispatcher;

\defined('_JEXEC') or die;

use Joomla\CMS\Dispatcher\ComponentDispatcher;
use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\Component\NevigenAudit\Administrator\Traits\ClassMapTrait;

class Dispatcher extends ComponentDispatcher
{
	use ClassMapTrait;

	/**
	 * The URL option for the component.
	 *
	 * @var    string
	 *
	 * @since  1.0.0
	 */
	protected $option = 'com_nevigen_audit';

	/**
	 * Get a controller from the component
	 *
	 * @param   string  $name    Controller name
	 * @param   string  $client  Optional client (like Administrator, Site etc.)
	 * @param   array   $config  Optional controller config
	 *
	 * @return  BaseController
	 *
	 * @since   1.0.0
	 */
	public function getController(string $name, string $client = '', array $config = []): BaseController
	{
		return parent::getController($this->fixClassName($name), $client, $config);
	}
}
