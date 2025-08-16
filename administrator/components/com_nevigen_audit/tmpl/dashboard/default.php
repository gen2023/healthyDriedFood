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

// Load assets
$this->document->getWebAssetManager()
	->useScript('com_nevigen_audit.chart')
	->useStyle('com_nevigen_audit.administrator.main');

?>
<div id="nevigenAudit" class="dashboard">
	<div class="text-center mb-3">
		<h1><?php echo Text::_('COM_NEVIGEN_AUDIT_DASHBOARD_TITLE'); ?></h1>
	</div>
	<?php echo $this->dashboardTop; ?>
	<div class="card border p-3 rounded border-primary-subtle">
		<h2 class="text-center">
			<?php echo Text::_('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_ORDERS_TITLE'); ?>
		</h2>
		<div class="row mt-2 mb-3">
			<div class="col-md-4">
				<div class="d-flex flex-column h-100 bg-light shadow-md border pt-3 rounded border-dark-subtle">
					<div data-nevigen-audit-chart-id="com_nevigen_audit.chart.dashboard.orders.total">
						<div class="d-flex justify-content-center text-primary">
							<?php echo Text::_('COM_NEVIGEN_AUDIT_LOADING_DATA');?>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="mb-2 d-flex flex-column h-100 bg-light shadow-md border pt-3 rounded border-dark-subtle">
					<div data-nevigen-audit-chart-id="com_nevigen_audit.chart.dashboard.orders.paid">
						<div class="d-flex justify-content-center text-primary">
							<?php echo Text::_('COM_NEVIGEN_AUDIT_LOADING_DATA');?>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="mb-2 d-flex flex-column h-100 bg-light shadow-md border pt-3 rounded border-dark-subtle">
					<div data-nevigen-audit-chart-id="com_nevigen_audit.chart.dashboard.orders.cancel">
						<div class="d-flex justify-content-center text-primary">
							<?php echo Text::_('COM_NEVIGEN_AUDIT_LOADING_DATA');?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php echo $this->dashboardAfterOrders; ?>

	<?php if (!empty($this->groups)): ?>
		<div class="card border p-3 rounded border-primary-subtle mt-4">
			<h2 class="text-center">
				<?php echo Text::_('COM_NEVIGEN_AUDIT_DASHBOARD_STATISTIC_GROUPS_TITLE'); ?>
			</h2>
			<div class="row mt-2 mb-3">
				<div class="col-md-6">
					<div class="d-flex flex-column h-100">
						<ul class="list-group">
							<?php foreach ($this->groups as $group): ?>
								<li class="list-group-item d-flex justify-content-between align-items-center">
									<div class="ms-2 me-auto">
										<div class="fw-bold ms-2 d-inline-block">
											<?php echo $group['name']; ?>
										</div>
									</div>
									<div>
										<span class="dashboard-groups-amount">
											<?php echo $group['amount']; ?>
										</span>
									</div>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				</div>
				<div class="col-md-6">
					<div class="mb-2 d-flex flex-column h-100">
						<div data-nevigen-audit-chart-id="com_nevigen_audit.chart.dashboard.users.groups">
							<div class="d-flex justify-content-center text-primary">
								<?php echo Text::_('COM_NEVIGEN_AUDIT_LOADING_DATA');?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	<?php endif; ?>
	<?php echo $this->dashboardBottom; ?>
</div>
