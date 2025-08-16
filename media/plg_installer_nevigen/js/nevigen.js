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
 * @version    2.1.1
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
            var extension = button.getAttribute('data-extension-update');
            if (extension) {
              var formData = new FormData();
              formData.set('action', 'updateExtension');
              formData.set('extension', extension);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLENBQUNDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFDbENELElBQUksQ0FBQ3hGLFlBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxNQUFPLEVBQUU7TUFDcER3RixJQUFJLENBQUNHLEtBQUssQ0FBQyxDQUFDO0lBQ2I7RUFDRDtBQUNELENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGxnX2luc3RhbGxlcl9uZXZpZ2VuL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BsZ19pbnN0YWxsZXJfbmV2aWdlbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGxnX2luc3RhbGxlcl9uZXZpZ2VuL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGxnX2luc3RhbGxlcl9uZXZpZ2VuL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGxnX2luc3RhbGxlcl9uZXZpZ2VuLy4vcGxnX2luc3RhbGxlcl9uZXZpZ2VuL2VzNi9uZXZpZ2VuLmVzNiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qXG4gKiBAcGFja2FnZSAgICBOZXZpZ2VuIEluc3RhbGxlciBQbHVnaW5cbiAqIEB2ZXJzaW9uICAgIDIuMS4xXG4gKiBAYXV0aG9yICAgICBOZXZpZ2VuLmNvbSAtIGh0dHBzOi8vbmV2aWdlbi5jb21cbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCDCqSBOZXZpZ2VuLmNvbS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEBsaWNlbnNlICAgIFByb3ByaWV0YXJ5LiBDb3B5cmlnaHRlZCBDb21tZXJjaWFsIFNvZnR3YXJlXG4gKiBAbGluayAgICAgICBodHRwczovL25ldmlnZW4uY29tXG4gKi9cblxuaWYgKCFKb29tbGEpIHtcblx0dGhyb3cgbmV3IEVycm9yKCdKb29tbGEgQVBJIGlzIG5vdCBwcm9wZXJseSBpbml0aWFsaXNlZCcpO1xufVxuXG5jbGFzcyBOZXZpZ2VuSW5zdGFsbGVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5vcHRpb25zID0gSm9vbWxhLmdldE9wdGlvbnMoJ3BsZ19pbnN0YWxsZXJfbmV2aWdlbicpO1xuXHRcdHRoaXMuY29udHJvbGxlciA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY29udHJvbGxlciA/IHRoaXMub3B0aW9ucy5jb250cm9sbGVyIDogZmFsc2U7XG5cdFx0dGhpcy5jc3JmID0gSm9vbWxhLmdldE9wdGlvbnMoJ2NzcmYudG9rZW4nKTtcblx0XHR0aGlzLmFjdGl2ZUZpbHRlcnMgPSBbXTtcblx0fVxuXG5cdGluaXRpYWxpc2UoKSB7XG5cdFx0dGhpcy5zaG93VG9hc3QoZmFsc2UpO1xuXHRcdHRoaXMubGlzdEV4dGVuc2lvbnMoKTtcblx0XHR0aGlzLmxvYWRBY3Rpb25zKCk7XG5cdH1cblxuXHRsaXN0RXh0ZW5zaW9ucyhmaWx0ZXJMb2FkID0gZmFsc2UpIHtcblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuXHRcdGZvcm1EYXRhLnNldCgnYWN0aW9uJywgJ2dldExpc3RFeHRlbnNpb25zJyk7XG5cdFx0bGV0IG5ldmlnZW5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ldmlnZW5MaXN0Jyk7XG5cdFx0aWYgKCFuZXZpZ2VuTGlzdCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChmaWx0ZXJMb2FkKSB7XG5cdFx0XHRsZXQgZmlsdGVycyA9IG5ldmlnZW5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWUqPVwiZmlsdGVyXCJdJyk7XG5cdFx0XHRpZiAoZmlsdGVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGZpbHRlcnMuZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGZpbHRlci52YWx1ZSkge1xuXHRcdFx0XHRcdFx0Zm9ybURhdGEuc2V0KGZpbHRlci5nZXRBdHRyaWJ1dGUoJ25hbWUnKSwgZmlsdGVyLnZhbHVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRsZXQgbmV2aWdlbl9zZWFyY2ggPSB0aGlzLmdldFBhcmFtQnlVcmwoKTtcblx0XHRpZiAobmV2aWdlbl9zZWFyY2gpe1xuXHRcdFx0Zm9ybURhdGEuc2V0KCdmaWx0ZXJbc2VhcmNoXScsbmV2aWdlbl9zZWFyY2gpO1xuXHRcdH1cblx0XHR0aGlzLnNlbmRBamF4KGZvcm1EYXRhKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmIChyZXNwb25zZSkge1xuXHRcdFx0XHRsZXQgZGF0YSA9IChyZXNwb25zZS5zdWNjZXNzKSA/IHJlc3BvbnNlLmRhdGEgOiBmYWxzZVxuXHRcdFx0XHRuZXZpZ2VuTGlzdC5pbm5lckhUTUwgPSAoZGF0YSkgPyBkYXRhIDogcmVzcG9uc2UubWVzc2FnZTtcblxuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3VjY2VzcyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGlmIChuZXZpZ2VuX3NlYXJjaCl7XG5cdFx0XHRcdFx0XHR0aGlzLmdldFBhcmFtQnlVcmwoJ25ldmlnZW5fc2VhcmNoJyx0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5sb2FkQWN0aW9ucygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0fSk7XG5cdH1cblxuXHRsb2FkQWN0aW9ucygpIHtcblx0XHRsZXQgbmV2aWdlbkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV2aWdlbkxpc3QnKSxcblx0XHRcdGJ1dHRvbnMgPSBuZXZpZ2VuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1leHRlbnNpb25dJyksXG5cdFx0XHRidXR0b25zVXBkYXRlcyA9IG5ldmlnZW5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWV4dGVuc2lvbi11cGRhdGVdJyk7XG5cdFx0aWYgKGJ1dHRvbnMubGVuZ3RoID4gMCkge1xuXHRcdFx0YnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcblx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdqb29tbGEtY29yZS1sb2FkZXInKSk7XG5cdFx0XHRcdFx0bGV0IGV4dGVuc2lvbiA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZXh0ZW5zaW9uJyksXG5cdFx0XHRcdFx0XHRmcmVlID0gYnV0dG9uLmNsb3Nlc3QoJ1tkYXRhLW5ldmlnZW4tZmlsdGVyLWZyZWVdJyk7XG5cdFx0XHRcdFx0aWYgKGV4dGVuc2lvbikge1xuXHRcdFx0XHRcdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5zZXQoJ2FjdGlvbicsICdpbnN0YWxsRXh0ZW5zaW9uJyk7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5zZXQoJ2V4dGVuc2lvbicsIGV4dGVuc2lvbik7XG5cdFx0XHRcdFx0XHRpZiAoZnJlZSAmJiBmcmVlLmdldEF0dHJpYnV0ZSgnZGF0YS1uZXZpZ2VuLWZpbHRlci1mcmVlJykgPT09ICcxJykge1xuXHRcdFx0XHRcdFx0XHRmb3JtRGF0YS5zZXQoJ2ZyZWUnLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuc2VuZEFqYXgoZm9ybURhdGEpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2Uuc3VjY2Vzcykge1xuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdqb29tbGEtY29yZS1sb2FkZXInKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNob3dUb2FzdChyZXNwb25zZS5tZXNzYWdlLCAnZXJyb3InKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmIChidXR0b25zVXBkYXRlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRidXR0b25zVXBkYXRlcy5mb3JFYWNoKChidXR0b24pID0+IHtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdqb29tbGEtY29yZS1sb2FkZXInKSk7XG5cdFx0XHRcdFx0bGV0IGV4dGVuc2lvbiA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZXh0ZW5zaW9uLXVwZGF0ZScpO1xuXHRcdFx0XHRcdGlmIChleHRlbnNpb24pIHtcblx0XHRcdFx0XHRcdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdFx0XHRcdFx0Zm9ybURhdGEuc2V0KCdhY3Rpb24nLCAndXBkYXRlRXh0ZW5zaW9uJyk7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5zZXQoJ2V4dGVuc2lvbicsIGV4dGVuc2lvbik7XG5cdFx0XHRcdFx0XHR0aGlzLnNlbmRBamF4KGZvcm1EYXRhKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLnN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignam9vbWxhLWNvcmUtbG9hZGVyJykucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zaG93VG9hc3QocmVzcG9uc2UubWVzc2FnZSwgJ2Vycm9yJylcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHNldEhpZGVGaWx0ZXIobmFtZSwgdmFsdWUgPSAnLTEnKSB7XG5cdFx0bGV0IGZpbHRlckl0ZW1zID0gJ1tkYXRhLW5ldmlnZW4tZmlsdGVyLScgKyBuYW1lICsgJ10nO1xuXHRcdGlmIChuYW1lID09PSAnZnJlZScgfHwgbmFtZSA9PT0gJ2luc3RhbGwnKSB7XG5cdFx0XHRsZXQgZnJlZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cIm5ldmlnZW5fdHlwZV9mcmVlXCJdJyk7XG5cdFx0XHRsZXQgaW5zdGFsbElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cIm5ldmlnZW5faGlkZV9pbnN0YWxsXCJdJyk7XG5cdFx0XHRpZiAobmFtZSA9PT0gJ2ZyZWUnICYmIGZyZWVJbnB1dCkge1xuXHRcdFx0XHRpZiAoZnJlZUlucHV0LmNoZWNrZWQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSAnLTEnO1xuXHRcdFx0XHRcdGRlbGV0ZSB0aGlzLmFjdGl2ZUZpbHRlcnNbbmFtZV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5hY3RpdmVGaWx0ZXJzW25hbWVdID0gdHJ1ZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZSA9PT0gJ2luc3RhbGwnICYmIGluc3RhbGxJbnB1dCkge1xuXHRcdFx0XHRpZiAoaW5zdGFsbElucHV0LmNoZWNrZWQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSAnLTEnO1xuXHRcdFx0XHRcdGRlbGV0ZSB0aGlzLmFjdGl2ZUZpbHRlcnNbbmFtZV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5hY3RpdmVGaWx0ZXJzW25hbWVdID0gdHJ1ZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuYW1lICE9PSAnaW5zdGFsbCcgJiYgdGhpcy5hY3RpdmVGaWx0ZXJzWydpbnN0YWxsJ10pIHtcblx0XHRcdFx0ZmlsdGVySXRlbXMgKz0gJ1tkYXRhLW5ldmlnZW4tZmlsdGVyLWluc3RhbGw9XCIwXCJdJztcblx0XHRcdH1cblx0XHRcdGlmIChuYW1lICE9PSAnZnJlZScgJiYgdGhpcy5hY3RpdmVGaWx0ZXJzWydmcmVlJ10pIHtcblx0XHRcdFx0ZmlsdGVySXRlbXMgKz0gJ1tkYXRhLW5ldmlnZW4tZmlsdGVyLWZyZWU9XCIxXCJdJztcblx0XHRcdH1cblxuXHRcdFx0bGV0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI25ldmlnZW5MaXN0ICcgKyBmaWx0ZXJJdGVtcyk7XG5cdFx0XHRpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSAnLTEnKSB7XG5cdFx0XHRcdFx0XHRpdGVtLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV0IGl0ZW1WYWx1ZSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLW5ldmlnZW4tZmlsdGVyLScgKyBuYW1lKTtcblx0XHRcdFx0XHRcdGlmIChpdGVtVmFsdWUgPT09IHZhbHVlLnRvU3RyaW5nKCkpIHtcblx0XHRcdFx0XHRcdFx0aXRlbS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpdGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXG5cdH1cblxuXHRydW5TZWFyY2goZXZlbnQpIHtcblx0XHRjb25zb2xlLmxvZyhldmVudC5rZXkpO1xuXHRcdGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmxpc3RFeHRlbnNpb25zKHRydWUpO1xuXHRcdH1cblx0fVxuXG5cdHJlc2V0QWxsRmlsdGVycygpIHtcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYWRtaW5pc3RyYXRvci9pbmRleC5waHA/b3B0aW9uPWNvbV9pbnN0YWxsZXImdmlldz1pbnN0YWxsJztcblx0fVxuXG5cdGdldFBhcmFtQnlVcmwobmFtZSA9ICduZXZpZ2VuX3NlYXJjaCcscmVtb3ZlID0gZmFsc2UpIHtcblx0XHRsZXQgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0aWYgKHVybC5pbmNsdWRlcygnJicgKyBuYW1lICsgJz0nKSkge1xuXHRcdFx0dXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cblx0XHRcdGlmIChyZW1vdmUpe1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLmRlbGV0ZSgnbmV2aWdlbl9zZWFyY2gnKTtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCAnJywgdXJsKTtcblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsZXQgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh1cmwuc2VhcmNoKTtcblx0XHRcdFx0cmV0dXJuIHNlYXJjaFBhcmFtcy5nZXQobmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHNob3dUb2FzdChtZXNzYWdlLCB0eXBlID0gJ25vdGljZScpIHtcblx0XHRsZXQgdG9hc3RDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdG9hc3QtY29udGFpbmVyJyk7XG5cdFx0aWYgKG1lc3NhZ2UgPT09IGZhbHNlKSB7XG5cdFx0XHRpZiAodG9hc3RDb250YWluZXIpIHtcblx0XHRcdFx0dG9hc3RDb250YWluZXIucmVtb3ZlKCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCF0b2FzdENvbnRhaW5lcikge1xuXHRcdFx0dG9hc3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdHRvYXN0Q29udGFpbmVyLmlkID0gJ3RvYXN0LWNvbnRhaW5lcic7XG5cdFx0XHR0b2FzdENvbnRhaW5lci5jbGFzc05hbWUgPSAndG9hc3QtY29udGFpbmVyIHBvc2l0aW9uLWZpeGVkIGJvdHRvbS0wIGVuZC0wIHAtMyc7XG5cdFx0XHR0b2FzdENvbnRhaW5lci5zdHlsZS56SW5kZXggPSAxMTtcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9hc3RDb250YWluZXIpO1xuXHRcdH1cblxuXHRcdGxldCB0b2FzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRjbGFzc05vdGlmaWVkID0gKHR5cGUgPT09ICdlcnJvcicpID8gJyB0ZXh0LWRhbmdlcicgOiAnIHRleHQtaW5mbyc7XG5cdFx0dG9hc3RFbC5jbGFzc05hbWUgPSAndG9hc3QgYWxpZ24taXRlbXMtY2VudGVyIGJvcmRlci0wIG1iLTMnO1xuXHRcdHRvYXN0RWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2FsZXJ0Jyk7XG5cdFx0dG9hc3RFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdhc3NlcnRpdmUnKTtcblx0XHR0b2FzdEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1hdG9taWMnLCAndHJ1ZScpO1xuXG5cdFx0bGV0IHRvYXN0SGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dG9hc3RIZWFkZXIuY2xhc3NOYW1lID0gJ3RvYXN0LWhlYWRlcicgKyBjbGFzc05vdGlmaWVkO1xuXHRcdHRvYXN0RWwuYXBwZW5kQ2hpbGQodG9hc3RIZWFkZXIpO1xuXG5cdFx0bGV0IHN0cm9uZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0cm9uZycpO1xuXHRcdHN0cm9uZy5jbGFzc05hbWUgPSAnbWUtYXV0byc7XG5cdFx0c3Ryb25nLmlubmVyVGV4dCA9IEpvb21sYS5UZXh0Ll8odHlwZSk7XG5cdFx0dG9hc3RIZWFkZXIuYXBwZW5kQ2hpbGQoc3Ryb25nKTtcblxuXHRcdGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0XHRidXR0b24udHlwZSA9ICdidXR0b24nO1xuXHRcdGJ1dHRvbi5jbGFzc05hbWUgPSAnYnRuLWNsb3NlJztcblx0XHRidXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLWJzLWRpc21pc3MnLCAndG9hc3QnKTtcblx0XHRidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0Nsb3NlJyk7XG5cdFx0dG9hc3RIZWFkZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuXHRcdGxldCB0b2FzdEJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR0b2FzdEJvZHkuY2xhc3NOYW1lID0gJ3RvYXN0LWJvZHknO1xuXHRcdHRvYXN0Qm9keS5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXHRcdHRvYXN0RWwuYXBwZW5kQ2hpbGQodG9hc3RCb2R5KTtcblxuXHRcdHRvYXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRvYXN0RWwpO1xuXG5cdFx0bGV0IHRvYXN0ID0gbmV3IGJvb3RzdHJhcC5Ub2FzdCh0b2FzdEVsLCB7ZGVsYXk6IDcwMDB9KTtcblx0XHR0b2FzdC5zaG93KCk7XG5cblx0XHR0b2FzdEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2hpZGRlbi5icy50b2FzdCcsICgpID0+IHtcblx0XHRcdHRvYXN0RWwucmVtb3ZlKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRzZW5kQWpheChmb3JtRGF0YSkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0Zm9ybURhdGEuc2V0KHRoaXMuY3NyZiwgMSk7XG5cdFx0XHRKb29tbGEucmVxdWVzdCh7XG5cdFx0XHRcdHVybDogdGhpcy5jb250cm9sbGVyLFxuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRcdG9uU3VjY2VzczogcmVzcCA9PiB7XG5cdFx0XHRcdFx0bGV0IHJlc3BvbnNlO1xuXG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwKTtcblx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gcGFyc2UgSlNPTicpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHR9LFxuXHRcdFx0fSk7XG5cdFx0fSlcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBOZXZpZ2VuSW5zdGFsbGVyO1xuXG53aW5kb3cuTmV2aWdlbkluc3RhbGxlckNsYXNzID0gbnVsbDtcblxud2luZG93Lk5ldmlnZW5JbnN0YWxsZXIgPSAoKSA9PiB7XG5cdGlmICh3aW5kb3cuTmV2aWdlbkluc3RhbGxlckNsYXNzID09PSBudWxsKSB7XG5cdFx0d2luZG93Lk5ldmlnZW5JbnN0YWxsZXJDbGFzcyA9IG5ldyBOZXZpZ2VuSW5zdGFsbGVyKCk7XG5cdH1cblx0cmV0dXJuIHdpbmRvdy5OZXZpZ2VuSW5zdGFsbGVyQ2xhc3M7XG59O1xuXG5jdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCgnam9vbWxhLXRhYicpLnRoZW4oKCkgPT4ge1xuXHRsZXQgaW5zdGFsbGVyVGFicyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteVRhYicpLFxuXHRcdGxpbmsgPSBpbnN0YWxsZXJUYWJzLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblthcmlhLWNvbnRyb2xzPW5ldmlnZW5dJyk7XG5cdGlmICgobGluay5oYXNBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKVxuXHRcdFx0JiYgbGluay5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnKVxuXHRcdHx8IChsaW5rLmhhc0F0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpXG5cdFx0XHQmJiBsaW5rLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpKSB7XG5cdFx0d2luZG93Lk5ldmlnZW5JbnN0YWxsZXIoKS5pbml0aWFsaXNlKCk7XG5cdH1cblxuXHRsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2pvb21sYS50YWIuc2hvd24nLCAoKSA9PiB7XG5cdFx0bGV0IHBhcmFtID0gd2luZG93Lk5ldmlnZW5JbnN0YWxsZXIoKS5nZXRQYXJhbUJ5VXJsKCk7XG5cdFx0d2luZG93Lk5ldmlnZW5JbnN0YWxsZXIoKS5pbml0aWFsaXNlKHBhcmFtKTtcblx0fSk7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0bGV0IHBhcmFtID0gd2luZG93Lk5ldmlnZW5JbnN0YWxsZXIoKS5nZXRQYXJhbUJ5VXJsKCk7XG5cdGlmIChwYXJhbSkge1xuXHRcdGxldCBpbnN0YWxsZXJUYWJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215VGFiJyksXG5cdFx0XHRsaW5rID0gaW5zdGFsbGVyVGFicy5xdWVyeVNlbGVjdG9yKCdidXR0b25bYXJpYS1jb250cm9scz1uZXZpZ2VuXScpO1xuXHRcdGlmICgobGluay5oYXNBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKVxuXHRcdFx0XHQmJiBsaW5rLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpICE9PSAndHJ1ZScpXG5cdFx0XHR8fCAobGluay5oYXNBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKVxuXHRcdFx0XHQmJiBsaW5rLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpICE9PSAndHJ1ZScpKSB7XG5cdFx0XHRsaW5rLmNsaWNrKCk7XG5cdFx0fVxuXHR9XG59KTtcblxuIl0sIm5hbWVzIjpbIkpvb21sYSIsIkVycm9yIiwiTmV2aWdlbkluc3RhbGxlciIsIl9jbGFzc0NhbGxDaGVjayIsIm9wdGlvbnMiLCJnZXRPcHRpb25zIiwiY29udHJvbGxlciIsImNzcmYiLCJhY3RpdmVGaWx0ZXJzIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJpbml0aWFsaXNlIiwic2hvd1RvYXN0IiwibGlzdEV4dGVuc2lvbnMiLCJsb2FkQWN0aW9ucyIsIl90aGlzIiwiZmlsdGVyTG9hZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJzZXQiLCJuZXZpZ2VuTGlzdCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImZpbHRlcnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImZpbHRlciIsImdldEF0dHJpYnV0ZSIsIm5ldmlnZW5fc2VhcmNoIiwiZ2V0UGFyYW1CeVVybCIsInNlbmRBamF4IiwidGhlbiIsInJlc3BvbnNlIiwiZGF0YSIsInN1Y2Nlc3MiLCJpbm5lckhUTUwiLCJtZXNzYWdlIiwiZXJyb3IiLCJjb25zb2xlIiwiX3RoaXMyIiwiYnV0dG9ucyIsImJ1dHRvbnNVcGRhdGVzIiwiYnV0dG9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZUVsZW1lbnQiLCJleHRlbnNpb24iLCJmcmVlIiwiY2xvc2VzdCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwicmVtb3ZlIiwic3R5bGUiLCJkaXNwbGF5Iiwic2V0SGlkZUZpbHRlciIsIm5hbWUiLCJmaWx0ZXJJdGVtcyIsImZyZWVJbnB1dCIsImluc3RhbGxJbnB1dCIsImNoZWNrZWQiLCJpdGVtcyIsIml0ZW0iLCJpdGVtVmFsdWUiLCJ0b1N0cmluZyIsInJ1blNlYXJjaCIsImV2ZW50IiwibG9nIiwicmVzZXRBbGxGaWx0ZXJzIiwiaHJlZiIsInVybCIsImluY2x1ZGVzIiwiVVJMIiwic2VhcmNoUGFyYW1zIiwiaGlzdG9yeSIsInJlcGxhY2VTdGF0ZSIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsImdldCIsInR5cGUiLCJ0b2FzdENvbnRhaW5lciIsImlkIiwiY2xhc3NOYW1lIiwiekluZGV4IiwidG9hc3RFbCIsImNsYXNzTm90aWZpZWQiLCJzZXRBdHRyaWJ1dGUiLCJ0b2FzdEhlYWRlciIsInN0cm9uZyIsImlubmVyVGV4dCIsIlRleHQiLCJfIiwidG9hc3RCb2R5IiwidG9hc3QiLCJib290c3RyYXAiLCJUb2FzdCIsImRlbGF5Iiwic2hvdyIsIl90aGlzMyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVxdWVzdCIsIm1ldGhvZCIsIm9uU3VjY2VzcyIsInJlc3AiLCJKU09OIiwicGFyc2UiLCJOZXZpZ2VuSW5zdGFsbGVyQ2xhc3MiLCJjdXN0b21FbGVtZW50cyIsIndoZW5EZWZpbmVkIiwiaW5zdGFsbGVyVGFicyIsImdldEVsZW1lbnRCeUlkIiwibGluayIsImhhc0F0dHJpYnV0ZSIsInBhcmFtIiwiY2xpY2siXSwic291cmNlUm9vdCI6IiJ9