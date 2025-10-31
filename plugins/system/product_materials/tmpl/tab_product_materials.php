<?php
defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

?>
<div class="tab-pane" id="product_materials">
    <div class="form-group">
        <label><?php echo Text::_('Выберите материалы'); ?></label>
        <select name="product_materials[]" class="form-select" multiple size="10">
            <?php foreach ($materials as $m): ?>
                <option value="<?php echo $m->id; ?>" <?php echo in_array($m->id, $selected) ? 'selected' : ''; ?>>
                    <?php echo htmlspecialchars($m->title); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>
</div>
