<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\Jshopping\Site\Controller;

\defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Form\FormFactoryInterface;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\Response\JsonResponse;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Session\Session;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Jshopping\Site\Helper\Error as JSError;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Component\Jshopping\Site\Helper\Metadata;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\CartModel;
use Joomla\Component\Jshopping\Site\Model\UserregisterModel;
use Joomla\Database\DatabaseDriver;
use Joomla\Plugin\System\NevigenJshopBonuses\Extension\NevigenJshopBonuses;

include_once(JPATH_COMPONENT_SITE . '/payments/payment.php');
include_once(JPATH_COMPONENT_SITE . '/shippingform/shippingform.php');

class NevigenonestepcheckoutController extends BaseController
{
	protected $addonParams = null;
	protected $jshopConfig = null;
	protected $assetsLoad = null;
	protected $checkView = null;
	protected $listCountry = null;
	protected $customer_register = false;
	protected $fields_reload = null;

	public function __construct($config = array(), MVCFactoryInterface $factory = null, $app = null, $input = null)
	{
		parent::__construct($config, $factory, $app, $input);

		if ($this->addonParams === null)
		{
			$addon = \JSFactory::getTable('addon', 'jshop');
			$addon->loadAlias('nevigen_onestepcheckout');
			$params = $addon->getParams();

			$this->addonParams = $params;
		}

		if ((int) $this->addonParams['enabled'] === 0)
		{
			$url = 'index.php?option=com_jshopping&controller=checkout';
			$url = Route::link('site', $url, false, $this->jshopConfig->use_ssl);

			$this->redirect = $url;
			$this->redirect();
		}


		if ($this->jshopConfig === null)
		{
			$this->jshopConfig = \JSFactory::getConfig();
		}

		if ((int) $this->addonParams['enabled'] === 1 && $this->checkView === null)
		{
			// Set menu
			$menu        = $this->app->getMenu()->getActive();
			$menuCurrent = ($menu
				&& isset($menu->query['option'], $menu->query['view'])
				&& $menu->query['option'] === 'com_jshopping'
				&& $menu->query['view'] === 'nevigenonestepcheckout');
			if ($menu && !$menuCurrent)
			{
				$url = 'index.php?option=com_jshopping&controller=nevigenonestepcheckout&view=nevigenonestepcheckout';
				$url = Helper::SEFLink($url, 1, 1, $this->jshopConfig->use_ssl);
				if (empty(strpos($url, 'nevigenonestepcheckout')))
				{
					$this->redirect = $url;
					$this->redirect();
				}
				else
				{
					Metadata::checkoutPreview();
				}
			}

			$this->checkView = true;
		}

		if ($this->fields_reload === null)
		{
			$this->fields_reload = ['country', 'd_country', 'delivery_adress'];

			if (!empty($this->addonParams['fields_reload']))
			{
				$this->fields_reload = explode(',',
					preg_replace('/\s+/', '', $this->addonParams['fields_reload']));
			}
		}

		if ($this->assetsLoad === null && (int) $this->addonParams['enabled'] === 1)
		{
			// Load asses
			/** @var \Joomla\CMS\WebAsset\WebAssetRegistry $assetsRegistry */
			$assetsRegistry = $this->app->getDocument()->getWebAssetManager()->getRegistry();
			$assetsRegistry->addExtensionRegistryFile('plg_system_nevigen_jshop_onestepcheckout');

			/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
			$assets = $this->app->getDocument()->getWebAssetManager();
			$assets->useScript('nevigen_onestepcheckout.main');
			if (isset($this->addonParams['enabled_css']) && (int) $this->addonParams['enabled_css'] === 1)
			{
				$assets->useStyle('nevigen_onestepcheckout.main');
			}

			$controller = 'index.php?option=com_jshopping&controller=nevigenonestepcheckout&view=nevigenonestepcheckout';
			$controller = Helper::SEFLink($controller, 1, 1, $this->jshopConfig->use_ssl);
			$options    = [
				'controller' => $controller,
				'csrf'       => Session::getFormToken(),
				'user'       => $this->app->getIdentity()->id,
				'use_mask'   => $this->addonParams['use_mask'],
				'mask'       => $this->addonParams['use_mask_input'],
			];

			$this->app->getDocument()->addScriptOptions('nevigen_onestepcheckout', $options);

			$this->assetsLoad = true;

		}

	}

	public function display($cachable = false, $urlparams = false)
	{
		if (!$this->jshopConfig->shop_user_guest){
			Helper::checkUserLogin();
		}

		$cart = JSFactory::getModel('cart', 'Site');
		$cart->load();

		if ($cart->getCountProduct() == 0){
			$this->app->redirect(Helper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view',1,1));
			exit();
		}

		if ($this->jshopConfig->min_price_order && ($cart->getPriceProducts() < ($this->jshopConfig->min_price_order * $this->jshopConfig->currency_value) )){
			JSError::raiseNotice("", sprintf(Text::_('JSHOP_ERROR_MIN_SUM_ORDER'), Helper::formatprice($this->jshopConfig->min_price_order * $this->jshopConfig->currency_value)));
		}

		if ($this->jshopConfig->max_price_order && ($cart->getPriceProducts() > ($this->jshopConfig->max_price_order * $this->jshopConfig->currency_value) )){
			JSError::raiseNotice("", sprintf(Text::_('JSHOP_ERROR_MAX_SUM_ORDER'), Helper::formatprice($this->jshopConfig->max_price_order * $this->jshopConfig->currency_value)));
		}

		$adv_user        = \JSFactory::getUser();
		$shop_user_guest = (int) $this->jshopConfig->shop_user_guest;

		PluginHelper::importPlugin('jshoppingcheckout');

		$this->app->triggerEvent('onLoadCheckoutStep2');

		if ($shop_user_guest === 0)
		{
			\JSFactory::getModel('userlogin', 'Site')->setPayWithoutReg();
			Helper::checkUserLogin();
		}
		elseif ($shop_user_guest === 1 && empty($this->app->getSession()->get('show_pay_without_reg')))
		{
			\JSFactory::getModel('userlogin', 'Site')->setPayWithoutReg();
			Helper::checkUserLogin();
		}

		$path = JPATH_ROOT . '/components/com_jshopping/templates/addons/nevigen_onestepcheckout/' . $this->addonParams['template'];


		//initialize view
		$view = $this->getView('nevigenonestepcheckout', Helper::getDocumentType(), '',
			['template_path' => $path]);
		$view->setLayout('main');
		$cart->getSum();


		if (!$adv_user->country)
		{
			$adv_user->country = $this->jshopConfig->default_country;
		}
		if (!$adv_user->d_country)
		{
			$adv_user->d_country = $this->jshopConfig->default_country;
		}

		if ($adv_user)
		{
			$adv_user->birthday   = Helper::getDisplayDate($adv_user->birthday, $this->jshopConfig->field_birthday_format);
			$adv_user->d_birthday = Helper::getDisplayDate($adv_user->d_birthday, $this->jshopConfig->field_birthday_format);
		}

		Helper::filterHTMLSafe($adv_user, ENT_QUOTES);

		$form = $this->getFormAddress($adv_user);

		$this->app->triggerEvent('onAfterNevigenOneStepCheckoutGetFormAddress', [&$form]);

		$action = 'index.php?option=com_jshopping&controller=nevigenonestepcheckout&view=nevigenonestepcheckout&task=save';
		$action = Helper::SEFLink($action, 1, 0, $this->jshopConfig->use_ssl);

		$view->set('action', $action);
		$view->set('live_path', Uri::getInstance()->toString(['scheme', 'host', 'port']));
		$view->set('user', $adv_user);
		$view->set('customer_register', $this->customer_register);
		$view->set('show_login', ((int) $this->addonParams['show_login'] === 1));
		$view->set('form_address', $form);
		$view->set('jshopConfig', $this->jshopConfig);

		$this->app->triggerEvent('onBeforeDisplayCheckoutStep2View', [&$view]);

		if ((int) $this->jshopConfig->step_4_3 === 1)
		{
			//delivery method
			$this->checkoutStep4($cart, $view, $adv_user);
			//payments
			$this->checkoutStep3($cart, $view, $adv_user);
		}
		else
		{
			//payments
			$this->checkoutStep3($cart, $view, $adv_user);
			//delivery method
			$this->checkoutStep4($cart, $view, $adv_user);
		}

		$delivery = $this->getDeliveryTimeDate($cart);

		$this->setDataSmallCart($view);

		//preview finish
		$this->app->triggerEvent('onLoadCheckoutStep5');

		$sh_method     = null;
		$pm_method     = null;
		$delivery_info = null;

		$no_return = 0;
		if ($this->jshopConfig->return_policy_for_product)
		{
			$cart_products = array();
			foreach ($cart->products as $products)
			{
				$cart_products[] = $products['product_id'];
			}
			$cart_products   = array_unique($cart_products);
			$_product_option = \JSFactory::getTable('productOption', 'jshop');
			$list_no_return  = $_product_option->getProductOptionList($cart_products, 'no_return');
			$no_return       = intval(in_array('1', $list_no_return));
		}
		if ($this->jshopConfig->no_return_all)
		{
			$no_return = 1;
		}

		$this->app->triggerEvent('onBeforeDisplayCheckoutStep5', array(&$sh_method, &$pm_method, &$delivery_info, &$cart, &$view));

		$view->set('no_return', $no_return);
		$view->set('delivery_time', $delivery['delivery_time']);
		$view->set('delivery_date', $delivery['delivery_date']);


		$this->app->triggerEvent('onBeforeDisplayCheckoutStep5View', [&$view]);

		$view->display();
	}

	public function saveFormData()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}
		$type = $this->app->input->getString('type', '');
		$data = $this->app->input->get('saveformdata', [], 'array');

		if (!empty($type) && !empty($data))
		{
			$adv_user = \JSFactory::getUser();
			$cart     = \JSFactory::getModel('cart', 'jshop');
			$cart->load();
			$user = $this->app->getIdentity();
			$this->app->triggerEvent('onBeforeNevigenOneStepCheckoutSaveFormData', [$type, $data, $adv_user, $cart]);
			if ($type === 'address')
			{
				$key   = array_key_first($data);
				$value = $data[$key];
				$this->app->triggerEvent('onLoadCheckoutStep2save');
				$adv_user->$key = $value;

				$result = '';
				if (!empty($this->fields_reload) && in_array($key, $this->fields_reload))
				{
					$result = ['reload' => true];
				}

				foreach ($this->jshopConfig->fields_client_only_check as $fieldJS)
				{
					if (isset($adv_user->$fieldJS))
					{
						unset($adv_user->$fieldJS);
					}
					else continue;
				}
				$errorMessage = '';
				$this->app->triggerEvent('onBeforeSaveCheckoutStep2', array(&$adv_user, &$user, &$cart));

				if (!$adv_user->store())
				{
					$result       = '';
					$errorMessage = Text::_('JSHOP_REGWARN_ERROR_DATABASE');
				}

				Helper::setNextUpdatePrices();

				$this->app->triggerEvent('onAfterSaveCheckoutStep2', [&$adv_user, &$user, &$cart]);

				$this->app->triggerEvent('onAfterNevigenOneStepCheckoutSaveFormData', [$type, $data, $adv_user, $cart]);

				return $this->setJSONResponse($result, $errorMessage, (!empty($errorMessage)));
			}
			elseif ($type === 'payment')
			{
				$params = (isset($data['params'])) ? $data['params'] : [];

				$this->setPayment($data, $cart, $data['payment_method'], $params, $adv_user, true);

				$this->app->triggerEvent('onAfterNevigenOneStepCheckoutSaveFormData', [$type, $data, $adv_user, $cart]);

				return $this->setJSONResponse();

			}
			elseif ($type === 'shipping')
			{
				$params          = (isset($data['params'])) ? $data['params'] : [];
				$sh_pr_method_id = $data['sh_pr_method_id'];
				if ($adv_user->delivery_adress)
				{
					$id_country = $adv_user->d_country;
				}
				else
				{
					$id_country = $adv_user->country;
				}
				if (!$id_country) $id_country = $this->jshopConfig->default_country;

				$this->setShipping($cart, $adv_user, $id_country, $sh_pr_method_id, $params, true);

				$this->app->triggerEvent('onAfterNevigenOneStepCheckoutSaveFormData', [$type, $data, $adv_user, $cart]);


				return $this->setJSONResponse();

			}


		}
		else
		{
			return $this->setJSONResponse('', 'Field not found', true);
		}


		return true;
	}

	public function saveMethodsParams()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}
		$data   = $this->app->input->getArray();
		$params = [];
		if (!empty($data) && !empty($data['type']) && !empty($data['params']))
		{
			/** @var CartModel $cart */
			$cart = $this->getCartAjax();
			$this->app->triggerEvent('onBeforeNevigenOneStepCheckoutSaveMethodsParams', [&$data, $cart]);
			if ($data['type'] === 'shipping')
			{
				$current = $cart->getShippingParams();
				$params  = array_shift($data['params']);
				if (!empty($current))
				{
					$params = array_merge($current, $params);
				}

				$cart->setShippingParams($params);
			}
			elseif ($data['type'] === 'payment')
			{
				$current = $cart->getPaymentParams();
				$params  = array_shift($data['params']);
				if (!empty($current))
				{
					$params = array_merge($current, $params);
				}

				$cart->setPaymentParams($params);
			}
			if (!isset($data['params']))
			{
				$data['params'] = [];
			}

			$this->app->triggerEvent('onAfterNevigenOneStepCheckoutSaveMethodsParams', [$data['type'], $params, $data['params'], $cart]);
		}

		return $this->setJSONResponse();
	}

	public function setNevigenBonusesCartPointsAjax()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}

		if (PluginHelper::isEnabled('system', 'nevigen_jshop_bonuses'))
		{
			$data = $this->app->input->getArray();
			if (isset($data['points_sub']))
			{
				$points_sub = ($data['points_sub'] != '') ? (float)$data['points_sub'] : 0;
				if ($points_sub <= 0)
				{
					$this->app->getSession()->set('jshop_points_sub', 0);

					return $this->setJSONResponse('');
				}

				$this->app->input->set('points_sub', $points_sub);
				/** @var NevigenJshopBonuses $plugin */
				$plugin = $this->app->bootPlugin('nevigen_jshop_bonuses', 'system');
				$plugin->setNevigenBonusesCartPoints();
			}
		}

		return $this->setJSONResponse($this->app->getSession()->get('jshop_points_sub'));
	}

	public function save()
	{
		$returnUrl = Helper::SEFLink('index.php?option=com_jshopping&controller=nevigenonestepcheckout',
			0, 1, $this->jshopConfig->use_ssl);
		if (!Session::checkToken())
		{
			$this->app->enqueueMessage(Text::_('JINVALID_TOKEN'), 'error');
			$this->app->redirect($returnUrl);

			return false;
		}

		$checkout = \JSFactory::getModel('checkout', 'jshop');
		$checkout->checkStep(2);

		$session           = $this->app->getSession();
		$customer_register = $this->app->input->getBool('customer_register', false);

		PluginHelper::importPlugin('jshoppingcheckout');

		$this->app->triggerEvent('onLoadCheckoutStep2save', array());

		/** @var CartModel $cart */
		$cart = \JSFactory::getModel('cart', 'jshop');
		$cart->load();


		$adv_user = \JSFactory::getUser();

		if (!$this->setAddress($cart, $adv_user))
		{

			$this->app->redirect($returnUrl);

			return false;
		}


		if ($this->jshopConfig->step_4_3)
		{
			$checkout->setMaxStep(4);
			//save shipping
			$this->saveShipping($checkout, $adv_user, $cart);
			//save paymentt
			$this->savePayment($checkout, $cart, $adv_user);
		}
		else
		{
			$checkout->setMaxStep(3);
			//save payment
			$this->savePayment($checkout, $cart, $adv_user);
			//save shipping
			$this->saveShipping($checkout, $adv_user, $cart);
		}

		//save agb
		$checkout->checkStep(5);
		$checkagb = $this->app->input->get('agb');

		$this->app->triggerEvent('onLoadStep5save', array(&$checkagb));

		if ($this->jshopConfig->check_php_agb && $checkagb != 'on')
		{
			$this->app->enqueueMessage(Text::_('JSHOP_ERROR_AGB'), 'error');
			$this->app->redirect($returnUrl);

			return false;
		}

		if (!$cart->checkListProductsQtyInStore())
		{
			$this->app->redirect($returnUrl);

			return false;
		}

		if (!$session->get('checkcoupon'))
		{
			if (!$cart->checkCoupon())
			{
				$cart->setRabatt(0, 0, 0);
				$this->app->enqueueMessage(Text::_('JSHOP_RABATT_NON_CORRECT'), 'warning');

				$this->app->redirect($returnUrl);

				return false;
			}

			$session->set('checkcoupon', 1);
		}

		$orderNumber = $this->jshopConfig->getNextOrderNumber();
		$this->jshopConfig->updateNextOrderNumber();

		$payment_method_id = $cart->getPaymentId();
		$pm_method         = \JSFactory::getTable('paymentMethod', 'jshop');
		$pm_method->load($payment_method_id);
		$payment_method = $pm_method->payment_class;


		if ($this->jshopConfig->without_payment)
		{
			$pm_method->payment_type = 1;
			$paymentSystemVerySimple = 1;
		}
		else
		{
			$paymentsysdata = $pm_method->getPaymentSystemData();
			$payment_system = $paymentsysdata->paymentSystem;
			if ($paymentsysdata->paymentSystemVerySimple)
			{
				$paymentSystemVerySimple = 1;
			}
			if ((isset($paymentsysdata->paymentSystemError) && $paymentsysdata->paymentSystemError) || $pm_method->payment_publish == 0)
			{
				$cart->setPaymentParams("");
				$this->app->enqueueMessage(Text::_('JSHOP_ERROR_PAYMENT'), 'error');
				$this->app->redirect($returnUrl);

				return false;
			}
		}

		$sh_params    = $cart->getShippingParams();
		$pm_params    = $cart->getPaymentParams();
		$order        = \JSFactory::getTable('order', 'jshop');
		$arr_property = $order->getListFieldCopyUserToOrder();
		foreach ($adv_user as $key => $value)
		{
			if (in_array($key, $arr_property))
			{
				$order->$key = $value;
			}
		}

		$sh_mt_pr = \JSFactory::getTable('shippingMethodPrice', 'jshop');
		$sh_mt_pr->load($cart->getShippingPrId());
		$order->order_date = $order->order_m_date = Helper::getJsDate();
		$order->order_tax  = $cart->getTax(1, 1, 1);
		$order->setTaxExt($cart->getTaxExt(1, 1, 1));
		$order->order_subtotal = $cart->getPriceProducts();
		$order->order_shipping = $cart->getShippingPrice();
		$order->order_payment  = $cart->getPaymentPrice();
		$order->order_discount = $cart->getDiscountShow();
		$order->shipping_tax   = $cart->getShippingPriceTaxPercent();
		$order->setShippingTaxExt($cart->getShippingTaxList());
		$order->payment_tax = $cart->getPaymentTaxPercent();
		$order->setPaymentTaxExt($cart->getPaymentTaxList());
		$order->order_package = $cart->getPackagePrice();
		$order->setPackageTaxExt($cart->getPackageTaxList());
		$order->order_total        = $cart->getSum(1, 1, 1);
		$order->currency_exchange  = $this->jshopConfig->currency_value;
		$order->vendor_type        = $cart->getVendorType();
		$order->vendor_id          = $cart->getVendorId();
		$order->order_status       = $this->jshopConfig->default_status_order;
		$order->shipping_method_id = $cart->getShippingId();
		$order->payment_method_id  = $cart->getPaymentId();
		$order->delivery_times_id  = $sh_mt_pr->delivery_times_id;
		if ($this->jshopConfig->delivery_order_depends_delivery_product)
		{
			$order->delivery_time = $cart->getDelivery();
		}
		if ($this->jshopConfig->show_delivery_date)
		{
			$order->delivery_date = $cart->getDeliveryDate();
		}
		$order->coupon_id = $cart->getCouponId();

		if (is_array($pm_params) && !$paymentSystemVerySimple)
		{
			$payment_system->setParams($pm_params);
			$payment_params_names  = $payment_system->getDisplayNameParams();
			$order->payment_params = Helper::getTextNameArrayValue($payment_params_names, $pm_params);
			$order->setPaymentParamsData($pm_params);
		}

		if (is_array($sh_params))
		{
			$sh_method = \JSFactory::getTable('shippingMethod', 'jshop');
			$sh_method->load($cart->getShippingId());
			$shippingForm = $sh_method->getShippingForm();
			if ($shippingForm)
			{
				$shipping_params_names  = $shippingForm->getDisplayNameParams();
				$order->shipping_params = Helper::getTextNameArrayValue($shipping_params_names, $sh_params);
			}
			$order->setShippingParamsData($sh_params);
		}

		if ($customer_register && (int) $adv_user->user_id <= 0)
		{
			if ((int) $this->jshopConfig->shop_user_guest === 3 && $order->email)
			{
				$userComponent = ComponentHelper::getParams('com_users');
				if ((int) $userComponent->get('allowUserRegistration', 0) === 1
					&& (int) $userComponent->get('sendpassword', 0) === 1)
				{
					$db      = Factory::getContainer()->get(DatabaseDriver::class);
					$query   = $db->getQuery(true)
						->select(['id'])
						->from($db->quoteName('#__users'))
						->where($db->quoteName('email') . ' = :email')
						->bind(':email', $order->email);
					$user_id = $db->setQuery($query, 0, 1)->loadResult();
					if (!empty($user_id))
					{
						$order->user_id = $user_id;
					}
					else
					{
						$data = [
							'email'    => $order->email,
							'username' => $order->email,
							'u_name'   => $order->email,
						];


						if (!empty($order->f_name))
						{
							$data['name'] = $order->f_name;
						}
						else
						{
							$data['name'] = $data['email'];
						}
						$fieldsSorting = $this->addonParams['fields_sorting'];

						foreach ($fieldsSorting as $key => $f)
						{
							if ($key === 'email') continue;
							if (!empty($order->$key))
							{
								$data[$key] = $order->$key;
							}
						}

						try
						{

							$result = $this->customerRegister($data);

							if (!empty($result))
							{
								$order->user_id = $result;
							}
						}
						catch (\Exception $e)
						{

						}

					}
				}
			}
		}
		$order->ip_address        = $_SERVER['REMOTE_ADDR'];
		$order->order_add_info    = $this->app->input->getString('order_add_info', '');
		$order->currency_code     = $this->jshopConfig->currency_code;
		$order->currency_code_iso = $this->jshopConfig->currency_code_iso;
		$order->order_number      = $order->formatOrderNumber($orderNumber);
		$order->order_hash        = md5(time() . $order->order_total . $order->user_id);
		$order->file_hash         = md5(time() . $order->order_total . $order->user_id . 'hashfile');
		$order->display_price     = $this->jshopConfig->display_price_front_current;
		$order->lang              = $this->jshopConfig->getLang();

		if ($order->client_type)
		{
			$order->client_type_name = $this->jshopConfig->user_field_client_type[$order->client_type];
		}
		else
		{
			$order->client_type_name = "";
		}

		if ($order->order_total == 0)
		{
			$pm_method->payment_type            = 1;
			$this->jshopConfig->without_payment = 1;
			$order->order_status                = $this->jshopConfig->payment_status_paid;
		}

		if ($pm_method->payment_type == 1)
		{
			$order->order_created = 1;
		}
		else
		{
			$order->order_created = 0;
		}

		if (!$adv_user->delivery_adress) $order->copyDeliveryData();

		$obj = $this;
		$this->app->triggerEvent('onBeforeCreateOrder', array(&$order, &$cart, &$obj));

		$order->store();

		$this->app->triggerEvent('onAfterCreateOrder', array(&$order, &$cart));

		if ($cart->getCouponId())
		{
			$coupon = \JSFactory::getTable('coupon', 'jshop');
			$coupon->load($cart->getCouponId());
			if ($coupon->finished_after_used)
			{
				$free_discount = $cart->getFreeDiscount();
				if ($free_discount > 0)
				{
					$coupon->coupon_value = $free_discount / $this->jshopConfig->currency_value;
				}
				else
				{
					$coupon->used = $adv_user->user_id;
				}
				$coupon->store();
			}
		}

		$order->saveOrderItem($cart->products);

		$this->app->triggerEvent('onAfterCreateOrderFull', array(&$order, &$cart));


		$session->set('jshop_end_order_id', $order->order_id);

		$order_history                    = \JSFactory::getTable('orderHistory', 'jshop');
		$order_history->order_id          = $order->order_id;
		$order_history->order_status_id   = $order->order_status;
		$order_history->status_date_added = $order->order_date;
		$order_history->customer_notify   = 1;
		$order_history->store();

		if ($pm_method->payment_type == 1)
		{
			if ($this->jshopConfig->order_stock_removed_only_paid_status)
			{
				$product_stock_removed = (in_array($order->order_status, $this->jshopConfig->payment_status_enable_download_sale_file));
			}
			else
			{
				$product_stock_removed = 1;
			}
			if ($product_stock_removed)
			{
				$order->changeProductQTYinStock("-");
			}
			if ($this->jshopConfig->send_order_email)
			{
				$checkout->sendOrderEmail($order->order_id);
			}
		}

		$this->app->triggerEvent('onEndCheckoutStep5', array(&$order, &$cart));

		$session->set('jshop_send_end_form', 0);

		if ($this->jshopConfig->without_payment)
		{
			$checkout->setMaxStep(10);
			$this->app->redirect(Helper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=finish',
				1, 1, $this->jshopConfig->use_ssl));

			return false;
		}

		$pmconfigs = $pm_method->getConfigs();

		$task = 'step6';
		if (!empty($pmconfigs) && isset($pmconfigs['windowtype']) && $pmconfigs['windowtype'] == 2)
		{
			$task = 'step6iframe';
			$session->set('jsps_iframe_width', $pmconfigs['iframe_width']);
			$session->set('jsps_iframe_height', $pmconfigs['iframe_height']);
		}

		$checkout->setMaxStep(6);

		$this->app->redirect(Helper::SEFLink('index.php?option=com_jshopping&controller=checkout&task=' . $task,
			1, 1, $this->jshopConfig->use_ssl));
	}

	public function cartChangeQuantityAjax()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}
		$product_id = $this->app->input->getInt('product_id', -1);
		$quantity   = $this->app->input->getFloat('quantity', 0);

		if ($product_id >= 0 && $quantity != 0)
		{
			$cart      = $this->getCartAjax();
			$quantitys = array(
				$product_id => $quantity,
			);

			try
			{
				$cart->refresh($quantitys);
				$product  = $cart->products[$product_id];
				$messages = $this->app->getMessageQueue();
				if (!empty($messages))
				{
					return $this->setJSONResponse('', $messages[0]['message'], true);
				}
				else
				{
					return $this->setJSONResponse([
						'price'  => Helper::formatprice($product['price']),
						'sum'  => Helper::formatprice($product['price'] * $product['quantity']),
						'cart' => Helper::formatprice($cart->price_product)
					]);
				}


			}
			catch (\Exception $e)
			{
				return $this->setJSONResponse('', $e->getMessage(), true);
			}
		}
	}

	public function cartRemoveProductAjax()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}
		$product_id = $this->app->input->getInt('product_id', -1);
		if ($product_id >= 0)
		{
			$cart = $this->getCartAjax();

			try
			{
				$cart->delete($product_id);
				$this->setJSONResponse(Helper::formatprice($cart->price_product));

			}
			catch (\Exception $e)
			{

				return $this->setJSONResponse('', $e->getMessage(), false);
			}

		}
	}

	public function loginAjax()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}

		$this->app->triggerEvent('onBeforeLoginSave');
		$data = $this->app->input->post->get('nevigenonestepcheckoutlogin', [], 'array');

		if (empty($data) || empty($data['login'] || empty($data['password'])))
		{
			return $this->setJSONResponse('', Text::_('JSHOP_PASS_ERROR'), true);
		}
		$remember = (!empty($data['remember']));

		$model = \JSFactory::getModel('userlogin', 'Site');
		if ($model->login($data['login'], $data['password'], array('remember' => $remember)))
		{
			Helper::setNextUpdatePrices();

			return $this->setJSONResponse();
		}
		else
		{
			/** @var DatabaseDriver $db */
			$db    = Factory::getContainer()->get(DatabaseDriver::class);
			$query = $db->getQuery(true)
				->select(['username'])
				->from($db->quoteName('#__users'))
				->where($db->quoteName('email') . ' = :email')
				->bind(':email', $data['login']);
			$login = $db->setQuery($query, 0, 1)->loadResult();

			if (!empty($login))
			{
				if ($model->login($login, $data['password'], array('remember' => $remember)))
				{
					Helper::setNextUpdatePrices();

					return $this->setJSONResponse();
				}
			}
		}

		return $this->setJSONResponse('', Text::_('JSHOP_PASS_ERROR'), true);
	}

	public function rabattAjax()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}

		$this->app->triggerEvent('onLoadDiscountSave', array());
		$code = $this->input->get('rabatt', '');
		if ($code)
		{
			$coupon = \JSFactory::getTable('coupon');
			$cart   = \JSFactory::getModel('cart', 'Site');

			if ($coupon->getEnableCode($code))
			{
				$cart->load();
				$this->app->triggerEvent('onBeforeDiscountSave', array(&$coupon, &$cart));
				$cart->setRabatt($coupon->coupon_id, $coupon->coupon_type, $coupon->coupon_value);
				$this->app->triggerEvent('onAfterDiscountSave', array(&$coupon, &$cart));

				return $this->setJSONResponse();
			}

			return $this->setJSONResponse('', $coupon->error, true);
		}
	}

	protected function customerRegister($data = [])
	{
		if (empty($data)) return false;
		try
		{
			$this->app->getLanguage()->load('com_users');
			$model = \JSFactory::getModel('userregister', 'Site');

			/** @var UserregisterModel $model */
			$model->setData($data);

			if (!$model->save())
			{
				return false;
			}

			try
			{
				$model->mailSend();
			}
			catch (\Exception $e)
			{

			}

			$user     = $model->getUserJoomla();
			$usershop = $model->getUser();
			$this->app->triggerEvent('onAfterRegister', array(&$user, &$usershop, &$data, &$useractivation));

			return $user->id;


		}
		catch (\Exception $e)
		{
			return false;
		}
	}

	protected function getCartAjax()
	{
		/** @var CartModel $cart */
		$cart = \JSFactory::getModel('cart', 'Site');
		$cart->init();

		return $cart;
	}

	protected function savePayment(&$checkout, &$cart, &$adv_user)
	{
		if ($this->jshopConfig->without_payment)
		{
			$checkout->setMaxStep(4);
		}
		else
		{
			$checkout->checkStep(3);
			$payment_method = $this->app->input->get('payment_method');
			$params         = $this->app->input->get('params', [], 'array');
			$post           = $this->app->input->post->getArray();
			if (!$this->setPayment($post, $cart, $payment_method, $params, $adv_user))
			{
				$this->app->redirect(Helper::SEFLink('index.php?option=com_jshopping&controller=nevigenonestepcheckout',
					0, 1, $this->jshopConfig->use_ssl));

				return false;
			}

			if ($this->jshopConfig->step_4_3)
			{
				$checkout->setMaxStep(5);
			}
			else
			{
				$checkout->setMaxStep(4);
			}
		}
	}

	protected function saveShipping(&$checkout, &$adv_user, &$cart)
	{
		if ($this->jshopConfig->without_shipping)
		{
			$checkout->setMaxStep(5);
		}
		else
		{
			$checkout->checkStep(4);
			if ($adv_user->delivery_adress)
			{
				$id_country = $adv_user->d_country;
			}
			else
			{
				$id_country = $adv_user->country;
			}
			if (!$id_country) $id_country = $this->jshopConfig->default_country;

			$sh_pr_method_id = $this->app->input->getInt('sh_pr_method_id');
			$params          = $this->app->input->get('params', [], 'array');

			if (!$this->setShipping($cart, $adv_user, $id_country, $sh_pr_method_id, $params))
			{
				$this->app->redirect(Helper::SEFLink('index.php?option=com_jshopping&controller=nevigenonestepcheckout', 0, 1, $this->jshopConfig->use_ssl));

				return false;
			}

			if ($this->jshopConfig->step_4_3 && !$this->jshopConfig->without_payment)
			{
				$checkout->setMaxStep(3);
			}
			else
			{
				$checkout->setMaxStep(5);
			}
		}
	}

	protected function checkoutStep3(&$cart, &$view, &$adv_user)
	{
		$this->app->triggerEvent('onLoadCheckoutStep3', array());

		if ((int) $this->jshopConfig->step_4_3 === 1 && empty($view->active_shipping))
		{
			$view->set('payment_step', 0);

			return false;
		}


		if ($this->jshopConfig->without_payment)
		{
			$cart->setPaymentId(0);
			$cart->setPaymentParams('');
			$cart->setPaymentPrice(0);
			$view->set('payment_step', 0);
		}
		else
		{
			$load_payments  = $this->getPayments($adv_user, $cart);
			$paym           = $load_payments['payments'];
			$active_payment = $load_payments['active_payment'];
			$post           = array();
			if (!$this->jshopConfig->hide_payment_step)
			{
				$this->setPayment($post, $cart, $this->getPaymentClassForPaymentsArray($paym, $active_payment), null, $adv_user);
			}

			if ($this->jshopConfig->hide_payment_step)
			{
				if (!$paym[0]->payment_class)
				{
					$this->app->enqueueMessage(Text::_('JSHOP_ERROR_PAYMENT'), 'warning');
					$paym[0]->payment_class = '';
				}
				$this->setPayment($post, $cart, $paym[0]->payment_class, null, $adv_user);
				$view->set('payment_step', 0);
				$view->set('active_payment', $paym[0]->payment_id);
				$view->set('active_payment_name', $paym[0]->name);
				$view->set('active_payment_class', $paym[0]->payment_class);
			}
			else
			{
				$view->set('payment_step', 1);
				$view->set('payment_methods', $paym);
				$view->set('active_payment', $active_payment);

				$this->app->triggerEvent('onBeforeDisplayCheckoutStep3View', array(&$view));
			}

		}
	}

	protected function checkoutStep4(&$cart, &$view, &$adv_user)
	{
		$this->app->triggerEvent('onLoadCheckoutStep4');
		if ($this->jshopConfig->without_shipping)
		{
			$cart->setShippingId(0);
			$cart->setShippingPrice(0);
			$cart->setPackagePrice(0);
			$view->set('delivery_step', 0);
		}
		else
		{
			if ($adv_user->delivery_adress)
			{
				$id_country = $adv_user->d_country;
			}
			else
			{
				$id_country = $adv_user->country;
			}
			if (!$id_country) $id_country = $this->jshopConfig->default_country;

			if (!$id_country)
			{
				$this->app->enqueueMessage(Text::_('JSHOP_REGWARN_COUNTRY', 'warning'));
			}

			$load_shippings  = $this->getShippings($adv_user, $id_country, $cart);
			$shippings       = $load_shippings['shippings'];
			$active_shipping = $load_shippings['active_shipping'];

			if (!$this->jshopConfig->hide_shipping_step)
			{
				$this->setShipping($cart, $adv_user, $id_country, $active_shipping, null);
			}

			if ($this->jshopConfig->hide_shipping_step)
			{
				if (!$shippings[0]->sh_pr_method_id
					&& ($this->jshopConfig->hide_payment_step || $this->jshopConfig->without_payment))
				{
					$this->app->enqueueMessage(Text::_('JSHOP_ERROR_SHIPPING'), 'warning');
				}

				if (!$shippings[0]->sh_pr_method_id)
				{
					$shippings[0]->sh_pr_method_id = '';
				}

				$this->setShipping($cart, $adv_user, $id_country, $active_shipping, null);
				$view->set('delivery_step', 0);
				$view->set('active_shipping', $shippings[0]->sh_pr_method_id);
				$view->set('active_shipping_name', $shippings[0]->name);
				$view->set('active_sh_pr_method_id', $shippings[0]->sh_pr_method_id);
			}
			else
			{
				$view->set('delivery_step', 1);
				$view->set('shipping_methods', $shippings);
				$view->set('active_shipping', $active_shipping);

				$this->app->triggerEvent('onBeforeDisplayCheckoutStep4View', array(&$view));
			}
		}
	}

	protected function setDataSmallCart(&$view)
	{
		$cart = \JSFactory::getModel('cart', 'jshop');
		$cart->load();
		$cart->addLinkToProducts(0);
		$cart->setDisplayFreeAttributes();

		$cart->setDisplayItem(1, 1);
		$cart->updateDiscountData();

		$weight_product = $cart->getWeightProducts();
		if ($weight_product == 0 && $this->jshopConfig->hide_weight_in_cart_weight0)
		{
			$this->jshopConfig->show_weight_order = 0;
		}
		PluginHelper::importPlugin('jshoppingcheckout');
		$this->app->triggerEvent('onBeforeDisplaySmallCart', array(&$cart));
		$view->set('products', $cart->products);
		$view->set('summ', $cart->getPriceProducts());
		$view->set('image_product_path', $this->jshopConfig->image_product_live_path);
		$view->set('no_image', $this->jshopConfig->noimage);
		$view->set('discount', $cart->getDiscountShow());
		$view->set('free_discount', $cart->getFreeDiscount());
		$deliverytimes = \JSFactory::getAllDeliveryTime();
		$view->set('deliverytimes', $deliverytimes);
		if (!$this->jshopConfig->without_shipping)
		{
			$view->set('summ_delivery', $cart->getShippingPrice());
			if ($cart->getPackagePrice() > 0 || $this->jshopConfig->display_null_package_price)
			{
				$summ_package = $cart->getPackagePrice();
				if (empty($summ_package))
				{
					$summ_package = 0;
				}

				$view->set('summ_package', $summ_package);
			}
			$view->set('summ_payment', $cart->getPaymentPrice());
			$fullsumm = $cart->getSum(1, 1, 1);
			$tax_list = $cart->getTaxExt(1, 1, 1);
		}
		else
		{
			$view->set('summ_payment', $cart->getPaymentPrice());
			$fullsumm = $cart->getSum(0, 1, 1);
			$tax_list = $cart->getTaxExt(0, 1, 1);
		}

		$lang              = \JSFactory::getLang();
		$name              = $lang->get('name');
		$pm_method         = \JSFactory::getTable('paymentMethod', 'jshop');
		$payment_method_id = $cart->getPaymentId();
		$pm_method->load($payment_method_id);
		$view->set('payment_name', $pm_method->$name);

		$show_percent_tax = 0;
		if (count($tax_list) > 1 || $this->jshopConfig->show_tax_in_product) $show_percent_tax = 1;
		if ($this->jshopConfig->hide_tax) $show_percent_tax = 0;
		$hide_subtotal = 0;
		if (($this->jshopConfig->hide_tax || count($tax_list) === 0)
			&& !$cart->rabatt_summ && $this->jshopConfig->without_shipping && $cart->getPaymentPrice() == 0) $hide_subtotal = 1;

		$text_total = Text::_('JSHOP_ENDTOTAL');
		if (($this->jshopConfig->show_tax_in_product || $this->jshopConfig->show_tax_product_in_cart)
			&& (count($tax_list) > 0))
		{
			$text_total = Text::_('JSHOP_ENDTOTAL_INKL_TAX');
		}

		$view->set('tax_list', $tax_list);
		$view->set('fullsumm', $fullsumm);
		$view->set('show_percent_tax', $show_percent_tax);
		$view->set('hide_subtotal', $hide_subtotal);
		$view->set('text_total', $text_total);
		$view->set('weight', $weight_product);

		$this->app->triggerEvent('onBeforeDisplayCheckoutCartView', array(&$view));
	}

	protected function getDeliveryTimeDate($cart): array
	{
		$sh_mt_pr = \JSFactory::getTable('shippingMethodPrice', 'jshop');
		$sh_mt_pr->load($cart->getShippingPrId());
		if ($this->jshopConfig->show_delivery_time_checkout && $cart->getShippingPrId())
		{
			$deliverytimes = \JSFactory::getAllDeliveryTime();
			$delivery_time = (isset($deliverytimes[$sh_mt_pr->delivery_times_id]))
				? $deliverytimes[$sh_mt_pr->delivery_times_id] : '';
			if (!$delivery_time && $this->jshopConfig->delivery_order_depends_delivery_product)
			{
				$delivery_time = $cart->getDelivery();
			}
		}
		else
		{
			$delivery_time = '';
		}

		if ($this->jshopConfig->show_delivery_date)
		{
			$delivery_date = $cart->getDeliveryDate();
			if ($delivery_date)
			{
				$delivery_date = Helper::formatdate($cart->getDeliveryDate());
			}
		}
		else
		{
			$delivery_date = '';
		}

		return ['delivery_time' => $delivery_time, 'delivery_date' => $delivery_date];
	}

	protected function getPayments($adv_user, &$cart): array
	{
		$paymentmethod       = \JSFactory::getTable('paymentmethod', 'jshop');
		$shipping_id         = $cart->getShippingId();
		$all_payment_methods = $paymentmethod->getAllPaymentMethods(1, $shipping_id);
		$i                   = 0;
		$paym                = array();

		foreach ($all_payment_methods as $pm)
		{
			$paym[$i] = new \stdClass();
			$paymentmethod->load($pm->payment_id);
			if ($pm->scriptname != '')
			{
				$scriptname = $pm->scriptname;
			}
			else
			{
				$scriptname = $pm->payment_class;
			}
			$paymentsysdata = $paymentmethod->getPaymentSystemData($scriptname);
			if ($paymentsysdata->paymentSystem)
			{
				$paym[$i]->existentcheckform = 1;
				$paym[$i]->payment_system    = $paymentsysdata->paymentSystem;
			}
			else
			{
				$paym[$i]->existentcheckform = 0;
			}

			$paym[$i]->name                = $pm->name;
			$paym[$i]->payment_id          = $pm->payment_id;
			$paym[$i]->payment_class       = $pm->payment_class;
			$paym[$i]->scriptname          = $pm->scriptname;
			$paym[$i]->payment_description = $pm->description;
			$paym[$i]->price_type          = $pm->price_type;
			$paym[$i]->image               = $pm->image;
			$paym[$i]->price_add_text      = '';
			if ($pm->price_type == 2)
			{
				$paym[$i]->calculeprice = $pm->price;
				if ($paym[$i]->calculeprice != 0)
				{
					if ($paym[$i]->calculeprice > 0)
					{
						$paym[$i]->price_add_text = '+' . $paym[$i]->calculeprice . '%';
					}
					else
					{
						$paym[$i]->price_add_text = $paym[$i]->calculeprice . '%';
					}
				}
			}
			else
			{
				$paym[$i]->calculeprice = Helper::getPriceCalcParamsTax($pm->price * $this->jshopConfig->currency_value, $pm->tax_id, $cart->products);
				if ($paym[$i]->calculeprice != 0)
				{
					if ($paym[$i]->calculeprice > 0)
					{
						$paym[$i]->price_add_text = '+' . Helper::formatprice($paym[$i]->calculeprice);
					}
					else
					{
						$paym[$i]->price_add_text = Helper::formatprice($paym[$i]->calculeprice);
					}
				}
			}

			$s_payment_method_id = $cart->getPaymentId();
			if ($s_payment_method_id == $pm->payment_id)
			{
				$params = $cart->getPaymentParams();
			}
			else
			{
				$params = array();
			}

			if ($paym[$i]->existentcheckform)
			{
				$paym[$i]->form = $paymentmethod->loadPaymentForm($paym[$i]->payment_system, $params, $pm->pmconfig);
			}
			else
			{
				$paym[$i]->form = "";
			}

			$i++;
		}

		$s_payment_method_id = $cart->getPaymentId();
		$active_payment      = intval($s_payment_method_id);

		if (!$active_payment)
		{
			$list_payment_id = array();
			foreach ($paym as $v)
			{
				$list_payment_id[] = $v->payment_id;
			}
			if (in_array($adv_user->payment_id, $list_payment_id)) $active_payment = $adv_user->payment_id;
		}

		$active_payment_old = $active_payment;
		if ($active_payment_old)
		{
			$active_payment = 0;
			foreach ($paym as $v)
			{
				if ($v->payment_id == $active_payment_old)
				{
					$active_payment = $active_payment_old;
					break;
				}
			}
		}

		if (!$active_payment)
		{
			if (isset($paym[0]))
			{
				$active_payment = $paym[0]->payment_id;
			}
		}

		return array('payments' => $paym, 'active_payment' => $active_payment);
	}

	protected function getShippings($adv_user, $id_country, &$cart): array
	{
		$shippingmethod      = \JSFactory::getTable('shippingMethod', 'jshop');
		$shippingmethodprice = \JSFactory::getTable('shippingMethodPrice', 'jshop');

		if ($this->jshopConfig->show_delivery_time_checkout)
		{
			$deliverytimes = \JSFactory::getAllDeliveryTime();
		}
		if ($this->jshopConfig->show_delivery_date)
		{
			$deliverytimedays = \JSFactory::getAllDeliveryTimeDays();
		}


		$sh_pr_method_id = $cart->getShippingPrId();
		$active_shipping = intval($sh_pr_method_id);
		$payment_id      = $cart->getPaymentId();
		$shippings       = $shippingmethod->getAllShippingMethodsCountry($id_country, $payment_id);

		if (!count($shippings)) $shippings = array();
		foreach ($shippings as &$value)
		{
			$shippingmethodprice->load($value->sh_pr_method_id);
			if ($this->jshopConfig->show_list_price_shipping_weight)
			{
				$value->shipping_price = $shippingmethodprice->getPricesWeight($value->sh_pr_method_id, $id_country, $cart);
			}
			$prices                 = $shippingmethodprice->calculateSum($cart);
			$value->calculeprice    = (float) $prices['shipping'] + (float) $prices['package'];
			$value->delivery        = '';
			$value->delivery_date_f = '';
			if ($this->jshopConfig->show_delivery_time_checkout)
			{
				$value->delivery = isset($deliverytimes[$value->delivery_times_id]) ? $deliverytimes[$value->delivery_times_id] : '';
			}
			if ($this->jshopConfig->show_delivery_date)
			{
				$day = isset($deliverytimedays[$value->delivery_times_id]) ? $deliverytimedays[$value->delivery_times_id] : null;
				if ($day)
				{
					$value->delivery_date   = Helper::getCalculateDeliveryDay($day);
					$value->delivery_date_f = Helper::formatdate($value->delivery_date);
				}
			}

			if ($value->sh_pr_method_id == $active_shipping)
			{
				$params = $cart->getShippingParams();
			}
			else
			{
				$params = array();
			}

			$value->form = $shippingmethod->loadShippingForm($value->shipping_id, $value, $params);
		}

		if (!$active_shipping)
		{
			foreach ($shippings as $v)
			{
				if ($v->shipping_id == $adv_user->shipping_id)
				{
					$active_shipping = $v->sh_pr_method_id;
					break;
				}
			}
		}

		$active_shipping_old = $active_shipping;
		if ($active_shipping_old)
		{
			$active_shipping = 0;
			foreach ($shippings as $v)
			{
				if ($v->sh_pr_method_id == $active_shipping_old)
				{
					$active_shipping = $active_shipping_old;
					break;
				}
			}
		}

		if (!$active_shipping)
		{
			if (isset($shippings[0]))
			{
				$active_shipping = $shippings[0]->sh_pr_method_id;
			}
		}

		return ['shippings' => $shippings, 'active_shipping' => $active_shipping];
	}

	protected $paymentId = 0;

	protected function setPayment(&$post, &$cart, $payment_method, $params, $adv_user, $ajax = false): bool
	{
		PluginHelper::importPlugin('jshoppingcheckout');

		$this->app->triggerEvent('onBeforeSaveCheckoutStep3save', array(&$post));

		$params_pm          = $params[$payment_method] ?? '';
		$paym_method        = \JSFactory::getTable('paymentmethod', 'jshop');
		$paym_method->class = $payment_method;
		$payment_method_id  = $paym_method->getId();
		$paym_method->load($payment_method_id);
		$pmconfigs       = $paym_method->getConfigs();
		$paymentsysdata  = $paym_method->getPaymentSystemData();
		$payment_system  = $paymentsysdata->paymentSystem;
		$this->paymentId = $payment_method_id;

		if ((isset($paymentsysdata->paymentSystemError) && $paymentsysdata->paymentSystemError) || !$payment_method_id)
		{
			$cart->setPaymentParams('');
			$this->app->enqueueMessage(Text::_('JSHOP_ERROR_PAYMENT'), 'error');

			return false;
		}
		if ($payment_system)
		{
			if (!$payment_system->checkPaymentInfo($params_pm, $pmconfigs))
			{
				$cart->setPaymentParams('');
				$this->app->enqueueMessage($payment_system->getErrorMessage(), 'error');

				return false;
			}
		}

		$paym_method->setCart($cart);
		$cart->setPaymentId($payment_method_id);
		$price = $paym_method->getPrice();
		$cart->setPaymentDatas($price, $paym_method);

		if (isset($params[$payment_method]))
		{
			$cart->setPaymentParams($params_pm);
		}
		else
		{
			$cart->setPaymentParams('');
		}

		$adv_user->saveTypePayment($payment_method_id);

		if ($ajax)
		{
			$cart->setShippingId(0);
		}

		$this->app->triggerEvent('onAfterSaveCheckoutStep3save', array(&$adv_user, &$paym_method, &$cart));

		return true;
	}

	protected function setAddress(&$cart, $adv_user)
	{
		PluginHelper::importPlugin('jshoppingcheckout');

		$post = $this->app->input->post->getArray();
		if (empty($post))
		{
			$this->app->enqueueMessage(Text::_('JSHOP_ERROR_DATA'), 'error');

			return false;
		}
		else
		{
			if (isset($post['birthday']) && $post['birthday']) $post['birthday'] = Helper::getJsDateDB($post['birthday'], $this->jshopConfig->field_birthday_format);
			if (isset($post['d_birthday']) && $post['d_birthday']) $post['d_birthday'] = Helper::getJsDateDB($post['d_birthday'], $this->jshopConfig->field_birthday_format);
			$address_fields_default = ['apartment', 'city', 'client_type', 'country', 'd_apartment', 'd_city', 'd_country',
				'd_email', 'd_ext_field_1', 'd_ext_field_2', 'd_ext_field_3', 'd_f_name', 'd_fax', 'd_firma_name',
				'd_home', 'd_l_name', 'd_mobil_phone', 'd_phone', 'd_state', 'd_street', 'd_title', 'd_zip',
				'delivery_adress', 'email', 'ext_field_1', 'ext_field_2', 'ext_field_3', 'f_name', 'fax', 'firma_code',
				'firma_name', 'home', 'l_name', 'mobil_phone', 'phone', 'privacy_statement', 'state', 'street',
				'tax_number', 'title', 'type', 'zip', 'm_name', 'd_m_name', 'email2', 'street_nr', 'd_street_nr',
				'birthday', 'd_birthday'];

			$address_fields = $address_fields_default;

			$this->app->triggerEvent('onBeforeNevigenOneStepCheckoutCheckAddressFields', [&$address_fields]);

			if (empty($address_fields))
			{
				$address_fields = $address_fields_default;
			}

			foreach ($post as $key => $value)
			{
				if (!in_array($key, $address_fields))
				{
					unset($post[$key]);
				}
			}
		}

		unset($post['user_id']);
		unset($post['usergroup_id']);
		$post['lang'] = $this->jshopConfig->getLang();

		$user = $this->app->getIdentity();
		$adv_user->bind($post);
		foreach ($this->jshopConfig->fields_client_only_check as $_field)
		{
			$adv_user->$_field = $post[$_field] ?? null;
		}
		if (!$adv_user->check('address'))
		{
			$this->app->enqueueMessage($adv_user->getError(), 'error');

			return false;
		}
		foreach ($this->jshopConfig->fields_client_only_check as $_field)
		{
			unset($adv_user->$_field);
		}

		$this->app->triggerEvent('onBeforeSaveCheckoutStep2', array(&$adv_user, &$user, &$cart));

		if (!$adv_user->store())
		{
			$this->app->enqueueMessage(Text::_('JSHOP_REGWARN_ERROR_DATABASE'), 'error');

			return false;
		}

		Helper::setNextUpdatePrices();

		$this->app->triggerEvent('onAfterSaveCheckoutStep2', array(&$adv_user, &$user, &$cart));

		return true;
	}

	protected function setShipping(&$cart, $adv_user, $id_country, $sh_pr_method_id, $params, $ajax = false): bool
	{
		PluginHelper::importPlugin('jshoppingcheckout');

		$this->app->triggerEvent('onBeforeSaveCheckoutStep4save', array());

		$shipping_method_price = \JSFactory::getTable('shippingMethodPrice', 'jshop');
		$shipping_method_price->load($sh_pr_method_id);

		$sh_method = \JSFactory::getTable('shippingMethod', 'jshop');
		$sh_method->load($shipping_method_price->shipping_method_id);
		$params_sm = $params[$sh_method->shipping_id] ?? '';

		if (!$shipping_method_price->sh_pr_method_id || !$shipping_method_price->isCorrectMethodForCountry($id_country)
			|| !$sh_method->shipping_id || !$this->isCorectMethodForPayment($cart, $sh_method->shipping_id, $ajax))
		{
			$this->app->enqueueMessage(Text::_('JSHOP_ERROR_SHIPPING'), 'error');

			return false;

		}

		if (isset($params[$sh_method->shipping_id]))
		{
			$cart->setShippingParams($params_sm);
		}
		else
		{
			if (!$cart->getShippingId() || $cart->getShippingId() == $sh_method->shipping_id)
			{
				$params_sm = $cart->getShippingParams();
			}
			else
			{
				$cart->setShippingParams('');
			}
		}

		$shippingForm = $sh_method->getShippingForm();

		if ($shippingForm && !$shippingForm->check($params_sm, $sh_method))
		{
			$task = $this->app->input->getString('task', '');

			$this->app->enqueueMessage($shippingForm->getErrorMessage(), 'error');
			if (!empty($task) && $task === 'save')
			{
				return false;
			}
		}
		$prices = $shipping_method_price->calculateSum($cart);
		$cart->setShippingId($sh_method->shipping_id);
		$cart->setShippingPrId($sh_pr_method_id);
		$cart->setShippingsDatas($prices, $shipping_method_price);

		if ($this->jshopConfig->show_delivery_date)
		{
			$delivery_date    = '';
			$deliverytimedays = \JSFactory::getAllDeliveryTimeDays();
			$day              = $deliverytimedays[$shipping_method_price->delivery_times_id] ?? null;
			if ($day)
			{
				$delivery_date = Helper::getCalculateDeliveryDay($day);
			}
			else
			{
				if ($this->jshopConfig->delivery_order_depends_delivery_product)
				{
					$day = $cart->getDeliveryDaysProducts();
					if ($day)
					{
						$delivery_date = Helper::getCalculateDeliveryDay($day);
					}
				}
			}

			$cart->setDeliveryDate($delivery_date);
		}

		//update payment price
		$payment_method_id = $cart->getPaymentId();
		if ($payment_method_id)
		{
			$paym_method = \JSFactory::getTable('paymentmethod', 'jshop');
			$paym_method->load($payment_method_id);
			$cart->setDisplayItem(1, 1);
			$paym_method->setCart($cart);
			$price = $paym_method->getPrice();
			$cart->setPaymentDatas($price, $paym_method);
		}

		$adv_user->saveTypeShipping($sh_method->shipping_id);

		$this->app->triggerEvent('onAfterSaveCheckoutStep4', array(&$adv_user, &$sh_method, &$shipping_method_price, &$cart));

		return true;
	}

	protected function getPaymentClassForPaymentsArray($payments, $payment_id)
	{
		$payment_method = '';
		foreach ($payments as $payment)
		{
			if ($payment->payment_id == $payment_id)
			{
				$payment_method = $payment->payment_class;
				break;
			}
		}

		return $payment_method;
	}

	protected function isCorectMethodForPayment(&$cart, $shipping_id, $ajax = false): bool
	{
		$shipping_method = \JSFactory::getTable('shippingmethod', 'jshop');
		$shipping_method->load($shipping_id);

		if (empty($shipping_method->payments))
		{
			return true;
		}

		$shipping_payments = $shipping_method->getPayments();
		if ($cart->getPaymentId() && !in_array($cart->getPaymentId(), $shipping_payments))
		{
			if ((int) $this->jshopConfig->step_4_3 === 1 && $ajax)
			{
				$paymentmethod       = \JSFactory::getTable('paymentmethod', 'jshop');
				$all_payment_methods = $paymentmethod->getAllPaymentMethods(1, $shipping_id);
				if (!empty($all_payment_methods))
				{
					$cart->setPaymentId($all_payment_methods[0]->payment_id);
				}

				return true;
			}

			return false;

		}

		return true;
	}

	protected function getFormAddress($adv_user = null): Form
	{
		$tmp_fields           = $this->jshopConfig->getListFieldsRegister();
		$config_fields        = $tmp_fields['address'];
		$count_filed_delivery = $this->jshopConfig->getEnableDeliveryFiledRegistration('address');
		$fieldsSorting        = $this->addonParams['fields_sorting'];
		$findEmail            = false;
		// Get Form;
		/* @var $form Form */
		$form = Factory::getContainer()->get(FormFactoryInterface::class)->createForm('nevigen_onestepcheckout_address');
		// Create form
		$formXML         = new \SimpleXMLElement('<form/>');
		$fieldsetAddress = $formXML->addChild('fieldset');
		$fieldsetAddress->addAttribute('name', 'home_address');
		$fieldsetAddress->addAttribute('label', Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDSET_HOME_ADDRESS'));

		if ($count_filed_delivery && (int) $adv_user->delivery_adress === 1)
		{
			$fieldsetDelivery = $formXML->addChild('fieldset');
			$fieldsetDelivery->addAttribute('name', 'delivery_address');
			$fieldsetDelivery->addAttribute('label', Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_FIELDSET_DELIVERY_ADDRESS'));
		}
		foreach ($fieldsSorting as $key => $f)
		{
			$showon      = '';
			$dKey        = 'd_' . $key;
			$fieldParam  = (isset($config_fields[$key])) ? $config_fields[$key] : false;
			$dFieldParam = (isset($config_fields[$dKey])) ? $config_fields[$dKey] : false;

			if ($fieldParam)
			{
				if ($key === 'firma_code' || $key === 'firma_name' || $key === 'tax_number')
				{
					$showon = 'client_type:2';
				}
				if ($key === 'email' && (int) $fieldParam['display'] === 1
					&& (int) $fieldParam['require'] === 1)
				{
					$findEmail = true;
				}
				$this->setField($fieldsetAddress, $key, $fieldParam, $adv_user, $showon);
			}

			if ($count_filed_delivery && (int) $adv_user->delivery_adress === 1)
			{
				if ($dFieldParam)
				{
					$this->setField($fieldsetDelivery, $dKey, $dFieldParam, $adv_user, 'delivery_adress:1');
				}
			}
		}

		if ($count_filed_delivery)
		{
			$fieldXml = $formXML->addChild('field');
			$fieldXml->addAttribute('name', 'delivery_adress');
			$fieldXml->addAttribute('label', Text::_('JSHOP_DELIVERY_ADRESS'));
			$fieldXml->addAttribute('type', 'radio');
			$fieldXml->addAttribute('class', 'btn-group');
			if (!empty($adv_user) && isset($adv_user->delivery_adress))
			{
				$fieldXml->addAttribute('default', $adv_user->delivery_adress);
			}
			else
			{
				$fieldXml->addAttribute('default', 0);
			}
			$option = $fieldXml->addChild('option', Text::_('JSHOP_NO'));
			$option->addAttribute('value', 0);
			$option = $fieldXml->addChild('option', Text::_('JSHOP_YES'));
			$option->addAttribute('value', 1);
		}

		if (isset($config_fields['privacy_statement']) && $config_fields['privacy_statement']['display'])
		{
			$fieldXml = $formXML->addChild('field');
			$fieldXml->addAttribute('name', 'privacy_statement');
			$fieldXml->addAttribute('label', Text::_('JSHOP_PRIVACY_STATEMENT'));
			$fieldXml->addAttribute('type', 'checkbox');
			$fieldXml->addAttribute('value', 1);
			if (!empty($adv_user) && isset($adv_user->privacy_statement))
			{
				if ((int) $adv_user->privacy_statement === 1)
				{
					$fieldXml->addAttribute('checked', $adv_user->privacy_statement);
				}
			}
			if ((int) $config_fields['privacy_statement']['require'] === 1)
			{
				$fieldXml->addAttribute('required', 'true');
			}
		}

		if ($findEmail && (int) $this->jshopConfig->shop_user_guest === 3 && $this->app->getIdentity()->guest)
		{
			$userComponent = ComponentHelper::getParams('com_users');
			if ((int) $userComponent->get('allowUserRegistration', 0) === 1
				&& (int) $userComponent->get('sendpassword', 0) === 1)
			{
				$this->customer_register = true;
			}
		}

		// Load xml
		$form->load($formXML);

		unset($tmp_fields);

		return $form;
	}

	protected function setField(\SimpleXMLElement $parrent = null, string $name = null, array $fieldParam = [],
	                                              $adv_user = null, $showon = '')
	{
		if (empty($parrent) || empty($name) || empty($fieldParam)) return;

		if ((int) $fieldParam['display'] === 1)
		{
			$type        = 'text';
			$country     = ($name === 'country' || $name === 'd_country');
			$birthday    = ($name === 'birthday' || $name === 'd_birthday');
			$title       = ($name === 'title' || $name === 'd_title');
			$client_type = ($name === 'client_type' || $name === 'd_client_type');
			if ($country || $title || $client_type)
			{
				$type = 'list';
			}
			if ($birthday)
			{
				$type = 'calendar';
			}

			$key = $name;
			if (substr($key, 0, 2) == 'd_')
			{
				$key = str_replace('d_', '', $key);

			}

			$text = Text::_('JSHOP_' . $key);
			if ($key === 'phone')
			{
				$text = Text::_('JSHOP_TELEFON');
			}
			elseif ($key === 'title')
			{
				$text = Text::_('JSHOP_REG_TITLE');
			}
			elseif ($key === 'street')
			{
				$text = Text::_('JSHOP_STREET_NR');
			}

			$fieldXml = $parrent->addChild('field');
			$fieldXml->addAttribute('name', $name);
			$fieldXml->addAttribute('label', $text);
			$fieldXml->addAttribute('hint', $text);
			$fieldXml->addAttribute('type', $type);

			if (!empty($adv_user) && isset($adv_user->$name))
			{
				$fieldXml->addAttribute('default', $adv_user->$name);
			}

			if (!empty($showon))
			{
				$fieldXml->addAttribute('showon', $showon);
			}

			if ($type === 'calendar')
			{
				$fieldXml->addAttribute('filter', 'user_utc');
				$fieldXml->addAttribute('todaybutton', 'false');
				$fieldXml->addAttribute('showtime', 'false');
				$fieldXml->addAttribute('format', $this->jshopConfig->field_birthday_format);
			}

			if ((int) $fieldParam['require'] === 1)
			{
				$fieldXml->addAttribute('required', 'true');
			}

			if ($client_type)
			{
				foreach ($this->jshopConfig->user_field_client_type as $key => $value)
				{
					$id = $key;
					if ($key == 0) $id = '';
					$option = $fieldXml->addChild('option', Text::_($value));
					$option->addAttribute('value', $id);
				}
			}
			if ($country)
			{
				if ($this->listCountry === null)
				{
					$country           = \JSFactory::getTable('country');
					$this->listCountry = $country->getAllCountries();
				}

				$option = $fieldXml->addChild('option', Text::_('JSHOP_REG_SELECT'));
				$option->addAttribute('value', '');
				foreach ($this->listCountry as $country)
				{
					$option = $fieldXml->addChild('option', $country->name);
					$option->addAttribute('value', $country->country_id);
				}
			}

			if ($title)
			{
				foreach ($this->jshopConfig->user_field_title as $key => $value)
				{
					$id = $key;
					if ($key == 0) $id = '';
					$option = $fieldXml->addChild('option', Text::_($value));
					$option->addAttribute('value', $id);
				}
			}
		}
	}

	/**
	 * Method to set json response.
	 *
	 * @param   mixed   $response  Response data
	 * @param   string  $msg       Message.
	 * @param   bool    $error     Has error.
	 *
	 * @throws  \Exception
	 *
	 * @return  true True on success, Exception on failure.
	 *
	 * @since  1.0.0
	 */
	public function setJSONResponse($response = null, $msg = null, $error = false): bool
	{
		header('Content-Type: application/json');
		echo new JsonResponse($response, $msg, $error);
		$this->app->close(($error) ? 500 : 200);

		return (!$error);
	}
}