<?php

use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
$user = Factory::getUser();


/**
 * @version      5.3.0 15.09.2022
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
defined('_JEXEC') or die();

$product = $this->product;
include(dirname(__FILE__) . "/load.js.php");

?>

<div class="jshop productfull<?php if ($product->product_quantity < 1) {
    echo " not-avail";
} ?>" id="comjshop">
    <div class="container">
        <div class="mt50 mb25">
            <?php
            $module = JModuleHelper::getModules('breadcrumbs');
            $attribs['style'] = 'none';
            echo JModuleHelper::renderModule($module[0], $attribs);
            ?>
        </div>
        <?php print $this->_tmp_product_html_start; ?>
        <div class="intro flex between mb15">
            <div class="img-box">
                <?php if (count($this->images) > 1) { ?>
                    <div class="product-img-slider swiper-container">
                        <div class="swiper-wrapper">
                            <?php foreach ($this->images as $k => $image) { ?>
                                <div class="swiper-slide" data-src="<?php print $this->image_product_path ?>/full_<?php print $image->image_name; ?>" title="<?php print htmlspecialchars($image->_title) ?>">
                                    <div class="img-wrap">
                                        <img src="<?php print $this->image_product_path ?>/full_<?php print $image->image_name; ?>" alt="<?php print $this->product->name ?>"
                                            title="<?php print $this->product->name ?>" />
                                    </div>
                                </div>
                            <?php } ?>
                        </div>
                    </div>
                    <div class="product-thumbs-slider swiper-container">
                        <div class="swiper-wrapper">
                            <?php foreach ($this->images as $k => $image) { ?>
                                <div class="swiper-slide" title="<?php print htmlspecialchars($image->_title) ?>"
                                    style="background-image: url(<?php print $this->image_product_path ?>/thumb_<?php print $image->image_name; ?>);">
                                </div>
                            <?php } ?>
                        </div>
                    </div>
                <?php } else { ?>
                    <div class="single-image" title="<?php print htmlspecialchars($image->_title) ?>">
                        <img data-src="<?php print $this->image_product_path ?>/full_<?php print $this->images[0]->image_name; ?>"
                            src="<?php print $this->image_product_path ?>/full_<?php print $this->images[0]->image_name; ?>" alt="<?php print $this->product->name ?>">
                    </div>
                <?php } ?>
            </div>
            <div class="text-box">
                <form name="product" method="post" action="<?php print $this->action ?>" enctype="multipart/form-data" autocomplete="off">
                    <div class="prod-ean mb60">
                        <?php echo Text::_('TPL_CUSTOM_EAN') . ': ' . $this->product->getEan(); ?>
                    </div>
                    <h1 class="ttl md mb25"><?php print $this->product->name ?></h1>
                    <?php if ($product->product_quantity > 0) { ?>
                        <div class="avail icon-check mb25"><?= JText::_('TPL_CUSTOM_AVAIL'); ?></div>
                    <?php } else { ?>
                        <div class="prod-not-avail icon-check mb25"><?= JText::_('TPL_CUSTOM_NOT_AVAIL'); ?></div>
                    <?php } ?>
                    <div class="charact mb25">
                        <?php if ($this->product->product_is_add_price) { ?>
                            <div class="price_prod_qty_list">
                                <?php foreach ($this->product->product_add_prices as $k => $add_price) { ?>
                                    <div class="item">
                                        <span class="qty_from">
                                            <?php if ($add_price->product_quantity_finish == 0)
                                                print Text::_('JSHOP_FROM') ?>
                                            <?php print $add_price->product_quantity_start ?>
                                            <?php print $this->product->product_add_price_unit ?>
                                        </span>

                                        <?php if ($add_price->product_quantity_finish > 0) { ?>
                                            <span class="qty_line"> - </span>
                                        <?php } ?>

                                        <?php if ($add_price->product_quantity_finish > 0) { ?>
                                            <span class="qty_to">
                                                <?php print $add_price->product_quantity_finish ?>             <?php print $this->product->product_add_price_unit ?>
                                            </span>
                                        <?php } ?>

                                        <span class="qty_price" id="pricelist_f_<?php print $add_price->product_quantity_start ?>">
                                            <span class="price" id="pricelist_from_<?php print $add_price->product_quantity_start ?>">
                                                <?php print Helper::formatprice($add_price->price) ?>         <?php print $add_price->ext_price ?>
                                            </span>
                                            <span class="per_piece">/ <?php print $this->product->product_add_price_unit ?></span>
                                            <?php if ($this->product->product_basic_price_show) { ?>
                                                <span class="base">(<span class="price"><?php print Helper::formatprice($add_price->basic_price) ?></span> / <span
                                                        class="bp_name"><?php print $this->product->product_basic_price_unit_name; ?></span>)</span>
                                            <?php } ?>
                                        </span>
                                        <?php print $add_price->_tmp_var ?>
                                    </div>
                                <?php } ?>
                            </div>
                        <?php } ?>

                        <?php /* if (is_array($this->product->extra_field)) { ?>
<div class="extra_fields">
<?php foreach ($this->product->extra_field as $extra_field) { ?>
<?php if ($extra_field['grshow']) { ?>
<div class='block_efg'>
<div class='extra_fields_group'><?php print $extra_field['groupname'] ?></div>
<?php } ?>
<div class="extra_fields_el">
<span
    class="extra_fields_name"><?php print $extra_field['name']; ?> :</span><?php if ($extra_field['description']) { ?>
    <span class="extra_fields_description">
        <?php print $extra_field['description']; ?>
    </span><?php } ?>
<span class="extra_fields_value">
    <?php print $extra_field['value']; ?>
</span>
</div>

<?php if ($extra_field['grshowclose']) { ?>
</div>
<?php } ?>
<?php } ?>
</div>
<?php } */ ?>
                        <?php if ($product->product_quantity > 0) { ?>
                            <div class="flex between align-center">
                                <div class="extra_fields_name"><?= Text::_('TPL_CUSTOM_ENTER_QUAN'); ?>:</div>
                                <div class="prod_qty_input block_quantity">
                                    <span class="quantityRemove" onclick="changeQuantity(-1)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3 9C3 8.58579 3.33579 8.25 3.75 8.25H14.25C14.6642 8.25 15 8.58579 15 9C15 9.41421 14.6642 9.75 14.25 9.75H3.75C3.33579 9.75 3 9.41421 3 9Z" fill="#000"
                                                style="fill:#000;fill-opacity:1;" />
                                        </svg>
                                    </span>

                                    <input type="<?php print $this->prod_qty_input_type ?>" name="quantity" id="quantity" oninput="validateQuantityInput(this)" class="inputbox"
                                        value="<?php print $this->default_count_product ?>" min="1" />

                                    <?php print $this->_tmp_qty_unit; ?>

                                    <span class="quantityAdd" onclick="changeQuantity(1)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M8.25 14.25C8.25 14.6642 8.58579 15 9 15C9.41421 15 9.75 14.6642 9.75 14.25V9.75H14.25C14.6642 9.75 15 9.41421 15 9C15 8.58579 14.6642 8.25 14.25 8.25H9.75V3.75C9.75 3.33579 9.41421 3 9 3C8.58579 3 8.25 3.33579 8.25 3.75V8.25H3.75C3.33579 8.25 3 8.58579 3 9C3 9.41421 3.33579 9.75 3.75 9.75H8.25V14.25Z"
                                                fill="#000" style="fill:#000; fill-opacity:1;" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                    <div class="btn-box flex between">
                        <?php if ($this->product->_display_price) { ?>
                            <div class="prices">
                                <div class="old_price" <?php if ($this->product->product_old_price == 0) { ?>style="display:none" <?php } ?>>
                                    <span class="old_price" id="old_price">
                                        <?php print \JSHelper::formatprice($this->product->product_old_price) ?>
                                        <?php print $this->product->_tmp_var_old_price_ext; ?>
                                    </span>
                                </div>
                                <?php if ($this->product->product_price_default > 0 && $this->config->product_list_show_price_default) { ?>
                                    <div class="default_price"><?php print JText::_('JSHOP_DEFAULT_PRICE') ?>: <span
                                            id="pricedefault"><?php print \JSHelper::formatprice($this->product->product_price_default) ?></span>
                                    </div>
                                <?php } ?>
                                <?php print $this->_tmp_product_html_before_price; ?>
                                <div class="prod_price">
                                    <span id="block_price">
                                        <?php print \JSHelper::formatprice($this->product->getPriceCalculate()) ?>
                                        <?php print $this->product->_tmp_var_price_ext; ?>
                                    </span>
                                </div>
                            </div>
                        <?php } ?>
                        <div class="buttons product-buttons flex">
                            <?php if ($product->product_quantity > 0) { ?>
                                <button type="submit" class="btn big btn-success button-buy btn-buy icon-cart" onclick="jQuery('#to').val('cart');"><?= Text::_('TPL_CUSTOM_PROD_ADD_CART') ?></button>
                                <?php if ($this->enable_wishlist) { ?>
                                    <button type="submit" class="btn button btn-wishlist btn-secondary icon-wishlist"
                                        onclick="jQuery('#to').val('wishlist');"><?= Text::_('TPL_CUSTOM_PROD_ADD_WISHLIST') ?></button>
                                <?php } ?>
                            <?php } ?>
                            <?php print $this->_tmp_product_html_buttons; ?>
                            <input type="hidden" name="to" id='to' value="cart" />
                            <input type="hidden" name="product_id" id="product_id" value="<?php print $this->product->product_id ?>" />
                            <input type="hidden" name="category_id" id="category_id" value="<?php print $this->category_id ?>" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="prod-descr mb110">
            <div class="text-wrap">
                <div class="ttl sm mb15"><?= Text::_('TPL_CUSTOM_PROD_DESCR') ?></div>
                <div><?php print $this->product->description; ?></div>
            </div>
        </div>



        <div class="mb50">
            <?php
            $module = JModuleHelper::getModules('recently-viewed');
            $attribs['style'] = 'none';
            echo JModuleHelper::renderModule($module[0], $attribs);
            ?>
        </div>
    </div>
    <?php
    $module = JModuleHelper::getModules('main-advan');
    $attribs['style'] = 'none';
    echo JModuleHelper::renderModule($module[0], $attribs);
    ?>
</div>

<script>
    function changeQuantity(step) {
        const qtyInput = document.getElementById('quantity');
        let current = parseFloat(qtyInput.value);

        current += step;

        // if (current < 1) current = 1;

        qtyInput.value = current;
        qtyInput.dispatchEvent(new Event('change'));
        jshop.reloadPrices();

    }

    function validateQuantityInput(input) {
        // if (input.value < 1) {
        //     input.value = 1;
        // }
        jshop.reloadPrices();
    }
</script>