<?php if ($show_rating){?>
<div class="fblock rating_filter<?php echo $span;?>" group="rating" show_group_name="1">
      <div class="head"><?php print \JText::_('Rating')?></div>    
      <?php if ($show_rating == 1) {?>
	      <div class='filters-lists <?php echo modJshopping_filters_extendedHelper::addScrollingClass($listRating, $params->get('filter_scrolling_number_rating', 0)); ?>'>
                  <?php print $inputCore->getRadio('rating_filter', $listRating, $rating_filter); ?>
		</div>
	<?php }elseif ($show_rating == 2) {?>
        <?php print $inputCore->getSelect('rating_filter', $listRating, $rating_filter); ?>
	<?php } ?>
</div>
<?php } ?>