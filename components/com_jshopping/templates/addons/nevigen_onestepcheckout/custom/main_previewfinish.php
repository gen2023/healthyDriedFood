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

/** @var \Joomla\CMS\Form\Form $form_address */
$form_address = $this->form_address;
?>

<div class="nevigen-onestepcheckout-previewfinish" data-nevigen-onestepcheckout="previewfinish">
	<?php echo (isset($this->_tmp_ext_html_previewfinish_start)) ? $this->_tmp_ext_html_previewfinish_start : '' ?>
	<div class="checkoutinfo">
		<div class="nevigen-onestepcheckout_finish_comment_block_add">
			<label for="order_add_info"><?php echo Text::_('TPL_CUSTOM_PAGE_CHECKOUT_TITLE_COMMENT'); ?></label>
			<div class="nevigen-onestepcheckout_finish_comment_block_add_textarea">
				<textarea class="form-control" id="order_add_info" name="order_add_info"
					placeholder="<?= Text::_('TPL_CUSTOM_PAGE_CHECKOUT_TITLE_COMMENT_PLACEHOLDER') ?>"></textarea>
			</div>
		</div>
		<?php if (!empty($privacy_statement = $form_address->getInput('privacy_statement'))): ?>
			<div class="row row-cols-auto mt-2">
				<div class="col-1">
					<?php echo $privacy_statement; ?>
				</div>
				<div class="col">
					<a class="nevigen-onestepcheckout-privacy-statement policy text-reset" data-bs-toggle="modal"
						href="#onestep_privacy_statement">
						<?php echo Text::_('JSHOP_PRIVACY_STATEMENT'); ?>
					</a>
				</div>
			</div>
		<?php endif; ?>
		<?php /* if ($this->jshopConfig->display_agb): ?>
			<div class="mt-2">
				<input type="checkbox" class="form-check-input me-1" name="agb" id="agb-chcbx" required />
				<label class="form-check-label" for="agb-chcbx">
					<a class="nevigen-onestepcheckout-agb text-reset" data-bs-toggle="modal" href="#onestep_agb">
						<?php echo Text::_('JSHOP_AGB'); ?>
					</a>
					<?php echo Text::_('JSHOP_AND'); ?>
					<a class="nevigen-onestepcheckout-policy-return text-reset" data-bs-toggle="modal" href="#return_policy">
						<?php echo Text::_('JSHOP_RETURN_POLICY') ?>
					</a>
					<?php echo Text::_('JSHOP_CONFIRM'); ?>
				</label>
			</div>
		<?php endif; */?>
		<?php if ($this->no_return): ?>
			<div class="nevigen-onestepcheckout_finish_comment_block mt-1">
				<div class="row_no_return text-danger">
					<input type="checkbox" class="form-check-input me-1" name="no_return" id="no_return" reqired />
					<label class="form-check-label" for="no_return"><?php echo Text::_('JSHOP_NO_RETURN_DESCRIPTION'); ?></label>
				</div>
			</div>
		<?php endif; ?>
		<?php echo (isset($this->_tmp_ext_html_previewfinish_agb)) ? $this->_tmp_ext_html_previewfinish_agb : '' ?>
	</div>
	<div class="block_infoPrice_checkout">
		<?php if (!$this->hide_subtotal): ?>
			<div class="row lead">
				<div class="col">
					<div class="nevigen-onestepcheckout-cart-label">
						<?php echo Text::_('TPL_CUSTOM_PAGE_CHECKOUT_SUBTOTAL'); ?>:
					</div>
				</div>
				<div class="col-auto text-end">
					<?php echo \JSHelper::formatprice($this->summ); ?>
					<?php echo (isset($this->_tmp_ext_subtotal)) ? $this->_tmp_ext_subtotal : '' ?>
				</div>
			</div>
		<?php endif; ?>
		<?php if (isset($this->_tmp_html_after_subtotal))
			echo $this->_tmp_html_after_subtotal; ?>
		<?php if ($this->discount > 0): ?>
			<div class="row text-success">
				<div class="col">
					<div class="nevigen-onestepcheckout-cart-label">
						<?php echo Text::_('JSHOP_RABATT_VALUE'); ?>
					</div>
				</div>
				<div class="col-auto text-end">
					<?php echo '-' . \JSHelper::formatprice($this->discount); ?>
					<?php echo (isset($this->_tmp_ext_discount)) ? $this->_tmp_ext_discount : '' ?>
				</div>
			</div>
		<?php endif; ?>
		<?php if (isset($this->summ_delivery)): ?>
			<div class="row">
				<div class="col">
					<div class="nevigen-onestepcheckout-cart-label">
						<?php echo Text::_('JSHOP_SHIPPING_PRICE'); ?>
					</div>
				</div>
				<div class="col-auto text-end">
					<?php echo Text::_('TPL_CUSTOM_DELIVERY_NULL_TEXT'); ?>
				</div>
			</div>
			<?php if ($this->jshopConfig->summ_null_shipping > 0 && $this->summ_delivery > 0): ?>
				<div class="nevigen-onestepcheckout-shipping-free small text-success text-end">
					<?php printf(JText::_('JSHOP_FROM_PRICE_SHIPPING_FREE'), \JSHelper::formatprice($this->jshopConfig->summ_null_shipping, null, 1)); ?>
				</div>
			<?php endif; ?>
		<?php endif; ?>

		<?php if (isset($this->summ_package)): ?>
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
		<?php if ($this->summ_payment > 0): ?>
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
		<?php if (!$this->jshopConfig->hide_tax && !empty($this->tax_list)): ?>
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
		<div class="row total_checkout">
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
	<?php if ($this->customer_register): ?>
		<div class="customer_register mt-4 mb-4 alert alert-warning">
			<div class="form-check form-switch">
				<input type="checkbox" name="customer_register" id="customer_register" class="form-check-input" value="1">
				<label class="form-check-label" for="customer_register">
					<?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_CUSTOMER_REGISTER') ?>
					<i class="ms-2 icon-info-circle hasTooltip"
						title="<?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_CUSTOMER_REGISTER_DESC') ?>"
						data-bs-placement="top"></i>
				</label>
			</div>
		</div>
	<?php endif; ?>
	<?php echo (isset($this->_tmp_ext_html_previewfinish_end)) ? $this->_tmp_ext_html_previewfinish_end : '' ?>
	<div class="nevigen-onestepcheckout-finish mt-4">
		<button class="btn btn-success icon-cart">
			<?php echo Text::_('TPL_CUSTOM_PAGE_CHECKOUT_ORDER_FINISH') ?>
		</button>
	</div>
</div>
<?php /*
<script>
	const total = <?= $this->fullsumm ?>;
	const btn = document.querySelector('.nevigen-onestepcheckout-finish button');
	const minorder = document.querySelector('.minorder-js');

	if (total < 300) {
		btn.classList.add('disabled');
		btn.disabled = true;
		minorder.classList.add('active');
	} else {
		btn.disabled = false;
		btn.classList.remove('disabled');
		minorder.classList.remove('active');
	}

</script>
*/?>