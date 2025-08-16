<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Application\AdministratorApplication;
use Joomla\CMS\Factory;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Installer\InstallerScriptInterface;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Version;


return new class () implements InstallerScriptInterface {
    /**
     * Minimum PHP version required to install the extension.
     *
     * @var  string
     *
     * @since  1.0.0
     */
    protected string $minimumPhp = '7.4';

    /**
     * Minimum Joomla version required to install the extension.
     *
     * @var  string
     *
     * @since  1.0.0
     */
    protected string $minimumJoomla = '4.2.0';

    /**
     * Function called after the extension is installed.
     *
     * @param InstallerAdapter $adapter The adapter calling this method
     *
     * @return  boolean  True on success
     *
     * @since   1.0.0
     */
    public function install(InstallerAdapter $adapter): bool
    {
        return true;
    }


    /**
     * Function called after the extension is updated.
     *
     * @param InstallerAdapter $adapter The adapter calling this method
     *
     * @return  boolean  True on success
     *
     * @since   1.0.0
     */
    public function update(InstallerAdapter $adapter): bool
    {
	    // Refresh media version
	    (new Version())->refreshMediaVersion();

        return true;
    }

    /**
     * Function called after the extension is uninstalled.
     *
     * @param InstallerAdapter $adapter The adapter calling this method
     *
     * @return  boolean  True on success
     *
     * @since   1.0.0
     */
    public function uninstall(InstallerAdapter $adapter): bool
    {
        return true;
    }

    /**
     * Function called before extension installation/update/removal procedure commences.
     *
     * @param string $type The type of change (install or discover_install, update, uninstall)
     * @param InstallerAdapter $adapter The adapter calling this method
     *
     * @return  boolean  True on success
     *
     * @since   1.0.0
     */
    public function preflight(string $type, InstallerAdapter $adapter): bool
    {
        // Check compatible
        if (!$this->checkCompatible('PKG_NEVIGEN_JSHOP_ONESTEPCHECKOUT_')) return false;

        return true;
    }

    /**
     * Method to check compatible.
     *
     * @param string|null $prefix Language constants prefix.
     *
     * @return  boolean True on success, false on failure.
     *
     * @throws  Exception
     *
     * @since  1.0.0
     */
    protected function checkCompatible(string $prefix = null): bool
    {

        /** @var AdministratorApplication $app */
        $app = Factory::getContainer()->get(AdministratorApplication::class);

        // Check PHP
        if (!(version_compare(PHP_VERSION, $this->minimumPhp) >= 0)) {
            $app->enqueueMessage(Text::sprintf($prefix . 'ERROR_COMPATIBLE_PHP', $this->minimumPhp),
                'error');

            return false;
        }

        // Check joomla version
        if (!(new Version())->isCompatible($this->minimumJoomla)) {
            $app->enqueueMessage(Text::sprintf($prefix . 'ERROR_COMPATIBLE_JOOMLA', $this->minimumJoomla),
                'error');

            return false;
        }

        // Check JoomShopping
        if (!is_file(JPATH_SITE . '/components/com_jshopping/bootstrap.php')) {
            $app->enqueueMessage(Text::_($prefix . 'ERROR_COMPATIBLE_JSHOPPING'),
                'error');

            return false;
        };

        return true;
    }

    /**
     * Function called after extension installation/update/removal procedure commences.
     *
     * @param string $type The type of change (install or discover_install, update, uninstall)
     * @param InstallerAdapter $adapter The adapter calling this method
     *
     * @return  boolean  True on success
     *
     * @since   1.0.0
     */
    public function postflight(string $type, InstallerAdapter $adapter): bool
    {
        return true;
    }
};