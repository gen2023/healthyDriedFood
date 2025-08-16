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
use Joomla\Component\Jshopping\Site\Helper\Helper;

// Load assets
$this->document->getWebAssetManager()->useScript('com_nevigen_audit.administrator.list');

$user        = $this->getCurrentUser();
$listOrder   = $this->escape($this->state->get('list.ordering'));
$listDirn    = $this->escape($this->state->get('list.direction'));
$jshopConfig = JSFactory::getConfig();
$columns     = 9;
$disable     = $jshopConfig->disable_admin;
$categories  = $this->state->get('filter.categories');
$category_id = 0;
if (!empty($categories) && count($categories) === 1)
{
	$category_id = (int) $categories[0];
}
$saveOrder = ($listOrder == 'pc.product_ordering' && strtolower($listDirn) == 'asc');
if ($saveOrder && !empty($this->items) && $category_id > 0)
{
	$saveOrderingUrl = 'index.php?option=com_jshopping&controller=products&task=saveorder&category_id=' . $category_id . '&tmpl=component&ajax=1';

	HTMLHelper::_('draggablelist.draggable');
}

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
		<table id="productsList" class="table itemList" data-name="nevigen-audit-products">
			<thead>
			<tr>
				<th scope="col" style="width:1%" class="text-center">
					<?php if ($category_id > 0): ?>
						<?php echo HTMLHelper::_('searchtools.sort',
							'', 'pc.product_ordering',
							$listDirn, $listOrder,
							null, 'asc', 'JGRID_HEADING_ORDERING', 'icon-sort'); ?>
					<?php else: ?>
						#
					<?php endif; ?>
				</th>
				<th class="w-1 text-center">
					<?php echo HTMLHelper::_('grid.checkall'); ?>
				</th>
				<th scope="col" class="w-1 text-center">
					<?php echo Text::_('JSTATUS'); ?>
				</th>
				<th class="w-1 text-center">
					<span class="icon-image"></span>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_TITLE', 'name',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col" class="w-20">
					<?php echo Text::_('JSHOP_CATEGORY'); ?>
				</th>
				<?php if ($jshopConfig->admin_show_vendors) : $columns++; ?>
					<th scope="col">
						<?php echo Text::_('JSHOP_VENDOR'); ?>
					</th>
				<?php endif; ?>
				<th scope="col" class="w-10 d-none d-md-table-cell text-center">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_QUANTITY', 'p.product_quantity',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col" class="w-10 d-none d-md-table-cell">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_PRICE', 'p.product_price',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col" class="w-10 d-none d-md-table-cell">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_DATE', 'p.product_date_added',
						$listDirn, $listOrder); ?>
				</th>
				<th scope="col">
					<?php echo HTMLHelper::_('searchtools.sort',
						'JSHOP_ID', 'p.product_id',
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
			<tbody <?php if ($saveOrder && !empty($saveOrderingUrl))  : ?> class="js-draggable" data-url="<?php echo $saveOrderingUrl; ?>"
				data-direction="<?php echo strtolower($listDirn); ?>" data-nested="false" <?php endif; ?>>
			<?php foreach ($this->items as $i => $item):
				$editLink = 'index.php?option=com_jshopping&controller=products&task=edit&product_id=' . $item->product_id;
				$image = (!empty($item->image)) ? $jshopConfig->image_product_live_path . '/' . $item->image : '';
				if (!empty($image) && !is_file($jshopConfig->image_product_path . '/' . $item->image))
				{
					$image = '';
				}
				?>
				<tr data-draggable-group="1" item-id="<?php echo $item->product_id; ?>"="" level="1">
				<td class="order text-center">
					<span class="sortable-handler <?php if (empty($saveOrder) || $category_id === 0) echo 'inactive'; ?>">
						<span class="icon-ellipsis-v" aria-hidden="true"></span>
					</span>
					<?php if ($saveOrder) { ?>
						<input type="text" class="hidden" name="order[]" value="<?php echo $item->product_ordering; ?>">
					<?php } ?>
				</td>
				<td>
					<?php echo HTMLHelper::_('grid.id', $i, $item->product_id); ?>
				</td>
				<td class="text-center">
					<?php echo (new PublishedButton)->render((int) $item->product_publish, $i, [
						'task_prefix' => 'products.',
						'disabled'    => false,
						'id'          => 'state-' . $item->product_id
					]); ?>
				</td>
				<td class="position-relative">
					<?php if ($item->label_id) { ?>
						<div class="position-absolute top-0 left-0">
							<?php if (isset($item->_label_image) && $item->_label_image): ?>
								<img src="<?php echo $item->_label_image ?>" width="25" alt=""/>
							<?php else: ?>
								<span class="label_name"><?php print $item->_label_name; ?></span>
							<?php endif; ?>
						</div>
					<?php } ?>
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
				<td>
					<a href="<?php echo $editLink; ?>">
						<?php echo $item->name; ?>
					</a>
					<?php if (!empty($item->product_ean)): ?>
						<div class="small">
							<span class="fw-bold"><?php echo Text::_('JSHOP_EAN_PRODUCT') . '</span>: ' . $item->product_ean; ?>
						</div>
					<?php endif; ?>
					<?php if (!empty($item->manufacturer_name)) : ?>
						<div class="small">
							<span class="fw-bold"><?php echo Text::_('JSHOP_MANUFACTURER') . '</span>: ' . $item->manufacturer_name; ?>
						</div>
					<?php endif; ?>
				</td>
				<td>
					<?php echo $item->all_category_names; ?>
				</td>

				<?php if ($jshopConfig->admin_show_vendors) : ?>
				<td>
					<?php echo $item->shop_name; ?>
				</td>
			<?php endif; ?>
				<td class="text-center">
					<?php if ($item->unlimited)
					{
						echo '<small class="badge text-bg-success">' . Text::_('JSHOP_UNLIMITED') . '</small>';
					}
					else
					{
						echo floatval($item->product_quantity);
					} ?>
				</td>
				<td>
					<?php echo Helper::formatprice($item->product_price, Helper::sprintCurrency($item->currency_id)); ?>
				</td>
				<td>
					<small><?php echo Helper::formatdate($item->product_date_added, 1); ?></small>
				</td>
				<td>
					<?php echo $item->product_id; ?>
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