<?php
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Log\Log;

require_once __DIR__ . '/models/GAnaliticsFPixelModel.php';

class PlgSystemG_Analitic_F_Pixel extends CMSPlugin
{
    private $pixelInitialized = false;
    private $gaInitialized = false;
    private $curensies_code = 'UAH';
    private $gAnaliticsFPixelModel;
    private array $paramsConfig;

    function __construct(&$subject, $config)
    {
        parent::__construct($subject, $config);

        $this->gAnaliticsFPixelModel = new GAnaliticsFPixelModel();

        $this->paramsConfig = [
            'token_id_fbc' => $this->params->get('token_id_fbc', '000000000000000'),
            // 'tracking_id_fbp' => $this->params->get('tracking_id_fbp', '000000000000000'),
            'tracking_id_fbp' => $this->params->get('tracking_id_fbp', '736902954136799'),
            'debug_mode' => $this->params->get('debug_mode', 0),
            'show_event_fbp' => $this->params->get('show_event_fbp', 0),
            'show_event_fbc' => $this->params->get('show_event_fbc', 0),
            'viewContent_fbp' => $this->params->get('viewContent_fbp', 0),
            'search_fbp' => $this->params->get('search_fbp', 0),
            'purchase_fbp' => $this->params->get('purchase_fbp', 0),
            'addToCart_fbp' => $this->params->get('addToCart_fbp', 0),
            'addPaymentInfo_fbp' => $this->params->get('addPaymentInfo_fbp', 0),
            'addToWishlist_fbp' => $this->params->get('addToWishlist_fbp', 0),
            'initiateCheckout_fbp' => $this->params->get('initiateCheckout_fbp', 0),
            'show_event_ga' => $this->params->get('show_event_ga', 0),
            'view_item_ga' => $this->params->get('view_item_ga', 0),
            'add_to_cart_ga' => $this->params->get('add_to_cart_ga', 0),
            'begin_checkout_ga' => $this->params->get('begin_checkout_ga', 0),
            'remove_from_cart_ga' => $this->params->get('remove_from_cart_ga', 0),
            'view_cart_ga' => $this->params->get('view_cart_ga', 0),
            'view_item_list_ga' => $this->params->get('view_item_list_ga', 0),
            'add_shipping_info_ga' => $this->params->get('add_shipping_info_ga', 0),
            'add_payment_info_ga' => $this->params->get('add_payment_info_ga', 0),
            'purchase_ga' => $this->params->get('purchase_ga', 0),
            'tracking_id_ga' => $this->params->get('tracking_id_ga', 'UA-000000000-0'),
            'addToCart_fbc' => $this->params->get('addToCart_fbc', 0),
            'add_to_cart_ga_deff' => $this->params->get('add_to_cart_ga_deff', 0),
            'addToCart_fbp_deff' => $this->params->get('addToCart_fbp_deff', 0),
            'add_shipping_info_ga_deff' => $this->params->get('add_shipping_info_ga_deff', 0),
            'add_payment_info_ga_deff' => $this->params->get('add_payment_info_ga_deff', 0),
            'addPaymentInfo_fbp_deff' => $this->params->get('addPaymentInfo_fbp_deff', 0),
            'addToWishlist_fbp_deff' => $this->params->get('addToWishlist_fbp_deff', 0),
            'viewContent_fbс' => $this->params->get('viewContent_fbс', 0),
            'purchase_fbс' => $this->params->get('purchase_fbс', 0),
        ];

    }
    public function onBeforeCompileHead()
    {
        if (Factory::getApplication()->isClient('administrator')) {
            return;
        }

        $this->initializePixel();
        $this->initializedGa();

        if (!empty($_SESSION['pending_events'])) {
            foreach ($_SESSION['pending_events'] as $eventScript) {
                $this->logError("Отправка отложенного события: " . json_encode($eventScript), 'INFO', 'g_analitic_f_pixel');
                Factory::getDocument()->addCustomTag($eventScript);
            }
            unset($_SESSION['pending_events']);
        }
    }
    private function initializePixel()
    {
        $trackingIdFbp = $this->paramsConfig['tracking_id_fbp'];
        $show_event_fbp = $this->paramsConfig['show_event_fbp'];


        if (!empty($trackingIdFbp) && !$this->pixelInitialized && $show_event_fbp==1) {
            $this->pixelInitialized = true;

            $script = "
            <!-- Facebook Pixel Code -->
            <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)}; 
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '{$trackingIdFbp}');
                fbq('track', 'PageView');
            </script>
            <noscript>
            <img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id={$trackingIdFbp}&ev=PageView&noscript=1'/>
            </noscript>
            <!-- End Facebook Pixel Code -->";

            Factory::getDocument()->addCustomTag($script);
        }
    }
    private function initializedGa()
    {
        $trackingIdGa = $this->paramsConfig['tracking_id_ga'];
        $show_event_ga = $this->paramsConfig['show_event_ga'];

        if (!empty($trackingIdGa) && !$this->gaInitialized && $show_event_ga==1) {
            $this->gaInitialized = true;

            $script = "
            <!-- Google Analytics 4 -->
            <script async src='https://www.googletagmanager.com/gtag/js?id={$trackingIdGa}'></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '{$trackingIdGa}');
            </script>
            <!-- End Google Analytics 4 -->";

            Factory::getDocument()->addCustomTag($script);
        }
    }
    private function sendGAEventDeff($eventName, $params)
    {

        $trackingIdGa = $this->paramsConfig['tracking_id_ga'];

        if ($trackingIdGa) {
            $script = "
            <script>
                gtag('event', '{$eventName}', " . json_encode($params) . ");
            </script>";

            if (!isset($_SESSION['pending_events'])) {
                $_SESSION['pending_events'] = [];
            }
            $_SESSION['pending_events'][] = $script;
            $this->logError("Событие сохранено в сессию: {$eventName}, параметры: " . json_encode($params), 'INFO', 'g_analitic');
        } else {
            $this->logError('Tracking ID не настроен в параметрах плагина.', 'WARNING', 'g_analitic');
        }
    }
    private function sendGAEvent($eventName, $params)
    {

        if (empty($eventName) || !is_array($params)) {
            $this->logError("Некорректные данные события: {$eventName}.", 'ERROR', 'g_analitic');
            return;
        }

        $trackingIdGa = $this->paramsConfig['tracking_id_ga'];

        if ($trackingIdGa) {
            $this->initializedGa();

            $script = "
            <script>
                gtag('event', '{$eventName}', " . json_encode($params) . ");
            </script>";

            $this->logError("Отправка события: {$eventName}, параметры: " . json_encode($params), 'INFO', 'g_analitic');
            Factory::getDocument()->addCustomTag($script);
        } else {
            $this->logError('Tracking ID не настроен в параметрах плагина.', 'WARNING', 'g_analitic');
        }
    }
    private function sendFbpEventDeff($eventName, $params)
    {
        if (empty($eventName) || !is_array($params)) {
            $this->logError("Некорректные данные события: {$eventName}.", 'ERROR', 'f_pixel');
            return;
        }

        $trackingIdFbp = $this->paramsConfig['tracking_id_fbp'];

        if ($trackingIdFbp) {

            $script = "
            <script>
                fbq('track', '{$eventName}', " . json_encode($params) . ");
            </script>";

            if (!isset($_SESSION['pending_events'])) {
                $_SESSION['pending_events'] = [];
            }
            $_SESSION['pending_events'][] = $script;
            $this->logError("Событие сохранено в сессию: {$eventName}, параметры: " . json_encode($params), 'INFO', 'f_pixel');
        } else {
            $this->logError('Tracking ID fbp не настроен в параметрах плагина.', 'WARNING', 'f_pixel');
        }
    }
    private function sendFbpEvent($eventName, $params)
    {
        if (empty($eventName) || !is_array($params)) {
            $this->logError("Некорректные данные события: {$eventName}.", 'ERROR', 'f_pixel');
            return;
        }

        $trackingIdFbp = $this->paramsConfig['tracking_id_fbp'];

        if ($trackingIdFbp) {
            $this->initializePixel();

            $script = "
            <script>
                fbq('track', '{$eventName}', " . json_encode($params) . ");
            </script>";

            $this->logError("Отправка события: {$eventName}, параметры: " . json_encode($params), 'INFO', 'f_pixel');
            Factory::getDocument()->addCustomTag($script);
        } else {
            $this->logError('Tracking ID fbp не настроен в параметрах плагина.', 'WARNING', 'f_pixel');
        }
    }
    private function sendFbqServerEvent($eventName, $event)
    {

        $user_data = [
            "client_ip_address" => $_SERVER['REMOTE_ADDR'],
            "client_user_agent" => $_SERVER['HTTP_USER_AGENT']
        ];

        if (isset($event[0]['user_data'])) {
            $user_data = array_merge($user_data, $event[0]['user_data']);
        }

        $event[0]['user_data'] = $user_data;
        // $event[0] = $identical;

        // echo '<pre>';
        // var_dump($event);
        // echo '</pre>';


        $pixel_id = $this->params->get('tracking_id_fbp');
        $token = $this->params->get('token_id_fbc');

        $ch = curl_init("https://graph.facebook.com/v16.0/{$pixel_id}/events");


        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, [
            'data' => json_encode($event),
            'access_token' => $token
        ]);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $error = curl_errno($ch);
        curl_close($ch);

        // var_dump([
        //     'response' => $response,
        //     'error' => $error,
        // ]);die;
        $this->logError("Отправка события: {$eventName}, параметры: " . json_encode($event), 'INFO', 'f_conversation');


        return [
            'response' => $response,
            'error' => $error,
        ];
    }
    public function onBeforeDisplayProductView(&$view)
    {

        if ($this->paramsConfig['show_event_fbp'] == 1 && $this->paramsConfig['viewContent_fbp'] == 1) {

            if (empty($view) || empty($view->product)) {
                $this->logError('Отсутствуют данные для отображения продукта.', 'WARNING', 'f_pixel');
                return;
            }

            $eventData = [
                'content_ids' => $view->product->product_id,
                'content_name' => $view->product->name,
                'content_type' => 'product',
                'currency' => $this->curensies_code,
                'value' => round((float)$view->product->product_price, 2),
                'contents' => $this->getProductArray($view->product),
                'content_category' => $this->getCategoryArray($view->category_id),
            ];

            $this->sendFbpEvent('ViewContent', $eventData);
        }

        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['view_item_ga'] == 1) {
            if (empty($view) || empty($view->product)) {
                $this->logError('Отсутствуют данные для отображения продукта.', 'WARNING', 'g_analitic');
                return;
            }

            $eventData = [
                'currency' => $this->curensies_code,
                'value' => round((float)$view->product->product_price, 2),
                'items' => $this->getItemsArray($view->product, $view->category_id),
            ];

            $this->sendGAEvent('view_item', $eventData);
        }

        if ($this->paramsConfig['show_event_fbc'] == 1 && $this->paramsConfig['viewContent_fbс'] == 1) {
            if (empty($view) || empty($view->product)) {
                $this->logError('Отсутствуют данные для отображения продукта.', 'WARNING', 'f_conversation');
                return;
            }

            $product = $view->product;
            $current_time = new DateTime();
            $formatted_time = $current_time->format('Hi');
            $event_id = $product->product_id . $formatted_time;
            $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

            $event = [
                [
                    "event_name" => "viewContent",
                    "event_time" => time(),
                    "event_source_url" => $link,
                    "content_type" => "product",
                    "content_ids" => "[" . $product->product_id . "]",
                    "content_name" => $product->name,
                    "content_category" => $this->getCategoryArray($view->category_id),
                    "value" => $view->product->product_price,
                    "currency" => $this->curensies_code,
                    "event_id" => $event_id
                ]
            ];

            $this->sendFbqServerEvent('viewContent', $event);
        }
    }
    public function onBeforeDisplayProductListView($view, $productlist)
    {

        if ($this->paramsConfig['show_event_fbp'] == 1 && $this->paramsConfig['search_fbp'] == 1 && $view->search) {

            $products = $productlist->products;
            $productIds = [];
            $productNames = [];
            $productCategories = [];
            $contents = [];

            foreach ($products as $product) {
                $categoryId = $this->gAnaliticsFPixelModel->getCategoryIdByProductId($product->product_id);
                $productIds[] = $product->product_id;
                $productNames[] = $product->name;
                $productCategories[] = $this->getCategoryArray($categoryId);
                $contents[] = $this->getProductArray($product)[0];
            }
            $eventData = [
                'content_ids' => count($productIds) > 1 ? $productIds : $productIds[0],
                'content_name' => count($productNames) > 1 ? $productNames : $productNames[0],
                'content_type' => 'product',
                'currency' => $this->curensies_code,
                'value' => 0,
                'contents' => $contents,
                'search_string' => $view->search,
                'content_category' => count($productCategories) > 1 ? $productCategories : $productCategories[0],
            ];

            $this->sendFbpEvent('Search', $eventData);
        }

        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['view_item_list_ga'] == 1) {

            $products = $productlist->products;
            $eventData = [
                'currency' => $this->curensies_code,
                'value' => 0,
                'items' => []
            ];

            foreach ($products as $key => $product) {

                $itemArray = $this->getItemsArray($product, $product->category_id);
                $eventData['items'][] = $itemArray[0];
            }

            $this->sendGAEvent('view_item_list', $eventData);
        }
    }
    public function onBeforeDisplayCheckoutFinish($text, $order_id, $text_end)
    {
        if ($this->paramsConfig['show_event_fbp'] == 1 && $this->paramsConfig['purchase_fbp'] == 1) {

            try {
                $products = $this->gAnaliticsFPixelModel->getOrderProducts($order_id);
                $productTotal = $this->gAnaliticsFPixelModel->getOrderTotals($order_id);
            } catch (Exception $e) {
                $this->logError("Ошибка при получении данных: " . $e->getMessage(), 'ERROR', 'f_pixel');
                return;
            }

            if (empty($products)) {
                $this->logError("Заказ с ID {$order_id} не содержит продуктов.", 'ERROR', 'f_pixel');
                return;
            }

            $productIds = [];
            $productNames = [];
            $productCategories = [];
            $contents = [];

            foreach ($products as $product) {
                $categoryId = $this->gAnaliticsFPixelModel->getCategoryIdByProductId($product['product_id']);
                $productIds[] = $product['product_id'];
                $productNames[] = $product['name'];
                $productCategories[] = $this->getCategoryArray($categoryId);
                $contents[] = $this->getProductArray($product)[0];
            }

            $eventData = [
                'content_ids' => count($productIds) > 1 ? $productIds : $productIds[0],
                'content_name' => count($productNames) > 1 ? $productNames : $productNames[0],
                'content_type' => 'product',
                'currency' => $this->curensies_code,
                'value' => round((float)$productTotal, 2),
                'contents' => $contents,
                'content_category' => count($productCategories) > 1 ? $productCategories : $productCategories[0],
            ];

            $this->sendFbpEvent('Purchase', $eventData);
        }
        
        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['purchase_ga'] == 1) {

            try {
                $products = $this->gAnaliticsFPixelModel->getOrderProducts($order_id);
            } catch (Exception $e) {
                $this->logError("Ошибка при получении продуктов: " . $e->getMessage(), 'ERROR', 'g_analitic');
                return [];
            }

            if (empty($products)) {
                $this->logError("Заказ с ID {$order_id} не содержит продуктов.", 'ERROR', 'g_analitic');
                return;
            }

            $items = [];
            $productTotal = $this->gAnaliticsFPixelModel->getOrderTotals($order_id);


            foreach ($products as $product) {
                $category_id = $this->gAnaliticsFPixelModel->getCategoryIdByProductId($product['product_id']);

                $items[] = [
                    'item_name' => $product['name'],
                    'item_id' => $product['product_id'],
                    'price' => round((float)$product['price'], 2),
                    'quantity' => (int)($product['quantity']),
                    'item_category' => $this->getCategoryArray($category_id),
                ];
            }

            $this->sendGAEvent('purchase', [
                'transaction_id' => (string)$order_id,
                'value' => round((float)$productTotal, 2),
                'currency' => $this->curensies_code,
                'items' => $items,
            ]);
        }

        if ($this->paramsConfig['show_event_fbc'] == 1 && $this->paramsConfig['purchase_fbс'] == 1) {
            try {
                $products = $this->gAnaliticsFPixelModel->getOrderProducts($order_id);
                $productTotal = $this->gAnaliticsFPixelModel->getOrderTotals($order_id);
            } catch (Exception $e) {
                $this->logError("Ошибка при получении данных: " . $e->getMessage(), 'ERROR', 'f_conversation');
                return;
            }

            if (empty($products)) {
                $this->logError("Заказ с ID {$order_id} не содержит продуктов.", 'ERROR', 'f_conversation');
                return;
            }
            $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

            $current_time = new DateTime();
            $formatted_time = $current_time->format('Hi');
            $event_id = $order_id . $formatted_time;

            $productIds = [];
            $productNames = [];
            $productCategories = [];
            $contents = [];

            foreach ($products as $product) {
                $categoryId = $this->gAnaliticsFPixelModel->getCategoryIdByProductId($product['product_id']);
                $productIds[] = $product['product_id'];
                $productNames[] = $product['name'];
                $productCategories[] = $this->getCategoryArray($categoryId);
                $contents[] = $this->getProductArray($product)[0];
            }

            $event = [
                "event_name" => "Purchase",
                "event_time" => time(),
                "event_source_url" => $link,
                "content_type" => "product",
                "content_ids" => count($productIds) > 1 ? $productIds : $productIds[0],
                "content_name" => count($productNames) > 1 ? $productNames : $productNames[0],
                "content_category" => count($productCategories) > 1 ? $productCategories : $productCategories[0],
                "value" => $productTotal,
                "currency" => $this->curensies_code,
                "event_id" => $event_id
            ];

            $this->sendFbqServerEvent('Purchase', $event);

        }
    }
    public function onBeforeDisplayCartView($view)
    {
        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['view_cart_ga'] == 1 && $view->products) {

            $eventData = [
                'currency' => $this->curensies_code,
                'value' => round((float)$view->fullsumm, 2),
                'items' => []
            ];

            foreach ($view->products as $product) {
                $product = (object) $product;
                $itemArray = $this->getItemsArray($product, $product->category_id);
                $eventData['items'][] = $itemArray[0];
            }

            $this->sendGAEvent('view_cart', $eventData);

        }
    }
    public function onAfterAddProductToCart($cart, $product_id, $quantity, $attribut, $freeattribut)
    {
        if ($this->paramsConfig['show_event_fbp'] == 1 && $this->paramsConfig['addToCart_fbp'] == 1 && $cart->type_cart == 'cart') {

            $product = new stdClass();

            foreach ($cart->products as $key => $value) {
                if ($value['product_id'] == $product_id) {
                    $product = (object) $value;
                    break;
                }
            }

            $productTotal = $product->price * $quantity;
            $items = $this->getProductArray($product);

            $eventData = [
                'content_ids' => $product->product_id,
                'content_name' => $product->product_name,
                'content_type' => 'product',
                'currency' => $this->curensies_code,
                'value' => round((float)$productTotal, 2),
                'contents' => $items,
                'content_category' => $this->getCategoryArray($product->category_id),
            ];

            $eventData['contents'][0]['quantity'] = $quantity;

            if ($this->paramsConfig['addToCart_fbp_deff']) {
                $this->sendFbpEventDeff('AddToCart', $eventData);
            } else {
                $this->sendFbpEvent('AddToCart', $eventData);
            }

        }
        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['add_to_cart_ga'] == 1 && $cart->type_cart == 'cart') {
            
            $product = new stdClass();

            foreach ($cart->products as $key => $value) {
                if ($value['product_id'] == $product_id) {
                    $product = (object) $value;
                    break;
                }
            }

            $productTotal = $product->price * $quantity;
            $items = $this->getItemsArray($product, $product->category_id,1);

            $eventData = [
                'currency' => $this->curensies_code,
                'value' => round((float)$productTotal, 2),
                'items' => $items
            ];

            $eventData['items'][0]['quantity'] = $quantity;

            if ($this->paramsConfig['add_to_cart_ga_deff']) {
                $this->sendGAEventDeff('add_to_cart', $eventData);
            } else {
                $this->sendGAEvent('add_to_cart', $eventData);
            }

        }
        if ($this->paramsConfig['show_event_fbc'] == 1 && $this->paramsConfig['addToCart_fbc'] == 1 && $cart->type_cart == 'cart') {
            $current_time = new DateTime();
            $formatted_time = $current_time->format('Hi');
            $products = $cart->products;
            $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

            foreach ($products as $product) {
                if ($product['product_id'] == $product_id) {
                    $category_name = $this->getCategoryArray($product['category_id']);
                    $event_id = $product_id . $formatted_time;
                    $event = [
                        [
                            "event_name" => "AddToCart",
                            "event_time" => time(),
                            "event_source_url" => $link,
                            "content_type" => "product",
                            "content_ids" => "[" . $product['product_id'] . "]",
                            "content_name" => $product['product_name'],
                            "content_category" => $category_name,
                            'value' => round((float)$product['price'], 2),
                            "currency" => $this->curensies_code,
                            "event_id" => $event_id
                        ]
                    ];
                    $this->sendFbqServerEvent('AddToCart', $event);
                }
            }
        }
        if ($this->paramsConfig['show_event_fbp'] == 1 && $this->paramsConfig['addToWishlist_fbp'] == 1 && $cart->type_cart == 'wishlist') {

            $product = new stdClass();

            foreach ($cart->products as $key => $value) {
                if ($value['product_id'] == $product_id) {
                    $product = (object) $value;
                    break;
                }
            }

            $productTotal = $product->price * $quantity;
            $items = $this->getProductArray($product);

            $eventData = [
                'content_ids' => $product->product_id,
                'content_name' => $product->product_name,
                'content_type' => 'product',
                'currency' => $this->curensies_code,
                'value' => round((float)$productTotal, 2),
                'contents' => $items,
                'content_category' => $this->getCategoryArray($product->category_id),
            ];

            $eventData['contents'][0]['quantity'] = $quantity;

            if ($this->paramsConfig['addToWishlist_fbp_deff']) {
                $this->sendFbpEventDeff('AddToWishlist', $eventData);
            } else {
                $this->sendFbpEvent('AddToWishlist', $eventData);
            }

        }
    }
    public function onBeforeDeleteProductInCart($number_id, $obj)
    {
        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['remove_from_cart_ga'] == 1) {

            if (!isset($obj->products[$number_id])) {
                $this->logError("Продукт с ID {$number_id} не найден в корзине.", 'ERROR', 'g_analitic');
                return;
            }

            $products = $obj->products;
            $product = (object) $products[$number_id];
            $productTotal = $product->price * $product->quantity;

            $items = $this->getItemsArray($product, $product->category_id);

            $eventData = [
                'currency' => $this->curensies_code,
                'value' => round((float)$productTotal, 2),
                'items' => $items
            ];

            $this->sendGAEvent('remove_from_cart', $eventData);

        }
    }
    public function onAfterSaveCheckoutStep3save(&$adv_user, &$paym_method, &$cart)
    {
        if ($this->paramsConfig['show_event_fbp'] == 1 && $this->paramsConfig['addPaymentInfo_fbp'] == 1) {

            $language = Factory::getLanguage()->getTag();

            if (!is_object($paym_method)) {
                $this->logError('Объект paym_method недоступен или не является объектом.', 'ERROR', 'f_pixel');
                return;
            }

            if (!property_exists($paym_method, 'payment_id')) {
                $this->logError('ID метода оплаты недоступен. Проверьте структуру объекта.', 'ERROR', 'f_pixel');
                return;
            }

            $eventData = [
                'content_ids' => $paym_method->payment_id,
                'currency' => $this->curensies_code,
                'value' => round((float)$paym_method->price, 2),
                'contents' => [
                    'id' => $paym_method->price
                ],
            ];


            if ($this->paramsConfig['addPaymentInfo_fbp_deff']) {
                $this->sendFbpEventDeff('AddPaymentInfo', $eventData);
            } else {
                $this->sendFbpEvent('AddPaymentInfo', $eventData);
            }
        }
        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['add_payment_info_ga'] == 1) {

            $eventData = [
                'currency' => $this->curensies_code,
                'value' => round((float)$cart->price_product, 2),
                'payment_type' => $paym_method->getName(),
                'items' => []
            ];

            foreach ($cart->products as $key => $product) {
                $product = (object) $product;
                $itemArray = $this->getItemsArray($product, $product->category_id);
                $eventData['items'][] = $itemArray[0];
            }

            if ($this->paramsConfig['add_payment_info_ga_deff']) {
                $this->sendGAEventDeff('add_payment_info', $eventData);
            } else {
                $this->sendGAEvent('add_payment_info', $eventData);
            }
        }
    }
    public function onAfterSaveCheckoutStep4(&$adv_user, &$sh_method, &$shipping_method_price, &$cart)
    {

        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['add_shipping_info_ga'] == 1) {

            $eventData = [
                'currency' => $this->curensies_code,
                'value' => round((float)$cart->price_product, 2),
                'shipping_tier' => $sh_method->getName(),
                'items' => []
            ];

            foreach ($cart->products as $key => $product) {
                $product = (object) $product;
                $itemArray = $this->getItemsArray($product, $product->category_id);
                $eventData['items'][] = $itemArray[0];
            }

            if ($this->paramsConfig['add_shipping_info_ga_deff']) {
                $this->sendGAEventDeff('add_shipping_info', $eventData);
            } else {
                $this->sendGAEvent('add_shipping_info', $eventData);
            }

        }
    }
    public function onBeforeDisplayCheckoutCartView($view)
    {
        if ($this->paramsConfig['show_event_fbp'] == 1 && $this->paramsConfig['initiateCheckout_fbp'] == 1) {

            $products = $view->products;
            $productIds = [];
            $productNames = [];
            $productCategories = [];
            $contents = [];

            foreach ($products as $product) {
                $categoryId = $this->gAnaliticsFPixelModel->getCategoryIdByProductId($product['product_id']);
                $productIds[] = $product['product_id'];
                $productNames[] = $product['product_name'];
                $productCategories[] = $this->getCategoryArray($categoryId);
                $contents[] = $this->getProductArray($product)[0];
            }

            $eventData = [
                'content_ids' => count($productIds) > 1 ? $productIds : $productIds[0],
                'content_name' => count($productNames) > 1 ? $productNames : $productNames[0],
                'content_type' => 'product',
                'currency' => $this->curensies_code,
                'value' => round((float)$view->fullsumm, 2),
                'contents' => $contents,
                'content_category' => count($productCategories) > 1 ? $productCategories : $productCategories[0],
            ];

            $this->sendFbpEvent('InitiateCheckout', $eventData);
        }
        if ($this->paramsConfig['show_event_ga'] == 1 && $this->paramsConfig['begin_checkout_ga'] == 1) {

            $products = $view->products;
            $eventData = [
                'currency' => $this->curensies_code,
                'value' => round((float)$view->fullsumm, 2),
                'items' => []
            ];

            foreach ($products as $key => $product) {
                $product = (object) $product;
                $itemArray = $this->getItemsArray($product, $product->category_id,1);
                $eventData['items'][] = $itemArray[0];
            }

            $this->sendGAEvent('begin_checkout', $eventData);
        }
    }
    private function getItemsArray($product, $category_id,$currency_not=0)
    {

        $items = [
            [
                'item_id' => $product->product_id,
                'item_name' => $product->name ?: $product->product_name,
                'price' => round((float)($product->product_price ?: $product->price), 2),
                'quantity' => (int)($product->quantity ?: 1),
                'item_category' => $this->getCategoryArray($category_id)
            ]
        ];

        if ($currency_not != 1) {
            $items[0]['currency'] = $this->curensies_code;
        }

        return $items;
    }
    private function getProductArray($product)
    {
        $quantity = 1;

        if (is_object($product)) {
            $quantity = isset($product->quantity) ? $product->quantity : 1;
        } elseif (is_array($product)) {
            $quantity = isset($product['quantity']) ? $product['quantity'] : 1;
        }

        $items = [
            [
                'id' => is_object($product) ? $product->product_id : $product['product_id'],
                'quantity' => (int)($quantity),
            ]
        ];

        return $items;
    }
    private function getCategoryArray($category_id)
    {

        try {
            $category_names = $this->gAnaliticsFPixelModel->getCatNamesFromProduct($category_id);
            if (empty($category_names)) {
                $this->logError("Категории для продукта с ID {$category_id} не найдены.", 'WARNING');
                return;
            }
        } catch (Exception $e) {
            $this->logError("Ошибка при получении категорий продукта: " . $e->getMessage(), 'ERROR');
            return;
        }

        if (count($category_names) > 1) {
            $category_string = implode(', ', array_slice($category_names, 1));
        } else {
            $category_string = $category_names[0];
        }

        return $category_string;
    }
    private function logError($message, $level = 'ERROR', $category = 'g_analitic_f_pixel')
    {
        if ($this->params->get('debug_mode', 0)) {

            $logFile = JPATH_ROOT . '/logs/g_analitic_f_pixel.log';
            $timestamp = date('Y-m-d H:i:s');
            $logContent = "[{$timestamp}] {$level} {$category}: {$message}\n";
            file_put_contents($logFile, $logContent, FILE_APPEND);
        }
    }
}