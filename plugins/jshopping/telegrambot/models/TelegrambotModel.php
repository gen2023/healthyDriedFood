<?php

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Database\DatabaseInterface;


class TelegrambotModel
{
    public function getOrderProduct($orderId)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true);
        $query->select('`product_name`, `product_quantity`, `product_attributes`,`product_ean`,`manufacturer_code`,`manufacturer`')
            ->from($db->quoteName('#__jshopping_order_item'))
            ->where($db->quoteName('order_id') . ' = ' . (int) $orderId);
        $db->setQuery($query);

        return $db->loadObjectList();
    }


    public function getShipping_method($id)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $lang = JSFactory::getLang();
        $query = "SELECT `" . $lang->get("name") . "` FROM `#__jshopping_shipping_method` WHERE `shipping_id`=" . (int) $id;
        $db->setQuery($query);

        return $db->loadResult();
    }


    public function getPayment_method($id)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $lang = JSFactory::getLang();
        $query = "SELECT `" . $lang->get("name") . "` FROM `#__jshopping_payment_method` WHERE `payment_id`=" . (int) $id;
        $db->setQuery($query);
        return $db->loadResult();
    }


    public function setOrderId($order_id)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->insert($db->quoteName('#__telegram_delayed_messages'))
            ->columns($db->quoteName(['order_id', 'created_at']))
            ->values($db->quote($order_id) . ', ' . $db->quote(date('Y-m-d H:i:s')));
        $db->setQuery($query);
        $db->execute();
    }


    public function getDelayedOrderId()
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select($db->quoteName(['order_id', 'created_at']))
            ->from($db->quoteName('#__telegram_delayed_messages'));
        $db->setQuery($query);

        return $db->loadObjectList();
    }


    public function getOrderInfo($orderId)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true);

        $query->select('o.order_id,o.shipping_method_id, o.payment_method_id, o.order_number, o.order_total, o.f_name, o.l_name, o.email, o.phone, 
                        i.product_name, i.product_quantity')
            ->from($db->quoteName('#__jshopping_orders', 'o'))
            ->innerJoin($db->quoteName('#__jshopping_order_item', 'i') . ' ON i.order_id = o.order_id')
            ->where('o.order_id = ' . (int) $orderId);

        $db->setQuery($query);
        $orderInfo = $db->loadObjectList();

        return $orderInfo[0];
    }


    public function clearDelayedMessages()
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true);
        $query->delete($db->quoteName('#__telegram_delayed_messages'));
        $db->setQuery($query);
        $db->execute();
    }

    public function getConfigsSettings()
    {
        $db = Factory::getContainer()->get('DatabaseDriver');

        $query = $db->getQuery(true)
            ->select($db->quoteName('value'))
            ->from($db->quoteName('#__jshopping_configs'))
            ->where($db->quoteName('key') . ' = ' . $db->quote('telegrambot_settings'));

        try {
            $result = $db->setQuery($query)->loadResult();
            return $result ? json_decode($result, true) : [];
        } catch (\Exception $e) {
            Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
            return [];
        }
    }

}

?>