<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

\defined('_JEXEC') or die;

?>
<table class="jshop">
	<?php if (!$this->jshopConfig->without_shipping): ?>
		<tr>
			<td>
				<div class="delivery_time text-end"
				     style="<?php echo (!$this->delivery_time) ? 'display: none;' : '' ?>">
					<strong><?php echo Text::_('JSHOP_DELIVERY_TIME') ?></strong>:
					<span><?php echo $this->delivery_time ?></span></div>
				<div class="delivery_date"
				     style="text-align: right; <?php echo (!$this->delivery_date) ? 'display: none;' : '' ?>">
					<strong><?php echo Text::_('JSHOP_DELIVERY_DATE') ?></strong>:
					<span><?php echo $this->delivery_date ?></span></div>
			</td>
		</tr>
	<?php endif; ?>
	<tr>
		<td>
			<?php if ($this->jshopConfig->hide_payment_step) : ?>
				<div class="text-end"
				     style="<?php echo (!$this->active_payment) ? ' display: none;' : '' ?>">
					<strong><?php echo Text::_('JSHOP_FINISH_PAYMENT_METHOD'); ?></strong>:
					<span><?php echo $this->active_payment_name ?></span></div>
			<?php endif; ?>
			<?php if ($this->jshopConfig->hide_shipping_step) : ?>
				<div class="text-end" style="<?php echo (!$this->active_shipping) ? ' display: none;' : '' ?>">
					<strong><?php echo Text::_('JSHOP_FINISH_SHIPPING_METHOD'); ?></strong>:
					<span><?php echo $this->active_shipping_name ?></span></div>
			<?php endif; ?>
		</td>
	</tr>
</table>
<?php echo $this->loadTemplate('login'); ?>
<form id="nevigenOneStepCheckout" name="nevigenOneStepCheckout" class="form"
      action="<?php echo $this->action ?>" method="post">
	<div class="row">
		<div class="col-md-8">
			<fieldset class="nevigenonestepcheckout_address_fieldset card bg-light card-body">
				<legend>
					<?php echo Text::_('JSHOP_STEP_ORDER_2'); ?>
				</legend>
				<div class="nevigenonestepcheckout_address">
					<?php echo $this->loadTemplate('address'); ?>
				</div>
			</fieldset>
			<?php if ((int)$this->jshopConfig->step_4_3 === 1) : ?>
				<?php if ($this->delivery_step) : ?>
					<fieldset class="nevigenonestepcheckout_shipping_fieldset card bg-light card-body">
						<legend class="mb-3">
							<?php echo Text::_('JSHOP_STEP_ORDER_4'); ?>
						</legend>
						<div class="nevigenonestepcheckout_shipping">
							<?php echo $this->loadTemplate('shipping'); ?>
						</div>
					</fieldset>
				<?php elseif (isset($this->active_sh_pr_method_id)) : ?>
					<input type="hidden" name="sh_pr_method_id" value="<?php echo $this->active_sh_pr_method_id; ?>"/>
				<?php endif; ?>
			<?php endif; ?>
			<?php if ($this->payment_step) : ?>
				<fieldset class="nevigenonestepcheckout_payments_fieldset card bg-light card-body">
					<legend class="mb-3">
						<?php echo Text::_('JSHOP_STEP_ORDER_3'); ?>
					</legend>
					<div class="nevigenonestepcheckout_payments">
						<?php echo $this->loadTemplate('payments'); ?>
					</div>
				</fieldset>
			<?php elseif (isset($this->active_payment_class)) : ?>
				<input type="hidden" name="payment_method" value="<?php echo $this->active_payment_class; ?>"/>
			<?php endif; ?>
			<?php if (empty($this->jshopConfig->step_4_3) || (int)$this->jshopConfig->step_4_3 === 0) : ?>
				<?php if ($this->delivery_step) : ?>
					<fieldset class="nevigenonestepcheckout_shipping_fieldset card bg-light card-body">
						<legend class="mb-3">
							<?php echo Text::_('JSHOP_STEP_ORDER_4'); ?>
						</legend>
						<div class="nevigenonestepcheckout_shipping">
							<?php echo $this->loadTemplate('shipping'); ?>
						</div>
					</fieldset>
				<?php elseif (isset($this->active_sh_pr_method_id)) : ?>
					<input type="hidden" name="sh_pr_method_id" value="<?php echo $this->active_sh_pr_method_id; ?>"/>
				<?php endif; ?>
			<?php endif; ?>
		</div>
		<div class="col-md-4">
			<div class="nevigenonestepcheckout_cart position-sticky" style="top: 20px">
				<?php echo $this->loadTemplate('cart'); ?>
			</div>
		</div>
	</div>
	<?php echo HTMLHelper::_('form.token'); ?>
</form>
<div class="nevigen-onestepcheckout-cart-edit" data-nevigen-onestepcheckout="cart_modal">
	<?php echo $this->loadTemplate('cart_edit'); ?>
</div>
<div data-nevigen-onestepcheckout="preloader"
     class="nevigen-onestepcheckout-preloader position-absolute top-0 start-0 w-100 h-100 "
     style="background:#fff; opacity: 0.6;display: none">
	<div class="bottom-50 end-50 position-fixed">
		<div class="spinner-border m-5" style="width: 5rem; height: 5rem;" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
</div>
<?php if (!empty($privacy_statement = $this->form_address->getInput('privacy_statement'))): ?>
	<div class="modal fade" id="onestep_privacy_statement" tabindex="-1" data-bs-backdrop="static" aria-labelledby="onestep_privacy_statement" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel"><?php echo Text::_('JSHOP_PRIVACY_STATEMENT'); ?></h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body jviewport-height50">
					<iframe class="w-100 h-100"
							src="<?php echo \JSHelper::SEFLink('index.php?option=com_jshopping&controller=content&task=view&page=privacy_statement&tmpl=component'); ?>" frameborder="0"></iframe>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>
<?php if ($this->jshopConfig->display_agb): ?>
	<div class="modal fade" id="onestep_agb" tabindex="-1" data-bs-backdrop="static" aria-labelledby="onestep_agb" aria-hidden="true">
		<div class="modal-dialog  modal-dialog-centered modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title"><?php echo Text::_('JSHOP_AGB'); ?></h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body jviewport-height50">
					<iframe class="w-100 h-100"
							src="<?php echo \JSHelper::SEFLink('index.php?option=com_jshopping&controller=content&task=view&page=agb&tmpl=component', 1); ?>" frameborder="0"></iframe>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>
<div class="modal fade" id="return_policy" tabindex="-1" data-bs-backdrop="static" aria-labelledby="return_policy" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title"><?php echo Text::_('JSHOP_RETURN_POLICY') ?></h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body jviewport-height50">
				<iframe class="w-100 h-100"
						src="<?php echo \JSHelper::SEFLink('index.php?option=com_jshopping&controller=content&task=view&page=return_policy&tmpl=component&cart=1', 1); ?>" frameborder="0"></iframe>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
			</div>
		</div>
	</div>
</div>
<script>
	window.addEventListener('load', function () {
		window.NevigenOneStepCheckout().reloadScrollPage(true);
	});
</script>
