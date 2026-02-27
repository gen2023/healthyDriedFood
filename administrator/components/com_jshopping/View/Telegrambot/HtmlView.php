<?php

namespace Joomla\Component\Jshopping\Administrator\View\Telegrambot;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;

defined('_JEXEC') or die();

class HtmlView extends BaseHtmlView
{

        function displayDefault($tpl = null)
        {
                ToolbarHelper::title(Text::_('PLG_JSHOPPING_TELEGRAMBOT_SETTINGS'), 'generic.png');
                ToolbarHelper::custom('telegrambot.backToConfig', 'arrow-left', '', Text::_('JSHOP_BACK'), false);
                ToolbarHelper::apply('telegrambot.applySettings');
                ToolbarHelper::save('telegrambot.saveSettings');

                parent::display($tpl);
        }

}