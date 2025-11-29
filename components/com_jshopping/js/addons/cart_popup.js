var cart_popup = cart_popup || {};
cart_popup.product_id = '';
cart_popup.category_id = '';
cart_popup.request = '';

jQuery(document).ready(function(){
    if (typeof(cartajax) == "undefined") {
        var product_detailed = jQuery('form[name=product]');
    
        jQuery('.jshop_list_product .buttons a.button_buy').click(function(){
            var product = jQuery(this).closest('.product');
            var data = 'product_id=' + parseInt(product.find('[name=cart_popup_product_id]').val());
            data += '&quantity=' + parseInt(product.find('[name=cart_popup_quantity]').val());
            data += '&to=cart';
            cart_popup.request = 'product_list';
            
            cart_popup.product_id = parseInt(product.find('[name=cart_popup_product_id]').val());
            cart_popup.category_id = parseInt(product.find('[name=cart_popup_category_id]').val());
            cart_popup.ajax_request(cart_popup.href_add, "json", data, cart_popup.view_cart);
            
            return false;
        });
        
        product_detailed.find('.btn-buy').click(function(){
            var data = new FormData(product_detailed[0]);
            cart_popup.product_id = parseInt(product_detailed.find('[name=product_id]').val());
            cart_popup.category_id = parseInt(product_detailed.find('[name=category_id]').val());
            cart_popup.request = 'product';
            cart_popup.ajax_request(cart_popup.href_add, "json", data, cart_popup.view_cart, true, false);

            return false;
        });
    }

    jQuery('.cartwishlist .remove_to_cart a.btn-success').click(function(){
        var tr_jshop_prod_cart = jQuery(this).closest('.jshop_prod_cart');
        var data = 'number_id=' + parseInt(tr_jshop_prod_cart.find('[name=wishlist_prod_number_id]').val());
        cart_popup.ajax_request(cart_popup.href_remove_to_cart, "json", data, cart_popup.view_cart, false, true);
        jQuery(tr_jshop_prod_cart).remove();
        return false;
    });

    jQuery(document).on('click', '.cart_popup .reward_use .btn', function(event){
        let href = jQuery(this).attr('href');
        let data = 'ajax=1';
        cart_popup.ajax_request(href, "json", data, cart_popup.view_cart, false, true);
        return false;
    });

    jQuery(document).on('click', '.cart_popup .addon-reward-coupons-sale .btn', function(event){
        let href = jQuery(this).attr('href');
        let data = 'ajax=1';
        cart_popup.ajax_request(href, "json", data, cart_popup.view_cart, false, true);
        return false;
    });

    jQuery(document).on('click', '.cart_popup .addon-reward-coupons-buy .btn', function(event){
        let href = jQuery('.cart_popup .addon-reward-coupons-buy form').attr('action');
        let value = jQuery('.cart_popup .addon-reward-coupons-buy form input[name=value]').val();        
        let data = 'ajax=1&value='+value;        
        cart_popup.ajax_request(href, "json", data, cart_popup.view_cart, false, true);        
        return false;
    });

});

cart_popup.modal_close = function() {
    jQuery('#cart_popup').modal('hide');
}

cart_popup.remove_cart_item = function(item_id){
    if (confirm(cart_popup.confirm_remove)){
        var data = 'number_id=' + item_id;
        cart_popup.ajax_request(cart_popup.href_remove, "json", data, cart_popup.view_cart, false, true);
    }
}

cart_popup.clear_cart = function(){
    cart_popup.ajax_request(cart_popup.href_clear_cart, "json", '', cart_popup.view_cart, false, true);
}

cart_popup.save_discount = function(){
    var form_rabatt = jQuery('form[name=rabatt]');
    var rabatt = form_rabatt.find('[name=rabatt]').val();
    var data = 'rabatt=' + rabatt;
    cart_popup.ajax_request(cart_popup.href_discount, "json", data, cart_popup.view_cart, false, true);
}

cart_popup.refreshCart = function(){
    var cart_detailed = jQuery('form[name=updateCart]');
    var quantitys = cart_detailed.serialize();
    cart_popup.ajax_request(cart_popup.href_refresh, "json", quantitys, cart_popup.view_cart, false, true);
}

cart_popup.view_cart = function (data){
    if (typeof data[0] !== 'undefined' && data.length == 1) {
        if (data[0].level == 8 && cart_popup.request == 'product_list') {
            var error_url = cart_popup.href_error_attr;
            error_url = error_url.replace('_cid_', cart_popup.category_id);
            error_url = error_url.replace('_pid_', cart_popup.product_id);
            error_url = error_url.replace('_msg_', data[0].message);
            window.location = error_url;
        } else {
            jQuery('.cart_popup_error').html(data[0].message);
            jQuery('.cart_popup_error').show();
            cart_popup.display_cart();
        }
    } else {
        if (data.msg) {
            jQuery('.cart_popup_error').html(data.msg);
            jQuery('.cart_popup_error').show();
        } else {
            jQuery('.cart_popup_error').html('');
            jQuery('.cart_popup_error').hide();
        }
        cart_popup.display_cart();
    }
}

cart_popup.display_cart = function(){
    cart_popup.ajax_request(cart_popup.href_view, "html", '', cart_popup.after_view);
}

cart_popup.after_view = function (html){
    jQuery('.cart_popup_content_html').html(html);
    jQuery('#cart_popup').modal('show');
}

cart_popup.ajax_request = function(url, dataType, data, callback, POST, cart_ajax_update){
    let type = 'GET';
    if (typeof(POST) != 'undefined' && POST) {
        type = 'POST';
    }
    jQuery.ajax({
        url: url, 
		type: type,
        dataType: dataType, 
        data : data, 
        cache: false,
		processData: false,
		contentType: false,
        beforeSend: function() {
            cart_popup.ajaxLoadAnimate().show();
        },
        success: callback,
		complete: function (){
            cart_popup.ajaxLoadAnimate().hide();
            if (typeof(cart_ajax_update) != 'undefined' && cart_ajax_update) {
                cart_popup.cart_ajax_update();
            }
		}
    });
}

cart_popup.ajaxLoadAnimate = function(){
    let ajaxLoadAnimate =  jQuery('#cart_popup_ajaxLoadAnimate');
    if (!ajaxLoadAnimate.length){
        ajaxLoadAnimate = jQuery('<div id="cart_popup_ajaxLoadAnimate"></div>');
        jQuery('body').append(ajaxLoadAnimate);
    }
    return ajaxLoadAnimate;
}

cart_popup.cart_ajax_update = function() {
    if (typeof(cartajax) != "undefined") {
        cartajax.reload();
    }
}
