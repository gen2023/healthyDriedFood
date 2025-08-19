<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

$app = Factory::getApplication();
$params = $this->settingsPlg;

$jshopConfig = JSFactory::getConfig();
?>
<div class="">
  <form method="post" action="index.php?option=com_jshopping&controller=sofonareports" method="post" enctype="multipart/form-data" name="adminForm" id="adminForm">
    <div class="card p-4 mb-3">
      <?php
      $baseFilds = [
        'useLibrary' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USE_LIBRARY',
        'show_repport_order' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SHOW_REPORT_ORDER',
        'show_repport_products' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SHOW_REPORT_PRODUCTS',
        'show_repport_clients' => 'PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SHOW_REPORT_CLIENTS',
      ];
      foreach ($baseFilds as $name => $label) { ?>
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" name="<?= $name ?>" id="<?= $name ?>" value="1" <?= !empty($params[$name]) ? 'checked' : '' ?>>
          <label class="form-check-label" for="<?= $name ?>"><?= Text::_($label) ?></label>
        </div>
      <?php } ?>
    </div>
    <ul class="nav nav-tabs" id="reportTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders" type="button" role="tab" aria-controls="orders" aria-selected="true">
          <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_TAB_ORDERS') ?>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="products-tab" data-bs-toggle="tab" data-bs-target="#products" type="button" role="tab" aria-controls="products" aria-selected="false">
          <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_TAB_PRODUCTS') ?>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="products-tab" data-bs-toggle="tab" data-bs-target="#clients" type="button" role="tab" aria-controls="clients" aria-selected="false">
          <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_TAB_CLIENTS') ?>
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="reportTabsContent">
      <?php echo $this->loadTemplate('order'); ?>
      <?php echo $this->loadTemplate('products'); ?>
      <?php echo $this->loadTemplate('clients'); ?>
    </div>
    <input type="hidden" name="task" value="" />

  </form>
</div>