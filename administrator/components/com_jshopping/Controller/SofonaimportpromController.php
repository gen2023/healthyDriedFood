<?php

namespace Joomla\Component\Jshopping\Administrator\Controller;
// use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
// use Joomla\CMS\HTML\HTMLHelper;
// use Joomla\Component\Jshopping\Site\Helper\SelectOptions;
// use Joomla\CMS\Pagination\Pagination;
// use Joomla\CMS\Language\Text;
// use Joomla\CMS\Response\JsonResponse;
// use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Registry\Registry;
// use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\Database\DatabaseInterface;

require_once JPATH_ROOT . '/components/com_jshopping/Lib/phpoffice/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
// use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\CMS\Table\Table;

defined('_JEXEC') or die;


class SofonaimportpromController extends BaseadminController
{
  function display($cachable = false, $urlparams = false)
  {
    $view = $this->getView("sofona_import_prom", 'html');

    $view->display();
  }
  public function importProduct()
  {
    $plugin = PluginHelper::getPlugin('jshopping', 'import_prom');

    if (!$plugin) {
      throw new \RuntimeException('Плагин Jshopping Import Prom не найден');
    }

    $params = new Registry($plugin->params);

    $url = $params->get('link_prom_product');

    $xml = simplexml_load_file($url);
    $logFile = JPATH_ROOT . '/logs/prom_import.log';
    $now = date('Y-m-d H:i:s');

    if (!$xml || !isset($xml->shop->offers)) {
      echo 'Ошибка загрузки XML';
      file_put_contents($logFile, "[$now] Ошибка загрузки XML или отсутствуют offers\n", FILE_APPEND);
      return false;
    }

    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $countTotal = 0;
    $countUpdated = 0;
    $countAdded = 0;
    $charStats = [
      'created_fields' => 0,
      'used_fields' => 0,
      'created_values' => 0
    ];

    $imageStats = [
      'total' => 0,
      'downloaded' => 0,
      'skipped_download' => 0,
      'thumbs_created' => 0,
      'thumbs_skipped' => 0,
      'full_created' => 0,
      'full_skipped' => 0,
      'inserted' => 0,
      'exists_in_db' => 0,
    ];


    $countCategoriesAdded = 0;
    $countCategoriesUpdated = 0;

    if (isset($xml->shop->categories)) {
      $catStats = $this->importCategories($xml->shop->categories);
      if (is_array($catStats)) {
        [$countCategoriesAdded, $countCategoriesUpdated] = $catStats;
      }
    }
    // file_put_contents(JPATH_ROOT . '/logs/vendorcodes.log', '');
    foreach ($xml->shop->offers->offer as $offer) {

      $prom_id = (string) $offer['id'];


      $ean = (string) $offer->vendorCode;
      if (!$ean) {
        // file_put_contents(JPATH_ROOT . '/logs/vendorcodes.log', (string) $offer->vendorCode . ' пропущен' . "\n", FILE_APPEND);
        continue;
      }

      $countTotal++;

      $query = $db->getQuery(true)
        ->select('product_id')
        ->from('#__jshopping_products')
        ->where('product_ean = ' . $db->quote($ean));
      $db->setQuery($query);
      $productId = (int) $db->loadResult();

      $langs = [
        'ru-RU' => [
          'name' => $this->removeEmoji((string) $offer->name),
          'description' => $this->removeEmoji((string) $offer->description),
        ],
        'uk-UA' => [
          'name' => $this->removeEmoji((string) $offer->name_ua),
          'description' => $this->removeEmoji((string) $offer->description_ua),
        ],
      ];

      $allPictures = [];
      foreach ($offer->picture as $pic) {
        $urlPic = (string) $pic;
        if ($urlPic)
          $allPictures[] = $urlPic;
      }

      $mainImage = '';
      if (!empty($allPictures)) {
        $mainImage = basename($allPictures[0]);
      }

      $aliasRu = \JFilterOutput::stringURLSafe($langs['ru-RU']['name']);
      $aliasUk = \JFilterOutput::stringURLSafe($langs['uk-UA']['name']);
      $aliasEn = $aliasRu;

      $available = (int) $offer->quantity_in_stock;
      // var_dump($available);
      // $available = ((string) $offer['available'] === 'false') ? 0 : $offer->quantity_in_stock;
      // $unlimited = ((string) $offer['available'] === 'false') ? 0 : 1;


      $query = $db->getQuery(true)
        ->select($db->quoteName('category_id'))
        ->from($db->quoteName('#__jshopping_categories'))
        ->where($db->quoteName('id_cat_import_prom') . ' = ' . (int) $offer->categoryId);

      $db->setQuery($query);
      $CategoryId = (int) $db->loadResult();
      // $now = date('Y-m-d H:i:s');

      $product = [
        'product_ean' => $ean,
        'product_publish' => 1,
        'product_price' => (float) $offer->price,
        'product_quantity' => $available,
        'image' => $mainImage,
        'main_category_id' => $CategoryId,
        'min_price' => (float) $offer->price,
        'currency_id' => 2,
        'hits' => 0,
        'add_price_unit_id' => 3,
        'product_date_added' => $now,
        'date_modify' => $now,
        'unlimited' => 0,
        'prom_id' => $prom_id,

        'name_ru-RU' => $langs['ru-RU']['name'],
        'description_ru-RU' => $langs['ru-RU']['description'],
        'name_uk-UA' => $langs['uk-UA']['name'],
        'description_uk-UA' => $langs['uk-UA']['description'],
        'name_en-GB' => $langs['ru-RU']['name'],
        'description_en-GB' => '',

        'short_description_en-GB' => '',
        'meta_title_en-GB' => '',
        'meta_description_en-GB' => '',
        'meta_keyword_en-GB' => '',

        'short_description_ru-RU' => '',
        'meta_title_ru-RU' => '',
        'meta_description_ru-RU' => '',
        'meta_keyword_ru-RU' => (string) $offer->keywords,

        'short_description_uk-UA' => '',
        'meta_title_uk-UA' => '',
        'meta_description_uk-UA' => '',
        'meta_keyword_uk-UA' => (string) $offer->keywords_ua,

        'alias_ru-RU' => $aliasRu,
        'alias_uk-UA' => $aliasUk,
        'alias_en-GB' => $aliasEn,
      ];

      $productUpdate = [
        'product_ean' => $ean,
        // 'product_publish' => 1,
        'product_price' => (float) $offer->price,
        'product_quantity' => $available,
        'image' => $mainImage,
        'main_category_id' => $CategoryId,
        'min_price' => (float) $offer->price,
        'currency_id' => 2,
        // 'hits' => 0,
        'add_price_unit_id' => 3,
        // 'product_date_added' => $now,
        'date_modify' => $now,
        // 'unlimited' => $unlimited,
        'prom_id' => $prom_id,

        'name_ru-RU' => $langs['ru-RU']['name'],
        'description_ru-RU' => $langs['ru-RU']['description'],
        'name_uk-UA' => $langs['uk-UA']['name'],
        'description_uk-UA' => $langs['uk-UA']['description'],
        'name_en-GB' => $langs['ru-RU']['name'],
        // 'description_en-GB' => '',

        // 'short_description_en-GB' => '',
        // 'meta_title_en-GB' => '',
        // 'meta_description_en-GB' => '',
        // 'meta_keyword_en-GB' => '',

        // 'short_description_ru-RU' => '',
        // 'meta_title_ru-RU' => '',
        // 'meta_description_ru-RU' => '',
        'meta_keyword_ru-RU' => (string) $offer->keywords,

        // 'short_description_uk-UA' => '',
        // 'meta_title_uk-UA' => '',
        // 'meta_description_uk-UA' => '',
        'meta_keyword_uk-UA' => (string) $offer->keywords_ua,

        // 'alias_ru-RU' => $aliasRu,
        // 'alias_uk-UA' => $aliasUk,
        // 'alias_en-GB' => $aliasEn,
      ];

      if ($productId) {
        $productUpdate['product_id'] = $productId;
        $productUpdate1 = (object) $productUpdate;
        $db->updateObject('#__jshopping_products', $productUpdate1, 'product_id');
        $countUpdated++;
        file_put_contents(JPATH_ROOT . '/logs/vendorcodes.log', print_r($productUpdate1, true), FILE_APPEND);

      } else {
        $productObj = (object) $product;
        $db->insertObject('#__jshopping_products', $productObj, 'product_id');
        $productId = $productObj->product_id;
        $countAdded++;
        // file_put_contents(JPATH_ROOT . '/logs/vendorcodes.log', (string) $offer['id'] . ' =inserted ' . "\n", FILE_APPEND);

      }

      // Привязка товара к категории и родительской категории
      $externalCategoryId = (int) $CategoryId;

      if ($externalCategoryId > 0) {
        // Сначала удалим все старые связи
        $db->setQuery(
          $db->getQuery(true)
            ->delete($db->quoteName('#__jshopping_products_to_categories'))
            ->where($db->quoteName('product_id') . ' = ' . (int) $productId)
        );
        $db->execute();

        // Соберём все external category id: текущую и родительскую
        $externalCategoryIds = [$externalCategoryId];

        // Получим parent_id этой категории из XML
        $parentCategoryId = null;
        foreach ($xml->shop->categories->category as $cat) {
          if ((int) $cat['id'] === $externalCategoryId && isset($cat['parentId'])) {
            $parentCategoryId = (int) $cat['parentId'];
            break;
          }
        }

        if ($parentCategoryId) {
          $externalCategoryIds[] = $parentCategoryId;
        }

        // Привязка ко всем найденным категориям
        foreach ($externalCategoryIds as $extCatId) {
          // $query = $db->getQuery(true)
          //   ->select($db->quoteName('category_id'))
          //   ->from($db->quoteName('#__jshopping_category_custom_values'))
          //   ->where($db->quoteName('value') . ' = ' . (int) $extCatId);
          // $db->setQuery($query);
          // $localCategoryId = (int) $db->loadResult();

          // if ($localCategoryId > 0) {
          $insert = $db->getQuery(true)
            ->insert($db->quoteName('#__jshopping_products_to_categories'))
            ->columns(['product_id', 'category_id'])
            ->values((int) $productId . ', ' . (int) $extCatId);
          $db->setQuery($insert);
          $db->execute();
          // }
        }
      }

      // Характеристики
      foreach ($offer->param as $param) {
        $name = (string) $param['name'];
        $value = (string) $param;
        if ($name && $value) {
          // $this->addProductExtraField($productId, $name, $value);
          $result = $this->addProductExtraField($productId, $name, $value);
          if ($result['field_created'])
            $charStats['created_fields']++;
          if ($result['value_created'])
            $charStats['created_values']++;
          $charStats['used_fields']++;

        }
      }
      // Страна происхождения
      $country = (string) $offer->country_of_origin;
      if ($country) {
        $result = $this->addProductExtraField($productId, 'Cтрана происхождения', $country);
        if ($result['field_created'])
          $charStats['created_fields']++;
        if ($result['value_created'])
          $charStats['created_values']++;
        $charStats['used_fields']++;
      }

      // Изображения
      if (!empty($allPictures)) {
        $stats = $this->addProductImages($productId, $allPictures);
        foreach ($stats as $key => $value) {
          $imageStats[$key] += $value;
        }
      }

      // для примера лимит обработки
      // if ($countTotal > 25)
      //     break;
    }

    echo "Импорт завершён.<br>";
    echo "Статистика.<br>";

    echo "<br><b>Категории.</b><br>";
    echo "Категории добавлено: " . $countCategoriesAdded . "<br>";
    echo "Категории обновлено: " . $countCategoriesUpdated . "<br>";

    echo "<br><b>Товары.</b><br>";
    echo "Всего товаров обработано: " . $countTotal . "<br>";
    echo "Добавлено новых товаров: " . $countAdded . "<br>";
    echo "Обновлено существующих товаров: " . $countUpdated . "<br>";

    echo "<br><b>Характеристики:</b><br>";
    echo "Создано новых полей: " . $charStats['created_fields'] . "<br>";
    echo "Использовано всего полей: " . $charStats['used_fields'] . "<br>";
    echo "Создано новых значений: " . $charStats['created_values'] . "<br>";

    echo "<br><b>Изображения:</b><br>";
    echo "Всего изображений: {$imageStats['total']}<br>";
    echo "Скачано: {$imageStats['downloaded']}<br>";
    echo "Пропущено при скачивании: {$imageStats['skipped_download']}<br>";
    echo "Создано миниатюр: {$imageStats['thumbs_created']}<br>";
    echo "Миниатюр уже было: {$imageStats['thumbs_skipped']}<br>";
    echo "Создано полных: {$imageStats['full_created']}<br>";
    echo "Полных уже было: {$imageStats['full_skipped']}<br>";
    echo "Добавлено в БД: {$imageStats['inserted']}<br>";
    echo "Уже были в БД: {$imageStats['exists_in_db']}<br>";

    $logText = "[$now] Импорт завершён.\n";
    $logText .= "Статистика:\n\n";

    $logText .= "Категории:\n";
    $logText .= "- Добавлено: $countCategoriesAdded\n";
    $logText .= "- Обновлено: $countCategoriesUpdated\n\n";

    $logText .= "Товары:\n";
    $logText .= "- Всего обработано: $countTotal\n";
    $logText .= "- Добавлено: $countAdded\n";
    $logText .= "- Обновлено: $countUpdated\n\n";

    $logText .= "Характеристики:\n";
    $logText .= "- Новые поля: " . $charStats['created_fields'] . "\n";
    $logText .= "- Использовано всего: " . $charStats['used_fields'] . "\n";
    $logText .= "- Новые значения: " . $charStats['created_values'] . "\n\n";

    $logText .= "Изображения:\n";
    $logText .= "- Всего: {$imageStats['total']}\n";
    $logText .= "- Скачано: {$imageStats['downloaded']}\n";
    $logText .= "- Пропущено при скачивании: {$imageStats['skipped_download']}\n";
    $logText .= "- Миниатюр создано: {$imageStats['thumbs_created']}\n";
    $logText .= "- Миниатюр уже было: {$imageStats['thumbs_skipped']}\n";
    $logText .= "- Полных создано: {$imageStats['full_created']}\n";
    $logText .= "- Полных уже было: {$imageStats['full_skipped']}\n";
    $logText .= "- Добавлено в БД: {$imageStats['inserted']}\n";
    $logText .= "- Уже были в БД: {$imageStats['exists_in_db']}\n";
    $logText .= "--------------------------------------------\n";

    file_put_contents($logFile, $logText, FILE_APPEND);


    return true;
  }

  public function importOrder()
  {
    $plugin = PluginHelper::getPlugin('jshopping', 'import_prom');
    $ordersModel = JSFactory::getModel('orders');
    $importModel = JSFactory::getModel('sofonaimportprom');

    if (!$plugin) {
      throw new \RuntimeException('Плагин Jshopping Import Prom не найден');
    }

    $params = new Registry($plugin->params);
    $url = $params->get('link_prom_order');

    // Загружаем XML
    $xmlContent = @file_get_contents($url);
    if (!$xmlContent) {
      throw new \RuntimeException('Не удалось загрузить XML по ссылке: ' . $url);
    }

    $xml = simplexml_load_string($xmlContent);
    if (!$xml) {
      throw new \RuntimeException('Ошибка парсинга XML');
    }

    // Справочники (как в importOrderFile)
    $statusMap = [
      'closed' => 7,
      'canceled' => 3,
      'new' => 1,
    ];

    $shippingMethods = [
      'Нова Пошта' => 1,
      'Укрпошта' => 2,
      'Самовывоз' => 3,
      'Магазины Rozetka' => 4,
    ];

    $paymentMethods = [
      'Наложенный платеж' => 1,
      'Пром-оплата' => 2,
    ];

    // Перебор заказов
    foreach ($xml->order as $orderNode) {
      $orderPromId = (int) $orderNode['id'];
      $fio = (string) $orderNode->name;
      $phone = (string) $orderNode->phone;
      $email = (string) $orderNode->email;
      $address = (string) $orderNode->address;
      $shippingName = (string) $orderNode->deliveryType;
      $paymentName = (string) $orderNode->paymentType;
      $statusProm = (string) $orderNode['state'];
      $dateRaw = (string) $orderNode->date;
      $orderSum = (float) $orderNode->priceUAH;

      // Конвертация даты
      $dateObj = \DateTime::createFromFormat('d.m.y H:i', $dateRaw);
      $formattedDate = $dateObj ? $dateObj->format('Y-m-d H:i:s') : date('Y-m-d H:i:s');

      // Формируем заказ
      $order = [
        'id_order_prom' => $orderPromId,
        'f_name' => $fio,
        'd_f_name' => $fio,
        'phone' => $phone,
        'd_phone' => $phone,
        'email' => $email,
        'd_email' => $email,
        'shipping_params' => $address,
        'street' => $address,
        'd_street' => $address,
        'shipping_method_id' => $shippingMethods[$shippingName] ?? 0,
        'payment_method_id' => $paymentMethods[$paymentName] ?? 0,
        'order_status' => $statusMap[$statusProm] ?? 1,
        'order_date' => $formattedDate,
        'order_m_date' => $formattedDate,
        'order_total' => 0,
        'order_subtotal' => 0,
        'country' => 220,
        'd_country' => 220,
        'currency_code' => 'грн.',
        'currency_code_iso' => 'UAH',
        'currency_exchange' => 1,
        'order_created' => 1,
        'products' => [],
      ];

      // Товары
      foreach ($orderNode->items->item as $itemNode) {
        $promId = (int) $itemNode['id']; // вот он prom_id в таблице продуктов
        $productName = (string) $itemNode->name;
        $productQty = (float) $itemNode->quantity;
        $productPrice = (float) $itemNode->price;

        // Ищем продукт по prom_id
        $product = $importModel->getProductByPromId($promId);
        $this->log("Данные товара по prom_id: {$promId}", $product);

        $productId = $product->product_id ?? 0;
        $categoryId = $product->category_id ?? 0;
        $manufacturerCode = $product->manufacturer_code ?? '';
        $weight = $product->weight ?? 0;

        $productData = [
          'product_id' => $productId,
          'category_id' => $categoryId,
          'product_ean' => $product->product_ean ?? '',
          'manufacturer_code' => $manufacturerCode,
          'product_name' => $productName,
          'product_quantity' => $productQty,
          'product_item_price' => $productPrice,
          'weight' => $weight,
        ];

        $order['products'][] = $productData;
        $order['order_total'] += $productData['product_item_price'] * $productQty;
        $order['order_subtotal'] += $productData['product_item_price'] * $productQty;
      }

      // Перегоняем products в формат saveOrderItem()
      $productIds = [];
      $categoryIds = [];
      $productEans = [];
      $productNames = [];
      $productQuantities = [];
      $productPrices = [];
      $weights = [];

      foreach ($order['products'] as $p) {
        $productIds[] = $p['product_id'];
        $categoryIds[] = $p['category_id'];
        $productEans[] = $p['product_ean'];
        $productNames[] = $p['product_name'];
        $productQuantities[] = $p['product_quantity'];
        $productPrices[] = $p['product_item_price'];
        $weights[] = $p['weight'];
      }

      $order['product_id'] = $productIds;
      $order['category_id'] = $categoryIds;
      $order['product_ean'] = $productEans;
      $order['product_name'] = $productNames;
      $order['product_quantity'] = $productQuantities;
      $order['product_item_price'] = $productPrices;
      $order['weight'] = $weights;

      unset($order['products']);

      // Сохраняем заказ
// Проверяем, существует ли заказ с таким id_order_prom
      $existsOrderId = $importModel->getOrderProm($orderPromId);
      if ($existsOrderId) {
        $this->log("Заказ Prom ID: {$orderPromId} уже существует в системе (order_id: {$existsOrderId}), пропускаем.");
        continue;
      }

      // Сохраняем заказ
      $savedOrder = $ordersModel->save($order);
      if (!$savedOrder) {
        $this->log("Ошибка при сохранении заказа Prom ID: {$orderPromId}", $order);
        continue;
      }

      $this->log("Заказ Prom ID: {$orderPromId} сохранен с ID: {$savedOrder->order_id}");

    }
  }

  public function importOrderFile()
  {
    $plugin = PluginHelper::getPlugin('jshopping', 'import_prom');
    $ordersModel = JSFactory::getModel('orders');
    $importModel = JSFactory::getModel('sofonaimportprom');

    if (!$plugin) {
      throw new \RuntimeException('Плагин Jshopping Import Prom не найден');
    }

    $params = new Registry($plugin->params);
    $filePath = JPATH_ROOT . $params->get('link_prom_order_file');

    if (!file_exists($filePath)) {
      throw new \RuntimeException('Файл не найден: ' . $filePath);
    }

    $spreadsheet = IOFactory::load($filePath);
    $worksheet = $spreadsheet->getActiveSheet();
    $rows = $worksheet->toArray();

    $statusMap = [
      'Виконано' => 7,
      'Скасовано' => 3,
    ];

    $shippingMethods = [
      'Нова Пошта' => 1,
      'Укрпошта' => 2,
      'Самовывоз' => 3,
      'Магазины Rozetka' => 4,
    ];

    $paymentMethods = [
      'Наложенный платеж' => 1,
      'Пром-оплата' => 2,
    ];

    // Собираем заказы по orderPromId
    $ordersData = [];
    foreach ($rows as $i => $row) {
      if ($i === 0)
        continue; // пропускаем заголовок

      $orderPromId = (int) $row[0];
      $date = $row[1];
      $fio = $row[2];
      $phone = $row[4];
      $email = $row[5];
      $address = $row[6];
      $shippingName = $row[7];
      $paymentName = $row[8];
      $statusProm = $row[9];
      $cancelReasonProm = trim($row[10]);
      $productSku = $row[12];
      $productName = $row[13];
      $productQty = (float) $row[14];
      $orderSumRaw = $row[20] ?? '0';
      $orderSum = (float) str_replace(',', '.', $orderSumRaw);

      // Конвертация даты
      $dateObj = \DateTime::createFromFormat('d.m.y H:i', $date);
      $formattedDate = $dateObj ? $dateObj->format('Y-m-d H:i:s') : date('Y-m-d H:i:s');

      if (!isset($ordersData[$orderPromId])) {
        $ordersData[$orderPromId] = [
          'id_order_prom' => $orderPromId,
          'f_name' => $fio,
          'd_f_name' => $fio,
          'phone' => $phone,
          'd_phone' => $phone,
          'email' => $email,
          'd_email' => $email,
          'shipping_params' => $address,
          'street' => $address,
          'd_street' => $address,
          'shipping_method_id' => $shippingMethods[$shippingName] ?? 0,
          'payment_method_id' => $paymentMethods[$paymentName] ?? 0,
          'order_status' => $statusMap[$statusProm] ?? 1,
          'order_add_info' => $cancelReasonProm,
          'order_date' => $formattedDate,
          'order_m_date' => $formattedDate,
          'order_total' => 0, // сумма посчитаем ниже
          'order_subtotal' => 0,
          'country' => 220,
          'd_country' => 220,
          'currency_code' => 'грн.',
          'currency_code_iso' => 'UAH',
          'currency_exchange' => 1,
          'order_created' => 1,
          'products' => [],
        ];
      }

      // Получаем товар из базы по артикулу
      $product = $importModel->getProductByProductEan($productSku);
      $this->log("данные товара по артикулу: {$productSku}", $product);

      $productId = $product->product_id ?? 0;
      $categoryId = $product->category_id ?? 0;
      $manufacturerCode = $product->manufacturer_code ?? '';
      $weight = $product->weight ?? 0;
      // $extraFields = $product ? $product->getExtraFields(2) : [];

      // Формируем массив товара
      $productData = [
        'product_id' => $productId,
        'category_id' => $categoryId,
        'product_ean' => $productSku,
        'manufacturer_code' => $manufacturerCode,
        'product_name' => $productName,
        'product_quantity' => $productQty,
        'product_item_price' => $productQty > 0 ? $orderSum / $productQty : $orderSum,
        'weight' => $weight,
        // 'extra_fields'      => $extraFields,
      ];

      $ordersData[$orderPromId]['products'][] = $productData;
      $ordersData[$orderPromId]['order_total'] += $productData['product_item_price'] * $productQty;
      $ordersData[$orderPromId]['order_subtotal'] += $productData['product_item_price'] * $productQty;
    }

    // Сохраняем заказы
    foreach ($ordersData as $orderPromId => $order) {

      // Перегоняем products в формат для saveOrderItem()
      $productIds = [];
      $categoryIds = [];
      $productEans = [];
      $productNames = [];
      $productQuantities = [];
      $productPrices = [];
      $weights = [];

      foreach ($order['products'] as $p) {
        $productIds[] = $p['product_id'];
        $categoryIds[] = $p['category_id'];
        $productEans[] = $p['product_ean'];
        $productNames[] = $p['product_name'];
        $productQuantities[] = $p['product_quantity'];
        $productPrices[] = $p['product_item_price'];
        $weights[] = $p['weight'];
      }

      $order['product_id'] = $productIds;
      $order['category_id'] = $categoryIds;
      $order['product_ean'] = $productEans;
      $order['product_name'] = $productNames;
      $order['product_quantity'] = $productQuantities;
      $order['product_item_price'] = $productPrices;
      $order['weight'] = $weights;

      // И убираем products, чтобы не мешался
      unset($order['products']);

      // Проверяем, существует ли заказ с таким id_order_prom
      $existsOrderId = $importModel->getOrderProm($orderPromId);
      if ($existsOrderId) {
        $this->log("Заказ Prom ID: {$orderPromId} уже существует в системе (order_id: {$existsOrderId}), пропускаем.");
        continue;
      }

      $savedOrder = $ordersModel->save($order);
      if (!$savedOrder) {
        $this->log("Ошибка при сохранении заказа Prom ID: {$orderPromId}", $order);
        continue;
      }
      $this->log("Заказ Prom ID: {$orderPromId} сохранен с ID: {$savedOrder->order_id}");

    }
  }

  protected function log($message, $data = null)
  {
    $logFile = JPATH_ROOT . '/logs/sofona_import.log';
    $entry = "[" . date('Y-m-d H:i:s') . "] " . $message;
    if ($data) {
      $entry .= ' | ' . print_r($data, true);
    }
    file_put_contents($logFile, $entry . PHP_EOL, FILE_APPEND);
  }



  protected function addProductExtraField($productId, $fieldName, $value)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $fieldCreated = false;
    $valueCreated = false;

    // Шаг 1: Найти или создать характеристику
    $query = $db->getQuery(true)
      ->select('id')
      ->from('#__jshopping_products_extra_fields')
      ->where($db->quoteName('name_ru-RU') . ' = ' . $db->quote($fieldName));
    $db->setQuery($query);
    $fieldId = (int) $db->loadResult();

    $type = 2;
    $multilist = 0;

    if (!$fieldId) {
      $fieldCreated = true;
      $field = new \stdClass();
      $field->{'name_ru-RU'} = $fieldName;
      $field->{'name_uk-UA'} = $fieldName;
      $field->{'name_en-GB'} = '';
      $field->{'description_ru-RU'} = '';
      $field->{'description_uk-UA'} = '';
      $field->{'description_en-GB'} = '';
      $field->type = 2;
      $field->published = 1;
      $field->required = 0;
      $field->filter = 0;
      $field->allcats = 1;
      $field->multilist = 0;


      if ($fieldName == 'Тип волос' || $fieldName == 'Тип питания') {
        $field->type = 0;
        $type = 0;
        $field->multilist = 1;
        $multilist = 1;

      } elseif (in_array($value, ['Да', 'Нет', 'Есть']) || in_array($fieldName, ['Состояние', 'Питание', 'Сезон', 'Пол', 'Тип разъема', 'Наличие видеокамеры', 'Размер', 'Цвет'])) {
        $field->type = 0;
        $type = 0;
      }

      $db->insertObject('#__jshopping_products_extra_fields', $field, 'id');
      $fieldId = $db->insertid();
    }

    $column = 'extra_field_' . $fieldId;

    // Проверяем наличие колонки
    $query = $db->getQuery(true)
      ->select('COUNT(*)')
      ->from('INFORMATION_SCHEMA.COLUMNS')
      ->where('TABLE_NAME = ' . $db->quote($db->replacePrefix('#__jshopping_products_to_extra_fields')))
      ->where('COLUMN_NAME = ' . $db->quote($column));
    $db->setQuery($query);
    $columnExists = (bool) $db->loadResult();

    if (!$columnExists) {
      $alterQuery = ($multilist == 1)
        ? "ALTER TABLE `#__jshopping_products_to_extra_fields` ADD COLUMN `$column` VARCHAR(255) NOT NULL DEFAULT ''"
        : "ALTER TABLE `#__jshopping_products_to_extra_fields` ADD COLUMN `$column` INT NOT NULL DEFAULT 0";
      $db->setQuery($alterQuery)->execute();
    }

    // Получаем список всех колонок extra_field_*
    $query = $db->getQuery(true)
      ->select('COLUMN_NAME')
      ->from('INFORMATION_SCHEMA.COLUMNS')
      ->where('TABLE_NAME = ' . $db->quote($db->replacePrefix('#__jshopping_products_to_extra_fields')))
      ->where('COLUMN_NAME LIKE ' . $db->quote('extra_field_%'));
    $db->setQuery($query);
    $extraColumns = $db->loadColumn();

    // Подготовка значения
    $valueIds = [];

    foreach (explode('|', $value) as $singleValue) {
      $singleValue = trim($singleValue);

      if (!$singleValue)
        continue;

      // Проверка существования значения
      $query = $db->getQuery(true)
        ->select('id')
        ->from('#__jshopping_products_extra_field_values')
        ->where('field_id = ' . (int) $fieldId)
        ->where($db->quoteName('name_ru-RU') . ' = ' . $db->quote($singleValue));
      $db->setQuery($query);
      $valueId = (int) $db->loadResult();

      if (!$valueId) {
        $valueCreated = true;
        $valueObj = new \stdClass();
        $valueObj->field_id = $fieldId;
        $valueObj->ordering = 0;
        $valueObj->{'name_ru-RU'} = $singleValue;
        $valueObj->{'name_uk-UA'} = $singleValue;
        $valueObj->{'name_en-GB'} = '';

        $db->insertObject('#__jshopping_products_extra_field_values', $valueObj, 'id');
        $valueId = $db->insertid();
      }

      $valueIds[] = $valueId;

    }

    // Получаем строку для записи
    $finalValue = ($multilist == 1) ? implode(',', $valueIds) : (int) ($valueIds[0] ?? 0);

    // Проверка: есть ли уже строка для товара
    $query = $db->getQuery(true)
      ->select('*')
      ->from('#__jshopping_products_to_extra_fields')
      ->where('product_id = ' . (int) $productId);
    $db->setQuery($query);
    $row = $db->loadObject();

    if ($row) {
      // Обновляем
      $query = $db->getQuery(true)
        ->update('#__jshopping_products_to_extra_fields')
        ->set($db->quoteName($column) . ' = ' . $db->quote($finalValue))
        ->where('product_id = ' . (int) $productId);
      $db->setQuery($query)->execute();
    } else {
      // Вставляем
      $obj = new \stdClass();
      $obj->product_id = $productId;
      foreach ($extraColumns as $col) {
        $obj->$col = '';
      }
      $obj->$column = $finalValue;
      $db->insertObject('#__jshopping_products_to_extra_fields', $obj);
    }
    return [
      'field_created' => $fieldCreated,
      'value_created' => $valueCreated
    ];
  }

  protected function addProductImages($productId, array $images): array
  {
    $imagesPath = JPATH_ROOT . '/components/com_jshopping/files/img_products/';
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $stats = [
      'total' => count($images),
      'downloaded' => 0,
      'skipped_download' => 0,
      'full_created' => 0,
      'full_skipped' => 0,
      'thumbs_created' => 0,
      'thumbs_skipped' => 0,
      'inserted' => 0,
      'exists_in_db' => 0,
    ];

    foreach ($images as $url) {
      $url = trim((string) $url);
      if ($url === '') {
        continue;
      }

      $name = basename($url);
      $destPath = $imagesPath . $name;
      $thumbName = 'thumb_' . $name;
      $thumbPath = $imagesPath . $thumbName;
      $fullName = 'full_' . $name;
      $fullPath = $imagesPath . $fullName;

      // Скачать изображение, если не существует
      if (!file_exists($destPath)) {
        if ($this->downloadImage($url, $destPath)) {
          $stats['downloaded']++;
        }
      }

      // Создать копию оригинального изображения как full_
      if (!file_exists($fullPath)) {
        if (@copy($destPath, $fullPath)) {
          $stats['full_created']++;
        }
      } else {
        $stats['full_skipped']++;
      }

      // Создать миниатюру
      if (!file_exists($thumbPath)) {
        if ($this->resizeImage($destPath, $thumbPath, 300, 300)) {
          $stats['thumbs_created']++;
        }
      } else {
        $stats['thumbs_skipped']++;
      }

      // Проверить наличие изображения в базе
      $query = $db->getQuery(true)
        ->select($db->quoteName('image_name'))
        ->from($db->quoteName('#__jshopping_products_images'))
        ->where($db->quoteName('product_id') . ' = ' . (int) $productId)
        ->where($db->quoteName('image_name') . ' = ' . $db->quote($name));
      $db->setQuery($query);

      if (!$db->loadResult()) {
        $image = (object) [
          'product_id' => $productId,
          'image_name' => $name,
        ];
        if ($db->insertObject('#__jshopping_products_images', $image)) {
          $stats['inserted']++;
        }
      } else {
        $stats['exists_in_db']++;
      }
    }

    return $stats;
  }

  protected function resizeImage(string $sourcePath, string $destPath, int $width, int $height): bool
  {
    if (!is_file($sourcePath)) {
      return false;
    }

    $imageInfo = @getimagesize($sourcePath);
    if (!$imageInfo) {
      return false;
    }

    [$origWidth, $origHeight, $type] = $imageInfo;

    // Обработка только JPEG
    if ($type === IMAGETYPE_JPEG) {
      $image = @imagecreatefromjpeg($sourcePath);
      if (!$image) {
        return false;
      }

      $thumb = imagecreatetruecolor($width, $height);
      imagecopyresampled($thumb, $image, 0, 0, 0, 0, $width, $height, $origWidth, $origHeight);
      $result = imagejpeg($thumb, $destPath, 90);

      imagedestroy($image);
      imagedestroy($thumb);

      return $result;
    }

    // Если тип другой — просто копируем файл как "thumb_имя"
    return copy($sourcePath, $destPath);
  }
  protected function importCategories($categoriesXml)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $countAdded = 0;
    $countUpdated = 0;
    $categoryMap = []; // externalId => internalId

    // Шаг 1: создаём/обновляем все категории без учета parentId
    foreach ($categoriesXml->category as $category) {
      $externalId = (int) $category['id'];
      $name = (string) $category;

      $aliasRu = \JFilterOutput::stringURLSafe($name);
      $aliasEn = \JFilterOutput::stringURLSafe($name);
      $aliasUa = \JFilterOutput::stringURLSafe($name);

      // Поиск по id prom ua
      $query = $db->getQuery(true)
        ->select($db->quoteName('id_cat_import_prom'))
        ->from($db->quoteName('#__jshopping_categories'))
        ->where($db->quoteName('id_cat_import_prom') . ' = ' . $db->quote($externalId));
      $db->setQuery($query);
      $categoryId = (int) $db->loadResult();

      $categoryData = (object) [
        'name_ru-RU' => $name,
        'name_uk-UA' => $name,
        'name_en-GB' => $name,
        'alias_ru-RU' => $aliasRu,
        'alias_uk-UA' => $aliasEn,
        'alias_en-GB' => $aliasUa,
        'category_publish' => 1,

        'short_description_en-GB' => '',
        'description_en-GB' => '',
        'meta_title_en-GB' => '',
        'meta_description_en-GB' => '',
        'meta_keyword_en-GB' => '',

        'short_description_uk-UA' => '',
        'description_uk-UA' => '',
        'meta_title_ru-RU' => '',
        'meta_description_ru-RU' => '',
        'meta_keyword_ru-RU' => '',

        'short_description_ru-RU' => '',
        'description_ru-RU' => '',
        'meta_title_uk-UA' => '',
        'meta_description_uk-UA' => '',
        'meta_keyword_uk-UA' => '',
        'id_cat_import_prom' => $externalId,
      ];

      $categoryDataUpdate = (object) [
        'name_ru-RU' => $name,
        'id_cat_import_prom' => $externalId,
        // 'name_uk-UA' => $name,
        // 'name_en-GB' => $name,
        // 'alias_ru-RU' => $aliasRu,
        // 'alias_uk-UA' => $aliasEn,
        // 'alias_en-GB' => $aliasUa,
        // 'category_publish' => 1,

        // 'short_description_en-GB' => '',
        // 'description_en-GB' => '',
        // 'meta_title_en-GB' => '',
        // 'meta_description_en-GB' => '',
        // 'meta_keyword_en-GB' => '',

        // 'short_description_uk-UA' => '',
        // 'description_uk-UA' => '',
        // 'meta_title_ru-RU' => '',
        // 'meta_description_ru-RU' => '',
        // 'meta_keyword_ru-RU' => '',

        // 'short_description_ru-RU' => '',
        // 'description_ru-RU' => '',
        // 'meta_title_uk-UA' => '',
        // 'meta_description_uk-UA' => '',
        // 'meta_keyword_uk-UA' => '',
      ];

      if ($categoryId) {
        $categoryDataUpdate->category_id = $categoryId;
        $db->updateObject('#__jshopping_categories', $categoryDataUpdate, 'category_id');
        $countUpdated++;
      } else {
        $db->insertObject('#__jshopping_categories', $categoryData, 'category_id');
        $categoryId = $categoryData->category_id;
        $countAdded++;
      }

      // Привязка и карта соответствий
      // $this->bindCategory($categoryId, $externalId);
      $categoryMap[$externalId] = $categoryId;
    }

    // Шаг 2: обновляем parentId, теперь у нас есть все category_id
    foreach ($categoriesXml->category as $category) {
      $externalId = (int) $category['id'];
      $externalParentId = (int) $category['parentId'];
      $categoryId = $categoryMap[$externalId] ?? 0;
      $parentId = $externalParentId > 0 && isset($categoryMap[$externalParentId])
        ? $categoryMap[$externalParentId]
        : 0;

      $query = $db->getQuery(true)
        ->update($db->quoteName('#__jshopping_categories'))
        ->set($db->quoteName('category_parent_id') . ' = ' . (int) $parentId)
        ->where($db->quoteName('category_id') . ' = ' . (int) $categoryId);
      $db->setQuery($query);
      $db->execute();
    }

    return [$countAdded, $countUpdated];
  }

  // protected function bindCategory(int $categoryId, int $externalCategoryId)
  // {
  //   $db = Factory::getContainer()->get(DatabaseInterface::class);

  //   // Смотрим есть ли уже запись для этой категории и типа экспорта
  //   $query = $db->getQuery(true)
  //     ->select('id')
  //     ->from('#__jshopping_category_custom_values')
  //     ->where('category_id = ' . (int) $categoryId);
  //   $db->setQuery($query);
  //   $bindingId = (int) $db->loadResult();

  //   if ($bindingId) {
  //     // Обновляем существующую
  //     $query = $db->getQuery(true)
  //       ->update('#__jshopping_category_custom_values')
  //       ->set('value = ' . (int) $externalCategoryId)
  //       ->where('category_id = ' . $bindingId);
  //     $db->setQuery($query);
  //     $db->execute();
  //   } else {
  //     // Вставляем новую
  //     $columns = ['field_id', 'category_id', 'value'];
  //     $values = [1, (int) $categoryId, (int) $externalCategoryId,];

  //     $query = $db->getQuery(true)
  //       ->insert('#__jshopping_category_custom_values')
  //       ->columns($db->quoteName($columns))
  //       ->values(implode(',', $values));
  //     $db->setQuery($query);
  //     $db->execute();
  //   }
  // }


  protected function downloadImage(string $url, string $destPath): bool
  {
    $ch = curl_init($url);
    $fp = fopen($destPath, 'wb');

    curl_setopt_array($ch, [
      CURLOPT_FILE => $fp,
      CURLOPT_TIMEOUT => 20,           // максимум 20 сек на загрузку
      CURLOPT_CONNECTTIMEOUT => 5,     // максимум 5 сек на соединение
      CURLOPT_FOLLOWLOCATION => true,  // следовать редиректам
      CURLOPT_FAILONERROR => true      // возвращать false при 404/500
    ]);

    $success = curl_exec($ch);

    curl_close($ch);
    fclose($fp);

    if (!$success) {
      unlink($destPath); // удалим пустой файл, если загрузка не удалась
    }


    return $success;
  }

  protected function removeEmoji($text)
  {
    return preg_replace('/[\x{1F600}-\x{1F64F}' . // эмодзи смайлы
      '\x{1F300}-\x{1F5FF}' . // символы и пиктограммы
      '\x{1F680}-\x{1F6FF}' . // транспорт и карты
      '\x{2600}-\x{26FF}' .   // разнообразные символы
      '\x{2700}-\x{27BF}]++/u', '', $text);
  }
}


