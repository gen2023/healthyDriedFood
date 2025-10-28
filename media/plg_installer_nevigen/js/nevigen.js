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
 * @version    2.3.0
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
      toastBody.className = 'toast-body';
      toastBody.innerHTML = message;
      toastEl.appendChild(toastBody);
      toastContainer.appendChild(toastEl);
      var toast = new bootstrap.Toast(toastEl, {
        delay: 7000
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQztJQUNwRSxJQUFLNkYsSUFBSSxDQUFDQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQ2xDRCxJQUFJLENBQUN4RixZQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssTUFBTSxJQUM3Q3dGLElBQUksQ0FBQ0MsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUNsQ0QsSUFBSSxDQUFDeEYsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLE1BQU8sRUFBRTtNQUNwRHdGLElBQUksQ0FBQ0csS0FBSyxDQUFDLENBQUM7SUFDYjtFQUNEO0FBQ0QsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wbGdfaW5zdGFsbGVyX25ldmlnZW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGxnX2luc3RhbGxlcl9uZXZpZ2VuL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wbGdfaW5zdGFsbGVyX25ldmlnZW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wbGdfaW5zdGFsbGVyX25ldmlnZW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wbGdfaW5zdGFsbGVyX25ldmlnZW4vLi9wbGdfaW5zdGFsbGVyX25ldmlnZW4vZXM2L25ldmlnZW4uZXM2Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLypcbiAqIEBwYWNrYWdlICAgIE5ldmlnZW4gSW5zdGFsbGVyIFBsdWdpblxuICogQHZlcnNpb24gICAgMi4zLjBcbiAqIEBhdXRob3IgICAgIE5ldmlnZW4uY29tIC0gaHR0cHM6Ly9uZXZpZ2VuLmNvbVxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IMKpIE5ldmlnZW4uY29tLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogQGxpY2Vuc2UgICAgUHJvcHJpZXRhcnkuIENvcHlyaWdodGVkIENvbW1lcmNpYWwgU29mdHdhcmVcbiAqIEBsaW5rICAgICAgIGh0dHBzOi8vbmV2aWdlbi5jb21cbiAqL1xuXG5pZiAoIUpvb21sYSkge1xuXHR0aHJvdyBuZXcgRXJyb3IoJ0pvb21sYSBBUEkgaXMgbm90IHByb3Blcmx5IGluaXRpYWxpc2VkJyk7XG59XG5cbmNsYXNzIE5ldmlnZW5JbnN0YWxsZXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLm9wdGlvbnMgPSBKb29tbGEuZ2V0T3B0aW9ucygncGxnX2luc3RhbGxlcl9uZXZpZ2VuJyk7XG5cdFx0dGhpcy5jb250cm9sbGVyID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5jb250cm9sbGVyID8gdGhpcy5vcHRpb25zLmNvbnRyb2xsZXIgOiBmYWxzZTtcblx0XHR0aGlzLmNzcmYgPSBKb29tbGEuZ2V0T3B0aW9ucygnY3NyZi50b2tlbicpO1xuXHRcdHRoaXMuYWN0aXZlRmlsdGVycyA9IFtdO1xuXHR9XG5cblx0aW5pdGlhbGlzZSgpIHtcblx0XHR0aGlzLnNob3dUb2FzdChmYWxzZSk7XG5cdFx0dGhpcy5saXN0RXh0ZW5zaW9ucygpO1xuXHRcdHRoaXMubG9hZEFjdGlvbnMoKTtcblx0fVxuXG5cdGxpc3RFeHRlbnNpb25zKGZpbHRlckxvYWQgPSBmYWxzZSkge1xuXHRcdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG5cdFx0Zm9ybURhdGEuc2V0KCdhY3Rpb24nLCAnZ2V0TGlzdEV4dGVuc2lvbnMnKTtcblx0XHRsZXQgbmV2aWdlbkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV2aWdlbkxpc3QnKTtcblx0XHRpZiAoIW5ldmlnZW5MaXN0KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGZpbHRlckxvYWQpIHtcblx0XHRcdGxldCBmaWx0ZXJzID0gbmV2aWdlbkxpc3QucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZSo9XCJmaWx0ZXJcIl0nKTtcblx0XHRcdGlmIChmaWx0ZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0ZmlsdGVycy5mb3JFYWNoKChmaWx0ZXIpID0+IHtcblx0XHRcdFx0XHRpZiAoZmlsdGVyLnZhbHVlKSB7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5zZXQoZmlsdGVyLmdldEF0dHJpYnV0ZSgnbmFtZScpLCBmaWx0ZXIudmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBuZXZpZ2VuX3NlYXJjaCA9IHRoaXMuZ2V0UGFyYW1CeVVybCgpO1xuXHRcdGlmIChuZXZpZ2VuX3NlYXJjaCl7XG5cdFx0XHRmb3JtRGF0YS5zZXQoJ2ZpbHRlcltzZWFyY2hdJyxuZXZpZ2VuX3NlYXJjaCk7XG5cdFx0fVxuXHRcdHRoaXMuc2VuZEFqYXgoZm9ybURhdGEpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYgKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGxldCBkYXRhID0gKHJlc3BvbnNlLnN1Y2Nlc3MpID8gcmVzcG9uc2UuZGF0YSA6IGZhbHNlXG5cdFx0XHRcdG5ldmlnZW5MaXN0LmlubmVySFRNTCA9IChkYXRhKSA/IGRhdGEgOiByZXNwb25zZS5tZXNzYWdlO1xuXG5cdFx0XHRcdGlmIChyZXNwb25zZS5zdWNjZXNzID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aWYgKG5ldmlnZW5fc2VhcmNoKXtcblx0XHRcdFx0XHRcdHRoaXMuZ2V0UGFyYW1CeVVybCgnbmV2aWdlbl9zZWFyY2gnLHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmxvYWRBY3Rpb25zKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHR9KTtcblx0fVxuXG5cdGxvYWRBY3Rpb25zKCkge1xuXHRcdGxldCBuZXZpZ2VuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXZpZ2VuTGlzdCcpLFxuXHRcdFx0YnV0dG9ucyA9IG5ldmlnZW5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWV4dGVuc2lvbl0nKSxcblx0XHRcdGJ1dHRvbnNVcGRhdGVzID0gbmV2aWdlbkxpc3QucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZXh0ZW5zaW9uLXVwZGF0ZV0nKTtcblx0XHRpZiAoYnV0dG9ucy5sZW5ndGggPiAwKSB7XG5cdFx0XHRidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2pvb21sYS1jb3JlLWxvYWRlcicpKTtcblx0XHRcdFx0XHRsZXQgZXh0ZW5zaW9uID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1leHRlbnNpb24nKSxcblx0XHRcdFx0XHRcdGZyZWUgPSBidXR0b24uY2xvc2VzdCgnW2RhdGEtbmV2aWdlbi1maWx0ZXItZnJlZV0nKTtcblx0XHRcdFx0XHRpZiAoZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdFx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgnYWN0aW9uJywgJ2luc3RhbGxFeHRlbnNpb24nKTtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgnZXh0ZW5zaW9uJywgZXh0ZW5zaW9uKTtcblx0XHRcdFx0XHRcdGlmIChmcmVlICYmIGZyZWUuZ2V0QXR0cmlidXRlKCdkYXRhLW5ldmlnZW4tZmlsdGVyLWZyZWUnKSA9PT0gJzEnKSB7XG5cdFx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgnZnJlZScsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5zZW5kQWpheChmb3JtRGF0YSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdWNjZXNzKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2pvb21sYS1jb3JlLWxvYWRlcicpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2hvd1RvYXN0KHJlc3BvbnNlLm1lc3NhZ2UsICdlcnJvcicpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0aWYgKGJ1dHRvbnNVcGRhdGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGJ1dHRvbnNVcGRhdGVzLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2pvb21sYS1jb3JlLWxvYWRlcicpKTtcblx0XHRcdFx0XHRsZXQgZXh0ZW5zaW9uID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1leHRlbnNpb24tdXBkYXRlJyksXG5cdFx0XHRcdFx0XHR0eXBlID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJyk7XG5cdFx0XHRcdFx0aWYgKGV4dGVuc2lvbikge1xuXHRcdFx0XHRcdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5zZXQoJ2FjdGlvbicsICd1cGRhdGVFeHRlbnNpb24nKTtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgnZXh0ZW5zaW9uJywgZXh0ZW5zaW9uKTtcblx0XHRcdFx0XHRcdGZvcm1EYXRhLnNldCgndHlwZScsIHR5cGUpO1xuXHRcdFx0XHRcdFx0dGhpcy5zZW5kQWpheChmb3JtRGF0YSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdWNjZXNzKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2pvb21sYS1jb3JlLWxvYWRlcicpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2hvd1RvYXN0KHJlc3BvbnNlLm1lc3NhZ2UsICdlcnJvcicpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRzZXRIaWRlRmlsdGVyKG5hbWUsIHZhbHVlID0gJy0xJykge1xuXHRcdGxldCBmaWx0ZXJJdGVtcyA9ICdbZGF0YS1uZXZpZ2VuLWZpbHRlci0nICsgbmFtZSArICddJztcblx0XHRpZiAobmFtZSA9PT0gJ2ZyZWUnIHx8IG5hbWUgPT09ICdpbnN0YWxsJykge1xuXHRcdFx0bGV0IGZyZWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJuZXZpZ2VuX3R5cGVfZnJlZVwiXScpO1xuXHRcdFx0bGV0IGluc3RhbGxJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJuZXZpZ2VuX2hpZGVfaW5zdGFsbFwiXScpO1xuXHRcdFx0aWYgKG5hbWUgPT09ICdmcmVlJyAmJiBmcmVlSW5wdXQpIHtcblx0XHRcdFx0aWYgKGZyZWVJbnB1dC5jaGVja2VkID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gJy0xJztcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5hY3RpdmVGaWx0ZXJzW25hbWVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuYWN0aXZlRmlsdGVyc1tuYW1lXSA9IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG5hbWUgPT09ICdpbnN0YWxsJyAmJiBpbnN0YWxsSW5wdXQpIHtcblx0XHRcdFx0aWYgKGluc3RhbGxJbnB1dC5jaGVja2VkID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gJy0xJztcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5hY3RpdmVGaWx0ZXJzW25hbWVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuYWN0aXZlRmlsdGVyc1tuYW1lXSA9IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmFtZSAhPT0gJ2luc3RhbGwnICYmIHRoaXMuYWN0aXZlRmlsdGVyc1snaW5zdGFsbCddKSB7XG5cdFx0XHRcdGZpbHRlckl0ZW1zICs9ICdbZGF0YS1uZXZpZ2VuLWZpbHRlci1pbnN0YWxsPVwiMFwiXSc7XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZSAhPT0gJ2ZyZWUnICYmIHRoaXMuYWN0aXZlRmlsdGVyc1snZnJlZSddKSB7XG5cdFx0XHRcdGZpbHRlckl0ZW1zICs9ICdbZGF0YS1uZXZpZ2VuLWZpbHRlci1mcmVlPVwiMVwiXSc7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNuZXZpZ2VuTGlzdCAnICsgZmlsdGVySXRlbXMpO1xuXHRcdFx0aWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gJy0xJykge1xuXHRcdFx0XHRcdFx0aXRlbS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldCBpdGVtVmFsdWUgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1uZXZpZ2VuLWZpbHRlci0nICsgbmFtZSk7XG5cdFx0XHRcdFx0XHRpZiAoaXRlbVZhbHVlID09PSB2YWx1ZS50b1N0cmluZygpKSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblxuXHR9XG5cblx0cnVuU2VhcmNoKGV2ZW50KSB7XG5cdFx0Y29uc29sZS5sb2coZXZlbnQua2V5KTtcblx0XHRpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5saXN0RXh0ZW5zaW9ucyh0cnVlKTtcblx0XHR9XG5cdH1cblxuXHRyZXNldEFsbEZpbHRlcnMoKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2FkbWluaXN0cmF0b3IvaW5kZXgucGhwP29wdGlvbj1jb21faW5zdGFsbGVyJnZpZXc9aW5zdGFsbCc7XG5cdH1cblxuXHRnZXRQYXJhbUJ5VXJsKG5hbWUgPSAnbmV2aWdlbl9zZWFyY2gnLHJlbW92ZSA9IGZhbHNlKSB7XG5cdFx0bGV0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdGlmICh1cmwuaW5jbHVkZXMoJyYnICsgbmFtZSArICc9JykpIHtcblx0XHRcdHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG5cdFx0XHRpZiAocmVtb3ZlKXtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5kZWxldGUoJ25ldmlnZW5fc2VhcmNoJyk7XG5cdFx0XHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgJycsIHVybCk7XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGV0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXModXJsLnNlYXJjaCk7XG5cdFx0XHRcdHJldHVybiBzZWFyY2hQYXJhbXMuZ2V0KG5hbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRzaG93VG9hc3QobWVzc2FnZSwgdHlwZSA9ICdub3RpY2UnKSB7XG5cdFx0bGV0IHRvYXN0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RvYXN0LWNvbnRhaW5lcicpO1xuXHRcdGlmIChtZXNzYWdlID09PSBmYWxzZSkge1xuXHRcdFx0aWYgKHRvYXN0Q29udGFpbmVyKSB7XG5cdFx0XHRcdHRvYXN0Q29udGFpbmVyLnJlbW92ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICghdG9hc3RDb250YWluZXIpIHtcblx0XHRcdHRvYXN0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHR0b2FzdENvbnRhaW5lci5pZCA9ICd0b2FzdC1jb250YWluZXInO1xuXHRcdFx0dG9hc3RDb250YWluZXIuY2xhc3NOYW1lID0gJ3RvYXN0LWNvbnRhaW5lciBwb3NpdGlvbi1maXhlZCBib3R0b20tMCBlbmQtMCBwLTMnO1xuXHRcdFx0dG9hc3RDb250YWluZXIuc3R5bGUuekluZGV4ID0gMTE7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvYXN0Q29udGFpbmVyKTtcblx0XHR9XG5cblx0XHRsZXQgdG9hc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdFx0Y2xhc3NOb3RpZmllZCA9ICh0eXBlID09PSAnZXJyb3InKSA/ICcgdGV4dC1kYW5nZXInIDogJyB0ZXh0LWluZm8nO1xuXHRcdHRvYXN0RWwuY2xhc3NOYW1lID0gJ3RvYXN0IGFsaWduLWl0ZW1zLWNlbnRlciBib3JkZXItMCBtYi0zJztcblx0XHR0b2FzdEVsLnNldEF0dHJpYnV0ZSgncm9sZScsICdhbGVydCcpO1xuXHRcdHRvYXN0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XG5cdFx0dG9hc3RFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJywgJ3RydWUnKTtcblxuXHRcdGxldCB0b2FzdEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHRvYXN0SGVhZGVyLmNsYXNzTmFtZSA9ICd0b2FzdC1oZWFkZXInICsgY2xhc3NOb3RpZmllZDtcblx0XHR0b2FzdEVsLmFwcGVuZENoaWxkKHRvYXN0SGVhZGVyKTtcblxuXHRcdGxldCBzdHJvbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHJvbmcnKTtcblx0XHRzdHJvbmcuY2xhc3NOYW1lID0gJ21lLWF1dG8nO1xuXHRcdHN0cm9uZy5pbm5lclRleHQgPSBKb29tbGEuVGV4dC5fKHR5cGUpO1xuXHRcdHRvYXN0SGVhZGVyLmFwcGVuZENoaWxkKHN0cm9uZyk7XG5cblx0XHRsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0YnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcblx0XHRidXR0b24uY2xhc3NOYW1lID0gJ2J0bi1jbG9zZSc7XG5cdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1icy1kaXNtaXNzJywgJ3RvYXN0Jyk7XG5cdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDbG9zZScpO1xuXHRcdHRvYXN0SGVhZGVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cblx0XHRsZXQgdG9hc3RCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dG9hc3RCb2R5LmNsYXNzTmFtZSA9ICd0b2FzdC1ib2R5Jztcblx0XHR0b2FzdEJvZHkuaW5uZXJIVE1MID0gbWVzc2FnZTtcblx0XHR0b2FzdEVsLmFwcGVuZENoaWxkKHRvYXN0Qm9keSk7XG5cblx0XHR0b2FzdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0b2FzdEVsKTtcblxuXHRcdGxldCB0b2FzdCA9IG5ldyBib290c3RyYXAuVG9hc3QodG9hc3RFbCwge2RlbGF5OiA3MDAwfSk7XG5cdFx0dG9hc3Quc2hvdygpO1xuXG5cdFx0dG9hc3RFbC5hZGRFdmVudExpc3RlbmVyKCdoaWRkZW4uYnMudG9hc3QnLCAoKSA9PiB7XG5cdFx0XHR0b2FzdEVsLnJlbW92ZSgpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2VuZEFqYXgoZm9ybURhdGEpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZvcm1EYXRhLnNldCh0aGlzLmNzcmYsIDEpO1xuXHRcdFx0Sm9vbWxhLnJlcXVlc3Qoe1xuXHRcdFx0XHR1cmw6IHRoaXMuY29udHJvbGxlcixcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0XHRvblN1Y2Nlc3M6IHJlc3AgPT4ge1xuXHRcdFx0XHRcdGxldCByZXNwb25zZTtcblxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcCk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHBhcnNlIEpTT04nKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXHRcdH0pXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTmV2aWdlbkluc3RhbGxlcjtcblxud2luZG93Lk5ldmlnZW5JbnN0YWxsZXJDbGFzcyA9IG51bGw7XG5cbndpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyID0gKCkgPT4ge1xuXHRpZiAod2luZG93Lk5ldmlnZW5JbnN0YWxsZXJDbGFzcyA9PT0gbnVsbCkge1xuXHRcdHdpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyQ2xhc3MgPSBuZXcgTmV2aWdlbkluc3RhbGxlcigpO1xuXHR9XG5cdHJldHVybiB3aW5kb3cuTmV2aWdlbkluc3RhbGxlckNsYXNzO1xufTtcblxuY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoJ2pvb21sYS10YWInKS50aGVuKCgpID0+IHtcblx0bGV0IGluc3RhbGxlclRhYnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlUYWInKSxcblx0XHRsaW5rID0gaW5zdGFsbGVyVGFicy5xdWVyeVNlbGVjdG9yKCdidXR0b25bYXJpYS1jb250cm9scz1uZXZpZ2VuXScpO1xuXHRpZiAoKGxpbmsuaGFzQXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJylcblx0XHRcdCYmIGxpbmsuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJylcblx0XHR8fCAobGluay5oYXNBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKVxuXHRcdFx0JiYgbGluay5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSkge1xuXHRcdHdpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyKCkuaW5pdGlhbGlzZSgpO1xuXHR9XG5cblx0bGluay5hZGRFdmVudExpc3RlbmVyKCdqb29tbGEudGFiLnNob3duJywgKCkgPT4ge1xuXHRcdGxldCBwYXJhbSA9IHdpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyKCkuZ2V0UGFyYW1CeVVybCgpO1xuXHRcdHdpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyKCkuaW5pdGlhbGlzZShwYXJhbSk7XG5cdH0pO1xufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdGxldCBwYXJhbSA9IHdpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyKCkuZ2V0UGFyYW1CeVVybCgpO1xuXHRpZiAocGFyYW0pIHtcblx0XHRsZXQgaW5zdGFsbGVyVGFicyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteVRhYicpLFxuXHRcdFx0bGluayA9IGluc3RhbGxlclRhYnMucXVlcnlTZWxlY3RvcignYnV0dG9uW2FyaWEtY29udHJvbHM9bmV2aWdlbl0nKTtcblx0XHRpZiAoKGxpbmsuaGFzQXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJylcblx0XHRcdFx0JiYgbGluay5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSAhPT0gJ3RydWUnKVxuXHRcdFx0fHwgKGxpbmsuaGFzQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJylcblx0XHRcdFx0JiYgbGluay5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSAhPT0gJ3RydWUnKSkge1xuXHRcdFx0bGluay5jbGljaygpO1xuXHRcdH1cblx0fVxufSk7XG5cbiJdLCJuYW1lcyI6WyJKb29tbGEiLCJFcnJvciIsIk5ldmlnZW5JbnN0YWxsZXIiLCJfY2xhc3NDYWxsQ2hlY2siLCJvcHRpb25zIiwiZ2V0T3B0aW9ucyIsImNvbnRyb2xsZXIiLCJjc3JmIiwiYWN0aXZlRmlsdGVycyIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwiaW5pdGlhbGlzZSIsInNob3dUb2FzdCIsImxpc3RFeHRlbnNpb25zIiwibG9hZEFjdGlvbnMiLCJfdGhpcyIsImZpbHRlckxvYWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwic2V0IiwibmV2aWdlbkxpc3QiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJmaWx0ZXJzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJmaWx0ZXIiLCJnZXRBdHRyaWJ1dGUiLCJuZXZpZ2VuX3NlYXJjaCIsImdldFBhcmFtQnlVcmwiLCJzZW5kQWpheCIsInRoZW4iLCJyZXNwb25zZSIsImRhdGEiLCJzdWNjZXNzIiwiaW5uZXJIVE1MIiwibWVzc2FnZSIsImVycm9yIiwiY29uc29sZSIsIl90aGlzMiIsImJ1dHRvbnMiLCJidXR0b25zVXBkYXRlcyIsImJ1dHRvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVFbGVtZW50IiwiZXh0ZW5zaW9uIiwiZnJlZSIsImNsb3Nlc3QiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlbG9hZCIsInJlbW92ZSIsInN0eWxlIiwiZGlzcGxheSIsInR5cGUiLCJzZXRIaWRlRmlsdGVyIiwibmFtZSIsImZpbHRlckl0ZW1zIiwiZnJlZUlucHV0IiwiaW5zdGFsbElucHV0IiwiY2hlY2tlZCIsIml0ZW1zIiwiaXRlbSIsIml0ZW1WYWx1ZSIsInRvU3RyaW5nIiwicnVuU2VhcmNoIiwiZXZlbnQiLCJsb2ciLCJyZXNldEFsbEZpbHRlcnMiLCJocmVmIiwidXJsIiwiaW5jbHVkZXMiLCJVUkwiLCJzZWFyY2hQYXJhbXMiLCJoaXN0b3J5IiwicmVwbGFjZVN0YXRlIiwiVVJMU2VhcmNoUGFyYW1zIiwic2VhcmNoIiwiZ2V0IiwidG9hc3RDb250YWluZXIiLCJpZCIsImNsYXNzTmFtZSIsInpJbmRleCIsInRvYXN0RWwiLCJjbGFzc05vdGlmaWVkIiwic2V0QXR0cmlidXRlIiwidG9hc3RIZWFkZXIiLCJzdHJvbmciLCJpbm5lclRleHQiLCJUZXh0IiwiXyIsInRvYXN0Qm9keSIsInRvYXN0IiwiYm9vdHN0cmFwIiwiVG9hc3QiLCJkZWxheSIsInNob3ciLCJfdGhpczMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlcXVlc3QiLCJtZXRob2QiLCJvblN1Y2Nlc3MiLCJyZXNwIiwiSlNPTiIsInBhcnNlIiwiTmV2aWdlbkluc3RhbGxlckNsYXNzIiwiY3VzdG9tRWxlbWVudHMiLCJ3aGVuRGVmaW5lZCIsImluc3RhbGxlclRhYnMiLCJnZXRFbGVtZW50QnlJZCIsImxpbmsiLCJoYXNBdHRyaWJ1dGUiLCJwYXJhbSIsImNsaWNrIl0sInNvdXJjZVJvb3QiOiIifQ==