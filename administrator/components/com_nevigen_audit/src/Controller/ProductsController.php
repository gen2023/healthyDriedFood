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

use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Controller\AdminController;
use Joomla\Component\Jshopping\Administrator\Model\ProductsModel;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Utilities\ArrayHelper;

class ProductsController extends AdminController
{

	/**
	 * Method to publish a list of items
	 *
	 * @return  void
	 *
	 * @since   1.0.0
	 */
	public function publish()
	{
		// Check for request forgeries
		$this->checkToken();

		// Get items to publish from the request.
		$cid   = (array) $this->input->get('cid', [], 'int');
		$data  = ['publish' => 1, 'unpublish' => 0];
		$task  = $this->getTask();
		$value = ArrayHelper::getValue($data, $task, 0, 'int');

		// Remove zero values resulting from input filter
		$cid = array_filter($cid);

		if (empty($cid))
		{
			$this->setMessage(Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_NO_ITEM_SELECTED'), 'warning');
		}
		else
		{
			JSFactory::loadAdminLanguageFile();

			/** @var ProductsModel $model */
			$model = JSFactory::getModel('products');
			// Change the state of the records.
			$model->publish($cid, $value);
			if (!empty($model->getError()))
			{
				$this->setMessage($model->getError(), 'error');
			}
			else
			{
				if ($value == 1)
				{
					$this->setMessage(Text::plural('COM_NEVIGEN_AUDIT_PRODUCTS_N_ITEMS_PUBLISHED', \count($cid)));
				}
				elseif ($value == 0)
				{
					$this->setMessage(Text::plural('COM_NEVIGEN_AUDIT_PRODUCTS_N_ITEMS_UNPUBLISHED', \count($cid)));
				}
			}
		}

		$this->setRedirect('index.php?option=com_nevigen_audit&view=products');
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
			$this->getLogger()->warning(Text::_('COM_NEVIGEN_AUDIT_PRODUCTS_NO_ITEM_SELECTED'), ['category' => 'jerror']);
		}
		else
		{
			JSFactory::loadAdminLanguageFile();

			// Get the model.
			/** @var ProductsModel $model */
			$model = JSFactory::getModel('products');
			$model->deleteList($cid);
		}

		$this->setRedirect('index.php?option=com_nevigen_audit&view=products');
	}

	public function add()
	{
		$this->checkToken();
		$this->setRedirect('index.php?option=com_jshopping&controller=products&task=add&return='
			. base64_encode('index.php?option=com_nevigen_audit&view=products'));
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
	public function getModel($name = 'Products', $prefix = 'Administrator', $config = ['ignore_request' => true])
	{
		return parent::getModel($name, $prefix, $config);
	}
}