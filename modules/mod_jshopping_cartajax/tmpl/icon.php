<?php
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Jshopping\Site\Helper\Helper;
?>
<div class="cartajax-module cartajax-module-icon">
	<a class="module-checkout" href="<?php print $cart->cartAjaxHrefLink->link; ?>">
		<div class="inner">
			<div class="module-count" ca-prodcount="<?php print isset($cart->count_product) ? $cart->count_product : 0;?>">
				<span class="val"><?php print isset($cart->count_product) ? $cart->count_product : 0;?></span>			
			</div>
			<img src="<?php print Uri::base()?>components/com_jshopping/css/addons/images/cart.png" alt="Cart">
		</div>
		<div class="module-total">		
			<span class="val"><?php print Helper::formatprice($cart->price_product)?></span>
		</div>
	</a>
</div>
<script>
jQuery(document).ready(function(){
    jQuery('.cartajax-module-icon a.module-checkout').on('click', function(event){
		if (typeof(cart_popup) != "undefined") {
			cart_popup.display_cart();
			return false;
		}
    });
});
</script>