<?php

namespace Sofona\Component\ExportXml\Site\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use SimpleXMLElement;
use Joomla\CMS\Uri\Uri;
use Sofona\Component\ExportXml\Site\Model\ProductModel;
// use JSHelper;
use Joomla\Component\Jshopping\Site\Helper\Helper as JSHelper;


/**
 * @package     com_exportxml
 *
 * @copyright   Copyright (C) 2020 Sofona. All rights reserved.
 * @license     GNU General Public License version 3; see LICENSE
 */

/**
 * ExportXml Component Controller
 * @since  1.0.2
 */
class DisplayController extends BaseController
{

    public function display($cachable = false, $urlparams = array())
    {
        $view = $this->getView('Export', type: 'html');
        $view->display();
    }

    public function export_googleshop()
    {
        $this->exportXml('googleshop');
    }

    public function export_prom()
    {
        $this->exportXml('prom');
    }

    public function export_rozetka()
    {
        $this->exportXml('rozetka');
    }

    public function exportXml($type)
    {
        $settings = $this->getComponentSettings();
        if (!$settings->{'enable_' . $type}) {
            return;
        }
        if (!defined('JPATH_JOOMSHOPPING'))
            define('JPATH_JOOMSHOPPING', JPATH_ROOT . '/components/com_jshopping');

        $jshopConfig = JSFactory::getMainVendor();
        $model = new ProductModel();
        $products = $model->getActiveProducts();

        // echo '<pre>';var_dump($products[0]);die;

        $languages = ($settings->{$type . '_lang'} == 0)
            ? [$settings->{$type . '_selectlang'}]
            : array_column($model->getActiveLang(), 'language');

        $excludeSalesPrice = $settings->{$type . '_exclude__sales_price'};
        $siteName = $jshopConfig->shop_name;
        $currency = JSHelper::getMainCurrencyCode();
        $siteUrl = rtrim(Uri::root(), '/');
        $execult = $model->getExecult($type);
        $excludedProducts = array_column($execult, 'product_id');
        $excludedCategories = array_column($execult, 'category_id');
        $manufacturer_default = $settings->googleshop_manufacturer;
        $categoryShop = $model->getCategoriesShop();
        $binding = $model->getBindings($type);
        $extraFields = $model->getExtraFields();
        $selectParamsProduct = $model->getParamsProduct($type);

        // var_dump($selectParamsProduct);die;

        $categoryMap = [];
        $productMap = [];

        if ($type === 'googleshop') {
            $setting_availability = $settings->{$type . '_availability'} == 0 ? $settings->{$type . '_availability_status'} : 'in_stock';
            foreach ($binding as $item) {
                if (!empty($item['category_id'])) {
                    $categoryMap[$item['category_id']] = $item['google_base_category_id'];
                }
                if (!empty($item['product_id'])) {
                    $productMap[$item['product_id']] = $item['google_base_category_id'];
                }
            }

            foreach ($languages as $lang_xml) {
                foreach ($products as $key => &$product) {
                    $productId = $product['product_id'];
                    $categoryId = $product['main_category_id'];

                    $isExcludedProduct = in_array($productId, $excludedProducts);
                    $isExcludedCategory = in_array($categoryId, $excludedCategories);
                    // $isInBinding = isset($productMap[$productId]) || isset($categoryMap[$categoryId]);
                    $isInBinding = isset($productMap[$productId]);

                    if (($isExcludedProduct || $isExcludedCategory) && !$isInBinding) {
                        unset($products[$key]);
                        continue;
                    }

                    if ($excludeSalesPrice == 1) {
                        $product['product_old_price'] = 0;
                    }

                    if ($product['product_manufacturer_id'] != 0) {
                        $resultManufacturer = $model->getManufacturerNameById($product['product_manufacturer_id']);
                        $product['manufacturer_name'] = $resultManufacturer['name_' . $lang_xml];
                    } else {
                        $product['manufacturer_name'] = $manufacturer_default;
                    }

                    $product['google_product_category'] = $productMap[$productId] ?? $categoryMap[$categoryId] ?? '0';

                    $categoryPaths = $model->buildCategoryPaths($categoryId);
                    $langKey = 'name_' . $lang_xml;
                    $product['product_type'] = $categoryPaths[$langKey] ?? '';

                    //Добавление параметров продукта
                    $product['extra_fields'] = $this->formatExtraFields($product, $extraFields, $selectParamsProduct, $model, $langKey, 'google_param');

                    //TODO - В процессе
                    // if($product['product_attr']){
                    //     $products[count($products)+1]=$this->cloneProduct($product, $lang_xml);
                    // }
                    // echo'<pre>';var_dump($product);die;

                }
                unset($product);

                $xml = $this->generateXmlGoogleShop($products, $siteName, $siteUrl, $lang_xml, $currency, $setting_availability);

                $this->saveAndOutputXml($settings, $type, $xml, $lang_xml, count($languages) === 1);
            }
        }
        if ($type === 'prom') {
            $setting_availability = $settings->{$type . '_availability'} == 0 ? $settings->{$type . '_availability_status'} : 'true';

            foreach ($products as &$product) {
                foreach ($binding as $bind) {
                    if ($product['product_id'] == $bind['product_id']) {
                        $product['main_category_id'] = $bind['category_id'];
                        break;
                    }
                }
            }
            unset($product);

            foreach ($languages as $lang_xml) {
                foreach ($products as $key => &$product) {
                    $productId = $product['product_id'];
                    $categoryId = $product['main_category_id'];

                    $isExcludedProduct = in_array($productId, $excludedProducts);
                    $isExcludedCategory = in_array($categoryId, $excludedCategories);
                    // $isInBinding = array_search($productId, array_column($binding, 'product_id')) !== false;

                    if ($isExcludedProduct || $isExcludedCategory) {
                        // if (($isExcludedProduct || $isExcludedCategory) && !$isInBinding) {
                        unset($products[$key]);
                        continue;
                    }

                    if ($excludeSalesPrice == 1) {
                        $product['product_old_price'] = 0;
                    }

                    if ($product['product_manufacturer_id'] != 0) {
                        $resultManufacturer = $model->getManufacturerNameById($product['product_manufacturer_id']);
                        $product['manufacturer_name'] = $resultManufacturer['name_' . $lang_xml];
                    } else {
                        $product['manufacturer_name'] = $manufacturer_default;
                    }

                    $categoryPaths = $model->buildCategoryPaths($categoryId);
                    $langKey = 'name_' . $lang_xml;
                    $product['product_type'] = $categoryPaths[$langKey] ?? '';

                    $product['extra_fields'] = $this->formatExtraFields($product, $extraFields, $selectParamsProduct, $model, $langKey);

                }
            }
            unset($product);

            $xml = $this->generateXmlProm(
                $products,
                $siteName,
                $siteUrl,
                $languages,
                $currency,
                $setting_availability,
                $categoryShop
            );

            if ($settings->{$type . '_enable_file'} == 1) {
                $filename = !empty($settings->{$type . '_name_file'})
                    ? $settings->{$type . '_name_file'}
                    : "{$type}";

                $filepath = JPATH_ROOT . '/' . $filename . '.xml';
                file_put_contents($filepath, $xml);
            }

            header('Content-Type: application/xml; charset=utf-8');
            echo $xml;
            exit;
        }
        if ($type === 'rozetka') {
            $setting_availability = $settings->{$type . '_availability'} == 0 ? $settings->{$type . '_availability_status'} : 'true';

            foreach ($products as &$product) {
                foreach ($binding as $bind) {
                    if ($product['product_id'] == $bind['product_id']) {
                        $product['main_category_id'] = $bind['category_id'];
                        break;
                    }
                }
            }
            unset($product);

            foreach ($languages as $lang_xml) {
                foreach ($products as $key => &$product) {
                    $productId = $product['product_id'];
                    $categoryId = $product['main_category_id'];

                    $isExcludedProduct = in_array($productId, $excludedProducts);
                    $isExcludedCategory = in_array($categoryId, $excludedCategories);
                    $isInBinding = array_search($productId, array_column($binding, 'product_id')) !== false;

                    if (($isExcludedProduct || $isExcludedCategory) && !$isInBinding) {
                        unset($products[$key]);
                        continue;
                    }

                    if ($excludeSalesPrice == 1) {
                        $product['product_old_price'] = 0;
                    }

                    if ($product['product_manufacturer_id'] != 0) {
                        $resultManufacturer = $model->getManufacturerNameById($product['product_manufacturer_id']);
                        $product['manufacturer_name'] = $resultManufacturer['name_' . $lang_xml];
                    } else {
                        $product['manufacturer_name'] = $manufacturer_default;
                    }

                    $categoryPaths = $model->buildCategoryPaths($categoryId);
                    $langKey = 'name_' . $lang_xml;
                    $product['product_type'] = $categoryPaths[$langKey] ?? '';

                    $product['extra_fields'] = $this->formatExtraFields($product, $extraFields, $selectParamsProduct, $model, $langKey);
                }
            }
            unset($product);


            $xml = $this->generateXmlRozetka(
                $products,
                $siteName,
                $siteUrl,
                $languages,
                $currency,
                $setting_availability,
                $categoryShop
            );

            if ($settings->{$type . '_enable_file'} == 1) {
                $filename = !empty($settings->{$type . '_name_file'})
                    ? $settings->{$type . '_name_file'}
                    : "{$type}";

                $filepath = JPATH_ROOT . '/' . $filename . '.xml';
                file_put_contents($filepath, $xml);
            }

            header('Content-Type: application/xml; charset=utf-8');
            echo $xml;
            exit;
        }
    }

    private function saveAndOutputXml($settings, $type, $xml, $lang_xml, $isSingleLang)
    {
        if ($settings->{$type . '_enable_file'} == 1) {
            $filename = $settings->{$type . '_name_file'}
                ? $settings->{$type . '_name_file'} . ($isSingleLang ? '' : "_$lang_xml")
                : "{$type}" . ($isSingleLang ? '' : "_$lang_xml");

            $filepath = JPATH_ROOT . '/' . $filename . '.xml';
            file_put_contents($filepath, $xml);
        }

        if ($lang_xml === $settings->{$type . '_selectlang'}) {
            header('Content-Type: application/xml; charset=utf-8');
            echo $xml;
            exit;
        }
    }

    private function generateXmlGoogleShop($products, $siteName, $siteUrl, $lang_xml, $currency, $availability)
    {
        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"></rss>');
        $channel = $xml->addChild('channel');
        $channel->addChild('title', $siteName);
        $channel->addChild('link', $siteUrl);
        $channel->addChild('lastBuildDate', date('Y-m-d H:i'));

        foreach ($products as $product) {
            $productId = (int) $product['product_id'];
            $categoryId = (int) $product['main_category_id'];
            $productUrl = Uri::root() . ltrim(JSHelper::SEFLink("index.php?option=com_jshopping&controller=product&task=view&category_id={$categoryId}&product_id={$productId}", 1, 1), '/');
            $description = strip_tags($product['description_' . $lang_xml]);
            $description = mb_substr($description, 0, 5000, 'UTF-8');

            $image = '/components/com_jshopping/files/img_products/noimage.gif';
            if (file_exists(JPATH_ROOT . '/components/com_jshopping/files/img_products/' . $product['image'])) {
                $image = '/components/com_jshopping/files/img_products/' . $product['image'];
            } elseif (file_exists(JPATH_ROOT . '/components/com_jshopping/files/img_products/full_' . $product['image'])) {
                $image = '/components/com_jshopping/files/img_products/full_' . $product['image'];
            } elseif (file_exists(JPATH_ROOT . '/components/com_jshopping/files/img_products/thumb_' . $product['image'])) {
                $image = '/components/com_jshopping/files/img_products/thumb_' . $product['image'];
            }

            $item = $channel->addChild('item');

            $item->addChild('id', $product['product_id_c'] ?? $product['product_id'], 'http://base.google.com/ns/1.0');
            $item->addChild('title', $product['name_' . $lang_xml], 'http://base.google.com/ns/1.0');
            $item->addChild('description', htmlspecialchars($description), 'http://base.google.com/ns/1.0');
            $item->addChild('link', htmlspecialchars($productUrl), 'http://base.google.com/ns/1.0');
            $item->addChild('image_link', rtrim(Uri::root(), '/') . $image, 'http://base.google.com/ns/1.0');
            $item->addChild('availability', $availability, 'http://base.google.com/ns/1.0');

            if (!empty($product['product_old_price']) && $product['product_old_price'] > 0) {
                $item->addChild('price', number_format($product['product_old_price'], 2, '.', '') . ' ' . $currency, 'http://base.google.com/ns/1.0');
                $item->addChild('sale_price', number_format($product['product_price'], 2, '.', '') . ' ' . $currency, 'http://base.google.com/ns/1.0');
            } else {
                $item->addChild('price', number_format($product['product_price'], 2, '.', '') . ' ' . $currency, 'http://base.google.com/ns/1.0');
            }

            $item->addChild('google_product_category', $product['google_product_category'], 'http://base.google.com/ns/1.0');
            $item->addChild('product_type', $product['product_type'], 'http://base.google.com/ns/1.0');
            $item->addChild('brand', $product['manufacturer_name'], 'http://base.google.com/ns/1.0');
            $item->addChild('identifier_exists', 'no', 'http://base.google.com/ns/1.0');
            $item->addChild('condition', 'new', 'http://base.google.com/ns/1.0');

            foreach ($product['additional_images'] as $value) {
                $item->addChild('additional_image_link', $value, 'http://base.google.com/ns/1.0');
            }

            foreach ($product['extra_fields'] as $value) {
                foreach ($value as $key => $element) {
                    $item->addChild($key, $element, 'http://base.google.com/ns/1.0');
                }
            }
        }

        return $xml->asXML();
    }

    private function generateXmlProm($products, $siteName, $siteUrl, $languages, $currency, $availability, $categoryShop)
    {
        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><yml_catalog date="' . date('Y-m-d H:i') . '"></yml_catalog>');
        $shop = $xml->addChild('shop');
        $shop->addChild('name', htmlspecialchars($siteName));
        $shop->addChild('company', htmlspecialchars($siteName));
        $shop->addChild('url', htmlspecialchars($siteUrl));

        $currenciesNode = $shop->addChild('currencies');
        $currencyNode = $currenciesNode->addChild('currency');
        $currencyNode->addAttribute('id', $currency);
        $currencyNode->addAttribute('rate', '1');

        $categoriesNode = $shop->addChild('categories');
        foreach ($categoryShop as $value) {
            $category = $categoriesNode->addChild('category', htmlspecialchars($value['name_' . $languages[0]]));
            $category->addAttribute('id', $value['category_id']);
            if (!empty($value['parentID'])) {
                $category->addAttribute('parentId', $value['category_parent_id']);
            }
        }

        $offersNode = $shop->addChild('offers');
        foreach ($products as $product) {
            $item = $offersNode->addChild('offer');
            $item->addAttribute('id', $product['product_id']);
            $item->addAttribute('available', $availability ? 'true' : 'false');

            if (count($languages) > 1) {
                foreach ($languages as $lang) {
                    $langTag = ($lang === 'uk-UA') ? 'ua' : $lang;
                    $description = "<![CDATA[" . $product['description_' . $lang] . "]]>";
                    $item->addChild('name_' . $langTag, htmlspecialchars($product['name_' . $lang]));
                    $item->addChild('description_' . $langTag, $description);
                }
            } else {
                $lang = $languages[0];
                $description = "<![CDATA[" . $product['description_' . $lang] . "]]>";
                $item->addChild('name', htmlspecialchars($product['name_' . $lang]));
                $item->addChild('description', $description);
            }

            $item->addChild('price', number_format($product['product_price'], 2, '.', ''));
            $item->addChild('currencyId', $currency);
            $item->addChild('categoryId', $product['main_category_id']);
            $item->addChild('vendor', htmlspecialchars($product['manufacturer_name']));

            $image = '/components/com_jshopping/files/img_products/noimage.gif';
            if (!empty($product['image']) && file_exists(JPATH_ROOT . '/components/com_jshopping/files/img_products/' . $product['image'])) {
                $image = '/components/com_jshopping/files/img_products/' . $product['image'];
            }

            $item->addChild('picture', rtrim(Uri::root(), '/') . $image);
            foreach ($product['additional_images'] as $img) {
                $item->addChild('picture', htmlspecialchars($img));
            }

            foreach ($product['extra_fields'] as $value) {
                foreach ($value as $key => $element) {
                    $params = $item->addChild('param', $element);
                    $params->addAttribute('name', $key);
                }
            }

        }

        return $xml->asXML();
    }
    private function generateXmlRozetka($products, $siteName, $siteUrl, $languages, $currency, $availability, $categoryShop)
    {
        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><yml_catalog date="' . date('Y-m-d H:i') . '"></yml_catalog>');
        $shop = $xml->addChild('shop');
        $shop->addChild('name', htmlspecialchars($siteName));
        $shop->addChild('company', htmlspecialchars($siteName));
        $shop->addChild('url', htmlspecialchars($siteUrl));

        $currenciesNode = $shop->addChild('currencies');
        $currencyNode = $currenciesNode->addChild('currency');
        $currencyNode->addAttribute('id', $currency);
        $currencyNode->addAttribute('rate', '1');

        $categoriesNode = $shop->addChild('categories');
        foreach ($categoryShop as $value) {
            $category = $categoriesNode->addChild('category', htmlspecialchars($value['name_' . $languages[0]]));
            $category->addAttribute('id', $value['category_id']);
            if (!empty($value['parentID'])) {
                $category->addAttribute('parentId', $value['category_parent_id']);
            }
        }

        $offersNode = $shop->addChild('offers');
        foreach ($products as $product) {
            $item = $offersNode->addChild('offer');
            $item->addAttribute('id', $product['product_id']);
            $item->addAttribute('available', $availability ? 'true' : 'false');

            if (count($languages) > 1) {
                foreach ($languages as $lang) {
                    $langTag = ($lang === 'uk-UA') ? 'ua' : $lang;
                    $description = "<![CDATA[" . $product['description_' . $lang] . "]]>";
                    $item->addChild('name_' . $langTag, htmlspecialchars($product['name_' . $lang]));
                    $item->addChild('description_' . $langTag, $description);
                }
            } else {
                $lang = $languages[0];
                $description = "<![CDATA[" . $product['description_' . $lang] . "]]>";
                $item->addChild('name', htmlspecialchars($product['name_' . $lang]));
                $item->addChild('description', $description);
            }

            $item->addChild('price', number_format($product['product_price'], 2, '.', ''));
            $item->addChild('currencyId', $currency);
            $item->addChild('categoryId', $product['main_category_id']);
            $item->addChild('vendor', htmlspecialchars($product['manufacturer_name']));

            $image = '/components/com_jshopping/files/img_products/noimage.gif';
            if (!empty($product['image']) && file_exists(JPATH_ROOT . '/components/com_jshopping/files/img_products/' . $product['image'])) {
                $image = '/components/com_jshopping/files/img_products/' . $product['image'];
            }

            $item->addChild('picture', rtrim(Uri::root(), '/') . $image);
            foreach ($product['additional_images'] as $img) {
                $item->addChild('picture', htmlspecialchars($img));
            }

            foreach ($product['extra_fields'] as $value) {
                foreach ($value as $key => $element) {
                    $params = $item->addChild('param', $element);
                    $params->addAttribute('name', $key);
                }
            }
        }

        return $xml->asXML();
    }

    private function getComponentSettings()
    {
        $params = Factory::getApplication()->getParams();
        return $params->get('params', (object) []);
    }
    // private function getMainCurrencyCode()
    // {
    //     $jshopConfig = JSFactory::getConfig();
    //     $currency = JSFactory::getTable('currency');
    //     $currency->load($jshopConfig->mainCurrency);
    //     return $currency->currency_code_iso;
    // }

    private function formatExtraFields($product, $extraFields, $selectParamsProduct, $model, $langKey, $keyParams = '')
    {
        $extraFieldsFormatted = [];

        foreach ($product['extra_fields'] as $fieldKey => $fieldValue) {
            if (!str_starts_with($fieldKey, 'extra_field_'))
                continue;

            $fieldId = str_replace('extra_field_', '', $fieldKey);

            $param = array_filter($selectParamsProduct, fn($p) => $p['params'] == $fieldId);
            if (empty($param))
                continue;

            if ($keyParams == 'google_param') {
                $fieldName = reset($param)['google_param'];
            } else {
                $item_ef = array_filter($extraFields, fn($ef) => $ef['id'] == $fieldId);
                if (empty($item_ef))
                    continue;

                $item_ef = reset($item_ef);
                $fieldName = $item_ef[$langKey] ?? '';
            }

            $fieldValues = array_map('trim', explode(',', $fieldValue));
            $fieldValueTexts = array_map(
                fn($value) => ($text = $model->getExtraFieldsItems($value)) && !empty($text[0][$langKey]) ? $text[0][$langKey] : null,
                $fieldValues
            );

            $fieldValueTexts = array_filter($fieldValueTexts);

            if ($fieldValueTexts) {
                $extraFieldsFormatted[$fieldId][$fieldName] = implode(', ', $fieldValueTexts);
            }
        }

        return $extraFieldsFormatted;
    }

    public function cloneProduct($product, $lang_xml)
    {
        $newProduct = [];
        foreach ($product['product_attr'] as $key => $value) {
            $newProduct['product_id'] = $product['product_id'];
            $newProduct['product_id_c'] = $product['product_id'] . 'C';
            $newProduct['price'] = $value['price'];
            $newProduct['old_price'] = $value['old_price'];
            $newProduct['image'] = $product['image'];

            $newProduct['name_' . $lang_xml] = $product['name_' . $lang_xml] . ' ' . $value['info_attr']['name_' . $lang_xml];
            $newProduct['description_' . $lang_xml] = $product['description_' . $lang_xml];
        }

        return $newProduct;
    }

}
