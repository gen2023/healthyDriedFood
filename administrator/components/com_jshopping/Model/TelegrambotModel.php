<?php

namespace Joomla\Component\Jshopping\Administrator\Model;

defined('_JEXEC') or die();

use Joomla\CMS\Factory;

class TelegrambotModel extends BaseadminModel
{

    public function getConfigsSettings()
    {
        $db = Factory::getContainer()->get('DatabaseDriver');

        $query = $db->getQuery(true)
            ->select($db->quoteName('value'))
            ->from($db->quoteName('#__jshopping_configs'))
            ->where($db->quoteName('key') . ' = ' . $db->quote('telegrambot_settings'));

        try {
            $result = $db->setQuery($query)->loadResult();
            return $result ? json_decode($result, true) : [];
        } catch (\Exception $e) {
            Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
            return [];
        }
    }
    public function saveConfigsSettings($data)
    {
        $db = Factory::getContainer()->get('DatabaseDriver');
        $jsonData = json_encode($data);

        $query = $db->getQuery(true)
            ->select('count(*)')
            ->from($db->quoteName('#__jshopping_configs'))
            ->where($db->quoteName('key') . ' = ' . $db->quote('telegrambot_settings'));

        $exists = $db->setQuery($query)->loadResult();

        if ($exists) {
            $query = $db->getQuery(true)
                ->update($db->quoteName('#__jshopping_configs'))
                ->set($db->quoteName('value') . ' = ' . $db->quote($jsonData))
                ->where($db->quoteName('key') . ' = ' . $db->quote('telegrambot_settings'));
        } else {
            $query = $db->getQuery(true)
                ->insert($db->quoteName('#__jshopping_configs'))
                ->columns(array($db->quoteName('key'), $db->quoteName('value')))
                ->values($db->quote('telegrambot_settings') . ',' . $db->quote($jsonData));
        }

        try {
            $db->setQuery($query)->execute();
            return true;
        } catch (\Exception $e) {
            Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
            return false;
        }
    }

}
