<?php

defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;

class plgJshoppingadminCategory_cf extends CMSPlugin
{
public function onBeforeEditCategories(&$view)
{
  $this->custom_field(); // обновляем таблицу полей

  $pluginFields = (array) $this->params->get('setkalist', []);
  $db = Factory::getDbo();

  // Загружаем поля с ID и nameField
  $query = $db->getQuery(true)
    ->select('*')
    ->from($db->qn('#__jshopping_category_custom_fields'));
  $db->setQuery($query);
  $dbFields = $db->loadObjectList('name'); // name => объект с id, name, type

  if ($view->category->category_id){
    $categoryId = $view->category->category_id;
     $customFields = $this->getCategoryCustomFields($categoryId);
  }else{
    $customFields='';
  }  
  
  // HTML вкладка
  if (!isset($view->tmp_tab_nav_item)) {
    $view->tmp_tab_nav_item = '';
  }
  if (!isset($view->tmp_tab_pane)) {
    $view->tmp_tab_pane = '';
  }

  $view->tmp_tab_nav_item .= '<li class="nav-item"><a class="nav-link" href="#custom_field" data-bs-toggle="tab">Доп поля</a></li>';
  $html = '<div id="custom_field" class="tab-pane">';

  foreach ($pluginFields as $field) {
    $field = (array) $field;
    $label = htmlspecialchars($field['nameField'] ?? '');
    $type = ($field['typefield'] ?? '0') === '1' ? 'number' : 'text';

    $safeName = trim($field['nameField'] ?? '');
    $id = isset($dbFields[$safeName]) ? (int) $dbFields[$safeName]->id : 0;

    if (!$id) {
      continue; // безопасность
    }
$value = isset($customFields[$id]) ? $customFields[$id] : '';

    $html .= '<div class="form-group">';
    $html .= '<label>' . $label . '</label>';
    $html .= '<input type="' . $type . '" name="custom_fields[' . $id . ']" class="form-control" value="' . $value . '"/ />';
    $html .= '</div>';
  }

  $html .= '</div>';
  $view->tmp_tab_pane .= $html;
}


public function onAfterSaveCategory($category)
{
  $input = Factory::getApplication()->input;
  $data = $input->get('custom_fields', [], 'array');

  if (empty($data)) {
    return;
  }

  $db = Factory::getDbo();

  foreach ($data as $fieldId => $value) {
    $fieldId = (int)$fieldId;
    if (!$fieldId) {
      continue;
    }

    // Удаляем если пусто
    if (trim($value) === '') {
      $delete = $db->getQuery(true)
        ->delete('#__jshopping_category_custom_values')
        ->where('field_id = ' . $fieldId)
        ->where('category_id = ' . (int)$category->category_id);
      $db->setQuery($delete)->execute();
      continue;
    }

    // Обновляем или вставляем
    $query = $db->getQuery(true)
      ->select('id')
      ->from('#__jshopping_category_custom_values')
      ->where('field_id = ' . $fieldId)
      ->where('category_id = ' . (int)$category->category_id);
    $db->setQuery($query);
    $id = $db->loadResult();

    if ($id) {
      $update = $db->getQuery(true)
        ->update('#__jshopping_category_custom_values')
        ->set('value = ' . $db->quote($value))
        ->where('id = ' . (int)$id);
      $db->setQuery($update)->execute();
    } else {
      $insert = $db->getQuery(true)
        ->insert('#__jshopping_category_custom_values')
        ->columns(['field_id', 'category_id', 'value'])
        ->values($fieldId . ', ' . (int)$category->category_id . ', ' . $db->quote($value));
      $db->setQuery($insert)->execute();
    }
  }
}



  protected function custom_field()
  {
    $db = Factory::getDbo();

    // Существующие поля в таблице
    $query = $db->getQuery(true)
      ->select('*')
      ->from($db->qn('#__jshopping_category_custom_fields'));
    $db->setQuery($query);
    $existingFields = $db->loadObjectList('name'); // ключ — имя поля

    $pluginFields = (array) $this->params->get('setkalist', []);

    $newFieldNames = [];

    foreach ($pluginFields as $fieldObj) {
      $field = (array) $fieldObj;
      $name = trim($field['nameField'] ?? '');
      $type = (int) ($field['typefield'] ?? 0);

      if (!$name) {
        continue;
      }

      $newFieldNames[] = $name;

      if (!isset($existingFields[$name])) {
        // Добавляем новое поле
        $ins = $db->getQuery(true)
          ->insert($db->qn('#__jshopping_category_custom_fields'))
          ->columns(['name', 'type'])
          ->values($db->quote($name) . ', ' . $db->quote($type));
        $db->setQuery($ins)->execute();
      } elseif ((int) $existingFields[$name]->type !== $type) {
        // Обновляем тип, если изменился
        $upd = $db->getQuery(true)
          ->update($db->qn('#__jshopping_category_custom_fields'))
          ->set('type = ' . (int) $type)
          ->where('name = ' . $db->quote($name));
        $db->setQuery($upd)->execute();
      }
    }

    // Удаляем лишние поля
    $toDelete = array_diff(array_keys($existingFields), $newFieldNames);
    if ($toDelete) {
      $db->setQuery(
        $db->getQuery(true)
          ->delete($db->qn('#__jshopping_category_custom_fields'))
          ->where('name IN (' . implode(',', array_map([$db, 'quote'], $toDelete)) . ')')
      )->execute();
    }
  }

  public function getCategoryCustomFields($categoryId)
{
    $db = Factory::getDbo();

    $query = $db->getQuery(true)
        ->select('f.name, v.value, v.field_id')
        ->from($db->qn('#__jshopping_category_custom_values', 'v'))
        ->innerJoin($db->qn('#__jshopping_category_custom_fields', 'f') . ' ON f.id = v.field_id')
        ->where('v.category_id = ' . (int)$categoryId);

    $db->setQuery($query);
    $results = $db->loadAssocList();

    $fields = [];
    foreach ($results as $row) {
        $fields[$row['field_id']] = $row['value'];
    }

    return $fields;
}
}
