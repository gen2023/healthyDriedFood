<?php

namespace Joomla\Component\Jshopping\Site\Controller;


use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Router\Route;


class MaudauController extends BaseController
{
    public function display($cachable = false, $urlparams = false)
    {
        $this->createXml('maudau.xml');
        echo '<br>';

        die('1111111111111111');
    }

    protected function createXml($filename = 'feed.xml')
    {
        $model = JSFactory::getModel('aggregator', 'Site');
        $categories = $model->getCategories();
        $languages = ['ru-RU' => 'ru', 'uk-UA' => 'uk'];

        //передваем ид с таблицы __jshopping_category_custom_values
        $categoryAggregator = $model->getCategoryCF(5);

        $currencies = $model->getCurrencies();

        $filters = [
            'base' => [
                'p.product_publish = 1',
                'p.product_quantity > 0'
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
        // foreach ($infoShop as $key => $value) {
        //     $shop->addChild($key, $value);
        // }
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
        foreach ($products as $product) {

            $infoDopField = $model->getInfoDopField($product->product_id);
            if ((int) $infoDopField['view_maudau'] == 1)
            continue;

            echo 'Product ID: ' . $product->product_id . '<br>';
            $product->unlimited == 1 ? $product->product_quantity = 25 : $product->product_quantity = $product->product_quantity;

            $offer = $offers->addChild('offer');
            $offer->addAttribute('id', $product->product_id);
            $offer->addAttribute('available', $product->product_quantity > 0 ? 'true' : 'false');

            $name_product_ru = $product->{'name_ru-RU'};
            $offer->addChild('name', htmlspecialchars($name_product_ru));
            $name_product_uk = $product->{'name_uk-UA'};
            $offer->addChild('name_ua', htmlspecialchars($name_product_uk));

            $maxLen = 10000;
            $description = $product->{'description_ru-RU'} ?? '';
            $descriptionUa = $product->{'description_uk-UA'} ?? '';
            $description = mb_substr($description, 0, $maxLen);
            $descriptionUa = mb_substr($descriptionUa, 0, $maxLen);
            $offer->addChild('description', htmlspecialchars($description));
            $offer->addChild('description_ua', htmlspecialchars($descriptionUa));

            $price = $product->product_price + 15;
            $offer->addChild('price', number_format($price, 2, '.', ''));

            $productcategory = $product->main_category_id;
            if ($product->main_category_id == 0) {
                $productcategory = $model->getMainCategory($product->product_id);
            }
            $offer->addChild('categoryId', (int) $productcategory);

            $offer->addChild('vendor', 'Healthy Dried Food');

            $country = '';
            foreach ($product->extra_fields as $extra) {
                if ($extra['field_id'] == 4 && $extra['value'] != '') {
                    $country = $extra['value'];
                }
            }
            if ($country !== '') {
                $offer->addChild('country', $country);
            }

            if (!empty($product->images) && is_array($product->images)) {
                foreach ($product->images as $image) {
                    $imageUrlFull = $imageUrl . basename($image);
                    $offer->addChild('picture', htmlspecialchars($imageUrlFull));
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
