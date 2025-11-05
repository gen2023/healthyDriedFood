<?php

/* @license   <a href="http://www.gnu.org/licenses/gpl-3.0.html" target="_blank">GNU/GPLv3</a> */

// doc: https://docs.joomla.org/J3.x:Creating_a_simple_module/Adding_an_install-uninstall-update_script_file/fr

// No direct access
defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Factory;

/*
 *  Update de SCSSCompiler :
 *  
 */

class plgSystemScssCompilerInstallerScript {

    /**
     * Method to run before an install/update/uninstall method
     * $parent is the class calling this method
     * $type is the type of change (install, update or discover_install)
     *
     * @return void
     */
    public function preflight($type, $parent) {
		// Vérifie la version PHP requise
        $minimumPhpVersion = '8.2.0'; 
        if (version_compare(PHP_VERSION, $minimumPhpVersion, '<')) {
			$msg = 'Installation impossible. The minimum version required is '  . $minimumPhpVersion . '. Current version : ' . PHP_VERSION;
            Factory::getApplication()->enqueueMessage($msg, 'error');
            return false; // Interrompt l'installation
		}		
		// Vérifie la version JOOMLA minimum
		$minimumJoomlaVersion = '5.2.0';
		if (version_compare(JVERSION, $minimumJoomlaVersion, '<')) {
			$msg= 'Minimum joomla version required is : ' . $minimumJoomlaVersion;
			Factory::getApplication()->enqueueMessage($msg, 'error');
			return false;  // Interrompt l'installation
		}
		
        // supprimer tous les fichiers de scssphp pour éviter conflits
        $path = JPATH_ROOT . '/plugins/system/scsscompiler/scssphp/';
		if (file_exists($path)) {
			$dir_iterator = new RecursiveDirectoryIterator($path);
			$iterator = new RecursiveIteratorIterator($dir_iterator, RecursiveIteratorIterator::CHILD_FIRST);

			foreach ($iterator as $file) {
				if (is_file($file) === true) {
					unlink($file);
				} elseif (substr($file,-1,1)!='.') {
					rmdir($file);
				}
			}
			rmdir($path);    
		}
	}

}
