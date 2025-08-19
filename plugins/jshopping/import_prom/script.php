<?php

use GuzzleHttp\Promise\Create;
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Filesystem\Folder;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

class PlgJshoppingImport_promInstallerScript
{
    protected $basePath;
    protected $logFile;

    public function __construct()
    {
        $this->basePath = JPATH_ADMINISTRATOR . '/components/com_jshopping';
        $this->logFile = JPATH_ADMINISTRATOR . '/logs/plg_jshopping_import_prom.sys.txt';
        $this->log("==== Запуск InstallerScript ====");
    }

    public function install(InstallerAdapter $adapter): bool
    {
        $this->log("Выполняется установка плагина");
        $this->copyFiles();
        $this->enablePlugin($adapter);
        // $this->installSql();
        $this->log("Установка завершена");
        return true;
    }

    public function uninstall(InstallerAdapter $adapter): bool
    {
        $this->log("Выполняется удаление плагина");
        $this->deleteFiles();
        // $this->deleteSql();
        $this->log("Удаление завершено");
        return true;
    }

    public function update(InstallerAdapter $adapter): bool
    {
        $this->log("Выполняется обновление плагина");
        $this->deleteFiles();
        $this->copyFiles();
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

    protected function copyFiles()
    {
        $this->log("Начало копирования файлов...");
        $src = __DIR__ . '/addon_files';

        $map = [
            'Controller/SofonaimportpromController.php' => $this->basePath . '/Controller/SofonaimportpromController.php',
            'Model/SofonaimportpromModel.php' => $this->basePath . '/Model/SofonaimportpromModel.php',
            'images/importprom_icon.png' => $this->basePath . '/images/importprom_icon.png',
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
            $this->basePath . '/Controller/SofonaimportpromController.php',
            $this->basePath . '/Model/SofonaimportpromModel.php',
            $this->basePath . '/images/importprom_icon.png',
        ];

        foreach ($files as $file) {
            if (File::exists($file)) {
                File::delete($file);
                $this->log("Удалён файл: $file");
            }
        }

        $folders = [ ];

        foreach ($folders as $folder) {
            if (Folder::exists($folder) && Folder::files($folder, '.', false, true) === [] && Folder::folders($folder) === []) {
                Folder::delete($folder);
                $this->log("Удалена пустая папка: $folder");
            }
        }
    }

    protected function log($message)
    {
        file_put_contents($this->logFile, date('Y-m-d H:i:s') . " - $message\n", FILE_APPEND);
    }
}
