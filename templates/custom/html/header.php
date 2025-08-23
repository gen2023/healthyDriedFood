<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

?>
<header class="header sticky">
  <div class="top">
    <div class="container">
      <div class="flex between">
        <div class="header-menu">
          <jdoc:include type="modules" name="header-menu" style="none" />
        </div>
        <div class="header-contacts flex">
          <a href="https://t.me/healthyDriedFood" class="messenger icon-telegram"></a>
          <a href="viber://chat?number=%2B380731401664" class="messenger icon-viber"></a>
          <a href="tel:+380731401664" class="tel">+380 (73) 140-16-64</a>
          <div class="shedule icon-clock"><?= Text::_('TPL_CUSTOM_SHEDULE'); ?> 09:00-20:00</div>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom container-wide">
    <div class="wrapper">
      <div class="container">
        <div class="flex align-center">
          <a href="<?= Text::_('TPL_CUSTOM_HOME'); ?>" class="logo" title="">
            <?= $logo ?>
          </a>
          <div class="btn btn-white show-cat show-cat-menu icon-catalog">
            <?= Text::_('TPL_CUSTOM_CATALOG'); ?><span class="arr"></span>
            <div class="cat-wrapper">
              <div class="wrapper">
                <jdoc:include type="modules" name="cat-menu" style="none" />
              </div>
            </div>
          </div>

          <jdoc:include type="modules" name="search" style="none" />
          <jdoc:include type="modules" name="lang" style="none" />

          <div class="header-links flex">
            <?php if($user->guest){ ?>
              <a href="index.php?Itemid=263" class="icon-user"></a>
            <?php }else{?>
              <a href="index.php?Itemid=331" class="icon-user"></a>
              <?php } ?>
            
            <a href="#" class="icon-search show-search"></a>
            <jdoc:include type="modules" name="wishlist" style="none" />
            <jdoc:include type="modules" name="cart" style="none" />
          </div>
          <div class="burger-menu icon-burger"></div>
        </div>

      </div>
    </div>
  </div>
</header>