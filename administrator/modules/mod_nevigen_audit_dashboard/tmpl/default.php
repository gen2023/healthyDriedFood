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

/**
 * Layout variables
 * -----------------
 * @var  object                    $module               Module object.
 * @var  \Joomla\CMS\HTML\Registry $params               Module params.
 * @var  string                    $dashboardTop         Event data.
 * @var  string                    $dashboardAfterOrders Event data.
 * @var  string                    $dashboardBottom      Event data.
 *
 */

?>
<?php echo $dashboardTop; ?>
<div class="px-3 pb-3">
	<div>
		<h3 class="text-center">
			<?php echo Text::_('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_ORDERS_TITLE'); ?>
		</h3>
		<div class="row mt-2 mb-3">
			<div class="col-md-4">
				<div class="d-flex flex-column h-100 bg-light shadow-md border pt-3 rounded border-dark-subtle">
					<div data-nevigen-audit-chart-id="com_nevigen_audit.chart.dashboard.orders.total">
						<div class="d-flex justify-content-center text-primary">
							<?php echo Text::_('COM_NEVIGEN_AUDIT_LOADING_DATA'); ?>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="mb-2 d-flex flex-column h-100 bg-light shadow-md border pt-3 rounded border-dark-subtle">
					<div data-nevigen-audit-chart-id="com_nevigen_audit.chart.dashboard.orders.paid">
						<div class="d-flex justify-content-center text-primary">
							<?php echo Text::_('COM_NEVIGEN_AUDIT_LOADING_DATA'); ?>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="mb-2 d-flex flex-column h-100 bg-light shadow-md border pt-3 rounded border-dark-subtle">
					<div data-nevigen-audit-chart-id="com_nevigen_audit.chart.dashboard.orders.cancel">
						<div class="d-flex justify-content-center text-primary">
							<?php echo Text::_('COM_NEVIGEN_AUDIT_LOADING_DATA'); ?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php echo $dashboardAfterOrders; ?>

	<?php echo $dashboardBottom; ?>
</div>
