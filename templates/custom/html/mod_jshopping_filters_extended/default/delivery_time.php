<?php if (isset($listDeliveryTimes) && is_array($listDeliveryTimes) && count($listDeliveryTimes)){?>    
<div class="fblock filter_delivery<?php echo $span;?>" group="delivery_time">
    <input type="hidden" name="delivery_times[]" value="0" />

    <div class="head"><?php print \JText::_('Delivery_Time')?></div> 

    <?php if ($show_delivery_time == '1'){ ?>
        <div class='filters-lists <?php print modJshopping_filters_extendedHelper::addScrollingClass($listDeliveryTimes, $params->get('filter_scrolling_number_delivery', 0))?>'>
            <?php print $inputCore->getCheckboxs('delivery_times[]', $listDeliveryTimes, $delivery_time_active); ?>
        </div>
    <?php }elseif($show_delivery_time == '2'){ ?>
        <?php print $inputCore->getSelect('delivery_times[]', $listDeliveryTimes, $delivery_time_active); ?>
    <?php }?>    
</div>
<?php } ?>