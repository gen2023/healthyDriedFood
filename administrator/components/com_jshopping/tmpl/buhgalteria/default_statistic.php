<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

$jshopConfig = JSFactory::getConfig();

?>
<div class="tab-pane fade" id="statistic" role="tabpanel" aria-labelledby="statistic-tab">

  <div id="j-main-container" class="j-main-container">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Расход по товарам</th>
          <th>
            Расход по расходникам
          </th>
          <th>
            Доход от продаж
          </th>
          <th>Итого</th>
          <th>Дата</th>
        </tr>
      </thead>
      <tbody>
        <?php if (!empty($this->statistics)): ?>
          <?php foreach ($this->statistics as $i => $row): ?>

            <?php
            $total = $row->income - ($row->product_expenses + $row->consumable_expenses);
            $color = $total < 0 ? 'red' : 'green';
            ?>

            <tr>
              <td><?php echo $i + 1; ?></td>
              <td><?php echo number_format($row->product_expenses, 2); ?></td>
              <td><?php echo number_format($row->consumable_expenses, 2); ?></td>
              <td><?php echo number_format($row->income, 2); ?></td>
              <td style="text-align:right;color: <?php echo $color; ?>; font-weight: bold;">
                <?php echo number_format($total, 2); ?>
              </td>
              <td><?php echo $row->month; ?></td>
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
      <div><?php //echo $this->pageNavProducts->getListFooter(); ?></div>
    </div>

  </div>
</div>