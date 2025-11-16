<?php

namespace Joomla\Component\Jshopping\Site\Controller;


use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Router\Route;
use Joomla\Component\Jshopping\Site\Helper\Helper;


class GoogleController extends BaseController
{
    public function display($cachable = false, $urlparams = false)
    {
        $langTag = Factory::getApplication()->getLanguage()->getTag();
            $filename='google.xml';

        if ($langTag=='ru-RU'){
            $filename='google_ru.xml';
        }

        $this->createXmlGoogle($filename);

        die('1111111111111111');
    }

    protected function createXmlGoogle($filename = 'google_feed.xml')
    {
        // Подготовка моделей и данных (как в твоём старом методе)
        $model = JSFactory::getModel('aggregator', 'Site');
        $categories = $model->getCategories();
        $languages = ['ru-RU' => 'ru', 'uk-UA' => 'uk'];

        // id из __jshopping_category_custom_values — у тебя была логика, если нужно, используй
        $categoryAggregator = $model->getCategoryCF(3);
        // var_dump($categoryAggregator);die;//array(2) { [0]=> object(stdClass)#1233 (4) { ["id"]=> int(135) ["field_id"]=> int(2) ["category_id"]=> int(3) ["value"]=> string(8) "11111111" } [1]=> object(stdClass)#1237 (4) { ["id"]=> int(136) ["field_id"]=> int(2) ["category_id"]=> int(7) ["value"]=> string(7) "2222222" } }

        $currencies = $model->getCurrencies();

        // Тут можно оставить фильтры как было
        $filters = [
            'base' => [
                'p.product_publish = 1',
                'p.product_quantity > 0'
                // 'p.main_category_id != 1'
            ],
            'include' => [],
            'exclude' => [
            ]
        ];

        $products = $model->getProducts($filters);

        $shopUrl = rtrim(Uri::root(), '/');

        // Устанавливаем таймзону как было
        date_default_timezone_set('Europe/Kyiv');

        // Создаём RSS root с namespace g:
        $xmlString = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"></rss>';

        $xml = new SimpleXMLExtended($xmlString);
        $channel = $xml->addChild('channel');

        // Базовая информация о магазине
        $channel->addChild('title', 'HealthyDriedFood');
        $channel->addChild('link', $shopUrl);
        $channel->addChild('description', 'HealthyDriedFood — товары');

        // Соберём карту валют (id => ISO)
        $currencyMap = [];
        foreach ($currencies as $cur) {
            $currencyMap[(int) $cur->currency_id] = $cur->currency_code_iso;
        }

        // Путь к картинкам (как у тебя)
        $imageUrlBase = $shopUrl . '/components/com_jshopping/files/img_products/';
        $defaultImageUrl = $shopUrl . '/images/default_image.png'; // замени путь при необходимости


        $categoryAggregatorMap = [];
        foreach ($categoryAggregator as $googleCatId) {
            $categoryAggregatorMap[(int) $googleCatId->category_id] = $googleCatId->value;
        }

        $langTag = Factory::getApplication()->getLanguage()->getTag();

        // Вставляем каждый товар как <item>
        foreach ($products as $product) {

            // иногда у тебя unlimited -> подставляем минимальное количество, оставил логику
            if ($product->unlimited == 1) {
                $product->product_quantity = max(1, (int) $product->product_quantity);
            }

            $item = $channel->addChild('item');

            // g:id
            $product_id=$product->product_id;
            if($langTag=='uk-UA'){
                $product_id=$product->product_id+1000;
            }

            $item->addChild('g:id', (string) $product_id, 'http://base.google.com/ns/1.0');

            // title — используем языковое поле, fallback на любое доступное
            
            $fieldName = 'name_' . $langTag;
            $title = $product->{$fieldName} ?? $product->{'name_' . $langTag} ?? $product->name ?? 'Product ' . $product->product_id;
            $item->addChild('g:title', htmlspecialchars(mb_substr($title, 0, 150)), 'http://base.google.com/ns/1.0');

            // Собираем краткое + полное описание
            $descField = ($product->{'short_description_' . $langTag} ?? '') . '<br>' . ($product->{'description_' . $langTag} ?? '');

            // Если пусто, пробуем вторую локаль
            if (trim(strip_tags($descField)) === '') {
                $descField = ($product->{'short_description_' . $langTag} ?? '') . '<br>' . ($product->{'description_' . $langTag} ?? '');
            }

            // Разрешаем только допустимые Google теги
            $allowedTags = '<b><strong><i><em><br><p><ul><ol><li><p>';
            $desc = strip_tags($descField, $allowedTags);

            // Ограничиваем длину (до 5000 символов)
            $desc = mb_substr(trim($desc), 0, 5000);

            // Добавляем как CDATA, чтобы сохранить теги
            $descriptionNode = $item->addChild('g:description', null, 'http://base.google.com/ns/1.0');
            $node = dom_import_simplexml($descriptionNode);
            $no = $node->ownerDocument;
            $node->appendChild($no->createCDATASection($desc));

            // link — SEF route к товару (как у тебя)
            $productcategory = (int) $product->main_category_id;
            if ($productcategory === 0) {
                $productcategory = $model->getMainCategory($product->product_id);
            }

            $sefPath = Helper::SEFLink(
                'index.php?option=com_jshopping&controller=product&task=view&category_id=' . $productcategory . '&product_id=' . $product->product_id,
                1
            );

            $base = Uri::root();

            if (strpos($sefPath, 'http') !== 0) {

                $productLink = rtrim($base, '/') . '/' . ltrim($sefPath, '/');
            } else {
                $productLink = $sefPath;
            }
            $item->addChild('g:link', htmlspecialchars($productLink), 'http://base.google.com/ns/1.0');

            // image_link — первая картинка или дефолт
            $imageLink = $defaultImageUrl;
            if (!empty($product->images) && is_array($product->images)) {
                // product->images может содержать пути, используем basename как в твоём YML
                $first = reset($product->images);
                if ($first) {
                    $imageLink = $imageUrlBase . basename($first);
                }
            } elseif (!empty($product->product_full_image)) {
                $imageLink = $imageUrlBase . basename($product->product_full_image);
            }
            $item->addChild('g:image_link', htmlspecialchars($imageLink), 'http://base.google.com/ns/1.0');

            // additional image links (до 10)
            if (!empty($product->images) && is_array($product->images)) {
                $extraImgs = $product->images;
                array_shift($extraImgs); // пропускаем первую — уже используется как image_link

                $count = 0;
                foreach ($extraImgs as $img) {
                    if ($count >= 10)
                        break; // максимум 10
                    $img = trim($img);
                    if ($img === '')
                        continue;

                    $imgUrl = $imageUrlBase . basename($img);
                    $item->addChild('g:additional_image_link', htmlspecialchars($imgUrl), 'http://base.google.com/ns/1.0');
                    $count++;
                }
            }

            // availability
            if ($product->product_quantity > 0) {
                $availability = 'in stock';
            } else {
                $availability = 'preorder';
            }
            $item->addChild('g:availability', $availability, 'http://base.google.com/ns/1.0');

            // если предзаказ — добавляем дату поступления через 3 дня
            if ($availability === 'preorder') {
                // вычисляем дату через 3 дня в ISO 8601
                $date = new DateTime('+3 days', new DateTimeZone('Europe/Kyiv'));
                $availabilityDate = $date->format('Y-m-d\TH:iP'); // пример: 2025-11-02T12:00+0200
                $item->addChild('g:availability_date', $availabilityDate, 'http://base.google.com/ns/1.0');
            }

            if (!empty($product->extra_fields)) {
                foreach ($product->extra_fields as $extra) {
                    $fieldId = (int) $extra['field_id'];
                    if ($fieldId === 7 && !empty($extra['value'])) {
                        $weight = trim($extra['value']);
                        // Удаляем всё кроме чисел и запятой/точки
                        $weight = preg_replace('/[^0-9\.,]/', '', $weight);
                        $weight = str_replace(',', '.', $weight);

                        if (is_numeric($weight) && $weight > 0) {
                            // Добавляем тег для Google Merchant
                            $item->addChild('g:unit_pricing_measure', $weight . 'g', 'http://base.google.com/ns/1.0');
                        }
                    }
                }
            }


            $categoryId = '';
            if ($categoryAggregatorMap[$product->main_category_id]) {
                $categoryId = $categoryAggregatorMap[$product->main_category_id];
            }
            if ($product->product_id == 54) {
                $categoryId = 428;
            }
            echo $categoryId;
            $item->addChild('g:google_product_category', $categoryId, 'http://base.google.com/ns/1.0');

            // brand / vendor
            $brand = 'HealthyDriedFood';
            $item->addChild('g:brand', $brand, 'http://base.google.com/ns/1.0');

            // gtin / mpn — если есть (попробуй из ean или product_ean)
            if (!empty($product->product_ean)) {
                $item->addChild('g:mpn', htmlspecialchars($product->product_ean), 'http://base.google.com/ns/1.0');
            } elseif (!empty($product->manufacturer_code)) {
                $item->addChild('g:mpn', htmlspecialchars($product->manufacturer_code), 'http://base.google.com/ns/1.0');
            }

            // condition — считаем new
            $item->addChild('g:condition', 'new', 'http://base.google.com/ns/1.0');

            // price — формат "123.45 UAH"
            $currencyId = (int) $product->currency_id;
            $currencyIso = 'UAH';
            // расчёт цены (как у тебя: +15 или extra field override)
            $price = (float) $product->product_price;

            $priceFormatted = number_format($price, 2, '.', '') . ' ' . $currencyIso;
            $item->addChild('g:price', $priceFormatted, 'http://base.google.com/ns/1.0');



            // google product category — можно попытаться подставить через твои категории, здесь пока category name
            $catName = '';
            if (!empty($productcategory) && isset($categoriesMap[$productcategory])) {
                $catName = $categoriesMap[$productcategory]->{'name_ru-RU'} ?? $categoriesMap[$productcategory]->name ?? '';
            } else {
                // fallback — категория из продукта
                $catName = '';
            }
            if ($catName !== '') {
                $item->addChild('g:google_product_category', htmlspecialchars($catName), 'http://base.google.com/ns/1.0');
            }

            // availability date / inventory — при желании можно добавить
            // shipping, tax и пр. — можно добавить при необходимости
        }

        // Сохраняем файл
        $path = JPATH_SITE . '/components/com_jshopping/files/importexport/google/';
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }
        
        $filePath = $path . $filename;

        // Записываем
        $xml->asXML($filePath);

        // Лог / вывод
        echo 'Google Feed успешно создан: ' . $filePath . '<br>';
        echo 'Всего товаров: ' . count($products) . '<br>';
        Factory::getApplication()->enqueueMessage('Google Feed успешно создан: ' . $filePath);
    }


    protected function createXml($filename = 'feed.xml')
    {
        $model = JSFactory::getModel('aggregator', 'Site');
        $categories = $model->getCategories();
        $languages = ['ru-RU' => 'ru', 'uk-UA' => 'uk'];

        //передваем ид с таблицы __jshopping_category_custom_values
        $categoryAggregator = $model->getCategoryCF(2);

        $currencies = $model->getCurrencies();
        // $products = $model->getProducts();

        $filters = [
            'base' => [
                'p.product_publish = 1',
                'p.product_quantity > 0'
            ],
            'include' => [
                'extra_field_29' => 178,
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
            'name' => 'Dobroznak',
            'url' => $shopUrl,
            'company' => 'Dobroznak'
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

            echo 'Product ID: ' . $product->product_id . '<br>';

            $product->unlimited == 1 ? $product->product_quantity = 25 : $product->product_quantity = $product->product_quantity;


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
            $currencyIso = isset($currencyMap[$currencyId]) ? $currencyMap[$currencyId] : 'UAH';
            $offer->addChild('currencyId', $currencyIso);

            $offer->addChild('stock_quantity', (int) $product->product_quantity);
            $offer->addChild('article', $product->manufacturer_code ?? $product->product_ean);
            $offer->addChild('name', htmlspecialchars($product->{'name_ru-RU'}));
            $offer->addChild('name_ua', htmlspecialchars($product->{'name_uk-UA'}));
            $offer->addChild('categoryId', (int) $productcategory);

            if (!empty($product->images) && is_array($product->images)) {
                foreach ($product->images as $image) {
                    $imageUrlFull = $imageUrl . basename($image);
                    $offer->addChild('picture', htmlspecialchars($imageUrlFull));
                }
            }
            $offer->addChild('vendor', 'Dobroznak');

            $description = $product->{'short_description_ru-RU'} . '<br>' . $product->{'description_ru-RU'};
            $descriptionUa = $product->{'short_description_uk-UA'} . '<br>' . $product->{'description_uk-UA'};

            $offer->addChildCData('description', $description);
            $offer->addChildCData('description_ua', $descriptionUa);

            if (!empty($product->extra_fields)) {
                $skipIds = [29, 30, 31];
                foreach ($product->extra_fields as $extra) {
                    if (in_array($extra['field_id'], $skipIds, true)) {
                        continue;
                    }


                    $paramName = htmlspecialchars(str_replace(' Rozetka', '', $extra['field_name']));
                    $paramValue = htmlspecialchars($extra['value']);
                    $offer->addChild('param', $paramValue)->addAttribute('name', $paramName);
                }
            }

        }

        // Куда сохраняем
        $path = JPATH_SITE . '/components/com_jshopping/files/importexport/imaudexportyml/';
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }

        $filePath = $path . $filename;

        $xml->asXML($filePath);
        echo 'XML успешно создан: ' . $filePath . '<br>';
        echo 'Всего товаров: ' . count($products);
        echo '<br>';

        Factory::getApplication()->enqueueMessage('XML успешно создан: ' . $filePath);

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