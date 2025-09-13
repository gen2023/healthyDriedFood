<?php

defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Filter\OutputFilter;
use Joomla\CMS\Language\Text;

?>

<?php foreach ($array_fields as $key => $value) {
	if ($value->type_input != 'hidden') {
		$attr = '';
		$class = '';
		$classBlock = $value->field_class_name ? $value->field_class_name : '';

		if ($value->field_required) {
			$placeholder = $value->field_placeholder ? 'placeholder="' . htmlspecialchars($value->field_placeholder) . ' ' . $required_marker . '"' : '';
			$textLabel = htmlspecialchars($value->field_label) . '<span class="help-inline">' . $required_marker . '</span>';
		} else {
			$placeholder = $value->field_placeholder ? 'placeholder="' . htmlspecialchars($value->field_placeholder) . '"' : '';
			$textLabel = htmlspecialchars($value->field_label);
		}

		if ($value->field_validate) {
			switch ($value->field_validate_option) {
				case 'validNumber':
					$attr .= ' data-validtype="number"';
					break;
				case 'validText':
					$attr .= ' data-validtype="validText"';
					break;
				case 'validTextNumber':
					$attr .= ' data-validtype="validTextNumber"';
					break;
			}
			$attr .= isset($value->input_len_min) && $value->input_len_min !== '' ? ' data-min="' . (int) $value->input_len_min . '"' : '';
			$attr .= isset($value->input_len_max) && $value->input_len_max !== '' ? ' data-max="' . (int) $value->input_len_max . '"' : '';
		}

		$class = $value->field_required ? 'required' : ($value->field_validate ? 'valid' : 'ignore');
		$class .= isset($class_auto) ? ' ' . htmlspecialchars($class_auto) : '';

		?>

		<div class="control-group <?= $classBlock ?>">
			<?php if ($value->field_label) { ?>
				<label for="mod-sfnforms-<?= $value->field_name; ?>-<?= $uniqid; ?>" class="control-label">
					<?= $textLabel; ?>
				</label>
			<?php } ?>
			<div class="controls">
				<?php switch ($value->type_input) {
					case "text": ?>
						<input type="text" name="mod_sfnforms_<?= $value->field_name; ?>"
							id="mod-sfnforms-<?= $value->field_name; ?>-<?= $uniqid; ?>" value="" class="<?php echo $class; ?>"
							<?= $placeholder; ?> <?php echo $attr; ?> />
						<?php break; ?>

					<?php case "number": ?>
						<input type="number" name="mod_sfnforms_<?= $value->field_name; ?>"
							id="mod-sfnforms-<?= $value->field_name; ?>-<?= $uniqid; ?>" value="" class="<?php echo $class; ?>"
							<?= $placeholder; ?> />
						<?php break; ?>

					<?php case "email": ?>
						<input type="email" name="mod_sfnforms_<?= $value->field_name; ?>"
							id="mod-sfnforms-<?= $value->field_name; ?>-<?= $uniqid; ?>" value="" class="<?php echo $class; ?>"
							<?= $placeholder; ?> />
						<?php break; ?>

					<?php case "textarea": ?>
						<textarea rows="5" name="mod_sfnforms_<?= $value->field_name; ?>"
							id="mod-sfnforms-<?= $value->field_name; ?>-<?= $uniqid; ?>" class="<?php echo $class; ?>" <?= $placeholder; ?>
							<?php echo $attr; ?>></textarea>
						<?php break; ?>

					<?php case "tel": ?>
						<?php if ($value->field_validate) {
							if ($value->field_validate_option != 'min_max' && $value->field_validate_option != 'validNumber')
								$attr .= 'data-validPhone="' . $value->field_validate_option . '"';
						} ?>

						<input type="tel" name="mod_sfnforms_<?= $value->field_name; ?>"
							id="mod-sfnforms-<?= $value->field_name; ?>-<?= $uniqid; ?>" value="" class="<?php echo $class; ?>"
							<?= $placeholder; ?> 				<?php echo $attr; ?> />
						<?php break; ?>

					<?php case "select":
						if ($value->list_block) {
							if (is_string($value->list_block)) {
								$options = modSFNFormsHelper::split($value->list_block);
							}
							if ($value->field_required) {

								if (!empty($value->field_placeholder)) {
									$default_select = $value->field_placeholder . $required_marker;
								} else {
									$default_select = Text::_('MOD_SFNFORMS_SELECT') . $required_marker;
								}
							} else {
								$default_select = !empty($value->field_placeholder) ? $value->field_placeholder : Text::_('MOD_SFNFORMS_SELECT');
							}

							$data_subject[] = HTMLHelper::_('select.option', "", $default_select);
							foreach ($options as $input) {
								$data_subject[] = HTMLHelper::_('select.option', $input, $input);
							}
							echo HTMLHelper::_('select.genericlist', $data_subject, 'mod_sfnforms_' . $value->field_name, array('class' => $class), 'value', 'text', null, 'mod-sfnforms-' . $value->field_name . '-' . $uniqid);

						} else { ?>
							<div class="alert alert-error alert-danger">
								<?= Text::sprintf('MOD_SFNFORMS_INPUT_ERROR', $value->field_name); ?>
							</div>
						<?php }
						break;
						?>

					<?php case "radio":
						if ($value->list_block) {
							if (is_string($value->list_block)) {
								$options = modSFNFormsHelper::split($value->list_block);
							}

							foreach ($options as $option) {
								$id = 'mod-sfnforms-' . $value->field_name . '-' . OutputFilter::stringURLSafe($option) . '-' . $uniqid; ?>
								<label for="<?php echo $id; ?>" class="radio">
									<input type="radio" class="<?php echo $class; ?>" id="<?php echo $id; ?>"
										name="<?php echo 'mod_sfnforms_' . $value->field_name; ?>"
										value="<?php echo $option; ?>" /><?php echo $option; ?>
								</label>
							<?php } ?>

							<label for="mod_sfnforms_<?= $value->field_name ?>" class="mod-sfnforms-error" style="display: none;"></label>
						<?php } else { ?>
							<div class="alert alert-error alert-danger">
								<?= Text::sprintf('MOD_SFNFORMS_INPUT_ERROR', $value->field_name); ?>
							</div>
						<?php }
						break; ?>

					<?php case "checkbox":
						if ($value->list_block) {
							if (is_string($value->list_block)) {
								$options = modSFNFormsHelper::split($value->list_block);
							}

							foreach ($options as $option) {
								$id = 'mod-sfnforms-' . $value->field_name . '-' . OutputFilter::stringURLSafe($option) . '-' . $uniqid; ?>
								<label for="<?php echo $id; ?>" class="checkbox">
									<input type="checkbox" class="<?php echo $class; ?>" id="<?php echo $id; ?>"
										name="<?php echo 'mod_sfnforms_' . $value->field_name; ?>[]"
										value="<?php echo $option; ?>" /><?php echo $option; ?>
								</label>
							<?php } ?>
							<label for="mod_sfnforms_<?= $value->field_name ?>[]" class="mod-sfnforms-error" style="display: none;"></label>

						<?php } else { ?>
							<div class="alert alert-error alert-danger">
								<?= Text::sprintf('MOD_SFNFORMS_INPUT_ERROR', $value->field_name); ?>
							</div>
						<?php }
						break;
				} ?>
			</div>
		</div>
	<?php }
} ?>