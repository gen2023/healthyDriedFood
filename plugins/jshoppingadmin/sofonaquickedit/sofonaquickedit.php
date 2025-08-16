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

}