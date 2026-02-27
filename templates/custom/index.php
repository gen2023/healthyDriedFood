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
$this->addHeadLink(HTMLHelper::_('image', 'favicon.ico', '', [], true, 1), 'icon', 'rel', ['type' => 'image/x-icon']);
$this->addHeadLink(HTMLHelper::_('image', 'favicon.ico', '', [], true, 1), 'alternate icon', 'rel', ['type' => 'image/vnd.microsoft.icon']);
$this->addHeadLink(HTMLHelper::_('image', 'joomla-favicon-pinned.svg', '', [], true, 1), 'mask-icon', 'rel', ['color' => '#000']);

$this->setMetaData('viewport', 'width=device-width, initial-scale=1');

$currentUrl = Uri::getInstance()->toString();
$document->addHeadLink($currentUrl, 'canonical');

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

    // $wa->useScript('jquery');
    $wa->useScript('swiper.script');
    $wa->useScript('lightgallery.script');
    $wa->useScript('inputmask.script');
    $wa->useScript('main.custom.script');

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
    <meta name="google-site-verification" content="qLaZ67vg09cLVRniiOCVBnNyc_ZiZdRGQhiES2MO5tw" />
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" />
    <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MRGS9SNH');</script>
    <!-- End Google Tag Manager -->
</head>

<body class="header-sticky <?= $pageclass ?>">
    <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MRGS9SNH"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div class="body-wrapper">
        <?php include 'html/header.php'; ?>
        <main class="main">
            <jdoc:include type="message" />
            <jdoc:include type="component" />
        </main>
        <?php include 'html/footer.php'; ?>

        <jdoc:include type="modules" name="debug" style="none" />
    </div>
    <div id="toTop" class="icon-up"></div>
    
        <?php // include 'html/modal.php'; ?>

</body>

</html>