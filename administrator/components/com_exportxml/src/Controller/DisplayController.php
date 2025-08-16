<?php

namespace Sofona\Component\ExportXml\Administrator\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Factory;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Uri\Uri as JUri;

/**
 * @package     com_exportxml
 *
 * @copyright   Copyright (C) 2020 Sofona. All rights reserved.
 * @license     GNU General Public License version 3; see LICENSE
 */

/**
 * Default Controller of ExportXml component
 *
 * @package     com_exportxml
 */
class DisplayController extends BaseController
{
    /**
     * The default view for the display method.
     *
     * @var string
     */
    protected $default_view = 'export';

    public function display($cachable = false, $urlparams = array())
    {
        $params = ComponentHelper::getComponent('com_exportxml')->getParams();
        $params = $params->get('params', (object) []);
    
        $view = $this->getView('Export', 'html');
    
        $cronUrls = [];
    
        if (isset($params)) {
            if (!is_object($params)) {
                $params = (object) [];
            }
    
            if (!isset($params->enable_googleshop)) {
                $params->enable_googleshop = 0;
            }
            if (!isset($params->enable_rozetka)) {
                $params->enable_rozetka = 0;
            }
            if (!isset($params->enable_prom)) {
                $params->enable_prom = 0;
            }
    
            if ($params->enable_googleshop == 1) {
                $cronUrls['Google Shop'] = JUri::root() . 'index.php?option=com_exportxml&task=export_googleshop';
            }
            if ($params->enable_rozetka == 1) {
                $cronUrls['Rozetka'] = JUri::root() . 'index.php?option=com_exportxml&task=export_rozetka';
            }
            if ($params->enable_prom == 1) {
                $cronUrls['Prom'] = JUri::root() . 'index.php?option=com_exportxml&task=export_prom';
            }
    
            $view->set('params', $params);
            $view->set('cronUrls', $cronUrls);
        }
    
        return $view->display();
    }
    
    public function options()
    {
        $this->setRedirect('index.php?option=com_config&view=component&component=com_searchtext');
    }
}