
var mod_jfilter_ext_params = mod_jfilter_ext_params || {};

jQuery(document).ready(function () {
    
    jQuery('.jshop_filters .dropdown_list').on('click', '.head', function(){
        jQuery(this).toggleClass('open');
        jQuery(this).next().slideToggle();
    });

    jQuery('.jshop_filters .dropdown_list .fblock').each(function(i, item){
        if (
            jQuery('input[type=checkbox]', item).is(':checked') ||
            (jQuery('input[type=text]', item).length > 0 && jQuery('input[type=text]', item).val() != '') || 
            (jQuery('select', item).length > 0 && jQuery('select', item).val() != '') ||
            (jQuery('input[type=radio]:checked', item).length > 0 && jQuery('input[type=radio]:checked', item).val() != '') ||
            (jQuery('input[name=fprice_from]', item).length > 0 && jQuery('input[name=fprice_from]', item).val() > 0) ||
            (jQuery('input[name=fprice_to]', item).length > 0 && jQuery('input[name=fprice_to]', item).val() > 0)
        ) {
            jQuery('.head', item).addClass('open');
            jQuery('.filters-lists', item).show();
            jQuery('.filter_item', item).show();
        }
    });

    jQuery('.modal_open').hide();
    jQuery('.modalhint').on('click', function(e){
        e.preventDefault();
        jQuery(e.target.hash).show();
        jQuery('body').append('<div class="modal-open-overlay"></div>');
        e.stopPropagation();
    });
    jQuery('.modal_open .modal-close').on('click', function(e){
        jQuery('.modal_open').hide();
        jQuery('.modal-open-overlay').remove();
        e.stopPropagation();
    });
    jQuery('.modal_open').on('click', function(e){        
        e.stopPropagation();
    });

    function setBouserHistory(href){
        try {            
            window.history.pushState(null, null, href);
        } catch(e) {}
    }

    if (mod_jfilter_ext_params['ajax_view']) {
        try {
            window.onpopstate = function(e){
                jshopFiltersSubmitAjax(e.target.location.href);
            };
        } catch(e) {}

		jQuery('body').on('click', '.jshop_pagination .pagination a', function(){
			var href = jQuery(this).attr('href');
			setBouserHistory(href);
            jshopFiltersSubmitAjax(href);
			return false;
		});

        jQuery('body').on('change', '.submit_product_list_filter', function(e){
            jshopFiltersSubmitAjaxAnyForm(this);
            return false;
        });

        jQuery('body').on('click', '#submit_product_list_filter', function(e){
            jshopFiltersSubmitAjaxAnyForm(this);
            return false;
        });

        jQuery('body').on('click', '#submit_product_list_filter_sort_dir', function(e){
            jQuery('#orderby').val(jQuery('#orderby').val() ^ 1);
            jshopFiltersSubmitAjaxAnyForm(this);
            return false;
        });

    }

    if (mod_jfilter_ext_params['dependent_characteristic']) {
        jQuery(document).on("change", ".filter_characteristic select", function() {
            var url = mod_jfilter_ext_params['uri_base']+'index.php?option=com_jshopping&controller=dependent_characteristics&task=get_filter_dependent_characteristics&id='+this.value;
            jQuery.ajax({
                url: url,
                dataType : "json"
            }).done(function(json){
                for(var k in json){
                    jQuery('.filter_characteristic div.item_ch_'+k).html(json[k]);
                }
            });
        });
    }

    if (mod_jfilter_ext_params['auto_submit']) {
        jQuery('div.jshop_filters input[name=fprice_from],div.jshop_filters input[name=fprice_to]').on('change', function(){
            var nr_filter = jQuery(this).closest('div.jshop_filters').attr('data-scrolling-number');
            if (!nr_filter) nr_filter = 1;
            jshop_filters_submit(nr_filter);
        });
    }
    
    if (mod_jfilter_ext_params['show_prices_slider']) {
        modFilterPriceSliderInit();
    }
        
    if (mod_jfilter_ext_params['show_filter_active'] > '0') {
        jshopFiltersActiveValUpdate();
    }

    jQuery(document).on('click', '.filter_active_vals_js a', function(){
        let type = jQuery('div[el=group]', this).html();
        let id = jQuery('div[el=val]', this).html();
        let gid = jQuery('div[el=gid]', this).html();
        let fn = jQuery('div[el=filter_number]', this).html() ?? 1;
        if (!type) {
            modFilterclearAll(fn);
        } else {
            modFilterclearType(fn, type, id, gid);
        }
    });
});

function jshopFiltersSubmitAjaxAnyForm(field){
    var $field = jQuery(field);
    var $form = $field.closest('form');
    if ($form.length) {
        var action = $form.attr('action');
        var data = $form.serialize();
        jshopFiltersSubmitAjax(action, data);
    }
}

function jshopFiltersBlockLoader(){
    var $jshopFiltersBlockLoader =  jQuery('#jshopFiltersBlockLoader');
    if (!$jshopFiltersBlockLoader.length){
        $jshopFiltersBlockLoader = jQuery('<div id="jshopFiltersBlockLoader"></div>');
        jQuery('body').append($jshopFiltersBlockLoader);
    }
    return $jshopFiltersBlockLoader;
}

function jshopFiltersSubmitAjax(action, data) {
    var selectorData = '#comjshop';
    var $comjshop = jQuery(selectorData);
    var data = typeof(data) == 'undefined' ? 'tmpl=component' : data+'&tmpl=component';    
    if (!$comjshop.length) {			
        $comjshop = jQuery('main');
    }
    if ($comjshop.length) {
        var setError = function(error) {
            var error = typeof(error) == 'undefined' ? 'An error has occurred.' : error;
            $comjshop.html(error);
            jshopFiltersBlockLoader().hide();
        }
        jQuery.ajax({
            type: 'POST',
            beforeSend: function(){
                jshopFiltersBlockLoader().show();
            },
            url: action,
            data: data,
            dataType:'html',
            error: function(XHR, text){
                setError();
            },
            success: function(data) {
                if (data) {
                    var $data = jQuery('<div></div>').append(data);
                    var $_comjshop = $data.find(selectorData);
                    if ($_comjshop.length){	
                        jQuery('html, body').animate({
                            scrollTop: $comjshop.offset().top-20
                        }, 100);
                        $comjshop.replaceWith($_comjshop);

                        /*ajax_product_pagination*/
                        ap_ajax_block = 0;
		                ap_page = 1;
                    }else{
                        setError();
                    }
                    if (mod_jfilter_ext_params['show_filter_active'] > '0') {
                        jshopFiltersActiveValUpdate();
                    }
                }
            },
            complete: function(XHR, text) {
                jshopFiltersBlockLoader().hide();
            }
        });
    } else {
        console.log('Error find #comjshop, main');
    }
}

function jshop_filters_submit(n, important_submit) {
	var submit = mod_jfilter_ext_params['auto_submit'];
	var selectorForm = '#jshop_filters_'+n;
	if (typeof(important_submit) != 'undefined') {
		submit = important_submit ? true : submit;
	}
	if (submit) {        
        var $form = jQuery(selectorForm);
        var action = $form.attr('action');
		if (mod_jfilter_ext_params['ajax_view']) {			
			return jshopFiltersSubmitAjax(action, $form.serialize());
        } else if (mod_jfilter_ext_params['get_filter_only_url']) {
            return modFilterGetUrlBuild(action, $form.serialize());
        } else {		
		    $form.submit();
        }
	}
}

function modFilterclearPriceFilter(n){
    jQuery("#price_from").val("");
    jQuery("#price_to").val("");    
    jshop_filters_submit(n);
}

function setFilterPrice(pricef, pricet, n){
    jQuery("#price_from").val(pricef);
    jQuery("#price_to").val(pricet);
    jshop_filters_submit(n);
}

function modFilterclearAll(n){
    jQuery("#price_from").val("");
    jQuery("#price_to").val("");
    var c = new Array();
    c = document.forms['jshop_filters_'+n].getElementsByTagName('input');
    for (var i = 0; i < c.length; i++){
        if (c[i].type == 'checkbox') {
          c[i].checked = false;
        }
        if (c[i].type == 'radio') {
          c[i].value = '';
        }   
        if (c[i].type == 'text' ) {
          c[i].value = '';
        }      
    }
    cs = document.forms['jshop_filters_'+n].getElementsByTagName('select');
    for (var i = 0; i < cs.length; i++){
        cs[i].value = '';
    }    
	
    if (mod_jfilter_ext_params['show_prices_slider']) {
	    jQuery("#slider-range").slider("option", "values", [mod_jfilter_ext_params['slider_min_price'], mod_jfilter_ext_params['slider_max_price']]);
        modFilterPriceSliderTextInit();
    }
	jQuery('#jshop_filters_'+n+' .chosen-select').val([]).trigger('chosen:updated');
    jshop_filters_submit(n, true);
}

function modFilterclearType(filter_number, type, id, gid){    
    if (type=='manufacturer'){
        jQuery('#jshop_filters_'+filter_number+' input[name=manufacturers\\[\\]]').each(function(){
            if (id==this.value){
                this.checked = false;
                
            }
        });
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=manufacturers\\[\\]]');
        if (select){
            select.val('');
            
        }
    }
    if (type=='category'){
        jQuery('#jshop_filters_'+filter_number+' input[name=categorys\\[\\]]').each(function(){
            if (id==this.value){
                this.checked = false;
                
            }
        });
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=categorys\\[\\]]');
        if (select){
            select.val('');
            
        }
    }
    if (type=='vendor'){
        jQuery('#jshop_filters_'+filter_number+' input[name=vendors\\[\\]]').each(function(){
            if (id==this.value){
                this.checked = false;
                
            }
        });
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=vendors\\[\\]]');
        if (select){
            select.val('');
            
        }
    }
    if (type=='delivery_time'){
        jQuery('#jshop_filters_'+filter_number+' input[name=delivery_times\\[\\]]').each(function(){
            if (id==this.value){
                this.checked = false;
                
            }
        });
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=delivery_times\\[\\]]');
        if (select){
            select.val('');
            
        }
    }
    if (type=='label'){
        jQuery('#jshop_filters_'+filter_number+' input[name=labels\\[\\]]').each(function(){
            if (id==this.value){
                this.checked = false;
                
            }
        });
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=labels\\[\\]]');
        if (select){
            select.val('');
            
        }
    }

    if (type=='extra_field'){
        jQuery("#jshop_filters_"+filter_number+" input[name=extra_fields\\["+gid+"\\]\\[\\]]").each(function(){
            if (id==this.value){
                this.checked = false;                
            }
        });
        jQuery("#jshop_filters_"+filter_number+" input[name=extra_fields_t\\["+gid+"\\]\\[\\]]").each(function(){
            if (id==this.value){
                this.checked = false;                
            }
        });
        var select = jQuery("#jshop_filters_"+filter_number+" select[name=extra_fields\\["+gid+"\\]\\[\\]]");
        if (select){
            select.val('');            
        }
        var select = jQuery("#jshop_filters_"+filter_number+" select[name=extra_fields_t\\["+gid+"\\]\\[\\]]");
        if (select){
            select.val('');            
        }
        jQuery("#jshop_filters_"+filter_number+" input[name=extra_fields\\["+gid+"\\]]").val('');
    }

    if (type=='products_with_old_prices'){
        jQuery('#jshop_filters_'+filter_number+' input[name=show_products_with_old_prices]').prop('checked', false);
        
    }
    if (type=='products_with_free_shipping'){
        jQuery('#jshop_filters_'+filter_number+' input[name=show_products_with_free_shipping]').prop('checked', false);
        
    }
    if (type=='qty'){
        jQuery('#jshop_filters_'+filter_number+' input[name=quantity_filter][value=""]').prop('checked', true);
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=quantity_filter]');
        if (select){
            select.val('');
        }        
    }
    if (type=='photo'){
        jQuery('#jshop_filters_'+filter_number+' input[name=photo_filter][value=""]').prop('checked', true);
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=photo_filter]');
        if (select){
            select.val('');
        }
    }
    if (type=='sets'){
        jQuery('#jshop_filters_'+filter_number+' input[name=sets_filter][value=""]').prop('checked', true);
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=sets_filter]');
        if (select){
            select.val('');
        }        
    }

    if (type=='review'){
        jQuery('#jshop_filters_'+filter_number+' input[name=review_filter][value=""]').prop('checked', true);
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=review_filter]');
        if (select){
            select.val('');
        }        
    }
    if (type=='rating'){
        jQuery('#jshop_filters_'+filter_number+' input[name=rating_filter][value=""]').prop('checked', true);
        var select = jQuery('#jshop_filters_'+filter_number+' select[name=rating_filter]');
        if (select){
            select.val('');
        }
    }

    if (type=='attribute'){
        jQuery("#jshop_filters_"+filter_number+" input[name=attr_val\\[\\]]").each(function(){
            if (id==this.value){
                this.checked = false;
            }
        });
        var select = jQuery("#jshop_filters_"+filter_number+" select.filter_attr_"+gid);
        if (select){
            select.val('');
        }
    }

    if (type=='price_from'){
        jQuery('#jshop_filters_'+filter_number+' input[name=fprice_from]').val('');
    }
    if (type=='price_to'){
        jQuery('#jshop_filters_'+filter_number+' input[name=fprice_to]').val('');        
    }
    if (type=='price_from' || type=='price_to'){
        let min = jQuery('#jshop_filters_'+filter_number+' input[name=fprice_from]').val();
        let max = jQuery('#jshop_filters_'+filter_number+' input[name=fprice_to]').val();
        if (!min) {
            min = mod_jfilter_ext_params['slider_min_price'];
        }
        if (!max) {
            max = mod_jfilter_ext_params['slider_max_price'];
        }
        if (jQuery("#slider-range").length > 0) {
            jQuery(".show_prices #amount").text(min+" "+mod_jfilter_ext_params['currency_code']+" - "+" "+max+" "+mod_jfilter_ext_params['currency_code']);
            jQuery("#slider-range").slider('values', 0, min);
            jQuery("#slider-range").slider('values', 1, max);
        }
    }

    jshop_filters_submit(filter_number, true);
}

function modFilterGetUrlBuild(base_action, data) {
	
    var action = mod_jfilter_ext_params['uri_base']+"index.php?option=com_ajax&module=jshopping_filters_extended&format=json";
    jQuery.ajax({
        type: 'POST',
        beforeSend: function(){
			jshopFiltersBlockLoader().show();
		},
        url: action,
        data: data,
        dataType: 'json',
        error: function(XHR,text){},
        success: function(json){            
            if (json.data) {
                location.href = base_action+'/'+json.data;
            } else {
                location.href = base_action;
            }
        },
        complete: function(XHR, text) {
        }
    });
}

function modFilterPriceSliderInit() {
    jQuery("#slider-range").prop("slide", null);    
    jQuery("#slider-range").slider({
        range: true,
        min: mod_jfilter_ext_params['slider_min_price'],
        max: mod_jfilter_ext_params['slider_max_price'],
        values: [mod_jfilter_ext_params['slider_min_price_active'], mod_jfilter_ext_params['slider_max_price_active']],
        slide: function(event, ui) {
            jQuery(".show_prices #price_from").val(ui.values[0]);
            jQuery(".show_prices #price_to").val(ui.values[1]);
            jQuery(".show_prices #amount").text(ui.values[0]+" "+mod_jfilter_ext_params['currency_code']+" - "+" "+ui.values[1]+" "+mod_jfilter_ext_params['currency_code']);
        }
    });
    modFilterPriceSliderTextInit();
    jQuery("#slider-range").on("slidestop", function(event, ui) {
        var nr_filter = jQuery(event.target).closest('div.jshop_filters').attr('data-scrolling-number');
        if (!nr_filter) nr_filter = 1;
        jshop_filters_submit(nr_filter);
    });
}

function modFilterPriceSliderTextInit() {
    jQuery(".show_prices #amount").text(
        jQuery("#slider-range").slider("values", 0)+" "+mod_jfilter_ext_params['currency_code']+
        " - "+
        jQuery("#slider-range").slider("values", 1)+" "+mod_jfilter_ext_params['currency_code']
    );
}

function jshopFiltersActiveValUpdate() {
	var html = {};

    jQuery('.jshop_filters .fblock').each(function(){
        let filter_number = jQuery(this).closest('.jshop_filters').attr('data-scrolling-number') ?? 1;
        let actives = [];       
        let group = jQuery(this).attr('group');
        let gid = jQuery(this).attr('gid') ?? '';
        let group_name = '';
        let text = '';
        let show_group_name = jQuery(this).attr('show_group_name');
        if (show_group_name == "1") {
            let head = jQuery('.head span', this).text();
            if (!head) head = jQuery('.head', this).text();
            group_name = head?.trim();
        }
        if (typeof html[filter_number] == 'undefined') {
            html[filter_number] = '';
        }

        let val = jQuery('.filter_item select', this).val()?.trim();        
        if (val) {
            text = jQuery('.filter_item select option:selected', this).text()?.trim();
            if (group == 'category') {
                text = text.replace('--', '').trim();
            }
            let data = {
                val: val,
                group: group,
                gid: gid,
                text: text,
                group_name: group_name
            };
            actives.push(data);
        } else if (!val && group != 'price') {
            jQuery('.filter_item input:checked', this).each(function(){
                let val = jQuery(this).val();
                if (val == 0) {
                    return 0;
                }
                text = jQuery(jQuery(this).closest('label')).text().trim();
                if (group == 'category') {
                    text = text.replace('--', '').trim();
                }              
                let data = {
                    val: val,
                    group: group,
                    gid: gid,
                    text: text,
                    group_name: group_name
                };
                actives.push(data);
            });
        }

        if (group == 'extra_field') {
            text = jQuery('.filter_item input[type=text]', this).val();
            if (text) {
                let data = {
                    val: '',
                    group: group,
                    gid: gid,
                    text: text,
                    group_name: group_name
                };
                actives.push(data);
            }
        }

        if (group == 'price') {
            text = jQuery('.filter_item input[name=fprice_from]', this).val();
            if (text) {
                group = 'price_from';
                group_name = jQuery('.filter_item div[group_name_price_from=1]', this).text();
                let data = {
                    val: '1',
                    group: group,
                    gid: '',
                    text: text,
                    group_name: group_name
                };
                actives.push(data);
            }
            text = jQuery('.filter_item input[name=fprice_to]', this).val();
            if (text) {
                group = 'price_to';
                group_name = jQuery('.filter_item div[group_name_price_to=1]', this).text();
                let data = {
                    val: '2',
                    group: group,
                    gid: '',
                    text: text,
                    group_name: group_name
                };
                actives.push(data);
            }

            val = jQuery('.filter_item input[name=show_products_with_old_prices]:checked', this).val();
            if (val) {
                text = jQuery(jQuery('.filter_item input[name=show_products_with_old_prices]:checked', this).closest('label')).text().trim();
                group = 'products_with_old_prices';                
                let data = {
                    val: '0',
                    group: group,
                    gid: '',
                    text: text,
                    group_name: ''
                };
                actives.push(data);
            }
        }

        for (let data of actives) {
            html[filter_number] += '<div class="group_filter_act group_filter_act_'+data.group+'">';
            html[filter_number] += '<a class="filter_active_vals_clear">';
            if (data.group_name) {
                html[filter_number] += '<div class="group_name">'+data.group_name+':</div>';
            }
            html[filter_number] += '<div class="val">'+data.text+'</div>';
            html[filter_number] += '<div class="x filter_active_vals__close">✖</div>';
            html[filter_number] += '<div el="filter_number" style="display:none">'+filter_number+'</div>';
            html[filter_number] += '<div el="val" style="display:none">'+data.val+'</div>';
            html[filter_number] += '<div el="gid" style="display:none">'+data.gid+'</div>';
            html[filter_number] += '<div el="group" style="display:none">'+data.group+'</div>';
            html[filter_number] += '</a>';
            html[filter_number] += '</div>';
        }
    });
	
    for(let fn in html) {        
        $('.filter_active_vals_js[nr='+fn+'] .inner').html(html[fn]);
        let clear = $('.filter_active_vals .clear_all').clone();
        clear.addClass('inner_clear_all');
        $('.filter_active_vals_js[nr='+fn+'] .inner').append(clear);
        if (html[fn]) {
            $('.filter_active_vals_js[nr='+fn+']').show();
        } else {
            $('.filter_active_vals_js[nr='+fn+']').hide();
        }
    }    

}

jQuery(function(){
    jQuery('.btn-filter-out').on('click', function(){
        jQuery(this).toggleClass('opened');
        jQuery(this).next().slideToggle();
    });
});