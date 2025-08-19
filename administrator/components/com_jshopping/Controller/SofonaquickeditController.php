<?php

namespace Joomla\Component\Jshopping\Administrator\Controller;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Component\Jshopping\Site\Helper\SelectOptions;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Response\JsonResponse;
use Joomla\Component\Jshopping\Site\Helper\Helper;

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

    $wa = JSFactory::getWebAssetManager();
    $wa->registerAndUseStyle('plg_sofonaquickedit.admin', '/media/plg_jshoppingadmin_sofonaquickedit/css/admin.css');
    $wa->registerAndUseScript('plg_sofonaquickedit.admin', '/media/plg_jshoppingadmin_sofonaquickedit/js/admin.js', [], ['defer' => true]);

    $lang = Factory::getApplication()->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

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
    $selectedCurrency = $app->getUserStateFromRequest($context . 'currency_id', 'currency_id', 0, 'int');

    $currencyModel = JSFactory::getModel("currencies");
    $currencies = $currencyModel->getAllCurrencies();

    $currencyOptions = [];

    $currencyOptions[] = (object) [
      'id' => 0,
      'name' => '- ' . Text::_('JSHOP_CURRENCIES') . ' -'
    ];

    foreach ($currencies as $currency) {
      $currencyOptions[] = (object) [
        'id' => $currency->currency_id,
        'name' => $currency->currency_code . ' (' . $currency->currency_name . ')'
      ];
    }

    $countCurrency = count($currencyOptions);

    if ($category_id && $filter_order == 'category') {
      $filter_order = 'product_id';
    }

    $filter = array(
      "category_id" => $category_id,
      "manufacturer_id" => $manufacturer_id,
      "vendor_id" => $vendor_id,
      "label_id" => $label_id,
      'currency_id' => $selectedCurrency,
      "publish" => $publish,
      "text_search" => $text_search
    );

    if ($id_vendor_cuser) {
      $filter["vendor_id"] = $id_vendor_cuser;
    }

    $show_vendor = $jshopConfig->admin_show_vendors;
    if ($id_vendor_cuser) {
      $show_vendor = 0;
    }

    $params = \JComponentHelper::getParams('com_languages');
    $frontend_lang = $params->get('administrator', 'en-GB');
    $langt = \JFactory::getApplication()->input->getVar("language_id", $frontend_lang);

    $_lang = \JSFactory::getModel("languages");
    $languages = $_lang->getAllLanguages(1);

    $lang_list = \JHTML::_(
      'select.genericlist',
      $languages,
      'language_id',
      'class="form-select langlistForm" onchange="document.adminForm.submit();"',
      'language',
      'name',
      $langt
    );
    $multilang = count($languages);

    $langObj = \JSFactory::getLang();
    $langObj->setLang($langt);

    $total = $model->getCountAllProducts($filter);
    $pagination = new Pagination($total, $limitstart, $limit);

    $rows = $model->getAllProducts(
      $filter,
      $pagination->limitstart,
      $pagination->limit,
      $filter_order,
      $filter_order_Dir,
      [
        'label_image' => 1,
        'vendor_name' => $show_vendor
      ],
      $langObj
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

    $manufacturerHelper = [];

    $manufacturerHelper[] = (object) [
      'manufacturer_id' => 0,
      'name' => '- ' . Text::_('JSHOP_NAME_MANUFACTURER') . ' -'
    ];
    $manufacturerHelper[] = (object) [
      'manufacturer_id' => -1,
      'name' => '- ' . Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_NOT_MANUFACTURER') . ' -'
    ];

    $modelManufacturer = JSFactory::getModel('Manufacturers');
    $manufacturers = $modelManufacturer->getList();

    $manufacturerHelper = array_merge($manufacturerHelper, $manufacturers);

    $labelsHelper = [];
    $labelsHelper[] = (object) [
      'id' => 0,
      'name' => '- ' . Text::_('JSHOP_LABEL') . ' -'
    ];
    $labelsHelper[] = (object) [
      'id' => -1,
      'name' => '- ' . Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_OPTION_NOT_LABELS') . ' -'
    ];

    $modelLabels = JSFactory::getModel('Productlabels');
    $labelsList = $modelLabels->getList();

    $labelsHelper = array_merge($labelsHelper, $labelsList);

    if ($show_vendor) {
      $lists['vendors'] = HTMLHelper::_('select.genericlist', SelectOptions::getVendors(), 'vendor_id', 'class="form-select" onchange="document.adminForm.submit();" default-value="-1"', 'id', 'name', $vendor_id);
    }
    $lists['treecategories'] = HTMLHelper::_('select.genericlist', SelectOptions::getCategories(1, 0, 1), 'category_id', 'class="form-select" onchange="document.adminForm.submit();"', 'category_id', 'name', $category_id);
    $lists['manufacturers'] = HTMLHelper::_('select.genericlist', $manufacturerHelper, 'manufacturer_id', 'class="form-select" onchange="document.adminForm.submit();"', 'manufacturer_id', 'name', $manufacturer_id);
    if ($jshopConfig->admin_show_product_labels) {
      // $lists['labels'] = HTMLHelper::_('select.genericlist', SelectOptions::getLabels(), 'label_id', 'style="width: 120px;" class="form-select" onchange="document.adminForm.submit();"', 'id', 'name', $label_id);
      $lists['labels'] = HTMLHelper::_('select.genericlist', $labelsHelper, 'label_id', 'style="width: 120px;" class="form-select" onchange="document.adminForm.submit();"', 'id', 'name', $label_id);
    }
    $lists['publish'] = HTMLHelper::_('select.genericlist', SelectOptions::getPublish(), 'publish', 'style="width: 120px;" class="form-select" onchange="document.adminForm.submit();"', 'id', 'name', $publish);
    $lists['currencies'] = HTMLHelper::_('select.genericlist', $currencyOptions, 'currency_id', 'class="form-select middle2" onchange="document.adminForm.submit();" ', 'id', 'name', $selectedCurrency);

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

    $params_plg = $model->getConfigsSettings();
    $mass_operation_type = [];
    $mass_operation_type['name_' . $langt] = Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_NAME');

    if ($params_plg['show_priceProduct']) {
      $mass_operation_type['product_price'] = Text::_('JSHOP_PRICE');
    }
    if ($params_plg['show_oldpriceProduct']) {
      $mass_operation_type['product_old_price'] = Text::_('JSHOP_OLD_PRICE');
    }
    if ($params_plg['show_stockProduct']) {
      $mass_operation_type['product_quantity'] = Text::_('JSHOP_QUANTITY');
    }
    if ($params_plg['show_hitsProduct']) {
      $mass_operation_type['hits'] = Text::_('JSHOP_HITS');
    }
    if ($params_plg['show_product_manufacturer']) {
      $mass_operation_type['product_manufacturer_id'] = Text::_('JSHOP_MANUFACTURER');
    }
    if ($params_plg['show_currencyProduct']) {
      $mass_operation_type['currency_id'] = Text::_('JSHOP_CURRENCY_PARAMETERS');
    }
    if ($params_plg['show_labelProduct']) {
      $mass_operation_type['label_id'] = Text::_('JSHOP_LIST_PRODUCT_LABELS');
    }
    // TODO: при замене категории нужно очищать все категории продуткта в таблице категорий
    // if ($params_plg['show_category']) {
    //   $mass_operation_type['category'] = Text::_('JSHOP_CATEGORY');
    // } 
    if ($params_plg['show_metaTitle']) {
      $mass_operation_type['meta_title_' . $langt] = Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_TITLE');
    }
    if ($params_plg['show_metaDescription']) {
      $mass_operation_type['meta_description_' . $langt] = Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_DESCRIPTION');
    }
    if ($params_plg['show_medtaKeywords']) {
      $mass_operation_type['meta_keyword_' . $langt] = Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_SHOW_META_KEYWORDS');
    }

    $resultChanges = $model->getLogChanges();

    $fieldMap = [
      'product_old_price' => 'Старая цена',
      'product_price' => 'Цена',
      'name_' . $langt => 'Наименование товара',
      'product_quantity' => 'Количество',
      'hits' => 'Просмотры',
      'product_manufacturer_id' => 'Производитель',
      'currency_id' => 'Валюта',
      'label_id' => 'Метка',
      'meta_title_' . $langt => 'Мета заголовок',
      'meta_description_' . $langt => 'Мета описание',
      'meta_keyword_' . $langt => 'Мета ключевые слова',
      'short_description_' . $langt => 'Краткое описание',
      'product_ean' => 'Код товара',
      'manufacturer_code' => 'Артикул',
      'real_ean' => 'EAN',
      'category_id' => 'Категория',

    ];

    $groupedChanges = [];

    foreach ($resultChanges as &$change) {
      if (isset($fieldMap[$change->field])) {
        $change->field = $fieldMap[$change->field];
      }

      $info = json_decode($change->info, true);
      if (json_last_error() === JSON_ERROR_NONE && !empty($info['mass_action'])) {
        $change->info = sprintf(
          'Операция: %s, Значение: %s, Процент: %s',
          $info['operation'],
          $info['value'],
          $info['percent'] ? 'Да' : 'Нет'
        );
      } else if (json_last_error() === JSON_ERROR_NONE && !empty($info['mass_operation'])) {
        switch ($info['operation']) {
          case 'addStart':
            $msg = 'Добавлено в начало - ' . $info['value'];
            break;

          case 'addEnd':
            $msg = 'Добавлено в конец - ' . $info['value'];
            break;

          case 'replace':
            $msg = 'Замена на - ' . $info['value'];
            break;

          default:
            $msg = 'Неизвестная операция';
            break;
        }

        $change->info = $msg;
      } else {
        $change->info = 'Замена на - ' . $change->new_value;
      }

      $dateKey = date('Y-m-d', strtotime($change->date_modify));
      $groupedChanges[$dateKey][] = $change;
    }
    unset($change);

    krsort($groupedChanges);

    $view = $this->getView("sofonaquickedit", 'html');
    $view->rows = $rows;
    $view->lists = $lists;
    $view->filter_order = $filter_order;
    $view->filter_order_Dir = $filter_order_Dir;
    $view->category_id = $category_id;
    $view->manufacturer_id = $manufacturer_id;
    $view->pagination = $pagination;
    $view->text_search = $text_search;
    $view->multilang = $multilang;
    $view->lang_list = $lang_list;
    $view->config = $jshopConfig;
    $view->countCurrency = $countCurrency;
    $view->current_lang = $langt;
    $view->show_vendor = $show_vendor;
    $view->params_plg = $params_plg;
    $view->mass_operation_type = $mass_operation_type;
    $view->groupedChanges = $groupedChanges;

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

    $ids = $this->getProductIdsFromRequest($data['ids']);

    if (empty($ids)) {
      exit(json_encode(['success' => false, 'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA')]));
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
        $log = (object) [
          'product_id' => (int) $productId,
          'old_value' => $current,
          'new_value' => round($newValue, 2),
          'field' => $applyTo,
          'info' => json_encode([
            'mass_action' => 1,
            'operation' => $op,
            'value' => $value,
            'percent' => $percent,
          ], JSON_UNESCAPED_UNICODE),
          'date_modify' => Factory::getDate()->toSql(),
        ];

        $model->addLogChange($log);
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
    $lang = $app->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || empty($data['id']) || empty($data['fields']) || !is_array($data['fields'])) {
      echo new JsonResponse(false, Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA'));
      $app->close();
    }

    $id = (int) $data['id'];
    $fields = $data['fields'];
    $fieldLog = $data['fieldLog'] ?? '';
    $newValueLog = $data['newValueLog'] ?? null;

    $model = JSFactory::getModel("sofonaquickedit");
    $product = $model->getProductById($id);

    if (!$product) {
      echo new JsonResponse(false, Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_PRODUCT_NOT_FOUND'));
      $app->close();
    }

    // Получаем старое значение для лога
    $oldValueLog = $model->getProductFieldValue($id, $fieldLog);

    // Обновляем поля
    foreach ($fields as $field => $value) {
      $product->$field = $value;
    }
    $product->date_modify = Factory::getDate()->toSql();

    if ($model->updateFieldProduct($product)) {
      $oldValue = $oldValueLog;
      $newValue = $newValueLog;

      if ($fieldLog == 'currency_id') {
        $oldValue = $model->getCurrencyName($oldValueLog);
        $newValue = $model->getCurrencyName($newValueLog);
      } elseif ($fieldLog == 'product_manufacturer_id') {
        $oldValue = $model->getManufacturerName($oldValueLog);
        $newValue = $model->getManufacturerName($newValueLog);
      } elseif ($fieldLog == 'label_id') {
        $oldValue = Helper::getNameImageLabel($oldValueLog, 2);
        $newValue = Helper::getNameImageLabel($newValueLog, 2);
      } elseif ($fieldLog == 'unlimited') {
        $oldValue = $oldValueLog ? Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_UNLIMITED_YES') : Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_UNLIMITED_NO');
        $newValue = $newValueLog ? Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_UNLIMITED_YES') : Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_UNLIMITED_NO');
      }

      $log = (object) [
        'product_id' => (int) $id,
        'old_value' => $oldValue,
        'new_value' => $newValue,
        'field' => $fieldLog,
        'info' => json_encode([
          'oneOperation' => 1,
          'old_value_id' => (int) $oldValueLog,
        ], JSON_UNESCAPED_UNICODE),
        'date_modify' => Factory::getDate()->toSql(),
      ];
      $model->addLogChange($log);
    }

    exit(json_encode([
      'success' => true,
      'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_SUCCESS'),
      'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_FAIL'),
    ]));
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

    $multiple = $product_id ? 'data-product_id="' . (int) $product_id . '" multiple="multiple' : '';

    $select = HTMLHelper::_(
      'select.genericlist',
      SelectOptions::getCategories(0, 1, 1),
      'category_id',
      'class="form-select" ' . $multiple,
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

    $oldCategoryIds = $model->getProductCategories($product_id);
    $oldCategoryNames = $model->getCategoryNames($oldCategoryIds);

    $model->updateCategorys($product_id, $category_ids);

    $newCategoryIds = $model->getProductCategories($product_id);
    $newCategoryNames = $model->getCategoryNames($newCategoryIds);

    $log = (object) [
      'product_id' => $product_id,
      'field' => 'category_id',
      'old_value' => implode(', ', $oldCategoryNames),
      'new_value' => implode(', ', $newCategoryNames),
      'info' => json_encode([
        'oneOperation' => 1,
        'old_value_id' => $oldCategoryIds,
      ], JSON_UNESCAPED_UNICODE),
      'date_modify' => Factory::getDate()->toSql()
    ];
    $model->addLogChange($log);

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
    $newValue = $data['value'] ?? '';
    $action_mode = $data['action_mode'] ?? '';

    if (!$type || $newValue === '') {
      echo json_encode([
        'success' => false,
        'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_INVALID_DATA')
      ]);
      $app->close();
    }

    $specialModes = ['all', 'all_published', 'all_not_published', 'all_filter'];
    $isSpecialMode = is_string($ids) && in_array($ids, $specialModes, true);

    $model = JSFactory::getModel("sofonaquickedit");

    $successCount = 0;

    if ($isSpecialMode) {
      $productIds = $this->getProductIdsFromRequest($ids);

      foreach ($productIds as $product_id) {
        $oldValue = $model->getProductFieldValue($product_id, $type);

        $mergedValue = $this->mergeValues($oldValue, $newValue, $action_mode);

        $product = (object) [
          'product_id' => (int) $product_id,
          'date_modify' => Factory::getDate()->toSql(),
          $type => $mergedValue
        ];

        if ($model->updateFieldProduct($product)) {
          $data = array(
            'product_id' => (int) $product_id,
            'oldValue' => $oldValue,
            'mergedValue' => $mergedValue,
            'type' => $type,
            'action_mode' => $action_mode,
            'newValue' => $newValue,
            'date_modify' => Factory::getDate()->toSql()
          );
          $this->logMassUpdate($data);
          $successCount++;
        }
      }
    } else {
      if (!is_array($ids) || count($ids) === 0) {
        echo json_encode([
          'success' => false,
          'message_err' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_NOT_SELECT_PRODUCT')
        ]);
        $app->close();
      }

      foreach ($ids as $product_id) {
        $oldValue = $model->getProductFieldValue($product_id, $type);

        $mergedValue = $this->mergeValues($oldValue, $newValue, $action_mode);

        $product = (object) [
          'product_id' => (int) $product_id,
          'date_modify' => Factory::getDate()->toSql(),
          $type => $mergedValue
        ];

        if ($model->updateFieldProduct($product)) {
          $data = array(
            'product_id' => (int) $product_id,
            'oldValue' => $oldValue,
            'mergedValue' => $mergedValue,
            'type' => $type,
            'action_mode' => $action_mode,
            'newValue' => $newValue,
            'date_modify' => Factory::getDate()->toSql()
          );
          $this->logMassUpdate($data);

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

  private function mergeValues($oldValue, $newValue, $mode)
  {
    switch ($mode) {
      case 'addStart':
        return trim($newValue . ' ' . $oldValue);
      case 'addEnd':
        return trim($oldValue . ' ' . $newValue);
      case 'replace':
      default:
        return $newValue;
    }
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

  public function settings()
  {

    $lang = Factory::getApplication()->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);
    $model = $this->getModel('sofonaquickedit');
    $settingsPlg = $model->getConfigsSettings();

    $view = $this->getView('sofonaquickedit', 'html');
    $view->setLayout('settings');
    $view->set('settingsPlg', $settingsPlg);
    $view->displaySettings();

  }

  public function saveSettings()
  {


    $lang = Factory::getApplication()->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    $post = $this->input->post->getArray();

    try {
      $model = $this->getModel('sofonaquickedit');

      if ($model->saveConfigsSettings($post)) {
        $msg = Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SETTINGS_SAVED');

        $this->setRedirect("index.php?option=com_jshopping&controller=sofonaquickedit&task=settings", $msg);

      } else {
        throw new \Exception(Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_FAIL'));
      }
    } catch (\Exception $e) {
      $this->setRedirect("index.php?option=com_jshopping&controller=sofonaquickedit&task=settings", $e->getMessage(), 'error');
    }
  }

  private function getProductIdsFromRequest($rawIds)
  {
    $model = JSFactory::getModel("sofonaquickedit");

    if (is_array($rawIds)) {
      return $rawIds;
    }

    switch ($rawIds) {
      case 'all':
        return $model->getAllProductIds('all');
      case 'all_published':
        return $model->getAllProductIdsByPublish('all_published');
      case 'all_not_published':
        return $model->getAllProductIdsByPublish('all_not_published');
      case 'all_filter':
        return $model->getAllProductIdsByfilter('all_filter');
      default:
        return [];
    }
  }

  public function restoreChange()
  {
    $app = Factory::getApplication();
    $app->allowCache(false);

    $lang = $app->getLanguage();
    $lang->load('plg_jshoppingadmin_sofonaquickedit', JPATH_ADMINISTRATOR);

    $id = $app->input->getInt('id');

    if (!$id) {
      echo json_encode(['success' => false, 'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPLOAD_FAIL')]);
      $app->close();
    }

    $model = JSFactory::getModel("sofonaquickedit");

    if ($model->restoreChange($id)) {
      echo json_encode(['success' => true, 'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_DATA_RESTORED')]);
    } else {
      echo json_encode(['success' => false, 'message' => Text::_('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH')]);
    }

    $app->close();
  }

  protected function logMassUpdate($data)
  {
    $model = JSFactory::getModel("sofonaquickedit");
    $oldValue = $data['oldValue'];
    $mergedValue = $data['mergedValue'];
    $newValue = $data['newValue'];

    if ($data['type'] == 'currency_id') {
      $oldValue = $model->getCurrencyName($data['oldValue']);
      $mergedValue = $model->getCurrencyName($data['mergedValue']);
      $newValue = $model->getCurrencyName($data['newValue']);
    }
    if ($data['type'] == 'product_manufacturer_id') {
      $oldValue = $model->getManufacturerName($data['oldValue']);
      $mergedValue = $model->getManufacturerName($data['mergedValue']);
      $newValue = $model->getManufacturerName($data['newValue']);
    }
    if ($data['type'] == 'label_id') {
      $oldValue = Helper::getNameImageLabel($data['oldValue'], 2);
      $mergedValue = Helper::getNameImageLabel($data['mergedValue'], 2);
      $newValue = Helper::getNameImageLabel($data['newValue'], 2);
    }

    $log = (object) [
      'product_id' => (int) $data['product_id'],
      'old_value' => $oldValue,
      'new_value' => $mergedValue,
      'field' => $data['type'],
      'info' => json_encode([
        'mass_operation' => 1,
        'operation' => $data['action_mode'],
        'value' => (string) $newValue,
        'old_value_id' => (int) $data['oldValue'],
        // 'percent' => $percent,
      ], JSON_UNESCAPED_UNICODE),
      'date_modify' => Factory::getDate()->toSql(),
    ];

    $model->addLogChange($log);

  }

  function backConfig()
  {
    $this->setRedirect("index.php?option=com_jshopping&controller=config");
  }

}