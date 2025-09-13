<?php
/**
 * @version      5.0.0 15.09.2018
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
namespace Joomla\Component\Jshopping\Administrator\View\Buhgalteria;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\CMS\Factory;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;

defined('_JEXEC') or die;

class HtmlView extends BaseHtmlView
{
    function display($tpl = null)
    {
        ToolbarHelper::title('Отчет по бухгалтерии', 'generic.png');
        parent::display($tpl);
    }
    function displayEditExpenses($tpl = null)
    {
        ToolbarHelper::title('Редактирование расходника', 'generic.png');
        ToolbarHelper::back('JTOOLBAR_BACK', 'index.php?option=com_jshopping&controller=buhgalteria');

        parent::display($tpl);
    }

    function displayEditProduct($tpl = null)
    {
        ToolbarHelper::title('Редактирование товаров', 'generic.png');
        ToolbarHelper::back('JTOOLBAR_BACK', 'index.php?option=com_jshopping&controller=buhgalteria');

        parent::display($tpl);
    }
}