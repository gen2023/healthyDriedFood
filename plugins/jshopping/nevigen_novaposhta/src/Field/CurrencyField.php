<?php
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\JShopping\NevigenNovaposhta\Field;

use Joomla\CMS\Factory;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Form\Field\ListField;
use Joomla\Component\Jshopping\Site\Helper\SelectOptions;

class CurrencyField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'currency';


	/**
	 * Field options array.
	 *
	 * @var  array
	 *
	 * @since  1.0.0
	 */
	protected $_options = null;

	/**
	 * Method to get the field options.
	 *
	 * @return  array  The field option objects.
	 *
	 * @since  1.0.0
	 */
	protected function getOptions()
	{
		if ($this->_options === null)
		{
			$bootstrapFile = JPATH_SITE . '/components/com_jshopping/bootstrap.php';

			if (!File::exists($bootstrapFile)) return array();

			require_once $bootstrapFile;

			// Prepare options
			$options = parent::getOptions();
			$items   = SelectOptions::getCurrencies();
			$find    = false;
			if (!empty($items))
			{
				foreach ($items as $item)
				{
					$option        = new \stdClass();
					$option->value = $item->currency_id;
					$option->text  = $item->currency_name;
					if ($find === false && $item->currency_code_iso == 'UAH')
					{
						if (empty($this->value))
						{
							$this->value = $item->currency_id;
						}
						$find = true;
					}


					$options[] = $option;
				}
			}
			$this->_options = $options;

			if ($find === false){
				Factory::getApplication()->enqueueMessage('Для роботи Нова пошта потрібна валюта гривня (Опції -> Валюта -> Сторити)','error');
			}
		}


		return $this->_options;
	}

	/**
	 * Method to get the field input markup for a generic list.
	 * Use the multiple attribute to enable multiselect.
	 *
	 * @return  string  The field input markup.
	 *
	 * @since   1.0.0
	 */
	protected function getInput(): string
	{
		$data = $this->getLayoutData();

		$data['options'] = $this->getOptions();

		if (empty($data['value'])){
			$data['value'] = $this->value;
		}

		return $this->getRenderer($this->layout)->render($data);
	}
}