<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Controller;

\defined('_JEXEC') or die;


use Joomla\CMS\Application\AdministratorApplication;
use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\MVC\View\ViewInterface;
use Joomla\CMS\Router\Route;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\NevigenAudit\Administrator\Traits\ClassMapTrait;

class DisplayController extends BaseController
{
	use ClassMapTrait;
	/**
	 * The default view.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $default_view = 'Dashboard';

	public function display($cachable = false, $urlparams = [])
	{
		// Redirect to dashboard
		$app = Factory::getApplication();
		if (empty($this->input->get('view')) && empty($this->input->get('task')))
		{
			/** @var AdministratorApplication $app */
			$app->redirect(Route::_('index.php?option=com_nevigen_audit&view=dashboard', false));
		}

		// Load component jshopping language
		JSFactory::loadAdminLanguageFile();

		return parent::display($cachable, $urlparams);
	}

	/**
	 * Method to get a reference to the current view and load it if necessary.
	 *
	 * @param   string  $name    The view name. Optional, defaults to the controller name.
	 * @param   string  $type    The view type. Optional.
	 * @param   string  $prefix  The class prefix. Optional.
	 * @param   array   $config  Configuration array for view. Optional.
	 *
	 * @throws  \Exception
	 *
	 * @return  ViewInterface  Reference to the view or an error.
	 *
	 * @since   1.0.0
	 */
	public function getView($name = '', $type = '', $prefix = '', $config = [])
	{
		return parent::getView($this->fixClassName($name), $type, $prefix, $config);
	}

	/**
	 * Proxy for getModel.
	 *
	 * @param   string  $name    The model name.
	 * @param   string  $prefix  The class prefix.
	 * @param   array   $config  The array of possible config values.
	 *
	 * @return  \Joomla\CMS\MVC\Model\BaseDatabaseModel  A model object.
	 *
	 * @since  1.0.0
	 */
	public function getModel($name = '', $prefix = '', $config = [])
	{
		return parent::getModel($this->fixClassName($name), $prefix, $config);
	}
}
