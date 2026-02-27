<?php

namespace Joomla\Component\Jshopping\Site\Controller;


use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Router\Route;


class PromController extends BaseController
{
    public function display($cachable = false, $urlparams = false)
    {
        $this->createXml('prom.xml');

        Factory::getApplication()->close();

    }

    protected function createXml($filename = 'feed.xml')
    {
        ///index.php?option=com_jshopping&controller=prom&file=1
        $app = Factory::getApplication();
        $input = $app->input;

        $saveToFile = $input->getBool('file', false);
        $model = JSFactory::getModel('aggregator', 'Site');
        $categories = $model->getCategories();
        $languages = ['ru-RU' => 'ru', 'uk-UA' => 'uk'];

        //передваем ид с таблицы __jshopping_category_custom_values
        $categoryAggregator = $model->getCategoryCF(7);

        $currencies = $model->getCurrencies();
        // $products = $model->getProducts();

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
            $name = htmlspecialchars($category->{'name_uk-UA'});
            $categoryElement = $categoriesElement->addChild('category', $name);
            $categoryElement->addAttribute('id', $catId);
            $parentId = (int) $category->category_parent_id;

            if ($parentId) {
                $categoryElement->addAttribute('parentId', $parentId);
            }

            if (isset($categoryAggregatorMap[$catId])) {
                $id = $categoryAggregatorMap[$catId];

                $categoryElement->addAttribute('portal_id', $id);
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
        foreach ($products as $key => $product) {

            $infoDopField = $model->getInfoDopField($product->product_id);
            if ((int) $infoDopField['view_prom'] == 1)
                continue;
            // echo 'Product ID: ' . $product->product_id . '<br>';

            $offer = $offers->addChild('offer');
            $offer->addAttribute('id', $product->product_id);
            $offer->addAttribute('available', $product->product_quantity > 0 ? 'true' : 'false');
            $offer->addAttribute('selling_type', 'u');

            $productcategory = $product->main_category_id;

            if ($product->main_category_id == 0) {
                $productcategory = $model->getMainCategory($product->product_id);
            }

            $shopUrl = rtrim(Uri::root(), '/');
            $urls = $shopUrl . Route::_('index.php?option=com_jshopping&controller=product&task=view&category_id=' . $productcategory . '&product_id=' . $product->product_id);

            $offer->addChild('url', htmlspecialchars($urls));

                $percent = isset($infoDopField['percent_prom']) ? (float) $infoDopField['percent_prom'] : 0;
                
            $markup = ($percent > 0) ? $percent : 10;
            $price = $product->product_price * (1 + $markup / 100);
            $price = round($price, 2);

            $offer->addChild('price', number_format($price, 2, '.', ''));

            $currencyId = $product->currency_id;
            $currencyIso = isset($currencyMap[$currencyId]) ? $currencyMap[$currencyId] : 'UAH';
            $offer->addChild('currencyId', $currencyIso);

            $offer->addChild('stock_quantity', (int) $product->product_quantity);
            $offer->addChild('name', htmlspecialchars($product->{'name_ru-RU'}));
            $offer->addChild('name_ua', htmlspecialchars($product->{'name_uk-UA'}));
            $offer->addChild('categoryId', (int) $productcategory);

            if ($infoDopField['category_prom']) {
                $productcategory = $infoDopField['category_prom'];
                $offer->addChild('portal_category_id', (int) $productcategory);
            }

            if (!empty($product->images) && is_array($product->images)) {
                foreach ($product->images as $image) {
                    $imageUrlFull = $imageUrl . basename($image);
                    $offer->addChild('picture', htmlspecialchars($imageUrlFull));
                }
            }
            $offer->addChild('vendor', 'Без бренда');
            $offer->addChild('vendorCode', $product->product_ean);

            $country = '';
            $code = '';

            if (!empty($product->extra_fields)) {
                foreach ($product->extra_fields as $extra) {
                    if ((int) $extra['field_id'] === 4) {
                        $country = trim($extra['value']);

                        switch ($country) {
                            case 'Україна':
                                $code = 'Украина';
                                break;

                            case 'Індія':
                                $code = 'Индия';
                                break;

                            case 'Китай':
                                $code = 'Китай';
                                break;

                            default:
                                $code = 'Украина';
                                break;
                        }

                        break;
                    }
                }
            }

            $offer->addChild('country_of_origin', $code);

            $description = $product->{'short_description_ru-RU'} . '<br>' . $product->{'description_ru-RU'};
            $descriptionUa = $product->{'short_description_uk-UA'} . '<br>' . $product->{'description_uk-UA'};

            $offer->addChildCData('description', $description);
            $offer->addChildCData('description_ua', $descriptionUa);

$regions = $offer->addChild('regions');

$regions->addChild('region', 'Одеса');
$regions->addChild('region', '194015001');

            // if (!empty($product->extra_fields)) {
            //     $skipIds = [];
            //     foreach ($product->extra_fields as $extra) {
            //         if (in_array($extra['field_id'], $skipIds, true)) {
            //             continue;
            //         }


            //         $paramName = htmlspecialchars(str_replace(' Rozetka', '', $extra['field_name']));
            //         $paramValue = htmlspecialchars($extra['value']);
            //         $offer->addChild('param', $paramValue)->addAttribute('name', $paramName);
            //     }
            // }

        }

        if ($saveToFile) {
            // === СОХРАНЕНИЕ В ФАЙЛ ===
            $path = JPATH_SITE . '/components/com_jshopping/files/importexport/imaudexportyml/';
            if (!is_dir($path)) {
                mkdir($path, 0777, true);
            }

            $filePath = $path . $filename;
            $xml->asXML($filePath);

            echo 'XML успешно создан: ' . $filePath . '<br>';
            echo 'Всего товаров: ' . count($products);

            $app->enqueueMessage('XML успешно создан: ' . $filePath);
        } else {
            // === ВЫВОД В БРАУЗЕР ===
            $app->clearHeaders();
            $app->setHeader('Content-Type', 'application/xml; charset=utf-8', true);
            $app->sendHeaders();

            echo trim($xml->asXML());
        }
    }

    function cleanRozetkaDescription($text)
    {
        if (!$text)
            return '';

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