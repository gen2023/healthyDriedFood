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
$linkList = 'index.php?option=com_nevigen_audit&view=users';

?>

<h2 class="nevigen_auditor_stat_all d-flex align-items-center ">
	<span class="nevigen_auditor_stat_name me-4 "><?php echo Text::_('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_ALL'); ?></span>
	<span class="btn btn-warning rounded-pillfs-2"><?php echo $this->statistic['total'] ?></span>
</h2>
<ul class="list-group nevigen_auditor_remove_icon_link">
	<li class="list-group-item">
		<div class="row d-flex justify-content-between align-items-center">
			<div class="col-12 col-md-auto">
				<span class="nevigen_auditor_stat_name fs-3">
					<?php echo Text::_('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_STATE'); ?>
				</span>
			</div>
			<div class="col-md-1 d-flex justify-content-end align-items-center">
				<?php if ($this->statistic['unpublished'] > 0): ?>
					<a href="<?php echo $linkList; ?>&filter[state]=1">
						<span class="nevigen_auditor_stat_off hasTooltip  btn btn-danger"
							  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_UNPUBLISHED'); ?>">
							<?php echo $this->statistic['unpublished'] ?>
						</span>
					</a>
				<?php else: ?>
					<a href="<?php echo $linkList; ?>&filter[state]=0">
						<span class="nevigen_auditor_stat_on hasTooltip  btn btn-success ms-2"
							  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_UNPUBLISHED'); ?>">
							<?php echo Text::_('JNO') ?>
						</span>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</li>
	<?php if (!empty($this->statistic['groups'])): ?>
		<?php foreach ($this->statistic['groups'] as $group): ?>
			<li class="list-group-item">
				<div class="row d-flex justify-content-between align-items-center">
					<div class="col-12 col-md-auto">
						<span class="nevigen_auditor_stat_name fs-3">
							<?php echo Text::sprintf('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_GROUPS', $group['name']); ?>
						</span>
					</div>
					<div class="col-md-1 d-flex justify-content-end align-items-center">
						<a href="<?php echo $linkList; ?>&filter[usergroups]=<?php echo $group['id']; ?>">
							<?php if ($group['amount'] > 0): ?>
								<span class="nevigen_auditor_stat_off hasTooltip  btn btn-success"
									  title="<?php echo Text::sprintf('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_GROUPS', $group['name']); ?>">
									<?php echo $group['amount'] ?>
								</span>
							<?php else: ?>
								<span class="nevigen_auditor_stat_off hasTooltip  btn btn-danger"
									  title="<?php echo Text::sprintf('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_GROUPS', $group['name']); ?>">
									<?php echo Text::_('JNO'); ?>
								</span>
							<?php endif; ?>
						</a>
					</div>
				</div>
			</li>
		<?php endforeach; ?>
	<?php endif; ?>
	<?php if (!empty($this->statistic['top'])): ?>
		<h3 class="mb-3 mt-3"><?php echo Text::_('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_TOP'); ?></h3>
		<ol class="list-group">
			<?php foreach ($this->statistic['top'] as $u => $user):
				$name = [];
				if (!empty($user['f_name']))
				{
					$name[] = $user['f_name'];
				}
				if (!empty($user['l_name']))
				{
					$name[] = $user['l_name'];
				}
				if (empty($name))
				{
					$name[] = $user['u_name'];
				}
				?>
				<li class="list-group-item">
					<div class="row d-flex justify-content-between align-items-center">
						<div class="col-12 col-md-auto">
							<?php echo $u + 1 . '. '; ?>
							<a href="<?php echo $linkList; ?>&task=edit&user_id=<?php echo $user['user_id']; ?>"
							   class="nevigen_auditor_stat_name fs-3">
								<?php echo implode(' ', $name); ?>
							</a>
						</div>
						<div class="col-md-2 d-flex justify-content-end">
							<a href="index.php?option=com_nevigen_audit&view=orders&filter[user]=<?php echo $user['user_id']; ?>">
								<span class="nevigen_auditor_stat_on hasTooltip btn btn-success ms-2 "
									  title="<?php echo Text::_('COM_NEVIGEN_AUDIT_USERS_AUDIT_STATISTIC_TOP_ORDER_COUNT'); ?>">
									<?php echo $user['order_count'] ?>
								</span>
							</a>
						</div>
					</div>
				</li>
			<?php endforeach; ?>
		</ol>
	<?php endif; ?>
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
