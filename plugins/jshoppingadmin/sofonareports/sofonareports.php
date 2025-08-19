<?php
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

class PlgJshoppingadminSofonareports extends CMSPlugin
{

    public function onBeforeAdminConfigPanelIcoDisplay(&$menu)
    {
        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonareports', JPATH_ADMINISTRATOR);

        $menu['sofonareportsconfig'] = array(
            Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_SETTINGS'),
            'index.php?option=com_jshopping&amp;controller=sofonareports&amp;task=settings',
            'sofonareport_settings.png',
            1
        );
    }

    public function onBeforeAdminOptionPanelIcoDisplay(&$menu)
    {
        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonareports', JPATH_ADMINISTRATOR);

        $menu['sofonareports'] = array(
            Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_REPORTS'),
            'index.php?option=com_jshopping&amp;controller=sofonareports',
            'sofonareport.png',
            1
        );
    }

}
