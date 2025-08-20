<?php

/**
 * @package     Joomla.Site
 * @subpackage  Templates.custom
 *
 * @copyright   (C) 2017 Open Source Matters, Inc. <https://www.joomla.org>
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

/** @var Joomla\CMS\Document\HtmlDocument $this */

$app = Factory::getApplication();
$input = $app->getInput();
$wa = $this->getWebAssetManager();
$document = Factory::getApplication()->getDocument();
$document->setGenerator('');
$user = Factory::getUser();

// Browsers support SVG favicons
// $this->addHeadLink(HTMLHelper::_('image', 'joomla-favicon.svg', '', [], true, 1), 'icon', 'rel', ['type' => 'image/svg+xml']);
$this->addHeadLink(HTMLHelper::_('image', 'favicon.ico', '', [], true, 1), 'alternate icon', 'rel', ['type' => 'image/vnd.microsoft.icon']);
$this->addHeadLink(HTMLHelper::_('image', 'joomla-favicon-pinned.svg', '', [], true, 1), 'mask-icon', 'rel', ['color' => '#000']);

$this->setMetaData('viewport', 'width=device-width, initial-scale=1');

// Detecting Active Variables
$option = $input->getCmd('option', '');
$view = $input->getCmd('view', '');
$layout = $input->getCmd('layout', '');
$task = $input->getCmd('task', '');
$itemid = $input->getCmd('Itemid', '');
$sitename = htmlspecialchars($app->get('sitename'), ENT_QUOTES, 'UTF-8');
$menu = $app->getMenu()->getActive();
$pageclass = $menu !== null ? $menu->getParams()->get('pageclass_sfx', '') : '';

$wa->useStyle('swiper.min.style');
$wa->useStyle('lightgallery.min.style');
$wa->useStyle('main.custom.style');
$wa->useStyle('media.custom.style');

$user = Factory::getApplication()->getIdentity();

if ($this->params->get('logoFile')) {
    $logo = HTMLHelper::_('image', Uri::root(false) . htmlspecialchars($this->params->get('logoFile'), ENT_QUOTES), $sitename, ['loading' => 'eager', 'decoding' => 'async'], false, 0);
} elseif ($this->params->get('siteTitle')) {
    $logo = '<span title="' . $sitename . '" class="logoText">' . htmlspecialchars($this->params->get('siteTitle'), ENT_COMPAT, 'UTF-8') . '</span>';
} else {
    $logo = HTMLHelper::_('image', 'logo.svg', $sitename, ['class' => 'logo d-inline-block', 'loading' => 'eager', 'decoding' => 'async'], true, 0);
}

if ($user->guest) {
    $pageclass .= ' notavtorized';
}

?>
<!DOCTYPE html>
<html lang="<?= $this->language ?>">

<head>
    <jdoc:include type="metas" />
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" /> <?php // по возможности переносим в футер ?>
</head>

<body class="header-sticky <?= $pageclass ?>">
    <div class="body-wrapper">
        <header class="header sticky">
            <div class="top">
                <div class="container">
                    <div class="flex between">
                        <div class="header-menu">
                            <jdoc:include type="modules" name="header-menu" style="none" />
                        </div>
                        <div class="header-contacts flex">
                            <a href="https://t.me/healthyDriedFood" class="messenger icon-telegram"></a>
                            <a href="viber://chat?number=%2B380731401664" class="messenger icon-viber"></a>
                            <a href="tel:+380731401664" class="tel">+380 (73) 140-16-64</a>
                            <div class="shedule icon-clock"><?= Text::_('TPL_CUSTOM_SHEDULE'); ?> 09:00-20:00</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom container-wide">
                <div class="wrapper">
                    <div class="container">
                        <div class="flex align-center">
                            <a href="<?= Text::_('TPL_CUSTOM_HOME'); ?>" class="logo" title="">
                                <?= $logo ?>
                            </a>
                            <div class="btn btn-white show-cat show-cat-menu icon-catalog">
                                <?= Text::_('TPL_CUSTOM_CATALOG'); ?><span class="arr"></span>
                                <div class="cat-wrapper">
                                    <div class="wrapper">
                                        <jdoc:include type="modules" name="cat-menu" style="none" />
                                    </div>
                                </div>
                            </div>

                            <jdoc:include type="modules" name="search" style="none" />
                            <jdoc:include type="modules" name="lang" style="none" />

                            <div class="header-links flex">
                                <a href="index.php?Itemid=263" class="icon-user"></a>
                                <a href="#" class="icon-search show-search"></a>
                                <jdoc:include type="modules" name="wishlist" style="none" />
                                <jdoc:include type="modules" name="cart" style="none" />
                            </div>
                            <div class="burger-menu icon-burger"></div>
                        </div>

                    </div>
                </div>
            </div>
        </header>
        <main class="main">
            <jdoc:include type="message" />
            <jdoc:include type="component" />
        </main>
        <footer class="footer">
            <div class="container-wide">
                <div class="wrapper">
                    <div class="container">
                        <div class="top">
                            <div class="flex between">
                                <div class="footer-contacts">
                                    <jdoc:include type="modules" name="footer-contacts" style="none" />
                                </div>
                                <div class="footer-catalog">
                                    <div class="ttl white font-size-18 mb30"><?= Text::_('TPL_CUSTOM_CATALOG'); ?></div>
                                    <jdoc:include type="modules" name="footer-catalog" style="none" />
                                </div>
                                <div class="footer-menu">
                                    <div class="ttl white font-size-18 mb30"><?= Text::_('TPL_CUSTOM_FOR_CLIENTS'); ?></div>
                                    <jdoc:include type="modules" name="footer-menu" style="none" />
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="copy">© All rights reserved. HealthyDriedFood. <?php echo date('Y'); ?></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        <jdoc:include type="modules" name="debug" style="none" />
    </div>
    <div id="toTop" class="icon-up"></div>
    <div class="mobile-menu">
        <div class="inner first">
            <div class="top flex between align-center">
                <a href="<?= Text::_('TPL_CUSTOM_HOME'); ?>" class="logo" title="">
                    <?= $logo; ?>
                </a>
                <jdoc:include type="modules" name="lang-mob" style="none" />
                <div class="close icon-close"></div>
            </div>
            <div class="btn show-cat show-cat-mobile icon-catalog"><?= Text::_('TPL_CUSTOM_CATALOG'); ?></div>
            <div class="mob-menu">
                <?php if ($user->guest) { ?>
                    <a href="index.php?Itemid=263" class="icon-user"><?= Text::_('TPL_CUSTOM_REGISTER_PAGE_TEXT_LINK_LOGIN') ?></a>
                <?php } else { ?>
                    <jdoc:include type="modules" name="user-menu" style="none" />
                <?php } ?>
                <jdoc:include type="modules" name="header-menu" style="none" />
            </div>
            <div class="footer-contacts">
                <jdoc:include type="modules" name="footer-contacts" style="none" />
            </div>
        </div>
        <div class="inner mob-cat-menu">
            <div class="top flex between align-center mb40">
                <div class="ttl md"><?= Text::_('TPL_CUSTOM_CATALOG'); ?></div>
                <div class="close icon-close"></div>
            </div>
            <jdoc:include type="modules" name="cat-menu" style="none" />
        </div>
    </div>
    <div class="buy-caption-success">
        <div class="close icon-close"></div><?= Text::_('TPL_CUSTOM_BUY_CAPTION_SUCCESS'); ?>
    </div>
    <?php
    $wa->useScript('jquery.script');
    $wa->useScript('swiper.script');
    $wa->useScript('lightgallery.script');
    $wa->useScript('inputmask.script');
    $wa->useScript('main.custom.script');
    ?>
    <script src="/templates/custom/uForm/js/script.js"></script> <!-- uform -->
</body>

</html>