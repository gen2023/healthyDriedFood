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
			var request = [
				'option=com_ajax',
				'module=sfnforms',
				'method=Sfnforms',
				'format=jsonpc'
			];
			var id = jQuery(validator).find('[name=mod_sfnforms_module_id]').val();
			var values = jQuery(validator).serializeArray();

			var name;
			for (var i = 0; i < values.length; i++) {
				if (values[i].name.indexOf('mod_sfnforms_') === 0) {
					if (values[i].name.indexOf('[]') > -1) {
						name = 'data[' + encodeURIComponent(values[i].name.substring(0, values[i].name.length - 2)) + '][]';
					} else {
						name = 'data[' + encodeURIComponent(values[i].name) + ']';
					}

					request.push(name + '=' + encodeURIComponent(values[i].value));
				} else {
					request.push(encodeURIComponent(values[i].name) + '=' + encodeURIComponent(values[i].value));
				}
			}

			jQuery(validator).find('#mod-sfnforms-submit-btn-' + id).attr("disabled", "disabled");
			jQuery(validator).find('.icon').removeAttr('class').addClass('icon icon-refresh rstpl-rotating');
			jQuery('#mod-sfnforms-contact-form-' + id).addClass('preloader');

			jQuery.ajax({
				type: 'POST',
				data: request.join('&'),
				success: function (response) {
					response = JSON.parse(response);
					if (response.status == 0) {
						jQuery('#mod-sfnforms-error-msg-' + id).hide().html('<div class="alert alert-error alert-danger">' + response.message + '</div>').fadeIn().delay(1000).fadeOut(5000);
						jQuery(validator).find('#mod-sfnforms-submit-btn-' + id).removeAttr("disabled");
						jQuery(validator).find('.icon').removeAttr('class').addClass('icon icon-envelope');
						jQuery('#mod-sfnforms-contact-form-' + id).removeClass('preloader');
					}

					if (response.status == 1) {
						const modal = jQuery(validator).nextAll('#mod-sfnforms-modal-' + id);

						if (modal.length > 0) {
							const container_message = modal.find('.message-container');
							container_message.html(response.message).fadeIn();
							modal.fadeIn();

							jQuery(validator).find('input, textarea').not('input[type="checkbox"], input[type="radio"], input[type="hidden"], input[name="mod_sfnforms_nospam"]').val('');
							jQuery(validator).find('input:checkbox, input:radio').prop('checked', false);
							jQuery(validator).find('#mod-sfnforms-submit-btn-' + id).removeAttr("disabled");
							jQuery(validator).find('.icon').removeAttr('class').addClass('icon icon-envelope');
							jQuery('#mod-sfnforms-contact-form-' + id).removeClass('preloader');

							modal.find('.close-btn').on('click', function () {
								modal.fadeOut();
							});

						} else {
							jQuery(validator).nextAll('#mod-sfnforms-msg-' + id).hide()
								.html('<div class="alert alert-success">' + response.message + '</div>')
								.delay(500).fadeIn();

							jQuery(validator).fadeOut(500, function () {
								jQuery(this).remove();
							});
						}


						if (response.warnings.length > 0) {
							jQuery(validator).nextAll('#mod-sfnforms-warning-msg-' + id).hide().html('<div class="alert alert-warning"></div>').delay(500).fadeIn();
							jQuery(validator).find('.icon').removeAttr('class').addClass('icon icon-envelope');
							jQuery.each(response.warnings, function (i, value) {
								jQuery(".alert-warning").append(value + '<br />');
							});
						}

						jQuery('html, body').animate({
							scrollTop: jQuery(validator).offset().top - 10
						}, 2000);
					}
				},
				error: function (response) {
					response = JSON.parse(response);
					jQuery(validator).find('#mod-sfnforms-error-msg-' + id).hide().html('<div class="alert alert-error alert-danger">' + response.message + '</div>').fadeIn().delay(2000).fadeOut(5000);
					jQuery(validator).find('.icon').removeAttr('class').addClass('icon icon-envelope');
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
