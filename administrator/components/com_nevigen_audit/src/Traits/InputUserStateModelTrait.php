<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\Traits;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;

trait InputUserStateModelTrait
{
	/**
	 * Gets the value of a user state variable and sets it in the session.
	 *
	 * @param   string  $key        The key of the user state variable.
	 * @param   string  $request    The name of the variable passed in a request.
	 * @param   string  $default    The default value for the variable if not found. Optional.
	 * @param   string  $type       Filter for the variable, for valid values.
	 * @param   bool    $resetPage  If true, the limitstart in request is set to zero
	 *
	 * @throws  \Exception
	 *
	 * @return  mixed  The request user state.
	 *
	 * @since  1.0.0
	 */
	public function getUserStateFromRequest($key, $request, $default = null, $type = 'none', $resetPage = true)
	{
		$app = Factory::getApplication();
		if (empty($app->input->get('filter', [], 'array')))
		{
			return parent::getUserStateFromRequest($key, $request, $default, $type, $resetPage);
		}

		$set_state = $app->input->get($request, null, $type);
		$new_state = parent::getUserStateFromRequest($key, $request, $default, $type, $resetPage);

		if ($new_state == $set_state)
		{
			return $new_state;
		}

		$app->setUserState($key, $set_state);

		return $set_state;
	}
}
