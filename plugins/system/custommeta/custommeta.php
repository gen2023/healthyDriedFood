<?php

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Language\LanguageHelper;
use Joomla\CMS\Document\HtmlDocument;

class PlgSystemCustomMeta extends CMSPlugin
{
    protected $app;

    public function onAfterRender()
    {
        if (!$this->app->isClient('site')) {
            return;
        }

        $document = Factory::getDocument();
        if (!$document instanceof HtmlDocument) {
            return;
        }

        $buffer = $this->app->getBody();
        $langTag = $this->app->getLanguage()->getTag();
        $sitename = $this->app->get('sitename');
        $url = Uri::getInstance()->toString();
        $type = 'website';
        $image = Uri::root() . $this->params->get('default_image');
        $pageTitle = $document->getTitle();
        $metaDescription = $document->getMetaData('description') ?: $this->params->get('default_description');

        $input = $this->app->input;
        $view = $input->getCmd('view');
        $id = $input->getInt('id');
        $product_id = $input->getInt('product_id');
        $category_id = $input->getInt('category_id');

        try {
            if ($view === 'article' && $id) {
                [$pageTitle, $image] = $this->getArticleData($id, $pageTitle, $image);
            }

            if ($view === 'category') {
                if ($product_id > 0) {
                    [$pageTitle, $image] = $this->getProductData($product_id, $pageTitle, $image, $langTag);
                } elseif ($category_id > 0) {
                    [$pageTitle, $image] = $this->getJshoppingCategoryData($category_id, $pageTitle, $image, $langTag);
                } elseif ($id > 0) {
                    [$pageTitle, $image] = $this->getJoomlaCategoryData($id, $pageTitle, $image);
                }
            }
        } catch (\Exception $e) {
            Factory::getApplication()->enqueueMessage('Error loading meta data: ' . $e->getMessage(), 'error');
        }

        $activeMenu = Factory::getApplication()->getMenu()->getActive();
        if ($activeMenu) {
            $menuMetaDescription = $activeMenu->getParams()->get('menu-meta_description');

            if (!empty($menuMetaDescription)) {
                $metaDescription = $menuMetaDescription;
            }
        }

$ogTags = [
    '<meta property="og:type" content="' . htmlspecialchars((string) $type) . '" />',
    '<meta property="og:site_name" content="' . htmlspecialchars((string) $sitename) . '" />',
    '<meta property="og:title" content="' . htmlspecialchars((string) $pageTitle) . '" />',
    '<meta property="og:description" content="' . htmlspecialchars((string) $metaDescription) . '" />',
    '<meta property="og:image" content="' . htmlspecialchars((string) $image) . '" />',
    '<meta property="og:url" content="' . htmlspecialchars((string) $url) . '" />',
    '<meta property="og:locale" content="' . htmlspecialchars(str_replace('-', '_', $langTag)) . '" />',
];


        $languages = LanguageHelper::getLanguages('lang_code');
        foreach ($languages as $language) {
            if ($language->lang_code !== $langTag) {
                $ogTags[] = '<meta property="og:locale:alternate" content="' . str_replace('-', '_', $language->lang_code) . '" />';
            }
        }

        $buffer = preg_replace(
            '/<\/head\s*>/i',
            implode("\n", $ogTags) . "\n</head>",
            $buffer
        );

        $this->app->setBody($buffer);
    }

    protected function getArticleData(int $id, string $defaultTitle, string $defaultImage): array
    {
        $db = Factory::getDbo();
        $query = $db->getQuery(true)
            ->select('*')
            ->from('#__content')
            ->where('id = ' . $db->quote($id));
        $db->setQuery($query);
        $article = $db->loadObject();

        if (!$article) {
            return [$defaultTitle, $defaultImage];
        }

        $title = $article->title ?: $defaultTitle;
        $image = $defaultImage;

        $images = json_decode($article->images);
        if (!empty($images->image_intro)) {
            $image = Uri::root() . ltrim($images->image_intro, '/');
        } elseif (!empty($images->image_fulltext)) {
            $image = Uri::root() . ltrim($images->image_fulltext, '/');
        } else {
            $content = $article->introtext . $article->fulltext;
            preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $content, $matches);
            if (!empty($matches[1])) {
                $image = Uri::root() . ltrim($matches[1], '/');
            }
        }

        return [$title, $image];
    }

    protected function getProductData(int $productId, string $defaultTitle, string $defaultImage, string $langTag): array
    {
        $db = Factory::getDbo();
        $fieldName = 'name_' . $langTag;
        $query = $db->getQuery(true)
            ->select(['image', $db->quoteName($fieldName)])
            ->from('#__jshopping_products')
            ->where('product_id = ' . (int)$productId);
        $db->setQuery($query);
        $product = $db->loadObject();

        if (!$product) {
            return [$defaultTitle, $defaultImage];
        }

        $title = $product->{$fieldName} ?? $defaultTitle;
        $image = !empty($product->image)
            ? Uri::root() . 'components/com_jshopping/files/img_products/' . $product->image
            : $defaultImage;

        return [$title, $image];
    }

    protected function getJshoppingCategoryData(int $categoryId, string $defaultTitle, string $defaultImage, string $langTag): array
    {
        $db = Factory::getDbo();
        $fieldName = 'name_' . $langTag;
        $query = $db->getQuery(true)
            ->select(['category_image', $db->quoteName($fieldName)])
            ->from('#__jshopping_categories')
            ->where('category_id = ' . (int)$categoryId);
        $db->setQuery($query);
        $category = $db->loadObject();

        if (!$category) {
            return [$defaultTitle, $defaultImage];
        }

        $title = $category->{$fieldName} ?? $defaultTitle;
        $image = !empty($category->category_image)
            ? Uri::root() . 'components/com_jshopping/files/img_categories/' . $category->category_image
            : $defaultImage;

        return [$title, $image];
    }

    protected function getJoomlaCategoryData(int $categoryId, string $defaultTitle, string $defaultImage): array
    {
        $db = Factory::getDbo();
        $query = $db->getQuery(true)
            ->select(['title', 'params'])
            ->from('#__categories')
            ->where('id = ' . (int)$categoryId);
        $db->setQuery($query);
        $category = $db->loadObject();

        if (!$category) {
            return [$defaultTitle, $defaultImage];
        }

        $title = $category->title ?? $defaultTitle;
        $params = json_decode($category->params);
        $image = !empty($params->image)
            ? Uri::root() . ltrim($params->image, '/')
            : $defaultImage;

        return [$title, $image];
    }
}
