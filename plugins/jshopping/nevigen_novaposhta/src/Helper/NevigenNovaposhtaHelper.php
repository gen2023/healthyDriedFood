<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\JShopping\NevigenNovaposhta\Helper;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Http\Http;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\CartModel;
use Joomla\Database\DatabaseDriver;
use Joomla\Filesystem\File;
use Joomla\Filesystem\Folder;
use Joomla\Registry\Registry;
use Joomla\Utilities\ArrayHelper;

class NevigenNovaposhtaHelper
{
	protected static ?array $_config = null;
	protected static string $api = 'https://api.novaposhta.ua/v2.0/json/';
	protected static array $calculateUkraine = [];

	public static function calculateUkraine($postcode_recipient = null, $recipientServiceType = null)
	{
		$typeDisplay = (int) self::config('enabled_cost_order', 1);
		if ($typeDisplay === 0)
		{
			return true;
		}
		if (empty($recipientServiceType) || empty($postcode_recipient)) return false;

		$cartData = self::getCartData();
		if (empty($cartData))
		{
			return false;
		}

		$sender = self::config('sender_postcode', '');
		if (empty($sender))
		{
			return false;
		}
		$serviceType = ucfirst(self::config('sender_type', 'warehouse'))
			. ucfirst($recipientServiceType);
		$sender      = self::getCity($sender);
		if (empty($sender))
		{
			return false;
		}
		$recipient = self::getCity($postcode_recipient);
		if (empty($recipient))
		{
			return false;
		}

		$data                  = [];
		$data['CitySender']    = $sender['ref'];
		$data['CityRecipient'] = $recipient['ref'];
		$data['Weight']        = $cartData['weight'];
		$data['CargoType']     = 'Cargo';
		$data['SeatsAmount']   = 1;
		$data['Cost']          = $cartData['total'];
		$data['ServiceType']   = $serviceType;

		if (!empty($cartData['length']) || !empty($cartData['width']) || !empty($cartData['height']))
		{
			foreach (['length', 'width', 'height'] as $key)
			{
				if (!empty($cartData[$key]))
				{
					$data['volumetric' . ucfirst($key)] = $cartData[$key];
				}
			}
		}

		$hash = md5(serialize($data));
		if (!isset(self::$calculateUkraine[$hash]))
		{
			$result = self::request('InternetDocument', 'getDocumentPrice', $data);

			if (!empty($result) && isset($result['data'][0]['Cost']))
			{
				$jshopConfig = JSFactory::getConfig();

				$price = self::convertApiPrice($result['data'][0]['Cost'], 'from');

				/** @var CartModel $cart */
				$cart = JSFactory::getModel('cart', 'Site');
				$cart->load();

				if ($typeDisplay === 1)
				{
					$cart->setShippingPrice($price);
				}
				else
				{
					$cart->setShippingPrice(0);
				}


				$calculate = [
					'price'        => $price,
					'price_string' => Helper::formatprice($price, $jshopConfig->currency_code, $jshopConfig->currency_value),
				];

				self::$calculateUkraine[$hash] = $calculate;

				return self::$calculateUkraine[$hash];
			}
		}
		else
		{
			return self::$calculateUkraine[$hash];
		}

		return false;

	}

	public static function searchCity($cityName)
	{
		$request = self::request('Address', 'searchSettlements', [
			'CityName' => $cityName,
			'Limit'    => 1000,
			'Page'     => 1,
		]);
		if (!empty($request) && !empty($request['data']) && !empty($request['data'][0]['Addresses']))
		{
			$cities = [];
			foreach ($request['data'][0]['Addresses'] as $city)
			{
				if ((int) $city['Warehouses'] === 0)
				{
					continue;
				}
				$cities[] = [
					'name'          => $city['Present'],
					'ref'           => $city['Ref'],
					'delivery_city' => $city['DeliveryCity'],
				];

			}

			return $cities;
		}

		return false;
	}

	public static function getPostcodeByRef($ref)
	{
		if (empty($ref))
		{
			return false;
		}
		$request = self::request('Address', 'getSettlements', [
			'Ref'   => $ref,
			'Limit' => 1,
			'Page'  => 1,
		]);
		if (!empty($request) && !empty($request['data'][0]['Index1']))
		{
			return $request['data'][0]['Index1'];
		}

		return false;
	}

	public static function getCity($postcode = null)
	{
		if (empty($postcode))
		{
			return false;
		}

		/** @var \Joomla\Session\SessionInterface $session */
		$session            = Factory::getApplication()->getSession();
		$nevigen_novaposhta = $session->get('nevigen_novaposhta', []);
		if (empty($nevigen_novaposhta) || empty($nevigen_novaposhta[$postcode]))
		{
			$request = self::request('Address', 'searchSettlements', [
				'CityName' => $postcode,
				'Limit'    => 1,
				'Page'     => 1,
			]);
			if (!empty($request) && !empty($request['data']) && !empty($request['data'][0]['Addresses'][0]))
			{
				$data = [
					'name'          => $request['data'][0]['Addresses'][0]['Present'],
					'warehouses'    => $request['data'][0]['Addresses'][0]['Warehouses'],
					'ref'           => $request['data'][0]['Addresses'][0]['Ref'],
					'delivery_city' => $request['data'][0]['Addresses'][0]['DeliveryCity'],
					'delivery'      => $request['data'][0]['Addresses'][0]['AddressDeliveryAllowed'],
					'street'        => $request['data'][0]['Addresses'][0]['StreetsAvailability'],
				];

				$nevigen_novaposhta[$postcode] = $data;
				$session->set('nevigen_novaposhta', $nevigen_novaposhta);
				unset($nevigen_novaposhta, $request, $session);


				return $data;
			}
		}
		else
		{
			return $nevigen_novaposhta[$postcode];
		}

		return false;
	}

	public static function getWarehouses($postcode = null, $refData = false, $removeOldData = false)
	{
		return self::getWarehousesData('warehouses', $postcode, $refData, $removeOldData);
	}

	public static function getPostomat($postcode = null, $refData = false, $removeOldData = false)
	{
		return self::getWarehousesData('postomat', $postcode, $refData, $removeOldData);
	}

	protected static function getWarehousesData($type = null, $postcode = null, $refData = false, $removeOldData = false)
	{
		if (empty($postcode) || ($type != 'warehouses' && $type != 'postomat'))
		{
			return false;
		}

		$city          = self::getCity($postcode);
		$limit         = 1000;
		$getNewData    = true;
		$warehousesAll = [];
		$postomatAll   = [];


		if (!empty($city))
		{
			if ($city['warehouses'])
			{
				$cache = JPATH_CACHE . '/nevigen_novaposhta';
				if (!is_dir($cache))
				{
					Folder::create($cache);
				}

				$file = $cache . '/' . $city['delivery_city'] . '.json';
				if (is_file($file))
				{
					$clearTime = Factory::getDate('-1 day')->toUnix();
					$fileTime  = stat($file)['mtime'];

					if ($removeOldData === true || $clearTime >= $fileTime)
					{
						File::delete($file);
					}
					else
					{
						$getNewData = false;
					}

				}


				if ($getNewData)
				{
					$request = self::request('Address', 'getWarehouses', [
						'CityRef' => $city['delivery_city'],
						'Limit'   => $limit,
						'Page'    => 1,
					]);


					if (!empty($request['data']))
					{
						$cart = self::getCartData();
						if ((float) $cart['weight'] == 0
							&& (int) NevigenNovaposhtaHelper::config('enabled_cost_order', 1) === 0)
						{
							$cart['weight'] = 1;
						}
						$data  = $request['data'];
						$total = (isset($request['info']['totalCount'])) ? (int) $request['info']['totalCount'] : 0;

						for ($p = 2; $limit < $total; $p++)
						{
							$request = self::request('Address', 'getWarehouses', [
								'CityRef' => $city['delivery_city'],
								'Limit'   => $limit,
								'Page'    => $p,
							]);
							if (!empty($request['data']))
							{
								$data  = array_merge($request['data'], $data);
								$total -= $limit;
							}
							else
							{
								$total = 0;
							}
						}
						$allCount = count($data);
						foreach ($data as $warehouse)
						{
							$warehouseLimit = $warehouse['ReceivingLimitationsOnDimensions'];
							$item           = [
								'label'                => $warehouse['Description'],
								'value'                => $warehouse['Description'],
								'weight'               => $warehouse['TotalMaxWeightAllowed'],
								'receivingLimitations' => $warehouseLimit,
							];

							if (empty($warehouse['PostMachineType']))
							{
								$warehousesAll[] = $item;
							}
							else
							{
								$postomatAll[] = $item;
							}

							if ((float) $warehouse['TotalMaxWeightAllowed'] > 0
								&& (float) $warehouse['TotalMaxWeightAllowed'] < $cart['weight'])
							{
								continue;
							}

							if ((isset($cart['width']) && (float) $warehouseLimit['Width'] < $cart['width'])
								|| (isset($cart['height']) && (float) $warehouseLimit['Height'] < $cart['height'])
								|| (isset($cart['length']) && (float) $warehouseLimit['Length'] < $cart['length']))
							{
								continue;
							}


						}

						$warehouseData['warehouses'] = $warehousesAll;
						$warehouseData['postomat']   = $postomatAll;
						if (!empty($warehouseData) && $allCount >= 1000)
						{
							file_put_contents($file, (new Registry($warehouseData))->toString('json'));
						}

					}

					if (!isset($warehouseData[$type]))
					{
						$warehouseData[$type] = [];
					}


					return $warehouseData[$type];
				}
				else
				{
					if ($fileData = (new Registry(@file_get_contents($file)))->toArray())
					{
						$cart   = self::getCartData();
						$data   = (isset($fileData[$type])) ? $fileData[$type] : [];
						$result = [];
						foreach ($data as $item)
						{
							if ((float) $item['weight'] > 0
								&& (float) $item['weight'] < $cart['weight'])
							{
								continue;
							}
							$warehouseLimit = $item['receivingLimitations'];
							if ((isset($cart['width']) && (float) $warehouseLimit['Width'] < $cart['width'])
								|| (isset($cart['height']) && (float) $warehouseLimit['Height'] < $cart['height'])
								|| (isset($cart['length']) && (float) $warehouseLimit['Length'] < $cart['length']))
							{
								continue;
							}
							$result[] = $item;
						}

						unset($fileData);


						return $result;
					}
				}
			}
		}

		return false;
	}

	public static function getStreets($postcode = null, $word = null)
	{

		if (empty($postcode) || empty($word))
		{
			return false;
		}

		$city = self::getCity($postcode);
		if ($city)
		{
			$limit   = 3000;
			$request = self::request('Address', 'searchSettlementStreets', [
				'StreetName'    => $word,
				'SettlementRef' => $city['ref'],
				'Limit'         => $limit,
				'Page'          => 1,
			]);

			if (!empty($request['data'][0]) && !empty($request['data'][0]['Addresses']))
			{
				$streets = [];
				foreach ($request['data'][0]['Addresses'] as $datum)
				{
					$streets[] = [
						'name' => $datum['Present']
					];
				}


				return $streets;
			}
		}

		return false;
	}

	protected static function getCartData()
	{
		$data = [];
		/** @var CartModel $cart */
		$cart = JSFactory::getModel('cart', 'Site');
		$cart->load();
		if (empty($cart->products))
		{
			return false;
		}
		$data['weight'] = $cart->getWeightProducts();
		$data['total']  = self::convertApiPrice(floor($cart->getSum()),'to');
		$units          = self::config('units', 'kg');
		if ($units === 'g')
		{
			$data['weight'] = (float) $data['weight'] / 1000;
		}


		$length = self::config('length');
		$width  = self::config('width');
		$height = self::config('height');

		if (empty($length) && empty($width) && empty($height))
		{
			return false;
		}


		self::setDimensions($cart->products, $data);


		return $data;
	}

	protected static function request($modelName = null, $calledMethod = null, $methodProperties = null)
	{
		if (empty($modelName) || empty($calledMethod) || empty($methodProperties)) return false;

		$apiKey = trim(self::config('apikey', ''));
		if (empty($apiKey))
		{
			return false;
		}
		// Send request
		$http = new Http();
		$http->setOption('transport.curl', [
			CURLOPT_SSL_VERIFYHOST => 0,
			CURLOPT_SSL_VERIFYPEER => 0
		]);
		$headers = [
			'Content-Type' => 'application/json'
		];

		$request = [
			'apiKey'           => $apiKey,
			'modelName'        => $modelName,
			'calledMethod'     => $calledMethod,
			'methodProperties' => $methodProperties,
		];
		$data    = json_encode($request);

		try
		{
			$response = $http->post(self::$api, $data, $headers);

			$return = (new Registry($response->body))->toArray();

			$app = Factory::getApplication();
			if (!empty($return['errors']))
			{
				foreach ($return['errors'] as $error)
				{
					$app->enqueueMessage('NovaPoshta: ' . $error, 'error');
				}
			}

			return $return;
		}
		catch (\Exception $e)
		{
			return false;
		}

	}

	public static function config($name, $default = null)
	{
		if (self::$_config === null)
		{
			$bootstrap = JPATH_SITE . '/components/com_jshopping/bootstrap.php';
			if (!is_file($bootstrap)) return false;

			if (!class_exists('JSFactory'))
			{
				require_once($bootstrap);
			}
			$addon = JSFactory::getTable('addon', 'jshop');
			$addon->loadAlias('nevigen_novaposhta');
			self::$_config = $addon->getParams();
		}

		if (!empty(self::$_config) && isset(self::$_config[$name]))
		{
			return self::$_config[$name];
		}

		return $default;
	}

	public static function clearPhoneNumber($phone = null)
	{
		if (empty($phone)) return '';

		// Load language
		Factory::getApplication()->getLanguage()->load('addon_nevigen_novaposhta', JPATH_SITE);

		$phone = preg_replace('![^0-9]+!', '', $phone);
		$first = mb_substr($phone, 0, 1, 'UTF-8');
		if ($first !== '+')
		{
			$first = (int) $first;
			if ($first === 0)
			{
				$phone = '+38' . $phone;
			}
			elseif ($first === 8)
			{
				$phone = '+3' . $phone;
			}
			elseif ($first === 3)
			{
				$phone = '+' . $phone;
			}
		}

		if (strlen($phone) !== 13)
		{
			return ['message' => Text::sprintf('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_VALID_PHONE', $phone)];
		}


		return $phone;
	}

	public static function setDimensions($products, &$data)
	{
		if (empty($products))
		{
			return false;
		}

		$lengthId = self::config('length');
		$widthId  = self::config('width');
		$heightId = self::config('height');

		if (empty($lengthId) && empty($widthId) && empty($heightId))
		{
			return false;
		}

		$db     = Factory::getContainer()->get(DatabaseDriver::class);
		$lang   = JSFactory::getLang();
		$fields = [];
		$map    = [];

		if ($lengthId)
		{
			$fields[]       = 'extra_field_' . $lengthId;
			$map[$lengthId] = 'length';
		}
		if ($widthId)
		{
			$fields[]      = 'extra_field_' . $widthId;
			$map[$widthId] = 'width';
		}
		if ($heightId)
		{
			$fields[]       = 'extra_field_' . $heightId;
			$map[$heightId] = 'height';
		}

		$productIds = ArrayHelper::getColumn($products, 'product_id');
		$quantities = ArrayHelper::getColumn($products, 'quantity', 'product_id');

		$query = $db->getQuery(true)
			->select(array_merge(['product_id'], $fields))
			->from('#__jshopping_products_to_extra_fields')
			->whereIn('product_id', $productIds);

		$rows = $db->setQuery($query)->loadAssocList();

		if (!$rows)
		{
			return false;
		}

		$fieldIds      = array_keys($map);
		$fieldValueIds = [];

		foreach ($rows as $row)
		{
			foreach ($fieldIds as $id)
			{
				$key = 'extra_field_' . $id;
				if (!empty($row[$key]))
				{
					$fieldValueIds[] = $row[$key];
				}
			}
		}
		$fieldValueIds = array_unique($fieldValueIds);

		$query = $db->getQuery(true)
			->select(['id', 'field_id', $db->quoteName($lang->get('name'), 'value')])
			->from('#__jshopping_products_extra_field_values')
			->whereIn('field_id', $fieldIds)
			->whereIn('id', $fieldValueIds);

		$values = $db->setQuery($query)->loadAssocList();

		$valueMap = [];
		foreach ($values as $val)
		{
			$valueMap[$val['id']] = (float) str_replace(',', '.', $val['value']);
		}

		$volumeList = [];

		foreach ($rows as $row)
		{
			$productId = $row['product_id'];
			$volume    = [
				'length' => 1,
				'width'  => 1,
				'height' => 1,
			];
			foreach ($map as $fieldId => $key)
			{
				$fieldKey = 'extra_field_' . $fieldId;
				if (!empty($row[$fieldKey]) && isset($valueMap[$row[$fieldKey]]))
				{
					$volume[$key] = $valueMap[$row[$fieldKey]];
				}
			}
			rsort($volume); // [max, middle, min]
			if (!empty($quantities[$productId]) && $quantities[$productId] > 1)
			{
				$volume[2] *= $quantities[$productId];
			}

			$volumeList[] = $volume;
		}

		$sizeA = [];
		$sizeB = [];
		$sizeC = [];

		foreach ($volumeList as $v)
		{
			$sizeA[] = $v[0];
			$sizeB[] = $v[1];
			$sizeC[] = $v[2];
		}

		if (empty($sizeA) || empty($sizeB) || empty($sizeC))
		{
			return false;
		}

		$data['length'] = max(5, max($sizeA));
		$data['width']  = max(5, max($sizeB));
		$data['height'] = max(5, array_sum($sizeC));

		return true;
	}

	/**
	 * Convert price between store currencies for API purposes
	 *
	 * @param   float|null  $price      Amount to convert
	 * @param   string      $direction  'to' = from current to UAH; 'from' = from UAH to main currency
	 *
	 * @return float|int
	 *
	 * @since 1.3.6
	 */
	public static function convertApiPrice(?float $price = 0, string $direction = 'to', $orderCurrencyExchange = null)
	{
		if ($price <= 0)
		{
			return 0;
		}

		$jshopConfig  = JSFactory::getConfig();
		$siteCurrency = $jshopConfig->cur_currency;

		if ($direction === 'to')
		{
			if ($siteCurrency != self::config('currency'))
			{
				// From current cart currency to UAH
				$fromValue = (float) $jshopConfig->currency_value;
				if (!empty($orderCurrencyExchange))
				{
					$fromValue = (float) $orderCurrencyExchange;
				}

				if ($fromValue > 0)
				{
					$price = $price / $fromValue;
				}
				$uahCurrencyId = (int) self::config('currency');
				$currency      = JSFactory::getTable('currency');
				if ($currency->load($uahCurrencyId))
				{
					$uahValue = (float) $currency->currency_value;


					if ($uahValue > 0)
					{
						$price = $price * $uahValue;
					}
				}
			}
			else
			{
				return (float) $price;
			}

		}
		elseif ($direction === 'from')
		{
			// From UAH to main store currency
			$uahCurrencyId = (int) self::config('currency');
			$currency      = JSFactory::getTable('currency');

			if ($siteCurrency != $uahCurrencyId)
			{
				if ($currency->load($uahCurrencyId))
				{
					$uahValue = (float) $currency->currency_value;

					if ($uahValue > 0)
					{
						$price = $price / $uahValue;
					}
				}
			}

		}

		return $price;
	}
}