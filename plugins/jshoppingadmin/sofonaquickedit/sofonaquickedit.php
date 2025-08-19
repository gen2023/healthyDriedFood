<?php
defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;

class plgJshoppingAdminSofonaquickedit extends JPlugin
{

    function onBeforeDisplayListProductsView(&$view)
    {
        $lang = Factory::getApplication()->getLanguage();

        $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

        // \JSFactory::loadExtAdminLanguageFile('plg_jshoppingadmin_sofonaquickedit');
        \JToolBarHelper::custom('display', 'edit', 'edit', Text::_("PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_BTN_LIST_PRODUCT"), false);
    }

    function onAfterLoadShopParamsAdmin()
    {
        $task = \JFactory::getApplication()->input->getVar('task');
        if ($task == 'display') {
            \JFactory::getApplication()->redirect('index.php?option=com_jshopping&controller=sofonaquickedit');
        }
    }

    public function onBeforeAdminConfigPanelIcoDisplay(&$menu)
    {
        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

        $menu['sofonaquickeditconfig'] = array(
            Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_BUTTON_SETTINGS'),
            'index.php?option=com_jshopping&amp;controller=sofonaquickedit&amp;task=settings',
            'sofonaquickedit_settings.png',
            1
        );
    }

    public function onBeforeAdminOptionPanelIcoDisplay(&$menu)
    {
        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

        $menu['sofonaquickeditconfig'] = array(
            Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT'),
            'index.php?option=com_jshopping&amp;controller=sofonaquickedit',
            'sofonaquickedit.png',
            1
        );
    }

}