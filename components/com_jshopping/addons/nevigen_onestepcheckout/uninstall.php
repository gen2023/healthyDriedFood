<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
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
$id    = $table->find(array('type' => 'package', 'element' => 'pkg_nevigen_jshop_onestepcheckout'));


if ($id) Installer::getInstance()->uninstall('package', $id);
