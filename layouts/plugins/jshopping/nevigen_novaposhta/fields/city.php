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
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Session\Session;

$app = Factory::getApplication();

// Load asses autocomplete
/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
$assets = $app->getDocument()->getWebAssetManager();
/** @var \Joomla\CMS\WebAsset\WebAssetRegistry $assetsRegistry */
$assetsRegistry = $assets->getRegistry();
$assetsRegistry->addExtensionRegistryFile('plg_jshopping_nevigen_novaposhta');
$assets->usePreset('nevigen_novaposhta.fields.city');

//Set options
$app->getDocument()->addScriptOptions(
	'nevigen_novaposhta',
	[
		'controller' => Route::link('site', 'index.php?option=com_jshopping', false),
		'csrf'       => Session::getFormToken(),
	]
);
$oninput = ' oninput="window.NevigenNovaposhtaFieldCity.searchCity(this)"';
$displayData['dataAttribute'] .= $oninput;
?>

<div data-nevigen-novaposhta-autocomplete="city">
	<?php echo LayoutHelper::render('joomla.form.field.text', $displayData); ?>
</div>
