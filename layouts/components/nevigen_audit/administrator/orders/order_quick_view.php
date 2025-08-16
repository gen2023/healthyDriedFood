<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

extract($displayData);

/**
 * Layout variables
 * -----------------
 * @var  object $config Config object.
 * @var  object $data   Extra data triggers.
 * @var  object $order  Order object.
 * @var  array  $items  Order items array.
 *
 */
?>

<div data-order-quick-view-box="<?php echo $order->order_id; ?>" class="order-preview-box">
	<div class="row p-3">
		<div class="col-8">
			<table class="table table-sm table-striped" width="100%">
				<thead>
				<tr>
					<th><?php echo Text::_('JSHOP_NAME_PRODUCT'); ?></th>
					<?php if (!empty($config->show_product_code_in_order)) : ?>
						<th><?php echo Text::_('JSHOP_EAN_PRODUCT'); ?></th>
					<?php endif; ?>
					<th><?php echo Text::_('JSHOP_PRICE'); ?></th>
					<th><?php echo Text::_('JSHOP_QUANTITY'); ?></th>
					<th><?php echo Text::_('JSHOP_TOTAL'); ?></th>
				</tr>
				</thead>
				<?php foreach ($items as $item) :
					$files = @unserialize($item->files);
					if (!is_array($files)) {
						$files = [];
					}
					?>
					<tr>
						<td>
							<b><?php echo $item->product_name; ?></b>
							<br/>
							<?php if (!empty($config->manufacturer_code_in_cart) && !empty($item->manufacturer_code)) : ?>
								<div class="manufacturer_code"><?php echo Text::_('JSHOP_MANUFACTURER_CODE'); ?>:
									<span><?php echo $item->manufacturer_code; ?></span></div>
							<?php endif; ?>
							<?php if (!empty($config->real_ean_in_cart) && !empty($item->real_ean)) : ?>
								<div class="real_ean"><?php echo Text::_('JSHOP_EAN'); ?>:
									<span><?php echo $item->real_ean; ?></span></div>
							<?php endif; ?>
							<div class="attributes small"><?php echo Helper::sprintAtributeInOrder($item->product_attributes) . Helper::sprintFreeAtributeInOrder($item->product_freeattributes); ?></div>

							<?php if (!empty($item->_ext_attribute_html)) : ?>
								<div class="attributes_added small"><?php echo $item->_ext_attribute_html; ?></div>
							<?php endif; ?>

							<?php if (!empty($item->extra_fields)) : ?>
								<div class="extra_fields small"><?php echo Helper::sprintExtraFiledsInOrder($item->extra_fields); ?></div>
							<?php endif; ?>

							<?php if (!empty($files)) : ?>
								<br/>
								<?php foreach ($files as $file) : ?>
									<div><?php echo $file->file_descr; ?></div>
								<?php endforeach; ?>
							<?php endif; ?>

							<?php if (!empty($item->_ext_file_html)) : ?>
								<?php echo $item->_ext_file_html; ?>
							<?php endif; ?>
						</td>

						<?php if (!empty($config->show_product_code_in_order)) : ?>
							<td><?php echo $item->product_ean; ?></td>
						<?php endif; ?>

						<td>
							<?php echo Helper::formatprice($item->product_item_price, $order->currency_code); ?>
							<?php if (!empty($item->_ext_price_html)) echo $item->_ext_price_html; ?>
						</td>
						<td>
							<?php if (!empty($item->product_quantity)) echo Helper::formatqty($item->product_quantity); ?>
							<?php if (!empty($item->_qty_unit)) echo $item->_qty_unit; ?>
						</td>
						<td>
							<?php echo Helper::formatprice($item->product_quantity * $item->product_item_price, $order->currency_code); ?>
							<?php if (!empty($item->_ext_price_total_html)) echo $item->_ext_price_total_html; ?>
						</td>
					</tr>
				<?php endforeach; ?>
			</table>

			<?php if (!empty($config->show_weight_order)) : ?>
				<div class="preview-row-weight d-flex justify-content-end">
					<div>
						<div><?php echo Text::_('JSHOP_WEIGHT_PRODUCTS'); ?>:</div>
						<div class="ms-4"><?php echo Helper::formatweight($order->weight); ?></div>
					</div>
				</div>
			<?php endif; ?>
			<div class="nvg-block-totals container fs-4 fw-bold">

				<div class="preview-row-subtotal d-flex justify-content-end">
					<div><?php echo Text::_('JSHOP_SUBTOTAL'); ?></div>
					<div class="ms-4">
						<?php echo Helper::formatprice($order->order_subtotal, $order->currency_code); ?>
						<?php if (!empty($data->_tmp_ext_subtotal)) echo '<div>' . $data->_tmp_ext_subtotal . '</div>'; ?>
					</div>
				</div>

				<?php if (isset($order->order_discount) && $order->order_discount !== '' && (float)$order->order_discount > 0) : ?>
					<div class="preview-row-coupon-discount d-flex justify-content-end">
						<div>
							<?php echo Text::_('JSHOP_COUPON_DISCOUNT'); ?>
							<?php if (!empty($order->coupon_id)) : ?>
								(<?php echo $order->coupon_code; ?>)
							<?php endif; ?>
							<?php if (!empty($data->_tmp_ext_discount_text)) : ?>
								<div class="bold preview-row-shopping-price d-flex justify-content-end">
									<?php echo $data->_tmp_ext_discount_text; ?>
								</div>
							<?php endif; ?>
						</div>
						<div class="ms-4">
							<?php echo Helper::formatprice(-$order->order_discount, $order->currency_code); ?>
							<?php if (!empty($data->_tmp_ext_discount)) : ?>
								<div class="bold preview-row-additional-discount d-flex justify-content-end">
									<?php echo $data->_tmp_ext_discount; ?>
								</div>
							<?php endif; ?>
						</div>
					</div>
				<?php endif; ?>

				<?php if (isset($order->order_shipping) && $order->order_shipping !== '' && (float)$order->order_shipping > 0) : ?>
					<div class="preview-row-shopping-price d-flex justify-content-end">
						<div><?php echo Text::_('JSHOP_SHIPPING_PRICE'); ?></div>
						<div class="ms-4"><?php echo Helper::formatprice($order->order_shipping, $order->currency_code); ?></div>
					</div>
				<?php endif; ?>

				<?php if (isset($order->order_package) && $order->order_package !== '' && (float)$order->order_package > 0) : ?>
					<div class="preview-row-package-price d-flex justify-content-end">
						<div><?php echo Text::_('JSHOP_PACKAGE_PRICE'); ?></div>
						<div class="ms-4">
							<?php echo Helper::formatprice($order->order_package, $order->currency_code); ?>
							<?php if (!empty($data->_tmp_ext_shipping_package)) echo $data->_tmp_ext_shipping_package; ?>
						</div>
					</div>
				<?php endif; ?>

				<?php if (isset($order->order_payment) && $order->order_payment !== '' && (float)$order->order_payment > 0) : ?>
					<div class="preview-row-payment d-flex justify-content-end">
						<div><?php echo $order->payment_name; ?></div>
						<div class="ms-4"><?php echo Helper::formatprice($order->order_payment, $order->currency_code); ?></div>
					</div>
				<?php endif; ?>

				<?php if (!empty($order->order_tax_list)) : ?>
					<?php foreach ($order->order_tax_list as $percent => $value) : ?>
						<?php if (isset($value) && $value !== '' && (float)$value > 0) : ?>
							<div class="preview-row-tax d-flex justify-content-end">
								<div><?php echo Helper::displayTotalCartTaxName($order->display_price) . $percent . '%'; ?></div>
								<div class="ms-4"><?php echo Helper::formatprice($value, $order->currency_code); ?></div>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				<?php endif; ?>

				<div class="preview-row-total d-flex justify-content-end">
					<div><?php echo Text::_('JSHOP_TOTAL'); ?></div>
					<div class="ms-4">
						<?php echo Helper::formatprice($order->order_total, $order->currency_code); ?>
						<?php if (!empty($data->_tmp_html_after_total)) echo $data->_tmp_html_after_total; ?>
					</div>
				</div>

			</div>
		</div>

		<div class="col-4">
			<div class="bg-light shadow-md border p-3 rounded border-dark-subtle mt-4 mb-4">
				<?php if (empty($config->without_shipping) && !empty($order->shipping_info)) : ?>
					<div>
						<div class="h4"><?php echo Text::_('JSHOP_SHIPPING_INFORMATION'); ?></div>
						<div style="padding-bottom:4px;"><?php echo $order->shipping_info; ?></div>
						<div><i><?php echo nl2br($order->shipping_params ?? ''); ?></i></div>
						<?php if (!empty($order->delivery_time_name)) : ?>
							<div><?php echo Text::_('JSHOP_DELIVERY_TIME') . ': ' . $order->delivery_time_name; ?></div>
						<?php endif; ?>
						<?php if (!empty($order->delivery_date_f)) : ?>
							<div><?php echo Text::_('JSHOP_DELIVERY_DATE') . ': ' . $order->delivery_date_f; ?></div>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<?php if (empty($config->without_payment) && !empty($order->payment_name)) : ?>
					<div class="h4"><?php echo Text::_('JSHOP_PAYMENT_INFORMATION'); ?></div>
					<div>
						<div style="padding-bottom:4px;"><?php echo $order->payment_name; ?></div>
						<div><i><?php echo nl2br($order->payment_params ?? ''); ?></i></div>
					</div>
				<?php endif; ?>
				<?php if (!empty($order->order_add_info)) : ?>
					<div>
						<div class="h4"><?php echo Text::_('JSHOP_CUSTOMER_COMMENT'); ?></div>
						<div class="small"><?php echo $order->order_add_info; ?></div>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>

