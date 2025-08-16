<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Date\Date;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;

extract($displayData);

/**
 * Layout variables
 * -----------------
 * @var   string $autocomplete   Autocomplete attribute for the field.
 * @var   bool   $autofocus      Is autofocus enabled?
 * @var   string $class          Classes for the input.
 * @var   string $description    Description of the field.
 * @var   bool   $disabled       Is this field disabled?
 * @var   string $group          Group the field belongs to. <fields> section in form XML.
 * @var   bool   $hidden         Is this field hidden in the form?
 * @var   string $hint           Placeholder for the field.
 * @var   string $id             DOM id of the field.
 * @var   string $label          Label of the field.
 * @var   string $labelclass     Classes to apply to the label.
 * @var   bool   $multiple       Does this field support multiple values?
 * @var   string $name           Name of the input field.
 * @var   string $onchange       Onchange attribute for the field.
 * @var   string $onclick        Onclick attribute for the field.
 * @var   string $pattern        Pattern (Reg Ex) of value of the form field.
 * @var   bool   $readonly       Is this field read only?
 * @var   bool   $repeat         Allows extensions to duplicate elements.
 * @var   bool   $required       Is this field required?
 * @var   int    $size           Size attribute of the input.
 * @var   bool   $spellcheck     Spellcheck state for the form field.
 * @var   string $validate       Validation rules to apply.
 * @var   array  $value          Value attribute of the field.
 * @var   array  $checkedOptions Options that will be set as checked.
 * @var   bool   $hasValue       Has this field a value assigned?
 * @var   array  $options        Options available for this field.
 *
 * Field specific variables
 * @var  string  $locale         Field localization.
 */

/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
$document       = Factory::getApplication()->getDocument();
$assets         = $document->getWebAssetManager();
$assetsRegistry = $assets->getRegistry();

$assetsRegistry->addExtensionRegistryFile('com_nevigen_audit');
$assets->usePreset('com_nevigen_audit.fields.date.period');


$dateFormat = Text::_('DATE_FORMAT_LC4');
if (!empty($value))
{
	$value['display'] = [];
	if (!empty($value['from']))
	{
		$value['from']      = (new Date($value['from']))->format($dateFormat);
		$value['display'][] = $value['from'];
	}
	if (!empty($value['to']))
	{
		$value['to']        = (new Date($value['to']))->format($dateFormat);
		$value['display'][] = $value['to'];
	}
}

$document->addScriptOptions($id, [
	'locale'     => $locale,
	'dateFormat' => $dateFormat,
	'defaultDate'    => (!empty($value['display'])) ? $value['display'] : [],
]);
?>
<div id="<?php echo $id . '_container'; ?>" nevigen-audit-field-date-period="container" data-selector="<?php echo $id; ?>">
	<div class="input-group" nevigen-audit-field-date-period="wrapper">
		<?php echo LayoutHelper::render('joomla.form.field.text', [
			'id'            => $id,
			'name'          => null,
			'value'         => (!empty($value['display'])) ? implode(' — ', $value['display']) : '',
			'onchange'      => false,
			'required'      => $required,
			'disabled'      => false,
			'options'       => [],
			'charcounter'   => false,
			'readonly'      => true,
			'hint'          => $hint,
			'autofocus'     => false,
			'spellcheck'    => false,
			'addonBefore'   => null,
			'addonAfter'    => null,
			'dirname'       => null,
			'dataAttribute' => 'data-input nevigen-audit-field-date-period="input-display"'
		]); ?>
		<button class="btn btn-outline-secondary" type="button" data-toggle>
			<i class="icon-calendar"></i>
		</button>
		<button class="btn btn-outline-secondary" type="button" data-clear>
			<i class="icon-cancel"></i>
		</button>
	</div>
	<?php foreach (['from', 'to'] as $key)
	{
		echo LayoutHelper::render('joomla.form.field.hidden', [
			'id'            => $id . '_' . $key,
			'name'          => $name . '[' . $key . ']',
			'value'         => (!empty($value[$key])) ? $value[$key] : '',
			'onchange'      => (!empty($onchange) && $key === 'from') ? $onchange : false,
			'required'      => (!empty($required)) ? $required : false,
			'disabled'      => false,
			'dataAttribute' => 'nevigen-audit-field-date-period="input-' . $key . '"',
		]);
	} ?>
</div>

