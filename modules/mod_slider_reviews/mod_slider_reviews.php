<?php
/**
 * @package     Joomla.Module
 * @subpackage  mod_slider_reviews
 * @author      Sofona
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\Database\DatabaseInterface;

$limit = (int) $params->get('limit_reviews', 5);
$moduleclass = $params->get('moduleclass', '');

$db = Factory::getContainer()->get(DatabaseInterface::class);

// ============================
// 1. Получаем отзывы продуктов
// ============================
$query = $db->getQuery(true)
    ->select('review_id, user_name, mark, review, time, product_id')
    ->from($db->quoteName('#__jshopping_products_reviews'))
    ->where($db->quoteName('publish') . ' = 1')
    ->where($db->quoteName('product_id') . ' > 0')
    ->order($db->quoteName('review_id') . ' DESC')
    ->setLimit($limit);

$db->setQuery($query);
$reviewsProduct = $db->loadObjectList();

// ============================
// 2. Получаем отзывы магазина
// ============================
$query = $db->getQuery(true)
    ->select('review_id, user_name, mark, review, time, product_id')
    ->from($db->quoteName('#__jshopping_products_reviews'))
    ->where($db->quoteName('publish') . ' = 1')
    ->where($db->quoteName('product_id') . ' = -1')
    ->order($db->quoteName('review_id') . ' DESC')
    ->setLimit($limit);

$db->setQuery($query);
$reviewsShop = $db->loadObjectList();

// ============================
// 3. Объединяем массивы
// ============================
$allReviews = array_merge($reviewsProduct, $reviewsShop);

usort($allReviews, function ($a, $b) {
    return strtotime($b->time) <=> strtotime($a->time);
});

// ============================
// 4. Пересчёт статистики
// ============================
$totalMarks = 0;
$totalReviews = count($allReviews);
$ratingCounts = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];

foreach ($allReviews as &$review) {
    // Инициализация имени и цвета
    $review->initial = mb_substr(trim($review->user_name), 0, 1, 'UTF-8');

    $hex = '0123456789ABCDEF';
    $color = '#';
    for ($i = 0; $i < 6; $i++) {
        $color .= $hex[mt_rand(0, 15)];
    }
    $review->colorName = $color;

    // Пересчёт статистики
    $mark = (int)$review->mark;
    $totalMarks += $mark;

    if ($mark >= 9) {
        $ratingCounts[5]++;
    } elseif ($mark >= 7) {
        $ratingCounts[4]++;
    } elseif ($mark >= 5) {
        $ratingCounts[3]++;
    } elseif ($mark >= 3) {
        $ratingCounts[2]++;
    } else {
        $ratingCounts[1]++;
    }
}
unset($review);

// Средний рейтинг (делим на 2, если шкала 1-10)
$avgRating = $totalReviews > 0 ? ($totalMarks / $totalReviews) / 2 : 0;
$avgRatingRounded = round($avgRating, 1);
$avgRatingInt = round($avgRating);

// Процентное распределение
$percent = [];
if ($totalReviews > 0) {
    foreach ($ratingCounts as $star => $count) {
        $percent[$star] = round(($count / $totalReviews) * 100, 1);
    }
}

// Цвета для рейтинга
$colors = [
    5 => '#4CAF50',
    4 => '#8BC34A',
    3 => '#FFEB3B',
    2 => '#FF9800',
    1 => '#F44336',
];

// Переменные для шаблона
$reviewsTotal = $totalReviews;
$reviewsProductCount = count($reviewsProduct);
$reviewsShopCount = count($reviewsShop);

/** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
$wa = $app->getDocument()->getWebAssetManager();
$wa->registerAndUseStyle('mod_slider_reviews', 'mod_slider_reviews/style.css');
$wa->registerAndUseScript('mod_slider_reviews', 'mod_slider_reviews/script.js');

// Подключаем layout
require ModuleHelper::getLayoutPath('mod_slider_reviews', $params->get('layout', 'default'));
