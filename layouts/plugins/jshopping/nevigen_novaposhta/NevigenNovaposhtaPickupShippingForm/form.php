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

use Joomla\CMS\Language\Text;

extract($displayData);

/**
 * Layout variables
 * -----------------
 *
 * @var  int    $shippingId     Shipping id.
 * @var  int    $valuePostcode  Postcode value
 * @var  string $valueCity      City value
 * @var  array  $warehouse      Pickup points array
 * @var  string $valueWarehouse Pickup point value
 * @var  int    $typeSearch     Type search api NP
 *                              0 - postcode city
 *                              1 - city name
 *
 */

$inputClass = 'w-auto nevigen_novaposhta-input-postcode';
$inputId = 'nevigen_novaposhta_postcode_'.$shippingId;
if (($typeSearch === 1))
{
	$inputClass = 'nevigen_novaposhta-input-city';
	$inputId = 'nevigen_novaposhta_postcode_city_'.$shippingId;

	// Load asses autocomplete
	/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
	$assets = \Joomla\CMS\Factory::getApplication()->getDocument()->getWebAssetManager();
	$assets->usePreset('nevigen_novaposhta.autocomplete');
}
?>
<div class="nevigen_novaposhta-pickup-container" data-nevigen-novaposhta-container="<?php echo $shippingId ?>">
	<div data-nevigen-novaposhta-message="<?php echo $shippingId ?>"></div>
	<div class="row g-1">
		<div class="nevigen-novaposhta-pickup-postcode mt-2 <?php echo ($typeSearch === 0) ? 'col-md-2' : 'col-md-4'; ?>">
			<label for="<?php echo $inputId ?>">
				<?php echo ($typeSearch === 0) ? Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_POSTCODE')
					: Text::_('ADDON_NEVIGEN_NOVAPOSHTA_LABEL_CITY') ?>
			</label>
			<?php if ($typeSearch === 0): ?>
				<input type="text" name="params[<?php echo $shippingId ?>][nevigen_novaposhta_postcode]"
					   id="<?php echo $inputId ?>"
					   placeholder="03170"
					   data-nevigen-novaposhta="pickup"
					   onchange="window.NevigenNovaposhta.checkPostcode(this,<?php echo $shippingId ?>)"
					   oninput="window.NevigenNovaposhta.validPostcode(this,<?php echo $shippingId ?>)"
					   class="form-control uk-input w-auto nevigen_novaposhta-input-postcode"
					   value="<?php echo $valuePostcode ?>"/>
				<a class="nevigen_novaposhta-find-postcode small" href="https://index.ukrposhta.ua/find-post-index"
				   target="_blank">
					<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_FIND_ZIP'); ?>
				</a>
			<?php else: ?>
				<div data-nevigen-novaposhta-autocomplete="city">
					<input type="text" name="params[<?php echo $shippingId ?>][nevigen_novaposhta_city]"
						   id="<?php echo $inputId ?>"
						   placeholder="<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_CITY') ?>"
						   class="form-control uk-input <?php echo $inputClass; ?>"
						   oninput="window.NevigenNovaposhta.searchCity(this,<?php echo $shippingId ?>)"
						   data-nevigen-novaposhta="pickup"
						   value="<?php echo $valueCity ?>"/>
				</div>
				<input type="hidden" name="params[<?php echo $shippingId ?>][nevigen_novaposhta_postcode]"
					   id="postcode_<?php echo $shippingId ?>"
					   data-nevigen-novaposhta="pickup"
					   value="<?php echo $valuePostcode ?>"/>
			<?php endif; ?>
		</div>
		<div class="nevigen-novaposhta-pickup-warehouse mt-2 <?php echo ($typeSearch === 0) ? 'col-md-10' : 'col-md-8'; ?>">
			<label for="nevigen_novaposhta_warehouse_<?php echo $shippingId ?>">
				<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_WAREHOUSE'); ?>
			</label>
			<select name="params[<?php echo $shippingId; ?>][nevigen_novaposhta_warehouse]"
					id="nevigen_novaposhta_warehouse_<?php echo $shippingId ?>"
					onchange="window.NevigenNovaposhta.calculation(this,'warehouse',<?php echo $shippingId; ?>)"
					class="form-control uk-select w-auto nevigen_novaposhta-select-pickup-points"
				<?php echo (empty($valuePostcode) || empty($warehouse)) ? ' disabled ' : ''; ?>>
				<option value="">
					<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_WAREHOUSE'); ?>
				</option>
				<?php foreach ($warehouse as $option):
					$selected = ($valueWarehouse === $option['value']) ? 'selected' : ''; ?>
					<option value="<?php echo htmlspecialchars($option['value']); ?>" <?php echo $selected; ?>>
						<?php echo $option['label']; ?>
					</option>
				<?php endforeach; ?>
			</select>
		</div>
	</div>
</div>
<div data-nevigen-novaposhta="preloader"
	 class="nevigen-novaposhta-preloader position-absolute top-0 start-0 w-100 h-100 "
	 style="background:#fff; opacity: 0.6;display: none">
	<div class="bottom-50 end-50 position-fixed">
		<div class="spinner-border m-5" style="width: 5rem; height: 5rem;" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
</div>