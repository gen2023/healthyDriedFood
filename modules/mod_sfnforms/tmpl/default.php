<?php

defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
?>
<?php $class_auto = $auto_width ? ' mod-sfnforms-width-auto' : ""; ?>
<?php $class_form = $moduleclass_sfx ? $moduleclass_sfx : ""; ?>

<div id="mod-sfnforms-container-<?= $uniqid; ?>" class="sfnforms">
	<form id="mod-sfnforms-contact-form-<?= $uniqid; ?>" name="mod-sfnforms-contact-form-<?= $uniqid; ?>"
		enctype="multipart/form-data" method="post" action="<?php echo modSFNFormsHelper::cleanInput(Uri::current()); ?>"
		class="<?= $class_form ?>">
		<fieldset>
			<?php echo HTMLHelper::_('form.token'); ?>
			<input type="hidden" name="mod_sfnforms_module_id" value="<?php echo $module->id; ?>" />
			<input type="hidden" name="mod_sfnforms_module_name"
				value="<?php echo modSFNFormsHelper::cleanInput($module->title); ?>" />
			<input type="text" name="mod_sfnforms_nospam" value="valid-user" class="mod_sfnforms-nospan" required>

			<?php if ($form_pre_text) { ?>
				<div class="mod-sfnforms-pre-text">
					<?php echo $form_pre_text; ?>
				</div>
			<?php } ?>

			<?php require ModuleHelper::getLayoutPath('mod_sfnforms', 'default_field'); ?>

			<?php if ($show_send_copy_to_self) { ?>
				<div class="control-group">
					<div class="controls">
						<label for="mod-sfnforms-selfcopy-<?= $uniqid; ?>" class="checkbox">
							<input type="checkbox" name="mod_sfnforms_selfcopy" id="mod-sfnforms-selfcopy-<?= $uniqid; ?>" value="1">
							<?php echo Text::_('MOD_SFNFORMS_SEND_COPY_FRONT'); ?>
						</label>
					</div>
				</div>
			<?php } ?>

			<?php if ($show_display_consent) { ?>
				<div class="control-group">
					<div class="controls">
						<label for="mod-sfnforms-display-consent-<?= $uniqid; ?>" class="checkbox">
							<input type="checkbox" name="mod_sfnforms_display_consent" id="mod-sfnforms-display-consent-<?= $uniqid; ?>"
								value="1">
							<?= $consent_text; ?>
						</label>
					</div>
				</div>
			<?php } ?>

			<?php if ($show_captcha) { ?>
				<div class="control-group">
					<div class="controls">
						<?php if (!$rez = modSFNFormsHelper::captchaGenerate('onDisplay', '', $uniqid)) { ?>
							<div class="alert alert-error alert-danger">
								<?php echo Text::_('MOD_SFNFORMS_CAPTCHA_ERROR_SETUP'); ?>
							</div>
						<?php } else {
							echo $rez;
						} ?>
					</div>
				</div>
			<?php } ?>

			<div class="control-group" id="mod-sfnforms-error-msg-<?= $uniqid; ?>" style="display:none"></div>

			<?php
			foreach ($array_fields as $key => $value) {
				if ($value->type_input == 'hidden') {
					$field_value = $value->field_value ? $value->field_value : '';
					$class = $value->field_class_name ? $value->field_class_name : '';

					?>
					<input type="hidden" class="ignore <?= $class ?>" name="mod_sfnforms_<?= $value->field_name; ?>-<?= $uniqid; ?>"
						id="mod-sfnforms-<?= $value->field_name; ?>-<?= $uniqid; ?>" value="<?= $field_value ?>" />
				<?php }
			}

			?>

			<div class="controls">
				<button type="submit" id="mod-sfnforms-submit-btn-<?= $uniqid; ?>"
					name="mod_sfnforms_submit-btn-<?= $uniqid; ?>" class="btn btn-primary submit">
					<span class="icon icon-envelope"></span> <?php echo Text::_('MOD_SFNFORMS_SUBMIT_LABEL'); ?>
				</button>
			</div>

			<?php if ($form_post_text) { ?>
				<div class="mod-sfnforms-post-text">
					<?php echo $form_post_text; ?>
				</div>
			<?php } ?>
		</fieldset>
	</form>
	<div id="mod-sfnforms-msg-<?= $uniqid; ?>" style="display:none"></div>
	<div id="mod-sfnforms-warning-msg-<?= $uniqid; ?>" style="display:none"></div>
	<?php
	if ($thank_you_modal) { ?>
		<div id="mod-sfnforms-modal-<?= $uniqid; ?>" class="mod_sfnforms-modal" style="display:none">
			<div class="mod-sfnforms-modal__container">
				<div class="close-btn">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>
				<div class="message-container"></div>
			</div>
		</div>
	<?php } ?>
</div>