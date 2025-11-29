<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Editor\Editor;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Database\DatabaseInterface;

class plgJshoppingAdminfield_feed extends CMSPlugin
{
	public function __construct(&$subject, $config)
	{
		parent::__construct($subject, $config);
	}

	/**
	 * Синхронизируем поля из настроек плагина с таблицей
	 */
	private function syncFields()
	{
		$db = Factory::getContainer()->get(DatabaseInterface::class);

		$pluginParams = $this->params->get('setkalist', []);

		// Преобразуем объект subform в массив объектов
		if (is_object($pluginParams)) {
			$pluginParams = get_object_vars($pluginParams);
		}

		$pluginFieldKeys = [];

		foreach ($pluginParams as $item) {
			// Для объекта используем ->
			$pluginFieldKeys[] = $item->field_key;

			// Проверяем, есть ли поле в базе
			$query = $db->getQuery(true)
				->select('id')
				->from($db->quoteName('#__jshopping_feed_fields'))
				->where('field_key=' . $db->quote($item->field_key));
			$db->setQuery($query);
			$fieldId = $db->loadResult();

			if (!$fieldId) {
				// Создаем новое поле
				$query = $db->getQuery(true)
					->insert($db->quoteName('#__jshopping_feed_fields'))
					->columns(['field_key', 'title', 'field_type', 'multilang'])
					->values(implode(',', [
						$db->quote($item->field_key),
						$db->quote($item->title),
						$db->quote($item->field_type),
						1
					]));
				$db->setQuery($query);
				$db->execute();
			} else {

				// Обновляем название или тип, если изменилось
				$query = $db->getQuery(true)
					->update($db->quoteName('#__jshopping_feed_fields'))
					->set('title=' . $db->quote($item->title))
					->set('field_type=' . $db->quote($item->field_type))
					->where('id=' . (int) $fieldId);
				$db->setQuery($query);
				$db->execute();
			}
		}

	}

	/**
	 * Сохранение значений полей при сохранении продукта
	 */
public function onBeforeDisplaySaveProduct(&$post, &$product)
{
    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $app = Factory::getApplication();
    $input = $app->input;

    // product_id может быть в $post или в raw input
    $product_id = (int) ($post['product_id'] ?? $input->getInt('product_id', 0));
    if (!$product_id) return;

    $this->syncFields(); // синхронизируем поля с настройками плагина

    // Загружаем все поля
    $query = $db->getQuery(true)
        ->select('*')
        ->from($db->quoteName('#__jshopping_feed_fields'));
    $db->setQuery($query);
    $fields = $db->loadObjectList();

    foreach ($fields as $field) {
        $fieldName = $field->field_key;

        // Берём НЕФИЛЬТРОВАННОЕ значение из запроса
        $rawValue = $input->get($fieldName, '', 'RAW');

        // Если raw пустой, можно подхватить чистый $post как fallback
        $valueToSave = ($rawValue !== null && $rawValue !== '') ? $rawValue : ($post[$fieldName] ?? '');

        // Подменяем в $post, чтобы дальше bind/store работал с RAW
        $post[$fieldName] = $valueToSave;

        // Сохраняем в таблицу значений
        // Проверяем, есть ли запись
        $q = $db->getQuery(true)
            ->select('id')
            ->from($db->quoteName('#__jshopping_feed_values'))
            ->where('product_id=' . (int) $product_id)
            ->where('field_id=' . (int) $field->id);
        $db->setQuery($q);
        $existingId = $db->loadResult();

        if ($existingId) {
            $q = $db->getQuery(true)
                ->update($db->quoteName('#__jshopping_feed_values'))
                ->set('value=' . $db->quote($valueToSave))
                ->where('id=' . (int) $existingId);
            $db->setQuery($q)->execute();
        } else {
            $q = $db->getQuery(true)
                ->insert($db->quoteName('#__jshopping_feed_values'))
                ->columns(['product_id', 'field_id', 'value'])
                ->values(implode(',', [
                    (int) $product_id,
                    (int) $field->id,
                    $db->quote($valueToSave)
                ]));
            $db->setQuery($q)->execute();
        }
    }
}


	

	/**
	 * Вывод вкладки Feed с полями
	 */
	public function onDisplayProductEditTabsEnd(&$pane, &$row, &$lists, &$tax_value, &$currency)
	{
		$db = Factory::getContainer()->get(DatabaseInterface::class);
		$product_id = $row->product_id;

		$this->syncFields(); // синхронизируем поля из настроек

		// Загружаем все поля
		$query = $db->getQuery(true)
			->select('*')
			->from($db->quoteName('#__jshopping_feed_fields'));
		$db->setQuery($query);
		$fields = $db->loadObjectList();

		$editor = Editor::getInstance(Factory::getConfig()->get('editor'));

		echo '<div id="product_feed_tab" class="tab-pane">';
		echo '<table class="table table-striped">';

		foreach ($fields as $field) {
			$fieldName = $field->field_key;

			// Получаем текущее значение
			$query = $db->getQuery(true)
				->select('value')
				->from($db->quoteName('#__jshopping_feed_values'))
				->where('product_id=' . (int) $product_id)
				->where('field_id=' . (int) $field->id);
			$db->setQuery($query);
			$value = $db->loadResult() ?: '';

			switch ($field->field_type) {
				case 'editor':
					$input = $editor->display($fieldName, $value, '100%', '250', '60', '20');
					break;
				case 'number':
					$input = '<input type="number" class="form-control" name="' . $fieldName . '" value="' . htmlspecialchars($value, ENT_QUOTES) . '">';
					break;

				default:
					$input = '<input type="text" class="form-control" name="' . $fieldName . '" value="' . htmlspecialchars($value, ENT_QUOTES) . '">';

					break;
			}


			echo '<tr>
                <td>' . htmlspecialchars($field->title) . '</td>
                <td>' . $input . '</td>
              </tr>';
		}

		echo '</table>';
		echo '</div>';
	}


	/**
	 * Добавляем вкладку Feed
	 */
	public function onDisplayProductEditTabsEndTab(&$row, &$lists, &$tax_value)
	{
		echo '<li class="nav-item">
            <a class="nav-link" href="#product_feed_tab" data-toggle="tab">Feed</a>
          </li>';
	}
}
