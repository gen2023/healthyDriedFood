var cartajax = cartajax || {};
var cartajax_added_product_id = null;

cartajax.show_overlay = function(){
    let ajaxLoadAnimate =  jQuery('#cartajax-overlay');
    if (!ajaxLoadAnimate.length){
        ajaxLoadAnimate = jQuery('<div id="cartajax-overlay"></div>');
        jQuery('body').append(ajaxLoadAnimate);
    }
    ajaxLoadAnimate.show();
}

cartajax.hide_overlay = function(){
    jQuery("#cartajax-overlay").hide();
};

cartajax.unserialize = function(l){var j=this,h=function(f,g,a){for(var c=[],d=f.slice(g,g+1),e=2;d!=a;){if(e+g>f.length)throw new j.window.Error("Invalid",void 0,void 0);c.push(d);d=f.slice(g+(e-1),g+e);e+=1}return[c.length,c.join("")]},n=function(f,g,a){var c;c=[];for(var d=0;d<a;d++){var e=f.slice(g+(d-1),g+d);c.push(e);e=e.charCodeAt(0);e=128>e?0:2048>e?1:2;a-=e}return[c.length,c.join("")]},m=function(f,g){var a,c=0,d;g||(g=0);var e=f.slice(g,g+1).toLowerCase(),b=g+2,k=function(a){return a};switch(e){case "i":k= function(a){return parseInt(a,10)};a=h(f,b,";");c=a[0];a=a[1];b+=c+1;break;case "b":k=function(a){return 0!==parseInt(a,10)};a=h(f,b,";");c=a[0];a=a[1];b+=c+1;break;case "d":k=function(a){return parseFloat(a)};a=h(f,b,";");c=a[0];a=a[1];b+=c+1;break;case "n":a=null;break;case "s":a=h(f,b,":");c=a[0];d=a[1];b+=c+2;a=n(f,b+1,parseInt(d,10));c=a[0];a=a[1];b+=c+2;if(c!=parseInt(d,10)&&c!=a.length)throw new j.window.SyntaxError("String length mismatch",void 0,void 0);break;case "a":a= {};d=h(f,b,":");c=d[0];d=d[1];b+=c+2;for(c=0;c<parseInt(d,10);c++){var i=m(f,b),l=i[2],b=b+i[1],i=m(f,b),o=i[2],b=b+i[1];a[l]=o}b+=1;break;default:throw new j.window.SyntaxError("Unknown / Unhandled data type(s): "+e,void 0,void 0);}return[e,b-g,k(a)]};return m(l+"",0)[2]};
cartajax.number_format = function(c,b,d,e){var c=(c+"").replace(/[^0-9+\-Ee.]/g,""),c=!isFinite(+c)?0:+c,b=!isFinite(+b)?0:Math.abs(b),e="undefined"===typeof e?",":e,d="undefined"===typeof d?".":d,a="",a=(b?function(a,c){var b=Math.pow(10,c);return""+Math.round(a*b)/b}(c,b):""+Math.round(c)).split(".");3<a[0].length&&(a[0]=a[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,e));if((a[1]||"").length<b)a[1]=a[1]||"",a[1]+=Array(b-a[1].length+1).join("0");return a.join(d)};
cartajax.temp_ajax_handler = false;
cartajax.temp_ajax_handler2 = null;
cartajax_added_product_attr = null;

cartajax.json = function(url, data, callback){
    /*if(cartajax.temp_ajax_handler)cartajax.temp_ajax_handler.abort();*/
    cartajax.temp_ajax_handler = jQuery.ajax({url:url, dataType:'json', data : data, success:callback, cache:false});
};

cartajax.extend_link = function(url, parameters){
    var result = url;
    var first = !/\?/.test(url);
    jQuery.each(parameters, function(name, value){
        result += (first ? '?' : '&') + name + '=' + value;
        first = false;
    });
    return result;
};

cartajax.add = function(product, type){
    var data = 'quantity=' + parseInt(product.find('[name=quantity]').val());
	cartajax_added_product_id = parseInt(product.find('[name=product_id]').val());
	data += '&product_id=' + cartajax_added_product_id;
    var attributes = product.find('[name^=jshop_attr_id],[name^=freeattribut]');
    if (attributes.length > 0){
        data += '&' + cartajax.serialize_attributes(attributes);
		cartajax_added_product_attr = cartajax.serialize_attributes(attributes);
    } else {
		cartajax_added_product_attr = '';
	}
    if (type){
        data += '&to='+type;
    }	
	cartajax.show_overlay();
	cartajax.json(cartajax.add_base, data, cartajax.refresh_cart);
};

cartajax.remove_wishlist = function(number_in_wishlist) {
    cartajax.show_overlay();
    cartajax.json(cartajax.remove_base_wishlist, 'number_id=' + number_in_wishlist, cartajax.refresh_cart);
} 

cartajax.remove = function(number_in_cart){
    cartajax.show_overlay();
    cartajax.json(cartajax.remove_base, 'number_id=' + number_in_cart, cartajax.refresh_cart);
};

cartajax.reload = function(){
    //cartajax.show_overlay();
    //cartajax.json(cartajax.reload_base, '', cartajax.refresh_cart);
    cartajax.remove(-1);
};

cartajax.serialize_attributes = function(attribute_inputs){
    var result = new Array();
    if (attribute_inputs.length > 0) {
        attribute_inputs.each(function(key, input){
            input = jQuery(input);
			form = input.closest('form');
            var value = input.val().substring(0, 255);
            if(input.is('[type=radio]') && !input.is(':checked'))return true;
            
            if(input.is('[type=checkbox]')){
                if (input.is(':checked')){
                    result.push(input.attr('name') + '=' + value);
                } else {
                    hidden_element = jQuery('input[name="'+input.attr('name')+'"][type="hidden"]', form);
                    if (hidden_element.length == 1 && hidden_element.val()){
                        result.push(input.attr('name') + '=' + hidden_element.val());
                    } else {
                        return true
                    }
                }
            } else if ((input.is('[type=hidden]') && jQuery('input[name="'+input.attr('name')+'"][type="checkbox"]').length == 0) || !input.is('[type=hidden]')) {
                result.push(input.attr('name') + '=' + value);
            }
        });
    }
    
    return result.join('&');
};

cartajax.refresh_cart = function(cart){
    if (typeof cart[0] != 'undefined' && typeof cart[0].message != 'undefined'){
        if ((cart[0].code == 101 || cart[0].code == 121) && typeof cartajax.btn_href != 'undefined') {
            document.location.href = cartajax.btn_href;
            return false;
        }
        cartajax.printErrorCart(cart);
    } else {
        cartajax.refresh_cart_template(cart);        
        if (cartajax.controller == 'cart') {
            document.location.reload(true);
        }
    }
	cartajax.hide_overlay();
	if ((cartajax.show_popup_message==1) && (cartajax_added_product_id)){
		cartajax.cartajax_popup_request(cartajax_html, cartajax_added_product_id, cart.type_cart, cartajax_added_product_attr);
		cartajax_added_product_id = null;
	}
    if (cartajax_added_product_id && typeof(cart_popup) != "undefined") {
        cartajax_added_product_id = null;
        cart_popup.display_cart();
    }
};

cartajax.refresh_cart_template = function(cart){
    let html = '';
    let prefix = '';
    if (typeof jshopParams == 'undefined'){
        jshopParams = {};
    }
    if (typeof jshopParams.decimal_count == 'undefined'){
        jshopParams.decimal_count = cartajax.jshopConfig.decimal_count ?? 2;
    }
    if (typeof jshopParams.decimal_symbol == 'undefined'){
        jshopParams.decimal_symbol = cartajax.jshopConfig.decimal_symbol ?? '.';
    }
    if (typeof jshopParams.currency_code == 'undefined'){
        jshopParams.currency_code = cartajax.jshopConfig.currency_code ?? '';
    }    
    if (cart.type_cart == 'cart') {
        prefix = 'cartajax';
    } else {
        prefix = 'wishlist';
    }

    if (cartajax.show_product_in_cart_message == 1){
        jQuery("span.product_in_cart").hide();
    };

    if (cart.products){
        jQuery.each(cart.products, function(number_in_cart, product){
            let freeattributes = cartajax.unserialize(product.freeattributes);
            if (!product.thumb_image) product.thumb_image = cartajax.jshopConfig.noimage;

            let row = $('.'+prefix+'-module .module-item-template').clone();
            
            jQuery('.module-item', row).attr('ca-product_id', product.product_id);
            jQuery('.module-item', row).attr('ca-number', number_in_cart);
            jQuery('.module-item-image img', row).attr('src', cartajax.images_base+`/`+product.thumb_image);
            jQuery('.module-item-image img', row).attr('alt', product.product_name);
            jQuery('.module-item-label a', row).attr('href', product.product_link);
            jQuery('.module-item-label a n', row).html(product.product_name);
            jQuery('.module-item-count n', row).html(product.quantity);
            jQuery('.module-item-code n', row).html(product.ean);
            jQuery('.module-item-price n', row).html(jshop.formatprice(parseFloat(product.price)));

            var attr_item_html = '';
            jQuery.each(product.attributes_value, function(key, attribute){
                let attr_item = jQuery('.module-item-attributes', row).clone();
                jQuery('.name', attr_item).html(attribute.attr);
                jQuery('.value', attr_item).html(attribute.value);
                attr_item_html += attr_item.html();                
            });
            jQuery.each(freeattributes, function(free_attribute_id, free_attribute_value){
                let attr_item = jQuery('.module-item-attributes', row).clone();
                jQuery('.name', attr_item).html(cartajax.freeattributes[free_attribute_id]);
                jQuery('.value', attr_item).html(free_attribute_value);
                attr_item_html += attr_item.html();                
            });
            jQuery('.module-item-attributes', row).html(attr_item_html);

            html += row.html();
            
            if (cartajax.show_product_in_cart_message==1) {
                jQuery("#product_in_cart_"+product.product_id).show();
            }
        });
    }   

    jQuery('.'+prefix+'-module').find('.no-products-msg').attr('ca-prodcount', cart.count_product);
    jQuery('.'+prefix+'-module').find('.module-bottom').attr('ca-prodcount', cart.count_product);
    jQuery('.'+prefix+'-module').find('.module-count').attr('ca-prodcount', cart.count_product);
    jQuery('.'+prefix+'-module').find('.module-total span').html(jshop.formatprice(parseFloat(cart.price_product)));
	jQuery('.'+prefix+'-module').find('.module-count span').html(cart.count_product);
    jQuery('.'+prefix+'-module').find('.module-list').html(html);
    jQuery('.'+prefix+'-module').find('#jshop_quantity_in_cart').html(cart.count_product);
    if (cart.count_product > 0) {
        jQuery('.'+prefix+'-module').find('#jshop_quantity_in_cart').removeClass('d-none');                    
    } else {
        jQuery('.'+prefix+'-module').find('#jshop_quantity_in_cart').addClass('d-none');
    }
    
    if (cart.type_cart == 'cart' && typeof cartajax.advModules !== 'undefined'){
        jQuery.each(cartajax.advModules, function(index, value) {
            if (jQuery('#cartajax-advanced-module'+value).length){
				if (cartajax.show_popup_message != 1) {
					cartajax_show_hide_products(cart.count_product, 2, value);
				}
            }
        });
    }
}

cartajax.cartajax_popup_request = function(url, product_id, type_cart, attr){
    var data = {};
    data['product_id'] = product_id;
    data['type_cart'] = type_cart;
    if (cartajax.temp_ajax_handler2){
		cartajax.temp_ajax_handler2.abort();
	}
	var req_url = url;
    if (attr) {
        if (/\?/.test(url)) {
            req_url = url+'&'+attr;
        } else {
            req_url = url+'?'+attr;
        }
        
    }
	cartajax.temp_ajax_handler2 = jQuery.ajax({
        url: req_url, 
        dataType: 'html',
        data : data, 
        beforeSend: function() {
			cartajax.show_overlay();
            jQuery('#product_added_to_cart').empty();            
        },
		success: function(html) {
            cartajax.hide_overlay();
            if (type_cart == 'cart') {
                jQuery('#cartajaxCartModal #product_added_to_cart').html(html).fadeIn();
                jQuery('#cartajaxCartModal').modal('show');
            }
            if (type_cart == 'wishlist') {
                jQuery('#cartajaxWishlistModal #product_added_to_cart').html(html).fadeIn();
                jQuery('#cartajaxWishlistModal').modal('show');
            }
        },
    });
}

cartajax.printErrorCart = function(cart){
    var messages = new Array();
    jQuery.each(cart, function(key, cart_item){
        if (typeof cart_item.message != 'undefined' && cart_item.message.length > 0){
            messages.push(cart_item.message);
        }
    });
    if (messages.length > 0){
        cartajax_added_product_id = null;
        alert(messages.join(String.fromCharCode(10) + String.fromCharCode(13)));
    }
};

/*jQuery(document).ready(function(){
    var temp_image = jQuery('<img>').attr('src', cartajax.base + 'components/com_jshopping/images/cartajax-loading.gif');
});*/