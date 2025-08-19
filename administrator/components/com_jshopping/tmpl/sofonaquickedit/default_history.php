<?php 
use Joomla\CMS\Language\Text;

$groupedChanges=$this->groupedChanges;
// var_dump($resultChanges);
?>
<div class="history-tab tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
    <?php if (!empty($this->groupedChanges)) : ?>
        <?php foreach ($this->groupedChanges as $date => $changes) : ?>
            <div class="itemDate">
            <div class="mt-3 mb-3 w-mc">
                <span class="badge bg-primary spanDateTable"><?= htmlspecialchars($date) ?></span>
            </div>
            <table class="table table-bordered table-striped table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_COLUMN_ID_PRODUCT') ?></th>
                        <th><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_COLUMN_FIELD') ?></th>
                        <th><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_COLUMN_OLD_VALUE') ?></th>
                        <th><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_COLUMN_NEW_VALUE') ?></th>
                        <th><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_COLUMN_INFORMATION') ?></th>
                        <th><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_COLUMN_DATE_MODIFICATION') ?></th>
                        <th><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_COLUMN_ACTION_RESTORE') ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($changes as $change) : ?>
                        <tr>
                            <td><?= (int) $change->id ?></td>
                            <td><?= (int) $change->product_id ?></td>
                            <td><?= htmlspecialchars($change->field) ?></td>
                            <td><?= htmlspecialchars($change->old_value) ?></td>
                            <td><?= htmlspecialchars($change->new_value) ?></td>
                            <td><?= htmlspecialchars($change->info) ?></td>
                            <td><?= htmlspecialchars($change->date_modify) ?></td>
                            <td>
                                <div class="btn btn-success actionRestore" data-id="<?= $change->id ?>">
                                    <span class="fa-solid fa-rotate-left" aria-hidden="true"></span> <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OLD_VALUE') ?>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            </div>
        <?php endforeach; ?>
    <?php else : ?>
        <p class="text-muted">История изменений пуста.</p>
    <?php endif; ?>
</div>
