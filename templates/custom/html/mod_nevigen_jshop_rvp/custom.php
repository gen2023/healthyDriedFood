<?php
/*
 * @package    Nevigen JShop Recently Viewed Products Package
 * @version    1.0.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Registry\Registry;
use Joomla\Component\Jshopping\Site\Helper\Helper as JoomShoppingHelper;
use Joomla\CMS\Factory;
$user = Factory::getUser();

/**
 * Template variables
 * -----------------
 *
 * @var  array     $products   Products.
 * @var   Registry $params Module params.
 * @var   object $jshopConfig jshop config object.
 * @var   string $noimage noimage path.
 */
?>
<div class="recently-viewed jshop_list_product">
    <div class="flex between align-center mb25">
        <div class="ttl sm"><?= Text::_('TPL_CUSTOM_RECENTLY_VIEWED') ?></div>
        <div class="recently-viewed-nav slider-nav">
            <div class="recently-viewed-prev slider-prev icon-prev"></div>
            <div class="recently-viewed-next slider-next icon-next"></div>
        </div>
    </div>
    <div class="recently-slider swiper-container">
        <div class="swiper-wrapper">
            <?php foreach ($products as $product): ?>
                <div class="swiper-slide prod-wrap">
                    <div class="product<?php if (!$product->buy_link) {
                        echo " not-avail";
                    } ?>">
                        <div class="top_prodoct">
                            <div class="image_block">
                                <?php print $product->_tmp_var_image_block; ?>
                                <?php if ($product->label_id) { ?>
                                    <div class="product_label">
                                        <?php if ($product->_label_image) { ?>
                                            <img src="<?php print $product->_label_image ?>" alt="<?php print htmlspecialchars($product->_label_name) ?>" />
                                        <?php } else { ?>
                                            <span class="label_name"><?php print $product->_label_name; ?></span>
                                        <?php } ?>
                                    </div>
                                <?php } ?>
                                <a href="<?= $product->product_link ?>">
                                    <img class="jshop_img" src="<?php print $product->image ?>" alt="<?php print htmlspecialchars($product->img_alt); ?>"
                                        title="<?php print htmlspecialchars($product->img_title); ?>" />
                                </a>
                                <div class="btn-wishlist icon-wishlist" title="<?= Text::_('TPL_CUSTOM_ADD_TO_WISHLIST') ?>"
                                    onclick="$(this).parents('.product').find('.product-button-wishlist').trigger('click')"></div>
                            </div>
                            <?php print $product->_tmp_var_bottom_foto; ?>
                            <div class="name"><a href="<?= $product->product_link ?>"><?= $product->name ?></a></div>
                        </div>
                        <div class="bottom_prodoct">
                            <div class="oiproduct">
                                <div class="price">
                                    <?php if ($product->product_old_price) { ?>
                                        <div class="old_price">
                                            <span><?= JoomShoppingHelper::formatprice($product->product_old_price) ?></span>
                                            <?php print $product->_tmp_var_bottom_old_price; ?>
                                        </div>
                                    <?php } ?>
                                    <div class="jshop_price">
                                        <span><?= JoomShoppingHelper::formatprice($product->product_price) ?></span>
                                        <?php print $product->_tmp_var_bottom_price; ?>
                                    </div>
                                </div>
                            </div>
                            <?php if ($product->buy_link && $product->product_quantity > 0) { ?>
                                <div class="avail icon-check"><?= JText::_('TPL_CUSTOM_AVAIL'); ?></div>
                            <?php } else { ?>
                                <div class="prod-not-avail icon-check"><?= JText::_('TPL_CUSTOM_NOT_AVAIL'); ?></div>
                            <?php } ?>
                            <?php print $product->_tmp_var_top_buttons; ?>
                            <div class="buttons">
                                <?php /* if ($data['jshopConfig']->enable_wishlist) { ?>
                               <a class="btn button btn-wishlist btn-secondary" href="<?= $product->buy_link ?>&to=wishlist">
                                   <?= Text::_('MOD_JSHOPPING_PRODUCTS_LIST_BTN_WISHLIST') ?>
                               </a>
                           <?php } */ ?>
                                <?php print $product->_tmp_var_buttons; ?>
                                <a class="btn button btn-wishlist product-button-wishlist btn-secondary" href="<?= $product->buy_link ?>&to=wishlist" style="display: none;"></a>
                                    <?php if ($product->buy_link) { ?>
                                        <a class="btn btn-success button_buy icon-cart" href="<?= $product->buy_link ?>">
                                            <?= Text::_('TPL_CUSTOM_BUY'); ?>
                                        </a>
                                    <?php } ?>
                            </div>
                        </div>
                        <div class="bottom_buttons">
                            <?php print $product->_tmp_var_bottom_buttons; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>