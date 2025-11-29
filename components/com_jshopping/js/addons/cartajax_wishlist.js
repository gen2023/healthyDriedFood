jQuery(document).ready(function(){
	jQuery('.wishlist-module').find('.module-list').delegate('.module-item-remove', 'click', function() {
        var cart_item = jQuery(this).closest('.module-item');
		var number = parseInt(cart_item.attr('ca-number'));
		cartajax.remove_wishlist(number);
	});
});