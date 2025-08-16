<?php 

/**
 * @version      1.0.0
 * @author       Sofona
 * @copyright    Copyright (C) 2024 Sofona. All rights reserved.
 * @license      GNU/GPL
 */

use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Language\Text;
JFactory::getLanguage()->load('mod_jshopping_searchajax', JPATH_SITE);

defined('_JEXEC') or die();
?>
<table class="searchajax">
	<?php if (!empty($this->rows)) { ?>
		<?php foreach ($this->rows as $p) {
			 ?>
			<tr class="itemsearch">
				<td class="aj_img"><a class="itemlink" href="<?php echo $p->product_link ?>"><span class="img-block"><img
								src="<?php echo $p->image; ?>" height="40px" width="40px"></span></a></td>
				<td class="aj_det">
					<a class="itemlink" href="<?php echo $p->product_link ?>">
						<span class="detailsearch">
							<span class="titlesearch"><?php echo $p->name; ?></span><br />
							<?php
							$display_price = Helper::getDisplayPriceForProduct($p->product_price);
							if ($display_price) { ?>
								<span class="pricesearch">
										<?php print Helper::formatprice($p->product_price)?>
								</span>
							<?php } ?>
						</span>
					</a>
				</td>
			</tr>
		<?php } ?>
		<?php if (isset($this->moreResults) && $this->moreResults == 1): ?>
			<tr>
				<td colspan="2" class="row_more-result">
					<a href="<?php echo $this->moreResultsLink; ?>"
						class="ajax-search-more-results"><?php echo Text::_('MOD_JSHOP_SEARCHAJAX_MORE_RESULTS'); ?></a>
				</td>
			</tr>
		<?php endif; ?>
	<?php } else { ?>
		<tr>
			<td colspan="2" class="row_no-result">
				<?php echo $this->noResultsText; ?>
			</td>
		</tr>
	<?php } ?>
</table>