<?php
namespace Joomla\Component\Jshopping\Administrator\View\Invoice;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\CMS\Language\Text;

class HtmlView extends BaseHtmlView{
    protected $order;

    public function display($tpl = null): void
    {
        parent::display($tpl);
    }
}
