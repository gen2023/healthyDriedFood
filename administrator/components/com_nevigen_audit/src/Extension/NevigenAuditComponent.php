<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Extension;

\defined('JPATH_PLATFORM') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Component\Router\RouterServiceInterface;
use Joomla\CMS\Component\Router\RouterServiceTrait;
use Joomla\CMS\Extension\BootableExtensionInterface;
use Joomla\CMS\Extension\MVCComponent;
use Joomla\CMS\HTML\HTMLRegistryAwareTrait;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Component\NevigenAudit\Administrator\Service\HTML\NevigenUsers;
use Psr\Container\ContainerInterface;

class NevigenAuditComponent extends MVCComponent implements
	BootableExtensionInterface, RouterServiceInterface
{
	use HTMLRegistryAwareTrait;
	use RouterServiceTrait;

	/**
	 * Booting the extension. This is the function to set up the environment of the extension like
	 * registering new class loaders, etc.
	 *
	 * @param   ContainerInterface  $container  The container
	 *
	 * @since 1.0.0
	 */
	public function boot(ContainerInterface $container)
	{
		if (!ComponentHelper::isEnabled('com_jshopping'))
		{
			throw new \Exception('com_jshopping not found', 404);
		}

		if (!class_exists('JSFactory')){
			$bootstrap = JPATH_ROOT.'/components/com_jshopping/bootstrap.php';
			if (is_file($bootstrap))
			{
				include_once($bootstrap);
			}
		}

		$this->getRegistry()->register('nevigenUsers', new NevigenUsers());

		PluginHelper::importPlugin('nevigen_audit');
	}
}
