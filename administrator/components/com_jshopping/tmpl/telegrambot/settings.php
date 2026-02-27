<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Factory;


?>
<div id="j-main-container" class="j-main-container">
    <ul class="nav nav-tabs" id="reportTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="form-tab" data-bs-toggle="tab" data-bs-target="#form" type="button" role="tab" aria-controls="form" aria-selected="true">
          <?= Text::_('PLG_JSHOPPING_TELEGRAMBOT_BASE_SETTINGS') ?>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="fields-tab" data-bs-toggle="tab" data-bs-target="#fields" type="button" role="tab" aria-controls="fields" aria-selected="false">
          <?= Text::_('PLG_JSHOPPING_TELEGRAMBOT_SEND_SETTINGS') ?>
        </button>
      </li>
            <li class="nav-item" role="presentation">
        <button class="nav-link" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="false">
          <?= Text::_('PLG_JSHOPPING_TELEGRAMBOT_SETTINGS_INFO') ?>
        </button>
      </li>
    </ul>
  <form action="index.php?option=com_jshopping&controller=telegrambot&task=save" method="post" enctype="multipart/form-data" name="adminForm" id="adminForm">

    <div class="tab-content mt-3" id="reportTabsContent">


      <?php echo $this->loadTemplate('form'); ?>
      <?php echo $this->loadTemplate('fields'); ?>
      <?php echo $this->loadTemplate('description'); ?>


    </div>
    <input type="hidden" name="task" value="" />

</form>

</div>
