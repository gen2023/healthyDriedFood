<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

?>

<div class="nevigen-onestepcheckout-cart" data-nevigen-onestepcheckout="cart">
	<div class="card">
		<div class="card-header d-flex align-content-center justify-content-between">
			<div class="title_block">
				<span class="number_ster">4</span>
				<span class="name_step"><?= Text::_('TPL_CUSTOM_TITLE_CHECKOUT_PAGE_CART_TITLE'); ?></span>
			</div>
			<?php /*<button type="button" class="btn btn-link text-reset small d-flex align-items-center"
		data-bs-toggle="modal" data-bs-target="#nevigenOneStepCheckoutCartEditModal">
<i class="icon-edit"></i><?php echo Text::_('JGLOBAL_EDIT');?>
</button>*/ ?>
		</div>
		<div class="card-body">
			<?php foreach ($this->products as $product): ?>
				<div class="row d-flex align-items-center nevigen-onestepcheckout-cart-product-row">
					<div class="col">
						<div class="small">
							<div class="content_small">
								<div class="nevigen-onestepcheckout-cart-product-image">
									<a class="product_link" href="<?php print $product['product_link'] ?>">
										<img class="jshop_img"
											src="/components/com_jshopping/files/img_products/<?php print $product['thumb_image'] ?>"
											alt="<?php print htmlspecialchars($product['product_name']); ?>"
											title="<?php print htmlspecialchars($product['product_name']); ?>" />
									</a>
								</div>
								<div class="info">
									<div class="block_info">
										<div class="nevigen-onestepcheckout-cart-product-name">
											<a class="product_link" href="<?php print $product['product_link'] ?>">
												<?php echo $product['product_name'] ?>
											</a>
										</div>
										<div class="nevigen-onestepcheckout-product-info">
											<?php if (!empty($product['manufacturer'])): ?>
												<div class="manufacturer_incart"><?php echo Text::_('JSHOP_MANUFACTURER') ?>:
													<span><?php echo $product['manufacturer'] ?></span>
												</div>
											<?php endif; ?>
											<?php echo \JSHelper::sprintAtributeInCart($product['attributes_value']); ?>
											<?php echo \JSHelper::sprintFreeAtributeInCart($product['free_attributes_value']); ?>
											<?php echo \JSHelper::sprintFreeExtraFiledsInCart($product['extra_fields']); ?>
											<?php echo (isset($product['_ext_attribute_html'])) ? $product['_ext_attribute_html'] : '' ?>
											<?php if ($this->jshopConfig->show_delivery_time_step5 && $product['delivery_times_id']): ?>
												<div class="deliverytime_incart">
													<?php echo Text::_('JSHOP_DELIVERY_TIME') ?>
													: <?php echo $this->deliverytimes[$product['delivery_times_id']] ?>
												</div>
											<?php endif; ?>
											<?php if ($this->jshopConfig->show_product_code_in_cart): ?>
												<span class="jshop_code_prod_incart">(<?php echo $product['ean'] ?>)</span>
											<?php endif; ?>
										</div>
									</div>
									<div class="price_block">
										<div class="quantiti_price">
											<span>
												<?php echo $product['quantity'] ?> 	<?php echo (isset($product['_qty_unit']))
																? $product['_qty_unit'] : ''; ?>
											</span>
											<span> x </span>
											<span>
												<?php echo \JSHelper::formatprice($product['price']) ?>
												<?php echo (isset($product['_ext_price_html'])) ? $product['_ext_price_html'] : '' ?>
												<?php if ($this->jshopConfig->show_tax_product_in_cart && $product['tax'] > 0): ?>
													<span class="taxinfo"><?php echo \JSHelper::productTaxInfo($product['tax']); ?></span>
												<?php endif; ?>
											</span>
										</div>
										<div class="total">
											<?php echo \JSHelper::formatprice($product['price'] * $product['quantity']); ?>
											<?php echo (isset($product['_ext_price_total_html'])) ? $product['_ext_price_total_html'] : '' ?>
											<?php if ($this->jshopConfig->show_tax_product_in_cart && $product['tax'] > 0): ?>
												<span class="taxinfo"><?php echo \JSHelper::productTaxInfo($product['tax']); ?></span>
											<?php endif; ?>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
		<?php if ($this->jshopConfig->use_rabatt_code): ?>
			<div class="nevigen-onestepcheckout-cart-rabbat ps-2 pe-2">
				<label for="rabatt"><?php echo Text::_('JTPL_CUSTOM_LABEL_RABATT') ?></label>
				<div class="input-group">
					<input type="text" class="form-control form-control-sm" name="rabatt"
						placeholder="<?php echo Text::_('TPL_CUSTOM_LABEL_RABATT_PLACEHOLDER') ?>" aria-label="<?php echo Text::_('JSHOP_RABATT') ?>"
						aria-describedby="button-rabbat">
					<button class="btn btn-sm btn-info" type="button" onclick="NevigenOneStepCheckout().cartRabbat();return false;">
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
  						<path d="M11.7212 0.961301C11.3499 0.589524 10.747 0.589759 10.3752 0.961301L4.31744 7.0193L1.62503 4.32691C1.25325 3.95513 0.650609 3.95513 0.278832 4.32691C-0.0929441 4.69868 -0.0929441 5.30133 0.278832 5.6731L3.6442 9.03847C3.82997 9.22425 4.07357 9.31737 4.31718 9.31737C4.5608 9.31737 4.80463 9.22448 4.9904 9.03847L11.7212 2.30747C12.0929 1.93595 12.0929 1.33305 11.7212 0.961301Z" fill="white" style="fill:white;fill-opacity:1;"/>
					</svg>
					</button>
				</div>
			</div>
		<?php endif; ?>



		<div class="">
			<?php echo $this->loadTemplate('previewfinish'); ?>
		</div>
	</div>
</div>