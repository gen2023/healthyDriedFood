<?php

if ($_SERVER['REQUEST_URI'] != strtolower($_SERVER['REQUEST_URI'])) {
    header('Location: //' . $_SERVER['HTTP_HOST'] . strtolower($_SERVER['REQUEST_URI']), true, 301);
    exit();
}

$currentUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
if (strpos($currentUrl, '/index.php') !== false) {
    $newUrl = str_replace('/index.php', '', $currentUrl);
    header("Location: $newUrl", true, 301);
    exit();
}

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

$wa->useStyle('main.custom.style');
$wa->useStyle('media.custom.style');
    $wa->useScript('main.custom.script');

?>

<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">

<head>
    <meta name="robots" content="noindex, nofollow">
    <jdoc:include type="metas" />
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" />
</head>

<body class="page-404">
    <div class="body-wrapper">
        <?php include 'html/header.php'; ?>
        <main class="main content-404">
    <div class="container">

            <div class="wrapper">
                <a href="/" class="logo icon-logo"></a>
                <div class="text-box">
                    <h1 class="ttl mb50"><?= Text::_('TPL_CUSTOM_ERROR_PAGE_TITLE'); ?></h1>
                    <div class="text-404 font-size-16 mb50"><?= Text::_('TPL_CUSTOM_ERROR_PAGE_DESCRIPTION'); ?></div>
                    <a href="/" class="btn icon-more"><?= Text::_('TPL_CUSTOM_TO_HOME'); ?></a>
                </div>
            </div>
            </div>
        </main>
                <?php include 'html/footer.php'; ?>
    </div>
</body>

</html>