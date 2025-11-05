<?php
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Database\DatabaseInterface;

class PlgSystemProduct_Materials extends CMSPlugin
{
    protected $app;
    protected $autoloadLanguage = true;

    /**
     * Добавляем вкладку в карточку товара (JoomShopping)
     */
    public function onDisplayProductEditTabsTab(&$product, &$lists, &$tax_value)
    {
        echo '<li class="nav-item">
                <a href="#product_materials" class="nav-link" data-toggle="tab">'
            . Text::_('Материалы') .
            '</a>
            </li>';
    }

    /**
     * Содержимое вкладки "Материалы" в карточке товара
     */
    public function onDisplayProductEditTabs(&$pane, &$product, &$lists, &$tax_value, &$currency)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        // Получаем все материалы
        $query = $db->getQuery(true)
            ->select('id, title')
            ->from('#__content')
            ->order('title ASC');
        $db->setQuery($query);
        $materials = $db->loadObjectList();

        // Получаем выбранные материалы для товара
        $query = $db->getQuery(true)
            ->select('material_id')
            ->from('#__product_materials')
            ->where('product_id = ' . (int) $product->product_id);
        $db->setQuery($query);
        $selected = array_column($db->loadAssocList(), 'material_id');

        include __DIR__ . '/tmpl/tab_product_materials.php';
    }

    /**
     * Сохраняем связи при сохранении товара
     */
    public function onAfterSaveProduct(&$product)
    {
        $input = Factory::getApplication()->input;
        $materials = $input->post->get('product_materials', [], 'array');
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        // Удаляем старые связи
        $db->setQuery('DELETE FROM #__product_materials WHERE product_id = ' . (int) $product->product_id);
        $db->execute();

        // Добавляем новые
        foreach ($materials as $mid) {
            $obj = (object) [
                'product_id' => (int) $product->product_id,
                'material_id' => (int) $mid,
            ];
            $db->insertObject('#__product_materials', $obj);
        }
    }

    public function onContentPrepareData($context, &$data)
    {
        if ($context !== 'com_content.article')
            return;

        if (is_array($data))
            $data = (object) $data;

        if (is_object($data)) {
            $db = Factory::getContainer()->get(DatabaseInterface::class);
            $query = $db->getQuery(true)
                ->select('product_id')
                ->from('#__product_materials')
                ->where('material_id = ' . (int) $data->id);
            $db->setQuery($query);

            // создаём свойство всегда
            $data->related_products = array_column($db->loadAssocList(), 'product_id');
            if (!is_array($data->related_products)) {
                $data->related_products = [];
            }
        }
    }

    public function onContentPrepareForm($form, $data)
    {
        if ($form->getName() !== 'com_content.article') {
            return;
        }

        $lang = Factory::getApplication()->getLanguage()->getTag();
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        // Получаем товары
        $products = $db->setQuery(
            $db->getQuery(true)
                ->select('product_id, `name_' . $lang . '` AS name')
                ->from('#__jshopping_products')
                ->order('`name_' . $lang . '` ASC')
        )->loadObjectList();

        // echo '<pre>';var_dump($data->related_products);die;

        // Выбранные товары
        $selected = [];
        if (is_object($data) && property_exists($data, 'related_products')) {
            $selected = (array) $data->related_products;
        }



        $xml = new SimpleXMLElement('<form />');
        $fields = $xml->addChild('fields');

        $fieldset = $fields->addChild('fieldset');
        $fieldset->addAttribute('name', 'params'); // <-- просто уникальное имя
        $fieldset->addAttribute('label', 'Связанные товары');

        $field = $fieldset->addChild('field');
        $field->addAttribute('name', 'related_products'); // <-- ключ массива
        $field->addAttribute('type', 'list');
        $field->addAttribute('multiple', 'true');
        $field->addAttribute('label', 'Выберите товары');
        $field->addAttribute('class', 'form-select');

        foreach ($products as $p) {
            $option = $field->addChild('option', htmlspecialchars($p->name));
            $option->addAttribute('value', $p->product_id);

            if (in_array($p->product_id, $selected)) {
                $option->addAttribute('selected', 'selected');
            }
        }

        $form->load($xml->asXML());

    }

    /**
     * Сохраняем связи при сохранении материала
     */
    public function onContentAfterSave($context, $article, $isNew, $data)
    {
        if ($context !== 'com_content.article') {
            return;
        }

        $app = Factory::getApplication();
        $db = Factory::getContainer()->get(DatabaseInterface::class);

        $form = $app->input->get('jform', [], 'array');

        $products = $form['related_products'];

        $db->setQuery('DELETE FROM #__product_materials WHERE material_id = ' . (int) $article->id);
        $db->execute();

        if (!empty($products)) {
            foreach ($products as $pid) {
                $obj = (object) [
                    'product_id' => (int) $pid,
                    'material_id' => (int) $article->id,
                ];
                $db->insertObject('#__product_materials', $obj);
            }
        }

    }

public static function getRelatedMaterials($productId)
{
    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $lang = Factory::getApplication()->getLanguage()->getTag();

    $query = $db->getQuery(true)
        ->select('m.id, m.title, m.images')
        ->from('#__content AS m')
        ->join('INNER', '#__product_materials AS pm ON pm.material_id = m.id')
        ->where('pm.product_id = ' . (int) $productId)
        ->where('(m.language = ' . $db->quote($lang) . ' OR m.language = "*")') 
        ->order('m.title ASC');

    $db->setQuery($query);
    $materials = $db->loadObjectList();

    foreach ($materials as &$material) {
        $images = json_decode($material->images ?? '');
        $material->intro_image = is_object($images) ? ($images->image_intro ?? '') : '';
        $material->full_image = is_object($images) ? ($images->image_fulltext ?? '') : '';
    }

    return $materials;
}


    public static function getRelatedProducts($materialId)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $langTag = Factory::getApplication()->getLanguage()->getTag();
        $fieldName = 'name_' . $langTag;
        $fieldAlias = 'alias_' . $langTag;

        // Основной запрос
        $query = $db->getQuery(true)
            ->select('p.product_id, p.' . $db->quoteName($fieldName) . ' AS name, p.image AS image, p.' . $db->quoteName($fieldAlias) . ' as alias, ptc.category_id')
            ->from('#__jshopping_products AS p')
            ->join('INNER', '#__product_materials AS pm ON pm.product_id = p.product_id')
            ->join('LEFT', '#__jshopping_products_to_categories AS ptc ON ptc.product_id = p.product_id')
            ->where('pm.material_id = ' . (int) $materialId)
            ->group('p.product_id') // чтобы не дублировались продукты, если несколько категорий
            ->order($db->quoteName($fieldName) . ' ASC');

        $db->setQuery($query);

        return $db->loadObjectList();
    }

    public function onBeforeDisplayListProductsView(&$view)
    {
        $view->tmp_html_col_after_title .= '<th>Статьи</th>';

        foreach ($view->rows as &$row) {
            $count = $this->getMaterialCountForProduct($row->product_id);
            $row->tmp_html_col_after_title = '<td style="text-align:center;">' . (int) $count . '</td>';
        }
    }

    protected function getMaterialCountForProduct($productId)
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select('COUNT(*)')
            ->from('#__product_materials')
            ->where('product_id = ' . (int) $productId);
        $db->setQuery($query);

        return (int) $db->loadResult();
    }



}
