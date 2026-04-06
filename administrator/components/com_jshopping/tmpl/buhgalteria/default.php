<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

$jshopConfig = JSFactory::getConfig();

?>
<ul class="nav nav-tabs" id="buhgalteriaTabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="products-tab" data-bs-toggle="tab" data-bs-target="#products" type="button" role="tab" aria-controls="products" aria-selected="true">
      Товары
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="consumables-tab" data-bs-toggle="tab" data-bs-target="#consumables" type="button" role="tab" aria-controls="consumables" aria-selected="false">
      Расходники
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="statistic-tab" data-bs-toggle="tab" data-bs-target="#statistic" type="button" role="tab" aria-controls="statistic" aria-selected="false">
      Статистика
    </button>
  </li>
</ul>
<div class="tab-content mt-3" id="reportTabsContent">
  <?php echo $this->loadTemplate('products'); ?>
  <?php echo $this->loadTemplate('consumables'); ?>
  <?php echo $this->loadTemplate('statistic'); ?>

</div>