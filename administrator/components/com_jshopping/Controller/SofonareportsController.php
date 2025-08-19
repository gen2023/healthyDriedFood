<?php

namespace Joomla\Component\Jshopping\Administrator\Controller;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Component\Jshopping\Site\Helper\SelectOptions;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;


class SofonareportsController extends BaseadminController
{

    public function __construct($config = [], $factory = null, $app = null, $input = null)
    {
        parent::__construct($config, $factory, $app, $input);
    }


    public function display($cachable = false, $urlparams = false)
    {

        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonareports', JPATH_ADMINISTRATOR);
        $model = JSFactory::getModel("sofonareports");

        $settingsPlg = $model->getConfigsSettings();

        $view = $this->getView('sofonareports', 'html');
        $view->set('settingsPlg', $settingsPlg);
        $view->display();

    }

    public function reportsorder()
    {
        $jshopConfig = JSFactory::getConfig();
        $app = Factory::getApplication();

        $wa = JSFactory::getWebAssetManager();
        $wa->registerAndUseStyle('plg_sofonareports.admin', '/media/plg_jshoppingadmin_sofonareports/css/adminstyle.css');
        $wa->registerAndUseScript('plg_sofonareports.admin', '/media/plg_jshoppingadmin_sofonareports/js/adminscript.js', [], ['defer' => true]);
        $wa->registerAndUseScript('plg_sofonareports.chart', '/media/plg_jshoppingadmin_sofonareports/js/chart.js', [], ['defer' => true]);

        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonareports', JPATH_ADMINISTRATOR);

        Text::script('PLG_JSHOPPINGADMIN_SOFONAREPORTS_CHART_LABEL_COUNT_ORDERS');
        Text::script('PLG_JSHOPPINGADMIN_SOFONAREPORTS_CHART_LABEL_COUNT');
        Text::script('PLG_JSHOPPINGADMIN_SOFONAREPORTS_CHART_LABEL_SUMM_ORDERS');

        $model = JSFactory::getModel("sofonareports");
        $settingsPlg = $model->getConfigsSettings();

        $context = "jshopping.list.admin.orders";
        $limit = $app->getUserStateFromRequest($context . 'limit', 'limit', $app->getCfg('list_limit'), 'int');
        $limitstart = $app->getUserStateFromRequest($context . 'limitstart', 'limitstart', 0, 'int');
        $id_vendor_cuser = HelperAdmin::getIdVendorForCUser();

        $status_id = $app->getUserStateFromRequest($context . 'status_id', 'status_id', 0);
        $date_from = $app->getUserStateFromRequest($context . 'date_from', 'date_from', '');
        $date_to = $app->getUserStateFromRequest($context . 'date_to', 'date_to', '');
        $notfinished = $app->getUserStateFromRequest($context . 'notfinished', 'notfinished', $jshopConfig->order_notfinished_default);
        $text_search = $app->getUserStateFromRequest($context . 'text_search', 'text_search', '');
        $filter_order = $app->getUserStateFromRequest($context . 'filter_order', 'filter_order', "order_number", 'cmd');
        $filter_order_Dir = $app->getUserStateFromRequest($context . 'filter_order_Dir', 'filter_order_Dir', "desc", 'cmd');
        $payment_id = $app->getUserStateFromRequest($context . 'payment_id', 'payment_id', 0, 'int');
        $shipping_id = $app->getUserStateFromRequest($context . 'shipping_id', 'shipping_id', 0, 'int');
        $client_type = $app->getUserStateFromRequest($context . 'client_type', 'client_type', 'all', 'string');
        $client_id = $app->getUserStateFromRequest($context . 'client_id', 'client_id', 0, 'string');
        $selectedCurrency = $app->getUserStateFromRequest($context . 'currency_id', 'currency_id', 0, 'int');

        if ($selectedCurrency === -1) {
            $selectedCurrency = $settingsPlg['default_currency_orders'];
        }

        $currencyModel = JSFactory::getModel("currencies");
        $currencies = $currencyModel->getAllCurrencies();

        $currencyOptions = [];
        $currencyOptions[] = (object) [
            'id' => -1,
            'name' => '- ' . Text::_('JSELECT') . ' -'
        ];

        foreach ($currencies as $currency) {
            $currencyOptions[] = (object) [
                'id' => $currency->currency_id,
                'name' => $currency->currency_code . ' (' . $currency->currency_name . ')'
            ];
        }

        $currencyOptions[] = (object) [
            'id' => 0,
            'name' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_ALL_CURRENCY')
        ];

        $countCurrency = count($currencies);

        $clients = $model->getAllBuyers($client_type);


        $current_client = array();

        if ($client_id) {
            foreach ($clients as $value) {
                if ($value->id == $client_id) {
                    $current_client['id'] = $value->id;
                    $current_client['name'] = $value->name;
                    break;
                }
            }
        }

        $filter = array(
            "status_id" => $status_id,
            'user_id' => $client_id,
            "date_from" => $date_from,
            'client_type' => $client_type,
            "date_to" => $date_to,
            "text_search" => $text_search,
            'notfinished' => $notfinished,
            "payment_id" => $payment_id,
            "shipping_id" => $shipping_id,
            'currency_id' => $selectedCurrency
        );

        if ($id_vendor_cuser) {
            $filter["vendor_id"] = $id_vendor_cuser;
        }

        $orders = JSFactory::getModel("orders");

        $total = $model->getCountAllOrders($filter);
        $pageNav = new Pagination($total, $limitstart, $limit);

        $_list_order_status = $orders->getAllOrderStatus();
        $list_order_status = array();

        foreach ($_list_order_status as $v) {
            $list_order_status[$v->status_id] = $v->name;
        }

        $rows = $model->getAllOrders($pageNav->limitstart, $pageNav->limit, $filter, $filter_order, $filter_order_Dir);
        $allOrdersForChart = $model->getAllOrders(0, 0, $filter, $filter_order, $filter_order_Dir);

        $lists['status_orders'] = SelectOptions::getOrderStatus();
        $lists['changestatus'] = HTMLHelper::_('select.genericlist', SelectOptions::getOrderStatus(1), 'status_id', 'class="form-select middle2"', 'status_id', 'name', $status_id);
        $lists['notfinished'] = HTMLHelper::_('select.genericlist', SelectOptions::getNotFinshed(), 'notfinished', 'class="form-select middle2" title="' . Text::_('JSHOP_NOT_FINISHED') . '" default-value="' . $jshopConfig->order_notfinished_default . '"', 'id', 'name', $notfinished);
        $lists['payments'] = HTMLHelper::_('select.genericlist', SelectOptions::getPayments('- ' . Text::_('JSHOP_PAYMENTS') . '-'), 'payment_id', 'class="form-select middle2"', 'payment_id', 'name', $payment_id);
        $lists['shippings'] = HTMLHelper::_('select.genericlist', SelectOptions::getShippings('- ' . Text::_('JSHOP_SHIPPINGS') . '-'), 'shipping_id', 'class="form-select middle2"', 'shipping_id', 'name', $shipping_id);

        array_unshift($clients, (object) ['id' => 0, 'name' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_SELECT_CLIENT')]);

        $lists['clients'] = HTMLHelper::_(
            'select.genericlist',
            $clients,
            'client_id',
            'class="form-select selectpicker" data-live-search="true"',
            'id',
            'name',
            $client_id
        );

        $clientTypes = [
            (object) ['value' => 'all', 'text' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_ALL')],
            (object) ['value' => 'registered', 'text' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_CLIENTS')],
            (object) ['value' => 'guests', 'text' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_GUESTS')],
        ];

        $lists['client_type'] = HTMLHelper::_(
            'select.genericlist',
            $clientTypes,
            'client_type',
            'class="form-select selectpicker" onchange="document.adminForm.submit();" ',
            'value',
            'text',
            $client_type
        );

        $lists['currencies'] = HTMLHelper::_(
            'select.genericlist',
            $currencyOptions,
            'currency_id',
            'class="form-select middle2" onchange="document.adminForm.submit();" ',
            'id',
            'name',
            $selectedCurrency
        );

        $payments = JSFactory::getModel("payments");
        $payments_list = $payments->getListNamePaymens(0);

        $shippings = JSFactory::getModel("shippings");
        $shippings_list = $shippings->getListNameShippings(0);

        $show_vendor = $jshopConfig->admin_show_vendors;
        if ($id_vendor_cuser)
            $show_vendor = 0;
        $display_info_only_my_order = 0;
        if ($jshopConfig->admin_show_vendors && $id_vendor_cuser) {
            $display_info_only_my_order = 1;
        }

        $total = 0;
        foreach ($rows as $k => $row) {
            if ($row->vendor_id > 0) {
                $vendor_name = $row->v_fname . " " . $row->v_name;
            } else {
                $vendor_name = "-";
            }
            $rows[$k]->vendor_name = $vendor_name;

            $display_info_order = 1;
            if ($display_info_only_my_order && $id_vendor_cuser != $row->vendor_id)
                $display_info_order = 0;
            $rows[$k]->display_info_order = $display_info_order;

            $blocked = 0;
            if (HelperAdmin::orderBlocked($row) || !$display_info_order)
                $blocked = 1;
            $rows[$k]->blocked = $blocked;

            $rows[$k]->payment_name = isset($payments_list[$row->payment_method_id]) ? $payments_list[$row->payment_method_id] : '';
            $rows[$k]->shipping_name = isset($shippings_list[$row->shipping_method_id]) ? $shippings_list[$row->shipping_method_id] : '';
            if ($row->currency_exchange == 0) {
                $row->currency_exchange = 1;
            }

            $rows[$k]->status_name = isset($list_order_status[$row->order_status])
                ? $list_order_status[$row->order_status]
                : Text::_('JSHOP_UNKNOWN_STATUS');

            $total += $row->order_total / $row->currency_exchange;

            // $products = $model->getItems($row->order_id);
            $order = JSFactory::getTable('order');
            $order->load($row->order_id);
            $products = $order->getAllItems();

            $rows[$k]->countProduct = count($products);

            $productNames = [];
            foreach ($products as $product) {
                $productNames[] = $product->product_name;
            }
            $rows[$k]->products = implode("<hr>", $productNames);

        }

        $chartLabels = [];
        $chartData = [];
        $chartDataSum = [];

        foreach ($allOrdersForChart as $order) {

            $date = date("Y-m-d", strtotime($order->order_date));

            if (!isset($chartData[$date])) {
                $chartData[$date] = 0;
                $chartDataSum[$date] = 0;
            }

            $chartData[$date]++;
            
            $rate = (float) $order->currency_exchange;

            if ($rate > 0) {
                $chartDataSum[$date] += $order->order_total / $rate;
            } else {
                $chartDataSum[$date] += $order->order_total;
            }
        }

        ksort($chartData);
        ksort($chartDataSum);

        $chartLabels = array_keys($chartData);
        $chartValues = array_values($chartData);
        $chartValuesSum = array_values($chartDataSum);


        $view = $this->getView('sofonareports', 'html');

        $view->setLayout("orders_list");
        $view->set('rows', $rows);
        $view->set('settingsPlg', $settingsPlg);
        $view->set('lists', $lists);
        $view->set('pageNav', $pageNav);
        $view->set('text_search', $text_search);
        $view->set('filter', $filter);
        $view->set('show_vendor', $show_vendor);
        $view->set('filter_order', $filter_order);
        $view->set('filter_order_Dir', $filter_order_Dir);
        $view->set('list_order_status', $list_order_status);
        $view->set('total', $total);
        $view->set('countCurrency', $countCurrency);
        $view->set('current_client', $current_client);
        $view->set('chartLabels', json_encode($chartLabels));
        $view->set('chartValues', json_encode($chartValues));
        $view->set('chartValuesSum', json_encode($chartValuesSum));
        $view->deltaColspan0 = 0;
        $view->deltaColspan = 0;
        $view->displayReportOrder();

    }

    public function reportsproduct()
    {
        $jshopConfig = JSFactory::getConfig();
        $app = Factory::getApplication();

        $wa = JSFactory::getWebAssetManager();
        $wa->registerAndUseStyle('plg_sofonareports.admin', '/media/plg_jshoppingadmin_sofonareports/css/adminstyle.css');
        $wa->registerAndUseScript('plg_sofonareports.admin', '/media/plg_jshoppingadmin_sofonareports/js/adminscript.js', [], ['defer' => true]);
        $wa->registerAndUseScript('plg_sofonareports.chart', '/media/plg_jshoppingadmin_sofonareports/js/chart.js', [], ['defer' => true]);

        $lang = $app->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonareports', JPATH_ADMINISTRATOR);

        Text::script('PLG_JSHOPPINGADMIN_SOFONAREPORTS_MULTIPLE_SELECT_STATUS_ORDER');

        $model = JSFactory::getModel("sofonareports");
        $settingsPlg = $model->getConfigsSettings();


        $context = "jshopping.list.admin.products";
        $limit = $app->getUserStateFromRequest($context . 'limit', 'limit', $app->getCfg('list_limit'), 'int');
        $limitstart = $app->getUserStateFromRequest($context . 'limitstart', 'limitstart', 0, 'int');
        $category_id = $app->getUserStateFromRequest($context . 'category_id', 'category_id', 0, 'int');
        $date_from = $app->getUserStateFromRequest($context . 'date_from', 'date_from', '');
        $date_to = $app->getUserStateFromRequest($context . 'date_to', 'date_to', '');
        $filter_order = $app->getUserStateFromRequest($context . 'filter_order', 'filter_order', 'total_sum', 'cmd');
        $filter_order_Dir = $app->getUserStateFromRequest($context . 'filter_order_Dir', 'filter_order_Dir', 'DESC', 'cmd');
        $selectedCurrency = $app->getUserStateFromRequest($context . 'currency_id', 'currency_id', 0, 'int');
        // $statusOrder_id = $app->getUserStateFromRequest($context . 'statusOrder_id', 'statusOrder_id', 'string');
        $statusOrder_id = $app->getUserStateFromRequest($context . 'statusOrder_id', 'statusOrder_id', [], 'array');

        if (empty($statusOrder_id) || (count($statusOrder_id) === 1 && $statusOrder_id[0] === "0")) {
            $statusOrder_id = $settingsPlg['statusOrder_id_products'];
        }

        if ($selectedCurrency === -1) {
            $selectedCurrency = $settingsPlg['default_currency_products'];
        }

        $currencyModel = JSFactory::getModel("currencies");
        $currencies = $currencyModel->getAllCurrencies();

        $currencyOptions = [];
        $currencyOptions[] = (object) [
            'id' => -1,
            'name' => '- ' . Text::_('JSELECT') . ' -'
        ];

        foreach ($currencies as $currency) {
            $currencyOptions[] = (object) [
                'id' => $currency->currency_id,
                'name' => $currency->currency_code . ' (' . $currency->currency_name . ')'
            ];
        }
        $currencyOptions[] = (object) [
            'id' => 0,
            'name' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_ALL_CURRENCY')
        ];

        $countCurrency = count($currencies);

        $lists['treecategories'] = HTMLHelper::_('select.genericlist', SelectOptions::getCategories(1, 0, 1), 'category_id', 'class="form-select" onchange="document.adminForm.submit();"', 'category_id', 'name', $category_id);
        $lists['currencies'] = HTMLHelper::_(
            'select.genericlist',
            $currencyOptions,
            'currency_id',
            'class="form-select middle2" onchange="document.adminForm.submit();" ',
            'id',
            'name',
            $selectedCurrency
        );

        $lists['changestatus'] = HTMLHelper::_(
            'select.genericlist',
            SelectOptions::getOrderStatus(1),
            'statusOrder_id[]',
            'multiple="multiple" size="4" class="inputbox form-select"',
            'status_id',
            'name',
            $statusOrder_id
        );


        $filter = [
            'statusOrder_id' => $statusOrder_id,
            'date_from' => $date_from,
            'date_to' => $date_to,
            'category_id' => $category_id,
            'currency_id' => $selectedCurrency
        ];

        $this->prepareFilterDates($filter);

        $mergeLang = false;
        if ($settingsPlg['merge_product']) {
            $mergeLang = true;
        }

        $totalProducts = $model->getProductsReportCount($filter, $mergeLang);
        $pageNavProducts = new Pagination($totalProducts, $limitstart, $limit);

        $productRows = $model->getProductsReport($filter, $pageNavProducts->limitstart, $pageNavProducts->limit, $filter_order, $filter_order_Dir, $mergeLang);


        $view = $this->getView('sofonareports', 'html');
        $view->setLayout("products_list");
        $view->set('productRows', $productRows);
        $view->set('pageNavProducts', $pageNavProducts);
        $view->set('settingsPlg', $settingsPlg);
        $view->set('filter', $filter);
        $view->set('countCurrency', $countCurrency);
        $view->set('filter_order', $filter_order);
        $view->set('filter_order_Dir', $filter_order_Dir);
        $view->set('lists', $lists);

        $view->displayReportProduct();
    }

    public function reportsclients()
    {
        $jshopConfig = JSFactory::getConfig();
        $app = Factory::getApplication();

        $wa = JSFactory::getWebAssetManager();
        $wa->registerAndUseStyle('plg_sofonareports.admin', '/media/plg_jshoppingadmin_sofonareports/css/adminstyle.css');
        $wa->registerAndUseScript('plg_sofonareports.admin', '/media/plg_jshoppingadmin_sofonareports/js/adminscript.js', [], ['defer' => true]);
        $wa->registerAndUseScript('plg_sofonareports.chart', '/media/plg_jshoppingadmin_sofonareports/js/chart.js', [], ['defer' => true]);

        $lang = $app->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonareports', JPATH_ADMINISTRATOR);

        Text::script('PLG_JSHOPPINGADMIN_SOFONAREPORTS_MULTIPLE_SELECT_STATUS_ORDER');

        $model = JSFactory::getModel("sofonareports");
        $settingsPlg = $model->getConfigsSettings();


        $context = "jshopping.list.admin.clients";
        $limit = $app->getUserStateFromRequest($context . 'limit', 'limit', $app->getCfg('list_limit'), 'int');
        $limitstart = $app->getUserStateFromRequest($context . 'limitstart', 'limitstart', 0, 'int');
        $date_from = $app->getUserStateFromRequest($context . 'date_from', 'date_from', '');
        $date_to = $app->getUserStateFromRequest($context . 'date_to', 'date_to', '');
        $client_id = $app->getUserStateFromRequest($context . 'client_id', 'client_id', 0, 'string');
        $filter_order = $app->getUserStateFromRequest($context . 'filter_order', 'filter_order', 'total_sum', 'cmd');
        $filter_order_Dir = $app->getUserStateFromRequest($context . 'filter_order_Dir', 'filter_order_Dir', 'DESC', 'cmd');
        $client_type = $app->getUserStateFromRequest($context . 'client_type', 'client_type', 'all', 'string');
        $usergroup_id = $app->getUserStateFromRequest($context . 'l_usergroup_id', 'l_usergroup_id', 0, 'int');
        $selectedCurrency = $app->getUserStateFromRequest($context . 'currency_id', 'currency_id', 0, 'int');
        $statusOrder_id = $app->getUserStateFromRequest($context . 'statusOrder_id', 'statusOrder_id', [], 'array');

        if (empty($statusOrder_id) || (count($statusOrder_id) === 1 && $statusOrder_id[0] === "0")) {
            $statusOrder_id = $settingsPlg['statusOrder_id_products'];
        }

        if ($selectedCurrency === -1) {
            $selectedCurrency = $settingsPlg['default_currency_clients'];
        }


        $currencyModel = JSFactory::getModel("currencies");
        $currencies = $currencyModel->getAllCurrencies();

        $currencyOptions = [];
        $currencyOptions[] = (object) [
            'id' => -1,
            'name' => '- ' . Text::_('JSELECT') . ' -'
        ];

        foreach ($currencies as $currency) {
            $currencyOptions[] = (object) [
                'id' => $currency->currency_id,
                'name' => $currency->currency_code . ' (' . $currency->currency_name . ')'
            ];
        }

        $currencyOptions[] = (object) [
            'id' => 0,
            'name' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_ALL_CURRENCY')
        ];

        $countCurrency = count($currencies);

        $clients = $model->getAllBuyers($client_type);

        $current_client = array();

        if ($client_id) {
            foreach ($clients as $value) {
                if ($value->id == $client_id) {
                    $current_client['id'] = $value->id;
                    $current_client['name'] = $value->name;
                    break;
                }
            }
        }
        array_unshift($clients, (object) ['id' => 0, 'name' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_SELECT_CLIENT')]);

        $lists['clients'] = HTMLHelper::_(
            'select.genericlist',
            $clients,
            'client_id',
            'class="form-select selectpicker" data-live-search="true" onchange="document.adminForm.submit();" ',
            'id',
            'name',
            $client_id
        );

        $clientTypes = [
            (object) ['value' => 'all', 'text' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_ALL')],
            (object) ['value' => 'registered', 'text' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_CLIENTS')],
            (object) ['value' => 'guests', 'text' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_GUESTS')],
        ];

        $lists['client_type'] = HTMLHelper::_(
            'select.genericlist',
            $clientTypes,
            'client_type',
            'class="form-select selectpicker" onchange="document.adminForm.submit();" ',
            'value',
            'text',
            $client_type
        );

        $lists['select_group'] = HTMLHelper::_('select.genericlist', SelectOptions::getUserGroups(1), 'l_usergroup_id', 'class="form-select" onchange="document.adminForm.submit();"', 'usergroup_id', 'usergroup_name', $usergroup_id);

        $lists['currencies'] = HTMLHelper::_(
            'select.genericlist',
            $currencyOptions,
            'currency_id',
            'class="form-select middle2" onchange="document.adminForm.submit();" ',
            'id',
            'name',
            $selectedCurrency
        );

        $lists['changestatus'] = HTMLHelper::_(
            'select.genericlist',
            SelectOptions::getOrderStatus(1),
            'statusOrder_id[]',
            'multiple="multiple" size="4" class="inputbox form-select"',
            'status_id',
            'name',
            $statusOrder_id
        );

        $filter = [
            'client_id' => $client_id,
            'client_type' => $client_type,
            'usergroup_id' => $usergroup_id,
            'date_from' => $date_from,
            'statusOrder_id' => $statusOrder_id,
            'date_to' => $date_to,
            'currency_id' => $selectedCurrency
        ];

        $this->prepareFilterDates($filter);

        $totalClients = $model->getClientsReportCount($filter);
        $pageNavClients = new Pagination($totalClients, $limitstart, $limit);

        $clientRows = $model->getClientsReport($filter, $pageNavClients->limitstart, $pageNavClients->limit, $filter_order, $filter_order_Dir);


        $view = $this->getView('sofonareports', 'html');
        $view->setLayout("clients_list");
        $view->set('clientRows', $clientRows);
        $view->set('pageNavClients', $pageNavClients);
        $view->set('settingsPlg', $settingsPlg);
        $view->set('current_client', $current_client);
        $view->set('filter', $filter);
        $view->set('filter_order', $filter_order);
        $view->set('filter_order_Dir', $filter_order_Dir);
        $view->set('countCurrency', $countCurrency);
        $view->set('lists', $lists);

        $view->displayReportClients();
    }

    public function exportxls()
    {
        $logFile = JPATH_ROOT . '/logs/sofonareports_debug.log';

        $app = Factory::getApplication();
        $context = "jshopping.list.admin.orders";

        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonareports', JPATH_ADMINISTRATOR);

        $model = JSFactory::getModel("sofonareports");
        $settingsPlg = $model->getConfigsSettings();

        $type = $app->input->getCmd('type', '');
        $client_id = $app->input->getString('client_id', '');
        $client_type = $app->input->getCmd('client_type', 'all');
        $status_id = $app->input->getInt('status_id', 0);
        $date_from = $app->input->get('date_from', '', 'string');
        $date_to = $app->input->get('date_to', '', 'string');
        $selectedCurrency = $app->input->getInt('currency_id', 0);
        $category_id = $app->input->getInt('category_id', 0);
        $usergroup_id = $app->input->getInt('l_usergroup_id', 0);
        $statusOrder_id = array_map('intval', $app->input->get('statusOrder_id', [], 'array'));

        if ($type == 'products') {
            if (empty($statusOrder_id) || (count($statusOrder_id) === 1 && $statusOrder_id[0] === "0")) {
                $statusOrder_id = $settingsPlg['statusOrder_id_products'];
            }
        } elseif ($type == 'clients') {
            if (empty($statusOrder_id) || (count($statusOrder_id) === 1 && $statusOrder_id[0] === "0")) {
                $statusOrder_id = $settingsPlg['statusOrder_id_products'];
            }
        }

        $filter = [
            'user_id' => $client_id,
            'client_type' => $client_type,
            'status_id' => $status_id,
            'date_from' => $date_from,
            'date_to' => $date_to,
            'currency_id' => $selectedCurrency,
            'category_id' => $category_id,
            'usergroup_id' => $usergroup_id,
            'statusOrder_id' => $statusOrder_id,

        ];
        $this->prepareFilterDates($filter);

        $columns = [];


        if ($type == 'order') {
            $modelOrders = JSFactory::getModel("orders");

            $elements = $model->getAllOrders(0, 0, $filter, 'order_number', 'desc');

            $_list_order_status = $modelOrders->getAllOrderStatus();
            $list_order_status = [];
            foreach ($_list_order_status as $status) {
                $list_order_status[$status->status_id] = $status->name;
            }

            $payments = JSFactory::getModel("payments")->getListNamePaymens(0);
            $shippings = JSFactory::getModel("shippings")->getListNameShippings(0);

            foreach ($elements as &$order) {
                $order->status_name = $list_order_status[$order->order_status] ?? Text::_('JSHOP_UNKNOWN_STATUS');
                $order->order_vendor = ($order->vendor_id > 0) ? ($order->v_fname . " " . $order->v_name) : "-";
                $order->order_payment = $payments[$order->payment_method_id] ?? '';
                $order->order_shipping = $shippings[$order->shipping_method_id] ?? '';
                $order->order_shop_mode = ($order->shop_mode ?? '') ? $order->shop_mode : '';

                $orderTable = JSFactory::getTable('order');
                $orderTable->load($order->order_id);
                $order_product = $orderTable->getAllItems();

                $order->order_countProduct = count($order_product);

                $productNames = [];
                foreach ($order_product as $product) {
                    $productNames[] = $product->product_name;
                }
                $order->order_nameProduct = implode(" ||| ", $productNames);
            }

            if (!empty($settingsPlg['order_export_number']))
                $columns['order_number'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_ORDER_NUMBER');
            // if (!empty($settingsPlg['order_export_id']))
            $columns['order_id'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_ID_ORDER');
            if (!empty($settingsPlg['order_export_user']))
                $columns['name'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER');
            if (!empty($settingsPlg['order_export_email']))
                $columns['email'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER_EMAIL');
            if (!empty($settingsPlg['order_export_phone']))
                $columns['phone'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER_PHONE');
            if (!empty($settingsPlg['order_export_countProduct']))
                $columns['order_countProduct'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_PRODUCTS');
            if (!empty($settingsPlg['order_export_nameProduct']))
                $columns['order_nameProduct'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_NAME_PRODUCTS');
            if (!empty($settingsPlg['order_export_date']))
                $columns['order_date'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_DATE_ORDER');
            if (!empty($settingsPlg['order_export_m_date']))
                $columns['order_m_date'] = Text::_('JSHOP_ORDER_MODIFY_DATE');
            if (!empty($settingsPlg['order_export_status']))
                $columns['status_name'] = Text::_('JSHOP_PANEL_ORDER_STATUS');
            if (!empty($settingsPlg['order_export_total'])) {
                $columns['order_total'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SUM_ORDER');
                $columns['currency_name'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_CURRENCY_NAME');
            }
            if (!empty($settingsPlg['order_export_vendor']))
                $columns['order_vendor'] = Text::_('JSHOP_VENDOR');
            if (!empty($settingsPlg['order_export_payment']))
                $columns['order_payment'] = Text::_('JSHOP_PAYMENT');
            if (!empty($settingsPlg['order_export_shipping']))
                $columns['order_shipping'] = Text::_('JSHOP_SHIPPINGS');
            if (!empty($settingsPlg['order_export_shop_mode']))
                $columns['order_shop_mode'] = Text::_('JSHOP_TRANSACTION');
            if (!empty($settingsPlg['order_export_add_info']))
                $columns['order_add_info'] = Text::_('JSHOP_COMMENT');

        } elseif ($type == 'products') {
            $mergeLang = false;
            if ($settingsPlg['merge_product']) {
                $mergeLang = true;
            }

            $elements = $model->getProductsReport($filter, 0, 0, 'total_sum', 'DESC', $mergeLang);

            if (!empty($settingsPlg['export_product_id']))
                $columns['product_id'] = Text::_('JSHOP_PRODUCT_ID');
            // if (!empty($settingsPlg['export_product_name']))
            $columns['product_name'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_NAME_PRODUCTS');
            if (!empty($settingsPlg['export_manufacturer_code']))
                $columns['manufacturer_code'] = Text::_('JSHOP_MANUFACTURER_CODE');
            if (!empty($settingsPlg['product_ean']))
                $columns['product_ean'] = Text::_('JSHOP_EAN_PRODUCT');
            if (!empty($settingsPlg['export_count_product']))
                $columns['total_quantity'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_SOLD');
            if (!empty($settingsPlg['export_sum_sold'])) {
                $columns['total_sum'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SUM_SOLD');
                $columns['currency_name'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_CURRENCY_NAME');
            }
            if (!empty($settingsPlg['export_count_orders']))
                $columns['orders_count'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_ORDERS');
            if (!empty($settingsPlg['export_hits']))
                $columns['hits'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_HITS');

        } elseif ($type == 'clients') {
            $elements = $model->getClientsReport($filter);

            $columns['client_name'] = Text::_('JSHOP_USER');
            if (!empty($settingsPlg['client_export_email']))
                $columns['email'] = Text::_('JSHOP_EMAIL');
            if (!empty($settingsPlg['client_export_phone']))
                $columns['phone'] = Text::_('JSHOP_TELEFON');
            if (!empty($settingsPlg['client_export_orders_count']))
                $columns['total_orders'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_ORDERS');
            if (!empty($settingsPlg['client_export_total_sum'])) {
                $columns['total_sum'] = Text::_('JSHOP_TOTAL');
                $columns['currency_name'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_CURRENCY_NAME');
            }

            if (!empty($settingsPlg['client_export_last_order_date']))
                $columns['last_order_date'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_LAST_ORDER_DATE');
            if (!empty($settingsPlg['client_export_first_order_date']))
                $columns['first_order_date'] = Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_FIRST_ORDER_DATE');
        }
        $usePhpSpreadsheet = false;

        if (!empty($settingsPlg['useLibrary']) && $settingsPlg['useLibrary'] == 1) {
            $autoloadPath = JPATH_ROOT . '/components/com_jshopping/Lib/phpoffice/autoload.php';

            if (file_exists($autoloadPath)) {
                require_once $autoloadPath;

                if (class_exists('\PhpOffice\PhpSpreadsheet\Spreadsheet')) {
                    $usePhpSpreadsheet = true;
                }
            }
        }

        if ($usePhpSpreadsheet) {

            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            $colIndex = 1;
            foreach ($columns as $title) {
                $sheet->setCellValueByColumnAndRow($colIndex, 1, $title);
                $colIndex++;
            }

            $rowIndex = 2;
            foreach ($elements as $value) {
                $colIndex = 1;
                foreach ($columns as $key => $title) {
                    $cellValue = $value->$key ?? '';

                    $cellValue = str_replace([' ||| '], "\n", $cellValue);

                    $sheet->setCellValueByColumnAndRow($colIndex, $rowIndex, $cellValue);

                    $sheet->getStyleByColumnAndRow($colIndex, $rowIndex)->getAlignment()->setWrapText(true);

                    $colIndex++;
                }
                $rowIndex++;
            }

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment; filename="report_orders.xlsx"');
            header('Cache-Control: max-age=0');

            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $writer->save('php://output');
        } else {
            header("Content-Type: application/vnd.ms-excel; charset=utf-8");
            header("Content-Disposition: attachment; filename=report_orders.xls");
            header("Pragma: no-cache");
            header("Expires: 0");
            echo "\xEF\xBB\xBF"; // BOM UTF-8

            echo "<table border='1'><tr>";
            foreach ($columns as $title) {
                echo "<th>" . htmlspecialchars($title) . "</th>";
            }
            echo "</tr>";

            foreach ($elements as $value) {
                echo "<tr>";
                foreach ($columns as $key => $title) {

                    $cell = $value->$key ?? '';
                    // $cell = strip_tags(str_replace('|||', "\n", $cell));
                    echo "<td>" . htmlspecialchars($cell) . "</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        }

        $app->close();
    }

    public function settings()
    {
        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshoppingadmin_sofonareports', JPATH_ADMINISTRATOR);

        $model = $this->getModel('sofonareports');
        $settingsPlg = $model->getConfigsSettings();
        $jshopConfig = JSFactory::getConfig();
        $id_vendor_cuser = HelperAdmin::getIdVendorForCUser();

        $show_vendor = $jshopConfig->admin_show_vendors;
        if ($id_vendor_cuser)
            $show_vendor = 0;
        $display_info_only_my_order = 0;
        if ($jshopConfig->admin_show_vendors && $id_vendor_cuser) {
            $display_info_only_my_order = 1;
        }

        $statusOrder_id_products = $settingsPlg['statusOrder_id_products'];
        $statusOrder_id_clients = $settingsPlg['statusOrder_id_clients'];

        $lists['statusOrder_id_products'] = HTMLHelper::_(
            'select.genericlist',
            SelectOptions::getOrderStatus(1),
            'statusOrder_id_products[]',
            'multiple="multiple" size="4" class="inputbox form-select"',
            'status_id',
            'name',
            $statusOrder_id_products
        );

        $lists['statusOrder_id_clients'] = HTMLHelper::_(
            'select.genericlist',
            SelectOptions::getOrderStatus(1),
            'statusOrder_id_clients[]',
            'multiple="multiple" size="4" class="inputbox form-select"',
            'status_id',
            'name',
            $statusOrder_id_clients
        );

        $currencyModel = JSFactory::getModel("currencies");
        $currencies = $currencyModel->getAllCurrencies();

        $currencyOptions = [];
        $currencyOptions[] = (object) [
            'id' => 0,
            'name' => Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_OPTION_ALL_CURRENCY')
        ];
        foreach ($currencies as $currency) {
            $currencyOptions[] = (object) [
                'id' => $currency->currency_id,
                'name' => $currency->currency_code . ' (' . $currency->currency_name . ')'
            ];
        }

        $currencySettingsProducts = $settingsPlg['default_currency_products'];
        $currencySettingsClients = $settingsPlg['default_currency_clients'];
        $currencySettingsOrders = $settingsPlg['default_currency_orders'];

        $lists['default_currency_products'] = HTMLHelper::_(
            'select.genericlist',
            $currencyOptions,
            'default_currency_products',
            'class="form-select middle2" ',
            'id',
            'name',
            $currencySettingsProducts
        );

        $lists['default_currency_clients'] = HTMLHelper::_(
            'select.genericlist',
            $currencyOptions,
            'default_currency_clients',
            'class="form-select middle2" ',
            'id',
            'name',
            $currencySettingsClients
        );

        $lists['default_currency_orders'] = HTMLHelper::_(
            'select.genericlist',
            $currencyOptions,
            'default_currency_orders',
            'class="form-select middle2" ',
            'id',
            'name',
            $currencySettingsOrders
        );

        $view = $this->getView('sofonareports', 'html');
        $view->setLayout('settings');
        $view->set('settingsPlg', $settingsPlg);
        $view->set('show_vendor', $show_vendor);
        $view->set('lists', $lists);

        $view->displaySettings();
    }
    public function saveSettings()
    {
        $post = $this->input->post->getArray();

        try {
            $model = $this->getModel('sofonareports');

            if ($model->saveConfigsSettings($post)) {
                $msg = 'Настрйоки сохранены успешно';
                // var_dump($this->getTask());die;

                $this->setRedirect("index.php?option=com_jshopping&controller=sofonareports&task=settings", $msg);

            } else {
                throw new \Exception('Ошибка сохранения настроек');
            }
        } catch (\Exception $e) {
            $this->setRedirect("index.php?option=com_jshopping&controller=sofonareports&task=settings", $e->getMessage(), 'error');
        }
    }
    private function prepareFilterDates(&$filter)
    {
        foreach (['date_from', 'date_to'] as $field) {
            if (!empty($filter[$field]) && preg_match('/(\d{2})\.(\d{2})\.(\d{4})/', $filter[$field], $m)) {
                $filter[$field] = "{$m[3]}-{$m[2]}-{$m[1]}";
            }
        }
    }

    function back()
    {
        $this->setRedirect("index.php?option=com_jshopping&controller=sofonareports");
    }

    function backConfig()
    {
        $this->setRedirect("index.php?option=com_jshopping&controller=config");
    }
    function backOther()
    {
        $this->setRedirect("index.php?option=com_jshopping&controller=other");
    }

}