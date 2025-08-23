<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_slider_reviews
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
?>

<?php if ($allReviews): ?>
    <div class="rating_list_container <?= $moduleclass ?>">
        <div class="global_info">
            <div class="info">
                <div class="rating-num rat-avg-<?= $avgRatingInt ?>">
                    <?= $avgRatingRounded ?>
                </div>
                <div class="count_list">
                    <?php if ($reviewsProductCount): ?>
                        <div class="count"><?= Text::_('MOD_REVIEW_COUNT_PRODUCT'); ?> - <?= $reviewsProductCount ?></div>
                    <?php endif; ?>
                    <?php if ($reviewsShopCount): ?>
                        <div class="count"><?= Text::_('MOD_REVIEW_COUNT_SHOP'); ?> - <?= $reviewsShopCount ?></div>
                    <?php endif; ?>
                    <?php if ($reviewsTotal): ?>
                        <div class="count"><?= Text::_('MOD_REVIEW_COUNT'); ?> - <?= $reviewsTotal ?></div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="rating_report">
                <?php for ($i = 5; $i >= 1; $i--):
                    $p = $percent[$i] ?? 0;
                    ?>
                    <div class="stars-row">
                        <span class="stars"><?= $i ?> <span style="color:<?= $colors[$i] ?>;">★</span></span>
                        <div class="progress">
                            <div class="progress-bar" style="width: <?= $p ?>%; background: <?= $colors[$i] ?>;">
                                <span class="percent"><?= $p ?>%</span>
                            </div>
                        </div>
                    </div>
                <?php endfor; ?>
                <div class="btn openModalReviewsShop"><?= Text::_('MOD_REVIEW_ADD_REVIEW_SHOP'); ?></div>
            </div>
        </div>

        <div class="swiper-reviews swiper">
            <div class="swiper-wrapper">
                <?php foreach ($allReviews as $review): ?>
                    <div class="swiper-slide">
                        <div class="top mb20">
                            <div class="user_info">
                                <div class="user_avatar" style="background:<?= $review->colorName ?>">
                                    <?= $review->initial ?>
                                </div>
                                <div class="review-user_name"><?= $review->user_name ?></div>
                            </div>
                            <div class="review-time"><?= date('d-m-Y', strtotime($review->time)) ?></div>
                        </div>

                        <div class="review-description text"><?= $review->review ?></div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
<?php endif; ?>

<!-- Модальное окно для добавления отзыва -->
<div class="modalReviewsShop">
    <div class="content-modalReviewsShop">
        <span class="closeModal">&times;</span>
        <div id="msg" class="msg"></div>

        <div class="nameUser mb10">
            <label for="nameUser"><?= Text::_('MOD_REVIEW_LABEL_NAME_USER'); ?></label>
            <input type="text" class="inputbox" name="nameUser" id="nameUser" required>
        </div>

        <div class="emailUser mb10">
            <label for="emailUser"><?= Text::_('MOD_REVIEW_LABEL_EMAIL_USER'); ?></label>
            <input type="text" class="inputbox" name="emailUser" id="emailUser">
        </div>

        <div class="message mb20">
            <label for="message"><?= Text::_('MOD_REVIEW_LABEL_MESSAGE_USER'); ?></label>
            <textarea name="message" id="message" class="inputbox" required></textarea>
        </div>

        <div class="review_stars mb20">
            <?php for ($i = 1; $i <= 5; $i++): ?>
                <span class="star" data-value="<?= $i ?>">&#9733;</span>
            <?php endfor; ?>
        </div>
        
        <div class="capthaModReview">
            <input type="text" class="inputbox" name="capthaModrteviw" id="capthaModrteviw">
        </div>


        <div class="btn submitReview"><?= Text::_('MOD_REVIEW_BTN_SEND'); ?></div>
    </div>
</div>