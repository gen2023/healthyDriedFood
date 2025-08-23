<?php
/**
 * @version      5.0.0 15.09.2018
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
defined('_JEXEC') or die();

use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Language\Text;

$jshopConfig = JSFactory::getConfig();
$user = Factory::getUser();
$adv_user = JSFactory::getUserShop();
$adv_user->prepareUserPrint();
if (!isset($this->user)) {
    $this->user = new stdClass();
}
$this->user->f_name = $adv_user->f_name;
$this->user->l_name = $adv_user->l_name;
$this->user->email = $adv_user->email;

$db = Factory::getDbo();

$app = Factory::getApplication();
$lang = $app->getLanguage();
$langCode = '_' . $lang->getTag();


$config_fields = $this->config_fields;
?>
<div class="jshop cat-page accountPage" id="comjshop">
    <div class="container">
        <div class="page-flex flex between mb80">
            <div class="left-side">
                <div class="user-menu">
                    <div class="user-info icon icon-user mb25">
                        <div class="info">
                            <div class="name"><?= $user->name; ?></div>
                            <div class="email"><?= $user->email ?></div>
                        </div>
                    </div>
                    <?php
                    $module = ModuleHelper::getModules('user-menu');
                    $attribs['style'] = 'none';
                    echo ModuleHelper::renderModule($module[0], $attribs);
                    ?>
                </div>
            </div>
            <div class="right-side">

                <h1><?php print Text::_('JSHOP_MY_ACCOUNT') ?></h1>

                <?php echo $this->tmpl_my_account_html_start ?>
                <div class="jshop_profile_data">

                    <?php if ($this->config->show_client_id_in_my_account) { ?>
                        <div class="client"><span><?php print Text::_('JSHOP_CLIENT_ID') ?>:</span> <?php print $this->user->user_id ?></div>
                    <?php } ?>

                    <?php if ($config_fields['f_name']['display'] || $config_fields['l_name']['display']) { ?>
                        <div class="name"><?php print $this->user->f_name . " " . $this->user->l_name; ?></div>
                    <?php } ?>

                    <?php if ($config_fields['city']['display']) { ?>
                        <div class="city"><span><?php print Text::_('JSHOP_CITY') ?>:</span> <?php print $this->user->city ?></div>
                    <?php } ?>

                    <?php if ($config_fields['state']['display']) { ?>
                        <div class="state"><span><?php print Text::_('JSHOP_STATE') ?>:</span> <?php print $this->user->state ?></div>
                    <?php } ?>

                    <?php if ($config_fields['country']['display']) { ?>
                        <div class="country"><span><?php print Text::_('JSHOP_COUNTRY') ?>:</span> <?php print $this->user->country ?></div>
                    <?php } ?>

                    <?php if ($config_fields['email']['display']) { ?>
                        <div class="email"><span><?php print Text::_('JSHOP_EMAIL') ?>:</span> <?php print $this->user->email ?></div>
                    <?php } ?>

                    <?php if ($this->config->display_user_group) { ?>
                        <div class="group">
                            <span><?php print Text::_('JSHOP_GROUP') ?>:</span>
                            <?php print $this->user->groupname ?>
                            <span class="subinfo">(<?php print Text::_('JSHOP_DISCOUNT') ?>: <?php print $this->user->discountpercent ?>%)</span>

                            <?php if ($this->config->display_user_groups_info) { ?>
                                <a class="jshop_user_group_info" target="_blank" href="<?php print $this->href_user_group_info ?>"><?php print Text::_('JSHOP_USER_GROUPS_INFO') ?></a>
                            <?php } ?>

                        </div>
                    <?php } ?>
                </div>

                <div class="myaccount_urls">
                    <div class="editdata">
                        <a href="<?php print $this->href_edit_data ?>" class="btn"><?php print Text::_('JSHOP_EDIT_DATA') ?></a>
                    </div>
                    <?php echo $this->tmpl_my_account_html_content ?>

                </div>

            </div>
        </div>
        <?php echo $this->tmpl_my_account_html_end ?>

    </div>
</div>