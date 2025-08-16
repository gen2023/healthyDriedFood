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
use Joomla\CMS\Form\FormHelper;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;

extract($displayData);

/**
 * Layout variables
 * -----------------
 * @var  Joomla\CMS\MVC\View\HtmlView $view    Current view object.
 * @var  array                        $options Search tools options.
 *
 */

/** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
$assets = Factory::getApplication()->getDocument()->getWebAssetManager();

/** @var \Joomla\CMS\Form\Form $form */
$form        = $view->filterForm;
$buttons     = (!empty($options['buttons'])) ? $options['buttons'] : [];
$selectors   = $form->getFieldset('selectors');
$search      = $form->getFieldset('search');
$list        = $form->getFieldset('list');
$filters     = $form->getFieldset('filters');
$searchField = $form->getField('search', 'filter');

// Set filters class
$filtersClass = 'js-stools-container-filters clearfix';
if (!empty($view->activeFilters) || !empty($options['alwaysShowFilters']))
{
	$filtersClass .= ' js-stools-container-filters-visible';
}

// Load search tools
$formSelector = (!empty($options['formSelector'])) ? $options['formSelector'] : '#adminForm';
if (empty($options['orderFieldSelector']))
{
	$options['orderFieldSelector'] = '#list_fullordering';
}
if (empty($options['searchFieldSelector']))
{
	$options['searchFieldSelector'] = '#filter_search';
}

HTMLHelper::_('searchtools.form', $formSelector, $options);
?>
<div class="js-stools" role="search">
	<?php if (!empty($buttons) || !empty($selectors)): ?>
		<div class="d-flex flex-wrap align-items-center">
			<?php if (!empty($buttons)): ?>
				<div class="js-stools-container-selector me-3">
					<?php foreach ($buttons as $button):
						$href = (!empty($button['href'])) ? Route::_($button['href']) : 'javascript:void(0)';
						$onclick = (!empty($button['onclick'])) ? 'onclick="' . $button['onclick'] . '"' : '';
						?>
						<a href="<?php echo $href; ?>" <?php echo $onclick; ?>
						   class="no-before-icon btn btn-outline-info me-2">
							<?php if (!empty($button['icon'])): ?>
								<span class="icon-<?php echo $button['icon']; ?> me-1"></span>
							<?php endif; ?>
							<span class="fw-normal">
								<?php echo Text::_($button['text']); ?>
							</span>
						</a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
			<?php foreach ($selectors as $field): ?>
				<div class="js-stools-container-selector me-3">
					<div class="visually-hidden">
						<?php echo $field->label; ?>
					</div>
					<?php echo $field->input; ?>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
	<div class="js-stools-container-bar">
		<div class="btn-toolbar">
			<?php if (!empty($search) || !empty($searchField) || !empty($filters)): ?>
				<div class="filter-search-bar btn-group">
					<?php if (!empty($searchField)): ?>
						<div class="input-group">
							<?php echo $searchField->input; ?>
							<?php if ($searchField->description) : ?>
								<div role="tooltip"
									 id="<?php echo ($searchField->id ?: $searchField->name) . '-desc'; ?>"
									 class="filter-search-bar__description">
									<?php echo Text::_($searchField->description); ?>
								</div>
							<?php endif; ?>
							<span class="filter-search-bar__label visually-hidden">
								<?php echo $searchField->label; ?>
							</span>
							<button type="submit" class="filter-search-bar__button btn btn-primary"
									aria-label="<?php echo Text::_('JSEARCH_FILTER_SUBMIT'); ?>">
								<span class="filter-search-bar__button-icon icon-search" aria-hidden="true"></span>
							</button>
						</div>
					<?php endif; ?>
					<?php foreach ($search as $field):
						if ($field->fieldname === 'search')
						{
							continue;
						}
						?>
						<div class="input-group ms-2">
							<div class="visually-hidden">
								<?php echo $field->label; ?>
							</div>
							<?php echo $field->input; ?>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
			<div class="filter-search-actions btn-group">
				<?php if (!empty($filters)) : ?>
					<button type="button" class="filter-search-actions__button btn btn-primary js-stools-btn-filter">
						<?php echo Text::_('JFILTER_OPTIONS'); ?>
						<span class="icon-angle-down" aria-hidden="true"></span>
					</button>
				<?php endif; ?>
				<button type="button" class="filter-search-actions__button btn btn-primary js-stools-btn-clear">
					<?php echo Text::_('JSEARCH_FILTER_CLEAR'); ?>
				</button>
			</div>
			<?php if (!empty($list)) : ?>
				<div class="ordering-select">
					<?php foreach ($list as $field) : ?>
						<div class="js-stools-field-list">
							<span class="visually-hidden"><?php echo $field->label; ?></span>
							<?php echo $field->input; ?>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
	<?php if ($filters) : ?>
		<div class="<?php echo $filtersClass; ?>">
			<?php foreach ($filters as $fieldName => $field) :
				$dataShowOn = '';
				if ($field->showon)
				{
					$assets->useScript('showon');
					$dataShowOn = json_encode(FormHelper::parseShowOnConditions($field->showon, $field->formControl,
						$field->group));
					$dataShowOn = " data-showon='" . $dataShowOn . "'";

				} ?>
				<div class="js-stools-field-filter"<?php echo $dataShowOn; ?>>
					<span class="visually-hidden"><?php echo $field->label; ?></span>
					<?php echo $field->input; ?>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>