<?php

/**
 * @package         Joomla.Administrator
 * @subpackage      com_users
 *
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
 * @license         GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\NevigenAudit\Administrator\Service\HTML;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;


// phpcs:disable PSR1.Files.SideEffects
\defined('_JEXEC') or die;
// phpcs:enable PSR1.Files.SideEffects

/**
 * Extended Utility class for the NevigenUsers component.
 *
 * @since  1.0.0
 */
class NevigenUsers
{
	/**
	 * Displays an icon to add a note for this user.
	 *
	 * @param   integer  $userId  The user ID
	 *
	 * @return  string  A link to add a note
	 *
	 * @since   1.0.0
	 */
	public function addNote($userId)
	{
		$title  = Text::_('COM_USERS_ADD_NOTE');
		$return = '&return=' . base64_encode('index.php?option=com_nevigen_audit&view=users');

		return '<a href="' . Route::_('index.php?option=com_users&task=note.add&u_id=' . (int) $userId . $return)
			. '" class="btn btn-secondary btn-sm"><span class="icon-plus pe-1" aria-hidden="true">'
			. '</span>' . $title . '</a>';
	}

	/**
	 * Displays an icon to filter the notes list on this user.
	 *
	 * @param   integer  $userId  The user ID
	 *
	 * @return  string  A link to apply a filter
	 *
	 * @since   1.0.0
	 */
	public function filterNotes($userId)
	{
		$title = Text::_('COM_USERS_FILTER_NOTES');

		return '<a href="' . Route::_('index.php?option=com_users&view=notes&filter[search]=uid:' . (int) $userId)
			. '" class="dropdown-item"><span class="icon-list pe-1" aria-hidden="true"></span>' . $title . '</a>';
	}

	/**
	 * Displays a note icon.
	 *
	 * @param   string   $name    Name of notes for the user
	 * @param   integer  $userId  The user ID
	 *
	 * @return  string  A link to a modal window with the user notes
	 *
	 * @since   1.0.0
	 */
	public function notes(string $name = '', int $userId = 0)
	{
		$title = Text::sprintf('COM_NEVIGEN_AUDIT_USER_NOTES',$name);

		return '<button  type="button" data-bs-target="#userModal_' . (int) $userId . '" id="modal-' . (int) $userId
			. '" data-bs-toggle="modal" class="dropdown-item"><span class="icon-eye pe-1" aria-hidden="true"></span>' . $title . '</button>';
	}

	/**
	 * Renders the modal html.
	 *
	 * @param   integer  $count   The number of notes for the user
	 * @param   integer  $userId  The user ID
	 *
	 * @return  string   The html for the rendered modal
	 *
	 * @since   1.0.0
	 */
	public function notesModal($count, $userId)
	{
		$title  = Text::plural('COM_USERS_N_USER_NOTES', '');
		$footer = '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">'
			. Text::_('JTOOLBAR_CLOSE') . '</button>';

		return HTMLHelper::_(
			'bootstrap.renderModal',
			'userModal_' . (int) $userId,
			[
				'title'       => $title,
				'backdrop'    => 'static',
				'keyboard'    => true,
				'closeButton' => true,
				'footer'      => $footer,
				'url'         => Route::_('index.php?option=com_users&view=notes&tmpl=component&layout=modal&filter[user_id]=' . (int) $userId),
				'height'      => '300px',
				'width'       => '800px',
			]
		);
	}

	/**
	 * Build an array of block/unblock user states to be used by jgrid.state,
	 * State options will be different for any user
	 * and for currently logged in user
	 *
	 * @param   boolean  $self  True if state array is for currently logged in user
	 *
	 * @return  array  a list of possible states to display
	 *
	 * @since  1.0.0
	 */
	public function blockStates($self = false)
	{
		if ($self)
		{
			$states = [
				1 => [
					'task'           => 'unblock',
					'text'           => '',
					'active_title'   => 'COM_USERS_TOOLBAR_BLOCK',
					'inactive_title' => '',
					'tip'            => true,
					'active_class'   => 'unpublish',
					'inactive_class' => 'unpublish',
				],
				0 => [
					'task'           => 'block',
					'text'           => '',
					'active_title'   => '',
					'inactive_title' => 'COM_USERS_USERS_ERROR_CANNOT_BLOCK_SELF',
					'tip'            => true,
					'active_class'   => 'publish',
					'inactive_class' => 'publish',
				],
			];
		}
		else
		{
			$states = [
				1 => [
					'task'           => 'unblock',
					'text'           => '',
					'active_title'   => 'COM_USERS_TOOLBAR_UNBLOCK',
					'inactive_title' => '',
					'tip'            => true,
					'active_class'   => 'unpublish',
					'inactive_class' => 'unpublish',
				],
				0 => [
					'task'           => 'block',
					'text'           => '',
					'active_title'   => 'COM_USERS_TOOLBAR_BLOCK',
					'inactive_title' => '',
					'tip'            => true,
					'active_class'   => 'publish',
					'inactive_class' => 'publish',
				],
			];
		}

		return $states;
	}
}
