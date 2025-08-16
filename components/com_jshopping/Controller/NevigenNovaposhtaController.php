<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\Jshopping\Site\Controller;

\defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\Response\JsonResponse;
use Joomla\CMS\Session\Session;
use Joomla\Plugin\JShopping\NevigenNovaposhta\Helper\NevigenNovaposhtaHelper;

class NevigenNovaposhtaController extends BaseController
{
	public function __construct($config = array(), \Joomla\CMS\MVC\Factory\MVCFactoryInterface $factory = null, $app = null, $input = null)
	{
		parent::__construct($config, $factory, $app, $input);

		// Load language
		$this->app->getLanguage()->load('addon_nevigen_novaposhta', JPATH_SITE);
	}

	/**
	 * Calculation
	 *
	 * @since  1.0.0
	 */
	public function calculation()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}
		$postcode = $this->input->getString('postcode');

		if (empty($postcode))
		{
			return $this->setJSONResponse('', Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_POSTCODE'), true);
		}
		$type = $this->input->getString('type', '');
		if (!empty($type))
		{
			$result = NevigenNovaposhtaHelper::calculateUkraine($postcode, $type);
			if ($result === true){
				return $this->setJSONResponse(['price_string' => 0]);
			}
			else
			{
				if (!empty($result))
				{
					return $this->setJSONResponse($result);
				}
			}
		}

		return $this->setJSONResponse('', Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_CALCULATE'), true);
	}

	public function searchCity()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}

		$value = $this->input->getString('value');
		if (empty($value))
		{
			return $this->setJSONResponse('', Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_SEARCH_CITY_VALUE'), true);
		}

		$data = NevigenNovaposhtaHelper::searchCity($value);

		if (!empty($data))
		{
			return $this->setJSONResponse($data);
		}

		return $this->setJSONResponse('', '', true);
	}

	public function getPostcodeByRef()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}

		$ref = $this->input->getString('ref');
		if (empty($ref))
		{
			return $this->setJSONResponse('', Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_SEARCH_CITY_VALUE'), true);
		}

		$data = NevigenNovaposhtaHelper::getPostcodeByRef($ref);

		if (!empty($data))
		{
			return $this->setJSONResponse($data);
		}

		return $this->setJSONResponse('', '', true);
	}

	/**
	 * Get warehouses
	 *
	 * @since  1.0.0
	 */
	public function getWarehouses()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}

		$postcode = $this->input->getString('postcode');

		if (empty($postcode))
		{
			$message = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_POSTCODE');
			if ((int)NevigenNovaposhtaHelper::config('type_search',0) === 1){
				$message = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_CITY');
			}
			return $this->setJSONResponse('', $message, true);
		}

		$data = NevigenNovaposhtaHelper::getWarehouses($postcode);

		if (!empty($data))
		{
			return $this->setJSONResponse($data);
		}

		return $this->setJSONResponse('', 'Error get warehouses', true);
	}

	/**
	 * Get postomat
	 *
	 * @since  1.3.0
	 */
	public function getPostomat()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}

		$postcode = $this->input->getString('postcode');

		if (empty($postcode))
		{
			$message = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_POSTCODE');
			if ((int)NevigenNovaposhtaHelper::config('type_search',0) === 1){
				$message = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_CITY');
			}
			return $this->setJSONResponse('', $message, true);
		}

		$data = NevigenNovaposhtaHelper::getPostomat($postcode);

		if (!empty($data))
		{
			return $this->setJSONResponse($data);
		}

		return $this->setJSONResponse('', 'Error get postomat', true);
	}


	/**
	 * Get streets
	 *
	 * @since  1.0.0
	 */
	public function getStreets()
	{
		if (!Session::checkToken())
		{
			return $this->setJSONResponse('', Text::_('JINVALID_TOKEN'), true);
		}

		$postcode = $this->input->getString('postcode');
		$value    = $this->input->getString('value');
		if (empty($postcode))
		{
			return $this->setJSONResponse('', Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_POSTCODE'), true);
		}
		if (!empty($value))
		{
			$data = NevigenNovaposhtaHelper::getStreets($postcode, $value);
		}
		if (!empty($data))
		{
			return $this->setJSONResponse($data);
		}

		return $this->setJSONResponse('', '', true);
	}


	/**
	 * Method to set json response.
	 *
	 * @param   mixed   $response  Response data
	 * @param   string  $msg       Message.
	 * @param   bool    $error     Has error.
	 *
	 * @throws  \Exception
	 *
	 * @return  true True on success, Exception on failure.
	 *
	 * @since  1.0.0
	 */
	public function setJSONResponse($response = null, $msg = null, $error = false): bool
	{
		header('Content-Type: application/json');
		echo new JsonResponse($response, $msg, $error);
		$this->app->close(($error) ? 500 : 200);

		return (!$error);
	}
}
