<?php
/**
 * @package    scssCompiler
 * @author     LOMART
 * @created    12-Nov-2014
 * @version    5.3 (01-Feb-2026)
 * @license    GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Extension\PluginInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\User\UserFactoryInterface;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use Joomla\Event\DispatcherInterface;
use Lomart\Plugin\System\SCSSCompiler\Extension\Scsscompiler;

return new class () implements ServiceProviderInterface {
    /**
     * Registers the service provider with a DI container.
     *
     * @param   Container  $container  The DI container.
     *
     * @return  void
     *
     * @since   4.2.0
     */
    public function register(Container $container)
    {
        $container->set(
            PluginInterface::class,
            function (Container $container) {
                return new Scsscompiler(
                    $container->get(DispatcherInterface::class),
                    (array) PluginHelper::getPlugin('system', 'scsscompiler'),
                    Factory::getApplication(),
                    $container->get(UserFactoryInterface::class)
                );
                return $plugin;
            }
        );
    }
};
