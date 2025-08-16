<?php
defined('_JEXEC') or die();

include_once JPATH_SITE . "/components/com_jshopping/addons/sortingorderby/addonpackstation.php";

class plgjshoppingproductssortingorderby extends JPlugin{

    protected $addonPackSt;
    
    public function __construct(&$subject, $config)
    {
        $this->addonPackSt = new Addonpackstation('sortingorderby');
        parent::__construct($subject, $config);
    }

    public function onBeforeDisplayProductListView(&$view, &$productlist){
        $doc = \JFactory::getDocument();
        $jshopConfig = \JSFactory::getConfig();

        $doc->addScript(\JURI::base() . 'components/com_jshopping/js/addons/sortingorderby/sortingorderby.js');
        $doc->addStyleSheet(\JURI::base() . 'components/com_jshopping/css/addons/sortingorderby/sortingorderby.css');

        if (!is_object($productlist)) {
            // Либо логируем, либо просто выходим из метода
            \JLog::add('ProductList is null in onBeforeDisplayProductListView', \JLog::WARNING, 'jshopping');
            return;
        }
    
        $selectCssClass = $jshopConfig->frontend_select_class_css;
        // $checkedSortingValue = \JFactory::getApplication()->input->getInt('order') ?: $jshopConfig->product_sorting;
        // $selectedDataOrder = \JFactory::getApplication()->input->getInt('orderby') ?: $jshopConfig->product_sorting_direction;
        $app = \JFactory::getApplication();
        $context = $productlist->getContext(); 
       // $model = $productlist->getModel();
        $checkedSortingValue = $app->getUserStateFromRequest($context.'order', 'order', $productlist->getDefaultProductSorting(), 'int');
        $selectedDataOrder = $app->getUserStateFromRequest($context.'orderby', 'orderby', $productlist->getDefaultProductSortingDirection(), 'int');

        $renderedTemplate = $this->addonPackSt->getRenderTemplate(
            [
                'sortingNames' => $this->getPreparedSortingProductsNameSelect($productlist),
                'selectCssClass' => $selectCssClass,
                'checkedSortingValue' => $checkedSortingValue,
                'selectedOptionDataOrder' => $selectedDataOrder
            ]
        );

        $view->sorting = $renderedTemplate;
    }

    protected function getPreparedSortingProductsNameSelect($productlist)
    {
        $jshopConfig = \JSFactory::getConfig();
        $orderingTypeList = $productlist->getProductsOrderingTypeList();
    
        if ( (bool)$orderingTypeList ) {
            return $this->preparingSortingNames($jshopConfig->sorting_products_name_select);
        } else {
            return $this->preparingSortingNames($jshopConfig->sorting_products_name_s_select);
        }
    }     

    /**
    *   @param  array $sortingNames - sorting products name select
    *   @return array - prepared select options names
    */
    protected function preparingSortingNames(array $sortingNames)
    {
        $names = [];

        $namesPrefixes = $this->prefixesForNames();

        foreach ($sortingNames as $key => $name) {
            for ($i = 0; $i <= 1; $i++) { 

                if ( !isset($namesPrefixes[$key][$i]) ) {
                    continue;
                }

                $names[$key][$i] = $namesPrefixes[$key][$i];

            }
        }

        return $names;
    }

    /**
    *   @return array - prefixes for select options names
    */
    protected function prefixesForNames()
    {
        $this->loadLanguage('sortingorderby', __DIR__);

        $namesOptions = [];

        /* name */
        // $namesOptions[1][0] = \JText::_('SORTINGORDERBY_NAME_A_Z');
        // $namesOptions[1][1] = \JText::_('SORTINGORDERBY_NAME_Z_A');

        /* price */
        $namesOptions[2][0] = \JText::_('SORTINGORDERBY_PRICE_HIGHT');
        $namesOptions[2][1] = \JText::_('SORTINGORDERBY_PRICE_LOW');
 
        /* date */
        // $namesOptions[3][0] = \JText::_('SORTINGORDERBY_DATE_NEWEST');
        // $namesOptions[3][1] = \JText::_('SORTINGORDERBY_DATE_OLD');

        /* predefined */
        // $namesOptions[4][0] = \JText::_('SORTINGORDERBY_PREDEFINED_CERTAIN');
        // $namesOptions[4][1] = \JText::_('SORTINGORDERBY_PREDEFINED_PREDEFINED');

        /* rating */
        // $namesOptions[5][0] = \JText::_('SORTINGORDERBY_RATING_HIGHEST');
        // $namesOptions[5][1] = \JText::_('SORTINGORDERBY_RATING_LOWEST');

        /* popular */
        // $namesOptions[6][0] = \JText::_('SORTINGORDERBY_POPULAR_POPULAR');
        // $namesOptions[6][1] = \JText::_('SORTINGORDERBY_POPULAR_UNPOPULAR');

        return $namesOptions;                              
    }
   
    
}