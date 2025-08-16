<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\Plugin\JShopping\NevigenNovaposhta\Helper\NevigenNovaposhtaHelper;


class NevigenNovaposhtaCourierShippingForm extends ShippingFormRoot
{
	public function showForm($shipping_id, $shippinginfo, $params)
	{
		$valuePostcode  = (isset($params['nevigen_novaposhta_postcode'])) ? $params['nevigen_novaposhta_postcode'] : '';
		$valueCity      = (isset($params['nevigen_novaposhta_city'])) ? $params['nevigen_novaposhta_city'] : '';
		$valueStreet    = (isset($params['nevigen_novaposhta_street'])) ? $params['nevigen_novaposhta_street'] : '';
		$valueHouse     = (isset($params['nevigen_novaposhta_house'])) ? $params['nevigen_novaposhta_house'] : '';
		$valueApartment = (isset($params['nevigen_novaposhta_apartment'])) ? $params['nevigen_novaposhta_apartment'] : '';
		$typeSearch     = (int) NevigenNovaposhtaHelper::config('type_search', 0);
		if ($typeSearch === 1)
		{
			if (!empty($valueCity))
			{
				$dataCity = NevigenNovaposhtaHelper::searchCity($valueCity);
				if (!empty($dataCity) && !empty($dataCity[0]['ref']))
				{
					$postcode      = NevigenNovaposhtaHelper::getPostcodeByRef($dataCity[0]['ref']);
					$valuePostcode = ($postcode === false) ? '' : $postcode;
				}
			}
			else
			{
				if (!empty($valuePostcode))
				{
					$dataCity = NevigenNovaposhtaHelper::getCity($valuePostcode);
					if (!empty($dataCity))
					{
						$valueCity = $dataCity['name'];
					}
				}
			}

			if (empty($valuePostcode))
			{
				$valueCity = '';
			}
		}


		echo \Joomla\CMS\Layout\LayoutHelper::render(
			'plugins.jshopping.nevigen_novaposhta.NevigenNovaposhtaCourierShippingForm.form',
			[
				'shippingId'     => $shipping_id,
				'typeSearch'     => $typeSearch,
				'valuePostcode'  => $valuePostcode,
				'valueCity'      => $valueCity,
				'valueStreet'    => $valueStreet,
				'valueHouse'     => $valueHouse,
				'valueApartment' => $valueApartment,
			]);

	}

	public function check($params, $sh_method)
	{
		$app      = Factory::getApplication();
		$taskSave = ['save', 'step4save'];
		$task     = $app->input->getString('task');
		if (empty($task) || !in_array($task, $taskSave))
		{
			return true;
		}
		// Load language
		$app->getLanguage()->load('addon_nevigen_novaposhta', JPATH_SITE);

		if (empty($params))
		{
			$this->setErrorMessage(Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_FORM'));

			return false;
		}

		$fieldName = $this->getDisplayNameParams();
		foreach ($fieldName as $field => $name)
		{
			if ($field === 'nevigen_novaposhta_apartment') continue;
			if (empty($params[$field]))
			{
				if ($field === 'nevigen_novaposhta_postcode' && (int) NevigenNovaposhtaHelper::config('type_search') === 1)
				{
					$name = $fieldName['nevigen_novaposhta_city'];
				}

				$this->setErrorMessage(Text::sprintf('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_FORM_FIELD', $name));

				return false;
			}
		}

		$dataCity = NevigenNovaposhtaHelper::getCity($params['nevigen_novaposhta_postcode']);

		if (!empty($dataCity) && empty($dataCity['delivery']))
		{
			$this->setErrorMessage(Text::_('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_CITY_DELIVERY'));

			return false;
		}


		return true;
	}

	public function getDisplayNameParams()
	{
		// Load language
		Factory::getApplication()->getLanguage()->load('addon_nevigen_novaposhta', JPATH_SITE);

		$result                                = [];
		$result['nevigen_novaposhta_postcode'] = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_POSTCODE');
		if ((int) NevigenNovaposhtaHelper::config('type_search') === 1)
		{
			$result['nevigen_novaposhta_city'] = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_LABEL_CITY');
		}
		$result['nevigen_novaposhta_street']    = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_STREET');
		$result['nevigen_novaposhta_house']     = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_HOUSE');
		$result['nevigen_novaposhta_apartment'] = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_APARTMENT');

		return $result;
	}
}