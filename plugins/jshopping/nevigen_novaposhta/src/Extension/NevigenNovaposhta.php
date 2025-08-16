<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\JShopping\NevigenNovaposhta\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Session\Session;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\CartModel;
use Joomla\Event\Event;
use Joomla\Event\SubscriberInterface;
use Joomla\Plugin\JShopping\NevigenNovaposhta\Helper\NevigenNovaposhtaHelper;

class NevigenNovaposhta extends CMSPlugin implements SubscriberInterface
{
	/**
	 * Load the language file on instantiation.
	 *
	 * @var    bool
	 *
	 * @since  1.0.0
	 */
	protected $autoloadLanguage = true;

	/**
	 * Load data.
	 *
	 * @var  bool
	 *
	 * @since  1.0.0
	 */
	protected ?bool $loadData = null;

	/**
	 * Method aliases.
	 *
	 * @var array
	 *
	 * @since 1.0.0
	 */
	protected array $methods = [
		'NevigenNovaposhtaPickupShippingForm',
		'NevigenNovaposhtaPostomatShippingForm',
		'NevigenNovaposhtaCourierShippingForm'
	];


	/**
	 * Returns an array of events this subscriber will listen to.
	 *
	 * @return  array
	 *
	 * @since   1.3.3
	 */
	public static function getSubscribedEvents(): array
	{
		return [
			'onLoadCheckoutStep4'                       => 'onLoadCheckoutStep4',
			'onAfterSaveCheckoutStep4'                  => 'onAfterSaveCheckoutStep4',
			'onBeforeDisplayCheckoutStep5View'          => 'onBeforeDisplayCheckoutStep5View',
			'onBeforeCreateOrder'                       => 'onBeforeCreateOrder',
			'onAfterNevigenOneStepCheckoutSaveFormData' => 'onAfterNevigenOneStepCheckoutSaveFormData'
		];
	}

	/**
	 * Listener for the `onLoadCheckoutStep4` event.
	 *
	 * @throws  \Exception
	 *
	 * @since  1.3.3
	 */
	public function onLoadCheckoutStep4()
	{
		if ($this->loadData === null)
		{
			$app = $this->getApplication();
			// Load asses
			/** @var \Joomla\CMS\WebAsset\WebAssetRegistry $assetsRegistry */
			$assetsRegistry = $app->getDocument()->getWebAssetManager()->getRegistry();
			$assetsRegistry->addExtensionRegistryFile('plg_jshopping_nevigen_novaposhta');

			/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
			$assets = $app->getDocument()->getWebAssetManager();
			$assets->usePreset('nevigen_novaposhta.main');

			// Load language
			$app->getLanguage()->load('addon_nevigen_novaposhta', JPATH_SITE);

			Text::script('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_FORM');
			Text::script('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_POSTCODE');
			Text::script('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_RESULTS');
			Text::script('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_WAREHOUSE');
			Text::script('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_POSTOMAT');
			Text::script('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_CITY');
			Text::script('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_ADDRESS');

			//Set options
			$app->getDocument()->addScriptOptions(
				'nevigen_novaposhta',
				[
					'controller' => Helper::SEFLink('index.php?option=com_jshopping', false),
					'csrf'       => Session::getFormToken(),
				]
			);

			$this->loadData = true;
		}
	}

	/**
	 * Listener for the `onAfterSaveCheckoutStep4` event.
	 *
	 * @throws  \Exception
	 *
	 * @since  1.3.3
	 */
	public function onAfterSaveCheckoutStep4(Event $event)
	{
		$adv_user  = $event->getArgument(0);
		$sh_method = $event->getArgument(1);
		$cart      = $event->getArgument(3);
		if (empty($sh_method) || empty($adv_user) || empty($cart))
		{
			return;
		}

		if (in_array($sh_method->alias, $this->methods))
		{
			if ($cart->getShippingParams() === null)
			{
				$zip  = (!empty($adv_user->d_zip)) ? $adv_user->d_zip : $adv_user->zip;
				$data = [
					'nevigen_novaposhta_postcode'  => $zip,
					'nevigen_novaposhta_street'    => $adv_user->d_street,
					'nevigen_novaposhta_house'     => $adv_user->d_home,
					'nevigen_novaposhta_apartment' => $adv_user->d_apartment,
				];

				if (!empty($zip) && (int) NevigenNovaposhtaHelper::config('type_search', 0) === 1)
				{
					$city = NevigenNovaposhtaHelper::getCity($zip);
					if (!empty($city))
					{
						$data['nevigen_novaposhta_city'] = $city['name'];
					}
				}

				$cart->setShippingParams($data);


			}

			if ((int) NevigenNovaposhtaHelper::config('enabled_cost_order', 1) !== 1)
			{
				$cart->setShippingPrice(0);
			}

			$event->setArgument(3, $cart);
		}
	}

	/**
	 * Listener for the `onBeforeDisplayCheckoutStep5View` event.
	 *
	 * @throws  \Exception
	 *
	 * @since  1.3.3
	 */
	public function onBeforeDisplayCheckoutStep5View(Event $event)
	{
		$view = $event->getArgument(0);
		if (empty($view))
		{
			return;
		}

		if (empty($view->sh_method))
		{
			return;
		}

		if (in_array($view->sh_method->alias, $this->methods))
		{
			$view->count_filed_delivery = 1;
			/** @var CartModel $cart */
			$cart = JSFactory::getModel('cart', 'Site');
			$data = $cart->getShippingParams();
			if (empty($data))
			{
				return;
			}

			$city = NevigenNovaposhtaHelper::getCity($data['nevigen_novaposhta_postcode']);
			if (empty($city))
			{
				return;
			}

			$delivery_info = $view->delivery_info;
			$newData       = [
				'f_name'     => (isset($delivery_info['f_name'])) ? $delivery_info['f_name'] : '',
				'l_name'     => (isset($delivery_info['l_name'])) ? $delivery_info['l_name'] : '',
				'firma_name' => (isset($delivery_info['firma_name'])) ? $delivery_info['firma_name'] : '',
				'city'       => $city['name']
			];
			if (!empty($data['nevigen_novaposhta_warehouse']))
			{
				$newData['street'] = $data['nevigen_novaposhta_warehouse'];
			}
			if (!empty($data['nevigen_novaposhta_postomat']))
			{
				$newData['street'] = $data['nevigen_novaposhta_postomat'];
			}
			if (!empty($data['nevigen_novaposhta_street']))
			{
				$newData['street'] = $data['nevigen_novaposhta_street'];
			}
			if (!empty($data['nevigen_novaposhta_house']))
			{
				$newData['home'] = $data['nevigen_novaposhta_house'];
			}
			if (!empty($data['nevigen_novaposhta_apartment']))
			{
				$newData['apartment'] = $data['nevigen_novaposhta_apartment'];
			}

			$view->delivery_info = $newData;

			$event->setArgument(0, $view);

		}
	}

	/**
	 * Listener for the `onBeforeCreateOrder` event.
	 *
	 * @throws  \Exception
	 *
	 * @since  1.3.3
	 */
	public function onBeforeCreateOrder(Event $event)
	{
		$order = $event->getArgument(0);
		if (empty($order))
		{
			return;
		}
		$cart = $event->getArgument(1);
		if (empty($cart))
		{
			return;
		}
		$id        = $cart->getShippingId();
		$sh_method = JSFactory::getTable('shippingMethod');
		$sh_method->load($id);
		if (!empty($sh_method) && in_array($sh_method->alias, $this->methods))
		{
			$data = $cart->getShippingParams();
			if (empty($data))
			{
				return;
			}


			$city = NevigenNovaposhtaHelper::getCity($data['nevigen_novaposhta_postcode']);
			if (empty($city))
			{
				return;
			}
			$order->d_city = $city['name'];
			if (!empty($data['nevigen_novaposhta_postcode']))
			{
				$order->d_zip = $data['nevigen_novaposhta_postcode'];
			}
			if (!empty($data['nevigen_novaposhta_warehouse']))
			{
				$order->d_street = $data['nevigen_novaposhta_warehouse'];
			}
			elseif (!empty($data['nevigen_novaposhta_postomat']))
			{
				$order->d_street = $data['nevigen_novaposhta_postomat'];
			}
			if (!empty($data['nevigen_novaposhta_street']))
			{
				$order->d_street = $data['nevigen_novaposhta_street'];
			}
			if (!empty($data['nevigen_novaposhta_house']))
			{
				$order->d_home = $data['nevigen_novaposhta_house'];
			}
			if (!empty($data['nevigen_novaposhta_apartment']))
			{
				$order->d_apartment = $data['nevigen_novaposhta_apartment'];
			}

			$event->setArgument(0, $order);
		}

	}

	/**
	 * Listener for the `onAfterNevigenOneStepCheckoutSaveFormData` event.
	 *
	 * @throws  \Exception
	 *
	 * @since  1.3.3
	 */
	public function onAfterNevigenOneStepCheckoutSaveFormData(Event $event)
	{
		$type     = $event->getArgument(0);
		$data     = $event->getArgument(1);
		$adv_user = $event->getArgument(2);

		if (empty($type) || empty($data) || empty($adv_user))
		{
			return;
		}

		$app    = $this->getApplication();
		$method = $app->input->getString('method', '');
		if (!empty($method) && $method === 'nevigen_novaposhta' && $type === 'address')
		{
			$key   = array_key_first($data);
			$value = $data[$key];

			if (!empty($value) && $key === 'd_city')
			{
				foreach (['d_street', 'd_home', 'd_apartment'] as $field)
				{
					$adv_user->$field = '';
				}

				$adv_user->store();
			}
		}
	}
}
