<?php


namespace Joomla\Component\Jshopping\Site\Model;

use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use Joomla\CMS\Router\Route;

class AggregatorModel extends BaseModel
{

	protected $db;

	public function __construct()
	{
		$this->db = Factory::getContainer()->get(DatabaseInterface::class);
	}
	protected function getAllProducts($filters)
	{
		$baseFilters = $filters['base'] ?? [];
		$includeFields = $filters['include'] ?? [];
		$excludeFields = $filters['exclude'] ?? [];

		$query = $this->db->getQuery(true)
			->select('p.*, GROUP_CONCAT(i.image_name ORDER BY i.ordering ASC) AS images')
			->from($this->db->quoteName('#__jshopping_products', 'p'))
			->join(
				'LEFT',
				$this->db->quoteName('#__jshopping_products_images', 'i') .
				' ON ' . $this->db->quoteName('p.product_id') . ' = ' . $this->db->quoteName('i.product_id')
			)
			->join(
				'LEFT',
				$this->db->quoteName('#__jshopping_products_to_extra_fields', 'ef') .
				' ON ' . $this->db->quoteName('p.product_id') . ' = ' . $this->db->quoteName('ef.product_id')
			)
			->group('p.product_id');

		// базовые условия (publish, quantity)
		if (!empty($baseFilters)) {
			foreach ($baseFilters as $condition) {
				$query->where($condition);
			}
		}

		// включаем товары только с нужными extrafield
		if (!empty($includeFields)) {
			$includeConds = [];
			foreach ($includeFields as $field => $value) {
				$includeConds[] = $this->db->quoteName("ef.$field") . ' = ' . (int) $value;
			}
			$query->where('(' . implode(' OR ', $includeConds) . ')');
		}

		// исключаем товары по extrafield
		if (!empty($excludeFields)) {
			$excludeConds = [];
			foreach ($excludeFields as $field => $value) {
				$excludeConds[] = $this->db->quoteName("ef.$field") . ' = ' . (int) $value;
			}
			$query->where('NOT (' . implode(' OR ', $excludeConds) . ')');
		}

		$rows = $this->db->setQuery($query)->loadObjectList();

		foreach ($rows as $row) {
			$row->images = $row->images ? explode(',', $row->images) : [];
		}

		return $rows;
	}




	public function getExtraFieldProduct(array $productIds): array
	{
		// Все поля
		$fields = $this->db->setQuery(
			$this->db->getQuery(true)
				->select('*')
				->from('#__jshopping_products_extra_fields')
				->order('ordering ASC')
		)->loadObjectList('id');

		// Все значения для справочников
		$values = $this->db->setQuery(
			$this->db->getQuery(true)
				->select('*')
				->from('#__jshopping_products_extra_field_values')
		)->loadObjectList('id');

		// Таблица связей "товар → доп. поля"
		$query = $this->db->getQuery(true)
			->select('*')
			->from('#__jshopping_products_to_extra_fields')
			->where('product_id IN (' . implode(',', $productIds) . ')');

		$rows = $this->db->setQuery($query)->loadObjectList();

		$result = [];

		foreach ($rows as $row) {
			$pid = $row->product_id;

			foreach ($row as $key => $rawValue) {
				if (strpos($key, 'extra_field_') !== 0 || !$rawValue) {
					continue;
				}

				$fieldIndex = (int) str_replace('extra_field_', '', $key);
				$field = $fields[$fieldIndex] ?? null;

				if (!$field) {
					continue;
				}

				$value = null;

				if ((int) $field->type === 1) {
					// Тип "ввод текста вручную" → значение сразу
					$value = $rawValue;
				} else {
					// Тип "справочник" → ищем по ID
					if (isset($values[$rawValue])) {
						$value = $values[$rawValue]->{'name_uk-UA'};
					}
				}

				if ($value !== null) {
					$result[$pid][] = [
						'field_id' => $fieldIndex,
						'field_name' => $field->{'name_uk-UA'},
						'field_name_ru' => $field->{'name_ru-RU'},
						'value' => $value,
					];
				}
			}
		}

		return $result;
	}



	public function getProducts($filters = [])
	{
		$products = $this->getAllProducts($filters);

		$productIds = array_column($products, 'product_id');
		if (empty($productIds)) {
			return $products;
		}

		$extraByProduct = $this->getExtraFieldProduct($productIds);

		foreach ($products as &$product) {
			$product->extra_fields = $extraByProduct[$product->product_id] ?? [];
		}

		return $products;
	}


	public function getCategories()
	{
		$query = $this->db->getQuery(true)
			->select('*')
			->from($this->db->quoteName('#__jshopping_categories'))
			->where($this->db->quoteName('category_publish') . ' = 1');

		return $this->db->setQuery($query)->loadObjectList();
	}

	public function getCurrencies(): array
	{
		$query = $this->db->getQuery(true)
			->select('*')
			->from($this->db->quoteName('#__jshopping_currencies'))
			->order($this->db->quoteName('currency_ordering') . ' ASC');

		$this->db->setQuery($query);

		return $this->db->loadObjectList();
	}

	/**
	 * plg_jshopadmin_category_cf
	 */
	public function getCategoryCF($id)
	{
		$query = $this->db->getQuery(true)
			->select('*')
			->from($this->db->quoteName('#__jshopping_category_custom_values'))
			->where($this->db->quoteName('field_id') . ' = ' . (int) $id);

		return $this->db->setQuery($query)->loadObjectList();
	}

	public function getMainCategory($productId)
	{
		$db = Factory::getContainer()->get('DatabaseDriver');

		$query = $db->getQuery(true)
			->select($db->quoteName('category_id'))
			->from($db->quoteName('#__jshopping_products_to_categories'))
			->where($db->quoteName('product_id') . ' = ' . (int) $productId)
			->order($db->quoteName('category_id') . ' ASC'); // или ORDER BY ordering если нужно "основная"

		$db->setQuery($query);

		return (int) $db->loadResult();
	}

	public function getInfoDopField($product_id)
{
    
    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $result = [];

    // Получаем поля + их значения
    $query = $db->getQuery(true)
        ->select(
            'f.field_key, v.value'
        )
        ->from($db->quoteName('#__jshopping_feed_fields', 'f'))
        ->leftJoin(
            $db->quoteName('#__jshopping_feed_values', 'v') .
            ' ON v.field_id = f.id AND v.product_id = ' . (int)$product_id
        )
        ->order('f.id ASC');

    $db->setQuery($query);
    $rows = $db->loadObjectList();
    foreach ($rows as $row) {
        $result[$row->field_key] = $row->value ?? '';
    }

    return $result;
}

}
