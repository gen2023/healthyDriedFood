<?php

namespace Sofona\Component\ExportXml\Administrator\View\Export;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Toolbar\Toolbar;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\CMS\Factory;

/**
 * @package     com_exportxml
 *
 * @copyright   Copyright (C) 2020 Sofona. All rights reserved.
 * @license     GNU General Public License version 3; see LICENSE
 */

/**
 * Main "Export Product" Admin View
 */
class HtmlView extends BaseHtmlView
{

    /**
     * Display the main "Export Product" view
     *
     * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
     * @return  void
     */
    function display($tpl = null)
    {

        $doc = Factory::getDocument();
        $wa = $doc->getWebAssetManager();
        $wa->registerAndUseStyle('com_exportxml.style', 'media/com_exportxml/css/style.css');

        $this->addToolbar();
        parent::display($tpl);
    }

    protected function addToolbar()
    {
        ToolbarHelper::title(Text::_('COM_EXPORT'), 'export');
        ToolbarHelper::preferences('com_exportxml');
    }

}