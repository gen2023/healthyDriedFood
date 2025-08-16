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
use Joomla\Database\DatabaseDriver;

trait StaticDatabaseTrait
{
	/**
	 * Get the database.
	 *
	 * @return  DatabaseDriver DatabaseInterface object
	 *
	 * @since   1.0.0
	 */
	protected static function getDatabase(): DatabaseDriver
	{
		return Factory::getContainer()->get(DatabaseDriver::class);
	}
}