<?php
/**
 * @version      5.0.0 15.09.2018
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
defined('_JEXEC') or die();

use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Helper\Helper;

$countprod = count($this->products);

$currency = \JSFactory::getTable('currency', 'jshop');

$currencis_list = $currency->getAllCurrencies('1');

$jshopConfig = \JSFactory::getConfig();   
$jshopConfig->loadCurrencyValue();

$minOrderValues = [
        '1' => 1000,
        '2' => 30,
    ];
    $minValue = isset($minOrderValues[$jshopConfig->cur_currency]) ? $minOrderValues[$jshopConfig->cur_currency] : 0;

?>
<div class="jshop mt50 mb80" id="comjshop">

    <div class="container">
        <a href="<?php print $this->href_shop ?>"
            class="back-link icon-prev mb20"><?= JText::_('TPL_CUSTOM_BACK_TO_SHOP') ?></a>
        <div class="flex between align-center mb30">
            <h1 class="ttl md"><?= JText::_('TPL_CUSTOM_CART') ?></h1>
            <div class="min-order minorder-js">
                <div class="ico"></div>
                <div class="text"><?= JText::_('TPL_CUSTOM_MIN_ORDER_TEXT') ?> <?php echo $minValue .' '. $jshopConfig->currency_code ?></div>
            </div>
        </div>

        <?php print $this->checkout_navigator ?>
        <form action="<?php print \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=refresh') ?>"
            method="post" name="updateCart" id="updateCart">

            <?php print $this->_tmp_ext_html_cart_start ?>

            <?php if ($countprod > 0): ?>
                <div class="flex between mb110">
                    <div class="jshop cart">
                        <?php
                        $i = 1;
                        foreach ($this->products as $key_id => $prod) {
                            echo $prod['_tmp_tr_before'];
                            ?>
                            <div class="jshop_prod_cart">
                                <div class="img-box">
                                    <div class="data">
                                        <?php echo $prod['_tmp_img_before']; ?>
                                        <a href="<?php print $prod['href'] ?>">
                                            <img src="<?php print $this->image_product_path ?>/<?php
                                               if ($prod['thumb_image'])
                                                   print $prod['thumb_image'];
                                               else
                                                   print $this->no_image;
                                               ?>" alt="<?php print htmlspecialchars($prod['product_name']); ?>" class="jshop_img" />
                                        </a>
                                        <?php echo $prod['_tmp_img_after']; ?>
                                    </div>
                                </div>
                                <div class="product_name">
                                    <div class="data">
                                        <a class="prodname" href="<?php print $prod['href'] ?>">
                                            <?php print $prod['product_name'] ?>
                                        </a>
                                        <?php if ($this->config->show_product_code_in_cart) { ?>
                                            <span class="jshop_code_prod">(<?php print $prod['ean'] ?>)</span>
                                        <?php } ?>
                                        <?php print $prod['_ext_product_name'] ?>
                                        <?php if ($prod['manufacturer'] != '') { ?>
                                            <div class="manufacturer"><?php print JText::_('JSHOP_MANUFACTURER') ?>:
                                                <span><?php print $prod['manufacturer'] ?></span></div>
                                        <?php } ?>
                                        <?php if ($this->config->manufacturer_code_in_cart && $prod['manufacturer_code']) { ?>
                                            <div class="manufacturer_code"><?php print JText::_('JSHOP_MANUFACTURER_CODE') ?>:
                                                <span><?php print $prod['manufacturer_code'] ?></span></div>
                                        <?php } ?>
                                        <?php if ($this->config->real_ean_in_cart && $prod['real_ean']) { ?>
                                            <div class="real_ean"><?php print JText::_('JSHOP_EAN') ?>:
                                                <span><?php print $prod['real_ean'] ?></span></div>
                                        <?php } ?>
                                        <?php print \JSHelper::sprintAtributeInCart($prod['attributes_value']); ?>
                                        <?php print \JSHelper::sprintFreeAtributeInCart($prod['free_attributes_value']); ?>
                                        <?php print \JSHelper::sprintFreeExtraFiledsInCart($prod['extra_fields']); ?>
                                        <?php print $prod['_ext_attribute_html'] ?>
                                        <?php if ($this->config->show_delivery_time_step5 && $prod['delivery_times_id']) { ?>
                                            <div class="deliverytime">
                                                <?php print JText::_('JSHOP_DELIVERY_TIME') ?>:
                                                <?php print $this->deliverytimes[$prod['delivery_times_id']] ?>
                                            </div>
                                        <?php } ?>
                                    </div>
                                </div>
                                <div class="quantity">
                                    <div class="data">
                                        <span class="block_quantity">
                                            <input class="quantity-minus" type="button" value="-">
                                            <span class="ca_qty_input">
                                                <input type="text" size="2" value="<?php print $prod['quantity'] ?>"
                                                    name="quantity[<?php print $key_id ?>]" class=" input-mini quan-input"
                                                    min="0"></span>
                                            <input class="quantity-plus" type="button" value="+">
                                        </span>
                                        <span style="display: none;" class="cart_reload icon-refresh"
                                            title="<?php print JText::_('JSHOP_UPDATE_CART') ?>"></span>
                                        <?php /*<span class="mobile-cart-inline">
                       <?php print JText::_('JSHOP_NUMBER')?>:
                   </span>
                   <?php if ($prod['not_qty_update']){?>
                       <span class="qtyval"><?php print $prod['quantity'] ?></span>
                   <?php }else{?>
                       <input type="number" name="quantity[<?php print $key_id ?>]" value="<?php print $prod['quantity'] ?>" class="inputbox" min="0">
                   <?php }?>
                   <?php print $prod['_qty_unit']; ?>
                   <?php if (!$prod['not_qty_update']){?>
                       <span class="cart_reload icon-refresh" title="<?php print JText::_('JSHOP_UPDATE_CART')?>"></span>
                   <?php } */ ?>
                                    </div>
                                </div>
                                <div class="single_price">
                                    <div class="data">
                                        <span class="price">
                                            <?php print \JSHelper::formatprice($prod['price']) ?>
                                        </span>
                                        <?php print $prod['_ext_price_html'] ?>
                                        <?php if ($this->config->show_tax_product_in_cart && $prod['tax'] > 0) { ?>
                                            <span class="taxinfo"><?php print \JSHelper::productTaxInfo($prod['tax']); ?></span>
                                        <?php } ?>
                                        <?php if ($this->config->cart_basic_price_show && $prod['basicprice'] > 0) { ?>
                                            <div class="basic_price">
                                                <?php print JText::_('JSHOP_BASIC_PRICE') ?>:
                                                <span><?php print \JSHelper::sprintBasicPrice($prod); ?></span>
                                            </div>
                                        <?php } ?>
                                    </div>
                                </div>

                                <div class="total_price">
                                    <div class="data">
                                        <?php print \JSHelper::formatprice($prod['price'] * $prod['quantity']); ?>
                                        <?php print $prod['_ext_price_total_html'] ?>
                                        <?php if ($this->config->show_tax_product_in_cart && $prod['tax'] > 0) { ?>
                                            <span class="taxinfo"><?php print \JSHelper::productTaxInfo($prod['tax']); ?></span>
                                        <?php } ?>
                                    </div>
                                </div>
                                <div class="remove">
                                    <div class="data">
                                        <?php if ($prod['not_delete']) { ?>
                                            <?php echo $prod['not_delete_html'] ? $prod['not_delete_html'] : '-'; ?>
                                        <?php } else { ?>
                                            <a class="close icon-close" href="<?php print $prod['href_delete'] ?>"
                                                onclick="return confirm('<?php print JText::_('JSHOP_CONFIRM_REMOVE') ?>')">
                                            </a>
                                        <?php } ?>
                                    </div>
                                </div>
                            </div>
                            <?php
                            echo $prod['_tmp_tr_after'];
                            $i++;
                        }
                        ?>
                    </div>
                    <div class="cart-order-box">
                        <div class="ttl sm mb30"><?php print JText::_('JSHOP_CHECKOUT') ?></div>

                        <?php if ($this->config->show_cart_clear) { ?>
                            <div class="clear-cart">
                                <a class="btn btn-danger clear-cart"
                                    href="<?php print \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=clear') ?>"
                                    onclick="return confirm('<?php print JText::_('JSHOP_CONFIRM_REMOVE_ALL') ?>')">
                                    <?php print JText::_('JSHOP_CLEAR_CART') ?>
                                </a>
                            </div>
                        <?php } ?>

                        <?php if ($this->config->show_weight_order): ?>
                            <div class="weightorder">
                                <?php print JText::_('JSHOP_WEIGHT_PRODUCTS') ?>:
                                <span><?php print \JSHelper::formatweight($this->weight); ?></span>
                            </div>
                        <?php endif; ?>

                        <?php if ($this->config->summ_null_shipping > 0): ?>
                            <div class="shippingfree">
                                <?php printf(JText::_('JSHOP_FROM_PRICE_SHIPPING_FREE'), \JSHelper::formatprice($this->config->summ_null_shipping, null, 1)); ?>
                            </div>
                        <?php endif; ?>

                        <div class="cartdescr"><?php print $this->cartdescr; ?></div>

                        <table class="jshop jshop_subtotal mb30">
                            <?php if (!$this->hide_subtotal) { ?>
                                <tr class="subtotal">
                                    <td class="name">
                                        <?php print JText::_('JSHOP_SUBTOTAL') ?>
                                    </td>
                                    <td class="value">
                                        <?php print \JSHelper::formatprice($this->summ); ?>        <?php print $this->_tmp_ext_subtotal ?>
                                    </td>
                                </tr>
                            <?php } ?>

                            <?php print $this->_tmp_html_after_subtotal ?>

                            <?php if ($this->discount > 0) { ?>
                                <tr class="discount">
                                    <td class="name">
                                        <?php print JText::_('JSHOP_RABATT_VALUE') ?>        <?php print $this->_tmp_ext_discount_text ?>
                                    </td>
                                    <td class="value">
                                        <?php print \JSHelper::formatprice(-$this->discount); ?>        <?php print $this->_tmp_ext_discount ?>
                                    </td>
                                </tr>
                            <?php } ?>
                            <?php if (!$this->config->hide_tax) { ?>
                                <?php foreach ($this->tax_list as $percent => $value) { ?>
                                    <tr class="tax">
                                        <td class="name">
                                            <?php print \JSHelper::displayTotalCartTaxName(); ?>
                                            <?php if ($this->show_percent_tax)
                                                print \JSHelper::formattax($percent) . "%" ?>
                                            </td>
                                            <td class="value">
                                            <?php print \JSHelper::formatprice($value); ?>            <?php print $this->_tmp_ext_tax[$percent] ?>
                                        </td>
                                    </tr>
                                <?php } ?>
                            <?php } ?>

                            <tr class="total">
                                <td class="name">
                                    <?php print JText::_('JSHOP_PRICE_TOTAL') ?>
                                </td>
                                <td class="value">
                                    <?php print \JSHelper::formatprice($this->fullsumm) ?>    <?php print $this->_tmp_ext_total ?>
                                </td>
                            </tr>

                            <?php print $this->_tmp_html_after_total ?>

                            <?php if ($this->config->show_plus_shipping_in_product) { ?>
                                <tr class="plusshipping">
                                    <td colspan="2" align="right">
                                        <span
                                            class="plusshippinginfo"><?php print sprintf(JText::_('JSHOP_PLUS_SHIPPING'), $this->shippinginfo); ?></span>
                                    </td>
                                </tr>
                            <?php } ?>

                            <?php if ($this->free_discount > 0) { ?>
                                <tr class="free_discount">
                                    <td colspan="2" align="right">
                                        <span class="free_discount"><?php print JText::_('JSHOP_FREE_DISCOUNT') ?>:
                                            <?php print \JSHelper::formatprice($this->free_discount); ?></span>
                                    </td>
                                </tr>
                            <?php } ?>

                        </table>


                        <?php print $this->_tmp_html_before_buttons ?>
                        <div class="jshop cart_buttons">
                            <div id="checkout" class="d-flex justify-content-between">
                                <?php if ($countprod > 0): ?>
                                    <a href="<?php print $this->href_checkout ?>"
                                        class="btn btn-success btn-checkout icon-cart">
                                        <?php print JText::_('JSHOP_CHECKOUT') ?>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>

                        <?php print $this->_tmp_html_after_buttons ?>
            </form>

            <?php print $this->_tmp_ext_html_before_discount ?>

            <?php if ($this->use_rabatt && $countprod > 0): ?>
                <div class="cart_block_discount">
                    <form name="rabatt" method="post"
                        action="<?php print \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=discountsave'); ?>">
                        <div class="jshop">
                            <div class="span12">
                                <div class="name"><?php print JText::_('JSHOP_RABATT') ?></div>
                                <input type="text" class="inputbox" name="rabatt" value="" />
                                <input type="submit" class="button btn btn-primary"
                                    value="<?php print JText::_('JSHOP_RABATT_ACTIVE') ?>" />
                            </div>
                        </div>
                    </form>
                </div>

            <?php endif; ?>
        </div>
    </div>
    <?php
    $module = JModuleHelper::getModules('recently-viewed');
    $attribs['style'] = 'none';
    echo JModuleHelper::renderModule($module[0], $attribs);
    ?>
    </div>
<?php else: ?>
    <div class="cart_empty_text ttl sm mb50"><?php print JText::_('JSHOP_CART_EMPTY') ?></div>
    <a href="<?= JText::_('TPL_CUSTOM_HOME'); ?>" class="btn"><?= JText::_('TPL_CUSTOM_TO_HOME'); ?></a>
    </div>
<?php endif; ?>
</div>
<?php
$module = JModuleHelper::getModules('main-advan');
$attribs['style'] = 'none';
echo JModuleHelper::renderModule($module[0], $attribs);
?>

<script>
    const total = <?= $this->fullsumm ?>;
    const minValue = <?= $minValue ?>;
    const btn = document.querySelector('.btn-checkout');
    const minorder = document.querySelector('.minorder-js');

    if (total < minValue) {
        btn.classList.add('disabled');
        minorder.classList.add('active');
    } else {
        btn.classList.remove('disabled');
        minorder.classList.remove('active');
    }
</script>