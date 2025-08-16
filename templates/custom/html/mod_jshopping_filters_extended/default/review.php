<?php if ($show_review){?>
<div class="fblock review_filter<?php echo $span;?>" group="review">
	<div class="head"><?php print \JText::_('Review')?></div>
	<?php if ($show_review == 1) {?>
		<div class='filters-lists'>
			<?php print $inputCore->getRadio('review_filter', $listReview, $review_filter); ?>
		</div>
	<?php }elseif ($show_review == 2) {?>
		<?php print $inputCore->getSelect('review_filter', $listReview, $review_filter); ?>
	<?php } ?>
</div>

<?php } ?>