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

use Joomla\CMS\Application\AdministratorApplication;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Form\FormFactoryInterface;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\Table\Extension;

/** @var AdministratorApplication $app */
$app = Factory::getContainer()->get(AdministratorApplication::class);

$app->getLanguage()->load('addon_nevigen_jshop_onestepcheckout', JPATH_SITE);

// Get Form;
/* @var $form Form */
$form = Factory::getContainer()->get(FormFactoryInterface::class)->createForm('nevigen_onestepcheckout',
	['control' => 'params']);
$form->loadFile(__DIR__ . '/config.xml');

$url  = '';
if (!empty($this->params))
{
	foreach ($this->params as $name => $value)
	{
		if (is_array($value) && $name !== 'fields_sorting')
		{
			foreach ($value as $vName => $val)
			{
				$form->setValue($vName, $name, $val);
			}
		}
		else
		{
			$form->setValue($name, '', $value);
		}

	}
}

// Check plugin nevigen jshop_onestepcheckout
if (!PluginHelper::isEnabled('system', 'nevigen_jshop_onestepcheckout'))
{
	$table = new Extension(Factory::getContainer()->get(\Joomla\Database\DatabaseDriver::class));
	$id    = $table->find([
		'type'    => 'plugin',
		'folder'  => 'system',
		'element' => 'nevigen_jshop_onestepcheckout'
	]);

	$url  = 'index.php?option=com_plugins&task=plugin.edit&extension_id=' . $id;
}

?>
<section id="content" class="content">
	<div class="main-card p-2">
		<?php echo HTMLHelper::_('uitab.startTabSet', 'myTab',
			['active' => 'main', 'recall' => true, 'breakpoint' => 768]); ?>
		<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'main',
			Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_TAB_MAIN')); ?>
		<div class="row">
			<?php foreach (['main', 'finish'] as $name): ?>
				<div class="col-md">
					<fieldset class="options-form">
						<legend><?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_TAB_' . $name); ?></legend>
						<div>
							<?php echo $form->renderFieldset($name); ?>
						</div>
					</fieldset>
				</div>
			<?php endforeach; ?>
		</div>
		<?php echo HTMLHelper::_('uitab.endTab'); ?>
		<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'fields_sorting',
			Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_TAB_FIELDS_SORTING')); ?>
		<fieldset class="options-form">
			<legend><?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_TAB_' . $name); ?></legend>
			<div>
				<?php echo $form->renderFieldset('fields_sorting'); ?>
			</div>
		</fieldset>
		<?php echo HTMLHelper::_('uitab.endTab'); ?>
		<?php echo HTMLHelper::_('uitab.endTabSet'); ?>
	</div>
</section>