<?php
defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

$jshopConfig = JSFactory::getConfig();


?>
<div class="card p-4 mb-3">
  <form method="post" action="index.php?option=com_jshopping&controller=buhgalteria&task=addExpenses">
    <?php echo HTMLHelper::_('form.token'); ?>
    <input type="hidden" name="product_id" value="<?php echo (int) $this->product->product_id; ?>">
    <input type="hidden" name="from_edit" value="1">

    <div class="row mb-3">
      <div class="col">
        <input type="text" name="expenses" class="form-control" placeholder="Сумма расходов">
      </div>
      <div class="col">
        <?php echo HTMLHelper::_('calendar', '', 'date', 'date', '%d.%m.%Y', [
          'class' => 'form-control',
          'placeholder' => Text::_('JSHOP_DATE')
        ]); ?>
      </div>
      <div class="col"><textarea name="comments" id="" class="form-control"></textarea></div>
      <div class="col">
        <button type="submit" class="btn btn-success">Добавить расход</button>
      </div>
    </div>
  </form>

</div>

<div class="card p-4">
  <h3>Редактирование расходов: <?php echo htmlspecialchars($this->product->product_name); ?></h3>

  <form action="index.php?option=com_jshopping&controller=buhgalteria&task=saveExpenses" method="post">
    <?php echo HTMLHelper::_('form.token'); ?>
    <input type="hidden" name="product_id" value="<?php echo (int) $this->product->product_id; ?>">

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Сумма</th>
          <th>Дата</th>
          <th>Комметарий</th>
          <th>Удалить</th>
        </tr>
      </thead>
      <tbody>
        <?php if (!empty($this->expenses)): ?>
          <?php foreach ($this->expenses as $i => $exp): ?>
            <tr>
              <td><?php echo (int) $exp->id; ?></td>
              <td>
                <input type="text" class="form-control" name="expenses[<?php echo $exp->id; ?>][amount]" value="<?php echo htmlspecialchars($exp->expenses); ?>">
              </td>
              <td>
                <?php echo HTMLHelper::_('calendar', $exp->date, "expenses[{$exp->id}][date]", "date_{$exp->id}", '%d.%m.%Y'); ?>
              </td>
              <td class="text-start"><textarea name="expenses[<?php echo $exp->id; ?>][comments]" id="" class="form-control"><?php echo $exp->comments; ?></textarea></td>
              <td class="text-center">
                <input type="checkbox" name="expenses[<?php echo $exp->id; ?>][delete]" value="1">
              </td>
            </tr>
          <?php endforeach; ?>
        <?php else: ?>
          <tr>
            <td colspan="4">Расходов пока нет</td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>

    <div class="mt-3">
      <button type="submit" class="btn btn-success">Сохранить изменения</button>
      <a href="index.php?option=com_jshopping&controller=buhgalteria" class="btn btn-secondary">Назад</a>
    </div>
  </form>
</div>