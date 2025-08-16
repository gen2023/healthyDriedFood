<?php
/*
 * @package    Nevigen JShop Recently Viewed Products Package
 * @version    1.0.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\JShopping\NevigenRecentlyViewedProducts\Helper;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\Registry\Registry;


class NevigenRecentlyViewedProductsHelper
{
	protected static string $key = 'nevigen_shop_recently_viewed_products';

	public static function setProduct($id = null, ?Registry $params = null): void
	{
		if (empty($id) || empty($params))
		{
			return;
		}
		$session = Factory::getApplication()->getSession();
		$data    = $session->get(self::$key, []);
		if (!empty($data) && in_array($id, $data))
		{
			return;
		}
		$limit = (int) $params->get('limit', 12);
		if ($limit > 0 && $limit <= count($data))
		{
			array_shift($data);
		}

		$data[] = $id;
		$session->set(self::$key, $data);

	}

	public static function getProducts()
	{
		$data = Factory::getApplication()->getSession()->get(self::$key, []);
		if (!empty($data))
		{
			$app     = Factory::getApplication();
			$current = 0;
			if ($app->input->getString('option') === 'com_jshopping'
				&& ($app->input->getString('controller') === 'product'
					|| $app->input->getString('view') === 'product'))
			{
				$current = $app->input->getInt('product_id');
			}
			if ($current > 0 && in_array($current, $data))
			{
				$key = array_search($current, $data);
				unset($data[$key]);
			}
		}

		return $data;
	}
}