<?php
namespace Joomla\Component\Jshopping\Administrator\Model;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Application\ApplicationHelper;
use Joomla\Component\Jshopping\Site\Helper\Error as JSError;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\Component\Jshopping\Site\Lib\UploadFile;
use Joomla\Component\Jshopping\Site\Lib\ImageLib;

class ProductsQuickEditModel extends BaseDatabaseModel
{
  public function getAllProducts()
  {
    $db = $this->getDbo();
    $query = $db->getQuery(true)
      ->select('*')
      ->from($db->quoteName('#__jshopping_products'));
    $db->setQuery($query);
    return $db->loadObjectList();
  }

  function publish(array $cid, $flag)
  {
    $dispatcher = Factory::getApplication();
    $dispatcher->triggerEvent('onBeforePublishProduct', array(&$cid, &$flag));
    foreach ($cid as $id) {
      $this->publishProduct($id, $flag);
    }
    $dispatcher->triggerEvent('onAfterPublishProduct', array(&$cid, &$flag));
  }
  function publishProduct($id, $flag)
  {
    $db = Factory::getDBO();
    $query = "UPDATE `#__jshopping_products` SET `product_publish`=" . (int) $flag . " "
      . "WHERE `product_id`=" . (int) $id;
    $db->setQuery($query);
    $db->execute();
  }
  function deleteList(array $cid, $msg = 1)
  {
    $app = Factory::getApplication();
    $res = array();
    $dispatcher = Factory::getApplication();
    $dispatcher->triggerEvent('onBeforeRemoveProduct', array(&$cid));
    foreach ($cid as $id) {
      $this->delete($id);
      if ($msg) {
        $app->enqueueMessage(sprintf(Text::_('JSHOP_PRODUCT_DELETED'), $id), 'message');
      }
      $res[$id] = true;
    }
    $dispatcher->triggerEvent('onAfterRemoveProduct', array(&$cid));
    return $res;
  }
  function delete($pid)
  {
    if (!$pid) {
      return 0;
    }
    $jshopConfig = JSFactory::getConfig();
    $db = Factory::getDBO();

    $product = JSFactory::getTable('product');
    $product->load($pid);
    $query = "DELETE FROM `#__jshopping_products` WHERE `product_id` = '" . $db->escape($pid) . "' or `parent_id` = '" . $db->escape($pid) . "' ";
    $db->setQuery($query);
    $db->execute();

    $query = "DELETE FROM `#__jshopping_products_attr` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    $query = "DELETE FROM `#__jshopping_products_attr2` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    $query = "DELETE FROM `#__jshopping_products_prices` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    $query = "DELETE FROM `#__jshopping_products_relations` WHERE `product_id` = '" . $db->escape($pid) . "' OR `product_related_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    $query = "DELETE FROM `#__jshopping_products_to_categories` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    $query = "DELETE FROM `#__jshopping_products_to_extra_fields` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    $images = $product->getImages();
    $videos = $product->getVideos();
    $files = $product->getFiles();

    if (count($images)) {
      foreach ($images as $image) {
        $query = "select count(*) as k from #__jshopping_products_images where image_name='" . $db->escape($image->image_name) . "' and product_id!='" . $db->escape($pid) . "'";
        $db->setQuery($query);
        if (!$db->loadResult()) {
          @unlink(Helper::getPatchProductImage($image->image_name, 'thumb', 2));
          @unlink(Helper::getPatchProductImage($image->image_name, '', 2));
          @unlink(Helper::getPatchProductImage($image->image_name, 'full', 2));
        }
      }
    }

    $query = "DELETE FROM `#__jshopping_products_images` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    if (count($videos)) {
      foreach ($videos as $video) {
        $query = "select count(*) as k from #__jshopping_products_videos where video_name='" . $db->escape($video->video_name) . "' and product_id!='" . $db->escape($pid) . "'";
        $db->setQuery($query);
        if (!$db->loadResult()) {
          @unlink($jshopConfig->video_product_path . "/" . $video->video_name);
          if ($video->video_preview) {
            @unlink($jshopConfig->video_product_path . "/" . $video->video_preview);
          }
        }
      }
    }

    $query = "DELETE FROM `#__jshopping_products_videos` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    if (count($files)) {
      foreach ($files as $file) {
        $query = "select count(*) as k from #__jshopping_products_files where demo='" . $db->escape($file->demo) . "' and product_id!='" . $db->escape($pid) . "'";
        $db->setQuery($query);
        if (!$db->loadResult()) {
          @unlink($jshopConfig->demo_product_path . "/" . $file->demo);
        }

        $query = "select count(*) as k from #__jshopping_products_files where file='" . $db->escape($file->file) . "' and product_id!='" . $db->escape($pid) . "'";
        $db->setQuery($query);
        if (!$db->loadResult()) {
          @unlink($jshopConfig->files_product_path . "/" . $file->file);
        }
      }
    }

    $query = "DELETE FROM `#__jshopping_products_files` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();

    $query = "DELETE FROM `#__jshopping_products_free_attr` WHERE `product_id` = '" . $db->escape($pid) . "'";
    $db->setQuery($query);
    $db->execute();
  }
  public function updateQuantity($productId, $quantity, $unlimit)
  {
    $db = \Joomla\CMS\Factory::getDbo();
    $query = $db->getQuery(true)
      ->update($db->quoteName('#__jshopping_products'))
      ->set([
        $db->quoteName('product_quantity') . ' = ' . (float) $quantity,
        $db->quoteName('unlimited') . ' = ' . (int) $unlimit
      ])
      ->where($db->quoteName('product_id') . ' = ' . (int) $productId);

    $db->setQuery($query);
    return $db->execute();
  }

  public function updatePrice($productId, $price)
  {
    $db = \JFactory::getDBO();
    $query = "UPDATE #__jshopping_products SET product_price = " . $db->quote($price) . " WHERE product_id = " . (int) $productId;
    $db->setQuery($query);

    try {
      $db->execute();
      return true;
    } catch (\Exception $e) {
      return false;
    }
  }
  public function updateAddPrice($productId, $priceId, $price)
  {
    $db = \JFactory::getDbo();

    $query = $db->getQuery(true)
      ->update($db->qn('#__jshopping_products_prices'))
      ->set($db->qn('discount') . ' = ' . $db->quote($price))
      ->where($db->qn('price_id') . ' = ' . (int) $priceId)
      ->where($db->qn('product_id') . ' = ' . (int) $productId);

    $db->setQuery($query);

    try {
      $db->execute();
      return true;
    } catch (\Exception $e) {
      return false;
    }
  }

  public function getuserGroup()
  {
    $db = Factory::getDBO();
    $query = "select * from #__jshopping_usergroups";
    $db->setQuery($query);
    $result = $db->loadObjectList();

    return $result;
  }

}
