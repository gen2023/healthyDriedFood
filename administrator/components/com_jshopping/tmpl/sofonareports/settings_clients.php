<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

$app = Factory::getApplication();
$params = $this->settingsPlg;

$jshopConfig = JSFactory::getConfig();
?>

<div class="tab-pane fade" id="clients" role="tabpanel" aria-labelledby="clients-tab">
  <div class="card p-4 mb-3">
    <?php
    $exportFieldsLeft = [
      'show_filter_statusOrder_clients' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SHOW_FILTER_STATUS_ORDER',
    ];
    foreach ($exportFieldsLeft as $name => $label) { ?>
      <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
        <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
      </div>
    <?php } ?>
    <div class="item">
      <label for="statusOrder_id_clients"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_DEFAULT_STATUS_ORDER') ?></label>
      <?= $this->lists['statusOrder_id_clients']; ?>
    </div>
    <div class="item mt-3 mb-3">
      <label for="default_currency_clients"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_DEFAULT_CURRENCY') ?></label>
      <?= $this->lists['default_currency_clients']; ?>
    </div>
  </div>
  <div class="d-flex gap-3">
    <!-- Настройки списка клиентов -->
    <div class="card p-4 col-6">
      <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_HEADING_SETTING_LIST_CLIENTS') ?></h2>
      <div class="d-flex gap-3">
        <div class="col-6">
          <?php
          $clientFieldsLeft = [
            'client_column_email' => 'JSHOP_EMAIL',
            'client_column_phone' => 'JSHOP_TELEFON',
            'client_column_orders_count' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_ORDERS'
          ];
          foreach ($clientFieldsLeft as $name => $label) { ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>

        <div class="col-6">
          <?php
          $clientFieldsRight = [
            'client_column_total_sum' => 'JSHOP_TOTAL',
            'client_column_last_order_date' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_LAST_ORDER_DATE',
            'client_column_first_order_date' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_FIRST_ORDER_DATE'
          ];
          foreach ($clientFieldsRight as $name => $label) { ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>
      </div>
    </div>

    <!-- Настройки экспорта клиентов -->
    <div class="card p-4 col-6">
      <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_HEADING_SETTING_EXPORT') ?></h2>
      <div class="d-flex gap-3">
        <div class="col-6">
          <?php
          $clientExportLeft = [
            'client_export_email' => 'JSHOP_EMAIL',
            'client_export_phone' => 'JSHOP_TELEFON',
            'client_export_orders_count' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_ORDERS'
          ];
          foreach ($clientExportLeft as $name => $label) { ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>

        <div class="col-6">
          <?php
          $clientExportRight = [
            'client_export_total_sum' => 'JSHOP_TOTAL',
            'client_export_last_order_date' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_LAST_ORDER_DATE',
            'client_export_first_order_date' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_FIRST_ORDER_DATE'

          ];
          foreach ($clientExportRight as $name => $label) { ?>
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