<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

use Joomla\CMS\Language\Text;

\defined('_JEXEC') or die;

?>
<div class="nevigen-onestepcheckout_shipping_block">
	<?php echo (isset($this->_tmp_ext_html_shipping_start)) ? $this->_tmp_ext_html_shipping_start : '' ?>
	<div data-nevigen-onestepcheckout="shipping">
		<?php foreach ($this->shipping_methods as $shipping):
			$checked = '';
			if ($shipping->sh_pr_method_id == $this->active_shipping)
			{
				$checked = 'checked';
			} ?>
			<div class="shipping_wrapper <?php if ($checked) echo 'active' ?>" data-nevigen-onestepcheckout-shipping="<?php echo $shipping->sh_pr_method_id; ?>">
				<div class="">
					<div class="w-100 ms-2">
						<label for="shipping_method_<?php echo $shipping->sh_pr_method_id ?>" class="name_method custom-radio-label">
							<div class="d-flex align-items-center justify-content-between">
								<div class="d-flex align-items-center">
								<div class="block_input">
						<input class="form-check-input" type="radio" name="sh_pr_method_id"
							   id="shipping_method_<?php echo $shipping->sh_pr_method_id ?>"
							   data-shipping_id="<?php echo $shipping->shipping_id ?>"
							   value="<?php echo $shipping->sh_pr_method_id ?>"
							<?php echo $checked ?> />
							<span class="custom-radio"></span>
					</div>
									<?php if ($shipping->image): ?>
										<div class="shipping_image">
											<img src="<?php echo $shipping->image ?>" width="30px" height="30px"
												 alt="<?php echo htmlspecialchars($shipping->name) ?>"/>
										</div>
									<?php endif; ?>
									<div class="nevigen-onestepcheckout-shipping-name"><?php echo $shipping->name ?></div>
								</div>
								<div>
									<?php /* if ($shipping->calculeprice > 0): ?>
										<span class="nvg_shipping_cost">
											<?php echo \JSHelper::formatprice($shipping->calculeprice); ?>
										</span>
									<?php else: ?>
										<span class="nvg_shipping_cost">
											<?php echo Text::_('TPL_CUSTOM_SHIPPING_NO_COST'); ?>
										</span>
									<?php endif; */ ?>
								</div>
							</div>
						</label>
						<?php if ($this->jshopConfig->show_list_price_shipping_weight && count($shipping->shipping_price)) : ?>
							<div class="shipping_weight_to_price">
								<?php foreach ($shipping->shipping_price as $price) : ?>
									<div>
										<div class="weight">
											<?php if ($price->shipping_weight_to != 0)
											{
												echo \JSHelper::formatweight($price->shipping_weight_from) .
													' - ' . \JSHelper::formatweight($price->shipping_weight_to);
											}
											else
											{
												echo Text::_('JSHOP_FROM') . ' '
													. \JSHelper::formatweight($price->shipping_weight_from);
											} ?>
										</div>
										<div class="price">
											<?php echo \JSHelper::formatprice($price->shipping_price); ?>
										</div>
									</div>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
						<?php if ($checked): ?>
							<div class="small text-muted ms-3">
								<?php echo $shipping->description ?>
							</div>
							<div id="shipping_form_<?php echo $shipping->shipping_id ?>"
								 class="shipping_form">
								<?php echo $shipping->form ?>
							</div>
						<?php endif; ?>
						<?php if ($shipping->delivery): ?>
							<div class="shipping_delivery">
								<?php echo Text::_('JSHOP_DELIVERY_TIME') . ": " . $shipping->delivery ?>
							</div>
						<?php endif; ?>
						<?php if ($shipping->delivery_date_f): ?>
							<div class="shipping_delivery_date">
								<?php echo Text::_('JSHOP_DELIVERY_DATE') . ": " . $shipping->delivery_date_f ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php echo (isset($this->_tmp_ext_html_shipping_end)) ? $this->_tmp_ext_html_shipping_end : '' ?>
</div>

<script>
	
(function () {

    const COOKIE_PREFIX = 'checkout_city_';

    function setCookie(name, value, days = 7) {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + encodeURIComponent(value) +
            '; expires=' + d.toUTCString() + '; path=/';
    }

    function getCookie(name) {
        const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return m ? decodeURIComponent(m[2]) : '';
    }

    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    }

    function getCurrentShippingId() {
        const checked = document.querySelector('input[name="sh_pr_method_id"]:checked');
        return checked ? checked.value : null;
    }

    document.addEventListener('input', function (e) {
        if (e.target && e.target.name === 'city') {
            const shippingId = getCurrentShippingId();
            if (shippingId === '9' || shippingId === '3') {
                setCookie(COOKIE_PREFIX + shippingId, e.target.value);
            }
        }
    });

function handleCity() {
    const input = document.querySelector('input[name="city"]');
    const shippingId = getCurrentShippingId();

    if (shippingId !== '9' && shippingId !== '3') {
        deleteCookie(COOKIE_PREFIX + '9');
        deleteCookie(COOKIE_PREFIX + '3');
        return;
    }

    if (!input) return;

    const city = getCookie(COOKIE_PREFIX + shippingId);
    if (city && !input.value) {
        input.value = city;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

    document.addEventListener('change', function (e) {
        if (e.target && e.target.name === 'sh_pr_method_id') {
            setTimeout(handleCity, 200);
            setTimeout(handleCity, 600);
        }
    });

    const observer = new MutationObserver(handleCity);
    observer.observe(document.body, { childList: true, subtree: true });

		document.addEventListener('DOMContentLoaded', handleCity);

})();
</script>

