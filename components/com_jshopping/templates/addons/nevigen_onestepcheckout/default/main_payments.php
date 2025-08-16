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

?>

<div class="nevigen-onestepcheckout_payment_block">
	<?php echo (isset($this->_tmp_ext_html_payment_start)) ? $this->_tmp_ext_html_payment_start : '' ?>
	<div data-nevigen-onestepcheckout="payment">
		<?php foreach ($this->payment_methods as $payment):
			$checked = '';
			if ($this->active_payment == $payment->payment_id)
			{
				$checked = 'checked';
			}
			?>
			<div class="payment_wrapper  <?php if ($checked) echo 'active' ?>"
				 data-nevigen-onestepcheckout-payment="<?php echo $payment->payment_class ?>">
				<div class="d-flex align-content-center">
					<div class="flex-shrink-1">
						<input type="radio" class="form-check-input" name="payment_method"
							   id="payment_method_<?php echo $payment->payment_id ?>"
							   value="<?php echo $payment->payment_class ?>"
							<?php echo $checked; ?>/>
					</div>
					<div class="w-100 ms-2">
						<label for="payment_method_<?php echo $payment->payment_id ?>" class="d-block">
							<div class="d-flex align-content-center justify-content-between">
								<div class="d-flex align-content-center  ">
									<?php if ($payment->image): ?>
										<div class="payment_image me-2">
											<img src="<?php echo $payment->image ?>"
												 alt="<?php echo htmlspecialchars($payment->name) ?>"/>
										</div>
									<?php endif; ?>
									<div class="nevigen-onestepcheckout-payment-name">
										<?php echo $payment->name; ?>
									</div>
								</div>
								<div>
									<?php if ($payment->price_add_text != '') : ?>
										<span class="nevigen-onestepcheckout_payment_cost"><?php echo $payment->price_add_text ?></span>
									<?php endif; ?>
								</div>
							</div>
						</label>
						<?php if ($checked): ?>
							<div class="paymform" id="tr_payment_<?php echo $payment->payment_class ?>">
								<div class="jshop_payment_method">
									<div class="small text-muted ms-3">
										<?php echo $payment->payment_description ?>
									</div>
									<?php echo $payment->form ?>
								</div>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php echo (isset($this->_tmp_ext_html_payment_end)) ? $this->_tmp_ext_html_payment_end : '' ?>
</div>
