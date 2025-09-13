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
    <jdoc:include type="scripts" />

    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PFZG2W0NY4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-PFZG2W0NY4');
</script>
</head>

<body class="header-sticky <?= $pageclass ?>">
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
    
        <?php include 'html/modal.php'; ?>

    <?php
    $wa->useScript('jquery.script');
    $wa->useScript('swiper.script');
    $wa->useScript('lightgallery.script');
    $wa->useScript('inputmask.script');
    $wa->useScript('main.custom.script');
    ?>

</body>

</html>