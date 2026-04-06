<?php
defined('_JEXEC') or die;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\CMS\Language\Text;

class plgJshoppingadminVchasno_prro extends CMSPlugin
{

    public function onBeforeShowOrderListView(&$view)
    {
        $view->_tmp_cols_1 = '<th width="20">Создать чек</th>';

        ToolbarHelper::custom('vchasno.openShift', 'add', 'add', 'Открыть смену', false);

        if (!empty($view->rows)) {
            foreach ($view->rows as &$row) {

                if (!empty($row->vchasno_doc_code)) {
                    $row->_tmp_cols_1 = '<td class="center">✔</td>';
                    continue;
                }

                $link = 'index.php?option=com_jshopping&controller=vchasno&task=createReceipt&order_id=' . (int) $row->order_id;

                $row->_tmp_cols_1 = '
                <td class="center">
                    <a href="' . $link . '" title="Создать чек">
                        <span class="icon-file"></span>
                    </a>
                </td>
            ';
            }
        }
    }
}