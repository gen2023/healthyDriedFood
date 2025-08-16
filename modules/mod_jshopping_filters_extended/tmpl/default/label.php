<?php if (isset($listLabels) && is_array($listLabels) && count($listLabels)){?>  
<div class="fblock filter_labels<?php echo $span;?>" group="label">
    <input type="hidden" name="labels[]" value="0" /> 
    <div class="head"><?php print \JText::_('LABEL')?></div>
        
    <?php if ($show_labels=='1'){?>
        <div class="filters-lists <?php print modJshopping_filters_extendedHelper::addScrollingClass($listLabels, $params->get('filter_scrolling_number_labels', 0))?>">
            <?php print $inputCore->getCheckboxs('labels[]', $listLabels, $labels_active, $show_labels_img ? 'image' : '', $jshopConfig->image_labels_live_path); ?>
        </div>
    <?php }elseif($show_labels=='2'){ ?>
        <?php print $inputCore->getSelect('labels[]', $listLabels, $labels_active); ?>
    <?php }?>
</div>
<?php } ?>   