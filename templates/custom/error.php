<?php

if ( $_SERVER['REQUEST_URI'] != strtolower( $_SERVER['REQUEST_URI']) ) {
header('Location: //'.$_SERVER['HTTP_HOST'] . strtolower($_SERVER['REQUEST_URI']), true, 301);
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

$this->setMetaData('viewport', 'width=device-width, initial-scale=1');

$document = Factory::getApplication()->getDocument();
$document->addStyleSheet('/media/templates/site/custom/css/main.css', array('version'=>'v.107'));
$document->addStyleSheet('/media/templates/site/custom/css/media.css', array('version'=>'v.107'));
?>

<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <meta name="robots" content="noindex, nofollow">
    <jdoc:include type="metas" />
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" />
<style> 

.content-404 .wrapper{
    height: 100vh;
    display: flex;
    align-items: center;
    background: url(/images/img-404.jpg) no-repeat right center / auto 100%;
    padding-left: 10%;
}
.content-404 .ttl{
    color: var(--black);
    font-size: 24px;
}
.text-404{
    max-width: 550px;
}
@media(max-width:768px){
    .content-404 .wrapper{
        justify-content: center;
        background-position: center top;
        background-size: contain;
        text-align: center;
        padding: 100% 16px 0;
    }
    .content-404 .ttl{
        margin-bottom: 30px;
    }
    .text-404{
        margin-bottom: 32px;
    }
    .content-404 .btn{
        margin: 0 auto;
    }
}    
</style>

</head>
<body class="page-404">
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5Z6VPGM"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<div class="body-wrapper"> 

<main class="main content-404">
    <div class="wrapper">
    <a href="/" class="logo icon-logo"></a>
        <div class="text-box">
            <h1 class="ttl mb50">Ой, ви на сторінці 404! </h1>
            <div class="text-404 font-size-16 mb50">Схоже, що ви ввели адресу, яка більше не працює або була переміщена. Спробуйте знайти щось інше!</div>
            <a href="/" class="btn icon-more">На головну</a>
        </div>
    </div>
</main>
</div>
</body>
</html>
