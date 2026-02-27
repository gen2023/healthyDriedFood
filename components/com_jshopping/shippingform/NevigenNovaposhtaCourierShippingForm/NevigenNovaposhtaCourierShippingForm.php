<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.4.0
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
		$valueCity      = (isset($params['nevigen_novaposhta_city'])) ? $params['nevigen_novaposhta_city'] : '';
		$valueStreet    = (isset($params['nevigen_novaposhta_street'])) ? $params['nevigen_novaposhta_street'] : '';
		$valueHouse     = (isset($params['nevigen_novaposhta_house'])) ? $params['nevigen_novaposhta_house'] : '';
		$valueApartment = (isset($params['nevigen_novaposhta_apartment'])) ? $params['nevigen_novaposhta_apartment'] : '';


		echo \Joomla\CMS\Layout\LayoutHelper::render(
			'plugins.jshopping.nevigen_novaposhta.NevigenNovaposhtaCourierShippingForm.form',
			[
				'shippingId'     => $shipping_id,
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
				$this->setErrorMessage(Text::sprintf('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_FORM_FIELD', $name));

				return false;
			}
		}

		$dataCity = NevigenNovaposhtaHelper::getCity($params['nevigen_novaposhta_city']);

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

		$result                                 = [];
		$result['nevigen_novaposhta_city']      = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_LABEL_CITY');
		$result['nevigen_novaposhta_street']    = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_STREET');
		$result['nevigen_novaposhta_house']     = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_HOUSE');
		$result['nevigen_novaposhta_apartment'] = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_APARTMENT');

		return $result;
	}
}