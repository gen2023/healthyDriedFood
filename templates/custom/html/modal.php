<?php
defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

Text::script('TPL_CUSTOM_TG_ERROR_NAME', true);
Text::script('TPL_CUSTOM_TG_ERROR_QUANTITY', true);
Text::script('TPL_CUSTOM_TG_ERROR_METHODS', true);
Text::script('TPL_CUSTOM_TG_ERROR_METHODS_PHONE', true);
Text::script('TPL_CUSTOM_TG_ERROR_QUANTITY', true);
Text::script('TPL_CUSTOM_TG_ERROR_QUANTITY', true);
Text::script('TPL_CUSTOM_TG_ERROR', true);
Text::script('TPL_CUSTOM_TG_SUCCESS', true);

?>

<div class="modal_toOrder">
  <div class="modal_toOrder-content">
    <div class="close btn btn-secondary"></div>
    <h2><?= Text::_('TPL_CUSTOM_TITLE_TO_ORDER'); ?></h2>

    <form id="toOrderForm" method="post" action="">
<div class="top">
      <div class="item">
        <label for="orderName"><?= Text::_('TPL_CUSTOM_NAME'); ?></label>
        <input  class="inputbox" type="text" id="orderName" name="order_name" required>
      </div>

      <div class="item">
        <label for="orderQuantity"><?= Text::_('TPL_CUSTOM_QUANTITY'); ?></label>
        <input  class="inputbox" type="number" id="orderQuantity" name="order_quantity" min="1" required>
      </div>
</div>
      

      <h2><?= Text::_('TPL_CUSTOM_HOW_TO_CONTACT'); ?></h2>

      <!-- Чекбоксы -->
      <div class="how_contactCheckbox">
        <div>
          <input  class="inputbox" type="checkbox" id="checkPhone" name="contact_methods[]" value="phone">
          <label for="checkPhone"><?= Text::_('TPL_CUSTOM_PHONE'); ?></label>
        </div>
        <div>
          <input  class="inputbox" type="checkbox" id="checkEmail" name="contact_methods[]" value="email">
          <label for="checkEmail"><?= Text::_('TPL_CUSTOM_EMAIL'); ?></label>
        </div>
        <div>
          <input  class="inputbox" type="checkbox" id="checkViber" name="contact_methods[]" value="viber">
          <label for="checkViber"><?= Text::_('TPL_CUSTOM_MESAGE_VIBER'); ?></label>
        </div>
        <div>
          <input  class="inputbox" type="checkbox" id="checkTelegram" name="contact_methods[]" value="telegram">
          <label for="checkTelegram"><?= Text::_('TPL_CUSTOM_MESAGE_TELEGRAM'); ?></label>
        </div>
        <div>
          <input  class="inputbox" type="checkbox" id="checkWhatsapp" name="contact_methods[]" value="whatsapp">
          <label for="checkWhatsapp"><?= Text::_('TPL_CUSTOM_MESAGE_WATSAPP'); ?></label>
        </div>
      </div>

      <!-- Поля для контактов -->
      <div class="how_contactList">
        <div class="disabled item checkPhone">
          <label for="contactPhone"><?= Text::_('TPL_CUSTOM_ENTER_PHONE'); ?></label>
          <input  class="inputbox" type="text" id="contactPhone" name="contact_phone">
        </div>

        <div class="disabled item checkEmail">
          <label for="contactEmail"><?= Text::_('TPL_CUSTOM_ENTER_EMAIL'); ?></label>
          <input  class="inputbox" type="email" id="contactEmail" name="contact_email">
        </div>

        <div class="disabled item checkMessage checkViber">
          <label for="contactViber"><?= Text::_('TPL_CUSTOM_ENTER_MESSAGER'); ?> (Viber)</label>
          <input  class="inputbox" type="text" id="contactViber" name="contact_viber">
        </div>

        <div class="disabled item checkMessage checkTelegram">
          <label for="contactTelegram"><?= Text::_('TPL_CUSTOM_ENTER_MESSAGER'); ?> (Telegram)</label>
          <input  class="inputbox" type="text" id="contactTelegram" name="contact_telegram">
        </div>

        <div class="disabled item checkMessage checkWhatsapp">
          <label for="contactWhatsapp"><?= Text::_('TPL_CUSTOM_ENTER_MESSAGER'); ?> (WhatsApp)</label>
          <input  class="inputbox" type="text" id="contactWhatsapp" name="contact_whatsapp">
        </div>
      </div>

      <div class="capthaModal">
        <input type="text" name="captha">
      </div>

      <!-- Кнопка -->
      <div class="item">
        <input  class="inputbox" type="hidden" name="to_order_product_id" value="">
        <button type="submit" class="btn"><?= Text::_('TPL_CUSTOM_SEND'); ?></button>
      </div>

    </form>
  </div>
</div>



