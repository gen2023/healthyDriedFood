<?php

/**
 * @package     Joomla.Site
 * @subpackage  mod_slider
 *
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

?>

<div class="swiper <?= $params['swiperclass_sfx'] ?>">
    <div class="swiper-wrapper">
        <?php foreach ($sliderList as $key => $value) { ?>
            <div class="swiper-slide <?= $value->className ?>">
                <?php if ($value->link) { ?>
                    <a href="<?= $value->link; ?>">
                        <picture>
                            <?php if ($value->use_mob == '1') { ?>
                            <source srcset="/<?= $value->image_mob ?>" media="(max-width: <?= $value->size_mob ?>px)">
                        <?php } ?>
                            <img src="/<?= $value->image ?>" alt="<?= htmlspecialchars($value->title) ?>"
                                title="<?= htmlspecialchars($value->title) ?>" loading="lazy" />
                        </picture>

                        <?php if ($value->description): ?>
                            <div class="description_slide"><?= $value->description; ?></div><?php endif ?>
                    </a>
                <?php } else { ?>
                    <picture>
                        <?php if ($value->use_mob == '1') { ?>
                            <source srcset="/<?= $value->image_mob ?>" media="(max-width: <?= $value->size_mob ?>px)">
                        <?php } ?>
                        <img src="/<?= $value->image ?>" alt="<?= htmlspecialchars($value->title) ?>"
                            title="<?= htmlspecialchars($value->title) ?>" loading="lazy" />
                    </picture>

                    <?php if ($value->description): ?>
                        <div class="description_slide"><?= $value->description; ?></div><?php endif ?>
                <?php } ?>
            </div>
        <?php } ?>
    </div>
    <div class="swiper-pagination"></div>
    <?php if ($params['navegation_slider']) { ?>
        <div class="control_swiper" data-ttt="<?= $params['moduleclass_sfx']; ?>">
            <div class="swiper-button-prev">&nbsp;</div>
            <div class="swiper-button-next">&nbsp;</div>
        </div>
    <?php } ?>

</div>