var SFNForms = {
	init: function (uniqid) {
		var $container = jQuery("#mod-sfnforms-container-" + uniqid);

		if (typeof jQuery.fn.validate === 'function') {
			$container.find("#mod-sfnforms-contact-form-" + uniqid).validate();
		} else {
			console.log('jQuery.fn.validate not found.');
		}
	},

	textCounter: function (field, maxlimit) {
		return maxlimit - field.value.length;
	}
};

jQuery(document).ready(function () {
	if (typeof jQuery.validator === 'undefined') {
		console.log('jQuery.validator not found. Make sure jquery.validate.js is loaded.');
		return;
	}

	jQuery.validator.setDefaults({
		errorClass: "error",
		labelErrorClass: "mod-sfnforms-error",
		validClass: "success",
		ignore: ".ignore",
		focusInvalid: true,
		highlight: function (element, errorClass) {
			jQuery(element).fadeIn();
		},
		rules: {},
		messages: {},
		submitHandler: function (validator, event) {
    event.preventDefault();
    const form = jQuery(validator);
		
    const id = form.find('[name=mod_sfnforms_module_id]').val();

    const formData = new FormData(form[0]);

    form.find('#mod-sfnforms-submit-btn-' + id).attr("disabled", "disabled");
    form.find('.icon').removeAttr('class').addClass('icon icon-refresh rstpl-rotating');
    form.addClass('preloader');

    jQuery.ajax({
        url: 'index.php?option=com_ajax&module=sfnforms&method=Sfnforms&format=jsonpc',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            response = JSON.parse(response);

            if (response.status == 0) {
                form.find('#mod-sfnforms-error-msg-' + id).hide().html('<div class="alert alert-error alert-danger">' + response.message + '</div>').fadeIn().delay(1000).fadeOut(5000);
                form.find('#mod-sfnforms-submit-btn-' + id).removeAttr("disabled");
                form.find('.icon').removeAttr('class').addClass('icon icon-envelope');
                form.removeClass('preloader');
            }

            if (response.status == 1) {
                const modal = form.nextAll('#mod-sfnforms-modal-' + id);
                if (modal.length > 0) {
                    modal.find('.message-container').html(response.message).fadeIn();
                    modal.fadeIn();
                    form[0].reset();
                    form.find('#mod-sfnforms-submit-btn-' + id).removeAttr("disabled");
                    form.find('.icon').removeAttr('class').addClass('icon icon-envelope');
                    form.removeClass('preloader');

                    modal.find('.close-btn').on('click', function () {
                        modal.fadeOut();
                    });
                } else {
                    form.nextAll('#mod-sfnforms-msg-' + id).hide()
                        .html('<div class="alert alert-success">' + response.message + '</div>')
                        .delay(500).fadeIn();
                    form.fadeOut(500, function () {
                        jQuery(this).remove();
                    });
                }

                if (response.warnings.length > 0) {
                    form.nextAll('#mod-sfnforms-warning-msg-' + id).hide().html('<div class="alert alert-warning"></div>').delay(500).fadeIn();
                    form.find('.icon').removeAttr('class').addClass('icon icon-envelope');
                    jQuery.each(response.warnings, function (i, value) {
                        jQuery(".alert-warning").append(value + '<br />');
                    });
                }

                const animationFinish = parseInt(form.data('animation'), 10);
                if (animationFinish) {
                    jQuery('html, body').animate({
                        scrollTop: form.offset().top - 10
                    }, 2000);
                }
            }
        },
        error: function (response) {
            form.find('#mod-sfnforms-error-msg-' + id).hide().html('<div class="alert alert-error alert-danger">' + response.message + '</div>').fadeIn().delay(2000).fadeOut(5000);
            form.find('.icon').removeAttr('class').addClass('icon icon-envelope');
        }
    });
    return false;
}
	});

	jQuery('.sfnforms form').each(function () {
		var $form = jQuery(this);
		var rules = {};
		var messages = {};

		$form.find('[required], .required, [data-rule-required], [aria-required="true"],  [min], [max], [data-min], [data-max], [data-validphone], [data-validtype]').each(function () {
			var $field = jQuery(this);
			const name = $field.attr('name');
			if (!name) return;

			rules[name] = {};
			messages[name] = {};

			if ($field.is('[min], [data-min]')) {
				const minlength = parseInt($field.attr('min') || $field.data('min'), 10);

				if (!isNaN(minlength)) {
					rules[name].minlength = minlength;
					messages[name].minlength = Joomla.JText._('MOD_SFNFORMS_ERROR_MINLENGTH') + ' ' + minlength;
				}
			}

			if ($field.is('[max], [data-max]')) {
				const maxlength = parseInt($field.attr('max') || $field.data('max'), 10);
				if (!isNaN(maxlength)) {
					rules[name].maxlength = maxlength;
					messages[name].maxlength = Joomla.JText._('MOD_SFNFORMS_ERROR_MAXLENGTH') + ' ' + maxlength;
				}
			}

			if ($field.is('[data-validphone]')) {
				rules[name].phoneUA = true;
				messages[name].phoneUA = Joomla.JText._('MOD_SFNFORMS_ERROR_PHONE_NUMBER');
			}
			if ($field.is('[data-validtype]')) {
				let validType = $field.attr('data-validtype');

				switch (validType) {
					case 'number':
						rules[name].digits = true;
						messages[name].digits = Joomla.JText._('MOD_SFNFORMS_ERROR_NUMBER');
						break;
					case 'validText':
						rules[name].textonly = true;
						messages[name].textonly = Joomla.JText._('MOD_SFNFORMS_ERROR_TEXT');
						break;
					case 'validTextNumber':
						rules[name].alphanumeric = true;
						messages[name].alphanumeric = Joomla.JText._('MOD_SFNFORMS_ERROR_TEXT');
						break;
					default:
						break;
				}
			}

		});

		$form.validate({
			rules: rules,
			messages: messages
		});
	});
});

jQuery(document).on('click', '.upload-btn', function () {
    const btn = jQuery(this);
    const uniq = btn.data('uniq');
    const fileInput = jQuery('#mod-sfnforms-file-' + uniq)[0];
    fileInput.click();
});

jQuery(document).on('change', 'input[type="file"]', function () {
    const input = this;
    const uniq = jQuery(input).attr('id').replace('mod-sfnforms-file-', '');
    const btn = jQuery('.upload-btn[data-uniq="' + uniq + '"]');

    const count = input.files.length;

    let countSpan = btn.find('span.count');
    if (countSpan.length === 0) {
        countSpan = jQuery('<span class="count"></span>');
        btn.append(countSpan);
    }

    countSpan.text(count);
});