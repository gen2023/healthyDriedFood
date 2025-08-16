<?php
/*
 * @package    Nevigen JShop Account Redirect Plugin
 * @version    1.0.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\System\NevigenJshopAccountRedirect\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Application\CMSApplication;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Database\DatabaseDriver;

class NevigenJshopAccountRedirect extends CMSPlugin
{
	/**
	 * Loads the application object.
	 *
	 * @var  CMSApplication
	 *
	 * @since  1.0.0
	 */
	protected $app = null;

	/**
	 * Loads the database object.
	 *
	 * @var  DatabaseDriver
	 *
	 * @since  1.0.0
	 */
	protected $db = null;

	/**
	 * Listener for the `onAfterRoute` event
	 *
	 * @return  void
	 *
	 * @since   1.0.0
	 */
	public function onAfterRoute()
	{
		if ($this->app->isClient('site') && $this->app->input->getString('option') === 'com_users')
		{
			$task = $this->app->input->getCmd('task');
			$view = $this->app->input->getCmd('view');
			if ($task == 'registration' || $view == 'registration')
			{
				$this->app->redirect($this->getUrl('register'));
			}
			else if ($task === 'login' || $view === 'login')
			{
				$this->app->redirect($this->getUrl('login'));
			}
			else if ($task === 'profile' || $view === 'profile')
			{
				$this->app->redirect($this->getUrl());
			}
			else if ($task === 'registration.register' || $view === 'registration.register')
			{
				die;
			}
		}
	}

	protected function getUrl($task = '')
	{
		$url = 'index.php?option=com_jshopping&controller=user';
		if ($task)
		{
			$url .= '&task=' . $task;
		}
		if ($this->app->get('sef'))
		{
			if (!class_exists('JSHelper'))
			{
				$bootstrap = JPATH_ROOT . '/components/com_jshopping/bootstrap.php';
				if (File::exists($bootstrap))
				{
					require_once($bootstrap);
				}
			}


			return \JSHelper::SEFLink($url);

		}
		else
		{
			$itemid = $this->app->input->getInt('Itemid', 0);
			if ($itemid > 0)
			{
				$url .= '&Itemid=' . $itemid;
			}

			return $url;
		}
	}
}