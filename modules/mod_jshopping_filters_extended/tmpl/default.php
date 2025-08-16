<?php 
$filter_all = array();
$filter_all[] = JHTML::_('select.option',  '', JText::_('JALL'), 'id', 'name' );
if (!isset($GLOBALS['filter_number'])){
    $GLOBALS['filter_number'] = 1;
    $filter_number = $GLOBALS['filter_number'];
}else{
    $GLOBALS['filter_number']++;
    $filter_number = $GLOBALS['filter_number'];
}
$filter_scrolling_number = $filter_number;
?>
<script type="text/javascript">
var mod_jfilter_ext_params = mod_jfilter_ext_params || {};
mod_jfilter_ext_params['uri_base'] = '<?php print JUri::base()?>';
mod_jfilter_ext_params['ajax_view'] = <?php print (int)$ajax_view;?>;
mod_jfilter_ext_params['get_filter_only_url'] = <?php print (int)$get_filter_only_url;?>;
mod_jfilter_ext_params['auto_submit'] = <?php print (int)$auto_submit;?>;
mod_jfilter_ext_params['show_prices_slider'] = <?php print (int)($show_prices_slider && ($maxminPrices['count']>1));?>;
mod_jfilter_ext_params['slider_min_price'] = <?php echo (isset($maxminPrices) ? $maxminPrices['min_price'] : 0);?>;
mod_jfilter_ext_params['slider_max_price'] = <?php echo (isset($maxminPrices) ? $maxminPrices['max_price'] : 0);?>;
mod_jfilter_ext_params['slider_min_price_active'] = <?php echo $min_price ?? 0;?>;
mod_jfilter_ext_params['slider_max_price_active'] = <?php echo $max_price ?? 0;?>;
mod_jfilter_ext_params['dependent_characteristic'] = <?php echo (int)$dependent_characteristic;?>;
mod_jfilter_ext_params['currency_code'] = '<?php echo $jshopConfig->currency_code;?>';
mod_jfilter_ext_params['show_filter_active'] = '<?php echo $show_filter_active?>';

</script>
<?php
$folder = __DIR__.'/default/';
$inputCore->setFolder(__DIR__);
$inputCore->set('filter_number', $filter_number);
?>

<div class="jshop_filters" data-scrolling-number="<?php echo $filter_scrolling_number;?>">
    <?php if ($button_to_open == 1) : ?>   
        <div class="btn-filter-out btn btn-filter btn-secondary dropdown-toggle"><?php print JText::_('Filters')?></div>
    <?php endif; ?>
    <form action="<?php echo $form_action;?>" method="<?php print $form_method?>" name="jshop_filters_<?php print $filter_number?>" id="jshop_filters_<?php print $filter_number?>" class="<?php echo ($button_to_open == 1) ? 'none-mobile' : '' ?>">

        <?php if ($show_filter_active == '1') { ?>
            <div class="fblock filter_active_vals filter_active_vals_js" nr="<?php echo $filter_scrolling_number;?>">
                <div class="inner"></div>
                <div class="clear_all">
                    <a>
                        <div><?php echo \JText::_('RESET_FILTER');?></div>
                        <div class="x filter_active_vals__close">✖</div>
                    </a>
                </div>
            </div>
        <?php } ?>

        <div class="list_fblock <?php if ($show_dropdown_list) {?> dropdown_list <? } if ($show_horizontal) {?> row-fluid horizontal-list <?php }?>">

            <?php if ($params->get('btn_control_top', 0)){?>
                <div class="fblock controls controls_top <?php echo $span;?>">
                    <button class="btn btn-success btn-go mb-2" onclick="jshop_filters_submit(<?php print $filter_number?>,true);return false;"><?php print \JText::_('GO')?></button>
                    <button class="btn btn-primary clear_filter_mod mb-2" onclick="modFilterclearAll(<?php print $filter_number?>);return false;"><?php print \JText::_('RESET_FILTER')?></button>
                </div>
            <?php }?>

            <?php foreach ($filter_order as $v_order) {
                include $folder.$v_order.'.php';
            } ?>
            
            <?php if ($params->get('btn_control_bottom', 1)){?>
                <div class="fblock controls controls_bottom <?php echo $span;?>">
                    <button class="btn btn-success btn-go mb-2" onclick="jshop_filters_submit(<?php print $filter_number?>,true);return false;"><?php print JText::_('GO')?></button>
                    <button class="btn btn-primary clear_filter_mod mb-2" onclick="modFilterclearAll(<?php print $filter_number?>);return false;"><?php print JText::_('RESET_FILTER')?></button>
                </div>
            <?php }?>
        
        </div>
        <input type="hidden" name="efilter" value="<?php print $filter_number?>">
    </form>
</div>
