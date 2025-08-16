<?php

use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;

/**
 * @package     com_exportxml
 *
 * @copyright   Copyright (C) 2020 Sofona. All rights reserved.
 * @license     GNU General Public License version 3; see LICENSE
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted Access');
$document = Factory::getDocument();
$document->addScriptDeclaration("
    function copyToClipboard(link) {
        navigator.clipboard.writeText(link).then(function() {
            alert('Ссылка скопирована: ' + link);
        }).catch(function(err) {
            alert('Ошибка копирования: ' + err);
        });
    }
");
?>
<div class="row">
  <div class="col-4">
    <div class="mt-3">
      <?php foreach ($this->cronUrls as $name => $url): ?>
        <div class="item mt-3">
          <a href="<?= $url; ?>" target="_blank" class="btn btn-primary">
            <?= Text::_('COM_EXPORT_GERERATE_XML') . ' ' . $name; ?>
          </a>
          <button class="btn btn-secondary" onclick="copyToClipboard('<?= $url; ?>')">
            <i class="icon-copy"></i>
          </button>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
  <div class="col-8">
    <div class="panelSetting">
      <div style="float:left;">
        <div class="icon">
          <a href="index.php?option=com_config&view=component&component=com_exportxml">
            <i class="icon-options"></i>
            <p><?= Text::_('COM_EXPORT_SETTING_COMPONENT') ?></p>
          </a>
        </div>
      </div>
      <?php if ($this->params->enable_googleshop == 1) { ?>
        <div style="float:left;">
          <div class="icon">
            <a href="index.php?option=com_exportxml&controller=googlesync">
              <i class="fas fa-wrench"></i>
              <p><?= Text::_('COM_EXPORT_GOOGLE_SHOP_CATEGORY') ?></p>
            </a>
          </div>
        </div>
      <?php } ?>
      <?php if ($this->params->enable_prom == 1) { ?>
        <div style="float:left;">
          <div class="icon">
            <a href="index.php?option=com_exportxml&controller=promsync">
              <i class="fas fa-wrench"></i>
              <p><?= Text::_('COM_EXPORT_PROM_SHOP_CATEGORY') ?></p>
            </a>
          </div>
        </div>
      <?php } ?>
      <?php if ($this->params->enable_rozetka == 1) { ?>
        <div style="float:left;">
          <div class="icon">
            <a href="index.php?option=com_exportxml&controller=rozetkasync">
              <i class="fas fa-wrench"></i>
              <p><?= Text::_('COM_EXPORT_ROZETKA_SHOP_CATEGORY') ?></p>
            </a>
          </div>
        </div>
      <?php } ?>
    </div>
  </div>
</div>