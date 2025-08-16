<?php
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\HTML\HTMLHelper;

/**
 * @version      5.0.0 15.09.2018
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
defined('_JEXEC') or die();

$is_uname = $this->config_fields["u_name"]["display"];
?>
<div class="jshop login-page" id="comjshop">
    <div class="wrapper">
        <h1 class="ttl sm centered mb30"><?php print Text::_('JSHOP_LOGIN') ?></h1>
        <?php print $this->checkout_navigator ?>

        <?php echo $this->tmpl_login_html_1 ?>
        <div class="row">
            <?php echo $this->tmpl_login_html_2 ?>

            <form method="post"
                action="<?php print Helper::SEFLink('index.php?option=com_jshopping&controller=user&task=loginsave', 1, 0, $this->config->use_ssl) ?>"
                name="jlogin" class="form-horizontal">
                <label for="jlusername" class="label">Email</label>
                <input type="text" id="jlusername" name="username" value="" class="inputbox form-control" required
                    placeholder="<?php print $is_uname ? Text::_('JSHOP_USERNAME') : Text::_('JSHOP_EMAIL'); ?>">
                <label for="jlpassword" class="label"><?php print Text::_('JSHOP_PASSWORT') ?></label>    
                <input type="password" id="jlpassword" name="passwd" value="" class="inputbox form-control" required
                    placeholder="<?php print Text::_('JSHOP_PASSWORT') ?>">
                <div class="d-none rowremember">
                    <input type="checkbox" name="remember" id="remember_me" value="yes" checked />
                </div>
                <button class="btn btn-success button icon-user mb30">
                    </svg><?php print Text::_('JSHOP_LOGIN') ?>
                </button>
                <?php /*<input type="submit" class="btn btn-success button" value="<?php print Text::_('JSHOP_LOGIN') ?>" />*/?>
                <input type="hidden" name="return" value="<?php print $this->return ?>" />
                <?php echo HTMLHelper::_('form.token'); ?>
                <?php echo $this->tmpl_login_html_3 ?>
            </form>
            <div class="controll">
                    <div class="top">
                        <span class="before-text"><?php print Text::_('TPL_CUSTOM_TEXT_BEFORE_LOGIN_REGISTER') ?></span>
                        <a href="<?= Helper::SEFLink('index.php?option=com_jshopping&view=user&task=register')?>"><?php print Text::_('JREGISTER') ?></a>
                    </div>
                    <a href="<?php print $this->href_lost_pass ?>"><?php print Text::_('JSHOP_LOST_PASSWORD') ?>?</a>
                </div>
        </div>
    </div>
    <?php echo $this->tmpl_login_html_4 ?>
    <?php echo $this->tmpl_login_html_5 ?>
    <?php echo $this->tmpl_login_html_6 ?>
</div>