<?php

namespace Joomla\Component\Jshopping\Administrator\Controller;

use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;

defined('_JEXEC') or die();

class TelegrambotController extends BaseadminController
{
    function display($cachable = false, $urlparams = false)
    {
        $app = Factory::getApplication();
        $context = "jshoping.settings.admin.telegrambot";
        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshopping_telegrambot', JPATH_ADMINISTRATOR);

        $model = JSFactory::getModel("telegrambot");
        $paramsPlg = $model->getConfigsSettings();
        // echo '<pre>';var_dump($paramsPlg);die;

        $optionsName = [
            'show_source' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_SOURCE'),
            'show_action' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_ACTION'),
            'show_order_id' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_ORDER_ID'),
            'show_order_number' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_ORDER_NUMBER'),
            'show_order_total' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_ORDER_TOTAL'),
            'show_user_name' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_NAME'),
            'show_user_email' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_EMAIL'),
            'show_user_phone' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_PHONE'),
            'show_product_name' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_PRODUCT_NAME'),
            'show_product_quantity' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_PRODUCT_QUANTITY'),
            'show_shipping' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_SHIPPING'),
            'show_shipping_params' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_SHIPPING_PARAMS'),
            'show_street' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_STREET'),
            'show_city' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_CITY'),
            'show_zip' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_ZIP'),
            'show_payment' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_PAYMENT'),
            'show_atribute' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_ATRIBUTE_PRODUCT'),
            'show_manufacturer_code' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_MANUFACTURER_CODE'),
            'show_ean_product' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_EAN_PRODUCT'),
            'show_manufacturer' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_MANUFACTURER'),
            'show_lang_site' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_LANG_SITE'),
            'show_comment' => Text::_('PLG_JSHOPPING_TELEGRAMBOT_COMMENT')
        ];

        $selectOptions = [];
        foreach ($optionsName as $value => $label) {
            $selectOptions[] = HTMLHelper::_('select.option', $value, $label);
        }

        $applySettings = [
            'show_source' => $paramsPlg['show_source'],
            'show_action' => $paramsPlg['show_action'],
            'show_order_id' => $paramsPlg['show_order_id'],
            'show_order_number' => $paramsPlg['show_order_number'],
            'show_order_total' => $paramsPlg['show_order_total'],
            'show_user_name' => $paramsPlg['show_user_name'],
            'show_user_email' => $paramsPlg['show_user_email'],
            'show_user_phone' => $paramsPlg['show_user_phone'],
            'show_product_name' => $paramsPlg['show_product_name'],
            'show_product_quantity' => $paramsPlg['show_product_quantity'],
            'show_shipping' => $paramsPlg['show_shippinge'],
            'show_shipping_params' => $paramsPlg['show_shipping_paramse'],
            'show_street' => $paramsPlg['show_streete'],
            'show_city' => $paramsPlg['show_citye'],
            'show_zip' => $paramsPlg['show_zipe'],
            'show_payment' => $paramsPlg['show_paymente'],
            'show_atribute' => $paramsPlg['show_atributee'],
            'show_manufacturer_code' => $paramsPlg['show_manufacturer_codee'],
            'show_ean_product' => $paramsPlg['show_ean_producte'],
            'show_manufacturer' => $paramsPlg['show_manufacturere'],
            'show_lang_site' => $paramsPlg['show_lang_sitee'],
            'show_comment' => $paramsPlg['show_commente']
        ];
        $applySetting_list = [];

        foreach ($applySettings as $key => $value) {
            if ((int) $value === 1) {
                $applySetting_list[] = $key;
            }
        }

        $_lang = JSFactory::getModel("languages");
        $languages = $_lang->getAllLanguages(1);
        $multilang = count($languages);

        $view = $this->getView("telegrambot", 'html');
        $view->setLayout("settings");
        $view->set('paramsPlg', $paramsPlg);
        $view->set('lang_list', $languages);
        $view->set('multilang', $multilang);
        $view->set('optionsName', $optionsName);
        $view->set('applySetting_list', $applySetting_list);

        $view->displayDefault();
    }

    public function saveSettings()
    {
        $app = Factory::getApplication();
        $params = $this->input->post->getArray();

        $this->savef($params);

        $this->setRedirect('index.php?option=com_jshopping&controller=config');
    }
    public function applySettings()
    {
        $params = $this->input->post->getArray();

        $this->savef($params);
        $this->setRedirect('index.php?option=com_jshopping&controller=telegrambot');
    }

    protected function savef($params)
    {

        $app = Factory::getApplication();
        $lang = $app->getLanguage();
        $lang->load('plg_jshopping_telegrambot', JPATH_ADMINISTRATOR);

        $model = JSFactory::getModel("telegrambot");

        if ($model->saveConfigsSettings($params)) {
            $app->enqueueMessage(Text::_('PLG_JSHOPPING_TELEGRAMBOT_SAVED_SUCCESS'));
        } else {
            $app->enqueueMessage('Error saving Telegram Bot settings', 'error');
        }

        $this->setRedirect('index.php?option=com_jshopping&controller=config');
    }

    public function backToConfig()
    {
        $this->setRedirect('index.php?option=com_jshopping&controller=config');
    }


}