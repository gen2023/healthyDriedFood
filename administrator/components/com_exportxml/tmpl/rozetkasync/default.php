<?php

use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;

/**
 * @package     com_exportxml
 *
 * @copyright   Copyright (C) 2020 Sofona. All rights reserved.
 * @license     GNU General Public License version 3; see LICENSE
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted Access');
?>
<div class="pagesettingComExportComponent row">

  <input type="hidden" name="controller" value="rozetkasync">
  <?php echo HTMLHelper::_('uitab.startTabSet', 'myTab', ['active' => 'binding', 'recall' => true, 'breakpoint' => 768]); ?>

  <?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'binding', Text::_('COM_EXPORT_BINDING')); ?>
  <?php echo $this->loadTemplate('binding'); ?>
  <?php echo HTMLHelper::_('uitab.endTab'); ?>

  <?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'exclude', Text::_('COM_EXPORT_EXCLUDE')); ?>
  <?php echo $this->loadTemplate('exclude'); ?>
  <?php echo HTMLHelper::_('uitab.endTab'); ?>

  <?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'params', Text::_('COM_EXPORT_TAB_PARAMS_PRODUCT')); ?>
  <?php echo $this->loadTemplate('params'); ?>
  <?php echo HTMLHelper::_('uitab.endTab'); ?>

  <?php echo HTMLHelper::_('uitab.endTabSet'); ?>

</div>