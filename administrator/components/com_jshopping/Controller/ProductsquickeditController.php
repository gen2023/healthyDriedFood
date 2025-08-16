<?php
namespace Joomla\Component\Jshopping\Administrator\Controller;

use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\CMS\Factory;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Component\Jshopping\Site\Helper\SelectOptions;
use Joomla\CMS\Session\Session;
use Joomla\CMS\Response\JsonResponse;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\BaseController;

class ProductsQuickEditController extends BaseadminController
{
    protected $default_view = 'productsquickedit';

    public function display($cachable = false, $urlparams = false)
    {

        $app = Factory::getApplication();
        $app = Factory::getApplication();
        $jshopConfig = JSFactory::getConfig();
        $products = JSFactory::getModel("products");
        $id_vendor_cuser = HelperAdmin::getIdVendorForCUser();

        $context = "jshoping.list.admin.product";
        $limit = $app->getUserStateFromRequest($context . 'limit', 'limit', $app->getCfg('list_limit'), 'int');
        $limitstart = $app->getUserStateFromRequest($context . 'limitstart', 'limitstart', 0, 'int');
        $filter_order = $app->getUserStateFromRequest($context . 'filter_order', 'filter_order', $jshopConfig->adm_prod_list_default_sorting, 'cmd');
        $filter_order_Dir = $app->getUserStateFromRequest($context . 'filter_order_Dir', 'filter_order_Dir', $jshopConfig->adm_prod_list_default_sorting_dir, 'cmd');

        if (isset($_GET['category_id']) && $_GET['category_id'] === "0") {
            $app->setUserState($context . 'category_id', 0);
            $app->setUserState($context . 'manufacturer_id', 0);
            $app->setUserState($context . 'vendor_id', -1);
            $app->setUserState($context . 'label_id', 0);
            $app->setUserState($context . 'publish', 0);
            $app->setUserState($context . 'text_search', '');
        }

        $category_id = $app->getUserStateFromRequest($context . 'category_id', 'category_id', 0, 'int');
        $manufacturer_id = $app->getUserStateFromRequest($context . 'manufacturer_id', 'manufacturer_id', 0, 'int');
        $vendor_id = $app->getUserStateFromRequest($context . 'vendor_id', 'vendor_id', -1, 'int');
        $label_id = $app->getUserStateFromRequest($context . 'label_id', 'label_id', 0, 'int');
        $publish = $app->getUserStateFromRequest($context . 'publish', 'publish', 0, 'int');
        $text_search = $app->getUserStateFromRequest($context . 'text_search', 'text_search', '');
        if ($category_id && $filter_order == 'category') {
            $filter_order = 'product_id';
        }

        $filter = array("category_id" => $category_id, "manufacturer_id" => $manufacturer_id, "vendor_id" => $vendor_id, "label_id" => $label_id, "publish" => $publish, "text_search" => $text_search);
        if ($id_vendor_cuser) {
            $filter["vendor_id"] = $id_vendor_cuser;
        }

        $show_vendor = $jshopConfig->admin_show_vendors;
        if ($id_vendor_cuser) {
            $show_vendor = 0;
        }


        $total = $products->getCountAllProducts($filter);
        $pagination = new Pagination($total, $limitstart, $limit);
        $rows = $products->getAllProducts(
            $filter,
            $pagination->limitstart,
            $pagination->limit,
            $filter_order,
            $filter_order_Dir,
            array(
                'label_image' => 1,
                'vendor_name' => $show_vendor
            )
        );

        $productPriceTable = JSFactory::getTable('productPrice', 'jshop');

        foreach ($rows as &$product) {

            $product_id = (int) $product->product_id;
            $addPrices = $productPriceTable->getAddPrices($product_id);
            $addPrices = array_reverse($addPrices);

            $basePrice = (float) $product->product_price;

            foreach ($addPrices as &$addPrice) {
                $discountPercent = (float) $addPrice->discount;
                $addPrice->final_price = round($basePrice * (1 - $discountPercent / 100), 2);
            }

            $product->product_add_prices = $addPrices;
            $model = \JSFactory::getModel('productsQuickEdit');

            $product->userGroups=$model->getuserGroup();
        }

        if ($show_vendor) {
            $lists['vendors'] = HTMLHelper::_('select.genericlist', SelectOptions::getVendors(), 'vendor_id', 'class="form-select" onchange="document.adminForm.submit();" default-value="-1"', 'id', 'name', $vendor_id);
        }
        $lists['treecategories'] = HTMLHelper::_('select.genericlist', SelectOptions::getCategories(1, 0, 1), 'category_id', 'class="form-select" onchange="document.adminForm.submit();"', 'category_id', 'name', $category_id);
        $lists['manufacturers'] = HTMLHelper::_('select.genericlist', SelectOptions::getManufacturers(), 'manufacturer_id', 'class="form-select" onchange="document.adminForm.submit();"', 'manufacturer_id', 'name', $manufacturer_id);
        if ($jshopConfig->admin_show_product_labels) {
            $lists['labels'] = HTMLHelper::_('select.genericlist', SelectOptions::getLabels(), 'label_id', 'style="width: 120px;" class="form-select" onchange="document.adminForm.submit();"', 'id', 'name', $label_id);
        }
        $lists['publish'] = HTMLHelper::_('select.genericlist', SelectOptions::getPublish(), 'publish', 'style="width: 120px;" class="form-select" onchange="document.adminForm.submit();"', 'id', 'name', $publish);

        $app->triggerEvent('onBeforeDisplayListProducts', array(&$rows));

        $view = $this->getView('productsquickedit', 'html');

        $view->rows = $rows;
        $view->lists = $lists;
        $view->filter_order = $filter_order;
        $view->filter_order_Dir = $filter_order_Dir;
        $view->category_id = $category_id;
        $view->manufacturer_id = $manufacturer_id;
        $view->pagination = $pagination;
        $view->text_search = $text_search;
        $view->config = $jshopConfig;
        $view->show_vendor = $show_vendor;
        foreach ($rows as $row) {
            $row->tmp_html_col_after_title = "";
        }
        $view->tmp_html_start = "";
        $view->tmp_html_filter = "";
        $view->tmp_html_col_after_title = "";
        $view->tmp_html_col_before_td_foot = "";
        $view->tmp_html_col_after_td_foot = "";
        $view->tmp_html_end = "";
        $view->tmp_html_filter_end = '';

        $view->display();
    }

    public function saveQuantity()
    {
        $app = Factory::getApplication();

        // Получаем JSON тело запроса
        $data = json_decode(file_get_contents('php://input'), true);
        $productId = (int) ($data['product_id'] ?? 0);
        $quantity = (float) ($data['quantity'] ?? 0);
        $unlimit = (float) ($data['unlimit'] ?? 0);

        // Отладка
        // file_put_contents(JPATH_ROOT . '/logs/quantity_debug.log', "Product ID: $productId; Quantity: $quantity\n", FILE_APPEND);

        // Загрузка модели
        $model = \JSFactory::getModel('productsQuickEdit');
        $result = $model->updateQuantity($productId, $quantity, $unlimit);

        echo new JsonResponse(['success' => (bool) $result]);
        $app->close();
    }

    public function savePrice()
    {
        $app = Factory::getApplication();
        $data = json_decode(file_get_contents('php://input'), true);

        $productId = (int) ($data['product_id'] ?? 0);
        $price = (float) ($data['price'] ?? 0.0);

        // Отладка
        // file_put_contents(JPATH_ROOT . '/logs/price_debug.log', "Product ID: $productId; Price: $price\n", FILE_APPEND);

        // Загрузка модели
        $model = \JSFactory::getModel('productsQuickEdit');
        $result = $model->updatePrice($productId, $price);

        echo new JsonResponse(['success' => (bool) $result]);
        $app->close();
    }
    public function saveAddPrice()
    {
        $app = Factory::getApplication();
        $data = json_decode(file_get_contents('php://input'), true);

        $productId = (int) ($data['product_id'] ?? 0);
        $priceId = (int) ($data['price_id'] ?? 0);
        $price = (float) ($data['price'] ?? 0.0);

        $model = \JSFactory::getModel('productsQuickEdit');
        $productTable = \JSFactory::getTable('product', 'jshop');

        $productTable->load($productId);
        $basePrice = $productTable->product_price;

        if ($basePrice <= 0) {
            echo new JsonResponse(['success' => false, 'error' => 'Base price is zero']);
            $app->close();
        }

        $discountPercent = round((1 - ($price / $basePrice)) * 100, 6);
        $result = $model->updateAddPrice($productId, $priceId, $discountPercent);

        echo new JsonResponse(['success' => (bool) $result]);
        $app->close();
    }

}
