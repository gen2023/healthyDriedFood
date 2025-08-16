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

\defined('_JEXEC') or die;

use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Form\Field\ListField;

class CharacteristicsField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected $type = 'characteristics';

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
		if ($this->_options === null) {
			$bootstrapFile = JPATH_SITE . '/components/com_jshopping/bootstrap.php';

			if (!File::exists($bootstrapFile)) return array();

			require_once $bootstrapFile;

			// Prepare options
			$options = parent::getOptions();
			foreach (\JSFactory::getAllProductExtraField() as $item)
			{
				$option        = new \stdClass();
				$option->value = $item->id;
				$option->text  = $item->name;

				$options[] = $option;
			}

			$this->_options = $options;

		}

		return $this->_options;
	}
}