<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

$jshopConfig = JSFactory::getConfig();

?>
<div class="tab-pane fade" id="consumables" role="tabpanel" aria-labelledby="consumables-tab">
  <h4>Список расходников</h4>

  <div class="card p-4 mb-3">
    <form name="adminForm" id="adminForm" method="post" action="index.php?option=com_jshopping&controller=buhgalteria&task=addConsumable">
      <div class="row">
        <div class="col"><input type="text" id="name" name="name" class="form-control" placeholder="Название"></div>
        <div class="col"><button class="btn btn-primary">Добавить расходник</button></div>
      </div>
    </form>
  </div>

  <table class="table table-striped">
    <thead>
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>Название</th>
        <th>Сумма расходов</th>
        <th>Редактировать</th>
      </tr>
    </thead>
    <tbody>
      <?php if (!empty($this->consumablesList)): ?>
        <?php foreach ($this->consumablesList as $i => $row): ?>
          <tr>
            <td><?php echo $i + 1; ?></td>
            <td><?php echo (int) $row->consumable_id; ?></td>
            <td><?php echo htmlspecialchars($row->name); ?></td>
            <td class="text-end"><?php echo number_format($row->total_sum, 2); ?></td>
            <td>
              <a class="btn btn-micro btn-nopad" href="index.php?option=com_jshopping&amp;controller=buhgalteria&amp;task=editConsumable&amp;consumable_id=<?php print $row->consumable_id ?>">
                <i class="icon-edit"></i>
              </a>
            </td>
          </tr>
        <?php endforeach; ?>
      <?php else: ?>
        <tr>
          <td colspan="4" class="text-center">Нет расходников</td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>