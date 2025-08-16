<div class="cartajax-module cartajax-module-icon">
	<a class="module-checkout" href="<?php print $cart->cartAjaxHrefLink->link; ?>">
		<div class="inner">
			<div class="module-count" ca-prodcount="<?php print isset($cart->count_product) ? $cart->count_product : 0;?>">
				<span class="val"><?php print isset($cart->count_product) ? $cart->count_product : 0;?></span>			
			</div>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M14.3917 4.44251H10.0283C9.515 4.44251 9.16667 4.79085 9.16667 5.30418C9.16667 5.81751 9.515 6.16585 10.0283 6.16585H14.4833C15.675 6.16585 16.7017 7.19251 16.7017 8.38418V11.5558C16.7017 12.7475 15.675 13.7742 14.4833 13.7742H10.0283C9.00167 13.7742 8.14 13.0958 7.88333 12.1425L6.25167 6.49585L5.13333 2.48085C4.80333 1.52752 3.94167 0.849182 2.915 0.849182H0.861667C0.348333 0.849182 0 1.19752 0 1.71085C0 2.22418 0.348333 2.57252 0.861667 2.57252H2.915C3.17167 2.57252 3.42833 2.73752 3.52 2.99418L4.71167 6.93585L6.25167 12.6742C6.67333 14.3792 8.305 15.5892 10.0283 15.5892H14.3917C16.5367 15.5892 18.3333 13.7925 18.3333 11.6475V8.45751C18.3333 6.23918 16.6283 4.44251 14.3917 4.44251Z" fill="white" style="fill:white;fill-opacity:1;"/>
				<path d="M9.00167 17.1108H8.32333C7.81 17.1108 7.46167 17.4592 7.46167 17.9725C7.46167 18.4858 7.81 18.8342 8.32333 18.8342H9.00167C9.515 18.8342 9.86333 18.4858 9.86333 17.9725C9.845 17.4408 9.515 17.1108 9.00167 17.1108Z" fill="white" style="fill:white;fill-opacity:1;"/>
				<path d="M16.7017 17.1108H16.0233C15.51 17.1108 15.1617 17.4592 15.1617 17.9725C15.1617 18.4858 15.51 18.8342 16.0233 18.8342H16.7017C17.215 18.8342 17.5633 18.4858 17.5633 17.9725C17.5633 17.4408 17.215 17.1108 16.7017 17.1108Z" fill="white" style="fill:white;fill-opacity:1;"/>
			</svg>
		</div>
		<div class="module-total d-none">		
			<span class="val"><?php print \JSHelper::formatprice($cart->price_product)?></span>
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