<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Filesystem\Folder;

class PlgJshoppingadminSofonaQuickeditInstallerScript
{
    protected $basePath;
    protected $logFile;

    public function __construct()
    {
        $this->basePath = JPATH_ADMINISTRATOR . '/components/com_jshopping';
        $this->logFile = JPATH_ADMINISTRATOR . '/logs/plg_jshoppingadmin_sofonaquickedit.sys.txt';
        $this->log("==== Запуск InstallerScript ====");
    }

    public function install(InstallerAdapter $adapter): bool
    {
        $this->log("Выполняется установка плагина");
        $this->copyFiles();
        $this->enablePlugin($adapter);
        $this->createLogTable();
        $this->log("Установка завершена");

        return true;
    }

    public function uninstall(InstallerAdapter $adapter): bool
    {
        $this->log("Выполняется удаление плагина");
        $this->deleteFiles();
        $this->deleteConfigField();
        $this->dropLogTable();
        $this->log("Удаление завершено");

        return true;
    }

    public function update(InstallerAdapter $adapter): bool
    {
        $this->log("Выполняется обновление плагина");
        $this->deleteFiles();
        $this->copyFiles();
        $this->createLogTable();
        $this->log("Обновление завершено");

        return true;
    }

    protected function enablePlugin(InstallerAdapter $adapter)
    {
        $this->log("Включение плагина...");
        try {
            $db = Factory::getContainer()->get('DatabaseDriver');
            $query = $db->getQuery(true)
                ->update('#__extensions')
                ->set('enabled = 1')
                ->where('type = ' . $db->quote('plugin'))
                ->where('element = ' . $db->quote($adapter->getElement()))
                ->where('folder = ' . $db->quote($adapter->getParent()->manifest->attributes()['group']));
            $db->setQuery($query)->execute();
            $this->log("Плагин успешно включён");
        } catch (\Exception $e) {
            $this->log("Ошибка включения плагина: " . $e->getMessage());
        }
    }

    protected function deleteConfigField()
    {
        $this->log("Удаление поля 'quickEdit_columns' из таблицы jm_jshopping_configs...");
        try {
            $db = Factory::getContainer()->get('DatabaseDriver');
            $query = $db->getQuery(true)
                ->delete('#__jshopping_configs')
                ->where('`key` = ' . $db->quote('quickEdit_columns'));
            $db->setQuery($query)->execute();
            $this->log("Поле 'quickEdit_columns' успешно удалено из таблицы jm_jshopping_configs");
        } catch (\Exception $e) {
            $this->log("Ошибка при удалении поля 'quickEdit_columns': " . $e->getMessage());
        }
    }


    protected function copyFiles()
    {
        $this->log("Начало копирования файлов...");
        $src = __DIR__ . '/admin_files';

        $map = [
            'Controller/SofonaquickeditController.php' => $this->basePath . '/Controller/SofonaquickeditController.php',
            'Model/SofonaquickeditModel.php' => $this->basePath . '/Model/SofonaquickeditModel.php',
            'View/Sofonaquickedit/HtmlView.php' => $this->basePath . '/View/Sofonaquickedit/HtmlView.php',
            'tmpl/sofonaquickedit/default.php' => $this->basePath . '/tmpl/sofonaquickedit/default.php',
            'tmpl/sofonaquickedit/default_edit.php' => $this->basePath . '/tmpl/sofonaquickedit/default_edit.php',
            'tmpl/sofonaquickedit/default_history.php' => $this->basePath . '/tmpl/sofonaquickedit/default_history.php',
            'tmpl/sofonaquickedit/settings.php' => $this->basePath . '/tmpl/sofonaquickedit/settings.php',
            'images/sofonaquickedit_settings.png' => $this->basePath . '/images/sofonaquickedit_settings.png',
            'images/sofonaquickedit.png' => $this->basePath . '/images/sofonaquickedit.png',
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

    protected function deleteFiles()
    {
        $this->log("Удаление старых файлов...");
        $files = [
            $this->basePath . '/Controller/SofonaquickeditController.php',
            $this->basePath . '/Model/SofonaquickeditModel.php',
            $this->basePath . '/View/Sofonaquickedit/HtmlView.php',
            $this->basePath . '/tmpl/sofonaquickedit/default.php',
            $this->basePath . '/tmpl/sofonaquickedit/default_edit.php',
            $this->basePath . '/tmpl/sofonaquickedit/default_history.php',
            $this->basePath . '/tmpl/sofonaquickedit/settings.php',
            $this->basePath . '/images/sofonaquickedit_settings.png',
            $this->basePath . '/images/sofonaquickedit.png',

        ];

        foreach ($files as $file) {
            if (File::exists($file)) {
                File::delete($file);
                $this->log("Удалён файл: $file");
            }
        }

        $folders = [
            $this->basePath . '/View/Sofonaquickedit',
            $this->basePath . '/tmpl/sofonaquickedit',
        ];

        foreach ($folders as $folder) {
            if (Folder::exists($folder) && Folder::files($folder, '.', false, true) === [] && Folder::folders($folder) === []) {
                Folder::delete($folder);
                $this->log("Удалена пустая папка: $folder");
            }
        }
    }

protected function createLogTable()
{
    $this->log("Проверка и создание таблицы логов изменений цен...");
    try {
        $db = Factory::getContainer()->get('DatabaseDriver');
        $prefix = $db->getPrefix();
        $query = "
            CREATE TABLE IF NOT EXISTS `{$prefix}sofonaquickedit_log` (
              `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
              `product_id` INT NOT NULL,
              `old_value` VARCHAR(250) NOT NULL,
              `new_value` VARCHAR(250) NOT NULL,
              `field` VARCHAR(250) NOT NULL,
              `info` TEXT NOT NULL,
              `date_modify` DATETIME NOT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        ";
        $db->setQuery($query)->execute();
        $this->log("Таблица логов успешно создана или уже существует.");
    } catch (\Exception $e) {
        $this->log("Ошибка при создании таблицы логов: " . $e->getMessage());
    }
}

protected function dropLogTable()
{
    $this->log("Удаление таблицы логов...");
    try {
        $db = Factory::getContainer()->get('DatabaseDriver');
        $prefix = $db->getPrefix();
        $query = "DROP TABLE IF EXISTS `{$prefix}sofonaquickedit_log`";
        $db->setQuery($query)->execute();
        $this->log("Таблица логов удалена (если существовала).");
    } catch (\Exception $e) {
        $this->log("Ошибка при удалении таблицы логов: " . $e->getMessage());
    }
}


    protected function log($message)
    {
        file_put_contents($this->logFile, date('Y-m-d H:i:s') . " - $message\n", FILE_APPEND);
    }
}