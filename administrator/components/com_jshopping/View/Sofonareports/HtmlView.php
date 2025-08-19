<?php


namespace Joomla\Component\Jshopping\Administrator\View\Sofonareports;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;

defined('_JEXEC') or die;

class HtmlView extends BaseHtmlView
{

    function display($tpl = null)
    {

        ToolbarHelper::title(Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_REPORTS'), 'generic.png');

        // ToolbarHelper::custom('backOthers', 'arrow-left', '', Text::_('JSHOP_BACK'), false);
        ToolbarHelper::back(Text::_('JSHOP_BACK'), 'index.php?option=com_jshopping&controller=other');

        parent::display($tpl);
    }
    function displaySettings($tpl = null)
    {

        ToolbarHelper::title(Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_SETTINGS'), 'generic.png');

        ToolbarHelper::custom('backConfig', 'arrow-left', '', Text::_('JSHOP_BACK'), false);
        ToolbarHelper::apply('saveSettings');

        parent::display($tpl);
    }
    function displayReportOrder($tpl = null)
    {

        ToolbarHelper::title(Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_REPORTS_ORDERS'), 'generic.png');

        ToolbarHelper::custom('back', 'arrow-left', '', Text::_('JSHOP_BACK'), false);
        ToolbarHelper::deleteList(Text::_('JSHOP_DELETE') . "?");

        parent::display($tpl);
    }
    function displayReportProduct($tpl = null)
    {

        ToolbarHelper::title(Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_REPORTS_PRODUCTS'), 'generic.png');

        ToolbarHelper::custom('back', 'arrow-left', '', Text::_('JSHOP_BACK'), false);

        parent::display($tpl);
    }

    function displayReportClients($tpl = null)
    {

        ToolbarHelper::title(Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BUTTON_REPORTS_CLIENTS'), 'generic.png');
        ToolbarHelper::custom('back', 'arrow-left', '', Text::_('JSHOP_BACK'), false);

        parent::display($tpl);
    }

}
