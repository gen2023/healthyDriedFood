<?php if ($show_photo_filter){?>  
<div class="fblock photo_filter<?php echo $span;?>" group="photo">
    <div class="head"><?php print \JText::_('Photo_filter')?></div>
    <?php if ($show_photo_filter == 1) {?>
		<div class='filters-lists'>
            <?php print $inputCore->getRadio('photo_filter', $listPhoto, $photo_filter); ?>
		</div>
	<?php }elseif ($show_photo_filter == 2) {?>
        <?php print $inputCore->getSelect('photo_filter', $listPhoto, $photo_filter); ?>
	<?php } ?>
</div>
<?php } ?>