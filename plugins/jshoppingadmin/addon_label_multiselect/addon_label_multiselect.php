<?php
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Database\DatabaseInterface;
use Joomla\CMS\Language\Text;

class plgJshoppingAdminAddon_label_multiselect extends CMSPlugin
{
    protected $app;
    protected $db;

    public function __construct($subject, $config)
    {
        parent::__construct($subject, $config);

        // Joomla 4/5 DI
        $this->app = Factory::getApplication();
        $this->db  = Factory::getContainer()->get(DatabaseInterface::class);
    }

    /**
     * Получаем список всех меток
     */
    private function labelsArray()
    {
        $query = $this->db->getQuery(true)
            ->select('*')
            ->from($this->db->quoteName('#__jshopping_product_labels'))
            ->order('id ASC');

        return $this->db->setQuery($query)->loadObjectList();
    }

    /**
     * Отображение мультиселекта в карточке товара
     */
    public function onBeforeDisplayEditProduct(&$product, &$related_products, &$lists, &$listfreeattributes, &$tax_value)
    {
        $jshopConfig = \JSFactory::getConfig();

        if (!$jshopConfig->admin_show_product_labels) {
            return;
        }

        $alllabels = $this->labelsArray();
        $selected = explode(",", $product->label_multiselect ?: '');

        // Первый элемент "Выберите"
        $first = [
        $first[] = HTMLHelper::_('select.option', '0', Text::_('PLG_JSHOP_LABELS_SELECT'), 'id', 'name')

        ];

        $lists['labels'] = HTMLHelper::_(
            'select.genericlist',
            array_merge($first, $alllabels),
            'label_id[]',
            'class="form-select" size="10" multiple',
            'id',
            'name',
            $selected
        );
    }

    /**
     * Сохранение данных после сохранения товара
     */
    public function onAfterSaveProductEnd($product_id)
    {
        $input = $this->app->input;

        $labels_id = $input->get('label_id', [], 'array');

        // фильтрация — удаляем нули
        $labArr = array_filter(array_map('intval', $labels_id), function ($val) {
            return $val !== 0;
        });

        // строка для label_multiselect
        $implodeArr = implode(",", $labArr);

        // Обновление label_multiselect
        $query = $this->db->getQuery(true)
            ->update($this->db->quoteName('#__jshopping_products'))
            ->set($this->db->quoteName('label_multiselect') . ' = ' . $this->db->quote($implodeArr))
            ->where($this->db->quoteName('product_id') . ' = ' . (int)$product_id);

        $this->db->setQuery($query)->execute();

        // Сохраняем label_id (первую метку)
        $firstLabel = $labArr ? (int)$labArr[0] : 0;

        $query = $this->db->getQuery(true)
            ->update($this->db->quoteName('#__jshopping_products'))
            ->set($this->db->quoteName('label_id') . ' = ' . (int)$firstLabel)
            ->where($this->db->quoteName('product_id') . ' = ' . (int)$product_id);

        $this->db->setQuery($query)->execute();
    }
}
