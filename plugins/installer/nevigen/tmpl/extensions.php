<?php
/*
 * @package    Nevigen Installer Plugin
 * @version    1.4.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;
/**
 * Layout variables
 * -----------------
 * @var  array  $extensionsList     Extensions list.
 * @var  array  $categories         Categories ids list.
 * @var  string $nevigenSearchValue Nevigen search value.
 * @var  string $lang               Language code.
 *
 */
if (empty($extensionsList)) return false;
?>
<div id="nevigenFilter">
	<button type="button" class="btn btn-sm btn-danger nevigen-button-filter-reset-all"
			onclick="window.NevigenInstaller().resetAllFilters()">
		<?php echo Text::_('PLG_INSTALLER_NEVIGEN_EXTENSION_SEARCH_RESET'); ?>
	</button>
	<?php if (!empty($categories)): ?>
		<div class="filter-category mb-4">
			<button type="button" data-nevigen-button-filter="category"
					data-value="all"
					onclick="window.NevigenInstaller().setFilter('category')"
					class="btn btn-outline-primary active">
				<?php echo Text::_('JALL'); ?>
			</button>
			<?php foreach ($categories as $id): ?>
				<button type="button" data-nevigen-button-filter="category"
						data-value="<?php echo $id; ?>"
						onclick="window.NevigenInstaller().setFilter('category',<?php echo $id; ?>)"
						class="btn btn-outline-primary">
					<?php echo Text::_('PLG_INSTALLER_NEVIGEN_EXTENSION_FILTER_CATEGORY_' . $id); ?>
				</button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
	<div class="filter-other mb-4">
		<div class="row align-items-center">
			<div class="col-md">
				<div class="btn-group w-100">
					<div class="input-group">
						<input type="text" name="nevigen_search" value="<?php echo $nevigenSearchValue; ?>"
							   class="form-control w-80"
							   placeholder="<?php echo Text::_('PLG_INSTALLER_NEVIGEN_EXTENSION_SEARCH'); ?>">
						<button type="button" class="btn btn-primary" onclick="window.NevigenInstaller().setSearch()">
							<span class="icon-search"></span>
						</button>
						<button type="button" class="btn btn-danger"
								onclick="window.NevigenInstaller().setSearch(true)">
							<span class="icon-remove"></span>
						</button>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="form-check form-switch">
					<label class="form-check-label" for="nevigen_type_free">
						<?php echo Text::_('PLG_INSTALLER_NEVIGEN_EXTENSION_FILTER_TYPE_FREE'); ?>
					</label>
					<input class="form-check-input" type="checkbox" name="nevigen_type_free"
						   data-nevigen-button-filter="type"
						   onchange="window.NevigenInstaller().setFilter('type',0)"
						   id="nevigen_type_free">
				</div>
				<div class="form-check form-switch">
					<label class="form-check-label" for="nevigen_hide_install">
						<?php echo Text::_('PLG_INSTALLER_NEVIGEN_EXTENSION_FILTER_HIDE_INSTALL'); ?>
					</label>
					<input class="form-check-input" type="checkbox" name="nevigen_hide_install"
						   data-nevigen-button-filter="install"
						   onchange="window.NevigenInstaller().setFilter('install',0)"
						   id="nevigen_hide_install">
				</div>
			</div>
		</div>
	</div>
</div>
<div class="listExtensions row gx-5">
	<?php foreach ($extensionsList as $extension):
		$install = ($extension['find']) ? 1 : 0;
		$type = ((int) $extension['paid'] === 1) ? 1 : 0;
		$attr = [
			'data-nevigen-filter-type="' . $type . '"',
			'data-nevigen-filter-install="' . $install . '"',
		];
		if (!empty($extension['category']))
		{
			$attr[] = 'data-nevigen-filter-category="' . $extension['category'] . '"';
		}

		if (!empty($nevigenSearchValue))
		{
			if ($nevigenSearchValue !== $extension['element'])
			{
				$attr[] = 'style="display:none"';
			}
		}
		?>
		<div class="item-extension col-md-4 gx-1 nd-flex align-items-stretch" <?php echo implode(' ', $attr); ?>>
			<div class="row template position-relative">
				<div class="col-md-4">
					<div class="image text-md-start text-center position-relative">
						<?php if (!empty($extension['product_link'])): ?>
							<a href="<?php echo $extension['product_link']; ?>" target="_blank">
								<img class="extens-img" src="<?php echo $extension['image']; ?>"
									 alt="<?php echo $extension['title']; ?>"/>
							</a>
						<?php else: ?>
							<img class="extens-img" src="<?php echo $extension['image']; ?>"
								 alt="<?php echo $extension['title']; ?>"/>
						<?php endif; ?>
					</div>
				</div>
				<div class="col-md-8">
					<div class="name" data-nevigen-search="<?php echo htmlentities($extension['title']) ?>">
						<?php if (!empty($extension['product_link'])): ?>
						<a href="<?php echo $extension['product_link']; ?>" target="_blank">
							<?php endif; ?>
							<?php echo $extension['title']; ?>
							<?php if (!empty($extension['product_link'])): ?>
						</a>
					<?php endif; ?>
					</div>
					<div class="nvg_extens_description fs-6 text-muted">
						<?php echo $extension['description']; ?>
					</div>
					<div>
						<span title="<?php echo (!$extension['compare'])
							? Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_COMPATIBLE_JOOMSHOPPING', $extension['component_version']) : '' ?>"
							  class="rounded-pill <?php echo ($extension['compare']) ? 'text-bg-primary' : 'text-bg-danger'; ?> small p-1 pe-2 ps-2">
							<?php echo $extension['component'] . ' v' . $extension['component_version'] . '+'; ?>
						</span>
					</div>
					<?php if (isset($extension['compare_nevigen_audit'])): ?>
						<div class="mt-2">
							<?php if ($extension['compare_nevigen_audit'] !== -1): ?>
								<span title="<?php echo (!$extension['compare_nevigen_audit'])
									? Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_COMPATIBLE_NEVIGEN_AUDIT', $extension['audit_version']) : '' ?>"
									  class="rounded-pill <?php echo ($extension['compare_nevigen_audit']) ? 'text-bg-success' : 'text-bg-danger'; ?> small p-1 pe-2 ps-2">
									<?php echo 'NevigenAudit v' . $extension['audit_version'] . '+'; ?>
								</span>
							<?php else: ?>
								<a href="https://nevigen.com/marketing/nevigen-audit-joomshopping.html" target="_blank"
								   title="<?php echo Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_COMPATIBLE_NEVIGEN_AUDIT', $extension['audit_version']); ?>"
								class="btn btn-danger btn-sm">
									<?php echo Text::_('PLG_INSTALLER_NEVIGEN_EXTENSION_NO_FIND') .': NevigenAudit'; ?>
								</a>
							<?php endif; ?>
						</div>
					<?php endif; ?>
					<div class="nvg-ext-buttons text-md-start text-center mt-3">
						<?php if ($extension['active'] && !$extension['find']): ?>
							<a href="#" class="btn btn-small btn-sm btn-success "
							   data-extension="<?php echo $extension['element']; ?>">
								<?php echo Text::_('COM_INSTALLER_INSTALL_BUTTON'); ?>
							</a>
						<?php endif; ?>
						<?php if ($extension['find']): ?>
							<button type="button" class="btn btn-small btn-sm btn-success disabled">
								<?php echo Text::_('PLG_INSTALLER_NEVIGEN_EXTENSION_FIND'); ?>
							</button>
						<?php endif; ?>
						<?php if (!$extension['active'] && !$extension['find'] && $extension['product_link']): ?>
							<a href="<?php echo $extension['product_link']; ?>"
							   class="btn btn-primary btn-small btn-sm" target="_blank">
								<?php echo Text::_('PLG_INSTALLER_NEVIGEN_EXTENSION_BUY'); ?>
							</a>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
	<?php endforeach; ?>
</div>
