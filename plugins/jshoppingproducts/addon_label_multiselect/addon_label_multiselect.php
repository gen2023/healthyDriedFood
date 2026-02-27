<?php
/**
 * Plugin: JoomShopping - Product Labels Multiselect
 */
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;

// use JoomShopping\Component\Jshopping\Site\Factory\JshopFactory; // Важно!

class plgJshoppingProductsAddon_label_multiselect extends CMSPlugin
{
    /**
     * DB
     * @var DatabaseInterface
     */
    protected $db;

    public function __construct(&$subject, $config)
    {
        parent::__construct($subject, $config);

        // Joomla 4/5/6: так получаем базу
        $this->db = Factory::getContainer()->get(DatabaseInterface::class);
    }

    /**
     * Получение метки
     */
    private function __getList($label_id)
    {
        $query = $this->db->getQuery(true)
            ->select('*')
            ->from('#__jshopping_product_labels')
            ->where('id = ' . (int)$label_id);

        return $this->db->setQuery($query)->loadObject();
    }

    /**
     * Подмена запроса списка товаров
     */
    public function onBeforeQueryGetProductList($all_products, &$adv_result, &$adv_from, &$adv_query, &$order_query, &$filters)
    {
        // Добавляем поле в SELECT
        $adv_result .= ', prod.label_multiselect';

        if (!isset($filters['labels']) || !count($filters['labels'])) {
            return false;
        }

        // Строим условия
        $conditions = [];
        foreach ($filters['labels'] as $label_id) {
            $conditions[] = " FIND_IN_SET(" . (int)$label_id . ", prod.label_multiselect) ";
        }

        if (!$conditions) return false;

        // старый поиск условия
        $old_regex = '/prod\.label_id\s+in\s+\(.*\)/i';

        // новое условие
        $new_str = '(' . implode(' OR ', $conditions) . ')';

        // подмена в WHERE
        $adv_query = preg_replace($old_regex, $new_str, $adv_query);
    }

    /**
     * Отображение ярлыков в списке товаров
     */
public function onListProductUpdateData(&$products)
{
    $jshopConfig = \JSFactory::getConfig();
    $path_label = $jshopConfig->image_labels_live_path;

    foreach ($products as &$prod) {
        $prod->label_id = 0;
        $prod->label_multiselect = explode(',', $prod->label_multiselect);

        $html = '<div class="multilabel">';
        foreach ($prod->label_multiselect as $labl_id) {
            $label = $this->__getList($labl_id);
            if ($label && $label->image != '') {
                $html .= '<div class="item"><img src="' . $path_label . '/' . $label->image . '"></div>';
            }
        }
        $html .= '</div>';

        $prod->_tmp_var_bottom_foto = $html;
    }
}


    /**
     * Отображение меток на карточке товара
     */
public function onBeforeDisplayProductView(&$view)
{
    $jshopConfig = \JSFactory::getConfig();
    $path_label = $jshopConfig->image_labels_live_path;

    $product = $view->product;
    $product->label_id = 0;

    $product->label_multiselect = explode(',', $product->label_multiselect);

    $html = '<div class="multilabel">';
    foreach ($product->label_multiselect as $labl_id) {
        $label = $this->__getList($labl_id);

        if ($label && $label->image != '') {
            $html .= '<div><img src="' . $path_label . '/' . $label->image . '"></div>';
        }
    }
    $html .= '</div>';

    $view->_tmp_product_html_after_image = $html;
}

}
