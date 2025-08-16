<?php
namespace Joomla\Component\Jshopping\Administrator\View\ProductsQuickEdit;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Toolbar\ToolbarHelper;

class HtmlView extends BaseHtmlView
{
    protected $items;

    public function display($tpl = null)
    {
        ToolbarHelper::title( 'Быстрое редактирование товаров', 'generic.png' );

        parent::display($tpl);
    }
}
