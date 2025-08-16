<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

\defined('_JEXEC') or die;

extract($displayData);

/**
 * Layout variables
 * -----------------
 * @var   string $autocomplete   Autocomplete attribute for the field.
 * @var   bool   $autofocus      Is autofocus enabled?
 * @var   string $class          Classes for the input.
 * @var   string $description    Description of the field.
 * @var   bool   $disabled       Is this field disabled?
 * @var   string $group          Group the field belongs to. <fields> section in form XML.
 * @var   bool   $hidden         Is this field hidden in the form?
 * @var   string $hint           Placeholder for the field.
 * @var   string $id             DOM id of the field.
 * @var   string $label          Label of the field.
 * @var   string $labelclass     Classes to apply to the label.
 * @var   bool   $multiple       Does this field support multiple values?
 * @var   string $name           Name of the input field.
 * @var   string $onchange       Onchange attribute for the field.
 * @var   string $onclick        Onclick attribute for the field.
 * @var   string $pattern        Pattern (Reg Ex) of value of the form field.
 * @var   bool   $readonly       Is this field read only?
 * @var   bool   $repeat         Allows extensions to duplicate elements.
 * @var   bool   $required       Is this field required?
 * @var   int    $size           Size attribute of the input.
 * @var   bool   $spellcheck     Spellcheck state for the form field.
 * @var   string $validate       Validation rules to apply.
 * @var   array  $value          Value attribute of the field.
 * @var   array  $checkedOptions Options that will be set as checked.
 * @var   bool   $hasValue       Has this field a value assigned?
 * @var   array  $options        Options available for this field.
 *
 * Field specific variables
 * @var  array   $items          Statuses array.
 */
if (empty($items))
{
	return '';
}

/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
$assets = Factory::getApplication()->getDocument()->getWebAssetManager();
$assets->addInlineStyle('
.nvg-status-name{
color:var(--info);
}
.nvg-task-table-disabled .nvg-status-name{
color:var(--body-color)!important;
}');
$assets->addInlineScript("
document.addEventListener('DOMContentLoaded', function () {
		let changesTaskTable = document.querySelectorAll('[data-task-nvg-status-table-change]');
		if (changesTaskTable.length > 0) {
			changesTaskTable.forEach(function (field) {
				let tr = field.closest('tr');
				if (tr) {
					let current = field.getAttribute('data-task-nvg-status-table-change'),
						valid = '';
					if (current === 'days') {
						valid = tr.querySelector('[data-task-nvg-status-table-change=\"status\"]');
					}
					else {
						valid = tr.querySelector('[data-task-nvg-status-table-change=\"days\"]');
					}

					field.addEventListener('change', function (e) {
						if (field.value === '') {
							tr.classList.add('nvg-task-table-disabled');
						}
						else {
							if (valid.value !== '') {
								tr.classList.remove('nvg-task-table-disabled');
							}
						}
					});
				}
			});
		}
	});
");

?>
<div class="alert alert-primary">
	<h4 class="alert-heading">
		<?php echo Text::_('PLG_TASK_NEVIGEN_AUDIT_CHANGE_ORDER_STATUS_PARAMS_ALERT_TITLE');?>
	</h4>
	<?php echo Text::_('PLG_TASK_NEVIGEN_AUDIT_CHANGE_ORDER_STATUS_PARAMS_ALERT_DESC'); ?>
</div>
<table class="table">
	<tbody>
	<?php foreach ($items as $item):
		$nameField = $name . '[' . $item['id'] . ']';
		$valueField = (is_array($value) && isset($value[$item['id']])) ? $value[$item['id']] : '';
		$notification = (isset($valueField['notification'])) ? (int)$valueField['notification'] : 0;
		$classDisabled = (empty($valueField) || empty($valueField['days']) || empty($valueField['new'])) ? 'nvg-task-table-disabled' : '';
		?>
		<tr class="<?php echo $classDisabled;?>">
			<td class="align-middle">
				<div class="mt-4">
					<span class="fw-bold nvg-status-name"><?php echo $item['name']; ?></span>
					<span class="float-end nvg-status-name">
						<svg xmlns="http://www.w3.org/2000/svg" width="60" height="25" viewBox="0 0 100 50">
							<path d="M10 25 L90 25 M75 10 L90 25 L75 40" stroke="currentColor" stroke-width="4" fill="none"/>
						</svg>
					</span>
				</div>
			</td>
			<td class="align-bottom">
				<select name="<?php echo $nameField; ?>[new]" class="form-select"
				data-task-nvg-status-table-change="status">
					<option value=""><?php echo Text::_('JNONE'); ?></option>
					<?php foreach ($items as $option):
						if ($option['id'] == $item['id'])
						{
							continue;
						} ?>
						<option value="<?php echo $option['id']; ?>"
							<?php echo(!empty($valueField) && $valueField['new'] == $option['id'] ? 'selected' : ''); ?>>
							<?php echo $option['name']; ?>
						</option>
					<?php endforeach; ?>
				</select>
			</td>
			<td class="align-bottom" style="max-width: 120px">
				<div class="input-group">
					<input type="text" name="<?php echo $nameField; ?>[days]" class="form-control" placeholder="2"
						   value="<?php echo (!empty($valueField)) ? $valueField['days'] : ''; ?>"
						   data-task-nvg-status-table-change="days"/>
					<span class="input-group-text">
						<?php echo Text::_('PLG_TASK_NEVIGEN_AUDIT_CHANGE_ORDER_STATUS_PARAMS_DAYS'); ?>
					</span>
				</div>
			</td>
			<td class="align-bottom">
				<label>
					<?php echo Text::_('PLG_TASK_NEVIGEN_AUDIT_CHANGE_ORDER_STATUS_PARAMS_NOTIFICATION'); ?>
				</label>
				<select name="<?php echo $nameField; ?>[notification]" class="form-select">
					<option value="0" <?php echo ($notification === 0)? 'selected' : '';?>>
						<?php echo Text::_('JNO');?>
					</option>
					<option value="1" <?php echo ($notification === 1)? 'selected' : '';?>>
						<?php echo Text::_('JYES');?>
					</option>
				</select>
			</td>
		</tr>
	<?php endforeach; ?>
	</tbody>
</table>

