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
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\MVC\Controller\AdminController;
use Joomla\Component\Jshopping\Administrator\Model\OrdersModel;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\OrderChangeStatusModel;
use Joomla\Component\NevigenAudit\Administrator\Traits\JsonControllerTrait;


class OrdersController extends AdminController
{
	use JsonControllerTrait;

	public function add()
	{
		$this->checkToken();
		$this->setRedirect('index.php?option=com_jshopping&controller=orders&task=add&return='
			. base64_encode('index.php?option=com_nevigen_audit&view=orders'));
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
			$this->getLogger()->warning(Text::_('COM_NEVIGEN_AUDIT_ORDERS_NO_ITEM_SELECTED'), ['category' => 'jerror']);
		}
		else
		{
			JSFactory::loadAdminLanguageFile();

			// Get the model.
			/** @var OrdersModel $model */
			$model = JSFactory::getModel('orders');
			$model->deleteList($cid);
		}

		$this->setRedirect('index.php?option=com_nevigen_audit&view=orders');
	}

	public function updateStatus()
	{
		// Check for request forgeries
		$this->checkToken();

		$data = $this->input->get('update_status', [], 'array');
		$cid  = $this->input->get('cid', [], 'array');
		if (empty($data))
		{
			return false;
		}
		$batch_orders = $this->input->getInt('batch_orders', 0);
		if (!isset($data['notify']))
		{
			$data['notify'] = null;
		}

		if ($batch_orders === 1 && !empty($cid))
		{
			foreach ($cid as $id)
			{
				$this->changeStatus($data['order_id'], $data['order_status'], $data['order_status_old'], $data['notify']);
			}
		}
		else
		{
			$this->changeStatus($data['order_id'], $data['order_status'], $data['order_status_old'], $data['notify']);
		}

		JSFactory::loadAdminLanguageFile();

		$this->setRedirect('index.php?option=com_nevigen_audit&view=orders',
			Text::_('JSHOP_ORDER_STATUS_CHANGED'));

		return true;
	}

	public function orderQuickView()
	{
		$id = $this->input->getInt('id', 0);
		if (empty($id))
		{
			$this->message = 'Order not found';
			$this->code    = 404;

			return $this->setJsonResponse();
		}

		$order = JSFactory::getTable('order');
		if (!$order->load($id))
		{
			$this->message = 'Order not found';
			$this->code    = 404;

			return $this->setJsonResponse();
		}
		$jshopConfig = JSFactory::getConfig();
		$order->loadItemsNewDigitalProducts();
		$order->client_type_name = $order->getClientTypeName();
		$order->payment_name = $order->getPaymentName();
		$order->order_tax_list = $order->getTaxExt();
		$order->coupon_code = $order->getCouponCode();
		if (!$order->order_id){
			$order->display_price = $jshopConfig->display_price_front;
		}
		$order_items = $order->getAllItems();

		$this->app->triggerEvent('onBeforeDisplayOrderAdmin', array(&$order, &$order_items));

		$view                            = new \stdClass();
		$view->order                     = $order;
		$view->order_items               = $order_items;
		$view->_tmp_ext_subtotal         = "";
		$view->_tmp_html_after_subtotal  = "";
		$view->_tmp_ext_discount_text    = "";
		$view->_tmp_ext_discount         = "";
		$view->_tmp_ext_shipping_package = "";
		$view->_tmp_html_after_total     = "";

		$this->app->triggerEvent('onBeforeShowOrder', array(&$view));

		JSFactory::loadAdminLanguageFile();

		return $this->setJsonResponse(LayoutHelper::render('components.nevigen_audit.administrator.orders.order_quick_view',
			[
				'config' => $jshopConfig,
				'data'   => $view,
				'order'  => $order,
				'items'  => $order_items,
			]));
	}

	protected function changeStatus($order_id, $new_status_id, $old_status_id, $notify)
	{
		$sendmessage = $notify;

		/** @var OrderChangeStatusModel $model */
		$model = JSFactory::getModel('orderchangestatus', 'Site');
		$model->setData($order_id, $new_status_id, $sendmessage, $old_status_id, $notify);
		$model->setAppAdmin(1);
		$model->store();
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
	public function getModel($name = 'Orders', $prefix = 'Administrator', $config = ['ignore_request' => true])
	{
		return parent::getModel($name, $prefix, $config);
	}
}