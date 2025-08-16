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
$this->addHeadLink(HTMLHelper::_('image', 'favicon1.ico', '', [], true, 1), 'alternate icon', 'rel', ['type' => 'image/vnd.microsoft.icon']);
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
    $pageclass .=' notavtorized';
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
                            <a href="https://t.me/Dmitry_Khaidarov" class="messenger icon-telegram"></a>
                            <a href="viber://chat?number=%2B380994445001" class="messenger icon-viber"></a>
                            <a href="tel:+380994445001" class="tel">+380 (99) 444-50-01</a>
                            <div class="shedule icon-clock"><?= Text::_('TPL_CUSTOM_SHEDULE'); ?> 09:00-20:00</div>
                            <a href="/" class="channel icon-telegram" target="_blank"><?= Text::_('TPL_CUSTOM_TELEGRAM_CHANNEL'); ?></a>
                        </div>
                        <!-- <jdoc:include type="modules" name="header-contacts" style="none" /> -->
                    </div>
                </div>
            </div>
            <div class="bottom container-wide">
                <div class="wrapper">
                    <div class="container">
                        <div class="flex align-center">
                            <a href="<?= Text::_('TPL_CUSTOM_HOME'); ?>" class="logo" title="">
                                <svg xmlns="http://www.w3.org/2000/svg" width="130" height="38" viewBox="0 0 130 38" fill="none">
  <path d="M16.53 0.904762L0.217285 9.83661V27.7003L16.53 36.6322L32.8428 27.7003V9.83661L16.53 0.904762ZM24.1471 23.6714C23.9674 27.8069 20.0577 29.7254 16.4851 29.7254C13.9461 29.7254 10.7329 28.7449 8.86798 24.6733L12.3507 22.7761C13.4293 24.9717 15.2942 25.8457 16.5974 25.8457C18.3276 25.8671 19.5634 24.8012 19.6308 23.4156C19.7656 21.4118 17.7434 20.6017 16.148 20.218C13.8786 19.6851 9.49712 18.2142 9.56453 13.9082C9.65441 9.64476 13.3394 7.79018 16.7772 7.79018C19.4286 7.79018 21.8103 8.96261 23.2933 11.6912L19.878 13.5458C19.0241 12.0962 17.7883 11.7125 16.7547 11.7125C15.4515 11.6912 14.1258 12.2881 14.0359 13.8655C13.9685 15.4217 15.9683 16.1251 17.2715 16.4662C20.7093 17.3402 24.3494 18.939 24.1471 23.6714Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M48.2798 17.3767C50.8045 17.7759 53.4264 19.0964 53.4264 21.8602C53.4264 25.146 50.1572 26.313 47.7295 26.313C45.8198 26.313 43.7482 25.6067 42.1621 23.6106L44.2661 21.4917C45.1724 22.5051 46.4995 23.0579 47.7619 23.0886C48.5387 23.1193 49.5098 22.5972 49.5098 21.8602C49.5098 20.8468 48.3769 20.724 47.6324 20.5704C45.2371 20.1712 42.7771 18.7586 42.7447 16.087C42.7447 13.2618 45.4313 11.7263 48.2151 11.7263C49.704 11.7263 51.4519 12.2177 53.1351 13.8759L51.0311 15.9027C49.9953 15.1657 48.9919 14.8893 48.1827 14.8893C47.5353 14.8893 46.4671 15.35 46.4671 16.2405C46.4671 16.7011 46.9527 17.1004 47.4382 17.2232C47.7619 17.2846 48.0208 17.3153 48.2798 17.3767Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M63.0075 26.3437C58.6378 26.3437 55.3038 23.3035 55.3038 19.0657C55.3038 14.7051 58.6378 11.757 63.0075 11.757C67.4097 11.757 70.6789 14.7051 70.6789 19.0657C70.7113 23.3035 67.4097 26.3437 63.0075 26.3437ZM63.0075 22.935C64.8526 22.935 66.7947 21.5838 66.7947 19.0657C66.7947 16.3633 64.8526 15.1964 63.0075 15.1964C61.2596 15.1964 59.1557 16.4555 59.1557 19.0657C59.1557 21.5838 61.2596 22.935 63.0075 22.935Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M80.7132 9.6381C78.8358 9.36172 77.7677 9.91448 77.7677 11.1735V12.1255H80.7132V15.0428H77.8324V25.9752H73.8511V15.0428H71.8442V12.1255H73.8511V11.1735C73.7216 7.64203 77.185 6.26014 80.7132 6.8436V9.6381Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M89.4853 26.3437C85.1155 26.3437 81.7815 23.3036 81.7815 19.0658C81.7815 14.7051 85.1155 11.7571 89.4853 11.7571C93.8874 11.7571 97.1567 14.7051 97.1567 19.0658C97.189 23.3036 93.8874 26.3437 89.4853 26.3437ZM89.4853 22.9351C91.3303 22.9351 93.2724 21.5839 93.2724 19.0658C93.2724 16.3634 91.3303 15.1965 89.4853 15.1965C87.7374 15.1965 85.6334 16.4555 85.6334 19.0658C85.6334 21.5839 87.7374 22.9351 89.4853 22.9351Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M103.501 12.0948L104.083 13.3232C104.925 12.2791 106.317 11.8184 107.968 11.9105C111.205 12.0641 113.794 14.398 113.794 17.9295V25.9445H109.845V18.1137C109.845 15.3499 106.608 14.183 104.213 15.6877V25.9445H100.264V12.0948H103.501Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M126.839 25.9445L126.321 24.7161C125.414 25.8216 123.958 26.2516 122.825 26.2516C119.005 26.2516 116.966 24.0712 116.966 21.461C116.966 18.3287 120.171 16.7318 123.31 16.7933C124.281 16.824 125.253 17.0082 126.094 17.346C125.997 15.4114 124.702 14.7051 123.213 14.6743C121.789 14.6436 120.074 15.1043 119.2 15.7799L117.872 13.446C119.685 12.0641 121.53 11.6649 123.537 11.6649C126.871 11.6649 129.978 13.3539 129.978 17.4074V25.9445H126.839ZM126.094 22.198V20.0177C125.382 19.7106 124.443 19.5263 123.537 19.5263C122.048 19.5263 120.624 20.0484 120.591 21.3382C120.527 23.887 124.605 23.672 126.094 22.198Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
</svg>
                            </a>
                            <div class="btn show-cat show-cat-menu icon-catalog"><?= Text::_('TPL_CUSTOM_CATALOG'); ?><span class="arr"></span></div>
                            <div class="cat-wrapper container">
                                <div class="wrapper">
                                    <jdoc:include type="modules" name="cat-menu" style="none" />
                                </div>
                            </div>
                            <jdoc:include type="modules" name="search" style="none" />
                            <jdoc:include type="modules" name="lang" style="none" />
                            <jdoc:include type="modules" name="header-currency" style="none" />

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
                            <div class="copy">© All rights reserved. OnlineShop. <?php echo date('Y'); ?></div>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="130" height="38" viewBox="0 0 130 38" fill="none">
  <path d="M16.53 0.904762L0.217285 9.83661V27.7003L16.53 36.6322L32.8428 27.7003V9.83661L16.53 0.904762ZM24.1471 23.6714C23.9674 27.8069 20.0577 29.7254 16.4851 29.7254C13.9461 29.7254 10.7329 28.7449 8.86798 24.6733L12.3507 22.7761C13.4293 24.9717 15.2942 25.8457 16.5974 25.8457C18.3276 25.8671 19.5634 24.8012 19.6308 23.4156C19.7656 21.4118 17.7434 20.6017 16.148 20.218C13.8786 19.6851 9.49712 18.2142 9.56453 13.9082C9.65441 9.64476 13.3394 7.79018 16.7772 7.79018C19.4286 7.79018 21.8103 8.96261 23.2933 11.6912L19.878 13.5458C19.0241 12.0962 17.7883 11.7125 16.7547 11.7125C15.4515 11.6912 14.1258 12.2881 14.0359 13.8655C13.9685 15.4217 15.9683 16.1251 17.2715 16.4662C20.7093 17.3402 24.3494 18.939 24.1471 23.6714Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M48.2798 17.3767C50.8045 17.7759 53.4264 19.0964 53.4264 21.8602C53.4264 25.146 50.1572 26.313 47.7295 26.313C45.8198 26.313 43.7482 25.6067 42.1621 23.6106L44.2661 21.4917C45.1724 22.5051 46.4995 23.0579 47.7619 23.0886C48.5387 23.1193 49.5098 22.5972 49.5098 21.8602C49.5098 20.8468 48.3769 20.724 47.6324 20.5704C45.2371 20.1712 42.7771 18.7586 42.7447 16.087C42.7447 13.2618 45.4313 11.7263 48.2151 11.7263C49.704 11.7263 51.4519 12.2177 53.1351 13.8759L51.0311 15.9027C49.9953 15.1657 48.9919 14.8893 48.1827 14.8893C47.5353 14.8893 46.4671 15.35 46.4671 16.2405C46.4671 16.7011 46.9527 17.1004 47.4382 17.2232C47.7619 17.2846 48.0208 17.3153 48.2798 17.3767Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M63.0075 26.3437C58.6378 26.3437 55.3038 23.3035 55.3038 19.0657C55.3038 14.7051 58.6378 11.757 63.0075 11.757C67.4097 11.757 70.6789 14.7051 70.6789 19.0657C70.7113 23.3035 67.4097 26.3437 63.0075 26.3437ZM63.0075 22.935C64.8526 22.935 66.7947 21.5838 66.7947 19.0657C66.7947 16.3633 64.8526 15.1964 63.0075 15.1964C61.2596 15.1964 59.1557 16.4555 59.1557 19.0657C59.1557 21.5838 61.2596 22.935 63.0075 22.935Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M80.7132 9.6381C78.8358 9.36172 77.7677 9.91448 77.7677 11.1735V12.1255H80.7132V15.0428H77.8324V25.9752H73.8511V15.0428H71.8442V12.1255H73.8511V11.1735C73.7216 7.64203 77.185 6.26014 80.7132 6.8436V9.6381Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M89.4853 26.3437C85.1155 26.3437 81.7815 23.3036 81.7815 19.0658C81.7815 14.7051 85.1155 11.7571 89.4853 11.7571C93.8874 11.7571 97.1567 14.7051 97.1567 19.0658C97.189 23.3036 93.8874 26.3437 89.4853 26.3437ZM89.4853 22.9351C91.3303 22.9351 93.2724 21.5839 93.2724 19.0658C93.2724 16.3634 91.3303 15.1965 89.4853 15.1965C87.7374 15.1965 85.6334 16.4555 85.6334 19.0658C85.6334 21.5839 87.7374 22.9351 89.4853 22.9351Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M103.501 12.0948L104.083 13.3232C104.925 12.2791 106.317 11.8184 107.968 11.9105C111.205 12.0641 113.794 14.398 113.794 17.9295V25.9445H109.845V18.1137C109.845 15.3499 106.608 14.183 104.213 15.6877V25.9445H100.264V12.0948H103.501Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
  <path d="M126.839 25.9445L126.321 24.7161C125.414 25.8216 123.958 26.2516 122.825 26.2516C119.005 26.2516 116.966 24.0712 116.966 21.461C116.966 18.3287 120.171 16.7318 123.31 16.7933C124.281 16.824 125.253 17.0082 126.094 17.346C125.997 15.4114 124.702 14.7051 123.213 14.6743C121.789 14.6436 120.074 15.1043 119.2 15.7799L117.872 13.446C119.685 12.0641 121.53 11.6649 123.537 11.6649C126.871 11.6649 129.978 13.3539 129.978 17.4074V25.9445H126.839ZM126.094 22.198V20.0177C125.382 19.7106 124.443 19.5263 123.537 19.5263C122.048 19.5263 120.624 20.0484 120.591 21.3382C120.527 23.887 124.605 23.672 126.094 22.198Z" fill="#FDCF00" style="fill:#FDCF00;fill:color(display-p3 0.9922 0.8118 0.0000);fill-opacity:1;"/>
</svg>
                </a>
                <jdoc:include type="modules" name="lang" style="none" />
                <jdoc:include type="modules" name="header-currency" style="none" />
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