<?php
namespace Joomla\Component\Jshopping\Administrator\Controller;

defined('_JEXEC') or die();

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Registry\Registry;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

class VchasnoController extends BaseadminController
{
  public function createReceipt()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $order_id = $input->getInt('order_id');

    if (!$order_id) {
      $app->enqueueMessage('Нет ID заказа', 'error');
      return;
    }

    $order = JSFactory::getTable('order', 'jshop');
    $order->load($order_id);

    if (!$order->order_id) {
      $app->enqueueMessage('Заказ не найден', 'error');
      return;
    }

    $items = $order->getAllItems();

    PluginHelper::importPlugin('jshoppingadmin');
    $plugin = PluginHelper::getPlugin('jshoppingadmin', 'vchasno_prro');
    $params = new \Joomla\Registry\Registry($plugin->params);

    $token = trim($params->get('token'));
    $kassa = trim($params->get('kassa'));

    if (empty($token) || empty($kassa)) {
      $app->enqueueMessage('Не настроен плагин Vchasno', 'error');
      return;
    }

    $rows = [];
    foreach ($items as $item) {
      $rows[] = [
        "name" => $item->product_name,
        "cnt" => (float) $item->product_quantity,
        "price" => (float) $item->product_item_price,
        "taxgrp" => 1,
        "disc" => 0
      ];
    }

    $data = [
      "tag" => (string) $order->order_id,
      "rro_fn" => $kassa,
      "source" => "JoomShopping",
      "fiscal" => [
        "task" => 1,
        "cashier" => "JoomShopping",
        "receipt" => [
          "sum" => (float) $order->order_total,
          "rows" => $rows,
          "pays" => [
            ["type" => 1, "sum" => (float) $order->order_total]
          ],
          "comment_down" => "Дякуємо за покупку"
        ]
      ],
      "userinfo" => [
        "email" => $order->email
      ]
    ];

    $ch = curl_init('https://kasa.vchasno.ua/api/v3/fiscal/execute');
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: ' . $token
      ],
      CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_UNICODE),
      CURLOPT_TIMEOUT => 25
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
      $app->enqueueMessage('Ошибка CURL: ' . $error, 'error');
    } else {
      $respData = json_decode($response, true);

      if (!empty($respData['info']['doccode'])) {
        // Сохраняем doccode в заказе
        $order->vchasno_doc_code = $respData['info']['doccode'];
        $order->store();

        // Выводим ссылку на чек
        $link = 'https://kasa.vchasno.ua/check-viewer/' . $respData['info']['doccode'];
        $app->enqueueMessage('<a href="' . $link . '" target="_blank">Чек создан</a>', 'message');
      } else {
        $app->enqueueMessage('Чек создан, но doccode не получен: ' . $response, 'warning');
      }
    }

    $app->redirect('index.php?option=com_jshopping&controller=orders');
  }

  public function openShift()
{
    $app = Factory::getApplication();
    
    PluginHelper::importPlugin('jshoppingadmin');
    $plugin = PluginHelper::getPlugin('jshoppingadmin', 'vchasno_prro');
    $params = new \Joomla\Registry\Registry($plugin->params);

    $token = trim($params->get('token'));
    $kassa = trim($params->get('kassa'));

    $data = [
        "rro_fn" => $kassa,
        "source" => "JoomShopping",
        "fiscal" => [
            "task" => 0, // открытие смены
            "cashier" => "JoomShopping"
        ]
    ];

    $ch = curl_init('https://kasa.vchasno.ua/api/v3/fiscal/execute');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: ' . $token
        ],
        CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_UNICODE),
        CURLOPT_TIMEOUT => 25
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        $app->enqueueMessage('Ошибка CURL: ' . $error, 'error');
    } else {
        $app->enqueueMessage('Смена открыта: ' . $response, 'message');
    }

    $app->redirect('index.php?option=com_jshopping&controller=orders');
}
}