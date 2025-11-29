<?php 
$mm_ch_slider = modJshopping_filters_extendedHelper::getMinMaxCharactiristicSlider($ch->values);
$min = $mm_ch_slider['min'];
$max = $mm_ch_slider['max'];
$slNr = $ch->id;
?>
<div class="ch_slider ch_slider_nr_<?php print $slNr?>" nr="<?php print $slNr?>" slmin="<?php echo $min;?>" slmax="<?php echo $max;?>" sstep="1"
    group_name="<?php echo htmlspecialchars($ch->name)?>" gid="<?php print $slNr?>"
>
    <div class="filter-price-block">
        <div class="block-slider-range">
            <div class="amount"><?php echo $min;?> - <?php echo $max;?></div>
            <div id="slider-range<?php print $slNr?>"></div>
        </div>
    </div>
    <input type="hidden" name="extra_fields_sl[<?php echo $slNr?>][min]" value="<?php echo $extra_fields_sl[$slNr]['min'] ?? ''?>">
    <input type="hidden" name="extra_fields_sl[<?php echo $slNr?>][max]" value="<?php echo $extra_fields_sl[$slNr]['max'] ?? ''?>">
</div>