<?php
/**
 * @version      5.0.0 15.09.2018
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
defined('_JEXEC') or die();

use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Language\Text;

$attribs['style'] = 'none';
?>
<div class="main-page">
    <div class="main-intro mb50">
        <div class="container-wide">
            <div class="flex between">
                <?php echo ModuleHelper::renderModule(ModuleHelper::getModules('main-intro-slider')[0], $attribs); ?>
                <?php echo ModuleHelper::renderModule(ModuleHelper::getModules('main-intro')[0], $attribs); ?>
            </div>
        </div>
    </div>
    <div class="container mb40">
        <h2 class="ttl md mb25"><?= Text::_('TPL_CUSTOM_POPULAR_PRODUCTS'); ?></h2>
        <?php echo ModuleHelper::renderModule(ModuleHelper::getModules('popular-home')[0], $attribs); ?>
    </div>
    <?php echo ModuleHelper::renderModule(ModuleHelper::getModules('main-advan')[0], $attribs); ?>
    <div class="mb40"></div>
    <div class="main-catalogue mb80" id="mainCatalogue">
        <div class="container">
            <div class="ttl md mb25"><?= Text::_('TPL_CUSTOM_CATALOG'); ?></div>
            <?php echo ModuleHelper::renderModule(ModuleHelper::getModules('main-catalogue')[0], $attribs); ?>
        </div>
    </div>
</div>