<?php
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

$botToken1 = "7524414941:AAErhnbtwVxkJNV8BGUyvMoFTZ_arYvZW9Y";
$chatId1 = "-1002437678565";

$botToken = "5910630852:AAH11elOOV1MLmR-3JeKZgWlieAH1_alMjU";  // токен бота
$chatId = "-1001848978232"; // chat_id куда слать

// Получаем данные из формы
$productId = $_POST['to_order_product_id'] ?? '';
$name = trim($_POST['order_name'] ?? '');
$count = (int) ($_POST['order_quantity'] ?? 0);
$methods = $_POST['contact_methods'] ?? [];
$captcha = trim($_POST['captha'] ?? '');

// Лог для дебага
// file_put_contents(JPATH_SITE . '/logs/order.txt', print_r($_POST, true));

// === Валидация ===
$errors = [];

// Проверка имени
if (mb_strlen($name) < 3 || mb_strlen($name) > 15) {
    $errors[] =  Text::_('TPL_CUSTOM_TG_ERROR_NAME');
}

// Проверка капчи (бот)
if ($captcha !== '') {
  $message="Ктото пытается взломать <b>HealthyDriedFood</b>";
    $url = "https://api.telegram.org/bot$botToken1/sendMessage";
  $params = [
      "chat_id" => $chatId1,
      "text" => $message,
      "parse_mode" => "HTML"
  ];
  $options = [
      "http" => [
          "header" => "Content-type: application/x-www-form-urlencoded\r\n",
          "method" => "POST",
          "content" => http_build_query($params)
      ]
  ];
  $context = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  die;
}

// Проверка количества
if ($count <= 0) {
    $errors[] = Text::_('TPL_CUSTOM_TG_ERROR_QUANTITY'); 
}

// Проверка методов связи
if (empty($methods)) {
    $errors[] = Text::_('TPL_CUSTOM_TG_ERROR_METHODS');
}

// Проверка введенных контактов
$contactValues = [];
foreach ($methods as $method) {
    $fieldName = "contact_$method";
    $value = trim($_POST[$fieldName] ?? '');

    if ($method === 'phone' || $method === 'viber' || $method === 'whatsapp') {
        // оставляем только цифры
        $digits = preg_replace('/\D/', '', $value);
        if (strlen($digits) < 10 || strlen($digits) > 12) {
            $errors[] = ucfirst($method) . Text::_('TPL_CUSTOM_TG_ERROR_METHODS_PHONE');
        }
        $contactValues[$method] = $digits;
    } elseif ($method === 'email') {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $errors[] = Text::_('TPL_CUSTOM_TG_ERROR_METHODS_EMAIL');
        }
        $contactValues[$method] = $value;
    } else { // telegram
        if ($value === '') {
            $errors[] = ucfirst($method) . Text::_('TPL_CUSTOM_TG_ERROR_METHODS_TELEGRAM');
        }
        $contactValues[$method] = $value;
    }
}

// Если есть ошибки, возвращаем их
if (!empty($errors)) {
    http_response_code(400);
    echo implode("\n", $errors);
    exit;
}

// Получаем название товара из БД
$db = Factory::getContainer()->get('DatabaseDriver');
$query = $db->getQuery(true)
    ->select($db->quoteName('name_ru-RU'))
    ->from($db->quoteName('#__jshopping_products'))
    ->where($db->quoteName('product_id') . ' = ' . (int) $productId);
$db->setQuery($query);
$productName = $db->loadResult() ?: "❓ Не найдено";

// Формируем сообщение
$message = "<b>Источник</b> HealthyDriedFood\n";
$message .= "<b>Пред заказ</b>\n";
$message .= "<b>Товар:</b> $productName\n";
$message .= "<b>Количество:</b> $count\n";
$message .= "<b>Имя:</b> $name\n";
$message .= "<b>Способы связи:</b>\n";

foreach ($contactValues as $method => $val) {
    $message .= " - $method: $val\n";
}

// Отправляем в Telegram
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$params = [
    "chat_id" => $chatId,
    "text" => $message,
    "parse_mode" => "HTML"
];
$options = [
    "http" => [
        "header" => "Content-type: application/x-www-form-urlencoded\r\n",
        "method" => "POST",
        "content" => http_build_query($params)
    ]
];
$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// Ответ для JS
if ($result) {
    echo "OK";
} else {
    http_response_code(500);
    echo Text::_('TPL_CUSTOM_TG_ERROR_FETCH');
}
