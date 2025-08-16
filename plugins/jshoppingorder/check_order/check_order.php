<?php

defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;

class plgJshoppingorderCheck_order extends CMSPlugin
{
  public function onBeforeShowOrderListView(&$view)
  {
    $view->_tmp_cols_3 .= '<th>Счет</th>';
    foreach ($view->rows as $row) {
      $row->_tmp_cols_3 = '<td class="center">
    <a class="js_window_popup" patch="/administrator/index.php?option=com_jshopping&controller=invoice&task=show&order_id=' . $row->order_id . '" title="Счет">
        <i class="icon-print"></i>
    </a>
</td>';

    }
  }
}

