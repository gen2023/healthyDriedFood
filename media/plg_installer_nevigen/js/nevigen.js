/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***********************************************!*\
  !*** ./plg_installer_nevigen/es6/nevigen.es6 ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * @package    Nevigen Installer Plugin
 * @version    2.4.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

if (!Joomla) {
  throw new Error('Joomla API is not properly initialised');
}
var NevigenInstaller = /*#__PURE__*/function () {
  function NevigenInstaller() {
    _classCallCheck(this, NevigenInstaller);
    this.options = Joomla.getOptions('plg_installer_nevigen');
    this.controller = this.options && this.options.controller ? this.options.controller : false;
    this.csrf = Joomla.getOptions('csrf.token');
    this.activeFilters = [];
  }
  return _createClass(NevigenInstaller, [{
    key: "initialise",
    value: function initialise() {
      this.showToast(false);
      this.listExtensions();
      this.loadActions();
    }
  }, {
    key: "listExtensions",
    value: function listExtensions() {
      var _this = this;
      var filterLoad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var formData = new FormData();
      formData.set('action', 'getListExtensions');
      var nevigenList = document.querySelector('#nevigenList');
      if (!nevigenList) {
        return;
      }
      if (filterLoad) {
        var filters = nevigenList.querySelectorAll('input[name*="filter"]');
        if (filters.length > 0) {
          filters.forEach(function (filter) {
            if (filter.value) {
              formData.set(filter.getAttribute('name'), filter.value);
            }
          });
        }
      }
      var nevigen_search = this.getParamByUrl();
      if (nevigen_search) {
        formData.set('filter[search]', nevigen_search);
      }
      this.sendAjax(formData).then(function (response) {
        if (response) {
          var data = response.success ? response.data : false;
          nevigenList.innerHTML = data ? data : response.message;
          if (response.success === true) {
            if (nevigen_search) {
              _this.getParamByUrl('nevigen_search', true);
            }
            _this.loadActions();
          }
        }
      })["catch"](function (error) {
        console.error(error);
      });
    }
  }, {
    key: "loadActions",
    value: function loadActions() {
      var _this2 = this;
      var nevigenList = document.querySelector('#nevigenList'),
        buttons = nevigenList.querySelectorAll('[data-extension]'),
        buttonsUpdates = nevigenList.querySelectorAll('[data-extension-update]');
      if (buttons.length > 0) {
        buttons.forEach(function (button) {
          button.addEventListener('click', function (e) {
            e.preventDefault();
            document.body.appendChild(document.createElement('joomla-core-loader'));
            var extension = button.getAttribute('data-extension'),
              free = button.closest('[data-nevigen-filter-free]');
            if (extension) {
              var formData = new FormData();
              formData.set('action', 'installExtension');
              formData.set('extension', extension);
              if (free && free.getAttribute('data-nevigen-filter-free') === '1') {
                formData.set('free', 1);
              }
              _this2.sendAjax(formData).then(function (response) {
                if (response && response.success) {
                  window.location.reload();
                } else {
                  document.querySelector('joomla-core-loader').remove();
                  _this2.showToast(response.message, 'error');
                }
              })["catch"](function (error) {
                console.error(error);
              });
            }
          });
        });
      }
      if (buttonsUpdates.length > 0) {
        buttonsUpdates.forEach(function (button) {
          button.style.display = '';
          button.addEventListener('click', function (e) {
            e.preventDefault();
            document.body.appendChild(document.createElement('joomla-core-loader'));
            var extension = button.getAttribute('data-extension-update'),
              type = button.getAttribute('data-type');
            if (extension) {
              var formData = new FormData();
              formData.set('action', 'updateExtension');
              formData.set('extension', extension);
              formData.set('type', type);
              _this2.sendAjax(formData).then(function (response) {
                if (response && response.success) {
                  window.location.reload();
                } else {
                  document.querySelector('joomla-core-loader').remove();
                  _this2.showToast(response.message, 'error');
                }
              })["catch"](function (error) {
                console.error(error);
              });
            }
          });
        });
      }
    }
  }, {
    key: "setHideFilter",
    value: function setHideFilter(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-1';
      var filterItems = '[data-nevigen-filter-' + name + ']';
      if (name === 'free' || name === 'install') {
        var freeInput = document.querySelector('input[name="nevigen_type_free"]');
        var installInput = document.querySelector('input[name="nevigen_hide_install"]');
        if (name === 'free' && freeInput) {
          if (freeInput.checked === false) {
            value = '-1';
            delete this.activeFilters[name];
          } else {
            this.activeFilters[name] = true;
          }
        }
        if (name === 'install' && installInput) {
          if (installInput.checked === false) {
            value = '-1';
            delete this.activeFilters[name];
          } else {
            this.activeFilters[name] = true;
          }
        }
        if (name !== 'install' && this.activeFilters['install']) {
          filterItems += '[data-nevigen-filter-install="0"]';
        }
        if (name !== 'free' && this.activeFilters['free']) {
          filterItems += '[data-nevigen-filter-free="1"]';
        }
        var items = document.querySelectorAll('#nevigenList ' + filterItems);
        if (items.length > 0) {
          items.forEach(function (item) {
            if (value === '-1') {
              item.style.display = '';
            } else {
              var itemValue = item.getAttribute('data-nevigen-filter-' + name);
              if (itemValue === value.toString()) {
                item.style.display = '';
              } else {
                item.style.display = 'none';
              }
            }
          });
        }
      }
    }
  }, {
    key: "runSearch",
    value: function runSearch(event) {
      console.log(event.key);
      if (event.key === 'Enter') {
        event.preventDefault();
        this.listExtensions(true);
      }
    }
  }, {
    key: "resetAllFilters",
    value: function resetAllFilters() {
      window.location.href = '/administrator/index.php?option=com_installer&view=install';
    }
  }, {
    key: "getParamByUrl",
    value: function getParamByUrl() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'nevigen_search';
      var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var url = window.location.href;
      if (url.includes('&' + name + '=')) {
        url = new URL(window.location.href);
        if (remove) {
          url.searchParams["delete"]('nevigen_search');
          window.history.replaceState({}, '', url);
          return true;
        } else {
          var searchParams = new URLSearchParams(url.search);
          return searchParams.get(name);
        }
      }
      return false;
    }
  }, {
    key: "showToast",
    value: function showToast(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'notice';
      var toastContainer = document.querySelector('#toast-container');
      if (message === false) {
        if (toastContainer) {
          toastContainer.remove();
        }
        return;
      }
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = 11;
        document.body.appendChild(toastContainer);
      }
      var toastEl = document.createElement('div'),
        classNotified = type === 'error' ? ' text-danger' : ' text-info';
      toastEl.className = 'toast align-items-center border-0 mb-3';
      toastEl.setAttribute('role', 'alert');
      toastEl.setAttribute('aria-live', 'assertive');
      toastEl.setAttribute('aria-atomic', 'true');
      var toastHeader = document.createElement('div');
      toastHeader.className = 'toast-header' + classNotified;
      toastEl.appendChild(toastHeader);
      var strong = document.createElement('strong');
      strong.className = 'me-auto';
      strong.innerText = Joomla.Text._(type);
      toastHeader.appendChild(strong);
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-close';
      button.setAttribute('data-bs-dismiss', 'toast');
      button.setAttribute('aria-label', 'Close');
      toastHeader.appendChild(button);
      var toastBody = document.createElement('div');
      toastBody.className = type === 'error' ? 'toast-body text-bg-danger' : 'toast-body';
      toastBody.innerHTML = message;
      toastEl.appendChild(toastBody);
      toastContainer.appendChild(toastEl);
      var toast = new bootstrap.Toast(toastEl, {
        delay: 10000
      });
      toast.show();
      toastEl.addEventListener('hidden.bs.toast', function () {
        toastEl.remove();
      });
    }
  }, {
    key: "sendAjax",
    value: function sendAjax(formData) {
      var _this3 = this;
      return new Promise(function (resolve) {
        formData.set(_this3.csrf, 1);
        Joomla.request({
          url: _this3.controller,
          method: 'POST',
          data: formData,
          onSuccess: function onSuccess(resp) {
            var response;
            try {
              response = JSON.parse(resp);
            } catch (error) {
              throw new Error('Failed to parse JSON');
            }
            resolve(response);
          }
        });
      });
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NevigenInstaller);
window.NevigenInstallerClass = null;
window.NevigenInstaller = function () {
  if (window.NevigenInstallerClass === null) {
    window.NevigenInstallerClass = new NevigenInstaller();
  }
  return window.NevigenInstallerClass;
};
customElements.whenDefined('joomla-tab').then(function () {
  var installerTabs = document.getElementById('myTab'),
    link = installerTabs.querySelector('button[aria-controls=nevigen]');
  if (link.hasAttribute('aria-expanded') && link.getAttribute('aria-expanded') === 'true' || link.hasAttribute('aria-selected') && link.getAttribute('aria-selected') === 'true') {
    window.NevigenInstaller().initialise();
  }
  link.addEventListener('joomla.tab.shown', function () {
    var param = window.NevigenInstaller().getParamByUrl();
    window.NevigenInstaller().initialise(param);
  });
});
document.addEventListener('DOMContentLoaded', function () {
  var param = window.NevigenInstaller().getParamByUrl();
  if (param) {
    var installerTabs = document.getElementById('myTab'),
      link = installerTabs.querySelector('button[aria-controls=nevigen]');
    if (link.hasAttribute('aria-expanded') && link.getAttribute('aria-expanded') !== 'true' || link.hasAttribute('aria-selected') && link.getAttribute('aria-selected') !== 'true') {
      link.click();
    }
  }
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBR0YsYUFBYSxDQUFDM0YsYUFBYSxDQUFDLCtCQUErQixDQUFDO0lBQ3BFLElBQUs2RixJQUFJLENBQUNDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFDbENELElBQUksQ0FBQ3hGLFlBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxNQUFNLElBQzdDd0YsSUFBSSxDQUFDQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQ2xDRCxJQUFJLENBQUN4RixZQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssTUFBTyxFQUFFO01BQ3BEd0YsSUFBSSxDQUFDRyxLQUFLLENBQUMsQ0FBQztJQUNiO0VBQ0Q7QUFDRCxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3BsZ19pbnN0YWxsZXJfbmV2aWdlbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wbGdfaW5zdGFsbGVyX25ldmlnZW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BsZ19pbnN0YWxsZXJfbmV2aWdlbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BsZ19pbnN0YWxsZXJfbmV2aWdlbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BsZ19pbnN0YWxsZXJfbmV2aWdlbi8uL3BsZ19pbnN0YWxsZXJfbmV2aWdlbi9lczYvbmV2aWdlbi5lczYiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKlxuICogQHBhY2thZ2UgICAgTmV2aWdlbiBJbnN0YWxsZXIgUGx1Z2luXG4gKiBAdmVyc2lvbiAgICAyLjQuMFxuICogQGF1dGhvciAgICAgTmV2aWdlbi5jb20gLSBodHRwczovL25ldmlnZW4uY29tXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgwqkgTmV2aWdlbi5jb20uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBAbGljZW5zZSAgICBQcm9wcmlldGFyeS4gQ29weXJpZ2h0ZWQgQ29tbWVyY2lhbCBTb2Z0d2FyZVxuICogQGxpbmsgICAgICAgaHR0cHM6Ly9uZXZpZ2VuLmNvbVxuICovXG5cbmlmICghSm9vbWxhKSB7XG5cdHRocm93IG5ldyBFcnJvcignSm9vbWxhIEFQSSBpcyBub3QgcHJvcGVybHkgaW5pdGlhbGlzZWQnKTtcbn1cblxuY2xhc3MgTmV2aWdlbkluc3RhbGxlciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMub3B0aW9ucyA9IEpvb21sYS5nZXRPcHRpb25zKCdwbGdfaW5zdGFsbGVyX25ldmlnZW4nKTtcblx0XHR0aGlzLmNvbnRyb2xsZXIgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmNvbnRyb2xsZXIgPyB0aGlzLm9wdGlvbnMuY29udHJvbGxlciA6IGZhbHNlO1xuXHRcdHRoaXMuY3NyZiA9IEpvb21sYS5nZXRPcHRpb25zKCdjc3JmLnRva2VuJyk7XG5cdFx0dGhpcy5hY3RpdmVGaWx0ZXJzID0gW107XG5cdH1cblxuXHRpbml0aWFsaXNlKCkge1xuXHRcdHRoaXMuc2hvd1RvYXN0KGZhbHNlKTtcblx0XHR0aGlzLmxpc3RFeHRlbnNpb25zKCk7XG5cdFx0dGhpcy5sb2FkQWN0aW9ucygpO1xuXHR9XG5cblx0bGlzdEV4dGVuc2lvbnMoZmlsdGVyTG9hZCA9IGZhbHNlKSB7XG5cdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcblx0XHRmb3JtRGF0YS5zZXQoJ2FjdGlvbicsICdnZXRMaXN0RXh0ZW5zaW9ucycpO1xuXHRcdGxldCBuZXZpZ2VuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXZpZ2VuTGlzdCcpO1xuXHRcdGlmICghbmV2aWdlbkxpc3QpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoZmlsdGVyTG9hZCkge1xuXHRcdFx0bGV0IGZpbHRlcnMgPSBuZXZpZ2VuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lKj1cImZpbHRlclwiXScpO1xuXHRcdFx0aWYgKGZpbHRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRmaWx0ZXJzLmZvckVhY2goKGZpbHRlcikgPT4ge1xuXHRcdFx0XHRcdGlmIChmaWx0ZXIudmFsdWUpIHtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldChmaWx0ZXIuZ2V0QXR0cmlidXRlKCduYW1lJyksIGZpbHRlci52YWx1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bGV0IG5ldmlnZW5fc2VhcmNoID0gdGhpcy5nZXRQYXJhbUJ5VXJsKCk7XG5cdFx0aWYgKG5ldmlnZW5fc2VhcmNoKSB7XG5cdFx0XHRmb3JtRGF0YS5zZXQoJ2ZpbHRlcltzZWFyY2hdJywgbmV2aWdlbl9zZWFyY2gpO1xuXHRcdH1cblx0XHR0aGlzLnNlbmRBamF4KGZvcm1EYXRhKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmIChyZXNwb25zZSkge1xuXHRcdFx0XHRsZXQgZGF0YSA9IChyZXNwb25zZS5zdWNjZXNzKSA/IHJlc3BvbnNlLmRhdGEgOiBmYWxzZVxuXHRcdFx0XHRuZXZpZ2VuTGlzdC5pbm5lckhUTUwgPSAoZGF0YSkgPyBkYXRhIDogcmVzcG9uc2UubWVzc2FnZTtcblxuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3VjY2VzcyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGlmIChuZXZpZ2VuX3NlYXJjaCkge1xuXHRcdFx0XHRcdFx0dGhpcy5nZXRQYXJhbUJ5VXJsKCduZXZpZ2VuX3NlYXJjaCcsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmxvYWRBY3Rpb25zKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHR9KTtcblx0fVxuXG5cdGxvYWRBY3Rpb25zKCkge1xuXHRcdGxldCBuZXZpZ2VuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXZpZ2VuTGlzdCcpLFxuXHRcdFx0YnV0dG9ucyA9IG5ldmlnZW5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWV4dGVuc2lvbl0nKSxcblx0XHRcdGJ1dHRvbnNVcGRhdGVzID0gbmV2aWdlbkxpc3QucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZXh0ZW5zaW9uLXVwZGF0ZV0nKTtcblx0XHRpZiAoYnV0dG9ucy5sZW5ndGggPiAwKSB7XG5cdFx0XHRidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2pvb21sYS1jb3JlLWxvYWRlcicpKTtcblx0XHRcdFx0XHRsZXQgZXh0ZW5zaW9uID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1leHRlbnNpb24nKSxcblx0XHRcdFx0XHRcdGZyZWUgPSBidXR0b24uY2xvc2VzdCgnW2RhdGEtbmV2aWdlbi1maWx0ZXItZnJlZV0nKTtcblx0XHRcdFx0XHRpZiAoZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdFx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgnYWN0aW9uJywgJ2luc3RhbGxFeHRlbnNpb24nKTtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgnZXh0ZW5zaW9uJywgZXh0ZW5zaW9uKTtcblx0XHRcdFx0XHRcdGlmIChmcmVlICYmIGZyZWUuZ2V0QXR0cmlidXRlKCdkYXRhLW5ldmlnZW4tZmlsdGVyLWZyZWUnKSA9PT0gJzEnKSB7XG5cdFx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgnZnJlZScsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5zZW5kQWpheChmb3JtRGF0YSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdWNjZXNzKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2pvb21sYS1jb3JlLWxvYWRlcicpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2hvd1RvYXN0KHJlc3BvbnNlLm1lc3NhZ2UsICdlcnJvcicpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0aWYgKGJ1dHRvbnNVcGRhdGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGJ1dHRvbnNVcGRhdGVzLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2pvb21sYS1jb3JlLWxvYWRlcicpKTtcblx0XHRcdFx0XHRsZXQgZXh0ZW5zaW9uID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1leHRlbnNpb24tdXBkYXRlJyksXG5cdFx0XHRcdFx0XHR0eXBlID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJyk7XG5cdFx0XHRcdFx0aWYgKGV4dGVuc2lvbikge1xuXHRcdFx0XHRcdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5zZXQoJ2FjdGlvbicsICd1cGRhdGVFeHRlbnNpb24nKTtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgnZXh0ZW5zaW9uJywgZXh0ZW5zaW9uKTtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgndHlwZScsIHR5cGUpO1xuXHRcdFx0XHRcdFx0dGhpcy5zZW5kQWpheChmb3JtRGF0YSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdWNjZXNzKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2pvb21sYS1jb3JlLWxvYWRlcicpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2hvd1RvYXN0KHJlc3BvbnNlLm1lc3NhZ2UsICdlcnJvcicpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRzZXRIaWRlRmlsdGVyKG5hbWUsIHZhbHVlID0gJy0xJykge1xuXHRcdGxldCBmaWx0ZXJJdGVtcyA9ICdbZGF0YS1uZXZpZ2VuLWZpbHRlci0nICsgbmFtZSArICddJztcblx0XHRpZiAobmFtZSA9PT0gJ2ZyZWUnIHx8IG5hbWUgPT09ICdpbnN0YWxsJykge1xuXHRcdFx0bGV0IGZyZWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJuZXZpZ2VuX3R5cGVfZnJlZVwiXScpO1xuXHRcdFx0bGV0IGluc3RhbGxJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJuZXZpZ2VuX2hpZGVfaW5zdGFsbFwiXScpO1xuXHRcdFx0aWYgKG5hbWUgPT09ICdmcmVlJyAmJiBmcmVlSW5wdXQpIHtcblx0XHRcdFx0aWYgKGZyZWVJbnB1dC5jaGVja2VkID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gJy0xJztcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5hY3RpdmVGaWx0ZXJzW25hbWVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuYWN0aXZlRmlsdGVyc1tuYW1lXSA9IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG5hbWUgPT09ICdpbnN0YWxsJyAmJiBpbnN0YWxsSW5wdXQpIHtcblx0XHRcdFx0aWYgKGluc3RhbGxJbnB1dC5jaGVja2VkID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gJy0xJztcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5hY3RpdmVGaWx0ZXJzW25hbWVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuYWN0aXZlRmlsdGVyc1tuYW1lXSA9IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmFtZSAhPT0gJ2luc3RhbGwnICYmIHRoaXMuYWN0aXZlRmlsdGVyc1snaW5zdGFsbCddKSB7XG5cdFx0XHRcdGZpbHRlckl0ZW1zICs9ICdbZGF0YS1uZXZpZ2VuLWZpbHRlci1pbnN0YWxsPVwiMFwiXSc7XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZSAhPT0gJ2ZyZWUnICYmIHRoaXMuYWN0aXZlRmlsdGVyc1snZnJlZSddKSB7XG5cdFx0XHRcdGZpbHRlckl0ZW1zICs9ICdbZGF0YS1uZXZpZ2VuLWZpbHRlci1mcmVlPVwiMVwiXSc7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNuZXZpZ2VuTGlzdCAnICsgZmlsdGVySXRlbXMpO1xuXHRcdFx0aWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gJy0xJykge1xuXHRcdFx0XHRcdFx0aXRlbS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldCBpdGVtVmFsdWUgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1uZXZpZ2VuLWZpbHRlci0nICsgbmFtZSk7XG5cdFx0XHRcdFx0XHRpZiAoaXRlbVZhbHVlID09PSB2YWx1ZS50b1N0cmluZygpKSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblxuXHR9XG5cblx0cnVuU2VhcmNoKGV2ZW50KSB7XG5cdFx0Y29uc29sZS5sb2coZXZlbnQua2V5KTtcblx0XHRpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5saXN0RXh0ZW5zaW9ucyh0cnVlKTtcblx0XHR9XG5cdH1cblxuXHRyZXNldEFsbEZpbHRlcnMoKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2FkbWluaXN0cmF0b3IvaW5kZXgucGhwP29wdGlvbj1jb21faW5zdGFsbGVyJnZpZXc9aW5zdGFsbCc7XG5cdH1cblxuXHRnZXRQYXJhbUJ5VXJsKG5hbWUgPSAnbmV2aWdlbl9zZWFyY2gnLCByZW1vdmUgPSBmYWxzZSkge1xuXHRcdGxldCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRpZiAodXJsLmluY2x1ZGVzKCcmJyArIG5hbWUgKyAnPScpKSB7XG5cdFx0XHR1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuXHRcdFx0aWYgKHJlbW92ZSkge1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLmRlbGV0ZSgnbmV2aWdlbl9zZWFyY2gnKTtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCAnJywgdXJsKTtcblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHVybC5zZWFyY2gpO1xuXHRcdFx0XHRyZXR1cm4gc2VhcmNoUGFyYW1zLmdldChuYW1lKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0c2hvd1RvYXN0KG1lc3NhZ2UsIHR5cGUgPSAnbm90aWNlJykge1xuXHRcdGxldCB0b2FzdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2FzdC1jb250YWluZXInKTtcblx0XHRpZiAobWVzc2FnZSA9PT0gZmFsc2UpIHtcblx0XHRcdGlmICh0b2FzdENvbnRhaW5lcikge1xuXHRcdFx0XHR0b2FzdENvbnRhaW5lci5yZW1vdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIXRvYXN0Q29udGFpbmVyKSB7XG5cdFx0XHR0b2FzdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0dG9hc3RDb250YWluZXIuaWQgPSAndG9hc3QtY29udGFpbmVyJztcblx0XHRcdHRvYXN0Q29udGFpbmVyLmNsYXNzTmFtZSA9ICd0b2FzdC1jb250YWluZXIgcG9zaXRpb24tZml4ZWQgYm90dG9tLTAgZW5kLTAgcC0zJztcblx0XHRcdHRvYXN0Q29udGFpbmVyLnN0eWxlLnpJbmRleCA9IDExO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b2FzdENvbnRhaW5lcik7XG5cdFx0fVxuXG5cdFx0bGV0IHRvYXN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0XHRcdGNsYXNzTm90aWZpZWQgPSAodHlwZSA9PT0gJ2Vycm9yJykgPyAnIHRleHQtZGFuZ2VyJyA6ICcgdGV4dC1pbmZvJztcblx0XHR0b2FzdEVsLmNsYXNzTmFtZSA9ICd0b2FzdCBhbGlnbi1pdGVtcy1jZW50ZXIgYm9yZGVyLTAgbWItMyc7XG5cdFx0dG9hc3RFbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYWxlcnQnKTtcblx0XHR0b2FzdEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ2Fzc2VydGl2ZScpO1xuXHRcdHRvYXN0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWF0b21pYycsICd0cnVlJyk7XG5cblx0XHRsZXQgdG9hc3RIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR0b2FzdEhlYWRlci5jbGFzc05hbWUgPSAndG9hc3QtaGVhZGVyJyArIGNsYXNzTm90aWZpZWQ7XG5cdFx0dG9hc3RFbC5hcHBlbmRDaGlsZCh0b2FzdEhlYWRlcik7XG5cblx0XHRsZXQgc3Ryb25nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3Ryb25nJyk7XG5cdFx0c3Ryb25nLmNsYXNzTmFtZSA9ICdtZS1hdXRvJztcblx0XHRzdHJvbmcuaW5uZXJUZXh0ID0gSm9vbWxhLlRleHQuXyh0eXBlKTtcblx0XHR0b2FzdEhlYWRlci5hcHBlbmRDaGlsZChzdHJvbmcpO1xuXG5cdFx0bGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdGJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG5cdFx0YnV0dG9uLmNsYXNzTmFtZSA9ICdidG4tY2xvc2UnO1xuXHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtYnMtZGlzbWlzcycsICd0b2FzdCcpO1xuXHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2xvc2UnKTtcblx0XHR0b2FzdEhlYWRlci5hcHBlbmRDaGlsZChidXR0b24pO1xuXG5cdFx0bGV0IHRvYXN0Qm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHRvYXN0Qm9keS5jbGFzc05hbWUgPSAodHlwZSA9PT0gJ2Vycm9yJykgPyAndG9hc3QtYm9keSB0ZXh0LWJnLWRhbmdlcicgOiAndG9hc3QtYm9keSc7XG5cdFx0dG9hc3RCb2R5LmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cdFx0dG9hc3RFbC5hcHBlbmRDaGlsZCh0b2FzdEJvZHkpO1xuXG5cdFx0dG9hc3RDb250YWluZXIuYXBwZW5kQ2hpbGQodG9hc3RFbCk7XG5cblxuXHRcdGxldCB0b2FzdCA9IG5ldyBib290c3RyYXAuVG9hc3QodG9hc3RFbCwge2RlbGF5OiAxMDAwMH0pO1xuXHRcdHRvYXN0LnNob3coKTtcblxuXHRcdHRvYXN0RWwuYWRkRXZlbnRMaXN0ZW5lcignaGlkZGVuLmJzLnRvYXN0JywgKCkgPT4ge1xuXHRcdFx0dG9hc3RFbC5yZW1vdmUoKTtcblx0XHR9KTtcblx0fVxuXG5cdHNlbmRBamF4KGZvcm1EYXRhKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRmb3JtRGF0YS5zZXQodGhpcy5jc3JmLCAxKTtcblx0XHRcdEpvb21sYS5yZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiB0aGlzLmNvbnRyb2xsZXIsXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhOiBmb3JtRGF0YSxcblx0XHRcdFx0b25TdWNjZXNzOiByZXNwID0+IHtcblx0XHRcdFx0XHRsZXQgcmVzcG9uc2U7XG5cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3ApO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBKU09OJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHR9KTtcblx0XHR9KVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5ldmlnZW5JbnN0YWxsZXI7XG5cbndpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyQ2xhc3MgPSBudWxsO1xuXG53aW5kb3cuTmV2aWdlbkluc3RhbGxlciA9ICgpID0+IHtcblx0aWYgKHdpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyQ2xhc3MgPT09IG51bGwpIHtcblx0XHR3aW5kb3cuTmV2aWdlbkluc3RhbGxlckNsYXNzID0gbmV3IE5ldmlnZW5JbnN0YWxsZXIoKTtcblx0fVxuXHRyZXR1cm4gd2luZG93Lk5ldmlnZW5JbnN0YWxsZXJDbGFzcztcbn07XG5cbmN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKCdqb29tbGEtdGFiJykudGhlbigoKSA9PiB7XG5cdGxldCBpbnN0YWxsZXJUYWJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215VGFiJyksXG5cdFx0bGluayA9IGluc3RhbGxlclRhYnMucXVlcnlTZWxlY3RvcignYnV0dG9uW2FyaWEtY29udHJvbHM9bmV2aWdlbl0nKTtcblx0aWYgKChsaW5rLmhhc0F0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpXG5cdFx0XHQmJiBsaW5rLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScpXG5cdFx0fHwgKGxpbmsuaGFzQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJylcblx0XHRcdCYmIGxpbmsuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykpIHtcblx0XHR3aW5kb3cuTmV2aWdlbkluc3RhbGxlcigpLmluaXRpYWxpc2UoKTtcblx0fVxuXG5cdGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignam9vbWxhLnRhYi5zaG93bicsICgpID0+IHtcblx0XHRsZXQgcGFyYW0gPSB3aW5kb3cuTmV2aWdlbkluc3RhbGxlcigpLmdldFBhcmFtQnlVcmwoKTtcblx0XHR3aW5kb3cuTmV2aWdlbkluc3RhbGxlcigpLmluaXRpYWxpc2UocGFyYW0pO1xuXHR9KTtcbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRsZXQgcGFyYW0gPSB3aW5kb3cuTmV2aWdlbkluc3RhbGxlcigpLmdldFBhcmFtQnlVcmwoKTtcblx0aWYgKHBhcmFtKSB7XG5cdFx0bGV0IGluc3RhbGxlclRhYnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlUYWInKSxcblx0XHRcdGxpbmsgPSBpbnN0YWxsZXJUYWJzLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblthcmlhLWNvbnRyb2xzPW5ldmlnZW5dJyk7XG5cdFx0aWYgKChsaW5rLmhhc0F0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpXG5cdFx0XHRcdCYmIGxpbmsuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgIT09ICd0cnVlJylcblx0XHRcdHx8IChsaW5rLmhhc0F0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpXG5cdFx0XHRcdCYmIGxpbmsuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgIT09ICd0cnVlJykpIHtcblx0XHRcdGxpbmsuY2xpY2soKTtcblx0XHR9XG5cdH1cbn0pO1xuIl0sIm5hbWVzIjpbIkpvb21sYSIsIkVycm9yIiwiTmV2aWdlbkluc3RhbGxlciIsIl9jbGFzc0NhbGxDaGVjayIsIm9wdGlvbnMiLCJnZXRPcHRpb25zIiwiY29udHJvbGxlciIsImNzcmYiLCJhY3RpdmVGaWx0ZXJzIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJpbml0aWFsaXNlIiwic2hvd1RvYXN0IiwibGlzdEV4dGVuc2lvbnMiLCJsb2FkQWN0aW9ucyIsIl90aGlzIiwiZmlsdGVyTG9hZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJzZXQiLCJuZXZpZ2VuTGlzdCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImZpbHRlcnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImZpbHRlciIsImdldEF0dHJpYnV0ZSIsIm5ldmlnZW5fc2VhcmNoIiwiZ2V0UGFyYW1CeVVybCIsInNlbmRBamF4IiwidGhlbiIsInJlc3BvbnNlIiwiZGF0YSIsInN1Y2Nlc3MiLCJpbm5lckhUTUwiLCJtZXNzYWdlIiwiZXJyb3IiLCJjb25zb2xlIiwiX3RoaXMyIiwiYnV0dG9ucyIsImJ1dHRvbnNVcGRhdGVzIiwiYnV0dG9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZUVsZW1lbnQiLCJleHRlbnNpb24iLCJmcmVlIiwiY2xvc2VzdCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwicmVtb3ZlIiwic3R5bGUiLCJkaXNwbGF5IiwidHlwZSIsInNldEhpZGVGaWx0ZXIiLCJuYW1lIiwiZmlsdGVySXRlbXMiLCJmcmVlSW5wdXQiLCJpbnN0YWxsSW5wdXQiLCJjaGVja2VkIiwiaXRlbXMiLCJpdGVtIiwiaXRlbVZhbHVlIiwidG9TdHJpbmciLCJydW5TZWFyY2giLCJldmVudCIsImxvZyIsInJlc2V0QWxsRmlsdGVycyIsImhyZWYiLCJ1cmwiLCJpbmNsdWRlcyIsIlVSTCIsInNlYXJjaFBhcmFtcyIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJVUkxTZWFyY2hQYXJhbXMiLCJzZWFyY2giLCJnZXQiLCJ0b2FzdENvbnRhaW5lciIsImlkIiwiY2xhc3NOYW1lIiwiekluZGV4IiwidG9hc3RFbCIsImNsYXNzTm90aWZpZWQiLCJzZXRBdHRyaWJ1dGUiLCJ0b2FzdEhlYWRlciIsInN0cm9uZyIsImlubmVyVGV4dCIsIlRleHQiLCJfIiwidG9hc3RCb2R5IiwidG9hc3QiLCJib290c3RyYXAiLCJUb2FzdCIsImRlbGF5Iiwic2hvdyIsIl90aGlzMyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVxdWVzdCIsIm1ldGhvZCIsIm9uU3VjY2VzcyIsInJlc3AiLCJKU09OIiwicGFyc2UiLCJOZXZpZ2VuSW5zdGFsbGVyQ2xhc3MiLCJjdXN0b21FbGVtZW50cyIsIndoZW5EZWZpbmVkIiwiaW5zdGFsbGVyVGFicyIsImdldEVsZW1lbnRCeUlkIiwibGluayIsImhhc0F0dHJpYnV0ZSIsInBhcmFtIiwiY2xpY2siXSwic291cmNlUm9vdCI6IiJ9