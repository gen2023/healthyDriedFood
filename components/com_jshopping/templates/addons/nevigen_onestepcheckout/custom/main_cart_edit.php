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
<div id="nevigenOneStepCheckoutCartEditModal" class="modal fade" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">
					<?php echo Text::_('JSHOP_CART'); ?>
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
				        data-nevigen-onestepcheckout-cart-edit="close"
				        aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div data-nevigen-onestepcheckout-cart-edit="message"></div>
				<div data-nevigen-onestepcheckout-cart-edit="products">
					<?php foreach ($this->products as $key => $product):
						$image = ($product['thumb_image']) ? $product['thumb_image'] : $this->no_image;
						$image = $this->image_product_path . '/' . $image;
						?>
						<div class="row mb-2 border-bottom align-items-center"
						     data-nevigen-onestepcheckout-cart-edit="product"
						     data-key="<?php echo $key; ?>">
							<div class="col-12 col-md-5 mb-2">
								<div class="row align-items-center">
									<div class="col col-lg-4 col-md-2">
										<a  href="<?php echo $product['href'] ?>">
											<img class="nevigen-onestepcheckout-edit-cart-product-image" src="<?php echo $image; ?>"
											     alt="<?php echo htmlspecialchars($product['product_name']); ?>"/>
										</a>
									</div>
									<div class="col col-lg-8 col-md-4">
										<div class="row">
											<a class="text-reset" href="<?php echo $product['href'] ?>">
												<?php echo $product['product_name']; ?>
												<?php if ($this->jshopConfig->show_product_code_in_cart) : ?>
													<span class="jshop_code_prod">(<?php echo $product['ean'] ?>)</span>
												<?php endif; ?>
											</a>
										</div>
										<div class="row small fw-lighter lh-sm">
											<?php if (!empty($product['manufacturer'])) : ?>
												<div class="manufacturer">
													<?php echo Text::_('JSHOP_MANUFACTURER') ?>:
													<span><?php echo $product['manufacturer'] ?></span>
												</div>
											<?php endif; ?>
											<?php if ($this->jshopConfig->manufacturer_code_in_cart && $product['manufacturer_code']) : ?>
												<div class="manufacturer_code">
													<?php echo Text::_('JSHOP_MANUFACTURER_CODE') ?>
													: <span><?php echo $product['manufacturer_code'] ?></span>
												</div>
											<?php endif; ?>
											<?php echo \JSHelper::sprintAtributeInCart($product['attributes_value']); ?>
											<?php echo \JSHelper::sprintFreeAtributeInCart($product['free_attributes_value']); ?>
											<?php echo \JSHelper::sprintFreeExtraFiledsInCart($product['extra_fields']); ?>
											<?php if ($this->jshopConfig->show_delivery_time_step5 && $product['delivery_times_id']) : ?>
												<div class="deliverytime">
													<?php echo Text::_('JSHOP_DELIVERY_TIME') ?>:
													<?php echo $this->deliverytimes[$product['delivery_times_id']] ?>
												</div>
											<?php endif; ?>
										</div>
									</div>
								</div>
							</div>
							<div class="col-12 col-md-7">
								<div class="row align-items-center">
									<div class="col-3 small"
										 data-nevigen-onestepcheckout-cart-edit-product-price="<?php echo $key ?>">
										<?php echo \JSHelper::formatprice($product['price']) ?>
									</div>
									<div class="col-4">
										<div class="input-group input-group-sm"
										     data-nevigen-onestepcheckout-cart-edit-quantity-container>
											<button class="btn btn-secondary btn-sm m-0"
											        data-nevigen-onestepcheckout-cart-edit-quantity="-"
											        data-product="<?php echo $key ?>">-
											</button>
											<input type="text" name="quantity[<?php echo $key ?>]"
											       value="<?php echo $product['quantity'] ?>"
											       data-nevigen-onestepcheckout-cart-edit-quantity-input="<?php echo $key ?>"
											       class="form-control text-center form-sm">
											<button class="btn btn-secondary btn-sm m-0"
											        data-nevigen-onestepcheckout-cart-edit-quantity="+"
											        data-product="<?php echo $key ?>">+
											</button>
										</div>
									</div>
									<div class="col-4">
										<div class="text-end fw-bold"
										     data-nevigen-onestepcheckout-cart-edit-product-sum="<?php echo $key ?>">
											<?php echo \JSHelper::formatprice($product['price'] * $product['quantity']); ?>
										</div>
									</div>
									<div class="col-1">
										<button class="btn btn-light text-danger btn-sm"
										        onclick="window.NevigenOneStepCheckout().cartEditRemoveProduct(<?php echo $key; ?>)">
											<i class="icon-remove"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
			<?php if (!empty($this->products)): ?>
				<div class="modal-footer fs-4">
					<div>
						<?php echo Text::_('JSHOP_PRICE_TOTAL') ?>
					</div>
					<div class="nevigen-jshop-cart-cart-sum" data-nevigen-onestepcheckout-cart-edit="total">
						<?php echo \JSHelper::formatprice($this->summ); ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
<script>
	let nevigenOneStepCheckoutCartEditModal = document.getElementById('nevigenOneStepCheckoutCartEditModal');
	nevigenOneStepCheckoutCartEditModal.addEventListener('hidden.bs.modal', event => {
		window.NevigenOneStepCheckout().reloadScrollPage();
	})

</script>
