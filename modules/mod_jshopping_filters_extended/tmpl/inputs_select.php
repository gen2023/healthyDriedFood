<?php
use Joomla\CMS\Language\Text;
?>
<div class="filter_item <?php print $css_class?>">
    <select name="<?php print $name?>" data-placeholder="<?php print Text::_('JSELECT')?>" style="width:100%;" class="<?php print $css_class_select?>" <?php print $multiple?> onchange="jshop_filters_submit(<?php print $this->filter_number?>);">
        <?php foreach($values as $k => $value){ ?>
            <option value="<?php print htmlspecialchars($value->$field_id)?>" <?php print $value->checked?> <?php print $value->disabled?>>
                <?php print $value->name?>
            </option>
        <?php } ?>
    </select>
</div>
