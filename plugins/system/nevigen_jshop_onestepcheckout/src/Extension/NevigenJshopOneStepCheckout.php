<?php
/*
 * @package    Nevigen JShop OneStepCheckout Package
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\System\NevigenJshopOneStepCheckout\Extension;

\defined('_JEXEC') or die;


use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\Database\DatabaseAwareTrait;
use Joomla\Plugin\System\NevigenJshopOneStepCheckout\Helper\NevigenHelper;

class NevigenJshopOneStepCheckout extends CMSPlugin
{
	use DatabaseAwareTrait;

	/**
	 * Load the language file on instantiation.
	 *
	 * @var    bool
	 *
	 * @since  1.0.0
	 */
	protected $autoloadLanguage = true;

	/**
	 * Addon params.
	 *
	 * @var  array|null
	 *
	 * @since  1.0.0
	 */
	protected ?array $addonParams = null;

	/**
	 * Addon param enabled.
	 *
	 * @var  bool
	 *
	 * @since  1.0.0
	 */
	protected $addonEnabled = false;

	/**
	 * Listener for the `onAfterRoute` event
	 *
	 * @return  void
	 *
	 * @since   1.0.0
	 */
	public function onAfterRoute()
	{
		$app = $this->getApplication();
		if ($app->isClient('site') && $app->input->getString('option') === 'com_jshopping')
		{
			if (!class_exists('JSFactory') || !class_exists('JSHelper'))
			{
				$bootstrap = JPATH_ROOT . '/components/com_jshopping/bootstrap.php';
				if (is_file($bootstrap))
				{
					require_once($bootstrap);
				}

			}

			if ($this->addonParams === null)
			{
				$addon = \JSFactory::getTable('addon', 'jshop');
				$addon->loadAlias('nevigen_onestepcheckout');
				$params = $addon->getParams();

				$this->addonParams = $params;
			}


			if (!empty($this->addonParams) && isset($this->addonParams['enabled'])
				&& (int) $this->addonParams['enabled'] === 1)
			{
				$this->addonEnabled = true;
			}

			if ($this->jshopConfig === null)
			{
				$this->jshopConfig = \JSFactory::getConfig();
			}

			if ($this->addonEnabled)
			{
				$controller = $app->input->getString('controller');
				$task       = $app->input->getString('task');
				if ($controller == 'checkout' &&
					(empty($task) || $task == 'step2' || $task == 'step3' || $task == 'step4' || $task == 'step5'
						|| $task == 'display' || $task == 'step2save' || $task == 'step3save' || $task == 'step4save'
						|| $task == 'step5save' || $task === 'view'))
				{
					$url = 'index.php?option=com_jshopping&controller=nevigenonestepcheckout&view=nevigenonestepcheckout';
					$url = Helper::SEFLink($url, 1, 0, $this->jshopConfig->use_ssl);

					$app->redirect($url);
				}
			}
		}

	}

	public function onBeforeDisplayCartView(&$view)
	{
		if (!$this->addonEnabled)
		{
			return;
		}
		$url = 'index.php?option=com_jshopping&controller=nevigenonestepcheckout&view=nevigenonestepcheckout';
		$url = Helper::SEFLink($url, 1, 0, $this->jshopConfig->use_ssl);

		if ((int) $this->addonParams['skip_cart'] === 1 && !empty($view->products))
		{

			$this->getApplication()->redirect($url);

			return;
		}
		$view->href_checkout = $url;
	}


	public function onBeforeEditConfigAdminFunction(&$view)
	{
		$shop_register_type = [];
		for ($i = 0; $i <= 3; $i++)
		{
			$shop_register_type[] = HTMLHelper::_('select.option', $i,
				Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_PARAMS_SHOP_REGISTER_TYPE_' . $i), 'id', 'name');
		}
		$jshopConfig = \JSFactory::getConfig();
		$listoptions = [
			'option.key'  => 'id',
			'option.text' => 'name',
			'list.select' => $jshopConfig->shop_user_guest,
			'list.attr'   => 'class="form-select"'
		];

		$view->lists['shop_register_type'] = HTMLHelper::_('select.genericlist', $shop_register_type,
			'shop_user_guest', $listoptions);
	}

	public function onAfterLoadJshopSEFLinkItemid(&$Itemid, &$link, &$useDefaultItemId, &$redirect, &$ssl)
	{
		if (!$this->addonEnabled)
		{
			return;
		}

		if (!empty(strripos($link, 'nevigenonestepcheckout')))
		{
			$id = $this->getItemId();
			if (!empty($id))
			{
				$Itemid = $id;
			}
		}
	}

	public function onContentBeforeSave($context, &$table, $isNew, $data)
	{
		if ($context === 'com_menus.item')
		{
			if (!empty($data['link']))
			{
				if ($data['link'] === 'index.php?option=com_jshopping&view=nevigenonestepcheckout')
				{
					if ($data['alias'] === 'checkout')
					{
						$table->alias = 'onestepcheckout';
						$this->getApplication()->enqueueMessage(Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_ERROR_MENU'),
							'warning');
					}
				}
			}
		}
	}

	protected $jshopConfig = null;
	protected $itemId = null;

	protected function getItemId()
	{
		if (!$this->addonEnabled)
		{
			return false;
		}

		if ($this->itemId === null)
		{
			$db = $this->getDatabase();
			$lang  = $this->getApplication()->getLanguage()->getTag();
			$url   = 'index.php?option=com_jshopping&view=nevigenonestepcheckout';
			$query = $db->getQuery(true)
				->select(['id', 'language'])
				->from($db->quoteName('#__menu'))
				->where($db->quoteName('link') . ' = :link')
				->where('published = 1')
				->whereIn('language', ['*', $lang])
				->bind(':link', $url);
			$data  = $db->setQuery($query)->loadAssocList('language');
			if (!empty($data))
			{
				if (isset($data[$lang]))
				{
					$this->itemId = $data[$lang]['id'];
				}
				else
				{
					$this->itemId = $data['*']['id'];
				}
			}
		}

		return $this->itemId;
	}

	protected $setBuildRoute = null;

	public function onBeforeBuildRoute(&$query, &$segments)
	{
		if (!$this->addonEnabled)
		{
			return;
		}

		if ($this->setBuildRoute === null)
		{
			if (isset($query['view']) && !isset($query['controller']))
			{
				$query['controller'] = $query['view'];
				unset($query['view']);
			}

			if (isset($query['controller']) && $query['controller'] == 'nevigenonestepcheckout')
			{
				$id = $this->getItemId();
				if (!empty($id))
				{
					$query['Itemid'] = $id;
					unset($query['controller']);
				}
			}

			$this->setBuildRoute = true;
		}
	}

	protected $setParseRoute = null;

	public function onBeforeParseRoute(&$vars, &$segments)
	{
		$newVersion = NevigenHelper::checkVersion('5.5');
		if (!$newVersion && $this->setParseRoute === null)
		{
			$menu     = $this->getApplication()->getMenu();
			$menuItem = $menu->getActive();
			if ((isset($menuItem->query['controller'])
					&& $menuItem->query['controller'] === 'nevigenonestepcheckout')
				|| (isset($menuItem->query['view']) && $menuItem->query['view'] === 'nevigenonestepcheckout'))
			{
				$segments[1] = $segments[0];
				$segments[0] = 'nevigenonestepcheckout';
			}
			$this->setParseRoute = true;
		}
	}

	public function onBeforeDisplayCheckoutFinish(&$text, &$order_id)
	{
		if (!$this->addonEnabled)
		{
			return;
		}
		if (isset($this->addonParams['finish']['enabled']) && (int) $this->addonParams['finish']['enabled'] === 1)
		{
			$app = $this->getApplication();
			$path = JPATH_ROOT . '/components/com_jshopping/templates/addons/nevigen_onestepcheckout/'
				. $this->addonParams['template'] . '/finish.php';
			if (isset($this->addonParams['enabled_css']) && (int) $this->addonParams['enabled_css'] === 1)
			{
				$wa =  $app->getDocument()->getWebAssetManager();
				
				// Load asses
				$wa->getRegistry()->addExtensionRegistryFile('plg_system_nevigen_jshop_onestepcheckout');
				$wa->useStyle('nevigen_onestepcheckout.main');
			}
			if (is_file($path))
			{
				//Set variables
				$order = \JSFactory::getTable('order');
				$order->load($order_id);
				$order->prepareOrderPrint('order_show');
				$params      = (isset($this->addonParams['finish'])) ? $this->addonParams['finish'] : [];
				$oldTextData = $text;

				ob_start();
				include_once $path;
				$data = ob_get_contents();
				ob_get_clean();

				$text = $data;

				//Delete variables
				unset($order);
				unset($params);
				unset($oldTextData);
			}
		}
	}
}