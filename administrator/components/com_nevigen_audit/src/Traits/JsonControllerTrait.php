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

use Joomla\CMS\Application\CMSApplication;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormFactoryInterface;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Log\Log;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\CMS\Response\JsonResponse;
use Joomla\CMS\Session\Session;
use Joomla\Input\Input;
use Joomla\Input\Json;

trait JsonControllerTrait
{
	/**
	 * Response code.
	 *
	 * @var  int|null
	 *
	 * @since  1.0.0
	 */
	protected ?int $code = null;

	/**
	 * Constructor.
	 *
	 * @param   array                      $config       An optional associative array of configuration settings.
	 * @param   MVCFactoryInterface|null   $factory      The factory.
	 * @param   CMSApplication|null        $app          The Application for the dispatcher
	 * @param   Input|null                 $input        Input
	 * @param   FormFactoryInterface|null  $formFactory  The form factory.
	 *
	 * @throws \Exception
	 *
	 * @since   1.0.0
	 */
	public function __construct(
		$config = [],
		MVCFactoryInterface $factory = null,
		?CMSApplication $app = null,
		?Input $input = null,
		FormFactoryInterface $formFactory = null
	)
	{
		$this->addJsonInput();
		parent::__construct($config, $factory, $app, $input);
	}

	protected function addJsonInput()
	{
		// Add json input
		$app = Factory::getApplication();
		if ($data = new Json())
		{
			foreach ($data->getArray() as $name => $value)
			{
				$app->input->def($name, $value);
			}
		}
	}

	/**
	 * Method to set json response.
	 *
	 * @param   mixed  $response  Response data.
	 *
	 * @throws  \Exception
	 *
	 * @return  bool True on success, False on failure.
	 *
	 * @since  1.0.0
	 */
	protected function setJsonResponse($response = null): bool
	{
		// Prepare data.
		$message = (is_array($this->message)) ? implode(PHP_EOL, $this->message) : $this->message;
		$code    = (!empty($this->code)) ? $this->code : 200;
		$error   = ($code !== 200);

		// Add error log
		if ($error && !empty($this->logfile))
		{
			// Add logger
			Log::addLogger([
				'text_file'         => $this->logfile . '.php',
				'text_entry_format' => "{DATETIME}\t{CLIENTIP}\t{MESSAGE}\t{PRIORITY}"],
				Log::ALL, [$this->logfile]);

			Log::add($message, Log::ERROR, $this->logfile);
		}

		// Send response
		header('Content-Type: application/json');
		echo new JsonResponse($response, $message, $error);
		Factory::getApplication()->close($code);

		return ($error);
	}

	/**
	 * Method to check ajax token and close app in failure.
	 *
	 * @throws \Exception
	 *
	 * @since 1.0.0
	 */
	protected function checkAjaxToken()
	{
		// Check token
		if (!Session::checkToken('POST'))
		{
			$this->message = Text::_('JINVALID_TOKEN_NOTICE');
			$this->code    = 401;

			$this->setJsonResponse();
		}
	}
}