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
            <th class="text-left"><?= Text::_('COM_EXPORT_GOOGLE_CATEGORY') ?></th>
            <th class="text-left"><?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?></th>
            <th class="text-left"><?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?></th>
            <th class="text-right"><?= Text::_('COM_EXPORT_ACTION') ?></th>
          </tr>
        </thead>
        <tbody id="binding_list">
          <?php if (!empty($this->results)): ?>
            <tr class="notEl" style="display:none">
              <td class="text-center" colspan="4"><?= Text::_('JLIB_FORM_ERROR_NO_DATA') ?></td>
            </tr>
            <?php foreach ($this->results as $category): ?>
              <tr class="table-row" data-id="<?= (int) $category['id'] ?>">
                <td classs="text-left"><?= htmlspecialchars($category['google_category_name'], ENT_QUOTES, 'UTF-8') ?>
                </td>
                <td classs="text-left"><?= $category['category_name'] ? htmlspecialchars($category['category_name'], ENT_QUOTES, 'UTF-8') : '' ?></td>
                <td classs="text-left"><?= $category['product_name'] ? htmlspecialchars($category['product_name'], ENT_QUOTES, 'UTF-8') : '' ?></td>
                <td class="text-right">
                  <button class="btn btn-danger btn-sm delete-binding" data-id="<?= (int) $category['id'] ?>">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php else: ?>
            <tr class="notEl">
              <td class="text-center" colspan="4"><?= Text::_('JLIB_FORM_ERROR_NO_DATA') ?></td>
            </tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
  <div class="col-6">
    <div id="selectCategory" class="card">
      <div  class="preloader"></div>
      <div class="form-group mt-4 blockSelect">
        <label for="input-google-category"><?= Text::_('COM_EXPORT_GOOGLE_CATEGORY') ?></label>
        <input type="text" id="input-google-category" class="form-control" autocomplete="off"
          placeholder="<?= Text::_('COM_EXPORT_GOOGLE_CATEGORY') ?>">
        <ul id="resultGoogle" class="result dropdown-menu col-6"></ul>
        <input type="hidden" name="google_base_category_id" value="">
      </div>
      <div class="form-group mt-3 blockSelect">
        <label for="input-category"><?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?></label>
        <div class="input-group">
          <input type="text" id="input-category" class="form-control" autocomplete="off"
            placeholder="<?= Text::_('COM_EXPORT_CATEGORY_SHOP') ?>">
          <ul id="resultJs" class="result dropdown-menu col-6"></ul>
          <input type="hidden" name="category_id" value="">
        </div>
      </div>
      <button type="button" id="button-category-add" class="btn btn-primary">
        <i class="fa fa-plus"></i> <?= Text::_('COM_EXPORT_ADD_CATEGORY_SHOP') ?>
      </button>
    </div>
    <div id="selectproduct" class="card">
      <div  class="preloader"></div>
      <div class="form-group mt-4 blockSelect">
        <label for="input-google-category2"><?= Text::_('COM_EXPORT_GOOGLE_CATEGORY') ?></label>
        <input type="text" id="input-google-category2" class="form-control" autocomplete="off"
          placeholder="<?= Text::_('COM_EXPORT_GOOGLE_CATEGORY') ?>">
        <ul id="resultGoogle2" class="result dropdown-menu col-6"></ul>
        <input type="hidden" name="google_base_category_id2" value="">
      </div>
      <div class="form-group mt-3 blockSelect">
        <label for="input-product"><?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?></label>
        <div class="input-group">
          <input type="text" id="input-product" class="form-control" autocomplete="off"
            placeholder="<?= Text::_('COM_EXPORT_PRODUCT_SHOP') ?>">
          <ul id="resultJs2" class="result dropdown-menu col-6"></ul>
          <input type="hidden" name="product_id" value="">
        </div>
      </div>
      <button type="button" id="button-product-add" class="btn btn-primary">
        <i class="fa fa-plus"></i> <?= Text::_('COM_EXPORT_ADD_PRODUCT_SHOP') ?>
      </button>
    </div>
  </div>
</div>