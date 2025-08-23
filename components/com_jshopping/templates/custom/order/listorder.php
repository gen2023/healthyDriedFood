<?php
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;

/**
 * @version      5.0.0 15.09.2018
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
defined('_JEXEC') or die();
$jshopConfig = JSFactory::getConfig();
$user = Factory::getUser();
$adv_user = JSFactory::getUserShop();
$adv_user->prepareUserPrint();
if (!isset($this->user)) {
    $this->user = new stdClass();
}
$this->user->f_name = $adv_user->f_name;
$this->user->l_name = $adv_user->l_name;
$this->user->email = $adv_user->email;

$db = Factory::getDbo();

$app = Factory::getApplication();
$lang = $app->getLanguage();
$langCode = '_' . $lang->getTag();

$active_editData = '';
$active_account = '';
$active_wishlist = '';
$active_showOrder = 'active';

?>
<div class="jshop cat-page accountPage" id="comjshop">
    <div class="container">
        <div class="page-flex flex between mb80">
            <div class="left-side">
                <div class="user-menu">
                    <div class="user-info icon icon-user mb25">
                        <div class="info">
                            <div class="name"><?= $user->name; ?></div>
                            <div class="email"><?= $user->email ?></div>
                        </div>
                    </div>
                    <?php
                    $module = ModuleHelper::getModules('user-menu');
                    $attribs['style'] = 'none';
                    echo ModuleHelper::renderModule($module[0], $attribs);
                    ?>
                </div>
            </div>
            <div class="right-side">

                <?php include(dirname(__FILE__) . "/../user/menu_account.php"); ?>
                <div class="content">

                    <h1><?php print Text::_('JSHOP_MY_ORDERS') ?></h1>

                    <?php print $this->_tmp_html_before_user_order_list; ?>
                    <div class="myorders_list">

                        <?php if (count($this->orders)) { ?>
                            <?php foreach ($this->orders as $order) {
                                $shipping_method_id = $order->shipping_method_id;
                                $payment_method_id = $order->payment_method_id;

                                $query = $db->getQuery(true)
                                    ->select(
                                        [
                                            $db->quoteName('name' . $langCode) . ' AS name',
                                            $db->quoteName('image'),
                                        ]
                                    )
                                    ->from($db->quoteName('#__jshopping_shipping_method'))
                                    ->where($db->quoteName('shipping_id') . ' = ' . (int) $shipping_method_id);
                                $db->setQuery($query);
                                $shipping_name = $db->loadObjectList() ?: '';
                                $shipping_name = $shipping_name[0];


                                $query = $db->getQuery(true)
                                    ->select($db->quoteName('name' . $langCode))
                                    ->from($db->quoteName('#__jshopping_payment_method'))
                                    ->where($db->quoteName('payment_id') . ' = ' . (int) $payment_method_id);
                                $db->setQuery($query);
                                $payment_name = $db->loadResult() ?: '';

                                $query = $db->getQuery(true)
                                    ->select([
                                        'oi.product_id',
                                        'oi.product_name',
                                        'p.main_category_id',
                                        'oi.product_item_price as product_price',
                                        'oi.product_quantity',
                                        'oi.product_attributes',
                                        'p.image'
                                    ])
                                    ->from($db->quoteName('#__jshopping_order_item', 'oi'))
                                    ->leftJoin($db->quoteName('#__jshopping_products', 'p') . ' ON p.product_id = oi.product_id')
                                    ->where($db->quoteName('oi.order_id') . ' = ' . (int) $order->order_id);
                                $db->setQuery($query);
                                $products = $db->loadObjectList();

                                ?>
                                <div class="myorders_block_info account_block">
                                    <div class="top">
                                        <div class="left">
                                            <div class="order_number">№ <?php print $order->order_number ?></div>
                                            <div class="order_date">
                                                <?php print Helper::formatdate($order->order_date, 0) ?>
                                            </div>
                                        </div>
                                        <?php print $order->_tmp_ext_order_number; ?>
                                        <?php
                                        switch ($order->order_status) {
                                            case 7:
                                                $class = 'icon-check';
                                                break;
                                            case 5:
                                                $class = 'icon-stat-delivery';
                                                break;
                                            case 3:
                                                $class = 'icon-stat-cancel';
                                                break;
                                            case 1:
                                                $class = 'icon-clock';
                                                break;
                                            default:
                                                $class = 'icon-clock';
                                                break;
                                        }
                                        ?>
                                        <div class="order_status <?= $class ?>">
                                            <?php print $order->status_name ?>
                                        </div>
                                        <div class="arr"></div>
                                    </div>
                                    <?php print $order->_tmp_ext_status_name; ?>
                                    <div class="table_order_list">
                                        <div class="info_detail">
                                            <div class="shipping_name">
                                                <?php if ($shipping_name->image) { ?>
                                                    <img src="<?= $shipping_name->image ?>" alt="">
                                                <?php } ?>
                                                <div class="description_block">
                                                    <?= $shipping_name->name ?>
                                                </div>
                                            </div>
                                            <div class="shipping_address">
                                                <div class="title_block">
                                                    <?php print Text::_('TPL_CUSTOM_ORDER_HISTORY_SHIP_ADDRESS_BLOCK') ?>
                                                </div>
                                                <div class="description_block"><?php echo $order->shipping_params; ?></div>
                                            </div>
                                            <div class="payment_name">
                                                <div class="title_block"><?php print Text::_('TPL_CUSTOM_ORDER_HISTORY_PAYMENT_BLOCK') ?>
                                                </div>
                                                <div class="description_block">
                                                    <?= $payment_name ?>
                                                </div>
                                            </div>
                                            <div class="user_info">
                                                <div class="title_block"><?php print Text::_('TPL_CUSTOM_ORDER_HISTORY_INFO_USER_BLOCK') ?>
                                                </div>
                                                <div class="description_block">
                                                    <?php print $order->f_name ?>
                                                    <?php print $order->l_name ?><br /><span><?php print $order->email ?><span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="info_product">
                                            <div class="list_order_product">
                                                <?php foreach ($products as $key => $value) {
                                                    $product_link = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id=' . $value->main_category_id . '&product_id=' . $value->product_id, 1);
                                                    ?>
                                                    <div class="item">
                                                        <div class="product_image">
                                                            <a href="<?= $product_link ?>">
                                                                <img src="/components/com_jshopping/files/img_products/thumb_<?= $value->image ?>" alt="<?= $value->product_name ?>">
                                                            </a>
                                                        </div>
                                                        <div class="content_product">
                                                            <div class="product_info">
                                                                <div class="name">
                                                                    <a href="<?= $product_link ?>">
                                                                        <?= $value->product_name ?>
                                                                    </a>
                                                                </div>
                                                                <div class="attribute"><?= $value->product_attributes ?></div>
                                                            </div>
                                                            <div class="block_price">
                                                                <div class="count_product_item">
                                                                    <?= (int) $value->product_quantity ?> x <?php print Helper::formatprice($value->product_price, $order->currency_code) ?>
                                                                </div>
                                                                <?php if ($value->product_old_price > 0) { ?>
                                                                    <div class="old_price">
                                                                        <?php print Helper::formatprice($value->product_old_price, $order->currency_code) ?>
                                                                    </div>
                                                                <?php } ?>
                                                                <div class="price">
                                                                    <?php print Helper::formatprice($value->product_price * (int) $value->product_quantity, $order->currency_code) ?>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                <?php } ?>
                                            </div>
                                            <div class="order_item_result">
                                                <div class="item total_price_product">
                                                    <div class="text"><?php print Text::_('TPL_CUSTOM_LIST_ORDER_TOTAL_PRICE') ?></div>
                                                    <div class="result">
                                                        <?php print Helper::formatprice($order->order_total, $order->currency_code) ?>
                                                    </div>
                                                </div>
                                                <div class="item total_count_product">
                                                    <div class="text"><?php print Text::_('TPL_CUSTOM_LIST_ORDER_COUNT_PRODUCT') ?></div>
                                                    <div class="result"><?php print $order->count_products ?> шт</div>
                                                </div>
                                                <div class="item total_price_product_bg">
                                                    <div class="text"><?php print Text::_('TPL_CUSTOM_LIST_ORDER_TOTAL_PRICE_RESULT') ?>
                                                    </div>
                                                    <div class="price">
                                                        <?php print Helper::formatprice($order->order_total, $order->currency_code) ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php } ?>

                            <?php /*<div class="myorders_total">
                <span class="name"><?php print Text::_('JSHOP_TOTAL') ?></span>
                <span
                    class="price"><?php print Helper::formatprice($this->total, Helper::getMainCurrencyCode()) ?></span>
            </div>*/ ?>

                        <?php } else { ?>
                            <div class="myorders_no_orders">
                                <?php print Text::_('JSHOP_NO_ORDERS') ?>
                            </div>
                        <?php } ?>

                        <?php print $this->_tmp_html_after_user_order_list; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
    $module = ModuleHelper::getModules('main-advan');
    $attribs['style'] = 'none';
    echo ModuleHelper::renderModule($module[0], $attribs);
    ?>
</div>