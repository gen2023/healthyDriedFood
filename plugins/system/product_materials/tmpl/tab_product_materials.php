<?php
defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

?>
<div class="form-group">
    <label><?php echo Text::_('Выберите материалы'); ?></label>

    <input 
        type="text" 
        id="materialSearch" 
        class="form-control mb-2" 
        placeholder="Поиск материала..."
    >

    <select name="product_materials[]" id="materialsSelect" class="form-select" multiple size="10">
        <?php foreach ($materials as $m): ?>
            <option value="<?php echo $m->id; ?>" <?php echo in_array($m->id, $selected) ? 'selected' : ''; ?>>
                <?php echo htmlspecialchars($m->title); ?>
            </option>
        <?php endforeach; ?>
    </select>
</div>

<script>
document.getElementById('materialSearch').addEventListener('input', function () {
    const search = this.value.toLowerCase();
    const options = document.querySelectorAll('#materialsSelect option');

    options.forEach(option => {
        const text = option.text.toLowerCase();

        if (text.includes(search)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
});
</script>