cartajax.update_product_purchase_url = function(product){
    if (product.find('form.cartajaxattributes').length > 0)
    {
        var product_id = parseInt(product.find('[name=product_id]').val());
        var category_id = parseInt(product.find('[name=category_id]').val());
        var url = cartajax.extend_link(cartajax.buy_base, {product_id : product_id, category_id : category_id});
        var compare_url = cartajax.extend_link(cartajax.compare_base, {product_id : product_id, category_id : category_id});
        var attributes = product.find('[name^=jshop_attr_id],[name^=freeattribut]');
        if (attributes.length > 0) {
			url += '&' + cartajax.serialize_attributes(attributes);
			compare_url += '&' + cartajax.serialize_attributes(attributes);
		}
        product.find('.buttons a.button_buy').attr('href', url);
		product.find('.buttons span.js_list_add_to_compare a').attr('href', compare_url);
    }
};

cartajax.attribute_change = function(){
    jQuery('#cartajax-attribute-loading').remove();
    var product = jQuery(this).closest('.product');
    var form = jQuery(this).closest('form.cartajaxattributes');
    var loading = jQuery('<div/>').attr('id', 'cartajax-attribute-loading');
    jQuery(this).closest('fieldset').find('legend').append(loading);
    var data = 'product_id=' + parseInt(product.find('[name=product_id]').val());
    data += '&quantity=' + parseInt(product.find('[name=quantity]').val());
    var attributes = product.find('[name^=jshop_attr_id],[name^=freeattribut]');
    if (attributes.length > 0) {
        data += '&' + cartajax.serialize_attributes(attributes);
    }
    cartajax.json(cartajax.form_base, data, function(json){
        var new_form = jQuery(json.form);
        if (json.form) form.replaceWith(new_form);
        if (new_form.is('form') && new_form[0]) {
            new_form[0].reset();
        }
        if (product.length > 0)
        {
            cartajax.update_product_purchase_url(product);
            var price = product.find('.jshop_price');
            price.find('span').html(json.price);
            
            var not_available = product.find('.not_available');
            if (not_available.length == 0)
            {
                not_available = jQuery('<div>').addClass('not_available').html(cartajax.translate_not_available);
                not_available.insertAfter(price);
            }
            if (!json.available){
                not_available.show();
            }else{
                not_available.hide();
            }
            if (json.btn_bay_name){
                product.find('.button_buy').html(json.btn_bay_name);
            }
            
            var ean = product.find('.jshop_code_prod');
            if (json.ean)
            {
                ean.find('span').html(json.ean);
                ean.show();   
            }
            else
            {
                ean.hide();
            }
            
            if (json.weight)product.find('.productweight span').html(json.weight);
            if (json.pricedefault)product.find('.default_price span').html(json.pricedefault);
            if (json.qty !== undefined) product.find('.qty_in_stock span').html(json.qty);
            if (json.basicprice && json.product_basic_price_unit_name)product.find('.base_price span').html(json.basicprice + ' / ' + json.product_basic_price_unit_name);
            
            var oldprice = product.find('.old_price');
            if (oldprice.length == 0)
            {
                oldprice = jQuery('<div>').addClass('old_price').html(cartajax.old_price_description + ': ');
                oldprice.append(jQuery('<span>'));
                oldprice.insertAfter(price);
            }
            if (json.oldprice)
            {
                oldprice.find('span').html(json.oldprice);
                oldprice.show();
            }
            else
            {
                oldprice.hide()
            }
            
            if (json.image){
                product.find('.jshop_img').attr('src', json.image);
            }
            if (json.addon_quantity_select_options_html){
                var selectQuantity = jQuery(product).find('#addon_quantity_select');
                selectQuantity.html(json.addon_quantity_select_options_html);
            }
			if (json.prod_availability !== undefined) {
                jQuery('.prod_availability_block', product).html( decodeURIComponent(escape(atob( json.prod_availability ))) );
            }
            if (json.pricesaving !== undefined) {
                jQuery('.price_savings', product).html(json.pricesaving);
            }
			if (json.prices_in_list_products !== undefined) {
                jQuery('.prices_in_list_products', product).replaceWith(json.prices_in_list_products);
            }
            if (json.comparison !== undefined) {
                var comparision_button = json.comparison;
                if (comparision_button=='add'){
                    product.find('.js_list_add_to_compare').show();
                    product.find('.compare_link').hide();
                } else if (comparision_button=='go') {
                    product.find('.js_list_add_to_compare').hide();
                    product.find('.compare_link').show();
                } else {
                    product.find('.js_list_add_to_compare').hide();
                }
            }
            if (json.attr_characteristics !== undefined) {
                product.find('.extra_fields').html(json.extra_field_html);
                product.find('.name a').html(json.name);
                product.find('.description').html(json.short_description);
            }
        }
        loading.remove();
    });
};

cartajax.free_attribute_change = function(){
    var product = jQuery(this).closest('.product');
    if (product.length > 0) cartajax.update_product_purchase_url(product);
};

jQuery(document).ready(function(){
    var products = jQuery('.product').not('.product_c_item');
    jQuery('body').delegate('.product:not(.product_c_item) [name^=jshop_attr_id]', 'change', cartajax.attribute_change);
    jQuery('body').delegate('.product:not(.product_c_item) [name^=quantity]', 'keyup', cartajax.attribute_change);
    jQuery('body').delegate('.product:not(.product_c_item) [name^=freeattribut]', 'keyup', cartajax.free_attribute_change);
    
    products.each(function(key, product){
        cartajax.update_product_purchase_url(jQuery(product));
    });
    if (cartajax.preload_attribute_value){
        products.each(function(key, product){
            var productAttributes = jQuery(product).find('[name^=jshop_attr_id],[name^=freeattribut]');
            if (productAttributes.length > 0) {
                cartajax.attribute_change.call(product);
            }
        });
    }
    
    var attribute_forms = jQuery('form.cartajaxattributes');
    attribute_forms.each(function(key, attribute_form){attribute_form.reset();});
    /*if (!cartajax.preload_attribute_value){
        attribute_forms.find('[name^=jshop_attr_id]').mouseenter(cartajax.attribute_change);
    }*/
});