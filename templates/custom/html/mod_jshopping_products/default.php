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


?>

<div class="jshop jshop_list_product d-flex flex-wrap <?= $params['swiperclass_sfx'] ?>">
    <?php foreach ($products as $product) { ?>
        <?php print $product->_tmp_var_start ?>
        <div class="product">
            <div class="top_prodoct">
                <div class="image_block">
                    <?php print $product->_tmp_var_image_block; ?>
                    <?php if ($product->label_id) { ?>
                        <div class="product_label">
                            <?php if ($product->_label_image) { ?>
                                <img src="<?php print $product->_label_image ?>"
                                    alt="<?php print htmlspecialchars($product->_label_name) ?>" />
                            <?php } else { ?>
                                <span class="label_name"><?php print $product->_label_name; ?></span>
                            <?php } ?>
                        </div>
                    <?php } ?>
                    <a href="<?= $product->product_link ?>">
                        <img class="jshop_img" src="<?php print $product->image ?>"
                            alt="<?php print htmlspecialchars($product->img_alt); ?>"
                            title="<?php print htmlspecialchars($product->img_title); ?>" />
                    </a>
                </div>
                <?php print $product->_tmp_var_bottom_foto; ?>

                <div class="name"><a href="<?= $product->product_link ?>"><?= $product->name ?></a></div>
            </div>
            <div class="bottom_prodoct">

                <div class="oiproduct">
                    <div class="price">
                        <div class="jshop_price">
                            <span><?= JoomShoppingHelper::formatprice($product->product_price) ?></span>
                            <?php print $product->_tmp_var_bottom_price; ?>
                        </div>
                        <div class="old_price">
                            <span><?= JoomShoppingHelper::formatprice($product->product_old_price) ?></span>
                            <?php print $product->_tmp_var_bottom_old_price; ?>
                        </div>
                    </div>

                    <?php print $product->_tmp_var_top_buttons; ?>

                    <div class="buttons">
                        <?php if ($data['jshopConfig']->enable_wishlist) { ?>
                            <a class="btn button btn-wishlist btn-secondary" href="<?= $product->buy_link ?>&to=wishlist">
                                <?= Text::_('MOD_JSHOPPING_PRODUCTS_LIST_BTN_WISHLIST') ?>
                            </a>
                        <?php } ?>
                        <?php if ($product->buy_link) { ?>
                            <a class="btn btn-success button_buy" href="<?= $product->buy_link ?>">
                                <?= Text::_('MOD_JSHOPPING_PRODUCTS_LIST_BTN_BUY') ?>
                            </a>
                        <?php } ?>
                        <?php print $product->_tmp_var_buttons; ?>
                    </div>
                </div>
                <div class="bottom_buttons">
                    <?php print $product->_tmp_var_bottom_buttons; ?>
                </div>
            </div>
        </div>
    <?php } ?>
</div>
<?php if (!empty($pagination)) : ?>
    <div class="pagination-wrap">
        <?= $pagination->getPagesLinks(); ?>
    </div>
<?php endif; ?>
