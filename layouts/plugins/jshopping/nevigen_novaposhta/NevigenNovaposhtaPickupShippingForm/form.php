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

extract($displayData);

/**
 * Layout variables
 * -----------------
 *
 * @var  int    $shippingId     Shipping id.
 * @var  string $valueCity      City value
 * @var  array  $warehouse      Pickup points array
 * @var  string $valueWarehouse Pickup point value
 *
 */


$inputId    = 'nevigen_novaposhta_city_' . $shippingId;

// Load asses autocomplete
/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
$assets = Factory::getApplication()->getDocument()->getWebAssetManager();
$assets->usePreset('nevigen_novaposhta.autocomplete');
?>
<div class="nevigen_novaposhta-pickup-container" data-nevigen-novaposhta-container="<?php echo $shippingId ?>">
	<div data-nevigen-novaposhta-message="<?php echo $shippingId ?>"></div>
	<div class="row g-1">
		<div class="nevigen-novaposhta-pickup-city mt-2 col-md-4">
			<label for="<?php echo $inputId ?>">
				<?php echo  Text::_('ADDON_NEVIGEN_NOVAPOSHTA_LABEL_CITY') ?>
			</label>
				<div data-nevigen-novaposhta-autocomplete="city">
					<input type="text" name="params[<?php echo $shippingId ?>][nevigen_novaposhta_city]"
						   id="<?php echo $inputId ?>"
						   placeholder="<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_CITY') ?>"
						   class="form-control uk-input nevigen_novaposhta-input-city"
						   oninput="window.NevigenNovaposhta.searchCity(this,<?php echo $shippingId ?>)"
						   data-nevigen-novaposhta="pickup"
						   value="<?php echo $valueCity ?>"/>
				</div>
		</div>
		<div class="nevigen-novaposhta-pickup-warehouse mt-2 col-md-8">
			<label for="nevigen_novaposhta_warehouse_<?php echo $shippingId ?>">
				<?php echo Text::_('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_WAREHOUSE'); ?>
			</label>
			<select name="params[<?php echo $shippingId; ?>][nevigen_novaposhta_warehouse]"
					id="nevigen_novaposhta_warehouse_<?php echo $shippingId ?>"
					onchange="window.NevigenNovaposhta.calculation(this,'warehouse',<?php echo $shippingId; ?>)"
					class="form-control uk-select w-auto nevigen_novaposhta-select-pickup-points"
				<?php echo (empty($valueCity) || empty($warehouse)) ? ' disabled ' : ''; ?>>
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