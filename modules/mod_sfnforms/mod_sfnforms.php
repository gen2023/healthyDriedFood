<?php

defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Language\Text;

// Load our helper file
require_once dirname(__FILE__) . '/helper.php';

// Load jQuery
if ($params->get('jquery')) {
	HTMLHelper::_('jquery.framework');
}

// Load form validation
HTMLHelper::_('behavior.formvalidator');

// Load our scripts
modSFNFormsHelper::loadJS('jquery.validate');
modSFNFormsHelper::loadJS('sfnforms');

// Load our stylesheet
modSFNFormsHelper::loadCSS('sfnforms');

// Load extra scripts & stylesheets
$document = Factory::getDocument();
if ($css = $params->get('css')) {
	$document->addStyleDeclaration($css);
}
if ($js = $params->get('js')) {
	$document->addScriptDeclaration($js);
}

// Get a unique id for the module to be used as a suffix
$uniqid = $module->id;

$array_fields = $params->get('setkalist');

// Define parameters
$form_pre_text = $params->get('form_pre');
$form_post_text = $params->get('form_post');
$required_marker = $params->get('req_marker');
$show_send_copy = $params->get('send_copy');
$show_send_copy_to_self = $show_send_copy == 2;
$auto_width = $params->get('auto_width');
$form_horizontal = $params->get('form_h');
$show_captcha = $params->get('captcha');
$show_display_consent = $params->get('display_consent');
$moduleclass_sfx = $params->get('moduleclass_sfx');
$thank_you_modal = $params->get('thank_you_modal');
$consent_text = $params->get('consent_text',Text::_('MOD_SFNFORMS_DISPLAY_CONSENT_FRONT'));

$options = '';

$document->addScriptDeclaration(
	"jQuery(function() {
		SFNForms.init({$uniqid});
	});"
);

require ModuleHelper::getLayoutPath('mod_sfnforms', $params->get('layout', 'default'));