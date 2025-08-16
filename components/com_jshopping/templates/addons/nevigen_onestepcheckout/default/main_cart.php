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
			<div class="card-title">
				<?php echo Text::_('JSHOP_CART'); ?>
			</div>
			<button type="button" class="btn btn-link text-reset small d-flex align-items-center"
			        data-bs-toggle="modal" data-bs-target="#nevigenOneStepCheckoutCartEditModal">
				<i class="icon-edit"></i><?php echo Text::_('JGLOBAL_EDIT');?>
			</button>
		</div>
		<div class="card-body">
			<?php foreach ($this->products as $product): ?>
				<div class="row d-flex align-items-center nevigen-onestepcheckout-cart-product-row">
					<div class="col">
						<div class="small">
							<div class="nevigen-onestepcheckout-cart-product-name"><?php echo $product['product_name'] ?></div>
							<?php if ($this->jshopConfig->show_product_code_in_cart) : ?>
								<span class="jshop_code_prod_incart">(<?php echo $product['ean'] ?>)</span>
							<?php endif; ?>
							<div class="nevigen-onestepcheckout-product-info">
								<?php if (!empty($product['manufacturer'])) : ?>
									<div class="manufacturer_incart"><?php echo Text::_('JSHOP_MANUFACTURER') ?>:
										<span><?php echo $product['manufacturer'] ?></span>
									</div>
								<?php endif; ?>
								<?php echo \JSHelper::sprintAtributeInCart($product['attributes_value']); ?>
								<?php echo \JSHelper::sprintFreeAtributeInCart($product['free_attributes_value']); ?>
								<?php echo \JSHelper::sprintFreeExtraFiledsInCart($product['extra_fields']); ?>
								<?php echo (isset($product['_ext_attribute_html'])) ? $product['_ext_attribute_html'] : '' ?>
								<?php if ($this->jshopConfig->show_delivery_time_step5 && $product['delivery_times_id']) : ?>
									<div class="deliverytime_incart">
										<?php echo Text::_('JSHOP_DELIVERY_TIME') ?>
										: <?php echo $this->deliverytimes[$product['delivery_times_id']] ?>
									</div>
								<?php endif; ?>
							</div>
						</div>
					</div>
					<div class="col">
						<div class="text-muted small">
							<span>
								<?php echo $product['quantity'] ?><?php echo (isset($product['_qty_unit']))
									? $product['_qty_unit'] : ''; ?>
							</span>
							<span> x </span>
							<span>
								<?php echo \JSHelper::formatprice($product['price']) ?>
								<?php echo (isset($product['_ext_price_html'])) ? $product['_ext_price_html'] : '' ?>
								<?php if ($this->jshopConfig->show_tax_product_in_cart && $product['tax'] > 0) : ?>
									<span
										class="taxinfo"><?php echo \JSHelper::productTaxInfo($product['tax']); ?></span>
								<?php endif; ?>
							</span>
						</div>
					</div>
					<div class="col-auto text-end text-nowrap">
						<?php echo \JSHelper::formatprice($product['price'] * $product['quantity']); ?>
						<?php echo (isset($product['_ext_price_total_html'])) ? $product['_ext_price_total_html'] : '' ?>
						<?php if ($this->jshopConfig->show_tax_product_in_cart && $product['tax'] > 0) : ?>
							<span class="taxinfo"><?php echo \JSHelper::productTaxInfo($product['tax']); ?></span>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
		<hr class="m-0">
		<div class="card-body">
			<?php if (!$this->hide_subtotal) : ?>
				<div class="row lead">
					<div class="col">
						<div class="nevigen-onestepcheckout-cart-label">
							<?php echo Text::_('JSHOP_SUBTOTAL'); ?>
						</div>
					</div>
					<div class="col-auto text-end">
						<?php echo \JSHelper::formatprice($this->summ); ?>
						<?php echo (isset($this->_tmp_ext_subtotal)) ? $this->_tmp_ext_subtotal : '' ?>
					</div>
				</div>
			<?php endif; ?>
			<?php if (isset($this->_tmp_html_after_subtotal)) echo $this->_tmp_html_after_subtotal;?>
			<?php if ($this->discount > 0) : ?>
				<div class="row text-success">
					<div class="col">
						<div class="nevigen-onestepcheckout-cart-label">
							<?php echo Text::_('JSHOP_RABATT_VALUE'); ?>
						</div>
					</div>
					<div class="col-auto text-end">
						<?php echo '-'.\JSHelper::formatprice($this->discount); ?>
						<?php echo (isset($this->_tmp_ext_discount)) ? $this->_tmp_ext_discount : '' ?>
					</div>
				</div>
			<?php endif; ?>
			<?php if (isset($this->summ_delivery)) : ?>
				<div class="row">
					<div class="col">
						<div class="nevigen-onestepcheckout-cart-label">
							<?php echo Text::_('JSHOP_SHIPPING_PRICE'); ?>
						</div>
					</div>
					<div class="col-auto text-end">
						<?php echo \JSHelper::formatprice($this->summ_delivery); ?>
						<?php echo (isset($this->_tmp_ext_shipping)) ? $this->_tmp_ext_shipping : '' ?>
					</div>
				</div>
				<?php if ($this->jshopConfig->summ_null_shipping > 0 && $this->summ_delivery > 0) : ?>
					<div class="nevigen-onestepcheckout-shipping-free small text-success text-end">
						<?php printf (JText::_('JSHOP_FROM_PRICE_SHIPPING_FREE'), \JSHelper::formatprice($this->jshopConfig->summ_null_shipping, null, 1));?>
					</div>
				<?php endif; ?>
			<?php endif; ?>
			
			<?php if (isset($this->summ_package)) : ?>
				<div class="row">
					<div class="col">
						<div class="nevigen-onestepcheckout-cart-label">
							<?php echo Text::_('JSHOP_PACKAGE_PRICE'); ?>
						</div>
					</div>
					<div class="col-auto text-end">
						<?php echo \JSHelper::formatprice($this->summ_package); ?>
						<?php echo (isset($this->_tmp_ext_shipping_package)) ? $this->_tmp_ext_shipping_package : '' ?>
					</div>
				</div>
			<?php endif; ?>
			<?php if ($this->summ_payment > 0) : ?>
				<div class="row">
					<div class="col">
						<div class="nevigen-onestepcheckout-cart-label">
							<?php echo $this->payment_name; ?>
						</div>
					</div>
					<div class="col-auto text-end">
						<?php echo \JSHelper::formatprice($this->summ_payment); ?>
						<?php echo (isset($this->_tmp_ext_payment)) ? $this->_tmp_ext_payment : '' ?>
					</div>
				</div>
			<?php endif; ?>
			<?php if (!$this->jshopConfig->hide_tax && !empty($this->tax_list)) : ?>
				<?php foreach ($this->tax_list as $percent => $value): ?>
					<div class="row small text-muted">
						<div class="col">
							<div class="nevigen-onestepcheckout-cart-label">
								<?php echo \JSHelper::displayTotalCartTaxName(); ?>
								<?php echo ($this->show_percent_tax) ? \JSHelper::formattax($percent) . '%' : ''; ?>
							</div>
						</div>
						<div class="col-auto text-end">
							<?php echo \JSHelper::formatprice($value); ?>
							<?php echo (isset($this->_tmp_ext_tax[$percent])) ? $this->_tmp_ext_tax[$percent] : '' ?>
						</div>
					</div>
				<?php endforeach; ?>
			<?php endif; ?>
			<div class="row lead fw-bold">
				<div class="col">
					<div class="nevigen-onestepcheckout-cart-label">
						<?php echo $this->text_total; ?>
					</div>
				</div>
				<div class="col-auto text-end">
					<?php echo \JSHelper::formatprice($this->fullsumm); ?>
					<?php echo (isset($this->_tmp_ext_total)) ? $this->_tmp_ext_total : '' ?>
				</div>
			</div>
		</div>
			<?php if ($this->jshopConfig->use_rabatt_code): ?>
				<div class="nevigen-onestepcheckout-cart-rabbat ps-2 pe-2">
					<div class="input-group">
						<input type="text" class="form-control form-control-sm" name="rabatt"
							   placeholder="<?php echo Text::_('JSHOP_RABATT') ?>"
							   aria-label="<?php echo Text::_('JSHOP_RABATT') ?>"
							   aria-describedby="button-rabbat">
						<button class="btn btn-sm btn-info"
								type="button"
								onclick="NevigenOneStepCheckout().cartRabbat();return false;">
							<?php echo Text::_('JSHOP_RABATT_ACTIVE') ?>
						</button>
					</div>
				</div>
			<?php endif; ?>

		<hr class="mb-2">
		<div class="card-body">
			<?php echo $this->loadTemplate('previewfinish');?>
		</div>
	</div>
</div>