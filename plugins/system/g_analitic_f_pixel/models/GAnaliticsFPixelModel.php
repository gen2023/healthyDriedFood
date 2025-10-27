<?php

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Uri\Uri;
use Joomla\Database\DatabaseInterface;

class GAnaliticsFPixelModel
{
  public function getCatNamesFromProduct($category_id)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $lang = JSFactory::getLang(); 

    $category_names = [];

    $currentCategoryId = (int) $category_id;

    do {
      $query = $db->getQuery(true)
        ->select('`category_id`, `category_parent_id`, `' . $lang->get("name") . '` as name')
        ->from($db->quoteName('#__jshopping_categories', 'cat'))
        ->where($db->quoteName('category_id') . ' = ' . $currentCategoryId)
        ->where($db->quoteName('category_publish') . ' = 1');

      $db->setQuery($query);
      $category_info = $db->loadObject();

      if ($category_info) {
        $category_names[] = $category_info->name;
        $currentCategoryId = $category_info->category_parent_id;
      } else {
        break;
      }
    } while ($currentCategoryId > 0);

    return array_reverse($category_names);
  }

  public function getCurrenciesCode($currency_id)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $query = $db->getQuery(true)
      ->select('`currency_code`')
      ->from($db->quoteName('#__jshopping_currencies'))
      ->where($db->quoteName('currency_id') . ' = ' . $currency_id)
      ->where($db->quoteName('currency_publish') . ' = 1');

    $db->setQuery($query);
    return $db->loadResult();
  }

  public function getCategoryIdByProductId($product_id)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $query = $db->getQuery(true)
    ->select('category_id')
    ->from($db->quoteName('#__jshopping_products_to_categories'))
    ->where($db->quoteName('product_id') . ' = ' . (int) $product_id);
      

    $db->setQuery($query);
    return $db->loadResult();
  }

  public function getOrderProducts($order_id)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $query = $db->getQuery(true)
      ->select('oi.product_id, oi.product_name AS name, oi.product_quantity AS quantity, oi.product_item_price AS price')
      ->from('#__jshopping_order_item AS oi')
      ->where('oi.order_id = ' . (int) $order_id);

    $db->setQuery($query);

    return $db->loadAssocList();
  }
  public function getOrderTotals($order_id)
  {
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $query = $db->getQuery(true)
      ->select('order_total')
      ->from('#__jshopping_orders')
      ->where('order_id = ' . (int) $order_id);

    $db->setQuery($query);

    return $db->loadResult();
  }

  // public static function getCategoryNameById($id)
  // {
  //   $db = Factory::getContainer()->get(DatabaseInterface::class);
  //   $lang = Factory::getApplication()->getLanguage();

  //   $query = "SELECT `" . $lang->get("name") . "` as name FROM `#__jshopping_categories` "
  //     . "WHERE category_id=" . (int) $id;
  //   $db->setQuery($query);
  //   return $db->loadResult();
  // }
}

?>