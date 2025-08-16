<?php

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Document\Document;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Language\LanguageHelper;
use Joomla\CMS\Log\Log;

/** @var Document $document */
/** @var CMSApplicationInterface $app */

$app = Factory::getApplication();

$pageTitle = $document->getTitle();
$metaDescription = $document->getMetaData('description');
$sitename = $app->get('sitename');
$type = 'website';
$view = $app->input->get('view', '');
$id = $app->input->getInt('id', 0); 
$image = Uri::base() . 'media/templates/site/custom/images/favicon.png';
$url = Uri::current();
$title = !empty($pageTitle) ? $pageTitle : "default title";
$desc = !empty($metaDescription) ? $metaDescription : "default description";

if (!empty($view) && $view === 'article' && !empty($id)) {
    try {
        $db = Factory::getDbo();

        $query = $db->getQuery(true)
            ->select($db->quoteName(['images', 'title', 'introtext', 'fulltext']))
            ->from($db->quoteName('#__content'))
            ->where($db->quoteName('id') . ' = ' . (int)$id);

        $db->setQuery($query);
        $article = $db->loadObject();

        if ($article) {
            $images = json_decode($article->images);
            if (json_last_error() === JSON_ERROR_NONE && !empty($images->image_intro)) {
                $image = Uri::base() . $images->image_intro;
            } else {
                $content = $article->introtext . $article->fulltext;
                preg_match('/<img.*?src=["\'](.*?)["\'].*?>/i', $content, $matches);

                if (!empty($matches[1])) {
                    $image = Uri::base() . $matches[1];
                }
            }

            $title = $article->title;
        } else {
            throw new RuntimeException("Article with ID $id not found in the database.");
        }
    } catch (Exception $e) {
        $app->enqueueMessage('Error loading article: ' . $e->getMessage(), 'error');
    }
} else {
   $image = '/media/templates/site/custom/images/favicon.png';
}

$document->setMetaData('og:type', $type, 'property');
$document->setMetaData('og:site_name', $sitename, 'property');
$document->setMetaData('og:title', $title, 'property');
$document->setMetaData('og:description', $desc, 'property');
$document->setMetaData('og:image', $image, 'property');
$document->setMetaData('og:url', $url, 'property');
$currentLocale = str_replace('-', '_', $app->getLanguage()->getTag());
$document->setMetaData('og:locale', $currentLocale, 'property');

$languages = LanguageHelper::getLanguages('lang_code');
foreach ($languages as $language) {
    if ($language->lang_code !== $app->getLanguage()->getTag()) {
        $alternateLocale = str_replace('-', '_', $language->lang_code);
        $document->setMetaData('og:locale:alternate', $alternateLocale, 'property');
    }
}
