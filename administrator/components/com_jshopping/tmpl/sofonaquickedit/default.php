<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Factory;


$lang = Factory::getApplication()->getLanguage();
$lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

?>
<div id="j-main-container" class="j-main-container">
    <ul class="nav nav-tabs" id="reportTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="edit-tab" data-bs-toggle="tab" data-bs-target="#edit" type="button" role="tab" aria-controls="edit" aria-selected="true">
          <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_TAB_EDIT') ?>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab" aria-controls="history" aria-selected="false">
          <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_TAB_HISTORY') ?>
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="reportTabsContent">


      <?php echo $this->loadTemplate('edit'); ?>
      <?php echo $this->loadTemplate('history'); ?>


    </div>
</div>
<script>
  jQuery(function () {
    jshopAdmin.setMainMenuActive(
      '<?php print Uri::base() ?>index.php?option=com_jshopping&controller=products&category_id=0');
  });
</script>