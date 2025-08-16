<?php

namespace Joomla\Component\Jshopping\Administrator\Model;

use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

defined('_JEXEC') or die;

class AntispamModel extends BaseadminModel
{ 
    public function saveConfigs($data)
    {
        $db = Factory::getContainer()->get('DatabaseDriver');
        $jshopConfig = JSFactory::getConfig();
        
        // Преобразуем массив в JSON для сохранения
        $jsonData = json_encode($data['valid']);
        
        // Проверяем существование записи
        $query = $db->getQuery(true)
            ->select('count(*)')
            ->from($db->quoteName('#__jshopping_configs'))
            ->where($db->quoteName('key') . ' = ' . $db->quote('antispam_fields'));
            
        $exists = $db->setQuery($query)->loadResult();
        
        if ($exists) {
            // Обновляем существующую запись
            $query = $db->getQuery(true)
                ->update($db->quoteName('#__jshopping_configs'))
                ->set($db->quoteName('value') . ' = ' . $db->quote($jsonData))
                ->where($db->quoteName('key') . ' = ' . $db->quote('antispam_fields'));
        } else {
            // Создаем новую запись
            $query = $db->getQuery(true)
                ->insert($db->quoteName('#__jshopping_configs'))
                ->columns(array($db->quoteName('key'), $db->quoteName('value')))
                ->values($db->quote('antispam_fields') . ',' . $db->quote($jsonData));
        }
        
        try {
            $db->setQuery($query)->execute();
            return true;
        } catch (\Exception $e) {
            Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
            return false;
        }
    }
    public function getAntispamFields()
{
    $db = Factory::getContainer()->get('DatabaseDriver');
    
    $query = $db->getQuery(true)
        ->select($db->quoteName('value'))
        ->from($db->quoteName('#__jshopping_configs'))
        ->where($db->quoteName('key') . ' = ' . $db->quote('antispam_fields'));
        
    try {
        $result = $db->setQuery($query)->loadResult();
        return $result ? json_decode($result, true) : [];
    } catch (\Exception $e) {
        Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
        return [];
    }
}

}
