/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************************************************!*\
  !*** ./plg_jshopping_nevigen_novaposhta/es6/main.es6 ***!
  \*******************************************************/
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.3.6
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */



let novaposhtaSelect = [],
  novaposhtaAutoCompleteInput = [];
window.NevigenNovaposhta = {
  calculation: function (element, type, id) {
    let ignoreNevigenOneStep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (!element || !type || !id) return false;
    let container = document.querySelector('[data-nevigen-novaposhta-container="' + id + '"]');
    if (container) {
      let messageBlock = container.querySelector('[data-nevigen-novaposhta-message="' + id + '"]');
      let ajaxData = new FormData();
      if (element.value) {
        let postcode = container.querySelector('[name="params[' + id + '][nevigen_novaposhta_postcode]"]');
        if (postcode) {
          let valid = window.NevigenNovaposhta.checkPostcode(postcode, id);
          if (!valid) {
            return false;
          }
          ajaxData.set('postcode', postcode.value);
          ajaxData.set('value', element.value);
          if (type === 'warehouse' || type === 'postomat') {
            if (window.NevigenOneStepCheckoutClass && ignoreNevigenOneStep === false) {
              return false;
            }
            ajaxData.set('type', type);
          } else {
            ajaxData.set('type', 'doors');
          }
          Joomla.removeMessages(messageBlock);
        }
      }
      window.NevigenNovaposhta.sendAjax('post', 'calculation', ajaxData).then(response => {
        if (response.data && response.data.price_string) {
          window.NevigenNovaposhta.setPrice(id, response.data.price_string);
        } else {
          window.NevigenNovaposhta.setPrice(id, 0);
        }
      }).catch(error => {
        window.NevigenNovaposhta.setError(id, error.message);
      });
    }
  },
  validPostcode: (elementPostcode, id) => {
    if (elementPostcode) {
      elementPostcode.value = elementPostcode.value.replace(/[^.\d]+/g, '').replace(/^([^.]*\.)|\./g, '$1');
      if (elementPostcode.value.length > 5) {
        elementPostcode.value = elementPostcode.value.slice(0, -1);
      }
      let type = elementPostcode.getAttribute('data-nevigen-novaposhta');
      if (elementPostcode.value.length === 5) {
        if (type === 'pickup') {
          window.NevigenNovaposhta.setPreloader();
          window.NevigenNovaposhta.getWarehouses(elementPostcode, id);
          window.NevigenNovaposhta.removePreloader();
        } else if (type === 'postomat') {
          window.NevigenNovaposhta.setPreloader();
          window.NevigenNovaposhta.getPostomat(elementPostcode, id);
          window.NevigenNovaposhta.removePreloader();
        } else if (type === 'courier') {
          window.NevigenNovaposhta.setPreloader();
          window.NevigenNovaposhta.validCourier(elementPostcode, 'postcode', id);
          window.NevigenNovaposhta.removePreloader();
        }
      }
    }
  },
  checkPostcode: (elementPostcode, id) => {
    if (elementPostcode && id) {
      if (elementPostcode.value.length < 5) {
        window.NevigenNovaposhta.setError(id, Joomla.Text._('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_POSTCODE'));
        return false;
      }
      return true;
    }
  },
  searchCity: (element, id) => {
    if (element && id) {
      let postcode = document.querySelector('[name="params[' + id + '][nevigen_novaposhta_postcode]"]'),
        nameInput = element.getAttribute('name');
      if (element.value.length === 3) {
        if (postcode) {
          postcode.value = '';
        }
        let ajaxData = new FormData();
        ajaxData.set('value', element.value);
        window.NevigenNovaposhta.sendAjax('post', 'searchCity', ajaxData).then(response => {
          if (typeof response.data === 'object') {
            window.NevigenNovaposhta.initAutoComplete(nameInput, response.data);
            if (novaposhtaAutoCompleteInput[nameInput]) {
              novaposhtaAutoCompleteInput[nameInput].start();
              novaposhtaAutoCompleteInput[nameInput].input.addEventListener('selection', event => {
                let selectedValue = event.detail.selection.value;
                novaposhtaAutoCompleteInput[nameInput].input.value = selectedValue['name'];
                window.NevigenNovaposhta.setPostcodeByRef(selectedValue['ref'], id);
              });
            }
          }
        }).catch(error => {
          if (postcode) {
            postcode.value = '';
          }
          window.NevigenNovaposhta.setError(id, error.message);
        });
      } else if (element.value.length < 3 && novaposhtaAutoCompleteInput[nameInput] && novaposhtaAutoCompleteInput[nameInput].data.src.length > 0) {
        novaposhtaAutoCompleteInput[nameInput].data.src = [];
        novaposhtaAutoCompleteInput[nameInput].start();
        if (postcode) {
          postcode.value = '';
        }
        let street = document.querySelector('[name="params[' + id + '][nevigen_novaposhta_street]"]');
        if (street) {
          let nameInputStreet = street.getAttribute('name');
          if (novaposhtaAutoCompleteInput[nameInputStreet]) {
            novaposhtaAutoCompleteInput[nameInputStreet].data.src = [];
            novaposhtaAutoCompleteInput[nameInputStreet].start();
          }
          window.NevigenNovaposhta.disabledFields(id, ['street', 'house', 'apartment']);
        }
      }
      return true;
    }
  },
  setPostcodeByRef: (ref, id) => {
    if (!ref || !id) return false;
    let ajaxData = new FormData();
    ajaxData.set('ref', ref);
    window.NevigenNovaposhta.sendAjax('post', 'getPostcodeByRef', ajaxData).then(response => {
      if (response.data) {
        let container = document.querySelector('[data-nevigen-novaposhta-container="' + id + '"]');
        if (container) {
          let postcode = container.querySelector('[name="params[' + id + '][nevigen_novaposhta_postcode]"]');
          if (postcode) {
            postcode.value = response.data;
            postcode.dispatchEvent(new Event('change', {
              'bubbles': true
            }));
            let type = postcode.getAttribute('data-nevigen-novaposhta');
            window.NevigenNovaposhta.validPostcode(postcode, id);
            if (type === 'courier') {
              window.NevigenNovaposhta.validCourier(postcode, 'street', id);
            }
          }
        }
      }
    }).catch(error => {
      window.NevigenNovaposhta.setError(id, error.message);
    });
  },
  getWarehouses: (element, id) => {
    if (!element || !id) return false;
    let valid = window.NevigenNovaposhta.checkPostcode(element, id);
    if (!valid) {
      return false;
    }
    let container = document.querySelector('[data-nevigen-novaposhta-container="' + id + '"]'),
      keyCookies = 'nevigen_novaposhta_postcode_send_warehouse',
      sendPostcode = window.NevigenNovaposhta.getCookie(keyCookies);
    if (sendPostcode === '' || sendPostcode !== element.value) {
      window.NevigenNovaposhta.setCookie(keyCookies, element.value);
      let currentWarehouse = container.querySelector('select[name="params[' + id + '][nevigen_novaposhta_warehouse]"]');
      if (currentWarehouse) {
        currentWarehouse.value = '';
        currentWarehouse.setAttribute('disabled', '');
        window.NevigenNovaposhta.initSelect(id, 'warehouse', []);
      }
      let ajaxData = new FormData();
      ajaxData.set('postcode', element.value);
      window.NevigenNovaposhta.sendAjax('post', 'getWarehouses', ajaxData).then(response => {
        if (typeof response.data === 'object') {
          if (currentWarehouse) {
            currentWarehouse.removeAttribute('disabled');
          }
          window.NevigenNovaposhta.initSelect(id, 'warehouse', response.data);
        } else {
          window.NevigenNovaposhta.setPrice(id, 0);
        }
      }).catch(error => {
        window.NevigenNovaposhta.setError(id, error.message);
      });
    }
  },
  getPostomat: (element, id) => {
    if (!element || !id) return false;
    let valid = window.NevigenNovaposhta.checkPostcode(element, id);
    if (!valid) {
      return false;
    }
    let container = document.querySelector('[data-nevigen-novaposhta-container="' + id + '"]'),
      keyCookies = 'nevigen_novaposhta_postcode_send_postomat',
      sendPostcode = window.NevigenNovaposhta.getCookie(keyCookies);
    if (sendPostcode === '' || sendPostcode !== element.value) {
      window.NevigenNovaposhta.setCookie(keyCookies, element.value);
      let currentPostomat = container.querySelector('select[name="params[' + id + '][nevigen_novaposhta_postomat]"]');
      if (currentPostomat) {
        currentPostomat.value = '';
        currentPostomat.setAttribute('disabled', '');
        window.NevigenNovaposhta.initSelect(id, 'postomat', []);
      }
      let ajaxData = new FormData();
      ajaxData.set('postcode', element.value);
      window.NevigenNovaposhta.sendAjax('post', 'getPostomat', ajaxData).then(response => {
        if (typeof response.data === 'object') {
          if (currentPostomat) {
            currentPostomat.removeAttribute('disabled');
          }
          window.NevigenNovaposhta.initSelect(id, 'postomat', response.data);
        } else {
          window.NevigenNovaposhta.setPrice(id, 0);
        }
      }).catch(error => {
        window.NevigenNovaposhta.setError(id, error.message);
      });
    }
  },
  initSelect: (id, field, values) => {
    if (!id || !field) {
      return false;
    }
    if (!novaposhtaSelect[id]) {
      novaposhtaSelect[id] = null;
    }
    let container = document.querySelector('[data-nevigen-novaposhta-container="' + id + '"]');
    if (container) {
      let params = {
        position: 'bottom',
        noResultsText: Joomla.Text._('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_RESULTS'),
        noChoicesText: Joomla.Text._('ADDON_NEVIGEN_NOVAPOSHTA_ERROR_RESULTS'),
        placeholderValue: Joomla.Text._('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_WAREHOUSE'),
        searchPlaceholderValue: Joomla.Text._('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_WAREHOUSE')
      };
      if (typeof values === 'object' && novaposhtaSelect[id]) {
        if (typeof novaposhtaSelect[id] === 'object') {
          if (values.length === 0) {
            novaposhtaSelect[id].removeActiveItems();
            novaposhtaSelect[id].clearChoices();
            novaposhtaSelect[id].disable();
            let element = container.querySelector('[name="params[' + id + '][nevigen_novaposhta_' + field + ']"]');
            if (element) {
              element = element.closest('.choices__inner');
              let item = element.querySelector('.choices__list--single');
              if (item) {
                item.innerText = Joomla.Text._('ADDON_NEVIGEN_NOVAPOSHTA_PLACEHOLDER_' + field);
              }
            }
          } else {
            novaposhtaSelect[id].setChoices(values, 'value', 'label', true);
            novaposhtaSelect[id].enable();
          }
        } else {
          let element = container.querySelector('[name="params[' + id + '][nevigen_novaposhta_' + field + ']"]');
          if (element) {
            novaposhtaSelect[id] = new Choices(element, params);
            if (values.length !== 0) {
              novaposhtaSelect[id].setChoices(values, 'value', 'label', true);
              novaposhtaSelect[id].enable();
            }
          }
        }
      } else {
        let elements = container.querySelectorAll('[name="params[' + id + '][nevigen_novaposhta_' + field + ']"]');
        if (elements.length > 0) {
          elements.forEach(element => {
            if (novaposhtaSelect[id] === null) {
              novaposhtaSelect[id] = new Choices(element, params);
            } else {
              if (typeof novaposhtaSelect[id] === 'object') {
                novaposhtaSelect[id].destroy();
              }
              novaposhtaSelect[id] = new Choices(element, params);
            }
          });
        }
      }
    }
  },
  initAutoComplete(name, values) {
    if (!name) return false;
    if (novaposhtaAutoCompleteInput[name]) {
      novaposhtaAutoCompleteInput[name].data.src = values;
      novaposhtaAutoCompleteInput[name].start();
      return true;
    }
    novaposhtaAutoCompleteInput[name] = new autoComplete({
      wrapper: false,
      data: {
        src: values,
        keys: ['name']
      },
      selector: 'input[name="' + name + '"]',
      resultsList: {
        maxResults: 1000,
        noResults: true
      },
      resultItem: {
        highlight: true
      },
      events: {
        input: {
          focus() {
            if (novaposhtaAutoCompleteInput[name].input.value.length) {
              novaposhtaAutoCompleteInput[name].start();
            }
          }
        }
      }
    });
  },
  validCourier: (element, fieldValid, id) => {
    if (!element || !fieldValid || !id) return false;
    let container = document.querySelector('[data-nevigen-novaposhta-container="' + id + '"]');
    if (container) {
      let postcode = container.querySelector('[name="params[' + id + '][nevigen_novaposhta_postcode]"]');
      if (postcode) {
        let valid = window.NevigenNovaposhta.checkPostcode(postcode, id);
        if (!valid) {
          window.NevigenNovaposhta.disabledFields(id, ['street', 'house', 'apartment']);
          return false;
        }
        let fieldNext = container.querySelector('[name="params[' + id + '][nevigen_novaposhta_' + fieldValid + ']"]'),
          sendPostcode = window.NevigenNovaposhta.getCookie('nevigen_novaposhta_postcode_send');
        if (fieldNext) {
          if (fieldValid === 'street') {
            if (sendPostcode === '' || sendPostcode !== postcode.value) {
              fieldNext.value = '';
            }
            window.NevigenNovaposhta.disabledFields(id, ['house', 'apartment']);
            window.NevigenNovaposhta.calculation(postcode, 'courier', id);
          } else if (fieldValid === 'house') {
            window.NevigenNovaposhta.disabledFields(id, ['house', 'apartment']);
          }
          if (element.value) {
            fieldNext.removeAttribute('disabled');
          } else {
            fieldNext.value = '';
            fieldNext.setAttribute('disabled', '');
          }
        }
      }
    }
  },
  getStreets: (element, id) => {
    if (!element || !id) {
      return false;
    }
    let nameInput = element.getAttribute('name');
    if (element.value.length === 3) {
      let postcode = document.querySelector('[name="params[' + id + '][nevigen_novaposhta_postcode]"]');
      if (postcode) {
        let valid = window.NevigenNovaposhta.checkPostcode(postcode, id);
        if (!valid) {
          window.NevigenNovaposhta.disabledFields(id, ['street', 'house', 'apartment']);
          return false;
        }
        let ajaxData = new FormData();
        ajaxData.set('postcode', postcode.value);
        ajaxData.set('value', element.value);
        window.NevigenNovaposhta.sendAjax('post', 'getStreets', ajaxData).then(response => {
          if (typeof response.data === 'object') {
            window.NevigenNovaposhta.initAutoComplete(nameInput, response.data);
            if (novaposhtaAutoCompleteInput[nameInput]) {
              novaposhtaAutoCompleteInput[nameInput].start();
              novaposhtaAutoCompleteInput[nameInput].input.addEventListener('selection', event => {
                let selectedValue = event.detail.selection.value;
                novaposhtaAutoCompleteInput[nameInput].input.value = selectedValue['name'];
                window.NevigenNovaposhta.validCourier(element, 'house', id);
              });
            }
          } else {
            window.NevigenNovaposhta.setPrice(id, 0);
          }
        }).catch(error => {
          window.NevigenNovaposhta.setError(id, error.message);
        });
      }
    } else if (element.value.length < 3 && novaposhtaAutoCompleteInput[nameInput] && novaposhtaAutoCompleteInput[nameInput].data.src.length > 0) {
      novaposhtaAutoCompleteInput[nameInput].data.src = [];
      novaposhtaAutoCompleteInput[nameInput].start();
      window.NevigenNovaposhta.disabledFields(id, ['house', 'apartment']);
    }
  },
  disabledFields: (id, fields) => {
    if (!id || !fields || fields.length === 0) {
      return false;
    }
    fields.forEach(fieldName => {
      let field = document.querySelector('[name="params[' + id + '][nevigen_novaposhta_' + fieldName + ']"]');
      if (field) {
        field.value = '';
        field.setAttribute('disabled', '');
      }
    });
  },
  setPrice: (id, price_string) => {
    if (!id) {
      return false;
    }
    let inputMethod = document.querySelector('[data-shipping_id="' + id + '"]');
    if (inputMethod) {
      let label = document.querySelector('label[for="shipping_method_' + inputMethod.value + '"]'),
        containerOneStepCheckout = document.querySelector('[data-nevigen-onestepcheckout-shipping="' + inputMethod.valu + '"]');
      if (label) {
        let shipping_price = label.querySelector('.shipping_price');
        let nvg_shipping_cost = label.querySelector('.nvg_shipping_cost');
        if (containerOneStepCheckout) {
          shipping_price = containerOneStepCheckout.querySelector('.shipping_price');
          nvg_shipping_cost = containerOneStepCheckout.querySelector('.nvg_shipping_cost');
        }
        if (typeof price_string === 'number' && price_string === 0) {
          price_string = '';
        }
        if (shipping_price) {
          shipping_price.innerHTML = price_string;
        }
        if (nvg_shipping_cost) {
          nvg_shipping_cost.innerHTML = price_string;
        }
      }
    }
  },
  sendAjax: (methodAjax, method, ajaxData) => {
    let param = Joomla.getOptions('nevigen_novaposhta');
    window.NevigenNovaposhta.setPreloader();
    return new Promise((resolve, reject) => {
      if (!param || !ajaxData || !methodAjax || !method) {
        reject('Error ajax data');
        return false;
      }
      if (param.csrf) {
        ajaxData.set(param.csrf, 1);
      }
      ajaxData.set('task', 'NevigenNovaposhta.' + method);
      Joomla.request({
        url: param.controller,
        method: methodAjax,
        data: ajaxData,
        onSuccess: resp => {
          window.NevigenNovaposhta.removePreloader();
          let response;
          try {
            response = JSON.parse(resp);
          } catch (error) {
            throw new Error('Failed to parse JSON');
          }
          if (response && response.success === true) {
            resolve(response);
          } else {
            reject(response);
          }
        },
        onError: resp => {
          window.NevigenNovaposhta.removePreloader();
          let response;
          try {
            response = JSON.parse(resp.response);
          } catch (error) {
            throw new Error('Failed to parse JSON');
          }
          reject(response);
        }
      });
    });
  },
  setError: (id, message) => {
    let error = Joomla.getOptions('nevigen_novaposhta_error_' + id);
    if (id && (message || error)) {
      if (!message) {
        message = error.message;
      }
      let messageBlock = document.querySelector('[data-nevigen-novaposhta-message="' + id + '"]');
      if (messageBlock) {
        Joomla.renderMessages({
          'error': [message]
        }, messageBlock);
      }
    }
  },
  setPreloader: () => {
    let preloaderSource = document.querySelector('[data-nevigen-novaposhta="preloader"]');
    if (!preloaderSource) {
      preloaderSource = document.querySelector('[nevigen-novaposhta="preloader"]');
    }
    if (preloaderSource) {
      let preloader = preloaderSource.cloneNode(true);
      preloader.setAttribute('data-active', 1);
      document.body.appendChild(preloader);
      preloader.style.display = '';
    }
  },
  removePreloader: () => {
    let preloaderSource = document.querySelector('[data-nevigen-novaposhta="preloader"][data-active]');
    if (!preloaderSource) {
      preloaderSource = document.querySelector('[nevigen-novaposhta="preloader"][data-active]');
    }
    if (preloaderSource) {
      preloaderSource.remove();
    }
  },
  setCookie: (cookieName, value) => {
    document.cookie = cookieName + "=" + value + "" + "; path=/";
  },
  getCookie: c_name => {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=");
      if (c_start !== -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(";", c_start);
        if (c_end === -1) {
          c_end = document.cookie.length;
        }
        return decodeURI(document.cookie.substring(c_start, c_end));
      }
    }
    return '';
  },
  removeCookie: cookieName => {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};
document.addEventListener('DOMContentLoaded', () => {
  let sh_pr_method_id = document.querySelector('input[name="sh_pr_method_id"]:checked');
  if (sh_pr_method_id) {
    let id = sh_pr_method_id.getAttribute('data-shipping_id');
    let postcode = document.querySelector('input[name="params[' + id + '][nevigen_novaposhta_postcode]"]');
    if (postcode) {
      window.NevigenNovaposhta.initSelect(id, 'warehouse');
      window.NevigenNovaposhta.initSelect(id, 'postomat');
      window.NevigenNovaposhta.setError(id);
      if (!postcode.value) {
        window.NevigenNovaposhta.removeCookie('nevigen_novaposhta_postcode');
        window.NevigenNovaposhta.removeCookie('nevigen_novaposhta_postcode_send_warehouse');
        window.NevigenNovaposhta.removeCookie('nevigen_novaposhta_postcode_send_postomat');
      }
    }
  }
  let defaultForm = document.querySelector('.jshop #shipping_form');
  if (defaultForm) {
    let methods = defaultForm.querySelectorAll('input[name="sh_pr_method_id"]');
    if (methods.length > 0) {
      methods.forEach(element => {
        element.addEventListener('change', e => {
          let postcode = defaultForm.querySelector('input[name="params[' + element.value + '][nevigen_novaposhta_postcode]"]');
          if (postcode) {
            let id = element.getAttribute('data-shipping_id');
            window.NevigenNovaposhta.setError(id);
            let city = defaultForm.querySelector('input[name="params[' + element.value + '][nevigen_novaposhta_city]"]'),
              warehouse = defaultForm.querySelector('input[name="params[' + element.value + '][nevigen_novaposhta_warehouse]"]'),
              postomat = defaultForm.querySelector('input[name="params[' + element.value + '][nevigen_novaposhta_postomat]"]');
            if (postcode.value === '') {
              if (city) {
                city.value = '';
              }
              if (warehouse) {
                warehouse.value = '';
                warehouse.setAttribute('disabled', '');
                window.NevigenNovaposhta.initSelect(id, 'warehouse', []);
              }
              if (postomat) {
                postomat.value = '';
                postomat.setAttribute('disabled', '');
                window.NevigenNovaposhta.initSelect(id, 'postomat', []);
              }
            } else {
              if (warehouse && warehouse.value === '') {
                window.NevigenNovaposhta.getWarehouses(postcode, id);
              }
              if (postomat && postomat.value === '') {
                window.NevigenNovaposhta.getPostomat(postcode, id);
              }
            }
          }
        });
      });
    }
  }
});
document.addEventListener('nevigenOneStepCheckoutAfterSaveMethodsParams', event => {
  let data = event.detail;
  if (data && data.name) {
    if (data.name.includes('nevigen_novaposhta_')) {
      let field = data.name.replace('nevigen_novaposhta_', '');
      if (field && field !== 'warehouse' && field !== 'postomat') {
        let name = '';
        if (field === 'postcode') {
          name = 'd_zip';
        } else if (field === 'city') {
          name = 'd_city';
        } else if (field === 'street') {
          name = 'd_street';
        } else if (field === 'house') {
          name = 'd_home';
        } else if (field === 'apartment') {
          name = 'd_apartment';
        }
        if (name) {
          let ajaxData = new FormData();
          ajaxData.set('type', 'address');
          ajaxData.set('saveformdata[' + name + ']', data.element.value);
          ajaxData.set('method', 'nevigen_novaposhta');
          window.NevigenOneStepCheckout().sendAjax('post', 'saveFormData', ajaxData).then(response => {}).catch(error => {
            window.NevigenNovaposhta.setError(data.id, error.message);
          });
        }
      } else if (field === 'warehouse' || field === 'postomat') {
        window.NevigenNovaposhta.calculation(data.element, field, data.id, true);
      }
    }
  }
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q00sR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7VUFDL0JOLFFBQVEsQ0FBQ00sR0FBRyxDQUFDLGVBQWUsR0FBRzBFLElBQUksR0FBRyxHQUFHLEVBQUVuRSxJQUFJLENBQUN4QixPQUFPLENBQUNhLEtBQUssQ0FBQztVQUM5REYsUUFBUSxDQUFDTSxHQUFHLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDO1VBQzVDcEIsTUFBTSxDQUFDa0ssc0JBQXNCLENBQUMsQ0FBQyxDQUFDMUksUUFBUSxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUVWLFFBQVEsQ0FBQyxDQUFDVyxJQUFJLENBQUVDLFFBQVEsSUFBSyxDQUU5RixDQUFDLENBQUMsQ0FBQ0ksS0FBSyxDQUFFQyxLQUFLLElBQUs7WUFDbkIvQixNQUFNLENBQUNDLGlCQUFpQixDQUFDK0IsUUFBUSxDQUFDTCxJQUFJLENBQUN0QixFQUFFLEVBQUUwQixLQUFLLENBQUNFLE9BQU8sQ0FBQztVQUMxRCxDQUFDLENBQUM7UUFDSDtNQUNELENBQUMsTUFBTSxJQUFJd0MsS0FBSyxLQUFLLFdBQVcsSUFBSUEsS0FBSyxLQUFLLFVBQVUsRUFBRTtRQUN6RHpFLE1BQU0sQ0FBQ0MsaUJBQWlCLENBQUNDLFdBQVcsQ0FBQ3lCLElBQUksQ0FBQ3hCLE9BQU8sRUFBRXNFLEtBQUssRUFBRTlDLElBQUksQ0FBQ3RCLEVBQUUsRUFBRSxJQUFJLENBQUM7TUFDekU7SUFFRDtFQUNEO0FBQ0QsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9ub3ZhcG9zaHRhLy4vcGxnX2pzaG9wcGluZ19uZXZpZ2VuX25vdmFwb3NodGEvZXM2L21haW4uZXM2Il0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBAcGFja2FnZSAgICBOZXZpZ2VuIEpTaG9wIE5vdmFwb3NodGEgU2hpcHBpbmcgUGFja2FnZVxuICogQHZlcnNpb24gICAgMS4zLjZcbiAqIEBhdXRob3IgICAgIE5ldmlnZW4uY29tIC0gaHR0cHM6Ly9uZXZpZ2VuLmNvbVxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IMKpIE5ldmlnZW4uY29tLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogQGxpY2Vuc2UgICAgUHJvcHJpZXRhcnkuIENvcHlyaWdodGVkIENvbW1lcmNpYWwgU29mdHdhcmVcbiAqIEBsaW5rICAgICAgIGh0dHBzOi8vbmV2aWdlbi5jb21cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcbmxldCBub3ZhcG9zaHRhU2VsZWN0ID0gW10sXG5cdG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dCA9IFtdO1xud2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhID0ge1xuXHRjYWxjdWxhdGlvbjogKGVsZW1lbnQsIHR5cGUsIGlkLCBpZ25vcmVOZXZpZ2VuT25lU3RlcCA9IGZhbHNlKSA9PiB7XG5cdFx0aWYgKCFlbGVtZW50IHx8ICF0eXBlIHx8ICFpZCkgcmV0dXJuIGZhbHNlO1xuXHRcdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW5vdmFwb3NodGEtY29udGFpbmVyPVwiJyArIGlkICsgJ1wiXScpO1xuXHRcdGlmIChjb250YWluZXIpIHtcblx0XHRcdGxldCBtZXNzYWdlQmxvY2sgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1ub3ZhcG9zaHRhLW1lc3NhZ2U9XCInICsgaWQgKyAnXCJdJyk7XG5cdFx0XHRsZXQgYWpheERhdGEgPSBuZXcgRm9ybURhdGE7XG5cdFx0XHRpZiAoZWxlbWVudC52YWx1ZSkge1xuXHRcdFx0XHRsZXQgcG9zdGNvZGUgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3Bvc3Rjb2RlXVwiXScpO1xuXHRcdFx0XHRpZiAocG9zdGNvZGUpIHtcblx0XHRcdFx0XHRsZXQgdmFsaWQgPSB3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuY2hlY2tQb3N0Y29kZShwb3N0Y29kZSwgaWQpO1xuXHRcdFx0XHRcdGlmICghdmFsaWQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhamF4RGF0YS5zZXQoJ3Bvc3Rjb2RlJywgcG9zdGNvZGUudmFsdWUpO1xuXHRcdFx0XHRcdGFqYXhEYXRhLnNldCgndmFsdWUnLCBlbGVtZW50LnZhbHVlKTtcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3dhcmVob3VzZScgfHwgdHlwZSA9PT0gJ3Bvc3RvbWF0Jykge1xuXHRcdFx0XHRcdFx0aWYgKHdpbmRvdy5OZXZpZ2VuT25lU3RlcENoZWNrb3V0Q2xhc3MgJiYgaWdub3JlTmV2aWdlbk9uZVN0ZXAgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGFqYXhEYXRhLnNldCgndHlwZScsIHR5cGUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhamF4RGF0YS5zZXQoJ3R5cGUnLCAnZG9vcnMnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Sm9vbWxhLnJlbW92ZU1lc3NhZ2VzKG1lc3NhZ2VCbG9jayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZW5kQWpheCgncG9zdCcsICdjYWxjdWxhdGlvbicsIGFqYXhEYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YSAmJiByZXNwb25zZS5kYXRhLnByaWNlX3N0cmluZykge1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRQcmljZShpZCwgcmVzcG9uc2UuZGF0YS5wcmljZV9zdHJpbmcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRQcmljZShpZCwgMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldEVycm9yKGlkLCBlcnJvci5tZXNzYWdlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0dmFsaWRQb3N0Y29kZTogKGVsZW1lbnRQb3N0Y29kZSwgaWQpID0+IHtcblx0XHRpZiAoZWxlbWVudFBvc3Rjb2RlKSB7XG5cdFx0XHRlbGVtZW50UG9zdGNvZGUudmFsdWUgPSBlbGVtZW50UG9zdGNvZGUudmFsdWUucmVwbGFjZSgvW14uXFxkXSsvZywgJycpLnJlcGxhY2UoL14oW14uXSpcXC4pfFxcLi9nLCAnJDEnKTtcblx0XHRcdGlmIChlbGVtZW50UG9zdGNvZGUudmFsdWUubGVuZ3RoID4gNSkge1xuXHRcdFx0XHRlbGVtZW50UG9zdGNvZGUudmFsdWUgPSBlbGVtZW50UG9zdGNvZGUudmFsdWUuc2xpY2UoMCwgLTEpO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHR5cGUgPSBlbGVtZW50UG9zdGNvZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5ldmlnZW4tbm92YXBvc2h0YScpO1xuXHRcdFx0aWYgKGVsZW1lbnRQb3N0Y29kZS52YWx1ZS5sZW5ndGggPT09IDUpIHtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdwaWNrdXAnKSB7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldFByZWxvYWRlcigpO1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5nZXRXYXJlaG91c2VzKGVsZW1lbnRQb3N0Y29kZSwgaWQpO1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5yZW1vdmVQcmVsb2FkZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0eXBlID09PSAncG9zdG9tYXQnKSB7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldFByZWxvYWRlcigpO1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5nZXRQb3N0b21hdChlbGVtZW50UG9zdGNvZGUsIGlkKTtcblx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEucmVtb3ZlUHJlbG9hZGVyKCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NvdXJpZXInKSB7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldFByZWxvYWRlcigpO1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS52YWxpZENvdXJpZXIoZWxlbWVudFBvc3Rjb2RlLCAncG9zdGNvZGUnLCBpZCk7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnJlbW92ZVByZWxvYWRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fSxcblx0Y2hlY2tQb3N0Y29kZTogKGVsZW1lbnRQb3N0Y29kZSwgaWQpID0+IHtcblx0XHRpZiAoZWxlbWVudFBvc3Rjb2RlICYmIGlkKSB7XG5cdFx0XHRpZiAoZWxlbWVudFBvc3Rjb2RlLnZhbHVlLmxlbmd0aCA8IDUpIHtcblx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldEVycm9yKGlkLCBKb29tbGEuVGV4dC5fKCdBRERPTl9ORVZJR0VOX05PVkFQT1NIVEFfRVJST1JfUE9TVENPREUnKSk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9LFxuXHRzZWFyY2hDaXR5OiAoZWxlbWVudCwgaWQpID0+IHtcblx0XHRpZiAoZWxlbWVudCAmJiBpZCkge1xuXHRcdFx0bGV0IHBvc3Rjb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3Bvc3Rjb2RlXVwiXScpLFxuXHRcdFx0XHRuYW1lSW5wdXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdFx0aWYgKGVsZW1lbnQudmFsdWUubGVuZ3RoID09PSAzKSB7XG5cdFx0XHRcdGlmIChwb3N0Y29kZSkge1xuXHRcdFx0XHRcdHBvc3Rjb2RlLnZhbHVlID0gJyc7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdFx0XHRhamF4RGF0YS5zZXQoJ3ZhbHVlJywgZWxlbWVudC52YWx1ZSk7XG5cdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZW5kQWpheCgncG9zdCcsICdzZWFyY2hDaXR5JywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiByZXNwb25zZS5kYXRhID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmluaXRBdXRvQ29tcGxldGUobmFtZUlucHV0LCByZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0XHRcdGlmIChub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XSkge1xuXHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5zdGFydCgpO1xuXHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3Rpb24nLCAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRsZXQgc2VsZWN0ZWRWYWx1ZSA9IGV2ZW50LmRldGFpbC5zZWxlY3Rpb24udmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0uaW5wdXQudmFsdWUgPSBzZWxlY3RlZFZhbHVlWyduYW1lJ107XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldFBvc3Rjb2RlQnlSZWYoc2VsZWN0ZWRWYWx1ZVsncmVmJ10sIGlkKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0aWYgKHBvc3Rjb2RlKSB7XG5cdFx0XHRcdFx0XHRwb3N0Y29kZS52YWx1ZSA9ICcnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0RXJyb3IoaWQsIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoZWxlbWVudC52YWx1ZS5sZW5ndGggPCAzICYmIG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdXG5cdFx0XHRcdCYmIG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdLmRhdGEuc3JjLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0uZGF0YS5zcmMgPSBbXTtcblx0XHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0uc3RhcnQoKTtcblx0XHRcdFx0aWYgKHBvc3Rjb2RlKSB7XG5cdFx0XHRcdFx0cG9zdGNvZGUudmFsdWUgPSAnJztcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgc3RyZWV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3N0cmVldF1cIl0nKTtcblx0XHRcdFx0aWYgKHN0cmVldCkge1xuXHRcdFx0XHRcdGxldCBuYW1lSW5wdXRTdHJlZXQgPSBzdHJlZXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdFx0aWYgKG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRTdHJlZXRdKSB7XG5cdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0U3RyZWV0XS5kYXRhLnNyYyA9IFtdO1xuXHRcdFx0XHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dFN0cmVldF0uc3RhcnQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmRpc2FibGVkRmllbGRzKGlkLCBbJ3N0cmVldCcsICdob3VzZScsICdhcGFydG1lbnQnXSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cdHNldFBvc3Rjb2RlQnlSZWY6IChyZWYsIGlkKSA9PiB7XG5cdFx0aWYgKCFyZWYgfHwgIWlkKSByZXR1cm4gZmFsc2U7XG5cdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdGFqYXhEYXRhLnNldCgncmVmJywgcmVmKTtcblx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2VuZEFqYXgoJ3Bvc3QnLCAnZ2V0UG9zdGNvZGVCeVJlZicsIGFqYXhEYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEpIHtcblx0XHRcdFx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tbm92YXBvc2h0YS1jb250YWluZXI9XCInICsgaWQgKyAnXCJdJyk7XG5cdFx0XHRcdGlmIChjb250YWluZXIpIHtcblx0XHRcdFx0XHRsZXQgcG9zdGNvZGUgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3Bvc3Rjb2RlXVwiXScpO1xuXHRcdFx0XHRcdGlmIChwb3N0Y29kZSkge1xuXHRcdFx0XHRcdFx0cG9zdGNvZGUudmFsdWUgPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRcdFx0cG9zdGNvZGUuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsnYnViYmxlcyc6IHRydWV9KSlcblx0XHRcdFx0XHRcdGxldCB0eXBlID0gcG9zdGNvZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5ldmlnZW4tbm92YXBvc2h0YScpO1xuXHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnZhbGlkUG9zdGNvZGUocG9zdGNvZGUsIGlkKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlID09PSAnY291cmllcicpIHtcblx0XHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnZhbGlkQ291cmllcihwb3N0Y29kZSwgJ3N0cmVldCcsIGlkKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRFcnJvcihpZCwgZXJyb3IubWVzc2FnZSk7XG5cdFx0fSk7XG5cdH0sXG5cdGdldFdhcmVob3VzZXM6IChlbGVtZW50LCBpZCkgPT4ge1xuXHRcdGlmICghZWxlbWVudCB8fCAhaWQpIHJldHVybiBmYWxzZTtcblx0XHRsZXQgdmFsaWQgPSB3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuY2hlY2tQb3N0Y29kZShlbGVtZW50LCBpZCk7XG5cdFx0aWYgKCF2YWxpZCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW5vdmFwb3NodGEtY29udGFpbmVyPVwiJyArIGlkICsgJ1wiXScpLFxuXHRcdFx0a2V5Q29va2llcyA9ICduZXZpZ2VuX25vdmFwb3NodGFfcG9zdGNvZGVfc2VuZF93YXJlaG91c2UnLFxuXHRcdFx0c2VuZFBvc3Rjb2RlID0gd2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmdldENvb2tpZShrZXlDb29raWVzKTtcblx0XHRpZiAoc2VuZFBvc3Rjb2RlID09PSAnJyB8fCBzZW5kUG9zdGNvZGUgIT09IGVsZW1lbnQudmFsdWUpIHtcblx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRDb29raWUoa2V5Q29va2llcywgZWxlbWVudC52YWx1ZSk7XG5cdFx0XHRsZXQgY3VycmVudFdhcmVob3VzZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzZWxlY3RbbmFtZT1cInBhcmFtc1snICsgaWQgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfd2FyZWhvdXNlXVwiXScpO1xuXHRcdFx0aWYgKGN1cnJlbnRXYXJlaG91c2UpIHtcblx0XHRcdFx0Y3VycmVudFdhcmVob3VzZS52YWx1ZSA9ICcnO1xuXHRcdFx0XHRjdXJyZW50V2FyZWhvdXNlLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG5cdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5pbml0U2VsZWN0KGlkLCAnd2FyZWhvdXNlJyxbXSk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YTtcblx0XHRcdGFqYXhEYXRhLnNldCgncG9zdGNvZGUnLCBlbGVtZW50LnZhbHVlKTtcblx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZW5kQWpheCgncG9zdCcsICdnZXRXYXJlaG91c2VzJywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgcmVzcG9uc2UuZGF0YSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRpZiAoY3VycmVudFdhcmVob3VzZSkge1xuXHRcdFx0XHRcdFx0Y3VycmVudFdhcmVob3VzZS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5pbml0U2VsZWN0KGlkLCd3YXJlaG91c2UnLCByZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0UHJpY2UoaWQsIDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRFcnJvcihpZCwgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblxuXHR9LFxuXHRnZXRQb3N0b21hdDogKGVsZW1lbnQsIGlkKSA9PiB7XG5cdFx0aWYgKCFlbGVtZW50IHx8ICFpZCkgcmV0dXJuIGZhbHNlO1xuXHRcdGxldCB2YWxpZCA9IHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5jaGVja1Bvc3Rjb2RlKGVsZW1lbnQsIGlkKTtcblx0XHRpZiAoIXZhbGlkKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW5vdmFwb3NodGEtY29udGFpbmVyPVwiJyArIGlkICsgJ1wiXScpLFxuXHRcdFx0a2V5Q29va2llcyA9ICduZXZpZ2VuX25vdmFwb3NodGFfcG9zdGNvZGVfc2VuZF9wb3N0b21hdCcsXG5cdFx0XHRzZW5kUG9zdGNvZGUgPSB3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuZ2V0Q29va2llKGtleUNvb2tpZXMpO1xuXHRcdGlmIChzZW5kUG9zdGNvZGUgPT09ICcnIHx8IHNlbmRQb3N0Y29kZSAhPT0gZWxlbWVudC52YWx1ZSkge1xuXHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldENvb2tpZShrZXlDb29raWVzLCBlbGVtZW50LnZhbHVlKTtcblx0XHRcdGxldCBjdXJyZW50UG9zdG9tYXQgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc2VsZWN0W25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3Bvc3RvbWF0XVwiXScpO1xuXHRcdFx0aWYgKGN1cnJlbnRQb3N0b21hdCkge1xuXHRcdFx0XHRjdXJyZW50UG9zdG9tYXQudmFsdWUgPSAnJztcblx0XHRcdFx0Y3VycmVudFBvc3RvbWF0LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG5cdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5pbml0U2VsZWN0KGlkLCAncG9zdG9tYXQnLFtdKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdFx0YWpheERhdGEuc2V0KCdwb3N0Y29kZScsIGVsZW1lbnQudmFsdWUpO1xuXHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNlbmRBamF4KCdwb3N0JywgJ2dldFBvc3RvbWF0JywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgcmVzcG9uc2UuZGF0YSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRpZiAoY3VycmVudFBvc3RvbWF0KSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50UG9zdG9tYXQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuaW5pdFNlbGVjdChpZCwncG9zdG9tYXQnLCByZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0UHJpY2UoaWQsIDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRFcnJvcihpZCwgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblxuXHR9LFxuXHRpbml0U2VsZWN0OiAoaWQsZmllbGQsIHZhbHVlcykgPT4ge1xuXHRcdGlmICghaWQgfHwgIWZpZWxkKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKCFub3ZhcG9zaHRhU2VsZWN0W2lkXSkge1xuXHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0gPSBudWxsXG5cdFx0fVxuXHRcdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW5vdmFwb3NodGEtY29udGFpbmVyPVwiJyArIGlkICsgJ1wiXScpO1xuXHRcdGlmIChjb250YWluZXIpIHtcblx0XHRcdGxldCBwYXJhbXMgPSB7XG5cdFx0XHRcdHBvc2l0aW9uOiAnYm90dG9tJyxcblx0XHRcdFx0bm9SZXN1bHRzVGV4dDogSm9vbWxhLlRleHQuXygnQURET05fTkVWSUdFTl9OT1ZBUE9TSFRBX0VSUk9SX1JFU1VMVFMnKSxcblx0XHRcdFx0bm9DaG9pY2VzVGV4dDogSm9vbWxhLlRleHQuXygnQURET05fTkVWSUdFTl9OT1ZBUE9TSFRBX0VSUk9SX1JFU1VMVFMnKSxcblx0XHRcdFx0cGxhY2Vob2xkZXJWYWx1ZTogSm9vbWxhLlRleHQuXygnQURET05fTkVWSUdFTl9OT1ZBUE9TSFRBX1BMQUNFSE9MREVSX1dBUkVIT1VTRScpLFxuXHRcdFx0XHRzZWFyY2hQbGFjZWhvbGRlclZhbHVlOiBKb29tbGEuVGV4dC5fKCdBRERPTl9ORVZJR0VOX05PVkFQT1NIVEFfUExBQ0VIT0xERVJfV0FSRUhPVVNFJyksXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YgdmFsdWVzID09PSAnb2JqZWN0JyAmJiBub3ZhcG9zaHRhU2VsZWN0W2lkXSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIG5vdmFwb3NodGFTZWxlY3RbaWRdID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdGlmICh2YWx1ZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5yZW1vdmVBY3RpdmVJdGVtcygpXG5cdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5jbGVhckNob2ljZXMoKTtcblx0XHRcdFx0XHRcdG5vdmFwb3NodGFTZWxlY3RbaWRdLmRpc2FibGUoKTtcblx0XHRcdFx0XHRcdGxldCBlbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFyYW1zWycgKyBpZCArICddW25ldmlnZW5fbm92YXBvc2h0YV8nK2ZpZWxkKyddXCJdJyk7XG5cdFx0XHRcdFx0XHRpZiAoZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50ID0gZWxlbWVudC5jbG9zZXN0KCcuY2hvaWNlc19faW5uZXInKTtcblx0XHRcdFx0XHRcdFx0bGV0IGl0ZW0gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaG9pY2VzX19saXN0LS1zaW5nbGUnKTtcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmlubmVyVGV4dCA9IEpvb21sYS5UZXh0Ll8oJ0FERE9OX05FVklHRU5fTk9WQVBPU0hUQV9QTEFDRUhPTERFUl8nK2ZpZWxkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5vdmFwb3NodGFTZWxlY3RbaWRdLnNldENob2ljZXMoXG5cdFx0XHRcdFx0XHRcdHZhbHVlcyxcblx0XHRcdFx0XHRcdFx0J3ZhbHVlJyxcblx0XHRcdFx0XHRcdFx0J2xhYmVsJyxcblx0XHRcdFx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5lbmFibGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bGV0IGVsZW1lbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhXycrZmllbGQrJ11cIl0nKTtcblx0XHRcdFx0XHRpZiAoZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0gPSBuZXcgQ2hvaWNlcyhlbGVtZW50LCBwYXJhbXMpO1xuXHRcdFx0XHRcdFx0aWYgKHZhbHVlcy5sZW5ndGggIT09IDApIHtcblx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0uc2V0Q2hvaWNlcyhcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZXMsXG5cdFx0XHRcdFx0XHRcdFx0J3ZhbHVlJyxcblx0XHRcdFx0XHRcdFx0XHQnbGFiZWwnLFxuXHRcdFx0XHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0uZW5hYmxlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgZWxlbWVudHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhXycrZmllbGQrJ11cIl0nKTtcblx0XHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAobm92YXBvc2h0YVNlbGVjdFtpZF0gPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0gPSBuZXcgQ2hvaWNlcyhlbGVtZW50LCBwYXJhbXMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBub3ZhcG9zaHRhU2VsZWN0W2lkXSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5kZXN0cm95KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0gPSBuZXcgQ2hvaWNlcyhlbGVtZW50LCBwYXJhbXMpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGluaXRBdXRvQ29tcGxldGUobmFtZSwgdmFsdWVzKSB7XG5cdFx0aWYgKCFuYW1lKSByZXR1cm4gZmFsc2U7XG5cblx0XHRpZiAobm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVdKSB7XG5cdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZV0uZGF0YS5zcmMgPSB2YWx1ZXM7XG5cdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZV0uc3RhcnQoKVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lXSA9IG5ldyBhdXRvQ29tcGxldGUoe1xuXHRcdFx0d3JhcHBlcjogZmFsc2UsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHNyYzogdmFsdWVzLFxuXHRcdFx0XHRrZXlzOiBbJ25hbWUnXSxcblx0XHRcdH0sXG5cdFx0XHRzZWxlY3RvcjogJ2lucHV0W25hbWU9XCInICsgbmFtZSArICdcIl0nLFxuXHRcdFx0cmVzdWx0c0xpc3Q6IHtcblx0XHRcdFx0bWF4UmVzdWx0czogMTAwMCxcblx0XHRcdFx0bm9SZXN1bHRzOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdHJlc3VsdEl0ZW06IHtcblx0XHRcdFx0aGlnaGxpZ2h0OiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdGlucHV0OiB7XG5cdFx0XHRcdFx0Zm9jdXMoKSB7XG5cdFx0XHRcdFx0XHRpZiAobm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVdLmlucHV0LnZhbHVlLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZV0uc3RhcnQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9KTtcblx0fSxcblx0dmFsaWRDb3VyaWVyOiAoZWxlbWVudCwgZmllbGRWYWxpZCwgaWQpID0+IHtcblx0XHRpZiAoIWVsZW1lbnQgfHwgIWZpZWxkVmFsaWQgfHwgIWlkKSByZXR1cm4gZmFsc2U7XG5cdFx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tbm92YXBvc2h0YS1jb250YWluZXI9XCInICsgaWQgKyAnXCJdJyk7XG5cdFx0aWYgKGNvbnRhaW5lcikge1xuXHRcdFx0bGV0IHBvc3Rjb2RlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFyYW1zWycgKyBpZCArICddW25ldmlnZW5fbm92YXBvc2h0YV9wb3N0Y29kZV1cIl0nKTtcblx0XHRcdGlmIChwb3N0Y29kZSkge1xuXHRcdFx0XHRsZXQgdmFsaWQgPSB3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuY2hlY2tQb3N0Y29kZShwb3N0Y29kZSwgaWQpO1xuXHRcdFx0XHRpZiAoIXZhbGlkKSB7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmRpc2FibGVkRmllbGRzKGlkLCBbJ3N0cmVldCcsICdob3VzZScsICdhcGFydG1lbnQnXSlcblxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBmaWVsZE5leHQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhXycgKyBmaWVsZFZhbGlkICsgJ11cIl0nKSxcblx0XHRcdFx0XHRzZW5kUG9zdGNvZGUgPSB3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuZ2V0Q29va2llKCduZXZpZ2VuX25vdmFwb3NodGFfcG9zdGNvZGVfc2VuZCcpO1xuXHRcdFx0XHRpZiAoZmllbGROZXh0KSB7XG5cdFx0XHRcdFx0aWYgKGZpZWxkVmFsaWQgPT09ICdzdHJlZXQnKSB7XG5cdFx0XHRcdFx0XHRpZiAoc2VuZFBvc3Rjb2RlID09PSAnJyB8fCBzZW5kUG9zdGNvZGUgIT09IHBvc3Rjb2RlLnZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGZpZWxkTmV4dC52YWx1ZSA9ICcnO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmRpc2FibGVkRmllbGRzKGlkLCBbJ2hvdXNlJywgJ2FwYXJ0bWVudCddKTtcblx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5jYWxjdWxhdGlvbihwb3N0Y29kZSwgJ2NvdXJpZXInLCBpZCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChmaWVsZFZhbGlkID09PSAnaG91c2UnKSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuZGlzYWJsZWRGaWVsZHMoaWQsIFsnaG91c2UnLCAnYXBhcnRtZW50J10pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZWxlbWVudC52YWx1ZSkge1xuXHRcdFx0XHRcdFx0ZmllbGROZXh0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZmllbGROZXh0LnZhbHVlID0gJyc7XG5cdFx0XHRcdFx0XHRmaWVsZE5leHQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGdldFN0cmVldHM6IChlbGVtZW50LCBpZCkgPT4ge1xuXHRcdGlmICghZWxlbWVudCB8fCAhaWQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0bGV0IG5hbWVJbnB1dCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0aWYgKGVsZW1lbnQudmFsdWUubGVuZ3RoID09PSAzKSB7XG5cdFx0XHRsZXQgcG9zdGNvZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBhcmFtc1snICsgaWQgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfcG9zdGNvZGVdXCJdJyk7XG5cdFx0XHRpZiAocG9zdGNvZGUpIHtcblx0XHRcdFx0bGV0IHZhbGlkID0gd2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmNoZWNrUG9zdGNvZGUocG9zdGNvZGUsIGlkKTtcblx0XHRcdFx0aWYgKCF2YWxpZCkge1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5kaXNhYmxlZEZpZWxkcyhpZCwgWydzdHJlZXQnLCAnaG91c2UnLCAnYXBhcnRtZW50J10pXG5cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXG5cdFx0XHRcdGFqYXhEYXRhLnNldCgncG9zdGNvZGUnLCBwb3N0Y29kZS52YWx1ZSk7XG5cdFx0XHRcdGFqYXhEYXRhLnNldCgndmFsdWUnLCBlbGVtZW50LnZhbHVlKVxuXHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2VuZEFqYXgoJ3Bvc3QnLCAnZ2V0U3RyZWV0cycsIGFqYXhEYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgcmVzcG9uc2UuZGF0YSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5pbml0QXV0b0NvbXBsZXRlKG5hbWVJbnB1dCwgcmVzcG9uc2UuZGF0YSk7XG5cdFx0XHRcdFx0XHRpZiAobm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0pIHtcblx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0uc3RhcnQoKTtcblx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0uaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0aW9uJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHNlbGVjdGVkVmFsdWUgPSBldmVudC5kZXRhaWwuc2VsZWN0aW9uLnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdLmlucHV0LnZhbHVlID0gc2VsZWN0ZWRWYWx1ZVsnbmFtZSddO1xuXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnZhbGlkQ291cmllcihlbGVtZW50LCAnaG91c2UnLCBpZCk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRQcmljZShpZCwgMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldEVycm9yKGlkLCBlcnJvci5tZXNzYWdlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LnZhbHVlLmxlbmd0aCA8IDMgJiYgbm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF1cblx0XHRcdCYmIG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdLmRhdGEuc3JjLmxlbmd0aCA+IDApIHtcblx0XHRcdG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdLmRhdGEuc3JjID0gW107XG5cdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5zdGFydCgpO1xuXHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmRpc2FibGVkRmllbGRzKGlkLCBbJ2hvdXNlJywgJ2FwYXJ0bWVudCddKTtcblx0XHR9XG5cdH0sXG5cdGRpc2FibGVkRmllbGRzOiAoaWQsIGZpZWxkcykgPT4ge1xuXHRcdGlmICghaWQgfHwgIWZpZWxkcyB8fCBmaWVsZHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGZpZWxkcy5mb3JFYWNoKChmaWVsZE5hbWUpID0+IHtcblx0XHRcdGxldCBmaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFyYW1zWycgKyBpZCArICddW25ldmlnZW5fbm92YXBvc2h0YV8nICsgZmllbGROYW1lICsgJ11cIl0nKTtcblx0XHRcdGlmIChmaWVsZCkge1xuXHRcdFx0XHRmaWVsZC52YWx1ZSA9ICcnO1xuXHRcdFx0XHRmaWVsZC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH0sXG5cdHNldFByaWNlOiAoaWQsIHByaWNlX3N0cmluZykgPT4ge1xuXHRcdGlmICghaWQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0bGV0IGlucHV0TWV0aG9kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2hpcHBpbmdfaWQ9XCInICsgaWQgKyAnXCJdJyk7XG5cdFx0aWYgKGlucHV0TWV0aG9kKSB7XG5cdFx0XHRsZXQgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdsYWJlbFtmb3I9XCJzaGlwcGluZ19tZXRob2RfJyArIGlucHV0TWV0aG9kLnZhbHVlICsgJ1wiXScpLFxuXHRcdFx0XHRjb250YWluZXJPbmVTdGVwQ2hlY2tvdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1zaGlwcGluZz1cIicgKyBpbnB1dE1ldGhvZC52YWx1ICsgJ1wiXScpO1xuXHRcdFx0aWYgKGxhYmVsKSB7XG5cdFx0XHRcdGxldCBzaGlwcGluZ19wcmljZSA9IGxhYmVsLnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcGluZ19wcmljZScpO1xuXHRcdFx0XHRsZXQgbnZnX3NoaXBwaW5nX2Nvc3QgPSBsYWJlbC5xdWVyeVNlbGVjdG9yKCcubnZnX3NoaXBwaW5nX2Nvc3QnKTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyT25lU3RlcENoZWNrb3V0KSB7XG5cdFx0XHRcdFx0c2hpcHBpbmdfcHJpY2UgPSBjb250YWluZXJPbmVTdGVwQ2hlY2tvdXQucXVlcnlTZWxlY3RvcignLnNoaXBwaW5nX3ByaWNlJyk7XG5cdFx0XHRcdFx0bnZnX3NoaXBwaW5nX2Nvc3QgPSBjb250YWluZXJPbmVTdGVwQ2hlY2tvdXQucXVlcnlTZWxlY3RvcignLm52Z19zaGlwcGluZ19jb3N0Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHlwZW9mIHByaWNlX3N0cmluZyA9PT0gJ251bWJlcicgJiYgcHJpY2Vfc3RyaW5nID09PSAwKSB7XG5cdFx0XHRcdFx0cHJpY2Vfc3RyaW5nID0gJyc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHNoaXBwaW5nX3ByaWNlKSB7XG5cdFx0XHRcdFx0c2hpcHBpbmdfcHJpY2UuaW5uZXJIVE1MID0gcHJpY2Vfc3RyaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudmdfc2hpcHBpbmdfY29zdCkge1xuXHRcdFx0XHRcdG52Z19zaGlwcGluZ19jb3N0LmlubmVySFRNTCA9IHByaWNlX3N0cmluZztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fVxuXHR9LFxuXHRzZW5kQWpheDogKG1ldGhvZEFqYXgsIG1ldGhvZCwgYWpheERhdGEpID0+IHtcblx0XHRsZXQgcGFyYW0gPSBKb29tbGEuZ2V0T3B0aW9ucygnbmV2aWdlbl9ub3ZhcG9zaHRhJyk7XG5cdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldFByZWxvYWRlcigpO1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGlmICghcGFyYW0gfHwgIWFqYXhEYXRhIHx8ICFtZXRob2RBamF4IHx8ICFtZXRob2QpIHtcblx0XHRcdFx0XHRyZWplY3QoJ0Vycm9yIGFqYXggZGF0YScpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocGFyYW0uY3NyZikge1xuXHRcdFx0XHRcdGFqYXhEYXRhLnNldChwYXJhbS5jc3JmLCAxKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGFqYXhEYXRhLnNldCgndGFzaycsICdOZXZpZ2VuTm92YXBvc2h0YS4nICsgbWV0aG9kKTtcblx0XHRcdFx0Sm9vbWxhLnJlcXVlc3Qoe1xuXHRcdFx0XHRcdHVybDogcGFyYW0uY29udHJvbGxlcixcblx0XHRcdFx0XHRtZXRob2Q6IG1ldGhvZEFqYXgsXG5cdFx0XHRcdFx0ZGF0YTogYWpheERhdGEsXG5cdFx0XHRcdFx0b25TdWNjZXNzOiByZXNwID0+IHtcblx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5yZW1vdmVQcmVsb2FkZXIoKTtcblx0XHRcdFx0XHRcdGxldCByZXNwb25zZTtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHBhcnNlIEpTT04nKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QocmVzcG9uc2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0b25FcnJvcjogcmVzcCA9PiB7XG5cdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEucmVtb3ZlUHJlbG9hZGVyKCk7XG5cdFx0XHRcdFx0XHRsZXQgcmVzcG9uc2U7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRyZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcC5yZXNwb25zZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBKU09OJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJlamVjdChyZXNwb25zZSk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdClcblx0fSxcblx0c2V0RXJyb3I6IChpZCwgbWVzc2FnZSkgPT4ge1xuXHRcdGxldCBlcnJvciA9IEpvb21sYS5nZXRPcHRpb25zKCduZXZpZ2VuX25vdmFwb3NodGFfZXJyb3JfJyArIGlkKTtcblx0XHRpZiAoaWQgJiYgKG1lc3NhZ2UgfHwgZXJyb3IpKSB7XG5cdFx0XHRpZiAoIW1lc3NhZ2UpIHtcblx0XHRcdFx0bWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG5cdFx0XHR9XG5cdFx0XHRsZXQgbWVzc2FnZUJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1ub3ZhcG9zaHRhLW1lc3NhZ2U9XCInICsgaWQgKyAnXCJdJyk7XG5cdFx0XHRpZiAobWVzc2FnZUJsb2NrKSB7XG5cdFx0XHRcdEpvb21sYS5yZW5kZXJNZXNzYWdlcyh7XG5cdFx0XHRcdFx0J2Vycm9yJzogW21lc3NhZ2VdXG5cdFx0XHRcdH0sIG1lc3NhZ2VCbG9jayk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRzZXRQcmVsb2FkZXI6ICgpID0+IHtcblx0XHRsZXQgcHJlbG9hZGVyU291cmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1ub3ZhcG9zaHRhPVwicHJlbG9hZGVyXCJdJyk7XG5cdFx0aWYgKCFwcmVsb2FkZXJTb3VyY2UpIHtcblx0XHRcdHByZWxvYWRlclNvdXJjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuZXZpZ2VuLW5vdmFwb3NodGE9XCJwcmVsb2FkZXJcIl0nKTtcblx0XHR9XG5cdFx0aWYgKHByZWxvYWRlclNvdXJjZSkge1xuXHRcdFx0bGV0IHByZWxvYWRlciA9IHByZWxvYWRlclNvdXJjZS5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRwcmVsb2FkZXIuc2V0QXR0cmlidXRlKCdkYXRhLWFjdGl2ZScsIDEpO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwcmVsb2FkZXIpO1xuXHRcdFx0cHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHR9XG5cdH0sXG5cdHJlbW92ZVByZWxvYWRlcjogKCkgPT4ge1xuXHRcdGxldCBwcmVsb2FkZXJTb3VyY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW5vdmFwb3NodGE9XCJwcmVsb2FkZXJcIl1bZGF0YS1hY3RpdmVdJyk7XG5cdFx0aWYgKCFwcmVsb2FkZXJTb3VyY2UpIHtcblx0XHRcdHByZWxvYWRlclNvdXJjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuZXZpZ2VuLW5vdmFwb3NodGE9XCJwcmVsb2FkZXJcIl1bZGF0YS1hY3RpdmVdJyk7XG5cdFx0fVxuXHRcdGlmIChwcmVsb2FkZXJTb3VyY2UpIHtcblx0XHRcdHByZWxvYWRlclNvdXJjZS5yZW1vdmUoKTtcblx0XHR9XG5cdH0sXG5cdHNldENvb2tpZTogKGNvb2tpZU5hbWUsIHZhbHVlKSA9PiB7XG5cdFx0ZG9jdW1lbnQuY29va2llID0gY29va2llTmFtZSArIFwiPVwiICsgdmFsdWUgKyBcIlwiICsgXCI7IHBhdGg9L1wiO1xuXHR9LFxuXHRnZXRDb29raWU6IChjX25hbWUpID0+IHtcblx0XHRpZiAoZG9jdW1lbnQuY29va2llLmxlbmd0aCA+IDApIHtcblx0XHRcdGxldCBjX3N0YXJ0ID0gZG9jdW1lbnQuY29va2llLmluZGV4T2YoY19uYW1lICsgXCI9XCIpO1xuXHRcdFx0aWYgKGNfc3RhcnQgIT09IC0xKSB7XG5cdFx0XHRcdGNfc3RhcnQgPSBjX3N0YXJ0ICsgY19uYW1lLmxlbmd0aCArIDE7XG5cdFx0XHRcdGxldCBjX2VuZCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKFwiO1wiLCBjX3N0YXJ0KTtcblx0XHRcdFx0aWYgKGNfZW5kID09PSAtMSkge1xuXHRcdFx0XHRcdGNfZW5kID0gZG9jdW1lbnQuY29va2llLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZGVjb2RlVVJJKGRvY3VtZW50LmNvb2tpZS5zdWJzdHJpbmcoY19zdGFydCwgY19lbmQpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuICcnO1xuXHR9LFxuXHRyZW1vdmVDb29raWU6IChjb29raWVOYW1lKSA9PiB7XG5cdFx0ZG9jdW1lbnQuY29va2llID0gY29va2llTmFtZSArIFwiPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIFVUQzsgcGF0aD0vO1wiO1xuXHR9LFxufVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0bGV0IHNoX3ByX21ldGhvZF9pZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzaF9wcl9tZXRob2RfaWRcIl06Y2hlY2tlZCcpO1xuXHRpZiAoc2hfcHJfbWV0aG9kX2lkKSB7XG5cdFx0bGV0IGlkID0gc2hfcHJfbWV0aG9kX2lkLmdldEF0dHJpYnV0ZSgnZGF0YS1zaGlwcGluZ19pZCcpO1xuXHRcdGxldCBwb3N0Y29kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3Bvc3Rjb2RlXVwiXScpO1xuXHRcdGlmIChwb3N0Y29kZSkge1xuXHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmluaXRTZWxlY3QoaWQsJ3dhcmVob3VzZScpO1xuXHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmluaXRTZWxlY3QoaWQsJ3Bvc3RvbWF0Jyk7XG5cdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0RXJyb3IoaWQpO1xuXHRcdFx0aWYgKCFwb3N0Y29kZS52YWx1ZSkge1xuXHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEucmVtb3ZlQ29va2llKCduZXZpZ2VuX25vdmFwb3NodGFfcG9zdGNvZGUnKTtcblx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnJlbW92ZUNvb2tpZSgnbmV2aWdlbl9ub3ZhcG9zaHRhX3Bvc3Rjb2RlX3NlbmRfd2FyZWhvdXNlJyk7XG5cdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5yZW1vdmVDb29raWUoJ25ldmlnZW5fbm92YXBvc2h0YV9wb3N0Y29kZV9zZW5kX3Bvc3RvbWF0Jyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGxldCBkZWZhdWx0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qc2hvcCAjc2hpcHBpbmdfZm9ybScpO1xuXHRpZiAoZGVmYXVsdEZvcm0pIHtcblx0XHRsZXQgbWV0aG9kcyA9IGRlZmF1bHRGb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzaF9wcl9tZXRob2RfaWRcIl0nKTtcblx0XHRpZiAobWV0aG9kcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRtZXRob2RzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGxldCBwb3N0Y29kZSA9IGRlZmF1bHRGb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJwYXJhbXNbJyArIGVsZW1lbnQudmFsdWUgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfcG9zdGNvZGVdXCJdJyk7XG5cdFx0XHRcdFx0aWYgKHBvc3Rjb2RlKSB7XG5cdFx0XHRcdFx0XHRsZXQgaWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1zaGlwcGluZ19pZCcpO1xuXHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldEVycm9yKGlkKTtcblx0XHRcdFx0XHRcdGxldCBjaXR5ID0gZGVmYXVsdEZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInBhcmFtc1snICsgZWxlbWVudC52YWx1ZSArICddW25ldmlnZW5fbm92YXBvc2h0YV9jaXR5XVwiXScpLFxuXHRcdFx0XHRcdFx0XHR3YXJlaG91c2UgPSBkZWZhdWx0Rm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwicGFyYW1zWycgKyBlbGVtZW50LnZhbHVlICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3dhcmVob3VzZV1cIl0nKSxcblx0XHRcdFx0XHRcdFx0cG9zdG9tYXQgPSBkZWZhdWx0Rm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwicGFyYW1zWycgKyBlbGVtZW50LnZhbHVlICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3Bvc3RvbWF0XVwiXScpO1xuXHRcdFx0XHRcdFx0aWYgKHBvc3Rjb2RlLnZhbHVlID09PSAnJykge1xuXHRcdFx0XHRcdFx0XHRpZiAoY2l0eSkge1xuXHRcdFx0XHRcdFx0XHRcdGNpdHkudmFsdWUgPSAnJztcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmICh3YXJlaG91c2UpIHtcblx0XHRcdFx0XHRcdFx0XHR3YXJlaG91c2UudmFsdWUgPSAnJztcblx0XHRcdFx0XHRcdFx0XHR3YXJlaG91c2Uuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuaW5pdFNlbGVjdChpZCwnd2FyZWhvdXNlJywgW10pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChwb3N0b21hdCkge1xuXHRcdFx0XHRcdFx0XHRcdHBvc3RvbWF0LnZhbHVlID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0cG9zdG9tYXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuaW5pdFNlbGVjdChpZCwgJ3Bvc3RvbWF0JyxbXSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmICh3YXJlaG91c2UgJiYgd2FyZWhvdXNlLnZhbHVlID09PSAnJykge1xuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5nZXRXYXJlaG91c2VzKHBvc3Rjb2RlLCBpZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKHBvc3RvbWF0ICYmIHBvc3RvbWF0LnZhbHVlID09PSAnJykge1xuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5nZXRQb3N0b21hdChwb3N0Y29kZSwgaWQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCduZXZpZ2VuT25lU3RlcENoZWNrb3V0QWZ0ZXJTYXZlTWV0aG9kc1BhcmFtcycsIChldmVudCkgPT4ge1xuXHRsZXQgZGF0YSA9IGV2ZW50LmRldGFpbDtcblx0aWYgKGRhdGEgJiYgZGF0YS5uYW1lKSB7XG5cdFx0aWYgKGRhdGEubmFtZS5pbmNsdWRlcygnbmV2aWdlbl9ub3ZhcG9zaHRhXycpKSB7XG5cdFx0XHRsZXQgZmllbGQgPSBkYXRhLm5hbWUucmVwbGFjZSgnbmV2aWdlbl9ub3ZhcG9zaHRhXycsICcnKTtcblx0XHRcdGlmIChmaWVsZCAmJiAoZmllbGQgIT09ICd3YXJlaG91c2UnICYmIGZpZWxkICE9PSAncG9zdG9tYXQnKSkge1xuXHRcdFx0XHRsZXQgbmFtZSA9ICcnO1xuXHRcdFx0XHRpZiAoZmllbGQgPT09ICdwb3N0Y29kZScpIHtcblx0XHRcdFx0XHRuYW1lID0gJ2RfemlwJztcblx0XHRcdFx0fSBlbHNlIGlmIChmaWVsZCA9PT0gJ2NpdHknKSB7XG5cdFx0XHRcdFx0bmFtZSA9ICdkX2NpdHknO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGZpZWxkID09PSAnc3RyZWV0Jykge1xuXHRcdFx0XHRcdG5hbWUgPSAnZF9zdHJlZXQnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGZpZWxkID09PSAnaG91c2UnKSB7XG5cdFx0XHRcdFx0bmFtZSA9ICdkX2hvbWUnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGZpZWxkID09PSAnYXBhcnRtZW50Jykge1xuXHRcdFx0XHRcdG5hbWUgPSAnZF9hcGFydG1lbnQnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuYW1lKSB7XG5cdFx0XHRcdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdFx0XHRcdGFqYXhEYXRhLnNldCgndHlwZScsICdhZGRyZXNzJyk7XG5cdFx0XHRcdFx0YWpheERhdGEuc2V0KCdzYXZlZm9ybWRhdGFbJyArIG5hbWUgKyAnXScsIGRhdGEuZWxlbWVudC52YWx1ZSk7XG5cdFx0XHRcdFx0YWpheERhdGEuc2V0KCdtZXRob2QnLCAnbmV2aWdlbl9ub3ZhcG9zaHRhJyk7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5PbmVTdGVwQ2hlY2tvdXQoKS5zZW5kQWpheCgncG9zdCcsICdzYXZlRm9ybURhdGEnLCBhamF4RGF0YSkudGhlbigocmVzcG9uc2UpID0+IHtcblxuXHRcdFx0XHRcdH0pLmNhdGNoKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldEVycm9yKGRhdGEuaWQsIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGZpZWxkID09PSAnd2FyZWhvdXNlJyB8fCBmaWVsZCA9PT0gJ3Bvc3RvbWF0Jykge1xuXHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuY2FsY3VsYXRpb24oZGF0YS5lbGVtZW50LCBmaWVsZCwgZGF0YS5pZCwgdHJ1ZSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH1cbn0pOyJdLCJuYW1lcyI6WyJub3ZhcG9zaHRhU2VsZWN0Iiwibm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0Iiwid2luZG93IiwiTmV2aWdlbk5vdmFwb3NodGEiLCJjYWxjdWxhdGlvbiIsImVsZW1lbnQiLCJ0eXBlIiwiaWQiLCJpZ25vcmVOZXZpZ2VuT25lU3RlcCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImNvbnRhaW5lciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm1lc3NhZ2VCbG9jayIsImFqYXhEYXRhIiwiRm9ybURhdGEiLCJ2YWx1ZSIsInBvc3Rjb2RlIiwidmFsaWQiLCJjaGVja1Bvc3Rjb2RlIiwic2V0IiwiTmV2aWdlbk9uZVN0ZXBDaGVja291dENsYXNzIiwiSm9vbWxhIiwicmVtb3ZlTWVzc2FnZXMiLCJzZW5kQWpheCIsInRoZW4iLCJyZXNwb25zZSIsImRhdGEiLCJwcmljZV9zdHJpbmciLCJzZXRQcmljZSIsImNhdGNoIiwiZXJyb3IiLCJzZXRFcnJvciIsIm1lc3NhZ2UiLCJ2YWxpZFBvc3Rjb2RlIiwiZWxlbWVudFBvc3Rjb2RlIiwicmVwbGFjZSIsInNsaWNlIiwiZ2V0QXR0cmlidXRlIiwic2V0UHJlbG9hZGVyIiwiZ2V0V2FyZWhvdXNlcyIsInJlbW92ZVByZWxvYWRlciIsImdldFBvc3RvbWF0IiwidmFsaWRDb3VyaWVyIiwiVGV4dCIsIl8iLCJzZWFyY2hDaXR5IiwibmFtZUlucHV0IiwiaW5pdEF1dG9Db21wbGV0ZSIsInN0YXJ0IiwiaW5wdXQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJzZWxlY3RlZFZhbHVlIiwiZGV0YWlsIiwic2VsZWN0aW9uIiwic2V0UG9zdGNvZGVCeVJlZiIsInNyYyIsInN0cmVldCIsIm5hbWVJbnB1dFN0cmVldCIsImRpc2FibGVkRmllbGRzIiwicmVmIiwiZGlzcGF0Y2hFdmVudCIsIkV2ZW50Iiwia2V5Q29va2llcyIsInNlbmRQb3N0Y29kZSIsImdldENvb2tpZSIsInNldENvb2tpZSIsImN1cnJlbnRXYXJlaG91c2UiLCJzZXRBdHRyaWJ1dGUiLCJpbml0U2VsZWN0IiwicmVtb3ZlQXR0cmlidXRlIiwiY3VycmVudFBvc3RvbWF0IiwiZmllbGQiLCJ2YWx1ZXMiLCJwYXJhbXMiLCJwb3NpdGlvbiIsIm5vUmVzdWx0c1RleHQiLCJub0Nob2ljZXNUZXh0IiwicGxhY2Vob2xkZXJWYWx1ZSIsInNlYXJjaFBsYWNlaG9sZGVyVmFsdWUiLCJyZW1vdmVBY3RpdmVJdGVtcyIsImNsZWFyQ2hvaWNlcyIsImRpc2FibGUiLCJjbG9zZXN0IiwiaXRlbSIsImlubmVyVGV4dCIsInNldENob2ljZXMiLCJlbmFibGUiLCJDaG9pY2VzIiwiZWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImRlc3Ryb3kiLCJuYW1lIiwiYXV0b0NvbXBsZXRlIiwid3JhcHBlciIsImtleXMiLCJzZWxlY3RvciIsInJlc3VsdHNMaXN0IiwibWF4UmVzdWx0cyIsIm5vUmVzdWx0cyIsInJlc3VsdEl0ZW0iLCJoaWdobGlnaHQiLCJldmVudHMiLCJmb2N1cyIsImZpZWxkVmFsaWQiLCJmaWVsZE5leHQiLCJnZXRTdHJlZXRzIiwiZmllbGRzIiwiZmllbGROYW1lIiwiaW5wdXRNZXRob2QiLCJsYWJlbCIsImNvbnRhaW5lck9uZVN0ZXBDaGVja291dCIsInZhbHUiLCJzaGlwcGluZ19wcmljZSIsIm52Z19zaGlwcGluZ19jb3N0IiwiaW5uZXJIVE1MIiwibWV0aG9kQWpheCIsIm1ldGhvZCIsInBhcmFtIiwiZ2V0T3B0aW9ucyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY3NyZiIsInJlcXVlc3QiLCJ1cmwiLCJjb250cm9sbGVyIiwib25TdWNjZXNzIiwicmVzcCIsIkpTT04iLCJwYXJzZSIsIkVycm9yIiwic3VjY2VzcyIsIm9uRXJyb3IiLCJyZW5kZXJNZXNzYWdlcyIsInByZWxvYWRlclNvdXJjZSIsInByZWxvYWRlciIsImNsb25lTm9kZSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiZGlzcGxheSIsInJlbW92ZSIsImNvb2tpZU5hbWUiLCJjb29raWUiLCJjX25hbWUiLCJjX3N0YXJ0IiwiaW5kZXhPZiIsImNfZW5kIiwiZGVjb2RlVVJJIiwic3Vic3RyaW5nIiwicmVtb3ZlQ29va2llIiwic2hfcHJfbWV0aG9kX2lkIiwiZGVmYXVsdEZvcm0iLCJtZXRob2RzIiwiZSIsImNpdHkiLCJ3YXJlaG91c2UiLCJwb3N0b21hdCIsImluY2x1ZGVzIiwiTmV2aWdlbk9uZVN0ZXBDaGVja291dCJdLCJzb3VyY2VSb290IjoiIn0=