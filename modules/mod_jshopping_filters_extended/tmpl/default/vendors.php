<?php if (isset($filter_vendors) && is_array($filter_vendors) && count($filter_vendors)) {?>
<div class="fblock box_vendors <?php echo $span;?>" group="vendor">
    <input type="hidden" name="vendors[]" value="0" />
    <div class="head"><?php print \JText::_('VENDORS')?></div>

    <?php if ($show_vendors=='1'){?>
        <div class="filters-lists <?php echo modJshopping_filters_extendedHelper::addScrollingClass($filter_vendors, $params->get('filter_scrolling_number_vendors', 0)); ?>">
            <?php print $inputCore->getCheckboxs('vendors[]', $filter_vendors, $vendors); ?>
        </div>
    <?php }elseif($show_vendors=='2'){?>
        <?php print $inputCore->getSelect('vendors[]', $filter_vendors, $vendors); ?> 
    <?php }?>         
</div>
<?php }?>