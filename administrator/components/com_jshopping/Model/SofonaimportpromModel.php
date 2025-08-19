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
    public function getOrderProm($orderPromId)
    {
    $db = Factory::getDbo();

                $query = $db->getQuery(true)
            ->select('order_id')
            ->from($db->qn('#__jshopping_orders'))
            ->where($db->qn('id_order_prom') . ' = ' . $db->q($orderPromId));
        $db->setQuery($query);
        return $db->loadResult();
    }

        public function getProductByProductEan($product_ean)
    {
    $db = Factory::getDbo();

                $query = $db->getQuery(true)
            ->select('*')
            ->from($db->qn('#__jshopping_products'))
            ->where($db->qn('product_ean') . ' = ' . $db->q($product_ean));
        $db->setQuery($query);
        return $db->loadObject();
    }

    public function getProductByPromId($promId)
{
    $db = Factory::getDbo();

    $query = $db->getQuery(true)
        ->select('*')
        ->from($db->qn('#__jshopping_products'))
        ->where($db->qn('prom_id') . ' = ' . (int) $promId);

    $db->setQuery($query);
    return $db->loadObject();
}


}