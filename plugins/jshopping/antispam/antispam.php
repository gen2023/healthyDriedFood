<?php

defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;

class PlgJshoppingAntispam extends CMSPlugin
{
    protected $autoloadLanguage = true;
    protected $token;
    protected $chat_id;
    protected $site;

    public function __construct(&$subject, $config)
    {
        parent::__construct($subject, $config);
        // $lang = Factory::getApplication()->getLanguage();
        // $lang->load('plg_jshopping_antispam', JPATH_SITE);
        $this->site = Uri::root(false);
        $this->token = $this->params->get('token_id', '');
        $this->chat_id = $this->params->get('chat_id', '');
    }

    public function onBeforeAdminConfigPanelIcoDisplay(&$menu)
    {

        $menu['antispamconfig'] = array(
            Text::_('PLG_JSHOPPING_ANTISPAM_SETTINGS'),
            'index.php?option=com_jshopping&controller=antispam&task=antispam',
            'antispam.png',
            1
        );
    }

    public function onBeforeCreateOrder(&$order, &$cart, &$obj)
    {
        $app = Factory::getApplication();
        // $checkoutStep = \JSFactory::getModel('checkoutStep', 'Site');
        // $back_url = $checkoutStep->getCheckoutUrl('5');

        $input = Factory::getApplication()->input;


        // $jshopConfig = \JSFactory::getConfig();

        // Получаем настройки антиспама из конфигурации
        $db = Factory::getContainer()->get('DatabaseDriver');
        $query = $db->getQuery(true)
            ->select($db->quoteName('value'))
            ->from($db->quoteName('#__jshopping_configs'))
            ->where($db->quoteName('key') . ' = ' . $db->quote('antispam_fields'));

        try {
            $antispamFields = $db->setQuery($query)->loadResult();
            $antispamFields = json_decode($antispamFields, true);

            if ((int) $this->params->get('enable_captcha', 0) == 1) {

                $captha = trim($input->getString('captha', ''));
                $this->valueCaptha($captha);
            }

            if ($antispamFields) {
                $fieldsToCheck = [
                    'f_name' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_F_NAME')],
                    'l_name' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_L_NAME')],
                    'm_name' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_M_NAME')],
                    'firma_name' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_FIRMA_NAME')],
                    'firma_code' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_FIRMA_CODE')],
                    'tax_number' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_TAX_NUMBER')],
                    'email' => [
                        'label' => Text::_('PLG_JSHOPPING_ANTISPAM_EMAIL'),
                        'email_check' => 1,
                        'exclude_domains' => $antispamFields['exclude_domains'] ?? '',
                    ],
                    'birthday' => [
                        'label' => Text::_('PLG_JSHOPPING_ANTISPAM_BIRTHDAY'),
                        'min_age' => $antispamFields['min_age_birthday'] ?? 0,
                        'no_future' => $antispamFields['birthday_future'] ?? 0
                    ],
                    'home' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_HOME')],
                    'apartment' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_APARTMENT')],
                    'street' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_STREET')],
                    'street_nr' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_STREET_NR')],
                    'zip' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_ZIP')],
                    'city' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_CITY')],
                    'state' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_STATE')],
                    'phone' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_PHONE')],
                    'mobil_phone' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_MOBIL_PHONE')],
                    'fax' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_FAX')],
                    'order_add_info' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_ORDER_COMMENT')],
                ];

                foreach ($fieldsToCheck as $field => $meta) {
                    if (
                        isset($antispamFields[$field]) &&
                        $antispamFields[$field] &&
                        isset($order->$field) &&
                        $order->$field !== ''
                    ) {
                        $config = [];

                        if (isset($antispamFields['stop_word_' . $field])) {
                            $config['stop_word'] = $antispamFields['stop_word_' . $field];
                        }
                        if (isset($antispamFields['count_letter_' . $field])) {
                            $config['count_letter'] = $antispamFields['count_letter_' . $field];
                        }
                        if (isset($antispamFields['only_text_' . $field])) {
                            $config['only_text'] = $antispamFields['only_text_' . $field];
                        }
                        if (isset($antispamFields['only_int_' . $field])) {
                            $config['only_int'] = $antispamFields['only_int_' . $field];
                        }
                        if (isset($antispamFields['check_no_text_' . $field])) {
                            $config['check_no_text'] = $antispamFields['check_no_text_' . $field];
                        }
                        if (isset($meta['email_check'])) {
                            $config['email_check'] = $meta['email_check'];
                        }
                        if (isset($meta['exclude_domains'])) {
                            $config['exclude_domains'] = $meta['exclude_domains'];
                        }
                        if (isset($meta['min_age'])) {
                            $config['min_age'] = $meta['min_age'];
                        }
                        if (isset($meta['no_future'])) {
                            $config['no_future'] = $meta['no_future'];
                        }

                        if (!$this->validateField($meta['label'], $order->$field, $config)) {
                            return false;
                        }
                    }
                }

                $adv_user = JSFactory::getUser();
                if ($adv_user->delivery_adress == 1) {
                    $fieldsToCheck = [
                        'd_f_name' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_F_NAME')],
                        'd_l_name' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_L_NAME')],
                        'd_m_name' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_M_NAME')],
                        'd_firma_name' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_FIRMA_NAME')],
                        'd_email' => [
                            'label' => Text::_('PLG_JSHOPPING_ANTISPAM_EMAIL'),
                            'email_check' => 1
                        ],
                        'd_birthday' => [
                            'label' => Text::_('PLG_JSHOPPING_ANTISPAM_BIRTHDAY'),
                            'min_age' => $antispamFields['min_age_birthday'] ?? 0,
                            'no_future' => $antispamFields['birthday_future'] ?? 0
                        ],
                        'd_home' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_HOME')],
                        'd_apartment' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_APARTMENT')],
                        'd_street' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_STREET')],
                        'd_street_nr' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_STREET_NR')],
                        'd_zip' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_ZIP')],
                        'd_city' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_CITY')],
                        'd_state' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_STATE')],
                        'd_phone' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_PHONE')],
                        'd_mobil_phone' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_MOBIL_PHONE')],
                        'd_fax' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_FAX')],

                        // 'firma_code' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_FIRMA_CODE')],
                        // 'tax_number' => ['label' => Text::_('PLG_JSHOPPING_ANTISPAM_TAX_NUMBER')],
                    ];

                    foreach ($fieldsToCheck as $field => $meta) {
                        if (
                            isset($antispamFields[$field]) &&
                            $antispamFields[$field] &&
                            isset($order->$field) &&
                            $order->$field !== ''
                        ) {
                            $config = [];

                            if (isset($antispamFields['stop_word_' . $field])) {
                                $config['stop_word'] = $antispamFields['stop_word_' . $field];
                            }
                            if (isset($antispamFields['count_letter_' . $field])) {
                                $config['count_letter'] = $antispamFields['count_letter_' . $field];
                            }
                            if (isset($antispamFields['only_text_' . $field])) {
                                $config['only_text'] = $antispamFields['only_text_' . $field];
                            }
                            if (isset($antispamFields['only_int_' . $field])) {
                                $config['only_int'] = $antispamFields['only_int_' . $field];
                            }
                            if (isset($antispamFields['check_no_text_' . $field])) {
                                $config['check_no_text'] = $antispamFields['check_no_text_' . $field];
                            }
                            if (isset($meta['email_check'])) {
                                $config['email_check'] = $meta['email_check'];
                            }
                            if (isset($meta['exclude_domains'])) {
                                $config['exclude_domains'] = $meta['exclude_domains'];
                            }
                            if (isset($meta['min_age'])) {
                                $config['min_age'] = $meta['min_age'];
                            }
                            if (isset($meta['no_future'])) {
                                $config['no_future'] = $meta['no_future'];
                            }

                            if (!$this->validateField($meta['label'], $order->$field, $config)) {
                                return false;
                            }
                        }
                    }
                }
            }

        } catch (\Exception $e) {
            // Обработка ошибок
            $app->enqueueMessage('Error loading antispam settings: ' . $e->getMessage(), 'error');
            return false;
        }
    }

    function checkOnlyInt($fieldName, $fieldValue)
    {
        $app = Factory::getApplication();
        $checkoutStep = \JSFactory::getModel('checkoutStep', 'Site');
        $back_url = $checkoutStep->getCheckoutUrl('5');

        if (!preg_match('/^\d+$/', $fieldValue)) {
            $errorMsg = $fieldName . Text::_('PLG_JSHOPPING_ANTISPAM_VALIDATION_ERROR_INT');
            Factory::getApplication()->enqueueMessage($errorMsg, 'error');
            $this->sendToTelegram($errorMsg);
            $app->redirect($back_url);

            return false;
        }
        return true;
    }

    function checkNoText($fieldName, $fieldValue)
    {
        $app = Factory::getApplication();
        $checkoutStep = \JSFactory::getModel('checkoutStep', 'Site');
        $back_url = $checkoutStep->getCheckoutUrl('5');

        if (preg_match('/\p{L}/u', $fieldValue)) {
            $errorMsg = $fieldName . Text::_('PLG_JSHOPPING_ANTISPAM_VALIDATION_ERROR_TEXT');
            Factory::getApplication()->enqueueMessage($errorMsg, 'error');
            $this->sendToTelegram($errorMsg);
            $app->redirect($back_url);

            return false;
        }

        return true;
    }

    function checkOnlyText($fieldName, $fieldValue)
    {
        $app = Factory::getApplication();
        $checkoutStep = \JSFactory::getModel('checkoutStep', 'Site');
        $back_url = $checkoutStep->getCheckoutUrl('5');

        if (!preg_match('/^[a-zA-Zа-яА-ЯёЁ]+$/u', $fieldValue)) {

            $errorMsg = $fieldName . Text::_('PLG_JSHOPPING_ANTISPAM_VALIDATION_ERROR_ONLY_TEXT');
            Factory::getApplication()->enqueueMessage($errorMsg, 'error');
            $this->sendToTelegram($errorMsg);
            $app->redirect($back_url);

            return false;
        }
        return true;
    }

    function checkMaxLength($fieldName, $fieldValue, $maxLength)
    {
        $app = Factory::getApplication();
        $checkoutStep = \JSFactory::getModel('checkoutStep', 'Site');
        $back_url = $checkoutStep->getCheckoutUrl('5');

        $fieldLength = mb_strlen(trim($fieldValue), 'UTF-8');

        if ($fieldLength > $maxLength) {
            $errorMsg = $fieldName . Text::_('PLG_JSHOPPING_ANTISPAM_VALIDATION_ERROR_MAX_LENGTH');

            Factory::getApplication()->enqueueMessage($errorMsg, 'error');
            $this->sendToTelegram($errorMsg);
            $app->redirect($back_url);

            return false;
        }

        return true;
    }

    function checkForbiddenWords($fieldName, $fieldValue, $stopWords)
    {
        $app = Factory::getApplication();
        $checkoutStep = \JSFactory::getModel('checkoutStep', 'Site');
        $back_url = $checkoutStep->getCheckoutUrl('5');

        $spam_words = explode(',', mb_strtolower($stopWords, 'UTF-8'));
        $spam_words = array_map('trim', $spam_words);
        $fieldValue = mb_strtolower(trim($fieldValue), 'UTF-8');

        foreach ($spam_words as $word) {
            if (stripos($fieldValue, $word) !== false) {
                $errorMsg = $fieldName . Text::_('PLG_JSHOPPING_ANTISPAM_VALIDATION_ERROR');
                JFactory::getApplication()->enqueueMessage($errorMsg, 'error');
                $this->sendToTelegram($errorMsg);
                $app->redirect($back_url);

                return false;
            }
        }

        return true;
    }

    function valueCaptha($captha)
    {
        if ($captha !== '') {
            $app = Factory::getApplication();
            $checkoutStep = \JSFactory::getModel('checkoutStep', 'Site');
            $back_url = $checkoutStep->getCheckoutUrl('5');

            $errorMsg = Text::_('PLG_JSHOPPING_ANTISPAM_VALUE_CAPTCHA');
            JFactory::getApplication()->enqueueMessage($errorMsg, 'error');
            $this->sendToTelegram($errorMsg);
            $app->redirect($back_url);

        }
    }

    private function validateField($label, $value, $config)
    {
        if (isset($config['stop_word']) && $config['stop_word'] != '') {
            if (!$this->checkForbiddenWords($label, $value, $config['stop_word'])) {
                return false;
            }
        }

        if (isset($config['count_letter']) && $config['count_letter'] != 0 && $config['count_letter'] !== '') {
            if (!$this->checkMaxLength($label, $value, (int) $config['count_letter'])) {
                return false;
            }
        }

        if (isset($config['only_text']) && $config['only_text'] == 1) {
            if (!$this->checkOnlyText($label, $value)) {
                return false;
            }
        }

        if (isset($config['only_int']) && $config['only_int'] == 1) {
            if (!$this->checkOnlyInt($label, $value)) {
                return false;
            }
        }

        if (isset($config['check_no_text']) && $config['check_no_text'] != 0) {
            if (!$this->checkNoText($label, $value)) {
                return false;
            }
        }

        $app = Factory::getApplication();
        $checkoutStep = \JSFactory::getModel('checkoutStep', 'Site');
        $back_url = $checkoutStep->getCheckoutUrl('5');

        // Email-проверка
        if (isset($config['email_check']) && $config['email_check'] == 1) {
            $email = trim($value);
            $email = preg_replace('/[\x00-\x1F\x7F]/', '', $email);

            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                list(, $domain) = explode('@', $email, 2);
                if (!empty($domain) && !checkdnsrr($domain, 'MX')) {
                    $errorMsg = Text::_('PLG_JSHOPPING_ANTISPAM_EMAIL_VALID');
                    Factory::getApplication()->enqueueMessage($errorMsg, 'error');
                    $this->sendToTelegram($errorMsg);
                    $app->redirect($back_url);

                    return false;
                }
            } else {
                $errorMsg = Text::_('PLG_JSHOPPING_ANTISPAM_EMAIL_INVALID_FORMAT');
                Factory::getApplication()->enqueueMessage($errorMsg, 'error');
                $this->sendToTelegram($errorMsg);
                $app->redirect($back_url);

                return false;
            }
        }

        if (isset($config['exclude_domains']) && $config['exclude_domains'] != '') {
            $exclude_domains = explode(',', $config['exclude_domains']);
            $email = trim($value);
            $email = preg_replace('/[\x00-\x1F\x7F]/', '', $email);

            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                list(, $domain) = explode('@', $email, 2);
                if (in_array($domain, $exclude_domains)) {
                    $errorMsg = Text::_('PLG_JSHOPPING_ANTISPAM_EMAIL_EXCLUDE_DOMAIN');
                    Factory::getApplication()->enqueueMessage($errorMsg, 'error');
                    $this->sendToTelegram($errorMsg);
                    $app->redirect($back_url);

                    return false;
                }
            }
        }

        // Проверка дня рождения
        if (isset($config['min_age']) || isset($config['no_future'])) {
            try {
                $birthDate = new \DateTime($value);
                $today = new \DateTime();

                if (isset($config['min_age']) && $config['min_age'] > 0) {
                    $age = $today->diff($birthDate)->y;
                    if ($age < $config['min_age']) {
                        $errorMsg = Text::_('PLG_JSHOPPING_ANTISPAM_BIRTHDAY_MIN_AGE') . $config['min_age'];
                        Factory::getApplication()->enqueueMessage($errorMsg, 'error');
                        $this->sendToTelegram($errorMsg);

                        $app->redirect($back_url);
                        return false;
                    }
                }

                if (isset($config['no_future']) && $config['no_future'] == 1) {
                    if ($birthDate > $today) {
                        $errorMsg = Text::_('PLG_JSHOPPING_ANTISPAM_BIRTHDAY_NOT_FUTURE');
                        Factory::getApplication()->enqueueMessage($errorMsg, 'error');
                        $this->sendToTelegram($errorMsg);
                        $app->redirect($back_url);

                        return false;
                    }
                }
            } catch (\Exception $e) {
                // Неверный формат даты — тоже ошибка
                $errorMsg = Text::_('PLG_JSHOPPING_ANTISPAM_BIRTHDAY_INVALID');
                Factory::getApplication()->enqueueMessage($errorMsg, 'error');
                $this->sendToTelegram($errorMsg);
                $app->redirect($back_url);

                return false;
            }
        }

        return true;
    }

    // public function onBeforeDisplayCheckoutStep2View(&$view)
    // {
    //     if (!isset($view->_tmp_ext_html_previewfinish_end)) {
    //         $view->_tmp_ext_html_previewfinish_end = '';
    //     }

    //     $view->_tmp_ext_html_previewfinish_end .= '
    //     <div class="mt-4 captcha-wrapper">
    //         <label for="captha_field">Сколько будет 2 + 2?</label>
    //         <input type="text" name="captha" id="captha_field" value="" />
    //     </div>';
    // }

    public function onBeforeDisplayCheckoutStep5View(&$view)
    {

        if ((int) $this->params->get('enable_captcha', 0) !== 1) {
            return;
        }

        $wa = Factory::getApplication()->getDocument()->getWebAssetManager();
        $wa->registerAndUseStyle(
            'plg_jshopping_antispam.captcha',
            'media/plg_jshopping_antispam/css/style.css'
        );

        $position = $this->params->get('qty_position_captha', '_tmp_ext_html_previewfinish_agb');

        if (!isset($view->{$position})) {
            $view->{$position} = '';
        }

        $view->{$position} .= '
        <div class="mt-4 captcha-wrapper">
            <label for="captha_field">Сколько будет 3 + 2?</label>
            <input type="text" name="captha" id="captha_field" value="" />
        </div>';
    }

    protected function sendToTelegram($message)
    {

        if ((int) $this->params->get('enable_send_tg', 0) !== 1 || empty($this->token) || empty($this->chat_id)) {
            return;
        }

        $msg = "<b>Источник:</b> {$this->site}\n🚫 {$message}\n";

        $url = "https://api.telegram.org/bot{$this->token}/sendMessage";
        $params = [
            'chat_id' => $this->chat_id,
            'text' => $msg,
            'parse_mode' => 'HTML',
        ];
        @file_get_contents($url . '?' . http_build_query($params));
    }
}
