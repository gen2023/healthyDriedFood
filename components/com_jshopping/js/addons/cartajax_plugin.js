jQuery(document).ready(function(){
    jQuery(document).on('click', '.jshop_list_product .buttons a.button_buy', function(event){
		cartajax.btn_href = jQuery(this).attr('href');
        cartajax.add(jQuery(this).closest('.product, .block_product, .block_item'), 'cart');
        return false;
    });
    var product_detailed = jQuery('form[name=product]');
    jQuery(document).on('click', 'form[name=product] .btn-buy', function(){
		if (jQuery('form[name=product] input[name=confprod]').val() == "1") {
			return true;
		}
        cartajax.add(product_detailed, 'cart');
        return false;
    });
    if (cartajax.config_add_to_wishlist) {
        jQuery(document).on('click', 'form[name=product] .btn-wishlist', function(){
			if (jQuery('form[name=product] input[name=confprod]').val() == "1") {
				return true;
			}
            cartajax.add(product_detailed, 'wishlist');
            return false;
        });
		jQuery(document).on('click', '.jshop_list_product .buttons a.product-button-wishlist', function(event) {
			cartajax.btn_href = jQuery(this).attr('href');
			cartajax.add(jQuery(this).closest('.product, .block_product'), 'wishlist');
			return false;
		});
    }
});