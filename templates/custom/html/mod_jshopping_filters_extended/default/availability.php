<?php if ($show_quantity){?>  
<div class="fblock quantity_filter<?php echo $span;?>" group="qty">
    <div class="head"><?php print JText::_('AVAILABILITY')?></div>
    <?php if ($show_quantity == 1) {?>
		<div class='filters-lists'>
            <?php print $inputCore->getRadio('quantity_filter', $listAvailability, $quantity_filter); ?>
		</div>
	<?php }elseif ($show_quantity == 2) {?>
        <?php print $inputCore->getSelect('quantity_filter', $listAvailability, $quantity_filter); ?>
	<?php } ?>
</div>
<?php } ?>