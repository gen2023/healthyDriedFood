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
?>

<h2 class="nevigen_auditor_stat_all d-flex align-items-center mb-3">
	<span class="nevigen_auditor_stat_name me-2"><?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_ALL'); ?></span>
	<span class="btn btn-warning fs-3"><?php echo $this->statistic['total'] ?></span>
</h2>
<ul class="list-group nevigen_auditor_remove_icon_link">
	<li class="list-group-item list-group-item-hover">
		<div class="row d-flex justify-content-between align-items-center">
			<div class="col-12 col-md-auto">
				<span class="nevigen_auditor_stat_name fs-3">
					<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_STATE'); ?>
				</span>
			</div>
			<div class="col-md-1 d-flex justify-content-end align-items-center">
				<?php if ($this->statistic['unpublished'] > 0): ?>
					<span class="nevigen_auditor_stat_off hasTooltip btn btn-danger"
						  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_UNPUBLISHED'); ?>">
						<?php echo $this->statistic['unpublished'] ?>
					</span>
				<?php else:?>
					<span class="nevigen_auditor_stat_on hasTooltip btn btn-success ms-2"
						  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_UNPUBLISHED'); ?>">
						<?php echo Text::_('JNO'); ?>
					</span>
				<?php endif; ?>
			</div>
		</div>
	</li>
	<li class="list-group-item">
		<div class="row d-flex justify-content-between align-items-center">
			<div class="col-12 col-md-auto">
				<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_IMAGES'); ?></span>
			</div>
			<div class="col-md-1 d-flex justify-content-end">
				<?php if ($this->statistic['without_image'] > 0): ?>
				<span class="nevigen_auditor_stat_off hasTooltip btn btn-danger"
					  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_WITHOUT_IMAGE'); ?>">
					<?php echo $this->statistic['without_image'] ?>
				</span>
				<?php else:?>
					<span class="nevigen_auditor_stat_on hasTooltip btn btn-success  ms-2"
						  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_WITHOUT_IMAGE'); ?>">
						<?php echo Text::_('JNO'); ?>
					</span>
				<?php endif; ?>
			</div>
		</div>
	</li>
	<li class="list-group-item">
		<div class="row d-flex justify-content-between align-items-center">
			<div class="col-12 col-md-auto">
				<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_SHORT_DESCRIPTION'); ?></span>
			</div>
			<div class="col-md-1 d-flex justify-content-end">
				<?php if ($this->statistic['without_short_description'] > 0): ?>
				<span class="nevigen_auditor_stat_off hasTooltip btn btn-danger"
					  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_WITHOUT_SHORT_DESCRIPTION'); ?>">
					<?php echo $this->statistic['without_short_description'] ?>
				</span>
				<?php else:?>
					<span class="nevigen_auditor_stat_on hasTooltip btn btn-success  ms-2"
						  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_WITHOUT_SHORT_DESCRIPTION'); ?>">
						<?php echo Text::_('JNO'); ?>
					</span>
				<?php endif; ?>
			</div>
		</div>
	</li>
	<li class="list-group-item">
		<div class="row d-flex justify-content-between align-items-center">
			<div class="col-12 col-md-auto">
				<span class="nevigen_auditor_stat_name fs-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_FULL_DESCRIPTION'); ?></span>
			</div>
			<div class="col-md-1 d-flex justify-content-end">
				<?php if ($this->statistic['without_full_description'] > 0): ?>
				<span class="nevigen_auditor_stat_off hasTooltip btn btn-danger"
					  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_WITHOUT_FULL_DESCRIPTION'); ?>">
					<?php echo $this->statistic['without_full_description'] ?>
				</span>
				<?php else:?>
					<span class="nevigen_auditor_stat_on hasTooltip btn btn-success  ms-2"
						  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_WITHOUT_FULL_DESCRIPTION'); ?>">
						<?php echo Text::_('JNO') ?>
					</span>
				<?php endif; ?>
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
