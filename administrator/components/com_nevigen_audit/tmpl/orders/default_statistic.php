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

use Joomla\CMS\Date\Date;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

HTMLHelper::_('bootstrap.tooltip', '.hasTooltip');

// Load assets
$this->document->getWebAssetManager()->usePreset('com_nevigen_audit.administrator.orders_audit');


if (empty($this->statuses) || empty($this->statistic))
{
	return '';
}

$totalAmount = [];
$totalSum    = [];
$date        = new Date();
foreach (array_keys($this->statistic) as $key)
{
	$totalAmount[$key] = 0;
	$totalSum[$key]    = 0;
}
?>

<div class="orders-audit">
	<div id="orders-audit-collapse" class="mb-3">
		<button class="orders-collapse-btn btn btn-primary  active" type="button"
				onclick="window.showContent(this,'orders-today')">
			<?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_TODAY'); ?>
		</button>
		<button class="orders-collapse-btn btn btn-primary " type="button"
				onclick="window.showContent(this,'orders-week')">
			<?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_WEEK'); ?>
		</button>
		<button class="orders-collapse-btn btn btn-primary" type="button"
				onclick="window.showContent(this,'orders-month')">
			<?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_MONTH')
				. ' ' . $date->format('F', true, true); ?>
		</button>
		<button class="orders-collapse-btn btn btn-primary" type="button"
				onclick="window.showContent(this,'orders-year')">
			<?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_YEAR')
				. ' ' . $date->format('Y', true, true); ?>
		</button>
	</div>
	<div>
		<h2 class="display-6 text-center text-primary">
			<?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_TITLE'); ?>
			<span data-orders-audit-collapse="title">
				«<?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_TODAY'); ?>»
			</span>
		</h2>
		<table class="table table-striped table-hover">
			<thead>
			<tr>
				<th scope="col">
					<span class="fs-2"><?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_STATUS') ?></span>
				</th>
				<th class="w-20 text-center" scope="col">
					<span class="fs-2"><?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_QUANTITY') ?></span>
				</th>
				<th class="w-20 text-center" scope="col">
					<span class="fs-2"><?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_SUM') ?></span>
				</th>
			</tr>
			</thead>
			<tbody>
			<?php foreach ($this->statuses as $status): ?>
				<tr>
					<td class="nvg-audit-stats-orderstatusname">
						<span class="fs-3"><?php echo $status['name']; ?></span>
					</td>
					<td class="nvg-audit-stats-orderstatusqty text-center">
						<?php foreach (array_keys($this->statistic) as $key):
							$style = ($key === 'today') ? '' : ' style="display: none"'; ?>
							<div class="orders-collapse-content orders-<?php echo $key; ?>"
								<?php echo $style; ?>>
								<?php if (isset($this->statistic[$key][$status['id']])
									&& isset($this->statistic[$key][$status['id']]['amount']))
								{
									$totalAmount[$key] += (int) $this->statistic[$key][$status['id']]['amount'];
									echo $this->statistic[$key][$status['id']]['amount'];
								}
								else
								{
									echo 0;
								}
								?>
							</div>
						<?php endforeach; ?>
					</td>
					<td class="nvg-audit-stats-orderstatussum text-center  fw-bold fs-3">
						<?php foreach (array_keys($this->statistic) as $key):
							$style = ($key === 'today') ? '' : ' style="display: none"'; ?>
							<div class="orders-collapse-content orders-<?php echo $key; ?>"
								<?php echo $style; ?>>
								<?php if (isset($this->statistic[$key][$status['id']])
									&& isset($this->statistic[$key][$status['id']]['total_sum']))
								{
									$totalSum[$key] += (float) $this->statistic[$key][$status['id']]['total_sum'];
									echo Helper::formatprice($this->statistic[$key][$status['id']]['total_sum']);
								}
								else
								{
									echo Helper::formatprice(0);
								}
								?>
							</div>
						<?php endforeach; ?>
					</td>
				</tr>
			<?php endforeach; ?>
			</tbody>
			<tfoot>
			<tr class="fs-2">
				<td class=" bg-info  text-white">
					<span><?php echo Text::_('COM_NEVIGEN_AUDIT_ORDERS_AUDIT_STATISTIC_TOTAL'); ?></span>
				</td>
				<td class="nvg-audit-stats-orderstatusfullqty text-center  bg-info  text-white">
					<?php foreach (array_keys($this->statistic) as $key):
						$style = ($key === 'today') ? '' : ' style="display: none"'; ?>
						<div class="orders-collapse-content orders-<?php echo $key; ?>"
							<?php echo $style; ?>>
							<?php echo $totalAmount[$key]; ?>
						</div>
					<?php endforeach; ?>
				</td>
				<td class="nvg-audit-stats-orderstatusfullsum text-center fw-bold bg-info text-white">
					<?php foreach (array_keys($this->statistic) as $key):
						$style = ($key === 'today') ? '' : ' style="display: none"'; ?>
						<div class="orders-collapse-content orders-<?php echo $key; ?>"
							<?php echo $style; ?>>
							<?php echo Helper::formatprice($totalSum[$key]); ?>
						</div>
					<?php endforeach; ?>
				</td>
			</tr>
			</tfoot>
		</table>
	</div>
</div>

