<?php 

namespace Joomla\Component\Jshopping\Administrator\View\Antispam;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;

defined('_JEXEC') or die();

class HtmlView extends BaseHtmlView{

    function display($tpl=null){

        ToolbarHelper::title( 'Настройка антиспама', 'generic.png' ); 
        ToolbarHelper::save();
        ToolbarHelper::apply();
        ToolbarHelper::spacer();
        ToolbarHelper::cancel();
        
        parent::display($tpl);
	}
}
?>