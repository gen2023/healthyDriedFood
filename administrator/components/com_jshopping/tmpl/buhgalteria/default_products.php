<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

$jshopConfig = JSFactory::getConfig();

?>
<div class="tab-pane fade active show" id="products" role="tabpanel" aria-labelledby="products-tab">

  <div id="j-main-container" class="j-main-container">
    <div class="card p-4 mb-3">
      <table>
        <tr>
          <td width="300px"><b>Сумма дохода по товарам:</b></td>
          <td><?= number_format($this->totalIncome, 2, '.', ' '); ?></td>
        </tr>
        <tr>
          <td width="300px"><b>Сумма расхода по товарам:</b></td>
          <td><?= number_format($this->totalExpenseProducts, 2, '.', ' '); ?></td>
        </tr>
        <tr>
          <td width="300px"><b>Сумма расхода по расходникам:</b></td>
          <td><?= number_format($this->totalExpenseConsumables, 2, '.', ' '); ?></td>
        </tr>
        <tr>
          <td width="300px"><b>ИТОГО:</b></td>
          <td><?= number_format($this->totalIncome - $this->totalExpenseProducts - $this->totalExpenseConsumables, 2, '.', ' '); ?></td>
        </tr>
      </table>
    </div>
    <div class="card p-4 mb-3">
      <input type="text" id="productSearch" class="form-control" placeholder="Поиск товара...">
    </div>

    <form name="adminForm" id="adminForm" method="post" action="index.php?option=com_jshopping&controller=buhgalteria">
      <?php echo HTMLHelper::_('form.token'); ?>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th><?php echo HTMLHelper::_('grid.sort', 'JSHOP_ID', 'product_id', $this->filter_order_Dir, $this->filter_order); ?></th>
            <th>
              <?php echo HTMLHelper::_('grid.sort', 'Наименование', 'product_name', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
            <th>
              Код товара
            </th>

            <th>
              <?php echo HTMLHelper::_('grid.sort', 'Колличетсво', 'total_quantity', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
            <th>
              <?php echo HTMLHelper::_('grid.sort', 'Сумма дохода', 'total_sum', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
            <th>
              <?php echo HTMLHelper::_('grid.sort', 'Сумма расхода', 'total_sum_expenses', $this->filter_order_Dir, $this->filter_order); ?>
            </th>
            <th>Редактировать</th>
          </tr>
        </thead>
        <tbody>
          <?php if (!empty($this->productRows)): ?>
            <?php foreach ($this->productRows as $i => $row): ?>
              <tr>
                <td><?php echo $this->pageNavProducts->getRowOffset($i); ?></td>
                <td><?php echo (int) $row->product_id; ?></td>
                <td>
                  <a href="index.php?option=com_jshopping&controller=products&task=edit&product_id=<?php print $row->product_id ?>">
                    <?php echo htmlspecialchars($row->product_name); ?>
                  </a>
                </td>
                <td><?= $row->product_ean ?></td>

                <td class="text-center"><?php echo (int) $row->total_quantity; ?></td>

                <td class="text-end">
                  <?php echo number_format($row->total_sum, 2) . ' ' . $row->currency_name; ?>
                </td>

                <td class="text-end"><?php echo (int) $row->total_sum_expenses; ?></td>
                <td>
                  <a class="btn btn-micro btn-nopad" href="index.php?option=com_jshopping&amp;controller=buhgalteria&amp;task=editProduct&amp;product_id=<?php print $row->product_id ?>">
                    <i class="icon-edit"></i>
                  </a>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php else: ?>
            <tr>
              <td colspan="5"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_ERROR_NO_DATA'); ?></td>
            </tr>
          <?php endif; ?>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center">
        <div><?php echo $this->pageNavProducts->getListFooter(); ?></div>
      </div>

      <input type="hidden" name="filter_order" value="<?php echo $this->filter_order ?>" />
      <input type="hidden" name="filter_order_Dir" value="<?php echo $this->filter_order_Dir ?>" />
      <input type="hidden" name="task" value="" />
    </form>
  </div>
</div>
<script>
  document.getElementById('productSearch').addEventListener('keyup', function () {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll('#adminForm tbody tr');

    rows.forEach(function (row) {
      let nameCell = row.cells[2]; // колонка "Наименование"
      if (!nameCell) return;

      let text = nameCell.textContent.toLowerCase();

      if (text.indexOf(filter) > -1) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
</script>