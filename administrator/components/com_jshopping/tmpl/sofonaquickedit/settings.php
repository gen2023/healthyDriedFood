<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

$app = Factory::getApplication();
$params = $this->settingsPlg;

$jshopConfig = JSFactory::getConfig();
?>
<div class="">
  <form method="post" action="index.php?option=com_jshopping&controller=sofonaquickedit" method="post" enctype="multipart/form-data" name="adminForm" id="adminForm">
    <div class="card mb-3 p-4">
      <?php
      $productFieldsLeft = [
        'show_massedit_price' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MASSEDIT_PRICE',
        'show_massedit_product' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MASSEDIT_PRODUCT',
      ];
      foreach ($productFieldsLeft as $name => $label) { ?>
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
          <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
        </div>
      <?php } ?>

    </div>
    <div class="card p-4 col-6">
      <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_HEADING_VIEW_COLUMN') ?></h2>
      <div class="d-flex gap-3">
        <div class="col-6">
          <?php
          $productFieldsLeft = [
            'show_id' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_ID',
            'show_deleteProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_DELETE',
            'show_publishProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_PUBLISH',
            'show_hitsProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_HITS',
            'show_labelProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_LABELS',
            'show_real_ean' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_REAL_EAN',
            'show_stockProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_STOCK',
            'show_category' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_CATEGORY',
            'show_short_description' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_SHORT_DESC',
            'show_currencyProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_CURRENCY',
            'show_dateModifyProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_DATE_MODIFY',
            'show_metaTitle' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_TITLE',
            'show_metaDescription' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_DESCRIPTION',
            'show_medtaKeywords' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_KEYWORDS',
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
            'show_priceProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_PRICE',
            'show_oldpriceProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_OLDPRICE',
            'show_additionPriceProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_ADDITION_PRICE',
            'show_vendorProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_VENDOR',
            'show_product_eanProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_EAN',
            'show_manufacturer_code' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_MANUFACTURER_CODE',
            'show_product_manufacturer' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_PRODUCT_MANUFACTURER',
            'show_imageProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_IMAGE',
            'show_editProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_EDIT',
            'show_dateCreateProduct' => 'PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_DATE_CREATE',
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

    <input type="hidden" name="task" value="" />

  </form>
</div>