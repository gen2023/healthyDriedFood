<?php if (count($prices_list) || ($show_prices || ($show_prices_slider && $maxminPrices['count']>1)) || $show_products_with_old_prices_enabled ){?>
<div class="fblock show_price_detail<?php echo $span;?>" group="price">
	<?php if ($show_dropdown_list) {?>
		<div class="head"><?php print \JText::_('PRICE')?></div>
	<?php } ?>

	<div class="filter_item">
	<?php if (count($prices_list)) {?>
		<div class="price_head">
			<a href="#" onclick="modFilterclearPriceFilter(<?php print $filter_number?>);return false">
				<?php print JText::_('Any_price')?>
			</a>
			<?php foreach($prices_list as $pricesx){?>
				<div class="filter_price_between">
					<?php
					if ($pricesx[0]==$fprice_from && $pricesx[1]==$fprice_to){
						$style_price_select = "active";
					}else{
						$style_price_select = "";
					}
					?>
					<a href="#" class="<?php print $style_price_select?>" onclick="setFilterPrice('<?php print $pricesx[0]?>','<?php print $pricesx[1]?>', <?php print $filter_number?>);return false;"><?php print $pricesx[0]?> - <?php print $pricesx[1]?> <?php print $jshopConfig->currency_code?></a>
				</div>
			<?php } ?>
		</div>
		<?php if (!$show_prices && !($show_prices_slider && $maxminPrices['count']>1)){?>
			<input type="hidden" name="fprice_from" id="price_from" value="<?php if ($fprice_from>0) print $fprice_from?>" />
			<input type="hidden" name="fprice_to"  id="price_to" value="<?php if ($fprice_to>0) print $fprice_to?>" />			
		<?php }?>
	<?php }?>

	<?php if ($show_prices || ($show_prices_slider && $maxminPrices['count']>1)) {?>
	<div class="show_prices">
		<div class="head_group">
			<?php print \JText::_('PRICE')?> 
			<span class="box_price_currency_head"><?php print '('.$jshopConfig->currency_code.')'?></span>:
		</div>
		
		<?php if ($show_prices_slider && $maxminPrices['count'] > 1) {?>
			<div class="filter-price-block">
				<div class="block-slider-range">
					<div id="amount"></div>
					<div id="slider-range"></div>
				</div>
			</div>
		<?php }?>
		
		<?php if ($show_prices){?>
			<div class="filter-price-block">
				<span class="filter_price">		
					<span class="box_price_from">
						<span><?php print \JText::_('FROM')?></span>
						<input type = "text" class = "inputbox" name = "fprice_from" id="price_from" placeholder="<?php print \JText::_('FROM')?>" size="7" value="<?php if ($fprice_from>0) print $fprice_from?>" />
					</span>
					<span class="box_price_to">
						<span><?php print \JText::_('TO')?></span>
						<input type = "text" class = "inputbox" name = "fprice_to"  id="price_to" placeholder="<?php print \JText::_('TO')?>" size="7" value="<?php if ($fprice_to>0) print $fprice_to?>" />
					</span>
					<span class="box_price_currency">
						<?php print $jshopConfig->currency_code?>
					</span>
					<?php if ($show_price_button) {?>
						<span class="box_price_btn">						
							<button class="btn btn-success btn-go" onclick="jshop_filters_submit(<?php print $filter_number?>);return false;"><?php print \JText::_('GO')?></button>
						</span>
					<?php }?>
				</span>
			</div>
		<?php } else { ?>
			<input type = "hidden" name="fprice_from" id="price_from" value="<?php if ($fprice_from>0) print $fprice_from?>" />
			<input type = "hidden" name="fprice_to"  id="price_to" value="<?php if ($fprice_to>0) print $fprice_to?>" />
		<?php } ?>
		<?php if ($show_price_button) {?>
			<div class="filter-price-block">
				<div class="text-center my-2">
					<button class="btn btn-success btn-go" onclick="jshop_filters_submit(<?php print $filter_number?>);return false;"><?php print \JText::_('GO')?></button>
				</div>					
			</div>
		<?php }?>
	</div>
	<?php }?>

	<?php if ($show_products_with_old_prices_enabled){?>
		<div class="show_prices">
			<label>
				<input type="hidden" value="0" name="show_products_with_old_prices">
				<input type="checkbox" onclick="jshop_filters_submit(<?php print $filter_number?>);" value="1" name="show_products_with_old_prices" <?php if ($show_products_with_old_prices){?>checked<?php }?>>
				<span class="label-checkbox"></span>
				<?php print \JText::_('PRODUCTS_WITH_OLD_PRICES')?>
			</label>
		</div>
	<?php } ?>
	

	<div style="display:none" group_name_price_from="1"><?php print \JText::_('JSHOP_SEARCH_PRICE_FROM')?></div>
	<div style="display:none" group_name_price_to="1"><?php print \JText::_('JSHOP_SEARCH_PRICE_TO')?></div>
	</div>

</div>
<?php } ?>