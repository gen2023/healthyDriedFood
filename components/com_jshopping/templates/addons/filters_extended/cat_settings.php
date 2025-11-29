<?php
use Joomla\CMS\Language\Text;
?>
<tr>
    <td  class="key">
        <?php echo Text::_('HIDE_FILTER')?>
    </td>
    <td>
        <input type="hidden" name="hide_filer_ext" value="0">
        <input type="checkbox" name="hide_filer_ext" value="1" <?php if ($this->hide_filer_ext) {?>checked<?php }?>>
    </td>
</tr>