<?php

namespace Joomla\Component\Jshopping\Site\Controller;


use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Router\Route;


class RozetkaController extends BaseController
{
    public function display($cachable = false, $urlparams = false)
    {
        $this->createXml('rozetka.xml');
        echo '<br>';

        die('1111111111111111');
    }

    protected function createXml($filename = 'feed.xml')
    {
        $model = JSFactory::getModel('aggregator', 'Site');
        $categories = $model->getCategories();
        $languages = ['ru-RU' => 'ru', 'uk-UA' => 'uk'];

        //передваем ид с таблицы __jshopping_category_custom_values
        $categoryAggregator = $model->getCategoryCF(1);

        $currencies = $model->getCurrencies();

        $filters = [
            'base' => [
                'p.product_publish = 1'
                // 'p.product_quantity > 0'
            ],
            'include' => [
                // 'extra_field_29' => 178,
                // 'extra_field_30' => 180,
            ],
            'exclude' => [
                // 'extra_field_33' => 181,
                // 'extra_field_50' => 180,
            ]
        ];

        $products = $model->getProducts($filters);

        $info = [];
        $shopUrl = Uri::root();
        $infoShop = [
            'name' => 'HealthyDriedFood',
            'url' => $shopUrl,
            'company' => 'HealthyDriedFood'
        ];
        date_default_timezone_set('Europe/Kyiv');
        $date = date('Y-m-d H:i');
        $xml = new SimpleXMLExtended('<?xml version="1.0" encoding="UTF-8"?><yml_catalog date="' . $date . '"><shop/></yml_catalog>');


        $shop = $xml->shop;
        foreach ($infoShop as $key => $value) {
            $shop->addChild($key, $value);
        }
        $currenciesElement = $shop->addChild('currencies');
        foreach ($currencies as $currency) {
            $rate = number_format($currency->currency_value, 2, '.', '');
            $currenciesElement->addChild('currency')
                ->addAttribute('id', $currency->currency_code_iso);
            $currenciesElement->currency[count($currenciesElement->currency) - 1]
                ->addAttribute('rate', $rate);
        }

        $categoriesElement = $shop->addChild('categories');

        $categoryAggregatorMap = [];
        foreach ($categoryAggregator as $promItem) {
            $categoryAggregatorMap[(int) $promItem->category_id] = $promItem->value;
        }

        foreach ($categories as $category) {
            $catId = (int) $category->category_id;
            $name = htmlspecialchars($category->{'name_ru-RU'});
            $categoryElement = $categoriesElement->addChild('category', $name);
            $categoryElement->addAttribute('id', $catId);
            $parentId = (int) $category->category_parent_id;

            if ($parentId) {
                $categoryElement->addAttribute('parentId', $parentId);
            }

            if (isset($categoryAggregatorMap[$catId])) {
                $promId = $categoryAggregatorMap[$catId];

                $categoryElement->addAttribute('portal_id', $promId);
            }
        }

        $categoriesMap = [];
        foreach ($categories as $cat) {
            $categoriesMap[$cat->category_id] = $cat;
        }

        $currencyMap = [];
        foreach ($currencies as $cur) {
            $currencyMap[(int) $cur->currency_id] = $cur->currency_code_iso;
        }

        $imageUrl = $shopUrl . 'components/com_jshopping/files/img_products/';

        $offers = $shop->addChild('offers');
        foreach ($products as $product) {
            
        $infoDopField = $model->getInfoDopField($product->product_id);
        if((int)$infoDopField['view_rozetka']==1) continue;

            echo 'Product ID: ' . $product->product_id . '<br>';
            $product->unlimited == 1 ? $product->product_quantity = 25 : $product->product_quantity = $product->product_quantity;

            $offer = $offers->addChild('offer');
            $offer->addAttribute('id', $product->product_id);
            $offer->addAttribute('available', $product->product_quantity > 0 ? 'true' : 'true');
            $offer->addAttribute('selling_type', 'u');

            $productcategory = $product->main_category_id;

            if ($product->main_category_id == 0) {
                $productcategory = $model->getMainCategory($product->product_id);
            }
            $shopUrl = rtrim(Uri::root(), '/');
            $urls = $shopUrl . Route::_('index.php?option=com_jshopping&controller=product&task=view&category_id=' . $productcategory . '&product_id=' . $product->product_id);

            $offer->addChild('url', htmlspecialchars($urls));

            $price = $product->product_price + 15;

            if (!empty($product->extra_fields)) {
                foreach ($product->extra_fields as $extra) {
                    if ((int) $extra['field_id'] === 30) {
                        $price = (float) str_replace(',', '.', $extra['value']);
                        break;
                    }
                }
            }

            $offer->addChild('price', number_format($price, 2, '.', ''));

            $currencyId = $product->currency_id;
            // var_dump($product->currency_id);
            $currencyIso = isset($currencyMap[$currencyId]) ? $currencyMap[$currencyId] : 'UAH';
            $offer->addChild('currencyId', $currencyIso);

            $offer->addChild('stock_quantity', (int) $product->product_quantity > 0 ? (int) $product->product_quantity : '1');
            $offer->addChild('article', $product->product_ean);

            
            $name_product_ru = $product->{'name_ru-RU'};
            if ($infoDopField['name_rozetka_ru']) {
                $name_product_ru = $infoDopField['name_rozetka_ru'];
            }
            $offer->addChild('name', htmlspecialchars($name_product_ru));

            $name_product_uk = $product->{'name_uk-UA'};
            if ($infoDopField['name_rozetka_ua']) {
                $name_product_uk = $infoDopField['name_rozetka_ua'];
            }

            $offer->addChild('name_ua', htmlspecialchars($name_product_uk));

            $offer->addChild('categoryId', (int) $productcategory);

            if (!empty($product->images) && is_array($product->images)) {
                foreach ($product->images as $image) {
                    $imageUrlFull = $imageUrl . basename($image);
                    $offer->addChild('picture', htmlspecialchars($imageUrlFull));
                }
            }
            $offer->addChild('vendor', 'Healthy Dried Food');

            $description = $product->{'description_ru-RU'};
            $descriptionUa = $product->{'description_uk-UA'};

            if ($infoDopField['description_rozetka_ru']) {
                $description = $infoDopField['description_rozetka_ru'];
            }
            if ($infoDopField['description_rozetka_ua']) {
                $descriptionUa = $infoDopField['description_rozetka_ua'];
            }

            $offer->addChildCData('description', $this->cleanRozetkaDescription($description));
            $offer->addChildCData('description_ua', $this->cleanRozetkaDescription($descriptionUa));

            if ((int) $product->product_quantity <= 0) {
                $offer->addChild('param', 'Передзамовити')->addAttribute('name', 'Кнопка передзамовлення');
                $offer->addChild('param', '4')->addAttribute('name', 'Термін доставки');
            }

            if (!empty($product->extra_fields)) {
                $skipIds = [];
                foreach ($product->extra_fields as $extra) {
                    if (in_array($extra['field_id'], $skipIds, true)) {
                        continue;
                    }

                    $paramName = htmlspecialchars($extra['field_name']);
                    $paramValue = htmlspecialchars($extra['value']);
                    $offer->addChild('param', $paramValue)->addAttribute('name', $paramName);
                }
            }

        }

        // Куда сохраняем
        $path = JPATH_SITE . '/components/com_jshopping/files/importexport/imaudexportyml/';
        $urlFile = Uri::root() . 'components/com_jshopping/files/importexport/imaudexportyml/' . $filename;

        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }

        $filePath = $path . $filename;

        $xml->asXML($filePath);
        echo 'XML успешно создан: <a href="' . $urlFile . '" target="_blank">' . $filePath . '</a><br>';
        echo 'Всего товаров: ' . count($products);
        echo '<br>';

        Factory::getApplication()->enqueueMessage('XML успешно создан: ' . $filePath);

    }
function cleanRozetkaDescription($text)
{
    if (!$text) return '';

    // 1. Удаляем emoji (все юникодные emoji)
    $text = preg_replace('/[\x{1F300}-\x{1FAFF}\x{1F000}-\x{1F9FF}\x{2600}-\x{27BF}]/u', '', $text);

    // 2. Удаляем изображения
    $text = preg_replace('#<img[^>]*?>#is', '', $text);

    // 3. Удаляем iframe, video, source
    $text = preg_replace('#<(iframe|video|source)[^>]*?>.*?</\1>#is', '', $text);
    $text = preg_replace('#<(iframe|video|source)[^>]*?>#is', '', $text);

    // 4. Удаляем ссылки, оставляя текст внутри
    $text = preg_replace('#<a[^>]*>(.*?)</a>#is', '$1', $text);

    // 5. Удаляем URL в тексте
    $text = preg_replace('#https?://[^\s<]+#i', '', $text);

    // 6. Удаляем лишние повторяющиеся пробелы
    $text = preg_replace('/\s{2,}/', ' ', $text);

    // 7. Тримим
    $text = trim($text);

    return $text;
}


}



class SimpleXMLExtended extends \SimpleXMLElement
{
    public function addChildCData($name, $value = null)
    {
        $child = $this->addChild($name); // создаём узел
        if ($child !== null) {
            $node = dom_import_simplexml($child);
            $no = $node->ownerDocument;
            $node->appendChild($no->createCDATASection($value));
        }
        return $child;
    }
}
