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

use Joomla\CMS\Application\AdministratorApplication;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Form\FormFactoryInterface;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\Table\Extension;

/** @var AdministratorApplication $app */
$app = Factory::getContainer()->get(AdministratorApplication::class);

$app->getLanguage()->load('addon_nevigen_novaposhta', JPATH_SITE);

// Get Form;
/* @var $form Form */
$form = Factory::getContainer()->get(FormFactoryInterface::class)->createForm('nevigen_novaposhta',
	['control' => 'params']);
$form->loadFile(__DIR__ . '/config.xml');


if (!empty($this->params))
{
	foreach ($this->params as $name => $value)
	{

		$form->setValue($name, '', $value);
	}
}


// Check plugin nevigen novaposhta
if (!PluginHelper::isEnabled('jshopping', 'nevigen_novaposhta'))
{
	$table    = new Extension(Factory::getContainer()->get(\Joomla\Database\DatabaseDriver::class));
	$id    = $table->find([
		'type'    => 'plugin',
		'folder'  => 'jshopping',
		'element' => 'nevigen_novaposhta'
	]);

	$url = 'index.php?option=com_plugins&task=plugin.edit&extension_id=' . $id;
	$app->enqueueMessage(Text::sprintf('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_PLUGIN', $url),
		'error');
}


?>
<section id="content" class="content">
	<div class="row">
		<div class="col-md">
			<div class="main-card p-2">
				<fieldset class="options-form">
					<legend><?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_SETTING'); ?></legend>
					<div>
						<?php echo $form->renderFieldset('main'); ?>
					</div>
				</fieldset>
			</div>
		</div>
		<div class="col-md">
			<div class="main-card p-2">
				<fieldset class="options-form">
					<legend><?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_SETTING_SENDER'); ?></legend>
					<div>
						<?php echo $form->renderFieldset('sender'); ?>
					</div>
				</fieldset>
			</div>
		</div>
	</div>
</section>
