<?php
namespace Joomla\Component\Jshopping\Administrator\Model;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Database\DatabaseInterface;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;

defined('_JEXEC') or die;

class sofonaimportpromModel extends BaseadminModel
{
    public function getOrderInfoByPromId($orderPromId)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        $query = $db->getQuery(true)
            ->select('order_id, order_status')
            ->from($db->qn('#__jshopping_orders'))
            ->where($db->qn('id_order_prom') . ' = ' . $db->q($orderPromId));
        $db->setQuery($query);
        return $db->loadObject();
    }

    public function getProductByProductEan($product_ean)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        $query = $db->getQuery(true)
            ->select('*')
            ->from($db->qn('#__jshopping_products'))
            ->where($db->qn('product_ean') . ' = ' . $db->q($product_ean));
        $db->setQuery($query);
        return $db->loadObject();
    }

    public function getProductByPromId($promId)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        $query = $db->getQuery(true)
            ->select('*')
            ->from($db->qn('#__jshopping_products'))
            ->where($db->qn('prom_id') . ' = ' . (int) $promId);

        $db->setQuery($query);
        return $db->loadObject();
    }
    public function setEmailInOrder($orderId, $email)
    {

        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->update('#__jshopping_orders')
            ->set('email = ' . $db->quote($email))
            ->set('d_email = ' . $db->quote($email))
            ->where('order_id = ' . (int) $orderId);
        $db->setQuery($query)->execute();
    }

    public function updateOrderStatus($orderId, $status)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->update('#__jshopping_orders')
            ->set('order_status = ' . (int) $status)
            ->where('order_id = ' . (int) $orderId);
        $db->setQuery($query)->execute();
    }


}