<?php if ($show_sets){?>  
<div class="fblock sets_filter<?php echo $span;?>" group="sets">
    <div class="head"><?php print \JText::_('Sets_filter')?></div>
    <?php if ($show_sets == 1) {?>
		<div class='filters-lists'>
            <?php print $inputCore->getRadio('sets_filter', $listSets, $sets_filter); ?>
		</div>
	<?php }elseif ($show_sets == 2) {?>
        <?php print $inputCore->getSelect('sets_filter', $listSets, $sets_filter); ?>
	<?php } ?>
</div>
<?php } ?>