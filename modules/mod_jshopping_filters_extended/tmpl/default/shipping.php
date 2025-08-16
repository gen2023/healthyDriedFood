<?php if ($show_products_with_free_shipping_enabled){?>
    <div class="fblock show_shippings<?php echo $span;?>" group="products_with_free_shipping">
        <div class="head"><?php print \JText::_('MOD_FILTERS_EXTENDED_SHIPPING')?></div>
        <div class="filter_item">
            <label>
                <span class="label-checkbox"></span>
                <input type="hidden" value="0" name="show_products_with_free_shipping">
                <input type="checkbox" onclick="jshop_filters_submit(<?php print $filter_number?>);" value="1" name="show_products_with_free_shipping" <?php if ($show_products_with_free_shipping){?>checked<?php }?>>
                <?php print \JText::_('PRODUCTS_WITH_FREE_SHIPPING')?>        	
            </label>
        </div>
    </div>
<?php } ?>