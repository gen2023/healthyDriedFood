<?php


namespace Joomla\Component\Jshopping\Administrator\View\Sofonaquickedit;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;

defined('_JEXEC') or die;

class HtmlView extends BaseHtmlView{

    function display($tpl=null){

        ToolbarHelper::title( 'Быстрое редактирование товаров', 'generic.png' ); 
        ToolbarHelper::addNew();
        ToolbarHelper::custom('sofonaquickedit.copy', 'copy', 'copy_f2.png', Text::_('JLIB_HTML_BATCH_COPY'));
        ToolbarHelper::editList('editlist');

        ToolbarHelper::publishList(); 
        ToolbarHelper::unpublishList();
        ToolbarHelper::deleteList(Text::_('JSHOP_DELETE')."?");
        HelperAdmin::btnHome();

        
        parent::display($tpl);
	}
}
