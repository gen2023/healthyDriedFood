<?php if ($show_search) {?>
<div class="fblock filter_search<?php echo $span;?>" group="search">    
    <div class="head"><?php print \JText::_('Search')?></div>
    <div class='filters-lists'>
        <div class="filter_item">
			<div class="input-group">
				<input class="form-control" type="text" name="filter_search" value="<?php print htmlspecialchars($filter_active['filter_search'])?>"> 
				<input class="btn btn-primary" type="button" value="<?php print \JText::_('Search');?>"  onclick="jshop_filters_submit(<?php print $filter_number?>,true);return false;">
			</div>
        </div>
    </div>
</div>
<?php } ?>