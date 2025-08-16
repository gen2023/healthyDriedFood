<?php
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Language\Text;
class PlgSystemAutoscrolls extends CMSPlugin
{
    protected $app;
    protected $autoloadLanguage = true;

    public function onBeforeCompileHead()
    {
        if ($this->app->isClient('administrator')) {
            return;
        }     
         
        $lang = Factory::getLanguage();
        $lang->load('plg_system_autoscrolls', JPATH_ADMINISTRATOR, null, true);    

        $wa = Factory::getApplication()->getDocument()->getWebAssetManager();

        $mediaPath = Uri::root() . 'media/plg_system_autoscrolls/js/autoscrolls.js';
        $wa->registerScript('plg.system.autoscrolls', $mediaPath, [], ['defer' => true], ['core']);
        $wa->useScript('plg.system.autoscrolls');

        $mediaCssPath = Uri::root() . 'media/plg_system_autoscrolls/css/autoscrolls.css';
        $wa->registerStyle('plg.system.autoscrolls', $mediaCssPath);
        $wa->useStyle('plg.system.autoscrolls');

        $setkalist = $this->params->get('setkalist', []);
        $configs = [];
        foreach ($setkalist as $key => $config) {
            $configs[] = [
                'paginationClass' => $config->pagination_class ?? '.pagination',
                'blockClass' => $config->block_class ?? '.blog-items',
                'disable_mob_px' => $config->disable_mob ? $config->disable_mob_px : 0,
                'scroll_top' => $config->scroll_first ?? 0,
                'hide_pagination' => $config->hide_pagination ?? 0,
                'add_btn' => $config->add_btn ?? 0,
                'name_btn' => Text::_('PLG_AUTO_SCROLL_READ_MORE'),
            ];
        }

        $js = 'window.autoscrolls = ' . json_encode($configs) . ';';
        $wa->addInlineScript($js);

    }
}
