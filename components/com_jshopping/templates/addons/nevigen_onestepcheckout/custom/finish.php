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

/**
 * Template variables
 * -----------------
 *
 * @var   object $order       Current order object.
 * @var   array  $params      Params finish to addon .
 * @var   string $oldTextData data from the trigger onBeforeDisplayCheckoutFinish variable text.
 */
$checkout = JSFactory::getModel('checkoutFinish', 'Site');
$text = $checkout->getFinishStaticText();
?>
<div class="nevigen-onestepcheckout-finish-page">
	<div class="icon">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
			<path
				d="M15.6282 0.615098C15.1332 0.119396 14.3293 0.119709 13.8336 0.615098L5.75659 8.69243L2.1667 5.10257C1.671 4.60687 0.867478 4.60687 0.371776 5.10257C-0.123925 5.59827 -0.123925 6.4018 0.371776 6.8975L4.85894 11.3847C5.10663 11.6324 5.43142 11.7565 5.75625 11.7565C6.08107 11.7565 6.40617 11.6327 6.65387 11.3847L15.6282 2.40999C16.1239 1.91464 16.1239 1.11077 15.6282 0.615098Z"
				fill="#009640" style="fill:#009640;fill:color(display-p3 0.0000 0.5882 0.2510);fill-opacity:1;" />
		</svg>
	</div>
	<div class="fs-3 text-success mb-2">
		<?php echo $order->f_name . ' ' . $order->l_name . ' ' . Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FINISH_THANK_YOU_ORDER') ?>
	</div>
	<div class="nevigen-onestepcheckout-finish-manager-contact mt-3">
		<?php if ($text) { ?>
			<?php echo $text; ?>
		<?php } else { ?>
			<div class="alert alert-info m-0">
				<?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FINISH_MANAGER_CONTACT') ?></div>
		<?php } ?>
	</div>
</div>
<?php /*
<div class="nevigen-onestepcheckout-finish-page">
<div class="row gx-5 row-cols-1 row-cols-md-2">
<div class="col">
 <div class="fs-3 text-success mb-2"><?php echo $order->f_name . ' ' . $order->l_name . ' ' . Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FINISH_THANK_YOU_ORDER') ?></div>
 <div class="nevigen-onestepcheckout-user-info">
	 <div class="nevigen-onestepcheckout-finish-user-contacts alert alert-success mb-4">
		 <?php if ($order->f_name): ?>
			 <div><?php echo '<b>' . Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FINISH_USER_FIO') . '</b>: ' . $order->l_name . ' ' . $order->f_name . ' ' . $order->m_name; ?></div>
		 <?php endif; ?>
		 <?php if ($order->phone): ?>
			 <div><?php echo '<b>' . Text::_('JSHOP_TELEFON') . '</b>: ' . $order->phone; ?></div>
		 <?php endif; ?>
		 <?php if ($order->mobil_phone): ?>
			 <div><?php echo '<b>' . Text::_('JSHOP_MOBIL_PHONE') . '</b>: ' . $order->mobil_phone; ?></div>
		 <?php endif; ?>
		 <?php if ($order->street && !$order->shipping_params): ?>
			 <div><?php echo '<b>' . Text::_('JSHOP_STREET_NR') . ': </b>' . $order->street; ?></div>
		 <?php endif; ?>
		 <?php if ($order->email): ?>
			 <div><?php echo '<b>' . Text::_('JSHOP_EMAIL') . '</b>: ' . $order->email; ?></div>
		 <?php endif; ?>
	 </div>
	 <div class="nevigen-onestepcheckout-finish-payment-shipping  row row-cols-1 row-cols-md-2">
		 <?php if (!empty($params['payment']) && $order->payment_method_id > 0): ?>
			 <div class="nevigen-onestepcheckout-block-payment">
				 <?php if (!$this->jshopConfig->without_payment): ?>
					 <div class="payment_head">
						 <b><?php echo Text::_('JSHOP_CHECKOUT_PAYMENT') ?>:</b>
						 <span><?php echo $order->payment_name; ?></span>
					 </div>
					 <?php if ($order->payment_description || $order->payment_params): ?>
						 <div class="order_payment_params small">
							 <div class=""><?php echo $order->payment_description; ?></div>
							 <div class=""><?php echo nl2br($order->payment_params); ?></div>
						 </div>
					 <?php endif; ?>
				 <?php endif; ?>
			 </div>
		 <?php endif; ?>
		 <?php if (!empty($params['shipping'])): ?>
			 <div class="nevigen-onestepcheckout-block-shipping mt-2">
				 <?php if (!$this->jshopConfig->without_shipping): ?>
					 <div class="shipping_head">
						 <b><?php echo Text::_('JSHOP_CHECKOUT_SHIPPING') ?></b>:
						 <span><?php echo $order->shipping_info; ?></span>
						 <?php if ($order->shipping_params || $order->delivery_time_name || $order->delivery_date_f): ?>
							 <div class="small">
								 <div class="order_shipping_params">
									 <?php echo nl2br($order->shipping_params); ?>
								 </div>
								 <?php if ($order->delivery_time_name): ?>
									 <div class="delivery_time">
										 <?php echo Text::_('JSHOP_DELIVERY_TIME') . ': ' . $order->delivery_time_name ?>
									 </div>
								 <?php endif; ?>
								 <?php if ($order->delivery_date_f): ?>
									 <div class="delivery_date">
										 <?php echo Text::_('JSHOP_DELIVERY_DATE') . ': ' . $order->delivery_date_f ?>
									 </div>
								 <?php endif; ?>
							 </div>
						 <?php endif; ?>
					 </div>
				 <?php endif; ?>
			 </div>
		 <?php endif; ?>
	 </div>
	 <?php if (!empty($order->status_id)): ?>
		 <div class="alert alert-warning mt-3">
			 <?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FINISH_ORDER_PAYED') ?>
		 </div>
	 <?php endif; ?>
 </div>
</div>

<div class="col">
 <div class="card text-dark bg-light mt-5">
	 <div class="card-header lead fw-bold">
		 <?php if (!empty($params['number'])): ?>
			 <?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FINISH_ORDER_N') ?>
			 <span>№<?php echo $order->order_number; ?></span>
		 <?php endif; ?>
	 </div>
	 <div class="card-body">
		 <?php if (!empty($params['products'])): ?>
			 <?php foreach ($order->items as $product):
				 $image = ($product->thumb_image) ? $product->thumb_image : $this->jshopConfig->noimage;
				 $image = $this->jshopConfig->image_product_live_path . '/' . $image;
				 ?>
				 <div class="row mb-1 nevigen-onestepcheckout-cart-product-row align-items-center">
					 <div class="col-12 col-md-7 mb-2">
						 <div class="row">
							 <div class="col">
								 <div class="row">
									 <?php echo $product->product_name; ?>
									 <?php if ($this->jshopConfig->show_product_code_in_cart) : ?>
										 <span class="jshop_code_prod">(<?php echo $product->product_ean ?>
											 )</span>
									 <?php endif; ?>
								 </div>
								 <div class="row small fw-lighter lh-sm">
									 <?php if (!empty($product->manufacturer)) : ?>
										 <div class="manufacturer">
											 <?php echo Text::_('JSHOP_MANUFACTURER') ?>:
											 <span><?php echo $product->manufacturer ?></span>
										 </div>
									 <?php endif; ?>
									 <?php if ($this->jshopConfig->manufacturer_code_in_cart
										 && $product->manufacturer_code) : ?>
										 <div class="manufacturer_code">
											 <?php echo Text::_('JSHOP_MANUFACTURER_CODE') ?>
											 : <span><?php echo $product->manufacturer_code ?></span>
										 </div>
									 <?php endif; ?>
									 <?php echo \JSHelper::sprintAtributeInOrder($product->product_attributes); ?>
									 <?php echo JSHelper::sprintFreeAtributeInOrder($product->product_freeattributes); ?>
								 </div>
							 </div>
						 </div>
					 </div>
					 <div class="col-12 col-md-5">
						 <div class="row align-items-center">
							 <div class="col-5 small">
								 <?php echo \JSHelper::formatprice($product->product_item_price) ?>
							 </div>
							 <div class="col-2">
								 <?php echo \JSHelper::formatqty($product->product_quantity); ?>
								 <?php print $product->_qty_unit; ?>
							 </div>
							 <div class="col-5">
								 <div class="text-end fw-bold">
									 <?php echo \JSHelper::formatprice($product->product_item_price
										 * $product->product_quantity, $order->currency_code); ?>
									 <?php echo $product->_ext_price_total_html ?>
									 <?php if ($this->jshopConfig->show_tax_product_in_cart
										 && $product->product_tax > 0): ?>
										 <span class="taxinfo">
											 <?php echo \JSHelper::productTaxInfo($product->product_tax,
												 $order->display_price); ?>
										 </span>
									 <?php endif; ?>
								 </div>
							 </div>
						 </div>
					 </div>
				 </div>
			 <?php endforeach; ?>
		 <?php endif; ?>
	 </div>
	 <div class="card-footer">
		 <div class="itogi text-end">
			 <?php if (!empty($params['subtotal']) && !$order->getHideSubtotal()): ?>
				 <div class="nevigen-onestepcheckout-finish-cost-subtotal">
					 <b><?php echo Text::_('JSHOP_SUBTOTAL') ?>:</b>
					 <span>
						 <?php echo \JSHelper::formatprice($order->order_subtotal,
							 $order->currency_code); ?>
					 </span>
				 </div>
			 <?php endif; ?>
			 <?php if ($order->order_shipping > 0): ?>
				 <div class="nevigen-onestepcheckout-finish-cost-shipping ">
					 <b><?php echo Text::_('JSHOP_CHECKOUT_SHIPPING') ?>:</b>
					 <?php echo \JSHelper::formatprice($order->order_shipping,
						 $order->currency_code); ?>
				 </div>
			 <?php endif; ?>
			 <?php if ($order->order_payment > 0): ?>
				 <div class="nevigen-onestepcheckout-finish-cost-payment ">
					 <b><?php echo Text::_('JSHOP_CHECKOUT_PAYMENT') ?>:</b>
					 <?php echo \JSHelper::formatprice($order->order_payment,
						 $order->currency_code); ?>
				 </div>
			 <?php endif; ?>
			 <?php if (!empty($params['discount'] && $order->order_discount > 0)): ?>
				 <div class="nevigen-onestepcheckout-finish-cost-discount text-success">
					 <b><?php echo Text::_('JSHOP_RABATT_VALUE') ?>:</b>
					 <span>
						 <?php echo '-' . \JSHelper::formatprice($order->order_discount,
								 $order->currency_code); ?>
					 </span>
				 </div>
			 <?php endif; ?>
			 <?php if (!empty($params['total'])): ?>
				 <div class="fs-5 nevigen-onestepcheckout-finish-cost-total">
					 <b><?php echo $order->getTextTotal() ?>:</b>
					 <span>
						 <?php echo \JSHelper::formatprice($order->order_total,
							 $order->currency_code); ?>
					 </span>
				 </div>
			 <?php endif; ?>
		 </div>
	 </div>
 </div>
</div>
</div>
<div class="nevigen-onestepcheckout-finish-manager-contact mt-3">
<div class="alert alert-info m-0"><?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FINISH_MANAGER_CONTACT') ?></div>
</div>
</div>
<?php echo $oldTextData ?>
*/
?>