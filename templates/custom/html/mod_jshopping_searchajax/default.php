<?php
defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

?>

<?php $uniqid = $module->id; ?>
<div class="header-search jshop_searchajax <?php echo $class_sfx; ?>" data-module-id="<?= $uniqid ?>">
	<form name="searchForm" method="post"
		action="<?= Helper::SEFLink("index.php?option=com_jshopping&controller=search&task=result", 1); ?>"
		onsubmit="return isEmptyValue(jQuery('#jshop_search_<?= $uniqid ?>').val());" autocomplete="off">

		<input type="hidden" name="setsearchdata" value="1" />
		<input type="hidden" name="search_type" value="<?= $params->get('searchtype'); ?>" />
		<input type="hidden" name="category_id" class="jshop-category-id" value="<?= $category_id ?>" />

		<input
			type="text"
			class="input jshop-search-input"
			name="search"
			value="<?= htmlspecialchars($search, ENT_QUOTES) ?>"
			placeholder="<?= Text::_('MOD_JSHOP_SEARCHAJAX_PLACEHOLDER_SEARCH') ?>"
		/>

		<?php if ($btn_icon): ?>
			<button type="submit" class="btn icon-search"></button>
		<?php else: ?>
			<input class="button" type="submit" value="<?= Text::_('MOD_JSHOP_SEARCHAJAX_GO') ?>" />
		<?php endif; ?>

		<?php if ($adv_search): ?>
			<br /><a href="<?= $adv_search_link ?>"><?= Text::_('MOD_JSHOP_SEARCHAJAX_LINK_ADVANCED_SEARCH') ?></a>
		<?php endif; ?>
	</form>

	<div class="jshop-search-result"></div>
</div>


<script>
  window.JSHOP_SEARCH_INSTANCES = window.JSHOP_SEARCH_INSTANCES || [];
  window.JSHOP_SEARCH_INSTANCES.push({
    moduleId: <?= $uniqid ?>,
    ajaxLink: "<?= Helper::SEFLink("index.php?option=com_jshopping&controller=searchajax&ajax=1", 1, 1); ?>",
    displayCount: "<?= $params->get('displaycount'); ?>",
    moreResults: "<?= $params->get('more_results'); ?>",
    searchByName: "<?= $params->get('search_by_name'); ?>",
    searchByKode: "<?= $params->get('search_by_kode'); ?>",		
    searchType: "<?= $params->get('searchtype'); ?>",
    ajaxSearch: "<?= $params->get('ajax_search'); ?>"
  });
</script>
