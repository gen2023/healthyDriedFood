<?php
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
?>
<?php $countprod = count($this->products); ?>
<div class="jshop cart_popup">
    <form onsubmit="return false;" name="updateCart">
        <?php print $this->_tmp_ext_html_cart_start ?? '' ?>
        <?php if ($countprod > 0) { ?>
            <div class="jshop cart">
                <?php
                $i = 1;
                foreach ($this->products as $key_id => $prod) {
                    ?>
                    <div class="jshop_prod_cart_popup <?php if ($i % 2 == 0)
                        print "even";
                    else
                        print "odd" ?>">
                            <div class="left">
                                <div class="jshop_img_description_center">
                                    <a style="cursor: pointer" onclick="window.location = '<?php print $prod['href'] ?>';">
                                    <img src="<?php print $this->image_product_path ?>/<?php if ($prod['thumb_image'])
                                           print $prod['thumb_image'];
                                       else
                                           print $this->no_image; ?>" alt="<?php print htmlspecialchars($prod['product_name']); ?>" class="jshop_img" />
                                </a>
                            </div>
                            <div class="info_product">
                                <div class="product_name">
                                    <a style="cursor: pointer" onclick="window.location = '<?php print $prod['href'] ?>';"><?php print $prod['product_name'] ?></a>
                                    <?php if ($this->config->show_product_code_in_cart) { ?>
                                        <span class="jshop_code_prod">(<?php print $prod['ean'] ?>)</span>
                                    <?php } ?>
                                    <?php if ($prod['manufacturer'] != '') { ?>
                                        <div class="manufacturer"><?php print Text::_('JSHOP_MANUFACTURER') ?>:
                                            <span><?php print $prod['manufacturer'] ?></span>
                                        </div>
                                    <?php } ?>
                                    <?php print Helper::sprintAtributeInCart($prod['attributes_value']); ?>
                                    <?php print Helper::sprintFreeAtributeInCart($prod['free_attributes_value']); ?>
                                    <?php print Helper::sprintFreeExtraFiledsInCart($prod['extra_fields']); ?>
                                    <?php print $prod['_ext_attribute_html'] ?? ''; ?>
                                </div>
                                <div class="price_product">
                                    <?php print Helper::formatprice($prod['price']) ?>
                                    <?php print $prod['_ext_price_html'] ?? ''; ?>
                                    <?php if ($this->config->show_tax_product_in_cart && $prod['tax'] > 0) { ?>
                                        <span class="taxinfo"><?php print Helper::productTaxInfo($prod['tax']); ?></span>
                                    <?php } ?>
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <div class="quantity">
                                <div class="block_quantity">
                                    <span class="quantity-minus" onclick="changeQuantity(this,-1)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3 9C3 8.58579 3.33579 8.25 3.75 8.25H14.25C14.6642 8.25 15 8.58579 15 9C15 9.41421 14.6642 9.75 14.25 9.75H3.75C3.33579 9.75 3 9.41421 3 9Z" fill="#000"
                                                style="fill:#000;fill-opacity:1;" />
                                        </svg>
                                    </span>
                                    <input type="number" id="quantity_cart" name="quantity[<?php print $key_id ?>]" value="<?php print $prod['quantity'] ?>" class="inputbox">
                                    <span class="quantity-plus" onclick="changeQuantity(this,1)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M8.25 14.25C8.25 14.6642 8.58579 15 9 15C9.41421 15 9.75 14.6642 9.75 14.25V9.75H14.25C14.6642 9.75 15 9.41421 15 9C15 8.58579 14.6642 8.25 14.25 8.25H9.75V3.75C9.75 3.33579 9.41421 3 9 3C8.58579 3 8.25 3.33579 8.25 3.75V8.25H3.75C3.33579 8.25 3 8.58579 3 9C3 9.41421 3.33579 9.75 3.75 9.75H8.25V14.25Z"
                                                fill="#000" style="fill:#000; fill-opacity:1;" />
                                        </svg>
                                    </span>
                                </div>
                                <?php print $prod['_qty_unit'] ?? ''; ?>
                                <?php if (!isset($prod['not_qty_update']) || !$prod['not_qty_update']) { ?>
                                    <span class="cart_reload icon-refresh" title="<?php print Text::_('JSHOP_UPDATE_CART') ?>" onclick="cart_popup.refreshCart();"></span>
                                <?php } ?>
                            </div>
                            <div>
                                <?php print Helper::formatprice($prod['price'] * $prod['quantity']); ?>
                                <?php print $prod['_ext_price_total_html'] ?? ''; ?>
                                <?php if ($this->config->show_tax_product_in_cart && $prod['tax'] > 0) { ?>
                                    <span class="taxinfo"><?php print Helper::productTaxInfo($prod['tax']); ?></span>
                                <?php } ?>
                            </div>
                        </div>
                        <a id="remove_cart_item[<?php print $key_id ?>]" class="remove_cart_item" onclick="cart_popup.remove_cart_item('<?php print $key_id; ?>');" style="cursor: pointer;"><i
                                class="icon-close" title="<?php print Text::_('JSHOP_DELETE') ?>"></i>
                        </a>
                    </div>
                    <?php
                    $i++;
                }
                ?>
            </div>

            <?php if ($this->addon_params['delete_all_products']) { ?>
                <div class="clear-cart">
                    <a class="btn clear-cart btn-warning" onclick="if (confirm('<?php print Text::_('JSHOP_CONFIRM_REMOVE_ALL') ?>')) cart_popup.clear_cart();">
                        <?php print Text::_('JSHOP_CLEAR_CART') ?>
                    </a>
                </div>
            <?php } ?>

            <?php if ($this->config->show_weight_order) { ?>
                <div class="weightorder">
                    <?php print Text::_('JSHOP_WEIGHT_PRODUCTS') ?>:
                    <span><?php print Helper::formatweight($this->weight); ?></span>
                </div>
            <?php } ?>

            <?php if ($this->config->summ_null_shipping > 0) { ?>
                <div class="shippingfree">
                    <?php printf(Text::_('JSHOP_FROM_PRICE_SHIPPING_FREE'), Helper::formatprice($this->config->summ_null_shipping, null, 1)); ?>
                </div>
            <?php } ?>

            <br />
            <table class="jshop jshop_subtotal">
                <?php if (!$this->hide_subtotal) { ?>
                    <tr>
                        <td class="name">
                            <?php print Text::_('JSHOP_SUBTOTAL') ?>
                        </td>
                        <td class="value">
                            <?php print Helper::formatprice($this->summ); ?>         <?php print $this->_tmp_ext_subtotal ?? ''; ?>
                        </td>
                    </tr>
                <?php } ?>

                <?php print $this->_tmp_html_after_subtotal ?>

                <?php if ($this->discount > 0) { ?>
                    <tr>
                        <td class="name">
                            <?php print Text::_('JSHOP_RABATT_VALUE') ?>         <?php print $this->_tmp_ext_discount_text ?? ''; ?>
                        </td>
                        <td class="value">
                            <?php print Helper::formatprice(-$this->discount); ?>         <?php print $this->_tmp_ext_discount ?? ''; ?>
                        </td>
                    </tr>
                <?php } ?>
                <?php if (!$this->config->hide_tax) { ?>
                    <?php foreach ($this->tax_list as $percent => $value) { ?>
                        <tr>
                            <td class="name">
                                <?php print Helper::displayTotalCartTaxName(); ?>
                                <?php if ($this->show_percent_tax)
                                    print Helper::formattax($percent) . "%" ?>
                                </td>
                                <td class="value">
                                <?php print Helper::formatprice($value); ?>             <?php print $this->_tmp_ext_tax[$percent] ?? ''; ?>
                            </td>
                        </tr>
                    <?php } ?>
                <?php } ?>
                <tr class="total">
                    <td class="name">
                        <?php print Text::_('JSHOP_PRICE_TOTAL') ?>
                    </td>
                    <td class="value">
                        <?php print Helper::formatprice($this->fullsumm) ?>     <?php print $this->_tmp_ext_total ?? ''; ?>
                    </td>
                </tr>

                <?php print $this->_tmp_html_after_total ?>

                <?php if ($this->config->show_plus_shipping_in_product) { ?>
                    <tr>
                        <td colspan="2" align="right">
                            <span class="plusshippinginfo"><?php print sprintf(Text::_('JSHOP_PLUS_SHIPPING'), $this->shippinginfo); ?></span>
                        </td>
                    </tr>
                <?php } ?>
                <?php if ($this->free_discount > 0) { ?>
                    <tr>
                        <td colspan="2" align="right">
                            <span class="free_discount"><?php print Text::_('JSHOP_FREE_DISCOUNT'); ?>:
                                <?php print Helper::formatprice($this->free_discount); ?></span>
                        </td>
                    </tr>
                <?php } ?>
            </table>
        <?php } else { ?>
            <div class="cart_empty_text"><?php print Text::_('JSHOP_CART_EMPTY') ?></div>
        <?php } ?>

        <?php print $this->_tmp_html_before_buttons ?? ''; ?>

        <div class="jshop cart_buttons">

            <div class="pull-left">
                <a href="#" onclick="cart_popup.modal_close();" class="btn btn-arrow-left btn-secondary">
                    <?php print Text::_('JSHOP_BACK_TO_SHOP') ?>
                </a>
            </div>
            <div class="pull-right">
                <?php if ($countprod > 0): ?>
                    <a href="<?php print $this->href_checkout ?>" class="btn btn-arrow-right btn-success">
                        <?php print Text::_('JSHOP_CHECKOUT') ?>
                    </a>
                <?php endif; ?>
            </div>

        </div>

    </form>

    <?php print $this->_tmp_ext_html_before_discount ?? ''; ?>

    <?php if ($this->use_rabatt && $countprod > 0): ?>
        <div class="cart_block_discount">
            <form name="rabatt" onsubmit="return false;">
                <div class="jshop">
                    <div class="span12">
                        <div class="name"><?php print Text::_('JSHOP_RABATT') ?></div>
                        <input type="text" class="inputbox" name="rabatt" value="" />
                        <input type="submit" class="button btn btn-primary" value="<?php print Text::_('JSHOP_RABATT_ACTIVE') ?>" onclick="cart_popup.save_discount();" />
                    </div>
                </div>
            </form>
        </div>
    <?php endif; ?>

</div>

<script>
    function initCartQuantityInputs() {
        var cart_popup_s = document.querySelector('.cart_popup');
        if (!cart_popup_s) return;

        var qtyInputs = cart_popup_s.querySelectorAll('.quantity input');

        qtyInputs.forEach(function (input) {
            if (input._blurHandler) {
                input.removeEventListener('blur', input._blurHandler);
            }

            const handler = function () {
                const cartReload = input.closest('.quantity')?.querySelector('.cart_reload');
                if (cartReload) cartReload.click();
            };

            input.addEventListener('blur', handler);
            input._blurHandler = handler;
        });
    }

    function changeQuantity(button, step) {
        const qtyInput = button.closest('.block_quantity').querySelector('input[type="number"]');
        let current = parseFloat(qtyInput.value);

        current += step;

        if (current < 1) current = 1;
        qtyInput.value = current;

        qtyInput.dispatchEvent(new Event('change', { bubbles: true }));

        const cartReload = button.closest('.quantity')?.querySelector('.cart_reload');
        if (cartReload) cartReload.click();

    }


    initCartQuantityInputs();

</script>