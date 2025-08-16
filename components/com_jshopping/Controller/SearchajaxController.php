<?php
/**
 * @version      1.0.4
 * @author       Sofona
 * @copyright    Copyright (C) 2024 Sofona. All rights reserved.
 * @license      GNU/GPL
 */

namespace Joomla\Component\Jshopping\Site\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\Productlist\SearchajaxModel;

class SearchajaxController extends BaseController
{
    public function display($cachable = false, $urlparams = [])
    {
        $app          = Factory::getApplication();
        $jinput       = $app->input;
        $searchQuery  = $jinput->getString('search', '');
        $displaycount = $jinput->getInt('displaycount', 10);
        $lang         = $app->getLanguage();
        $moreResults  = $jinput->getInt('more_results', 0);
        $data['searchByName'] = $jinput->getInt('search_by_name', 0);
        $data['searchByKode'] = $jinput->getInt('search_by_kode', 0);
        
        
        if ($data['searchByName'] || $data['searchByKode']) {
            $model = new SearchajaxModel();
            $rows  = $model->searchProductsByName($searchQuery, $data);
        } else { 
            $productlist = JSFactory::getModel('search', 'Site\\Productlist');
            $productlist->load();
            $rows = $productlist->getProducts();
        }

        $total = count($rows);

        if ($total > $displaycount) {
            $rows = array_slice($rows, 0, $displaycount);
        } else {
            $moreResults = 0;
        }

        $lang->load('mod_jshopping_search', JPATH_SITE, $lang->getTag(), true);

        $search_type   = $jinput->getString('search_type', '');
        $category_id   = 0;
        $search_query  = $jinput->getString('search', '');

        $moreResultsLink = Uri::base() . 'index.php?option=com_jshopping&controller=search&task=result&setsearchdata=1'
            . '&search_type=' . $search_type
            . '&category_id=' . $category_id
            . '&search=' . urlencode($search_query);

        $viewName   = 'searchajax';
        $viewConfig = ['template_path' => JPATH_COMPONENT . '/templates/addons/' . $viewName];
        $view       = $this->getView($viewName, '', '', $viewConfig);
        $view->setLayout('searchajax');

        $view->set('rows', $rows);
        $view->set('moreResults', $moreResults);
        $view->set('moreResultsLink', $moreResultsLink);

        if (empty($rows)) {
            $view->set('noResultsText', Text::_('JSHOP_NO_PRODUCTS_AFTER_FILTER'));
        }

        $view->display();

        $app->close();
    }
}
