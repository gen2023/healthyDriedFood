<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Filesystem\Folder;

class PlgJshoppingadminSofonareportsInstallerScript
{
    protected $basePath;
    protected $logFile;

    public function __construct()
    {
        $this->basePath = JPATH_ADMINISTRATOR . '/components/com_jshopping';
        $this->logFile = JPATH_ADMINISTRATOR . '/logs/plg_jshoppingadmin_sofonareports.sys.txt';
        $this->log("==== Запуск InstallerScript ====");
    }

    public function install(InstallerAdapter $adapter): bool
    {
        $this->log("Выполняется установка плагина");
        $this->copyFiles();
        $this->enablePlugin($adapter);
        $this->log("Установка завершена");
        return true;
    }

    public function uninstall(InstallerAdapter $adapter): bool
    {
        $this->log("Выполняется удаление плагина");
        $this->deleteFiles();
        $this->deleteConfigField();
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

    protected function deleteConfigField()
    {
        $this->log("Удаление поля 'report_columns' из таблицы jm_jshopping_configs...");
        try {
            $db = Factory::getContainer()->get('DatabaseDriver');
            $query = $db->getQuery(true)
                ->delete('#__jshopping_configs')
                ->where('`key` = ' . $db->quote('report_columns'));
            $db->setQuery($query)->execute();
            $this->log("Поле 'report_columns' успешно удалено из таблицы jm_jshopping_configs");
        } catch (\Exception $e) {
            $this->log("Ошибка при удалении поля 'report_columns': " . $e->getMessage());
        }
    }

    protected function copyFiles()
    {
        $this->log("Начало копирования файлов...");
        $src = __DIR__ . '/admin_files';

        $map = [
            'Controller/SofonareportsController.php' => $this->basePath . '/Controller/SofonareportsController.php',
            'Model/SofonareportsModel.php' => $this->basePath . '/Model/SofonareportsModel.php',
            'View/Sofonareports/HtmlView.php' => $this->basePath . '/View/Sofonareports/HtmlView.php',
            'tmpl/sofonareports/clients_list.php' => $this->basePath . '/tmpl/sofonareports/clients_list.php',
            'tmpl/sofonareports/orders_list.php' => $this->basePath . '/tmpl/sofonareports/orders_list.php',
            'tmpl/sofonareports/default.php' => $this->basePath . '/tmpl/sofonareports/default.php',
            'tmpl/sofonareports/products_list.php' => $this->basePath . '/tmpl/sofonareports/products_list.php',
            'tmpl/sofonareports/settings.php' => $this->basePath . '/tmpl/sofonareports/settings.php',
            'tmpl/sofonareports/settings_products.php' => $this->basePath . '/tmpl/sofonareports/settings_products.php',
            'tmpl/sofonareports/settings_order.php' => $this->basePath . '/tmpl/sofonareports/settings_order.php',
            'tmpl/sofonareports/settings_clients.php' => $this->basePath . '/tmpl/sofonareports/settings_clients.php',
            'images/sofonareport_clients.png' => $this->basePath . '/images/sofonareport_clients.png',
            'images/sofonareport_order.png' => $this->basePath . '/images/sofonareport_order.png',
            'images/sofonareport_product.png' => $this->basePath . '/images/sofonareport_product.png',
            'images/sofonareport.png' => $this->basePath . '/images/sofonareport.png',
            'images/sofonareport_settings.png' => $this->basePath . '/images/sofonareport_settings.png',
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
            $this->basePath . '/Controller/SofonareportsController.php',
            $this->basePath . '/Model/SofonareportsModel.php',
            $this->basePath . '/View/Sofonareports/HtmlView.php',
            $this->basePath . '/tmpl/sofonareports/clients_list.php',
            $this->basePath . '/tmpl/sofonareports/orders_list.php',
            $this->basePath . '/tmpl/sofonareports/default.php',
            $this->basePath . '/tmpl/sofonareports/products_list.php',
            $this->basePath . '/tmpl/sofonareports/settings.php',
            $this->basePath . '/tmpl/sofonareports/settings_products.php',
            $this->basePath . '/tmpl/sofonareports/settings_order.php',
            $this->basePath . '/tmpl/sofonareports/settings_clients.php',
            $this->basePath . '/images/sofonareport_clients.png',
            $this->basePath . '/images/sofonareport_order.png',
            $this->basePath . '/images/sofonareport_product.png',
            $this->basePath . '/images/sofonareport.png',
            $this->basePath . '/images/sofonareport_settings.png',
        ];

        foreach ($files as $file) {
            if (File::exists($file)) {
                File::delete($file);
                $this->log("Удалён файл: $file");
            }
        }

        $folders = [
            $this->basePath . '/View/Sofonareports',
            $this->basePath . '/tmpl/sofonareports',
        ];

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
