<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\Utilities\ArrayHelper;

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
 * @var  string  $selector       Field selector key.
 * @var  array   $links          Field links array.
 * @var  array   $titles         Field modal title array.
 * @var  array   $functions      Field set value function.
 * @var  string  $language       Language filer.
 * @var  string  $currency       Currency filer.
 * @var  string  $tasksPrefix    Form tasks prefix.
 * @var  bool    $image          Need load image.
 * @var  bool    $icons          Display only icons in buttons.
 * @var  array   $buttons        Buttons array.
 * @var  string  $onload         Onload attribute for the field.
 * @var  bool    $dynamic        Dynamic replace selector.
 * @var  string  $iconSelect     Icon select.
 */

/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
$assets = Factory::getApplication()->getDocument()->getWebAssetManager();
$assets->getRegistry()->addExtensionRegistryFile('com_nevigen_audit');
$assets->useScript('com_nevigen_audit.fields.modal');

$id = $id . '_' . $selector;

// Prepare title field
$attributes = [
	'type'                      => 'text',
	'id'                        => $id . '_title',
	'value'                     => '',
	'class'                     => (!empty($class)) ? $class . ' form-control' : 'form-control',
	'nevigen-audit-field-modal' => 'title',
	'readonly'                  => '',
	'placeholder'               => Text::_($hint),
];
?>
<div nevigen-audit-field-modal="container" data-selector="<?php echo $selector; ?>"
	 data-dynamic="<?php echo (!empty($dynamic)) ? 'true' : 'false'; ?>"
	<?php if (!empty($links['data'])) echo 'data-get="' . $links['data'] . '"'; ?>>
	<div class="input-group">
		<?php if ($image)
		{
			echo HTMLHelper::image('com_nevigen_audit/no-image.svg', null, [
				'nevigen-audit-field-modal' => 'image',
				'data-noimage'              => HTMLHelper::image('com_nevigen_audit/no-image.svg', null, [], true, 1),
				'class'                     => 'me-1',
				'style'                     => 'height: 42px; width:auto;',
			], true);
		} ?>

		<input <?php echo ArrayHelper::toString($attributes); ?>/>
		<?php if (!$readonly): ?>
			<?php if (!empty($links['select']) && in_array('select', $buttons)): ?>
				<button id="<?php echo $id . '_button_select'; ?>" class="btn btn-outline-primary" type="button"
						title="<?php echo Text::_('JSELECT'); ?>"
						data-bs-toggle="modal" data-bs-target="<?php echo '#' . $id . '_modal_select'; ?>"
						nevigen-audit-field-modal="button_select"
						style="display: none">
					<?php echo '<span class="' . $iconSelect . '" aria-hidden="true"></span>';
					if (!$icons)
					{
						echo ' ' . Text::_('JSELECT');
					} ?>
				</button>
			<?php endif; ?>

			<?php if (!empty($links['create']) && in_array('create', $buttons)): ?>
				<button id="<?php echo $id . '_button_create'; ?>" class="btn btn-outline-success" type="button"
						title="<?php echo Text::_('JACTION_CREATE'); ?>"
						data-bs-toggle="modal" data-bs-target="<?php echo '#' . $id . '_modal_create'; ?>"
						nevigen-audit-field-modal="button_create"
						style="display: none">
					<?php echo '<span class="icon-plus" aria-hidden="true"></span>';
					if (!$icons)
					{
						echo ' ' . Text::_('JACTION_CREATE');
					} ?>
				</button>
			<?php endif; ?>

			<?php if (!empty($links['edit']) && in_array('edit', $buttons)): ?>
				<button id="<?php echo $id . '_button_edit'; ?>" class="btn btn-outline-primary" type="button"
						title="<?php echo Text::_('JACTION_EDIT'); ?>"
						data-bs-toggle="modal" data-bs-target="<?php echo '#' . $id . '_modal_edit'; ?>"
						nevigen-audit-field-modal="button_edit"
						style="display: none">
					<?php echo '<span class="icon-pen-square" aria-hidden="true"></span>';
					if (!$icons)
					{
						echo ' ' . Text::_('JACTION_EDIT');
					} ?>
				</button>
			<?php endif; ?>
			<?php if (in_array('clear', $buttons)): ?>
				<button id="<?php echo $id . '_button_clear'; ?>" class="btn btn-outline-danger" type="button"
						onclick="window.NevigenAuditFieldModal.setValue('<?php echo $selector; ?>')"
						title="<?php echo Text::_('JCLEAR'); ?>"
						nevigen-audit-field-modal="button_clear"
						style="display: none">
					<?php echo '<span class="icon-times" aria-hidden="true"></span>';
					if (!$icons)
					{
						echo ' ' . Text::_('JCLEAR');
					} ?>
				</button>
			<?php endif; ?>
		<?php endif; ?>
	</div>
	<?php if (!$readonly)
	{
		if (!empty($links['select']) && in_array('select', $buttons))
		{
			echo LayoutHelper::render('libraries.html.bootstrap.modal.main', [
				'selector' => $id . '_modal_select',
				'params'   => [
					'title'      => $titles['select'],
					'url'        => $links['select'],
					'height'     => '400px',
					'width'      => '800px',
					'bodyHeight' => 70,
					'modalWidth' => 80,
					'footer'     => '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">'
						. Text::_('JLIB_HTML_BEHAVIOR_CLOSE') . '</button>',
				],
				'body'     => ''
			]);
		}

		if (!empty($links['create']) && in_array('create', $buttons))
		{
			$buttonsAttributes = (empty($functions['create'])) ? '' : ArrayHelper::toString([
				'data-task_prefix' => $tasksPrefix,
				'data-selector'    => $selector,
				'data-modal_id'    => $id . '_modal_create',
				'data-form_id'     => 'adminForm',
				'data-field_id'    => 'jform_id',
				'onclick'          => 'window.' . $functions['create'] . '(this); return false;',
				'type'             => 'button',
			]);

			echo LayoutHelper::render('libraries.html.bootstrap.modal.main', [
				'selector' => $id . '_modal_create',
				'params'   => [
					'title'      => $titles['create'],
					'url'        => $links['create'],
					'height'     => '400px',
					'width'      => '800px',
					'bodyHeight' => 70,
					'modalWidth' => 80,
					'footer'     => (empty($functions['create']))
						? '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">'
						. Text::_('JLIB_HTML_BEHAVIOR_CLOSE') . '</button>'

						: '<button class="btn btn-secondary" data-task="cancel" ' . $buttonsAttributes . '>' .
						Text::_('JLIB_HTML_BEHAVIOR_CLOSE') . '</button>'

						. '<button class="btn btn-primary" data-task="save" ' . $buttonsAttributes . '>' .
						Text::_('JSAVE') . '</button>'

						. '<button class="btn btn-success" data-task="apply" ' . $buttonsAttributes . '>' .
						Text::_('JAPPLY') . '</button>'
				],
				'body'     => ''
			]);
		}

		if (!empty($links['edit']) && in_array('edit', $buttons))
		{
			$buttonsAttributes = (empty($functions['edit'])) ? '' : ArrayHelper::toString([
				'data-task_prefix' => $tasksPrefix,
				'data-selector'    => $selector,
				'data-modal_id'    => $id . '_modal_edit',
				'data-form_id'     => 'adminForm',
				'data-field_id'    => 'jform_id',
				'onclick'          => 'window.' . $functions['edit'] . '(this); return false;',
				'type'             => 'button',
			]);

			echo LayoutHelper::render('libraries.html.bootstrap.modal.main', [
				'selector' => $id . '_modal_edit',
				'params'   => [
					'title'      => $titles['edit'],
					'url'        => $links['edit'],
					'height'     => '400px',
					'width'      => '800px',
					'bodyHeight' => 70,
					'modalWidth' => 80,
					'footer'     => (empty($functions['edit']))
						? '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">'
						. Text::_('JLIB_HTML_BEHAVIOR_CLOSE') . '</button>'

						: '<button class="btn btn-secondary" data-task="cancel" ' . $buttonsAttributes . '>' .
						Text::_('JLIB_HTML_BEHAVIOR_CLOSE') . '</button>'

						. '<button class="btn btn-primary" data-task="save" ' . $buttonsAttributes . '>' .
						Text::_('JSAVE') . '</button>'

						. '<button class="btn btn-success" data-task="apply" ' . $buttonsAttributes . '>' .
						Text::_('JAPPLY') . '</button>'
				],
				'body'     => ''
			]);
		}
	} ?>
	<input id="<?php echo $id . '_id' ?>" type="hidden" nevigen-audit-field-modal="id" name="<?php echo $name; ?>"
		   value="<?php echo $value; ?>" <?php if (!empty($onchange)) echo ' onchange="' . $onchange . '"'; ?>
		<?php if (!empty($onload)) echo ' onload="' . $onload . '"'; ?>>
</div>