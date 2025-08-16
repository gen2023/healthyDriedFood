<?php
/*
 * @package    Nevigen JShop Recently Viewed Products Package
 * @version    1.0.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Registry\Registry;

/**
 * Template variables
 * -----------------
 *
 * @var  array     $products   Products.
 * @var   Registry $params Module params.
 * @var   object $jshopConfig jshop config object.
 * @var   string $noimage noimage path.
 */
?>
<div class="nevigen_jshop_recently_viewed_products jshop jshop_list_product">
	<div class="row gy-4">
		<?php foreach($products as $product): ?>
			<div class="col-md-3">
				<div class="card ">
					<?php echo $product->_tmp_var_start ?>
					<div class="block_item product_<?php echo $product->product_id?>">
						<?php if ($params->get('show_image') && $product->image): ?>
							<div class="image">
								<div class="image_block">
									<?php echo $product->_tmp_var_image_block; ?>
									<?php if($product->label_id && $params->get('show_image_label')): ?>
										<div class="product_label">
											<?php if($product->_label_image): ?>
												<img src="<?php echo $product->_label_image ?>" alt="<?php echo htmlspecialchars($product->_label_name) ?>" />
											<?php else: ?>
												<span class="label_name"><?php echo $product->_label_name; ?></span>
											<?php endif; ?>
										</div>
									<?php endif; ?>
									<a href="<?php echo $product->product_link ?>">
										<img class="jshop_img" src="<?php echo (!empty($product->image)) ? $product->image : $noimage ?>"
											 alt="<?php echo htmlspecialchars($product->name) ?>" />
									</a>
								</div>
							</div>
						<?php endif; ?>
						
						<div class="card-body info_product_<?php echo $product->product_id?>">
							<?php if($params->get('allow_review')): ?>
								<div class="row">
									<div class="col-6"><table class="review_mark"><tr><td><?php echo Helper::showMarkStar($product->average_rating); ?></td></tr></table></div>
									<div class="col-6 text-end count_commentar"><?php echo Text::sprintf('JSHOP_X_COMENTAR', $product->reviews_count); ?></div>
								</div>
							<?php endif; ?>


							<?php echo $product->_tmp_var_bottom_foto; ?>

							<div class="name">
								<a href="<?php echo $product->product_link ?>"><h3 class="card-title"><?php echo $product->name ?></h3></a>
								
								<?php if ($jshopConfig->product_list_show_product_code): ?>
									<span class="jshop_code_prod">(<?php echo Text::_('JSHOP_EAN_PRODUCT')?>: <span><?php echo $product->product_ean; ?></span>)</span>
								<?php endif; ?>
							</div>

							<?php if($params->get('short_description')): ?>
								<div class="description">
									<?php echo $product->short_description ?>
								</div>
							<?php endif; ?>

							<?php if ($product->manufacturer->name && $params->get('manufacturer_name')): ?>
								<div class="manufacturer_name"><?php echo Text::_('JSHOP_MANUFACTURER');?>: <span><?php echo $product->manufacturer->name ?></span></div>
							<?php endif; ?>

							<?php if ($product->product_quantity <= 0 && !$jshopConfig->hide_text_product_not_available && $params->get('product_quantity')): ?>
								<div class="not_available"><?php echo Text::_('JSHOP_PRODUCT_NOT_AVAILABLE');?></div>
							<?php endif; ?>

							<?php if ($params->get('product_old_price')): ?>
								<?php if ($product->product_old_price > 0 && $params->get('product_old_price')): ?>
									<div class="old_price"><?php if ($jshopConfig->product_list_show_price_description) echo Text::_('JSHOP_OLD_PRICE').": ";?><span><?php echo Helper::formatprice($product->product_old_price) ?></span></div>
								<?php endif; ?>
								<?php echo $product->_tmp_var_bottom_old_price; ?>
							<?php endif; ?>

							<?php if ($product->product_price_default > 0 && $jshopConfig->product_list_show_price_default && $params->get('product_price_default')): ?>
								<div class="default_price"><?php echo Text::_('JSHOP_DEFAULT_PRICE').": ";?><span><?php echo Helper::formatprice($product->product_price_default) ?></span></div>
							<?php endif; ?>

							<?php if ($params->get('display_price')): ?>
								<?php if ($product->_display_price && $params->get('display_price')): ?>
									<div class="jshop_price">
										<?php if ($jshopConfig->product_list_show_price_description) echo Text::_('JSHOP_PRICE').": ";?>
										<?php if ($product->show_price_from) echo Text::_('JSHOP_FROM')." ";?>
										<span><?php echo Helper::formatprice($product->product_price);?></span>
									</div>
								<?php endif; ?>
								<?php echo $product->_tmp_var_bottom_price; ?>
							<?php endif; ?>

							<?php if ($jshopConfig->show_tax_in_product && $product->tax > 0 && $params->get('show_tax_product')): ?>
								<span class="taxinfo"><?php echo Helper::productTaxInfo($product->tax);?></span>
							<?php endif; ?>

							<?php if ($jshopConfig->show_plus_shipping_in_product && $params->get('show_plus_shipping_in_product')): ?>
								<span class="plusshippinginfo">
									<?php echo Text::sprintf('JSHOP_PLUS_SHIPPING', Helper::SEFLink($jshopConfig->shippinginfourl,1));?></span>
							<?php endif; ?>

							<?php if ($product->basic_price_info['price_show'] && $params->get('basic_price_info')): ?>
								<div class="base_price"><?php echo Text::_('JSHOP_BASIC_PRICE')?>: <?php if ($product->show_price_from) echo Text::_('JSHOP_FROM');?> <span><?php echo Helper::formatprice($product->basic_price_info['basic_price'])?> / <?php echo $product->basic_price_info['name'];?></span></div>
							<?php endif; ?>

							<?php if ($jshopConfig->product_list_show_weight && $product->product_weight > 0 && $params->get('product_weight')): ?>
								<div class="productweight"><?php echo Text::_('JSHOP_WEIGHT')?>: <span><?php echo Helper::formatweight($product->product_weight)?></span></div>
							<?php endif; ?>

							<?php if ($product->delivery_time != '' && $params->get('delivery_time')): ?>
								<div class="deliverytime"><?php echo Text::_('JSHOP_DELIVERY_TIME')?>: <span><?php echo $product->delivery_time ?></span></div>
							<?php endif; ?>

							<?php if (is_array($product->extra_field) && $params->get('extra_field')): ?>
								<div class="extra_fields">
									<?php foreach($product->extra_field as $extra_field): ?>
										<div><?php echo $extra_field['name']; ?>: <?php echo $extra_field['value']; ?></div>
									<?php endforeach; ?>
								</div>
							<?php endif; ?>

							<?php if ($product->vendor && $params->get('vendor')): ?>
								<div class="vendorinfo"><?php echo Text::_('JSHOP_VENDOR')?>: <a href="<?php echo $product->vendor->products ?>"><?php echo $product->vendor->shop_name ?></a></div>
							<?php endif; ?>

							<?php if ($jshopConfig->product_list_show_qty_stock && $params->get('product_list_qty_stock')): ?>
								<div class="qty_in_stock"><?php echo Text::_('JSHOP_QTY_IN_STOCK')?>: <span><?php echo Helper::sprintQtyInStock($product->qty_in_stock) ?></span></div>
							<?php endif; ?>

							<?php if($params->get('show_button')): ?>
								<?php echo $product->_tmp_var_top_buttons; ?>

								<div class="buttons text-center mt-3">
									<?php if ($product->buy_link && $params->get('show_button_buy')): ?>
										<a class="btn btn-success button_buy mb-3" href="<?php echo $product->buy_link ?>"><?php echo Text::_('JSHOP_BUY')?></a> 
									<?php endif; ?>
									<?php if ($params->get('show_button_detal')): ?>
										<a class="btn btn-primary button_detail mb-3" href="<?php echo $product->product_link ?>"><?php echo Text::_('JSHOP_DETAIL')?></a>
									<?php endif; ?>
									<?php echo $product->_tmp_var_buttons; ?>
									<?php echo $product->_tmp_var_bottom_buttons; ?>
								</div>
							<?php endif; ?>
						</div>
					</div>
					<?php echo $product->_tmp_var_end ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</div>
