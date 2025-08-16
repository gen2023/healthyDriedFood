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

use Joomla\CMS\Date\Date;
use Joomla\Database\QueryInterface;

trait FilterPeriodModelTrait
{
	/**
	 * Method to add period filter to list query
	 *
	 * @param   QueryInterface  $query   Current QueryInterface object.
	 * @param   string          $column  Search column for like request.
	 * @param   string          $state   State name.
	 *
	 * @since  1.0.0
	 */
	protected function setPeriodQuery(QueryInterface $query, string $column, string $state = 'filter.period')
	{
		$db     = $this->getDatabase();
		$period = $this->getState($state);
		if (!empty($period))
		{
			if (!is_array($period))
			{
				$period = ['from' => $period];
			}
			if (!empty($period['from']))
			{
				$period['from'] = (new Date($period['from']))->setTime(0, 0)->toSql();
			}
			if (!empty($period['to']))
			{
				$period['to'] = (new Date($period['to']))->setTime(23, 59, 59)->toSql();
			}

			$conditionPeriod = '';
			if (!empty($period['from']) && !empty($period['to']))
			{
				$conditionPeriod = 'BETWEEN ' . $db->quote($period['from']) . ' AND ' . $db->quote($period['to']);
			}
			elseif (!empty($period['from']))
			{
				$conditionPeriod = ' > ' . $db->quote($period['from']);
			}
			elseif (!empty($period['to']))
			{
				$conditionPeriod = ' < ' . $db->quote($period['to']);
			}

			if (!empty($conditionPeriod))
			{
				$query->where('(' . $db->quoteName($column) . $conditionPeriod . ')');
			}
		}
	}
}