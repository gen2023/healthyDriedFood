<?php
use Joomla\CMS\Language\Text;
?>
<h2><?= Text::_('COM_EXPORT_GOOGLE_CATEGORY_EXCLUDE') ?></h2>

<div class="row">
  <div class="col-6">
    <div id="exclude_category" class="card">
      <div class="preloader"></div>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th class="text-left"><?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?></th>
            <th class="text-left"><?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?></th>
            <th class="text-right"><?= Text::_('COM_EXPORT_ACTION') ?></th>
          </tr>
        </thead>
        <tbody id="exclude_category-list">
          <?php if (!empty($this->results_exclude)): ?>
            <tr class="notEl" style="display:none">
              <td class="text-center" colspan="3"><?= Text::_('JLIB_FORM_ERROR_NO_DATA') ?></td>
            </tr>
            <?php foreach ($this->results_exclude as $value): ?>
              <tr class="category-row" data-id="<?= (int) $value['id'] ?>">
                <td classs="text-left"><?= $value['category_name'] ? htmlspecialchars($value['category_name'], ENT_QUOTES, 'UTF-8') : '' ?></td>
                <td classs="text-left"><?= $value['product_name'] ? htmlspecialchars($value['product_name'], ENT_QUOTES, 'UTF-8') : '' ?></td>
                <td class="text-right">
                  <button class="btn btn-danger btn-sm delete-exclude" data-id="<?= (int) $value['id'] ?>">
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
    <div id="selectCategoryExclude" class="card">
      <div class="preloader"></div>
      <div class="form-group mt-3 blockSelect">
        <label for="input-category_exclude"><?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?></label>
        <div class="input-group">
          <input type="text" id="input-category_exclude" class="form-control" autocomplete="off"
            placeholder="<?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?>">
          <ul id="resultJsExclude" class="result dropdown-menu col-6"></ul>
          <input type="hidden" name="exclude_category_id" value="">
          <button type="button" id="button-category-add-exclude" class="btn btn-primary">
            <i class="fa fa-plus"></i> <?= Text::_('COM_EXPORT_ADD_CATEGORY_SHOP') ?>
          </button>
        </div>
      </div>
    </div>
    <div id="selectProductExclude" class="card">
      <div class="preloader"></div>
      <div class="form-group mt-3 blockSelect">
        <label for="input-oroduct_exclude"><?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?></label>
        <div class="input-group">
          <input type="text" id="input-product_exclude" class="form-control" autocomplete="off"
            placeholder="<?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?>">
          <ul id="resultJsExcludeProduct" class="result dropdown-menu col-6"></ul>
          <input type="hidden" name="exclude_product_id" value="">
          <button type="button" id="button-product-add-exclude" class="btn btn-primary">
            <i class="fa fa-plus"></i> <?= Text::_('COM_EXPORT_ADD_PRODUCT_SHOP') ?>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>