<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Factory;

$rows = $this->rows;
$params_plg = $this->params_plg;
$lists = $this->lists;
$pageNav = $this->pagination;
$text_search = $this->text_search;
$category_id = $this->category_id;
$manufacturer_id = $this->manufacturer_id;
$count = count($rows);
$i = 0;
$saveOrder = ($this->filter_order_Dir == "asc" && $this->filter_order == "ordering" && $category_id);
if ($saveOrder) {
  $saveOrderingUrl = 'index.php?option=com_jshopping&controller=products&task=saveorder&category_id=' . $category_id . '&tmpl=component&ajax=1';
  HTMLHelper::_('draggablelist.draggable');
}
$langCode = $this->current_lang;
$lang = Factory::getApplication()->getLanguage();
$lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

?>
<div class="tab-pane fade show active" id="edit" role="tabpanel" aria-labelledby="edit-tab">

  <form action="index.php?option=com_jshopping&controller=sofonaquickedit" method="post" name="adminForm" id="adminForm">
    <div class="js-filters">
      <div>
        <?php if ($this->multilang)
          echo $this->lang_list; ?>
      </div>
      <?php if ($this->countCurrency > 1) { ?>
        <div><?php echo $lists['currencies']; ?></div>
      <?php } ?>
      <div>
        <?php echo $lists['treecategories']; ?>
      </div>

      <?php if ($this->config->disable_admin['product_manufacturer'] == 0) { ?>
        <div>
          <?php echo $lists['manufacturers']; ?>
        </div>
      <?php } ?>
      <?php if ($this->show_vendor) { ?>
        <div>
          <?php echo $lists['vendors']; ?>
        </div>
      <?php } ?>
      <?php if ($this->config->admin_show_product_labels) { ?>
        <div>
          <?php echo $lists['labels'] ?>
        </div>
      <?php } ?>
      <div>
        <?php echo $lists['publish']; ?>
      </div>
      <div>
        <input name="text_search" id="text_search" value="<?php echo htmlspecialchars($text_search); ?>" class="form-control" placeholder="<?php print Text::_('JSHOP_SEARCH') ?>" type="text">
      </div>
      <div>
        <button type="submit" class="btn btn-primary hasTooltip" title="<?php print Text::_('JSHOP_SEARCH') ?>">
          <span class="icon-search" aria-hidden="true"></span>
        </button>
      </div>
      <div>
        <button type="button" class="btn btn-primary js-stools-btn-clear"><?php echo Text::_('JSEARCH_FILTER_CLEAR'); ?></button>
      </div>
    </div>

    <?php if (isset($params_plg['show_massedit_price']) && $params_plg['show_massedit_price']) { ?>
      <div class="card p-3 mb-3 w-maxc">
        <div class="mass_action mt-3 mb-3">
          <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SELECT_MASS_OPERATION') ?></h2>
          <div class="group_actions group_actions-js">
            <div>
              <select id="action1" name="action1" class="form-select">
                <option value="+" selected="selected"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_ADD'); ?></option>
                <option value="-"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SUBTRACT'); ?></option>
                <option value="*"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MULTIPLY'); ?></option>
                <option value="/"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_DIVIDE'); ?></option>
              </select>
              <input type="hidden" name="input-action1" value="+" id="input-action1">
            </div>

            <div class=""><input type="number" step="0.01" name="number" id="input-number" class="form-control"></div>

            <div>
              <select id="action2" name="action2" class="form-select">
                <option value="number" selected="selected"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_NUMBER'); ?></option>
                <option value="persent"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_PERCENT'); ?></option>
              </select>
              <input type="hidden" name="input-action2" value="number" id="input-action2">
            </div>

            <div>
              <select id="type_price" name="type_price" class="form-select">
                <option value="price" selected="selected"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_PRICE'); ?></option>
                <option value="old_price"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OLD_PRICE'); ?></option>
              </select>
              <input type="hidden" name="input-type_price" value="number" id="input-type_price">
            </div>

            <div>
              <select id="count_product_group_actions" name="count_product_group_actions" class="form-select">
                <option value="selected" selected="selected"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_SELECTED'); ?></option>
                <option value="all"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ALL'); ?></option>
                <option value="all_filter"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ALL_FILTER'); ?></option>
                <option value="all_published"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ALL_PUBLISHED'); ?></option>
                <option value="all_not_published"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ALL_NOT_PUBLISHED'); ?></option>
              </select>
            </div>
            <a href="" class="btn btn-success btnEditPrice"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_APPLY') ?></a>

          </div>
        </div>
      </div>
    <?php } ?>

    <?php if (isset($params_plg['show_massedit_product']) && $params_plg['show_massedit_product']) { ?>
      <div class="card p-3 mb-3 w-maxc">
        <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SELECT_MASS_OPERATION') ?></h2>

        <div class="mass_operation mass_operation-js mt-3 mb-3">
          <?php
          $highlightedKeys = [
            'meta_title_' . $langCode,
            'meta_description_' . $langCode,
            'meta_keyword_' . $langCode,
            'name_' . $langCode,
          ];
          ?>
          <select id="mass_operation_type" name="mass_operation_type" class="form-select">
            <?php foreach ($this->mass_operation_type as $key => $value) { ?>
              <?php if (in_array($key, $highlightedKeys)) { ?>
                <option value="<?= $key ?>" data-setv="mass_operation_value"><?= $value ?></option>
              <?php } else { ?>
                <option value="<?= $key ?>"><?= $value ?></option>
              <?php } ?>
            <?php } ?>
          </select>

          <div class="mass_operation_value">
            <input type="number" name="mass_operation_value" id="input-mass_operation_value" class="form-control">
          </div>
          <select id="mass_action_mode" name="mass_action_mode" class="mass_action_mode form-select">
            <option selected="selected" value="replace"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_REPLEACE'); ?></option>
            <option value="addStart"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ADD_START'); ?></option>
            <option value="addEnd"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ADD_END'); ?></option>
          </select>
          <select id="count_product" name="count_product" class="form-select">
            <option value="selected" selected="selected"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_SELECTED'); ?></option>
            <option value="all"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ALL'); ?></option>
                <option value="all_filter"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ALL_FILTER'); ?></option>
            <option value="all_published"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ALL_PUBLISHED'); ?></option>
            <option value="all_not_published"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_ALL_NOT_PUBLISHED'); ?></option>
          </select>
          <a href="" class="btn btn-success btnMmassOperation"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_APPLY') ?></a>
        </div>
      </div>
    <?php } ?>

    <table class="table table-striped product_list product_list-js">
      <thead>
        <tr>
          <th width="20">
            <input type="checkbox" name="checkall-toggle" value="" title="<?php echo Text::_('JGLOBAL_CHECK_ALL'); ?>" onclick="Joomla.checkAll(this)" />
          </th>
          <?php if (isset($params_plg['show_id']) && $params_plg['show_id']) { ?>
            <th width="30" class="center">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_ID'), 'product_id', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>

          <?php if (isset($params_plg['show_imageProduct']) && $params_plg['show_imageProduct']) { ?>
            <th width="93">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_IMAGE'), 'product_name_image', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>

          <th>
            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_TITLE'), 'name', $this->filter_order_Dir, $this->filter_order) ?>
          </th>
          <?php if (isset($params_plg['show_short_description']) && $params_plg['show_short_description']) { ?>
            <th>
              <?php echo Text::_('JSHOP_SHORT_DESCRIPTION'); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_metaTitle']) && $params_plg['show_metaTitle']) { ?>
            <th>
              <?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_TITLE'); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_metaDescription']) && $params_plg['show_metaDescription']) { ?>
            <th>
              <?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_DESCRIPTION'); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_medtaKeywords']) && $params_plg['show_medtaKeywords']) { ?>
            <th>
              <?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_KEYWORDS'); ?>
            </th>
          <?php } ?>
          <?php if (!$category_id && isset($params_plg['show_category']) && $params_plg['show_category']) { ?>
            <th width="80">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_CATEGORY'), 'category', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>
          <?php if ((!$manufacturer_id && $this->config->disable_admin['product_manufacturer'] == 0 && isset($params_plg['show_product_manufacturer']) && $params_plg['show_product_manufacturer'])) { ?>
            <th width="80">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_MANUFACTURER'), 'product_manufacturer_id', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>

          <?php if ($this->show_vendor && isset($params_plg['show_vendorProduct']) && $params_plg['show_vendorProduct']) { ?>
            <th width="80">
              <?php echo Text::_('JSHOP_VENDOR') ?>
            </th>
          <?php } ?>
          <?php if ($this->config->admin_show_product_labels && isset($params_plg['show_labelProduct']) && $params_plg['show_labelProduct']) { ?>
            <th width="80">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_LIST_PRODUCT_LABELS'), 'label_id', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>
          <?php if (($this->config->disable_admin['product_ean'] == 0 || $this->config->admin_product_list_manufacture_code || $this->config->admin_product_list_real_ean) && isset($params_plg['show_product_eanProduct']) && $params_plg['show_product_eanProduct']) { ?>
            <th width="80">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_EAN_PRODUCT'), 'ean', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_real_ean']) && $params_plg['show_real_ean']) { ?>
            <th width="80">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_EAN'), 'real_ean', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_manufacturer_code']) && $params_plg['show_manufacturer_code']) { ?>
            <th width="80">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_MANUFACTURER_CODE'), 'manufacturer_code', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>
          <?php if ($this->config->stock && isset($params_plg['show_stockProduct']) && $params_plg['show_stockProduct']) { ?>
            <th width="60">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_QUANTITY'), 'qty', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>
          <?php if ($this->config->stock && isset($params_plg['show_stockProduct']) && $params_plg['show_stockProduct']) { ?>
            <th width="60">
              <?php echo Text::_('JSHOP_UNLIMITED'); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_priceProduct']) && $params_plg['show_priceProduct']) { ?>
            <th width="80">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_PRICE'), 'price', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>

          <?php if (isset($params_plg['show_oldpriceProduct']) && $params_plg['show_oldpriceProduct']) { ?>
            <th width="60">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_OLD_PRICE'), 'price_old', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_additionPriceProduct']) && $params_plg['show_additionPriceProduct']) { ?>
            <th width="30">
              <?= Text::_('JSHOP_PRODUCT_ADD_PRICE'); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_currencyProduct']) && $params_plg['show_currencyProduct']) { ?>
            <th width="60">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_CURRENCY_PARAMETERS'), 'currency', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>

          <?php if (isset($params_plg['show_hitsProduct']) && $params_plg['show_hitsProduct']) { ?>
            <th width="40">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_HITS'), 'hits', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>

          <?php if (isset($params_plg['show_publishProduct']) && $params_plg['show_publishProduct']) { ?>
            <th width="40" class="center">
              <?php echo Text::_('JSHOP_PUBLISH') ?>
            </th>
          <?php } ?>

          <?php if (isset($params_plg['show_deleteProduct']) && $params_plg['show_deleteProduct']) { ?>
            <th width="40" class="center">
              <?php echo Text::_('JSHOP_DELETE') ?>
            </th>
          <?php } ?>

          <?php if (isset($params_plg['show_dateCreateProduct']) && $params_plg['show_dateCreateProduct']) { ?>
            <th width="60">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_DATE'), 'date', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>
          <?php if (isset($params_plg['show_dateModifyProduct']) && $params_plg['show_dateModifyProduct']) { ?>
            <th width="60">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_ORDER_MODIFY_DATE'), 'date_modify', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
          <?php } ?>

          <?php if (isset($params_plg['show_editProduct']) && $params_plg['show_editProduct']) { ?>
            <th width="30" class="center">
              <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_COLUMN_EDIT') ?>
            </th>
          <?php } ?>
        </tr>
      </thead>
      <tbody <?php if ($saveOrder): ?> class="js-draggable" data-url="<?php echo $saveOrderingUrl; ?>" data-direction="<?php echo strtolower($this->filter_order_Dir); ?>" data-nested="false" <?php endif; ?>>
        <?php foreach ($rows as $row) { ?>
          <tr class="row<?php echo $i % 2; ?>" data-draggable-group="1" item-id="<?php echo $row->product_id; ?>" parents="" level="1">
            <td>
              <?php echo HTMLHelper::_('grid.id', $i, $row->product_id); ?>
              <?php print $row->tmp_html_in_col_checkbox ?? ''; ?>
            </td>
            <?php if (isset($params_plg['show_id']) && $params_plg['show_id']) { ?>
              <td class="center">
                <?php echo $row->product_id; ?>
              </td>
            <?php } ?>
            <?php if (isset($params_plg['show_imageProduct']) && $params_plg['show_imageProduct']) { ?>
              <td>
                <?php if ($row->label_id) { ?>
                  <div class="product_label">
                    <?php if (isset($row->_label_image) && $row->_label_image) { ?>
                      <img src="<?php print $row->_label_image ?>" width="25" alt="" />
                    <?php } else { ?>
                      <span class="label_name"><?php print $row->_label_name; ?></span>
                    <?php } ?>
                  </div>
                <?php } ?>
                <?php if ($row->image) { ?>
                  <a href="index.php?option=com_jshopping&controller=products&task=edit&product_id=<?php print $row->product_id ?>">
                    <img src="<?php print Helper::getPatchProductImage($row->image, 'thumb', 1) ?>" width="90" border="0" />
                  </a>
                <?php } ?>
              </td>
            <?php } ?>
            <td data-field="name_<?= $langCode ?>" data-type="text" data-product_id="<?= $row->product_id ?>">
              <span><?php echo $row->name; ?></span>
            </td>
            <?php if (isset($params_plg['show_short_description']) && $params_plg['show_short_description']) { ?>
              <td data-field="short_description_<?= $langCode ?>" data-type="textarea" data-product_id="<?= $row->product_id ?>">
                <span class="small"><?php echo $row->short_description; ?></span>
              </td>
            <?php } ?>
            <?php if (isset($params_plg['show_metaTitle']) && $params_plg['show_metaTitle']) { ?>
              <td data-field="meta_title_<?= $langCode ?>" data-type="textarea" data-product_id="<?= $row->product_id ?>">
                <span class="small"><?php echo $row->meta_title; ?></span>
              </td>
            <?php } ?>
            <?php if (isset($params_plg['show_metaDescription']) && $params_plg['show_metaDescription']) { ?>
              <td data-field="meta_description_<?= $langCode ?>" data-type="textarea" data-product_id="<?= $row->product_id ?>">
                <span class="small"><?php echo $row->meta_description; ?></span>
              </td>
            <?php } ?>
            <?php if (isset($params_plg['show_medtaKeywords']) && $params_plg['show_medtaKeywords']) { ?>
              <td data-field="meta_keyword_<?= $langCode ?>" data-type="textarea" data-product_id="<?= $row->product_id ?>">
                <span class="small"><?php echo $row->meta_keyword; ?></span>
              </td>
            <?php } ?>
            <?php if (!$category_id && isset($params_plg['show_category']) && $params_plg['show_category']) { ?>
              <td data-field="category" data-type="select" data-product_id="<?= $row->product_id ?>">
                <span><?php echo $row->namescats; ?></span>
              </td>
            <?php } ?>
            <?php if ((!$manufacturer_id && $this->config->disable_admin['product_manufacturer'] == 0) && isset($params_plg['show_product_manufacturer']) && $params_plg['show_product_manufacturer']) { ?>
              <td data-field="manufacturer" data-type="select" data-product_id="<?= $row->product_id ?>" data-function_name="getManufacturers">
                <span><?php echo $row->man_name; ?></span>
              </td>
            <?php } ?>

            <?php if ($this->show_vendor && isset($params_plg['show_vendorProduct']) && $params_plg['show_vendorProduct']) { ?>
              <td>
                <?php echo $row->vendor_name; ?>
              </td>
            <?php } ?>
            <?php if ($this->config->admin_show_product_labels && isset($params_plg['show_labelProduct']) && $params_plg['show_labelProduct']) { ?>
              <td data-field="label_product" data-type="select" data-product_id="<?= $row->product_id ?>" data-function_name="getLabelProduct">
                <span><?php echo $row->label_id ? $row->_label_name : ''; ?></span>
              </td>
            <?php } ?>

            <?php if ($this->config->disable_admin['product_ean'] == 0 && isset($params_plg['show_product_eanProduct']) && $params_plg['show_product_eanProduct']) { ?>
              <td data-field="product_ean" data-type="text" data-product_id="<?= $row->product_id ?>">
                <span><?php echo $row->ean ?></span>
              </td>
            <?php } ?>
            <?php if (isset($params_plg['show_real_ean']) && $params_plg['show_real_ean']) { ?>
              <td data-field="real_ean" data-type="text" data-product_id="<?= $row->product_id ?>">
                <span><?php echo $row->real_ean ?></span>
              </td>
            <?php } ?>
            <?php if (isset($params_plg['show_manufacturer_code']) && $params_plg['show_manufacturer_code']) { ?>
              <td data-field="manufacturer_code" data-type="text" data-product_id="<?= $row->product_id ?>">
                <span><?php echo $row->manufacturer_code ?></span>
              </td>
            <?php } ?>
            <?php if ($this->config->stock && isset($params_plg['show_stockProduct']) && $params_plg['show_stockProduct']) { ?>
              <td data-field="product_quantity" data-type="number" data-product_id="<?= $row->product_id ?>" data-original_qty="<?= floatval($row->qty) ?>">
                <?php if ($row->unlimited) {
                  echo '-----';
                } else {
                  echo '<span>' . floatval($row->qty) . '</span>';
                } ?>
              </td>

            <?php } ?>
            <?php if ($this->config->stock && isset($params_plg['show_stockProduct']) && $params_plg['show_stockProduct']) { ?>
              <td data-product_id="<?= $row->product_id ?>">
                <?php if ($row->unlimited) { ?>
                  <input type="checkbox" name="unlimited" value="1" checked="checked" onclick="editUnlimited(this.checked,<?= $row->product_id ?>)">
                <?php } else { ?>
                  <input type="checkbox" name="unlimited" value="1" onclick="editUnlimited(this.checked,<?= $row->product_id ?>)">
                <?php } ?>

              </td>
            <?php } ?>

            <?php if (isset($params_plg['show_priceProduct']) && $params_plg['show_priceProduct']) { ?>
              <td data-field="product_price" data-type="number" data-product_id="<?= $row->product_id ?>">
                <span><?= number_format($row->product_price, 2, '.', ''); ?></span>
              </td>
            <?php } ?>

            <?php if (isset($params_plg['show_oldpriceProduct']) && $params_plg['show_oldpriceProduct']) { ?>
              <td data-field="product_old_price" data-type="number" data-product_id="<?= $row->product_id ?>">
                <?= number_format($row->product_old_price, 2, '.', ''); ?>
              </td>
            <?php } ?>

            <?php if (isset($params_plg['show_additionPriceProduct']) && $params_plg['show_additionPriceProduct']) { ?>
              <td data-field="product_addition_price" data-type="modal" data-product_id="<?= (int) $row->product_id; ?>">
                <div onclick="openModalAdditionPrice(<?= $row->product_id ?>, <?= $row->product_price ?>)">
                  <?php if (!empty($row->product_add_prices) && is_array($row->product_add_prices)) { ?>
                    <input type="checkbox" checked disabled class="form-check-input">
                  <?php } else { ?>
                    <input type="checkbox" class="form-check-input">
                  <?php } ?>
                  <i class="icon-pencil"></i>
                </div>
              </td>
            <?php } ?>

            <?php if (isset($params_plg['show_currencyProduct']) && $params_plg['show_currencyProduct']) { ?>
              <td data-field="currency" data-type="select" data-product_id="<?= $row->product_id ?>" data-function_name="getCurrencies">
                <span><?php echo \JSHelper::sprintCurrency($row->currency_id); ?></span>
                </th>
              <?php } ?>

              <?php if (isset($params_plg['show_hitsProduct']) && $params_plg['show_hitsProduct']) { ?>
              <td data-field="hits" data-type="number" data-product_id="<?= $row->product_id ?>">
                <span><?php echo $row->hits; ?></span>
              </td>
            <?php } ?>

            <?php if (isset($params_plg['show_publishProduct']) && $params_plg['show_publishProduct']) { ?>
              <td class="center">
                <?php echo HTMLHelper::_('jgrid.published', $row->product_publish, $i); ?>
              </td>
            <?php } ?>

            <?php if (isset($params_plg['show_deleteProduct']) && $params_plg['show_deleteProduct']) { ?>
              <td class="center">
                <a class="btn btn-micro btn-nopad" href='index.php?option=com_jshopping&controller=sofonaquickedit&task=remove&cid[]=<?php print $row->product_id ?>'
                  onclick="return confirm('<?php print Text::_('JSHOP_DELETE') ?>')">
                  <i class="icon-delete"></i>
                </a>
              </td>
            <?php } ?>

            <?php if (isset($params_plg['show_dateCreateProduct']) && $params_plg['show_dateCreateProduct']) { ?>
              <td>
                <?php echo Helper::formatdate($row->product_date_added, 1); ?>
              </td>
            <?php } ?>
            <?php if (isset($params_plg['show_dateModifyProduct']) && $params_plg['show_dateModifyProduct']) { ?>
              <td>
                <?php echo Helper::formatdate($row->date_modify, 1); ?>
              </td>
            <?php } ?>

            <?php if (isset($params_plg['show_editProduct']) && $params_plg['show_editProduct']) { ?>
              <th width="30" class="center">
                <a href="index.php?option=com_jshopping&controller=products&task=edit&product_id=<?php print $row->product_id ?>"><i class="icon-pencil"></i></a>
              </th>
            <?php } ?>
          </tr>
          <?php
          $i++;
        }
        ?>
      </tbody>
    </table>

    <?php if (isset($params_plg['show_additionPriceProduct']) && $params_plg['show_additionPriceProduct']) { ?>
      <div class="modalAdditionPrice">
        <div class="modalAdditionPriceContent">
          <div class="closeModal"><i class="icon-delete"></i></div>
          <div id="additionPriceErrorMsg" style="color: red; margin-bottom: 10px;"></div>
          <table style="margin-bottom:0" id="table_add_price" class="table table-striped">
            <thead>
              <tr>
                <th>
                  <?php echo Text::_('JSHOP_PRODUCT_QUANTITY_START') ?>
                </th>
                <th>
                  <?php echo Text::_('JSHOP_PRODUCT_QUANTITY_FINISH') ?>
                </th>
                <th>
                  <?php echo Text::_('JSHOP_DISCOUNT') ?>
                  <?php if ($this->config->product_price_qty_discount == 2) { ?>
                    (%)
                  <?php } ?>
                </th>
                <th>
                  <?php echo Text::_('JSHOP_PRODUCT_PRICE') ?>
                </th>
                <th width="100">
                  <?php echo Text::_('JSHOP_DELETE') ?>
                </th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
          <table class="table table-striped">
            <tr>
              <td></td>
              <td align="right" width="100">
                <input class="btn button btn-primary" type="button" name="add_new_price" value="<?php echo Text::_('JSHOP_PRODUCT_ADD_PRICE_ADD') ?>" />
              </td>
            </tr>
          </table>
        </div>
      </div>
    <?php } ?>

    <div class="d-flex justify-content-between align-items-center">
      <div class="jshop_list_footer"><?php echo $pageNav->getListFooter(); ?></div>
      <div class="jshop_limit_box"><?php echo $pageNav->getLimitBox(); ?></div>
    </div>

    <input type="hidden" name="filter_order" value="<?php echo $this->filter_order ?>" />
    <input type="hidden" name="filter_order_Dir" value="<?php echo $this->filter_order_Dir ?>" />
    <input type="hidden" name="task" value="" />
    <input type="hidden" name="hidemainmenu" value="0" />
    <input type="hidden" name="boxchecked" value="0" />
  </form>
</div>
<script>
  jQuery(function () {
    jshopAdmin.setMainMenuActive(
      '<?php print Uri::base() ?>index.php?option=com_jshopping&controller=products&category_id=0');
  });
</script>