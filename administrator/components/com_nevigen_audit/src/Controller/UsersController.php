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

use Joomla\CMS\Application\CMSApplication;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Input\Input;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Controller\AdminController;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\NevigenAudit\Administrator\Model\UsersModel;
use Joomla\Component\NevigenAudit\Administrator\Traits\JsonControllerTrait;
use Joomla\Component\Users\Administrator\Model\UserModel;
use Joomla\Utilities\ArrayHelper;

class UsersController extends AdminController
{
	use JsonControllerTrait;

	/**
	 * Constructor.
	 *
	 * @param   array                $config   An optional associative array of configuration settings.
	 * @param   MVCFactoryInterface  $factory  The factory.
	 * @param   CMSApplication       $app      The CMSApplication for the dispatcher
	 * @param   Input                $input    Input
	 *
	 * @throws \Exception
	 *
	 * @since  1.0.0
	 *
	 */
	public function __construct($config = [], MVCFactoryInterface $factory = null, $app = null, $input = null)
	{
		parent::__construct($config, $factory, $app, $input);

		$this->registerTask('block', 'changeBlock');
		$this->registerTask('unblock', 'changeBlock');

		$this->addJsonInput();

	}

	public function add()
	{
		$this->checkToken();
		$this->setRedirect('index.php?option=com_jshopping&controller=users&task=add&return='
			. base64_encode('index.php?option=com_nevigen_audit&view=users'));
	}

	/**
	 * Method to change the block status on a record.
	 *
	 * @return  void
	 *
	 * @since   1.0.0
	 */
	public function changeBlock()
	{
		// Check for request forgeries.
		$this->checkToken();

		$ids    = (array) $this->input->get('cid', [], 'int');
		$values = ['block' => 1, 'unblock' => 0];
		$task   = $this->getTask();
		$value  = ArrayHelper::getValue($values, $task, 0, 'int');

		$this->app->getLanguage()->load('com_users');

		// Remove zero values resulting from input filter
		$ids = array_filter($ids);

		if (empty($ids))
		{
			$this->setMessage(Text::_('COM_USERS_USERS_NO_ITEM_SELECTED'), 'warning');
		}
		else
		{
			/** @var UserModel $model */
			$model = $this->app->bootComponent('com_users')->getMVCFactory()
				->createModel('User', 'Administrator', ['ignore_request' => true]);
			// Change the state of the records.
			if (!$model->block($ids, $value))
			{
				$this->setMessage($model->getError(), 'error');
			}
			else
			{
				if ($value == 1)
				{
					$this->setMessage(Text::plural('COM_USERS_N_USERS_BLOCKED', \count($ids)));
				}
				elseif ($value == 0)
				{
					$this->setMessage(Text::plural('COM_USERS_N_USERS_UNBLOCKED', \count($ids)));
				}
			}
		}

		$this->setRedirect('index.php?option=com_nevigen_audit&view=users');
	}

	public function delete()
	{
		// Check for request forgeries
		$this->checkToken();

		// Get items to remove from the request.
		$cid = (array) $this->input->get('cid', [], 'int');

		// Remove zero values resulting from input filter
		$cid = array_filter($cid);

		if (empty($cid))
		{
			$this->getLogger()->warning(Text::_('COM_NEVIGEN_AUDIT_USERS_NO_ITEM_SELECTED'), ['category' => 'jerror']);
		}
		else
		{
			JSFactory::loadAdminLanguageFile();
			/** @var UsersModel $model */
			$model = $this->getModel();
			$result = $model->deleteList($cid);
			if ($result === false){
				$this->setMessage(Text::_('COM_NEVIGEN_AUDIT_ERROR_USERS_DELETE'));
			}
			else{
				$this->setMessage(Text::sprintf('COM_NEVIGEN_AUDIT_USERS_DELETE_SUCCESS',$result));
			}
		}

		$this->setRedirect('index.php?option=com_nevigen_audit&view=users');
	}

	/**
	 * Get modal data to modal user field.
	 *
	 * @return  bool|void
	 *
	 * @since   1.0.0
	 */
	public function getModalData()
	{
		$id = $this->input->getInt('id', 0);
		/** @var UsersModel $model */
		$model = $this->getModel();
		$data  = $model->getModalData($id);
		if (!empty($data))
		{
			return $this->setJsonResponse($data);
		}

		$this->message = 'User not found';
		$this->code    = 404;

		return $this->setJsonResponse();
	}

	public function exportToCSV()
	{
		$this->redirect = 'index.php?option=com_nevigen_audit&view=users';
		// Check for request forgeries
		$this->checkToken();

		// Get items to remove from the request.
		$cid = (array) $this->input->get('cid', [], 'int');

		// Remove zero values resulting from input filter
		$cid = array_filter($cid);

		/** @var \Joomla\Component\NevigenAudit\Administrator\Model\UsersModel $model */
		$model = $this->getModel();

		try
		{
			$rows = $model->getExportUsers($cid);
			if (empty($rows))
			{
				$this->setRedirect($this->redirect, 'Users not found', 'error');
			}

			$filename = 'nevigen_audit_clients_' . date('Y-m-d_H-i-s') . '.csv';

			header('Content-Type: text/csv; charset=UTF-8');
			header('Content-Disposition: attachment; filename="' . $filename . '"');

			echo "\xEF\xBB\xBF";

			$output = fopen('php://output', 'w');
			$params = ComponentHelper::getParams('com_nevigen_audit');

			fputcsv($output, array_keys($rows[0]), ';');
			foreach ($rows as $row)
			{
				if ((int) $params->get('users_export_all', 1) === 0)
				{
					fputcsv($output, $row, ';');
				}
				else
				{
					$filteredRow = array_map(function ($value) {
						return ($value !== null && $value !== 0 && $value !== '0000-00-00')
							? $value
							: '';
					}, $row);

					fputcsv($output, $filteredRow, ';');
				}
			}

			fclose($output);
			exit;
		}
		catch (\Exception $e)
		{
			$this->setRedirect($this->redirect, $e->getMessage(), 'error');
		}


	}
}