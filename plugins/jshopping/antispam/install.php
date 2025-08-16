<?php
defined('_JEXEC') or die;

use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Factory;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Filesystem\Folder;
// use Joomla\Filesystem\File;
// use Joomla\Filesystem\Folder;
use Joomla\Database\DatabaseInterface;

class PlgJshoppingAntispamInstallerScript
{
    protected $basePath = JPATH_ADMINISTRATOR . '/components/com_jshopping';

    public function install(InstallerAdapter $adapter)
    {
        $this->copyFiles();
    }

    public function uninstall(InstallerAdapter $adapter)
    {
        $this->deleteFiles();

        try {
            $db = Factory::getContainer()->get(DatabaseInterface::class);
            $query = $db->getQuery(true)
                ->delete($db->quoteName('#__jshopping_configs'))
                ->where($db->quoteName('key') . ' = ' . $db->quote('antispam_fields'));
            $db->setQuery($query);
            $db->execute();
        } catch (\Exception $e) {
            Factory::getApplication()->enqueueMessage('Ошибка при удалении настройки antispam_fields: ' . $e->getMessage(), 'error');
        }
    }

    protected function copyFiles()
    {
        $src = __DIR__ . '/admin_files';

        // Копируем по структуре
        $map = [
            'Controller/AntispamController.php' => $this->basePath . '/Controller/AntispamController.php',
            'Model/AntispamModel.php' => $this->basePath . '/Model/AntispamModel.php',
            'View/Antispam/HtmlView.php' => $this->basePath . '/View/Antispam/HtmlView.php',
            'tmpl/antispam/default.php' => $this->basePath . '/tmpl/antispam/default.php',
            'images/antispam.png' => $this->basePath . '/images/antispam.png',
        ];

        foreach ($map as $rel => $target) {
            $source = $src . '/' . $rel;
            $targetFolder = dirname($target);

            try {
                if (!Folder::exists($targetFolder)) {
                    Folder::create($targetFolder);
                }

                if (File::exists($source)) {
                    if (File::exists($target)) {
                        File::delete($target);
                    }

                    File::copy($source, $target);
                }
            } catch (\Exception $e) {
                Factory::getApplication()->enqueueMessage('Ошибка копирования файла: ' . $e->getMessage(), 'error');
            }

        }
    }

    protected function deleteFiles()
    {
        $files = [
            $this->basePath . '/Controller/AntispamController.php',
            $this->basePath . '/Model/AntispamModel.php',
            $this->basePath . '/View/Antispam/HtmlView.php',
            $this->basePath . '/tmpl/antispam/default.php',
            $this->basePath . '/images/antispam.png',
        ];

        foreach ($files as $file) {
            if (File::exists($file)) {
                File::delete($file);
            }
        }

        $folders = [
            $this->basePath . '/View/Antispam',
            $this->basePath . '/tmpl/antispam',
        ];

        foreach ($folders as $folder) {
            if (Folder::exists($folder) && Folder::files($folder, '.', false, true) === [] && Folder::folders($folder) === []) {
                Folder::delete($folder);
            }
        }
    }
}
