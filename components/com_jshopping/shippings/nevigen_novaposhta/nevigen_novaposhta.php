<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Model\CartModel;
use Joomla\Plugin\JShopping\NevigenNovaposhta\Helper\NevigenNovaposhtaHelper;

class nevigen_novaposhta extends \shippingextRoot
{
	public int $version = 2;

	public function showConfigForm($config, &$shipping_ext, &$template)
	{

	}

	public function showShippingPriceForm($params, &$shipping_ext_row, &$template)
	{

	}

	public function getPrices(CartModel $cart, array $params, $prices, &$shipping_ext_row, &$shipping_method_price)
	{
		$shippingMethod = \JSFactory::getTable('shippingMethod');
		if ($shippingMethod->load($shipping_method_price->shipping_method_id)
			&& ($shippingMethod->alias === 'NevigenNovaposhtaCourierShippingForm'
				|| $shippingMethod->alias === 'NevigenNovaposhtaPickupShippingForm')
			|| $shippingMethod->alias === 'NevigenNovaposhtaPostomatShippingForm')
		{
			$app = Factory::getApplication();
			/** @var \Joomla\CMS\Session\Session $session */
			$session   = $app->getSession();
			$errorName = 'nevigen_novaposhta_error_' . $shipping_method_price->shipping_method_id;
			$fields    = $cart->getShippingParams();
			if ((float) $cart->getWeightProducts() == 0
				&& (int)NevigenNovaposhtaHelper::config('enabled_cost_order',1) !== 0)
			{
				$app->getDocument()->addScriptOptions($errorName,
					[
						'message' => Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_WEIGHT')
					]
				);

				return $prices;
			}

			if ($shippingMethod->alias === 'NevigenNovaposhtaPickupShippingForm')
			{
				$type = 'warehouse';
			}
			elseif ($shippingMethod->alias === 'NevigenNovaposhtaPostomatShippingForm')
			{
				$type = 'postomat';
			}
			else
			{
				$type = 'doors';
			}


			if (empty($fields) && !empty($session->get('nevigen_novaposhta_postcode')))
			{
				$fields['nevigen_novaposhta_postcode'] = $session->get('nevigen_novaposhta_postcode');
			}
			if (!empty($fields['nevigen_novaposhta_city']) && empty($fields['nevigen_novaposhta_postcode'])){
				$city = NevigenNovaposhtaHelper::searchCity($fields['nevigen_novaposhta_city']);
				if (!empty($city) && !empty($city[0]['ref'])){
					$fields['nevigen_novaposhta_postcode'] = NevigenNovaposhtaHelper::getPostcodeByRef($city[0]['ref']);
				}

			}

			if (empty($fields['nevigen_novaposhta_postcode']))
			{
				return $prices;
			}

			if (!empty($fields))
			{
				if ($type === 'doors')
				{

					$dataCity = NevigenNovaposhtaHelper::getCity($fields['nevigen_novaposhta_postcode']);

					if (!empty($dataCity) && empty($dataCity['delivery']))
					{
						$app->getDocument()->addScriptOptions($errorName,
							[
								'message' => Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_CITY_DELIVERY')
							]
						);

						return $prices;
					}
				}

				$calculate = NevigenNovaposhtaHelper::calculateUkraine($fields['nevigen_novaposhta_postcode'], $type);
				if ($calculate === false)
				{
					$app->getDocument()->addScriptOptions($errorName,
						[
							'message' => Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_CALCULATE')
						]
					);

					return $prices;
				}
				elseif ($calculate === true)
				{
					return $prices;
				}
				else
				{

					if (!empty($calculate) && isset($calculate['price']))
					{
						$prices['shipping'] = $calculate['price'];

					}
				}
			}
			else
			{
				if ($cart->getShippingId() == $shipping_method_price->shipping_method_id)
				{
					$prices['shipping'] = $cart->getShippingPrice();
				}
			}
		}

		return $prices;
	}
}