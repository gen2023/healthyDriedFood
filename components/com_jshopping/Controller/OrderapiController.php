<?php

namespace Joomla\Component\Jshopping\Site\Controller;


use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Router\Route;
// https://api-seller.rozetka.com.ua/apidoc/#api-Orders-GetOrderDetails

class OrderapiController extends BaseController
{
  private string $rozetkaLogin = 'genodessa@gmail.com';
  private string $rozetkaPass = '26028713Ee';
  private string $rozetkaToken = 'gapi_mYldf_vvmXKznro9KASdyQTMm19hbstn';

  private string $apiBase = 'https://api-seller.rozetka.com.ua';

  public function display($cachable = false, $urlparams = false)
  {
    $resultMau = $this->checkMaudauOrders();
    $resultRozetka = $this->checkRozetkaOrders();
    echo 'maudau - ';
    var_dump($resultMau);
    echo '<br /> rozetka - ';

    var_dump($resultRozetka);
    // die('1111111111111111');
  }

  protected function checkMaudauOrders()
  {
    $importModel = JSFactory::getModel('sofonaimportprom');

    $orders = $this->maudauApi();
    // echo '<pre>';var_dump($orders);

    if (empty($orders) || !is_array($orders)) {
      return;
    }
    $countCreate = 0;
    $countUpdate = 0;
    $countCanseled = 0;
    $createdIds = [];
    $updatedIds = [];
    $skippedIds = [];

    foreach ($orders as $order) {
      $products = [];
      $productsText = '';

      foreach ($order['parcels'] as $parcel) {

        foreach ($parcel['items'] as $item) {

          $products[] = [
            'product_id' => $item['product']['external_id'] ?? 0,
            'name' => $item['product']['title_uk'] ?? '',
            'quantity' => (int) $item['quantity'],
            'price' => $item['price'] / 100,
          ];

          $productsText .= "• {$item['product']['title_uk']} — {$item['quantity']} шт. x " . ($item['price'] / 100) . " грн\n";
        }
      }

      switch ($order['status']) {
        case 'new_order'://новый
          $status = 12;
          break;
        case 'completed': //завершен
          $status = 13;
          break;
        case 'canceled': //отменен
          $status = 14;
          break;
        default:
          $status = 0;
          break;
      }

      switch ($order['delivery_type']['delivery_provider']) {
        case 'nova_poshta':
          $shippingMethods = 4;
          break;

        default:
          $shippingMethods = 7;

          break;
      }

      switch ($order['payment_method']['type']) {
        case 'cash_on_delivery':
          $paymentMethods = 2;
          break;

        default:
          $paymentMethods = 4;

          break;
      }

      $orderData = [
        'external_id' => $order['id'],
        'status' => $status,
        'created_at' => date('Y-m-d H:i:s', strtotime($order['created_at'])),
        'customer' => [
          'first_name' => $order['customer']['first_name'] ?? '',
          'last_name' => $order['customer']['last_name'] ?? '',
          'phone' => $order['customer']['phone'] ?? '',
          'email' => $order['customer']['email'],
        ],
        'delivery' => [
          'address' => $order['delivery_address']['warehouse']['address'] ?? '',
        ],
        'products' => $products,
        'total' => $order['total_price'] / 100,
        'shipping_method_id' => $shippingMethods ?? 0,
        'payment_method_id' => $paymentMethods ?? 0,

      ];

      $firstName = $orderData['customer']['first_name'];
      $lastName = $orderData['customer']['last_name'];
      $phone = $orderData['customer']['phone'];
      $amount = $orderData['total'];

      $message =
        "<b>Нове замовлення з MAUDAU</b>\n" .
        "ID: {$order['id']}\n\n" .
        "<b>Товари:</b>\n{$productsText}\n" .
        "Клієнт: {$firstName} {$lastName}\n" .
        "Телефон: {$phone}\n\n" .
        "<b>Сума:</b> {$amount} грн";

      $orderInfo = $importModel->getOrderInfoByAgregatorId($order['id'], 'id_order_maudau');
      // die($status);

      if ($status == 0) {
        $countCanseled += 1;
        $skippedIds[] = $order['id'];

        continue;
      }

      if ($order['status'] == 'new_order' || $orderInfo == null) {

        // $this->sendTelegram('MAUDAU', $message);

        $this->creadteOrder($orderData, 'id_order_maudau');
        $countCreate += 1;
        $createdIds[] = $order['id'];
      } else {

        if ($status !== $orderInfo->order_status) {
          $this->updateOrder($orderInfo, $status);

          $countUpdate += 1;
          $updatedIds[] = $order['id'];
        } else {
          // $this->creadteOrder($orderData, 'id_order_maudau',$orderInfo->order_id);

          $countCanseled += 1;
          $skippedIds[] = $order['id'];
        }

      }

    }

    $message =
      'Создано: ' . $countCreate .
      ' | Обновлено: ' . $countUpdate .
      ' | Пропущено: ' . $countCanseled . PHP_EOL .
      'Созданные ID: ' . implode(', ', $createdIds) . PHP_EOL .
      'Обновленные ID: ' . implode(', ', $updatedIds) . PHP_EOL .
      'Пропущенные ID: ' . implode(', ', $skippedIds);

    $this->log('maudau_order', $message);
    $this->log('maudau_order_item', $order);

    return $message;

  }

  private function maudauApi()
  {
    $baseUrl = 'https://backend.prod.maudau.click/v1/merchant_public_api';

    $authData = [
      'username' => 'healthy-dried-food',
      'password' => 'NtHFH7AjNJPWJst1Tk976scPkBFjnp',
    ];

    $ch = curl_init($baseUrl . '/login');
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
      ],
      CURLOPT_POSTFIELDS => json_encode($authData),
    ]);

    $authResponse = curl_exec($ch);
    curl_close($ch);

    $auth = json_decode($authResponse, true);

    if (empty($auth['jwt'])) {
      throw new \RuntimeException('MAUDAU: не удалось получить JWT токен');
    }

    $token = $auth['jwt'];

    $query = http_build_query([
      // 'statuses' => 'new_order,approved,accepted',
      'page' => 1,
      'per_page' => 15,
      'sort_field' => 'created_at',
      'sort_direction' => 'DESC',
      // пример дат:
      // 'created_from' => '2025-01-01T00:00:00Z',
      // 'created_to'   => '2025-12-31T23:59:59Z',
    ]);

    $ch = curl_init($baseUrl . '/orders?' . $query);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Accept: application/json',
      ],
    ]);

    $ordersResponse = curl_exec($ch);
    curl_close($ch);

    $orders = json_decode($ordersResponse, true);

    if (!is_array($orders)) {
      throw new \RuntimeException('MAUDAU: ошибка получения заказов');
    }

    return $orders;
  }

  private function checkRozetkaOrders()
  {
    $importModel = JSFactory::getModel('sofonaimportprom');

    $token = $this->rozetkaGetToken();

    $orders = $this->rozetkaGetOrders($token, '1');

    $countCreate = 0;
    $countUpdate = 0;
    $countCanseled = 0;
    $createdIds = [];
    $updatedIds = [];
    $skippedIds = [];

    foreach ($orders['content']['orders'] ?? [] as $order) {
      $orderId = $order['id'];

      $infoOrder = $this->rozetkaGetOrderDetails($token, $orderId);
      // echo '<pre>';
      // var_dump($infoOrder);
      // die;
 
      $products = [];

      foreach ($infoOrder['content']['items_photos'] as $item) {

        $rzItemId = $item['id'];

        $itemDetails = $this->rozetkaGetItemDetails($token, $rzItemId);

        $productEan = $itemDetails['article'] ?? 0;

        $products[] = [
          'product_ean' => $productEan,
          'name' => $item['item_name'],
          'quantity' => 1,
          'price' => (float) $item['item_price'],
        ];

      }
      // echo'<pre>';var_dump($infoOrder['content']);echo'</pre>';
      switch ($infoOrder['content']['status_data']['status_group']) {
        case 1: // новый
          $status = 15;
          break;

        case 2: // выполнен
          $status = 16;
          break;

        case 3: // отменён
          $status = 17;
          break;

        default:
          $status = 0;
      }
      // var_dump($infoOrder['content']['delivery']);
      switch ($infoOrder['content']['delivery']['delivery_service_id']) {
        case '43660':
          $shippingMethods = 5;
          break;
        case '5':
          $shippingMethods = 4;
          break;
        case '1':
          $shippingMethods = 8;
          break;
        default:
          $shippingMethods = 7;
      }
      // var_dump($infoOrder['content']['payment_type']);
      switch ($infoOrder['content']['payment_type']) {
        case 'cash':
          $paymentMethods = 2;

          break;
        case 'no_cash':
          $paymentMethods = 4;
          break;

        default:
          $paymentMethods = 2;

          break;
      }

      $orderData = [
        'external_id' => $infoOrder['content']['id'],
        'status' => $status,
        'created_at' => date('Y-m-d H:i:s', strtotime($infoOrder['content']['created'])),

        'customer' => [
          'first_name' => $infoOrder['content']['recipient_title']['first_name'] ?? '',
          'last_name' => $infoOrder['content']['recipient_title']['last_name'] ?? '',
          'phone' => $infoOrder['content']['recipient_phone'] ?? '',
          'email' => '',
        ],

        'delivery' => [
          'address' =>
            ($infoOrder['content']['delivery']['city']['name_ua'] ?? '') . ', ' .
            ($infoOrder['content']['delivery']['place_street'] ?? '') . ' ' .
            ($infoOrder['content']['delivery']['place_house'] ?? ''),
        ],

        'products' => $products,
        'total' => (float) $infoOrder['content']['amount_with_discount'],

        'shipping_method_id' => $shippingMethods,
        'payment_method_id' => $paymentMethods,
      ];

      $orderInfo = $importModel->getOrderInfoByAgregatorId($orderData['external_id'], 'id_order_rozetka');

      if ($orderInfo === null) {

        $this->creadteOrder($orderData, 'id_order_rozetka');
        $countCreate += 1;
        $createdIds[] = $order['id'];

      } else {
        if ($status !== $orderInfo->order_status) {

          $this->updateOrder($orderInfo, $status);
          $countUpdate += 1;
          $updatedIds[] = $order['id'];

        } else {
          $countCanseled += 1;
          $skippedIds[] = $order['id'];
        }
      }




    }

    $message =
      'Создано: ' . $countCreate .
      ' | Обновлено: ' . $countUpdate .
      ' | Пропущено: ' . $countCanseled . PHP_EOL .
      'Созданные ID: ' . implode(', ', $createdIds) . PHP_EOL .
      'Обновленные ID: ' . implode(', ', $updatedIds) . PHP_EOL .
      'Пропущенные ID: ' . implode(', ', $skippedIds);

    $this->log('rozetka_order', $message);
    $this->log('rozetka_order_item', $order);

    return $message;

    return true;
  }

  private function rozetkaGetToken()
  {
    $url = $this->apiBase . '/sites';

    $payload = json_encode([
      'username' => $this->rozetkaLogin,
      'password' => base64_encode($this->rozetkaPass),
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
      ],
      CURLOPT_POSTFIELDS => $payload,
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    // echo '<pre>';var_dump($data);die;
    if (empty($data['content']['access_token'])) {
      throw new \Exception('Rozetka token not received');
    }

    return $data['content']['access_token'];
  }


  private function rozetkaGetOrders(string $token, int $types = 4)
  {
    $createdFrom = date('Y-m-d');
    // $url = $this->apiBase . '/orders/search?&page=1&sort=-id&types=' . $types.'&created_from=' . $createdFrom;
    
    $params = [
      'page' => 1,
      'sort' => '-id',
      'types' => $types,
      'created_from' => $createdFrom,
    ];

    $url = $this->apiBase . '/orders/search?' . http_build_query($params);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
      ],
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    return json_decode($response, true);
  }

  private function rozetkaGetOrderDetails(string $token, int $orderId)
  {
    $url = $this->apiBase . '/orders/' . $orderId . '?expand=user,delivery,status_data,payment_type,payment_type_name';

    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
      ],
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
  }

  private function rozetkaGetItemDetails(string $token, int $rzItemId)
  {
    $url = $this->apiBase . '/goods/details?rz_item_id=' . $rzItemId;

    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Language: uk',
      ],
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);

    return $data['content']['item'] ?? [];
  }


  private function sendTelegram(string $from, string $message): void
  {
    $botToken = '5910630852:AAH11elOOV1MLmR-3JeKZgWlieAH1_alMjU';
    $chatId = '-1001848978232';

    $text = "📦 <b>{$from}</b>\n\n" . $message;

    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";

    $data = [
      'chat_id' => $chatId,
      'text' => $text,
      'parse_mode' => 'HTML',
      'disable_web_page_preview' => true,
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => http_build_query($data),
    ]);

    curl_exec($ch);
    curl_close($ch);
  }

  private function creadteOrder(array $data, $agregator, $order_id = 0): void
  {
    $ordersModel = JSFactory::getModel('orders');
    $importModel = JSFactory::getModel('sofonaimportprom');
    $orderTable = JSFactory::getTable('order', 'jshop');

    $order = [
      $agregator => $data['external_id'],

      'f_name' => $data['customer']['first_name'] . ' ' . $data['customer']['last_name'],
      'd_f_name' => $data['customer']['first_name'] . ' ' . $data['customer']['last_name'],
      'phone' => $data['customer']['phone'],
      'd_phone' => $data['customer']['phone'],

      'email' => $data['customer']['email'],
      'd_email' => $data['customer']['email'],

      'street' => $data['delivery']['address'],
      'd_street' => $data['delivery']['address'],
      'shipping_params' => $data['delivery']['address'],

      'shipping_method_id' => $data['shipping_method_id'],
      'payment_method_id' => $data['payment_method_id'],

      'order_status' => $data['status'],
      'order_date' => $data['created_at'],
      'order_m_date' => $data['created_at'],

      'order_total' => 0,
      'order_subtotal' => 0,

      'country' => 220,
      'd_country' => 220,

      'currency_code' => 'грн.',
      'currency_code_iso' => 'UAH',
      'currency_exchange' => 1,
      'order_created' => 1,
    ];

    if ($order_id != 0) {
      $order['order_id'] = $order_id;
    }


    foreach ($data['products'] as $p) {

      if (isset($p['product_ean'])) {
        $product_ean = $p['product_ean'];
        $product = $importModel->getProductByField('product_ean', $product_ean);
      } else {
        $product_id = $p['product_id'];
        $product = $importModel->getProductByField('product_id', $product_id);

      }

      // $product = $importModel->getProductByProductEan($product_ean);
      // var_dump($product_id);die;
      $productId = $product->product_id ?? 0;
      $categoryId = $product->category_id ?? 0;
      $manufacturerCode = $product->manufacturer_code ?? '';
      $weight = $product->weight ?? 0;
      $productQty = $p['quantity'];
      $productPrice = $p['price'];
      $productName = (string) $p['name'];

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

    $jshopConfig = JSFactory::getConfig();
    $oldSend = $jshopConfig->send_order_email;
    $jshopConfig->send_order_email = 0;
    // var_dump($order);die;
    $savedOrder = $ordersModel->save($order);

    $jshopConfig->send_order_email = $oldSend;

    if (!$savedOrder) {
      return;
    }

  }

  private function updateOrder($orderInfo, $order_status): void
  {
    $importModel = JSFactory::getModel('sofonaimportprom');

    $orderStatusNameOld = $importModel->getOrderStatusName($orderInfo->order_status);
    $orderStatusNameNew = $importModel->getOrderStatusName($order_status);

    $importModel->updateOrderStatus($orderInfo->order_id, $order_status);

    $importModel->saveOrderHistory($orderInfo->order_id, $orderInfo->order_status, 0, 'Статус изменен c "' . $orderStatusNameOld . '" на "' . $orderStatusNameNew . '"');

  }

  protected function log($file_name, $data)
  {
    $logFile = JPATH_ROOT . '/logs/' . $file_name . '.log';
    $entry = "[" . date('Y-m-d H:i:s') . "] ";
    if ($data) {
      $entry .= ' | ' . print_r($data, true);
    }
    file_put_contents($logFile, $entry . PHP_EOL, FILE_APPEND);
  }


}