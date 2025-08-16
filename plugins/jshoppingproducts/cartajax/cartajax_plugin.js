jQuery(document).ready(function () {
    jQuery(document).on('click', '.jshop_list_product .buttons a.button_buy', function (event) {
        cartajax.btn_href = jQuery(this).attr('href');
        cartajax.add(jQuery(this).closest('.product, .block_product, .block_item'), 'cart');
        return false;
    });
    var product_detailed = jQuery('form[name=product]');
    jQuery(document).on('click', 'form[name=product] .btn-buy', function () {
        if (jQuery('form[name=product] input[name=confprod]').val() == "1") {
            return true;
        }
        cartajax.add(product_detailed, 'cart');
        return false;
    });
    if (cartajax.config_add_to_wishlist) {
        jQuery(document).on('click', 'form[name=product] .btn-wishlist', function () {
            if (jQuery('form[name=product] input[name=confprod]').val() == "1") {
                return true;
            }
            cartajax.add(product_detailed, 'wishlist');
            return false;
        });
        jQuery(document).on('click', '.jshop_list_product .buttons a.product-button-wishlist', function (event) {
            cartajax.btn_href = jQuery(this).attr('href');
            cartajax.add(jQuery(this).closest('.product, .block_product'), 'wishlist');
            return false;
        });
    }

    jQuery(document).on('click', '.quantity-plus, .quantity-minus', function () {
        var $btn = jQuery(this);
        var $input = $btn.siblings('.ca_qty_input').find('input[name="quantity"]');
        var currentVal = parseInt($input.val(), 10) || 1;

        if ($btn.hasClass('quantity-minus')) {
            if (currentVal > 1) {
                $input.val(currentVal - 1).trigger('change');
            }
        } else {
            $input.val(currentVal + 1).trigger('change');
        }
    });

    // jQuery(document).on('input', 'input[name="quantity"]', function () {

    //     var $input = jQuery(this);
    //     var val = $input.val();
    //     var num = parseInt(val, 10);
    //     if (isNaN(num) || num < 1) {
    //         $input.val(1);
    //     }
    // });

});