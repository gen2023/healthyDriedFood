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
use Joomla\CMS\Language\Text;

trait ModalFieldTrait
{
	/**
	 * Field selector.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected string $selector = '{FIELD_SELECTOR}';

	/**
	 * Field links.
	 *
	 * @var  array
	 *
	 * @since  1.0.0
	 */
	protected array $links = [];

	/**
	 * Modal window titles.
	 *
	 * @var  array
	 *
	 * @since  1.0.0
	 */
	protected array $titles = [
		'select' => 'JSELECT',
		'create' => 'JACTION_CREATE',
		'edit'   => 'JACTION_EDIT',
	];

	/**
	 * Select item function.
	 *
	 * @var  array
	 *
	 * @since  1.0.0
	 */
	protected array $functions = [
		'select' => 'NevigenAuditFieldModal.selectItem',
		'create' => 'NevigenAuditFieldModal.processItem',
		'edit'   => 'NevigenAuditFieldModal.processItem',
	];

	/**
	 * Language filter.
	 *
	 * @var  string|null
	 *
	 * @since  1.0.0
	 */
	protected ?string $language = null;

	/**
	 * Currency filter.
	 *
	 * @var  string|null
	 *
	 * @since  1.0.0
	 */
	protected ?string $currency = null;

	/**
	 * Form tasks prefix.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected string $tasksPrefix = 'item';

	/**
	 * Load image.
	 *
	 * @var  bool
	 *
	 * @since  1.0.0
	 */
	protected bool $image = false;

	/**
	 * Display only icons.
	 *
	 * @var  bool
	 *
	 * @since  1.0.0
	 */
	protected bool $icons = false;

	/**
	 * Field buttons.
	 *
	 * @var  array
	 *
	 * @since  1.0.0
	 */
	protected array $buttons;

	/**
	 * Onload field attribute.
	 *
	 * @var  string|null
	 *
	 * @since  1.0.0
	 */
	protected ?string $onload = null;

	/**
	 * Load language file.
	 *
	 * @var  string|null
	 *
	 * @since  1.0.0
	 */
	protected string $languageFile = 'com_NevigenAudit';

	/**
	 * Onload field attribute.
	 *
	 * @var  bool
	 *
	 * @since  1.0.0
	 */
	protected bool $dynamic = true;

	/**
	 * Icon button select.
	 *
	 * @var  string
	 *
	 * @since  1.0.0
	 */
	protected string $iconSelect = 'icon-file';

	/**
	 * Method to attach a Form object to the field.
	 *
	 * @param   \SimpleXMLElement  $element  The SimpleXMLElement object representing the `<field>` tag.
	 * @param   mixed              $value    The form field value to validate.
	 * @param   string             $group    The field name group control value.
	 *
	 * @return  bool  True on success.
	 *
	 * @since  1.0.0
	 */
	public function setup(\SimpleXMLElement $element, $value, $group = null): bool
	{
		if ($return = parent::setup($element, $value, $group))
		{
			$this->selector = (!empty($this->element['selector'])) ? (string) $this->element['selector']
				: $this->selector;

			$this->currency = (!empty($this->element['currency'])) ? (string) $this->element['currency']
				: $this->currency;

			$this->image = (!empty($this->element['image'])) ? ((string) $this->element['image'] === 'true')
				: $this->image;

			$this->icons = (!empty($this->element['icons'])) ? ((string) $this->element['icons'] === 'true')
				: $this->icons;

			$this->buttons = (!empty($this->element['buttons'])) ? explode(',', (string) $this->element['buttons'])
				: ['select', 'create', 'edit', 'clear'];

			$this->onload = (!empty($this->element['onload'])) ? (string) $this->element['onload']
				: $this->onload;

			if ((!empty($this->element['dynamic']) && (string) $this->element['dynamic'] === 'false'))
			{
				$this->dynamic = false;
			}

			if (!empty($this->element['iconSelect']))
			{
				$this->iconSelect = $this->element['iconSelect'];
			}

			$this->prepareFieldData();

			if (empty($this->layout))
			{
				$this->layout = 'components.nevigen_audit.field.modal';
			}
		}

		return $return;
	}

	/**
	 * Method to prepare field data.
	 *
	 *
	 * @since  1.0.0
	 */
	abstract function prepareFieldData();

	/**
	 * Method to get the data to be passed to the layout for rendering.
	 *
	 * @throws  \Exception
	 *
	 * @return  array Layout data array.
	 *
	 * @since  1.0.0
	 */
	protected function getLayoutData()
	{
		if (!empty($this->languageFile))
		{
			Factory::getApplication()->getLanguage()->load($this->languageFile);
		}

		if ($data = parent::getLayoutData())
		{
			$links = [];
			if (!empty($this->links))
			{
				foreach ($this->links as $type => $link)
				{
					if (strpos($link, '?') === false)
					{
						$link .= '?';
					}

					if (!empty($this->language))
					{
						$link .= '&forcedLanguage=' . $this->language;
					}

					if (!empty($this->currency))
					{
						$link .= '&currency=' . $this->currency;
					}

					if ($type !== 'data')
					{
						$link .= '&layout=modal';
						$link .= '&tmpl=component';
					}

					if ($type === 'select' && !empty($this->functions[$type]))
					{
						$link .= '&function=' . $this->functions[$type];
					}

					$links[$type] = str_replace('?&', '?', $link);
				}
			}

			$titles = [];
			if (!empty($this->titles))
			{
				foreach ($this->titles as $type => $title)
				{
					if (!empty($title))
					{
						$title         = Text::_($title);
						$titles[$type] = $title;
					}
				}
			}

			$data['selector']    = $this->selector;
			$data['links']       = $links;
			$data['titles']      = $titles;
			$data['functions']   = $this->functions;
			$data['language']    = $this->language;
			$data['currency']    = $this->currency;
			$data['image']       = $this->image;
			$data['icons']       = $this->icons;
			$data['buttons']     = $this->buttons;
			$data['tasksPrefix'] = $this->tasksPrefix;
			$data['onload']      = $this->onload;
			$data['dynamic']     = $this->dynamic;
			$data['iconSelect']  = $this->iconSelect;
		}

		return $data;
	}
}