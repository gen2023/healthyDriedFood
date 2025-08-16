<?php
/**
 * @package    Joomla.Plugin.System.SortsProducts
 * @author     Sofona
 * @version    1.0.0
 * @license    GNU General Public License
 */

defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Database\DatabaseInterface;
use Joomla\CMS\Factory;

class plgJshoppingProductsSortsProducts extends JPlugin
{

    public function onBeforeQueryGetProductList(&$table, &$select, &$join, &$where, &$order, &$group)
    {
        $enableSortingCount = $this->params->get('enable_sorting_count', 1);

        if (!$enableSortingCount) {
            return;
        }

        $app = Factory::getApplication();

        if ($app->isClient('site')) {
            $userOrder = $app->input->getString('orderby', '');
            $userOrderDir = $app->input->getString('order', '');

            if (!empty($userOrder)) {
                return;
            }
        }

        $order = trim($order);

        $availabilitySort = '(prod.product_quantity <= 0) ASC';

        if (stripos($order, 'ORDER BY') === 0) {
            $order = "ORDER BY $availabilitySort, " . substr($order, 8);
        } else {
            $order = "ORDER BY $availabilitySort" . ($order ? ", $order" : "");
        }
    }


}