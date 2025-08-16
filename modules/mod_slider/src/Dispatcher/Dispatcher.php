<?php

/**
 * @package     Joomla.Site
 * @subpackage  mod_custom
 *
 * @copyright   (C) 2023 Open Source Matters, Inc. <https://www.joomla.org>
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Module\Slider\Site\Dispatcher;

use Joomla\CMS\Dispatcher\AbstractModuleDispatcher;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Factory;

// phpcs:disable PSR1.Files.SideEffects
\defined('_JEXEC') or die;
// phpcs:enable PSR1.Files.SideEffects

/**
 * Dispatcher class for mod_slider
 *
 * @since  4.4.0
 */
class Dispatcher extends AbstractModuleDispatcher
{
    /**
     * Returns the layout data.
     *
     * @return  array
     *
     * @since   4.4.0
     */
    protected function getLayoutData()
    {
        $data = parent::getLayoutData();
        $params = $data['params'];
        $data['sliderList'] = $params->get('setkalist');
        $data['use_swiper'] = (int) $params->get('use_swiper', 0);
        $use_script_slider = $params->get('use_script_slider', 0);
        $script_slider = $params->get('script_slider', '');
        $params->get('size_mob') ?? '768';

        /** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
        $app = Factory::getApplication();
        $wa = $app->getDocument()->getWebAssetManager();

        if ($data['use_swiper'] == 1) {

            $wa->registerAndUseStyle('swiper_css', 'mod_slider/swiper.min.css', [], ['relative' => true]);
            $wa->registerAndUseScript('swiper_js', 'mod_slider/swiper.min.js', [], ['relative' => true, 'defer' => true]);
        }

        if ($use_script_slider == 1 && $script_slider) {
            $wa->addInlineScript($script_slider);
        }

        return $data;
    }
}
