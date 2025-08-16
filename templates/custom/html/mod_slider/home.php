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
<div class="<?= $params['swiperclass_sfx'] ?> swiper-container">
    <div class="swiper-wrapper">
        <?php foreach ($sliderList as $key => $value) { ?>
            <div class="swiper-slide <?= $value->className ?>" data-bg="/<?= $value->image ?>" <?php if ($value->use_mob == '1') { ?> data-bg-mob="/<?= $value->image_mob ?>"
                    data-bg-mob-max="<?= $value->size_mob ?>" <?php } ?>>
                <div class="text-box">
                    <div class="ttl lg white mb25"><?= htmlspecialchars($value->title) ?></div>
                    <div class="ttl white font-size-16 mb50"><?= htmlspecialchars($value->description); ?></div>
                    <a href="<?= $value->link; ?>" class="btn icon-more scroll">До товарів</a>
                </div>
            </div>
        <?php } ?>
    </div>
    <div class="<?= $params['swiperclass_sfx'] ?>-pagination slider-pagination"></div>
</div>


<script>
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll('.swiper-slide');

  slides.forEach(slide => {
    const bg = slide.dataset.bg;
    const bgMob = slide.dataset.bgMob;
    const maxWidth = parseInt(slide.dataset.bgMobMax || 768);

    function updateBackground() {
      const w = window.innerWidth;
      const image = (w <= maxWidth && bgMob) ? bgMob : bg;
      slide.style.backgroundImage = `url('${image}')`;
    }

    updateBackground(); // начальное
    window.addEventListener('resize', updateBackground); // при ресайзе
  });
});
</script>
