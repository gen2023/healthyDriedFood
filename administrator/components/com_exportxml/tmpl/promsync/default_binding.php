<?php
use Joomla\CMS\Language\Text;
?>
<h2><?= Text::_('COM_EXPORT_BINDING_PRODUCT_IN_CATEGORY') ?></h2>
<div class="row">
  <div class="col-6">
    <div id="binding_category" class="card">
      <div class="preloader"></div>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th class="text-left"><?= Text::_('COM_EXPORT_CATEGORY_PROM') ?></th>
            <th class="text-left"><?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?></th>
            <th class="text-left"><?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?></th>
            <th class="text-right"><?= Text::_('COM_EXPORT_ACTION') ?></th>
          </tr>
        </thead>
        <tbody id="binding_list">
          <?php if (!empty($this->results_binding)): ?>
            <tr class="notEl" style="display:none">
              <td class="text-center" colspan="3"><?= Text::_('JLIB_FORM_ERROR_NO_DATA') ?></td>
            </tr>
            <?php foreach ($this->results_binding as $value): ?>
              <tr class="category-row" data-id="<?= (int) $value['id'] ?>">
                <td classs="text-left"><?= htmlspecialchars($value['prom_cat_id'], ENT_QUOTES, 'UTF-8') ?></td>
                <td classs="text-left"><?= htmlspecialchars($value['category_name'], ENT_QUOTES, 'UTF-8') ?></td>
                <td classs="text-left"><?= htmlspecialchars($value['product_name'], ENT_QUOTES, 'UTF-8') ?></td>
                <td class="text-right">
                  <button class="btn btn-danger btn-sm delete-binding" data-id="<?= (int) $value['id'] ?>">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php else: ?>
            <tr class="notEl">
              <td class="text-center" colspan="3"><?= Text::_('JLIB_FORM_ERROR_NO_DATA') ?></td>
            </tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
  <div class="col-6">
    <div id="selectCategoryShopBinding" class="card">
      <div class="preloader"></div>
      <div class="form-group mt-3 blockSelect">
        <label for="input-oroduct_binding"><?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?></label>
        <div class="input-group">
          <input type="text" id="input-product_binding" class="form-control" autocomplete="off"
            placeholder="<?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?>">
          <ul id="resultJsBindingProduct" class="result dropdown-menu col-6"></ul>
          <input type="hidden" name="binding_product_id" value="">
        </div>
      </div>
      <div class="form-group mt-3 blockSelect">
        <label for="input-category_binding"><?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?></label>
        <div class="input-group">
          <input type="text" id="input-category_binding" class="form-control" autocomplete="off"
            placeholder="<?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?>">
          <ul id="resultJsBinding" class="result dropdown-menu col-6"></ul>
          <input type="hidden" name="binding_category_id" value="">
        </div>
      </div>
      <button type="button" id="button-prod-in-cat-binding" class="btn btn-primary">
        <i class="fa fa-plus"></i> <?= Text::_('COM_EXPORT_BINDING_BTN') ?>
      </button>
    </div>
    <div id="selectCategoryPromBinding" class="card">
      <div class="preloader"></div>
      <div class="form-group mt-3 blockSelect">
        <label for="input-prom_cat_binding"><?= Text::_('COM_EXPORT_PROM_CATEGORY') ?></label>
        <div class="input-group">
          <input type="number" id="input-prom_cat_binding" class="form-control" autocomplete="off"
            placeholder="<?= Text::_('COM_EXPORT_PROM_CATEGORY') ?>">
        </div>
      </div>
      <div class="form-group mt-3 blockSelect">
        <label for="input-category_binding"><?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?></label>
        <div class="input-group">
          <input type="text" id="input-category_binding2" class="form-control" autocomplete="off"
            placeholder="<?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?>">
          <ul id="resultJsBinding2" class="result dropdown-menu col-6"></ul>
          <input type="hidden" name="binding_category_id2" value="">
        </div>
      </div>
      <button type="button" id="button-prom-in-cat-binding" class="btn btn-primary">
        <i class="fa fa-plus"></i> <?= Text::_('COM_EXPORT_BINDING_BTN') ?>
      </button>
    </div>
  </div>
</div>