<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
?>
<footer class="footer">
  <div class="container-wide">
    <div class="wrapper">
      <div class="container">
        <div class="top">
          <div class="flex between">
            <div class="footer-contacts">
              <jdoc:include type="modules" name="footer-contacts" style="none" />
            </div>
            <div class="footer-catalog">
              <div class="ttl white font-size-18 mb30"><?= Text::_('TPL_CUSTOM_CATALOG'); ?></div>
              <jdoc:include type="modules" name="footer-catalog" style="none" />
            </div>
            <div class="footer-menu">
              <div class="ttl white font-size-18 mb30"><?= Text::_('TPL_CUSTOM_FOR_CLIENTS'); ?></div>
              <jdoc:include type="modules" name="footer-menu" style="none" />
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="copy">© All rights reserved. HealthyDriedFood. <?php echo date('Y'); ?></div>
        </div>
      </div>
    </div>
  </div>
</footer>