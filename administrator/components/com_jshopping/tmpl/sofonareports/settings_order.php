<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

$app = Factory::getApplication();
$params = $this->settingsPlg;

$jshopConfig = JSFactory::getConfig();
?>

<div class="tab-pane fade show active" id="orders" role="tabpanel" aria-labelledby="orders-tab">

  <div class="card p-4 mb-3">
    <?php
    $exportFieldsLeft = [
      'show_chart_order' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SHOW_CHART_ORDER',

    ];
    foreach ($exportFieldsLeft as $name => $label) { ?>
      <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
        <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
      </div>
    <?php } ?>

    <div class="item mt-3 mb-3">
      <label for="default_currency_orders"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_DEFAULT_CURRENCY') ?></label>
      <?= $this->lists['default_currency_orders']; ?>
    </div>
  </div>

  <div class="d-flex gap-3">
    <!-- Настройки списка заказов -->
    <div class="card p-4 col-6">
      <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_HEADING_SETTING_LIST_ORDER') ?></h2>
      <div class="d-flex gap-3">
        <div class="col-6">
          <?php
          $fieldsLeft = [
            'order_user' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER',
            'order_date' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_DATE_ORDER',
            'order_payment' => 'JSHOP_PAYMENT',
            'order_status' => 'JSHOP_PANEL_ORDER_STATUS',
            'order_shop_mode' => 'JSHOP_TRANSACTION',
            'order_countProduct' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_PRODUCTS',
            'order_nameProduct' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_NAME_PRODUCTS',
            'order_vendor' => 'JSHOP_VENDOR'
          ];

          foreach ($fieldsLeft as $name => $label) {
            ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>

        <div class="col-6">
          <?php
          $fieldsRight = [
            'order_number' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_ORDER_NUMBER',
            'order_email' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER_EMAIL',
            'order_phone' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER_PHONE',
            'order_pdf' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_PDF_COLUMN',
            'order_m_date' => 'JSHOP_ORDER_MODIFY_DATE',
            'order_shipping' => 'JSHOP_SHIPPINGS',
            'order_total' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SUM_ORDER',
            'order_add_info' => 'JSHOP_COMMENT'
          ];
          foreach ($fieldsRight as $name => $label) {

            ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>
      </div>
    </div>

    <!-- Настройки экспорта -->
    <div class="card p-4 col-6">
      <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_HEADING_SETTING_EXPORT') ?></h2>
      <div class="d-flex gap-3">
        <div class="col-6">
          <?php
          $fieldsExportLeft = [
            'order_export_user' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER',
            'order_export_date' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_DATE_ORDER',
            'order_export_payment' => 'JSHOP_PAYMENT',
            'order_export_status' => 'JSHOP_PANEL_ORDER_STATUS',
            'order_export_shop_mode' => 'JSHOP_TRANSACTION',
            'order_export_countProduct' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_PRODUCTS',
            'order_export_nameProduct' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_NAME_PRODUCTS',
            'order_export_vendor' => 'JSHOP_VENDOR'
          ];

          foreach ($fieldsExportLeft as $name => $label) {
            ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>

        <div class="col-6">
          <?php
          $fieldsExportRight = [
            'order_export_number' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_ORDER_NUMBER',
            'order_export_email' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER_EMAIL',
            'order_export_m_date' => 'JSHOP_ORDER_MODIFY_DATE',
            'order_export_shipping' => 'JSHOP_SHIPPINGS',
            'order_export_total' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SUM_ORDER',
            'order_export_add_info' => 'JSHOP_COMMENT'
          ];
          foreach ($fieldsExportRight as $name => $label) {
            ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>
      </div>
    </div>
  </div>
</div>