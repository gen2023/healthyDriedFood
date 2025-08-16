<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Installer\Installer;
use Joomla\CMS\Table\Extension;

$table    = new Extension(Factory::getContainer()->get('DatabaseDriver'));
$id    = $table->find([
	'type' => 'package',
	'element' => 'pkg_nevigen_jshop_novaposhta'
]);


if ($id) Installer::getInstance()->uninstall('package', $id);
