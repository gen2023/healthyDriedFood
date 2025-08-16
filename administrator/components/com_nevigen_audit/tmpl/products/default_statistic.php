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

if (empty($this->statistic))
{
	return '';
}
$url = 'index.php?option=com_nevigen_audit&view=products';
?>
<?php if ($this->statistic['total'] === 0): ?>
	<div class="alert alert-info">
		<span class="icon-info-circle" aria-hidden="true"></span><span
				class="visually-hidden"><?php echo Text::_('INFO'); ?></span>
		<?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
	</div>
<?php else: ?>
	<h2 class="nevigen_auditor_stat_all d-flex align-items-center mb-3">
		<span class="nevigen_auditor_stat_name me-2"><?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_ALL'); ?></span>
		<span class="btn btn-warning fs-3"><?php echo $this->statistic['total'] ?></span>
	</h2>
	<ul class="list-group nevigen_auditor_remove_icon_link">
		<li class="list-group-item list-group-item-hover">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-md-auto">
					<span class="nevigen_auditor_stat_name fs-3">
						<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_STATE'); ?>
					</span>
				</div>
				<div class="col-md-1 d-flex justify-content-end align-items-center">
					<?php if ($this->statistic['unpublished'] > 0): ?>
						<a href="<?php echo $url; ?>&filter[state]=0">
							<span class="nevigen_auditor_stat_off hasTooltip btn btn-danger"
								  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_UNPUBLISHED'); ?>">
								<?php echo $this->statistic['unpublished'] ?>
							</span>
						</a>
					<?php else: ?>
						<?php if ($this->statistic['published'] > 0): ?>
							<a href="<?php echo $url; ?>&filter[state]=1">
								<span class="nevigen_auditor_stat_on hasTooltip btn btn-success ms-2"
									  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_PUBLISHED'); ?>">
									<?php echo $this->statistic['published'] ?>
								</span>
							</a>
						<?php endif; ?>
					<?php endif; ?>

				</div>
			</div>
		</li>
		<li class="list-group-item">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-md-auto">
					<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_WITHOUT_PRICE'); ?></span>
				</div>
				<div class="col-md-1 d-flex justify-content-end">
					<?php if ($this->statistic['without_price'] > 0): ?>
						<a href="<?php echo $url; ?>&filter[search]=empty:product_price">
							<span class="nevigen_auditor_stat_off hasTooltip btn btn-danger"
								  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_WITHOUT_PRICE'); ?>"><?php echo $this->statistic['without_price'] ?></span>
						</a>
					<?php else: ?>
						<span class="nevigen_auditor_stat_on hasTooltip btn btn-success  ms-2"
							  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_WITHOUT_PRICE'); ?>">
							<?php echo Text::_('JNO') ?>
						</span>
					<?php endif; ?>
				</div>
			</div>
		</li>
		<li class="list-group-item">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-md-auto">
					<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_STOCK'); ?></span>
				</div>
				<div class="col-md-1 d-flex justify-content-end">
					<?php if ($this->statistic['out_of_stock'] > 0): ?>
						<a href="<?php echo $url; ?>&filter[search]=empty:product_quantity">
							<span class="nevigen_auditor_stat_off hasTooltip btn btn-danger"
								  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_OUT_OF_STOCK'); ?>"><?php echo $this->statistic['out_of_stock'] ?></span>
						</a>
					<?php else: ?>
						<span class="nevigen_auditor_stat_on hasTooltip btn btn-success  ms-2"
							  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_OUT_OF_STOCK'); ?>">
							<?php echo Text::_('JNO') ?>
						</span>
					<?php endif; ?>
				</div>
			</div>
		</li>
		<li class="list-group-item">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-md-auto">
					<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_WITHOUT_PICTURE'); ?></span>
				</div>
				<div class="col-md-1 d-flex justify-content-end">
					<?php if ($this->statistic['without_picture'] > 0): ?>
					<a href="<?php echo $url; ?>&filter[image]=0">
						<span class="nevigen_auditor_stat_off hasTooltip btn btn-danger"
							  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_WITHOUT_PICTURE'); ?>">
							<?php echo $this->statistic['without_picture'] ?>
						</span>
					</a>
						<?php else: ?>
							<span class="nevigen_auditor_stat_on hasTooltip btn btn-success  ms-2"
								  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_WITHOUT_PICTURE'); ?>">
								<?php echo Text::_('JNO') ?>
							</span>
						<?php endif; ?>
				</div>
			</div>
		</li>
		<li class="list-group-item">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-md-auto">
					<span class="nevigen_auditor_stat_name fs-3">
						<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_REVIEWS'); ?>
					</span>
				</div>
				<div class="col-12 col-md-2 d-flex  justify-content-end">
					<?php if (!isset($this->statistic['with_reviews'])): ?>
						<a href="/administrator/index.php?option=com_jshopping&controller=config&task=catprod">
							<span class="nevigen_auditor_stat_on hasTooltip btn btn-sm btn-danger">
								<?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_REVIEWS_OFF'); ?>
							</span>
						</a>
					<?php else: ?>
						<a href="<?php echo $url; ?>&filter[search]=no_empty:reviews_count">
							<span class="nevigen_auditor_stat_on hasTooltip btn <?php echo ($this->statistic['with_reviews'] > 0)
								? ' btn-success' : ' btn-danger'; ?>">
								<?php echo $this->statistic['with_reviews'] ?>
							</span>
						</a>
					<?php endif; ?>
				</div>
			</div>
		</li>
		<li class="list-group-item">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-md-auto">
					<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_LABELS'); ?></span>
				</div>
				<div class="col-md-2 d-flex justify-content-end">
					<a href="<?php echo $url; ?>&filter[search]=no_empty:label_id">
						<span class="nevigen_auditor_stat_on hasTooltip btn
				<?php echo ($this->statistic['with_labels'] > 0) ? 'btn-success' : 'btn-danger'; ?>">
							<?php echo $this->statistic['with_labels'] ?>
						</span>
					</a>
				</div>
			</div>
		</li>
		<li class="list-group-item">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-md-auto">
					<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_IS_ADD_PRICE'); ?></span>
				</div>
				<div class="col-md-2 d-flex justify-content-end">
					<a href="<?php echo $url; ?>&filter[search]=no_empty:product_is_add_price">
					<span class="nevigen_auditor_stat_on hasTooltip btn
				<?php echo ($this->statistic['with_is_add_price'] > 0) ? 'btn-success' : 'btn-danger'; ?>">
						<?php echo $this->statistic['with_is_add_price'] ?>
					</span>
					</a>
				</div>
			</div>
		</li>
		<li class="list-group-item">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-md-auto">
					<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_AUDIT_STATISTIC_WITH_RELATED'); ?></span>
				</div>
				<div class="col-md-2 d-flex justify-content-end">
					<span style="cursor:default" class="nevigen_auditor_stat_on hasTooltip btn
				<?php echo ($this->statistic['with_related'] > 0) ? 'btn-success' : 'btn-danger'; ?>">
						<?php echo $this->statistic['with_related'] ?>
					</span>
				</div>
			</div>
		</li>
		<?php if (!empty($this->statistic['additional']) && is_array($this->statistic['additional'])): ?>
			<?php foreach ($this->statistic['additional'] as $key => $additional):
				if (!isset($additional['name']) || !isset($additional['value']))
				{
					continue;
				} ?>
				<li class="list-group-item">
					<div class="row d-flex justify-content-between align-items-center">
						<div class="col-12 col-md-auto">
							<span class="nevigen_auditor_stat_name fs-3">
								<?php echo $additional['name']; ?>
							</span>
						</div>
						<div class="col-md-2 d-flex justify-content-end">
							<?php echo $additional['value']; ?>
						</div>
					</div>
				</li>
			<?php endforeach; ?>
		<?php endif; ?>
	</ul>
<?php endif; ?>
