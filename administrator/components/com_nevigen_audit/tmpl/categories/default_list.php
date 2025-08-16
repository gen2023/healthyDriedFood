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

use Joomla\CMS\Button\PublishedButton;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;

// Load assets
$this->document->getWebAssetManager()->useScript('com_nevigen_audit.administrator.list');

$user        = $this->getCurrentUser();
$listOrder   = $this->escape($this->state->get('list.ordering'));
$listDirn    = $this->escape($this->state->get('list.direction'));
$jshopConfig = JSFactory::getConfig();
$columns     = 6;
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
		<table id="categoriesList" class="table itemList" data-name="nevigen-audit-categories">
			<thead>
			<tr>
				<th class="w-1 text-center">
					<?php echo HTMLHelper::_('grid.checkall'); ?>
				</th>
				<th scope="col" class="w-1 text-center">
					<?php echo Text::_('JSTATUS'); ?>
				</th>
				<th class="w-1 text-center">
					<span class="icon-image"></span>
				</th>
				<th scope="col" class="w-100">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_TITLE', 'c.category_name',
						$listDirn, $listOrder); ?>
					<?php echo Text::_(''); ?>
				</th>
				<th scope="col" class="w-3 text-center">
					<?php echo Text::_('JSHOP_CATEGORY_PRODUCTS') ?>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_ID', 'c.category_id',
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
				$productsLink = 'index.php?option=com_jshopping&controller=products&category_id=' . $item->category_id;
				$editLink = 'index.php?option=com_jshopping&controller=categories&task=edit&category_id=' . $item->category_id;
				$image = (!empty($item->category_image)) ? $jshopConfig->image_category_live_path . '/' . $item->category_image : '';
				if (!empty($image) && !is_file($jshopConfig->image_category_path . '/' . $item->category_image))
				{
					$image = '';
				}
				$open = '';
				if ($item->level === 0 && $item->isNext == 1)
				{
					$open = '-open';
				}
				$style = '';
				if ($item->category_publish == 0){
					$style = 'style="opacity:0.5"';
				}
				?>
				<tr>
					<td>
						<?php echo HTMLHelper::_('grid.id', $i, $item->category_id); ?>
					</td>
					<td class="text-center">
						<?php echo (new PublishedButton)->render((int) $item->category_publish, $i, [
							'task_prefix' => 'categories.',
							'disabled'    => false,
							'id'          => 'state-' . $item->category_id
						]); ?>
					</td>
					<td <?php echo $style; ?>>
						<a href="<?php echo $editLink; ?>">
							<?php if (!empty($image))
							{
								echo HTMLHelper::image($image, null, [
									'style' => 'width:70px;height:auto;',
								]);
							}
							else
							{
								echo HTMLHelper::image('com_nevigen_audit/no-image.svg', null, [
									'style' => 'width:50px;height:auto;',
								], true);
							} ?>
						</a>
					</td>
					<td <?php echo $style; ?>>
						<?php echo $item->separator; ?>
						<?php echo $item->space; ?>
						<span class="text-info icon-folder<?php echo $open; ?>"></span>
						<a href="<?php echo $editLink; ?>" class="ms-1 d-inline-block">
							<?php echo $item->name ?>
						</a>
					</td>
					<td class="text-center" <?php echo $style; ?>>
						<?php if ($item->products > 0): ?>
							<a href="<?php echo $productsLink; ?>">
								<span class="badge bg-primary"><?php echo $item->products; ?></span>
							</a>
						<?php else: ?>
							<span class="badge"><?php echo $item->products; ?></span>
						<?php endif; ?>
					</td>
					<td>
						<?php echo $item->category_id; ?>
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