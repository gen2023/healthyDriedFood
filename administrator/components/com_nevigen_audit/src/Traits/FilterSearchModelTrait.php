<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Traits;

\defined('_JEXEC') or die;

use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;
use Joomla\Database\QueryInterface;

trait FilterSearchModelTrait
{
	/**
	 * Method to add search filter to list query
	 *
	 * @param   QueryInterface  $query        Current QueryInterface object.
	 * @param   array           $emptyParams  Empty params
	 * @param   array           $likes        Search columns for like request.
	 * @param   array           $equals       Search columns for equals request.
	 *
	 * @throws \Exception
	 *
	 * @since  1.0.1
	 */
	protected function setSearchQuery(QueryInterface $query, array $emptyParams = [], array $likes = [], array $equals = [])
	{
		$search = $this->getState('filter.search');

		// Trigger `onNevigenAuditAdminSearchQuery`
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditAdminSearchQuery',
			[$this->context, &$search, &$likes]);

		if (empty($search) || ((empty($likes)) && empty($equals)))
		{
			return;
		}

		$db = $this->getDatabase();
		// Equal search
		$i = 0;
		if (!empty($equals) && strpos($search, ':') !== false)
		{
			list($searchKey, $searchText) = explode(':', $search, 2);
			$searchKey  = strtolower(trim($searchKey));
			$searchText = trim($searchText);
			if (!empty($emptyParams) && $searchKey === 'empty')
			{
				$table = $db->getTableColumns($emptyParams['table'],true);
				if (in_array($searchText,array_keys($table)))
				{
					$query->where($db->quoteName($emptyParams['key'] . $searchText) . ' = ""');
				}
			}
			elseif (!empty($emptyParams) && ($searchKey === 'no_empty' || $searchKey === '!empty'))
			{
				$table = $db->getTableColumns($emptyParams['table'],true);
				if (in_array($searchText,array_keys($table)))
				{
					$query->where($db->quoteName($emptyParams['key'] . $searchText) . ' <> ""');
				}
			}
			else
			{
				foreach ($equals as $selector => $columns)
				{
					if ($searchKey === $selector)
					{
						$conditions = [];
						if (is_array($columns))
						{
							foreach ($columns as $column => $dataType)
							{
								$i++;
								$key             = ':equal_' . $i;
								$conditionColumn = $db->quoteName($column);


								$conditions[] = $conditionColumn . ' = ' . $key;

								$query->bind($key, $searchText, $dataType);
							}

							if (!empty($conditions))
							{
								$query->where('(' . implode(' OR ', $conditions) . ')');

								return;
							}
						}
					}
				}
			}
		}
		else
		{
			// Likes search
			if (!empty($likes))
			{
				$search     = '%' . str_replace(' ', '%', trim($search)) . '%';
				$conditions = [];
				$i          = 0;
				foreach ($likes as $name => $type)
				{
					$conditions[] = $db->quoteName($name) . ' LIKE :like_' . $i;
					$query->bind(':like_' . $i, $search, $type);
					$i++;
				}

				$query->where('(' . implode(' OR ', $conditions) . ')');
			}
		}
	}
}