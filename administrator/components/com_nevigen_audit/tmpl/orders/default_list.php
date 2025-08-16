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

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Component\Jshopping\Site\Helper\SelectOptions;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

HTMLHelper::_('bootstrap.tooltip', '.hasTooltip');

$user          = $this->getCurrentUser();
$listOrder     = $this->escape($this->state->get('list.ordering'));
$listDirn      = $this->escape($this->state->get('list.direction'));
$jshopConfig   = JSFactory::getConfig();
$status_orders = SelectOptions::getOrderStatus();

$columns = 7;

// Load assets
$this->document->getWebAssetManager()
	->usePreset('com_nevigen_audit.administrator.orders')
	->useScript('table.columns');

$total = 0;
?>
<form action="<?php echo $this->link ?>" method="post" name="adminForm" id="adminForm" class="clearfix">
	<?php echo LayoutHelper::render('components.nevigen_audit.administrator.list.search',
		['view' => $this, 'options' => ['alwaysShowFilters' => true]]); ?>
	<?php if (empty($this->items)) : ?>
		<div class="alert alert-info">
			<span class="icon-info-circle" aria-hidden="true"></span><span
					class="visually-hidden"><?php echo Text::_('INFO'); ?></span>
			<?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
		</div>
	<?php else : ?>
		<table id="ordertsList" class="table itemList" data-name="nevigen-audit-orders">
			<thead>
			<tr>
				<td class="w-1 text-center">
					<?php echo HTMLHelper::_('grid.checkall'); ?>
				</td>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_NUMBER', 'o.order_number',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col" class="w-100">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_USER', 'o.user_id',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col" class="w-100">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_DATE', 'o.order_date',
						$listDirn, $listOrder); ?>
				</th>
				<?php if (!$jshopConfig->without_payment) :
					$columns += 1; ?>
					<th scope="col" class="w-100">
						<?php echo HTMLHelper::_('searchtools.sort',
							'JSHOP_PAYMENT', 'o.payment_method_id',
							$listDirn, $listOrder); ?>
					</th>
				<?php endif; ?>
				<?php if (!$jshopConfig->without_shipping) :
					$columns += 1; ?>
					<th scope="col" class="w-100">
						<?php echo HTMLHelper::_('searchtools.sort',
							'JSHOP_SHIPPINGS', 'o.shipping_method_id',
							$listDirn, $listOrder); ?>
					</th>
				<?php endif; ?>
				<th scope="col" class="w-100 text-center">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_STATUS', 'o.order_status',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col" class="w-100 text-center">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_ORDER_TOTAL', 'o.order_total',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_ID', 'o.order_id',
						$listDirn, $listOrder); ?>
				</th>

			</tr>
			</thead>
			<tbody>
			<?php foreach ($this->items as $i => $item):
				$orderId = (int) $item->order_id;
				$orderPrint = 'index.php?option=com_jshopping&controller=orders&task=printOrder&order_id=' . $orderId . '&tmpl=component';
				$pdfManualUrl = 'index.php?option=com_jshopping&controller=orders&task=send&order_id=' . $orderId . '&back=orders';
				$pdfFilePath = $jshopConfig->pdf_orders_live_path . "/" . $item->pdf_file;
				$total += $item->order_total / $item->currency_exchange;
				$edit = 'index.php?option=com_jshopping&controller=orders&task=edit&order_id='
					. $orderId . '&client_id=' . $this->client_id;
				$show = 'index.php?option=com_jshopping&controller=orders&task=show&order_id=' . $orderId;
				?>
				<tr class="position-relative <?php echo (!$item->order_created) ? 'order-not-finished' : ''; ?>">
					<td>
						<?php if ($item->blocked): ?>
							<span class="icon-locked"></span>
						<?php else : ?>
							<?php echo HTMLHelper::_('grid.id', $i, $item->order_id); ?>
						<?php endif; ?>
					</td>
					<td>
						<div>
							<a class="btn btn-sm bg-secondary text-white"
							   href="<?php echo $show; ?>"
								<?php echo ($this->order_quick_view) ? ' data-order-quick-view="'.$orderId.'"' : ''; ?>>
								<?php echo $item->order_number; ?>
							</a>
						</div>
						<?php echo $item->_tmp_ext_info_order_number ?>
						<div class="mt-1 d-flex align-items-center justify-content-between flex-wrap">
							<?php if ($item->display_info_order) : ?>
								<a href="<?php echo $edit; ?>" title="<?php echo Text::_('JSHOP_EDIT') ?>"
								   class="btn btn-sm btn-light hasTooltip">
									<span class="icon-edit"></span>
								</a>
							<?php endif; ?>
							<?php if ($jshopConfig->generate_pdf): ?>
								<?php if ($item->display_info_order && $item->order_created): ?>
									<?php if ($item->pdf_file != ''): ?>
										<a class="btn btn-sm btn-light hasTooltip"
										   title="<?php echo Text::_('JSHOP_PDF_PREVIEW') ?>"
										   href="javascript:void window.open('<?php echo $pdfFilePath ?>', 'win2', 'status=no,toolbar=no,scrollbars=yes,titlebar=no,menubar=no,resizable=yes,width=800,height=600,directories=no,location=no');">
											<span class="fa fa-file-pdf"></span>
										</a>
									<?php elseif ($jshopConfig->send_invoice_manually): ?>
										<a class="btn btn-sm btn-light hasTooltip"
										   title="<?php echo Text::_('JSHOP_SEND_MAIL') ?>"
										   href="<?php echo $pdfManualUrl; ?>">
											<span class="fa fa-envelope"></span>
										</a>
									<?php endif; ?>
								<?php endif; ?>
							<?php else: ?>
								<a class="btn btn-sm btn-light hasTooltip"
								   title="<?php echo Text::_('JSHOP_ORDER_PRINT_VIEW') ?>"
								   href="javascript:void window.open('<?php echo $orderPrint ?>', 'win2', 'status=no,toolbar=no,scrollbars=yes,titlebar=no,menubar=yes,resizable=yes,width=800,height=600,directories=no,location=no');">
									<span class="fa fa-print"></span>
								</a>
							<?php endif; ?>
						</div>
					</td>
					<td>
						<?php if ($item->user_id > 0): ?>
							<a href="index.php?option=com_jshopping&controller=users&task=edit&user_id=<?php echo $item->user_id ?>">
								<?php echo $item->name ?>
							</a>
						<?php else: ?>
							<?php echo $item->name ?>
						<?php endif; ?>
						<?php if (!empty($item->d_phone)) : ?>
							<div class="small mt-2 text-muted">
								<a class="text-reset text-decoration-none"
								   href="tel:<?php echo preg_replace('![^0-9]+!', '', $item->d_phone) ?>">
									<span class="icon-phone"></span> <?php echo $item->d_phone ?>
								</a>
							</div>
						<?php endif; ?>
						<?php if (!empty($item->phone)) : ?>
							<div class="small mt-2 text-muted">
								<a class="text-reset text-decoration-none"
								   href="tel:<?php echo preg_replace('![^0-9]+!', '', $item->phone) ?>">
									<span class="icon-phone"></span> <?php echo $item->phone ?>

								</a>
							</div>
						<?php endif; ?>
						<?php if (!empty($item->d_mobil_phone)) : ?>
							<div class="small mt-2 text-muted">
								<a class="text-reset text-decoration-none"
								   href="tel:<?php echo preg_replace('![^0-9]+!', '', $item->d_mobil_phone) ?>">
									<span class="icon-mobile"></span> <?php echo $item->d_mobil_phone ?>
								</a>
							</div>
						<?php endif; ?>
						<?php if (!empty($item->mobil_phone)) : ?>
							<div class="small mt-2 text-muted">
								<a class="text-reset text-decoration-none"
								   href="tel:<?php echo preg_replace('![^0-9]+!', '', $item->mobil_phone) ?>">
									<span class="icon-mobile"></span> <?php echo $item->mobil_phone ?>
								</a>
							</div>
						<?php endif; ?>
						<?php if (!empty($item->email)) : ?>
							<div class="small mt-2 mb-2 text-muted">
								<a class="text-reset text-decoration-none text-nowrap"
								   href="mailto:<?php echo $item->email ?>">
									<span class="icon-mail"></span> <?php echo $item->email ?>
								</a>
							</div>
						<?php endif; ?>
					</td>
					<td>
						<?php echo Helper::formatdate($item->order_date, 1); ?>
					</td>
					<?php if (!$jshopConfig->without_payment) : ?>
						<td class="text-nowrap">
							<?php echo $item->payment_name ?>
							<div class="small text-muted text-wrap">
								<?php if ($item->payment_params) echo nl2br($item->payment_params) ?>
							</div>
						</td>
					<?php endif; ?>
					<?php if (!$jshopConfig->without_shipping) : ?>
						<td class="text-nowrap">
							<?php echo $item->shipping_name ?>
							<div class="small text-muted text-wrap">
								<?php if ($item->shipping_params) echo nl2br($item->shipping_params) ?>
							</div>
							<?php if (!empty($item->nevigen_ukrposhta_tracking)) : ?>
								<div class="mt-1">
									<a class="btn btn-warning btn-sm text-reset text-decoration-none"
									   href="https://track.ukrposhta.ua/tracking_UA.html?barcode=<?php echo $item->nevigen_ukrposhta_tracking ?>"
									   target="_blank"><?php echo $item->nevigen_ukrposhta_tracking ?>
									</a>
								</div>
							<?php endif; ?>
						</td>
					<?php endif; ?>
					<td class="align-middle" style="min-width: 200px">
						<?php if ($item->display_info_order && $item->order_created)
						{
							$onchange = "this.closest('td').querySelector('.update_status_panel').classList.remove('d-none');";
							echo HTMLHelper::_('select.genericlist', $status_orders, 'select_status_id[' . $item->order_id . ']',
								'class="inputbox form-control" onchange="' . $onchange . '" id="status_id_' . $item->order_id . '"', 'status_id', 'name', $item->order_status);
						}
						else
						{
							echo $item->status_name;
						}
						?>
						<?php echo $item->_tmp_ext_info_status ?>
						<?php if ($item->order_created && $item->display_info_order) { ?>
							<div class="d-none update_status_panel">
								<div class="mt-2 mb-2">
									<input class="inputbox va-middle" type="checkbox"
										   name="order_check_id[<?php echo $item->order_id ?>]"
										   id="order_check_id_<?php echo $item->order_id ?>"/>
									<label class="fs-14 small"
										   for="order_check_id_<?php echo $item->order_id ?>">
										<?php echo Text::_('JSHOP_NOTIFY_CUSTOMER') ?>
									</label>
								</div>
								<input class="button btn btn-primary" type="button" name=""
									   value="<?php echo Text::_('JSHOP_UPDATE_STATUS') ?>"
									   onclick="window.NevigenAuditOrders.changeStatus(<?php echo $item->order_id; ?>,
								       <?php echo $item->order_status; ?>,
											   '<?php echo addslashes(Text::_('JSHOP_CHANGE_ORDER_STATUS')) ?>');"/>
							</div>
						<?php } ?>
						<?php echo $item->_tmp_ext_info_status ?>
						<?php if ($item->display_info_order && !$item->order_created && !$item->blocked): ?>
							<div>
								<a class="btn btn-sm mt-2 btn-danger"
								   href="index.php?option=com_jshopping&controller=orders&task=finish&order_id=<?php echo $item->order_id ?>&js_nolang=1">
									<?php echo Text::_('JSHOP_FINISH_ORDER') ?>
								</a>
							</div>
						<?php endif; ?>
						<?php echo $item->_tmp_ext_info_update ?>

					</td>
					<td class="text-nowrap align-middle lead">
						<?php echo Helper::formatprice($item->order_total, $item->currency_code) ?>
					</td>
					<td>
						<?php echo $item->order_id; ?>
					</td>
				</tr>
			<?php endforeach; ?>
			</tbody>
			<?php if ($total > 0): ?>
				<tfoot>
				<tr>
					<td colspan="<?php echo $columns; ?>" class="text-end fs-3">
						<span><?php echo Text::_('JSHOP_ORDER_TOTAL'); ?></span>:
						<span><?php echo Helper::formatprice($total); ?></span>
					</td>
				</tr>
				</tfoot>
			<?php endif; ?>
		</table>
		<?php echo $this->pagination->getListFooter(); ?>
	<?php endif; ?>
	<input type="hidden" name="task" value=""/>
	<input type="hidden" name="boxchecked" value="0"/>
	<?php echo HTMLHelper::_('form.token'); ?>
</form>
