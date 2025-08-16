<?php

include_once JPATH_SITE . '/components/com_jshopping/addons/addon_core.php';

class Addonpackstation extends AddonCore{
        
    protected $addon_alias;

    public function __construct($addonAlias)
    {
        $this->addon_alias = $addonAlias;
    }
    
    public function getRenderTemplate(array $templateParams, $viewName = 'defaulttemplate'){

        $view = $this->getView($viewName);

        foreach ($templateParams as $key => $value) {
            $view->set($key, $value);
        }

        return $view->loadTemplate();
    }

    public function changeAddonAlias($newAddonAlias)
    {

        if ( !isset($newAddonAlias) && empty($newAddonAlias) ) {
            return;
        }

        $this->addon_alias = $newAddonAlias;

    }
    
}