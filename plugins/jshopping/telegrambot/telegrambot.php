<?php
defined('_JEXEC') or die;

require_once __DIR__ . '/models/TelegrambotModel.php';

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\CMS\Log\Log;
use Joomla\CMS\Uri\Uri;
// index.php?option=com_ajax&plugin=telegrambot&group=content&format=raw
class PlgJshoppingTelegrambot extends CMSPlugin
{

    // public function onBeforeDisplayCheckoutFinish(&$text, &$order_id, &$text_end) //если на стадиях будет баг нужно будет рассмотреть привязку сюда и сделать запросы в бд
    public function onEndCheckoutStep5(&$order, &$cart)
    {
        $this->OrderMessage($order);
    }

    private function sendOrderToTelegram($txt, $order_id, $settings)
    {
        $model = new TelegrambotModel();
        date_default_timezone_set('Europe/Kiev');

        $token = $settings['token'];
        $chat_id = $settings['chat_id'];
        $startBlockTime = $settings['timeFrom'];
        $endBlockTime = $settings['timeTo'];
        $currentTime = date('H:i');

        $startBlockTimestamp = strtotime($startBlockTime);
        $endBlockTimestamp = strtotime($endBlockTime);
        $currentTimestamp = strtotime($currentTime);

        if ($currentTimestamp >= $startBlockTimestamp && $currentTimestamp <= $endBlockTimestamp) {
            $model->setOrderId($order_id);
            return false;
        }

        $url = "https://api.telegram.org/bot{$token}/sendMessage";

        $postData = [
            'chat_id' => $chat_id,
            'text' => urldecode($txt),
            'parse_mode' => 'html'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || !$response) {
            $this->showLog("Telegram error to {$chat_id}: " . $curlError);
        }
        //else {
        // $this->showLog("Telegram message sent to {$chat_id}, order ID: {$order_id}");
        //}

        return null;
    }

    private function onAjaxTelegrambot()
    {
        $app = Factory::getApplication();

        if ($app->isClient('site')) {
            $this->sendDelayedMessages();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized.']);
        }

        $app->close();
    }

    private function OrderMessage($order)
    {
        $lang = Factory::getApplication()->getLanguage();
        $model = new TelegrambotModel();
        $settings = $model->getConfigsSettings();
        $setkalist = $settings['setkalist'];
        $siteDomain = Uri::root(false);

        foreach ($setkalist as $key => $item) {
            $fields = $item['fields'];
            $productInfoRaw = $this->getProductInfoArray($order, $settings, $fields);

            $arr = [];

            $token = $item['token_id'] ?? null;
            $chat_id = $item['chat_id'] ?? null;
            $lang_message = $item['lang_message'] ?? null;

            $timeFrom = $item['timeFrom'] ?? '';
            $timeTo = $item['timeTo'] ?? '';

            if (!$token || !$chat_id) {
                $this->showLog("Telegram: missing token or chat_id in item {$key}");
                continue;
            }

            $lang->load('plg_jshopping_telegrambot', JPATH_ADMINISTRATOR, (string) $lang_message, true);

            if (!empty($settings['show_lang_site']) && in_array('show_lang_site', $fields, true)) {
                $langTag = Factory::getApplication()->getLanguage()->getTag();
                $langCode = substr($langTag, 0, 2);
                $arr[Text::_('PLG_JSHOPPING_TELEGRAMBOT_LANG_SITE')] = $langCode;
            }

            $fieldMap = [
                'show_source' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_SOURCE',
                    'value' => fn() => $siteDomain,
                ],
                'show_action' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_ACTION',
                    'value' => fn() => Text::_('PLG_JSHOPPING_TELEGRAMBOT_CUSTOM_TEXT'),
                ],
                'show_order_id' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_ORDER_ID',
                    'value' => fn() => $order->order_id,
                ],
                'show_order_number' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_ORDER_NUMBER',
                    'value' => fn() => $order->order_number,
                ],
                'show_order_total' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_ORDER_TOTAL',
                    'value' => fn() => $order->order_total . ' ' . $order->currency_code,
                ],
                'show_user_name' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_NAME',
                    'value' => fn() => $order->f_name . ' ' . $order->l_name,
                ],
                'show_user_email' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_EMAIL',
                    'value' => fn() => $order->email,
                ],
                'show_user_phone' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_PHONE',
                    'value' => fn() => $order->phone,
                ],
                'show_shipping' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_SHIPPING',
                    'value' => fn() => $model->getShipping_method($order->shipping_method_id),
                ],
                'show_shipping_params' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_SHIPPING_PARAMS',
                    'value' => fn() => $order->shipping_params,
                ],
                'show_street' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_STREET',
                    'value' => fn() => $order->street,
                ],
                'show_city' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_CITY',
                    'value' => fn() => $order->city,
                ],
                'show_zip' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_ZIP',
                    'value' => fn() => $order->zip,
                ],
                'show_payment' => [
                    'label' => 'PLG_JSHOPPING_TELEGRAMBOT_PAYMENT',
                    'value' => fn() => $model->getPayment_method($order->payment_method_id),
                ],
            ];

            foreach ($fieldMap as $key => $config) {

                if (empty($settings[$key]) || !in_array($key, $fields, true)) {
                    continue;
                }

                $arr[Text::_($config['label'])] = $config['value']();
            }

            if (!empty($productInfoRaw)) {
                foreach ($productInfoRaw as $index => $parts) {
                    $localizedParts = [];
                    foreach ($parts as $part) {
                        $localizedParts[] = str_replace(
                            [
                                '__COUNT__',
                                '__PRODUCTEAN__',
                                '__MANUFACTURERCODE__',
                                '__MANUFACTURER__',
                            ],
                            [
                                '<b>' . Text::_('PLG_JSHOPPING_TELEGRAMBOT_PRODUCT_COUNT') . '</b>',
                                '<b>' . Text::_('PLG_JSHOPPING_TELEGRAMBOT_EAN_PRODUCT') . '</b>',
                                '<b>' . Text::_('PLG_JSHOPPING_TELEGRAMBOT_MANUFACTURER_CODE') . '</b>',
                                '<b>' . Text::_('PLG_JSHOPPING_TELEGRAMBOT_MANUFACTURER') . '</b>',
                            ],
                            $part
                        );
                    }

                    $productInfo = implode(' - ', $localizedParts);

                    $arr_key = Text::_('PLG_JSHOPPING_TELEGRAMBOT_PRODUCT_NAME');
                    if ($index > 0) {
                        $arr_key .= '-' . $index;
                    }

                    $arr[$arr_key] = $productInfo;
                }
            }

            if (!empty($settings['show_comment']) && in_array('show_comment', $fields, true) && isset($order->order_add_info) && $order->order_add_info != '') {
                $arr[Text::_('PLG_JSHOPPING_TELEGRAMBOT_COMMENT')] = $order->order_add_info;
            }

            $txt = '';
            foreach ($arr as $key => $value) {
                $txt .= "<b>" . $key . "</b>: " . $value . "\n";
            }

            $arr_result = [
                'token' => $token,
                'chat_id' => $chat_id,
                'timeFrom' => $timeFrom,
                'timeTo' => $timeTo,
            ];

            $this->sendOrderToTelegram($txt, $order->order_id, $arr_result);
        }
    }

    private function getProductInfoArray($order, $settings, $fields)
    {
        $model = new TelegrambotModel();
        $products = $model->getOrderProduct($order->order_id);

        $showName = (!empty($settings['show_product_name']) && in_array('show_product_name', $fields, true));
        $showQuantity = (!empty($settings['show_product_quantity']) && in_array('show_product_quantity', $fields, true));
        $showAttribute = (!empty($settings['show_atribute']) && in_array('show_atribute', $fields, true));
        $showManufacturer_code = (!empty($settings['show_manufacturer_code']) && in_array('show_manufacturer_code', $fields, true));
        $showEan_product = (!empty($settings['show_ean_product']) && in_array('show_ean_product', $fields, true));
        $showManufacturer = (!empty($settings['show_manufacturer']) && in_array('show_manufacturer', $fields, true));

        $productInfoRaw = [];

        foreach ($products as $index => $product) {

            $parts = [];

            if ($showName) {
                $parts[] = $product->product_name;
            }

            if ($showAttribute && !empty($product->product_attributes)) {
                $cleanAttributes = str_replace(["\r", "\n"], ' ', $product->product_attributes);
                $parts[] = $cleanAttributes;
            }

            if ($showQuantity) {
                $parts[] = '__COUNT__: ' . (int) $product->product_quantity;
            }

            if ($showManufacturer_code) {
                $parts[] = '__PRODUCTEAN__: ' . $product->product_ean;
            }

            if ($showEan_product) {
                $parts[] = '__MANUFACTURERCODE__: ' . $product->manufacturer_code;
            }

            if ($showManufacturer) {
                $parts[] = '__MANUFACTURER__: ' . $product->manufacturer;
            }

            if (!empty($parts)) {
                $productInfoRaw[] = $parts;
            }
        }

        return $productInfoRaw;
    }

    private function sendDelayedMessages()
    {
        $model = new TelegrambotModel();

        $orders = $model->getDelayedOrderId();
        $model->clearDelayedMessages();

        foreach ($orders as $key => $value) {
            $arr['orders'][$key] = $model->getOrderInfo($value->order_id);
        }

        foreach ($arr['orders'] as $key => $value) {
            $this->OrderMessage($arr['orders'][$key]);
        }
    }

    private function showLog($text)
    {
        $log_file = JPATH_ROOT . '/administrator/logs/plg_jshopping_telegrambot.log';

        file_put_contents($log_file, '[' . date('Y-m-d H:i:s') . '] ' . $text . PHP_EOL, FILE_APPEND);

        Log::add($text, Log::INFO, 'tgbot');
    }

    public function onBeforeAdminConfigPanelIcoDisplay(&$menu)
    {
        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshopping_telegrambot', JPATH_ADMINISTRATOR);

        $menu['telegrambotconfig'] = array(
            Text::_('PLG_JSHOPPING_TELEGRAMBOT_SETTINGS'),
            'index.php?option=com_jshopping&amp;controller=telegrambot',
            'telegrambot.png',
            1
        );
    }
}
