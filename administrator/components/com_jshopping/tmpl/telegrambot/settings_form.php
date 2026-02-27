<?php
defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;

$setkalist = $this->paramsPlg['setkalist'];
$options = $this->optionsName;
?>

<div class="tab-pane fade show active" id="form" role="tabpanel" aria-labelledby="form-tab">
  <div id="telegram-bots-container">
    <?php
    if (!empty($setkalist)) {
      $i = 0;
      foreach ($setkalist as $key => $bot) {
        $bot = (object) $bot;

        ?>
        <fieldset class="adminform telegram-bot-block" data-index="<?php echo $i; ?>">
          <legend><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_BOT'); ?> №<?= $i+1 ?></legend>

          <div class="control-group">
            <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_LABEL_FOR_TOKEN'); ?></label>
            <div class="controls">
              <input type="text" class="form-control" name="setkalist[<?php echo $i; ?>][form_token]" value="<?php echo htmlspecialchars($bot->form_token ?? ''); ?>" size="60">
            </div>
          </div>

          <div class="control-group">
            <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_LABEL_BOT_TOKEN'); ?></label>
            <div class="controls">
              <input type="text" class="form-control" name="setkalist[<?php echo $i; ?>][token_id]" value="<?php echo htmlspecialchars($bot->token_id ?? ''); ?>" size="60">
            </div>
          </div>

          <div class="control-group">
            <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_LABEL_CHAT_ID'); ?></label>
            <div class="controls">
              <input type="text" class="form-control" name="setkalist[<?php echo $i; ?>][chat_id]" value="<?php echo htmlspecialchars($bot->chat_id ?? ''); ?>" size="60">
            </div>
          </div>
          <?php if ($this->multilang) { ?>
            <div class="control-group">
              <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_LANG_MESSAGES'); ?></label>
              <div class="controls">
                <select name="setkalist[<?php echo $i; ?>][lang_message]" class="form-select langlistForm">
                  <?php foreach ($this->lang_list as $key => $value) {
                    $selected=$bot->lang_message === $value->language ? "selected='selected'" : ''; ?>
                    <option value="<?= $value->language ?>" <?= $selected ?> ><?= $value->name ?></option>
                  <?php } ?>
                </select>
              </div>
            </div>
          <?php } ?>

          <div class="control-group">
            <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_DELAYED_MESSAGES'); ?></label>
            <div class="controls">
              <input type="checkbox" class="form-check-input" name="setkalist[<?php echo $i; ?>][delayedMessages]" value="1" <?php echo !empty($bot->delayedMessages) ? 'checked' : ''; ?>>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_USER_FIELDS'); ?></label>
            <div class="controls">
              <select name="setkalist[<?php echo $i; ?>][fields][]" class="inputbox form-select" size="5" multiple="multiple">
                <?php
                foreach ($this->applySetting_list as $field) {
                  if(isset($bot->fields)){
                    $checked = in_array($field, $bot->fields, true);
                  } ?>
                  <option value="<?= $field ?>" <?= $checked ? 'selected="selected"' : '' ?>><?= Text::_($options[$field]) ?></option>
                <?php } ?>
              </select>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_TIME_FROM'); ?></label>
            <div class="controls">
              <input type="time" class="input-mini" name="setkalist[<?php echo $i; ?>][timeFrom]" value="<?php echo htmlspecialchars($bot->timeFrom ?? ''); ?>"> –
              <input type="time" class="input-mini" name="setkalist[<?php echo $i; ?>][timeTo]" value="<?php echo htmlspecialchars($bot->timeTo ?? ''); ?>">
            </div>
          </div>

          <button type="button" class="btn btn-danger remove-bot">
            <span class="icon-delete"></span> <?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_BUTTON_REMOVE_BOT'); ?>
          </button>
        </fieldset>
        <?php
        $i++;
      }
    } else {
      echo '<p>' . Text::_('PLG_JSHOPPING_TELEGRAMBOT_NO_BOTS') . '</p>';
    }
    ?>
  </div>

  <div class="form-actions">
    <button type="button" class="btn btn-primary" id="add-bot">
      <span class="icon-plus"></span> <?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_BUTTON_ADD_BOT'); ?>
    </button>
  </div>

</div>


<script>
  document.addEventListener('DOMContentLoaded', function () {
    let container = document.getElementById('telegram-bots-container');
    let addBtn = document.getElementById('add-bot');

    addBtn.addEventListener('click', function () {
      let index = container.querySelectorAll('.telegram-bot-block').length;

      let tpl = `
        <fieldset class="adminform telegram-bot-block" data-index="${index}">
            <legend>Бот №${index + 1}</legend>

            <div class="control-group">
                <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_LABEL_FOR_TOKEN'); ?></label>
                <div class="controls">
                    <input type="text" class="form-control" name="setkalist[${index}][form_token]" size="60">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_LABEL_BOT_TOKEN'); ?></label>
                <div class="controls">
                    <input type="text" class="form-control" name="setkalist[${index}][token_id]" size="60">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_LABEL_CHAT_ID'); ?></label>
                <div class="controls">
                    <input type="text" class="form-control" name="setkalist[${index}][chat_id]" size="60">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_LANG_MESSAGES'); ?></label>
                <div class="controls">
                <select name="setkalist[${index}][lang_message]" class="form-select langlistForm">
                  <?php foreach ($this->lang_list as $key => $value) { ?>
                    <option value="<?= $value->language ?>"><?= $value->name ?></option>
                  <?php } ?>
                </select>
                </div>
            </div>

          <div class="control-group">
            <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_USER_FIELDS'); ?></label>
            <div class="controls">
              <select name="setkalist[${index}][fields][]" class="inputbox form-select" size="5" multiple="multiple">
                <?php
                foreach ($this->applySetting_list as $field) { ?>
                  <option value="<?= $field ?>"><?= Text::_($options[$field]) ?></option>
                <?php } ?>
              </select>
            </div>
          </div>

            <div class="control-group">
                <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_DELAYED_MESSAGES'); ?></label>
                <div class="controls">
                    <label><input type="checkbox" name="setkalist[${index}][delayedMessages]" value="1" class="form-check-input"></label>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label"><?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_TIME_FROM'); ?></label>
                <div class="controls">
                    <input type="time" name="setkalist[${index}][timeFrom]"> –
                    <input type="time" name="setkalist[${index}][timeTo]">
                </div>
            </div>

            <button type="button" class="btn btn-danger remove-bot">
                <span class="icon-delete"></span> <?php echo Text::_('PLG_JSHOPPING_TELEGRAMBOT_BUTTON_REMOVE_BOT'); ?>
            </button>
        </fieldset>
        `;
      container.insertAdjacentHTML('beforeend', tpl);
    });

    container.addEventListener('click', function (e) {
      if (e.target.closest('.remove-bot')) {
        e.target.closest('.telegram-bot-block').remove();
      }
    });
  });
</script>

<style>
  .telegram-bot-block {
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 6px;
  }

  .telegram-bot-block legend {
    font-weight: bold;
  }
</style>