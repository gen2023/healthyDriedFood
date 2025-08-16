<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Component\Jshopping\Administrator\Helper\HelperAdmin;
use Joomla\CMS\Language\Text;


$jshopConfig = JSFactory::getConfig();
HTMLHelper::_('bootstrap.tooltip');
$fields = $this->fields;
$current_fields = $this->current_fields;
$saved_fields = $this->saved_fields;
// var_dump($saved_fields);
?>

<div class="jshop_edit">
    <form class="jshopfieldregister" action="index.php?option=com_jshopping&controller=antispam" method="post"
        name="adminForm" id="adminForm" enctype="multipart/form-data">
        <input type="hidden" name="task" value="">
        <div class="row">
            <div class="col col-12 col-lg-4">
                <div class="card">
                    <h3 class="card-header bg-primary text-white">
                        <?php print Text::_('PLG_JSHOPPING_ANTISPAM_TITLE_ACTIVE_FIELDS') ?>
                    </h3>
                    <div class="card-body">
                        <table class="admintable table-striped">
                            <tr>
                                <th class="key">
                                    &nbsp;
                                </th>
                                <th style="padding-right: 5px">
                                    <?php print Text::_('PLG_JSHOPPING_ANTISPAM_TITLE_VALIDATE_FIELDS') ?>
                                </th>
                            </tr>
                            <?php
                            $display_delivery = 0;
                            foreach ($fields['address'] as $field) {
                                if (isset($current_fields['address'][$field]['display']) && $current_fields['address'][$field]['display']) { ?>
                                    <?php if (!$display_delivery && substr($field, 0, 2) == "d_") { ?>
                                        <tr>
                                            <td class="key">
                                                <?php print Text::_('PLG_JSHOPPING_ANTISPAM_ORDER_COMMENTS_TITLE') ?>
                                            </td>
                                            <td align="center">
                                                <input type="checkbox" name="valid[order_add_info]" class="inputbox"
                                                    value="1" <?php if (isset($saved_fields['order_add_info']) && $saved_fields['order_add_info'])
                                                        echo 'checked="checked"'; ?> />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="key">
                                                <br><b><?php print Text::_('JSHOP_FIELD_DELIVERY_ADRESS') ?></b>
                                            </td>
                                        </tr>
                                        <?php $display_delivery = 1;
                                    } ?>
                                    <?php if($field=='email2' || $field=='country' || $field=='client_type' || $field=='d_country' || $field=='title'){continue; } ?>
                                    <tr>
                                        <td class="key">
                                            <?php
                                            $field_c = $field;
                                            if (substr($field_c, 0, 2) == "d_")
                                                $field_c = substr($field_c, 2, strlen($field_c) - 2);
                                            print Text::_("JSHOP_FIELD_" . strtoupper($field_c));

                                            ?>
                                        </td>
                                        <td align="center">
                                            <input type="checkbox" name="valid[<?php print $field ?>]" class="inputbox"
                                                value="1" <?php if (isset($saved_fields[$field]) && $saved_fields[$field])
                                                    echo 'checked="checked"'; ?> />
                                        </td>
                                    </tr>
                                <?php }
                                ?>

                            <?php } ?>

                        </table>
                    </div>
                </div>
            </div>
            <div class="col col-12 col-lg-8">
                <div class="card">
                    <h3 class="card-header bg-primary text-white">
                        <?php print Text::_('PLG_JSHOPPING_ANTISPAM_VALIDATION_SETTINGS') ?>
                    </h3>
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th><?php print Text::_('PLG_JSHOPPING_ANTISPAM_NAME_FIELD') ?></th>
                                    <th><?php print Text::_('PLG_JSHOPPING_ANTISPAM_ACTION') ?></th>
                                    <th><?php print Text::_('PLG_JSHOPPING_ANTISPAM_DESCRIPTION') ?></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="label_address d-none">
                                    <td></td>
                                    <td class="bg-success text-white">
                                        <?php print Text::_('PLG_JSHOPPING_ANTISPAM_ADDRESS') ?>
                                    </td>
                                    <td></td>
                                </tr>
                                <!-- f_name -->
                                <?php
                                echo createFieldRow(
                                    'f_name',
                                    'stop_word_f_name',
                                    Text::_('JSHOP_FIELD_F_NAME'),
                                    'text',
                                    isset($saved_fields['stop_word_f_name']) ? $saved_fields['stop_word_f_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'f_name',
                                    'count_letter_f_name',
                                    Text::_('JSHOP_FIELD_F_NAME'),
                                    'number',
                                    isset($saved_fields['count_letter_f_name']) ? $saved_fields['count_letter_f_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'f_name',
                                    'only_text_f_name',
                                    Text::_('JSHOP_FIELD_F_NAME'),
                                    'checkbox',
                                    isset($saved_fields['only_text_f_name']) && $saved_fields['only_text_f_name'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_f_name']) && $saved_fields['only_text_f_name'] ? true : false
                                ); ?>
                                <!-- l_name -->
                                <?php
                                echo createFieldRow(
                                    'l_name',
                                    'stop_word_l_name',
                                    Text::_('JSHOP_FIELD_L_NAME'),
                                    'text',
                                    isset($saved_fields['stop_word_l_name']) ? $saved_fields['stop_word_l_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'l_name',
                                    'count_letter_l_name',
                                    Text::_('JSHOP_FIELD_L_NAME'),
                                    'number',
                                    isset($saved_fields['count_letter_l_name']) ? $saved_fields['count_letter_l_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'l_name',
                                    'only_text_l_name',
                                    Text::_('JSHOP_FIELD_L_NAME'),
                                    'checkbox',
                                    isset($saved_fields['only_text_l_name']) && $saved_fields['only_text_l_name'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_l_name']) && $saved_fields['only_text_l_name'] ? true : false
                                ); ?>
                                <!-- m_name -->
                                <?php
                                echo createFieldRow(
                                    'm_name',
                                    'stop_word_m_name',
                                    Text::_('JSHOP_FIELD_M_NAME'),
                                    'text',
                                    isset($saved_fields['stop_word_m_name']) ? $saved_fields['stop_word_m_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'm_name',
                                    'count_letter_m_name',
                                    Text::_('JSHOP_FIELD_M_NAME'),
                                    'number',
                                    isset($saved_fields['count_letter_m_name']) ? $saved_fields['count_letter_m_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'm_name',
                                    'only_text_m_name',
                                    Text::_('JSHOP_FIELD_M_NAME'),
                                    'checkbox',
                                    isset($saved_fields['only_text_m_name']) && $saved_fields['only_text_m_name'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_m_name']) && $saved_fields['only_text_m_name'] ? true : false
                                ); ?>
                                <!-- firma_name -->
                                <?php
                                echo createFieldRow(
                                    'firma_name',
                                    'stop_word_firma_name',
                                    Text::_('JSHOP_FIELD_FIRMA_NAME'),
                                    'text',
                                    isset($saved_fields['stop_word_firma_name']) ? $saved_fields['stop_word_firma_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'firma_name',
                                    'count_letter_firma_name',
                                    Text::_('JSHOP_FIELD_FIRMA_NAME'),
                                    'number',
                                    isset($saved_fields['count_letter_firma_name']) ? $saved_fields['count_letter_firma_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'firma_name',
                                    'only_text_firma_name',
                                    Text::_('JSHOP_FIELD_FIRMA_NAME'),
                                    'checkbox',
                                    isset($saved_fields['only_text_firma_name']) && $saved_fields['only_text_firma_name'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_firma_name']) && $saved_fields['only_text_firma_name'] ? true : false
                                ); ?>
                                <!-- firma_code -->
                                <?php
                                echo createFieldRow(
                                    'firma_code',
                                    'stop_word_firma_code',
                                    Text::_('JSHOP_FIELD_FIRMA_CODE'),
                                    'text',
                                    isset($saved_fields['stop_word_firma_code']) ? $saved_fields['stop_word_firma_code'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'firma_code',
                                    'count_letter_firma_code',
                                    Text::_('JSHOP_FIELD_FIRMA_CODE'),
                                    'number',
                                    isset($saved_fields['count_letter_firma_code']) ? $saved_fields['count_letter_firma_code'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'firma_code',
                                    'only_int_firma_code',
                                    Text::_('JSHOP_FIRMA_CODE'),
                                    'checkbox',
                                    isset($saved_fields['only_int_firma_code']) && $saved_fields['only_int_firma_code'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_firma_code']) && $saved_fields['only_int_firma_code'] ? true : false
                                ); ?>
                                <!-- tax_number -->
                                <?php
                                echo createFieldRow(
                                    'tax_number',
                                    'stop_word_tax_number',
                                    Text::_('JSHOP_TAX_NUMBER'),
                                    'text',
                                    isset($saved_fields['stop_word_tax_number']) ? $saved_fields['stop_word_tax_number'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'tax_number',
                                    'count_letter_tax_number',
                                    Text::_('JSHOP_TAX_NUMBER'),
                                    'number',
                                    isset($saved_fields['count_letter_tax_number']) ? $saved_fields['count_letter_tax_number'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <!-- email -->
                                <?php
                                echo createFieldRow(
                                    'email',
                                    '',
                                    Text::_('JSHOP_FIELD_EMAIL'),
                                    '',
                                    '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_EMAIL_IS_DOMEN')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'email',
                                    'exclude_domains',
                                    Text::_('JSHOP_FIELD_EMAIL'),
                                    'text',
                                    isset($saved_fields['exclude_domains']) ? $saved_fields['exclude_domains'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_EXCLUDE_DOMAINS')
                                ); ?>                          
                                <!-- birthday -->
                                <?php
                                echo createFieldRow(
                                    'birthday',
                                    'min_age_birthday',
                                    Text::_('JSHOP_FIELD_BIRTHDAY'),
                                    'number',
                                    isset($saved_fields['min_age_birthday']) ? $saved_fields['min_age_birthday'] : '18',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_MIN_AGE')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'birthday',
                                    'birthday_future',
                                    Text::_('JSHOP_FIELD_BIRTHDAY'),
                                    'checkbox',
                                    isset($saved_fields['birthday_future']) && $saved_fields['birthday_future'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_VALIDATE_DATE_FUTURE'),
                                    isset($saved_fields['birthday_future']) && $saved_fields['birthday_future'] ? true : false
                                ); ?>
                                <!-- home -->
                                <?php
                                echo createFieldRow(
                                    'home',
                                    'only_int_home',
                                    Text::_('JSHOP_FIELD_HOME'),
                                    'checkbox',
                                    isset($saved_fields['only_int_home']) && $saved_fields['only_int_home'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_home']) && $saved_fields['only_int_home'] ? true : false
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'home',
                                    'stop_word_home',
                                    Text::_('JSHOP_FIELD_HOME'),
                                    'text',
                                    isset($saved_fields['stop_word_home']) ? $saved_fields['stop_word_home'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'home',
                                    'count_letter_home',
                                    Text::_('JSHOP_FIELD_HOME'),
                                    'number',
                                    isset($saved_fields['count_letter_home']) ? $saved_fields['count_letter_home'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <!-- apartment -->
                                <?php
                                echo createFieldRow(
                                    'apartment',
                                    'only_int_apartment',
                                    Text::_('JSHOP_FIELD_APARTMENT'),
                                    'checkbox',
                                    isset($saved_fields['only_int_apartment']) && $saved_fields['only_int_apartment'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_apartment']) && $saved_fields['only_int_apartment'] ? true : false
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'apartment',
                                    'stop_word_apartment',
                                    Text::_('JSHOP_FIELD_APARTMENT'),
                                    'text',
                                    isset($saved_fields['stop_word_apartment']) ? $saved_fields['stop_word_apartment'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'apartment',
                                    'count_letter_apartment',
                                    Text::_('JSHOP_FIELD_APARTMENT'),
                                    'number',
                                    isset($saved_fields['count_letter_apartment']) ? $saved_fields['count_letter_apartment'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>                                  
                                <!-- street -->
                                <?php
                                echo createFieldRow(
                                    'street',
                                    'stop_word_street',
                                    Text::_('JSHOP_FIELD_STREET'),
                                    'text',
                                    isset($saved_fields['stop_word_street']) ? $saved_fields['stop_word_street'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'street',
                                    'count_letter_street',
                                    Text::_('JSHOP_FIELD_STREET'),
                                    'number',
                                    isset($saved_fields['count_letter_street']) ? $saved_fields['count_letter_street'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <!-- street_nr -->
                                <?php
                                echo createFieldRow(
                                    'street_nr',
                                    'only_int_street_nr',
                                    Text::_('JSHOP_FIELD_STREET_NR'),
                                    'checkbox',
                                    isset($saved_fields['only_int_street_nr']) && $saved_fields['only_int_street_nr'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_street_nr']) && $saved_fields['only_int_street_nr'] ? true : false
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'street_nr',
                                    'stop_word_street_nr',
                                    Text::_('JSHOP_FIELD_STREET_NR'),
                                    'text',
                                    isset($saved_fields['stop_word_street_nr']) ? $saved_fields['stop_word_street_nr'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'street_nr',
                                    'count_letter_street_nr',
                                    Text::_('JSHOP_FIELD_STREET_NR'),
                                    'number',
                                    isset($saved_fields['count_letter_street_nr']) ? $saved_fields['count_letter_street_nr'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>                                
                                <!-- zip -->
                                <?php
                                echo createFieldRow(
                                    'zip',
                                    'only_int_zip',
                                    Text::_('JSHOP_FIELD_ZIP'),
                                    'checkbox',
                                    isset($saved_fields['only_int_zip']) && $saved_fields['only_int_zip'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_zip']) && $saved_fields['only_int_zip'] ? true : false
                                ); ?>
                                <!-- city -->
                                <?php
                                echo createFieldRow(
                                    'city',
                                    'stop_word_city',
                                    Text::_('JSHOP_FIELD_CITY'),
                                    'text',
                                    isset($saved_fields['stop_word_city']) ? $saved_fields['stop_word_city'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'city',
                                    'count_letter_city',
                                    Text::_('JSHOP_FIELD_CITY'),
                                    'number',
                                    isset($saved_fields['count_letter_city']) ? $saved_fields['count_letter_city'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'city',
                                    'only_text_city',
                                    Text::_('JSHOP_FIELD_CITY'),
                                    'checkbox',
                                    isset($saved_fields['only_text_city']) && $saved_fields['only_text_city'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_city']) && $saved_fields['only_text_city'] ? true : false
                                ); ?>
                                <!-- state -->
                                <?php
                                echo createFieldRow(
                                    'state',
                                    'stop_word_state',
                                    Text::_('JSHOP_FIELD_STATE'),
                                    'text',
                                    isset($saved_fields['stop_word_state']) ? $saved_fields['stop_word_state'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'state',
                                    'count_letter_state',
                                    Text::_('JSHOP_FIELD_STATE'),
                                    'number',
                                    isset($saved_fields['count_letter_state']) ? $saved_fields['count_letter_state'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'state',
                                    'only_text_state',
                                    Text::_('JSHOP_FIELD_STATE'),
                                    'checkbox',
                                    isset($saved_fields['only_text_state']) && $saved_fields['only_text_state'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_state']) && $saved_fields['only_text_state'] ? true : false
                                ); ?>
                                <!-- phone -->
                                <?php
                                echo createFieldRow(
                                    'phone',
                                    'count_letter_phone',
                                    Text::_('JSHOP_FIELD_PHONE'),
                                    'number',
                                    isset($saved_fields['count_letter_phone']) ? $saved_fields['count_letter_phone'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'phone',
                                    'check_no_text_phone',
                                    Text::_('JSHOP_FIELD_PHONE'),
                                    'checkbox',
                                    isset($saved_fields['check_no_text_phone']) && $saved_fields['check_no_text_phone'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_IS_NOT_TEXT'),
                                    isset($saved_fields['check_no_text_phone']) && $saved_fields['check_no_text_phone'] ? true : false
                                ); ?>
                                <!-- mobil_phone -->
                                <?php
                                echo createFieldRow(
                                    'mobil_phone',
                                    'count_letter_mobil_phone',
                                    Text::_('JSHOP_FIELD_MOBIL_PHONE'),
                                    'number',
                                    isset($saved_fields['count_letter_mobil_phone']) ? $saved_fields['count_letter_mobil_phone'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'mobil_phone',
                                    'check_no_text_mobil_phone',
                                    Text::_('JSHOP_FIELD_MOBIL_PHONE'),
                                    'checkbox',
                                    isset($saved_fields['check_no_text_mobil_phone']) && $saved_fields['check_no_text_mobil_phone'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_IS_NOT_TEXT'),
                                    isset($saved_fields['check_no_text_mobil_phone']) && $saved_fields['check_no_text_mobil_phone'] ? true : false
                                ); ?>
                                <!-- fax -->
                                <?php
                                echo createFieldRow(
                                    'fax',
                                    'count_letter_fax',
                                    Text::_('JSHOP_FIELD_FAX'),
                                    'number',
                                    isset($saved_fields['count_letter_fax']) ? $saved_fields['count_letter_fax'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'fax',
                                    'check_no_text_fax',
                                    Text::_('JSHOP_FIELD_FAX'),
                                    'checkbox',
                                    isset($saved_fields['check_no_text_fax']) && $saved_fields['check_no_text_fax'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_IS_NOT_TEXT'),
                                    isset($saved_fields['check_no_text_fax']) && $saved_fields['check_no_text_fax'] ? true : false
                                ); ?>
                                <!-- order_add_info -->
                                <?php
                                echo createFieldRow(
                                    'order_add_info',
                                    'stop_word_order_add_info',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_ORDER_COMMENTS_TITLE'),
                                    'text',
                                    isset($saved_fields['stop_word_order_add_info']) ? $saved_fields['stop_word_order_add_info'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD'),
                                    '',
                                    'd-table-row'
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'order_add_info',
                                    'count_letter_order_add_info',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_ORDER_COMMENTS_TITLE'),
                                    'number',
                                    isset($saved_fields['count_letter_order_add_info']) ? $saved_fields['count_letter_order_add_info'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT'),
                                    '',
                                    'd-table-row'
                                ); ?>
                                <!-- label -->
                                <tr class="d_label_address d-none">
                                    <td></td>
                                    <td class="bg-success text-white">
                                        <?php print Text::_('PLG_JSHOPPING_ANTISPAM_ADDRESS_SHIPPING') ?>
                                    </td>
                                    <td></td>
                                </tr>
                                <!-- d_f_name -->
                                <?php
                                echo createFieldRow(
                                    'd_f_name',
                                    'stop_word_d_f_name',
                                    Text::_('JSHOP_FIELD_F_NAME'),
                                    'text',
                                    isset($saved_fields['stop_word_d_f_name']) ? $saved_fields['stop_word_d_f_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_f_name',
                                    'count_letter_d_f_name',
                                    Text::_('JSHOP_FIELD_F_NAME'),
                                    'number',
                                    isset($saved_fields['count_letter_d_f_name']) ? $saved_fields['count_letter_d_f_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_f_name',
                                    'only_text_d_f_name',
                                    Text::_('JSHOP_FIELD_F_NAME'),
                                    'checkbox',
                                    isset($saved_fields['only_text_d_f_name']) && $saved_fields['only_text_d_f_name'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_d_f_name']) && $saved_fields['only_text_d_f_name'] ? true : false
                                ); ?>
                                <!-- d_l_name -->
                                <?php
                                echo createFieldRow(
                                    'd_l_name',
                                    'stop_word_d_l_name',
                                    Text::_('JSHOP_FIELD_L_NAME'),
                                    'text',
                                    isset($saved_fields['stop_word_d_l_name']) ? $saved_fields['stop_word_d_l_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_l_name',
                                    'count_letter_d_l_name',
                                    Text::_('JSHOP_FIELD_L_NAME'),
                                    'number',
                                    isset($saved_fields['count_letter_d_l_name']) ? $saved_fields['count_letter_d_l_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_l_name',
                                    'only_text_d_l_name',
                                    Text::_('JSHOP_FIELD_L_NAME'),
                                    'checkbox',
                                    isset($saved_fields['only_text_d_l_name']) && $saved_fields['only_text_d_l_name'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_d_l_name']) && $saved_fields['only_text_d_l_name'] ? true : false
                                ); ?>
                                <!-- d_m_name -->
                                <?php
                                echo createFieldRow(
                                    'd_m_name',
                                    'stop_word_d_m_name',
                                    Text::_('JSHOP_FIELD_M_NAME'),
                                    'text',
                                    isset($saved_fields['stop_word_d_m_name']) ? $saved_fields['stop_word_d_m_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_m_name',
                                    'count_letter_d_m_name',
                                    Text::_('JSHOP_FIELD_M_NAME'),
                                    'number',
                                    isset($saved_fields['count_letter_d_m_name']) ? $saved_fields['count_letter_d_m_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_m_name',
                                    'only_text_d_m_name',
                                    Text::_('JSHOP_FIELD_M_NAME'),
                                    'checkbox',
                                    isset($saved_fields['only_text_d_m_name']) && $saved_fields['only_text_d_m_name'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_d_m_name']) && $saved_fields['only_text_d_m_name'] ? true : false
                                ); ?>
                                <!-- d_firma_name -->
                                <?php
                                echo createFieldRow(
                                    'd_firma_name',
                                    'stop_word_d_firma_name',
                                    Text::_('JSHOP_FIELD_FIRMA_NAME'),
                                    'text',
                                    isset($saved_fields['stop_word_d_firma_name']) ? $saved_fields['stop_word_d_firma_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_firma_name',
                                    'count_letter_d_firma_name',
                                    Text::_('JSHOP_FIELD_FIRMA_NAME'),
                                    'number',
                                    isset($saved_fields['count_letter_d_firma_name']) ? $saved_fields['count_letter_d_firma_name'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_firma_name',
                                    'only_text_d_firma_name',
                                    Text::_('JSHOP_FIELD_FIRMA_NAME'),
                                    'checkbox',
                                    isset($saved_fields['only_text_d_firma_name']) && $saved_fields['only_text_d_firma_name'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_d_firma_name']) && $saved_fields['only_text_d_firma_name'] ? true : false
                                ); ?>
                                <!-- d_email -->
                                <?php
                                echo createFieldRow(
                                    'd_email',
                                    '',
                                    'Email',
                                    '',
                                    '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_EMAIL_IS_DOMEN')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_email',
                                    'd_exclude_domains',
                                    Text::_('JSHOP_FIELD_EMAIL'),
                                    'text',
                                    isset($saved_fields['d_exclude_domains']) ? $saved_fields['d_exclude_domains'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_EXCLUDE_DOMAINS')
                                ); ?>    
                                <!-- d_birthday -->
                                <?php
                                echo createFieldRow(
                                    'd_birthday',
                                    'min_age_d_birthday',
                                    Text::_('JSHOP_FIELD_BIRTHDAY'),
                                    'number',
                                    isset($saved_fields['min_age_d_birthday']) ? $saved_fields['min_age_d_birthday'] : '18',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_MIN_AGE')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_birthday',
                                    'd_birthday_future',
                                    Text::_('JSHOP_FIELD_BIRTHDAY'),
                                    'checkbox',
                                    isset($saved_fields['d_birthday_future']) && $saved_fields['d_birthday_future'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_VALIDATE_DATE_FUTURE'),
                                    isset($saved_fields['d_birthday_future']) && $saved_fields['d_birthday_future'] ? true : false
                                ); ?>
                                <!-- d_home -->
                                <?php
                                echo createFieldRow(
                                    'd_home',
                                    'only_int_d_home',
                                    Text::_('JSHOP_FIELD_HOME'),
                                    'checkbox',
                                    isset($saved_fields['only_int_d_home']) && $saved_fields['only_int_d_home'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_d_home']) && $saved_fields['only_int_d_home'] ? true : false
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_home',
                                    'stop_word_d_home',
                                    Text::_('JSHOP_FIELD_HOME'),
                                    'text',
                                    isset($saved_fields['stop_word_d_home']) ? $saved_fields['stop_word_d_home'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_home',
                                    'count_letter_d_home',
                                    Text::_('JSHOP_FIELD_HOME'),
                                    'number',
                                    isset($saved_fields['count_letter_d_home']) ? $saved_fields['count_letter_d_home'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>                                
                                <!-- d_apartment -->
                                <?php
                                echo createFieldRow(
                                    'd_apartment',
                                    'only_int_d_apartment',
                                    Text::_('JSHOP_FIELD_APARTMENT'),
                                    'checkbox',
                                    isset($saved_fields['only_int_d_apartment']) && $saved_fields['only_int_d_apartment'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_d_apartment']) && $saved_fields['only_int_d_apartment'] ? true : false
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_apartment',
                                    'stop_word_d_apartment',
                                    Text::_('JSHOP_FIELD_APARTMENT'),
                                    'text',
                                    isset($saved_fields['stop_word_d_apartment']) ? $saved_fields['stop_word_d_apartment'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_apartment',
                                    'count_letter_d_apartment',
                                    Text::_('JSHOP_FIELD_APARTMENT'),
                                    'number',
                                    isset($saved_fields['count_letter_d_apartment']) ? $saved_fields['count_letter_d_apartment'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>                                   
                                <!-- d_street -->
                                <?php
                                echo createFieldRow(
                                    'd_street',
                                    'stop_word_d_street',
                                    Text::_('JSHOP_FIELD_STREET'),
                                    'text',
                                    isset($saved_fields['stop_word_d_street']) ? $saved_fields['stop_word_d_street'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_street',
                                    'count_letter_d_street',
                                    Text::_('JSHOP_FIELD_STREET'),
                                    'number',
                                    isset($saved_fields['count_letter_d_street']) ? $saved_fields['count_letter_d_street'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <!-- d_street_nr -->
                                <?php
                                echo createFieldRow(
                                    'd_street_nr',
                                    'only_int_d_street_nr',
                                    Text::_('JSHOP_FIELD_STREET_NR'),
                                    'checkbox',
                                    isset($saved_fields['only_int_d_street_nr']) && $saved_fields['only_int_d_street_nr'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_d_street_nr']) && $saved_fields['only_int_d_street_nr'] ? true : false
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_street_nr',
                                    'stop_word_d_street_nr',
                                    Text::_('JSHOP_FIELD_STREET_NR'),
                                    'text',
                                    isset($saved_fields['stop_word_d_street_nr']) ? $saved_fields['stop_word_d_street_nr'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_street_nr',
                                    'count_letter_d_street_nr',
                                    Text::_('JSHOP_FIELD_STREET_NR'),
                                    'number',
                                    isset($saved_fields['count_letter_d_street_nr']) ? $saved_fields['count_letter_d_street_nr'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>                                  
                                <!-- d_zip -->
                                <?php
                                echo createFieldRow(
                                    'd_zip',
                                    'only_int_d_zip',
                                    Text::_('JSHOP_FIELD_ZIP'),
                                    'checkbox',
                                    isset($saved_fields['only_int_d_zip']) && $saved_fields['only_int_d_zip'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_NUMBERS'),
                                    isset($saved_fields['only_int_d_zip']) && $saved_fields['only_int_d_zip'] ? true : false
                                ); ?>
                                <!-- d_state -->
                                <?php
                                echo createFieldRow(
                                    'd_state',
                                    'stop_word_d_state',
                                    Text::_('JSHOP_FIELD_STATE'),
                                    'text',
                                    isset($saved_fields['stop_word_d_state']) ? $saved_fields['stop_word_d_state'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_state',
                                    'count_letter_d_state',
                                    Text::_('JSHOP_FIELD_STATE'),
                                    'number',
                                    isset($saved_fields['count_letter_d_state']) ? $saved_fields['count_letter_d_state'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_state',
                                    'only_text_d_state',
                                    Text::_('JSHOP_FIELD_STATE'),
                                    'checkbox',
                                    isset($saved_fields['only_text_d_state']) && $saved_fields['only_text_d_state'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_d_state']) && $saved_fields['only_text_d_state'] ? true : false
                                ); ?>
                                <!-- d_city -->
                                <?php
                                echo createFieldRow(
                                    'd_city',
                                    'stop_word_d_city',
                                    Text::_('JSHOP_FIELD_CITY'),
                                    'text',
                                    isset($saved_fields['stop_word_d_city']) ? $saved_fields['stop_word_d_city'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_STOP_WORLD')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_city',
                                    'count_letter_d_city',
                                    Text::_('JSHOP_FIELD_CITY'),
                                    'number',
                                    isset($saved_fields['count_letter_d_city']) ? $saved_fields['count_letter_d_city'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_city',
                                    'only_text_d_city',
                                    Text::_('JSHOP_FIELD_CITY'),
                                    'checkbox',
                                    isset($saved_fields['only_text_d_city']) && $saved_fields['only_text_d_city'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_ONLY_LANG_TEXT'),
                                    isset($saved_fields['only_text_d_city']) && $saved_fields['only_text_d_city'] ? true : false
                                ); ?>
                                <!-- d_phone -->
                                <?php
                                echo createFieldRow(
                                    'd_phone',
                                    'count_letter_d_phone',
                                    Text::_('JSHOP_FIELD_PHONE'),
                                    'number',
                                    isset($saved_fields['count_letter_d_phone']) ? $saved_fields['count_letter_d_phone'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_phone',
                                    'check_no_text_d_phone',
                                    Text::_('JSHOP_FIELD_PHONE'),
                                    'checkbox',
                                    isset($saved_fields['check_no_text_d_phone']) && $saved_fields['check_no_text_d_phone'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_IS_NOT_TEXT'),
                                    isset($saved_fields['check_no_text_d_phone']) && $saved_fields['check_no_text_d_phone'] ? true : false
                                ); ?>
                                <!-- d_mobil_phone -->
                                <?php
                                echo createFieldRow(
                                    'd_mobil_phone',
                                    'count_letter_d_mobil_phone',
                                    Text::_('JSHOP_FIELD_MOBIL_PHONE'),
                                    'number',
                                    isset($saved_fields['count_letter_d_mobil_phone']) ? $saved_fields['count_letter_d_mobil_phone'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_mobil_phone',
                                    'check_no_text_d_mobil_phone',
                                    Text::_('JSHOP_FIELD_MOBIL_PHONE'),
                                    'checkbox',
                                    isset($saved_fields['check_no_text_d_mobil_phone']) && $saved_fields['check_no_text_d_mobil_phone'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_IS_NOT_TEXT'),
                                    isset($saved_fields['check_no_text_d_mobil_phone']) && $saved_fields['check_no_text_d_mobil_phone'] ? true : false
                                ); ?>
                                <!-- d_fax -->
                                <?php
                                echo createFieldRow(
                                    'd_fax',
                                    'count_letter_d_fax',
                                    Text::_('JSHOP_FIELD_FAX'),
                                    'number',
                                    isset($saved_fields['count_letter_d_fax']) ? $saved_fields['count_letter_d_fax'] : '',
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_LENGTH_INPUT')
                                ); ?>
                                <?php
                                echo createFieldRow(
                                    'd_fax',
                                    'check_no_text_d_fax',
                                    Text::_('JSHOP_FIELD_FAX'),
                                    'checkbox',
                                    isset($saved_fields['check_no_text_d_fax']) && $saved_fields['check_no_text_d_fax'],
                                    Text::_('PLG_JSHOPPING_ANTISPAM_DESCR_IS_NOT_TEXT'),
                                    isset($saved_fields['check_no_text_d_fax']) && $saved_fields['check_no_text_d_fax'] ? true : false
                                ); ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<?php

function createFieldRow($fieldName, $inputName, $fieldLabel, $fieldType, $fieldValue, $description, $checked = false, $className = 'd-none')
{
    $checkedAttribute = $checked ? 'checked="checked"' : '';
    $valueAttribute = $fieldType == 'checkbox' ? '' : 'value="' . htmlspecialchars($fieldValue, ENT_QUOTES, 'UTF-8') . '"';

    switch ($fieldType) {
        case 'text':
        case 'number':
            return "
                <tr class=\"{$fieldName} {$className}\">
                    <td class=\"key\"><b>{$fieldLabel}</b></td>
                    <td><input class=\"form-control\" type=\"{$fieldType}\" name=\"valid[{$inputName}]\" {$valueAttribute}></td>
                    <td>{$description}</td>
                </tr>
            ";
        case 'checkbox':
            return "
                <tr class=\"{$fieldName} {$className}\">
                    <td class=\"key\"><b>{$fieldLabel}</b></td>
                    <td><input type=\"checkbox\" name=\"valid[{$inputName}]\" class=\"inputbox\" value=\"1\" {$checkedAttribute} /></td>
                    <td>{$description}</td>
                </tr>
            ";
        default:
            return "
            <tr class=\"{$fieldName} {$className}\">
                    <td class=\"key\"><b>{$fieldLabel}</b></td>
                    <td></td>
                    <td>{$description}</td>
                </tr>";
    }
}

?>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        function toggleBlocks() {
            let checkboxes = document.querySelectorAll('input[type="checkbox"][name^="valid"]');
            let showLabelAddress = false;
            let showDLabelAddress = false;

            checkboxes.forEach(function (checkbox) {
                let fieldName = checkbox.name.replace('valid[', '').replace(']', '');
                let targetBlock = document.querySelectorAll('.' + fieldName);

                if (targetBlock) {
                    targetBlock.forEach(element => {
                        element.classList.toggle('d-none', !checkbox.checked);
                    });
                }
                if (checkbox.checked) {
                    let fieldName = checkbox.name.replace('valid[', '').replace(']', '');
                    if (fieldName.startsWith('d_')) {
                        showDLabelAddress = true;
                    } else {
                        showLabelAddress = true;
                    }
                }
            });
            document.querySelector('.label_address').classList.toggle('d-none', !showLabelAddress);
            document.querySelector('.d_label_address').classList.toggle('d-none', !showDLabelAddress);
        }

        toggleBlocks();

        document.querySelectorAll('input[type="checkbox"][name^="valid"]').forEach(function (checkbox) {
            checkbox.addEventListener("change", toggleBlocks);
        });
    });

</script>