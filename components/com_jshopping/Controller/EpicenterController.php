<?php

namespace Joomla\Component\Jshopping\Site\Controller;


use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Router\Route;


class EpicenterController extends BaseController
{
    public function display($cachable = false, $urlparams = false)
    {
        $this->createXml('epik.xml');
        echo '<br>';

        die('1111111111111111');
    }

    protected function createXml($filename = 'feed.xml')
    {
        $model = JSFactory::getModel('aggregator', 'Site');
        $categories = $model->getCategories();
        $languages = ['ru-RU' => 'ru', 'uk-UA' => 'uk'];

        //передваем ид с таблицы __jshopping_category_custom_values
        $categoryAggregator = $model->getCategoryCF(8);
        // $categoryAggregatorName = $model->getCategoryCF(6);

        // $currencies = $model->getCurrencies();


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
            'name' => 'Healthy Dried Food',
            'url' => $shopUrl,
            'company' => 'Healthy Dried Food'
        ];
        date_default_timezone_set('Europe/Kyiv');
        $date = date('Y-m-d H:i');
        $xml = new SimpleXMLExtended('<?xml version="1.0" encoding="UTF-8"?><yml_catalog date="' . $date . '"></yml_catalog>');

        $categoryAggregatorMap = [];
        foreach ($categoryAggregator as $promItem) {
            $categoryAggregatorMap[(int) $promItem->category_id] = $promItem->value;
        }



        $imageUrl = $shopUrl . 'components/com_jshopping/files/img_products/';

        $offers = $xml->addChild('offers');
        foreach ($products as $product) {

            $infoDopField = $model->getInfoDopField($product->product_id);
            if ((int) $infoDopField['view_epicentrm'] == 1)
                continue;

            echo 'Product ID: ' . $product->product_id . '<br>';
            // $product->unlimited == 1 ? $product->product_quantity = 25 : $product->product_quantity = $product->product_quantity;

            $offer = $offers->addChild('offer');
            $offer->addAttribute('id', $product->product_id);
            $offer->addAttribute('available', $product->product_quantity > 0 ? 'true' : 'false');

            $price = $product->product_price * 1.10;

            $offer->addChild('price', number_format($price, 2, '.', ''));

            $offer->addChild('availability', 'in_stock');

            $category_code = $infoDopField['category_epicentrm'];
            $category_name = $infoDopField['category_epicentrm_name'];
            $offer->addChild('category', $category_name)->addAttribute('code', $category_code);

            if (!empty($product->images) && is_array($product->images)) {
                $pictures = [];
                foreach ($product->images as $image) {
                    $pictures[] = $imageUrl . basename($image);
                }
                if (!empty($pictures)) {
                    $offer->addChild('picture', htmlspecialchars(implode(', ', $pictures)));
                }
            }

            $name_product_ru = $product->{'name_ru-RU'};
            $offer->addChild('name', htmlspecialchars($name_product_ru))->addAttribute('lang', 'ru');

            $name_product_uk = $product->{'name_uk-UA'};
            $offer->addChild('name', htmlspecialchars($name_product_uk))->addAttribute('lang', 'ua');

            $stockRu = '<p><strong>В наличии: ' . $product->product_quantity . '</strong></p><br>';
            $stockUa = '<p><strong>В наявності: ' . $product->product_quantity . '</strong></p><br>';
            $description = $stockRu;
            $descriptionUa = $stockUa;

            $description .= $product->{'description_ru-RU'};
            $descriptionUa .= $product->{'description_uk-UA'};

            $offer->addChildCData('description', $this->cleanDescription($description))->addAttribute('lang', 'ru');
            $offer->addChildCData('description', $this->cleanDescription($descriptionUa))->addAttribute('lang', 'ua');

            /* --------------------------------  */
            // $offer->addChild('attribute_set', 'qqqqqqqqqq')->addAttribute('code', '111');
            /* --------------------------------  */

            if (!empty($product->extra_fields)) {
                                $product->extra_fields[] = [
                    'field_name' => 'одиниця виміру',
                    'value' => 'г'
                ];
                foreach ($product->extra_fields as $extra) {
                    $epicParam = $this->getEpicParamByExtra(
                        $extra['field_name'],
                        'ua',
                        $category_code
                    );

                    if (!$epicParam) {
                        continue;
                    }

                    $param = $offer->addChild('param');

                    // тип характеристики
                    $map = $this->epicParamMap();
                    $type = $map[$epicParam['paramcode']]['type'] ?? 'string';

                    // добавляем значение
                    // добавляем значение напрямую в param через CDATA
                    if ($type === 'string' || $type === 'float' || $type === 'int') {
                        $value = $extra['value'];

                        if ($type === 'int') {
                            preg_match('/\d+/', $value, $matches);
                            $value = $matches[0] ?? 0;
                        } elseif ($type === 'float') {
                            $value = preg_replace('/[^0-9,\.]/', '', $value);
                            $value = str_replace(',', '.', $value);
                            $value = floatval($value);
                        }

                        // Вместо addChildCData($value) делаем CDATA в текущий узел
                        $node = dom_import_simplexml($param);
                        $dom = $node->ownerDocument;
                        $node->appendChild($dom->createCDATASection($value));
                    } else {
                        $param[0] = $extra['value']; // select/multiselect
                    }

                    $param->addAttribute('paramcode', $epicParam['paramcode']);
                    $param->addAttribute('name', $epicParam['name']);
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
    function cleanDescription($text)
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
    public function getCategorylistEpic()
    {
        $page = 1;
        $logFile = __DIR__ . '/epic_categories.log';

        file_put_contents($logFile, "=== Начало синхронизации: " . date('Y-m-d H:i:s') . " ===\n");

        do {
            $result = $this->getCategorylistEpicApi($page);

            file_put_contents($logFile, "Страница $page raw: " . json_encode($result) . "\n", FILE_APPEND);

            // проверяем правильное поле
            if (empty($result['items'])) {
                file_put_contents($logFile, "Страница $page пуста, прерываем цикл\n", FILE_APPEND);
                break;
            }

            foreach ($result['items'] as $category) {
                $titleUa = '';
                $titleRu = '';

                if (!empty($category['translations'])) {
                    foreach ($category['translations'] as $tr) {
                        if ($tr['languageCode'] === 'ua') {
                            $titleUa = $tr['title'];
                        }
                        if ($tr['languageCode'] === 'ru') {
                            $titleRu = $tr['title'];
                        }
                    }
                }

                $logLine = sprintf(
                    "[%s] Страница %d | Категория Code: %s | Name UA: %s | Name RU: %s | hasChild: %s\n",
                    date('Y-m-d H:i:s'),
                    $page,
                    $category['code'] ?? 'N/A',
                    $titleUa ?: 'N/A',
                    $titleRu ?: 'N/A',
                    isset($category['hasChild']) ? ($category['hasChild'] ? 'true' : 'false') : 'N/A'
                );

                file_put_contents($logFile, $logLine, FILE_APPEND);
            }



            $lastPage = $result['pages'] ?? $page;
            file_put_contents($logFile, "Страница $page обработана. Всего страниц: $lastPage\n", FILE_APPEND);

            $page++;
            usleep(150000); // защита от rate-limit
        } while ($page <= $lastPage);

        file_put_contents($logFile, "=== Конец синхронизации: " . date('Y-m-d H:i:s') . " ===\n", FILE_APPEND);
    }
    protected function getCategorylistEpicApi(int $page = 1)
    {
        $token = '5a6489d1a5c48c9d174bd31f2a0a8fd0';

        $url = 'https://api.epicentrm.com.ua/v2/pim/categories';

        // параметры запроса
        $params = [
            'page' => $page,
            'filter[hasChild]' => 'false'
        ];

        $url .= '?' . http_build_query($params);

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'Authorization: Bearer ' . $token,
            ],
            CURLOPT_TIMEOUT => 30,
        ]);

        $response = curl_exec($ch);

        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new RuntimeException('cURL error: ' . $error);
        }

        // Логируем raw ответ для отладки
        file_put_contents(__DIR__ . '/epic_categories.log', "Raw response for page $page: $response\n", FILE_APPEND);

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new RuntimeException(
                'Epicentr API error. HTTP ' . $httpCode . '. Response: ' . $response
            );
        }

        return json_decode($response, true);
    }

    // https://localhost/?option=com_jshopping&controller=epicenter&task=getAttributeSetsEpic&code=8575 ид категории
    public function getAttributeSetsEpic()
    {
        // получаем код атрибут-сета из URL
        $input = Factory::getApplication()->input;
        $code = $input->get('code', '', 'string');

        try {
            $attributeSets = $this->fetchAttributeSet($code);

            // возвращаем JSON
            header('Content-Type: application/json');
            echo json_encode($attributeSets, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            Factory::getApplication()->close();

        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
            Factory::getApplication()->close();
        }
    }

    protected function fetchAttributeSet(string $code)
    {
        $token = '5a6489d1a5c48c9d174bd31f2a0a8fd0';
        $url = 'https://api.epicentrm.com.ua/v2/pim/attribute-sets';
        $params = [
            'filter[codes][]' => $code,
            'page' => 1
        ];
        $url .= '?' . http_build_query($params);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'Authorization: Bearer ' . $token,
            ],
            CURLOPT_TIMEOUT => 30,
        ]);

        $response = curl_exec($ch);
        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new RuntimeException('cURL error: ' . $error);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new RuntimeException('Epicentr API error. HTTP ' . $httpCode . '. Response: ' . $response);
        }

        $result = json_decode($response, true);

        if (empty($result['items'])) {
            return [];
        }

        $attributeSet = $result['items'][0];

        // собираем UA и RU названия атрибутов
        foreach ($attributeSet['attributes'] as &$attr) {
            $titleUa = $titleRu = '';
            if (!empty($attr['translations'])) {
                foreach ($attr['translations'] as $tr) {
                    if ($tr['languageCode'] === 'ua')
                        $titleUa = $tr['title'];
                    if ($tr['languageCode'] === 'ru')
                        $titleRu = $tr['title'];
                }
            }
            $attr['titleUa'] = $titleUa;
            $attr['titleRu'] = $titleRu;
        }

        return $attributeSet;
    }

    function epicParamAliasesByCategory(): array
    {
        return [
            // Категория Code: 8575 | Name UA: Лікарська рослинна сировина | Name RU: Лекарственное растительное сырье | hasChild: false
            '8575' => [

                // системные
                'опис' => 'description',
                'модель виробника' => 'producer_code',
                'модель виробника (референцiя)' => 'producer_code',
                'штрих код' => 'barcodes',
                'одиниця виміру' => 'measure',
                'одиниця виміру та кількість' => 'measure',
                'мінімальна кратність товару' => 'ratio',
                'бренд' => 'brand',
                'країна' => 'country_of_origin',

                // вес (ВАЖНО)
                'загальна вага' => 'weight',

                // категорийные
                'склад' => '3060',
                'тип' => '5136',
                'упаковка' => '5344',

                // дополнительное
                'особливості' => '2771',

                // сервисные (обычно не передаются, но оставим)
                'обмін та повернення' => '14195',

                // размеры (если вдруг прилетают)
                'висота' => 'height',
                'глибина' => 'length',
                'ширина' => 'width',
            ],

            // Категория Code: 6288 | Name UA: М'ясні снеки | Name RU: Мясные снеки | hasChild: false
            '6288' => [

                // системные
                'одиниця виміру' => 'measure',
                'мінімальна кратність товару' => 'ratio',
                'штрих код' => 'barcodes',
                'бренд' => 'brand',
                'країна' => 'country_of_origin',

                // обязательные / модельные
                'загальна вага' => 'weight',

                // текстовые
                'склад' => '2857',
                'умови зберігання' => '2877',
                'опис' => 'description',

                // сроки хранения (ВАЖНО: есть 2 варианта!)
                'термін зберігання (міс)' => '12526', // месяцы
                'термін зберігання (днів)' => '2254',  // дни

                // селекты / фильтры
                'упаковка' => '12589',
                'смак' => '12632',
                'вид' => '12633',
                'основа' => '12635',

                // прочее
                'харчова та енергетична цінність' => '9301',
            ],

            // Категория Code: 6284 | Name UA: Чипси | Name RU: Чипсы | hasChild: false
            '6284' => [

                // системные (обязательные)
                'опис' => 'description',
                'модель виробника' => 'producer_code',
                'штрих код' => 'barcodes',
                'одиниця виміру' => 'measure',
                'мінімальна кратність товару' => 'ratio',
                'бренд' => 'brand',
                'країна' => 'country_of_origin',

                // вес
                'загальна вага' => 'weight',

                // состав / хранение
                'склад' => '2857',
                'умови зберігання' => '2877',

                // срок годности / хранения
                'термін придатності' => '7283',
                'термін зберігання' => '12526',

                // упаковка и свойства
                'упаковка' => '12589',
                'смак' => '12632',
                'вид' => '13110',
                'властивості продукту' => '6330',

                // дополнительное
                'особливості' => '2771',
                'харчова та енергетична цінність' => '9301',

                // размеры (если вдруг есть в extra_fields)
                'висота' => 'height',
                'ширина' => 'width',
                'глибина' => 'length',
            ],

            '5312' => [

                // системные / обязательные
                'опис' => 'description',
                'модель виробника' => 'producer_code',
                'модель виробника (референцiя)' => 'producer_code',
                'штрих код' => 'barcodes',
                'одиниця виміру' => 'measure',
                'одиниця виміру та кількість' => 'measure',
                'мінімальна кратність товару' => 'ratio',
                'бренд' => 'brand',
                'країна' => 'country_of_origin',

                // вес / масса
                'загальна вага' => 'weight',

                // состав (ВАЖНО: в категории есть ДВА поля "Склад")
                // обычно используем 2857 как основной
                'склад' => '2857',

                // упаковка и свойства
                'упаковка' => '12589',
                'вид' => '13110',
                'призначення' => '13306',
                'помел' => '13307',

                // срок хранения
                'термін зберігання' => '12616',

                // дополнительное
                'особливості' => '2771',
                'колекція' => '55',

                // размеры (если вдруг прилетают из extra_fields)
                'глибина' => 'length',
                'висота' => 'height',
                'ширина' => 'width',

                // сервисные (обычно не передаются, но оставляем на всякий)
                'обмін та повернення' => '14195',
            ],

            // Категория Code: 6069 | Name UA: Сухофрукти | Name RU: Сухофрукты | hasChild: false
            '6069' => [

                // системные
                'опис' => 'description',
                'модель виробника' => 'producer_code',
                'модель виробника (референцiя)' => 'producer_code',
                'штрих код' => 'barcodes',
                'одиниця виміру' => 'measure',
                'одиниця виміру та кількість' => 'measure',
                'мінімальна кратність товару' => 'ratio',
                'бренд' => 'brand',
                'країна' => 'country_of_origin',

                // вес
                'загальна вага' => 'weight',

                // состав и пищевая ценность
                'склад' => '2857',
                'харчова та енергетична цінність' => '9301',

                // упаковка и хранение
                'упаковка' => '5344',
                'умови зберігання' => '2877',
                'температура зберігання' => '2883',
                'термін зберігання' => '7283',

                // классификация
                'тип' => '12625',
                'вид' => '13110',

                // дополнительное
                'особливості' => '2771',

                // сервисные
                'обмін та повернення' => '14195',
                'країна реєстрації бренду' => '404',

                // размеры (если прилетают)
                'висота' => 'height',
                'глибина' => 'length',
                'ширина' => 'width',
            ],

            // Категория Code: 6068 | Name UA: Горіхи | Name RU: Орехи | hasChild: false
            '6068' => [

                // системные
                'опис' => 'description',
                'модель виробника' => 'producer_code',
                'модель виробника (референцiя)' => 'producer_code',
                'штрих код' => 'barcodes',
                'одиниця виміру' => 'measure',
                'одиниця виміру та кількість' => 'measure',
                'мінімальна кратність товару' => 'ratio',
                'бренд' => 'brand',
                'країна' => 'country_of_origin',

                // вес
                'загальна вага' => 'weight',

                // состав и пищевая ценность
                'склад' => '2857',
                'харчова та енергетична цінність' => '9301',

                // упаковка и хранение
                'упаковка' => '5344',
                'умови зберігання' => '2877',
                'температура зберігання' => '2883',
                'термін зберігання' => '7283',

                // классификация
                'вид' => '13110',
                'шкаралупа' => '905',
                'форма випуску' => '931',
                'тип оброблення' => '1431',
                'смак' => '12632',

                // дополнительное
                'особливості' => '2771',

                // сервисные
                'обмін та повернення' => '14195',
                'країна реєстрації бренду' => '404',

                // размеры (если прилетают)
                'висота' => 'height',
                'глибина' => 'length',
                'ширина' => 'width',
            ],

        ];
    }
    function epicParamMap(): array
    {
        return [
            // системные
            'description' => ['ru' => 'Описание', 'ua' => 'Опис', 'type' => 'text'],
            'producer_code' => ['ru' => 'Модель производителя', 'ua' => 'Модель виробника', 'type' => 'string'],
            'barcodes' => ['ru' => 'Штрих-код', 'ua' => 'Штрих код', 'type' => 'array'],
            'measure' => ['ru' => 'Единица измерения', 'ua' => 'Одиниця виміру та кількість', 'type' => 'select'],
            'ratio' => ['ru' => 'Минимальная кратность', 'ua' => 'Мінімальна кратність товару', 'type' => 'float'],
            'brand' => ['ru' => 'Бренд', 'ua' => 'Бренд', 'type' => 'select'],
            'country_of_origin' => ['ru' => 'Страна-производитель', 'ua' => 'Країна-виробник', 'type' => 'select'],

            // вес / масса
            'weight' => ['ru' => 'Вес', 'ua' => 'Вага', 'type' => 'float'],
            '12591' => ['ru' => 'Масса', 'ua' => 'Маса', 'type' => 'select'],

            // состав / ингредиенты
            '2857' => ['ru' => 'Состав', 'ua' => 'Склад', 'type' => 'text'],
            '2858' => ['ru' => 'Состав', 'ua' => 'Склад', 'type' => 'text'],
            '3060' => ['ru' => 'Состав', 'ua' => 'Склад', 'type' => 'text'],

            // упаковка / свойства
            '5344' => ['ru' => 'Упаковка', 'ua' => 'Упаковка', 'type' => 'multiselect'],
            '12589' => ['ru' => 'Упаковка', 'ua' => 'Упаковка', 'type' => 'select'],
            '6330' => ['ru' => 'Свойства продукта', 'ua' => 'Властивості продукту', 'type' => 'multiselect'],
            '13110' => ['ru' => 'Вид', 'ua' => 'Вид', 'type' => 'multiselect'],
            '13306' => ['ru' => 'Назначение', 'ua' => 'Призначення', 'type' => 'multiselect'],
            '13307' => ['ru' => 'Помол', 'ua' => 'Помел', 'type' => 'select'],
            '12632' => ['ru' => 'Вкус', 'ua' => 'Смак', 'type' => 'select'],

            // сроки хранения
            '12526' => ['ru' => 'Срок хранения (мес.)', 'ua' => 'Термін зберігання (міс)', 'type' => 'float'],
            '2254' => ['ru' => 'Срок хранения (дни)', 'ua' => 'Термін зберігання (днів)', 'type' => 'float'],
            '12616' => ['ru' => 'Срок хранения', 'ua' => 'Термін зберігання', 'type' => 'float'],
            '7283' => ['ru' => 'Срок годности', 'ua' => 'Термін придатності', 'type' => 'float'],

            // условия хранения
            '2877' => ['ru' => 'Условия хранения', 'ua' => 'Умови зберігання', 'type' => 'text'],
            '2883' => ['ru' => 'Температура хранения', 'ua' => 'Температура зберігання', 'type' => 'text'],
            '2886' => ['ru' => 'Условия хранения', 'ua' => 'Умови зберігання', 'type' => 'text'],

            // дополнительные характеристики
            '2771' => ['ru' => 'Дополнительные характеристики', 'ua' => 'Додаткові характеристики', 'type' => 'text'],

            // сервисные
            '14195' => ['ru' => 'Обмен и возврат', 'ua' => 'Обмін та повернення', 'type' => 'select'],
            '404' => ['ru' => 'Страна регистрации бренда', 'ua' => 'Країна реєстрації бренду', 'type' => 'select'],

            // размеры
            'height' => ['ru' => 'Высота', 'ua' => 'Висота', 'type' => 'float'],
            'width' => ['ru' => 'Ширина', 'ua' => 'Ширина', 'type' => 'float'],
            'length' => ['ru' => 'Глубина', 'ua' => 'Глибина', 'type' => 'float'],

            // дополнительные классификации
            '905' => ['ru' => 'Скорлупа', 'ua' => 'Шкаралупа', 'type' => 'select'],
            '931' => ['ru' => 'Форма выпуска', 'ua' => 'Форма випуску', 'type' => 'select'],
            '1431' => ['ru' => 'Тип обработки', 'ua' => 'Тип обробки', 'type' => 'multiselect'],
        ];
    }

    /**
     * Получаем Epicentr-параметр по имени extra field + категории
     */
    function getEpicParamByExtra(string $extraName, string $lang = 'ua', string $categoryCode)
    {
        $aliasesByCat = $this->epicParamAliasesByCategory();
        $map = $this->epicParamMap();

        $extraKey = mb_strtolower(trim($extraName));

        // 1️⃣ есть ли такая категория
        if (!isset($aliasesByCat[$categoryCode])) {
            return null;
        }

        // 2️⃣ есть ли алиас в категории
        if (!isset($aliasesByCat[$categoryCode][$extraKey])) {
            return null;
        }

        $paramCode = $aliasesByCat[$categoryCode][$extraKey];

        // 3️⃣ есть ли paramcode в Epicentr map
        if (!isset($map[$paramCode])) {
            return null;
        }

        return [
            'paramcode' => $paramCode,
            'name' => $map[$paramCode][$lang] ?? $extraName,
        ];
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
