<?php

/**
 * @package     Joomla.Site
 * @subpackage  mod_jshopping_products
 *
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper as JoomShoppingHelper;
use Joomla\CMS\Factory;
$user = Factory::getUser();

?>

<div class="prod-flex jshop jshop_list_product flex">
    <?php foreach ($products as $product) { ?>
        <?php print $product->_tmp_var_start ?>
        <div class="prod-wrap">
            <div class="product<?php if ($product->product_quantity < 1) {
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
                        <?php if ($data['jshopConfig']->enable_wishlist && $product->product_quantity > 0) { ?>
                            <div class="btn-wishlist icon-wishlist" title="<?= Text::_('TPL_CUSTOM_ADD_TO_WISHLIST') ?>"
                                onclick="$(this).parents('.product').find('.product-button-wishlist').trigger('click')"></div>
                        <?php } ?>
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

                        <?php if ($product->product_quantity > 0) { ?>
                            <div class="avail icon-check"><?= JText::_('TPL_CUSTOM_AVAIL'); ?></div>
                        <?php } else { ?>
                            <div class="prod-not-avail icon-check"><?= JText::_('TPL_CUSTOM_NOT_AVAIL'); ?></div>
                        <?php } ?>
                        <?php print $product->_tmp_var_top_buttons; ?>

                    </div>
                    <?php print $product->_tmp_var_bottom_buttons; ?>
                    <?php if ($product->buy_link && $product->product_quantity > 0) { ?>
                        <div class="buttons">
                            <?php print $product->_tmp_var_buttons; ?>
                            <a class="btn button btn-wishlist product-button-wishlist btn-secondary" href="<?= $product->buy_link ?>&to=wishlist" style="display: none;"></a>
                            <a class="btn btn-success button_buy icon-cart" href="<?= $product->buy_link ?>">
                                <?= Text::_('TPL_CUSTOM_BUY'); ?>
                            </a>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </div>
    <?php } ?>
</div>
<?php if (!empty($pagination)): ?>
    <div class="pagination-wrap">
        <?= $pagination->getPagesLinks(); ?>
    </div>
<?php endif; ?>