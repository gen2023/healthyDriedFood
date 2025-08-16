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
use Joomla\CMS\Language\Text;

extract($displayData);

/**
 * Layout variables
 * -----------------
 * @var   string $id     DOM id of the field.
 * @var   string $name   Name of the input field.
 * @var   array  $fields Fields address jshop.
 * @var   array  $value  Value attribute of the field.
 */

/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
$assets         = Factory::getApplication()->getDocument()->getWebAssetManager();
$assetsRegistry = $assets->getRegistry();

$assetsRegistry->addExtensionRegistryFile('plg_system_nevigen_jshop_onestepcheckout');
$assets->usePreset('onestepcheckout.fields.sorting');

?>
<div class="container container-sm">
	<div class="row">
		<div class="col-md-6">
			<table class="table table-hover">
				<thead>
				<tr>
					<th></th>
					<th><?php echo Text::_('JSHOP_TITLE') ?></th>
					<th>
						<span data-uk-tooltip title="<?php echo Text::_('JSHOP_DISPLAY') ?>">
							<span class="icon-eye-open"></span> / <span class="icon-eye-close"></span>
					</th>
				</tr>
				</thead>
				<tbody data-nevigen-jshop-onestepcheckout-sorting="<?php echo $id; ?>">
				<?php foreach ($value as $key => $data):
					if (substr($key, 0, 2) == 'd_' || $key == 'privacy_statement')
					{
						continue;
					}
					$dKey = 'd_' . $key;
					$class = '';
					$d_class = '';
					?>
					<tr style="cursor: move">
						<td>
							<span class="icon-move"></span>
						</td>
						<td>
							<?php echo Text::_('JSHOP_FIELD_' . $key); ?>
							<input type="hidden" name="<?php echo $name; ?>[<?php echo $key; ?>]">
						</td>
						<td>
							<?php


							if (isset($fields[$key]))
							{
								if ((int)$fields[$key]['display'] === 1){
									$class = 'text-success';
								}
								if ((int)$fields[$key]['require'] === 1){
									$class = 'text-danger';
								}
							}
							if (isset($fields[$dKey])){
								if ((int)$fields[$dKey]['display'] === 1){
									$d_class = 'text-success';
								}
								if ((int)$fields[$dKey]['require'] === 1){
									$d_class = 'text-danger';
								}
							}
							echo '<span class="'.$class.'  icon-home fa-home"></span> ';
							echo ' <span class="'.$d_class.' icon-truck fa-truck"></span>';
							?>
						</td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
		</div>
		<div class="col-md-6">
			<div class="card bg-light mb-3">
				<div class="card-body">
					<p class="card-text">
						<span class="  icon-home fa-home"></span> - <?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDS_SORTING_BASE') ?>
					</p>
					<p class="card-text">
						<span class="icon-truck fa-truck"></span> - <?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDS_SORTING_DELIVERY') ?>
					</p>
					<p class="card-text">
						<span class="bg-danger d-inline-block" style="width: 16px;height: 16px"></span> - <?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDS_SORTING_REQUIRE') ?>
					</p>
					<p class="card-text">
						<span class="bg-success d-inline-block" style="width: 16px;height: 16px"></span> - <?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDS_SORTING_CHECK') ?>
					</p>
					<p class="card-text">
						<span class="bg-dark d-inline-block" style="width: 16px;height: 16px"></span> - <?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDS_SORTING_SIMPLE') ?>
					</p>
					<p class="card-text">
						<i class="icon-move"></i> - <?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDS_SORTING_MOVE') ?>
					</p>
					<hr/>
					<p class="card-text">
						<?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDS_SORTING_ASTERICS');?>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>


