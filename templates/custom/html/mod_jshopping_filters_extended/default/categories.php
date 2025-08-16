<?php if (isset($filter_categorys) && is_array($filter_categorys) && count($filter_categorys)) {?>
<div class="fblock box_category <?php echo $span;?>" group="category">
    <input type="hidden" name="categorys[]" value="0" />
    <div class="head"><?php print \JText::_('CATEGORY')?></div>

    <?php if ($show_categorys == '1') {?>
        <div class="filters-lists <?php echo modJshopping_filters_extendedHelper::addScrollingClass($filter_categorys, $params->get('filter_scrolling_number_categories', 0)); ?>">
            <?php print $inputCore->getCheckboxs('categorys[]', $filter_categorys, $categorys, $show_category_img ? 'image' : '', $jshopConfig->image_category_live_path); ?>
        </div>
    <?php }elseif($show_categorys == '2') { ?>
        <?php print $inputCore->getSelect('categorys[]', $filter_categorys, $categorys); ?>        
    <?php } ?>
</div>
<?php } ?>