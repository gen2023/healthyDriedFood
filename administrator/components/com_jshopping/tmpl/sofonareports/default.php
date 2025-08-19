<?php
use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;


defined('_JEXEC') or die();

$params = $this->settingsPlg;

?>

<div id="cpanel">
    <?php if ($params['show_repport_order']) { ?>
        <div style="float:left;">
            <div class="icon">
                <a href="index.php?option=com_jshopping&amp;controller=sofonareports&amp;task=reportsorder">
                    <img src="/administrator/components/com_jshopping/images/sofonareport_order.png" alt="">
                    <span><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_REPORTS_ORDERS'); ?></span>
                </a>
            </div>
        </div>
    <?php } ?>
    <?php if ($params['show_repport_products']) { ?>
        <div style="float:left;">
            <div class="icon">
                <a href="index.php?option=com_jshopping&amp;controller=sofonareports&amp;task=reportsproduct">
                    <img src="/administrator/components/com_jshopping/images/sofonareport_product.png" alt="">
                    <span><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_REPORTS_PRODUCTS'); ?></span>
                </a>
            </div>
        </div>
    <?php } ?>
    <?php if ($params['show_repport_clients']) { ?>
        <div style="float:left;">
            <div class="icon">
                <a href="index.php?option=com_jshopping&amp;controller=sofonareports&amp;task=reportsclients">
                    <img src="/administrator/components/com_jshopping/images/sofonareport_clients.png" alt="">
                    <span><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_REPORTS_CLIENTS'); ?></span>
                </a>
            </div>
        </div>
    <?php } ?>
    <?php if (!$params['show_repport_order'] && !$params['show_repport_products'] && !$params['show_repport_clients']) { ?>
        <h2><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_MSG_ERR_NOT_SETTING'); ?></h2>
    <?php } ?>

</div>