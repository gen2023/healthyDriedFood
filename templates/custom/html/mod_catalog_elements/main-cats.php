<?php
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\Component\Jshopping\Site\Helper\Helper;

defined('_JEXEC') or die;

?>

<div class="main-cats mb25">
    <div class="container">
        <div class="flex between align-center">
            <div class="ttl md"><?= Text::_('TPL_CUSTOM_MAIN_CATS_TTL') ?></div>
            <div class="main-cats-nav slider-nav">
                <div class="main-cats-prev slider-prev icon-prev"></div>
                <div class="main-cats-next slider-next icon-next"></div>
            </div>
        </div> 
        <div class="main-cats-slider">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <?php foreach ($list as $item): ?>
                        <a href="<?php echo $item->link; ?>" class="swiper-slide">
                            <?php if ($show_image) { ?>   
                                <div class="img-wrap">
                                <img class="catalog_img" src="<?php echo htmlspecialchars($item->imgSrc, ENT_QUOTES, 'UTF-8'); ?>"
                                alt="<?php echo htmlspecialchars($item->img_alt, ENT_QUOTES, 'UTF-8'); ?>"
                                title="<?php echo htmlspecialchars($item->img_title, ENT_QUOTES, 'UTF-8'); ?>">
                                </div>
                            <?php } ?>
                            <?php if ($show_name) { ?>
                                <div class="catalog_name">
                                   <div class="ttl"><?php echo $item->name; ?></div>
                              </div>
                          <?php } ?>
                      </a>
                  <?php endforeach; ?>
              </div>
          </div>
      </div>
  </div>
</div>

