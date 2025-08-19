<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

$app = Factory::getApplication();
$params = $this->settingsPlg;

$jshopConfig = JSFactory::getConfig();
?>

<div class="tab-pane fade" id="products" role="tabpanel" aria-labelledby="products-tab">
  <div class="card p-4 mb-3">
    <?php
    $exportFieldsLeft = [
      'merge_product' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_MERGE_PRODUCT',
      'show_filter_statusOrder_products' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SHOW_FILTER_STATUS_ORDER',

    ];
    foreach ($exportFieldsLeft as $name => $label) { ?>
      <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
        <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
      </div>
    <?php } ?>
    <div class="item">
      <label for="statusOrder_id_products"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_DEFAULT_STATUS_ORDER') ?></label>
      <?= $this->lists['statusOrder_id_products']; ?>
    </div>
    <div class="item mt-3 mb-3">
      <label for="default_currency_products"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_DEFAULT_CURRENCY') ?></label>
      <?= $this->lists['default_currency_products']; ?>
    </div>
  </div>
  <div class="d-flex gap-3">
    <div class="card p-4 col-6">
      <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_HEADING_SETTING_LIST_PRODUCTS') ?></h2>
      <div class="d-flex gap-3">
        <div class="col-6">
          <?php
          $productFieldsLeft = [
            'column_product_id' => 'JSHOP_PRODUCT_ID',
            'column_sum_sold' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SUM_SOLD',
            'column_manufacturer_code' => 'JSHOP_MANUFACTURER_CODE',
            'column_product_ean' => 'JSHOP_EAN_PRODUCT'
          ];
          foreach ($productFieldsLeft as $name => $label) { ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>

        <div class="col-6">
          <?php
          $productFieldsRight = [
            'column_count_product' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_SOLD',
            'column_count_orders' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_ORDERS',
            'column_hits' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_HITS'
          ];
          foreach ($productFieldsRight as $name => $label) { ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>
      </div>
    </div>

    <div class="card p-4 col-6">
      <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_HEADING_SETTING_EXPORT') ?></h2>
      <div class="d-flex gap-3">
        <div class="col-6">
          <?php
          $exportFieldsLeft = [
            'export_product_id' => 'JSHOP_PRODUCT_ID',
            'export_sum_sold' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SUM_SOLD',
            'export_manufacturer_code' => 'JSHOP_MANUFACTURER_CODE',
            'export_product_ean' => 'JSHOP_EAN_PRODUCT'
          ];
          foreach ($exportFieldsLeft as $name => $label) { ?>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
              <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
            </div>
          <?php } ?>
        </div>

        <div class="col-6">
          <?php
          $exportFieldsRight = [
            'export_count_product' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_SOLD',
            'export_count_orders' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_ORDERS',
            'export_hits' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_HITS'

          ];
          foreach ($exportFieldsRight as $name => $label) { ?>
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