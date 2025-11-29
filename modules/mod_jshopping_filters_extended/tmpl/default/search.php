<?php
use Joomla\CMS\Language\Text;
?>
<?php if ($show_search) {?>
<div class="fblock filter_search<?php echo $span;?>" group="search" show_group_name="1">
    <div class="head"><?php print Text::_('Search')?></div>
    <div class='filters-lists'>
        <div class="filter_item">
			<div class="input-group">
				<input class="form-control" type="text" name="filter_search" value="<?php print htmlspecialchars($filter_active['filter_search'])?>"> 
				<input class="btn btn-primary" type="button" value="<?php print Text::_('Search');?>"  onclick="jshop_filters_submit(<?php print $filter_number?>,true);return false;">
			</div>
        </div>
    </div>
</div>
<?php } ?>