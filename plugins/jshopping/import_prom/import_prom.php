<?php
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

class plgJshoppingImport_prom extends CMSPlugin
{
    public function onBeforeAdminOptionPanelIcoDisplay(&$menu)
    {
        $lang = Factory::getApplication()->getLanguage();
        $lang->load('plg_jshopping_import_prom', JPATH_ADMINISTRATOR);

        $menu['sofonaImportProm'] = array(
            Text::_('PLG_JSHOPPING_IMPORT_PROM_ICO_OPTION'),
            'index.php?option=com_jshopping&amp;controller=sofonaimportprom',
            'importprom_icon.png',
            1
        );
    }

    public function onBeforeEditCategories(&$view)
    {
        $db = Factory::getDbo();
        $value = '';

        if (!empty($view->category->category_id)) {
            $query = $db->getQuery(true)
                ->select($db->quoteName('id_cat_import_prom'))
                ->from($db->quoteName('#__jshopping_categories'))
                ->where($db->quoteName('category_id') . ' = ' . (int) $view->category->category_id);
            $db->setQuery($query);
            $value = $db->loadResult();
        }

        if (!isset($view->tmp_tab_nav_item)) {
            $view->tmp_tab_nav_item = '';
        }
        if (!isset($view->tmp_tab_pane)) {
            $view->tmp_tab_pane = '';
        }

        $view->tmp_tab_nav_item .= '<li class="nav-item"><a class="nav-link" href="#import_prom" data-bs-toggle="tab">Импорт пром</a></li>';

        $html = '<div id="import_prom" class="tab-pane">';
        $html .= '<div class="form-group">';
        $html .= '<label>Id category prom.ua</label>';
        $html .= '<input type="number" name="id_cat_import_prom" class="form-control" value="' . htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8') . '" />';
        $html .= '</div>';
        $html .= '</div>';

        $view->tmp_tab_pane .= $html;
    }


    public function onAfterSaveCategory($category)
    {
        $input = Factory::getApplication()->input;
        $idCatProm = $input->getInt('id_cat_import_prom', 0);

        if (!$category->category_id) {
            return;
        }

        $db = Factory::getDbo();
        $query = $db->getQuery(true)
            ->update($db->quoteName('#__jshopping_categories'))
            ->set($db->quoteName('id_cat_import_prom') . ' = ' . (int) $idCatProm)
            ->where($db->quoteName('category_id') . ' = ' . (int) $category->category_id);

        $db->setQuery($query)->execute();
    }



}