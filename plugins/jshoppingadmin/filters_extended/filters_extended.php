<?php

use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;

defined('_JEXEC') or die();

class plgjshoppingadminFilters_extended extends JPlugin{
    
    public function __construct(&$subject, $config){
        parent::__construct($subject, $config);
    }

    public function onBeforeSaveAttribut(&$attribut)
    {
    	$JSLangCodeWithName = $this->getJSDefaultLangCode('name_');
    	$attrName = $attribut[$JSLangCodeWithName] . ' attribute';
    	$this->insertNewStaticText($attrName);
    }

    public function onBeforeSaveProductField($post)
    {
    	$JSLangCodeWithName = $this->getJSDefaultLangCode('name_');
    	$charactName = $post[$JSLangCodeWithName] . ' characteristic';

    	$this->insertNewStaticText($charactName);
    }

	public function onAfterSaveAddons(&$params, &$post, &$row) {
		if (isset($post['clear_cache']) && $post['clear_cache'] == 1) {
			include_once (JPATH_SITE.'/modules/mod_jshopping_filters_extended/cache.php');
			$cache = filterExtCache::getInstance();
			$cache->clear();
		}
	}

	public function onBeforeEditCategories($view)
    {
		$addon = new AddonCore('filters_extended');
		$params = $addon->getAddonParams();

		if ($params['category_characteristics_settings'] ?? 0) {
			$view->etemplatevar .= $this->displayCategoryCharacteristicsSettings($view->category);
		}
    }

	public function onBeforeSaveCategory(&$post)
	{
		$addon = new AddonCore('filters_extended');
		$params = $addon->getAddonParams();

		if ($params['category_characteristics_settings'] ?? 0) {
			$post['char_id_checkbox'] = json_encode(array_map('intval', $post['char_id_checkbox'] ?? []));
			$post['char_id_select'] = json_encode(array_map('intval', $post['char_id_select'] ?? []));
		}
	}

	protected function displayCategoryCharacteristicsSettings($category): string
	{
		$addon = new AddonCore('filters_extended');
		$model = JSFactory::getModel("ProductFields");
		$characteristics = $model->getList(true, null, null, ['category_id' => $category->category_id]);

		\JFactory::getLanguage()->load('mod_jshopping_filters_extended', JPATH_SITE);

		$view = $addon->getView('characteristics_settings');
		$view->char_id_checkbox = empty($category->char_id_checkbox) ? [] : json_decode($category->char_id_checkbox, true);
		$view->char_id_select = empty($category->char_id_select) ? [] : json_decode($category->char_id_select, true);
		$view->characteristics = array_merge(
			[(object) ['id' => 0, 'name' => Text::_('JALL')]],
			$characteristics
		);
		$view->table = $category;
		return $view->loadTemplate();
	}

    protected function getJSDefaultLangCode($prefixForLang = null)
    {
    	$JSLangCode = JSFactory::getLang()->lang;

    	if ( !empty($prefixForLang) ) {
   			$res = $prefixForLang . $JSLangCode;  
    	} else {
   			$res = $JSLangCode;   
    	}	

    	return $res;
    }

    protected function insertNewStaticText($attrName)
    {
    	$db = \JFactory::getDBo();

    	if ( !$this->checkIfExistStaticText($attrName) ) {
			$sqlInsert = 'INSERT INTO `#__jshopping_config_statictext`(`alias`) VALUES("' . $db->escape($attrName) . '")';
    		$db->setQuery($sqlInsert);
    		$db->execute();    		
    	}
    }

    protected function checkIfExistStaticText($attrName)
    {
    	$db = \JFactory::getDBo();
    	$sqlCheckAttr = 'SELECT `id` FROM `#__jshopping_config_statictext` WHERE `alias` = "' . $db->escape($attrName) . '"';

    	$db->setQuery($sqlCheckAttr);

    	return $db->loadResult() ? true : false;
    	
    }
    
}