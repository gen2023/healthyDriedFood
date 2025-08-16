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
class PlgJshoppingCheckoutTelegrambot extends CMSPlugin
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
        } else {
            $this->showLog("Telegram message sent to {$chat_id}, order ID: {$order_id}");
        }

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
        $setkalist = $this->params->get('setkalist');

        $model = new TelegrambotModel();
        $siteDomain = Uri::root(false);

        $productInfoRaw = $this->getProductInfoArray($order);

        foreach ($setkalist as $key => $item) {
            $arr = [];

            $token = $item->token_id ?? null;
            $chat_id = $item->chat_id ?? null;
            $lang_message = $item->lang_message ?? null;

            $timeFrom = $item->timeFrom ?? '';
            $timeTo = $item->timeTo ?? '';

            if (!$token || !$chat_id) {
                $this->showLog("Telegram: missing token or chat_id in item {$key}");
                continue;
            }

            $lang->load('plg_jshoppingcheckout_telegrambot', JPATH_ADMINISTRATOR, (string) $lang_message, true);

            $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_SOURCE')] = $siteDomain;
            $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_ACTION')] = Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_CUSTOM_TEXT');

            if ($this->params->get('show_lang_site', '')) {
                $langTag = Factory::getApplication()->getLanguage()->getTag();
                $langCode = substr($langTag, 0, 2);
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_LANG_SITE')] = $langCode;
            }

            if ($this->params->get('show_order_id', '')) {
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_ORDER_ID')] = $order->order_id;
            }

            if ($this->params->get('show_order_number', '')) {
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_ORDER_NUMBER')] = $order->order_number;
            }

            if ($this->params->get('show_order_total', '')) {
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_ORDER_TOTAL')] = $order->order_total . ' ' . $order->currency_code;
                ;
            }

            if ($this->params->get('show_user_name', '')) {
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_NAME')] = $order->f_name . ' ' . $order->l_name;
            }

            if ($this->params->get('show_user_email', '')) {
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_EMAIL')] = $order->email;
            }

            if ($this->params->get('show_user_phone', '')) {
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_PHONE')] = $order->phone;
            }

            if ($this->params->get('show_shipping', '')) {
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_SHIPPING')] = $model->getShipping_method($order->shipping_method_id);
            }

            if ($this->params->get('show_payment', '')) {
                $arr[Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_PAYMENT')] = $model->getPayment_method($order->payment_method_id);
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
                                '<b>' . Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_PRODUCT_COUNT') . '</b>',
                                '<b>' . Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_EAN_PRODUCT') . '</b>',
                                '<b>' . Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_MANUFACTURER_CODE') . '</b>',
                                '<b>' . Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_MANUFACTURER') . '</b>',
                            ],
                            $part
                        );
                    }

                    $productInfo = implode(' - ', $localizedParts);

                    $arr_key = Text::_('PLG_JSCHECKOUT_TELEGRAMBOT_PRODUCT_NAME');
                    if ($index > 0) {
                        $arr_key .= '-' . $index;
                    }

                    $arr[$arr_key] = $productInfo;
                }
            }

            $txt = '';
            foreach ($arr as $key => $value) {
                $txt .= "<b>" . $key . "</b>: " . $value . "\n";
            }

            $settings = [
                'token' => $token,
                'chat_id' => $chat_id,
                'timeFrom' => $timeFrom,
                'timeTo' => $timeTo,
            ];

            $this->sendOrderToTelegram($txt, $order->order_id, $settings);
        }
    }

    private function getProductInfoArray($order)
    {
        $model = new TelegrambotModel();
        $products = $model->getOrderProduct($order->order_id);

        $showName = $this->params->get('show_product_name', '');
        $showQuantity = $this->params->get('show_product_quantity', '');
        $showAttribute = $this->params->get('show_atribute', '');
        $showManufacturer_code = $this->params->get('show_manufacturer_code', '');
        $showEan_product = $this->params->get('show_ean_product', '');
        $showManufacturer = $this->params->get('show_manufacturer', '');

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

            $productInfoRaw[] = $parts;
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
        Log::add($text, Log::INFO, 'yourlogcategory');
    }
}
