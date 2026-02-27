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

use Joomla\CMS\Language\Text;

extract($displayData);

/**
 * Layout variables
 * -----------------
 *
 * @var  int    $shippingId      Shipping id.
 * @var  string $valueCity       City value
 * @var  string $valueStreet     Current value street
 * @var  string $valueHouse      Current value house
 * @var  string $valueApartment  Current value apartment
 *
 */

// Load asses autocomplete
/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
$assets = \Joomla\CMS\Factory::getApplication()->getDocument()->getWebAssetManager();
$assets->usePreset('nevigen_novaposhta.autocomplete');
$inputId = 'nevigen_novaposhta_city_' . $shippingId;

?>
<div class="nevigen_novaposhta-courier-container" data-nevigen-novaposhta-container="<?php echo $shippingId ?>">
	<div data-nevigen-novaposhta-message="<?php echo $shippingId ?>"></div>
	<div class="row g-1">
		<div class="nevigen-novaposhta-pickup-city mt-2 col-md-4">
			<label for="<?php echo $inputId ?>">
				<?php Text::_('ADDON_NEVIGEN_NOVAPOSHTA_LABEL_CITY') ?>
			</label>
			<div data-nevigen-novaposhta-autocomplete="city">
				<input type="text" name="params[<?php echo $shippingId ?>][nevigen_novaposhta_city]"
					   id="<?php echo $inputId ?>"
					   placeholder="<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_CITY') ?>"
					   class="form-control uk-input nevigen_novaposhta-input-city"
					   oninput="window.NevigenNovaposhta.searchCity(this,<?php echo $shippingId ?>)"
					   data-nevigen-novaposhta="courier"
					   value="<?php echo $valueCity ?>"/>
			</div>
		</div>
		<div class="nevigen-novaposhta-courier-address-street mt-2 col-md">
			<label for="nevigen_novaposhta_street_<?php echo $shippingId ?>">
				<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_STREET'); ?>
			</label>
			<div data-nevigen-novaposhta-autocomplete="street">
				<input type="text" name="params[<?php echo $shippingId ?>][nevigen_novaposhta_street]"
					   id="nevigen_novaposhta_street_<?php echo $shippingId ?>"
					   placeholder="<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_ADDRESS'); ?>"
					   data-nevigen-novaposhta="courier"
					<?php echo (!empty($valueStreet) || !empty($valueCity)) ? '' : ' disabled '; ?>
					   oninput="window.NevigenNovaposhta.getStreets(this,<?php echo $shippingId ?>)"
					   class="form-control uk-input w-100 nevigen_novaposhta_input-street"
					   value="<?php echo $valueStreet ?>"/>
			</div>
		</div>
		<div class="nevigen-novaposhta-courier-address-house mt-2 col-md-2">
			<label for="nevigen_novaposhta_house_<?php echo $shippingId ?>">
				<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_HOUSE'); ?>
			</label>
			<input type="text" name="params[<?php echo $shippingId ?>][nevigen_novaposhta_house]"
				   id="nevigen_novaposhta_house_<?php echo $shippingId ?>"
				   onchange="window.NevigenNovaposhta.validCourier(this,'apartment',<?php echo $shippingId ?>)"
				<?php echo (!empty($valueHouse) || !empty($valueStreet)) ? '' : ' disabled '; ?>
				   data-nevigen-novaposhta="courier"
				   class="form-control uk-input w-auto nevigen_novaposhta-input-street"
				   value="<?php echo $valueHouse ?>"/>
		</div>
		<div class="nevigen-novaposhta-courier-address-apartment mt-2 col-md-2">
			<label for="nevigen_novaposhta_apartment_<?php echo $shippingId ?>">
				<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_APARTMENT'); ?>
			</label>
			<input type="text" name="params[<?php echo $shippingId ?>][nevigen_novaposhta_apartment]"
				   id="nevigen_novaposhta_apartment_<?php echo $shippingId ?>"
				<?php echo (!empty($valueApartment) || !empty($valueHouse)) ? '' : ' disabled '; ?>
				   data-nevigen-novaposhta="courier"
				   class="form-control uk-input w-auto nevigen_novaposhta-input-apartment"
				   value="<?php echo $valueApartment ?>"/>
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