<?php
/*
 * @package    Nevigen JShop Auditor Plugin
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\System\NevigenAudit\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Dispatcher\DispatcherInterface;
use Joomla\CMS\Event\User\BeforeSaveEvent;
use Joomla\CMS\Form\Form;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Menu\AdministratorMenuItem;
use Joomla\CMS\MVC\Factory\MVCFactoryAwareTrait;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\NevigenAudit\Administrator\Helper\PluginsHelper;
use Joomla\Component\NevigenAudit\Administrator\Helper\ParamsHelper;
use Joomla\Database\DatabaseAwareTrait;
use Joomla\Event\Event;
use Joomla\Event\SubscriberInterface;
use Joomla\Registry\Registry;

class NevigenAudit extends CMSPlugin implements SubscriberInterface
{
	use MVCFactoryAwareTrait;
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
	 * NevigenAudit component params.
	 *
	 * @var  Registry|null
	 *
	 * @since  1.0.0
	 */
	protected ?Registry $componentParams = null;

	/**
	 * Is NevigenAudit old menu item remove.
	 *
	 * @var  bool
	 *
	 * @since  1.0.0
	 */
	protected bool $removeAdministratorMenu = false;

	/**
	 * Is NevigenAudit menu items load.
	 *
	 * @var  bool
	 *
	 * @since  1.0.0
	 */
	protected bool $loadAdministratorMenu = false;

	/**
	 * NevigenAudit menu cache.
	 *
	 * @var  AdministratorMenuItem|null
	 *
	 * @since  1.0.0
	 */
	protected ?AdministratorMenuItem $_administratorMenu = null;

	/**
	 * Jshopping  replace lists name
	 *
	 * @var array|string[]
	 *
	 * @since 1.0.0
	 */
	protected array $replaceLists = ['orders', 'users', 'categories', 'products'];

	/**
	 * Constructor.
	 *
	 * @param   DispatcherInterface  &$subject  The object to observe.
	 * @param   array                 $config   An optional associative array of configuration settings.
	 *
	 * @since  1.0.0
	 */
	public function __construct(&$subject, $config = [])
	{
		// Get component params
		$this->componentParams = ParamsHelper::getComponentParams();


		parent::__construct($subject, $config);
	}

	/**
	 * Returns an array of events this subscriber will listen to.
	 *
	 * @return  array
	 *
	 * @since   1.0.0
	 */
	public static function getSubscribedEvents(): array
	{
		return [
			'onPreprocessMenuItems'               => 'onPreprocessMenuItems',
			'onBeforeAdminOptionPanelIcoDisplay'  => 'addAdminIconOptionPanel',
			'onBeforeAdminOptionPanelMenuDisplay' => 'addAdminIconOptionPanel',
			'onAfterRoute'                        => 'onAfterRoute',
			'onContentPrepareForm'                => 'onContentPrepareForm',
			'onUserBeforeSave'                    => 'onUserBeforeSave',
		];
	}


	/**
	 * Listener for the `onAfterRoute` event.
	 *
	 * @throws  \Exception
	 *
	 * @since  1.0.0
	 */
	public function onAfterRoute()
	{
		$this->redirectToDashboard();
		$this->redirectToLists();
	}

	/**
	 * Listener for the `onContentPrepareForm` event.
	 *
	 * @param   Event  $event  The event.
	 *
	 * @throws  \Exception
	 *
	 * @since  1.0.0
	 */
	public function onContentPrepareForm(Event $event)
	{
		/** @var Form $form */
		$form     = $event->getArgument(0);
		$formName = $form->getName();
		$data     = $event->getArgument(1);

		$this->addConfigFormTriggers($formName, $form, $data);
	}

	public function addAdminIconOptionPanel(Event $event): void
	{
		$menu = $event->getArgument(0);
		if (is_array($menu))
		{
			$this->getApplication()->getLanguage()->load('com_nevigen_audit');
			$pathJS = JSFactory::getConfig()->admin_path . 'images/icon_nevigen_audit.png';
			if (!is_file($pathJS))
			{
				$img       = HTMLHelper::image('com_nevigen_audit/icon_auditor.png', '',
					'', true, true);
				$pathMedia = JPATH_ROOT . $img;

				if (is_file($pathMedia))
				{

					@file_put_contents($pathJS, file_get_contents($pathMedia));
				}
			}


			$menu['nevigenauditor'] = [
				'Store audit by Nevigen',
				'index.php?option=com_nevigen_audit', 'icon_nevigen_audit.png', 1];

			$event->setArgument(0, $menu);
		}

	}

	/**
	 * Listener for the `onPreprocessMenuItems` event.
	 *
	 * @param   Event  $event  The event.
	 *
	 * @throws \Exception
	 *
	 * @since  1.0.0
	 */
	public function onPreprocessMenuItems(Event $event)
	{
		$context  = $event->getArgument(0);
		$children = $event->getArgument(1);

		$this->removeNevigenAuditAdministratorComponentsMenuItem($context, $children);
		$this->loadNevigenAuditAdministratorMenu($context, $children);
		$this->addNevigenAuditAdministratorPluginsMenu($context, $children);

		$event->setArgument(1, $children);
	}

	public function onUserBeforeSave(Event $event)
	{
		if ($event instanceof BeforeSaveEvent)
		{
			// Joomla 5
			$subject = $event->getArgument('subject');
			$isNew   = $event->getArgument('isNew');
			$data    = $event->getArgument('data');

			$result = PluginsHelper::triggerPlugins(
				[
					'nevigen_audit',
				],
				'onNevigenAuditJoomlaUserBeforeSave', [$subject, $isNew, $data]);

			if (\in_array(0, $result, true)) {

				$return =  false;
			}
			else{
				$return = true;
			}

			$event->addResult($return);
		}
		else
		{
			// Joomla 4
			$subject = $event->getArgument(0);
			$isNew   = $event->getArgument(1);
			$data    = $event->getArgument(2);

			$result = PluginsHelper::triggerPlugins(
				[
					'nevigen_audit',
				],
				'onNevigenAuditJoomlaUserBeforeSave', [$subject, $isNew, $data]);

			if (\in_array(0, $result, true)) {

				$return =  false;
			}
			else{
				$return = true;
			}
		}

		return $return;
	}

	/**
	 * Method to load NevigenAudit config Web asset.
	 *
	 * @throws  \Exception
	 *
	 * @since  1.0.0
	 */
	protected function loadConfigWebAsset()
	{
		$app = $this->getApplication();
		if ($app->isClient('administrator')
			&& $app->input->getCmd('option') === 'com_config'
			&& $app->input->getCmd('view') === 'component'
			&& $app->input->getCmd('component') === 'com_nevigen_audit')
		{
			$assets = $app->getDocument()->getWebAssetManager();
			$assets->getRegistry()->addExtensionRegistryFile('com_nevigen_audit');
			$assets->usePreset('com_nevigen_audit.administrator.config');
		}
	}

	/**
	 * Method to add `onNevigenAuditPrepareConfigForm` event.
	 *
	 * @param   string  $formName  The form name.
	 * @param   Form    $form      The form to be altered.
	 * @param   mixed   $data      The associated data for the form.
	 *
	 * @throws \Exception
	 *
	 * @since 1.0.0
	 */
	protected function addConfigFormTriggers(string $formName, Form $form, $data = [])
	{
		if ($formName === 'com_config.component'
			&& $this->getApplication()->input->get('component') === 'com_nevigen_audit')
		{
			// Trigger `onNevigenAuditPrepareConfigForm` event
			PluginsHelper::triggerPlugins(
				[
					'nevigen_audit',
					'jshopping',
					'task',
					'system'
				],
				'onNevigenAuditPrepareConfigForm', [$form, $data]);
		}
	}

	/**
	 * Method to remove NevigenAudit from administrator components menu.
	 *
	 * @param   string|null  $context   Context selector string.
	 * @param   array        $children  Menu items array.
	 *
	 * @since  1.0.0
	 */
	protected function removeNevigenAuditAdministratorComponentsMenuItem(?string $context = null, array $children = [])
	{
		if ($this->getApplication()->isClient('administrator') && $this->removeAdministratorMenu === false
			&& $context === 'com_menus.administrator.module')
		{
			foreach ($children as $child)
			{
				if ($child->type === 'component'
					&& (int) $child->component_id === ComponentHelper::getComponent('com_nevigen_audit')->id)
				{
					$child->getParent()->removeChild($child);
					$this->removeAdministratorMenu = true;
				}
			}
		}
	}

	/**
	 * Method to add NevigenAudit administrator menu.
	 *
	 * @param   string|null  $context   Context selector string.
	 * @param   array        $children  Menu items array.
	 *
	 * @throws \Exception
	 *
	 * @since  1.0.0
	 */
	protected function loadNevigenAuditAdministratorMenu(?string $context = null, array $children = [])
	{
		if ($this->getApplication()->isClient('administrator') && $this->loadAdministratorMenu === false
			&& $context === 'com_menus.administrator.module')
		{
			/* @var $parent AdministratorMenuItem */
			$parent   = array_shift($children)->getParent();
			$children = $parent->getChildren();
			$menu     = $this->getNevigenAuditAdministratorMenu();

			// Check can rebuild
			$rebuild = false;
			foreach ($children as $child)
			{
				if ($child->title === 'MOD_MENU_SYSTEM')
				{
					$rebuild = 'standard';
				}
				elseif ($child->title === 'MOD_MENU_COMPONENTS')
				{
					$rebuild = 'alternative';
				}
			}

			// Add menu item.
			if ($rebuild === false)
			{
				$parent->addChild($menu);
			}
			else
			{
				foreach ($children as $child)
				{
					$parent->removeChild($child);
					if ($rebuild === 'standard' && $child->title === 'MOD_MENU_SYSTEM')
					{
						$parent->addChild($menu);
					}
					elseif ($rebuild === 'alternative' && $child->title === 'MOD_MENU_COMPONENTS')
					{
						$parent->addChild($menu);
					}

					$parent->addChild($child);
				}
			}

			// Menu processing
			$subMenu = $menu->getChildren();
			$this->addNevigenAuditAdministratorPluginsMenu($context, $subMenu);

			// Set is menu loaded
			$this->loadAdministratorMenu = true;
		}
	}

	/**
	 * Method to get NevigenAudit administrator menu item.
	 *
	 * @throws \Exception
	 *
	 * @return AdministratorMenuItem NevigenAudit administrator menu item.
	 *
	 * @since 1.0.0
	 */
	protected function getNevigenAuditAdministratorMenu(): AdministratorMenuItem
	{
		if ($this->_administratorMenu === null)
		{
			$parent = new AdministratorMenuItem ([
				'title'     => 'COM_NEVIGEN_AUDIT_MENUS',
				'type'      => 'heading',
				'element'   => 'com_nevigen_audit',
				'icon'      => 'fa-chart-line',
				'class'     => 'class:chart-line fa-chart-line nevigen-audit-preset-all',
				'dashboard' => 'nevigen_audit'
			]);

			// Add Dashboard view
			$parent->addChild(new AdministratorMenuItem ([
				'title'     => 'COM_NEVIGEN_AUDIT_MENUS_DASHBOARD',
				'type'      => 'component',
				'link'      => 'index.php?option=com_nevigen_audit&view=dashboard',
				'element'   => 'com_nevigen_audit',
				'class'     => '',
				'ajaxbadge' => null,
				'dashboard' => null,
			]));

			// Add Orders view
			$parent->addChild(new AdministratorMenuItem ([
				'title'     => 'COM_NEVIGEN_AUDIT_MENUS_ORDERS_AUDIT',
				'type'      => 'component',
				'link'      => 'index.php?option=com_nevigen_audit&view=orders',
				'element'   => 'com_nevigen_audit',
				'class'     => '',
				'ajaxbadge' => null,
				'dashboard' => null,
			]));

			// Add Products view
			$parent->addChild(new AdministratorMenuItem ([
				'title'     => 'COM_NEVIGEN_AUDIT_MENUS_PRODUCTS_AUDIT',
				'type'      => 'component',
				'link'      => 'index.php?option=com_nevigen_audit&view=products',
				'element'   => 'com_nevigen_audit',
				'class'     => '',
				'ajaxbadge' => null,
				'dashboard' => null,
			]));

			// Add NevigenUsers view
			$parent->addChild(new AdministratorMenuItem ([
				'title'     => 'COM_NEVIGEN_AUDIT_MENUS_USERS_AUDIT',
				'type'      => 'component',
				'link'      => 'index.php?option=com_nevigen_audit&view=users',
				'element'   => 'com_nevigen_audit',
				'class'     => '',
				'ajaxbadge' => null,
				'dashboard' => null,
			]));

			// Add Categories view
			$parent->addChild(new AdministratorMenuItem ([
				'title'     => 'COM_NEVIGEN_AUDIT_MENUS_CATEGORIES_AUDIT',
				'type'      => 'component',
				'link'      => 'index.php?option=com_nevigen_audit&view=categories',
				'element'   => 'com_nevigen_audit',
				'class'     => '',
				'ajaxbadge' => null,
				'dashboard' => null,
			]));

			// Add config view
			$parent->addChild(new AdministratorMenuItem ([
				'title'     => 'COM_NEVIGEN_AUDIT_MENUS_CONFIG',
				'type'      => 'component',
				'link'      => 'index.php?option=com_config&view=component&component=com_nevigen_audit',
				'element'   => 'com_config',
				'class'     => '',
				'ajaxbadge' => null,
				'dashboard' => null,
				'scope'     => 'default',
			]));

			// Add to cache
			$this->_administratorMenu = $parent;
		}

		return $this->_administratorMenu;
	}

	/**
	 * Method to clean NevigenAudit menu items if not displayed.
	 *
	 * @param   string|null  $context   Context selector string.
	 * @param   array        $children  Menu items array.
	 *
	 * @throws \Exception
	 *
	 * @since  1.0.0
	 */
	protected function addNevigenAuditAdministratorPluginsMenu(?string $context = null, array $children = [])
	{
		if (!$this->getApplication()->isClient('administrator'))
		{
			return;
		}

		/* @var $parent AdministratorMenuItem */
		$first = array_shift($children);
		if (empty($first))
		{
			return;
		}
		$parent = $first->getParent();

		if (empty($parent->element) || $parent->element !== 'com_nevigen_audit')
		{
			return;
		}

		if ($parent->type !== 'heading' || empty($parent->class))
		{
			return;
		}

		if (strpos($parent->class, 'nevigen-audit-preset-all') === false
			&& strpos($parent->class, 'nevigen-audit-preset-extensions') === false)
		{
			return;
		}

		// Remove fake extensions element
		if ((strpos($parent->class, 'nevigen-audit-preset-extensions') !== false))
		{
			foreach ($parent->getChildren() as $child)
			{
				if (!empty($child->type) && $child->type === 'remove')
				{
					$parent->removeChild($child);
					break;
				}
			}
		}

		// Trigger `onNevigenAuditPreprocessSubmenu` event
		$results = [];
		PluginsHelper::triggerPlugins(['nevigen_audit', 'system'], 'onNevigenAuditPreprocessSubmenu',
			[&$results, $parent, $this->componentParams]
		);

		if (!empty($results))
		{
			foreach ($results as $i => $item)
			{
				if (empty($item) || !$item instanceof AdministratorMenuItem)
				{
					unset($results[$i]);
				}
			}
		}

		if (count($results) === 0)
		{
			return;
		}

		// Add to extensions preset
		if (strpos($parent->class, 'nevigen-audit-preset-extensions') !== false)
		{
			foreach ($results as $result)
			{
				$parent->addChild($result);
			}

			return;
		}

		// Try rebuild standard
		$rebuild = false;
		foreach ($parent->getChildren() as $child)
		{
			$parent->removeChild($child);
			if (!empty($child) && $child->title === 'COM_NEVIGEN_AUDIT_MENUS_CONFIG')
			{
				foreach ($results as $result)
				{
					$parent->addChild($result);
				}
				// Add separator
				$parent->addChild(new AdministratorMenuItem ([
					'title'     => null,
					'type'      => 'separator',
					'element'   => 'com_nevigen_audit',
					'class'     => 'nevigen-audit-extensions-separator',
					'ajaxbadge' => null,
					'dashboard' => null
				]));

				$rebuild = true;
			}

			$parent->addChild($child);
		}

		// If can't rebuild
		if ($rebuild === false)
		{
			foreach ($results as $result)
			{
				$parent->addChild($result);
			}
		}
	}

	protected function redirectToDashboard()
	{
		$app = $this->getApplication();
		if (!$app->isClient('administrator'))
		{
			return;
		}

		if ($app->input->getString('option') === 'com_cpanel'
			&& $app->input->getString('view') === 'cpanel'
			&& $app->input->getString('dashboard') === 'nevigen_audit')
		{
			$app->redirect('index.php?option=com_nevigen_audit&view=dashboard');
		}
	}

	protected function redirectToLists()
	{
		$app = $this->getApplication();
		if (!$app->isClient('administrator'))
		{
			return;
		}
		if ((int) $this->componentParams->get('replace_lists', 0) === 1
			&& $app->input->getString('option') === 'com_jshopping'
			&& (empty($app->input->getString('task')) || $app->input->getString('task') == 'cancel'))
		{
			$controller = $app->input->getString('controller');
			if (in_array($controller, $this->replaceLists))
			{
				$app->redirect('index.php?option=com_nevigen_audit&view=' . $controller);
			}
		}
	}


}