<?php

defined('_JEXEC') or die;

$order = $this->order;

?>
<style>
    body {
        font-family: DejaVu Sans, sans-serif;
        font-size: 12px;
        line-height: 1.2;
        color: #000;
    }

    h2 {
        background-color: #eeeeee;
        padding: 5px 10px;
        font-size: 18px;
        margin-top: 20px;
        border: 1px solid #ccc;
    }

    .content_page {
        background: #fff;
        padding: 30px;
    }

    table {
        width: 100%;
    border-collapse: separate;
    border-spacing: 0 5px;
    margin-top: 20px;
    margin-bottom: 20px;
    }

    table td, table th {
        border: 1px solid #ccc;
    padding: 10px 12px;
    vertical-align: top;
    background-color: #fff;
    }

    table.w100 td {
        width: 50%;
    }

    .text-left {
        text-align: left;
    }

    .text-right {
        text-align: right;
    }

    .text-center {
        text-align: center;
    }

    .product-image {
        width: 80px;
        height: 80px;
        object-fit: contain;
    }


thead tr {
    background-color: #f5f5f5;
}

</style>

<div class="content_page">
    <h2>Счет на оплату для заказа №<?php echo $order->order_id; ?></h2>

    <table class="w100">
        <tr><td style="padding-left:10px;">Данные о заказе</td><td style="padding-left:10px;">Дополнительная информация</td></tr>
        <tr>
            <td style="padding-left:10px;"><br><br>
                <strong>Номер заказа:</strong> <?php echo $order->order_number; ?><br />
                <strong>Дата заказа:</strong> <?php echo date('d.m.Y H:i', strtotime($order->order_date)); ?><br />
                <strong>ФИО клиента:</strong> <?php echo $order->f_name . ' ' . $order->l_name; ?><br />
                <strong>Телефон:</strong> <?php echo $order->phone; ?><br />
                <strong>Email:</strong> <?php echo $order->email; ?><br />
                <br>
            </td>
            <td style="padding-left:10px;"><br><br>
                <strong>Доставка:</strong> <?php echo $order->delivery_information; ?><br />
                <strong>Оплата:</strong> <?php echo $order->payment_name; ?><br />
                <strong>Комментарий:</strong> <?php echo nl2br($order->order_add_info); ?><br />
                <br>
            </td>
        </tr>
    </table>

    <h2>Товары</h2>

    <table>
        <thead>
            <tr>
                <th>Изображение</th>
                <th class="text-left">Название</th>
                <th>Код товара</th>
                <th>Кол-во</th>
                <th>Цена</th>
                <th>Сумма</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($this->order_items as $item): ?>
                <tr>
                    <td class="text-center"><br><br>
                        <?php if (!empty($item->thumb_image)) : ?>
                            <img class="product-image" src="/components/com_jshopping/files/img_products/<?php echo $item->thumb_image; ?>" alt="">
                        <?php endif; ?>
                    </td>
                    <td class="text-left"><?php echo $item->product_name; ?></td>
                    <td class="text-center"><?php echo $item->product_ean; ?></td>
                    <td class="text-center"><?php echo (int)$item->product_quantity; ?></td>
                    <td class="text-right"><?php echo number_format($item->product_item_price, 2, '.', ' ') . ' ' . $order->currency_code; ?></td>
                    <td class="text-right"><?php echo number_format($item->product_quantity * $item->product_item_price, 2, '.', ' ') . ' ' . $order->currency_code; ?></td>
                </tr>
            <?php endforeach; ?>
            <tr>
                <td colspan="5" class="text-right"><strong>Итого:</strong></td>
                <td class="text-right"><strong><?php echo number_format($order->order_total, 2, '.', ' ') . ' ' . $order->currency_code; ?></strong></td>
            </tr>
        </tbody>
    </table>
</div>

