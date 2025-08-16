<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\Task\NevigenAudit\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Form\Form;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\OrderChangeStatusModel;
use Joomla\Component\NevigenAudit\Administrator\Helper\ParamsHelper;
use Joomla\Component\Scheduler\Administrator\Event\ExecuteTaskEvent;
use Joomla\Component\Scheduler\Administrator\Task\Status;
use Joomla\Component\Scheduler\Administrator\Traits\TaskPluginTrait;
use Joomla\Database\DatabaseAwareTrait;
use Joomla\Database\ParameterType;
use Joomla\Event\SubscriberInterface;
use Joomla\Utilities\ArrayHelper;

class NevigenAudit extends CMSPlugin implements SubscriberInterface
{
	use TaskPluginTrait;
	use DatabaseAwareTrait;

	/**
	 * Load the language file on instantiation.
	 *
	 * @var    bool
	 *
	 * @since  1.2.0
	 */
	protected $autoloadLanguage = true;

	protected string $formPath = JPATH_PLUGINS . '/task/nevigen_audit/forms';

	/**
	 * @var string[]
	 *
	 * @since 1.2.0
	 */
	protected const TASKS_MAP = [
		'nevigen_audit.change_order_status' => [
			'langConstPrefix' => 'PLG_TASK_NEVIGEN_AUDIT_CHANGE_ORDER_STATUS',
			'method'          => 'changeOrderStatuses',
		]
	];

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 *
	 * @since 1.2.0
	 */
	public static function getSubscribedEvents(): array
	{
		return [
			'onTaskOptionsList'               => 'advertiseRoutines',
			'onExecuteTask'                   => 'standardRoutineHandler',
			'onContentPrepareForm'            => 'enhanceTaskItemForm',
			'onNevigenAuditPrepareConfigForm' => 'onNevigenAuditPrepareConfigForm',
		];
	}

	public function onNevigenAuditPrepareConfigForm(Form $form, $data)
	{
		$config = $this->formPath . '/com_nevigen_audit.config.xml';
		if (is_file($config))
		{
			$form->loadFile($config);
		}
	}

	/**
	 * Method to change orders statuses
	 *
	 * @throws \Exception
	 *
	 * @return integer  The routine exit code.
	 *
	 * @since  1.2.0
	 *
	 */
	private function changeOrderStatuses(ExecuteTaskEvent $event): int
	{
		$params = ParamsHelper::getComponentParams();
		if (empty($params))
		{
			return Status::KNOCKOUT;
		}

		$params = $params->get('tasks', new \stdClass());
		if (empty($params) || empty($params->change_order_status) || empty($params->change_order_status->statuses))
		{

			return Status::KNOCKOUT;
		}
		$params    = $params->change_order_status;
		$statuses  = ArrayHelper::fromObject($params->statuses);
		$bootstrap = JPATH_ROOT . '/components/com_jshopping/bootstrap.php';
		if (!is_file($bootstrap))
		{
			return Status::KNOCKOUT;
		}

		require_once($bootstrap);

		$comment = Text::_('PLG_TASK_NEVIGEN_AUDIT_CHANGE_ORDER_STATUS_LABEL');
		$title   = Text::_('PLG_TASK_NEVIGEN_AUDIT_CHANGE_ORDER_STATUS_TITLE');
		foreach ($statuses as $status => $data)
		{
			if (empty($data['new']) || empty($data['days']))
			{
				$this->logTask($title . ' - Skip status id:' . $status . 'empty params', 'error');

				continue;
			}

			$db    = $this->getDatabase();
			$days  = (int) $data['days'];
			$query = $db->getQuery(true)
				->select('order_id')
				->from($db->quoteName('#__jshopping_orders'))
				->where('order_status = :order_status')
				->where('order_m_date <= DATE_SUB(NOW(), INTERVAL :days DAY)')
				->bind(':order_status', $status, ParameterType::INTEGER)
				->bind(':days', $days, ParameterType::INTEGER);

			$ids = $db->setQuery($query)->loadColumn();
			$db->disconnect();

			if (empty($ids))
			{
				$this->logTask($title . ' - Skip empty orders need change status:' . $status);

				continue;
			}

			$notify = (isset($data['notification'])) ? (int) $data['notification'] : 0;

			foreach ($ids as $id)
			{
				try
				{
					/** @var OrderChangeStatusModel $model */
					$model = JSFactory::getModel('OrderChangeStatus', 'Site');
					$model->setData($id, $data['new'], $notify, $status, $notify, $comment);
					$model->setAppAdmin(1);
					$model->store();
				}
				catch (\Exception $e)
				{
					$this->logTask($title . ' - Error save order end send notification ID:' . $id);

					continue;
				}
			}
		}

		$this->logTask($title . ' finished');

		return Status::OK;
	}
}
