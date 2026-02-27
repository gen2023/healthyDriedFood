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

class NevigenNovaposhtaPostomatShippingForm extends ShippingFormRoot
{
	public function showForm($shipping_id, $shippinginfo, $params)
	{
		$valueCity      = (isset($params['nevigen_novaposhta_city'])) ? $params['nevigen_novaposhta_city'] : '';
		$valuePoshtomat = (isset($params['nevigen_novaposhta_postomat'])) ? $params['nevigen_novaposhta_postomat'] : '';
		$postomat       = [];

		if (!empty($valueCity))
		{
			$postomat = NevigenNovaposhtaHelper::getPostomat($valueCity);
		}
		echo \Joomla\CMS\Layout\LayoutHelper::render(
			'plugins.jshopping.nevigen_novaposhta.NevigenNovaposhtaPostomatShippingForm.form',
			[
				'shippingId'     => $shipping_id,
				'postomat'       => $postomat,
				'valueCity'      => $valueCity,
				'valuePoshtomat' => $valuePoshtomat,

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
			if (empty($params[$field]))
			{
				$this->setErrorMessage(Text::sprintf('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_FORM_FIELD', $name));

				return false;
			}
		}


		return true;
	}

	public function getDisplayNameParams()
	{
		// Load language
		Factory::getApplication()->getLanguage()->load('addon_nevigen_novaposhta', JPATH_SITE);

		$result                                 = [];
		$result['nevigen_novaposhta_city']      = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_LABEL_CITY');
		$result ['nevigen_novaposhta_postomat'] = Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_POSTOMAT');

		return $result;
	}
}