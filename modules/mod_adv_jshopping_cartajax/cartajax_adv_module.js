jQuery(document).ready(function(){

    jQuery.each(cartajax.advModules, function(index, value) {
        if (cartajax.open_info){
            cartajax_show_hide_products(cartajax.count_products, 2, value);
        }
    });
    
	jQuery('.cartajax-module').find('.module-list').delegate('.module-item-remove', 'click', function(){
        var cart_item = jQuery(this).closest('.module-item');
		var number = parseInt(cart_item.attr('ca-number'));
		cartajax.remove(number);
	});

    jQuery('.cartajax-module .module-show-products a.cartajax-link').on('click', function(){
        let module = jQuery(this).closest('.cartajax_adv_module');
        let module_id = module.attr('module-id');
        let count = jQuery('.module-count', module).attr('ca-prodcount');
        let btn_product = jQuery('.module-show-products .cartajax-link', module).attr('btn-product');
        if (btn_product == "show") {
            cartajax_show_hide_products(count, 1, module_id);
        } else {
            cartajax_show_hide_products(count, 0, module_id);
        }
    });

    jQuery('.cartajax-module .module-close a.cartajax-link').on('click', function(){
        let module = jQuery(this).closest('.cartajax_adv_module');
        let module_id = module.attr('module-id');
        cartajax_show_hide_products(1, 0, module_id);
    });

});

cartajax_show_hide_products = function(count_products, show, moduleId){
    let module = jQuery('#cartajax-advanced-module'+moduleId);
    let btn_product = jQuery('.module-show-products .cartajax-link', module).attr('btn-product');
    if (btn_product == "hide" && show == 2 && count_products > 0) {
        return 0;
    }
    if (typeof cartajax_timeout === 'undefined'){
        cartajax_timeout = new Array();
    }
    if (typeof cartajax_timeout[moduleId] !== 'undefined'){
        clearTimeout(cartajax_timeout[moduleId]);
    }
    if (typeof count_products === 'undefined'){
        count_products = 0;
    }    
    if (count_products == 0){
        jQuery('.products-block', module).hide();
        jQuery('.module-show-products .cartajax-link', module).attr('btn-product', "show");
    } else {
        if (show == 2){
            jQuery('.products-block', module).hide().slideDown('slow');
            jQuery('.module-show-products .cartajax-link', module).attr('btn-product', "hide");
            
            cartajax_timeout[moduleId] = setTimeout(function(){
                jQuery('.products-block', module).slideUp('slow');
                jQuery('.module-show-products .cartajax-link', module).attr('btn-product', "show");
            }, cartajax.delay);

        } else if (show == 1){
            jQuery('.products-block', module).slideDown('slow');
            jQuery('.module-show-products .cartajax-link', module).attr('btn-product', "hide");
        } else {
            jQuery('.products-block', module).slideUp('slow');
            jQuery('.module-show-products .cartajax-link', module).attr('btn-product', "show");
        }
    }
}