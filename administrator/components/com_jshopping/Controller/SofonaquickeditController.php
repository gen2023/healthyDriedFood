<?php

namespace Joomla\Component\Jshopping\Administrator\Controller;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Component\Jshopping\Site\Helper\SelectOptions;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Registry\Registry;
use Joomla\CMS\Response\JsonResponse;

defined('_JEXEC') or die;


class SofonaquickeditController extends BaseadminController
{
  function display($cachable = false, $urlparams = false)
  {
    $app = Factory::getApplication();
    $jshopConfig = JSFactory::getConfig();
    $products = JSFactory::getModel("products");
    $model = JSFactory::getModel("sofonaquickedit");
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
    $rows = $model->getAllProducts(
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

      // $product->userGroups=$model->getuserGroup();
      // $product->price_group = $model->getGroupPriceData($product->product_id);
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

    $wa = JSFactory::getWebAssetManager();
    $wa->registerAndUseStyle('plg_sofonaquickedit.admin', '/media/plg_jshoppingadmin_sofonaquickedit/css/admin.css');
    $wa->registerAndUseScript('plg_sofonaquickedit.admin', '/media/plg_jshoppingadmin_sofonaquickedit/js/admin.js', [], ['defer' => true]);

    $lang = Factory::getApplication()->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_ACTION');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_NUMBER');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPLOAD_FAIL');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_NOT_SELECT_PRODUCT');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_LOADING');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_UNLIMITED');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_UNLIMITED');
    Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_CONTENT_UNSET_PRODUCT_PRICE');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');
    // Text::script('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION');





    PluginHelper::importPlugin('jshoppingadmin', 'sofonaquickedit');

    $plugin = PluginHelper::getPlugin('jshoppingadmin', 'sofonaquickedit');
    $params = new Registry($plugin->params);

    $params_plg = [];

    $params_plg = array(
      'show_massedit_price' => $params->get('massedit_price', 0),
      'show_id' => $params->get('show_id', 0),
      'show_deleteProduct' => $params->get('show_deleteProduct', 0),
      'show_publishProduct' => $params->get('show_publishProduct', 0),
      'show_dateCreateProduct' => $params->get('show_dateCreateProduct', 0),
      'show_hitsProduct' => $params->get('show_hitsProduct', 0),
      'show_priceProduct' => $params->get('show_priceProduct', 0),
      'show_oldpriceProduct' => $params->get('show_oldpriceProduct', 0),
      // 'show_vendorProduct' => $params->get('show_vendorProduct', 0),
      'show_vendorProduct' => 0,
      'show_additionPriceProduct' => $params->get('show_additionPriceProduct', 0),
      'show_product_eanProduct' => $params->get('show_product_eanProduct', 0),
      'show_stockProduct' => $params->get('show_stockProduct', 0),
      'show_product_manufacturer' => $params->get('show_product_manufacturer', 0),
      'show_category' => $params->get('show_category', 0),
      'show_nameProduct' => $params->get('show_nameProduct', 0),
      'show_imageProduct' => $params->get('show_imageProduct', 0),
      'show_currencyProduct' => $params->get('show_currencyProduct', 0),
      'show_editProduct' => $params->get('show_editProduct', 0),
      'show_short_description' => $params->get('show_short_description', 0),
      'show_real_ean' => $params->get('show_real_ean', 0),
      'show_manufacturer_code' => $params->get('show_manufacturer_code', 0),
      'show_dateModifyProduct' => $params->get('show_dateModifyProduct', 0),
      'show_labelProduct' => $params->get('show_labelProduct', 0),

    );


    $view = $this->getView("sofonaquickedit", 'html');
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
    $view->params_plg = $params_plg;
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
  public function editPrice()
  {
    $model = JSFactory::getModel("sofonaquickedit");
    $lang = Factory::getApplication()->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    if ($_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') {
      exit(json_encode(['success' => false, 'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_REQUEST_TYPE')]));
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!is_array($data) || !isset($data['ids']) || !isset($data['number']) || !isset($data['action']) || !isset($data['type_price']) || !isset($data['action2'])) {
      exit(json_encode(['success' => false, 'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA')]));
    }

    $ids = [];

    if (is_array($data['ids'])) {
      $ids = $data['ids'];
    } else {
      switch ($data['ids']) {
        case 'all':
          $ids = $model->getAllProductIds();
          break;
        case 'all_published':
          $ids = $model->getAllProductIdsByPublish(1);
          break;
        case 'all_not_published':
          $ids = $model->getAllProductIdsByPublish(0);
          break;
        default:
          exit(json_encode(['success' => false, 'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA')]));
      }
    }

    $successCount = 0;
    $value = (float) $data['number'];
    $op = $data['action'];
    $percent = ($data['action2'] === 'persent');
    $target = $data['type_price']; // 'price' или 'old_price'
    $applyTo = $target === 'old_price' ? 'product_old_price' : 'product_price';

    foreach ($ids as $productId) {
      $product = $model->getProductById($productId);
      if (!$product)
        continue;

      $current = (float) $product->$applyTo;

      // Если операция с процентом — пересчитать value
      $delta = $percent ? ($current * $value / 100) : $value;

      switch ($op) {
        case '+':
          $newValue = $current + $delta;
          break;
        case '-':
          $newValue = $current - $delta;
          break;
        case '*':
          $newValue = $current * $delta;
          break;
        case '/':
          $newValue = ($delta != 0) ? ($current / $delta) : $current;
          break;
        default:
          continue 2; // Пропускаем неизвестную операцию
      }

      $productUpdate = (object) [
        'product_id' => (int) $productId,
        'date_modify' => Factory::getDate()->toSql(),
        $applyTo => round($newValue, 2),
      ];

      if ($model->updateFieldProduct($productUpdate)) {
        $successCount++;
      }
    }

    exit(json_encode([
      'success' => true,
      'message' => Text::sprintf('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_SUCCESS_COUNT', $successCount, $applyTo),
      'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_ACTION'),
    ]));
  }



  public function updateField()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $lang = Factory::getApplication()->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || empty($data['id']) || empty($data['fields']) || !is_array($data['fields'])) {
      echo new JsonResponse(false, Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA'));
      $app->close();
    }

    $id = (int) $data['id'];
    $fields = $data['fields'];

    $model = JSFactory::getModel("sofonaquickedit");

    $product = $model->getProductById($id);

    if (!$product) {
      echo new JsonResponse(false, Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_PRODUCT_NOT_FOUND'));
      $app->close();
    }

    foreach ($fields as $field => $value) {
      $product->$field = $value;
    }

    $product->date_modify = Factory::getDate()->toSql();

    $model->updateFieldProduct($product);

    exit(json_encode([
      'success' => true,
      'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_SUCCESS'),
      'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_FAIL'),
    ]));

    // echo new JsonResponse($result, $result ? Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_SUCCESS') : Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_FAIL'));
    // $app->close();
  }

  function copy()
  {
    $cid = $this->input->getVar('cid');
    $text = JSFactory::getModel("products")->copyProducts($cid);
    $this->setRedirect("index.php?option=com_jshopping&controller=sofonaquickedit", implode("</li><li>", $text));
  }

  public function getCategories()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $context = "jshoping.list.admin.product";

    $product_id = $input->getInt('product_id');
    $category_id = $this->getModel('sofonaquickedit')->getProductCategories($product_id);


    $select = HTMLHelper::_(
      'select.genericlist',
      SelectOptions::getCategories(0, 1, 1),
      'category_id',
      'class="form-select" data-product_id="' . (int) $product_id . '" multiple="multiple"',
      'category_id',
      'name',
      $category_id
    );
    echo json_encode(['html' => $select]);
    $app->close();
  }

  public function updateCategorys()
  {
    $app = Factory::getApplication();
    $lang = Factory::getApplication()->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    $input = $app->input;
    $json = json_decode(file_get_contents('php://input'), true);
    $model = JSFactory::getModel("sofonaquickedit");

    $product_id = (int) ($json['id'] ?? 0);
    $category_ids = $json['fields']['category_id'] ?? [];

    if (!$product_id || !is_array($category_ids)) {
      echo json_encode(['success' => false, 'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA')]);
      $app->close();
    }

    $model->updateCategorys($product_id, $category_ids);

    echo json_encode([
      'success' => true,
      'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_CATEGORY_UPDATE_SUCCESS'),
      'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_CATEGORY_UPDATE_FAIL')
    ]);
    $app->close();
  }

  public function getManufacturers()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $context = "jshoping.list.admin.product";
    $product_id = $input->getInt('product_id');

    $manufacturer_id = $this->getModel('sofonaquickedit')->getProductManufacturerId($product_id);

    $select = HTMLHelper::_(
      'select.genericlist',
      SelectOptions::getManufacturers(0, 1),
      'manufacturer_id',
      'class="form-select" data-product_id="' . (int) $product_id . '" data-field="product_manufacturer_id" ',
      'manufacturer_id',
      'name',
      $manufacturer_id
    );
    echo json_encode(['html' => $select]);
    $app->close();
  }
  public function getCurrencies()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    // $context = "jshoping.list.admin.product";

    $product_id = $input->getInt('product_id');
    $product = JSFactory::getTable('product', 'jshop');
    $product->load($product_id);
    $currency_id = $product->currency_id;


    $select = HTMLHelper::_(
      'select.genericlist',
      SelectOptions::getCurrencies(0, 1),
      'currency_id',
      'class="form-select" data-product_id="' . (int) $product_id . '" data-field="currency_id"',
      'currency_id',
      'currency_code',
      $currency_id
    );

    echo json_encode(['html' => $select]);
    $app->close();
  }

  public function massUpdate()
  {
    $app = Factory::getApplication();
    $data = json_decode(file_get_contents('php://input'), true);

    $lang = $app->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    $ids = $data['ids'] ?? [];
    $type = $data['type'] ?? '';
    $value = $data['value'] ?? '';

    if (!$type || $value === '') {
      echo json_encode([
        'success' => false,
        'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA')
      ]);
      $app->close();
    }

    $specialModes = ['all', 'all_published', 'all_not_published'];
    $isSpecialMode = is_string($ids) && in_array($ids, $specialModes, true);

    $model = JSFactory::getModel("sofonaquickedit");

    $successCount = 0;

    if ($isSpecialMode) {
      $product = (object) [
        'date_modify' => Factory::getDate()->toSql(),
        $type => $value
      ];

      $successCount = $model->updateFieldProductAll($product, $ids);
    } else {
      if (!is_array($ids) || count($ids) === 0) {
        echo json_encode([
          'success' => false,
          'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_NOT_SELECT_PRODUCT')
        ]);
        $app->close();
      }

      foreach ($ids as $product_id) {
        $product = (object) [
          'product_id' => (int) $product_id,
          'date_modify' => Factory::getDate()->toSql(),
          $type => $value
        ];

        if ($model->updateFieldProduct($product)) {
          $successCount++;
        }
      }
    }

    echo json_encode([
      'success' => true,
      'updated' => $successCount,
      'message' => Text::sprintf('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_SUCCESS_COUNT', $successCount, $type),
      'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_FAIL')
    ]);
    $app->close();
  }
  public function getLabelProduct()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $product_id = $input->getInt('product_id');

    $label_id = $this->getModel('sofonaquickedit')->getProductLabelId($product_id);

    $select = HTMLHelper::_(
      'select.genericlist',
      SelectOptions::getLabels(0, 1),
      'label_id',
      'class="form-select" data-product_id="' . (int) $product_id . '" data-field="label_id" ',
      'id',
      'name',
      $label_id
    );
    echo json_encode(['html' => $select]);
    $app->close();
  }

  public function getAdditionPrices()
  {
    $rawBody = file_get_contents('php://input');
    $data = json_decode($rawBody, true);

    $product_id = isset($data['product_id']) ? (int) $data['product_id'] : 0;

    if (!$product_id) {
      echo new JsonResponse(['error' => 'Invalid product_id'], 400);
      return;
    }

    $model = JSFactory::getModel("sofonaquickedit");
    $prices = $model->getAdditionPrices($product_id);

    echo new JsonResponse($prices);
    return;
  }

  public function deleteAdditionPrice()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $lang = Factory::getApplication()->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $id = (int) ($data['id'] ?? 0);


    if (!$id) {
      http_response_code(400); // Установим HTTP-статус явно
      echo new JsonResponse(
        null,
        Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA'),
        ['error' => true]
      );
      return;
    }


    $model = JSFactory::getModel("sofonaquickedit");
    $success = $model->deleteAdditionPrice($id);

    echo json_encode([
      'success' => true,
      'message' => Text::sprintf('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_PRICE_DELETED', $id),
      'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR')
    ]);

    return;
  }

  public function addAdditionPrice()
  {
    $app = Factory::getApplication();
    $data = json_decode(file_get_contents('php://input'), true);

    $productId = (int) ($data['product_id'] ?? 0);
    $quantityStart = (int) ($data['quantity_start'] ?? 0);
    $quantityFinish = (int) ($data['quantity_finish'] ?? 0);
    $discount = (float) ($data['discount'] ?? 0);

    if (!$productId || !$quantityStart || !$quantityFinish || $discount < 0) {
      echo new JsonResponse(null, false, ['error' => 'Неверные данные']);
      return;
    }

    $model = JSFactory::getModel("sofonaquickedit");
    $success = $model->addAdditionPrice($productId, $quantityStart, $quantityFinish, $discount);

    echo new JsonResponse(['success' => $success]);
  }


}