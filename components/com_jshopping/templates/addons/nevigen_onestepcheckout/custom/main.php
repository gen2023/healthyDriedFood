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
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Helper\Helper;

$countprod = count($this->products);

$currency = \JSFactory::getTable('currency', 'jshop');

$currencis_list = $currency->getAllCurrencies('1');

$jshopConfig = \JSFactory::getConfig();   
$jshopConfig->loadCurrencyValue();

$minOrderValues = [
        '1' => 1000,
        '2' => 30,
    ];
    $minValuec = isset($minOrderValues[$jshopConfig->cur_currency]) ? $minOrderValues[$jshopConfig->cur_currency] : 0;

?>
<div class="checkoutPage">
<div class="container checkoutPage_container">
	<a class="back-link icon-prev mb15" href="<?= \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view'); ?>"><?= Text::_('TPL_CUSTOM_CHECKOUT_BTN_BACK') ?></a>
	<div class="flex between align-center mb30">
        <h1 class="ttl md"><?= JText::_('TPL_CUSTOM_TITLE_CHECKOUT_PAGE') ?></h1>
        <div class="min-order minorder-js">
            <div class="ico"></div>
            <div class="text"><?= JText::_('TPL_CUSTOM_MIN_ORDER_TEXT') ?> <?php echo $minValuec .' '. $jshopConfig->currency_code ?></div>
        </div>
    </div>	
	<table class="jshop">
		<?php if (!$this->jshopConfig->without_shipping): ?>
			<tr>
				<td>
					<div class="delivery_time text-end" style="<?php echo (!$this->delivery_time) ? 'display: none;' : '' ?>">
						<strong><?= Text::_('JSHOP_DELIVERY_TIME') ?></strong>:
						<span><?php echo $this->delivery_time ?></span>
					</div>
					<div class="delivery_date"
						style="text-align: right; <?php echo (!$this->delivery_date) ? 'display: none;' : '' ?>">
						<strong><?= Text::_('JSHOP_DELIVERY_DATE') ?></strong>:
						<span><?php echo $this->delivery_date ?></span>
					</div>
				</td>
			</tr>
		<?php endif; ?>
		<tr>
			<td>
				<?php if ($this->jshopConfig->hide_payment_step): ?>
					<div class="text-end" style="<?php echo (!$this->active_payment) ? ' display: none;' : '' ?>">
						<strong><?= Text::_('JSHOP_FINISH_PAYMENT_METHOD'); ?></strong>:
						<span><?php echo $this->active_payment_name ?></span>
					</div>
				<?php endif; ?>
				<?php if ($this->jshopConfig->hide_shipping_step): ?>
					<div class="text-end" style="<?php echo (!$this->active_shipping) ? ' display: none;' : '' ?>">
						<strong><?= Text::_('JSHOP_FINISH_SHIPPING_METHOD'); ?></strong>:
						<span><?php echo $this->active_shipping_name ?></span>
					</div>
				<?php endif; ?>
			</td>
		</tr>
	</table>
	<?php /*echo $this->loadTemplate('login'); */?>
	<form id="nevigenOneStepCheckout" name="nevigenOneStepCheckout" class="form" action="<?php echo $this->action ?>"
		method="post">
		<div class="columns">
			<div class="col_info">
				<div class="nevigenonestepcheckout_address_fieldset card bg-light card-body">
					<div class="title_block">
						<span class="number_ster">1</span>
						<span class="name_step"><?= Text::_('TPL_CUSTOM_TITLE_CHECKOUT_PAGE_STEP_ADDRESS'); ?></span>
					</div>
					<div class="nevigenonestepcheckout_address item_block">
						<?php echo $this->loadTemplate('address'); ?>
					</div>
				</div>
				<?php if (empty($this->jshopConfig->step_4_3) || (int) $this->jshopConfig->step_4_3 === 0): ?>
					<?php if ($this->delivery_step): ?>
						<div class="nevigenonestepcheckout_shipping_fieldset card bg-light card-body">
							<div class="title_block">
								<span class="number_ster">2</span>
								<span class="name_step"><?= Text::_('TPL_CUSTOM_TITLE_CHECKOUT_PAGE_STEP_SHIPPING'); ?></span>
							</div>
							<div class="nevigenonestepcheckout_shipping item_block">
								<?php echo $this->loadTemplate('shipping'); ?>
							</div>
						</div>
					<?php elseif (isset($this->active_sh_pr_method_id)): ?>
						<input type="hidden" name="sh_pr_method_id" value="<?php echo $this->active_sh_pr_method_id; ?>" />
					<?php endif; ?>
				<?php endif; ?>
				<?php if ((int) $this->jshopConfig->step_4_3 === 1): ?>
					<?php if ($this->delivery_step): ?>
						<div class="nevigenonestepcheckout_shipping_fieldset card bg-light card-body">
							<div class="mb-3">
								<?= Text::_('JSHOP_STEP_ORDER_4'); ?>
							</div>
							<div class="nevigenonestepcheckout_shipping">
								<?php echo $this->loadTemplate('shipping'); ?>
							</div>
						</div>
					<?php elseif (isset($this->active_sh_pr_method_id)): ?>
						<input type="hidden" name="sh_pr_method_id" value="<?php echo $this->active_sh_pr_method_id; ?>" />
					<?php endif; ?>
				<?php endif; ?>
				<?php if ($this->payment_step): ?>
					<div class="nevigenonestepcheckout_payments_fieldset card bg-light card-body">
						<div class="title_block">
							<span class="number_ster">3</span>
							<span class="name_step"><?= Text::_('TPL_CUSTOM_TITLE_CHECKOUT_PAGE_STEP_PAYMENT'); ?></span>
						</div>
						<div class="nevigenonestepcheckout_payments item_block">
							<?php echo $this->loadTemplate('payments'); ?>
						</div>
					</div>
				<?php elseif (isset($this->active_payment_class)): ?>
					<input type="hidden" name="payment_method" value="<?php echo $this->active_payment_class; ?>" />
				<?php endif; ?>
			</div>
			<div class="col_cart">
				<div class="nevigenonestepcheckout_cart position-sticky" style="top: 20px">
					<?php echo $this->loadTemplate('cart'); ?>
				</div>
			</div>
		</div>
		<?php echo HTMLHelper::_('form.token'); ?>
	</form>
	<div class="nevigen-onestepcheckout-cart-edit" data-nevigen-onestepcheckout="cart_modal">
		<?php /*echo $this->loadTemplate('cart_edit'); */?>
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
	<?php /* if (!empty($privacy_statement = $this->form_address->getInput('privacy_statement'))): ?>
		<div class="modal fade" id="onestep_privacy_statement" tabindex="-1" data-bs-backdrop="static"
			aria-labelledby="onestep_privacy_statement" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered modal-xl">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel"><?= Text::_('JSHOP_PRIVACY_STATEMENT'); ?></h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body jviewport-height50">
						<iframe class="w-100 h-100"
							src="<?php echo \JSHelper::SEFLink('index.php?option=com_jshopping&controller=content&task=view&page=privacy_statement&tmpl=component'); ?>"
							frameborder="0"></iframe>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
					</div>
				</div>
			</div>
		</div>
	<?php endif; ?>
	<?php if ($this->jshopConfig->display_agb): ?>
		<div class="modal fade" id="onestep_agb" tabindex="-1" data-bs-backdrop="static" aria-labelledby="onestep_agb"
			aria-hidden="true">
			<div class="modal-dialog  modal-dialog-centered modal-xl">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><?= Text::_('JSHOP_AGB'); ?></h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body jviewport-height50">
						<iframe class="w-100 h-100"
							src="<?php echo \JSHelper::SEFLink('index.php?option=com_jshopping&controller=content&task=view&page=agb&tmpl=component', 1); ?>"
							frameborder="0"></iframe>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
					</div>
				</div>
			</div>
		</div>
	<?php endif; 
	<div class="modal fade" id="return_policy" tabindex="-1" data-bs-backdrop="static" aria-labelledby="return_policy"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title"><?= Text::_('JSHOP_RETURN_POLICY') ?></h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body jviewport-height50">
					<iframe class="w-100 h-100"
						src="<?php echo \JSHelper::SEFLink('index.php?option=com_jshopping&controller=content&task=view&page=return_policy&tmpl=component&cart=1', 1); ?>"
						frameborder="0"></iframe>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
				</div>
			</div>
		</div>
	</div>
</div>
*/ ?>
</div>
<script>
	window.addEventListener('load', function () {
		window.NevigenOneStepCheckout().reloadScrollPage(true);
	});
</script>
<script>
    const totalc = <?= $this->fullsumm ?>;
    const minValuec = <?= $minValuec ?>;
    const btnc = document.querySelector('.nevigen-onestepcheckout-finish button');
    const minorderc = document.querySelector('.minorder-js');

    if (totalc < minValuec) {
        btnc.classList.add('disabled');
        minorder.classList.add('active');
    } else {
        btnc.classList.remove('disabled');
        minorderc.classList.remove('active');
    }
</script>
<script>
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#nevigenOneStepCheckout");
    const button = document.querySelector(".nevigen-onestepcheckout-finish button");

    if (!form || !button) return;

    let isSubmitting = false;

    form.addEventListener("submit", function (e) {
        if (isSubmitting) {
            e.preventDefault();
            return false;
        }

        isSubmitting = true;
        button.disabled = true;
        button.classList.add("disabled");

    });

    form.addEventListener("invalid", function () {
        isSubmitting = false;
        button.disabled = false;
        button.classList.remove("disabled");
    }, true);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
					
            const active = document.activeElement;
            if (active && active.tagName.toLowerCase() !== "textarea") {
                if (!isSubmitting) {
                    form.requestSubmit();
                }
                e.preventDefault();
            }
        }
    });
});
</script>