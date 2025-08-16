<?php if (isset($filter_manufactures) && is_array($filter_manufactures) && count($filter_manufactures)) {?>
<div class="fblock box_manufacrurer<?php echo $span;?>" group="manufacturer" show_group_name="0">
    <input type="hidden" name="manufacturers[]" value="0" />
    <div class="head"><?php print \JText::_('MANUFACTURER')?></div>        
    
    <?php if ($show_manufacturers=='1'){?>
        <div class="filters-lists <?php echo modJshopping_filters_extendedHelper::addScrollingClass($filter_manufactures, $params->get('filter_scrolling_number_manufacturer', 0)); ?>">
            <?php print $inputCore->getCheckboxs('manufacturers[]', $filter_manufactures, $manufacturers, $show_manufacturer_img ? 'manufacturer_logo' : '', $jshopConfig->image_manufs_live_path); ?>
        </div>
    <?php }elseif($show_manufacturers=='2'){?>
        <?php print $inputCore->getSelect('manufacturers[]', $filter_manufactures, $manufacturers); ?>        
    <?php }?>    

</div>
<?php }?>