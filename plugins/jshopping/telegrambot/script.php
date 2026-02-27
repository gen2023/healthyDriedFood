<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Filesystem\Folder;

class PlgJshoppingTelegrambotInstallerScript
{

    protected $basePath;
    protected $logFile;

    public function __construct()
    {
        $this->basePath = JPATH_ADMINISTRATOR . '/components/com_jshopping';
        $this->logFile = JPATH_ADMINISTRATOR . '/logs/plg_jshopping_telegrambot_install.log';
        $this->log("==== Запуск InstallerScript ====");
    }

    public function install($parent)
    {
        $this->log("Выполняется установка плагина");
        $this->copyFiles();
        $this->createTable();
        $this->log("Установка завершена");
    }

    public function uninstall($parent)
    {
        $this->log("Выполняется удаление плагина");

        $db = Factory::getContainer()->get(DatabaseInterface::class);

        $query = $db->getQuery(true)
            ->dropTable($db->quoteName('#__telegram_delayed_messages'), true);
        $db->setQuery($query)->execute();

        $query = $db->getQuery(true)
            ->delete($db->quoteName('#__jshopping_configs'))
            ->where($db->quoteName('key') . ' = ' . $db->quote('telegrambot_settings'));

        try {
            $db->setQuery($query)->execute();
            $this->log("Конфиг telegrambot_settings удалён из jshopping_configs");
        } catch (\RuntimeException $e) {
            $this->log("DB ERROR (delete config): " . $e->getMessage());
        }

        $this->log("Удаление завершено");
    }


    public function update($parent)
    {
        $this->log("Выполняется обновление плагина");
        $currentVersion = $this->getInstalledVersion();
        $this->log("Версия плагина " . $currentVersion);

        // Версии ниже 1.0.4 — перенос в группу jshoppingcheckout
        if (version_compare($currentVersion, '1.0.4', '<')) {
            $this->movePluginToGroup('telegrambot', 'system', 'jshoppingcheckout');
            $this->removeOldFiles();
        }

        // Версии ниже 1.1.0 — перенос в группу jshopping
        if (version_compare($currentVersion, '1.1.0', '<=')) {
            $this->movePluginToGroup('telegrambot', 'jshoppingcheckout', 'jshopping');
            $this->transferSettings();
            $this->copyFiles();
            $this->removeOldFiles();

        }

        $this->createTable();
        $this->log("Обновление завершено");
    }


    protected function getInstalledVersion()
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select('manifest_cache')
            ->from('#__extensions')
            ->where('element = ' . $db->quote('telegrambot'))
            ->where('type = ' . $db->quote('plugin'));
        $db->setQuery($query);
        $result = $db->loadResult();

        if ($result) {
            $manifest = json_decode($result, true);
            return $manifest['version'] ?? '0.0.0';
        }

        return '0.0.0';
    }

    protected function movePluginToGroup($element, $oldGroup, $newGroup)
    {
        $this->log("Изменение группы плагина");

        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->update('#__extensions')
            ->set('folder = ' . $db->quote($newGroup))
            ->where('element = ' . $db->quote($element))
            ->where('folder = ' . $db->quote($oldGroup));
        $db->setQuery($query);
        $db->execute();

    }

    protected function removeOldFiles()
    {
        $this->log("Удаление старых файлов и папок");

        $paths = [
            JPATH_PLUGINS . '/system/telegrambot',
            JPATH_PLUGINS . '/jshoppingcheckout/telegrambot',
        ];

        foreach ($paths as $path) {
            if (is_dir($path)) {
                $this->deleteFolder($path);
            }
        }
    }

    protected function deleteFolder($folder)
    {
        jimport('joomla.filesystem.folder');
        jimport('joomla.filesystem.file');

        if (Folder::exists($folder)) {
            Folder::delete($folder);
        }
    }

    protected function copyFiles()
    {
        $this->log("Начало копирования файлов...");
        $src = __DIR__ . '/admin_files';

        $map = [
            'Controller/TelegrambotController.php' => $this->basePath . '/Controller/TelegrambotController.php',
            'Model/TelegrambotModel.php' => $this->basePath . '/Model/TelegrambotModel.php',
            'View/Telegrambot/HtmlView.php' => $this->basePath . '/View/Telegrambot/HtmlView.php',
            'tmpl/telegrambot/settings_description.php' => $this->basePath . '/tmpl/telegrambot/settings_description.php',
            'tmpl/telegrambot/settings_fields.php' => $this->basePath . '/tmpl/telegrambot/settings_fields.php',
            'tmpl/telegrambot/settings_form.php' => $this->basePath . '/tmpl/telegrambot/settings_form.php',
            'tmpl/telegrambot/settings.php' => $this->basePath . '/tmpl/telegrambot/settings.php',
            'images/telegrambot.png' => $this->basePath . '/images/telegrambot.png',
        ];

        foreach ($map as $rel => $target) {
            $source = $src . '/' . $rel;
            $targetFolder = dirname($target);

            try {
                if (!Folder::exists($targetFolder)) {
                    Folder::create($targetFolder);
                    $this->log("Создана папка: $targetFolder");
                }

                if (File::exists($source)) {
                    if (File::exists($target)) {
                        File::delete($target);
                        $this->log("Удалён старый файл: $target");
                    }

                    File::copy($source, $target);
                    $this->log("Скопирован файл: $source → $target");
                } else {
                    $this->log("Файл не найден: $source");
                }
            } catch (\Exception $e) {
                $this->log("Ошибка копирования файла ($source): " . $e->getMessage());
            }
        }
    }

    protected function createTable()
    {
        $this->log("Создание таблицы __telegram_delayed_messages");

        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = "CREATE TABLE IF NOT EXISTS `#__telegram_delayed_messages` (
                    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
                    `order_id` INT(11) NOT NULL,
                    `created_at` DATETIME NOT NULL,
                    PRIMARY KEY (`id`)
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
        $db->setQuery($query);
        $db->execute();
        $this->log("Конец функции создания таблицы __telegram_delayed_messages");

    }

    protected function transferSettings()
    {
        $this->log("Перенос настроек с плагина, в __jshopping_configs");

        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = "SELECT `params` FROM `#__extensions` WHERE `type`='plugin' AND `element`='telegrambot'";
        $db->setQuery($query);

        $jsonData = $db->loadResult();

        $this->log("Настройки в плагине " . print_r($jsonData, true));

        $tables = $db->getTableList();

        if (!in_array($db->replacePrefix('#__jshopping_configs'), $tables)) {
            $this->log('Таблица jshopping_configs НЕ НАЙДЕНА');
            return;
        }

        $query = $db->getQuery(true)
            ->select('count(*)')
            ->from($db->quoteName('#__jshopping_configs'))
            ->where('`key`  = ' . $db->quote('telegrambot_settings'));

        $exists = $db->setQuery($query)->loadResult();

        if ((int) $exists > 0) {
            $this->log("в таблице jshopping_configs данные существуют");

        } else {
            $this->log("в таблицу jshopping_configs данные начинают добавляться");

            $query = $db->getQuery(true)
                ->insert($db->quoteName('#__jshopping_configs'))
                ->columns([$db->quoteName('config_id'), $db->quoteName('key'), $db->quoteName('value')])
                ->values('1, ' . $db->quote('telegrambot_settings') . ', ' . $db->quote($jsonData));

            try {
                $db->setQuery($query)->execute();
            } catch (\RuntimeException $e) {
                $this->log('DB ERROR: ' . $e->getMessage());
            }

            $this->log("в таблицу jshopping_configs данные добавлены");

        }
        $this->log("Перенос настроек с плагина, в __jshopping_configs ЗАКОНЧЕН");

    }

    protected function log($message)
    {
        file_put_contents($this->logFile, date('Y-m-d H:i:s') . " - $message\n", FILE_APPEND);
    }
}
