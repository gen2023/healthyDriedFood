<?php
use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Plugin\PluginHelper;

use Joomla\Component\Jshopping\Site\Helper\Checkboxblock;
?>
<tr>
    <td colspan="2">
        <strong><?php echo Text::_('MOD_FILTERS_EXTENDED_FILTER_CHARACTERISTICS_SETTINGS') ?></strong>
    </td>
</tr>
<tr>
    <td  class="key">
        <?php echo Text::_('AS_CHECKBOX')?>
    </td>
    <td>
        <?php 
        if (class_exists('Joomla\\Component\\Jshopping\\Site\\Helper\\Checkboxblock')) {
            echo Checkboxblock::getHtml('char_id_checkbox[]', $this->characteristics, ['selected' => $this->char_id_checkbox ?? []]);
        } else {
            echo HTMLHelper::_('select.genericlist', $this->characteristics, "char_id_checkbox[]", 'class="form-select inputbox" size="20" multiple="multiple"', 'id', 'name', $this->char_id_checkbox ?? []);
        }
        ?>
    </td>
</tr>
<tr>
    <td  class="key">
        <?php echo Text::_('AS_SELECT')?>
    </td>
    <td>
    <?php 
        if (class_exists('Joomla\\Component\\Jshopping\\Site\\Helper\\Checkboxblock')) {
            echo Checkboxblock::getHtml('char_id_select[]', $this->characteristics, ['selected' => $this->char_id_select ?? []]);
        } else {
            echo HTMLHelper::_('select.genericlist', $this->characteristics, "char_id_select[]", 'class="form-select inputbox" size="20" multiple="multiple"', 'id', 'name', $this->char_id_select ?? []);
        }
        ?>
    </td>
</tr>
<?php if (PluginHelper::isEnabled('jshopping', 'sets')) {?>
<tr>
    <td  class="key">
        <?php echo Text::_('_JSHOP_SETS_FILTER')?>
    </td>
    <td>
        <input type="hidden" name="sets_filter" value="0">
        <input type="checkbox" name="sets_filter" value="1" <?php if ($this->table->sets_filter) {?>checked<?php }?>>
    </td>
</tr>
<?php } ?>