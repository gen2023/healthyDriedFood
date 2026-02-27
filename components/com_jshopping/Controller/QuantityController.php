<?php

namespace Joomla\Component\Jshopping\Site\Controller;

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Controller\BaseController;

class QuantityController extends BaseController
{
    public function display($cachable = false, $urlparams = false)
    {
        $db = Factory::getDbo();

        // Берём товары с остатком меньше 3
        $query = $db->getQuery(true)
            ->select([
                'p.product_id',
                'p.product_quantity',
                'pl.name'
            ])
            ->from('#__jshopping_products AS p')
            ->join('LEFT', '#__jshopping_products_lang AS pl ON pl.product_id = p.product_id')
            ->where('p.product_quantity < 3')
            ->where('pl.language = ' . $db->quote(Factory::getLanguage()->getTag()));

        $db->setQuery($query);
        $products = $db->loadObjectList();

        if (!$products) {
            echo 'No low stock products';
            return;
        }

        foreach ($products as $product) {
            $message = sprintf(
                "<b>ID:</b> %d\n<b>Товар:</b> %s\n<b>Остаток:</b> %s",
                $product->product_id,
                htmlspecialchars($product->name),
                $product->product_quantity
            );

            $this->sendTelegram($message);
        }

        echo 'Telegram notifications sent';
    }

    private function sendTelegram(string $message): void
    {
        $botToken = 'REPLACE_ME'; // ← ОБЯЗАТЕЛЬНО заменить
        $chatId  = '-1001848978232';

        $text = "📦 <b>Малый остаток товара</b>\n\n" . $message;

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
            CURLOPT_TIMEOUT => 10,
        ]);

        curl_exec($ch);
        curl_close($ch);
    }
}
