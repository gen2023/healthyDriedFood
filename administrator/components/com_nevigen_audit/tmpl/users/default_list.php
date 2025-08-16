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

use Joomla\CMS\Access\Access;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;

// Load assets
$this->document->getWebAssetManager()->useScript('com_nevigen_audit.administrator.list');

$user = $this->getCurrentUser();
$listOrder   = $this->escape($this->state->get('list.ordering'));
$listDirn    = $this->escape($this->state->get('list.direction'));
$jshopConfig = JSFactory::getConfig();
$columns     = 10

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
		<table id="usersList" class="table itemList" data-name="nevigen-audit-users">
			<thead>
			<tr>
				<th class="w-1 text-center">
					<?php echo HTMLHelper::_('grid.checkall'); ?>
				</th>
				<th colspan="3" scope="col" class="center"></th>
				<th scope="col">
					<?php echo Text::_('COM_NEVIGEN_AUDIT_USERS_FIO'); ?>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_USERNAME', 'us.u_name',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col">
					<?php echo Text::_('JSHOP_EMAIL'); ?>
				</th>
				<th scope="col" class="text-nowrap">
					<?php echo Text::_('JSHOP_USERGROUP_NAME'); ?>
				</th>
				<th scope="col" class="w-10 d-none d-md-table-cell">
					<?php echo HTMLHelper::_('searchtools.sort',
						'COM_NEVIGEN_AUDIT_USERS_LOGIN_DATE', 'u.lastvisitDate',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_ID', 'us.user_id',
						$listDirn, $listOrder); ?>
				</th>

			</tr>
			</thead>
			<tfoot>
			<tr>
				<td colspan="<?php echo $columns; ?>" class="text-end">
					<?php echo $this->pagination->getResultsCounter(); ?>
				</td>
			</tr>
			</tfoot>
			<tbody>
			<?php foreach ($this->items as $i => $item):
				$item->note_count = 1;
				$canEdit   = $this->canDo->get('core.edit');
				$canChange = $user->authorise('core.edit.state', 'com_users');
				$ordersLink = 'index.php?option=com_nevigen_audit&view=orders&&filter[user]='.$item->user_id;
				$editLink = 'index.php?option=com_jshopping&controller=users&task=edit&user_id='.$item->user_id;
				if ((!$user->authorise('core.admin')) && Access::check($item->id, 'core.admin')) {
					$canEdit   = false;
					$canChange = false;
					$editLink = '#';
				}

				?>
				<tr>
					<td>
						<?php echo HTMLHelper::_('grid.id', $i, $item->user_id); ?>
					</td>
					<td class="center ps-2 pe-2">
						<a class="btn btn-sm btn-mini btn-info"
						   href="<?php echo $ordersLink ?>"
						   title="<?php print Text::_('JSHOP_ORDERS') ?>">
							<span class="icon-list"></span>
						</a>
						<div role="tooltip"><?php echo Text::_('JSHOP_ORDERS') ?></div>
					</td>
					<td class="text-center d-md-table-cell">
						<?php $self = $user->id == $item->user_id; ?>
						<?php if ($canChange) : ?>
							<?php echo HTMLHelper::_('jgrid.state',
								HTMLHelper::_('nevigenUsers.blockStates', $self),
								$item->block, $i, 'users.', !$self); ?>
						<?php else : ?>
							<?php echo HTMLHelper::_('jgrid.state',
								HTMLHelper::_('nevigenUsers.blockStates', $self),
								$item->block, $i, 'users.', false); ?>
						<?php endif; ?>
					</td>
					<td class="center ps-0 pe-2">
						<a class="btn btn-sm btn-outline-info"
						   href="<?php echo $editLink;?>">
							<i class="icon-edit"></i>
						</a>
					</td>
					<td>
						<a class="fw-bold" href="<?php echo $editLink;?>">
							<?php echo $item->name ?>
						</a>
						<?php if (!empty($item->firma_name)): ?>
							<div class="small text-primary mt-1">
								<?php echo Text::_('JSHOP_FIRMA') . ': ' . '<b>' . $item->firma_name . '</b>'; ?>
							</div>
						<?php endif; ?>
					</td>
					<td>
						<a href="<?php echo $editLink;?>">
							<?php echo $item->u_name ?>
						</a>
					</td>
					<td>
						<a class="text-reset" href="mailto:<?php echo $item->email; ?>">
							<span class="icon-mail"></span> <?php echo $item->email; ?>
						</a>
					</td>
					<td>
						<span class="icon-users"></span> <?php echo $item->usergroup_name; ?>
					</td>
					<td class="text-nowrap d-none d-lg-table-cell">
						<small><?php echo (empty($item->lastvisitDate)) ? Text::_('JNEVER') :
								HTMLHelper::date($item->lastvisitDate, Text::_('DATE_FORMAT_LC6')); ?></small>
					</td>
					<td>
						<?php echo $item->user_id; ?>
					</td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
		<?php echo $this->pagination->getListFooter(); ?>
		<input type="hidden" name="task" value=""/>
		<input type="hidden" name="boxchecked" value="0"/>
		<?php echo HTMLHelper::_('form.token'); ?>
	<?php endif; ?>
</form>
