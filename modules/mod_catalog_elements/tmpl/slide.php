<?php
use Joomla\CMS\Router\Route;
use Joomla\Component\Jshopping\Site\Helper\Helper;

defined('_JEXEC') or die;

?>

<div class="swiper <?php echo $swiperclass_sfx; ?>">
    <div class="swiper-wrapper">
        <?php foreach ($list as $item): ?>
            <div class="swiper-slide">
                <?php if ($show_image) { ?>
                    <a href="<?php echo $item->link; ?>">
                        <img class="catalog_img" src="<?php echo htmlspecialchars($item->imgSrc, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($item->img_alt, ENT_QUOTES, 'UTF-8'); ?>"
                            title="<?php echo htmlspecialchars($item->img_title, ENT_QUOTES, 'UTF-8'); ?>">
                    </a>
                <?php } ?>

                <?php if ($show_name) { ?>
                    <div class="catalog_name">
                        <a href="<?php echo $item->link; ?>">
                            <?php echo $item->name; ?>
                            <?php if ($count_products) { ?>
                                (<?php echo $item->product_count; ?>)
                            <?php } ?>
                        </a>
                    </div>
                <?php } ?>
            </div>
        <?php endforeach; ?>
    </div>
    <div class="swiper-pagination"></div>
    <?php if ($params['navegation_slider']) { ?>
        <div class="control_swiper">
            <div class="swiper-button-prev">&nbsp;</div>
            <div class="swiper-button-next">&nbsp;</div>
        </div>
    <?php } ?>
</div>