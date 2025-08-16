<?php
use Joomla\CMS\Language\Text;
?>
<h2><?= Text::_('COM_EXPORT_PARAMS_PRODUCT_TITLE') ?></h2>

<div class="row">
  <div class="col-6">
    <div id="params_table" class="card">
    <div  class="preloader"></div>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th class="text-left"><?= Text::_('COM_EXPORT_TABLE_COL_PARAMS') ?></th>
            <th class="text-right"><?= Text::_('COM_EXPORT_ACTION') ?></th>
          </tr>
        </thead>
        <tbody id="params_list">
          <?php if (!empty($this->results_params)): ?>
            <tr class="notEl" style="display:none">
              <td class="text-center" colspan="2"><?= Text::_('JLIB_FORM_ERROR_NO_DATA') ?></td>
            </tr>
            <?php foreach ($this->results_params as $params): ?>
              <tr class="table-row" data-id="<?= (int) $params['id'] ?>">
                </td>
                <td classs="text-left"><?= htmlspecialchars($params['params_name'], ENT_QUOTES, 'UTF-8') ?></td>
                <td class="text-right">
                  <button class="btn btn-danger btn-sm delete-params" data-id="<?= (int) $params['id'] ?>">
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
    <div id="extra_fields_block" class="card">
    <div  class="preloader"></div>
      <div class="row">
        <div class="form-group">
          <label for=""><?= Text::_('COM_EXPORT_TABLE_COL_PARAMS') ?></label>
          <select id="extra_fields_params" name="extra_fields[]" class="inputbox form-select">
            <option value="00">---</option>
            <?php foreach ($this->extra_fields as $field): ?>
              <option value="<?php echo htmlspecialchars($field['id']); ?>">
                <?php echo htmlspecialchars($field['name']); ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>
      <button type="button" id="button-params-add" class="btn btn-primary">
        <i class="fa fa-plus"></i> <?= Text::_('COM_EXPORT_ADD_PARAMS_PRODUCT') ?>
      </button>
    </div>
  </div>
</div>