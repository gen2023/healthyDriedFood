/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************************************************!*\
  !*** ./plg_jshopping_nevigen_novaposhta/es6/main.es6 ***!
  \*******************************************************/
/*
 * @package    Nevigen JShop Novaposhta Shipping Package
 * @version    1.4.0
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
        let city = document.querySelector('[name="params[' + id + '][nevigen_novaposhta_city]"]');
        if (city) {
          ajaxData.set('city', city.value);
        }
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
  searchCity: (element, id) => {
    if (element && id) {
      let nameInput = element.getAttribute('name');
      if (element.value.length === 3) {
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
                let type = element.getAttribute('data-nevigen-novaposhta');
                if (type === 'pickup') {
                  window.NevigenNovaposhta.setPreloader();
                  window.NevigenNovaposhta.getWarehouses(element, id);
                  window.NevigenNovaposhta.removePreloader();
                } else if (type === 'postomat') {
                  window.NevigenNovaposhta.setPreloader();
                  window.NevigenNovaposhta.getPostomat(element, id);
                  window.NevigenNovaposhta.removePreloader();
                } else if (type === 'courier') {
                  window.NevigenNovaposhta.setPreloader();
                  window.NevigenNovaposhta.validCourier(element, 'street', id);
                  window.NevigenNovaposhta.removePreloader();
                }
              });
            }
          }
        }).catch(error => {
          window.NevigenNovaposhta.setError(id, error.message);
        });
      } else if (element.value.length < 3 && novaposhtaAutoCompleteInput[nameInput] && novaposhtaAutoCompleteInput[nameInput].data.src.length > 0) {
        novaposhtaAutoCompleteInput[nameInput].data.src = [];
        novaposhtaAutoCompleteInput[nameInput].start();
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
  getWarehouses: (element, id) => {
    if (!element || !id) return false;
    let container = document.querySelector('[data-nevigen-novaposhta-container="' + id + '"]');
    let currentWarehouse = container.querySelector('select[name="params[' + id + '][nevigen_novaposhta_warehouse]"]');
    if (currentWarehouse) {
      currentWarehouse.value = '';
      currentWarehouse.setAttribute('disabled', '');
      window.NevigenNovaposhta.initSelect(id, 'warehouse', []);
    }
    let ajaxData = new FormData();
    ajaxData.set('city', element.value);
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
  },
  getPostomat: (element, id) => {
    if (!element || !id) return false;
    let container = document.querySelector('[data-nevigen-novaposhta-container="' + id + '"]');
    let currentPostomat = container.querySelector('select[name="params[' + id + '][nevigen_novaposhta_postomat]"]');
    if (currentPostomat) {
      currentPostomat.value = '';
      currentPostomat.setAttribute('disabled', '');
      window.NevigenNovaposhta.initSelect(id, 'postomat', []);
    }
    let ajaxData = new FormData();
    ajaxData.set('city', element.value);
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
      let city = document.querySelector('[name="params[' + id + '][nevigen_novaposhta_city]"]'),
        fieldNext = container.querySelector('[name="params[' + id + '][nevigen_novaposhta_' + fieldValid + ']"]');
      if (fieldNext) {
        if (fieldValid === 'street') {
          window.NevigenNovaposhta.disabledFields(id, ['house', 'apartment']);
          window.NevigenNovaposhta.calculation(city, 'courier', id);
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
  },
  getStreets: (element, id) => {
    if (!element || !id) {
      return false;
    }
    let nameInput = element.getAttribute('name');
    if (element.value.length === 3) {
      let city = document.querySelector('[name="params[' + id + '][nevigen_novaposhta_city]"]');
      if (city) {
        let ajaxData = new FormData();
        ajaxData.set('city', city.value);
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
    let city = document.querySelector('input[name="params[' + id + '][nevigen_novaposhta_city]"]');
    if (city) {
      window.NevigenNovaposhta.initSelect(id, 'warehouse');
      window.NevigenNovaposhta.initSelect(id, 'postomat');
      window.NevigenNovaposhta.setError(id);
    }
  }
  let defaultForm = document.querySelector('.jshop #shipping_form');
  if (defaultForm) {
    let methods = defaultForm.querySelectorAll('input[name="sh_pr_method_id"]');
    if (methods.length > 0) {
      methods.forEach(element => {
        element.addEventListener('change', e => {
          let city = defaultForm.querySelector('input[name="params[' + element.value + '][nevigen_novaposhta_city]"]');
          if (city) {
            let id = element.getAttribute('data-shipping_id');
            window.NevigenNovaposhta.setError(id);
            let city = defaultForm.querySelector('input[name="params[' + element.value + '][nevigen_novaposhta_city]"]'),
              warehouse = defaultForm.querySelector('input[name="params[' + element.value + '][nevigen_novaposhta_warehouse]"]'),
              postomat = defaultForm.querySelector('input[name="params[' + element.value + '][nevigen_novaposhta_postomat]"]');
            if (city.value === '') {
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
                window.NevigenNovaposhta.getWarehouses(city, id);
              }
              if (postomat && postomat.value === '') {
                window.NevigenNovaposhta.getPostomat(city, id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxDQUFDSSxLQUFLLENBQUVDLEtBQUssSUFBSztZQUNuQjdCLE1BQU0sQ0FBQ0MsaUJBQWlCLENBQUM2QixRQUFRLENBQUNMLElBQUksQ0FBQ3BCLEVBQUUsRUFBRXdCLEtBQUssQ0FBQ0UsT0FBTyxDQUFDO1VBQzFELENBQUMsQ0FBQztRQUNIO01BQ0QsQ0FBQyxNQUFNLElBQUkwQixLQUFLLEtBQUssV0FBVyxJQUFJQSxLQUFLLEtBQUssVUFBVSxFQUFFO1FBQ3pEekQsTUFBTSxDQUFDQyxpQkFBaUIsQ0FBQ0MsV0FBVyxDQUFDdUIsSUFBSSxDQUFDdEIsT0FBTyxFQUFFc0QsS0FBSyxFQUFFaEMsSUFBSSxDQUFDcEIsRUFBRSxFQUFFLElBQUksQ0FBQztNQUN6RTtJQUVEO0VBQ0Q7QUFDRCxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX25vdmFwb3NodGEvLi9wbGdfanNob3BwaW5nX25ldmlnZW5fbm92YXBvc2h0YS9lczYvbWFpbi5lczYiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEBwYWNrYWdlICAgIE5ldmlnZW4gSlNob3AgTm92YXBvc2h0YSBTaGlwcGluZyBQYWNrYWdlXG4gKiBAdmVyc2lvbiAgICAxLjMuNlxuICogQGF1dGhvciAgICAgTmV2aWdlbi5jb20gLSBodHRwczovL25ldmlnZW4uY29tXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgwqkgTmV2aWdlbi5jb20uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBAbGljZW5zZSAgICBQcm9wcmlldGFyeS4gQ29weXJpZ2h0ZWQgQ29tbWVyY2lhbCBTb2Z0d2FyZVxuICogQGxpbmsgICAgICAgaHR0cHM6Ly9uZXZpZ2VuLmNvbVxuICovXG5cblwidXNlIHN0cmljdFwiO1xubGV0IG5vdmFwb3NodGFTZWxlY3QgPSBbXSxcblx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0ID0gW107XG53aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEgPSB7XG5cdGNhbGN1bGF0aW9uOiAoZWxlbWVudCwgdHlwZSwgaWQsIGlnbm9yZU5ldmlnZW5PbmVTdGVwID0gZmFsc2UpID0+IHtcblx0XHRpZiAoIWVsZW1lbnQgfHwgIXR5cGUgfHwgIWlkKSByZXR1cm4gZmFsc2U7XG5cdFx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tbm92YXBvc2h0YS1jb250YWluZXI9XCInICsgaWQgKyAnXCJdJyk7XG5cdFx0aWYgKGNvbnRhaW5lcikge1xuXHRcdFx0bGV0IG1lc3NhZ2VCbG9jayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW5vdmFwb3NodGEtbWVzc2FnZT1cIicgKyBpZCArICdcIl0nKTtcblx0XHRcdGxldCBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YTtcblx0XHRcdGlmIChlbGVtZW50LnZhbHVlKSB7XG5cdFx0XHRcdGxldCBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX2NpdHldXCJdJyk7XG5cdFx0XHRcdGlmIChjaXR5KSB7XG5cdFx0XHRcdFx0YWpheERhdGEuc2V0KCdjaXR5JywgY2l0eS52YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YWpheERhdGEuc2V0KCd2YWx1ZScsIGVsZW1lbnQudmFsdWUpO1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ3dhcmVob3VzZScgfHwgdHlwZSA9PT0gJ3Bvc3RvbWF0Jykge1xuXHRcdFx0XHRcdGlmICh3aW5kb3cuTmV2aWdlbk9uZVN0ZXBDaGVja291dENsYXNzICYmIGlnbm9yZU5ldmlnZW5PbmVTdGVwID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhamF4RGF0YS5zZXQoJ3R5cGUnLCB0eXBlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhamF4RGF0YS5zZXQoJ3R5cGUnLCAnZG9vcnMnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdEpvb21sYS5yZW1vdmVNZXNzYWdlcyhtZXNzYWdlQmxvY2spO1xuXHRcdFx0fVxuXHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNlbmRBamF4KCdwb3N0JywgJ2NhbGN1bGF0aW9uJywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdGlmIChyZXNwb25zZS5kYXRhICYmIHJlc3BvbnNlLmRhdGEucHJpY2Vfc3RyaW5nKSB7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldFByaWNlKGlkLCByZXNwb25zZS5kYXRhLnByaWNlX3N0cmluZyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldFByaWNlKGlkLCAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0RXJyb3IoaWQsIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXHRzZWFyY2hDaXR5OiAoZWxlbWVudCwgaWQpID0+IHtcblx0XHRpZiAoZWxlbWVudCAmJiBpZCkge1xuXHRcdFx0bGV0IG5hbWVJbnB1dCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRpZiAoZWxlbWVudC52YWx1ZS5sZW5ndGggPT09IDMpIHtcblx0XHRcdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdFx0XHRhamF4RGF0YS5zZXQoJ3ZhbHVlJywgZWxlbWVudC52YWx1ZSk7XG5cdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZW5kQWpheCgncG9zdCcsICdzZWFyY2hDaXR5JywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiByZXNwb25zZS5kYXRhID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmluaXRBdXRvQ29tcGxldGUobmFtZUlucHV0LCByZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0XHRcdGlmIChub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XSkge1xuXHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5zdGFydCgpO1xuXHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3Rpb24nLCAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRsZXQgc2VsZWN0ZWRWYWx1ZSA9IGV2ZW50LmRldGFpbC5zZWxlY3Rpb24udmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0uaW5wdXQudmFsdWUgPSBzZWxlY3RlZFZhbHVlWyduYW1lJ107XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHR5cGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1uZXZpZ2VuLW5vdmFwb3NodGEnKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlID09PSAncGlja3VwJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0UHJlbG9hZGVyKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5nZXRXYXJlaG91c2VzKGVsZW1lbnQsIGlkKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnJlbW92ZVByZWxvYWRlcigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAodHlwZSA9PT0gJ3Bvc3RvbWF0Jykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0UHJlbG9hZGVyKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5nZXRQb3N0b21hdChlbGVtZW50LCBpZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5yZW1vdmVQcmVsb2FkZXIoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NvdXJpZXInKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRQcmVsb2FkZXIoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnZhbGlkQ291cmllcihlbGVtZW50LCAnc3RyZWV0JywgaWQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEucmVtb3ZlUHJlbG9hZGVyKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRFcnJvcihpZCwgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmIChlbGVtZW50LnZhbHVlLmxlbmd0aCA8IDMgJiYgbm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF1cblx0XHRcdFx0JiYgbm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0uZGF0YS5zcmMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5kYXRhLnNyYyA9IFtdO1xuXHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5zdGFydCgpO1xuXHRcdFx0XHRsZXQgc3RyZWV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX3N0cmVldF1cIl0nKTtcblx0XHRcdFx0aWYgKHN0cmVldCkge1xuXHRcdFx0XHRcdGxldCBuYW1lSW5wdXRTdHJlZXQgPSBzdHJlZXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdFx0aWYgKG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRTdHJlZXRdKSB7XG5cdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0U3RyZWV0XS5kYXRhLnNyYyA9IFtdO1xuXHRcdFx0XHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dFN0cmVldF0uc3RhcnQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmRpc2FibGVkRmllbGRzKGlkLCBbJ3N0cmVldCcsICdob3VzZScsICdhcGFydG1lbnQnXSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cdGdldFdhcmVob3VzZXM6IChlbGVtZW50LCBpZCkgPT4ge1xuXHRcdGlmICghZWxlbWVudCB8fCAhaWQpIHJldHVybiBmYWxzZTtcblx0XHRsZXQgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1ub3ZhcG9zaHRhLWNvbnRhaW5lcj1cIicgKyBpZCArICdcIl0nKTtcblx0XHRsZXQgY3VycmVudFdhcmVob3VzZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzZWxlY3RbbmFtZT1cInBhcmFtc1snICsgaWQgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfd2FyZWhvdXNlXVwiXScpO1xuXHRcdGlmIChjdXJyZW50V2FyZWhvdXNlKSB7XG5cdFx0XHRjdXJyZW50V2FyZWhvdXNlLnZhbHVlID0gJyc7XG5cdFx0XHRjdXJyZW50V2FyZWhvdXNlLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG5cdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuaW5pdFNlbGVjdChpZCwgJ3dhcmVob3VzZScsIFtdKTtcblx0XHR9XG5cdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdGFqYXhEYXRhLnNldCgnY2l0eScsIGVsZW1lbnQudmFsdWUpO1xuXHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZW5kQWpheCgncG9zdCcsICdnZXRXYXJlaG91c2VzJywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRpZiAodHlwZW9mIHJlc3BvbnNlLmRhdGEgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGlmIChjdXJyZW50V2FyZWhvdXNlKSB7XG5cdFx0XHRcdFx0Y3VycmVudFdhcmVob3VzZS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmluaXRTZWxlY3QoaWQsICd3YXJlaG91c2UnLCByZXNwb25zZS5kYXRhKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRQcmljZShpZCwgMCk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNldEVycm9yKGlkLCBlcnJvci5tZXNzYWdlKTtcblx0XHR9KTtcblxuXG5cdH0sXG5cdGdldFBvc3RvbWF0OiAoZWxlbWVudCwgaWQpID0+IHtcblx0XHRpZiAoIWVsZW1lbnQgfHwgIWlkKSByZXR1cm4gZmFsc2U7XG5cdFx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tbm92YXBvc2h0YS1jb250YWluZXI9XCInICsgaWQgKyAnXCJdJyk7XG5cdFx0bGV0IGN1cnJlbnRQb3N0b21hdCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzZWxlY3RbbmFtZT1cInBhcmFtc1snICsgaWQgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfcG9zdG9tYXRdXCJdJyk7XG5cdFx0aWYgKGN1cnJlbnRQb3N0b21hdCkge1xuXHRcdFx0Y3VycmVudFBvc3RvbWF0LnZhbHVlID0gJyc7XG5cdFx0XHRjdXJyZW50UG9zdG9tYXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcblx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5pbml0U2VsZWN0KGlkLCAncG9zdG9tYXQnLCBbXSk7XG5cdFx0fVxuXG5cdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdGFqYXhEYXRhLnNldCgnY2l0eScsIGVsZW1lbnQudmFsdWUpO1xuXHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZW5kQWpheCgncG9zdCcsICdnZXRQb3N0b21hdCcsIGFqYXhEYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0aWYgKHR5cGVvZiByZXNwb25zZS5kYXRhID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRpZiAoY3VycmVudFBvc3RvbWF0KSB7XG5cdFx0XHRcdFx0Y3VycmVudFBvc3RvbWF0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuaW5pdFNlbGVjdChpZCwgJ3Bvc3RvbWF0JywgcmVzcG9uc2UuZGF0YSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0UHJpY2UoaWQsIDApO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRFcnJvcihpZCwgZXJyb3IubWVzc2FnZSk7XG5cdFx0fSk7XG5cblxuXHR9LFxuXHRpbml0U2VsZWN0OiAoaWQsIGZpZWxkLCB2YWx1ZXMpID0+IHtcblx0XHRpZiAoIWlkIHx8ICFmaWVsZCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICghbm92YXBvc2h0YVNlbGVjdFtpZF0pIHtcblx0XHRcdG5vdmFwb3NodGFTZWxlY3RbaWRdID0gbnVsbFxuXHRcdH1cblx0XHRsZXQgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1ub3ZhcG9zaHRhLWNvbnRhaW5lcj1cIicgKyBpZCArICdcIl0nKTtcblx0XHRpZiAoY29udGFpbmVyKSB7XG5cdFx0XHRsZXQgcGFyYW1zID0ge1xuXHRcdFx0XHRwb3NpdGlvbjogJ2JvdHRvbScsXG5cdFx0XHRcdG5vUmVzdWx0c1RleHQ6IEpvb21sYS5UZXh0Ll8oJ0FERE9OX05FVklHRU5fTk9WQVBPU0hUQV9FUlJPUl9SRVNVTFRTJyksXG5cdFx0XHRcdG5vQ2hvaWNlc1RleHQ6IEpvb21sYS5UZXh0Ll8oJ0FERE9OX05FVklHRU5fTk9WQVBPU0hUQV9FUlJPUl9SRVNVTFRTJyksXG5cdFx0XHRcdHBsYWNlaG9sZGVyVmFsdWU6IEpvb21sYS5UZXh0Ll8oJ0FERE9OX05FVklHRU5fTk9WQVBPU0hUQV9QTEFDRUhPTERFUl9XQVJFSE9VU0UnKSxcblx0XHRcdFx0c2VhcmNoUGxhY2Vob2xkZXJWYWx1ZTogSm9vbWxhLlRleHQuXygnQURET05fTkVWSUdFTl9OT1ZBUE9TSFRBX1BMQUNFSE9MREVSX1dBUkVIT1VTRScpLFxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ29iamVjdCcgJiYgbm92YXBvc2h0YVNlbGVjdFtpZF0pIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBub3ZhcG9zaHRhU2VsZWN0W2lkXSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0ucmVtb3ZlQWN0aXZlSXRlbXMoKVxuXHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0uY2xlYXJDaG9pY2VzKCk7XG5cdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5kaXNhYmxlKCk7XG5cdFx0XHRcdFx0XHRsZXQgZWxlbWVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBhcmFtc1snICsgaWQgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfJyArIGZpZWxkICsgJ11cIl0nKTtcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LmNsb3Nlc3QoJy5jaG9pY2VzX19pbm5lcicpO1xuXHRcdFx0XHRcdFx0XHRsZXQgaXRlbSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNob2ljZXNfX2xpc3QtLXNpbmdsZScpO1xuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uaW5uZXJUZXh0ID0gSm9vbWxhLlRleHQuXygnQURET05fTkVWSUdFTl9OT1ZBUE9TSFRBX1BMQUNFSE9MREVSXycgKyBmaWVsZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5zZXRDaG9pY2VzKFxuXHRcdFx0XHRcdFx0XHR2YWx1ZXMsXG5cdFx0XHRcdFx0XHRcdCd2YWx1ZScsXG5cdFx0XHRcdFx0XHRcdCdsYWJlbCcsXG5cdFx0XHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0uZW5hYmxlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxldCBlbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFyYW1zWycgKyBpZCArICddW25ldmlnZW5fbm92YXBvc2h0YV8nICsgZmllbGQgKyAnXVwiXScpO1xuXHRcdFx0XHRcdGlmIChlbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXSA9IG5ldyBDaG9pY2VzKGVsZW1lbnQsIHBhcmFtcyk7XG5cdFx0XHRcdFx0XHRpZiAodmFsdWVzLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5zZXRDaG9pY2VzKFxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlcyxcblx0XHRcdFx0XHRcdFx0XHQndmFsdWUnLFxuXHRcdFx0XHRcdFx0XHRcdCdsYWJlbCcsXG5cdFx0XHRcdFx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5lbmFibGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBlbGVtZW50cyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbbmFtZT1cInBhcmFtc1snICsgaWQgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfJyArIGZpZWxkICsgJ11cIl0nKTtcblx0XHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAobm92YXBvc2h0YVNlbGVjdFtpZF0gPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0gPSBuZXcgQ2hvaWNlcyhlbGVtZW50LCBwYXJhbXMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBub3ZhcG9zaHRhU2VsZWN0W2lkXSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhU2VsZWN0W2lkXS5kZXN0cm95KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bm92YXBvc2h0YVNlbGVjdFtpZF0gPSBuZXcgQ2hvaWNlcyhlbGVtZW50LCBwYXJhbXMpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGluaXRBdXRvQ29tcGxldGUobmFtZSwgdmFsdWVzKSB7XG5cdFx0aWYgKCFuYW1lKSByZXR1cm4gZmFsc2U7XG5cblx0XHRpZiAobm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVdKSB7XG5cdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZV0uZGF0YS5zcmMgPSB2YWx1ZXM7XG5cdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZV0uc3RhcnQoKVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lXSA9IG5ldyBhdXRvQ29tcGxldGUoe1xuXHRcdFx0d3JhcHBlcjogZmFsc2UsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHNyYzogdmFsdWVzLFxuXHRcdFx0XHRrZXlzOiBbJ25hbWUnXSxcblx0XHRcdH0sXG5cdFx0XHRzZWxlY3RvcjogJ2lucHV0W25hbWU9XCInICsgbmFtZSArICdcIl0nLFxuXHRcdFx0cmVzdWx0c0xpc3Q6IHtcblx0XHRcdFx0bWF4UmVzdWx0czogMTAwMCxcblx0XHRcdFx0bm9SZXN1bHRzOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdHJlc3VsdEl0ZW06IHtcblx0XHRcdFx0aGlnaGxpZ2h0OiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdGlucHV0OiB7XG5cdFx0XHRcdFx0Zm9jdXMoKSB7XG5cdFx0XHRcdFx0XHRpZiAobm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVdLmlucHV0LnZhbHVlLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZV0uc3RhcnQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9KTtcblx0fSxcblx0dmFsaWRDb3VyaWVyOiAoZWxlbWVudCwgZmllbGRWYWxpZCwgaWQpID0+IHtcblx0XHRpZiAoIWVsZW1lbnQgfHwgIWZpZWxkVmFsaWQgfHwgIWlkKSByZXR1cm4gZmFsc2U7XG5cdFx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tbm92YXBvc2h0YS1jb250YWluZXI9XCInICsgaWQgKyAnXCJdJyk7XG5cdFx0aWYgKGNvbnRhaW5lcikge1xuXHRcdFx0bGV0IGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBhcmFtc1snICsgaWQgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfY2l0eV1cIl0nKSxcblx0XHRcdFx0ZmllbGROZXh0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFyYW1zWycgKyBpZCArICddW25ldmlnZW5fbm92YXBvc2h0YV8nICsgZmllbGRWYWxpZCArICddXCJdJyk7XG5cdFx0XHRcdGlmIChmaWVsZE5leHQpIHtcblx0XHRcdFx0XHRpZiAoZmllbGRWYWxpZCA9PT0gJ3N0cmVldCcpIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5kaXNhYmxlZEZpZWxkcyhpZCwgWydob3VzZScsICdhcGFydG1lbnQnXSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuY2FsY3VsYXRpb24oY2l0eSwgJ2NvdXJpZXInLCBpZCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChmaWVsZFZhbGlkID09PSAnaG91c2UnKSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuZGlzYWJsZWRGaWVsZHMoaWQsIFsnaG91c2UnLCAnYXBhcnRtZW50J10pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZWxlbWVudC52YWx1ZSkge1xuXHRcdFx0XHRcdFx0ZmllbGROZXh0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZmllbGROZXh0LnZhbHVlID0gJyc7XG5cdFx0XHRcdFx0XHRmaWVsZE5leHQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0fSxcblx0Z2V0U3RyZWV0czogKGVsZW1lbnQsIGlkKSA9PiB7XG5cdFx0aWYgKCFlbGVtZW50IHx8ICFpZCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRsZXQgbmFtZUlucHV0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0XHRpZiAoZWxlbWVudC52YWx1ZS5sZW5ndGggPT09IDMpIHtcblx0XHRcdGxldCBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX2NpdHldXCJdJyk7XG5cdFx0XHRpZiAoY2l0eSkge1xuXHRcdFx0XHRsZXQgYWpheERhdGEgPSBuZXcgRm9ybURhdGE7XG5cdFx0XHRcdGFqYXhEYXRhLnNldCgnY2l0eScsIGNpdHkudmFsdWUpO1xuXHRcdFx0XHRhamF4RGF0YS5zZXQoJ3ZhbHVlJywgZWxlbWVudC52YWx1ZSlcblx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnNlbmRBamF4KCdwb3N0JywgJ2dldFN0cmVldHMnLCBhamF4RGF0YSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHJlc3BvbnNlLmRhdGEgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuaW5pdEF1dG9Db21wbGV0ZShuYW1lSW5wdXQsIHJlc3BvbnNlLmRhdGEpO1xuXHRcdFx0XHRcdFx0aWYgKG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdKSB7XG5cdFx0XHRcdFx0XHRcdG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdLnN0YXJ0KCk7XG5cdFx0XHRcdFx0XHRcdG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdGlvbicsIChldmVudCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGxldCBzZWxlY3RlZFZhbHVlID0gZXZlbnQuZGV0YWlsLnNlbGVjdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5pbnB1dC52YWx1ZSA9IHNlbGVjdGVkVmFsdWVbJ25hbWUnXTtcblxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS52YWxpZENvdXJpZXIoZWxlbWVudCwgJ2hvdXNlJywgaWQpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0UHJpY2UoaWQsIDApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRFcnJvcihpZCwgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC52YWx1ZS5sZW5ndGggPCAzICYmIG5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dFtuYW1lSW5wdXRdXG5cdFx0XHQmJiBub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5kYXRhLnNyYy5sZW5ndGggPiAwKSB7XG5cdFx0XHRub3ZhcG9zaHRhQXV0b0NvbXBsZXRlSW5wdXRbbmFtZUlucHV0XS5kYXRhLnNyYyA9IFtdO1xuXHRcdFx0bm92YXBvc2h0YUF1dG9Db21wbGV0ZUlucHV0W25hbWVJbnB1dF0uc3RhcnQoKTtcblx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5kaXNhYmxlZEZpZWxkcyhpZCwgWydob3VzZScsICdhcGFydG1lbnQnXSk7XG5cdFx0fVxuXHR9LFxuXHRkaXNhYmxlZEZpZWxkczogKGlkLCBmaWVsZHMpID0+IHtcblx0XHRpZiAoIWlkIHx8ICFmaWVsZHMgfHwgZmllbGRzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmaWVsZHMuZm9yRWFjaCgoZmllbGROYW1lKSA9PiB7XG5cdFx0XHRsZXQgZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBhcmFtc1snICsgaWQgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfJyArIGZpZWxkTmFtZSArICddXCJdJyk7XG5cdFx0XHRpZiAoZmllbGQpIHtcblx0XHRcdFx0ZmllbGQudmFsdWUgPSAnJztcblx0XHRcdFx0ZmllbGQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9LFxuXHRzZXRQcmljZTogKGlkLCBwcmljZV9zdHJpbmcpID0+IHtcblx0XHRpZiAoIWlkKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGxldCBpbnB1dE1ldGhvZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNoaXBwaW5nX2lkPVwiJyArIGlkICsgJ1wiXScpO1xuXHRcdGlmIChpbnB1dE1ldGhvZCkge1xuXHRcdFx0bGV0IGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbGFiZWxbZm9yPVwic2hpcHBpbmdfbWV0aG9kXycgKyBpbnB1dE1ldGhvZC52YWx1ZSArICdcIl0nKSxcblx0XHRcdFx0Y29udGFpbmVyT25lU3RlcENoZWNrb3V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtc2hpcHBpbmc9XCInICsgaW5wdXRNZXRob2QudmFsdSArICdcIl0nKTtcblx0XHRcdGlmIChsYWJlbCkge1xuXHRcdFx0XHRsZXQgc2hpcHBpbmdfcHJpY2UgPSBsYWJlbC5xdWVyeVNlbGVjdG9yKCcuc2hpcHBpbmdfcHJpY2UnKTtcblx0XHRcdFx0bGV0IG52Z19zaGlwcGluZ19jb3N0ID0gbGFiZWwucXVlcnlTZWxlY3RvcignLm52Z19zaGlwcGluZ19jb3N0Jyk7XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lck9uZVN0ZXBDaGVja291dCkge1xuXHRcdFx0XHRcdHNoaXBwaW5nX3ByaWNlID0gY29udGFpbmVyT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcGluZ19wcmljZScpO1xuXHRcdFx0XHRcdG52Z19zaGlwcGluZ19jb3N0ID0gY29udGFpbmVyT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3IoJy5udmdfc2hpcHBpbmdfY29zdCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBwcmljZV9zdHJpbmcgPT09ICdudW1iZXInICYmIHByaWNlX3N0cmluZyA9PT0gMCkge1xuXHRcdFx0XHRcdHByaWNlX3N0cmluZyA9ICcnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzaGlwcGluZ19wcmljZSkge1xuXHRcdFx0XHRcdHNoaXBwaW5nX3ByaWNlLmlubmVySFRNTCA9IHByaWNlX3N0cmluZztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobnZnX3NoaXBwaW5nX2Nvc3QpIHtcblx0XHRcdFx0XHRudmdfc2hpcHBpbmdfY29zdC5pbm5lckhUTUwgPSBwcmljZV9zdHJpbmc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fSxcblx0c2VuZEFqYXg6IChtZXRob2RBamF4LCBtZXRob2QsIGFqYXhEYXRhKSA9PiB7XG5cdFx0bGV0IHBhcmFtID0gSm9vbWxhLmdldE9wdGlvbnMoJ25ldmlnZW5fbm92YXBvc2h0YScpO1xuXHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRQcmVsb2FkZXIoKTtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRpZiAoIXBhcmFtIHx8ICFhamF4RGF0YSB8fCAhbWV0aG9kQWpheCB8fCAhbWV0aG9kKSB7XG5cdFx0XHRcdFx0cmVqZWN0KCdFcnJvciBhamF4IGRhdGEnKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBhcmFtLmNzcmYpIHtcblx0XHRcdFx0XHRhamF4RGF0YS5zZXQocGFyYW0uY3NyZiwgMSlcblx0XHRcdFx0fVxuXHRcdFx0XHRhamF4RGF0YS5zZXQoJ3Rhc2snLCAnTmV2aWdlbk5vdmFwb3NodGEuJyArIG1ldGhvZCk7XG5cdFx0XHRcdEpvb21sYS5yZXF1ZXN0KHtcblx0XHRcdFx0XHR1cmw6IHBhcmFtLmNvbnRyb2xsZXIsXG5cdFx0XHRcdFx0bWV0aG9kOiBtZXRob2RBamF4LFxuXHRcdFx0XHRcdGRhdGE6IGFqYXhEYXRhLFxuXHRcdFx0XHRcdG9uU3VjY2VzczogcmVzcCA9PiB7XG5cdFx0XHRcdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEucmVtb3ZlUHJlbG9hZGVyKCk7XG5cdFx0XHRcdFx0XHRsZXQgcmVzcG9uc2U7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRyZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcCk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBKU09OJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdWNjZXNzID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KHJlc3BvbnNlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9uRXJyb3I6IHJlc3AgPT4ge1xuXHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLnJlbW92ZVByZWxvYWRlcigpO1xuXHRcdFx0XHRcdFx0bGV0IHJlc3BvbnNlO1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3AucmVzcG9uc2UpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gcGFyc2UgSlNPTicpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZWplY3QocmVzcG9uc2UpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHQpXG5cdH0sXG5cdHNldEVycm9yOiAoaWQsIG1lc3NhZ2UpID0+IHtcblx0XHRsZXQgZXJyb3IgPSBKb29tbGEuZ2V0T3B0aW9ucygnbmV2aWdlbl9ub3ZhcG9zaHRhX2Vycm9yXycgKyBpZCk7XG5cdFx0aWYgKGlkICYmIChtZXNzYWdlIHx8IGVycm9yKSkge1xuXHRcdFx0aWYgKCFtZXNzYWdlKSB7XG5cdFx0XHRcdG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuXHRcdFx0fVxuXHRcdFx0bGV0IG1lc3NhZ2VCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tbm92YXBvc2h0YS1tZXNzYWdlPVwiJyArIGlkICsgJ1wiXScpO1xuXHRcdFx0aWYgKG1lc3NhZ2VCbG9jaykge1xuXHRcdFx0XHRKb29tbGEucmVuZGVyTWVzc2FnZXMoe1xuXHRcdFx0XHRcdCdlcnJvcic6IFttZXNzYWdlXVxuXHRcdFx0XHR9LCBtZXNzYWdlQmxvY2spO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0c2V0UHJlbG9hZGVyOiAoKSA9PiB7XG5cdFx0bGV0IHByZWxvYWRlclNvdXJjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tbm92YXBvc2h0YT1cInByZWxvYWRlclwiXScpO1xuXHRcdGlmICghcHJlbG9hZGVyU291cmNlKSB7XG5cdFx0XHRwcmVsb2FkZXJTb3VyY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmV2aWdlbi1ub3ZhcG9zaHRhPVwicHJlbG9hZGVyXCJdJyk7XG5cdFx0fVxuXHRcdGlmIChwcmVsb2FkZXJTb3VyY2UpIHtcblx0XHRcdGxldCBwcmVsb2FkZXIgPSBwcmVsb2FkZXJTb3VyY2UuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0cHJlbG9hZGVyLnNldEF0dHJpYnV0ZSgnZGF0YS1hY3RpdmUnLCAxKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocHJlbG9hZGVyKTtcblx0XHRcdHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVQcmVsb2FkZXI6ICgpID0+IHtcblx0XHRsZXQgcHJlbG9hZGVyU291cmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1ub3ZhcG9zaHRhPVwicHJlbG9hZGVyXCJdW2RhdGEtYWN0aXZlXScpO1xuXHRcdGlmICghcHJlbG9hZGVyU291cmNlKSB7XG5cdFx0XHRwcmVsb2FkZXJTb3VyY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmV2aWdlbi1ub3ZhcG9zaHRhPVwicHJlbG9hZGVyXCJdW2RhdGEtYWN0aXZlXScpO1xuXHRcdH1cblx0XHRpZiAocHJlbG9hZGVyU291cmNlKSB7XG5cdFx0XHRwcmVsb2FkZXJTb3VyY2UucmVtb3ZlKCk7XG5cdFx0fVxuXHR9LFxuXHRzZXRDb29raWU6IChjb29raWVOYW1lLCB2YWx1ZSkgPT4ge1xuXHRcdGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZU5hbWUgKyBcIj1cIiArIHZhbHVlICsgXCJcIiArIFwiOyBwYXRoPS9cIjtcblx0fSxcblx0Z2V0Q29va2llOiAoY19uYW1lKSA9PiB7XG5cdFx0aWYgKGRvY3VtZW50LmNvb2tpZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgY19zdGFydCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKGNfbmFtZSArIFwiPVwiKTtcblx0XHRcdGlmIChjX3N0YXJ0ICE9PSAtMSkge1xuXHRcdFx0XHRjX3N0YXJ0ID0gY19zdGFydCArIGNfbmFtZS5sZW5ndGggKyAxO1xuXHRcdFx0XHRsZXQgY19lbmQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihcIjtcIiwgY19zdGFydCk7XG5cdFx0XHRcdGlmIChjX2VuZCA9PT0gLTEpIHtcblx0XHRcdFx0XHRjX2VuZCA9IGRvY3VtZW50LmNvb2tpZS5sZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGRlY29kZVVSSShkb2N1bWVudC5jb29raWUuc3Vic3RyaW5nKGNfc3RhcnQsIGNfZW5kKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAnJztcblx0fSxcblx0cmVtb3ZlQ29va2llOiAoY29va2llTmFtZSkgPT4ge1xuXHRcdGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZU5hbWUgKyBcIj07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBVVEM7IHBhdGg9LztcIjtcblx0fSxcbn1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdGxldCBzaF9wcl9tZXRob2RfaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic2hfcHJfbWV0aG9kX2lkXCJdOmNoZWNrZWQnKTtcblx0aWYgKHNoX3ByX21ldGhvZF9pZCkge1xuXHRcdGxldCBpZCA9IHNoX3ByX21ldGhvZF9pZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcHBpbmdfaWQnKTtcblx0XHRsZXQgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJwYXJhbXNbJyArIGlkICsgJ11bbmV2aWdlbl9ub3ZhcG9zaHRhX2NpdHldXCJdJyk7XG5cdFx0aWYgKGNpdHkpIHtcblx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5pbml0U2VsZWN0KGlkLCAnd2FyZWhvdXNlJyk7XG5cdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuaW5pdFNlbGVjdChpZCwgJ3Bvc3RvbWF0Jyk7XG5cdFx0XHR3aW5kb3cuTmV2aWdlbk5vdmFwb3NodGEuc2V0RXJyb3IoaWQpO1xuXHRcdH1cblx0fVxuXHRsZXQgZGVmYXVsdEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanNob3AgI3NoaXBwaW5nX2Zvcm0nKTtcblx0aWYgKGRlZmF1bHRGb3JtKSB7XG5cdFx0bGV0IG1ldGhvZHMgPSBkZWZhdWx0Rm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwic2hfcHJfbWV0aG9kX2lkXCJdJyk7XG5cdFx0aWYgKG1ldGhvZHMubGVuZ3RoID4gMCkge1xuXHRcdFx0bWV0aG9kcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdFx0XHRsZXQgY2l0eSA9IGRlZmF1bHRGb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJwYXJhbXNbJyArIGVsZW1lbnQudmFsdWUgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfY2l0eV1cIl0nKTtcblx0XHRcdFx0XHRpZiAoY2l0eSkge1xuXHRcdFx0XHRcdFx0bGV0IGlkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcHBpbmdfaWQnKTtcblx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRFcnJvcihpZCk7XG5cdFx0XHRcdFx0XHRsZXQgY2l0eSA9IGRlZmF1bHRGb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJwYXJhbXNbJyArIGVsZW1lbnQudmFsdWUgKyAnXVtuZXZpZ2VuX25vdmFwb3NodGFfY2l0eV1cIl0nKSxcblx0XHRcdFx0XHRcdFx0d2FyZWhvdXNlID0gZGVmYXVsdEZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInBhcmFtc1snICsgZWxlbWVudC52YWx1ZSArICddW25ldmlnZW5fbm92YXBvc2h0YV93YXJlaG91c2VdXCJdJyksXG5cdFx0XHRcdFx0XHRcdHBvc3RvbWF0ID0gZGVmYXVsdEZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInBhcmFtc1snICsgZWxlbWVudC52YWx1ZSArICddW25ldmlnZW5fbm92YXBvc2h0YV9wb3N0b21hdF1cIl0nKTtcblx0XHRcdFx0XHRcdGlmIChjaXR5LnZhbHVlID09PSAnJykge1xuXHRcdFx0XHRcdFx0XHRpZiAod2FyZWhvdXNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2FyZWhvdXNlLnZhbHVlID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0d2FyZWhvdXNlLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmluaXRTZWxlY3QoaWQsICd3YXJlaG91c2UnLCBbXSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKHBvc3RvbWF0KSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9zdG9tYXQudmFsdWUgPSAnJztcblx0XHRcdFx0XHRcdFx0XHRwb3N0b21hdC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5pbml0U2VsZWN0KGlkLCAncG9zdG9tYXQnLCBbXSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmICh3YXJlaG91c2UgJiYgd2FyZWhvdXNlLnZhbHVlID09PSAnJykge1xuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5nZXRXYXJlaG91c2VzKGNpdHksIGlkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAocG9zdG9tYXQgJiYgcG9zdG9tYXQudmFsdWUgPT09ICcnKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmdldFBvc3RvbWF0KGNpdHksIGlkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbmV2aWdlbk9uZVN0ZXBDaGVja291dEFmdGVyU2F2ZU1ldGhvZHNQYXJhbXMnLCAoZXZlbnQpID0+IHtcblx0bGV0IGRhdGEgPSBldmVudC5kZXRhaWw7XG5cdGlmIChkYXRhICYmIGRhdGEubmFtZSkge1xuXHRcdGlmIChkYXRhLm5hbWUuaW5jbHVkZXMoJ25ldmlnZW5fbm92YXBvc2h0YV8nKSkge1xuXHRcdFx0bGV0IGZpZWxkID0gZGF0YS5uYW1lLnJlcGxhY2UoJ25ldmlnZW5fbm92YXBvc2h0YV8nLCAnJyk7XG5cdFx0XHRpZiAoZmllbGQgJiYgKGZpZWxkICE9PSAnd2FyZWhvdXNlJyAmJiBmaWVsZCAhPT0gJ3Bvc3RvbWF0JykpIHtcblx0XHRcdFx0bGV0IG5hbWUgPSAnJztcblx0XHRcdFx0aWYgKGZpZWxkID09PSAncG9zdGNvZGUnKSB7XG5cdFx0XHRcdFx0bmFtZSA9ICdkX3ppcCc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZmllbGQgPT09ICdjaXR5Jykge1xuXHRcdFx0XHRcdG5hbWUgPSAnZF9jaXR5Jztcblx0XHRcdFx0fSBlbHNlIGlmIChmaWVsZCA9PT0gJ3N0cmVldCcpIHtcblx0XHRcdFx0XHRuYW1lID0gJ2Rfc3RyZWV0Jztcblx0XHRcdFx0fSBlbHNlIGlmIChmaWVsZCA9PT0gJ2hvdXNlJykge1xuXHRcdFx0XHRcdG5hbWUgPSAnZF9ob21lJztcblx0XHRcdFx0fSBlbHNlIGlmIChmaWVsZCA9PT0gJ2FwYXJ0bWVudCcpIHtcblx0XHRcdFx0XHRuYW1lID0gJ2RfYXBhcnRtZW50Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobmFtZSkge1xuXHRcdFx0XHRcdGxldCBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YTtcblx0XHRcdFx0XHRhamF4RGF0YS5zZXQoJ3R5cGUnLCAnYWRkcmVzcycpO1xuXHRcdFx0XHRcdGFqYXhEYXRhLnNldCgnc2F2ZWZvcm1kYXRhWycgKyBuYW1lICsgJ10nLCBkYXRhLmVsZW1lbnQudmFsdWUpO1xuXHRcdFx0XHRcdGFqYXhEYXRhLnNldCgnbWV0aG9kJywgJ25ldmlnZW5fbm92YXBvc2h0YScpO1xuXHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuT25lU3RlcENoZWNrb3V0KCkuc2VuZEFqYXgoJ3Bvc3QnLCAnc2F2ZUZvcm1EYXRhJywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cblx0XHRcdFx0XHR9KS5jYXRjaCgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdHdpbmRvdy5OZXZpZ2VuTm92YXBvc2h0YS5zZXRFcnJvcihkYXRhLmlkLCBlcnJvci5tZXNzYWdlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChmaWVsZCA9PT0gJ3dhcmVob3VzZScgfHwgZmllbGQgPT09ICdwb3N0b21hdCcpIHtcblx0XHRcdFx0d2luZG93Lk5ldmlnZW5Ob3ZhcG9zaHRhLmNhbGN1bGF0aW9uKGRhdGEuZWxlbWVudCwgZmllbGQsIGRhdGEuaWQsIHRydWUpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG59KTsiXSwibmFtZXMiOlsibm92YXBvc2h0YVNlbGVjdCIsIm5vdmFwb3NodGFBdXRvQ29tcGxldGVJbnB1dCIsIndpbmRvdyIsIk5ldmlnZW5Ob3ZhcG9zaHRhIiwiY2FsY3VsYXRpb24iLCJlbGVtZW50IiwidHlwZSIsImlkIiwiaWdub3JlTmV2aWdlbk9uZVN0ZXAiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJjb250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJtZXNzYWdlQmxvY2siLCJhamF4RGF0YSIsIkZvcm1EYXRhIiwidmFsdWUiLCJjaXR5Iiwic2V0IiwiTmV2aWdlbk9uZVN0ZXBDaGVja291dENsYXNzIiwiSm9vbWxhIiwicmVtb3ZlTWVzc2FnZXMiLCJzZW5kQWpheCIsInRoZW4iLCJyZXNwb25zZSIsImRhdGEiLCJwcmljZV9zdHJpbmciLCJzZXRQcmljZSIsImNhdGNoIiwiZXJyb3IiLCJzZXRFcnJvciIsIm1lc3NhZ2UiLCJzZWFyY2hDaXR5IiwibmFtZUlucHV0IiwiZ2V0QXR0cmlidXRlIiwiaW5pdEF1dG9Db21wbGV0ZSIsInN0YXJ0IiwiaW5wdXQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJzZWxlY3RlZFZhbHVlIiwiZGV0YWlsIiwic2VsZWN0aW9uIiwic2V0UHJlbG9hZGVyIiwiZ2V0V2FyZWhvdXNlcyIsInJlbW92ZVByZWxvYWRlciIsImdldFBvc3RvbWF0IiwidmFsaWRDb3VyaWVyIiwic3JjIiwic3RyZWV0IiwibmFtZUlucHV0U3RyZWV0IiwiZGlzYWJsZWRGaWVsZHMiLCJjdXJyZW50V2FyZWhvdXNlIiwic2V0QXR0cmlidXRlIiwiaW5pdFNlbGVjdCIsInJlbW92ZUF0dHJpYnV0ZSIsImN1cnJlbnRQb3N0b21hdCIsImZpZWxkIiwidmFsdWVzIiwicGFyYW1zIiwicG9zaXRpb24iLCJub1Jlc3VsdHNUZXh0IiwiVGV4dCIsIl8iLCJub0Nob2ljZXNUZXh0IiwicGxhY2Vob2xkZXJWYWx1ZSIsInNlYXJjaFBsYWNlaG9sZGVyVmFsdWUiLCJyZW1vdmVBY3RpdmVJdGVtcyIsImNsZWFyQ2hvaWNlcyIsImRpc2FibGUiLCJjbG9zZXN0IiwiaXRlbSIsImlubmVyVGV4dCIsInNldENob2ljZXMiLCJlbmFibGUiLCJDaG9pY2VzIiwiZWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImRlc3Ryb3kiLCJuYW1lIiwiYXV0b0NvbXBsZXRlIiwid3JhcHBlciIsImtleXMiLCJzZWxlY3RvciIsInJlc3VsdHNMaXN0IiwibWF4UmVzdWx0cyIsIm5vUmVzdWx0cyIsInJlc3VsdEl0ZW0iLCJoaWdobGlnaHQiLCJldmVudHMiLCJmb2N1cyIsImZpZWxkVmFsaWQiLCJmaWVsZE5leHQiLCJnZXRTdHJlZXRzIiwiZmllbGRzIiwiZmllbGROYW1lIiwiaW5wdXRNZXRob2QiLCJsYWJlbCIsImNvbnRhaW5lck9uZVN0ZXBDaGVja291dCIsInZhbHUiLCJzaGlwcGluZ19wcmljZSIsIm52Z19zaGlwcGluZ19jb3N0IiwiaW5uZXJIVE1MIiwibWV0aG9kQWpheCIsIm1ldGhvZCIsInBhcmFtIiwiZ2V0T3B0aW9ucyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY3NyZiIsInJlcXVlc3QiLCJ1cmwiLCJjb250cm9sbGVyIiwib25TdWNjZXNzIiwicmVzcCIsIkpTT04iLCJwYXJzZSIsIkVycm9yIiwic3VjY2VzcyIsIm9uRXJyb3IiLCJyZW5kZXJNZXNzYWdlcyIsInByZWxvYWRlclNvdXJjZSIsInByZWxvYWRlciIsImNsb25lTm9kZSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiZGlzcGxheSIsInJlbW92ZSIsInNldENvb2tpZSIsImNvb2tpZU5hbWUiLCJjb29raWUiLCJnZXRDb29raWUiLCJjX25hbWUiLCJjX3N0YXJ0IiwiaW5kZXhPZiIsImNfZW5kIiwiZGVjb2RlVVJJIiwic3Vic3RyaW5nIiwicmVtb3ZlQ29va2llIiwic2hfcHJfbWV0aG9kX2lkIiwiZGVmYXVsdEZvcm0iLCJtZXRob2RzIiwiZSIsIndhcmVob3VzZSIsInBvc3RvbWF0IiwiaW5jbHVkZXMiLCJyZXBsYWNlIiwiTmV2aWdlbk9uZVN0ZXBDaGVja291dCJdLCJzb3VyY2VSb290IjoiIn0=