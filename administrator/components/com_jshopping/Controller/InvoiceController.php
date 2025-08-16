<?php
/**
 * @version      5.6.3 10.06.2025
 * @package      Jshopping
 * @license      GNU/GPL
 */


namespace Joomla\Component\Jshopping\Administrator\Controller;

use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Helper\SelectOptions;

defined('_JEXEC') or die();

class InvoiceController extends BaseadminController
{
  public function display($cachable = false, $urlparams = [])
  {
    Factory::getApplication()->input->set('hidemainmenu', true);
    $order_id = $this->input->getInt("order_id");
    $jshopConfig = JSFactory::getConfig();

    $order = JSFactory::getTable('order');
    $order->load($order_id);
    $order->prepareOrderPrint('invoice');

    $order->loadItemsNewDigitalProducts();
    $order_items = $order->getAllItems();

    $lists = SelectOptions::getOrderStatus();

    $orderStatus = '';
    foreach ($lists as $status) {
      if ($status->status_id == $order->order_status) {
        $orderStatus = $status->name;
        break;
      }
    }

    $stat_download = $order->getFilesStatDownloads(1);

    $view = $this->getView("invoice", 'html');
    $view->setLayout("default");

    $view->set('config', $jshopConfig);
    $view->set('order', $order);
    $view->set('orderStatus', $orderStatus);
    $view->set('order_items', $order_items);
    $view->set('lists', $lists);
    $view->set('stat_download', $stat_download);

    $view->display();
  }

  public function show()
  {
    $order_id = $this->input->getInt('order_id');
    if (!$order_id) {
      throw new \Exception('Order ID is required', 400);
    }

    $order = JSFactory::getTable('order');
    $order->load($order_id);
    $order->prepareOrderPrint('invoice');

    $jshopConfig = JSFactory::getConfig();

    $order->loadItemsNewDigitalProducts();
    $order_items = $order->getAllItems();

    include_once(JPATH_JOOMSHOPPING . "/config/pdf_config.php");
    include_once(JPATH_JOOMSHOPPING . "/Lib/tcpdf/tcpdf.php");

    $pdf = new \TCPDF();

    $pdf->SetFont('freesans', '', 10);

    $pdf->SetCreator('JoomShopping');
    $pdf->SetAuthor('YourSite');
    $pdf->SetTitle('Счет на оплату №' . $order->order_id);

    $pdf->SetPrintHeader(false);
    $pdf->SetPrintFooter(false);
    $pdf->SetMargins(10, 10, 10);
    $pdf->AddPage();

    ob_start();
    $html = ob_get_clean();

    $order_date = date('d.m.Y H:i', strtotime($order->order_date));
    $currency = $order->currency_code;

    $html = '
<style>
    body { font-family: freesans, sans-serif; font-size: 12px; }
    h2 { background-color: #eeeeee; padding: 5px 10px; font-size: 18px; margin-top: 20px; border: 1px solid #ccc; }
    .content_page { background: #fff; padding: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    table td, table th { border: 1px solid #ccc; padding: 6px; vertical-align: top; }
    table.w100 td { width: 50%; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .product-image { width: 80px; height: 80px; object-fit: contain; }
    thead tr { background-color: #f5f5f5; }
</style>

<div class="content_page">
    <h2>&nbsp;&nbsp;Счет на оплату для заказа №' . $order->order_id . '</h2>
    <table class="w100">
        <tr><td>&nbsp;&nbsp;Данные о заказе</td><td>&nbsp;&nbsp;Дополнительная информация</td></tr>
        <tr>
            <td>
                <strong>Номер заказа:</strong> ' . $order->order_number . '<br />
                <strong>&nbsp;&nbsp;Дата заказа:</strong> ' . $order_date . '<br />
                <strong>&nbsp;&nbsp;ФИО клиента:</strong> ' . $order->f_name . ' ' . $order->l_name . '<br />
                <strong>&nbsp;&nbsp;Телефон:</strong> ' . $order->phone . '<br />
                <strong>&nbsp;&nbsp;Email:</strong> ' . $order->email . '<br />
            </td>
            <td>
                <strong>Доставка:</strong> <strong>' . $order->shipping_information .'</strong> - '. $order->shipping_params . '<br />
                <strong>&nbsp;&nbsp;Оплата:</strong> ' . $order->payment_name . '<br />
            </td>
        </tr>
    </table>

    <h2>&nbsp;&nbsp;Товары</h2>

    <table style="width:100%;">
        <thead>
            <tr>
                <th>&nbsp;Изображение</th>
                <th class="text-left" style="width:199px;">&nbsp;Название</th>
                <th class="text-center" style="width:60px;">&nbsp;Код товара</th>
                <th class="text-center" style="width:50px;">&nbsp;Кол-во</th>
                <th class="text-center" style="width:60px;">&nbsp;Цена</th>
                <th class="text-center" style="width:80px;">&nbsp;Сумма</th>
            </tr>
        </thead>
        <tbody>';

    foreach ($order_items as $item) {
      $imgHtml = '';
      if (!empty($item->thumb_image)) {
        $imgPath = JPATH_ROOT . '/components/com_jshopping/files/img_products/' . $item->thumb_image;
        if (file_exists($imgPath)) {
          $imageData = base64_encode(file_get_contents($imgPath));
          $ext = pathinfo($imgPath, PATHINFO_EXTENSION);
          $imgHtml = '<img class="product-image" style="width: 40px; height: 40px;" src="data:image/' . $ext . ';base64,' . $imageData . '" />';
        }
      }

      $html .= '
            <tr>
                <td class="text-center"><br><br>' . $imgHtml . '<br /></td>
                <td class="text-left" style="width:199px;"><br /><br />' . htmlspecialchars($item->product_name) . '</td>
                <td class="text-center" style="font-size:10px;width:60px;"><br /><br />' . htmlspecialchars($item->product_ean) . '</td>
                <td class="text-center" style="font-size:10px;width:50px;"><br /><br />' . (int) $item->product_quantity . '</td>
                <td class="text-center" style="font-size:10px;width:60px;"><br /><br />' . number_format($item->product_item_price, 2, '.', ' ') . ' ' . $currency . '</td>
                <td class="text-center" style="font-size:10px;width:80px;"><br /><br />' . number_format($item->product_quantity * $item->product_item_price, 2, '.', ' ') . ' ' . $currency . '</td>
            </tr>';
    }

    $html .= '
            <tr>
                <td colspan="5" class="text-right"><strong>Итого:</strong></td>
                <td class="text-right"><strong>' . number_format($order->order_total, 2, '.', ' ') . ' ' . $currency . '</strong></td>
            </tr>
        </tbody>
    </table>
    <div><br /><strong>&nbsp;&nbsp;Комментарий:</strong> ' . nl2br($order->order_add_info) . '<br /></div>
</div>';

    $pdf->writeHTML($html, true, false, true, false);
// $pdf->Output(JPATH_ROOT . '/logs/invoice_test.pdf', 'F');

    $pdf->Output('Invoice_' . $order->order_id . '.pdf', 'I');
    exit;
  }
}
