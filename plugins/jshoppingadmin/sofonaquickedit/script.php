<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Filesystem\Folder;

class PlgJshoppingadminSofonaQuickeditInstallerScript
{
    protected $basePath;

    public function __construct()
    {
        $this->basePath = JPATH_ADMINISTRATOR . '/components/com_jshopping';
    }

    public function install(InstallerAdapter $adapter): bool
    {
        file_put_contents(JPATH_ROOT . '/logs/instal_plgh.txt', date('Y-m-d H:i:s') . " - function install\n", FILE_APPEND);
        $this->copyFiles();
        $this->enablePlugin($adapter);
        return true;
    }

    public function uninstall(InstallerAdapter $adapter): bool
    {
        file_put_contents(JPATH_ROOT . '/logs/instal_plgh.txt', date('Y-m-d H:i:s') . " - function delete\n", FILE_APPEND);
        $this->deleteFiles();
        return true;
    }

    public function update(InstallerAdapter $adapter): bool
    {
        file_put_contents(JPATH_ROOT . '/logs/instal_plgh.txt', date('Y-m-d H:i:s') . " - function update\n", FILE_APPEND);
        $this->deleteFiles();
        $this->copyFiles();
        return true;
    }

    protected function enablePlugin(InstallerAdapter $adapter)
    {
        $db = Factory::getContainer()->get('DatabaseDriver');
        $query = $db->getQuery(true)
            ->update('#__extensions')
            ->set('enabled = 1')
            ->where('type = ' . $db->quote('plugin'))
            ->where('element = ' . $db->quote($adapter->getElement()))
            ->where('folder = ' . $db->quote($adapter->getParent()->manifest->attributes()['group']));
        $db->setQuery($query)->execute();
    }

    protected function copyFiles()
    {
        $src = __DIR__ . '/admin_files';

        // Копируем по структуре
        $map = [
            'Controller/SofonaquickeditController.php' => $this->basePath . '/Controller/SofonaquickeditController.php',
            'Model/SofonaquickeditModel.php' => $this->basePath . '/Model/SofonaquickeditModel.php',
            'View/Sofonaquickedit/HtmlView.php' => $this->basePath . '/View/Sofonaquickedit/HtmlView.php',
            'tmpl/sofonaquickedit/default.php' => $this->basePath . '/tmpl/sofonaquickedit/default.php',
            // 'images/antispam.png' => $this->basePath . '/images/antispam.png',
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
            $this->basePath . '/Controller/SofonaquickeditController.php',
            $this->basePath . '/Model/SofonaquickeditModel.php',
            $this->basePath . '/View/Sofonaquickedit/HtmlView.php',
            $this->basePath . '/tmpl/sofonaquickedit/default.php',
            // $this->basePath . '/images/antispam.png',
        ];

        foreach ($files as $file) {
            if (File::exists($file)) {
                File::delete($file);
            }
        }

        $folders = [
            $this->basePath . '/View/Sofonaquickedit',
            $this->basePath . '/tmpl/sofonaquickedit',
        ];

        foreach ($folders as $folder) {
            if (Folder::exists($folder) && Folder::files($folder, '.', false, true) === [] && Folder::folders($folder) === []) {
                Folder::delete($folder);
            }
        }
    }
}