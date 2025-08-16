<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Field\Modal;

\defined('_JEXEC') or die;

use Joomla\CMS\Form\FormField;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\Component\NevigenAudit\Administrator\Traits\ModalFieldTrait;

class UserField extends FormField
{
	use ModalFieldTrait;

	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'modal_user';

	/**
	 * Method to prepare field data.
	 *
	 * @since  1.0.0
	 */
	protected function prepareFieldData()
	{
		if (empty($this->hint))
		{
			$this->hint = Text::_('COM_NEVIGEN_AUDIT_USER_SELECT');
		}

		$this->links['select']  = Route::link('administrator', 'index.php?option=com_nevigen_audit&view=users', false);
		$this->titles['select'] = 'COM_NEVIGEN_AUDIT_USERS';
		$this->iconSelect = 'icon-user';

		$this->links['data'] = Route::link('administrator', 'index.php?option=com_nevigen_audit&task=users.getModalData', false);


		$this->tasksPrefix = 'users';
	}
}