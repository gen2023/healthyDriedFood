<?php
defined('_JEXEC') or die;
use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;

$setkalist = $this->paramsPlg['setkalist'];
$options = $this->optionsName;

?>
<div class="fields-tab tab-pane fade" id="fields" role="tabpanel" aria-labelledby="fields-tab">

  <fieldset class="adminform">
    <legend><?php echo Text::_('Дані замовлення для відправки'); ?></legend>

<?php
    foreach ($options as $field => $label) {
      $checked = !empty($this->paramsPlg[$field]); ?>
      <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" name="<?= $field ?>" id="<?= $field ?>" value="1" <?= $checked ? 'checked' : '' ?>>
        <label class="form-check-label" for="<?= $field ?>"><?= Text::_($label) ?></label>
      </div>
    <?php } ?>
  </fieldset>
</div>