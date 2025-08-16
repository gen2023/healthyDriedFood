<?php
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

/**
 * @version      5.3.5 09.03.2024
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
use Joomla\Component\Jshopping\Site\Helper\Selects;
defined('_JEXEC') or die();

$config_fields = $this->config_fields;
$cssreq = $this->cssreq_fields;
HTMLHelper::_('behavior.formvalidator');

$login_link = Helper::SEFLink('index.php?option=com_jshopping&view=user&task=login');

?>
<div class="jshop login-page" id="comjshop_register">
    <div class="wrapper">
        <?php if (!isset($hideheaderh1)): ?>
            <h1 class="ttl sm centered mb30"><?php print Text::_('JSHOP_REGISTRATION') ?></h1>
        <?php endif; ?>

        <form
            action="<?php print Helper::SEFLink('index.php?option=com_jshopping&controller=user&task=registersave', 1, 0, $this->config->use_ssl) ?>"
            class="form-validate form-horizontal" method="post" name="registration-form" autocomplete="off"
            enctype="multipart/form-data">
            <?php echo $this->_tmpl_register_html_1 ?>
            <div class="jshop_register">
                <?php if ($config_fields['f_name']['display']): ?>
                    <label for="f_name" class="label<?php if ($config_fields['f_name']['require']){echo ' require';}?>"><?php print Text::_('JSHOP_F_NAME') ?></label>
                    <input type="text" name="f_name" id="f_name" value="<?php print $this->user->f_name ?>"
                        class="inputbox form-control <?php echo $cssreq['f_name'] ?>"
                        placeholder="<?php print Text::_('JSHOP_F_NAME') ?>">
                <?php endif; ?>
                <?php if ($config_fields['l_name']['display']): ?>
                    <label for="l_name" class="label<?php if ($config_fields['l_name']['require']){echo ' require';}?>"><?php print Text::_('JSHOP_L_NAME') ?></label>
                    <input type="text" name="l_name" id="l_name" value="<?php print $this->user->l_name ?>"
                        class="inputbox form-control <?php echo $cssreq['l_name'] ?>"
                        placeholder="<?php print Text::_('JSHOP_L_NAME') ?>">
                <?php endif; ?>
                <?php if ($config_fields['phone']['display']): ?>
                    <label for="phone" class="label<?php if ($config_fields['phone']['require']){echo ' require';}?>"><?php print Text::_('JSHOP_TELEFON') ?></label>
                    <input type="text" name="phone" id="phone" value="<?php print $this->user->phone ?>"
                        class="inputbox form-control <?php echo $cssreq['phone']; ?>"
                        placeholder="<?php print Text::_('JSHOP_TELEFON') ?>">
                <?php endif; ?>
                <?php echo $this->_tmpl_register_html_2 ?> 
                <?php if ($config_fields['email']['display']): ?>
                    <label for="email" class="label<?php if ($config_fields['email']['require']){echo ' require';}?>"><?php print Text::_('JSHOP_EMAIL') ?></label>
                    <input type="text" name="email" id="email" value="<?php print $this->user->email ?>"
                        class="inputbox form-control validate-email <?php echo $cssreq['email']; ?>"
                        placeholder="<?php print Text::_('JSHOP_EMAIL') ?>">
                <?php endif; ?>
                <?php echo $this->_tmpl_register_html_3 ?>
                <?php echo $this->_tmpl_register_html_4 ?>
                <?php if ($config_fields['password']['display']): ?>
                    <label for="password" class="label<?php if ($config_fields['password']['require']){echo ' require';}?>"><?php print Text::_('JSHOP_PASSWORD') ?></label>
                    <input type="password" name="password" id="password" value=""
                        class="inputbox form-control registrationTestPassword validate-password <?php echo $cssreq['password']; ?>"
                        placeholder="<?php print Text::_('JSHOP_PASSWORD') ?>">
                <?php endif; ?>
                <?php if ($config_fields['password_2']['display']): ?>
                    <label for="password_2" class="label<?php if ($config_fields['password_2']['require']){echo ' require';}?>"><?php print Text::_('JSHOP_PASSWORD_2') ?></label>
                    <input type="password" name="password_2" id="password_2" value=""
                        class="inputbox form-control <?php echo $cssreq['password_2']; ?>"
                        placeholder="<?php print Text::_('JSHOP_PASSWORD_2') ?>">
                <?php endif; ?>
                <?php echo $this->_tmpl_register_html_5 ?>
            </div>
            <?php /*<div class="requiredtext">* <?php print Text::_('TPL_CUSTOM_REQUIRED_TEXT') ?></div> */?>

            <?php if ($config_fields['ext_field_1']['display']): ?>
                <div class="subscribe-group">
                    <div class="controls">
                        <input type="checkbox" name="ext_field_1" id="ext_field_1"
                            value="<?php print $this->user->ext_field_1 ?>"
                            class="input form-control <?php echo $cssreq['ext_field_1']; ?>">
                        <label for="ext_field_1"></label>
                    </div>
                    <div class="text"><?php print Text::_('TPL_CUSTOM_REGISTER_PAGE_SUBSCRIBE_NEWS') ?></div>
                </div>
            <?php endif; ?>

            <?php echo $this->_tmpl_register_html_51 ?>

            <div class="control-group box_button mb30">
                <?php echo $this->_tmpl_register_html_6 ?>
                <button class="btn btn-primary button icon-user">
                    <?php print Text::_('JSHOP_SEND_REGISTRATION') ?></button>
                <?php /*<input type="submit" value="<?php print Text::_('JSHOP_SEND_REGISTRATION') ?>" class="btn btn-primary button" />*/ ?>
            </div>
            <div class="bottom_info">
                <span class="text"><?php print Text::_('TPL_CUSTOM_REGISTER_PAGE_TEXT_LOGIN') ?>?</span>
                <a href="<?= $login_link ?>">
                    <?php print Text::_('TPL_CUSTOM_REGISTER_PAGE_TEXT_LINK_LOGIN') ?>
                </a>
            </div>
            <?php echo HTMLHelper::_('form.token'); ?>
        </form>
    </div>
</div>
<script type="text/javascript">
    var jshopParams = jshopParams || {};
    jshopParams.urlcheckpassword = '<?php print $this->urlcheckpassword ?>';
</script>