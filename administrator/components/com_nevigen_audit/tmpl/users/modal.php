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

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;

// Load assets
$this->document->getWebAssetManager()->useScript('com_nevigen_audit.administrator.list');

$listOrder = $this->escape($this->state->get('list.ordering'));
$listDirn  = $this->escape($this->state->get('list.direction'));

$app      = Factory::getApplication();
$selector = $app->input->getCmd('selector');
$function = $app->input->getCmd('function');
$onClick  = 'window.parent.' . $function . '(this);';
$columns = 6
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
				<th scope="col">
					<?php echo Text::_('COM_NEVIGEN_AUDIT_USERS_FIO'); ?>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_USERNAME', 'us.u_name',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_EMAIL', 'us.email',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_USERGROUP_NAME', 'usergroup_name',
						$listDirn, $listOrder); ?>
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
				$link = 'href="#" onclick="' . $onClick . '" data-id="' . $item->user_id . '" data-selector="'
					. $selector . '"';
				?>
				<tr>
					<td>
						<a <?php echo $link; ?> class="d-block">
							<?php echo $item->name ?>
						</a>
						<?php if (!empty($item->firma_name)):?>
							<div class="small text-primary mt-2">
								<?php echo $item->firma_name;?>
							</div>
						<?php endif;?>
					</td>
					<td>
						<a <?php echo $link; ?> class="d-block">
							<?php echo $item->u_name?>
						</a>
					</td>
					<td>
						<a <?php echo $link; ?> class="d-block">
							<span class="icon-mail"></span> <?php echo $item->email;?>
						</a>
					</td>
					<td>
						<span class="icon-users"></span> <?php echo $item->usergroup_name;?>
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
