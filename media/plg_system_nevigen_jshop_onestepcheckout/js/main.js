/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js":
/*!**********************************************************************!*\
  !*** ./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => (/* binding */ _objectWithoutPropertiesLoose)
/* harmony export */ });
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}


/***/ }),

/***/ "./node_modules/imask/esm/controls/html-contenteditable-mask-element.js":
/*!******************************************************************************!*\
  !*** ./node_modules/imask/esm/controls/html-contenteditable-mask-element.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HTMLContenteditableMaskElement)
/* harmony export */ });
/* harmony import */ var _html_mask_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./html-mask-element.js */ "./node_modules/imask/esm/controls/html-mask-element.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _mask_element_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mask-element.js */ "./node_modules/imask/esm/controls/mask-element.js");



class HTMLContenteditableMaskElement extends _html_mask_element_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /**
    Returns HTMLElement selection start
    @override
  */
  get _unsafeSelectionStart() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }

  /**
    Returns HTMLElement selection end
    @override
  */
  get _unsafeSelectionEnd() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }

  /**
    Sets HTMLElement selection
    @override
  */
  _unsafeSelect(start, end) {
    if (!this.rootElement.createRange) return;
    const range = this.rootElement.createRange();
    range.setStart(this.input.firstChild || this.input, start);
    range.setEnd(this.input.lastChild || this.input, end);
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /**
    HTMLElement value
    @override
  */
  get value() {
    // $FlowFixMe
    return this.input.textContent;
  }
  set value(value) {
    this.input.textContent = value;
  }
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;


/***/ }),

/***/ "./node_modules/imask/esm/controls/html-mask-element.js":
/*!**************************************************************!*\
  !*** ./node_modules/imask/esm/controls/html-mask-element.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HTMLMaskElement)
/* harmony export */ });
/* harmony import */ var _mask_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mask-element.js */ "./node_modules/imask/esm/controls/mask-element.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");



/** Bridge between HTMLElement and {@link Masked} */
class HTMLMaskElement extends _mask_element_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /** Mapping between HTMLElement events and mask internal events */

  /** HTMLElement to use mask on */

  /**
    @param {HTMLInputElement|HTMLTextAreaElement} input
  */
  constructor(input) {
    super();
    this.input = input;
    this._handlers = {};
  }

  /** */
  // $FlowFixMe https://github.com/facebook/flow/issues/2839
  get rootElement() {
    var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
    return (_this$input$getRootNo = (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) === null || _this$input$getRootNo2 === void 0 ? void 0 : _this$input$getRootNo2.call(_this$input)) !== null && _this$input$getRootNo !== void 0 ? _this$input$getRootNo : document;
  }

  /**
    Is element in focus
    @readonly
  */
  get isActive() {
    //$FlowFixMe
    return this.input === this.rootElement.activeElement;
  }

  /**
    Returns HTMLElement selection start
    @override
  */
  get _unsafeSelectionStart() {
    return this.input.selectionStart;
  }

  /**
    Returns HTMLElement selection end
    @override
  */
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }

  /**
    Sets HTMLElement selection
    @override
  */
  _unsafeSelect(start, end) {
    this.input.setSelectionRange(start, end);
  }

  /**
    HTMLElement value
    @override
  */
  get value() {
    return this.input.value;
  }
  set value(value) {
    this.input.value = value;
  }

  /**
    Binds HTMLElement events to mask internal events
    @override
  */
  bindEvents(handlers) {
    Object.keys(handlers).forEach(event => this._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]));
  }

  /**
    Unbinds HTMLElement events to mask internal events
    @override
  */
  unbindEvents() {
    Object.keys(this._handlers).forEach(event => this._toggleEventHandler(event));
  }

  /** */
  _toggleEventHandler(event, handler) {
    if (this._handlers[event]) {
      this.input.removeEventListener(event, this._handlers[event]);
      delete this._handlers[event];
    }
    if (handler) {
      this.input.addEventListener(event, handler);
      this._handlers[event] = handler;
    }
  }
}
HTMLMaskElement.EVENTS_MAP = {
  selectionChange: 'keydown',
  input: 'input',
  drop: 'drop',
  click: 'click',
  focus: 'focus',
  commit: 'blur'
};
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].HTMLMaskElement = HTMLMaskElement;


/***/ }),

/***/ "./node_modules/imask/esm/controls/input.js":
/*!**************************************************!*\
  !*** ./node_modules/imask/esm/controls/input.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InputMask)
/* harmony export */ });
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_action_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/action-details.js */ "./node_modules/imask/esm/core/action-details.js");
/* harmony import */ var _masked_date_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../masked/date.js */ "./node_modules/imask/esm/masked/date.js");
/* harmony import */ var _masked_factory_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../masked/factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _mask_element_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mask-element.js */ "./node_modules/imask/esm/controls/mask-element.js");
/* harmony import */ var _html_mask_element_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./html-mask-element.js */ "./node_modules/imask/esm/controls/html-mask-element.js");
/* harmony import */ var _html_contenteditable_mask_element_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./html-contenteditable-mask-element.js */ "./node_modules/imask/esm/controls/html-contenteditable-mask-element.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _masked_pattern_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../masked/pattern.js */ "./node_modules/imask/esm/masked/pattern.js");
/* harmony import */ var _masked_base_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../masked/base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _masked_pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../masked/pattern/input-definition.js */ "./node_modules/imask/esm/masked/pattern/input-definition.js");
/* harmony import */ var _masked_pattern_fixed_definition_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../masked/pattern/fixed-definition.js */ "./node_modules/imask/esm/masked/pattern/fixed-definition.js");
/* harmony import */ var _masked_pattern_chunk_tail_details_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../masked/pattern/chunk-tail-details.js */ "./node_modules/imask/esm/masked/pattern/chunk-tail-details.js");
/* harmony import */ var _masked_pattern_cursor_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../masked/pattern/cursor.js */ "./node_modules/imask/esm/masked/pattern/cursor.js");
/* harmony import */ var _masked_regexp_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../masked/regexp.js */ "./node_modules/imask/esm/masked/regexp.js");
/* harmony import */ var _masked_range_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../masked/range.js */ "./node_modules/imask/esm/masked/range.js");



















const _excluded = ["mask"];

/** Listens to element events and controls changes between element and {@link Masked} */
class InputMask {
  /**
    View element
    @readonly
  */

  /**
    Internal {@link Masked} model
    @readonly
  */

  /**
    @param {MaskElement|HTMLInputElement|HTMLTextAreaElement} el
    @param {Object} opts
  */
  constructor(el, opts) {
    this.el = el instanceof _mask_element_js__WEBPACK_IMPORTED_MODULE_5__["default"] ? el : el.isContentEditable && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' ? new _html_contenteditable_mask_element_js__WEBPACK_IMPORTED_MODULE_7__["default"](el) : new _html_mask_element_js__WEBPACK_IMPORTED_MODULE_6__["default"](el);
    this.masked = (0,_masked_factory_js__WEBPACK_IMPORTED_MODULE_4__["default"])(opts);
    this._listeners = {};
    this._value = '';
    this._unmaskedValue = '';
    this._saveSelection = this._saveSelection.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onClick = this._onClick.bind(this);
    this.alignCursor = this.alignCursor.bind(this);
    this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
    this._bindEvents();

    // refresh
    this.updateValue();
    this._onChange();
  }

  /** Read or update mask */
  get mask() {
    return this.masked.mask;
  }
  maskEquals(mask) {
    var _this$masked;
    return mask == null || ((_this$masked = this.masked) === null || _this$masked === void 0 ? void 0 : _this$masked.maskEquals(mask));
  }
  set mask(mask) {
    if (this.maskEquals(mask)) return;

    // $FlowFixMe No ideas ... after update
    if (!(mask instanceof _core_holder_js__WEBPACK_IMPORTED_MODULE_8__["default"].Masked) && this.masked.constructor === (0,_masked_factory_js__WEBPACK_IMPORTED_MODULE_4__.maskedClass)(mask)) {
      this.masked.updateOptions({
        mask
      });
      return;
    }
    const masked = (0,_masked_factory_js__WEBPACK_IMPORTED_MODULE_4__["default"])({
      mask
    });
    masked.unmaskedValue = this.masked.unmaskedValue;
    this.masked = masked;
  }

  /** Raw value */
  get value() {
    return this._value;
  }
  set value(str) {
    if (this.value === str) return;
    this.masked.value = str;
    this.updateControl();
    this.alignCursor();
  }

  /** Unmasked value */
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(str) {
    if (this.unmaskedValue === str) return;
    this.masked.unmaskedValue = str;
    this.updateControl();
    this.alignCursor();
  }

  /** Typed unmasked value */
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(val) {
    if (this.masked.typedValueEquals(val)) return;
    this.masked.typedValue = val;
    this.updateControl();
    this.alignCursor();
  }

  /** Display value */
  get displayValue() {
    return this.masked.displayValue;
  }

  /**
    Starts listening to element events
    @protected
  */
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange
    });
  }

  /**
    Stops listening to element events
    @protected
   */
  _unbindEvents() {
    if (this.el) this.el.unbindEvents();
  }

  /**
    Fires custom event
    @protected
   */
  _fireEvent(ev) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    const listeners = this._listeners[ev];
    if (!listeners) return;
    listeners.forEach(l => l(...args));
  }

  /**
    Current selection start
    @readonly
  */
  get selectionStart() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
  }

  /** Current cursor position */
  get cursorPos() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
  }
  set cursorPos(pos) {
    if (!this.el || !this.el.isActive) return;
    this.el.select(pos, pos);
    this._saveSelection();
  }

  /**
    Stores current selection
    @protected
  */
  _saveSelection( /* ev */
  ) {
    if (this.displayValue !== this.el.value) {
      console.warn('Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.'); // eslint-disable-line no-console
    }

    this._selection = {
      start: this.selectionStart,
      end: this.cursorPos
    };
  }

  /** Syncronizes model value from view */
  updateValue() {
    this.masked.value = this.el.value;
    this._value = this.masked.value;
  }

  /** Syncronizes view from model value, fires change events */
  updateControl() {
    const newUnmaskedValue = this.masked.unmaskedValue;
    const newValue = this.masked.value;
    const newDisplayValue = this.displayValue;
    const isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
    this._unmaskedValue = newUnmaskedValue;
    this._value = newValue;
    if (this.el.value !== newDisplayValue) this.el.value = newDisplayValue;
    if (isChanged) this._fireChangeEvents();
  }

  /** Updates options with deep equal check, recreates @{link Masked} model if mask type changes */
  updateOptions(opts) {
    const {
        mask
      } = opts,
      restOpts = (0,_rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__._)(opts, _excluded);
    const updateMask = !this.maskEquals(mask);
    const updateOpts = !(0,_core_utils_js__WEBPACK_IMPORTED_MODULE_1__.objectIncludes)(this.masked, restOpts);
    if (updateMask) this.mask = mask;
    if (updateOpts) this.masked.updateOptions(restOpts);
    if (updateMask || updateOpts) this.updateControl();
  }

  /** Updates cursor */
  updateCursor(cursorPos) {
    if (cursorPos == null) return;
    this.cursorPos = cursorPos;

    // also queue change cursor for mobile browsers
    this._delayUpdateCursor(cursorPos);
  }

  /**
    Delays cursor update to support mobile browsers
    @private
  */
  _delayUpdateCursor(cursorPos) {
    this._abortUpdateCursor();
    this._changingCursorPos = cursorPos;
    this._cursorChanging = setTimeout(() => {
      if (!this.el) return; // if was destroyed
      this.cursorPos = this._changingCursorPos;
      this._abortUpdateCursor();
    }, 10);
  }

  /**
    Fires custom events
    @protected
  */
  _fireChangeEvents() {
    this._fireEvent('accept', this._inputEvent);
    if (this.masked.isComplete) this._fireEvent('complete', this._inputEvent);
  }

  /**
    Aborts delayed cursor update
    @private
  */
  _abortUpdateCursor() {
    if (this._cursorChanging) {
      clearTimeout(this._cursorChanging);
      delete this._cursorChanging;
    }
  }

  /** Aligns cursor to nearest available position */
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.LEFT));
  }

  /** Aligns cursor only if selection is empty */
  alignCursorFriendly() {
    if (this.selectionStart !== this.cursorPos) return; // skip if range is selected
    this.alignCursor();
  }

  /** Adds listener on custom event */
  on(ev, handler) {
    if (!this._listeners[ev]) this._listeners[ev] = [];
    this._listeners[ev].push(handler);
    return this;
  }

  /** Removes custom event listener */
  off(ev, handler) {
    if (!this._listeners[ev]) return this;
    if (!handler) {
      delete this._listeners[ev];
      return this;
    }
    const hIndex = this._listeners[ev].indexOf(handler);
    if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
    return this;
  }

  /** Handles view input event */
  _onInput(e) {
    this._inputEvent = e;
    this._abortUpdateCursor();

    // fix strange IE behavior
    if (!this._selection) return this.updateValue();
    const details = new _core_action_details_js__WEBPACK_IMPORTED_MODULE_2__["default"](
    // new state
    this.el.value, this.cursorPos,
    // old state
    this.displayValue, this._selection);
    const oldRawValue = this.masked.rawInputValue;
    const offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
      input: true,
      raw: true
    }).offset;

    // force align in remove direction only if no input chars were removed
    // otherwise we still need to align with NONE (to get out from fixed symbols for instance)
    const removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.NONE;
    let cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
    if (removeDirection !== _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.NONE);
    this.updateControl();
    this.updateCursor(cursorPos);
    delete this._inputEvent;
  }

  /** Handles view change event and commits model value */
  _onChange() {
    if (this.displayValue !== this.el.value) {
      this.updateValue();
    }
    this.masked.doCommit();
    this.updateControl();
    this._saveSelection();
  }

  /** Handles view drop event, prevents by default */
  _onDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  /** Restore last selection on focus */
  _onFocus(ev) {
    this.alignCursorFriendly();
  }

  /** Restore last selection on focus */
  _onClick(ev) {
    this.alignCursorFriendly();
  }

  /** Unbind view events and removes element reference */
  destroy() {
    this._unbindEvents();
    // $FlowFixMe why not do so?
    this._listeners.length = 0;
    // $FlowFixMe
    delete this.el;
  }
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_8__["default"].InputMask = InputMask;


/***/ }),

/***/ "./node_modules/imask/esm/controls/mask-element.js":
/*!*********************************************************!*\
  !*** ./node_modules/imask/esm/controls/mask-element.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskElement)
/* harmony export */ });
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");


/**
  Generic element API to use with mask
  @interface
*/
class MaskElement {
  /** */

  /** */

  /** */

  /** Safely returns selection start */
  get selectionStart() {
    let start;
    try {
      start = this._unsafeSelectionStart;
    } catch (e) {}
    return start != null ? start : this.value.length;
  }

  /** Safely returns selection end */
  get selectionEnd() {
    let end;
    try {
      end = this._unsafeSelectionEnd;
    } catch (e) {}
    return end != null ? end : this.value.length;
  }

  /** Safely sets element selection */
  select(start, end) {
    if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;
    try {
      this._unsafeSelect(start, end);
    } catch (e) {}
  }

  /** Should be overriden in subclasses */
  _unsafeSelect(start, end) {}
  /** Should be overriden in subclasses */
  get isActive() {
    return false;
  }
  /** Should be overriden in subclasses */
  bindEvents(handlers) {}
  /** Should be overriden in subclasses */
  unbindEvents() {}
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_0__["default"].MaskElement = MaskElement;


/***/ }),

/***/ "./node_modules/imask/esm/core/action-details.js":
/*!*******************************************************!*\
  !*** ./node_modules/imask/esm/core/action-details.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ActionDetails)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _change_details_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _holder_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./holder.js */ "./node_modules/imask/esm/core/holder.js");




/** Provides details of changing input */
class ActionDetails {
  /** Current input value */

  /** Current cursor position */

  /** Old input value */

  /** Old selection */

  constructor(value, cursorPos, oldValue, oldSelection) {
    this.value = value;
    this.cursorPos = cursorPos;
    this.oldValue = oldValue;
    this.oldSelection = oldSelection;

    // double check if left part was changed (autofilling, other non-standard input triggers)
    while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
      --this.oldSelection.start;
    }
  }

  /**
    Start changing position
    @readonly
  */
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }

  /**
    Inserted symbols count
    @readonly
  */
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }

  /**
    Inserted symbols
    @readonly
  */
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }

  /**
    Removed symbols count
    @readonly
  */
  get removedCount() {
    // Math.max for opposite operation
    return Math.max(this.oldSelection.end - this.startChangePos ||
    // for Delete
    this.oldValue.length - this.value.length, 0);
  }

  /**
    Removed symbols
    @readonly
  */
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }

  /**
    Unchanged head symbols
    @readonly
  */
  get head() {
    return this.value.substring(0, this.startChangePos);
  }

  /**
    Unchanged tail symbols
    @readonly
  */
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }

  /**
    Remove direction
    @readonly
  */
  get removeDirection() {
    if (!this.removedCount || this.insertedCount) return _utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.NONE;

    // align right if delete at right
    return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) &&
    // if not range removed (event with backspace)
    this.oldSelection.end === this.oldSelection.start ? _utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.RIGHT : _utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.LEFT;
  }
}


/***/ }),

/***/ "./node_modules/imask/esm/core/change-details.js":
/*!*******************************************************!*\
  !*** ./node_modules/imask/esm/core/change-details.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChangeDetails)
/* harmony export */ });
/* harmony import */ var _holder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./holder.js */ "./node_modules/imask/esm/core/holder.js");


/**
  Provides details of changing model value
  @param {Object} [details]
  @param {string} [details.inserted] - Inserted symbols
  @param {boolean} [details.skip] - Can skip chars
  @param {number} [details.removeCount] - Removed symbols count
  @param {number} [details.tailShift] - Additional offset if any changes occurred before tail
*/
class ChangeDetails {
  /** Inserted symbols */

  /** Can skip chars */

  /** Additional offset if any changes occurred before tail */

  /** Raw inserted is used by dynamic mask */

  constructor(details) {
    Object.assign(this, {
      inserted: '',
      rawInserted: '',
      skip: false,
      tailShift: 0
    }, details);
  }

  /**
    Aggregate changes
    @returns {ChangeDetails} `this`
  */
  aggregate(details) {
    this.rawInserted += details.rawInserted;
    this.skip = this.skip || details.skip;
    this.inserted += details.inserted;
    this.tailShift += details.tailShift;
    return this;
  }

  /** Total offset considering all changes */
  get offset() {
    return this.tailShift + this.inserted.length;
  }
}
_holder_js__WEBPACK_IMPORTED_MODULE_0__["default"].ChangeDetails = ChangeDetails;


/***/ }),

/***/ "./node_modules/imask/esm/core/continuous-tail-details.js":
/*!****************************************************************!*\
  !*** ./node_modules/imask/esm/core/continuous-tail-details.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContinuousTailDetails)
/* harmony export */ });
/** Provides details of continuous extracted tail */
class ContinuousTailDetails {
  /** Tail value as string */

  /** Tail start position */

  /** Start position */

  constructor() {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let stop = arguments.length > 2 ? arguments[2] : undefined;
    this.value = value;
    this.from = from;
    this.stop = stop;
  }
  toString() {
    return this.value;
  }
  extend(tail) {
    this.value += String(tail);
  }
  appendTo(masked) {
    return masked.append(this.toString(), {
      tail: true
    }).aggregate(masked._appendPlaceholder());
  }
  get state() {
    return {
      value: this.value,
      from: this.from,
      stop: this.stop
    };
  }
  set state(state) {
    Object.assign(this, state);
  }
  unshift(beforePos) {
    if (!this.value.length || beforePos != null && this.from >= beforePos) return '';
    const shiftChar = this.value[0];
    this.value = this.value.slice(1);
    return shiftChar;
  }
  shift() {
    if (!this.value.length) return '';
    const shiftChar = this.value[this.value.length - 1];
    this.value = this.value.slice(0, -1);
    return shiftChar;
  }
}


/***/ }),

/***/ "./node_modules/imask/esm/core/holder.js":
/*!***********************************************!*\
  !*** ./node_modules/imask/esm/core/holder.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IMask)
/* harmony export */ });
/**
 * Applies mask on element.
 * @constructor
 * @param {HTMLInputElement|HTMLTextAreaElement|MaskElement} el - Element to apply mask
 * @param {Object} opts - Custom mask options
 * @return {InputMask}
 */
function IMask(el) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // currently available only for input-like elements
  return new IMask.InputMask(el, opts);
}


/***/ }),

/***/ "./node_modules/imask/esm/core/utils.js":
/*!**********************************************!*\
  !*** ./node_modules/imask/esm/core/utils.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DIRECTION": () => (/* binding */ DIRECTION),
/* harmony export */   "escapeRegExp": () => (/* binding */ escapeRegExp),
/* harmony export */   "forceDirection": () => (/* binding */ forceDirection),
/* harmony export */   "indexInDirection": () => (/* binding */ indexInDirection),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "normalizePrepare": () => (/* binding */ normalizePrepare),
/* harmony export */   "objectIncludes": () => (/* binding */ objectIncludes),
/* harmony export */   "posInDirection": () => (/* binding */ posInDirection)
/* harmony export */ });
/* harmony import */ var _change_details_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./holder.js */ "./node_modules/imask/esm/core/holder.js");



/** Checks if value is string */
function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

/**
  Direction
  @prop {string} NONE
  @prop {string} LEFT
  @prop {string} FORCE_LEFT
  @prop {string} RIGHT
  @prop {string} FORCE_RIGHT
*/
const DIRECTION = {
  NONE: 'NONE',
  LEFT: 'LEFT',
  FORCE_LEFT: 'FORCE_LEFT',
  RIGHT: 'RIGHT',
  FORCE_RIGHT: 'FORCE_RIGHT'
};
/**
  Direction
  @enum {string}
*/

/** Returns next char index in direction */
function indexInDirection(pos, direction) {
  if (direction === DIRECTION.LEFT) --pos;
  return pos;
}

/** Returns next char position in direction */
function posInDirection(pos, direction) {
  switch (direction) {
    case DIRECTION.LEFT:
    case DIRECTION.FORCE_LEFT:
      return --pos;
    case DIRECTION.RIGHT:
    case DIRECTION.FORCE_RIGHT:
      return ++pos;
    default:
      return pos;
  }
}

/** */
function forceDirection(direction) {
  switch (direction) {
    case DIRECTION.LEFT:
      return DIRECTION.FORCE_LEFT;
    case DIRECTION.RIGHT:
      return DIRECTION.FORCE_RIGHT;
    default:
      return direction;
  }
}

/** Escapes regular expression control chars */
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
function normalizePrepare(prep) {
  return Array.isArray(prep) ? prep : [prep, new _change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]()];
}

// cloned from https://github.com/epoberezkin/fast-deep-equal with small changes
function objectIncludes(b, a) {
  if (a === b) return true;
  var arrA = Array.isArray(a),
    arrB = Array.isArray(b),
    i;
  if (arrA && arrB) {
    if (a.length != b.length) return false;
    for (i = 0; i < a.length; i++) if (!objectIncludes(a[i], b[i])) return false;
    return true;
  }
  if (arrA != arrB) return false;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    var dateA = a instanceof Date,
      dateB = b instanceof Date;
    if (dateA && dateB) return a.getTime() == b.getTime();
    if (dateA != dateB) return false;
    var regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp;
    if (regexpA && regexpB) return a.toString() == b.toString();
    if (regexpA != regexpB) return false;
    var keys = Object.keys(a);
    // if (keys.length !== Object.keys(b).length) return false;

    for (i = 0; i < keys.length; i++)
    // $FlowFixMe ... ???
    if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    for (i = 0; i < keys.length; i++) if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
    return true;
  } else if (a && b && typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString();
  }
  return false;
}

/** Selection range */



/***/ }),

/***/ "./node_modules/imask/esm/index.js":
/*!*****************************************!*\
  !*** ./node_modules/imask/esm/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChangeDetails": () => (/* reexport safe */ _core_change_details_js__WEBPACK_IMPORTED_MODULE_16__["default"]),
/* harmony export */   "HTMLContenteditableMaskElement": () => (/* reexport safe */ _controls_html_contenteditable_mask_element_js__WEBPACK_IMPORTED_MODULE_14__["default"]),
/* harmony export */   "HTMLMaskElement": () => (/* reexport safe */ _controls_html_mask_element_js__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   "InputMask": () => (/* reexport safe */ _controls_input_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "MaskElement": () => (/* reexport safe */ _controls_mask_element_js__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   "Masked": () => (/* reexport safe */ _masked_base_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "MaskedDate": () => (/* reexport safe */ _masked_date_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "MaskedDynamic": () => (/* reexport safe */ _masked_dynamic_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "MaskedEnum": () => (/* reexport safe */ _masked_enum_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "MaskedFunction": () => (/* reexport safe */ _masked_function_js__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   "MaskedNumber": () => (/* reexport safe */ _masked_number_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "MaskedPattern": () => (/* reexport safe */ _masked_pattern_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "MaskedRange": () => (/* reexport safe */ _masked_range_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "MaskedRegExp": () => (/* reexport safe */ _masked_regexp_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "PIPE_TYPE": () => (/* reexport safe */ _masked_pipe_js__WEBPACK_IMPORTED_MODULE_15__.PIPE_TYPE),
/* harmony export */   "createMask": () => (/* reexport safe */ _masked_factory_js__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   "createPipe": () => (/* reexport safe */ _masked_pipe_js__WEBPACK_IMPORTED_MODULE_15__.createPipe),
/* harmony export */   "default": () => (/* reexport safe */ _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "pipe": () => (/* reexport safe */ _masked_pipe_js__WEBPACK_IMPORTED_MODULE_15__.pipe)
/* harmony export */ });
/* harmony import */ var _controls_input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controls/input.js */ "./node_modules/imask/esm/controls/input.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _masked_base_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./masked/base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _masked_pattern_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./masked/pattern.js */ "./node_modules/imask/esm/masked/pattern.js");
/* harmony import */ var _masked_enum_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./masked/enum.js */ "./node_modules/imask/esm/masked/enum.js");
/* harmony import */ var _masked_range_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./masked/range.js */ "./node_modules/imask/esm/masked/range.js");
/* harmony import */ var _masked_number_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./masked/number.js */ "./node_modules/imask/esm/masked/number.js");
/* harmony import */ var _masked_date_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./masked/date.js */ "./node_modules/imask/esm/masked/date.js");
/* harmony import */ var _masked_regexp_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./masked/regexp.js */ "./node_modules/imask/esm/masked/regexp.js");
/* harmony import */ var _masked_function_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./masked/function.js */ "./node_modules/imask/esm/masked/function.js");
/* harmony import */ var _masked_dynamic_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./masked/dynamic.js */ "./node_modules/imask/esm/masked/dynamic.js");
/* harmony import */ var _masked_factory_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./masked/factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _controls_mask_element_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./controls/mask-element.js */ "./node_modules/imask/esm/controls/mask-element.js");
/* harmony import */ var _controls_html_mask_element_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./controls/html-mask-element.js */ "./node_modules/imask/esm/controls/html-mask-element.js");
/* harmony import */ var _controls_html_contenteditable_mask_element_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./controls/html-contenteditable-mask-element.js */ "./node_modules/imask/esm/controls/html-contenteditable-mask-element.js");
/* harmony import */ var _masked_pipe_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./masked/pipe.js */ "./node_modules/imask/esm/masked/pipe.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_action_details_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./core/action-details.js */ "./node_modules/imask/esm/core/action-details.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _masked_pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./masked/pattern/input-definition.js */ "./node_modules/imask/esm/masked/pattern/input-definition.js");
/* harmony import */ var _masked_pattern_fixed_definition_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./masked/pattern/fixed-definition.js */ "./node_modules/imask/esm/masked/pattern/fixed-definition.js");
/* harmony import */ var _masked_pattern_chunk_tail_details_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./masked/pattern/chunk-tail-details.js */ "./node_modules/imask/esm/masked/pattern/chunk-tail-details.js");
/* harmony import */ var _masked_pattern_cursor_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./masked/pattern/cursor.js */ "./node_modules/imask/esm/masked/pattern/cursor.js");


























try {
  globalThis.IMask = _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"];
} catch (e) {}

/***/ }),

/***/ "./node_modules/imask/esm/masked/base.js":
/*!***********************************************!*\
  !*** ./node_modules/imask/esm/masked/base.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Masked)
/* harmony export */ });
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");





/** Supported mask type */

/** Append flags */

/** Extract flags */

/** Provides common masking stuff */
class Masked {
  // $Shape<MaskedOptions>; TODO after fix https://github.com/facebook/flow/issues/4773

  /** @type {Mask} */

  /** */ // $FlowFixMe no ideas
  /** Transforms value before mask processing */
  /** Validates if value is acceptable */
  /** Does additional processing in the end of editing */
  /** Format typed value to string */
  /** Parse strgin to get typed value */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  constructor(opts) {
    this._value = '';
    this._update(Object.assign({}, Masked.DEFAULTS, opts));
    this.isInitialized = true;
  }

  /** Sets and applies new options */
  updateOptions(opts) {
    if (!Object.keys(opts).length) return;
    // $FlowFixMe
    this.withValueRefresh(this._update.bind(this, opts));
  }

  /**
    Sets new options
    @protected
  */
  _update(opts) {
    Object.assign(this, opts);
  }

  /** Mask state */
  get state() {
    return {
      _value: this.value
    };
  }
  set state(state) {
    this._value = state._value;
  }

  /** Resets value */
  reset() {
    this._value = '';
  }

  /** */
  get value() {
    return this._value;
  }
  set value(value) {
    this.resolve(value);
  }

  /** Resolve new value */
  resolve(value) {
    this.reset();
    this.append(value, {
      input: true
    }, '');
    this.doCommit();
    return this.value;
  }

  /** */
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(value) {
    this.reset();
    this.append(value, {}, '');
    this.doCommit();
  }

  /** */
  get typedValue() {
    return this.doParse(this.value);
  }
  set typedValue(value) {
    this.value = this.doFormat(value);
  }

  /** Value that includes raw user input */
  get rawInputValue() {
    return this.extractInput(0, this.value.length, {
      raw: true
    });
  }
  set rawInputValue(value) {
    this.reset();
    this.append(value, {
      raw: true
    }, '');
    this.doCommit();
  }
  get displayValue() {
    return this.value;
  }

  /** */
  get isComplete() {
    return true;
  }

  /** */
  get isFilled() {
    return this.isComplete;
  }

  /** Finds nearest input position in direction */
  nearestInputPos(cursorPos, direction) {
    return cursorPos;
  }
  totalInputPositions() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    return Math.min(this.value.length, toPos - fromPos);
  }

  /** Extracts value in range considering flags */
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    return this.value.slice(fromPos, toPos);
  }

  /** Extracts tail in range */
  extractTail() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    return new _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.extractInput(fromPos, toPos), fromPos);
  }

  /** Appends tail */
  // $FlowFixMe no ideas
  appendTail(tail) {
    if ((0,_core_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(tail)) tail = new _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_1__["default"](String(tail));
    return tail.appendTo(this);
  }

  /** Appends char */
  _appendCharRaw(ch) {
    if (!ch) return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this._value += ch;
    return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
      inserted: ch,
      rawInserted: ch
    });
  }

  /** Appends char */
  _appendChar(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let checkTail = arguments.length > 2 ? arguments[2] : undefined;
    const consistentState = this.state;
    let details;
    [ch, details] = (0,_core_utils_js__WEBPACK_IMPORTED_MODULE_2__.normalizePrepare)(this.doPrepare(ch, flags));
    details = details.aggregate(this._appendCharRaw(ch, flags));
    if (details.inserted) {
      let consistentTail;
      let appended = this.doValidate(flags) !== false;
      if (appended && checkTail != null) {
        // validation ok, check tail
        const beforeTailState = this.state;
        if (this.overwrite === true) {
          consistentTail = checkTail.state;
          checkTail.unshift(this.value.length - details.tailShift);
        }
        let tailDetails = this.appendTail(checkTail);
        appended = tailDetails.rawInserted === checkTail.toString();

        // not ok, try shift
        if (!(appended && tailDetails.inserted) && this.overwrite === 'shift') {
          this.state = beforeTailState;
          consistentTail = checkTail.state;
          checkTail.shift();
          tailDetails = this.appendTail(checkTail);
          appended = tailDetails.rawInserted === checkTail.toString();
        }

        // if ok, rollback state after tail
        if (appended && tailDetails.inserted) this.state = beforeTailState;
      }

      // revert all if something went wrong
      if (!appended) {
        details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
        this.state = consistentState;
        if (checkTail && consistentTail) checkTail.state = consistentTail;
      }
    }
    return details;
  }

  /** Appends optional placeholder at end */
  _appendPlaceholder() {
    return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }

  /** Appends optional eager placeholder at end */
  _appendEager() {
    return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }

  /** Appends symbols considering flags */
  // $FlowFixMe no ideas
  append(str, flags, tail) {
    if (!(0,_core_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(str)) throw new Error('value should be string');
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    const checkTail = (0,_core_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(tail) ? new _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_1__["default"](String(tail)) : tail;
    if (flags !== null && flags !== void 0 && flags.tail) flags._beforeTailState = this.state;
    for (let ci = 0; ci < str.length; ++ci) {
      const d = this._appendChar(str[ci], flags, checkTail);
      if (!d.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail)) break;
      details.aggregate(d);
    }

    // append tail but aggregate only tailShift
    if (checkTail != null) {
      details.tailShift += this.appendTail(checkTail).tailShift;
      // TODO it's a good idea to clear state after appending ends
      // but it causes bugs when one append calls another (when dynamic dispatch set rawInputValue)
      // this._resetBeforeTailState();
    }

    if ((this.eager === true || this.eager === 'append') && flags !== null && flags !== void 0 && flags.input && str) {
      details.aggregate(this._appendEager());
    }
    return details;
  }

  /** */
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    this._value = this.value.slice(0, fromPos) + this.value.slice(toPos);
    return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }

  /** Calls function and reapplies current value */
  withValueRefresh(fn) {
    if (this._refreshing || !this.isInitialized) return fn();
    this._refreshing = true;
    const rawInput = this.rawInputValue;
    const value = this.value;
    const ret = fn();
    this.rawInputValue = rawInput;
    // append lost trailing chars at end
    if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
      this.append(value.slice(this.value.length), {}, '');
    }
    delete this._refreshing;
    return ret;
  }

  /** */
  runIsolated(fn) {
    if (this._isolated || !this.isInitialized) return fn(this);
    this._isolated = true;
    const state = this.state;
    const ret = fn(this);
    this.state = state;
    delete this._isolated;
    return ret;
  }

  /** */
  doSkipInvalid(ch) {
    return this.skipInvalid;
  }

  /**
    Prepares string before mask processing
    @protected
  */
  doPrepare(str) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.prepare ? this.prepare(str, this, flags) : str;
  }

  /**
    Validates if value is acceptable
    @protected
  */
  doValidate(flags) {
    return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
  }

  /**
    Does additional processing in the end of editing
    @protected
  */
  doCommit() {
    if (this.commit) this.commit(this.value, this);
  }

  /** */
  doFormat(value) {
    return this.format ? this.format(value, this) : value;
  }

  /** */
  doParse(str) {
    return this.parse ? this.parse(str, this) : str;
  }

  /** */
  splice(start, deleteCount, inserted, removeDirection) {
    let flags = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      input: true
    };
    const tailPos = start + deleteCount;
    const tail = this.extractTail(tailPos);
    const eagerRemove = this.eager === true || this.eager === 'remove';
    let oldRawValue;
    if (eagerRemove) {
      removeDirection = (0,_core_utils_js__WEBPACK_IMPORTED_MODULE_2__.forceDirection)(removeDirection);
      oldRawValue = this.extractInput(0, tailPos, {
        raw: true
      });
    }
    let startChangePos = start;
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();

    // if it is just deletion without insertion
    if (removeDirection !== _core_utils_js__WEBPACK_IMPORTED_MODULE_2__.DIRECTION.NONE) {
      startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !eagerRemove ? _core_utils_js__WEBPACK_IMPORTED_MODULE_2__.DIRECTION.NONE : removeDirection);

      // adjust tailShift if start was aligned
      details.tailShift = startChangePos - start;
    }
    details.aggregate(this.remove(startChangePos));
    if (eagerRemove && removeDirection !== _core_utils_js__WEBPACK_IMPORTED_MODULE_2__.DIRECTION.NONE && oldRawValue === this.rawInputValue) {
      if (removeDirection === _core_utils_js__WEBPACK_IMPORTED_MODULE_2__.DIRECTION.FORCE_LEFT) {
        let valLength;
        while (oldRawValue === this.rawInputValue && (valLength = this.value.length)) {
          details.aggregate(new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
            tailShift: -1
          })).aggregate(this.remove(valLength - 1));
        }
      } else if (removeDirection === _core_utils_js__WEBPACK_IMPORTED_MODULE_2__.DIRECTION.FORCE_RIGHT) {
        tail.unshift();
      }
    }
    return details.aggregate(this.append(inserted, flags, tail));
  }
  maskEquals(mask) {
    return this.mask === mask;
  }
  typedValueEquals(value) {
    const tval = this.typedValue;
    return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || this.doFormat(value) === this.doFormat(this.typedValue);
  }
}
Masked.DEFAULTS = {
  format: String,
  parse: v => v,
  skipInvalid: true
};
Masked.EMPTY_VALUES = [undefined, null, ''];
_core_holder_js__WEBPACK_IMPORTED_MODULE_3__["default"].Masked = Masked;


/***/ }),

/***/ "./node_modules/imask/esm/masked/date.js":
/*!***********************************************!*\
  !*** ./node_modules/imask/esm/masked/date.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskedDate)
/* harmony export */ });
/* harmony import */ var _pattern_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pattern.js */ "./node_modules/imask/esm/masked/pattern.js");
/* harmony import */ var _range_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./range.js */ "./node_modules/imask/esm/masked/range.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pattern/input-definition.js */ "./node_modules/imask/esm/masked/pattern/input-definition.js");
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _pattern_fixed_definition_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pattern/fixed-definition.js */ "./node_modules/imask/esm/masked/pattern/fixed-definition.js");
/* harmony import */ var _pattern_chunk_tail_details_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pattern/chunk-tail-details.js */ "./node_modules/imask/esm/masked/pattern/chunk-tail-details.js");
/* harmony import */ var _pattern_cursor_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pattern/cursor.js */ "./node_modules/imask/esm/masked/pattern/cursor.js");
/* harmony import */ var _regexp_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./regexp.js */ "./node_modules/imask/esm/masked/regexp.js");















/** Date mask */
class MaskedDate extends _pattern_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /** Pattern mask for date according to {@link MaskedDate#format} */

  /** Start date */

  /** End date */

  /** */

  /**
    @param {Object} opts
  */
  constructor(opts) {
    super(Object.assign({}, MaskedDate.DEFAULTS, opts));
  }

  /**
    @override
  */
  _update(opts) {
    if (opts.mask === Date) delete opts.mask;
    if (opts.pattern) opts.mask = opts.pattern;
    const blocks = opts.blocks;
    opts.blocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
    // adjust year block
    if (opts.min) opts.blocks.Y.from = opts.min.getFullYear();
    if (opts.max) opts.blocks.Y.to = opts.max.getFullYear();
    if (opts.min && opts.max && opts.blocks.Y.from === opts.blocks.Y.to) {
      opts.blocks.m.from = opts.min.getMonth() + 1;
      opts.blocks.m.to = opts.max.getMonth() + 1;
      if (opts.blocks.m.from === opts.blocks.m.to) {
        opts.blocks.d.from = opts.min.getDate();
        opts.blocks.d.to = opts.max.getDate();
      }
    }
    Object.assign(opts.blocks, this.blocks, blocks);

    // add autofix
    Object.keys(opts.blocks).forEach(bk => {
      const b = opts.blocks[bk];
      if (!('autofix' in b) && 'autofix' in opts) b.autofix = opts.autofix;
    });
    super._update(opts);
  }

  /**
    @override
  */
  doValidate() {
    const date = this.date;
    return super.doValidate(...arguments) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
  }

  /** Checks if date is exists */
  isDateExist(str) {
    return this.format(this.parse(str, this), this).indexOf(str) >= 0;
  }

  /** Parsed Date */
  get date() {
    return this.typedValue;
  }
  set date(date) {
    this.typedValue = date;
  }

  /**
    @override
  */
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(value) {
    super.typedValue = value;
  }

  /**
    @override
  */
  maskEquals(mask) {
    return mask === Date || super.maskEquals(mask);
  }
}
MaskedDate.DEFAULTS = {
  pattern: 'd{.}`m{.}`Y',
  format: date => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return [day, month, year].join('.');
  },
  parse: str => {
    const [day, month, year] = str.split('.');
    return new Date(year, month - 1, day);
  }
};
MaskedDate.GET_DEFAULT_BLOCKS = () => ({
  d: {
    mask: _range_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    from: 1,
    to: 31,
    maxLength: 2
  },
  m: {
    mask: _range_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    from: 1,
    to: 12,
    maxLength: 2
  },
  Y: {
    mask: _range_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    from: 1900,
    to: 9999
  }
});
_core_holder_js__WEBPACK_IMPORTED_MODULE_2__["default"].MaskedDate = MaskedDate;


/***/ }),

/***/ "./node_modules/imask/esm/masked/dynamic.js":
/*!**************************************************!*\
  !*** ./node_modules/imask/esm/masked/dynamic.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskedDynamic)
/* harmony export */ });
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");







const _excluded = ["compiledMasks", "currentMaskRef", "currentMask"],
  _excluded2 = ["mask"];
/** Dynamic mask for choosing apropriate mask in run-time */
class MaskedDynamic extends _base_js__WEBPACK_IMPORTED_MODULE_4__["default"] {
  /** Currently chosen mask */

  /** Compliled {@link Masked} options */

  /** Chooses {@link Masked} depending on input value */

  /**
    @param {Object} opts
  */
  constructor(opts) {
    super(Object.assign({}, MaskedDynamic.DEFAULTS, opts));
    this.currentMask = null;
  }

  /**
    @override
  */
  _update(opts) {
    super._update(opts);
    if ('mask' in opts) {
      // mask could be totally dynamic with only `dispatch` option
      this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map(m => (0,_factory_js__WEBPACK_IMPORTED_MODULE_3__["default"])(m)) : [];

      // this.currentMask = this.doDispatch(''); // probably not needed but lets see
    }
  }

  /**
    @override
  */
  _appendCharRaw(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const details = this._applyDispatch(ch, flags);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
    }
    return details;
  }
  _applyDispatch() {
    let appended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let tail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    const prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
    const inputValue = this.rawInputValue;
    const insertValue = flags.tail && flags._beforeTailState != null ?
    // $FlowFixMe - tired to fight with type system
    flags._beforeTailState._rawInputValue : inputValue;
    const tailValue = inputValue.slice(insertValue.length);
    const prevMask = this.currentMask;
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    const prevMaskState = prevMask === null || prevMask === void 0 ? void 0 : prevMask.state;

    // clone flags to prevent overwriting `_beforeTailState`
    this.currentMask = this.doDispatch(appended, Object.assign({}, flags), tail);

    // restore state after dispatch
    if (this.currentMask) {
      if (this.currentMask !== prevMask) {
        // if mask changed reapply input
        this.currentMask.reset();
        if (insertValue) {
          // $FlowFixMe - it's ok, we don't change current mask above
          const d = this.currentMask.append(insertValue, {
            raw: true
          });
          details.tailShift = d.inserted.length - prevValueBeforeTail.length;
        }
        if (tailValue) {
          // $FlowFixMe - it's ok, we don't change current mask above
          details.tailShift += this.currentMask.append(tailValue, {
            raw: true,
            tail: true
          }).tailShift;
        }
      } else {
        // Dispatch can do something bad with state, so
        // restore prev mask state
        this.currentMask.state = prevMaskState;
      }
    }
    return details;
  }
  _appendPlaceholder() {
    const details = this._applyDispatch(...arguments);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendPlaceholder());
    }
    return details;
  }

  /**
   @override
  */
  _appendEager() {
    const details = this._applyDispatch(...arguments);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendEager());
    }
    return details;
  }
  appendTail(tail) {
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    if (tail) details.aggregate(this._applyDispatch('', {}, tail));
    return details.aggregate(this.currentMask ? this.currentMask.appendTail(tail) : super.appendTail(tail));
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta, _flags$_beforeTailSta2;
    return Object.assign({}, flags, {
      _beforeTailState: ((_flags$_beforeTailSta = flags._beforeTailState) === null || _flags$_beforeTailSta === void 0 ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && ((_flags$_beforeTailSta2 = flags._beforeTailState) === null || _flags$_beforeTailSta2 === void 0 ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
    });
  }

  /**
    @override
  */
  doDispatch(appended) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let tail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    return this.dispatch(appended, this, flags, tail);
  }

  /**
    @override
  */
  doValidate(flags) {
    return super.doValidate(flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
  }

  /**
    @override
  */
  doPrepare(str) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let [s, details] = (0,_core_utils_js__WEBPACK_IMPORTED_MODULE_1__.normalizePrepare)(super.doPrepare(str, flags));
    if (this.currentMask) {
      let currentDetails;
      [s, currentDetails] = (0,_core_utils_js__WEBPACK_IMPORTED_MODULE_1__.normalizePrepare)(super.doPrepare(s, this.currentMaskFlags(flags)));
      details = details.aggregate(currentDetails);
    }
    return [s, details];
  }

  /**
    @override
  */
  reset() {
    var _this$currentMask;
    (_this$currentMask = this.currentMask) === null || _this$currentMask === void 0 ? void 0 : _this$currentMask.reset();
    this.compiledMasks.forEach(m => m.reset());
  }

  /**
    @override
  */
  get value() {
    return this.currentMask ? this.currentMask.value : '';
  }
  set value(value) {
    super.value = value;
  }

  /**
    @override
  */
  get unmaskedValue() {
    return this.currentMask ? this.currentMask.unmaskedValue : '';
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }

  /**
    @override
  */
  get typedValue() {
    return this.currentMask ? this.currentMask.typedValue : '';
  }

  // probably typedValue should not be used with dynamic
  set typedValue(value) {
    let unmaskedValue = String(value);

    // double check it
    if (this.currentMask) {
      this.currentMask.typedValue = value;
      unmaskedValue = this.currentMask.unmaskedValue;
    }
    this.unmaskedValue = unmaskedValue;
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : '';
  }

  /**
    @override
  */
  get isComplete() {
    var _this$currentMask2;
    return Boolean((_this$currentMask2 = this.currentMask) === null || _this$currentMask2 === void 0 ? void 0 : _this$currentMask2.isComplete);
  }

  /**
    @override
  */
  get isFilled() {
    var _this$currentMask3;
    return Boolean((_this$currentMask3 = this.currentMask) === null || _this$currentMask3 === void 0 ? void 0 : _this$currentMask3.isFilled);
  }

  /**
    @override
  */
  remove() {
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    if (this.currentMask) {
      details.aggregate(this.currentMask.remove(...arguments))
      // update with dispatch
      .aggregate(this._applyDispatch());
    }
    return details;
  }

  /**
    @override
  */
  get state() {
    var _this$currentMask4;
    return Object.assign({}, super.state, {
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map(m => m.state),
      currentMaskRef: this.currentMask,
      currentMask: (_this$currentMask4 = this.currentMask) === null || _this$currentMask4 === void 0 ? void 0 : _this$currentMask4.state
    });
  }
  set state(state) {
    const {
        compiledMasks,
        currentMaskRef,
        currentMask
      } = state,
      maskedState = (0,_rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__._)(state, _excluded);
    this.compiledMasks.forEach((m, mi) => m.state = compiledMasks[mi]);
    if (currentMaskRef != null) {
      this.currentMask = currentMaskRef;
      this.currentMask.state = currentMask;
    }
    super.state = maskedState;
  }

  /**
    @override
  */
  extractInput() {
    return this.currentMask ? this.currentMask.extractInput(...arguments) : '';
  }

  /**
    @override
  */
  extractTail() {
    return this.currentMask ? this.currentMask.extractTail(...arguments) : super.extractTail(...arguments);
  }

  /**
    @override
  */
  doCommit() {
    if (this.currentMask) this.currentMask.doCommit();
    super.doCommit();
  }

  /**
    @override
  */
  nearestInputPos() {
    return this.currentMask ? this.currentMask.nearestInputPos(...arguments) : super.nearestInputPos(...arguments);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : super.overwrite;
  }
  set overwrite(overwrite) {
    console.warn('"overwrite" option is not available in dynamic mask, use this option in siblings');
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : super.eager;
  }
  set eager(eager) {
    console.warn('"eager" option is not available in dynamic mask, use this option in siblings');
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : super.skipInvalid;
  }
  set skipInvalid(skipInvalid) {
    if (this.isInitialized || skipInvalid !== _base_js__WEBPACK_IMPORTED_MODULE_4__["default"].DEFAULTS.skipInvalid) {
      console.warn('"skipInvalid" option is not available in dynamic mask, use this option in siblings');
    }
  }

  /**
    @override
  */
  maskEquals(mask) {
    return Array.isArray(mask) && this.compiledMasks.every((m, mi) => {
      if (!mask[mi]) return;
      const _mask$mi = mask[mi],
        {
          mask: oldMask
        } = _mask$mi,
        restOpts = (0,_rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__._)(_mask$mi, _excluded2);
      return (0,_core_utils_js__WEBPACK_IMPORTED_MODULE_1__.objectIncludes)(m, restOpts) && m.maskEquals(oldMask);
    });
  }

  /**
    @override
  */
  typedValueEquals(value) {
    var _this$currentMask5;
    return Boolean((_this$currentMask5 = this.currentMask) === null || _this$currentMask5 === void 0 ? void 0 : _this$currentMask5.typedValueEquals(value));
  }
}
MaskedDynamic.DEFAULTS = {
  dispatch: (appended, masked, flags, tail) => {
    if (!masked.compiledMasks.length) return;
    const inputValue = masked.rawInputValue;

    // simulate input
    const inputs = masked.compiledMasks.map((m, index) => {
      const isCurrent = masked.currentMask === m;
      const startInputPos = isCurrent ? m.value.length : m.nearestInputPos(m.value.length, _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.FORCE_LEFT);
      if (m.rawInputValue !== inputValue) {
        m.reset();
        m.append(inputValue, {
          raw: true
        });
      } else if (!isCurrent) {
        m.remove(startInputPos);
      }
      m.append(appended, masked.currentMaskFlags(flags));
      m.appendTail(tail);
      return {
        index,
        weight: m.rawInputValue.length,
        totalInputPositions: m.totalInputPositions(0, Math.max(startInputPos, m.nearestInputPos(m.value.length, _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.FORCE_LEFT)))
      };
    });

    // pop masks with longer values first
    inputs.sort((i1, i2) => i2.weight - i1.weight || i2.totalInputPositions - i1.totalInputPositions);
    return masked.compiledMasks[inputs[0].index];
  }
};
_core_holder_js__WEBPACK_IMPORTED_MODULE_5__["default"].MaskedDynamic = MaskedDynamic;


/***/ }),

/***/ "./node_modules/imask/esm/masked/enum.js":
/*!***********************************************!*\
  !*** ./node_modules/imask/esm/masked/enum.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskedEnum)
/* harmony export */ });
/* harmony import */ var _pattern_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pattern.js */ "./node_modules/imask/esm/masked/pattern.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pattern/input-definition.js */ "./node_modules/imask/esm/masked/pattern/input-definition.js");
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _pattern_fixed_definition_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pattern/fixed-definition.js */ "./node_modules/imask/esm/masked/pattern/fixed-definition.js");
/* harmony import */ var _pattern_chunk_tail_details_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pattern/chunk-tail-details.js */ "./node_modules/imask/esm/masked/pattern/chunk-tail-details.js");
/* harmony import */ var _pattern_cursor_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pattern/cursor.js */ "./node_modules/imask/esm/masked/pattern/cursor.js");
/* harmony import */ var _regexp_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./regexp.js */ "./node_modules/imask/esm/masked/regexp.js");














/** Pattern which validates enum values */
class MaskedEnum extends _pattern_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /**
    @override
    @param {Object} opts
  */
  _update(opts) {
    // TODO type
    if (opts.enum) opts.mask = '*'.repeat(opts.enum[0].length);
    super._update(opts);
  }

  /**
    @override
  */
  doValidate() {
    return this.enum.some(e => e.indexOf(this.unmaskedValue) >= 0) && super.doValidate(...arguments);
  }
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedEnum = MaskedEnum;


/***/ }),

/***/ "./node_modules/imask/esm/masked/factory.js":
/*!**************************************************!*\
  !*** ./node_modules/imask/esm/masked/factory.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createMask),
/* harmony export */   "maskedClass": () => (/* binding */ maskedClass)
/* harmony export */ });
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");




/** Get Masked class by mask type */
function maskedClass(mask) {
  if (mask == null) {
    throw new Error('mask property should be defined');
  }

  // $FlowFixMe
  if (mask instanceof RegExp) return _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedRegExp;
  // $FlowFixMe
  if ((0,_core_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(mask)) return _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedPattern;
  // $FlowFixMe
  if (mask instanceof Date || mask === Date) return _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedDate;
  // $FlowFixMe
  if (mask instanceof Number || typeof mask === 'number' || mask === Number) return _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedNumber;
  // $FlowFixMe
  if (Array.isArray(mask) || mask === Array) return _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedDynamic;
  // $FlowFixMe
  if (_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].Masked && mask.prototype instanceof _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].Masked) return mask;
  // $FlowFixMe
  if (mask instanceof _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].Masked) return mask.constructor;
  // $FlowFixMe
  if (mask instanceof Function) return _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedFunction;
  console.warn('Mask not found for mask', mask); // eslint-disable-line no-console
  // $FlowFixMe
  return _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].Masked;
}

/** Creates new {@link Masked} depending on mask type */
function createMask(opts) {
  // $FlowFixMe
  if (_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].Masked && opts instanceof _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].Masked) return opts;
  opts = Object.assign({}, opts);
  const mask = opts.mask;

  // $FlowFixMe
  if (_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].Masked && mask instanceof _core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].Masked) return mask;
  const MaskedClass = maskedClass(mask);
  if (!MaskedClass) throw new Error('Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask.');
  return new MaskedClass(opts);
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].createMask = createMask;


/***/ }),

/***/ "./node_modules/imask/esm/masked/function.js":
/*!***************************************************!*\
  !*** ./node_modules/imask/esm/masked/function.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskedFunction)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");






/** Masking by custom Function */
class MaskedFunction extends _base_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /**
    @override
    @param {Object} opts
  */
  _update(opts) {
    if (opts.mask) opts.validate = opts.mask;
    super._update(opts);
  }
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedFunction = MaskedFunction;


/***/ }),

/***/ "./node_modules/imask/esm/masked/number.js":
/*!*************************************************!*\
  !*** ./node_modules/imask/esm/masked/number.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskedNumber)
/* harmony export */ });
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");






/**
  Number mask
  @param {Object} opts
  @param {string} opts.radix - Single char
  @param {string} opts.thousandsSeparator - Single char
  @param {Array<string>} opts.mapToRadix - Array of single chars
  @param {number} opts.min
  @param {number} opts.max
  @param {number} opts.scale - Digits after point
  @param {boolean} opts.signed - Allow negative
  @param {boolean} opts.normalizeZeros - Flag to remove leading and trailing zeros in the end of editing
  @param {boolean} opts.padFractionalZeros - Flag to pad trailing zeros after point in the end of editing
*/
class MaskedNumber extends _base_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
  /** Single char */

  /** Single char */

  /** Array of single chars */

  /** */

  /** */

  /** Digits after point */

  /** */

  /** Flag to remove leading and trailing zeros in the end of editing */

  /** Flag to pad trailing zeros after point in the end of editing */

  constructor(opts) {
    super(Object.assign({}, MaskedNumber.DEFAULTS, opts));
  }

  /**
    @override
  */
  _update(opts) {
    super._update(opts);
    this._updateRegExps();
  }

  /** */
  _updateRegExps() {
    let start = '^' + (this.allowNegative ? '[+|\\-]?' : '');
    let mid = '\\d*';
    let end = (this.scale ? "(".concat((0,_core_utils_js__WEBPACK_IMPORTED_MODULE_0__.escapeRegExp)(this.radix), "\\d{0,").concat(this.scale, "})?") : '') + '$';
    this._numberRegExp = new RegExp(start + mid + end);
    this._mapToRadixRegExp = new RegExp("[".concat(this.mapToRadix.map(_core_utils_js__WEBPACK_IMPORTED_MODULE_0__.escapeRegExp).join(''), "]"), 'g');
    this._thousandsSeparatorRegExp = new RegExp((0,_core_utils_js__WEBPACK_IMPORTED_MODULE_0__.escapeRegExp)(this.thousandsSeparator), 'g');
  }

  /** */
  _removeThousandsSeparators(value) {
    return value.replace(this._thousandsSeparatorRegExp, '');
  }

  /** */
  _insertThousandsSeparators(value) {
    // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    const parts = value.split(this.radix);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    return parts.join(this.radix);
  }

  /**
    @override
  */
  doPrepare(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ch = this._removeThousandsSeparators(this.scale && this.mapToRadix.length && (
    /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */
    flags.input && flags.raw || !flags.input && !flags.raw) ? ch.replace(this._mapToRadixRegExp, this.radix) : ch);
    const [prepCh, details] = (0,_core_utils_js__WEBPACK_IMPORTED_MODULE_0__.normalizePrepare)(super.doPrepare(ch, flags));
    if (ch && !prepCh) details.skip = true;
    return [prepCh, details];
  }

  /** */
  _separatorsCount(to) {
    let extendOnSeparators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let count = 0;
    for (let pos = 0; pos < to; ++pos) {
      if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
        ++count;
        if (extendOnSeparators) to += this.thousandsSeparator.length;
      }
    }
    return count;
  }

  /** */
  _separatorsCountFromSlice() {
    let slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._value;
    return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
  }

  /**
    @override
  */
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    let flags = arguments.length > 2 ? arguments[2] : undefined;
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    return this._removeThousandsSeparators(super.extractInput(fromPos, toPos, flags));
  }

  /**
    @override
  */
  _appendCharRaw(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!this.thousandsSeparator) return super._appendCharRaw(ch, flags);
    const prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
    this._value = this._removeThousandsSeparators(this.value);
    const appendDetails = super._appendCharRaw(ch, flags);
    this._value = this._insertThousandsSeparators(this._value);
    const beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
    appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
    appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
    return appendDetails;
  }

  /** */
  _findSeparatorAround(pos) {
    if (this.thousandsSeparator) {
      const searchFrom = pos - this.thousandsSeparator.length + 1;
      const separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
      if (separatorPos <= pos) return separatorPos;
    }
    return -1;
  }
  _adjustRangeWithSeparators(from, to) {
    const separatorAroundFromPos = this._findSeparatorAround(from);
    if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
    const separatorAroundToPos = this._findSeparatorAround(to);
    if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
    return [from, to];
  }

  /**
    @override
  */
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    const valueBeforePos = this.value.slice(0, fromPos);
    const valueAfterPos = this.value.slice(toPos);
    const prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
    this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
    return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
      tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
    });
  }

  /**
    @override
  */
  nearestInputPos(cursorPos, direction) {
    if (!this.thousandsSeparator) return cursorPos;
    switch (direction) {
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.NONE:
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.LEFT:
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.FORCE_LEFT:
        {
          const separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
          if (separatorAtLeftPos >= 0) {
            const separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
            if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.FORCE_LEFT) {
              return separatorAtLeftPos;
            }
          }
          break;
        }
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.RIGHT:
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.FORCE_RIGHT:
        {
          const separatorAtRightPos = this._findSeparatorAround(cursorPos);
          if (separatorAtRightPos >= 0) {
            return separatorAtRightPos + this.thousandsSeparator.length;
          }
        }
    }
    return cursorPos;
  }

  /**
    @override
  */
  doValidate(flags) {
    // validate as string
    let valid = Boolean(this._removeThousandsSeparators(this.value).match(this._numberRegExp));
    if (valid) {
      // validate as number
      const number = this.number;
      valid = valid && !isNaN(number) && (
      // check min bound for negative values
      this.min == null || this.min >= 0 || this.min <= this.number) && (
      // check max bound for positive values
      this.max == null || this.max <= 0 || this.number <= this.max);
    }
    return valid && super.doValidate(flags);
  }

  /**
    @override
  */
  doCommit() {
    if (this.value) {
      const number = this.number;
      let validnum = number;

      // check bounds
      if (this.min != null) validnum = Math.max(validnum, this.min);
      if (this.max != null) validnum = Math.min(validnum, this.max);
      if (validnum !== number) this.unmaskedValue = this.doFormat(validnum);
      let formatted = this.value;
      if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
      if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
      this._value = formatted;
    }
    super.doCommit();
  }

  /** */
  _normalizeZeros(value) {
    const parts = this._removeThousandsSeparators(value).split(this.radix);

    // remove leading zeros
    parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, (match, sign, zeros, num) => sign + num);
    // add leading zero
    if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + '0';
    if (parts.length > 1) {
      parts[1] = parts[1].replace(/0*$/, ''); // remove trailing zeros
      if (!parts[1].length) parts.length = 1; // remove fractional
    }

    return this._insertThousandsSeparators(parts.join(this.radix));
  }

  /** */
  _padFractionalZeros(value) {
    if (!value) return value;
    const parts = value.split(this.radix);
    if (parts.length < 2) parts.push('');
    parts[1] = parts[1].padEnd(this.scale, '0');
    return parts.join(this.radix);
  }

  /** */
  doSkipInvalid(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let checkTail = arguments.length > 2 ? arguments[2] : undefined;
    const dropFractional = this.scale === 0 && ch !== this.thousandsSeparator && (ch === this.radix || ch === MaskedNumber.UNMASKED_RADIX || this.mapToRadix.includes(ch));
    return super.doSkipInvalid(ch, flags, checkTail) && !dropFractional;
  }

  /**
    @override
  */
  get unmaskedValue() {
    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }

  /**
    @override
  */
  get typedValue() {
    return this.doParse(this.unmaskedValue);
  }
  set typedValue(n) {
    this.rawInputValue = this.doFormat(n).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
  }

  /** Parsed Number */
  get number() {
    return this.typedValue;
  }
  set number(number) {
    this.typedValue = number;
  }

  /**
    Is negative allowed
    @readonly
  */
  get allowNegative() {
    return this.signed || this.min != null && this.min < 0 || this.max != null && this.max < 0;
  }

  /**
    @override
  */
  typedValueEquals(value) {
    // handle  0 -> '' case (typed = 0 even if value = '')
    // for details see https://github.com/uNmAnNeR/imaskjs/issues/134
    return (super.typedValueEquals(value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(value === 0 && this.value === '');
  }
}
MaskedNumber.UNMASKED_RADIX = '.';
MaskedNumber.DEFAULTS = {
  radix: ',',
  thousandsSeparator: '',
  mapToRadix: [MaskedNumber.UNMASKED_RADIX],
  scale: 2,
  signed: false,
  normalizeZeros: true,
  padFractionalZeros: false,
  parse: Number,
  format: n => n.toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits: 20
  })
};
MaskedNumber.EMPTY_VALUES = [..._base_js__WEBPACK_IMPORTED_MODULE_2__["default"].EMPTY_VALUES, 0];
_core_holder_js__WEBPACK_IMPORTED_MODULE_3__["default"].MaskedNumber = MaskedNumber;


/***/ }),

/***/ "./node_modules/imask/esm/masked/pattern.js":
/*!**************************************************!*\
  !*** ./node_modules/imask/esm/masked/pattern.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskedPattern)
/* harmony export */ });
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pattern/input-definition.js */ "./node_modules/imask/esm/masked/pattern/input-definition.js");
/* harmony import */ var _pattern_fixed_definition_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pattern/fixed-definition.js */ "./node_modules/imask/esm/masked/pattern/fixed-definition.js");
/* harmony import */ var _pattern_chunk_tail_details_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pattern/chunk-tail-details.js */ "./node_modules/imask/esm/masked/pattern/chunk-tail-details.js");
/* harmony import */ var _pattern_cursor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pattern/cursor.js */ "./node_modules/imask/esm/masked/pattern/cursor.js");
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _regexp_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./regexp.js */ "./node_modules/imask/esm/masked/regexp.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");












const _excluded = ["_blocks"];

/**
  Pattern mask
  @param {Object} opts
  @param {Object} opts.blocks
  @param {Object} opts.definitions
  @param {string} opts.placeholderChar
  @param {string} opts.displayChar
  @param {boolean} opts.lazy
*/
class MaskedPattern extends _base_js__WEBPACK_IMPORTED_MODULE_3__["default"] {
  /** */

  /** */

  /** Single char for empty input */

  /** Single char for filled input */

  /** Show placeholder only when needed */

  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // TODO type $Shape<MaskedPatternOptions>={} does not work
    opts.definitions = Object.assign({}, _pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_INPUT_DEFINITIONS, opts.definitions);
    super(Object.assign({}, MaskedPattern.DEFAULTS, opts));
  }

  /**
    @override
    @param {Object} opts
  */
  _update() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    opts.definitions = Object.assign({}, this.definitions, opts.definitions);
    super._update(opts);
    this._rebuildMask();
  }

  /** */
  _rebuildMask() {
    const defs = this.definitions;
    this._blocks = [];
    this._stops = [];
    this._maskedBlocks = {};
    let pattern = this.mask;
    if (!pattern || !defs) return;
    let unmaskingBlock = false;
    let optionalBlock = false;
    for (let i = 0; i < pattern.length; ++i) {
      var _defs$char, _defs$char2;
      if (this.blocks) {
        const p = pattern.slice(i);
        const bNames = Object.keys(this.blocks).filter(bName => p.indexOf(bName) === 0);
        // order by key length
        bNames.sort((a, b) => b.length - a.length);
        // use block name with max length
        const bName = bNames[0];
        if (bName) {
          // $FlowFixMe no ideas
          const maskedBlock = (0,_factory_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({
            parent: this,
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite
          }, this.blocks[bName]));
          if (maskedBlock) {
            this._blocks.push(maskedBlock);

            // store block index
            if (!this._maskedBlocks[bName]) this._maskedBlocks[bName] = [];
            this._maskedBlocks[bName].push(this._blocks.length - 1);
          }
          i += bName.length - 1;
          continue;
        }
      }
      let char = pattern[i];
      let isInput = (char in defs);
      if (char === MaskedPattern.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (char === '{' || char === '}') {
        unmaskingBlock = !unmaskingBlock;
        continue;
      }
      if (char === '[' || char === ']') {
        optionalBlock = !optionalBlock;
        continue;
      }
      if (char === MaskedPattern.ESCAPE_CHAR) {
        ++i;
        char = pattern[i];
        if (!char) break;
        isInput = false;
      }
      const maskOpts = (_defs$char = defs[char]) !== null && _defs$char !== void 0 && _defs$char.mask && !(((_defs$char2 = defs[char]) === null || _defs$char2 === void 0 ? void 0 : _defs$char2.mask.prototype) instanceof _core_holder_js__WEBPACK_IMPORTED_MODULE_9__["default"].Masked) ? defs[char] : {
        mask: defs[char]
      };
      const def = isInput ? new _pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_4__["default"](Object.assign({
        parent: this,
        isOptional: optionalBlock,
        lazy: this.lazy,
        eager: this.eager,
        placeholderChar: this.placeholderChar,
        displayChar: this.displayChar
      }, maskOpts)) : new _pattern_fixed_definition_js__WEBPACK_IMPORTED_MODULE_5__["default"]({
        char,
        eager: this.eager,
        isUnmasking: unmaskingBlock
      });
      this._blocks.push(def);
    }
  }

  /**
    @override
  */
  get state() {
    return Object.assign({}, super.state, {
      _blocks: this._blocks.map(b => b.state)
    });
  }
  set state(state) {
    const {
        _blocks
      } = state,
      maskedState = (0,_rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__._)(state, _excluded);
    this._blocks.forEach((b, bi) => b.state = _blocks[bi]);
    super.state = maskedState;
  }

  /**
    @override
  */
  reset() {
    super.reset();
    this._blocks.forEach(b => b.reset());
  }

  /**
    @override
  */
  get isComplete() {
    return this._blocks.every(b => b.isComplete);
  }

  /**
    @override
  */
  get isFilled() {
    return this._blocks.every(b => b.isFilled);
  }
  get isFixed() {
    return this._blocks.every(b => b.isFixed);
  }
  get isOptional() {
    return this._blocks.every(b => b.isOptional);
  }

  /**
    @override
  */
  doCommit() {
    this._blocks.forEach(b => b.doCommit());
    super.doCommit();
  }

  /**
    @override
  */
  get unmaskedValue() {
    return this._blocks.reduce((str, b) => str += b.unmaskedValue, '');
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }

  /**
    @override
  */
  get value() {
    // TODO return _value when not in change?
    return this._blocks.reduce((str, b) => str += b.value, '');
  }
  set value(value) {
    super.value = value;
  }
  get displayValue() {
    return this._blocks.reduce((str, b) => str += b.displayValue, '');
  }

  /**
    @override
  */
  appendTail(tail) {
    return super.appendTail(tail).aggregate(this._appendPlaceholder());
  }

  /**
    @override
  */
  _appendEager() {
    var _this$_mapPosToBlock;
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    let startBlockIndex = (_this$_mapPosToBlock = this._mapPosToBlock(this.value.length)) === null || _this$_mapPosToBlock === void 0 ? void 0 : _this$_mapPosToBlock.index;
    if (startBlockIndex == null) return details;

    // TODO test if it works for nested pattern masks
    if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
    for (let bi = startBlockIndex; bi < this._blocks.length; ++bi) {
      const d = this._blocks[bi]._appendEager();
      if (!d.inserted) break;
      details.aggregate(d);
    }
    return details;
  }

  /**
    @override
  */
  _appendCharRaw(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const blockIter = this._mapPosToBlock(this.value.length);
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    if (!blockIter) return details;
    for (let bi = blockIter.index;; ++bi) {
      var _flags$_beforeTailSta, _flags$_beforeTailSta2;
      const block = this._blocks[bi];
      if (!block) break;
      const blockDetails = block._appendChar(ch, Object.assign({}, flags, {
        _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) === null || _flags$_beforeTailSta === void 0 ? void 0 : (_flags$_beforeTailSta2 = _flags$_beforeTailSta._blocks) === null || _flags$_beforeTailSta2 === void 0 ? void 0 : _flags$_beforeTailSta2[bi]
      }));
      const skip = blockDetails.skip;
      details.aggregate(blockDetails);
      if (skip || blockDetails.rawInserted) break; // go next char
    }

    return details;
  }

  /**
    @override
  */
  extractTail() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    const chunkTail = new _pattern_chunk_tail_details_js__WEBPACK_IMPORTED_MODULE_6__["default"]();
    if (fromPos === toPos) return chunkTail;
    this._forEachBlocksInRange(fromPos, toPos, (b, bi, bFromPos, bToPos) => {
      const blockChunk = b.extractTail(bFromPos, bToPos);
      blockChunk.stop = this._findStopBefore(bi);
      blockChunk.from = this._blockStartPos(bi);
      if (blockChunk instanceof _pattern_chunk_tail_details_js__WEBPACK_IMPORTED_MODULE_6__["default"]) blockChunk.blockIndex = bi;
      chunkTail.extend(blockChunk);
    });
    return chunkTail;
  }

  /**
    @override
  */
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    let flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (fromPos === toPos) return '';
    let input = '';
    this._forEachBlocksInRange(fromPos, toPos, (b, _, fromPos, toPos) => {
      input += b.extractInput(fromPos, toPos, flags);
    });
    return input;
  }
  _findStopBefore(blockIndex) {
    let stopBefore;
    for (let si = 0; si < this._stops.length; ++si) {
      const stop = this._stops[si];
      if (stop <= blockIndex) stopBefore = stop;else break;
    }
    return stopBefore;
  }

  /** Appends placeholder depending on laziness */
  _appendPlaceholder(toBlockIndex) {
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    if (this.lazy && toBlockIndex == null) return details;
    const startBlockIter = this._mapPosToBlock(this.value.length);
    if (!startBlockIter) return details;
    const startBlockIndex = startBlockIter.index;
    const endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;
    this._blocks.slice(startBlockIndex, endBlockIndex).forEach(b => {
      if (!b.lazy || toBlockIndex != null) {
        // $FlowFixMe `_blocks` may not be present
        const args = b._blocks != null ? [b._blocks.length] : [];
        const bDetails = b._appendPlaceholder(...args);
        this._value += bDetails.inserted;
        details.aggregate(bDetails);
      }
    });
    return details;
  }

  /** Finds block in pos */
  _mapPosToBlock(pos) {
    let accVal = '';
    for (let bi = 0; bi < this._blocks.length; ++bi) {
      const block = this._blocks[bi];
      const blockStartPos = accVal.length;
      accVal += block.value;
      if (pos <= accVal.length) {
        return {
          index: bi,
          offset: pos - blockStartPos
        };
      }
    }
  }

  /** */
  _blockStartPos(blockIndex) {
    return this._blocks.slice(0, blockIndex).reduce((pos, b) => pos += b.value.length, 0);
  }

  /** */
  _forEachBlocksInRange(fromPos) {
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    let fn = arguments.length > 2 ? arguments[2] : undefined;
    const fromBlockIter = this._mapPosToBlock(fromPos);
    if (fromBlockIter) {
      const toBlockIter = this._mapPosToBlock(toPos);
      // process first block
      const isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
      const fromBlockStartPos = fromBlockIter.offset;
      const fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].value.length;
      fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
      if (toBlockIter && !isSameBlock) {
        // process intermediate blocks
        for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
          fn(this._blocks[bi], bi, 0, this._blocks[bi].value.length);
        }

        // process last block
        fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
      }
    }
  }

  /**
    @override
  */
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    const removeDetails = super.remove(fromPos, toPos);
    this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
      removeDetails.aggregate(b.remove(bFromPos, bToPos));
    });
    return removeDetails;
  }

  /**
    @override
  */
  nearestInputPos(cursorPos) {
    let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.NONE;
    if (!this._blocks.length) return 0;
    const cursor = new _pattern_cursor_js__WEBPACK_IMPORTED_MODULE_7__["default"](this, cursorPos);
    if (direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.NONE) {
      // -------------------------------------------------
      // NONE should only go out from fixed to the right!
      // -------------------------------------------------
      if (cursor.pushRightBeforeInput()) return cursor.pos;
      cursor.popState();
      if (cursor.pushLeftBeforeInput()) return cursor.pos;
      return this.value.length;
    }

    // FORCE is only about a|* otherwise is 0
    if (direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.LEFT || direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.FORCE_LEFT) {
      // try to break fast when *|a
      if (direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.LEFT) {
        cursor.pushRightBeforeFilled();
        if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
        cursor.popState();
      }

      // forward flow
      cursor.pushLeftBeforeInput();
      cursor.pushLeftBeforeRequired();
      cursor.pushLeftBeforeFilled();

      // backward flow
      if (direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.LEFT) {
        cursor.pushRightBeforeInput();
        cursor.pushRightBeforeRequired();
        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
        cursor.popState();
        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
        cursor.popState();
      }
      if (cursor.ok) return cursor.pos;
      if (direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.FORCE_LEFT) return 0;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      cursor.popState();
      if (cursor.ok) return cursor.pos;

      // cursor.popState();
      // if (
      //   cursor.pushRightBeforeInput() &&
      //   // TODO HACK for lazy if has aligned left inside fixed and has came to the start - use start position
      //   (!this.lazy || this.extractInput())
      // ) return cursor.pos;

      return 0;
    }
    if (direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.RIGHT || direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.FORCE_RIGHT) {
      // forward flow
      cursor.pushRightBeforeInput();
      cursor.pushRightBeforeRequired();
      if (cursor.pushRightBeforeFilled()) return cursor.pos;
      if (direction === _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.FORCE_RIGHT) return this.value.length;

      // backward flow
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      return this.nearestInputPos(cursorPos, _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.LEFT);
    }
    return cursorPos;
  }

  /**
    @override
  */
  totalInputPositions() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    let total = 0;
    this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
      total += b.totalInputPositions(bFromPos, bToPos);
    });
    return total;
  }

  /** Get block by name */
  maskedBlock(name) {
    return this.maskedBlocks(name)[0];
  }

  /** Get all blocks by name */
  maskedBlocks(name) {
    const indices = this._maskedBlocks[name];
    if (!indices) return [];
    return indices.map(gi => this._blocks[gi]);
  }
}
MaskedPattern.DEFAULTS = {
  lazy: true,
  placeholderChar: '_'
};
MaskedPattern.STOP_CHAR = '`';
MaskedPattern.ESCAPE_CHAR = '\\';
MaskedPattern.InputDefinition = _pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_4__["default"];
MaskedPattern.FixedDefinition = _pattern_fixed_definition_js__WEBPACK_IMPORTED_MODULE_5__["default"];
_core_holder_js__WEBPACK_IMPORTED_MODULE_9__["default"].MaskedPattern = MaskedPattern;


/***/ }),

/***/ "./node_modules/imask/esm/masked/pattern/chunk-tail-details.js":
/*!*********************************************************************!*\
  !*** ./node_modules/imask/esm/masked/pattern/chunk-tail-details.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChunksTailDetails)
/* harmony export */ });
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/holder.js */ "./node_modules/imask/esm/core/holder.js");





const _excluded = ["chunks"];
class ChunksTailDetails {
  /** */

  constructor() {
    let chunks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    this.chunks = chunks;
    this.from = from;
  }
  toString() {
    return this.chunks.map(String).join('');
  }

  // $FlowFixMe no ideas
  extend(tailChunk) {
    if (!String(tailChunk)) return;
    if ((0,_core_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(tailChunk)) tailChunk = new _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_3__["default"](String(tailChunk));
    const lastChunk = this.chunks[this.chunks.length - 1];
    const extendLast = lastChunk && (
    // if stops are same or tail has no stop
    lastChunk.stop === tailChunk.stop || tailChunk.stop == null) &&
    // if tail chunk goes just after last chunk
    tailChunk.from === lastChunk.from + lastChunk.toString().length;
    if (tailChunk instanceof _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_3__["default"]) {
      // check the ability to extend previous chunk
      if (extendLast) {
        // extend previous chunk
        lastChunk.extend(tailChunk.toString());
      } else {
        // append new chunk
        this.chunks.push(tailChunk);
      }
    } else if (tailChunk instanceof ChunksTailDetails) {
      if (tailChunk.stop == null) {
        // unwrap floating chunks to parent, keeping `from` pos
        let firstTailChunk;
        while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
          firstTailChunk = tailChunk.chunks.shift();
          firstTailChunk.from += tailChunk.from;
          this.extend(firstTailChunk);
        }
      }

      // if tail chunk still has value
      if (tailChunk.toString()) {
        // if chunks contains stops, then popup stop to container
        tailChunk.stop = tailChunk.blockIndex;
        this.chunks.push(tailChunk);
      }
    }
  }
  appendTo(masked) {
    // $FlowFixMe
    if (!(masked instanceof _core_holder_js__WEBPACK_IMPORTED_MODULE_4__["default"].MaskedPattern)) {
      const tail = new _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_3__["default"](this.toString());
      return tail.appendTo(masked);
    }
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
    for (let ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
      const chunk = this.chunks[ci];
      const lastBlockIter = masked._mapPosToBlock(masked.value.length);
      const stop = chunk.stop;
      let chunkBlock;
      if (stop != null && (
      // if block not found or stop is behind lastBlock
      !lastBlockIter || lastBlockIter.index <= stop)) {
        if (chunk instanceof ChunksTailDetails ||
        // for continuous block also check if stop is exist
        masked._stops.indexOf(stop) >= 0) {
          const phDetails = masked._appendPlaceholder(stop);
          details.aggregate(phDetails);
        }
        chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
      }
      if (chunkBlock) {
        const tailDetails = chunkBlock.appendTail(chunk);
        tailDetails.skip = false; // always ignore skip, it will be set on last
        details.aggregate(tailDetails);
        masked._value += tailDetails.inserted;

        // get not inserted chars
        const remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
        if (remainChars) details.aggregate(masked.append(remainChars, {
          tail: true
        }));
      } else {
        details.aggregate(masked.append(chunk.toString(), {
          tail: true
        }));
      }
    }
    return details;
  }
  get state() {
    return {
      chunks: this.chunks.map(c => c.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex
    };
  }
  set state(state) {
    const {
        chunks
      } = state,
      props = (0,_rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__._)(state, _excluded);
    Object.assign(this, props);
    this.chunks = chunks.map(cstate => {
      const chunk = "chunks" in cstate ? new ChunksTailDetails() : new _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_3__["default"]();
      // $FlowFixMe already checked above
      chunk.state = cstate;
      return chunk;
    });
  }
  unshift(beforePos) {
    if (!this.chunks.length || beforePos != null && this.from >= beforePos) return '';
    const chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
    let ci = 0;
    while (ci < this.chunks.length) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.unshift(chunkShiftPos);
      if (chunk.toString()) {
        // chunk still contains value
        // but not shifted - means no more available chars to shift
        if (!shiftChar) break;
        ++ci;
      } else {
        // clean if chunk has no value
        this.chunks.splice(ci, 1);
      }
      if (shiftChar) return shiftChar;
    }
    return '';
  }
  shift() {
    if (!this.chunks.length) return '';
    let ci = this.chunks.length - 1;
    while (0 <= ci) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.shift();
      if (chunk.toString()) {
        // chunk still contains value
        // but not shifted - means no more available chars to shift
        if (!shiftChar) break;
        --ci;
      } else {
        // clean if chunk has no value
        this.chunks.splice(ci, 1);
      }
      if (shiftChar) return shiftChar;
    }
    return '';
  }
}


/***/ }),

/***/ "./node_modules/imask/esm/masked/pattern/cursor.js":
/*!*********************************************************!*\
  !*** ./node_modules/imask/esm/masked/pattern/cursor.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatternCursor)
/* harmony export */ });
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/holder.js */ "./node_modules/imask/esm/core/holder.js");



class PatternCursor {
  constructor(masked, pos) {
    this.masked = masked;
    this._log = [];
    const {
      offset,
      index
    } = masked._mapPosToBlock(pos) || (pos < 0 ?
    // first
    {
      index: 0,
      offset: 0
    } :
    // last
    {
      index: this.masked._blocks.length,
      offset: 0
    });
    this.offset = offset;
    this.index = index;
    this.ok = false;
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return {
      index: this.index,
      offset: this.offset,
      ok: this.ok
    };
  }
  set state(s) {
    Object.assign(this, s);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const s = this._log.pop();
    this.state = s;
    return s;
  }
  bindBlock() {
    if (this.block) return;
    if (this.index < 0) {
      this.index = 0;
      this.offset = 0;
    }
    if (this.index >= this.masked._blocks.length) {
      this.index = this.masked._blocks.length - 1;
      this.offset = this.block.value.length;
    }
  }
  _pushLeft(fn) {
    this.pushState();
    for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((_this$block = this.block) === null || _this$block === void 0 ? void 0 : _this$block.value.length) || 0) {
      var _this$block;
      if (fn()) return this.ok = true;
    }
    return this.ok = false;
  }
  _pushRight(fn) {
    this.pushState();
    for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) {
      if (fn()) return this.ok = true;
    }
    return this.ok = false;
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (this.block.isFixed || !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.FORCE_LEFT);
      if (this.offset !== 0) return true;
    });
  }
  pushLeftBeforeInput() {
    // cases:
    // filled input: 00|
    // optional empty input: 00[]|
    // nested block: XX<[]>|
    return this._pushLeft(() => {
      if (this.block.isFixed) return;
      this.offset = this.block.nearestInputPos(this.offset, _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.LEFT);
      return true;
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.LEFT);
      return true;
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (this.block.isFixed || !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.FORCE_RIGHT);
      if (this.offset !== this.block.value.length) return true;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (this.block.isFixed) return;

      // const o = this.offset;
      this.offset = this.block.nearestInputPos(this.offset, _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.NONE);
      // HACK cases like (STILL DOES NOT WORK FOR NESTED)
      // aa|X
      // aa<X|[]>X_    - this will not work
      // if (o && o === this.offset && this.block instanceof PatternInputDefinition) continue;
      return true;
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value) return;

      // TODO check |[*]XX_
      this.offset = this.block.nearestInputPos(this.offset, _core_utils_js__WEBPACK_IMPORTED_MODULE_0__.DIRECTION.NONE);
      return true;
    });
  }
}


/***/ }),

/***/ "./node_modules/imask/esm/masked/pattern/fixed-definition.js":
/*!*******************************************************************!*\
  !*** ./node_modules/imask/esm/masked/pattern/fixed-definition.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatternFixedDefinition)
/* harmony export */ });
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/holder.js */ "./node_modules/imask/esm/core/holder.js");





/** */

class PatternFixedDefinition {
  /** */

  /** */

  /** */

  /** */

  /** */

  /** */

  constructor(opts) {
    Object.assign(this, opts);
    this._value = '';
    this.isFixed = true;
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : '';
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    this._isRawInput = false;
    this._value = '';
  }
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
    this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
    if (!this._value) this._isRawInput = false;
    return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  nearestInputPos(cursorPos) {
    let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.NONE;
    const minPos = 0;
    const maxPos = this._value.length;
    switch (direction) {
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.LEFT:
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.FORCE_LEFT:
        return minPos;
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.NONE:
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.RIGHT:
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_1__.DIRECTION.FORCE_RIGHT:
      default:
        return maxPos;
    }
  }
  totalInputPositions() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
    return this._isRawInput ? toPos - fromPos : 0;
  }
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
    let flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || '';
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return Boolean(this._value);
  }
  _appendChar(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    if (this.isFilled) return details;
    const appendEager = this.eager === true || this.eager === 'append';
    const appended = this.char === ch;
    const isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !appendEager) && !flags.tail;
    if (isResolved) details.rawInserted = this.char;
    this._value = details.inserted = this.char;
    this._isRawInput = isResolved && (flags.raw || flags.input);
    return details;
  }
  _appendEager() {
    return this._appendChar(this.char, {
      tail: true
    });
  }
  _appendPlaceholder() {
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    if (this.isFilled) return details;
    this._value = details.inserted = this.char;
    return details;
  }
  extractTail() {
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    return new _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]('');
  }

  // $FlowFixMe no ideas
  appendTail(tail) {
    if ((0,_core_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(tail)) tail = new _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_2__["default"](String(tail));
    return tail.appendTo(this);
  }
  append(str, flags, tail) {
    const details = this._appendChar(str[0], flags);
    if (tail != null) {
      details.tailShift += this.appendTail(tail).tailShift;
    }
    return details;
  }
  doCommit() {}
  get state() {
    return {
      _value: this._value,
      _isRawInput: this._isRawInput
    };
  }
  set state(state) {
    Object.assign(this, state);
  }
}


/***/ }),

/***/ "./node_modules/imask/esm/masked/pattern/input-definition.js":
/*!*******************************************************************!*\
  !*** ./node_modules/imask/esm/masked/pattern/input-definition.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_INPUT_DEFINITIONS": () => (/* binding */ DEFAULT_INPUT_DEFINITIONS),
/* harmony export */   "default": () => (/* binding */ PatternInputDefinition)
/* harmony export */ });
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/holder.js */ "./node_modules/imask/esm/core/holder.js");





const _excluded = ["parent", "isOptional", "placeholderChar", "displayChar", "lazy", "eager"];

/** */

const DEFAULT_INPUT_DEFINITIONS = {
  '0': /\d/,
  'a': /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  '*': /./
};

/** */
class PatternInputDefinition {
  /** */

  /** */

  /** */

  /** */

  /** */

  /** */

  /** */

  /** */

  constructor(opts) {
    const {
        parent,
        isOptional,
        placeholderChar,
        displayChar,
        lazy,
        eager
      } = opts,
      maskOpts = (0,_rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_0__._)(opts, _excluded);
    this.masked = (0,_factory_js__WEBPACK_IMPORTED_MODULE_1__["default"])(maskOpts);
    Object.assign(this, {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager
    });
  }
  reset() {
    this.isFilled = false;
    this.masked.reset();
  }
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    if (fromPos === 0 && toPos >= 1) {
      this.isFilled = false;
      return this.masked.remove(fromPos, toPos);
    }
    return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
  }
  get value() {
    return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : '');
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get displayValue() {
    return this.masked.value && this.displayChar || this.value;
  }
  get isComplete() {
    return Boolean(this.masked.value) || this.isOptional;
  }
  _appendChar(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (this.isFilled) return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    const state = this.masked.state;
    // simulate input
    const details = this.masked._appendChar(ch, flags);
    if (details.inserted && this.doValidate(flags) === false) {
      details.inserted = details.rawInserted = '';
      this.masked.state = state;
    }
    if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
      details.inserted = this.placeholderChar;
    }
    details.skip = !details.inserted && !this.isOptional;
    this.isFilled = Boolean(details.inserted);
    return details;
  }
  append() {
    // TODO probably should be done via _appendChar
    return this.masked.append(...arguments);
  }
  _appendPlaceholder() {
    const details = new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    if (this.isFilled || this.isOptional) return details;
    this.isFilled = true;
    details.inserted = this.placeholderChar;
    return details;
  }
  _appendEager() {
    return new _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
  }
  extractTail() {
    return this.masked.extractTail(...arguments);
  }
  appendTail() {
    return this.masked.appendTail(...arguments);
  }
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    let flags = arguments.length > 2 ? arguments[2] : undefined;
    return this.masked.extractInput(fromPos, toPos, flags);
  }
  nearestInputPos(cursorPos) {
    let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _core_utils_js__WEBPACK_IMPORTED_MODULE_3__.DIRECTION.NONE;
    const minPos = 0;
    const maxPos = this.value.length;
    const boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
    switch (direction) {
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_3__.DIRECTION.LEFT:
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_3__.DIRECTION.FORCE_LEFT:
        return this.isComplete ? boundPos : minPos;
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_3__.DIRECTION.RIGHT:
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_3__.DIRECTION.FORCE_RIGHT:
        return this.isComplete ? boundPos : maxPos;
      case _core_utils_js__WEBPACK_IMPORTED_MODULE_3__.DIRECTION.NONE:
      default:
        return boundPos;
    }
  }
  totalInputPositions() {
    let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
    return this.value.slice(fromPos, toPos).length;
  }
  doValidate() {
    return this.masked.doValidate(...arguments) && (!this.parent || this.parent.doValidate(...arguments));
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      masked: this.masked.state,
      isFilled: this.isFilled
    };
  }
  set state(state) {
    this.masked.state = state.masked;
    this.isFilled = state.isFilled;
  }
}


/***/ }),

/***/ "./node_modules/imask/esm/masked/pipe.js":
/*!***********************************************!*\
  !*** ./node_modules/imask/esm/masked/pipe.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PIPE_TYPE": () => (/* binding */ PIPE_TYPE),
/* harmony export */   "createPipe": () => (/* binding */ createPipe),
/* harmony export */   "pipe": () => (/* binding */ pipe)
/* harmony export */ });
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");





/** Mask pipe source and destination types */
const PIPE_TYPE = {
  MASKED: 'value',
  UNMASKED: 'unmaskedValue',
  TYPED: 'typedValue'
};

/** Creates new pipe function depending on mask type, source and destination options */
function createPipe(mask) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PIPE_TYPE.MASKED;
  let to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PIPE_TYPE.MASKED;
  const masked = (0,_factory_js__WEBPACK_IMPORTED_MODULE_0__["default"])(mask);
  return value => masked.runIsolated(m => {
    m[from] = value;
    return m[to];
  });
}

/** Pipes value through mask depending on mask type, source and destination options */
function pipe(value) {
  for (var _len = arguments.length, pipeArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    pipeArgs[_key - 1] = arguments[_key];
  }
  return createPipe(...pipeArgs)(value);
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].PIPE_TYPE = PIPE_TYPE;
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].createPipe = createPipe;
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].pipe = pipe;


/***/ }),

/***/ "./node_modules/imask/esm/masked/range.js":
/*!************************************************!*\
  !*** ./node_modules/imask/esm/masked/range.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskedRange)
/* harmony export */ });
/* harmony import */ var _pattern_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pattern.js */ "./node_modules/imask/esm/masked/pattern.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _rollupPluginBabelHelpers_6b3bd404_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_rollupPluginBabelHelpers-6b3bd404.js */ "./node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js");
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _pattern_input_definition_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pattern/input-definition.js */ "./node_modules/imask/esm/masked/pattern/input-definition.js");
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./factory.js */ "./node_modules/imask/esm/masked/factory.js");
/* harmony import */ var _pattern_fixed_definition_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pattern/fixed-definition.js */ "./node_modules/imask/esm/masked/pattern/fixed-definition.js");
/* harmony import */ var _pattern_chunk_tail_details_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pattern/chunk-tail-details.js */ "./node_modules/imask/esm/masked/pattern/chunk-tail-details.js");
/* harmony import */ var _pattern_cursor_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pattern/cursor.js */ "./node_modules/imask/esm/masked/pattern/cursor.js");
/* harmony import */ var _regexp_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./regexp.js */ "./node_modules/imask/esm/masked/regexp.js");














/** Pattern which accepts ranges */
class MaskedRange extends _pattern_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /**
    Optionally sets max length of pattern.
    Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
  */

  /** Min bound */

  /** Max bound */

  /** */

  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }

  /**
    @override
  */
  _update(opts) {
    // TODO type
    opts = Object.assign({
      to: this.to || 0,
      from: this.from || 0,
      maxLength: this.maxLength || 0
    }, opts);
    let maxLength = String(opts.to).length;
    if (opts.maxLength != null) maxLength = Math.max(maxLength, opts.maxLength);
    opts.maxLength = maxLength;
    const fromStr = String(opts.from).padStart(maxLength, '0');
    const toStr = String(opts.to).padStart(maxLength, '0');
    let sameCharsCount = 0;
    while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) ++sameCharsCount;
    opts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, '\\0') + '0'.repeat(maxLength - sameCharsCount);
    super._update(opts);
  }

  /**
    @override
  */
  get isComplete() {
    return super.isComplete && Boolean(this.value);
  }
  boundaries(str) {
    let minstr = '';
    let maxstr = '';
    const [, placeholder, num] = str.match(/^(\D*)(\d*)(\D*)/) || [];
    if (num) {
      minstr = '0'.repeat(placeholder.length) + num;
      maxstr = '9'.repeat(placeholder.length) + num;
    }
    minstr = minstr.padEnd(this.maxLength, '0');
    maxstr = maxstr.padEnd(this.maxLength, '9');
    return [minstr, maxstr];
  }

  // TODO str is a single char everytime
  /**
    @override
  */
  doPrepare(ch) {
    let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let details;
    [ch, details] = (0,_core_utils_js__WEBPACK_IMPORTED_MODULE_2__.normalizePrepare)(super.doPrepare(ch.replace(/\D/g, ''), flags));
    if (!this.autofix || !ch) return ch;
    const fromStr = String(this.from).padStart(this.maxLength, '0');
    const toStr = String(this.to).padStart(this.maxLength, '0');
    let nextVal = this.value + ch;
    if (nextVal.length > this.maxLength) return '';
    const [minstr, maxstr] = this.boundaries(nextVal);
    if (Number(maxstr) < this.from) return fromStr[nextVal.length - 1];
    if (Number(minstr) > this.to) {
      if (this.autofix === 'pad' && nextVal.length < this.maxLength) {
        return ['', details.aggregate(this.append(fromStr[nextVal.length - 1] + ch, flags))];
      }
      return toStr[nextVal.length - 1];
    }
    return ch;
  }

  /**
    @override
  */
  doValidate() {
    const str = this.value;
    const firstNonZero = str.search(/[^0]/);
    if (firstNonZero === -1 && str.length <= this._matchFrom) return true;
    const [minstr, maxstr] = this.boundaries(str);
    return this.from <= Number(maxstr) && Number(minstr) <= this.to && super.doValidate(...arguments);
  }
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_3__["default"].MaskedRange = MaskedRange;


/***/ }),

/***/ "./node_modules/imask/esm/masked/regexp.js":
/*!*************************************************!*\
  !*** ./node_modules/imask/esm/masked/regexp.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MaskedRegExp)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/imask/esm/masked/base.js");
/* harmony import */ var _core_holder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/holder.js */ "./node_modules/imask/esm/core/holder.js");
/* harmony import */ var _core_change_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/change-details.js */ "./node_modules/imask/esm/core/change-details.js");
/* harmony import */ var _core_continuous_tail_details_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/continuous-tail-details.js */ "./node_modules/imask/esm/core/continuous-tail-details.js");
/* harmony import */ var _core_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/utils.js */ "./node_modules/imask/esm/core/utils.js");






/** Masking by RegExp */
class MaskedRegExp extends _base_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /**
    @override
    @param {Object} opts
  */
  _update(opts) {
    if (opts.mask) opts.validate = value => value.search(opts.mask) >= 0;
    super._update(opts);
  }
}
_core_holder_js__WEBPACK_IMPORTED_MODULE_1__["default"].MaskedRegExp = MaskedRegExp;


/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.mjs":
/*!***************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.mjs ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ api)
/* harmony export */ });
/*! js-cookie v3.0.5 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************************************************!*\
  !*** ./plg_system_nevigen_jshop_onestepcheckout/es6/main.es6 ***!
  \***************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.mjs");
/* harmony import */ var imask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! imask */ "./node_modules/imask/esm/index.js");
/*
 * @package    Nevigen JShop OneStepCheckout Package
 * @version    1.1.3
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */





class NevigenOneStepCheckout {
  constructor() {
    this.options = Joomla.getOptions('nevigen_onestepcheckout');
    this.controller = this.options && this.options.controller ? this.options.controller : false;
    this.csrf = this.options && this.options.csrf ? this.options.csrf : false;
    this.use_mask = this.options && this.options.use_mask ? this.options.use_mask : false;
    this.mask = this.use_mask && this.options.mask ? this.options.mask : false;
    this.rabatt = false;
    this.containerCartEditMeesage = document.querySelector('[data-nevigen-onestepcheckout-cart-edit="message"]');
    if (!this.containerCartEditMeesage) {
      this.containerCartEditMeesage = document.querySelector('[nevigen-onestepcheckout-cart-edit="message"]');
    }
    if (this.options.user === 0) {
      this.containerLoginMeesage = document.querySelector('[data-nevigen-onestepcheckout-login="message"]');
      if (!this.containerLoginMeesage) {
        this.containerLoginMeesage = document.querySelector('[nevigen-onestepcheckout-login="message"]');
      }
    }
    this.formValidationMessage = '';
    this.formValidation = true;
  }
  loadActions() {
    let nevigenOneStepCheckout = document.querySelector('form[name="nevigenOneStepCheckout"]');
    if (nevigenOneStepCheckout) {
      this.rabatt = nevigenOneStepCheckout.querySelector('input[name="rabatt"]');
      nevigenOneStepCheckout.addEventListener('submit', e => {
        e.preventDefault();
        if (document.formvalidator.isValid(document.querySelector('form[name="nevigenOneStepCheckout"]'))) {
          let agb = nevigenOneStepCheckout.querySelector('input[name="agb"][type="checkbox"]'),
            error = false;
          if (agb) {
            if (!agb.checked) {
              agb.classList.add('form-control-danger');
              agb.classList.add('invalid');
              error = true;
            } else {
              agb.classList.remove('form-control-danger');
              agb.classList.remove('invalid');
              error = false;
            }
          }
          let paymentValid = true;
          if (typeof jshop !== 'undefined') {
            document.forms['payment_form'] = document.forms['nevigenOneStepCheckout'];
            paymentValid = jshop.checkPaymentForm();
          }
          if (error === false && paymentValid === true) {
            this.setPreloader();
            nevigenOneStepCheckout.submit();
          }
        }
      });
      let addresses = nevigenOneStepCheckout.querySelector('[data-nevigen-onestepcheckout="address"]');
      if (addresses) {
        let addressFields = addresses.querySelectorAll('input, select,textarea');
        if (addressFields.length > 0) {
          addressFields.forEach(field => {
            let name = field.getAttribute('name');
            if (name) {
              if (this.use_mask && this.mask && this.use_mask.includes(name)) {
                (0,imask__WEBPACK_IMPORTED_MODULE_1__["default"])(field, {
                  mask: this.mask
                });
              }
              field.addEventListener('change', e => {
                this.saveFormData('address', field);
              });
            }
          });
        }
      }
      let paymentMethods = nevigenOneStepCheckout.querySelector('[data-nevigen-onestepcheckout="payment"]');
      if (paymentMethods) {
        let payments = paymentMethods.querySelectorAll('input[name="payment_method"]');
        if (payments.length > 0) {
          let paymentActive = paymentMethods.querySelector('input:checked');
          if (paymentActive && paymentActive.value) {
            let paramsPayment = nevigenOneStepCheckout.querySelectorAll('[name*="params[' + paymentActive.value + ']"]');
            if (paramsPayment.length > 0) {
              paramsPayment.forEach(field => {
                field.addEventListener('change', e => {
                  this.saveMethodsParams('payment', field);
                });
              });
            }
          }
          payments.forEach(field => {
            if (field.getAttribute('name')) {
              field.addEventListener('change', e => {
                this.saveFormData('payment', field);
              });
            }
          });
        }
      }
      let shippingMethods = nevigenOneStepCheckout.querySelector('[data-nevigen-onestepcheckout="shipping"]');
      if (shippingMethods) {
        let shipping = shippingMethods.querySelectorAll('input[name="sh_pr_method_id"]');
        if (shipping.length > 0) {
          let shippingActive = shippingMethods.querySelector('input:checked');
          if (shippingActive && shippingActive.value) {
            let id = shippingActive.getAttribute('data-shipping_id');
            if (id) {
              let paramsShipping = nevigenOneStepCheckout.querySelectorAll('[name*="params[' + id + ']"]');
              if (paramsShipping.length > 0) {
                paramsShipping.forEach(field => {
                  field.addEventListener('change', e => {
                    this.saveMethodsParams('shipping', field);
                  });
                });
              }
            }
          }
          shipping.forEach(field => {
            if (field.getAttribute('name')) {
              field.addEventListener('change', e => {
                this.saveFormData('shipping', field);
              });
            }
          });
        }
      }
    }
    let quantityInputs = document.querySelectorAll('input[nevigen-onestepcheckout-cart-edit-quantity-input],input[data-nevigen-onestepcheckout-cart-edit-quantity-input]');
    if (quantityInputs.length > 0) {
      quantityInputs.forEach(input => {
        input.addEventListener('change', event => {
          event.preventDefault();
          input.value = input.value.replace(/[^.\d]+/g, '').replace(/^([^.]*\.)|\./g, '$1');
          let key = input.getAttribute('nevigen-onestepcheckout-cart-edit-quantity-input');
          if (!key) key = input.getAttribute('data-nevigen-onestepcheckout-cart-edit-quantity-input');
          if (key) {
            let value = parseInt(input.value);
            this.cartEditChangeQuantity(key, value <= 0 ? 1 : value);
          }
        });
      });
    }
    let quantityButtons = document.querySelectorAll('[nevigen-onestepcheckout-cart-edit-quantity],[data-nevigen-onestepcheckout-cart-edit-quantity]');
    if (quantityButtons.length > 0) {
      quantityButtons.forEach(button => {
        button.addEventListener('click', e => {
          e.preventDefault();
          let type = button.getAttribute('nevigen-onestepcheckout-cart-edit-quantity');
          if (!type) type = button.getAttribute('data-nevigen-onestepcheckout-cart-edit-quantity');
          if (type) {
            let container = button.closest('[nevigen-onestepcheckout-cart-edit-quantity-container],[data-nevigen-onestepcheckout-cart-edit-quantity-container]');
            if (container) {
              let input = container.querySelector('input[nevigen-onestepcheckout-cart-edit-quantity-input],input[data-nevigen-onestepcheckout-cart-edit-quantity-input]'),
                value = input.value,
                update = false;
              if (value) {
                value = parseInt(value);
                if (type === '+') {
                  input.value = value + 1;
                  update = true;
                } else if (type === '-') {
                  if (value > 1) {
                    input.value = value - 1;
                    update = true;
                  }
                }
                if (update) {
                  input.dispatchEvent(new Event('change', {
                    'bubbles': true
                  }));
                }
              }
            }
          }
        });
      });
    }
  }
  saveFormData(type, field) {
    if (!type || !field) return;
    let ajaxData = new FormData(),
      payment = '',
      shipping = '',
      name = field.getAttribute('name');
    ajaxData.set('type', type);
    ajaxData.set('saveformdata[' + name + ']', field.value);
    if (type === 'payment') {
      payment = field.closest('[data-nevigen-onestepcheckout-payment="' + field.value + '"]');
      if (payment) {
        let fields = payment.querySelectorAll('[name*="params[' + field.value + '"]');
        if (fields.length > 0) {
          fields.forEach(param => {
            let nameParam = param.getAttribute('name');
            nameParam = nameParam.replace('params', '[params]');
            ajaxData.set('saveformdata' + nameParam, param.value);
          });
        }
      }
    } else if (type === 'shipping') {
      shipping = field.closest('[data-nevigen-onestepcheckout-shipping="' + field.value + '"]');
      if (shipping) {
        let fields = shipping.querySelectorAll('[name*="params[' + field.value + '"]');
        if (fields.length > 0) {
          fields.forEach(param => {
            let nameParam = param.getAttribute('name');
            nameParam = nameParam.replace('params', '[params]');
            ajaxData.set('saveformdata' + nameParam, param.value);
          });
        }
      }
    }
    this.sendAjax('post', 'saveFormData', ajaxData).then(response => {
      if (type === 'address' && response.data.reload) {
        this.reloadScrollPage();
      }
      if (type === 'payment' || type === 'shipping') {
        this.reloadScrollPage();
      }
    }).catch(error => {
      this.setMessage('error', error.message);
    });
  }
  saveMethodsParams(type, element, reload) {
    if (!type || !element) {
      return false;
    }
    let ajaxData = new FormData(),
      name = element.getAttribute('name');
    ajaxData.set('type', type);
    ajaxData.set(name, element.value);
    this.sendAjax('post', 'saveMethodsParams', ajaxData).then(response => {
      if (reload) {
        this.reloadScrollPage();
      }
      let matches = name.match(/(?<=\[).*?(?=\])/g),
        id = 0;
      if (matches && matches[1]) {
        id = matches[0];
        name = matches[1];
      }
      this.triggerEvent('nevigenOneStepCheckoutAfterSaveMethodsParams', {
        element: element,
        name: name,
        id: id
      });
    }).catch(error => {
      this.setMessage('error', error.message, this.containerLoginMeesage);
    });
  }
  cartEditChangeQuantity(key, quantity) {
    let ajaxData = new FormData();
    ajaxData.set('product_id', key);
    ajaxData.set('quantity', quantity);
    this.sendAjax('post', 'cartChangeQuantityAjax', ajaxData).then(response => {
      if (response.data) {
        let cartPrice = document.querySelectorAll('[data-nevigen-onestepcheckout-cart-edit-product-price="' + key + '"],[data-nevigen-onestepcheckout-cart-edit-product-price="' + key + '"]');
        if (cartPrice.length > 0) {
          cartPrice.forEach(cartPrice => {
            cartPrice.innerHTML = response.data.price;
          });
        }
        let cartSum = document.querySelectorAll('[data-nevigen-onestepcheckout-cart-edit-product-sum="' + key + '"],[data-nevigen-onestepcheckout-cart-edit-product-sum="' + key + '"]');
        if (cartSum.length > 0) {
          cartSum.forEach(productSum => {
            productSum.innerHTML = response.data.sum;
          });
        }
        this.cartEditUpdateTotal(response.data.cart);
      }
    }).catch(error => {
      this.setMessage('error', error.message, this.containerCartEditMeesage);
    });
  }
  cartEditRemoveProduct(product_id) {
    let ajaxData = new FormData();
    ajaxData.set('product_id', product_id);
    this.sendAjax('post', 'cartRemoveProductAjax', ajaxData).then(response => {
      if (response.success && response.data && Array.isArray(response.data.products)) {
        let productsFromServer = response.data.products;
        let productsCart = document.querySelectorAll('[nevigen-onestepcheckout-cart-edit="products"],[data-nevigen-onestepcheckout-cart-edit="products"]');
        if (productsCart.length > 0) {
          productsCart.forEach(productsBlock => {
            let products = productsBlock.querySelectorAll('[nevigen-onestepcheckout-cart-edit="product"],[data-nevigen-onestepcheckout-cart-edit="product"]');
            if (products.length > 0) {
              products.forEach(product => {
                let key = product.getAttribute('data-key');
                if (!key) {
                  return;
                }
                key = parseInt(key, 10);
                if (!productsFromServer.includes(key)) {
                  product.remove();
                }
              });
            }
          });
        }
        if (productsFromServer.length === 0) {
          let close = document.querySelectorAll('[nevigen-onestepcheckout-cart-edit="close"],[data-nevigen-onestepcheckout-cart-edit="close"]');
          if (close.length > 0) {
            close.forEach(button => {
              if (button) {
                button.dispatchEvent(new Event('click', {
                  bubbles: true
                }));
              }
            });
          }
        }
      }
    }).catch(error => {
      this.setMessage('error', error.message, this.containerCartEditMeesage);
    });
  }
  cartEditUpdateTotal(sum) {
    if (sum) {
      let totals = document.querySelectorAll('[data-nevigen-onestepcheckout-cart-edit="total"],[nevigen-onestepcheckout-cart-edit="total"]');
      if (totals.length > 0) {
        totals.forEach(total => {
          total.innerHTML = sum;
        });
      }
    }
  }
  cartRabbat() {
    if (this.rabatt && this.rabatt.value) {
      let ajaxData = new FormData();
      ajaxData.set('rabatt', this.rabatt.value);
      this.sendAjax('post', 'rabattAjax', ajaxData).then(response => {
        this.reloadScrollPage();
      }).catch(error => {
        this.setMessage('error', error.message);
      });
    }
  }
  disableRabbat() {
    let ajaxData = new FormData();
    ajaxData.set('disabled', 1);
    this.sendAjax('post', 'disableRabbatAjax', ajaxData).then(response => {
      this.reloadScrollPage();
    }).catch(error => {
      this.setMessage('error', error.message);
    });
  }
  setNevigenBonusesCartPoints() {
    let points_sub = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (points_sub === null) {
      return;
    }
    let ajaxData = new FormData();
    ajaxData.set('points_sub', points_sub);
    this.sendAjax('post', 'setNevigenBonusesCartPointsAjax', ajaxData).then(response => {
      this.reloadScrollPage();
    }).catch(error => {
      this.setMessage('error', error.message);
    });
  }
  login() {
    if (this.options.user === 0) {
      let fields = document.querySelectorAll('[name^="nevigenonestepcheckoutlogin"]'),
        valid = true;
      if (fields.length > 0) {
        let ajaxData = new FormData();
        fields.forEach(field => {
          if (field.value === '') {
            field.classList.add('is-invalid');
            valid = false;
          } else {
            if (field.getAttribute('type') === 'checkbox') {
              if (field.checked) {
                ajaxData.set(field.getAttribute('name'), field.value);
              }
            } else {
              ajaxData.set(field.getAttribute('name'), field.value);
            }
            field.classList.remove('is-invalid');
          }
          this.triggerEvent('nevigenOneStepCheckoutLoginFormValidField', field);
        });
        if (valid) {
          this.sendAjax('post', 'loginAjax', ajaxData).then(response => {
            this.reloadScrollPage();
          }).catch(error => {
            this.setMessage('error', error.message, this.containerLoginMeesage);
          });
        }
      }
    }
  }
  sendAjax(methodAjax, method, ajaxData) {
    return new Promise((resolve, reject) => {
      if (!ajaxData || !methodAjax || !method) {
        reject('Error ajax data');
        return false;
      }
      if (this.csrf) {
        ajaxData.set(this.csrf, 1);
      }
      ajaxData.set('task', method);
      Joomla.request({
        url: this.controller,
        method: methodAjax,
        data: ajaxData,
        onSuccess: resp => {
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
  }
  setMessage(type, message, container) {
    if (!type || !message) return;
    Joomla.removeMessages(container);
    Joomla.renderMessages({
      [type]: [message]
    }, container);
  }
  reloadScrollPage(needScroll) {
    if (needScroll) {
      let scroll = js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get('nevigen_onestepcheckout_scroll');
      if (scroll) {
        window.scroll(0, scroll);
        js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].remove('nevigen_onestepcheckout_scroll');
      }
    } else {
      this.setPreloader();
      if (window.scrollY) {
        js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].set('nevigen_onestepcheckout_scroll', window.scrollY);
      }
      location.reload();
    }
  }
  setPreloader() {
    let preloaderSource = document.querySelector('[data-nevigen-onestepcheckout="preloader"]');
    if (!preloaderSource) {
      preloaderSource = document.querySelector('[nevigen-onestepcheckout="preloader"]');
    }
    if (preloaderSource) {
      document.body.appendChild(preloaderSource);
      preloaderSource.style.display = '';
    }
  }
  triggerEvent(name, data, element) {
    if (!name || !data) return;
    if (name) {
      document.dispatchEvent(new CustomEvent(name, {
        detail: data
      }));
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NevigenOneStepCheckout);
window.NevigenOneStepCheckoutClass = null;
window.NevigenOneStepCheckout = () => {
  if (window.NevigenOneStepCheckoutClass === null) {
    window.NevigenOneStepCheckoutClass = new NevigenOneStepCheckout();
  }
  return window.NevigenOneStepCheckoutClass;
};
document.addEventListener('DOMContentLoaded', () => {
  window.NevigenOneStepCheckout().loadActions();
  let points_sub = document.querySelector('input[name="points_sub"]');
  if (points_sub) {
    points_sub.addEventListener('change', e => {
      let value = points_sub.value;
      if (points_sub.getAttribute('type') === 'checkbox') {
        if (points_sub.checked === false) {
          value = '0';
        }
      }
      window.NevigenOneStepCheckout().setNevigenBonusesCartPoints(value);
    });
    if (points_sub.getAttribute('type') !== 'checkbox') {
      points_sub.addEventListener('input', e => {
        let value = points_sub.value;
        value = value.replace(/[^0-9,.]/g, "");
        value = value.replace(/,/g, '.');
        points_sub.value = value;
      });
    }
  }
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUssQ0FBQztJQUNuRSxDQUFDLENBQUM7SUFDRixJQUFJaWxCLFVBQVUsQ0FBQ2pFLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxVQUFVLEVBQUU7TUFDbkRpRSxVQUFVLENBQUN2akIsZ0JBQWdCLENBQUMsT0FBTyxFQUFHb0YsQ0FBQyxJQUFLO1FBQzNDLElBQUk5RyxLQUFLLEdBQUdpbEIsVUFBVSxDQUFDamxCLEtBQUs7UUFFNUJBLEtBQUssR0FBR0EsS0FBSyxDQUFDdUssT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7UUFDdEN2SyxLQUFLLEdBQUdBLEtBQUssQ0FBQ3VLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1FBRWhDMGEsVUFBVSxDQUFDamxCLEtBQUssR0FBR0EsS0FBSztNQUV6QixDQUFDLENBQUM7SUFDSDtFQUNEO0FBQ0QsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL19yb2xsdXBQbHVnaW5CYWJlbEhlbHBlcnMtNmIzYmQ0MDQuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9jb250cm9scy9odG1sLWNvbnRlbnRlZGl0YWJsZS1tYXNrLWVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9jb250cm9scy9odG1sLW1hc2stZWxlbWVudC5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL2NvbnRyb2xzL2lucHV0LmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vY29udHJvbHMvbWFzay1lbGVtZW50LmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vY29yZS9hY3Rpb24tZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL2NvcmUvY2hhbmdlLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9jb3JlL2NvbnRpbnVvdXMtdGFpbC1kZXRhaWxzLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vY29yZS9ob2xkZXIuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9jb3JlL3V0aWxzLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvYmFzZS5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9kYXRlLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL2R5bmFtaWMuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvZW51bS5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9mYWN0b3J5LmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL2Z1bmN0aW9uLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL251bWJlci5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9wYXR0ZXJuLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL3BhdHRlcm4vY2h1bmstdGFpbC1kZXRhaWxzLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL3BhdHRlcm4vY3Vyc29yLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL3BhdHRlcm4vZml4ZWQtZGVmaW5pdGlvbi5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9wYXR0ZXJuL2lucHV0LWRlZmluaXRpb24uanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvcGlwZS5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9yYW5nZS5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9yZWdleHAuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9kaXN0L2pzLmNvb2tpZS5tanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vcGxnX3N5c3RlbV9uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC9lczYvbWFpbi5lczYiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkge1xuICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTtcbiAgdmFyIHRhcmdldCA9IHt9O1xuICB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gIHZhciBrZXksIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAga2V5ID0gc291cmNlS2V5c1tpXTtcbiAgICBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZXhwb3J0IHsgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UgYXMgXyB9O1xuIiwiaW1wb3J0IEhUTUxNYXNrRWxlbWVudCBmcm9tICcuL2h0bWwtbWFzay1lbGVtZW50LmpzJztcbmltcG9ydCBJTWFzayBmcm9tICcuLi9jb3JlL2hvbGRlci5qcyc7XG5pbXBvcnQgJy4vbWFzay1lbGVtZW50LmpzJztcblxuY2xhc3MgSFRNTENvbnRlbnRlZGl0YWJsZU1hc2tFbGVtZW50IGV4dGVuZHMgSFRNTE1hc2tFbGVtZW50IHtcbiAgLyoqXG4gICAgUmV0dXJucyBIVE1MRWxlbWVudCBzZWxlY3Rpb24gc3RhcnRcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IF91bnNhZmVTZWxlY3Rpb25TdGFydCgpIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5yb290RWxlbWVudDtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSByb290LmdldFNlbGVjdGlvbiAmJiByb290LmdldFNlbGVjdGlvbigpO1xuICAgIGNvbnN0IGFuY2hvck9mZnNldCA9IHNlbGVjdGlvbiAmJiBzZWxlY3Rpb24uYW5jaG9yT2Zmc2V0O1xuICAgIGNvbnN0IGZvY3VzT2Zmc2V0ID0gc2VsZWN0aW9uICYmIHNlbGVjdGlvbi5mb2N1c09mZnNldDtcbiAgICBpZiAoZm9jdXNPZmZzZXQgPT0gbnVsbCB8fCBhbmNob3JPZmZzZXQgPT0gbnVsbCB8fCBhbmNob3JPZmZzZXQgPCBmb2N1c09mZnNldCkge1xuICAgICAgcmV0dXJuIGFuY2hvck9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIGZvY3VzT2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAgUmV0dXJucyBIVE1MRWxlbWVudCBzZWxlY3Rpb24gZW5kXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCBfdW5zYWZlU2VsZWN0aW9uRW5kKCkge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLnJvb3RFbGVtZW50O1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHJvb3QuZ2V0U2VsZWN0aW9uICYmIHJvb3QuZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3QgYW5jaG9yT2Zmc2V0ID0gc2VsZWN0aW9uICYmIHNlbGVjdGlvbi5hbmNob3JPZmZzZXQ7XG4gICAgY29uc3QgZm9jdXNPZmZzZXQgPSBzZWxlY3Rpb24gJiYgc2VsZWN0aW9uLmZvY3VzT2Zmc2V0O1xuICAgIGlmIChmb2N1c09mZnNldCA9PSBudWxsIHx8IGFuY2hvck9mZnNldCA9PSBudWxsIHx8IGFuY2hvck9mZnNldCA+IGZvY3VzT2Zmc2V0KSB7XG4gICAgICByZXR1cm4gYW5jaG9yT2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gZm9jdXNPZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICBTZXRzIEhUTUxFbGVtZW50IHNlbGVjdGlvblxuICAgIEBvdmVycmlkZVxuICAqL1xuICBfdW5zYWZlU2VsZWN0KHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoIXRoaXMucm9vdEVsZW1lbnQuY3JlYXRlUmFuZ2UpIHJldHVybjtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMucm9vdEVsZW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICByYW5nZS5zZXRTdGFydCh0aGlzLmlucHV0LmZpcnN0Q2hpbGQgfHwgdGhpcy5pbnB1dCwgc3RhcnQpO1xuICAgIHJhbmdlLnNldEVuZCh0aGlzLmlucHV0Lmxhc3RDaGlsZCB8fCB0aGlzLmlucHV0LCBlbmQpO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLnJvb3RFbGVtZW50O1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHJvb3QuZ2V0U2VsZWN0aW9uICYmIHJvb3QuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKHNlbGVjdGlvbikge1xuICAgICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgc2VsZWN0aW9uLmFkZFJhbmdlKHJhbmdlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBIVE1MRWxlbWVudCB2YWx1ZVxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHJldHVybiB0aGlzLmlucHV0LnRleHRDb250ZW50O1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuaW5wdXQudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxufVxuSU1hc2suSFRNTENvbnRlbnRlZGl0YWJsZU1hc2tFbGVtZW50ID0gSFRNTENvbnRlbnRlZGl0YWJsZU1hc2tFbGVtZW50O1xuXG5leHBvcnQgeyBIVE1MQ29udGVudGVkaXRhYmxlTWFza0VsZW1lbnQgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IE1hc2tFbGVtZW50IGZyb20gJy4vbWFzay1lbGVtZW50LmpzJztcbmltcG9ydCBJTWFzayBmcm9tICcuLi9jb3JlL2hvbGRlci5qcyc7XG5cbi8qKiBCcmlkZ2UgYmV0d2VlbiBIVE1MRWxlbWVudCBhbmQge0BsaW5rIE1hc2tlZH0gKi9cbmNsYXNzIEhUTUxNYXNrRWxlbWVudCBleHRlbmRzIE1hc2tFbGVtZW50IHtcbiAgLyoqIE1hcHBpbmcgYmV0d2VlbiBIVE1MRWxlbWVudCBldmVudHMgYW5kIG1hc2sgaW50ZXJuYWwgZXZlbnRzICovXG5cbiAgLyoqIEhUTUxFbGVtZW50IHRvIHVzZSBtYXNrIG9uICovXG5cbiAgLyoqXG4gICAgQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICovXG4gIGNvbnN0cnVjdG9yKGlucHV0KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5faGFuZGxlcnMgPSB7fTtcbiAgfVxuXG4gIC8qKiAqL1xuICAvLyAkRmxvd0ZpeE1lIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8yODM5XG4gIGdldCByb290RWxlbWVudCgpIHtcbiAgICB2YXIgX3RoaXMkaW5wdXQkZ2V0Um9vdE5vLCBfdGhpcyRpbnB1dCRnZXRSb290Tm8yLCBfdGhpcyRpbnB1dDtcbiAgICByZXR1cm4gKF90aGlzJGlucHV0JGdldFJvb3RObyA9IChfdGhpcyRpbnB1dCRnZXRSb290Tm8yID0gKF90aGlzJGlucHV0ID0gdGhpcy5pbnB1dCkuZ2V0Um9vdE5vZGUpID09PSBudWxsIHx8IF90aGlzJGlucHV0JGdldFJvb3RObzIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJGlucHV0JGdldFJvb3RObzIuY2FsbChfdGhpcyRpbnB1dCkpICE9PSBudWxsICYmIF90aGlzJGlucHV0JGdldFJvb3RObyAhPT0gdm9pZCAwID8gX3RoaXMkaW5wdXQkZ2V0Um9vdE5vIDogZG9jdW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICBJcyBlbGVtZW50IGluIGZvY3VzXG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCBpc0FjdGl2ZSgpIHtcbiAgICAvLyRGbG93Rml4TWVcbiAgICByZXR1cm4gdGhpcy5pbnB1dCA9PT0gdGhpcy5yb290RWxlbWVudC5hY3RpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAgUmV0dXJucyBIVE1MRWxlbWVudCBzZWxlY3Rpb24gc3RhcnRcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IF91bnNhZmVTZWxlY3Rpb25TdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dC5zZWxlY3Rpb25TdGFydDtcbiAgfVxuXG4gIC8qKlxuICAgIFJldHVybnMgSFRNTEVsZW1lbnQgc2VsZWN0aW9uIGVuZFxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgX3Vuc2FmZVNlbGVjdGlvbkVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dC5zZWxlY3Rpb25FbmQ7XG4gIH1cblxuICAvKipcbiAgICBTZXRzIEhUTUxFbGVtZW50IHNlbGVjdGlvblxuICAgIEBvdmVycmlkZVxuICAqL1xuICBfdW5zYWZlU2VsZWN0KHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLmlucHV0LnNldFNlbGVjdGlvblJhbmdlKHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgLyoqXG4gICAgSFRNTEVsZW1lbnQgdmFsdWVcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmlucHV0LnZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgIEJpbmRzIEhUTUxFbGVtZW50IGV2ZW50cyB0byBtYXNrIGludGVybmFsIGV2ZW50c1xuICAgIEBvdmVycmlkZVxuICAqL1xuICBiaW5kRXZlbnRzKGhhbmRsZXJzKSB7XG4gICAgT2JqZWN0LmtleXMoaGFuZGxlcnMpLmZvckVhY2goZXZlbnQgPT4gdGhpcy5fdG9nZ2xlRXZlbnRIYW5kbGVyKEhUTUxNYXNrRWxlbWVudC5FVkVOVFNfTUFQW2V2ZW50XSwgaGFuZGxlcnNbZXZlbnRdKSk7XG4gIH1cblxuICAvKipcbiAgICBVbmJpbmRzIEhUTUxFbGVtZW50IGV2ZW50cyB0byBtYXNrIGludGVybmFsIGV2ZW50c1xuICAgIEBvdmVycmlkZVxuICAqL1xuICB1bmJpbmRFdmVudHMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5faGFuZGxlcnMpLmZvckVhY2goZXZlbnQgPT4gdGhpcy5fdG9nZ2xlRXZlbnRIYW5kbGVyKGV2ZW50KSk7XG4gIH1cblxuICAvKiogKi9cbiAgX3RvZ2dsZUV2ZW50SGFuZGxlcihldmVudCwgaGFuZGxlcikge1xuICAgIGlmICh0aGlzLl9oYW5kbGVyc1tldmVudF0pIHtcbiAgICAgIHRoaXMuaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5faGFuZGxlcnNbZXZlbnRdKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9oYW5kbGVyc1tldmVudF07XG4gICAgfVxuICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgdGhpcy5faGFuZGxlcnNbZXZlbnRdID0gaGFuZGxlcjtcbiAgICB9XG4gIH1cbn1cbkhUTUxNYXNrRWxlbWVudC5FVkVOVFNfTUFQID0ge1xuICBzZWxlY3Rpb25DaGFuZ2U6ICdrZXlkb3duJyxcbiAgaW5wdXQ6ICdpbnB1dCcsXG4gIGRyb3A6ICdkcm9wJyxcbiAgY2xpY2s6ICdjbGljaycsXG4gIGZvY3VzOiAnZm9jdXMnLFxuICBjb21taXQ6ICdibHVyJ1xufTtcbklNYXNrLkhUTUxNYXNrRWxlbWVudCA9IEhUTUxNYXNrRWxlbWVudDtcblxuZXhwb3J0IHsgSFRNTE1hc2tFbGVtZW50IGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IF8gYXMgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UgfSBmcm9tICcuLi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzJztcbmltcG9ydCB7IG9iamVjdEluY2x1ZGVzLCBESVJFQ1RJT04gfSBmcm9tICcuLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCBBY3Rpb25EZXRhaWxzIGZyb20gJy4uL2NvcmUvYWN0aW9uLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuLi9tYXNrZWQvZGF0ZS5qcyc7XG5pbXBvcnQgY3JlYXRlTWFzaywgeyBtYXNrZWRDbGFzcyB9IGZyb20gJy4uL21hc2tlZC9mYWN0b3J5LmpzJztcbmltcG9ydCBNYXNrRWxlbWVudCBmcm9tICcuL21hc2stZWxlbWVudC5qcyc7XG5pbXBvcnQgSFRNTE1hc2tFbGVtZW50IGZyb20gJy4vaHRtbC1tYXNrLWVsZW1lbnQuanMnO1xuaW1wb3J0IEhUTUxDb250ZW50ZWRpdGFibGVNYXNrRWxlbWVudCBmcm9tICcuL2h0bWwtY29udGVudGVkaXRhYmxlLW1hc2stZWxlbWVudC5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi4vbWFza2VkL3BhdHRlcm4uanMnO1xuaW1wb3J0ICcuLi9tYXNrZWQvYmFzZS5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuLi9tYXNrZWQvcGF0dGVybi9pbnB1dC1kZWZpbml0aW9uLmpzJztcbmltcG9ydCAnLi4vbWFza2VkL3BhdHRlcm4vZml4ZWQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgJy4uL21hc2tlZC9wYXR0ZXJuL2NodW5rLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4uL21hc2tlZC9wYXR0ZXJuL2N1cnNvci5qcyc7XG5pbXBvcnQgJy4uL21hc2tlZC9yZWdleHAuanMnO1xuaW1wb3J0ICcuLi9tYXNrZWQvcmFuZ2UuanMnO1xuXG5jb25zdCBfZXhjbHVkZWQgPSBbXCJtYXNrXCJdO1xuXG4vKiogTGlzdGVucyB0byBlbGVtZW50IGV2ZW50cyBhbmQgY29udHJvbHMgY2hhbmdlcyBiZXR3ZWVuIGVsZW1lbnQgYW5kIHtAbGluayBNYXNrZWR9ICovXG5jbGFzcyBJbnB1dE1hc2sge1xuICAvKipcbiAgICBWaWV3IGVsZW1lbnRcbiAgICBAcmVhZG9ubHlcbiAgKi9cblxuICAvKipcbiAgICBJbnRlcm5hbCB7QGxpbmsgTWFza2VkfSBtb2RlbFxuICAgIEByZWFkb25seVxuICAqL1xuXG4gIC8qKlxuICAgIEBwYXJhbSB7TWFza0VsZW1lbnR8SFRNTElucHV0RWxlbWVudHxIVE1MVGV4dEFyZWFFbGVtZW50fSBlbFxuICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICovXG4gIGNvbnN0cnVjdG9yKGVsLCBvcHRzKSB7XG4gICAgdGhpcy5lbCA9IGVsIGluc3RhbmNlb2YgTWFza0VsZW1lbnQgPyBlbCA6IGVsLmlzQ29udGVudEVkaXRhYmxlICYmIGVsLnRhZ05hbWUgIT09ICdJTlBVVCcgJiYgZWwudGFnTmFtZSAhPT0gJ1RFWFRBUkVBJyA/IG5ldyBIVE1MQ29udGVudGVkaXRhYmxlTWFza0VsZW1lbnQoZWwpIDogbmV3IEhUTUxNYXNrRWxlbWVudChlbCk7XG4gICAgdGhpcy5tYXNrZWQgPSBjcmVhdGVNYXNrKG9wdHMpO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMuX3ZhbHVlID0gJyc7XG4gICAgdGhpcy5fdW5tYXNrZWRWYWx1ZSA9ICcnO1xuICAgIHRoaXMuX3NhdmVTZWxlY3Rpb24gPSB0aGlzLl9zYXZlU2VsZWN0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25JbnB1dCA9IHRoaXMuX29uSW5wdXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Ecm9wID0gdGhpcy5fb25Ecm9wLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Gb2N1cyA9IHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5fb25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWxpZ25DdXJzb3IgPSB0aGlzLmFsaWduQ3Vyc29yLmJpbmQodGhpcyk7XG4gICAgdGhpcy5hbGlnbkN1cnNvckZyaWVuZGx5ID0gdGhpcy5hbGlnbkN1cnNvckZyaWVuZGx5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuXG4gICAgLy8gcmVmcmVzaFxuICAgIHRoaXMudXBkYXRlVmFsdWUoKTtcbiAgICB0aGlzLl9vbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqIFJlYWQgb3IgdXBkYXRlIG1hc2sgKi9cbiAgZ2V0IG1hc2soKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLm1hc2s7XG4gIH1cbiAgbWFza0VxdWFscyhtYXNrKSB7XG4gICAgdmFyIF90aGlzJG1hc2tlZDtcbiAgICByZXR1cm4gbWFzayA9PSBudWxsIHx8ICgoX3RoaXMkbWFza2VkID0gdGhpcy5tYXNrZWQpID09PSBudWxsIHx8IF90aGlzJG1hc2tlZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkbWFza2VkLm1hc2tFcXVhbHMobWFzaykpO1xuICB9XG4gIHNldCBtYXNrKG1hc2spIHtcbiAgICBpZiAodGhpcy5tYXNrRXF1YWxzKG1hc2spKSByZXR1cm47XG5cbiAgICAvLyAkRmxvd0ZpeE1lIE5vIGlkZWFzIC4uLiBhZnRlciB1cGRhdGVcbiAgICBpZiAoIShtYXNrIGluc3RhbmNlb2YgSU1hc2suTWFza2VkKSAmJiB0aGlzLm1hc2tlZC5jb25zdHJ1Y3RvciA9PT0gbWFza2VkQ2xhc3MobWFzaykpIHtcbiAgICAgIHRoaXMubWFza2VkLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICBtYXNrXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWFza2VkID0gY3JlYXRlTWFzayh7XG4gICAgICBtYXNrXG4gICAgfSk7XG4gICAgbWFza2VkLnVubWFza2VkVmFsdWUgPSB0aGlzLm1hc2tlZC51bm1hc2tlZFZhbHVlO1xuICAgIHRoaXMubWFza2VkID0gbWFza2VkO1xuICB9XG5cbiAgLyoqIFJhdyB2YWx1ZSAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZShzdHIpIHtcbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gc3RyKSByZXR1cm47XG4gICAgdGhpcy5tYXNrZWQudmFsdWUgPSBzdHI7XG4gICAgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gICAgdGhpcy5hbGlnbkN1cnNvcigpO1xuICB9XG5cbiAgLyoqIFVubWFza2VkIHZhbHVlICovXG4gIGdldCB1bm1hc2tlZFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl91bm1hc2tlZFZhbHVlO1xuICB9XG4gIHNldCB1bm1hc2tlZFZhbHVlKHN0cikge1xuICAgIGlmICh0aGlzLnVubWFza2VkVmFsdWUgPT09IHN0cikgcmV0dXJuO1xuICAgIHRoaXMubWFza2VkLnVubWFza2VkVmFsdWUgPSBzdHI7XG4gICAgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gICAgdGhpcy5hbGlnbkN1cnNvcigpO1xuICB9XG5cbiAgLyoqIFR5cGVkIHVubWFza2VkIHZhbHVlICovXG4gIGdldCB0eXBlZFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC50eXBlZFZhbHVlO1xuICB9XG4gIHNldCB0eXBlZFZhbHVlKHZhbCkge1xuICAgIGlmICh0aGlzLm1hc2tlZC50eXBlZFZhbHVlRXF1YWxzKHZhbCkpIHJldHVybjtcbiAgICB0aGlzLm1hc2tlZC50eXBlZFZhbHVlID0gdmFsO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbCgpO1xuICAgIHRoaXMuYWxpZ25DdXJzb3IoKTtcbiAgfVxuXG4gIC8qKiBEaXNwbGF5IHZhbHVlICovXG4gIGdldCBkaXNwbGF5VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLmRpc3BsYXlWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgIFN0YXJ0cyBsaXN0ZW5pbmcgdG8gZWxlbWVudCBldmVudHNcbiAgICBAcHJvdGVjdGVkXG4gICovXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuZWwuYmluZEV2ZW50cyh7XG4gICAgICBzZWxlY3Rpb25DaGFuZ2U6IHRoaXMuX3NhdmVTZWxlY3Rpb24sXG4gICAgICBpbnB1dDogdGhpcy5fb25JbnB1dCxcbiAgICAgIGRyb3A6IHRoaXMuX29uRHJvcCxcbiAgICAgIGNsaWNrOiB0aGlzLl9vbkNsaWNrLFxuICAgICAgZm9jdXM6IHRoaXMuX29uRm9jdXMsXG4gICAgICBjb21taXQ6IHRoaXMuX29uQ2hhbmdlXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICBTdG9wcyBsaXN0ZW5pbmcgdG8gZWxlbWVudCBldmVudHNcbiAgICBAcHJvdGVjdGVkXG4gICAqL1xuICBfdW5iaW5kRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLmVsKSB0aGlzLmVsLnVuYmluZEV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAgRmlyZXMgY3VzdG9tIGV2ZW50XG4gICAgQHByb3RlY3RlZFxuICAgKi9cbiAgX2ZpcmVFdmVudChldikge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZdO1xuICAgIGlmICghbGlzdGVuZXJzKSByZXR1cm47XG4gICAgbGlzdGVuZXJzLmZvckVhY2gobCA9PiBsKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgIEN1cnJlbnQgc2VsZWN0aW9uIHN0YXJ0XG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCBzZWxlY3Rpb25TdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yQ2hhbmdpbmcgPyB0aGlzLl9jaGFuZ2luZ0N1cnNvclBvcyA6IHRoaXMuZWwuc2VsZWN0aW9uU3RhcnQ7XG4gIH1cblxuICAvKiogQ3VycmVudCBjdXJzb3IgcG9zaXRpb24gKi9cbiAgZ2V0IGN1cnNvclBvcygpIHtcbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yQ2hhbmdpbmcgPyB0aGlzLl9jaGFuZ2luZ0N1cnNvclBvcyA6IHRoaXMuZWwuc2VsZWN0aW9uRW5kO1xuICB9XG4gIHNldCBjdXJzb3JQb3MocG9zKSB7XG4gICAgaWYgKCF0aGlzLmVsIHx8ICF0aGlzLmVsLmlzQWN0aXZlKSByZXR1cm47XG4gICAgdGhpcy5lbC5zZWxlY3QocG9zLCBwb3MpO1xuICAgIHRoaXMuX3NhdmVTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgIFN0b3JlcyBjdXJyZW50IHNlbGVjdGlvblxuICAgIEBwcm90ZWN0ZWRcbiAgKi9cbiAgX3NhdmVTZWxlY3Rpb24oIC8qIGV2ICovXG4gICkge1xuICAgIGlmICh0aGlzLmRpc3BsYXlWYWx1ZSAhPT0gdGhpcy5lbC52YWx1ZSkge1xuICAgICAgY29uc29sZS53YXJuKCdFbGVtZW50IHZhbHVlIHdhcyBjaGFuZ2VkIG91dHNpZGUgb2YgbWFzay4gU3luY3Jvbml6ZSBtYXNrIHVzaW5nIGBtYXNrLnVwZGF0ZVZhbHVlKClgIHRvIHdvcmsgcHJvcGVybHkuJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIH1cblxuICAgIHRoaXMuX3NlbGVjdGlvbiA9IHtcbiAgICAgIHN0YXJ0OiB0aGlzLnNlbGVjdGlvblN0YXJ0LFxuICAgICAgZW5kOiB0aGlzLmN1cnNvclBvc1xuICAgIH07XG4gIH1cblxuICAvKiogU3luY3Jvbml6ZXMgbW9kZWwgdmFsdWUgZnJvbSB2aWV3ICovXG4gIHVwZGF0ZVZhbHVlKCkge1xuICAgIHRoaXMubWFza2VkLnZhbHVlID0gdGhpcy5lbC52YWx1ZTtcbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMubWFza2VkLnZhbHVlO1xuICB9XG5cbiAgLyoqIFN5bmNyb25pemVzIHZpZXcgZnJvbSBtb2RlbCB2YWx1ZSwgZmlyZXMgY2hhbmdlIGV2ZW50cyAqL1xuICB1cGRhdGVDb250cm9sKCkge1xuICAgIGNvbnN0IG5ld1VubWFza2VkVmFsdWUgPSB0aGlzLm1hc2tlZC51bm1hc2tlZFZhbHVlO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5tYXNrZWQudmFsdWU7XG4gICAgY29uc3QgbmV3RGlzcGxheVZhbHVlID0gdGhpcy5kaXNwbGF5VmFsdWU7XG4gICAgY29uc3QgaXNDaGFuZ2VkID0gdGhpcy51bm1hc2tlZFZhbHVlICE9PSBuZXdVbm1hc2tlZFZhbHVlIHx8IHRoaXMudmFsdWUgIT09IG5ld1ZhbHVlO1xuICAgIHRoaXMuX3VubWFza2VkVmFsdWUgPSBuZXdVbm1hc2tlZFZhbHVlO1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgaWYgKHRoaXMuZWwudmFsdWUgIT09IG5ld0Rpc3BsYXlWYWx1ZSkgdGhpcy5lbC52YWx1ZSA9IG5ld0Rpc3BsYXlWYWx1ZTtcbiAgICBpZiAoaXNDaGFuZ2VkKSB0aGlzLl9maXJlQ2hhbmdlRXZlbnRzKCk7XG4gIH1cblxuICAvKiogVXBkYXRlcyBvcHRpb25zIHdpdGggZGVlcCBlcXVhbCBjaGVjaywgcmVjcmVhdGVzIEB7bGluayBNYXNrZWR9IG1vZGVsIGlmIG1hc2sgdHlwZSBjaGFuZ2VzICovXG4gIHVwZGF0ZU9wdGlvbnMob3B0cykge1xuICAgIGNvbnN0IHtcbiAgICAgICAgbWFza1xuICAgICAgfSA9IG9wdHMsXG4gICAgICByZXN0T3B0cyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKG9wdHMsIF9leGNsdWRlZCk7XG4gICAgY29uc3QgdXBkYXRlTWFzayA9ICF0aGlzLm1hc2tFcXVhbHMobWFzayk7XG4gICAgY29uc3QgdXBkYXRlT3B0cyA9ICFvYmplY3RJbmNsdWRlcyh0aGlzLm1hc2tlZCwgcmVzdE9wdHMpO1xuICAgIGlmICh1cGRhdGVNYXNrKSB0aGlzLm1hc2sgPSBtYXNrO1xuICAgIGlmICh1cGRhdGVPcHRzKSB0aGlzLm1hc2tlZC51cGRhdGVPcHRpb25zKHJlc3RPcHRzKTtcbiAgICBpZiAodXBkYXRlTWFzayB8fCB1cGRhdGVPcHRzKSB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIGN1cnNvciAqL1xuICB1cGRhdGVDdXJzb3IoY3Vyc29yUG9zKSB7XG4gICAgaWYgKGN1cnNvclBvcyA9PSBudWxsKSByZXR1cm47XG4gICAgdGhpcy5jdXJzb3JQb3MgPSBjdXJzb3JQb3M7XG5cbiAgICAvLyBhbHNvIHF1ZXVlIGNoYW5nZSBjdXJzb3IgZm9yIG1vYmlsZSBicm93c2Vyc1xuICAgIHRoaXMuX2RlbGF5VXBkYXRlQ3Vyc29yKGN1cnNvclBvcyk7XG4gIH1cblxuICAvKipcbiAgICBEZWxheXMgY3Vyc29yIHVwZGF0ZSB0byBzdXBwb3J0IG1vYmlsZSBicm93c2Vyc1xuICAgIEBwcml2YXRlXG4gICovXG4gIF9kZWxheVVwZGF0ZUN1cnNvcihjdXJzb3JQb3MpIHtcbiAgICB0aGlzLl9hYm9ydFVwZGF0ZUN1cnNvcigpO1xuICAgIHRoaXMuX2NoYW5naW5nQ3Vyc29yUG9zID0gY3Vyc29yUG9zO1xuICAgIHRoaXMuX2N1cnNvckNoYW5naW5nID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZWwpIHJldHVybjsgLy8gaWYgd2FzIGRlc3Ryb3llZFxuICAgICAgdGhpcy5jdXJzb3JQb3MgPSB0aGlzLl9jaGFuZ2luZ0N1cnNvclBvcztcbiAgICAgIHRoaXMuX2Fib3J0VXBkYXRlQ3Vyc29yKCk7XG4gICAgfSwgMTApO1xuICB9XG5cbiAgLyoqXG4gICAgRmlyZXMgY3VzdG9tIGV2ZW50c1xuICAgIEBwcm90ZWN0ZWRcbiAgKi9cbiAgX2ZpcmVDaGFuZ2VFdmVudHMoKSB7XG4gICAgdGhpcy5fZmlyZUV2ZW50KCdhY2NlcHQnLCB0aGlzLl9pbnB1dEV2ZW50KTtcbiAgICBpZiAodGhpcy5tYXNrZWQuaXNDb21wbGV0ZSkgdGhpcy5fZmlyZUV2ZW50KCdjb21wbGV0ZScsIHRoaXMuX2lucHV0RXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAgQWJvcnRzIGRlbGF5ZWQgY3Vyc29yIHVwZGF0ZVxuICAgIEBwcml2YXRlXG4gICovXG4gIF9hYm9ydFVwZGF0ZUN1cnNvcigpIHtcbiAgICBpZiAodGhpcy5fY3Vyc29yQ2hhbmdpbmcpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9jdXJzb3JDaGFuZ2luZyk7XG4gICAgICBkZWxldGUgdGhpcy5fY3Vyc29yQ2hhbmdpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqIEFsaWducyBjdXJzb3IgdG8gbmVhcmVzdCBhdmFpbGFibGUgcG9zaXRpb24gKi9cbiAgYWxpZ25DdXJzb3IoKSB7XG4gICAgdGhpcy5jdXJzb3JQb3MgPSB0aGlzLm1hc2tlZC5uZWFyZXN0SW5wdXRQb3ModGhpcy5tYXNrZWQubmVhcmVzdElucHV0UG9zKHRoaXMuY3Vyc29yUG9zLCBESVJFQ1RJT04uTEVGVCkpO1xuICB9XG5cbiAgLyoqIEFsaWducyBjdXJzb3Igb25seSBpZiBzZWxlY3Rpb24gaXMgZW1wdHkgKi9cbiAgYWxpZ25DdXJzb3JGcmllbmRseSgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25TdGFydCAhPT0gdGhpcy5jdXJzb3JQb3MpIHJldHVybjsgLy8gc2tpcCBpZiByYW5nZSBpcyBzZWxlY3RlZFxuICAgIHRoaXMuYWxpZ25DdXJzb3IoKTtcbiAgfVxuXG4gIC8qKiBBZGRzIGxpc3RlbmVyIG9uIGN1c3RvbSBldmVudCAqL1xuICBvbihldiwgaGFuZGxlcikge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzW2V2XSkgdGhpcy5fbGlzdGVuZXJzW2V2XSA9IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVyc1tldl0ucHVzaChoYW5kbGVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGN1c3RvbSBldmVudCBsaXN0ZW5lciAqL1xuICBvZmYoZXYsIGhhbmRsZXIpIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tldl0pIHJldHVybiB0aGlzO1xuICAgIGlmICghaGFuZGxlcikge1xuICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldl07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgY29uc3QgaEluZGV4ID0gdGhpcy5fbGlzdGVuZXJzW2V2XS5pbmRleE9mKGhhbmRsZXIpO1xuICAgIGlmIChoSW5kZXggPj0gMCkgdGhpcy5fbGlzdGVuZXJzW2V2XS5zcGxpY2UoaEluZGV4LCAxKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHZpZXcgaW5wdXQgZXZlbnQgKi9cbiAgX29uSW5wdXQoZSkge1xuICAgIHRoaXMuX2lucHV0RXZlbnQgPSBlO1xuICAgIHRoaXMuX2Fib3J0VXBkYXRlQ3Vyc29yKCk7XG5cbiAgICAvLyBmaXggc3RyYW5nZSBJRSBiZWhhdmlvclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uKSByZXR1cm4gdGhpcy51cGRhdGVWYWx1ZSgpO1xuICAgIGNvbnN0IGRldGFpbHMgPSBuZXcgQWN0aW9uRGV0YWlscyhcbiAgICAvLyBuZXcgc3RhdGVcbiAgICB0aGlzLmVsLnZhbHVlLCB0aGlzLmN1cnNvclBvcyxcbiAgICAvLyBvbGQgc3RhdGVcbiAgICB0aGlzLmRpc3BsYXlWYWx1ZSwgdGhpcy5fc2VsZWN0aW9uKTtcbiAgICBjb25zdCBvbGRSYXdWYWx1ZSA9IHRoaXMubWFza2VkLnJhd0lucHV0VmFsdWU7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5tYXNrZWQuc3BsaWNlKGRldGFpbHMuc3RhcnRDaGFuZ2VQb3MsIGRldGFpbHMucmVtb3ZlZC5sZW5ndGgsIGRldGFpbHMuaW5zZXJ0ZWQsIGRldGFpbHMucmVtb3ZlRGlyZWN0aW9uLCB7XG4gICAgICBpbnB1dDogdHJ1ZSxcbiAgICAgIHJhdzogdHJ1ZVxuICAgIH0pLm9mZnNldDtcblxuICAgIC8vIGZvcmNlIGFsaWduIGluIHJlbW92ZSBkaXJlY3Rpb24gb25seSBpZiBubyBpbnB1dCBjaGFycyB3ZXJlIHJlbW92ZWRcbiAgICAvLyBvdGhlcndpc2Ugd2Ugc3RpbGwgbmVlZCB0byBhbGlnbiB3aXRoIE5PTkUgKHRvIGdldCBvdXQgZnJvbSBmaXhlZCBzeW1ib2xzIGZvciBpbnN0YW5jZSlcbiAgICBjb25zdCByZW1vdmVEaXJlY3Rpb24gPSBvbGRSYXdWYWx1ZSA9PT0gdGhpcy5tYXNrZWQucmF3SW5wdXRWYWx1ZSA/IGRldGFpbHMucmVtb3ZlRGlyZWN0aW9uIDogRElSRUNUSU9OLk5PTkU7XG4gICAgbGV0IGN1cnNvclBvcyA9IHRoaXMubWFza2VkLm5lYXJlc3RJbnB1dFBvcyhkZXRhaWxzLnN0YXJ0Q2hhbmdlUG9zICsgb2Zmc2V0LCByZW1vdmVEaXJlY3Rpb24pO1xuICAgIGlmIChyZW1vdmVEaXJlY3Rpb24gIT09IERJUkVDVElPTi5OT05FKSBjdXJzb3JQb3MgPSB0aGlzLm1hc2tlZC5uZWFyZXN0SW5wdXRQb3MoY3Vyc29yUG9zLCBESVJFQ1RJT04uTk9ORSk7XG4gICAgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gICAgdGhpcy51cGRhdGVDdXJzb3IoY3Vyc29yUG9zKTtcbiAgICBkZWxldGUgdGhpcy5faW5wdXRFdmVudDtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHZpZXcgY2hhbmdlIGV2ZW50IGFuZCBjb21taXRzIG1vZGVsIHZhbHVlICovXG4gIF9vbkNoYW5nZSgpIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5VmFsdWUgIT09IHRoaXMuZWwudmFsdWUpIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsdWUoKTtcbiAgICB9XG4gICAgdGhpcy5tYXNrZWQuZG9Db21taXQoKTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgICB0aGlzLl9zYXZlU2VsZWN0aW9uKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyB2aWV3IGRyb3AgZXZlbnQsIHByZXZlbnRzIGJ5IGRlZmF1bHQgKi9cbiAgX29uRHJvcChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICAvKiogUmVzdG9yZSBsYXN0IHNlbGVjdGlvbiBvbiBmb2N1cyAqL1xuICBfb25Gb2N1cyhldikge1xuICAgIHRoaXMuYWxpZ25DdXJzb3JGcmllbmRseSgpO1xuICB9XG5cbiAgLyoqIFJlc3RvcmUgbGFzdCBzZWxlY3Rpb24gb24gZm9jdXMgKi9cbiAgX29uQ2xpY2soZXYpIHtcbiAgICB0aGlzLmFsaWduQ3Vyc29yRnJpZW5kbHkoKTtcbiAgfVxuXG4gIC8qKiBVbmJpbmQgdmlldyBldmVudHMgYW5kIHJlbW92ZXMgZWxlbWVudCByZWZlcmVuY2UgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl91bmJpbmRFdmVudHMoKTtcbiAgICAvLyAkRmxvd0ZpeE1lIHdoeSBub3QgZG8gc28/XG4gICAgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGRlbGV0ZSB0aGlzLmVsO1xuICB9XG59XG5JTWFzay5JbnB1dE1hc2sgPSBJbnB1dE1hc2s7XG5cbmV4cG9ydCB7IElucHV0TWFzayBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuXG4vKipcbiAgR2VuZXJpYyBlbGVtZW50IEFQSSB0byB1c2Ugd2l0aCBtYXNrXG4gIEBpbnRlcmZhY2VcbiovXG5jbGFzcyBNYXNrRWxlbWVudCB7XG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiBTYWZlbHkgcmV0dXJucyBzZWxlY3Rpb24gc3RhcnQgKi9cbiAgZ2V0IHNlbGVjdGlvblN0YXJ0KCkge1xuICAgIGxldCBzdGFydDtcbiAgICB0cnkge1xuICAgICAgc3RhcnQgPSB0aGlzLl91bnNhZmVTZWxlY3Rpb25TdGFydDtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBzdGFydCAhPSBudWxsID8gc3RhcnQgOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBTYWZlbHkgcmV0dXJucyBzZWxlY3Rpb24gZW5kICovXG4gIGdldCBzZWxlY3Rpb25FbmQoKSB7XG4gICAgbGV0IGVuZDtcbiAgICB0cnkge1xuICAgICAgZW5kID0gdGhpcy5fdW5zYWZlU2VsZWN0aW9uRW5kO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgcmV0dXJuIGVuZCAhPSBudWxsID8gZW5kIDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gIH1cblxuICAvKiogU2FmZWx5IHNldHMgZWxlbWVudCBzZWxlY3Rpb24gKi9cbiAgc2VsZWN0KHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoc3RhcnQgPT0gbnVsbCB8fCBlbmQgPT0gbnVsbCB8fCBzdGFydCA9PT0gdGhpcy5zZWxlY3Rpb25TdGFydCAmJiBlbmQgPT09IHRoaXMuc2VsZWN0aW9uRW5kKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX3Vuc2FmZVNlbGVjdChzdGFydCwgZW5kKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG5cbiAgLyoqIFNob3VsZCBiZSBvdmVycmlkZW4gaW4gc3ViY2xhc3NlcyAqL1xuICBfdW5zYWZlU2VsZWN0KHN0YXJ0LCBlbmQpIHt9XG4gIC8qKiBTaG91bGQgYmUgb3ZlcnJpZGVuIGluIHN1YmNsYXNzZXMgKi9cbiAgZ2V0IGlzQWN0aXZlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvKiogU2hvdWxkIGJlIG92ZXJyaWRlbiBpbiBzdWJjbGFzc2VzICovXG4gIGJpbmRFdmVudHMoaGFuZGxlcnMpIHt9XG4gIC8qKiBTaG91bGQgYmUgb3ZlcnJpZGVuIGluIHN1YmNsYXNzZXMgKi9cbiAgdW5iaW5kRXZlbnRzKCkge31cbn1cbklNYXNrLk1hc2tFbGVtZW50ID0gTWFza0VsZW1lbnQ7XG5cbmV4cG9ydCB7IE1hc2tFbGVtZW50IGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IERJUkVDVElPTiB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICcuL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9ob2xkZXIuanMnO1xuXG4vKiogUHJvdmlkZXMgZGV0YWlscyBvZiBjaGFuZ2luZyBpbnB1dCAqL1xuY2xhc3MgQWN0aW9uRGV0YWlscyB7XG4gIC8qKiBDdXJyZW50IGlucHV0IHZhbHVlICovXG5cbiAgLyoqIEN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uICovXG5cbiAgLyoqIE9sZCBpbnB1dCB2YWx1ZSAqL1xuXG4gIC8qKiBPbGQgc2VsZWN0aW9uICovXG5cbiAgY29uc3RydWN0b3IodmFsdWUsIGN1cnNvclBvcywgb2xkVmFsdWUsIG9sZFNlbGVjdGlvbikge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmN1cnNvclBvcyA9IGN1cnNvclBvcztcbiAgICB0aGlzLm9sZFZhbHVlID0gb2xkVmFsdWU7XG4gICAgdGhpcy5vbGRTZWxlY3Rpb24gPSBvbGRTZWxlY3Rpb247XG5cbiAgICAvLyBkb3VibGUgY2hlY2sgaWYgbGVmdCBwYXJ0IHdhcyBjaGFuZ2VkIChhdXRvZmlsbGluZywgb3RoZXIgbm9uLXN0YW5kYXJkIGlucHV0IHRyaWdnZXJzKVxuICAgIHdoaWxlICh0aGlzLnZhbHVlLnNsaWNlKDAsIHRoaXMuc3RhcnRDaGFuZ2VQb3MpICE9PSB0aGlzLm9sZFZhbHVlLnNsaWNlKDAsIHRoaXMuc3RhcnRDaGFuZ2VQb3MpKSB7XG4gICAgICAtLXRoaXMub2xkU2VsZWN0aW9uLnN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgIFN0YXJ0IGNoYW5naW5nIHBvc2l0aW9uXG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCBzdGFydENoYW5nZVBvcygpIHtcbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy5jdXJzb3JQb3MsIHRoaXMub2xkU2VsZWN0aW9uLnN0YXJ0KTtcbiAgfVxuXG4gIC8qKlxuICAgIEluc2VydGVkIHN5bWJvbHMgY291bnRcbiAgICBAcmVhZG9ubHlcbiAgKi9cbiAgZ2V0IGluc2VydGVkQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3Vyc29yUG9zIC0gdGhpcy5zdGFydENoYW5nZVBvcztcbiAgfVxuXG4gIC8qKlxuICAgIEluc2VydGVkIHN5bWJvbHNcbiAgICBAcmVhZG9ubHlcbiAgKi9cbiAgZ2V0IGluc2VydGVkKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLnN1YnN0cih0aGlzLnN0YXJ0Q2hhbmdlUG9zLCB0aGlzLmluc2VydGVkQ291bnQpO1xuICB9XG5cbiAgLyoqXG4gICAgUmVtb3ZlZCBzeW1ib2xzIGNvdW50XG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCByZW1vdmVkQ291bnQoKSB7XG4gICAgLy8gTWF0aC5tYXggZm9yIG9wcG9zaXRlIG9wZXJhdGlvblxuICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm9sZFNlbGVjdGlvbi5lbmQgLSB0aGlzLnN0YXJ0Q2hhbmdlUG9zIHx8XG4gICAgLy8gZm9yIERlbGV0ZVxuICAgIHRoaXMub2xkVmFsdWUubGVuZ3RoIC0gdGhpcy52YWx1ZS5sZW5ndGgsIDApO1xuICB9XG5cbiAgLyoqXG4gICAgUmVtb3ZlZCBzeW1ib2xzXG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCByZW1vdmVkKCkge1xuICAgIHJldHVybiB0aGlzLm9sZFZhbHVlLnN1YnN0cih0aGlzLnN0YXJ0Q2hhbmdlUG9zLCB0aGlzLnJlbW92ZWRDb3VudCk7XG4gIH1cblxuICAvKipcbiAgICBVbmNoYW5nZWQgaGVhZCBzeW1ib2xzXG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCBoZWFkKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLnN1YnN0cmluZygwLCB0aGlzLnN0YXJ0Q2hhbmdlUG9zKTtcbiAgfVxuXG4gIC8qKlxuICAgIFVuY2hhbmdlZCB0YWlsIHN5bWJvbHNcbiAgICBAcmVhZG9ubHlcbiAgKi9cbiAgZ2V0IHRhaWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUuc3Vic3RyaW5nKHRoaXMuc3RhcnRDaGFuZ2VQb3MgKyB0aGlzLmluc2VydGVkQ291bnQpO1xuICB9XG5cbiAgLyoqXG4gICAgUmVtb3ZlIGRpcmVjdGlvblxuICAgIEByZWFkb25seVxuICAqL1xuICBnZXQgcmVtb3ZlRGlyZWN0aW9uKCkge1xuICAgIGlmICghdGhpcy5yZW1vdmVkQ291bnQgfHwgdGhpcy5pbnNlcnRlZENvdW50KSByZXR1cm4gRElSRUNUSU9OLk5PTkU7XG5cbiAgICAvLyBhbGlnbiByaWdodCBpZiBkZWxldGUgYXQgcmlnaHRcbiAgICByZXR1cm4gKHRoaXMub2xkU2VsZWN0aW9uLmVuZCA9PT0gdGhpcy5jdXJzb3JQb3MgfHwgdGhpcy5vbGRTZWxlY3Rpb24uc3RhcnQgPT09IHRoaXMuY3Vyc29yUG9zKSAmJlxuICAgIC8vIGlmIG5vdCByYW5nZSByZW1vdmVkIChldmVudCB3aXRoIGJhY2tzcGFjZSlcbiAgICB0aGlzLm9sZFNlbGVjdGlvbi5lbmQgPT09IHRoaXMub2xkU2VsZWN0aW9uLnN0YXJ0ID8gRElSRUNUSU9OLlJJR0hUIDogRElSRUNUSU9OLkxFRlQ7XG4gIH1cbn1cblxuZXhwb3J0IHsgQWN0aW9uRGV0YWlscyBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgSU1hc2sgZnJvbSAnLi9ob2xkZXIuanMnO1xuXG4vKipcbiAgUHJvdmlkZXMgZGV0YWlscyBvZiBjaGFuZ2luZyBtb2RlbCB2YWx1ZVxuICBAcGFyYW0ge09iamVjdH0gW2RldGFpbHNdXG4gIEBwYXJhbSB7c3RyaW5nfSBbZGV0YWlscy5pbnNlcnRlZF0gLSBJbnNlcnRlZCBzeW1ib2xzXG4gIEBwYXJhbSB7Ym9vbGVhbn0gW2RldGFpbHMuc2tpcF0gLSBDYW4gc2tpcCBjaGFyc1xuICBAcGFyYW0ge251bWJlcn0gW2RldGFpbHMucmVtb3ZlQ291bnRdIC0gUmVtb3ZlZCBzeW1ib2xzIGNvdW50XG4gIEBwYXJhbSB7bnVtYmVyfSBbZGV0YWlscy50YWlsU2hpZnRdIC0gQWRkaXRpb25hbCBvZmZzZXQgaWYgYW55IGNoYW5nZXMgb2NjdXJyZWQgYmVmb3JlIHRhaWxcbiovXG5jbGFzcyBDaGFuZ2VEZXRhaWxzIHtcbiAgLyoqIEluc2VydGVkIHN5bWJvbHMgKi9cblxuICAvKiogQ2FuIHNraXAgY2hhcnMgKi9cblxuICAvKiogQWRkaXRpb25hbCBvZmZzZXQgaWYgYW55IGNoYW5nZXMgb2NjdXJyZWQgYmVmb3JlIHRhaWwgKi9cblxuICAvKiogUmF3IGluc2VydGVkIGlzIHVzZWQgYnkgZHluYW1pYyBtYXNrICovXG5cbiAgY29uc3RydWN0b3IoZGV0YWlscykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgaW5zZXJ0ZWQ6ICcnLFxuICAgICAgcmF3SW5zZXJ0ZWQ6ICcnLFxuICAgICAgc2tpcDogZmFsc2UsXG4gICAgICB0YWlsU2hpZnQ6IDBcbiAgICB9LCBkZXRhaWxzKTtcbiAgfVxuXG4gIC8qKlxuICAgIEFnZ3JlZ2F0ZSBjaGFuZ2VzXG4gICAgQHJldHVybnMge0NoYW5nZURldGFpbHN9IGB0aGlzYFxuICAqL1xuICBhZ2dyZWdhdGUoZGV0YWlscykge1xuICAgIHRoaXMucmF3SW5zZXJ0ZWQgKz0gZGV0YWlscy5yYXdJbnNlcnRlZDtcbiAgICB0aGlzLnNraXAgPSB0aGlzLnNraXAgfHwgZGV0YWlscy5za2lwO1xuICAgIHRoaXMuaW5zZXJ0ZWQgKz0gZGV0YWlscy5pbnNlcnRlZDtcbiAgICB0aGlzLnRhaWxTaGlmdCArPSBkZXRhaWxzLnRhaWxTaGlmdDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBUb3RhbCBvZmZzZXQgY29uc2lkZXJpbmcgYWxsIGNoYW5nZXMgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50YWlsU2hpZnQgKyB0aGlzLmluc2VydGVkLmxlbmd0aDtcbiAgfVxufVxuSU1hc2suQ2hhbmdlRGV0YWlscyA9IENoYW5nZURldGFpbHM7XG5cbmV4cG9ydCB7IENoYW5nZURldGFpbHMgYXMgZGVmYXVsdCB9O1xuIiwiLyoqIFByb3ZpZGVzIGRldGFpbHMgb2YgY29udGludW91cyBleHRyYWN0ZWQgdGFpbCAqL1xuY2xhc3MgQ29udGludW91c1RhaWxEZXRhaWxzIHtcbiAgLyoqIFRhaWwgdmFsdWUgYXMgc3RyaW5nICovXG5cbiAgLyoqIFRhaWwgc3RhcnQgcG9zaXRpb24gKi9cblxuICAvKiogU3RhcnQgcG9zaXRpb24gKi9cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO1xuICAgIGxldCBmcm9tID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgIGxldCBzdG9wID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuZnJvbSA9IGZyb207XG4gICAgdGhpcy5zdG9wID0gc3RvcDtcbiAgfVxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuICBleHRlbmQodGFpbCkge1xuICAgIHRoaXMudmFsdWUgKz0gU3RyaW5nKHRhaWwpO1xuICB9XG4gIGFwcGVuZFRvKG1hc2tlZCkge1xuICAgIHJldHVybiBtYXNrZWQuYXBwZW5kKHRoaXMudG9TdHJpbmcoKSwge1xuICAgICAgdGFpbDogdHJ1ZVxuICAgIH0pLmFnZ3JlZ2F0ZShtYXNrZWQuX2FwcGVuZFBsYWNlaG9sZGVyKCkpO1xuICB9XG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICBmcm9tOiB0aGlzLmZyb20sXG4gICAgICBzdG9wOiB0aGlzLnN0b3BcbiAgICB9O1xuICB9XG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgc3RhdGUpO1xuICB9XG4gIHVuc2hpZnQoYmVmb3JlUG9zKSB7XG4gICAgaWYgKCF0aGlzLnZhbHVlLmxlbmd0aCB8fCBiZWZvcmVQb3MgIT0gbnVsbCAmJiB0aGlzLmZyb20gPj0gYmVmb3JlUG9zKSByZXR1cm4gJyc7XG4gICAgY29uc3Qgc2hpZnRDaGFyID0gdGhpcy52YWx1ZVswXTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgxKTtcbiAgICByZXR1cm4gc2hpZnRDaGFyO1xuICB9XG4gIHNoaWZ0KCkge1xuICAgIGlmICghdGhpcy52YWx1ZS5sZW5ndGgpIHJldHVybiAnJztcbiAgICBjb25zdCBzaGlmdENoYXIgPSB0aGlzLnZhbHVlW3RoaXMudmFsdWUubGVuZ3RoIC0gMV07XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuc2xpY2UoMCwgLTEpO1xuICAgIHJldHVybiBzaGlmdENoYXI7XG4gIH1cbn1cblxuZXhwb3J0IHsgQ29udGludW91c1RhaWxEZXRhaWxzIGFzIGRlZmF1bHQgfTtcbiIsIi8qKlxuICogQXBwbGllcyBtYXNrIG9uIGVsZW1lbnQuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudHxIVE1MVGV4dEFyZWFFbGVtZW50fE1hc2tFbGVtZW50fSBlbCAtIEVsZW1lbnQgdG8gYXBwbHkgbWFza1xuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBDdXN0b20gbWFzayBvcHRpb25zXG4gKiBAcmV0dXJuIHtJbnB1dE1hc2t9XG4gKi9cbmZ1bmN0aW9uIElNYXNrKGVsKSB7XG4gIGxldCBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgLy8gY3VycmVudGx5IGF2YWlsYWJsZSBvbmx5IGZvciBpbnB1dC1saWtlIGVsZW1lbnRzXG4gIHJldHVybiBuZXcgSU1hc2suSW5wdXRNYXNrKGVsLCBvcHRzKTtcbn1cblxuZXhwb3J0IHsgSU1hc2sgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IENoYW5nZURldGFpbHMgZnJvbSAnLi9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vaG9sZGVyLmpzJztcblxuLyoqIENoZWNrcyBpZiB2YWx1ZSBpcyBzdHJpbmcgKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHN0cikge1xuICByZXR1cm4gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgfHwgc3RyIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAgRGlyZWN0aW9uXG4gIEBwcm9wIHtzdHJpbmd9IE5PTkVcbiAgQHByb3Age3N0cmluZ30gTEVGVFxuICBAcHJvcCB7c3RyaW5nfSBGT1JDRV9MRUZUXG4gIEBwcm9wIHtzdHJpbmd9IFJJR0hUXG4gIEBwcm9wIHtzdHJpbmd9IEZPUkNFX1JJR0hUXG4qL1xuY29uc3QgRElSRUNUSU9OID0ge1xuICBOT05FOiAnTk9ORScsXG4gIExFRlQ6ICdMRUZUJyxcbiAgRk9SQ0VfTEVGVDogJ0ZPUkNFX0xFRlQnLFxuICBSSUdIVDogJ1JJR0hUJyxcbiAgRk9SQ0VfUklHSFQ6ICdGT1JDRV9SSUdIVCdcbn07XG4vKipcbiAgRGlyZWN0aW9uXG4gIEBlbnVtIHtzdHJpbmd9XG4qL1xuXG4vKiogUmV0dXJucyBuZXh0IGNoYXIgaW5kZXggaW4gZGlyZWN0aW9uICovXG5mdW5jdGlvbiBpbmRleEluRGlyZWN0aW9uKHBvcywgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTi5MRUZUKSAtLXBvcztcbiAgcmV0dXJuIHBvcztcbn1cblxuLyoqIFJldHVybnMgbmV4dCBjaGFyIHBvc2l0aW9uIGluIGRpcmVjdGlvbiAqL1xuZnVuY3Rpb24gcG9zSW5EaXJlY3Rpb24ocG9zLCBkaXJlY3Rpb24pIHtcbiAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxuICAgIGNhc2UgRElSRUNUSU9OLkZPUkNFX0xFRlQ6XG4gICAgICByZXR1cm4gLS1wb3M7XG4gICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XG4gICAgY2FzZSBESVJFQ1RJT04uRk9SQ0VfUklHSFQ6XG4gICAgICByZXR1cm4gKytwb3M7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBwb3M7XG4gIH1cbn1cblxuLyoqICovXG5mdW5jdGlvbiBmb3JjZURpcmVjdGlvbihkaXJlY3Rpb24pIHtcbiAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxuICAgICAgcmV0dXJuIERJUkVDVElPTi5GT1JDRV9MRUZUO1xuICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxuICAgICAgcmV0dXJuIERJUkVDVElPTi5GT1JDRV9SSUdIVDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgfVxufVxuXG4vKiogRXNjYXBlcyByZWd1bGFyIGV4cHJlc3Npb24gY29udHJvbCBjaGFycyAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVByZXBhcmUocHJlcCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShwcmVwKSA/IHByZXAgOiBbcHJlcCwgbmV3IENoYW5nZURldGFpbHMoKV07XG59XG5cbi8vIGNsb25lZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9lcG9iZXJlemtpbi9mYXN0LWRlZXAtZXF1YWwgd2l0aCBzbWFsbCBjaGFuZ2VzXG5mdW5jdGlvbiBvYmplY3RJbmNsdWRlcyhiLCBhKSB7XG4gIGlmIChhID09PSBiKSByZXR1cm4gdHJ1ZTtcbiAgdmFyIGFyckEgPSBBcnJheS5pc0FycmF5KGEpLFxuICAgIGFyckIgPSBBcnJheS5pc0FycmF5KGIpLFxuICAgIGk7XG4gIGlmIChhcnJBICYmIGFyckIpIHtcbiAgICBpZiAoYS5sZW5ndGggIT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykgaWYgKCFvYmplY3RJbmNsdWRlcyhhW2ldLCBiW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChhcnJBICE9IGFyckIpIHJldHVybiBmYWxzZTtcbiAgaWYgKGEgJiYgYiAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGIgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIGRhdGVBID0gYSBpbnN0YW5jZW9mIERhdGUsXG4gICAgICBkYXRlQiA9IGIgaW5zdGFuY2VvZiBEYXRlO1xuICAgIGlmIChkYXRlQSAmJiBkYXRlQikgcmV0dXJuIGEuZ2V0VGltZSgpID09IGIuZ2V0VGltZSgpO1xuICAgIGlmIChkYXRlQSAhPSBkYXRlQikgcmV0dXJuIGZhbHNlO1xuICAgIHZhciByZWdleHBBID0gYSBpbnN0YW5jZW9mIFJlZ0V4cCxcbiAgICAgIHJlZ2V4cEIgPSBiIGluc3RhbmNlb2YgUmVnRXhwO1xuICAgIGlmIChyZWdleHBBICYmIHJlZ2V4cEIpIHJldHVybiBhLnRvU3RyaW5nKCkgPT0gYi50b1N0cmluZygpO1xuICAgIGlmIChyZWdleHBBICE9IHJlZ2V4cEIpIHJldHVybiBmYWxzZTtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGEpO1xuICAgIC8vIGlmIChrZXlzLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMoYikubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKylcbiAgICAvLyAkRmxvd0ZpeE1lIC4uLiA/Pz9cbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBrZXlzW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSBpZiAoIW9iamVjdEluY2x1ZGVzKGJba2V5c1tpXV0sIGFba2V5c1tpXV0pKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoYSAmJiBiICYmIHR5cGVvZiBhID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGEudG9TdHJpbmcoKSA9PT0gYi50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqIFNlbGVjdGlvbiByYW5nZSAqL1xuXG5leHBvcnQgeyBESVJFQ1RJT04sIGVzY2FwZVJlZ0V4cCwgZm9yY2VEaXJlY3Rpb24sIGluZGV4SW5EaXJlY3Rpb24sIGlzU3RyaW5nLCBub3JtYWxpemVQcmVwYXJlLCBvYmplY3RJbmNsdWRlcywgcG9zSW5EaXJlY3Rpb24gfTtcbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgSW5wdXRNYXNrIH0gZnJvbSAnLi9jb250cm9scy9pbnB1dC5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi9jb3JlL2hvbGRlci5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IH0gZnJvbSAnLi9jb3JlL2hvbGRlci5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hc2tlZCB9IGZyb20gJy4vbWFza2VkL2Jhc2UuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXNrZWRQYXR0ZXJuIH0gZnJvbSAnLi9tYXNrZWQvcGF0dGVybi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hc2tlZEVudW0gfSBmcm9tICcuL21hc2tlZC9lbnVtLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWFza2VkUmFuZ2UgfSBmcm9tICcuL21hc2tlZC9yYW5nZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hc2tlZE51bWJlciB9IGZyb20gJy4vbWFza2VkL251bWJlci5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hc2tlZERhdGUgfSBmcm9tICcuL21hc2tlZC9kYXRlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWFza2VkUmVnRXhwIH0gZnJvbSAnLi9tYXNrZWQvcmVnZXhwLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWFza2VkRnVuY3Rpb24gfSBmcm9tICcuL21hc2tlZC9mdW5jdGlvbi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hc2tlZER5bmFtaWMgfSBmcm9tICcuL21hc2tlZC9keW5hbWljLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY3JlYXRlTWFzayB9IGZyb20gJy4vbWFza2VkL2ZhY3RvcnkuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXNrRWxlbWVudCB9IGZyb20gJy4vY29udHJvbHMvbWFzay1lbGVtZW50LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgSFRNTE1hc2tFbGVtZW50IH0gZnJvbSAnLi9jb250cm9scy9odG1sLW1hc2stZWxlbWVudC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEhUTUxDb250ZW50ZWRpdGFibGVNYXNrRWxlbWVudCB9IGZyb20gJy4vY29udHJvbHMvaHRtbC1jb250ZW50ZWRpdGFibGUtbWFzay1lbGVtZW50LmpzJztcbmV4cG9ydCB7IFBJUEVfVFlQRSwgY3JlYXRlUGlwZSwgcGlwZSB9IGZyb20gJy4vbWFza2VkL3BpcGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGFuZ2VEZXRhaWxzIH0gZnJvbSAnLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzJztcbmltcG9ydCAnLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCAnLi9jb3JlL2FjdGlvbi1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9jb3JlL2NvbnRpbnVvdXMtdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9tYXNrZWQvcGF0dGVybi9pbnB1dC1kZWZpbml0aW9uLmpzJztcbmltcG9ydCAnLi9tYXNrZWQvcGF0dGVybi9maXhlZC1kZWZpbml0aW9uLmpzJztcbmltcG9ydCAnLi9tYXNrZWQvcGF0dGVybi9jaHVuay10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuL21hc2tlZC9wYXR0ZXJuL2N1cnNvci5qcyc7XG5cbnRyeSB7XG4gIGdsb2JhbFRoaXMuSU1hc2sgPSBJTWFzaztcbn0gY2F0Y2ggKGUpIHt9XG4iLCJpbXBvcnQgQ2hhbmdlRGV0YWlscyBmcm9tICcuLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCBDb250aW51b3VzVGFpbERldGFpbHMgZnJvbSAnLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgeyBpc1N0cmluZywgbm9ybWFsaXplUHJlcGFyZSwgRElSRUNUSU9OLCBmb3JjZURpcmVjdGlvbiB9IGZyb20gJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcblxuLyoqIFN1cHBvcnRlZCBtYXNrIHR5cGUgKi9cblxuLyoqIEFwcGVuZCBmbGFncyAqL1xuXG4vKiogRXh0cmFjdCBmbGFncyAqL1xuXG4vKiogUHJvdmlkZXMgY29tbW9uIG1hc2tpbmcgc3R1ZmYgKi9cbmNsYXNzIE1hc2tlZCB7XG4gIC8vICRTaGFwZTxNYXNrZWRPcHRpb25zPjsgVE9ETyBhZnRlciBmaXggaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvaXNzdWVzLzQ3NzNcblxuICAvKiogQHR5cGUge01hc2t9ICovXG5cbiAgLyoqICovIC8vICRGbG93Rml4TWUgbm8gaWRlYXNcbiAgLyoqIFRyYW5zZm9ybXMgdmFsdWUgYmVmb3JlIG1hc2sgcHJvY2Vzc2luZyAqL1xuICAvKiogVmFsaWRhdGVzIGlmIHZhbHVlIGlzIGFjY2VwdGFibGUgKi9cbiAgLyoqIERvZXMgYWRkaXRpb25hbCBwcm9jZXNzaW5nIGluIHRoZSBlbmQgb2YgZWRpdGluZyAqL1xuICAvKiogRm9ybWF0IHR5cGVkIHZhbHVlIHRvIHN0cmluZyAqL1xuICAvKiogUGFyc2Ugc3RyZ2luIHRvIGdldCB0eXBlZCB2YWx1ZSAqL1xuICAvKiogRW5hYmxlIGNoYXJhY3RlcnMgb3ZlcndyaXRpbmcgKi9cbiAgLyoqICovXG4gIC8qKiAqL1xuICAvKiogKi9cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHRoaXMuX3ZhbHVlID0gJyc7XG4gICAgdGhpcy5fdXBkYXRlKE9iamVjdC5hc3NpZ24oe30sIE1hc2tlZC5ERUZBVUxUUywgb3B0cykpO1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKiogU2V0cyBhbmQgYXBwbGllcyBuZXcgb3B0aW9ucyAqL1xuICB1cGRhdGVPcHRpb25zKG9wdHMpIHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKG9wdHMpLmxlbmd0aCkgcmV0dXJuO1xuICAgIC8vICRGbG93Rml4TWVcbiAgICB0aGlzLndpdGhWYWx1ZVJlZnJlc2godGhpcy5fdXBkYXRlLmJpbmQodGhpcywgb3B0cykpO1xuICB9XG5cbiAgLyoqXG4gICAgU2V0cyBuZXcgb3B0aW9uc1xuICAgIEBwcm90ZWN0ZWRcbiAgKi9cbiAgX3VwZGF0ZShvcHRzKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKiBNYXNrIHN0YXRlICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgX3ZhbHVlOiB0aGlzLnZhbHVlXG4gICAgfTtcbiAgfVxuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHN0YXRlLl92YWx1ZTtcbiAgfVxuXG4gIC8qKiBSZXNldHMgdmFsdWUgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fdmFsdWUgPSAnJztcbiAgfVxuXG4gIC8qKiAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMucmVzb2x2ZSh2YWx1ZSk7XG4gIH1cblxuICAvKiogUmVzb2x2ZSBuZXcgdmFsdWUgKi9cbiAgcmVzb2x2ZSh2YWx1ZSkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLmFwcGVuZCh2YWx1ZSwge1xuICAgICAgaW5wdXQ6IHRydWVcbiAgICB9LCAnJyk7XG4gICAgdGhpcy5kb0NvbW1pdCgpO1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgLyoqICovXG4gIGdldCB1bm1hc2tlZFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG4gIHNldCB1bm1hc2tlZFZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMuYXBwZW5kKHZhbHVlLCB7fSwgJycpO1xuICAgIHRoaXMuZG9Db21taXQoKTtcbiAgfVxuXG4gIC8qKiAqL1xuICBnZXQgdHlwZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kb1BhcnNlKHRoaXMudmFsdWUpO1xuICB9XG4gIHNldCB0eXBlZFZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuZG9Gb3JtYXQodmFsdWUpO1xuICB9XG5cbiAgLyoqIFZhbHVlIHRoYXQgaW5jbHVkZXMgcmF3IHVzZXIgaW5wdXQgKi9cbiAgZ2V0IHJhd0lucHV0VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXh0cmFjdElucHV0KDAsIHRoaXMudmFsdWUubGVuZ3RoLCB7XG4gICAgICByYXc6IHRydWVcbiAgICB9KTtcbiAgfVxuICBzZXQgcmF3SW5wdXRWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLmFwcGVuZCh2YWx1ZSwge1xuICAgICAgcmF3OiB0cnVlXG4gICAgfSwgJycpO1xuICAgIHRoaXMuZG9Db21taXQoKTtcbiAgfVxuICBnZXQgZGlzcGxheVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgLyoqICovXG4gIGdldCBpc0NvbXBsZXRlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqICovXG4gIGdldCBpc0ZpbGxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0NvbXBsZXRlO1xuICB9XG5cbiAgLyoqIEZpbmRzIG5lYXJlc3QgaW5wdXQgcG9zaXRpb24gaW4gZGlyZWN0aW9uICovXG4gIG5lYXJlc3RJbnB1dFBvcyhjdXJzb3JQb3MsIGRpcmVjdGlvbikge1xuICAgIHJldHVybiBjdXJzb3JQb3M7XG4gIH1cbiAgdG90YWxJbnB1dFBvc2l0aW9ucygpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLnZhbHVlLmxlbmd0aCwgdG9Qb3MgLSBmcm9tUG9zKTtcbiAgfVxuXG4gIC8qKiBFeHRyYWN0cyB2YWx1ZSBpbiByYW5nZSBjb25zaWRlcmluZyBmbGFncyAqL1xuICBleHRyYWN0SW5wdXQoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy52YWx1ZS5zbGljZShmcm9tUG9zLCB0b1Bvcyk7XG4gIH1cblxuICAvKiogRXh0cmFjdHMgdGFpbCBpbiByYW5nZSAqL1xuICBleHRyYWN0VGFpbCgpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgQ29udGludW91c1RhaWxEZXRhaWxzKHRoaXMuZXh0cmFjdElucHV0KGZyb21Qb3MsIHRvUG9zKSwgZnJvbVBvcyk7XG4gIH1cblxuICAvKiogQXBwZW5kcyB0YWlsICovXG4gIC8vICRGbG93Rml4TWUgbm8gaWRlYXNcbiAgYXBwZW5kVGFpbCh0YWlsKSB7XG4gICAgaWYgKGlzU3RyaW5nKHRhaWwpKSB0YWlsID0gbmV3IENvbnRpbnVvdXNUYWlsRGV0YWlscyhTdHJpbmcodGFpbCkpO1xuICAgIHJldHVybiB0YWlsLmFwcGVuZFRvKHRoaXMpO1xuICB9XG5cbiAgLyoqIEFwcGVuZHMgY2hhciAqL1xuICBfYXBwZW5kQ2hhclJhdyhjaCkge1xuICAgIGlmICghY2gpIHJldHVybiBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIHRoaXMuX3ZhbHVlICs9IGNoO1xuICAgIHJldHVybiBuZXcgQ2hhbmdlRGV0YWlscyh7XG4gICAgICBpbnNlcnRlZDogY2gsXG4gICAgICByYXdJbnNlcnRlZDogY2hcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBBcHBlbmRzIGNoYXIgKi9cbiAgX2FwcGVuZENoYXIoY2gpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGxldCBjaGVja1RhaWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBjb25zaXN0ZW50U3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIGxldCBkZXRhaWxzO1xuICAgIFtjaCwgZGV0YWlsc10gPSBub3JtYWxpemVQcmVwYXJlKHRoaXMuZG9QcmVwYXJlKGNoLCBmbGFncykpO1xuICAgIGRldGFpbHMgPSBkZXRhaWxzLmFnZ3JlZ2F0ZSh0aGlzLl9hcHBlbmRDaGFyUmF3KGNoLCBmbGFncykpO1xuICAgIGlmIChkZXRhaWxzLmluc2VydGVkKSB7XG4gICAgICBsZXQgY29uc2lzdGVudFRhaWw7XG4gICAgICBsZXQgYXBwZW5kZWQgPSB0aGlzLmRvVmFsaWRhdGUoZmxhZ3MpICE9PSBmYWxzZTtcbiAgICAgIGlmIChhcHBlbmRlZCAmJiBjaGVja1RhaWwgIT0gbnVsbCkge1xuICAgICAgICAvLyB2YWxpZGF0aW9uIG9rLCBjaGVjayB0YWlsXG4gICAgICAgIGNvbnN0IGJlZm9yZVRhaWxTdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGlmICh0aGlzLm92ZXJ3cml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnNpc3RlbnRUYWlsID0gY2hlY2tUYWlsLnN0YXRlO1xuICAgICAgICAgIGNoZWNrVGFpbC51bnNoaWZ0KHRoaXMudmFsdWUubGVuZ3RoIC0gZGV0YWlscy50YWlsU2hpZnQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0YWlsRGV0YWlscyA9IHRoaXMuYXBwZW5kVGFpbChjaGVja1RhaWwpO1xuICAgICAgICBhcHBlbmRlZCA9IHRhaWxEZXRhaWxzLnJhd0luc2VydGVkID09PSBjaGVja1RhaWwudG9TdHJpbmcoKTtcblxuICAgICAgICAvLyBub3Qgb2ssIHRyeSBzaGlmdFxuICAgICAgICBpZiAoIShhcHBlbmRlZCAmJiB0YWlsRGV0YWlscy5pbnNlcnRlZCkgJiYgdGhpcy5vdmVyd3JpdGUgPT09ICdzaGlmdCcpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlID0gYmVmb3JlVGFpbFN0YXRlO1xuICAgICAgICAgIGNvbnNpc3RlbnRUYWlsID0gY2hlY2tUYWlsLnN0YXRlO1xuICAgICAgICAgIGNoZWNrVGFpbC5zaGlmdCgpO1xuICAgICAgICAgIHRhaWxEZXRhaWxzID0gdGhpcy5hcHBlbmRUYWlsKGNoZWNrVGFpbCk7XG4gICAgICAgICAgYXBwZW5kZWQgPSB0YWlsRGV0YWlscy5yYXdJbnNlcnRlZCA9PT0gY2hlY2tUYWlsLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBvaywgcm9sbGJhY2sgc3RhdGUgYWZ0ZXIgdGFpbFxuICAgICAgICBpZiAoYXBwZW5kZWQgJiYgdGFpbERldGFpbHMuaW5zZXJ0ZWQpIHRoaXMuc3RhdGUgPSBiZWZvcmVUYWlsU3RhdGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHJldmVydCBhbGwgaWYgc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIGlmICghYXBwZW5kZWQpIHtcbiAgICAgICAgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBjb25zaXN0ZW50U3RhdGU7XG4gICAgICAgIGlmIChjaGVja1RhaWwgJiYgY29uc2lzdGVudFRhaWwpIGNoZWNrVGFpbC5zdGF0ZSA9IGNvbnNpc3RlbnRUYWlsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuXG4gIC8qKiBBcHBlbmRzIG9wdGlvbmFsIHBsYWNlaG9sZGVyIGF0IGVuZCAqL1xuICBfYXBwZW5kUGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gIH1cblxuICAvKiogQXBwZW5kcyBvcHRpb25hbCBlYWdlciBwbGFjZWhvbGRlciBhdCBlbmQgKi9cbiAgX2FwcGVuZEVhZ2VyKCkge1xuICAgIHJldHVybiBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICB9XG5cbiAgLyoqIEFwcGVuZHMgc3ltYm9scyBjb25zaWRlcmluZyBmbGFncyAqL1xuICAvLyAkRmxvd0ZpeE1lIG5vIGlkZWFzXG4gIGFwcGVuZChzdHIsIGZsYWdzLCB0YWlsKSB7XG4gICAgaWYgKCFpc1N0cmluZyhzdHIpKSB0aHJvdyBuZXcgRXJyb3IoJ3ZhbHVlIHNob3VsZCBiZSBzdHJpbmcnKTtcbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICBjb25zdCBjaGVja1RhaWwgPSBpc1N0cmluZyh0YWlsKSA/IG5ldyBDb250aW51b3VzVGFpbERldGFpbHMoU3RyaW5nKHRhaWwpKSA6IHRhaWw7XG4gICAgaWYgKGZsYWdzICE9PSBudWxsICYmIGZsYWdzICE9PSB2b2lkIDAgJiYgZmxhZ3MudGFpbCkgZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgZm9yIChsZXQgY2kgPSAwOyBjaSA8IHN0ci5sZW5ndGg7ICsrY2kpIHtcbiAgICAgIGNvbnN0IGQgPSB0aGlzLl9hcHBlbmRDaGFyKHN0cltjaV0sIGZsYWdzLCBjaGVja1RhaWwpO1xuICAgICAgaWYgKCFkLnJhd0luc2VydGVkICYmICF0aGlzLmRvU2tpcEludmFsaWQoc3RyW2NpXSwgZmxhZ3MsIGNoZWNrVGFpbCkpIGJyZWFrO1xuICAgICAgZGV0YWlscy5hZ2dyZWdhdGUoZCk7XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kIHRhaWwgYnV0IGFnZ3JlZ2F0ZSBvbmx5IHRhaWxTaGlmdFxuICAgIGlmIChjaGVja1RhaWwgIT0gbnVsbCkge1xuICAgICAgZGV0YWlscy50YWlsU2hpZnQgKz0gdGhpcy5hcHBlbmRUYWlsKGNoZWNrVGFpbCkudGFpbFNoaWZ0O1xuICAgICAgLy8gVE9ETyBpdCdzIGEgZ29vZCBpZGVhIHRvIGNsZWFyIHN0YXRlIGFmdGVyIGFwcGVuZGluZyBlbmRzXG4gICAgICAvLyBidXQgaXQgY2F1c2VzIGJ1Z3Mgd2hlbiBvbmUgYXBwZW5kIGNhbGxzIGFub3RoZXIgKHdoZW4gZHluYW1pYyBkaXNwYXRjaCBzZXQgcmF3SW5wdXRWYWx1ZSlcbiAgICAgIC8vIHRoaXMuX3Jlc2V0QmVmb3JlVGFpbFN0YXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKCh0aGlzLmVhZ2VyID09PSB0cnVlIHx8IHRoaXMuZWFnZXIgPT09ICdhcHBlbmQnKSAmJiBmbGFncyAhPT0gbnVsbCAmJiBmbGFncyAhPT0gdm9pZCAwICYmIGZsYWdzLmlucHV0ICYmIHN0cikge1xuICAgICAgZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5fYXBwZW5kRWFnZXIoKSk7XG4gICAgfVxuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG5cbiAgLyoqICovXG4gIHJlbW92ZSgpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBmcm9tUG9zKSArIHRoaXMudmFsdWUuc2xpY2UodG9Qb3MpO1xuICAgIHJldHVybiBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICB9XG5cbiAgLyoqIENhbGxzIGZ1bmN0aW9uIGFuZCByZWFwcGxpZXMgY3VycmVudCB2YWx1ZSAqL1xuICB3aXRoVmFsdWVSZWZyZXNoKGZuKSB7XG4gICAgaWYgKHRoaXMuX3JlZnJlc2hpbmcgfHwgIXRoaXMuaXNJbml0aWFsaXplZCkgcmV0dXJuIGZuKCk7XG4gICAgdGhpcy5fcmVmcmVzaGluZyA9IHRydWU7XG4gICAgY29uc3QgcmF3SW5wdXQgPSB0aGlzLnJhd0lucHV0VmFsdWU7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIGNvbnN0IHJldCA9IGZuKCk7XG4gICAgdGhpcy5yYXdJbnB1dFZhbHVlID0gcmF3SW5wdXQ7XG4gICAgLy8gYXBwZW5kIGxvc3QgdHJhaWxpbmcgY2hhcnMgYXQgZW5kXG4gICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZSAhPT0gdmFsdWUgJiYgdmFsdWUuaW5kZXhPZih0aGlzLnZhbHVlKSA9PT0gMCkge1xuICAgICAgdGhpcy5hcHBlbmQodmFsdWUuc2xpY2UodGhpcy52YWx1ZS5sZW5ndGgpLCB7fSwgJycpO1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy5fcmVmcmVzaGluZztcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqICovXG4gIHJ1bklzb2xhdGVkKGZuKSB7XG4gICAgaWYgKHRoaXMuX2lzb2xhdGVkIHx8ICF0aGlzLmlzSW5pdGlhbGl6ZWQpIHJldHVybiBmbih0aGlzKTtcbiAgICB0aGlzLl9pc29sYXRlZCA9IHRydWU7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHJldCA9IGZuKHRoaXMpO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICBkZWxldGUgdGhpcy5faXNvbGF0ZWQ7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKiAqL1xuICBkb1NraXBJbnZhbGlkKGNoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2tpcEludmFsaWQ7XG4gIH1cblxuICAvKipcbiAgICBQcmVwYXJlcyBzdHJpbmcgYmVmb3JlIG1hc2sgcHJvY2Vzc2luZ1xuICAgIEBwcm90ZWN0ZWRcbiAgKi9cbiAgZG9QcmVwYXJlKHN0cikge1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgcmV0dXJuIHRoaXMucHJlcGFyZSA/IHRoaXMucHJlcGFyZShzdHIsIHRoaXMsIGZsYWdzKSA6IHN0cjtcbiAgfVxuXG4gIC8qKlxuICAgIFZhbGlkYXRlcyBpZiB2YWx1ZSBpcyBhY2NlcHRhYmxlXG4gICAgQHByb3RlY3RlZFxuICAqL1xuICBkb1ZhbGlkYXRlKGZsYWdzKSB7XG4gICAgcmV0dXJuICghdGhpcy52YWxpZGF0ZSB8fCB0aGlzLnZhbGlkYXRlKHRoaXMudmFsdWUsIHRoaXMsIGZsYWdzKSkgJiYgKCF0aGlzLnBhcmVudCB8fCB0aGlzLnBhcmVudC5kb1ZhbGlkYXRlKGZsYWdzKSk7XG4gIH1cblxuICAvKipcbiAgICBEb2VzIGFkZGl0aW9uYWwgcHJvY2Vzc2luZyBpbiB0aGUgZW5kIG9mIGVkaXRpbmdcbiAgICBAcHJvdGVjdGVkXG4gICovXG4gIGRvQ29tbWl0KCkge1xuICAgIGlmICh0aGlzLmNvbW1pdCkgdGhpcy5jb21taXQodGhpcy52YWx1ZSwgdGhpcyk7XG4gIH1cblxuICAvKiogKi9cbiAgZG9Gb3JtYXQodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtYXQgPyB0aGlzLmZvcm1hdCh2YWx1ZSwgdGhpcykgOiB2YWx1ZTtcbiAgfVxuXG4gIC8qKiAqL1xuICBkb1BhcnNlKHN0cikge1xuICAgIHJldHVybiB0aGlzLnBhcnNlID8gdGhpcy5wYXJzZShzdHIsIHRoaXMpIDogc3RyO1xuICB9XG5cbiAgLyoqICovXG4gIHNwbGljZShzdGFydCwgZGVsZXRlQ291bnQsIGluc2VydGVkLCByZW1vdmVEaXJlY3Rpb24pIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHtcbiAgICAgIGlucHV0OiB0cnVlXG4gICAgfTtcbiAgICBjb25zdCB0YWlsUG9zID0gc3RhcnQgKyBkZWxldGVDb3VudDtcbiAgICBjb25zdCB0YWlsID0gdGhpcy5leHRyYWN0VGFpbCh0YWlsUG9zKTtcbiAgICBjb25zdCBlYWdlclJlbW92ZSA9IHRoaXMuZWFnZXIgPT09IHRydWUgfHwgdGhpcy5lYWdlciA9PT0gJ3JlbW92ZSc7XG4gICAgbGV0IG9sZFJhd1ZhbHVlO1xuICAgIGlmIChlYWdlclJlbW92ZSkge1xuICAgICAgcmVtb3ZlRGlyZWN0aW9uID0gZm9yY2VEaXJlY3Rpb24ocmVtb3ZlRGlyZWN0aW9uKTtcbiAgICAgIG9sZFJhd1ZhbHVlID0gdGhpcy5leHRyYWN0SW5wdXQoMCwgdGFpbFBvcywge1xuICAgICAgICByYXc6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBsZXQgc3RhcnRDaGFuZ2VQb3MgPSBzdGFydDtcbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IENoYW5nZURldGFpbHMoKTtcblxuICAgIC8vIGlmIGl0IGlzIGp1c3QgZGVsZXRpb24gd2l0aG91dCBpbnNlcnRpb25cbiAgICBpZiAocmVtb3ZlRGlyZWN0aW9uICE9PSBESVJFQ1RJT04uTk9ORSkge1xuICAgICAgc3RhcnRDaGFuZ2VQb3MgPSB0aGlzLm5lYXJlc3RJbnB1dFBvcyhzdGFydCwgZGVsZXRlQ291bnQgPiAxICYmIHN0YXJ0ICE9PSAwICYmICFlYWdlclJlbW92ZSA/IERJUkVDVElPTi5OT05FIDogcmVtb3ZlRGlyZWN0aW9uKTtcblxuICAgICAgLy8gYWRqdXN0IHRhaWxTaGlmdCBpZiBzdGFydCB3YXMgYWxpZ25lZFxuICAgICAgZGV0YWlscy50YWlsU2hpZnQgPSBzdGFydENoYW5nZVBvcyAtIHN0YXJ0O1xuICAgIH1cbiAgICBkZXRhaWxzLmFnZ3JlZ2F0ZSh0aGlzLnJlbW92ZShzdGFydENoYW5nZVBvcykpO1xuICAgIGlmIChlYWdlclJlbW92ZSAmJiByZW1vdmVEaXJlY3Rpb24gIT09IERJUkVDVElPTi5OT05FICYmIG9sZFJhd1ZhbHVlID09PSB0aGlzLnJhd0lucHV0VmFsdWUpIHtcbiAgICAgIGlmIChyZW1vdmVEaXJlY3Rpb24gPT09IERJUkVDVElPTi5GT1JDRV9MRUZUKSB7XG4gICAgICAgIGxldCB2YWxMZW5ndGg7XG4gICAgICAgIHdoaWxlIChvbGRSYXdWYWx1ZSA9PT0gdGhpcy5yYXdJbnB1dFZhbHVlICYmICh2YWxMZW5ndGggPSB0aGlzLnZhbHVlLmxlbmd0aCkpIHtcbiAgICAgICAgICBkZXRhaWxzLmFnZ3JlZ2F0ZShuZXcgQ2hhbmdlRGV0YWlscyh7XG4gICAgICAgICAgICB0YWlsU2hpZnQ6IC0xXG4gICAgICAgICAgfSkpLmFnZ3JlZ2F0ZSh0aGlzLnJlbW92ZSh2YWxMZW5ndGggLSAxKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocmVtb3ZlRGlyZWN0aW9uID09PSBESVJFQ1RJT04uRk9SQ0VfUklHSFQpIHtcbiAgICAgICAgdGFpbC51bnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZXRhaWxzLmFnZ3JlZ2F0ZSh0aGlzLmFwcGVuZChpbnNlcnRlZCwgZmxhZ3MsIHRhaWwpKTtcbiAgfVxuICBtYXNrRXF1YWxzKG1hc2spIHtcbiAgICByZXR1cm4gdGhpcy5tYXNrID09PSBtYXNrO1xuICB9XG4gIHR5cGVkVmFsdWVFcXVhbHModmFsdWUpIHtcbiAgICBjb25zdCB0dmFsID0gdGhpcy50eXBlZFZhbHVlO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdHZhbCB8fCBNYXNrZWQuRU1QVFlfVkFMVUVTLmluY2x1ZGVzKHZhbHVlKSAmJiBNYXNrZWQuRU1QVFlfVkFMVUVTLmluY2x1ZGVzKHR2YWwpIHx8IHRoaXMuZG9Gb3JtYXQodmFsdWUpID09PSB0aGlzLmRvRm9ybWF0KHRoaXMudHlwZWRWYWx1ZSk7XG4gIH1cbn1cbk1hc2tlZC5ERUZBVUxUUyA9IHtcbiAgZm9ybWF0OiBTdHJpbmcsXG4gIHBhcnNlOiB2ID0+IHYsXG4gIHNraXBJbnZhbGlkOiB0cnVlXG59O1xuTWFza2VkLkVNUFRZX1ZBTFVFUyA9IFt1bmRlZmluZWQsIG51bGwsICcnXTtcbklNYXNrLk1hc2tlZCA9IE1hc2tlZDtcblxuZXhwb3J0IHsgTWFza2VkIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCBNYXNrZWRQYXR0ZXJuIGZyb20gJy4vcGF0dGVybi5qcyc7XG5pbXBvcnQgTWFza2VkUmFuZ2UgZnJvbSAnLi9yYW5nZS5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuLi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzJztcbmltcG9ydCAnLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuL2Jhc2UuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NvbnRpbnVvdXMtdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2lucHV0LWRlZmluaXRpb24uanMnO1xuaW1wb3J0ICcuL2ZhY3RvcnkuanMnO1xuaW1wb3J0ICcuL3BhdHRlcm4vZml4ZWQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgJy4vcGF0dGVybi9jaHVuay10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuL3BhdHRlcm4vY3Vyc29yLmpzJztcbmltcG9ydCAnLi9yZWdleHAuanMnO1xuXG4vKiogRGF0ZSBtYXNrICovXG5jbGFzcyBNYXNrZWREYXRlIGV4dGVuZHMgTWFza2VkUGF0dGVybiB7XG4gIC8qKiBQYXR0ZXJuIG1hc2sgZm9yIGRhdGUgYWNjb3JkaW5nIHRvIHtAbGluayBNYXNrZWREYXRlI2Zvcm1hdH0gKi9cblxuICAvKiogU3RhcnQgZGF0ZSAqL1xuXG4gIC8qKiBFbmQgZGF0ZSAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKlxuICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICovXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCBNYXNrZWREYXRlLkRFRkFVTFRTLCBvcHRzKSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgX3VwZGF0ZShvcHRzKSB7XG4gICAgaWYgKG9wdHMubWFzayA9PT0gRGF0ZSkgZGVsZXRlIG9wdHMubWFzaztcbiAgICBpZiAob3B0cy5wYXR0ZXJuKSBvcHRzLm1hc2sgPSBvcHRzLnBhdHRlcm47XG4gICAgY29uc3QgYmxvY2tzID0gb3B0cy5ibG9ja3M7XG4gICAgb3B0cy5ibG9ja3MgPSBPYmplY3QuYXNzaWduKHt9LCBNYXNrZWREYXRlLkdFVF9ERUZBVUxUX0JMT0NLUygpKTtcbiAgICAvLyBhZGp1c3QgeWVhciBibG9ja1xuICAgIGlmIChvcHRzLm1pbikgb3B0cy5ibG9ja3MuWS5mcm9tID0gb3B0cy5taW4uZ2V0RnVsbFllYXIoKTtcbiAgICBpZiAob3B0cy5tYXgpIG9wdHMuYmxvY2tzLlkudG8gPSBvcHRzLm1heC5nZXRGdWxsWWVhcigpO1xuICAgIGlmIChvcHRzLm1pbiAmJiBvcHRzLm1heCAmJiBvcHRzLmJsb2Nrcy5ZLmZyb20gPT09IG9wdHMuYmxvY2tzLlkudG8pIHtcbiAgICAgIG9wdHMuYmxvY2tzLm0uZnJvbSA9IG9wdHMubWluLmdldE1vbnRoKCkgKyAxO1xuICAgICAgb3B0cy5ibG9ja3MubS50byA9IG9wdHMubWF4LmdldE1vbnRoKCkgKyAxO1xuICAgICAgaWYgKG9wdHMuYmxvY2tzLm0uZnJvbSA9PT0gb3B0cy5ibG9ja3MubS50bykge1xuICAgICAgICBvcHRzLmJsb2Nrcy5kLmZyb20gPSBvcHRzLm1pbi5nZXREYXRlKCk7XG4gICAgICAgIG9wdHMuYmxvY2tzLmQudG8gPSBvcHRzLm1heC5nZXREYXRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIE9iamVjdC5hc3NpZ24ob3B0cy5ibG9ja3MsIHRoaXMuYmxvY2tzLCBibG9ja3MpO1xuXG4gICAgLy8gYWRkIGF1dG9maXhcbiAgICBPYmplY3Qua2V5cyhvcHRzLmJsb2NrcykuZm9yRWFjaChiayA9PiB7XG4gICAgICBjb25zdCBiID0gb3B0cy5ibG9ja3NbYmtdO1xuICAgICAgaWYgKCEoJ2F1dG9maXgnIGluIGIpICYmICdhdXRvZml4JyBpbiBvcHRzKSBiLmF1dG9maXggPSBvcHRzLmF1dG9maXg7XG4gICAgfSk7XG4gICAgc3VwZXIuX3VwZGF0ZShvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb1ZhbGlkYXRlKCkge1xuICAgIGNvbnN0IGRhdGUgPSB0aGlzLmRhdGU7XG4gICAgcmV0dXJuIHN1cGVyLmRvVmFsaWRhdGUoLi4uYXJndW1lbnRzKSAmJiAoIXRoaXMuaXNDb21wbGV0ZSB8fCB0aGlzLmlzRGF0ZUV4aXN0KHRoaXMudmFsdWUpICYmIGRhdGUgIT0gbnVsbCAmJiAodGhpcy5taW4gPT0gbnVsbCB8fCB0aGlzLm1pbiA8PSBkYXRlKSAmJiAodGhpcy5tYXggPT0gbnVsbCB8fCBkYXRlIDw9IHRoaXMubWF4KSk7XG4gIH1cblxuICAvKiogQ2hlY2tzIGlmIGRhdGUgaXMgZXhpc3RzICovXG4gIGlzRGF0ZUV4aXN0KHN0cikge1xuICAgIHJldHVybiB0aGlzLmZvcm1hdCh0aGlzLnBhcnNlKHN0ciwgdGhpcyksIHRoaXMpLmluZGV4T2Yoc3RyKSA+PSAwO1xuICB9XG5cbiAgLyoqIFBhcnNlZCBEYXRlICovXG4gIGdldCBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGVkVmFsdWU7XG4gIH1cbiAgc2V0IGRhdGUoZGF0ZSkge1xuICAgIHRoaXMudHlwZWRWYWx1ZSA9IGRhdGU7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHR5cGVkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNDb21wbGV0ZSA/IHN1cGVyLnR5cGVkVmFsdWUgOiBudWxsO1xuICB9XG4gIHNldCB0eXBlZFZhbHVlKHZhbHVlKSB7XG4gICAgc3VwZXIudHlwZWRWYWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIG1hc2tFcXVhbHMobWFzaykge1xuICAgIHJldHVybiBtYXNrID09PSBEYXRlIHx8IHN1cGVyLm1hc2tFcXVhbHMobWFzayk7XG4gIH1cbn1cbk1hc2tlZERhdGUuREVGQVVMVFMgPSB7XG4gIHBhdHRlcm46ICdkey59YG17Ln1gWScsXG4gIGZvcm1hdDogZGF0ZSA9PiB7XG4gICAgaWYgKCFkYXRlKSByZXR1cm4gJyc7XG4gICAgY29uc3QgZGF5ID0gU3RyaW5nKGRhdGUuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IG1vbnRoID0gU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICByZXR1cm4gW2RheSwgbW9udGgsIHllYXJdLmpvaW4oJy4nKTtcbiAgfSxcbiAgcGFyc2U6IHN0ciA9PiB7XG4gICAgY29uc3QgW2RheSwgbW9udGgsIHllYXJdID0gc3RyLnNwbGl0KCcuJyk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcbiAgfVxufTtcbk1hc2tlZERhdGUuR0VUX0RFRkFVTFRfQkxPQ0tTID0gKCkgPT4gKHtcbiAgZDoge1xuICAgIG1hc2s6IE1hc2tlZFJhbmdlLFxuICAgIGZyb206IDEsXG4gICAgdG86IDMxLFxuICAgIG1heExlbmd0aDogMlxuICB9LFxuICBtOiB7XG4gICAgbWFzazogTWFza2VkUmFuZ2UsXG4gICAgZnJvbTogMSxcbiAgICB0bzogMTIsXG4gICAgbWF4TGVuZ3RoOiAyXG4gIH0sXG4gIFk6IHtcbiAgICBtYXNrOiBNYXNrZWRSYW5nZSxcbiAgICBmcm9tOiAxOTAwLFxuICAgIHRvOiA5OTk5XG4gIH1cbn0pO1xuSU1hc2suTWFza2VkRGF0ZSA9IE1hc2tlZERhdGU7XG5cbmV4cG9ydCB7IE1hc2tlZERhdGUgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgXyBhcyBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSB9IGZyb20gJy4uL19yb2xsdXBQbHVnaW5CYWJlbEhlbHBlcnMtNmIzYmQ0MDQuanMnO1xuaW1wb3J0IHsgRElSRUNUSU9OLCBub3JtYWxpemVQcmVwYXJlLCBvYmplY3RJbmNsdWRlcyB9IGZyb20gJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0IENoYW5nZURldGFpbHMgZnJvbSAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgY3JlYXRlTWFzayBmcm9tICcuL2ZhY3RvcnkuanMnO1xuaW1wb3J0IE1hc2tlZCBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5cbmNvbnN0IF9leGNsdWRlZCA9IFtcImNvbXBpbGVkTWFza3NcIiwgXCJjdXJyZW50TWFza1JlZlwiLCBcImN1cnJlbnRNYXNrXCJdLFxuICBfZXhjbHVkZWQyID0gW1wibWFza1wiXTtcbi8qKiBEeW5hbWljIG1hc2sgZm9yIGNob29zaW5nIGFwcm9wcmlhdGUgbWFzayBpbiBydW4tdGltZSAqL1xuY2xhc3MgTWFza2VkRHluYW1pYyBleHRlbmRzIE1hc2tlZCB7XG4gIC8qKiBDdXJyZW50bHkgY2hvc2VuIG1hc2sgKi9cblxuICAvKiogQ29tcGxpbGVkIHtAbGluayBNYXNrZWR9IG9wdGlvbnMgKi9cblxuICAvKiogQ2hvb3NlcyB7QGxpbmsgTWFza2VkfSBkZXBlbmRpbmcgb24gaW5wdXQgdmFsdWUgKi9cblxuICAvKipcbiAgICBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIoT2JqZWN0LmFzc2lnbih7fSwgTWFza2VkRHluYW1pYy5ERUZBVUxUUywgb3B0cykpO1xuICAgIHRoaXMuY3VycmVudE1hc2sgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIF91cGRhdGUob3B0cykge1xuICAgIHN1cGVyLl91cGRhdGUob3B0cyk7XG4gICAgaWYgKCdtYXNrJyBpbiBvcHRzKSB7XG4gICAgICAvLyBtYXNrIGNvdWxkIGJlIHRvdGFsbHkgZHluYW1pYyB3aXRoIG9ubHkgYGRpc3BhdGNoYCBvcHRpb25cbiAgICAgIHRoaXMuY29tcGlsZWRNYXNrcyA9IEFycmF5LmlzQXJyYXkob3B0cy5tYXNrKSA/IG9wdHMubWFzay5tYXAobSA9PiBjcmVhdGVNYXNrKG0pKSA6IFtdO1xuXG4gICAgICAvLyB0aGlzLmN1cnJlbnRNYXNrID0gdGhpcy5kb0Rpc3BhdGNoKCcnKTsgLy8gcHJvYmFibHkgbm90IG5lZWRlZCBidXQgbGV0cyBzZWVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgX2FwcGVuZENoYXJSYXcoY2gpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLl9hcHBseURpc3BhdGNoKGNoLCBmbGFncyk7XG4gICAgaWYgKHRoaXMuY3VycmVudE1hc2spIHtcbiAgICAgIGRldGFpbHMuYWdncmVnYXRlKHRoaXMuY3VycmVudE1hc2suX2FwcGVuZENoYXIoY2gsIHRoaXMuY3VycmVudE1hc2tGbGFncyhmbGFncykpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cbiAgX2FwcGx5RGlzcGF0Y2goKSB7XG4gICAgbGV0IGFwcGVuZGVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnJztcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGxldCB0YWlsID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcbiAgICBjb25zdCBwcmV2VmFsdWVCZWZvcmVUYWlsID0gZmxhZ3MudGFpbCAmJiBmbGFncy5fYmVmb3JlVGFpbFN0YXRlICE9IG51bGwgPyBmbGFncy5fYmVmb3JlVGFpbFN0YXRlLl92YWx1ZSA6IHRoaXMudmFsdWU7XG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9IHRoaXMucmF3SW5wdXRWYWx1ZTtcbiAgICBjb25zdCBpbnNlcnRWYWx1ZSA9IGZsYWdzLnRhaWwgJiYgZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZSAhPSBudWxsID9cbiAgICAvLyAkRmxvd0ZpeE1lIC0gdGlyZWQgdG8gZmlnaHQgd2l0aCB0eXBlIHN5c3RlbVxuICAgIGZsYWdzLl9iZWZvcmVUYWlsU3RhdGUuX3Jhd0lucHV0VmFsdWUgOiBpbnB1dFZhbHVlO1xuICAgIGNvbnN0IHRhaWxWYWx1ZSA9IGlucHV0VmFsdWUuc2xpY2UoaW5zZXJ0VmFsdWUubGVuZ3RoKTtcbiAgICBjb25zdCBwcmV2TWFzayA9IHRoaXMuY3VycmVudE1hc2s7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgY29uc3QgcHJldk1hc2tTdGF0ZSA9IHByZXZNYXNrID09PSBudWxsIHx8IHByZXZNYXNrID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmV2TWFzay5zdGF0ZTtcblxuICAgIC8vIGNsb25lIGZsYWdzIHRvIHByZXZlbnQgb3ZlcndyaXRpbmcgYF9iZWZvcmVUYWlsU3RhdGVgXG4gICAgdGhpcy5jdXJyZW50TWFzayA9IHRoaXMuZG9EaXNwYXRjaChhcHBlbmRlZCwgT2JqZWN0LmFzc2lnbih7fSwgZmxhZ3MpLCB0YWlsKTtcblxuICAgIC8vIHJlc3RvcmUgc3RhdGUgYWZ0ZXIgZGlzcGF0Y2hcbiAgICBpZiAodGhpcy5jdXJyZW50TWFzaykge1xuICAgICAgaWYgKHRoaXMuY3VycmVudE1hc2sgIT09IHByZXZNYXNrKSB7XG4gICAgICAgIC8vIGlmIG1hc2sgY2hhbmdlZCByZWFwcGx5IGlucHV0XG4gICAgICAgIHRoaXMuY3VycmVudE1hc2sucmVzZXQoKTtcbiAgICAgICAgaWYgKGluc2VydFZhbHVlKSB7XG4gICAgICAgICAgLy8gJEZsb3dGaXhNZSAtIGl0J3Mgb2ssIHdlIGRvbid0IGNoYW5nZSBjdXJyZW50IG1hc2sgYWJvdmVcbiAgICAgICAgICBjb25zdCBkID0gdGhpcy5jdXJyZW50TWFzay5hcHBlbmQoaW5zZXJ0VmFsdWUsIHtcbiAgICAgICAgICAgIHJhdzogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRldGFpbHMudGFpbFNoaWZ0ID0gZC5pbnNlcnRlZC5sZW5ndGggLSBwcmV2VmFsdWVCZWZvcmVUYWlsLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFpbFZhbHVlKSB7XG4gICAgICAgICAgLy8gJEZsb3dGaXhNZSAtIGl0J3Mgb2ssIHdlIGRvbid0IGNoYW5nZSBjdXJyZW50IG1hc2sgYWJvdmVcbiAgICAgICAgICBkZXRhaWxzLnRhaWxTaGlmdCArPSB0aGlzLmN1cnJlbnRNYXNrLmFwcGVuZCh0YWlsVmFsdWUsIHtcbiAgICAgICAgICAgIHJhdzogdHJ1ZSxcbiAgICAgICAgICAgIHRhaWw6IHRydWVcbiAgICAgICAgICB9KS50YWlsU2hpZnQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERpc3BhdGNoIGNhbiBkbyBzb21ldGhpbmcgYmFkIHdpdGggc3RhdGUsIHNvXG4gICAgICAgIC8vIHJlc3RvcmUgcHJldiBtYXNrIHN0YXRlXG4gICAgICAgIHRoaXMuY3VycmVudE1hc2suc3RhdGUgPSBwcmV2TWFza1N0YXRlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuICBfYXBwZW5kUGxhY2Vob2xkZXIoKSB7XG4gICAgY29uc3QgZGV0YWlscyA9IHRoaXMuX2FwcGx5RGlzcGF0Y2goLi4uYXJndW1lbnRzKTtcbiAgICBpZiAodGhpcy5jdXJyZW50TWFzaykge1xuICAgICAgZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5jdXJyZW50TWFzay5fYXBwZW5kUGxhY2Vob2xkZXIoKSk7XG4gICAgfVxuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG5cbiAgLyoqXG4gICBAb3ZlcnJpZGVcbiAgKi9cbiAgX2FwcGVuZEVhZ2VyKCkge1xuICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLl9hcHBseURpc3BhdGNoKC4uLmFyZ3VtZW50cyk7XG4gICAgaWYgKHRoaXMuY3VycmVudE1hc2spIHtcbiAgICAgIGRldGFpbHMuYWdncmVnYXRlKHRoaXMuY3VycmVudE1hc2suX2FwcGVuZEVhZ2VyKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuICBhcHBlbmRUYWlsKHRhaWwpIHtcbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICBpZiAodGFpbCkgZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5fYXBwbHlEaXNwYXRjaCgnJywge30sIHRhaWwpKTtcbiAgICByZXR1cm4gZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5jdXJyZW50TWFzayA/IHRoaXMuY3VycmVudE1hc2suYXBwZW5kVGFpbCh0YWlsKSA6IHN1cGVyLmFwcGVuZFRhaWwodGFpbCkpO1xuICB9XG4gIGN1cnJlbnRNYXNrRmxhZ3MoZmxhZ3MpIHtcbiAgICB2YXIgX2ZsYWdzJF9iZWZvcmVUYWlsU3RhLCBfZmxhZ3MkX2JlZm9yZVRhaWxTdGEyO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBmbGFncywge1xuICAgICAgX2JlZm9yZVRhaWxTdGF0ZTogKChfZmxhZ3MkX2JlZm9yZVRhaWxTdGEgPSBmbGFncy5fYmVmb3JlVGFpbFN0YXRlKSA9PT0gbnVsbCB8fCBfZmxhZ3MkX2JlZm9yZVRhaWxTdGEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mbGFncyRfYmVmb3JlVGFpbFN0YS5jdXJyZW50TWFza1JlZikgPT09IHRoaXMuY3VycmVudE1hc2sgJiYgKChfZmxhZ3MkX2JlZm9yZVRhaWxTdGEyID0gZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZSkgPT09IG51bGwgfHwgX2ZsYWdzJF9iZWZvcmVUYWlsU3RhMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2ZsYWdzJF9iZWZvcmVUYWlsU3RhMi5jdXJyZW50TWFzaykgfHwgZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvRGlzcGF0Y2goYXBwZW5kZWQpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGxldCB0YWlsID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaChhcHBlbmRlZCwgdGhpcywgZmxhZ3MsIHRhaWwpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvVmFsaWRhdGUoZmxhZ3MpIHtcbiAgICByZXR1cm4gc3VwZXIuZG9WYWxpZGF0ZShmbGFncykgJiYgKCF0aGlzLmN1cnJlbnRNYXNrIHx8IHRoaXMuY3VycmVudE1hc2suZG9WYWxpZGF0ZSh0aGlzLmN1cnJlbnRNYXNrRmxhZ3MoZmxhZ3MpKSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZG9QcmVwYXJlKHN0cikge1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgbGV0IFtzLCBkZXRhaWxzXSA9IG5vcm1hbGl6ZVByZXBhcmUoc3VwZXIuZG9QcmVwYXJlKHN0ciwgZmxhZ3MpKTtcbiAgICBpZiAodGhpcy5jdXJyZW50TWFzaykge1xuICAgICAgbGV0IGN1cnJlbnREZXRhaWxzO1xuICAgICAgW3MsIGN1cnJlbnREZXRhaWxzXSA9IG5vcm1hbGl6ZVByZXBhcmUoc3VwZXIuZG9QcmVwYXJlKHMsIHRoaXMuY3VycmVudE1hc2tGbGFncyhmbGFncykpKTtcbiAgICAgIGRldGFpbHMgPSBkZXRhaWxzLmFnZ3JlZ2F0ZShjdXJyZW50RGV0YWlscyk7XG4gICAgfVxuICAgIHJldHVybiBbcywgZGV0YWlsc107XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdmFyIF90aGlzJGN1cnJlbnRNYXNrO1xuICAgIChfdGhpcyRjdXJyZW50TWFzayA9IHRoaXMuY3VycmVudE1hc2spID09PSBudWxsIHx8IF90aGlzJGN1cnJlbnRNYXNrID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRjdXJyZW50TWFzay5yZXNldCgpO1xuICAgIHRoaXMuY29tcGlsZWRNYXNrcy5mb3JFYWNoKG0gPT4gbS5yZXNldCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLnZhbHVlIDogJyc7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgc3VwZXIudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgdW5tYXNrZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TWFzayA/IHRoaXMuY3VycmVudE1hc2sudW5tYXNrZWRWYWx1ZSA6ICcnO1xuICB9XG4gIHNldCB1bm1hc2tlZFZhbHVlKHVubWFza2VkVmFsdWUpIHtcbiAgICBzdXBlci51bm1hc2tlZFZhbHVlID0gdW5tYXNrZWRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgdHlwZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TWFzayA/IHRoaXMuY3VycmVudE1hc2sudHlwZWRWYWx1ZSA6ICcnO1xuICB9XG5cbiAgLy8gcHJvYmFibHkgdHlwZWRWYWx1ZSBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCBkeW5hbWljXG4gIHNldCB0eXBlZFZhbHVlKHZhbHVlKSB7XG4gICAgbGV0IHVubWFza2VkVmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuXG4gICAgLy8gZG91YmxlIGNoZWNrIGl0XG4gICAgaWYgKHRoaXMuY3VycmVudE1hc2spIHtcbiAgICAgIHRoaXMuY3VycmVudE1hc2sudHlwZWRWYWx1ZSA9IHZhbHVlO1xuICAgICAgdW5tYXNrZWRWYWx1ZSA9IHRoaXMuY3VycmVudE1hc2sudW5tYXNrZWRWYWx1ZTtcbiAgICB9XG4gICAgdGhpcy51bm1hc2tlZFZhbHVlID0gdW5tYXNrZWRWYWx1ZTtcbiAgfVxuICBnZXQgZGlzcGxheVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRNYXNrID8gdGhpcy5jdXJyZW50TWFzay5kaXNwbGF5VmFsdWUgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgaXNDb21wbGV0ZSgpIHtcbiAgICB2YXIgX3RoaXMkY3VycmVudE1hc2syO1xuICAgIHJldHVybiBCb29sZWFuKChfdGhpcyRjdXJyZW50TWFzazIgPSB0aGlzLmN1cnJlbnRNYXNrKSA9PT0gbnVsbCB8fCBfdGhpcyRjdXJyZW50TWFzazIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJGN1cnJlbnRNYXNrMi5pc0NvbXBsZXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgaXNGaWxsZWQoKSB7XG4gICAgdmFyIF90aGlzJGN1cnJlbnRNYXNrMztcbiAgICByZXR1cm4gQm9vbGVhbigoX3RoaXMkY3VycmVudE1hc2szID0gdGhpcy5jdXJyZW50TWFzaykgPT09IG51bGwgfHwgX3RoaXMkY3VycmVudE1hc2szID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRjdXJyZW50TWFzazMuaXNGaWxsZWQpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIHJlbW92ZSgpIHtcbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICBpZiAodGhpcy5jdXJyZW50TWFzaykge1xuICAgICAgZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5jdXJyZW50TWFzay5yZW1vdmUoLi4uYXJndW1lbnRzKSlcbiAgICAgIC8vIHVwZGF0ZSB3aXRoIGRpc3BhdGNoXG4gICAgICAuYWdncmVnYXRlKHRoaXMuX2FwcGx5RGlzcGF0Y2goKSk7XG4gICAgfVxuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICB2YXIgX3RoaXMkY3VycmVudE1hc2s0O1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdXBlci5zdGF0ZSwge1xuICAgICAgX3Jhd0lucHV0VmFsdWU6IHRoaXMucmF3SW5wdXRWYWx1ZSxcbiAgICAgIGNvbXBpbGVkTWFza3M6IHRoaXMuY29tcGlsZWRNYXNrcy5tYXAobSA9PiBtLnN0YXRlKSxcbiAgICAgIGN1cnJlbnRNYXNrUmVmOiB0aGlzLmN1cnJlbnRNYXNrLFxuICAgICAgY3VycmVudE1hc2s6IChfdGhpcyRjdXJyZW50TWFzazQgPSB0aGlzLmN1cnJlbnRNYXNrKSA9PT0gbnVsbCB8fCBfdGhpcyRjdXJyZW50TWFzazQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJGN1cnJlbnRNYXNrNC5zdGF0ZVxuICAgIH0pO1xuICB9XG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGNvbnN0IHtcbiAgICAgICAgY29tcGlsZWRNYXNrcyxcbiAgICAgICAgY3VycmVudE1hc2tSZWYsXG4gICAgICAgIGN1cnJlbnRNYXNrXG4gICAgICB9ID0gc3RhdGUsXG4gICAgICBtYXNrZWRTdGF0ZSA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHN0YXRlLCBfZXhjbHVkZWQpO1xuICAgIHRoaXMuY29tcGlsZWRNYXNrcy5mb3JFYWNoKChtLCBtaSkgPT4gbS5zdGF0ZSA9IGNvbXBpbGVkTWFza3NbbWldKTtcbiAgICBpZiAoY3VycmVudE1hc2tSZWYgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jdXJyZW50TWFzayA9IGN1cnJlbnRNYXNrUmVmO1xuICAgICAgdGhpcy5jdXJyZW50TWFzay5zdGF0ZSA9IGN1cnJlbnRNYXNrO1xuICAgIH1cbiAgICBzdXBlci5zdGF0ZSA9IG1hc2tlZFN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGV4dHJhY3RJbnB1dCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TWFzayA/IHRoaXMuY3VycmVudE1hc2suZXh0cmFjdElucHV0KC4uLmFyZ3VtZW50cykgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBleHRyYWN0VGFpbCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TWFzayA/IHRoaXMuY3VycmVudE1hc2suZXh0cmFjdFRhaWwoLi4uYXJndW1lbnRzKSA6IHN1cGVyLmV4dHJhY3RUYWlsKC4uLmFyZ3VtZW50cyk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZG9Db21taXQoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudE1hc2spIHRoaXMuY3VycmVudE1hc2suZG9Db21taXQoKTtcbiAgICBzdXBlci5kb0NvbW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIG5lYXJlc3RJbnB1dFBvcygpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TWFzayA/IHRoaXMuY3VycmVudE1hc2submVhcmVzdElucHV0UG9zKC4uLmFyZ3VtZW50cykgOiBzdXBlci5uZWFyZXN0SW5wdXRQb3MoLi4uYXJndW1lbnRzKTtcbiAgfVxuICBnZXQgb3ZlcndyaXRlKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRNYXNrID8gdGhpcy5jdXJyZW50TWFzay5vdmVyd3JpdGUgOiBzdXBlci5vdmVyd3JpdGU7XG4gIH1cbiAgc2V0IG92ZXJ3cml0ZShvdmVyd3JpdGUpIHtcbiAgICBjb25zb2xlLndhcm4oJ1wib3ZlcndyaXRlXCIgb3B0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW4gZHluYW1pYyBtYXNrLCB1c2UgdGhpcyBvcHRpb24gaW4gc2libGluZ3MnKTtcbiAgfVxuICBnZXQgZWFnZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLmVhZ2VyIDogc3VwZXIuZWFnZXI7XG4gIH1cbiAgc2V0IGVhZ2VyKGVhZ2VyKSB7XG4gICAgY29uc29sZS53YXJuKCdcImVhZ2VyXCIgb3B0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW4gZHluYW1pYyBtYXNrLCB1c2UgdGhpcyBvcHRpb24gaW4gc2libGluZ3MnKTtcbiAgfVxuICBnZXQgc2tpcEludmFsaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLnNraXBJbnZhbGlkIDogc3VwZXIuc2tpcEludmFsaWQ7XG4gIH1cbiAgc2V0IHNraXBJbnZhbGlkKHNraXBJbnZhbGlkKSB7XG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCB8fCBza2lwSW52YWxpZCAhPT0gTWFza2VkLkRFRkFVTFRTLnNraXBJbnZhbGlkKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1wic2tpcEludmFsaWRcIiBvcHRpb24gaXMgbm90IGF2YWlsYWJsZSBpbiBkeW5hbWljIG1hc2ssIHVzZSB0aGlzIG9wdGlvbiBpbiBzaWJsaW5ncycpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBtYXNrRXF1YWxzKG1hc2spIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShtYXNrKSAmJiB0aGlzLmNvbXBpbGVkTWFza3MuZXZlcnkoKG0sIG1pKSA9PiB7XG4gICAgICBpZiAoIW1hc2tbbWldKSByZXR1cm47XG4gICAgICBjb25zdCBfbWFzayRtaSA9IG1hc2tbbWldLFxuICAgICAgICB7XG4gICAgICAgICAgbWFzazogb2xkTWFza1xuICAgICAgICB9ID0gX21hc2skbWksXG4gICAgICAgIHJlc3RPcHRzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX21hc2skbWksIF9leGNsdWRlZDIpO1xuICAgICAgcmV0dXJuIG9iamVjdEluY2x1ZGVzKG0sIHJlc3RPcHRzKSAmJiBtLm1hc2tFcXVhbHMob2xkTWFzayk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgdHlwZWRWYWx1ZUVxdWFscyh2YWx1ZSkge1xuICAgIHZhciBfdGhpcyRjdXJyZW50TWFzazU7XG4gICAgcmV0dXJuIEJvb2xlYW4oKF90aGlzJGN1cnJlbnRNYXNrNSA9IHRoaXMuY3VycmVudE1hc2spID09PSBudWxsIHx8IF90aGlzJGN1cnJlbnRNYXNrNSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkY3VycmVudE1hc2s1LnR5cGVkVmFsdWVFcXVhbHModmFsdWUpKTtcbiAgfVxufVxuTWFza2VkRHluYW1pYy5ERUZBVUxUUyA9IHtcbiAgZGlzcGF0Y2g6IChhcHBlbmRlZCwgbWFza2VkLCBmbGFncywgdGFpbCkgPT4ge1xuICAgIGlmICghbWFza2VkLmNvbXBpbGVkTWFza3MubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9IG1hc2tlZC5yYXdJbnB1dFZhbHVlO1xuXG4gICAgLy8gc2ltdWxhdGUgaW5wdXRcbiAgICBjb25zdCBpbnB1dHMgPSBtYXNrZWQuY29tcGlsZWRNYXNrcy5tYXAoKG0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpc0N1cnJlbnQgPSBtYXNrZWQuY3VycmVudE1hc2sgPT09IG07XG4gICAgICBjb25zdCBzdGFydElucHV0UG9zID0gaXNDdXJyZW50ID8gbS52YWx1ZS5sZW5ndGggOiBtLm5lYXJlc3RJbnB1dFBvcyhtLnZhbHVlLmxlbmd0aCwgRElSRUNUSU9OLkZPUkNFX0xFRlQpO1xuICAgICAgaWYgKG0ucmF3SW5wdXRWYWx1ZSAhPT0gaW5wdXRWYWx1ZSkge1xuICAgICAgICBtLnJlc2V0KCk7XG4gICAgICAgIG0uYXBwZW5kKGlucHV0VmFsdWUsIHtcbiAgICAgICAgICByYXc6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKCFpc0N1cnJlbnQpIHtcbiAgICAgICAgbS5yZW1vdmUoc3RhcnRJbnB1dFBvcyk7XG4gICAgICB9XG4gICAgICBtLmFwcGVuZChhcHBlbmRlZCwgbWFza2VkLmN1cnJlbnRNYXNrRmxhZ3MoZmxhZ3MpKTtcbiAgICAgIG0uYXBwZW5kVGFpbCh0YWlsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluZGV4LFxuICAgICAgICB3ZWlnaHQ6IG0ucmF3SW5wdXRWYWx1ZS5sZW5ndGgsXG4gICAgICAgIHRvdGFsSW5wdXRQb3NpdGlvbnM6IG0udG90YWxJbnB1dFBvc2l0aW9ucygwLCBNYXRoLm1heChzdGFydElucHV0UG9zLCBtLm5lYXJlc3RJbnB1dFBvcyhtLnZhbHVlLmxlbmd0aCwgRElSRUNUSU9OLkZPUkNFX0xFRlQpKSlcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBwb3AgbWFza3Mgd2l0aCBsb25nZXIgdmFsdWVzIGZpcnN0XG4gICAgaW5wdXRzLnNvcnQoKGkxLCBpMikgPT4gaTIud2VpZ2h0IC0gaTEud2VpZ2h0IHx8IGkyLnRvdGFsSW5wdXRQb3NpdGlvbnMgLSBpMS50b3RhbElucHV0UG9zaXRpb25zKTtcbiAgICByZXR1cm4gbWFza2VkLmNvbXBpbGVkTWFza3NbaW5wdXRzWzBdLmluZGV4XTtcbiAgfVxufTtcbklNYXNrLk1hc2tlZER5bmFtaWMgPSBNYXNrZWREeW5hbWljO1xuXG5leHBvcnQgeyBNYXNrZWREeW5hbWljIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCBNYXNrZWRQYXR0ZXJuIGZyb20gJy4vcGF0dGVybi5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuLi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzJztcbmltcG9ydCAnLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuL2Jhc2UuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NvbnRpbnVvdXMtdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2lucHV0LWRlZmluaXRpb24uanMnO1xuaW1wb3J0ICcuL2ZhY3RvcnkuanMnO1xuaW1wb3J0ICcuL3BhdHRlcm4vZml4ZWQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgJy4vcGF0dGVybi9jaHVuay10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuL3BhdHRlcm4vY3Vyc29yLmpzJztcbmltcG9ydCAnLi9yZWdleHAuanMnO1xuXG4vKiogUGF0dGVybiB3aGljaCB2YWxpZGF0ZXMgZW51bSB2YWx1ZXMgKi9cbmNsYXNzIE1hc2tlZEVudW0gZXh0ZW5kcyBNYXNrZWRQYXR0ZXJuIHtcbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICAgQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgKi9cbiAgX3VwZGF0ZShvcHRzKSB7XG4gICAgLy8gVE9ETyB0eXBlXG4gICAgaWYgKG9wdHMuZW51bSkgb3B0cy5tYXNrID0gJyonLnJlcGVhdChvcHRzLmVudW1bMF0ubGVuZ3RoKTtcbiAgICBzdXBlci5fdXBkYXRlKG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvVmFsaWRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW51bS5zb21lKGUgPT4gZS5pbmRleE9mKHRoaXMudW5tYXNrZWRWYWx1ZSkgPj0gMCkgJiYgc3VwZXIuZG9WYWxpZGF0ZSguLi5hcmd1bWVudHMpO1xuICB9XG59XG5JTWFzay5NYXNrZWRFbnVtID0gTWFza2VkRW51bTtcblxuZXhwb3J0IHsgTWFza2VkRW51bSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5cbi8qKiBHZXQgTWFza2VkIGNsYXNzIGJ5IG1hc2sgdHlwZSAqL1xuZnVuY3Rpb24gbWFza2VkQ2xhc3MobWFzaykge1xuICBpZiAobWFzayA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtYXNrIHByb3BlcnR5IHNob3VsZCBiZSBkZWZpbmVkJyk7XG4gIH1cblxuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChtYXNrIGluc3RhbmNlb2YgUmVnRXhwKSByZXR1cm4gSU1hc2suTWFza2VkUmVnRXhwO1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChpc1N0cmluZyhtYXNrKSkgcmV0dXJuIElNYXNrLk1hc2tlZFBhdHRlcm47XG4gIC8vICRGbG93Rml4TWVcbiAgaWYgKG1hc2sgaW5zdGFuY2VvZiBEYXRlIHx8IG1hc2sgPT09IERhdGUpIHJldHVybiBJTWFzay5NYXNrZWREYXRlO1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChtYXNrIGluc3RhbmNlb2YgTnVtYmVyIHx8IHR5cGVvZiBtYXNrID09PSAnbnVtYmVyJyB8fCBtYXNrID09PSBOdW1iZXIpIHJldHVybiBJTWFzay5NYXNrZWROdW1iZXI7XG4gIC8vICRGbG93Rml4TWVcbiAgaWYgKEFycmF5LmlzQXJyYXkobWFzaykgfHwgbWFzayA9PT0gQXJyYXkpIHJldHVybiBJTWFzay5NYXNrZWREeW5hbWljO1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChJTWFzay5NYXNrZWQgJiYgbWFzay5wcm90b3R5cGUgaW5zdGFuY2VvZiBJTWFzay5NYXNrZWQpIHJldHVybiBtYXNrO1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChtYXNrIGluc3RhbmNlb2YgSU1hc2suTWFza2VkKSByZXR1cm4gbWFzay5jb25zdHJ1Y3RvcjtcbiAgLy8gJEZsb3dGaXhNZVxuICBpZiAobWFzayBpbnN0YW5jZW9mIEZ1bmN0aW9uKSByZXR1cm4gSU1hc2suTWFza2VkRnVuY3Rpb247XG4gIGNvbnNvbGUud2FybignTWFzayBub3QgZm91bmQgZm9yIG1hc2snLCBtYXNrKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gIC8vICRGbG93Rml4TWVcbiAgcmV0dXJuIElNYXNrLk1hc2tlZDtcbn1cblxuLyoqIENyZWF0ZXMgbmV3IHtAbGluayBNYXNrZWR9IGRlcGVuZGluZyBvbiBtYXNrIHR5cGUgKi9cbmZ1bmN0aW9uIGNyZWF0ZU1hc2sob3B0cykge1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChJTWFzay5NYXNrZWQgJiYgb3B0cyBpbnN0YW5jZW9mIElNYXNrLk1hc2tlZCkgcmV0dXJuIG9wdHM7XG4gIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzKTtcbiAgY29uc3QgbWFzayA9IG9wdHMubWFzaztcblxuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChJTWFzay5NYXNrZWQgJiYgbWFzayBpbnN0YW5jZW9mIElNYXNrLk1hc2tlZCkgcmV0dXJuIG1hc2s7XG4gIGNvbnN0IE1hc2tlZENsYXNzID0gbWFza2VkQ2xhc3MobWFzayk7XG4gIGlmICghTWFza2VkQ2xhc3MpIHRocm93IG5ldyBFcnJvcignTWFza2VkIGNsYXNzIGlzIG5vdCBmb3VuZCBmb3IgcHJvdmlkZWQgbWFzaywgYXBwcm9wcmlhdGUgbW9kdWxlIG5lZWRzIHRvIGJlIGltcG9ydCBtYW51YWxseSBiZWZvcmUgY3JlYXRpbmcgbWFzay4nKTtcbiAgcmV0dXJuIG5ldyBNYXNrZWRDbGFzcyhvcHRzKTtcbn1cbklNYXNrLmNyZWF0ZU1hc2sgPSBjcmVhdGVNYXNrO1xuXG5leHBvcnQgeyBjcmVhdGVNYXNrIGFzIGRlZmF1bHQsIG1hc2tlZENsYXNzIH07XG4iLCJpbXBvcnQgTWFza2VkIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvdXRpbHMuanMnO1xuXG4vKiogTWFza2luZyBieSBjdXN0b20gRnVuY3Rpb24gKi9cbmNsYXNzIE1hc2tlZEZ1bmN0aW9uIGV4dGVuZHMgTWFza2VkIHtcbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICAgQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgKi9cbiAgX3VwZGF0ZShvcHRzKSB7XG4gICAgaWYgKG9wdHMubWFzaykgb3B0cy52YWxpZGF0ZSA9IG9wdHMubWFzaztcbiAgICBzdXBlci5fdXBkYXRlKG9wdHMpO1xuICB9XG59XG5JTWFzay5NYXNrZWRGdW5jdGlvbiA9IE1hc2tlZEZ1bmN0aW9uO1xuXG5leHBvcnQgeyBNYXNrZWRGdW5jdGlvbiBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBlc2NhcGVSZWdFeHAsIG5vcm1hbGl6ZVByZXBhcmUsIERJUkVDVElPTiB9IGZyb20gJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0IENoYW5nZURldGFpbHMgZnJvbSAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgTWFza2VkIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NvbnRpbnVvdXMtdGFpbC1kZXRhaWxzLmpzJztcblxuLyoqXG4gIE51bWJlciBtYXNrXG4gIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gIEBwYXJhbSB7c3RyaW5nfSBvcHRzLnJhZGl4IC0gU2luZ2xlIGNoYXJcbiAgQHBhcmFtIHtzdHJpbmd9IG9wdHMudGhvdXNhbmRzU2VwYXJhdG9yIC0gU2luZ2xlIGNoYXJcbiAgQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBvcHRzLm1hcFRvUmFkaXggLSBBcnJheSBvZiBzaW5nbGUgY2hhcnNcbiAgQHBhcmFtIHtudW1iZXJ9IG9wdHMubWluXG4gIEBwYXJhbSB7bnVtYmVyfSBvcHRzLm1heFxuICBAcGFyYW0ge251bWJlcn0gb3B0cy5zY2FsZSAtIERpZ2l0cyBhZnRlciBwb2ludFxuICBAcGFyYW0ge2Jvb2xlYW59IG9wdHMuc2lnbmVkIC0gQWxsb3cgbmVnYXRpdmVcbiAgQHBhcmFtIHtib29sZWFufSBvcHRzLm5vcm1hbGl6ZVplcm9zIC0gRmxhZyB0byByZW1vdmUgbGVhZGluZyBhbmQgdHJhaWxpbmcgemVyb3MgaW4gdGhlIGVuZCBvZiBlZGl0aW5nXG4gIEBwYXJhbSB7Ym9vbGVhbn0gb3B0cy5wYWRGcmFjdGlvbmFsWmVyb3MgLSBGbGFnIHRvIHBhZCB0cmFpbGluZyB6ZXJvcyBhZnRlciBwb2ludCBpbiB0aGUgZW5kIG9mIGVkaXRpbmdcbiovXG5jbGFzcyBNYXNrZWROdW1iZXIgZXh0ZW5kcyBNYXNrZWQge1xuICAvKiogU2luZ2xlIGNoYXIgKi9cblxuICAvKiogU2luZ2xlIGNoYXIgKi9cblxuICAvKiogQXJyYXkgb2Ygc2luZ2xlIGNoYXJzICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqIERpZ2l0cyBhZnRlciBwb2ludCAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiBGbGFnIHRvIHJlbW92ZSBsZWFkaW5nIGFuZCB0cmFpbGluZyB6ZXJvcyBpbiB0aGUgZW5kIG9mIGVkaXRpbmcgKi9cblxuICAvKiogRmxhZyB0byBwYWQgdHJhaWxpbmcgemVyb3MgYWZ0ZXIgcG9pbnQgaW4gdGhlIGVuZCBvZiBlZGl0aW5nICovXG5cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHN1cGVyKE9iamVjdC5hc3NpZ24oe30sIE1hc2tlZE51bWJlci5ERUZBVUxUUywgb3B0cykpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIF91cGRhdGUob3B0cykge1xuICAgIHN1cGVyLl91cGRhdGUob3B0cyk7XG4gICAgdGhpcy5fdXBkYXRlUmVnRXhwcygpO1xuICB9XG5cbiAgLyoqICovXG4gIF91cGRhdGVSZWdFeHBzKCkge1xuICAgIGxldCBzdGFydCA9ICdeJyArICh0aGlzLmFsbG93TmVnYXRpdmUgPyAnWyt8XFxcXC1dPycgOiAnJyk7XG4gICAgbGV0IG1pZCA9ICdcXFxcZConO1xuICAgIGxldCBlbmQgPSAodGhpcy5zY2FsZSA/IFwiKFwiLmNvbmNhdChlc2NhcGVSZWdFeHAodGhpcy5yYWRpeCksIFwiXFxcXGR7MCxcIikuY29uY2F0KHRoaXMuc2NhbGUsIFwifSk/XCIpIDogJycpICsgJyQnO1xuICAgIHRoaXMuX251bWJlclJlZ0V4cCA9IG5ldyBSZWdFeHAoc3RhcnQgKyBtaWQgKyBlbmQpO1xuICAgIHRoaXMuX21hcFRvUmFkaXhSZWdFeHAgPSBuZXcgUmVnRXhwKFwiW1wiLmNvbmNhdCh0aGlzLm1hcFRvUmFkaXgubWFwKGVzY2FwZVJlZ0V4cCkuam9pbignJyksIFwiXVwiKSwgJ2cnKTtcbiAgICB0aGlzLl90aG91c2FuZHNTZXBhcmF0b3JSZWdFeHAgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cCh0aGlzLnRob3VzYW5kc1NlcGFyYXRvciksICdnJyk7XG4gIH1cblxuICAvKiogKi9cbiAgX3JlbW92ZVRob3VzYW5kc1NlcGFyYXRvcnModmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSh0aGlzLl90aG91c2FuZHNTZXBhcmF0b3JSZWdFeHAsICcnKTtcbiAgfVxuXG4gIC8qKiAqL1xuICBfaW5zZXJ0VGhvdXNhbmRzU2VwYXJhdG9ycyh2YWx1ZSkge1xuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MDExMDIvaG93LXRvLXByaW50LWEtbnVtYmVyLXdpdGgtY29tbWFzLWFzLXRob3VzYW5kcy1zZXBhcmF0b3JzLWluLWphdmFzY3JpcHRcbiAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KHRoaXMucmFkaXgpO1xuICAgIHBhcnRzWzBdID0gcGFydHNbMF0ucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgdGhpcy50aG91c2FuZHNTZXBhcmF0b3IpO1xuICAgIHJldHVybiBwYXJ0cy5qb2luKHRoaXMucmFkaXgpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvUHJlcGFyZShjaCkge1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgY2ggPSB0aGlzLl9yZW1vdmVUaG91c2FuZHNTZXBhcmF0b3JzKHRoaXMuc2NhbGUgJiYgdGhpcy5tYXBUb1JhZGl4Lmxlbmd0aCAmJiAoXG4gICAgLypcbiAgICAgIHJhZGl4IHNob3VsZCBiZSBtYXBwZWQgd2hlblxuICAgICAgMSkgaW5wdXQgaXMgZG9uZSBmcm9tIGtleWJvYXJkID0gZmxhZ3MuaW5wdXQgJiYgZmxhZ3MucmF3XG4gICAgICAyKSB1bm1hc2tlZCB2YWx1ZSBpcyBzZXQgPSAhZmxhZ3MuaW5wdXQgJiYgIWZsYWdzLnJhd1xuICAgICAgYW5kIHNob3VsZCBub3QgYmUgbWFwcGVkIHdoZW5cbiAgICAgIDEpIHZhbHVlIGlzIHNldCA9IGZsYWdzLmlucHV0ICYmICFmbGFncy5yYXdcbiAgICAgIDIpIHJhdyB2YWx1ZSBpcyBzZXQgPSAhZmxhZ3MuaW5wdXQgJiYgZmxhZ3MucmF3XG4gICAgKi9cbiAgICBmbGFncy5pbnB1dCAmJiBmbGFncy5yYXcgfHwgIWZsYWdzLmlucHV0ICYmICFmbGFncy5yYXcpID8gY2gucmVwbGFjZSh0aGlzLl9tYXBUb1JhZGl4UmVnRXhwLCB0aGlzLnJhZGl4KSA6IGNoKTtcbiAgICBjb25zdCBbcHJlcENoLCBkZXRhaWxzXSA9IG5vcm1hbGl6ZVByZXBhcmUoc3VwZXIuZG9QcmVwYXJlKGNoLCBmbGFncykpO1xuICAgIGlmIChjaCAmJiAhcHJlcENoKSBkZXRhaWxzLnNraXAgPSB0cnVlO1xuICAgIHJldHVybiBbcHJlcENoLCBkZXRhaWxzXTtcbiAgfVxuXG4gIC8qKiAqL1xuICBfc2VwYXJhdG9yc0NvdW50KHRvKSB7XG4gICAgbGV0IGV4dGVuZE9uU2VwYXJhdG9ycyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBwb3MgPSAwOyBwb3MgPCB0bzsgKytwb3MpIHtcbiAgICAgIGlmICh0aGlzLl92YWx1ZS5pbmRleE9mKHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yLCBwb3MpID09PSBwb3MpIHtcbiAgICAgICAgKytjb3VudDtcbiAgICAgICAgaWYgKGV4dGVuZE9uU2VwYXJhdG9ycykgdG8gKz0gdGhpcy50aG91c2FuZHNTZXBhcmF0b3IubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICAvKiogKi9cbiAgX3NlcGFyYXRvcnNDb3VudEZyb21TbGljZSgpIHtcbiAgICBsZXQgc2xpY2UgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRoaXMuX3ZhbHVlO1xuICAgIHJldHVybiB0aGlzLl9zZXBhcmF0b3JzQ291bnQodGhpcy5fcmVtb3ZlVGhvdXNhbmRzU2VwYXJhdG9ycyhzbGljZSkubGVuZ3RoLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBleHRyYWN0SW5wdXQoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgICBbZnJvbVBvcywgdG9Qb3NdID0gdGhpcy5fYWRqdXN0UmFuZ2VXaXRoU2VwYXJhdG9ycyhmcm9tUG9zLCB0b1Bvcyk7XG4gICAgcmV0dXJuIHRoaXMuX3JlbW92ZVRob3VzYW5kc1NlcGFyYXRvcnMoc3VwZXIuZXh0cmFjdElucHV0KGZyb21Qb3MsIHRvUG9zLCBmbGFncykpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIF9hcHBlbmRDaGFyUmF3KGNoKSB7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBpZiAoIXRoaXMudGhvdXNhbmRzU2VwYXJhdG9yKSByZXR1cm4gc3VwZXIuX2FwcGVuZENoYXJSYXcoY2gsIGZsYWdzKTtcbiAgICBjb25zdCBwcmV2QmVmb3JlVGFpbFZhbHVlID0gZmxhZ3MudGFpbCAmJiBmbGFncy5fYmVmb3JlVGFpbFN0YXRlID8gZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZS5fdmFsdWUgOiB0aGlzLl92YWx1ZTtcbiAgICBjb25zdCBwcmV2QmVmb3JlVGFpbFNlcGFyYXRvcnNDb3VudCA9IHRoaXMuX3NlcGFyYXRvcnNDb3VudEZyb21TbGljZShwcmV2QmVmb3JlVGFpbFZhbHVlKTtcbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX3JlbW92ZVRob3VzYW5kc1NlcGFyYXRvcnModGhpcy52YWx1ZSk7XG4gICAgY29uc3QgYXBwZW5kRGV0YWlscyA9IHN1cGVyLl9hcHBlbmRDaGFyUmF3KGNoLCBmbGFncyk7XG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLl9pbnNlcnRUaG91c2FuZHNTZXBhcmF0b3JzKHRoaXMuX3ZhbHVlKTtcbiAgICBjb25zdCBiZWZvcmVUYWlsVmFsdWUgPSBmbGFncy50YWlsICYmIGZsYWdzLl9iZWZvcmVUYWlsU3RhdGUgPyBmbGFncy5fYmVmb3JlVGFpbFN0YXRlLl92YWx1ZSA6IHRoaXMuX3ZhbHVlO1xuICAgIGNvbnN0IGJlZm9yZVRhaWxTZXBhcmF0b3JzQ291bnQgPSB0aGlzLl9zZXBhcmF0b3JzQ291bnRGcm9tU2xpY2UoYmVmb3JlVGFpbFZhbHVlKTtcbiAgICBhcHBlbmREZXRhaWxzLnRhaWxTaGlmdCArPSAoYmVmb3JlVGFpbFNlcGFyYXRvcnNDb3VudCAtIHByZXZCZWZvcmVUYWlsU2VwYXJhdG9yc0NvdW50KSAqIHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yLmxlbmd0aDtcbiAgICBhcHBlbmREZXRhaWxzLnNraXAgPSAhYXBwZW5kRGV0YWlscy5yYXdJbnNlcnRlZCAmJiBjaCA9PT0gdGhpcy50aG91c2FuZHNTZXBhcmF0b3I7XG4gICAgcmV0dXJuIGFwcGVuZERldGFpbHM7XG4gIH1cblxuICAvKiogKi9cbiAgX2ZpbmRTZXBhcmF0b3JBcm91bmQocG9zKSB7XG4gICAgaWYgKHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yKSB7XG4gICAgICBjb25zdCBzZWFyY2hGcm9tID0gcG9zIC0gdGhpcy50aG91c2FuZHNTZXBhcmF0b3IubGVuZ3RoICsgMTtcbiAgICAgIGNvbnN0IHNlcGFyYXRvclBvcyA9IHRoaXMudmFsdWUuaW5kZXhPZih0aGlzLnRob3VzYW5kc1NlcGFyYXRvciwgc2VhcmNoRnJvbSk7XG4gICAgICBpZiAoc2VwYXJhdG9yUG9zIDw9IHBvcykgcmV0dXJuIHNlcGFyYXRvclBvcztcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIF9hZGp1c3RSYW5nZVdpdGhTZXBhcmF0b3JzKGZyb20sIHRvKSB7XG4gICAgY29uc3Qgc2VwYXJhdG9yQXJvdW5kRnJvbVBvcyA9IHRoaXMuX2ZpbmRTZXBhcmF0b3JBcm91bmQoZnJvbSk7XG4gICAgaWYgKHNlcGFyYXRvckFyb3VuZEZyb21Qb3MgPj0gMCkgZnJvbSA9IHNlcGFyYXRvckFyb3VuZEZyb21Qb3M7XG4gICAgY29uc3Qgc2VwYXJhdG9yQXJvdW5kVG9Qb3MgPSB0aGlzLl9maW5kU2VwYXJhdG9yQXJvdW5kKHRvKTtcbiAgICBpZiAoc2VwYXJhdG9yQXJvdW5kVG9Qb3MgPj0gMCkgdG8gPSBzZXBhcmF0b3JBcm91bmRUb1BvcyArIHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yLmxlbmd0aDtcbiAgICByZXR1cm4gW2Zyb20sIHRvXTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICByZW1vdmUoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICBbZnJvbVBvcywgdG9Qb3NdID0gdGhpcy5fYWRqdXN0UmFuZ2VXaXRoU2VwYXJhdG9ycyhmcm9tUG9zLCB0b1Bvcyk7XG4gICAgY29uc3QgdmFsdWVCZWZvcmVQb3MgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGZyb21Qb3MpO1xuICAgIGNvbnN0IHZhbHVlQWZ0ZXJQb3MgPSB0aGlzLnZhbHVlLnNsaWNlKHRvUG9zKTtcbiAgICBjb25zdCBwcmV2QmVmb3JlVGFpbFNlcGFyYXRvcnNDb3VudCA9IHRoaXMuX3NlcGFyYXRvcnNDb3VudCh2YWx1ZUJlZm9yZVBvcy5sZW5ndGgpO1xuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5faW5zZXJ0VGhvdXNhbmRzU2VwYXJhdG9ycyh0aGlzLl9yZW1vdmVUaG91c2FuZHNTZXBhcmF0b3JzKHZhbHVlQmVmb3JlUG9zICsgdmFsdWVBZnRlclBvcykpO1xuICAgIGNvbnN0IGJlZm9yZVRhaWxTZXBhcmF0b3JzQ291bnQgPSB0aGlzLl9zZXBhcmF0b3JzQ291bnRGcm9tU2xpY2UodmFsdWVCZWZvcmVQb3MpO1xuICAgIHJldHVybiBuZXcgQ2hhbmdlRGV0YWlscyh7XG4gICAgICB0YWlsU2hpZnQ6IChiZWZvcmVUYWlsU2VwYXJhdG9yc0NvdW50IC0gcHJldkJlZm9yZVRhaWxTZXBhcmF0b3JzQ291bnQpICogdGhpcy50aG91c2FuZHNTZXBhcmF0b3IubGVuZ3RoXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgbmVhcmVzdElucHV0UG9zKGN1cnNvclBvcywgZGlyZWN0aW9uKSB7XG4gICAgaWYgKCF0aGlzLnRob3VzYW5kc1NlcGFyYXRvcikgcmV0dXJuIGN1cnNvclBvcztcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBESVJFQ1RJT04uTk9ORTpcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XG4gICAgICBjYXNlIERJUkVDVElPTi5GT1JDRV9MRUZUOlxuICAgICAgICB7XG4gICAgICAgICAgY29uc3Qgc2VwYXJhdG9yQXRMZWZ0UG9zID0gdGhpcy5fZmluZFNlcGFyYXRvckFyb3VuZChjdXJzb3JQb3MgLSAxKTtcbiAgICAgICAgICBpZiAoc2VwYXJhdG9yQXRMZWZ0UG9zID49IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNlcGFyYXRvckF0TGVmdEVuZFBvcyA9IHNlcGFyYXRvckF0TGVmdFBvcyArIHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChjdXJzb3JQb3MgPCBzZXBhcmF0b3JBdExlZnRFbmRQb3MgfHwgdGhpcy52YWx1ZS5sZW5ndGggPD0gc2VwYXJhdG9yQXRMZWZ0RW5kUG9zIHx8IGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkZPUkNFX0xFRlQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlcGFyYXRvckF0TGVmdFBvcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxuICAgICAgY2FzZSBESVJFQ1RJT04uRk9SQ0VfUklHSFQ6XG4gICAgICAgIHtcbiAgICAgICAgICBjb25zdCBzZXBhcmF0b3JBdFJpZ2h0UG9zID0gdGhpcy5fZmluZFNlcGFyYXRvckFyb3VuZChjdXJzb3JQb3MpO1xuICAgICAgICAgIGlmIChzZXBhcmF0b3JBdFJpZ2h0UG9zID49IDApIHtcbiAgICAgICAgICAgIHJldHVybiBzZXBhcmF0b3JBdFJpZ2h0UG9zICsgdGhpcy50aG91c2FuZHNTZXBhcmF0b3IubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yUG9zO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvVmFsaWRhdGUoZmxhZ3MpIHtcbiAgICAvLyB2YWxpZGF0ZSBhcyBzdHJpbmdcbiAgICBsZXQgdmFsaWQgPSBCb29sZWFuKHRoaXMuX3JlbW92ZVRob3VzYW5kc1NlcGFyYXRvcnModGhpcy52YWx1ZSkubWF0Y2godGhpcy5fbnVtYmVyUmVnRXhwKSk7XG4gICAgaWYgKHZhbGlkKSB7XG4gICAgICAvLyB2YWxpZGF0ZSBhcyBudW1iZXJcbiAgICAgIGNvbnN0IG51bWJlciA9IHRoaXMubnVtYmVyO1xuICAgICAgdmFsaWQgPSB2YWxpZCAmJiAhaXNOYU4obnVtYmVyKSAmJiAoXG4gICAgICAvLyBjaGVjayBtaW4gYm91bmQgZm9yIG5lZ2F0aXZlIHZhbHVlc1xuICAgICAgdGhpcy5taW4gPT0gbnVsbCB8fCB0aGlzLm1pbiA+PSAwIHx8IHRoaXMubWluIDw9IHRoaXMubnVtYmVyKSAmJiAoXG4gICAgICAvLyBjaGVjayBtYXggYm91bmQgZm9yIHBvc2l0aXZlIHZhbHVlc1xuICAgICAgdGhpcy5tYXggPT0gbnVsbCB8fCB0aGlzLm1heCA8PSAwIHx8IHRoaXMubnVtYmVyIDw9IHRoaXMubWF4KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkICYmIHN1cGVyLmRvVmFsaWRhdGUoZmxhZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvQ29tbWl0KCkge1xuICAgIGlmICh0aGlzLnZhbHVlKSB7XG4gICAgICBjb25zdCBudW1iZXIgPSB0aGlzLm51bWJlcjtcbiAgICAgIGxldCB2YWxpZG51bSA9IG51bWJlcjtcblxuICAgICAgLy8gY2hlY2sgYm91bmRzXG4gICAgICBpZiAodGhpcy5taW4gIT0gbnVsbCkgdmFsaWRudW0gPSBNYXRoLm1heCh2YWxpZG51bSwgdGhpcy5taW4pO1xuICAgICAgaWYgKHRoaXMubWF4ICE9IG51bGwpIHZhbGlkbnVtID0gTWF0aC5taW4odmFsaWRudW0sIHRoaXMubWF4KTtcbiAgICAgIGlmICh2YWxpZG51bSAhPT0gbnVtYmVyKSB0aGlzLnVubWFza2VkVmFsdWUgPSB0aGlzLmRvRm9ybWF0KHZhbGlkbnVtKTtcbiAgICAgIGxldCBmb3JtYXR0ZWQgPSB0aGlzLnZhbHVlO1xuICAgICAgaWYgKHRoaXMubm9ybWFsaXplWmVyb3MpIGZvcm1hdHRlZCA9IHRoaXMuX25vcm1hbGl6ZVplcm9zKGZvcm1hdHRlZCk7XG4gICAgICBpZiAodGhpcy5wYWRGcmFjdGlvbmFsWmVyb3MgJiYgdGhpcy5zY2FsZSA+IDApIGZvcm1hdHRlZCA9IHRoaXMuX3BhZEZyYWN0aW9uYWxaZXJvcyhmb3JtYXR0ZWQpO1xuICAgICAgdGhpcy5fdmFsdWUgPSBmb3JtYXR0ZWQ7XG4gICAgfVxuICAgIHN1cGVyLmRvQ29tbWl0KCk7XG4gIH1cblxuICAvKiogKi9cbiAgX25vcm1hbGl6ZVplcm9zKHZhbHVlKSB7XG4gICAgY29uc3QgcGFydHMgPSB0aGlzLl9yZW1vdmVUaG91c2FuZHNTZXBhcmF0b3JzKHZhbHVlKS5zcGxpdCh0aGlzLnJhZGl4KTtcblxuICAgIC8vIHJlbW92ZSBsZWFkaW5nIHplcm9zXG4gICAgcGFydHNbMF0gPSBwYXJ0c1swXS5yZXBsYWNlKC9eKFxcRCopKDAqKShcXGQqKS8sIChtYXRjaCwgc2lnbiwgemVyb3MsIG51bSkgPT4gc2lnbiArIG51bSk7XG4gICAgLy8gYWRkIGxlYWRpbmcgemVyb1xuICAgIGlmICh2YWx1ZS5sZW5ndGggJiYgIS9cXGQkLy50ZXN0KHBhcnRzWzBdKSkgcGFydHNbMF0gPSBwYXJ0c1swXSArICcwJztcbiAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgcGFydHNbMV0gPSBwYXJ0c1sxXS5yZXBsYWNlKC8wKiQvLCAnJyk7IC8vIHJlbW92ZSB0cmFpbGluZyB6ZXJvc1xuICAgICAgaWYgKCFwYXJ0c1sxXS5sZW5ndGgpIHBhcnRzLmxlbmd0aCA9IDE7IC8vIHJlbW92ZSBmcmFjdGlvbmFsXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2luc2VydFRob3VzYW5kc1NlcGFyYXRvcnMocGFydHMuam9pbih0aGlzLnJhZGl4KSk7XG4gIH1cblxuICAvKiogKi9cbiAgX3BhZEZyYWN0aW9uYWxaZXJvcyh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHJldHVybiB2YWx1ZTtcbiAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KHRoaXMucmFkaXgpO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSBwYXJ0cy5wdXNoKCcnKTtcbiAgICBwYXJ0c1sxXSA9IHBhcnRzWzFdLnBhZEVuZCh0aGlzLnNjYWxlLCAnMCcpO1xuICAgIHJldHVybiBwYXJ0cy5qb2luKHRoaXMucmFkaXgpO1xuICB9XG5cbiAgLyoqICovXG4gIGRvU2tpcEludmFsaWQoY2gpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGxldCBjaGVja1RhaWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBkcm9wRnJhY3Rpb25hbCA9IHRoaXMuc2NhbGUgPT09IDAgJiYgY2ggIT09IHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yICYmIChjaCA9PT0gdGhpcy5yYWRpeCB8fCBjaCA9PT0gTWFza2VkTnVtYmVyLlVOTUFTS0VEX1JBRElYIHx8IHRoaXMubWFwVG9SYWRpeC5pbmNsdWRlcyhjaCkpO1xuICAgIHJldHVybiBzdXBlci5kb1NraXBJbnZhbGlkKGNoLCBmbGFncywgY2hlY2tUYWlsKSAmJiAhZHJvcEZyYWN0aW9uYWw7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHVubWFza2VkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbW92ZVRob3VzYW5kc1NlcGFyYXRvcnModGhpcy5fbm9ybWFsaXplWmVyb3ModGhpcy52YWx1ZSkpLnJlcGxhY2UodGhpcy5yYWRpeCwgTWFza2VkTnVtYmVyLlVOTUFTS0VEX1JBRElYKTtcbiAgfVxuICBzZXQgdW5tYXNrZWRWYWx1ZSh1bm1hc2tlZFZhbHVlKSB7XG4gICAgc3VwZXIudW5tYXNrZWRWYWx1ZSA9IHVubWFza2VkVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHR5cGVkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9QYXJzZSh0aGlzLnVubWFza2VkVmFsdWUpO1xuICB9XG4gIHNldCB0eXBlZFZhbHVlKG4pIHtcbiAgICB0aGlzLnJhd0lucHV0VmFsdWUgPSB0aGlzLmRvRm9ybWF0KG4pLnJlcGxhY2UoTWFza2VkTnVtYmVyLlVOTUFTS0VEX1JBRElYLCB0aGlzLnJhZGl4KTtcbiAgfVxuXG4gIC8qKiBQYXJzZWQgTnVtYmVyICovXG4gIGdldCBudW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZWRWYWx1ZTtcbiAgfVxuICBzZXQgbnVtYmVyKG51bWJlcikge1xuICAgIHRoaXMudHlwZWRWYWx1ZSA9IG51bWJlcjtcbiAgfVxuXG4gIC8qKlxuICAgIElzIG5lZ2F0aXZlIGFsbG93ZWRcbiAgICBAcmVhZG9ubHlcbiAgKi9cbiAgZ2V0IGFsbG93TmVnYXRpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2lnbmVkIHx8IHRoaXMubWluICE9IG51bGwgJiYgdGhpcy5taW4gPCAwIHx8IHRoaXMubWF4ICE9IG51bGwgJiYgdGhpcy5tYXggPCAwO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIHR5cGVkVmFsdWVFcXVhbHModmFsdWUpIHtcbiAgICAvLyBoYW5kbGUgIDAgLT4gJycgY2FzZSAodHlwZWQgPSAwIGV2ZW4gaWYgdmFsdWUgPSAnJylcbiAgICAvLyBmb3IgZGV0YWlscyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3VObUFuTmVSL2ltYXNranMvaXNzdWVzLzEzNFxuICAgIHJldHVybiAoc3VwZXIudHlwZWRWYWx1ZUVxdWFscyh2YWx1ZSkgfHwgTWFza2VkTnVtYmVyLkVNUFRZX1ZBTFVFUy5pbmNsdWRlcyh2YWx1ZSkgJiYgTWFza2VkTnVtYmVyLkVNUFRZX1ZBTFVFUy5pbmNsdWRlcyh0aGlzLnR5cGVkVmFsdWUpKSAmJiAhKHZhbHVlID09PSAwICYmIHRoaXMudmFsdWUgPT09ICcnKTtcbiAgfVxufVxuTWFza2VkTnVtYmVyLlVOTUFTS0VEX1JBRElYID0gJy4nO1xuTWFza2VkTnVtYmVyLkRFRkFVTFRTID0ge1xuICByYWRpeDogJywnLFxuICB0aG91c2FuZHNTZXBhcmF0b3I6ICcnLFxuICBtYXBUb1JhZGl4OiBbTWFza2VkTnVtYmVyLlVOTUFTS0VEX1JBRElYXSxcbiAgc2NhbGU6IDIsXG4gIHNpZ25lZDogZmFsc2UsXG4gIG5vcm1hbGl6ZVplcm9zOiB0cnVlLFxuICBwYWRGcmFjdGlvbmFsWmVyb3M6IGZhbHNlLFxuICBwYXJzZTogTnVtYmVyLFxuICBmb3JtYXQ6IG4gPT4gbi50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7XG4gICAgdXNlR3JvdXBpbmc6IGZhbHNlLFxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMjBcbiAgfSlcbn07XG5NYXNrZWROdW1iZXIuRU1QVFlfVkFMVUVTID0gWy4uLk1hc2tlZC5FTVBUWV9WQUxVRVMsIDBdO1xuSU1hc2suTWFza2VkTnVtYmVyID0gTWFza2VkTnVtYmVyO1xuXG5leHBvcnQgeyBNYXNrZWROdW1iZXIgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgXyBhcyBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSB9IGZyb20gJy4uL19yb2xsdXBQbHVnaW5CYWJlbEhlbHBlcnMtNmIzYmQ0MDQuanMnO1xuaW1wb3J0IHsgRElSRUNUSU9OIH0gZnJvbSAnLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgQ2hhbmdlRGV0YWlscyBmcm9tICcuLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCBNYXNrZWQgZnJvbSAnLi9iYXNlLmpzJztcbmltcG9ydCBQYXR0ZXJuSW5wdXREZWZpbml0aW9uLCB7IERFRkFVTFRfSU5QVVRfREVGSU5JVElPTlMgfSBmcm9tICcuL3BhdHRlcm4vaW5wdXQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgUGF0dGVybkZpeGVkRGVmaW5pdGlvbiBmcm9tICcuL3BhdHRlcm4vZml4ZWQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgQ2h1bmtzVGFpbERldGFpbHMgZnJvbSAnLi9wYXR0ZXJuL2NodW5rLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgUGF0dGVybkN1cnNvciBmcm9tICcuL3BhdHRlcm4vY3Vyc29yLmpzJztcbmltcG9ydCBjcmVhdGVNYXNrIGZyb20gJy4vZmFjdG9yeS5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuL3JlZ2V4cC5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuXG5jb25zdCBfZXhjbHVkZWQgPSBbXCJfYmxvY2tzXCJdO1xuXG4vKipcbiAgUGF0dGVybiBtYXNrXG4gIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gIEBwYXJhbSB7T2JqZWN0fSBvcHRzLmJsb2Nrc1xuICBAcGFyYW0ge09iamVjdH0gb3B0cy5kZWZpbml0aW9uc1xuICBAcGFyYW0ge3N0cmluZ30gb3B0cy5wbGFjZWhvbGRlckNoYXJcbiAgQHBhcmFtIHtzdHJpbmd9IG9wdHMuZGlzcGxheUNoYXJcbiAgQHBhcmFtIHtib29sZWFufSBvcHRzLmxhenlcbiovXG5jbGFzcyBNYXNrZWRQYXR0ZXJuIGV4dGVuZHMgTWFza2VkIHtcbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqIFNpbmdsZSBjaGFyIGZvciBlbXB0eSBpbnB1dCAqL1xuXG4gIC8qKiBTaW5nbGUgY2hhciBmb3IgZmlsbGVkIGlucHV0ICovXG5cbiAgLyoqIFNob3cgcGxhY2Vob2xkZXIgb25seSB3aGVuIG5lZWRlZCAqL1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICAvLyBUT0RPIHR5cGUgJFNoYXBlPE1hc2tlZFBhdHRlcm5PcHRpb25zPj17fSBkb2VzIG5vdCB3b3JrXG4gICAgb3B0cy5kZWZpbml0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfSU5QVVRfREVGSU5JVElPTlMsIG9wdHMuZGVmaW5pdGlvbnMpO1xuICAgIHN1cGVyKE9iamVjdC5hc3NpZ24oe30sIE1hc2tlZFBhdHRlcm4uREVGQVVMVFMsIG9wdHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICovXG4gIF91cGRhdGUoKSB7XG4gICAgbGV0IG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIG9wdHMuZGVmaW5pdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmluaXRpb25zLCBvcHRzLmRlZmluaXRpb25zKTtcbiAgICBzdXBlci5fdXBkYXRlKG9wdHMpO1xuICAgIHRoaXMuX3JlYnVpbGRNYXNrKCk7XG4gIH1cblxuICAvKiogKi9cbiAgX3JlYnVpbGRNYXNrKCkge1xuICAgIGNvbnN0IGRlZnMgPSB0aGlzLmRlZmluaXRpb25zO1xuICAgIHRoaXMuX2Jsb2NrcyA9IFtdO1xuICAgIHRoaXMuX3N0b3BzID0gW107XG4gICAgdGhpcy5fbWFza2VkQmxvY2tzID0ge307XG4gICAgbGV0IHBhdHRlcm4gPSB0aGlzLm1hc2s7XG4gICAgaWYgKCFwYXR0ZXJuIHx8ICFkZWZzKSByZXR1cm47XG4gICAgbGV0IHVubWFza2luZ0Jsb2NrID0gZmFsc2U7XG4gICAgbGV0IG9wdGlvbmFsQmxvY2sgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdHRlcm4ubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBfZGVmcyRjaGFyLCBfZGVmcyRjaGFyMjtcbiAgICAgIGlmICh0aGlzLmJsb2Nrcykge1xuICAgICAgICBjb25zdCBwID0gcGF0dGVybi5zbGljZShpKTtcbiAgICAgICAgY29uc3QgYk5hbWVzID0gT2JqZWN0LmtleXModGhpcy5ibG9ja3MpLmZpbHRlcihiTmFtZSA9PiBwLmluZGV4T2YoYk5hbWUpID09PSAwKTtcbiAgICAgICAgLy8gb3JkZXIgYnkga2V5IGxlbmd0aFxuICAgICAgICBiTmFtZXMuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG4gICAgICAgIC8vIHVzZSBibG9jayBuYW1lIHdpdGggbWF4IGxlbmd0aFxuICAgICAgICBjb25zdCBiTmFtZSA9IGJOYW1lc1swXTtcbiAgICAgICAgaWYgKGJOYW1lKSB7XG4gICAgICAgICAgLy8gJEZsb3dGaXhNZSBubyBpZGVhc1xuICAgICAgICAgIGNvbnN0IG1hc2tlZEJsb2NrID0gY3JlYXRlTWFzayhPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgIGxhenk6IHRoaXMubGF6eSxcbiAgICAgICAgICAgIGVhZ2VyOiB0aGlzLmVhZ2VyLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXJDaGFyOiB0aGlzLnBsYWNlaG9sZGVyQ2hhcixcbiAgICAgICAgICAgIGRpc3BsYXlDaGFyOiB0aGlzLmRpc3BsYXlDaGFyLFxuICAgICAgICAgICAgb3ZlcndyaXRlOiB0aGlzLm92ZXJ3cml0ZVxuICAgICAgICAgIH0sIHRoaXMuYmxvY2tzW2JOYW1lXSkpO1xuICAgICAgICAgIGlmIChtYXNrZWRCbG9jaykge1xuICAgICAgICAgICAgdGhpcy5fYmxvY2tzLnB1c2gobWFza2VkQmxvY2spO1xuXG4gICAgICAgICAgICAvLyBzdG9yZSBibG9jayBpbmRleFxuICAgICAgICAgICAgaWYgKCF0aGlzLl9tYXNrZWRCbG9ja3NbYk5hbWVdKSB0aGlzLl9tYXNrZWRCbG9ja3NbYk5hbWVdID0gW107XG4gICAgICAgICAgICB0aGlzLl9tYXNrZWRCbG9ja3NbYk5hbWVdLnB1c2godGhpcy5fYmxvY2tzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpICs9IGJOYW1lLmxlbmd0aCAtIDE7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBjaGFyID0gcGF0dGVybltpXTtcbiAgICAgIGxldCBpc0lucHV0ID0gKGNoYXIgaW4gZGVmcyk7XG4gICAgICBpZiAoY2hhciA9PT0gTWFza2VkUGF0dGVybi5TVE9QX0NIQVIpIHtcbiAgICAgICAgdGhpcy5fc3RvcHMucHVzaCh0aGlzLl9ibG9ja3MubGVuZ3RoKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoY2hhciA9PT0gJ3snIHx8IGNoYXIgPT09ICd9Jykge1xuICAgICAgICB1bm1hc2tpbmdCbG9jayA9ICF1bm1hc2tpbmdCbG9jaztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoY2hhciA9PT0gJ1snIHx8IGNoYXIgPT09ICddJykge1xuICAgICAgICBvcHRpb25hbEJsb2NrID0gIW9wdGlvbmFsQmxvY2s7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGNoYXIgPT09IE1hc2tlZFBhdHRlcm4uRVNDQVBFX0NIQVIpIHtcbiAgICAgICAgKytpO1xuICAgICAgICBjaGFyID0gcGF0dGVybltpXTtcbiAgICAgICAgaWYgKCFjaGFyKSBicmVhaztcbiAgICAgICAgaXNJbnB1dCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgbWFza09wdHMgPSAoX2RlZnMkY2hhciA9IGRlZnNbY2hhcl0pICE9PSBudWxsICYmIF9kZWZzJGNoYXIgIT09IHZvaWQgMCAmJiBfZGVmcyRjaGFyLm1hc2sgJiYgISgoKF9kZWZzJGNoYXIyID0gZGVmc1tjaGFyXSkgPT09IG51bGwgfHwgX2RlZnMkY2hhcjIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kZWZzJGNoYXIyLm1hc2sucHJvdG90eXBlKSBpbnN0YW5jZW9mIElNYXNrLk1hc2tlZCkgPyBkZWZzW2NoYXJdIDoge1xuICAgICAgICBtYXNrOiBkZWZzW2NoYXJdXG4gICAgICB9O1xuICAgICAgY29uc3QgZGVmID0gaXNJbnB1dCA/IG5ldyBQYXR0ZXJuSW5wdXREZWZpbml0aW9uKE9iamVjdC5hc3NpZ24oe1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIGlzT3B0aW9uYWw6IG9wdGlvbmFsQmxvY2ssXG4gICAgICAgIGxhenk6IHRoaXMubGF6eSxcbiAgICAgICAgZWFnZXI6IHRoaXMuZWFnZXIsXG4gICAgICAgIHBsYWNlaG9sZGVyQ2hhcjogdGhpcy5wbGFjZWhvbGRlckNoYXIsXG4gICAgICAgIGRpc3BsYXlDaGFyOiB0aGlzLmRpc3BsYXlDaGFyXG4gICAgICB9LCBtYXNrT3B0cykpIDogbmV3IFBhdHRlcm5GaXhlZERlZmluaXRpb24oe1xuICAgICAgICBjaGFyLFxuICAgICAgICBlYWdlcjogdGhpcy5lYWdlcixcbiAgICAgICAgaXNVbm1hc2tpbmc6IHVubWFza2luZ0Jsb2NrXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2Jsb2Nrcy5wdXNoKGRlZik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3VwZXIuc3RhdGUsIHtcbiAgICAgIF9ibG9ja3M6IHRoaXMuX2Jsb2Nrcy5tYXAoYiA9PiBiLnN0YXRlKVxuICAgIH0pO1xuICB9XG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGNvbnN0IHtcbiAgICAgICAgX2Jsb2Nrc1xuICAgICAgfSA9IHN0YXRlLFxuICAgICAgbWFza2VkU3RhdGUgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzdGF0ZSwgX2V4Y2x1ZGVkKTtcbiAgICB0aGlzLl9ibG9ja3MuZm9yRWFjaCgoYiwgYmkpID0+IGIuc3RhdGUgPSBfYmxvY2tzW2JpXSk7XG4gICAgc3VwZXIuc3RhdGUgPSBtYXNrZWRTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuICAgIHRoaXMuX2Jsb2Nrcy5mb3JFYWNoKGIgPT4gYi5yZXNldCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgaXNDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYmxvY2tzLmV2ZXJ5KGIgPT4gYi5pc0NvbXBsZXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgaXNGaWxsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Jsb2Nrcy5ldmVyeShiID0+IGIuaXNGaWxsZWQpO1xuICB9XG4gIGdldCBpc0ZpeGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9ibG9ja3MuZXZlcnkoYiA9PiBiLmlzRml4ZWQpO1xuICB9XG4gIGdldCBpc09wdGlvbmFsKCkge1xuICAgIHJldHVybiB0aGlzLl9ibG9ja3MuZXZlcnkoYiA9PiBiLmlzT3B0aW9uYWwpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvQ29tbWl0KCkge1xuICAgIHRoaXMuX2Jsb2Nrcy5mb3JFYWNoKGIgPT4gYi5kb0NvbW1pdCgpKTtcbiAgICBzdXBlci5kb0NvbW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCB1bm1hc2tlZFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9ibG9ja3MucmVkdWNlKChzdHIsIGIpID0+IHN0ciArPSBiLnVubWFza2VkVmFsdWUsICcnKTtcbiAgfVxuICBzZXQgdW5tYXNrZWRWYWx1ZSh1bm1hc2tlZFZhbHVlKSB7XG4gICAgc3VwZXIudW5tYXNrZWRWYWx1ZSA9IHVubWFza2VkVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIC8vIFRPRE8gcmV0dXJuIF92YWx1ZSB3aGVuIG5vdCBpbiBjaGFuZ2U/XG4gICAgcmV0dXJuIHRoaXMuX2Jsb2Nrcy5yZWR1Y2UoKHN0ciwgYikgPT4gc3RyICs9IGIudmFsdWUsICcnKTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICBzdXBlci52YWx1ZSA9IHZhbHVlO1xuICB9XG4gIGdldCBkaXNwbGF5VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Jsb2Nrcy5yZWR1Y2UoKHN0ciwgYikgPT4gc3RyICs9IGIuZGlzcGxheVZhbHVlLCAnJyk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgYXBwZW5kVGFpbCh0YWlsKSB7XG4gICAgcmV0dXJuIHN1cGVyLmFwcGVuZFRhaWwodGFpbCkuYWdncmVnYXRlKHRoaXMuX2FwcGVuZFBsYWNlaG9sZGVyKCkpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIF9hcHBlbmRFYWdlcigpIHtcbiAgICB2YXIgX3RoaXMkX21hcFBvc1RvQmxvY2s7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgbGV0IHN0YXJ0QmxvY2tJbmRleCA9IChfdGhpcyRfbWFwUG9zVG9CbG9jayA9IHRoaXMuX21hcFBvc1RvQmxvY2sodGhpcy52YWx1ZS5sZW5ndGgpKSA9PT0gbnVsbCB8fCBfdGhpcyRfbWFwUG9zVG9CbG9jayA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkX21hcFBvc1RvQmxvY2suaW5kZXg7XG4gICAgaWYgKHN0YXJ0QmxvY2tJbmRleCA9PSBudWxsKSByZXR1cm4gZGV0YWlscztcblxuICAgIC8vIFRPRE8gdGVzdCBpZiBpdCB3b3JrcyBmb3IgbmVzdGVkIHBhdHRlcm4gbWFza3NcbiAgICBpZiAodGhpcy5fYmxvY2tzW3N0YXJ0QmxvY2tJbmRleF0uaXNGaWxsZWQpICsrc3RhcnRCbG9ja0luZGV4O1xuICAgIGZvciAobGV0IGJpID0gc3RhcnRCbG9ja0luZGV4OyBiaSA8IHRoaXMuX2Jsb2Nrcy5sZW5ndGg7ICsrYmkpIHtcbiAgICAgIGNvbnN0IGQgPSB0aGlzLl9ibG9ja3NbYmldLl9hcHBlbmRFYWdlcigpO1xuICAgICAgaWYgKCFkLmluc2VydGVkKSBicmVhaztcbiAgICAgIGRldGFpbHMuYWdncmVnYXRlKGQpO1xuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBfYXBwZW5kQ2hhclJhdyhjaCkge1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgY29uc3QgYmxvY2tJdGVyID0gdGhpcy5fbWFwUG9zVG9CbG9jayh0aGlzLnZhbHVlLmxlbmd0aCk7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgaWYgKCFibG9ja0l0ZXIpIHJldHVybiBkZXRhaWxzO1xuICAgIGZvciAobGV0IGJpID0gYmxvY2tJdGVyLmluZGV4OzsgKytiaSkge1xuICAgICAgdmFyIF9mbGFncyRfYmVmb3JlVGFpbFN0YSwgX2ZsYWdzJF9iZWZvcmVUYWlsU3RhMjtcbiAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5fYmxvY2tzW2JpXTtcbiAgICAgIGlmICghYmxvY2spIGJyZWFrO1xuICAgICAgY29uc3QgYmxvY2tEZXRhaWxzID0gYmxvY2suX2FwcGVuZENoYXIoY2gsIE9iamVjdC5hc3NpZ24oe30sIGZsYWdzLCB7XG4gICAgICAgIF9iZWZvcmVUYWlsU3RhdGU6IChfZmxhZ3MkX2JlZm9yZVRhaWxTdGEgPSBmbGFncy5fYmVmb3JlVGFpbFN0YXRlKSA9PT0gbnVsbCB8fCBfZmxhZ3MkX2JlZm9yZVRhaWxTdGEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfZmxhZ3MkX2JlZm9yZVRhaWxTdGEyID0gX2ZsYWdzJF9iZWZvcmVUYWlsU3RhLl9ibG9ja3MpID09PSBudWxsIHx8IF9mbGFncyRfYmVmb3JlVGFpbFN0YTIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mbGFncyRfYmVmb3JlVGFpbFN0YTJbYmldXG4gICAgICB9KSk7XG4gICAgICBjb25zdCBza2lwID0gYmxvY2tEZXRhaWxzLnNraXA7XG4gICAgICBkZXRhaWxzLmFnZ3JlZ2F0ZShibG9ja0RldGFpbHMpO1xuICAgICAgaWYgKHNraXAgfHwgYmxvY2tEZXRhaWxzLnJhd0luc2VydGVkKSBicmVhazsgLy8gZ28gbmV4dCBjaGFyXG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZXh0cmFjdFRhaWwoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICBjb25zdCBjaHVua1RhaWwgPSBuZXcgQ2h1bmtzVGFpbERldGFpbHMoKTtcbiAgICBpZiAoZnJvbVBvcyA9PT0gdG9Qb3MpIHJldHVybiBjaHVua1RhaWw7XG4gICAgdGhpcy5fZm9yRWFjaEJsb2Nrc0luUmFuZ2UoZnJvbVBvcywgdG9Qb3MsIChiLCBiaSwgYkZyb21Qb3MsIGJUb1BvcykgPT4ge1xuICAgICAgY29uc3QgYmxvY2tDaHVuayA9IGIuZXh0cmFjdFRhaWwoYkZyb21Qb3MsIGJUb1Bvcyk7XG4gICAgICBibG9ja0NodW5rLnN0b3AgPSB0aGlzLl9maW5kU3RvcEJlZm9yZShiaSk7XG4gICAgICBibG9ja0NodW5rLmZyb20gPSB0aGlzLl9ibG9ja1N0YXJ0UG9zKGJpKTtcbiAgICAgIGlmIChibG9ja0NodW5rIGluc3RhbmNlb2YgQ2h1bmtzVGFpbERldGFpbHMpIGJsb2NrQ2h1bmsuYmxvY2tJbmRleCA9IGJpO1xuICAgICAgY2h1bmtUYWlsLmV4dGVuZChibG9ja0NodW5rKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY2h1bmtUYWlsO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGV4dHJhY3RJbnB1dCgpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG4gICAgaWYgKGZyb21Qb3MgPT09IHRvUG9zKSByZXR1cm4gJyc7XG4gICAgbGV0IGlucHV0ID0gJyc7XG4gICAgdGhpcy5fZm9yRWFjaEJsb2Nrc0luUmFuZ2UoZnJvbVBvcywgdG9Qb3MsIChiLCBfLCBmcm9tUG9zLCB0b1BvcykgPT4ge1xuICAgICAgaW5wdXQgKz0gYi5leHRyYWN0SW5wdXQoZnJvbVBvcywgdG9Qb3MsIGZsYWdzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cbiAgX2ZpbmRTdG9wQmVmb3JlKGJsb2NrSW5kZXgpIHtcbiAgICBsZXQgc3RvcEJlZm9yZTtcbiAgICBmb3IgKGxldCBzaSA9IDA7IHNpIDwgdGhpcy5fc3RvcHMubGVuZ3RoOyArK3NpKSB7XG4gICAgICBjb25zdCBzdG9wID0gdGhpcy5fc3RvcHNbc2ldO1xuICAgICAgaWYgKHN0b3AgPD0gYmxvY2tJbmRleCkgc3RvcEJlZm9yZSA9IHN0b3A7ZWxzZSBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHN0b3BCZWZvcmU7XG4gIH1cblxuICAvKiogQXBwZW5kcyBwbGFjZWhvbGRlciBkZXBlbmRpbmcgb24gbGF6aW5lc3MgKi9cbiAgX2FwcGVuZFBsYWNlaG9sZGVyKHRvQmxvY2tJbmRleCkge1xuICAgIGNvbnN0IGRldGFpbHMgPSBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIGlmICh0aGlzLmxhenkgJiYgdG9CbG9ja0luZGV4ID09IG51bGwpIHJldHVybiBkZXRhaWxzO1xuICAgIGNvbnN0IHN0YXJ0QmxvY2tJdGVyID0gdGhpcy5fbWFwUG9zVG9CbG9jayh0aGlzLnZhbHVlLmxlbmd0aCk7XG4gICAgaWYgKCFzdGFydEJsb2NrSXRlcikgcmV0dXJuIGRldGFpbHM7XG4gICAgY29uc3Qgc3RhcnRCbG9ja0luZGV4ID0gc3RhcnRCbG9ja0l0ZXIuaW5kZXg7XG4gICAgY29uc3QgZW5kQmxvY2tJbmRleCA9IHRvQmxvY2tJbmRleCAhPSBudWxsID8gdG9CbG9ja0luZGV4IDogdGhpcy5fYmxvY2tzLmxlbmd0aDtcbiAgICB0aGlzLl9ibG9ja3Muc2xpY2Uoc3RhcnRCbG9ja0luZGV4LCBlbmRCbG9ja0luZGV4KS5mb3JFYWNoKGIgPT4ge1xuICAgICAgaWYgKCFiLmxhenkgfHwgdG9CbG9ja0luZGV4ICE9IG51bGwpIHtcbiAgICAgICAgLy8gJEZsb3dGaXhNZSBgX2Jsb2Nrc2AgbWF5IG5vdCBiZSBwcmVzZW50XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBiLl9ibG9ja3MgIT0gbnVsbCA/IFtiLl9ibG9ja3MubGVuZ3RoXSA6IFtdO1xuICAgICAgICBjb25zdCBiRGV0YWlscyA9IGIuX2FwcGVuZFBsYWNlaG9sZGVyKC4uLmFyZ3MpO1xuICAgICAgICB0aGlzLl92YWx1ZSArPSBiRGV0YWlscy5pbnNlcnRlZDtcbiAgICAgICAgZGV0YWlscy5hZ2dyZWdhdGUoYkRldGFpbHMpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG5cbiAgLyoqIEZpbmRzIGJsb2NrIGluIHBvcyAqL1xuICBfbWFwUG9zVG9CbG9jayhwb3MpIHtcbiAgICBsZXQgYWNjVmFsID0gJyc7XG4gICAgZm9yIChsZXQgYmkgPSAwOyBiaSA8IHRoaXMuX2Jsb2Nrcy5sZW5ndGg7ICsrYmkpIHtcbiAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5fYmxvY2tzW2JpXTtcbiAgICAgIGNvbnN0IGJsb2NrU3RhcnRQb3MgPSBhY2NWYWwubGVuZ3RoO1xuICAgICAgYWNjVmFsICs9IGJsb2NrLnZhbHVlO1xuICAgICAgaWYgKHBvcyA8PSBhY2NWYWwubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaW5kZXg6IGJpLFxuICAgICAgICAgIG9mZnNldDogcG9zIC0gYmxvY2tTdGFydFBvc1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiAqL1xuICBfYmxvY2tTdGFydFBvcyhibG9ja0luZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2Jsb2Nrcy5zbGljZSgwLCBibG9ja0luZGV4KS5yZWR1Y2UoKHBvcywgYikgPT4gcG9zICs9IGIudmFsdWUubGVuZ3RoLCAwKTtcbiAgfVxuXG4gIC8qKiAqL1xuICBfZm9yRWFjaEJsb2Nrc0luUmFuZ2UoZnJvbVBvcykge1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgbGV0IGZuID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgZnJvbUJsb2NrSXRlciA9IHRoaXMuX21hcFBvc1RvQmxvY2soZnJvbVBvcyk7XG4gICAgaWYgKGZyb21CbG9ja0l0ZXIpIHtcbiAgICAgIGNvbnN0IHRvQmxvY2tJdGVyID0gdGhpcy5fbWFwUG9zVG9CbG9jayh0b1Bvcyk7XG4gICAgICAvLyBwcm9jZXNzIGZpcnN0IGJsb2NrXG4gICAgICBjb25zdCBpc1NhbWVCbG9jayA9IHRvQmxvY2tJdGVyICYmIGZyb21CbG9ja0l0ZXIuaW5kZXggPT09IHRvQmxvY2tJdGVyLmluZGV4O1xuICAgICAgY29uc3QgZnJvbUJsb2NrU3RhcnRQb3MgPSBmcm9tQmxvY2tJdGVyLm9mZnNldDtcbiAgICAgIGNvbnN0IGZyb21CbG9ja0VuZFBvcyA9IHRvQmxvY2tJdGVyICYmIGlzU2FtZUJsb2NrID8gdG9CbG9ja0l0ZXIub2Zmc2V0IDogdGhpcy5fYmxvY2tzW2Zyb21CbG9ja0l0ZXIuaW5kZXhdLnZhbHVlLmxlbmd0aDtcbiAgICAgIGZuKHRoaXMuX2Jsb2Nrc1tmcm9tQmxvY2tJdGVyLmluZGV4XSwgZnJvbUJsb2NrSXRlci5pbmRleCwgZnJvbUJsb2NrU3RhcnRQb3MsIGZyb21CbG9ja0VuZFBvcyk7XG4gICAgICBpZiAodG9CbG9ja0l0ZXIgJiYgIWlzU2FtZUJsb2NrKSB7XG4gICAgICAgIC8vIHByb2Nlc3MgaW50ZXJtZWRpYXRlIGJsb2Nrc1xuICAgICAgICBmb3IgKGxldCBiaSA9IGZyb21CbG9ja0l0ZXIuaW5kZXggKyAxOyBiaSA8IHRvQmxvY2tJdGVyLmluZGV4OyArK2JpKSB7XG4gICAgICAgICAgZm4odGhpcy5fYmxvY2tzW2JpXSwgYmksIDAsIHRoaXMuX2Jsb2Nrc1tiaV0udmFsdWUubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByb2Nlc3MgbGFzdCBibG9ja1xuICAgICAgICBmbih0aGlzLl9ibG9ja3NbdG9CbG9ja0l0ZXIuaW5kZXhdLCB0b0Jsb2NrSXRlci5pbmRleCwgMCwgdG9CbG9ja0l0ZXIub2Zmc2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGxldCBmcm9tUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgY29uc3QgcmVtb3ZlRGV0YWlscyA9IHN1cGVyLnJlbW92ZShmcm9tUG9zLCB0b1Bvcyk7XG4gICAgdGhpcy5fZm9yRWFjaEJsb2Nrc0luUmFuZ2UoZnJvbVBvcywgdG9Qb3MsIChiLCBfLCBiRnJvbVBvcywgYlRvUG9zKSA9PiB7XG4gICAgICByZW1vdmVEZXRhaWxzLmFnZ3JlZ2F0ZShiLnJlbW92ZShiRnJvbVBvcywgYlRvUG9zKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlbW92ZURldGFpbHM7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgbmVhcmVzdElucHV0UG9zKGN1cnNvclBvcykge1xuICAgIGxldCBkaXJlY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IERJUkVDVElPTi5OT05FO1xuICAgIGlmICghdGhpcy5fYmxvY2tzLmxlbmd0aCkgcmV0dXJuIDA7XG4gICAgY29uc3QgY3Vyc29yID0gbmV3IFBhdHRlcm5DdXJzb3IodGhpcywgY3Vyc29yUG9zKTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBESVJFQ1RJT04uTk9ORSkge1xuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gTk9ORSBzaG91bGQgb25seSBnbyBvdXQgZnJvbSBmaXhlZCB0byB0aGUgcmlnaHQhXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBpZiAoY3Vyc29yLnB1c2hSaWdodEJlZm9yZUlucHV0KCkpIHJldHVybiBjdXJzb3IucG9zO1xuICAgICAgY3Vyc29yLnBvcFN0YXRlKCk7XG4gICAgICBpZiAoY3Vyc29yLnB1c2hMZWZ0QmVmb3JlSW5wdXQoKSkgcmV0dXJuIGN1cnNvci5wb3M7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gRk9SQ0UgaXMgb25seSBhYm91dCBhfCogb3RoZXJ3aXNlIGlzIDBcbiAgICBpZiAoZGlyZWN0aW9uID09PSBESVJFQ1RJT04uTEVGVCB8fCBkaXJlY3Rpb24gPT09IERJUkVDVElPTi5GT1JDRV9MRUZUKSB7XG4gICAgICAvLyB0cnkgdG8gYnJlYWsgZmFzdCB3aGVuICp8YVxuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkxFRlQpIHtcbiAgICAgICAgY3Vyc29yLnB1c2hSaWdodEJlZm9yZUZpbGxlZCgpO1xuICAgICAgICBpZiAoY3Vyc29yLm9rICYmIGN1cnNvci5wb3MgPT09IGN1cnNvclBvcykgcmV0dXJuIGN1cnNvclBvcztcbiAgICAgICAgY3Vyc29yLnBvcFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGZvcndhcmQgZmxvd1xuICAgICAgY3Vyc29yLnB1c2hMZWZ0QmVmb3JlSW5wdXQoKTtcbiAgICAgIGN1cnNvci5wdXNoTGVmdEJlZm9yZVJlcXVpcmVkKCk7XG4gICAgICBjdXJzb3IucHVzaExlZnRCZWZvcmVGaWxsZWQoKTtcblxuICAgICAgLy8gYmFja3dhcmQgZmxvd1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkxFRlQpIHtcbiAgICAgICAgY3Vyc29yLnB1c2hSaWdodEJlZm9yZUlucHV0KCk7XG4gICAgICAgIGN1cnNvci5wdXNoUmlnaHRCZWZvcmVSZXF1aXJlZCgpO1xuICAgICAgICBpZiAoY3Vyc29yLm9rICYmIGN1cnNvci5wb3MgPD0gY3Vyc29yUG9zKSByZXR1cm4gY3Vyc29yLnBvcztcbiAgICAgICAgY3Vyc29yLnBvcFN0YXRlKCk7XG4gICAgICAgIGlmIChjdXJzb3Iub2sgJiYgY3Vyc29yLnBvcyA8PSBjdXJzb3JQb3MpIHJldHVybiBjdXJzb3IucG9zO1xuICAgICAgICBjdXJzb3IucG9wU3RhdGUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJzb3Iub2spIHJldHVybiBjdXJzb3IucG9zO1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkZPUkNFX0xFRlQpIHJldHVybiAwO1xuICAgICAgY3Vyc29yLnBvcFN0YXRlKCk7XG4gICAgICBpZiAoY3Vyc29yLm9rKSByZXR1cm4gY3Vyc29yLnBvcztcbiAgICAgIGN1cnNvci5wb3BTdGF0ZSgpO1xuICAgICAgaWYgKGN1cnNvci5vaykgcmV0dXJuIGN1cnNvci5wb3M7XG5cbiAgICAgIC8vIGN1cnNvci5wb3BTdGF0ZSgpO1xuICAgICAgLy8gaWYgKFxuICAgICAgLy8gICBjdXJzb3IucHVzaFJpZ2h0QmVmb3JlSW5wdXQoKSAmJlxuICAgICAgLy8gICAvLyBUT0RPIEhBQ0sgZm9yIGxhenkgaWYgaGFzIGFsaWduZWQgbGVmdCBpbnNpZGUgZml4ZWQgYW5kIGhhcyBjYW1lIHRvIHRoZSBzdGFydCAtIHVzZSBzdGFydCBwb3NpdGlvblxuICAgICAgLy8gICAoIXRoaXMubGF6eSB8fCB0aGlzLmV4dHJhY3RJbnB1dCgpKVxuICAgICAgLy8gKSByZXR1cm4gY3Vyc29yLnBvcztcblxuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTi5SSUdIVCB8fCBkaXJlY3Rpb24gPT09IERJUkVDVElPTi5GT1JDRV9SSUdIVCkge1xuICAgICAgLy8gZm9yd2FyZCBmbG93XG4gICAgICBjdXJzb3IucHVzaFJpZ2h0QmVmb3JlSW5wdXQoKTtcbiAgICAgIGN1cnNvci5wdXNoUmlnaHRCZWZvcmVSZXF1aXJlZCgpO1xuICAgICAgaWYgKGN1cnNvci5wdXNoUmlnaHRCZWZvcmVGaWxsZWQoKSkgcmV0dXJuIGN1cnNvci5wb3M7XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBESVJFQ1RJT04uRk9SQ0VfUklHSFQpIHJldHVybiB0aGlzLnZhbHVlLmxlbmd0aDtcblxuICAgICAgLy8gYmFja3dhcmQgZmxvd1xuICAgICAgY3Vyc29yLnBvcFN0YXRlKCk7XG4gICAgICBpZiAoY3Vyc29yLm9rKSByZXR1cm4gY3Vyc29yLnBvcztcbiAgICAgIGN1cnNvci5wb3BTdGF0ZSgpO1xuICAgICAgaWYgKGN1cnNvci5vaykgcmV0dXJuIGN1cnNvci5wb3M7XG4gICAgICByZXR1cm4gdGhpcy5uZWFyZXN0SW5wdXRQb3MoY3Vyc29yUG9zLCBESVJFQ1RJT04uTEVGVCk7XG4gICAgfVxuICAgIHJldHVybiBjdXJzb3JQb3M7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgdG90YWxJbnB1dFBvc2l0aW9ucygpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgdGhpcy5fZm9yRWFjaEJsb2Nrc0luUmFuZ2UoZnJvbVBvcywgdG9Qb3MsIChiLCBfLCBiRnJvbVBvcywgYlRvUG9zKSA9PiB7XG4gICAgICB0b3RhbCArPSBiLnRvdGFsSW5wdXRQb3NpdGlvbnMoYkZyb21Qb3MsIGJUb1Bvcyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRvdGFsO1xuICB9XG5cbiAgLyoqIEdldCBibG9jayBieSBuYW1lICovXG4gIG1hc2tlZEJsb2NrKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXNrZWRCbG9ja3MobmFtZSlbMF07XG4gIH1cblxuICAvKiogR2V0IGFsbCBibG9ja3MgYnkgbmFtZSAqL1xuICBtYXNrZWRCbG9ja3MobmFtZSkge1xuICAgIGNvbnN0IGluZGljZXMgPSB0aGlzLl9tYXNrZWRCbG9ja3NbbmFtZV07XG4gICAgaWYgKCFpbmRpY2VzKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGluZGljZXMubWFwKGdpID0+IHRoaXMuX2Jsb2Nrc1tnaV0pO1xuICB9XG59XG5NYXNrZWRQYXR0ZXJuLkRFRkFVTFRTID0ge1xuICBsYXp5OiB0cnVlLFxuICBwbGFjZWhvbGRlckNoYXI6ICdfJ1xufTtcbk1hc2tlZFBhdHRlcm4uU1RPUF9DSEFSID0gJ2AnO1xuTWFza2VkUGF0dGVybi5FU0NBUEVfQ0hBUiA9ICdcXFxcJztcbk1hc2tlZFBhdHRlcm4uSW5wdXREZWZpbml0aW9uID0gUGF0dGVybklucHV0RGVmaW5pdGlvbjtcbk1hc2tlZFBhdHRlcm4uRml4ZWREZWZpbml0aW9uID0gUGF0dGVybkZpeGVkRGVmaW5pdGlvbjtcbklNYXNrLk1hc2tlZFBhdHRlcm4gPSBNYXNrZWRQYXR0ZXJuO1xuXG5leHBvcnQgeyBNYXNrZWRQYXR0ZXJuIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IF8gYXMgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UgfSBmcm9tICcuLi8uLi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzJztcbmltcG9ydCBDaGFuZ2VEZXRhaWxzIGZyb20gJy4uLy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCBDb250aW51b3VzVGFpbERldGFpbHMgZnJvbSAnLi4vLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vLi4vY29yZS9ob2xkZXIuanMnO1xuXG5jb25zdCBfZXhjbHVkZWQgPSBbXCJjaHVua3NcIl07XG5jbGFzcyBDaHVua3NUYWlsRGV0YWlscyB7XG4gIC8qKiAqL1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBjaHVua3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtdO1xuICAgIGxldCBmcm9tID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgIHRoaXMuY2h1bmtzID0gY2h1bmtzO1xuICAgIHRoaXMuZnJvbSA9IGZyb207XG4gIH1cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2h1bmtzLm1hcChTdHJpbmcpLmpvaW4oJycpO1xuICB9XG5cbiAgLy8gJEZsb3dGaXhNZSBubyBpZGVhc1xuICBleHRlbmQodGFpbENodW5rKSB7XG4gICAgaWYgKCFTdHJpbmcodGFpbENodW5rKSkgcmV0dXJuO1xuICAgIGlmIChpc1N0cmluZyh0YWlsQ2h1bmspKSB0YWlsQ2h1bmsgPSBuZXcgQ29udGludW91c1RhaWxEZXRhaWxzKFN0cmluZyh0YWlsQ2h1bmspKTtcbiAgICBjb25zdCBsYXN0Q2h1bmsgPSB0aGlzLmNodW5rc1t0aGlzLmNodW5rcy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBleHRlbmRMYXN0ID0gbGFzdENodW5rICYmIChcbiAgICAvLyBpZiBzdG9wcyBhcmUgc2FtZSBvciB0YWlsIGhhcyBubyBzdG9wXG4gICAgbGFzdENodW5rLnN0b3AgPT09IHRhaWxDaHVuay5zdG9wIHx8IHRhaWxDaHVuay5zdG9wID09IG51bGwpICYmXG4gICAgLy8gaWYgdGFpbCBjaHVuayBnb2VzIGp1c3QgYWZ0ZXIgbGFzdCBjaHVua1xuICAgIHRhaWxDaHVuay5mcm9tID09PSBsYXN0Q2h1bmsuZnJvbSArIGxhc3RDaHVuay50b1N0cmluZygpLmxlbmd0aDtcbiAgICBpZiAodGFpbENodW5rIGluc3RhbmNlb2YgQ29udGludW91c1RhaWxEZXRhaWxzKSB7XG4gICAgICAvLyBjaGVjayB0aGUgYWJpbGl0eSB0byBleHRlbmQgcHJldmlvdXMgY2h1bmtcbiAgICAgIGlmIChleHRlbmRMYXN0KSB7XG4gICAgICAgIC8vIGV4dGVuZCBwcmV2aW91cyBjaHVua1xuICAgICAgICBsYXN0Q2h1bmsuZXh0ZW5kKHRhaWxDaHVuay50b1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGFwcGVuZCBuZXcgY2h1bmtcbiAgICAgICAgdGhpcy5jaHVua3MucHVzaCh0YWlsQ2h1bmspO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGFpbENodW5rIGluc3RhbmNlb2YgQ2h1bmtzVGFpbERldGFpbHMpIHtcbiAgICAgIGlmICh0YWlsQ2h1bmsuc3RvcCA9PSBudWxsKSB7XG4gICAgICAgIC8vIHVud3JhcCBmbG9hdGluZyBjaHVua3MgdG8gcGFyZW50LCBrZWVwaW5nIGBmcm9tYCBwb3NcbiAgICAgICAgbGV0IGZpcnN0VGFpbENodW5rO1xuICAgICAgICB3aGlsZSAodGFpbENodW5rLmNodW5rcy5sZW5ndGggJiYgdGFpbENodW5rLmNodW5rc1swXS5zdG9wID09IG51bGwpIHtcbiAgICAgICAgICBmaXJzdFRhaWxDaHVuayA9IHRhaWxDaHVuay5jaHVua3Muc2hpZnQoKTtcbiAgICAgICAgICBmaXJzdFRhaWxDaHVuay5mcm9tICs9IHRhaWxDaHVuay5mcm9tO1xuICAgICAgICAgIHRoaXMuZXh0ZW5kKGZpcnN0VGFpbENodW5rKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBpZiB0YWlsIGNodW5rIHN0aWxsIGhhcyB2YWx1ZVxuICAgICAgaWYgKHRhaWxDaHVuay50b1N0cmluZygpKSB7XG4gICAgICAgIC8vIGlmIGNodW5rcyBjb250YWlucyBzdG9wcywgdGhlbiBwb3B1cCBzdG9wIHRvIGNvbnRhaW5lclxuICAgICAgICB0YWlsQ2h1bmsuc3RvcCA9IHRhaWxDaHVuay5ibG9ja0luZGV4O1xuICAgICAgICB0aGlzLmNodW5rcy5wdXNoKHRhaWxDaHVuayk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGFwcGVuZFRvKG1hc2tlZCkge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBpZiAoIShtYXNrZWQgaW5zdGFuY2VvZiBJTWFzay5NYXNrZWRQYXR0ZXJuKSkge1xuICAgICAgY29uc3QgdGFpbCA9IG5ldyBDb250aW51b3VzVGFpbERldGFpbHModGhpcy50b1N0cmluZygpKTtcbiAgICAgIHJldHVybiB0YWlsLmFwcGVuZFRvKG1hc2tlZCk7XG4gICAgfVxuICAgIGNvbnN0IGRldGFpbHMgPSBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIGZvciAobGV0IGNpID0gMDsgY2kgPCB0aGlzLmNodW5rcy5sZW5ndGggJiYgIWRldGFpbHMuc2tpcDsgKytjaSkge1xuICAgICAgY29uc3QgY2h1bmsgPSB0aGlzLmNodW5rc1tjaV07XG4gICAgICBjb25zdCBsYXN0QmxvY2tJdGVyID0gbWFza2VkLl9tYXBQb3NUb0Jsb2NrKG1hc2tlZC52YWx1ZS5sZW5ndGgpO1xuICAgICAgY29uc3Qgc3RvcCA9IGNodW5rLnN0b3A7XG4gICAgICBsZXQgY2h1bmtCbG9jaztcbiAgICAgIGlmIChzdG9wICE9IG51bGwgJiYgKFxuICAgICAgLy8gaWYgYmxvY2sgbm90IGZvdW5kIG9yIHN0b3AgaXMgYmVoaW5kIGxhc3RCbG9ja1xuICAgICAgIWxhc3RCbG9ja0l0ZXIgfHwgbGFzdEJsb2NrSXRlci5pbmRleCA8PSBzdG9wKSkge1xuICAgICAgICBpZiAoY2h1bmsgaW5zdGFuY2VvZiBDaHVua3NUYWlsRGV0YWlscyB8fFxuICAgICAgICAvLyBmb3IgY29udGludW91cyBibG9jayBhbHNvIGNoZWNrIGlmIHN0b3AgaXMgZXhpc3RcbiAgICAgICAgbWFza2VkLl9zdG9wcy5pbmRleE9mKHN0b3ApID49IDApIHtcbiAgICAgICAgICBjb25zdCBwaERldGFpbHMgPSBtYXNrZWQuX2FwcGVuZFBsYWNlaG9sZGVyKHN0b3ApO1xuICAgICAgICAgIGRldGFpbHMuYWdncmVnYXRlKHBoRGV0YWlscyk7XG4gICAgICAgIH1cbiAgICAgICAgY2h1bmtCbG9jayA9IGNodW5rIGluc3RhbmNlb2YgQ2h1bmtzVGFpbERldGFpbHMgJiYgbWFza2VkLl9ibG9ja3Nbc3RvcF07XG4gICAgICB9XG4gICAgICBpZiAoY2h1bmtCbG9jaykge1xuICAgICAgICBjb25zdCB0YWlsRGV0YWlscyA9IGNodW5rQmxvY2suYXBwZW5kVGFpbChjaHVuayk7XG4gICAgICAgIHRhaWxEZXRhaWxzLnNraXAgPSBmYWxzZTsgLy8gYWx3YXlzIGlnbm9yZSBza2lwLCBpdCB3aWxsIGJlIHNldCBvbiBsYXN0XG4gICAgICAgIGRldGFpbHMuYWdncmVnYXRlKHRhaWxEZXRhaWxzKTtcbiAgICAgICAgbWFza2VkLl92YWx1ZSArPSB0YWlsRGV0YWlscy5pbnNlcnRlZDtcblxuICAgICAgICAvLyBnZXQgbm90IGluc2VydGVkIGNoYXJzXG4gICAgICAgIGNvbnN0IHJlbWFpbkNoYXJzID0gY2h1bmsudG9TdHJpbmcoKS5zbGljZSh0YWlsRGV0YWlscy5yYXdJbnNlcnRlZC5sZW5ndGgpO1xuICAgICAgICBpZiAocmVtYWluQ2hhcnMpIGRldGFpbHMuYWdncmVnYXRlKG1hc2tlZC5hcHBlbmQocmVtYWluQ2hhcnMsIHtcbiAgICAgICAgICB0YWlsOiB0cnVlXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRldGFpbHMuYWdncmVnYXRlKG1hc2tlZC5hcHBlbmQoY2h1bmsudG9TdHJpbmcoKSwge1xuICAgICAgICAgIHRhaWw6IHRydWVcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNodW5rczogdGhpcy5jaHVua3MubWFwKGMgPT4gYy5zdGF0ZSksXG4gICAgICBmcm9tOiB0aGlzLmZyb20sXG4gICAgICBzdG9wOiB0aGlzLnN0b3AsXG4gICAgICBibG9ja0luZGV4OiB0aGlzLmJsb2NrSW5kZXhcbiAgICB9O1xuICB9XG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGNvbnN0IHtcbiAgICAgICAgY2h1bmtzXG4gICAgICB9ID0gc3RhdGUsXG4gICAgICBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHN0YXRlLCBfZXhjbHVkZWQpO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgcHJvcHMpO1xuICAgIHRoaXMuY2h1bmtzID0gY2h1bmtzLm1hcChjc3RhdGUgPT4ge1xuICAgICAgY29uc3QgY2h1bmsgPSBcImNodW5rc1wiIGluIGNzdGF0ZSA/IG5ldyBDaHVua3NUYWlsRGV0YWlscygpIDogbmV3IENvbnRpbnVvdXNUYWlsRGV0YWlscygpO1xuICAgICAgLy8gJEZsb3dGaXhNZSBhbHJlYWR5IGNoZWNrZWQgYWJvdmVcbiAgICAgIGNodW5rLnN0YXRlID0gY3N0YXRlO1xuICAgICAgcmV0dXJuIGNodW5rO1xuICAgIH0pO1xuICB9XG4gIHVuc2hpZnQoYmVmb3JlUG9zKSB7XG4gICAgaWYgKCF0aGlzLmNodW5rcy5sZW5ndGggfHwgYmVmb3JlUG9zICE9IG51bGwgJiYgdGhpcy5mcm9tID49IGJlZm9yZVBvcykgcmV0dXJuICcnO1xuICAgIGNvbnN0IGNodW5rU2hpZnRQb3MgPSBiZWZvcmVQb3MgIT0gbnVsbCA/IGJlZm9yZVBvcyAtIHRoaXMuZnJvbSA6IGJlZm9yZVBvcztcbiAgICBsZXQgY2kgPSAwO1xuICAgIHdoaWxlIChjaSA8IHRoaXMuY2h1bmtzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2h1bmsgPSB0aGlzLmNodW5rc1tjaV07XG4gICAgICBjb25zdCBzaGlmdENoYXIgPSBjaHVuay51bnNoaWZ0KGNodW5rU2hpZnRQb3MpO1xuICAgICAgaWYgKGNodW5rLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgLy8gY2h1bmsgc3RpbGwgY29udGFpbnMgdmFsdWVcbiAgICAgICAgLy8gYnV0IG5vdCBzaGlmdGVkIC0gbWVhbnMgbm8gbW9yZSBhdmFpbGFibGUgY2hhcnMgdG8gc2hpZnRcbiAgICAgICAgaWYgKCFzaGlmdENoYXIpIGJyZWFrO1xuICAgICAgICArK2NpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2xlYW4gaWYgY2h1bmsgaGFzIG5vIHZhbHVlXG4gICAgICAgIHRoaXMuY2h1bmtzLnNwbGljZShjaSwgMSk7XG4gICAgICB9XG4gICAgICBpZiAoc2hpZnRDaGFyKSByZXR1cm4gc2hpZnRDaGFyO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgc2hpZnQoKSB7XG4gICAgaWYgKCF0aGlzLmNodW5rcy5sZW5ndGgpIHJldHVybiAnJztcbiAgICBsZXQgY2kgPSB0aGlzLmNodW5rcy5sZW5ndGggLSAxO1xuICAgIHdoaWxlICgwIDw9IGNpKSB7XG4gICAgICBjb25zdCBjaHVuayA9IHRoaXMuY2h1bmtzW2NpXTtcbiAgICAgIGNvbnN0IHNoaWZ0Q2hhciA9IGNodW5rLnNoaWZ0KCk7XG4gICAgICBpZiAoY2h1bmsudG9TdHJpbmcoKSkge1xuICAgICAgICAvLyBjaHVuayBzdGlsbCBjb250YWlucyB2YWx1ZVxuICAgICAgICAvLyBidXQgbm90IHNoaWZ0ZWQgLSBtZWFucyBubyBtb3JlIGF2YWlsYWJsZSBjaGFycyB0byBzaGlmdFxuICAgICAgICBpZiAoIXNoaWZ0Q2hhcikgYnJlYWs7XG4gICAgICAgIC0tY2k7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjbGVhbiBpZiBjaHVuayBoYXMgbm8gdmFsdWVcbiAgICAgICAgdGhpcy5jaHVua3Muc3BsaWNlKGNpLCAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaGlmdENoYXIpIHJldHVybiBzaGlmdENoYXI7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5leHBvcnQgeyBDaHVua3NUYWlsRGV0YWlscyBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBESVJFQ1RJT04gfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCAnLi4vLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4uLy4uL2NvcmUvaG9sZGVyLmpzJztcblxuY2xhc3MgUGF0dGVybkN1cnNvciB7XG4gIGNvbnN0cnVjdG9yKG1hc2tlZCwgcG9zKSB7XG4gICAgdGhpcy5tYXNrZWQgPSBtYXNrZWQ7XG4gICAgdGhpcy5fbG9nID0gW107XG4gICAgY29uc3Qge1xuICAgICAgb2Zmc2V0LFxuICAgICAgaW5kZXhcbiAgICB9ID0gbWFza2VkLl9tYXBQb3NUb0Jsb2NrKHBvcykgfHwgKHBvcyA8IDAgP1xuICAgIC8vIGZpcnN0XG4gICAge1xuICAgICAgaW5kZXg6IDAsXG4gICAgICBvZmZzZXQ6IDBcbiAgICB9IDpcbiAgICAvLyBsYXN0XG4gICAge1xuICAgICAgaW5kZXg6IHRoaXMubWFza2VkLl9ibG9ja3MubGVuZ3RoLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSk7XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIHRoaXMub2sgPSBmYWxzZTtcbiAgfVxuICBnZXQgYmxvY2soKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLl9ibG9ja3NbdGhpcy5pbmRleF07XG4gIH1cbiAgZ2V0IHBvcygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXNrZWQuX2Jsb2NrU3RhcnRQb3ModGhpcy5pbmRleCkgKyB0aGlzLm9mZnNldDtcbiAgfVxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgIG9rOiB0aGlzLm9rXG4gICAgfTtcbiAgfVxuICBzZXQgc3RhdGUocykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgcyk7XG4gIH1cbiAgcHVzaFN0YXRlKCkge1xuICAgIHRoaXMuX2xvZy5wdXNoKHRoaXMuc3RhdGUpO1xuICB9XG4gIHBvcFN0YXRlKCkge1xuICAgIGNvbnN0IHMgPSB0aGlzLl9sb2cucG9wKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHM7XG4gICAgcmV0dXJuIHM7XG4gIH1cbiAgYmluZEJsb2NrKCkge1xuICAgIGlmICh0aGlzLmJsb2NrKSByZXR1cm47XG4gICAgaWYgKHRoaXMuaW5kZXggPCAwKSB7XG4gICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICB9XG4gICAgaWYgKHRoaXMuaW5kZXggPj0gdGhpcy5tYXNrZWQuX2Jsb2Nrcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaW5kZXggPSB0aGlzLm1hc2tlZC5fYmxvY2tzLmxlbmd0aCAtIDE7XG4gICAgICB0aGlzLm9mZnNldCA9IHRoaXMuYmxvY2sudmFsdWUubGVuZ3RoO1xuICAgIH1cbiAgfVxuICBfcHVzaExlZnQoZm4pIHtcbiAgICB0aGlzLnB1c2hTdGF0ZSgpO1xuICAgIGZvciAodGhpcy5iaW5kQmxvY2soKTsgMCA8PSB0aGlzLmluZGV4OyAtLXRoaXMuaW5kZXgsIHRoaXMub2Zmc2V0ID0gKChfdGhpcyRibG9jayA9IHRoaXMuYmxvY2spID09PSBudWxsIHx8IF90aGlzJGJsb2NrID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRibG9jay52YWx1ZS5sZW5ndGgpIHx8IDApIHtcbiAgICAgIHZhciBfdGhpcyRibG9jaztcbiAgICAgIGlmIChmbigpKSByZXR1cm4gdGhpcy5vayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9rID0gZmFsc2U7XG4gIH1cbiAgX3B1c2hSaWdodChmbikge1xuICAgIHRoaXMucHVzaFN0YXRlKCk7XG4gICAgZm9yICh0aGlzLmJpbmRCbG9jaygpOyB0aGlzLmluZGV4IDwgdGhpcy5tYXNrZWQuX2Jsb2Nrcy5sZW5ndGg7ICsrdGhpcy5pbmRleCwgdGhpcy5vZmZzZXQgPSAwKSB7XG4gICAgICBpZiAoZm4oKSkgcmV0dXJuIHRoaXMub2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vayA9IGZhbHNlO1xuICB9XG4gIHB1c2hMZWZ0QmVmb3JlRmlsbGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9wdXNoTGVmdCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5ibG9jay5pc0ZpeGVkIHx8ICF0aGlzLmJsb2NrLnZhbHVlKSByZXR1cm47XG4gICAgICB0aGlzLm9mZnNldCA9IHRoaXMuYmxvY2submVhcmVzdElucHV0UG9zKHRoaXMub2Zmc2V0LCBESVJFQ1RJT04uRk9SQ0VfTEVGVCk7XG4gICAgICBpZiAodGhpcy5vZmZzZXQgIT09IDApIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG4gIHB1c2hMZWZ0QmVmb3JlSW5wdXQoKSB7XG4gICAgLy8gY2FzZXM6XG4gICAgLy8gZmlsbGVkIGlucHV0OiAwMHxcbiAgICAvLyBvcHRpb25hbCBlbXB0eSBpbnB1dDogMDBbXXxcbiAgICAvLyBuZXN0ZWQgYmxvY2s6IFhYPFtdPnxcbiAgICByZXR1cm4gdGhpcy5fcHVzaExlZnQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYmxvY2suaXNGaXhlZCkgcmV0dXJuO1xuICAgICAgdGhpcy5vZmZzZXQgPSB0aGlzLmJsb2NrLm5lYXJlc3RJbnB1dFBvcyh0aGlzLm9mZnNldCwgRElSRUNUSU9OLkxFRlQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cbiAgcHVzaExlZnRCZWZvcmVSZXF1aXJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHVzaExlZnQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYmxvY2suaXNGaXhlZCB8fCB0aGlzLmJsb2NrLmlzT3B0aW9uYWwgJiYgIXRoaXMuYmxvY2sudmFsdWUpIHJldHVybjtcbiAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5ibG9jay5uZWFyZXN0SW5wdXRQb3ModGhpcy5vZmZzZXQsIERJUkVDVElPTi5MRUZUKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG4gIHB1c2hSaWdodEJlZm9yZUZpbGxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHVzaFJpZ2h0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmJsb2NrLmlzRml4ZWQgfHwgIXRoaXMuYmxvY2sudmFsdWUpIHJldHVybjtcbiAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5ibG9jay5uZWFyZXN0SW5wdXRQb3ModGhpcy5vZmZzZXQsIERJUkVDVElPTi5GT1JDRV9SSUdIVCk7XG4gICAgICBpZiAodGhpcy5vZmZzZXQgIT09IHRoaXMuYmxvY2sudmFsdWUubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuICBwdXNoUmlnaHRCZWZvcmVJbnB1dCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHVzaFJpZ2h0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmJsb2NrLmlzRml4ZWQpIHJldHVybjtcblxuICAgICAgLy8gY29uc3QgbyA9IHRoaXMub2Zmc2V0O1xuICAgICAgdGhpcy5vZmZzZXQgPSB0aGlzLmJsb2NrLm5lYXJlc3RJbnB1dFBvcyh0aGlzLm9mZnNldCwgRElSRUNUSU9OLk5PTkUpO1xuICAgICAgLy8gSEFDSyBjYXNlcyBsaWtlIChTVElMTCBET0VTIE5PVCBXT1JLIEZPUiBORVNURUQpXG4gICAgICAvLyBhYXxYXG4gICAgICAvLyBhYTxYfFtdPlhfICAgIC0gdGhpcyB3aWxsIG5vdCB3b3JrXG4gICAgICAvLyBpZiAobyAmJiBvID09PSB0aGlzLm9mZnNldCAmJiB0aGlzLmJsb2NrIGluc3RhbmNlb2YgUGF0dGVybklucHV0RGVmaW5pdGlvbikgY29udGludWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuICBwdXNoUmlnaHRCZWZvcmVSZXF1aXJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHVzaFJpZ2h0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmJsb2NrLmlzRml4ZWQgfHwgdGhpcy5ibG9jay5pc09wdGlvbmFsICYmICF0aGlzLmJsb2NrLnZhbHVlKSByZXR1cm47XG5cbiAgICAgIC8vIFRPRE8gY2hlY2sgfFsqXVhYX1xuICAgICAgdGhpcy5vZmZzZXQgPSB0aGlzLmJsb2NrLm5lYXJlc3RJbnB1dFBvcyh0aGlzLm9mZnNldCwgRElSRUNUSU9OLk5PTkUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgUGF0dGVybkN1cnNvciBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgQ2hhbmdlRGV0YWlscyBmcm9tICcuLi8uLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCB7IERJUkVDVElPTiwgaXNTdHJpbmcgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCBDb250aW51b3VzVGFpbERldGFpbHMgZnJvbSAnLi4vLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4uLy4uL2NvcmUvaG9sZGVyLmpzJztcblxuLyoqICovXG5cbmNsYXNzIFBhdHRlcm5GaXhlZERlZmluaXRpb24ge1xuICAvKiogKi9cblxuICAvKiogKi9cblxuICAvKiogKi9cblxuICAvKiogKi9cblxuICAvKiogKi9cblxuICAvKiogKi9cblxuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRzKTtcbiAgICB0aGlzLl92YWx1ZSA9ICcnO1xuICAgIHRoaXMuaXNGaXhlZCA9IHRydWU7XG4gIH1cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBnZXQgdW5tYXNrZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1VubWFza2luZyA/IHRoaXMudmFsdWUgOiAnJztcbiAgfVxuICBnZXQgZGlzcGxheVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2lzUmF3SW5wdXQgPSBmYWxzZTtcbiAgICB0aGlzLl92YWx1ZSA9ICcnO1xuICB9XG4gIHJlbW92ZSgpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMuX3ZhbHVlLmxlbmd0aDtcbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX3ZhbHVlLnNsaWNlKDAsIGZyb21Qb3MpICsgdGhpcy5fdmFsdWUuc2xpY2UodG9Qb3MpO1xuICAgIGlmICghdGhpcy5fdmFsdWUpIHRoaXMuX2lzUmF3SW5wdXQgPSBmYWxzZTtcbiAgICByZXR1cm4gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgfVxuICBuZWFyZXN0SW5wdXRQb3MoY3Vyc29yUG9zKSB7XG4gICAgbGV0IGRpcmVjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogRElSRUNUSU9OLk5PTkU7XG4gICAgY29uc3QgbWluUG9zID0gMDtcbiAgICBjb25zdCBtYXhQb3MgPSB0aGlzLl92YWx1ZS5sZW5ndGg7XG4gICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XG4gICAgICBjYXNlIERJUkVDVElPTi5GT1JDRV9MRUZUOlxuICAgICAgICByZXR1cm4gbWluUG9zO1xuICAgICAgY2FzZSBESVJFQ1RJT04uTk9ORTpcbiAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxuICAgICAgY2FzZSBESVJFQ1RJT04uRk9SQ0VfUklHSFQ6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbWF4UG9zO1xuICAgIH1cbiAgfVxuICB0b3RhbElucHV0UG9zaXRpb25zKCkge1xuICAgIGxldCBmcm9tUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy5fdmFsdWUubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLl9pc1Jhd0lucHV0ID8gdG9Qb3MgLSBmcm9tUG9zIDogMDtcbiAgfVxuICBleHRyYWN0SW5wdXQoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLl92YWx1ZS5sZW5ndGg7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgICByZXR1cm4gZmxhZ3MucmF3ICYmIHRoaXMuX2lzUmF3SW5wdXQgJiYgdGhpcy5fdmFsdWUuc2xpY2UoZnJvbVBvcywgdG9Qb3MpIHx8ICcnO1xuICB9XG4gIGdldCBpc0NvbXBsZXRlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGdldCBpc0ZpbGxlZCgpIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLl92YWx1ZSk7XG4gIH1cbiAgX2FwcGVuZENoYXIoY2gpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGNvbnN0IGRldGFpbHMgPSBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIGlmICh0aGlzLmlzRmlsbGVkKSByZXR1cm4gZGV0YWlscztcbiAgICBjb25zdCBhcHBlbmRFYWdlciA9IHRoaXMuZWFnZXIgPT09IHRydWUgfHwgdGhpcy5lYWdlciA9PT0gJ2FwcGVuZCc7XG4gICAgY29uc3QgYXBwZW5kZWQgPSB0aGlzLmNoYXIgPT09IGNoO1xuICAgIGNvbnN0IGlzUmVzb2x2ZWQgPSBhcHBlbmRlZCAmJiAodGhpcy5pc1VubWFza2luZyB8fCBmbGFncy5pbnB1dCB8fCBmbGFncy5yYXcpICYmICghZmxhZ3MucmF3IHx8ICFhcHBlbmRFYWdlcikgJiYgIWZsYWdzLnRhaWw7XG4gICAgaWYgKGlzUmVzb2x2ZWQpIGRldGFpbHMucmF3SW5zZXJ0ZWQgPSB0aGlzLmNoYXI7XG4gICAgdGhpcy5fdmFsdWUgPSBkZXRhaWxzLmluc2VydGVkID0gdGhpcy5jaGFyO1xuICAgIHRoaXMuX2lzUmF3SW5wdXQgPSBpc1Jlc29sdmVkICYmIChmbGFncy5yYXcgfHwgZmxhZ3MuaW5wdXQpO1xuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG4gIF9hcHBlbmRFYWdlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwZW5kQ2hhcih0aGlzLmNoYXIsIHtcbiAgICAgIHRhaWw6IHRydWVcbiAgICB9KTtcbiAgfVxuICBfYXBwZW5kUGxhY2Vob2xkZXIoKSB7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgaWYgKHRoaXMuaXNGaWxsZWQpIHJldHVybiBkZXRhaWxzO1xuICAgIHRoaXMuX3ZhbHVlID0gZGV0YWlscy5pbnNlcnRlZCA9IHRoaXMuY2hhcjtcbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuICBleHRyYWN0VGFpbCgpIHtcbiAgICBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgQ29udGludW91c1RhaWxEZXRhaWxzKCcnKTtcbiAgfVxuXG4gIC8vICRGbG93Rml4TWUgbm8gaWRlYXNcbiAgYXBwZW5kVGFpbCh0YWlsKSB7XG4gICAgaWYgKGlzU3RyaW5nKHRhaWwpKSB0YWlsID0gbmV3IENvbnRpbnVvdXNUYWlsRGV0YWlscyhTdHJpbmcodGFpbCkpO1xuICAgIHJldHVybiB0YWlsLmFwcGVuZFRvKHRoaXMpO1xuICB9XG4gIGFwcGVuZChzdHIsIGZsYWdzLCB0YWlsKSB7XG4gICAgY29uc3QgZGV0YWlscyA9IHRoaXMuX2FwcGVuZENoYXIoc3RyWzBdLCBmbGFncyk7XG4gICAgaWYgKHRhaWwgIT0gbnVsbCkge1xuICAgICAgZGV0YWlscy50YWlsU2hpZnQgKz0gdGhpcy5hcHBlbmRUYWlsKHRhaWwpLnRhaWxTaGlmdDtcbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cbiAgZG9Db21taXQoKSB7fVxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIF92YWx1ZTogdGhpcy5fdmFsdWUsXG4gICAgICBfaXNSYXdJbnB1dDogdGhpcy5faXNSYXdJbnB1dFxuICAgIH07XG4gIH1cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzdGF0ZSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgUGF0dGVybkZpeGVkRGVmaW5pdGlvbiBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBfIGFzIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIH0gZnJvbSAnLi4vLi4vX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy02YjNiZDQwNC5qcyc7XG5pbXBvcnQgY3JlYXRlTWFzayBmcm9tICcuLi9mYWN0b3J5LmpzJztcbmltcG9ydCBDaGFuZ2VEZXRhaWxzIGZyb20gJy4uLy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0IHsgRElSRUNUSU9OIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgJy4uLy4uL2NvcmUvaG9sZGVyLmpzJztcblxuY29uc3QgX2V4Y2x1ZGVkID0gW1wicGFyZW50XCIsIFwiaXNPcHRpb25hbFwiLCBcInBsYWNlaG9sZGVyQ2hhclwiLCBcImRpc3BsYXlDaGFyXCIsIFwibGF6eVwiLCBcImVhZ2VyXCJdO1xuXG4vKiogKi9cblxuY29uc3QgREVGQVVMVF9JTlBVVF9ERUZJTklUSU9OUyA9IHtcbiAgJzAnOiAvXFxkLyxcbiAgJ2EnOiAvW1xcdTAwNDEtXFx1MDA1QVxcdTAwNjEtXFx1MDA3QVxcdTAwQUFcXHUwMEI1XFx1MDBCQVxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3MC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEUtXFx1MDNBMVxcdTAzQTMtXFx1MDNGNVxcdTAzRjctXFx1MDQ4MVxcdTA0OEEtXFx1MDUyN1xcdTA1MzEtXFx1MDU1NlxcdTA1NTlcXHUwNTYxLVxcdTA1ODdcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjIwLVxcdTA2NEFcXHUwNjZFXFx1MDY2RlxcdTA2NzEtXFx1MDZEM1xcdTA2RDVcXHUwNkU1XFx1MDZFNlxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODE1XFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDg0MC1cXHUwODU4XFx1MDhBMFxcdTA4QTItXFx1MDhBQ1xcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3MS1cXHUwOTc3XFx1MDk3OS1cXHUwOTdGXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzNcXHUwQzM1LVxcdTBDMzlcXHUwQzNEXFx1MEM1OFxcdTBDNTlcXHUwQzYwXFx1MEM2MVxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ2MFxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDZcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEwRDAtXFx1MTBGQVxcdTEwRkMtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTNBMC1cXHUxM0Y0XFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEN1xcdTE3RENcXHUxODIwLVxcdTE4NzdcXHUxODgwLVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFDXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlDMS1cXHUxOUM3XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUFBN1xcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzdEXFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUxRDAwLVxcdTFEQkZcXHUxRTAwLVxcdTFGMTVcXHUxRjE4LVxcdTFGMURcXHUxRjIwLVxcdTFGNDVcXHUxRjQ4LVxcdTFGNERcXHUxRjUwLVxcdTFGNTdcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGLVxcdTFGN0RcXHUxRjgwLVxcdTFGQjRcXHUxRkI2LVxcdTFGQkNcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNi1cXHUxRkNDXFx1MUZEMC1cXHUxRkQzXFx1MUZENi1cXHUxRkRCXFx1MUZFMC1cXHUxRkVDXFx1MUZGMi1cXHUxRkY0XFx1MUZGNi1cXHUxRkZDXFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyMTAyXFx1MjEwN1xcdTIxMEEtXFx1MjExM1xcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTJGLVxcdTIxMzlcXHUyMTNDLVxcdTIxM0ZcXHUyMTQ1LVxcdTIxNDlcXHUyMTRFXFx1MjE4M1xcdTIxODRcXHUyQzAwLVxcdTJDMkVcXHUyQzMwLVxcdTJDNUVcXHUyQzYwLVxcdTJDRTRcXHUyQ0VCLVxcdTJDRUVcXHUyQ0YyXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1MkQzMC1cXHUyRDY3XFx1MkQ2RlxcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTJFMkZcXHUzMDA1XFx1MzAwNlxcdTMwMzEtXFx1MzAzNVxcdTMwM0JcXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5RC1cXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGQy1cXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkNDXFx1QTAwMC1cXHVBNDhDXFx1QTREMC1cXHVBNEZEXFx1QTUwMC1cXHVBNjBDXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjQwLVxcdUE2NkVcXHVBNjdGLVxcdUE2OTdcXHVBNkEwLVxcdUE2RTVcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3OEVcXHVBNzkwLVxcdUE3OTNcXHVBN0EwLVxcdUE3QUFcXHVBN0Y4LVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlDRlxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE3NlxcdUFBN0FcXHVBQTgwLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFQVxcdUFBRjItXFx1QUFGNFxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCQzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMjEtXFx1RkYzQVxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ10vLFxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjA3NTA3MFxuICAnKic6IC8uL1xufTtcblxuLyoqICovXG5jbGFzcyBQYXR0ZXJuSW5wdXREZWZpbml0aW9uIHtcbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIGNvbnN0IHtcbiAgICAgICAgcGFyZW50LFxuICAgICAgICBpc09wdGlvbmFsLFxuICAgICAgICBwbGFjZWhvbGRlckNoYXIsXG4gICAgICAgIGRpc3BsYXlDaGFyLFxuICAgICAgICBsYXp5LFxuICAgICAgICBlYWdlclxuICAgICAgfSA9IG9wdHMsXG4gICAgICBtYXNrT3B0cyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKG9wdHMsIF9leGNsdWRlZCk7XG4gICAgdGhpcy5tYXNrZWQgPSBjcmVhdGVNYXNrKG1hc2tPcHRzKTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgIHBhcmVudCxcbiAgICAgIGlzT3B0aW9uYWwsXG4gICAgICBwbGFjZWhvbGRlckNoYXIsXG4gICAgICBkaXNwbGF5Q2hhcixcbiAgICAgIGxhenksXG4gICAgICBlYWdlclxuICAgIH0pO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuaXNGaWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLm1hc2tlZC5yZXNldCgpO1xuICB9XG4gIHJlbW92ZSgpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIGlmIChmcm9tUG9zID09PSAwICYmIHRvUG9zID49IDEpIHtcbiAgICAgIHRoaXMuaXNGaWxsZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzLm1hc2tlZC5yZW1vdmUoZnJvbVBvcywgdG9Qb3MpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgfVxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLnZhbHVlIHx8ICh0aGlzLmlzRmlsbGVkICYmICF0aGlzLmlzT3B0aW9uYWwgPyB0aGlzLnBsYWNlaG9sZGVyQ2hhciA6ICcnKTtcbiAgfVxuICBnZXQgdW5tYXNrZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXNrZWQudW5tYXNrZWRWYWx1ZTtcbiAgfVxuICBnZXQgZGlzcGxheVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC52YWx1ZSAmJiB0aGlzLmRpc3BsYXlDaGFyIHx8IHRoaXMudmFsdWU7XG4gIH1cbiAgZ2V0IGlzQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5tYXNrZWQudmFsdWUpIHx8IHRoaXMuaXNPcHRpb25hbDtcbiAgfVxuICBfYXBwZW5kQ2hhcihjaCkge1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgaWYgKHRoaXMuaXNGaWxsZWQpIHJldHVybiBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5tYXNrZWQuc3RhdGU7XG4gICAgLy8gc2ltdWxhdGUgaW5wdXRcbiAgICBjb25zdCBkZXRhaWxzID0gdGhpcy5tYXNrZWQuX2FwcGVuZENoYXIoY2gsIGZsYWdzKTtcbiAgICBpZiAoZGV0YWlscy5pbnNlcnRlZCAmJiB0aGlzLmRvVmFsaWRhdGUoZmxhZ3MpID09PSBmYWxzZSkge1xuICAgICAgZGV0YWlscy5pbnNlcnRlZCA9IGRldGFpbHMucmF3SW5zZXJ0ZWQgPSAnJztcbiAgICAgIHRoaXMubWFza2VkLnN0YXRlID0gc3RhdGU7XG4gICAgfVxuICAgIGlmICghZGV0YWlscy5pbnNlcnRlZCAmJiAhdGhpcy5pc09wdGlvbmFsICYmICF0aGlzLmxhenkgJiYgIWZsYWdzLmlucHV0KSB7XG4gICAgICBkZXRhaWxzLmluc2VydGVkID0gdGhpcy5wbGFjZWhvbGRlckNoYXI7XG4gICAgfVxuICAgIGRldGFpbHMuc2tpcCA9ICFkZXRhaWxzLmluc2VydGVkICYmICF0aGlzLmlzT3B0aW9uYWw7XG4gICAgdGhpcy5pc0ZpbGxlZCA9IEJvb2xlYW4oZGV0YWlscy5pbnNlcnRlZCk7XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cbiAgYXBwZW5kKCkge1xuICAgIC8vIFRPRE8gcHJvYmFibHkgc2hvdWxkIGJlIGRvbmUgdmlhIF9hcHBlbmRDaGFyXG4gICAgcmV0dXJuIHRoaXMubWFza2VkLmFwcGVuZCguLi5hcmd1bWVudHMpO1xuICB9XG4gIF9hcHBlbmRQbGFjZWhvbGRlcigpIHtcbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICBpZiAodGhpcy5pc0ZpbGxlZCB8fCB0aGlzLmlzT3B0aW9uYWwpIHJldHVybiBkZXRhaWxzO1xuICAgIHRoaXMuaXNGaWxsZWQgPSB0cnVlO1xuICAgIGRldGFpbHMuaW5zZXJ0ZWQgPSB0aGlzLnBsYWNlaG9sZGVyQ2hhcjtcbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuICBfYXBwZW5kRWFnZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gIH1cbiAgZXh0cmFjdFRhaWwoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLmV4dHJhY3RUYWlsKC4uLmFyZ3VtZW50cyk7XG4gIH1cbiAgYXBwZW5kVGFpbCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXNrZWQuYXBwZW5kVGFpbCguLi5hcmd1bWVudHMpO1xuICB9XG4gIGV4dHJhY3RJbnB1dCgpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC5leHRyYWN0SW5wdXQoZnJvbVBvcywgdG9Qb3MsIGZsYWdzKTtcbiAgfVxuICBuZWFyZXN0SW5wdXRQb3MoY3Vyc29yUG9zKSB7XG4gICAgbGV0IGRpcmVjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogRElSRUNUSU9OLk5PTkU7XG4gICAgY29uc3QgbWluUG9zID0gMDtcbiAgICBjb25zdCBtYXhQb3MgPSB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICBjb25zdCBib3VuZFBvcyA9IE1hdGgubWluKE1hdGgubWF4KGN1cnNvclBvcywgbWluUG9zKSwgbWF4UG9zKTtcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcbiAgICAgIGNhc2UgRElSRUNUSU9OLkZPUkNFX0xFRlQ6XG4gICAgICAgIHJldHVybiB0aGlzLmlzQ29tcGxldGUgPyBib3VuZFBvcyA6IG1pblBvcztcbiAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxuICAgICAgY2FzZSBESVJFQ1RJT04uRk9SQ0VfUklHSFQ6XG4gICAgICAgIHJldHVybiB0aGlzLmlzQ29tcGxldGUgPyBib3VuZFBvcyA6IG1heFBvcztcbiAgICAgIGNhc2UgRElSRUNUSU9OLk5PTkU6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gYm91bmRQb3M7XG4gICAgfVxuICB9XG4gIHRvdGFsSW5wdXRQb3NpdGlvbnMoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy52YWx1ZS5zbGljZShmcm9tUG9zLCB0b1BvcykubGVuZ3RoO1xuICB9XG4gIGRvVmFsaWRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLmRvVmFsaWRhdGUoLi4uYXJndW1lbnRzKSAmJiAoIXRoaXMucGFyZW50IHx8IHRoaXMucGFyZW50LmRvVmFsaWRhdGUoLi4uYXJndW1lbnRzKSk7XG4gIH1cbiAgZG9Db21taXQoKSB7XG4gICAgdGhpcy5tYXNrZWQuZG9Db21taXQoKTtcbiAgfVxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1hc2tlZDogdGhpcy5tYXNrZWQuc3RhdGUsXG4gICAgICBpc0ZpbGxlZDogdGhpcy5pc0ZpbGxlZFxuICAgIH07XG4gIH1cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5tYXNrZWQuc3RhdGUgPSBzdGF0ZS5tYXNrZWQ7XG4gICAgdGhpcy5pc0ZpbGxlZCA9IHN0YXRlLmlzRmlsbGVkO1xuICB9XG59XG5cbmV4cG9ydCB7IERFRkFVTFRfSU5QVVRfREVGSU5JVElPTlMsIFBhdHRlcm5JbnB1dERlZmluaXRpb24gYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IGNyZWF0ZU1hc2sgZnJvbSAnLi9mYWN0b3J5LmpzJztcbmltcG9ydCBJTWFzayBmcm9tICcuLi9jb3JlL2hvbGRlci5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcblxuLyoqIE1hc2sgcGlwZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIHR5cGVzICovXG5jb25zdCBQSVBFX1RZUEUgPSB7XG4gIE1BU0tFRDogJ3ZhbHVlJyxcbiAgVU5NQVNLRUQ6ICd1bm1hc2tlZFZhbHVlJyxcbiAgVFlQRUQ6ICd0eXBlZFZhbHVlJ1xufTtcblxuLyoqIENyZWF0ZXMgbmV3IHBpcGUgZnVuY3Rpb24gZGVwZW5kaW5nIG9uIG1hc2sgdHlwZSwgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBvcHRpb25zICovXG5mdW5jdGlvbiBjcmVhdGVQaXBlKG1hc2spIHtcbiAgbGV0IGZyb20gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IFBJUEVfVFlQRS5NQVNLRUQ7XG4gIGxldCB0byA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogUElQRV9UWVBFLk1BU0tFRDtcbiAgY29uc3QgbWFza2VkID0gY3JlYXRlTWFzayhtYXNrKTtcbiAgcmV0dXJuIHZhbHVlID0+IG1hc2tlZC5ydW5Jc29sYXRlZChtID0+IHtcbiAgICBtW2Zyb21dID0gdmFsdWU7XG4gICAgcmV0dXJuIG1bdG9dO1xuICB9KTtcbn1cblxuLyoqIFBpcGVzIHZhbHVlIHRocm91Z2ggbWFzayBkZXBlbmRpbmcgb24gbWFzayB0eXBlLCBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIG9wdGlvbnMgKi9cbmZ1bmN0aW9uIHBpcGUodmFsdWUpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHBpcGVBcmdzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBwaXBlQXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZVBpcGUoLi4ucGlwZUFyZ3MpKHZhbHVlKTtcbn1cbklNYXNrLlBJUEVfVFlQRSA9IFBJUEVfVFlQRTtcbklNYXNrLmNyZWF0ZVBpcGUgPSBjcmVhdGVQaXBlO1xuSU1hc2sucGlwZSA9IHBpcGU7XG5cbmV4cG9ydCB7IFBJUEVfVFlQRSwgY3JlYXRlUGlwZSwgcGlwZSB9O1xuIiwiaW1wb3J0IE1hc2tlZFBhdHRlcm4gZnJvbSAnLi9wYXR0ZXJuLmpzJztcbmltcG9ydCAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgeyBub3JtYWxpemVQcmVwYXJlIH0gZnJvbSAnLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuLi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzJztcbmltcG9ydCAnLi9iYXNlLmpzJztcbmltcG9ydCAnLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vcGF0dGVybi9pbnB1dC1kZWZpbml0aW9uLmpzJztcbmltcG9ydCAnLi9mYWN0b3J5LmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2ZpeGVkLWRlZmluaXRpb24uanMnO1xuaW1wb3J0ICcuL3BhdHRlcm4vY2h1bmstdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2N1cnNvci5qcyc7XG5pbXBvcnQgJy4vcmVnZXhwLmpzJztcblxuLyoqIFBhdHRlcm4gd2hpY2ggYWNjZXB0cyByYW5nZXMgKi9cbmNsYXNzIE1hc2tlZFJhbmdlIGV4dGVuZHMgTWFza2VkUGF0dGVybiB7XG4gIC8qKlxuICAgIE9wdGlvbmFsbHkgc2V0cyBtYXggbGVuZ3RoIG9mIHBhdHRlcm4uXG4gICAgVXNlZCB3aGVuIHBhdHRlcm4gbGVuZ3RoIGlzIGxvbmdlciB0aGVuIGB0b2AgcGFyYW0gbGVuZ3RoLiBQYWRzIHplcm9zIGF0IHN0YXJ0IGluIHRoaXMgY2FzZS5cbiAgKi9cblxuICAvKiogTWluIGJvdW5kICovXG5cbiAgLyoqIE1heCBib3VuZCAqL1xuXG4gIC8qKiAqL1xuXG4gIGdldCBfbWF0Y2hGcm9tKCkge1xuICAgIHJldHVybiB0aGlzLm1heExlbmd0aCAtIFN0cmluZyh0aGlzLmZyb20pLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBfdXBkYXRlKG9wdHMpIHtcbiAgICAvLyBUT0RPIHR5cGVcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICB0bzogdGhpcy50byB8fCAwLFxuICAgICAgZnJvbTogdGhpcy5mcm9tIHx8IDAsXG4gICAgICBtYXhMZW5ndGg6IHRoaXMubWF4TGVuZ3RoIHx8IDBcbiAgICB9LCBvcHRzKTtcbiAgICBsZXQgbWF4TGVuZ3RoID0gU3RyaW5nKG9wdHMudG8pLmxlbmd0aDtcbiAgICBpZiAob3B0cy5tYXhMZW5ndGggIT0gbnVsbCkgbWF4TGVuZ3RoID0gTWF0aC5tYXgobWF4TGVuZ3RoLCBvcHRzLm1heExlbmd0aCk7XG4gICAgb3B0cy5tYXhMZW5ndGggPSBtYXhMZW5ndGg7XG4gICAgY29uc3QgZnJvbVN0ciA9IFN0cmluZyhvcHRzLmZyb20pLnBhZFN0YXJ0KG1heExlbmd0aCwgJzAnKTtcbiAgICBjb25zdCB0b1N0ciA9IFN0cmluZyhvcHRzLnRvKS5wYWRTdGFydChtYXhMZW5ndGgsICcwJyk7XG4gICAgbGV0IHNhbWVDaGFyc0NvdW50ID0gMDtcbiAgICB3aGlsZSAoc2FtZUNoYXJzQ291bnQgPCB0b1N0ci5sZW5ndGggJiYgdG9TdHJbc2FtZUNoYXJzQ291bnRdID09PSBmcm9tU3RyW3NhbWVDaGFyc0NvdW50XSkgKytzYW1lQ2hhcnNDb3VudDtcbiAgICBvcHRzLm1hc2sgPSB0b1N0ci5zbGljZSgwLCBzYW1lQ2hhcnNDb3VudCkucmVwbGFjZSgvMC9nLCAnXFxcXDAnKSArICcwJy5yZXBlYXQobWF4TGVuZ3RoIC0gc2FtZUNoYXJzQ291bnQpO1xuICAgIHN1cGVyLl91cGRhdGUob3B0cyk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IGlzQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmlzQ29tcGxldGUgJiYgQm9vbGVhbih0aGlzLnZhbHVlKTtcbiAgfVxuICBib3VuZGFyaWVzKHN0cikge1xuICAgIGxldCBtaW5zdHIgPSAnJztcbiAgICBsZXQgbWF4c3RyID0gJyc7XG4gICAgY29uc3QgWywgcGxhY2Vob2xkZXIsIG51bV0gPSBzdHIubWF0Y2goL14oXFxEKikoXFxkKikoXFxEKikvKSB8fCBbXTtcbiAgICBpZiAobnVtKSB7XG4gICAgICBtaW5zdHIgPSAnMCcucmVwZWF0KHBsYWNlaG9sZGVyLmxlbmd0aCkgKyBudW07XG4gICAgICBtYXhzdHIgPSAnOScucmVwZWF0KHBsYWNlaG9sZGVyLmxlbmd0aCkgKyBudW07XG4gICAgfVxuICAgIG1pbnN0ciA9IG1pbnN0ci5wYWRFbmQodGhpcy5tYXhMZW5ndGgsICcwJyk7XG4gICAgbWF4c3RyID0gbWF4c3RyLnBhZEVuZCh0aGlzLm1heExlbmd0aCwgJzknKTtcbiAgICByZXR1cm4gW21pbnN0ciwgbWF4c3RyXTtcbiAgfVxuXG4gIC8vIFRPRE8gc3RyIGlzIGEgc2luZ2xlIGNoYXIgZXZlcnl0aW1lXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb1ByZXBhcmUoY2gpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGxldCBkZXRhaWxzO1xuICAgIFtjaCwgZGV0YWlsc10gPSBub3JtYWxpemVQcmVwYXJlKHN1cGVyLmRvUHJlcGFyZShjaC5yZXBsYWNlKC9cXEQvZywgJycpLCBmbGFncykpO1xuICAgIGlmICghdGhpcy5hdXRvZml4IHx8ICFjaCkgcmV0dXJuIGNoO1xuICAgIGNvbnN0IGZyb21TdHIgPSBTdHJpbmcodGhpcy5mcm9tKS5wYWRTdGFydCh0aGlzLm1heExlbmd0aCwgJzAnKTtcbiAgICBjb25zdCB0b1N0ciA9IFN0cmluZyh0aGlzLnRvKS5wYWRTdGFydCh0aGlzLm1heExlbmd0aCwgJzAnKTtcbiAgICBsZXQgbmV4dFZhbCA9IHRoaXMudmFsdWUgKyBjaDtcbiAgICBpZiAobmV4dFZhbC5sZW5ndGggPiB0aGlzLm1heExlbmd0aCkgcmV0dXJuICcnO1xuICAgIGNvbnN0IFttaW5zdHIsIG1heHN0cl0gPSB0aGlzLmJvdW5kYXJpZXMobmV4dFZhbCk7XG4gICAgaWYgKE51bWJlcihtYXhzdHIpIDwgdGhpcy5mcm9tKSByZXR1cm4gZnJvbVN0cltuZXh0VmFsLmxlbmd0aCAtIDFdO1xuICAgIGlmIChOdW1iZXIobWluc3RyKSA+IHRoaXMudG8pIHtcbiAgICAgIGlmICh0aGlzLmF1dG9maXggPT09ICdwYWQnICYmIG5leHRWYWwubGVuZ3RoIDwgdGhpcy5tYXhMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFsnJywgZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5hcHBlbmQoZnJvbVN0cltuZXh0VmFsLmxlbmd0aCAtIDFdICsgY2gsIGZsYWdzKSldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRvU3RyW25leHRWYWwubGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIHJldHVybiBjaDtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb1ZhbGlkYXRlKCkge1xuICAgIGNvbnN0IHN0ciA9IHRoaXMudmFsdWU7XG4gICAgY29uc3QgZmlyc3ROb25aZXJvID0gc3RyLnNlYXJjaCgvW14wXS8pO1xuICAgIGlmIChmaXJzdE5vblplcm8gPT09IC0xICYmIHN0ci5sZW5ndGggPD0gdGhpcy5fbWF0Y2hGcm9tKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBbbWluc3RyLCBtYXhzdHJdID0gdGhpcy5ib3VuZGFyaWVzKHN0cik7XG4gICAgcmV0dXJuIHRoaXMuZnJvbSA8PSBOdW1iZXIobWF4c3RyKSAmJiBOdW1iZXIobWluc3RyKSA8PSB0aGlzLnRvICYmIHN1cGVyLmRvVmFsaWRhdGUoLi4uYXJndW1lbnRzKTtcbiAgfVxufVxuSU1hc2suTWFza2VkUmFuZ2UgPSBNYXNrZWRSYW5nZTtcblxuZXhwb3J0IHsgTWFza2VkUmFuZ2UgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IE1hc2tlZCBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuLi9jb3JlL3V0aWxzLmpzJztcblxuLyoqIE1hc2tpbmcgYnkgUmVnRXhwICovXG5jbGFzcyBNYXNrZWRSZWdFeHAgZXh0ZW5kcyBNYXNrZWQge1xuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgICBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAqL1xuICBfdXBkYXRlKG9wdHMpIHtcbiAgICBpZiAob3B0cy5tYXNrKSBvcHRzLnZhbGlkYXRlID0gdmFsdWUgPT4gdmFsdWUuc2VhcmNoKG9wdHMubWFzaykgPj0gMDtcbiAgICBzdXBlci5fdXBkYXRlKG9wdHMpO1xuICB9XG59XG5JTWFzay5NYXNrZWRSZWdFeHAgPSBNYXNrZWRSZWdFeHA7XG5cbmV4cG9ydCB7IE1hc2tlZFJlZ0V4cCBhcyBkZWZhdWx0IH07XG4iLCIvKiEganMtY29va2llIHYzLjAuNSB8IE1JVCAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5mdW5jdGlvbiBhc3NpZ24gKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldFxufVxuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG52YXIgZGVmYXVsdENvbnZlcnRlciA9IHtcbiAgcmVhZDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlWzBdID09PSAnXCInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEsIC0xKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyglW1xcZEEtRl17Mn0pKy9naSwgZGVjb2RlVVJJQ29tcG9uZW50KVxuICB9LFxuICB3cml0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkucmVwbGFjZShcbiAgICAgIC8lKDJbMzQ2QkZdfDNbQUMtRl18NDB8NVtCREVdfDYwfDdbQkNEXSkvZyxcbiAgICAgIGRlY29kZVVSSUNvbXBvbmVudFxuICAgIClcbiAgfVxufTtcbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuXG5mdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIsIGRlZmF1bHRBdHRyaWJ1dGVzKSB7XG4gIGZ1bmN0aW9uIHNldCAobmFtZSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgYXR0cmlidXRlcyA9IGFzc2lnbih7fSwgZGVmYXVsdEF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuXG4gICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG4gICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZTUpO1xuICAgIH1cbiAgICBpZiAoYXR0cmlidXRlcy5leHBpcmVzKSB7XG4gICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKTtcbiAgICB9XG5cbiAgICBuYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpXG4gICAgICAucmVwbGFjZSgvJSgyWzM0NkJdfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpXG4gICAgICAucmVwbGFjZSgvWygpXS9nLCBlc2NhcGUpO1xuXG4gICAgdmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuICAgIGZvciAodmFyIGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblxuICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gQ29uc2lkZXJzIFJGQyA2MjY1IHNlY3Rpb24gNS4yOlxuICAgICAgLy8gLi4uXG4gICAgICAvLyAzLiAgSWYgdGhlIHJlbWFpbmluZyB1bnBhcnNlZC1hdHRyaWJ1dGVzIGNvbnRhaW5zIGEgJXgzQiAoXCI7XCIpXG4gICAgICAvLyAgICAgY2hhcmFjdGVyOlxuICAgICAgLy8gQ29uc3VtZSB0aGUgY2hhcmFjdGVycyBvZiB0aGUgdW5wYXJzZWQtYXR0cmlidXRlcyB1cCB0byxcbiAgICAgIC8vIG5vdCBpbmNsdWRpbmcsIHRoZSBmaXJzdCAleDNCIChcIjtcIikgY2hhcmFjdGVyLlxuICAgICAgLy8gLi4uXG4gICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXS5zcGxpdCgnOycpWzBdO1xuICAgIH1cblxuICAgIHJldHVybiAoZG9jdW1lbnQuY29va2llID1cbiAgICAgIG5hbWUgKyAnPScgKyBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIG5hbWUpICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0IChuYW1lKSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgKGFyZ3VtZW50cy5sZW5ndGggJiYgIW5hbWUpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG4gICAgLy8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuXG4gICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcbiAgICB2YXIgamFyID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBmb3VuZCA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSk7XG4gICAgICAgIGphcltmb3VuZF0gPSBjb252ZXJ0ZXIucmVhZCh2YWx1ZSwgZm91bmQpO1xuXG4gICAgICAgIGlmIChuYW1lID09PSBmb3VuZCkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5hbWUgPyBqYXJbbmFtZV0gOiBqYXJcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgIHtcbiAgICAgIHNldCxcbiAgICAgIGdldCxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gKG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgc2V0KFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgJycsXG4gICAgICAgICAgYXNzaWduKHt9LCBhdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgICBleHBpcmVzOiAtMVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgd2l0aEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHJldHVybiBpbml0KHRoaXMuY29udmVydGVyLCBhc3NpZ24oe30sIHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcykpXG4gICAgICB9LFxuICAgICAgd2l0aENvbnZlcnRlcjogZnVuY3Rpb24gKGNvbnZlcnRlcikge1xuICAgICAgICByZXR1cm4gaW5pdChhc3NpZ24oe30sIHRoaXMuY29udmVydGVyLCBjb252ZXJ0ZXIpLCB0aGlzLmF0dHJpYnV0ZXMpXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBhdHRyaWJ1dGVzOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGRlZmF1bHRBdHRyaWJ1dGVzKSB9LFxuICAgICAgY29udmVydGVyOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGNvbnZlcnRlcikgfVxuICAgIH1cbiAgKVxufVxuXG52YXIgYXBpID0gaW5pdChkZWZhdWx0Q29udmVydGVyLCB7IHBhdGg6ICcvJyB9KTtcbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbmV4cG9ydCB7IGFwaSBhcyBkZWZhdWx0IH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qXG4gKiBAcGFja2FnZSAgICBOZXZpZ2VuIEpTaG9wIE9uZVN0ZXBDaGVja291dCBQYWNrYWdlXG4gKiBAdmVyc2lvbiAgICAxLjEuM1xuICogQGF1dGhvciAgICAgTmV2aWdlbi5jb20gLSBodHRwczovL25ldmlnZW4uY29tXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgwqkgTmV2aWdlbi5jb20uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBAbGljZW5zZSAgICBQcm9wcmlldGFyeS4gQ29weXJpZ2h0ZWQgQ29tbWVyY2lhbCBTb2Z0d2FyZVxuICogQGxpbmsgICAgICAgaHR0cHM6Ly9uZXZpZ2VuLmNvbVxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgQ29va2llcyBmcm9tICdqcy1jb29raWUnO1xuaW1wb3J0IElNYXNrIGZyb20gJ2ltYXNrJztcblxuY2xhc3MgTmV2aWdlbk9uZVN0ZXBDaGVja291dCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMub3B0aW9ucyA9IEpvb21sYS5nZXRPcHRpb25zKCduZXZpZ2VuX29uZXN0ZXBjaGVja291dCcpO1xuXHRcdHRoaXMuY29udHJvbGxlciA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY29udHJvbGxlciA/IHRoaXMub3B0aW9ucy5jb250cm9sbGVyIDogZmFsc2U7XG5cdFx0dGhpcy5jc3JmID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5jc3JmID8gdGhpcy5vcHRpb25zLmNzcmYgOiBmYWxzZTtcblx0XHR0aGlzLnVzZV9tYXNrID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy51c2VfbWFzayA/IHRoaXMub3B0aW9ucy51c2VfbWFzayA6IGZhbHNlO1xuXHRcdHRoaXMubWFzayA9IHRoaXMudXNlX21hc2sgJiYgdGhpcy5vcHRpb25zLm1hc2sgPyB0aGlzLm9wdGlvbnMubWFzayA6IGZhbHNlO1xuXHRcdHRoaXMucmFiYXR0ID0gZmFsc2U7XG5cdFx0dGhpcy5jb250YWluZXJDYXJ0RWRpdE1lZXNhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQ9XCJtZXNzYWdlXCJdJyk7XG5cdFx0aWYgKCF0aGlzLmNvbnRhaW5lckNhcnRFZGl0TWVlc2FnZSkge1xuXHRcdFx0dGhpcy5jb250YWluZXJDYXJ0RWRpdE1lZXNhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0PVwibWVzc2FnZVwiXScpO1xuXG5cdFx0fVxuXHRcdGlmICh0aGlzLm9wdGlvbnMudXNlciA9PT0gMCkge1xuXHRcdFx0dGhpcy5jb250YWluZXJMb2dpbk1lZXNhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1sb2dpbj1cIm1lc3NhZ2VcIl0nKTtcblx0XHRcdGlmICghdGhpcy5jb250YWluZXJMb2dpbk1lZXNhZ2UpIHtcblx0XHRcdFx0dGhpcy5jb250YWluZXJMb2dpbk1lZXNhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtbG9naW49XCJtZXNzYWdlXCJdJyk7XG5cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5mb3JtVmFsaWRhdGlvbk1lc3NhZ2UgPSAnJztcblx0XHR0aGlzLmZvcm1WYWxpZGF0aW9uID0gdHJ1ZTtcblx0fVxuXG5cdGxvYWRBY3Rpb25zKCkge1xuXHRcdGxldCBuZXZpZ2VuT25lU3RlcENoZWNrb3V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybVtuYW1lPVwibmV2aWdlbk9uZVN0ZXBDaGVja291dFwiXScpO1xuXHRcdGlmIChuZXZpZ2VuT25lU3RlcENoZWNrb3V0KSB7XG5cdFx0XHR0aGlzLnJhYmF0dCA9IG5ldmlnZW5PbmVTdGVwQ2hlY2tvdXQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInJhYmF0dFwiXScpO1xuXHRcdFx0bmV2aWdlbk9uZVN0ZXBDaGVja291dC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGlmIChkb2N1bWVudC5mb3JtdmFsaWRhdG9yLmlzVmFsaWQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybVtuYW1lPVwibmV2aWdlbk9uZVN0ZXBDaGVja291dFwiXScpKSkge1xuXHRcdFx0XHRcdGxldCBhZ2IgPSBuZXZpZ2VuT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJhZ2JcIl1bdHlwZT1cImNoZWNrYm94XCJdJyksXG5cdFx0XHRcdFx0XHRlcnJvciA9IGZhbHNlO1xuXHRcdFx0XHRcdGlmIChhZ2IpIHtcblx0XHRcdFx0XHRcdGlmICghYWdiLmNoZWNrZWQpIHtcblx0XHRcdFx0XHRcdFx0YWdiLmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbC1kYW5nZXInKTtcblx0XHRcdFx0XHRcdFx0YWdiLmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcblx0XHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0YWdiLmNsYXNzTGlzdC5yZW1vdmUoJ2Zvcm0tY29udHJvbC1kYW5nZXInKTtcblx0XHRcdFx0XHRcdFx0YWdiLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcblx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGV0IHBheW1lbnRWYWxpZCA9IHRydWU7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBqc2hvcCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdGRvY3VtZW50LmZvcm1zWydwYXltZW50X2Zvcm0nXSA9IGRvY3VtZW50LmZvcm1zWyduZXZpZ2VuT25lU3RlcENoZWNrb3V0J107XG5cdFx0XHRcdFx0XHRwYXltZW50VmFsaWQgPSBqc2hvcC5jaGVja1BheW1lbnRGb3JtKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGVycm9yID09PSBmYWxzZSAmJiBwYXltZW50VmFsaWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0UHJlbG9hZGVyKCk7XG5cdFx0XHRcdFx0XHRuZXZpZ2VuT25lU3RlcENoZWNrb3V0LnN1Ym1pdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9KTtcblx0XHRcdGxldCBhZGRyZXNzZXMgPSBuZXZpZ2VuT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0PVwiYWRkcmVzc1wiXScpO1xuXHRcdFx0aWYgKGFkZHJlc3Nlcykge1xuXHRcdFx0XHRsZXQgYWRkcmVzc0ZpZWxkcyA9IGFkZHJlc3Nlcy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgc2VsZWN0LHRleHRhcmVhJylcblx0XHRcdFx0aWYgKGFkZHJlc3NGaWVsZHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGFkZHJlc3NGaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcblx0XHRcdFx0XHRcdGxldCBuYW1lID0gZmllbGQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdFx0XHRpZiAobmFtZSkge1xuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy51c2VfbWFzayAmJiB0aGlzLm1hc2sgJiYgdGhpcy51c2VfbWFzay5pbmNsdWRlcyhuYW1lKSkge1xuXHRcdFx0XHRcdFx0XHRcdElNYXNrKGZpZWxkLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRtYXNrOiB0aGlzLm1hc2tcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zYXZlRm9ybURhdGEoJ2FkZHJlc3MnLCBmaWVsZCk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsZXQgcGF5bWVudE1ldGhvZHMgPSBuZXZpZ2VuT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0PVwicGF5bWVudFwiXScpO1xuXHRcdFx0aWYgKHBheW1lbnRNZXRob2RzKSB7XG5cdFx0XHRcdGxldCBwYXltZW50cyA9IHBheW1lbnRNZXRob2RzLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJwYXltZW50X21ldGhvZFwiXScpXG5cdFx0XHRcdGlmIChwYXltZW50cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0bGV0IHBheW1lbnRBY3RpdmUgPSBwYXltZW50TWV0aG9kcy5xdWVyeVNlbGVjdG9yKCdpbnB1dDpjaGVja2VkJyk7XG5cdFx0XHRcdFx0aWYgKHBheW1lbnRBY3RpdmUgJiYgcGF5bWVudEFjdGl2ZS52YWx1ZSkge1xuXHRcdFx0XHRcdFx0bGV0IHBhcmFtc1BheW1lbnQgPSBuZXZpZ2VuT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lKj1cInBhcmFtc1snICsgcGF5bWVudEFjdGl2ZS52YWx1ZSArICddXCJdJyk7XG5cdFx0XHRcdFx0XHRpZiAocGFyYW1zUGF5bWVudC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdHBhcmFtc1BheW1lbnQuZm9yRWFjaCgoZmllbGQpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRmaWVsZC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5zYXZlTWV0aG9kc1BhcmFtcygncGF5bWVudCcsIGZpZWxkKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBheW1lbnRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoZmllbGQuZ2V0QXR0cmlidXRlKCduYW1lJykpIHtcblx0XHRcdFx0XHRcdFx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNhdmVGb3JtRGF0YSgncGF5bWVudCcsIGZpZWxkKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxldCBzaGlwcGluZ01ldGhvZHMgPSBuZXZpZ2VuT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0PVwic2hpcHBpbmdcIl0nKTtcblx0XHRcdGlmIChzaGlwcGluZ01ldGhvZHMpIHtcblx0XHRcdFx0bGV0IHNoaXBwaW5nID0gc2hpcHBpbmdNZXRob2RzLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzaF9wcl9tZXRob2RfaWRcIl0nKVxuXHRcdFx0XHRpZiAoc2hpcHBpbmcubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGxldCBzaGlwcGluZ0FjdGl2ZSA9IHNoaXBwaW5nTWV0aG9kcy5xdWVyeVNlbGVjdG9yKCdpbnB1dDpjaGVja2VkJyk7XG5cdFx0XHRcdFx0aWYgKHNoaXBwaW5nQWN0aXZlICYmIHNoaXBwaW5nQWN0aXZlLnZhbHVlKSB7XG5cdFx0XHRcdFx0XHRsZXQgaWQgPSBzaGlwcGluZ0FjdGl2ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcHBpbmdfaWQnKTtcblx0XHRcdFx0XHRcdGlmIChpZCkge1xuXHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1zU2hpcHBpbmcgPSBuZXZpZ2VuT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lKj1cInBhcmFtc1snICsgaWQgKyAnXVwiXScpO1xuXHRcdFx0XHRcdFx0XHRpZiAocGFyYW1zU2hpcHBpbmcubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHBhcmFtc1NoaXBwaW5nLmZvckVhY2goKGZpZWxkKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmaWVsZC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnNhdmVNZXRob2RzUGFyYW1zKCdzaGlwcGluZycsIGZpZWxkKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNoaXBwaW5nLmZvckVhY2goKGZpZWxkKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoZmllbGQuZ2V0QXR0cmlidXRlKCduYW1lJykpIHtcblx0XHRcdFx0XHRcdFx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNhdmVGb3JtRGF0YSgnc2hpcHBpbmcnLCBmaWVsZCk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IHF1YW50aXR5SW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5LWlucHV0XSxpbnB1dFtkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eS1pbnB1dF0nKVxuXHRcdGlmIChxdWFudGl0eUlucHV0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRxdWFudGl0eUlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuXHRcdFx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRpbnB1dC52YWx1ZSA9IGlucHV0LnZhbHVlLnJlcGxhY2UoL1teLlxcZF0rL2csICcnKS5yZXBsYWNlKC9eKFteLl0qXFwuKXxcXC4vZywgJyQxJyk7XG5cdFx0XHRcdFx0bGV0IGtleSA9IGlucHV0LmdldEF0dHJpYnV0ZSgnbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5LWlucHV0Jyk7XG5cdFx0XHRcdFx0aWYgKCFrZXkpIGtleSA9IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcXVhbnRpdHktaW5wdXQnKTtcblx0XHRcdFx0XHRpZiAoa2V5KSB7XG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSBwYXJzZUludChpbnB1dC52YWx1ZSk7XG5cblx0XHRcdFx0XHRcdHRoaXMuY2FydEVkaXRDaGFuZ2VRdWFudGl0eShrZXksICh2YWx1ZSA8PSAwKSA/IDEgOiB2YWx1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRsZXQgcXVhbnRpdHlCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eV0sW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5XScpXG5cdFx0aWYgKHF1YW50aXR5QnV0dG9ucy5sZW5ndGggPiAwKSB7XG5cdFx0XHRxdWFudGl0eUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGxldCB0eXBlID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5Jyk7XG5cdFx0XHRcdFx0aWYgKCF0eXBlKSB0eXBlID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcXVhbnRpdHknKTtcblx0XHRcdFx0XHRpZiAodHlwZSkge1xuXHRcdFx0XHRcdFx0bGV0IGNvbnRhaW5lciA9IGJ1dHRvbi5jbG9zZXN0KCdbbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5LWNvbnRhaW5lcl0sW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5LWNvbnRhaW5lcl0nKTtcblx0XHRcdFx0XHRcdGlmIChjb250YWluZXIpIHtcblx0XHRcdFx0XHRcdFx0bGV0IGlucHV0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eS1pbnB1dF0saW5wdXRbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcXVhbnRpdHktaW5wdXRdJyksXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSBpbnB1dC52YWx1ZSxcblx0XHRcdFx0XHRcdFx0XHR1cGRhdGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSBwYXJzZUludCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGUgPT09ICcrJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5wdXQudmFsdWUgPSB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0XHRcdFx0XHR1cGRhdGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJy0nKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUgPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlucHV0LnZhbHVlID0gdmFsdWUgLSAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR1cGRhdGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdGlmICh1cGRhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7J2J1YmJsZXMnOiB0cnVlfSkpXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRzYXZlRm9ybURhdGEodHlwZSwgZmllbGQpIHtcblx0XHRpZiAoIXR5cGUgfHwgIWZpZWxkKSByZXR1cm47XG5cdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhLFxuXHRcdFx0cGF5bWVudCA9ICcnLFxuXHRcdFx0c2hpcHBpbmcgPSAnJyxcblx0XHRcdG5hbWUgPSBmaWVsZC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0XHRhamF4RGF0YS5zZXQoJ3R5cGUnLCB0eXBlKTtcblx0XHRhamF4RGF0YS5zZXQoJ3NhdmVmb3JtZGF0YVsnICsgbmFtZSArICddJywgZmllbGQudmFsdWUpO1xuXHRcdGlmICh0eXBlID09PSAncGF5bWVudCcpIHtcblx0XHRcdHBheW1lbnQgPSBmaWVsZC5jbG9zZXN0KCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1wYXltZW50PVwiJyArIGZpZWxkLnZhbHVlICsgJ1wiXScpO1xuXHRcdFx0aWYgKHBheW1lbnQpIHtcblx0XHRcdFx0bGV0IGZpZWxkcyA9IHBheW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW25hbWUqPVwicGFyYW1zWycgKyBmaWVsZC52YWx1ZSArICdcIl0nKTtcblx0XHRcdFx0aWYgKGZpZWxkcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZmllbGRzLmZvckVhY2goKHBhcmFtKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgbmFtZVBhcmFtID0gcGFyYW0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdFx0XHRuYW1lUGFyYW0gPSBuYW1lUGFyYW0ucmVwbGFjZSgncGFyYW1zJywgJ1twYXJhbXNdJyk7XG5cdFx0XHRcdFx0XHRhamF4RGF0YS5zZXQoJ3NhdmVmb3JtZGF0YScgKyBuYW1lUGFyYW0sIHBhcmFtLnZhbHVlKTtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnc2hpcHBpbmcnKSB7XG5cdFx0XHRzaGlwcGluZyA9IGZpZWxkLmNsb3Nlc3QoJ1tkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LXNoaXBwaW5nPVwiJyArIGZpZWxkLnZhbHVlICsgJ1wiXScpO1xuXHRcdFx0aWYgKHNoaXBwaW5nKSB7XG5cdFx0XHRcdGxldCBmaWVsZHMgPSBzaGlwcGluZy5xdWVyeVNlbGVjdG9yQWxsKCdbbmFtZSo9XCJwYXJhbXNbJyArIGZpZWxkLnZhbHVlICsgJ1wiXScpO1xuXHRcdFx0XHRpZiAoZmllbGRzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRmaWVsZHMuZm9yRWFjaCgocGFyYW0pID0+IHtcblx0XHRcdFx0XHRcdGxldCBuYW1lUGFyYW0gPSBwYXJhbS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0XHRcdFx0XHRcdG5hbWVQYXJhbSA9IG5hbWVQYXJhbS5yZXBsYWNlKCdwYXJhbXMnLCAnW3BhcmFtc10nKTtcblx0XHRcdFx0XHRcdGFqYXhEYXRhLnNldCgnc2F2ZWZvcm1kYXRhJyArIG5hbWVQYXJhbSwgcGFyYW0udmFsdWUpO1xuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5zZW5kQWpheCgncG9zdCcsICdzYXZlRm9ybURhdGEnLCBhamF4RGF0YSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdGlmICh0eXBlID09PSAnYWRkcmVzcycgJiYgcmVzcG9uc2UuZGF0YS5yZWxvYWQpIHtcblx0XHRcdFx0dGhpcy5yZWxvYWRTY3JvbGxQYWdlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZSA9PT0gJ3BheW1lbnQnIHx8IHR5cGUgPT09ICdzaGlwcGluZycpIHtcblx0XHRcdFx0dGhpcy5yZWxvYWRTY3JvbGxQYWdlKCk7XG5cdFx0XHR9XG5cblxuXHRcdH0pLmNhdGNoKChlcnJvcikgPT4ge1xuXHRcdFx0dGhpcy5zZXRNZXNzYWdlKCdlcnJvcicsIGVycm9yLm1lc3NhZ2UpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2F2ZU1ldGhvZHNQYXJhbXModHlwZSwgZWxlbWVudCwgcmVsb2FkKSB7XG5cdFx0aWYgKCF0eXBlIHx8ICFlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhLFxuXHRcdFx0bmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0YWpheERhdGEuc2V0KCd0eXBlJywgdHlwZSk7XG5cdFx0YWpheERhdGEuc2V0KG5hbWUsIGVsZW1lbnQudmFsdWUpO1xuXHRcdHRoaXMuc2VuZEFqYXgoJ3Bvc3QnLCAnc2F2ZU1ldGhvZHNQYXJhbXMnLCBhamF4RGF0YSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdGlmIChyZWxvYWQpIHtcblx0XHRcdFx0dGhpcy5yZWxvYWRTY3JvbGxQYWdlKCk7XG5cdFx0XHR9XG5cdFx0XHRsZXQgbWF0Y2hlcyA9IG5hbWUubWF0Y2goLyg/PD1cXFspLio/KD89XFxdKS9nKSxcblx0XHRcdFx0aWQgPSAwO1xuXHRcdFx0aWYgKG1hdGNoZXMgJiYgbWF0Y2hlc1sxXSkge1xuXHRcdFx0XHRpZCA9IG1hdGNoZXNbMF07XG5cdFx0XHRcdG5hbWUgPSBtYXRjaGVzWzFdO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy50cmlnZ2VyRXZlbnQoJ25ldmlnZW5PbmVTdGVwQ2hlY2tvdXRBZnRlclNhdmVNZXRob2RzUGFyYW1zJywge1xuXHRcdFx0XHRlbGVtZW50OiBlbGVtZW50LFxuXHRcdFx0XHRuYW1lOiBuYW1lLFxuXHRcdFx0XHRpZDogaWRcblx0XHRcdH0pO1xuXG5cdFx0fSkuY2F0Y2goKGVycm9yKSA9PiB7XG5cdFx0XHR0aGlzLnNldE1lc3NhZ2UoJ2Vycm9yJywgZXJyb3IubWVzc2FnZSwgdGhpcy5jb250YWluZXJMb2dpbk1lZXNhZ2UpXG5cdFx0fSk7XG5cdH1cblxuXHRjYXJ0RWRpdENoYW5nZVF1YW50aXR5KGtleSwgcXVhbnRpdHkpIHtcblx0XHRsZXQgYWpheERhdGEgPSBuZXcgRm9ybURhdGE7XG5cdFx0YWpheERhdGEuc2V0KCdwcm9kdWN0X2lkJywga2V5KTtcblx0XHRhamF4RGF0YS5zZXQoJ3F1YW50aXR5JywgcXVhbnRpdHkpO1xuXHRcdHRoaXMuc2VuZEFqYXgoJ3Bvc3QnLCAnY2FydENoYW5nZVF1YW50aXR5QWpheCcsIGFqYXhEYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEpIHtcblx0XHRcdFx0bGV0IGNhcnRQcmljZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1wcm9kdWN0LXByaWNlPVwiJyArIGtleSArICdcIl0sW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXByb2R1Y3QtcHJpY2U9XCInICsga2V5ICsgJ1wiXScpO1xuXHRcdFx0XHRpZiAoY2FydFByaWNlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRjYXJ0UHJpY2UuZm9yRWFjaCgoY2FydFByaWNlKSA9PiB7XG5cdFx0XHRcdFx0XHRjYXJ0UHJpY2UuaW5uZXJIVE1MID0gcmVzcG9uc2UuZGF0YS5wcmljZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgY2FydFN1bSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1wcm9kdWN0LXN1bT1cIicgKyBrZXkgKyAnXCJdLFtkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1wcm9kdWN0LXN1bT1cIicgKyBrZXkgKyAnXCJdJyk7XG5cdFx0XHRcdGlmIChjYXJ0U3VtLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRjYXJ0U3VtLmZvckVhY2goKHByb2R1Y3RTdW0pID0+IHtcblx0XHRcdFx0XHRcdHByb2R1Y3RTdW0uaW5uZXJIVE1MID0gcmVzcG9uc2UuZGF0YS5zdW07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jYXJ0RWRpdFVwZGF0ZVRvdGFsKHJlc3BvbnNlLmRhdGEuY2FydCk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0dGhpcy5zZXRNZXNzYWdlKCdlcnJvcicsIGVycm9yLm1lc3NhZ2UsIHRoaXMuY29udGFpbmVyQ2FydEVkaXRNZWVzYWdlKVxuXHRcdH0pO1xuXHR9XG5cblx0Y2FydEVkaXRSZW1vdmVQcm9kdWN0KHByb2R1Y3RfaWQpIHtcblx0XHRsZXQgYWpheERhdGEgPSBuZXcgRm9ybURhdGE7XG5cdFx0YWpheERhdGEuc2V0KCdwcm9kdWN0X2lkJywgcHJvZHVjdF9pZCk7XG5cdFx0dGhpcy5zZW5kQWpheCgncG9zdCcsICdjYXJ0UmVtb3ZlUHJvZHVjdEFqYXgnLCBhamF4RGF0YSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdGlmIChyZXNwb25zZS5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGEgJiYgQXJyYXkuaXNBcnJheShyZXNwb25zZS5kYXRhLnByb2R1Y3RzKSkge1xuXHRcdFx0XHRsZXQgcHJvZHVjdHNGcm9tU2VydmVyID0gcmVzcG9uc2UuZGF0YS5wcm9kdWN0cztcblxuXHRcdFx0XHRsZXQgcHJvZHVjdHNDYXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcblx0XHRcdFx0XHQnW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdD1cInByb2R1Y3RzXCJdLFtkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdD1cInByb2R1Y3RzXCJdJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChwcm9kdWN0c0NhcnQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHByb2R1Y3RzQ2FydC5mb3JFYWNoKChwcm9kdWN0c0Jsb2NrKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgcHJvZHVjdHMgPSBwcm9kdWN0c0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoXG5cdFx0XHRcdFx0XHRcdCdbbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0PVwicHJvZHVjdFwiXSxbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQ9XCJwcm9kdWN0XCJdJ1xuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0aWYgKHByb2R1Y3RzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0cHJvZHVjdHMuZm9yRWFjaCgocHJvZHVjdCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGxldCBrZXkgPSBwcm9kdWN0LmdldEF0dHJpYnV0ZSgnZGF0YS1rZXknKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdGtleSA9IHBhcnNlSW50KGtleSwgMTApO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghcHJvZHVjdHNGcm9tU2VydmVyLmluY2x1ZGVzKGtleSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb2R1Y3QucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChwcm9kdWN0c0Zyb21TZXJ2ZXIubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0bGV0IGNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcblx0XHRcdFx0XHRcdCdbbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0PVwiY2xvc2VcIl0sW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0PVwiY2xvc2VcIl0nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGlmIChjbG9zZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRjbG9zZS5mb3JFYWNoKChidXR0b24pID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGJ1dHRvbikge1xuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbi5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2xpY2snLCB7YnViYmxlczogdHJ1ZX0pKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHR0aGlzLnNldE1lc3NhZ2UoJ2Vycm9yJywgZXJyb3IubWVzc2FnZSwgdGhpcy5jb250YWluZXJDYXJ0RWRpdE1lZXNhZ2UpO1xuXHRcdH0pO1xuXHR9XG5cblx0Y2FydEVkaXRVcGRhdGVUb3RhbChzdW0pIHtcblx0XHRpZiAoc3VtKSB7XG5cdFx0XHRsZXQgdG90YWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0PVwidG90YWxcIl0sW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdD1cInRvdGFsXCJdJylcblx0XHRcdGlmICh0b3RhbHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR0b3RhbHMuZm9yRWFjaCgodG90YWwpID0+IHtcblx0XHRcdFx0XHR0b3RhbC5pbm5lckhUTUwgPSBzdW07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNhcnRSYWJiYXQoKSB7XG5cdFx0aWYgKHRoaXMucmFiYXR0ICYmIHRoaXMucmFiYXR0LnZhbHVlKSB7XG5cdFx0XHRsZXQgYWpheERhdGEgPSBuZXcgRm9ybURhdGE7XG5cdFx0XHRhamF4RGF0YS5zZXQoJ3JhYmF0dCcsIHRoaXMucmFiYXR0LnZhbHVlKTtcblx0XHRcdHRoaXMuc2VuZEFqYXgoJ3Bvc3QnLCAncmFiYXR0QWpheCcsIGFqYXhEYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHR0aGlzLnJlbG9hZFNjcm9sbFBhZ2UoKTtcblx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0dGhpcy5zZXRNZXNzYWdlKCdlcnJvcicsIGVycm9yLm1lc3NhZ2UpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRkaXNhYmxlUmFiYmF0KCkge1xuXHRcdGxldCBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YTtcblx0XHRhamF4RGF0YS5zZXQoJ2Rpc2FibGVkJywgMSk7XG5cdFx0dGhpcy5zZW5kQWpheCgncG9zdCcsICdkaXNhYmxlUmFiYmF0QWpheCcsIGFqYXhEYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0dGhpcy5yZWxvYWRTY3JvbGxQYWdlKCk7XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0dGhpcy5zZXRNZXNzYWdlKCdlcnJvcicsIGVycm9yLm1lc3NhZ2UpXG5cdFx0fSk7XG5cdH1cblxuXHRzZXROZXZpZ2VuQm9udXNlc0NhcnRQb2ludHMocG9pbnRzX3N1YiA9IG51bGwpIHtcblx0XHRpZiAocG9pbnRzX3N1YiA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgYWpheERhdGEgPSBuZXcgRm9ybURhdGE7XG5cdFx0YWpheERhdGEuc2V0KCdwb2ludHNfc3ViJywgcG9pbnRzX3N1Yik7XG5cdFx0dGhpcy5zZW5kQWpheCgncG9zdCcsICdzZXROZXZpZ2VuQm9udXNlc0NhcnRQb2ludHNBamF4JywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHR0aGlzLnJlbG9hZFNjcm9sbFBhZ2UoKTtcblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHR0aGlzLnNldE1lc3NhZ2UoJ2Vycm9yJywgZXJyb3IubWVzc2FnZSlcblx0XHR9KTtcblx0fVxuXG5cdGxvZ2luKCkge1xuXHRcdGlmICh0aGlzLm9wdGlvbnMudXNlciA9PT0gMCkge1xuXHRcdFx0bGV0IGZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lXj1cIm5ldmlnZW5vbmVzdGVwY2hlY2tvdXRsb2dpblwiXScpLFxuXHRcdFx0XHR2YWxpZCA9IHRydWU7XG5cdFx0XHRpZiAoZmllbGRzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdFx0XHRmaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcblx0XHRcdFx0XHRpZiAoZmllbGQudmFsdWUgPT09ICcnKSB7XG5cdFx0XHRcdFx0XHRmaWVsZC5jbGFzc0xpc3QuYWRkKCdpcy1pbnZhbGlkJyk7XG5cdFx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoZmllbGQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGZpZWxkLmNoZWNrZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRhamF4RGF0YS5zZXQoZmllbGQuZ2V0QXR0cmlidXRlKCduYW1lJyksIGZpZWxkLnZhbHVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0YWpheERhdGEuc2V0KGZpZWxkLmdldEF0dHJpYnV0ZSgnbmFtZScpLCBmaWVsZC52YWx1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGZpZWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWludmFsaWQnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXJFdmVudCgnbmV2aWdlbk9uZVN0ZXBDaGVja291dExvZ2luRm9ybVZhbGlkRmllbGQnLCBmaWVsZCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmICh2YWxpZCkge1xuXHRcdFx0XHRcdHRoaXMuc2VuZEFqYXgoJ3Bvc3QnLCAnbG9naW5BamF4JywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbG9hZFNjcm9sbFBhZ2UoKTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldE1lc3NhZ2UoJ2Vycm9yJywgZXJyb3IubWVzc2FnZSwgdGhpcy5jb250YWluZXJMb2dpbk1lZXNhZ2UpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRzZW5kQWpheChtZXRob2RBamF4LCBtZXRob2QsIGFqYXhEYXRhKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGlmICghYWpheERhdGEgfHwgIW1ldGhvZEFqYXggfHwgIW1ldGhvZCkge1xuXHRcdFx0XHRyZWplY3QoJ0Vycm9yIGFqYXggZGF0YScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5jc3JmKSB7XG5cdFx0XHRcdGFqYXhEYXRhLnNldCh0aGlzLmNzcmYsIDEpXG5cdFx0XHR9XG5cdFx0XHRhamF4RGF0YS5zZXQoJ3Rhc2snLCBtZXRob2QpO1xuXHRcdFx0Sm9vbWxhLnJlcXVlc3Qoe1xuXHRcdFx0XHR1cmw6IHRoaXMuY29udHJvbGxlcixcblx0XHRcdFx0bWV0aG9kOiBtZXRob2RBamF4LFxuXHRcdFx0XHRkYXRhOiBhamF4RGF0YSxcblx0XHRcdFx0b25TdWNjZXNzOiByZXNwID0+IHtcblx0XHRcdFx0XHRsZXQgcmVzcG9uc2U7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwKTtcblx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gcGFyc2UgSlNPTicpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdWNjZXNzID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVqZWN0KHJlc3BvbnNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uRXJyb3I6IHJlc3AgPT4ge1xuXHRcdFx0XHRcdGxldCByZXNwb25zZTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3AucmVzcG9uc2UpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBKU09OJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVqZWN0KHJlc3BvbnNlKTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KVxuXHR9XG5cblx0c2V0TWVzc2FnZSh0eXBlLCBtZXNzYWdlLCBjb250YWluZXIpIHtcblx0XHRpZiAoIXR5cGUgfHwgIW1lc3NhZ2UpIHJldHVybjtcblx0XHRKb29tbGEucmVtb3ZlTWVzc2FnZXMoY29udGFpbmVyKTtcblx0XHRKb29tbGEucmVuZGVyTWVzc2FnZXMoe1xuXHRcdFx0W3R5cGVdOiBbbWVzc2FnZV1cblx0XHR9LCBjb250YWluZXIpO1xuXHR9XG5cblx0cmVsb2FkU2Nyb2xsUGFnZShuZWVkU2Nyb2xsKSB7XG5cdFx0aWYgKG5lZWRTY3JvbGwpIHtcblx0XHRcdGxldCBzY3JvbGwgPSBDb29raWVzLmdldCgnbmV2aWdlbl9vbmVzdGVwY2hlY2tvdXRfc2Nyb2xsJyk7XG5cdFx0XHRpZiAoc2Nyb2xsKSB7XG5cdFx0XHRcdHdpbmRvdy5zY3JvbGwoMCwgc2Nyb2xsKTtcblx0XHRcdFx0Q29va2llcy5yZW1vdmUoJ25ldmlnZW5fb25lc3RlcGNoZWNrb3V0X3Njcm9sbCcpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnNldFByZWxvYWRlcigpO1xuXHRcdFx0aWYgKHdpbmRvdy5zY3JvbGxZKSB7XG5cdFx0XHRcdENvb2tpZXMuc2V0KCduZXZpZ2VuX29uZXN0ZXBjaGVja291dF9zY3JvbGwnLCB3aW5kb3cuc2Nyb2xsWSlcblx0XHRcdH1cblxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0fVxuXG5cdH1cblxuXHRzZXRQcmVsb2FkZXIoKSB7XG5cdFx0bGV0IHByZWxvYWRlclNvdXJjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0PVwicHJlbG9hZGVyXCJdJyk7XG5cdFx0aWYgKCFwcmVsb2FkZXJTb3VyY2UpIHtcblx0XHRcdHByZWxvYWRlclNvdXJjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuZXZpZ2VuLW9uZXN0ZXBjaGVja291dD1cInByZWxvYWRlclwiXScpO1xuXHRcdH1cblx0XHRpZiAocHJlbG9hZGVyU291cmNlKSB7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHByZWxvYWRlclNvdXJjZSk7XG5cdFx0XHRwcmVsb2FkZXJTb3VyY2Uuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdH1cblx0fVxuXG5cdHRyaWdnZXJFdmVudChuYW1lLCBkYXRhLCBlbGVtZW50KSB7XG5cdFx0aWYgKCFuYW1lIHx8ICFkYXRhKSByZXR1cm47XG5cblx0XHRpZiAobmFtZSkge1xuXHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQobmFtZSwge1xuXHRcdFx0XHRkZXRhaWw6IGRhdGFcblx0XHRcdH0pKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTmV2aWdlbk9uZVN0ZXBDaGVja291dDtcblxud2luZG93Lk5ldmlnZW5PbmVTdGVwQ2hlY2tvdXRDbGFzcyA9IG51bGw7XG5cbndpbmRvdy5OZXZpZ2VuT25lU3RlcENoZWNrb3V0ID0gKCkgPT4ge1xuXHRpZiAod2luZG93Lk5ldmlnZW5PbmVTdGVwQ2hlY2tvdXRDbGFzcyA9PT0gbnVsbCkge1xuXHRcdHdpbmRvdy5OZXZpZ2VuT25lU3RlcENoZWNrb3V0Q2xhc3MgPSBuZXcgTmV2aWdlbk9uZVN0ZXBDaGVja291dCgpO1xuXHR9XG5cdHJldHVybiB3aW5kb3cuTmV2aWdlbk9uZVN0ZXBDaGVja291dENsYXNzO1xufTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0d2luZG93Lk5ldmlnZW5PbmVTdGVwQ2hlY2tvdXQoKS5sb2FkQWN0aW9ucygpO1xuXHRsZXQgcG9pbnRzX3N1YiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJwb2ludHNfc3ViXCJdJyk7XG5cdGlmIChwb2ludHNfc3ViKSB7XG5cdFx0cG9pbnRzX3N1Yi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0bGV0IHZhbHVlID0gcG9pbnRzX3N1Yi52YWx1ZTtcblx0XHRcdGlmIChwb2ludHNfc3ViLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG5cdFx0XHRcdGlmIChwb2ludHNfc3ViLmNoZWNrZWQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSAnMCc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHdpbmRvdy5OZXZpZ2VuT25lU3RlcENoZWNrb3V0KCkuc2V0TmV2aWdlbkJvbnVzZXNDYXJ0UG9pbnRzKHZhbHVlKVxuXHRcdH0pO1xuXHRcdGlmIChwb2ludHNfc3ViLmdldEF0dHJpYnV0ZSgndHlwZScpICE9PSAnY2hlY2tib3gnKSB7XG5cdFx0XHRwb2ludHNfc3ViLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcblx0XHRcdFx0bGV0IHZhbHVlID0gcG9pbnRzX3N1Yi52YWx1ZTtcblxuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teMC05LC5dL2csIFwiXCIpO1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLywvZywgJy4nKTtcblxuXHRcdFx0XHRwb2ludHNfc3ViLnZhbHVlID0gdmFsdWU7XG5cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufSk7XG4iXSwibmFtZXMiOlsiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UiLCJzb3VyY2UiLCJleGNsdWRlZCIsInRhcmdldCIsInNvdXJjZUtleXMiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiaSIsImxlbmd0aCIsImluZGV4T2YiLCJfIiwiSFRNTE1hc2tFbGVtZW50IiwiSU1hc2siLCJIVE1MQ29udGVudGVkaXRhYmxlTWFza0VsZW1lbnQiLCJfdW5zYWZlU2VsZWN0aW9uU3RhcnQiLCJyb290Iiwicm9vdEVsZW1lbnQiLCJzZWxlY3Rpb24iLCJnZXRTZWxlY3Rpb24iLCJhbmNob3JPZmZzZXQiLCJmb2N1c09mZnNldCIsIl91bnNhZmVTZWxlY3Rpb25FbmQiLCJfdW5zYWZlU2VsZWN0Iiwic3RhcnQiLCJlbmQiLCJjcmVhdGVSYW5nZSIsInJhbmdlIiwic2V0U3RhcnQiLCJpbnB1dCIsImZpcnN0Q2hpbGQiLCJzZXRFbmQiLCJsYXN0Q2hpbGQiLCJyZW1vdmVBbGxSYW5nZXMiLCJhZGRSYW5nZSIsInZhbHVlIiwidGV4dENvbnRlbnQiLCJkZWZhdWx0IiwiTWFza0VsZW1lbnQiLCJjb25zdHJ1Y3RvciIsIl9oYW5kbGVycyIsIl90aGlzJGlucHV0JGdldFJvb3RObyIsIl90aGlzJGlucHV0JGdldFJvb3RObzIiLCJfdGhpcyRpbnB1dCIsImdldFJvb3ROb2RlIiwiY2FsbCIsImRvY3VtZW50IiwiaXNBY3RpdmUiLCJhY3RpdmVFbGVtZW50Iiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25FbmQiLCJzZXRTZWxlY3Rpb25SYW5nZSIsImJpbmRFdmVudHMiLCJoYW5kbGVycyIsImZvckVhY2giLCJldmVudCIsIl90b2dnbGVFdmVudEhhbmRsZXIiLCJFVkVOVFNfTUFQIiwidW5iaW5kRXZlbnRzIiwiaGFuZGxlciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwic2VsZWN0aW9uQ2hhbmdlIiwiZHJvcCIsImNsaWNrIiwiZm9jdXMiLCJjb21taXQiLCJvYmplY3RJbmNsdWRlcyIsIkRJUkVDVElPTiIsIkFjdGlvbkRldGFpbHMiLCJjcmVhdGVNYXNrIiwibWFza2VkQ2xhc3MiLCJfZXhjbHVkZWQiLCJJbnB1dE1hc2siLCJlbCIsIm9wdHMiLCJpc0NvbnRlbnRFZGl0YWJsZSIsInRhZ05hbWUiLCJtYXNrZWQiLCJfbGlzdGVuZXJzIiwiX3ZhbHVlIiwiX3VubWFza2VkVmFsdWUiLCJfc2F2ZVNlbGVjdGlvbiIsImJpbmQiLCJfb25JbnB1dCIsIl9vbkNoYW5nZSIsIl9vbkRyb3AiLCJfb25Gb2N1cyIsIl9vbkNsaWNrIiwiYWxpZ25DdXJzb3IiLCJhbGlnbkN1cnNvckZyaWVuZGx5IiwiX2JpbmRFdmVudHMiLCJ1cGRhdGVWYWx1ZSIsIm1hc2siLCJtYXNrRXF1YWxzIiwiX3RoaXMkbWFza2VkIiwiTWFza2VkIiwidXBkYXRlT3B0aW9ucyIsInVubWFza2VkVmFsdWUiLCJzdHIiLCJ1cGRhdGVDb250cm9sIiwidHlwZWRWYWx1ZSIsInZhbCIsInR5cGVkVmFsdWVFcXVhbHMiLCJkaXNwbGF5VmFsdWUiLCJfdW5iaW5kRXZlbnRzIiwiX2ZpcmVFdmVudCIsImV2IiwiX2xlbiIsImFyZ3VtZW50cyIsImFyZ3MiLCJBcnJheSIsIl9rZXkiLCJsaXN0ZW5lcnMiLCJsIiwiX2N1cnNvckNoYW5naW5nIiwiX2NoYW5naW5nQ3Vyc29yUG9zIiwiY3Vyc29yUG9zIiwicG9zIiwic2VsZWN0IiwiY29uc29sZSIsIndhcm4iLCJfc2VsZWN0aW9uIiwibmV3VW5tYXNrZWRWYWx1ZSIsIm5ld1ZhbHVlIiwibmV3RGlzcGxheVZhbHVlIiwiaXNDaGFuZ2VkIiwiX2ZpcmVDaGFuZ2VFdmVudHMiLCJyZXN0T3B0cyIsInVwZGF0ZU1hc2siLCJ1cGRhdGVPcHRzIiwidXBkYXRlQ3Vyc29yIiwiX2RlbGF5VXBkYXRlQ3Vyc29yIiwiX2Fib3J0VXBkYXRlQ3Vyc29yIiwic2V0VGltZW91dCIsIl9pbnB1dEV2ZW50IiwiaXNDb21wbGV0ZSIsImNsZWFyVGltZW91dCIsIm5lYXJlc3RJbnB1dFBvcyIsIkxFRlQiLCJvbiIsInB1c2giLCJvZmYiLCJoSW5kZXgiLCJzcGxpY2UiLCJlIiwiZGV0YWlscyIsIm9sZFJhd1ZhbHVlIiwicmF3SW5wdXRWYWx1ZSIsIm9mZnNldCIsInN0YXJ0Q2hhbmdlUG9zIiwicmVtb3ZlZCIsImluc2VydGVkIiwicmVtb3ZlRGlyZWN0aW9uIiwicmF3IiwiTk9ORSIsImRvQ29tbWl0IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJkZXN0cm95Iiwib2xkVmFsdWUiLCJvbGRTZWxlY3Rpb24iLCJzbGljZSIsIk1hdGgiLCJtaW4iLCJpbnNlcnRlZENvdW50Iiwic3Vic3RyIiwicmVtb3ZlZENvdW50IiwibWF4IiwiaGVhZCIsInN1YnN0cmluZyIsInRhaWwiLCJSSUdIVCIsIkNoYW5nZURldGFpbHMiLCJhc3NpZ24iLCJyYXdJbnNlcnRlZCIsInNraXAiLCJ0YWlsU2hpZnQiLCJhZ2dyZWdhdGUiLCJDb250aW51b3VzVGFpbERldGFpbHMiLCJ1bmRlZmluZWQiLCJmcm9tIiwic3RvcCIsInRvU3RyaW5nIiwiZXh0ZW5kIiwiU3RyaW5nIiwiYXBwZW5kVG8iLCJhcHBlbmQiLCJfYXBwZW5kUGxhY2Vob2xkZXIiLCJzdGF0ZSIsInVuc2hpZnQiLCJiZWZvcmVQb3MiLCJzaGlmdENoYXIiLCJzaGlmdCIsImlzU3RyaW5nIiwiRk9SQ0VfTEVGVCIsIkZPUkNFX1JJR0hUIiwiaW5kZXhJbkRpcmVjdGlvbiIsImRpcmVjdGlvbiIsInBvc0luRGlyZWN0aW9uIiwiZm9yY2VEaXJlY3Rpb24iLCJlc2NhcGVSZWdFeHAiLCJyZXBsYWNlIiwibm9ybWFsaXplUHJlcGFyZSIsInByZXAiLCJpc0FycmF5IiwiYiIsImEiLCJhcnJBIiwiYXJyQiIsImRhdGVBIiwiRGF0ZSIsImRhdGVCIiwiZ2V0VGltZSIsInJlZ2V4cEEiLCJSZWdFeHAiLCJyZWdleHBCIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJNYXNrZWRQYXR0ZXJuIiwiTWFza2VkRW51bSIsIk1hc2tlZFJhbmdlIiwiTWFza2VkTnVtYmVyIiwiTWFza2VkRGF0ZSIsIk1hc2tlZFJlZ0V4cCIsIk1hc2tlZEZ1bmN0aW9uIiwiTWFza2VkRHluYW1pYyIsIlBJUEVfVFlQRSIsImNyZWF0ZVBpcGUiLCJwaXBlIiwiZ2xvYmFsVGhpcyIsIl91cGRhdGUiLCJERUZBVUxUUyIsImlzSW5pdGlhbGl6ZWQiLCJ3aXRoVmFsdWVSZWZyZXNoIiwicmVzZXQiLCJyZXNvbHZlIiwiZG9QYXJzZSIsImRvRm9ybWF0IiwiZXh0cmFjdElucHV0IiwiaXNGaWxsZWQiLCJ0b3RhbElucHV0UG9zaXRpb25zIiwiZnJvbVBvcyIsInRvUG9zIiwiZXh0cmFjdFRhaWwiLCJhcHBlbmRUYWlsIiwiX2FwcGVuZENoYXJSYXciLCJjaCIsIl9hcHBlbmRDaGFyIiwiZmxhZ3MiLCJjaGVja1RhaWwiLCJjb25zaXN0ZW50U3RhdGUiLCJkb1ByZXBhcmUiLCJjb25zaXN0ZW50VGFpbCIsImFwcGVuZGVkIiwiZG9WYWxpZGF0ZSIsImJlZm9yZVRhaWxTdGF0ZSIsIm92ZXJ3cml0ZSIsInRhaWxEZXRhaWxzIiwiX2FwcGVuZEVhZ2VyIiwiRXJyb3IiLCJfYmVmb3JlVGFpbFN0YXRlIiwiY2kiLCJkIiwiZG9Ta2lwSW52YWxpZCIsImVhZ2VyIiwicmVtb3ZlIiwiZm4iLCJfcmVmcmVzaGluZyIsInJhd0lucHV0IiwicmV0IiwicnVuSXNvbGF0ZWQiLCJfaXNvbGF0ZWQiLCJza2lwSW52YWxpZCIsInByZXBhcmUiLCJ2YWxpZGF0ZSIsInBhcmVudCIsImZvcm1hdCIsInBhcnNlIiwiZGVsZXRlQ291bnQiLCJ0YWlsUG9zIiwiZWFnZXJSZW1vdmUiLCJ2YWxMZW5ndGgiLCJ0dmFsIiwiRU1QVFlfVkFMVUVTIiwiaW5jbHVkZXMiLCJ2IiwicGF0dGVybiIsImJsb2NrcyIsIkdFVF9ERUZBVUxUX0JMT0NLUyIsIlkiLCJnZXRGdWxsWWVhciIsInRvIiwibSIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImJrIiwiYXV0b2ZpeCIsImRhdGUiLCJpc0RhdGVFeGlzdCIsImRheSIsInBhZFN0YXJ0IiwibW9udGgiLCJ5ZWFyIiwiam9pbiIsInNwbGl0IiwibWF4TGVuZ3RoIiwiX2V4Y2x1ZGVkMiIsImN1cnJlbnRNYXNrIiwiY29tcGlsZWRNYXNrcyIsIm1hcCIsIl9hcHBseURpc3BhdGNoIiwiY3VycmVudE1hc2tGbGFncyIsInByZXZWYWx1ZUJlZm9yZVRhaWwiLCJpbnB1dFZhbHVlIiwiaW5zZXJ0VmFsdWUiLCJfcmF3SW5wdXRWYWx1ZSIsInRhaWxWYWx1ZSIsInByZXZNYXNrIiwicHJldk1hc2tTdGF0ZSIsImRvRGlzcGF0Y2giLCJfZmxhZ3MkX2JlZm9yZVRhaWxTdGEiLCJfZmxhZ3MkX2JlZm9yZVRhaWxTdGEyIiwiY3VycmVudE1hc2tSZWYiLCJkaXNwYXRjaCIsInMiLCJjdXJyZW50RGV0YWlscyIsIl90aGlzJGN1cnJlbnRNYXNrIiwiX3RoaXMkY3VycmVudE1hc2syIiwiQm9vbGVhbiIsIl90aGlzJGN1cnJlbnRNYXNrMyIsIl90aGlzJGN1cnJlbnRNYXNrNCIsIm1hc2tlZFN0YXRlIiwibWkiLCJldmVyeSIsIl9tYXNrJG1pIiwib2xkTWFzayIsIl90aGlzJGN1cnJlbnRNYXNrNSIsImlucHV0cyIsImluZGV4IiwiaXNDdXJyZW50Iiwic3RhcnRJbnB1dFBvcyIsIndlaWdodCIsInNvcnQiLCJpMSIsImkyIiwiZW51bSIsInJlcGVhdCIsInNvbWUiLCJOdW1iZXIiLCJGdW5jdGlvbiIsIk1hc2tlZENsYXNzIiwiX3VwZGF0ZVJlZ0V4cHMiLCJhbGxvd05lZ2F0aXZlIiwibWlkIiwic2NhbGUiLCJjb25jYXQiLCJyYWRpeCIsIl9udW1iZXJSZWdFeHAiLCJfbWFwVG9SYWRpeFJlZ0V4cCIsIm1hcFRvUmFkaXgiLCJfdGhvdXNhbmRzU2VwYXJhdG9yUmVnRXhwIiwidGhvdXNhbmRzU2VwYXJhdG9yIiwiX3JlbW92ZVRob3VzYW5kc1NlcGFyYXRvcnMiLCJfaW5zZXJ0VGhvdXNhbmRzU2VwYXJhdG9ycyIsInBhcnRzIiwicHJlcENoIiwiX3NlcGFyYXRvcnNDb3VudCIsImV4dGVuZE9uU2VwYXJhdG9ycyIsImNvdW50IiwiX3NlcGFyYXRvcnNDb3VudEZyb21TbGljZSIsIl9hZGp1c3RSYW5nZVdpdGhTZXBhcmF0b3JzIiwicHJldkJlZm9yZVRhaWxWYWx1ZSIsInByZXZCZWZvcmVUYWlsU2VwYXJhdG9yc0NvdW50IiwiYXBwZW5kRGV0YWlscyIsImJlZm9yZVRhaWxWYWx1ZSIsImJlZm9yZVRhaWxTZXBhcmF0b3JzQ291bnQiLCJfZmluZFNlcGFyYXRvckFyb3VuZCIsInNlYXJjaEZyb20iLCJzZXBhcmF0b3JQb3MiLCJzZXBhcmF0b3JBcm91bmRGcm9tUG9zIiwic2VwYXJhdG9yQXJvdW5kVG9Qb3MiLCJ2YWx1ZUJlZm9yZVBvcyIsInZhbHVlQWZ0ZXJQb3MiLCJzZXBhcmF0b3JBdExlZnRQb3MiLCJzZXBhcmF0b3JBdExlZnRFbmRQb3MiLCJzZXBhcmF0b3JBdFJpZ2h0UG9zIiwidmFsaWQiLCJtYXRjaCIsIm51bWJlciIsImlzTmFOIiwidmFsaWRudW0iLCJmb3JtYXR0ZWQiLCJub3JtYWxpemVaZXJvcyIsIl9ub3JtYWxpemVaZXJvcyIsInBhZEZyYWN0aW9uYWxaZXJvcyIsIl9wYWRGcmFjdGlvbmFsWmVyb3MiLCJzaWduIiwiemVyb3MiLCJudW0iLCJ0ZXN0IiwicGFkRW5kIiwiZHJvcEZyYWN0aW9uYWwiLCJVTk1BU0tFRF9SQURJWCIsIm4iLCJzaWduZWQiLCJ0b0xvY2FsZVN0cmluZyIsInVzZUdyb3VwaW5nIiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiUGF0dGVybklucHV0RGVmaW5pdGlvbiIsIkRFRkFVTFRfSU5QVVRfREVGSU5JVElPTlMiLCJQYXR0ZXJuRml4ZWREZWZpbml0aW9uIiwiQ2h1bmtzVGFpbERldGFpbHMiLCJQYXR0ZXJuQ3Vyc29yIiwiZGVmaW5pdGlvbnMiLCJfcmVidWlsZE1hc2siLCJkZWZzIiwiX2Jsb2NrcyIsIl9zdG9wcyIsIl9tYXNrZWRCbG9ja3MiLCJ1bm1hc2tpbmdCbG9jayIsIm9wdGlvbmFsQmxvY2siLCJfZGVmcyRjaGFyIiwiX2RlZnMkY2hhcjIiLCJwIiwiYk5hbWVzIiwiZmlsdGVyIiwiYk5hbWUiLCJtYXNrZWRCbG9jayIsImxhenkiLCJwbGFjZWhvbGRlckNoYXIiLCJkaXNwbGF5Q2hhciIsImNoYXIiLCJpc0lucHV0IiwiU1RPUF9DSEFSIiwiRVNDQVBFX0NIQVIiLCJtYXNrT3B0cyIsImRlZiIsImlzT3B0aW9uYWwiLCJpc1VubWFza2luZyIsImJpIiwiaXNGaXhlZCIsInJlZHVjZSIsIl90aGlzJF9tYXBQb3NUb0Jsb2NrIiwic3RhcnRCbG9ja0luZGV4IiwiX21hcFBvc1RvQmxvY2siLCJibG9ja0l0ZXIiLCJibG9jayIsImJsb2NrRGV0YWlscyIsImNodW5rVGFpbCIsIl9mb3JFYWNoQmxvY2tzSW5SYW5nZSIsImJGcm9tUG9zIiwiYlRvUG9zIiwiYmxvY2tDaHVuayIsIl9maW5kU3RvcEJlZm9yZSIsIl9ibG9ja1N0YXJ0UG9zIiwiYmxvY2tJbmRleCIsInN0b3BCZWZvcmUiLCJzaSIsInRvQmxvY2tJbmRleCIsInN0YXJ0QmxvY2tJdGVyIiwiZW5kQmxvY2tJbmRleCIsImJEZXRhaWxzIiwiYWNjVmFsIiwiYmxvY2tTdGFydFBvcyIsImZyb21CbG9ja0l0ZXIiLCJ0b0Jsb2NrSXRlciIsImlzU2FtZUJsb2NrIiwiZnJvbUJsb2NrU3RhcnRQb3MiLCJmcm9tQmxvY2tFbmRQb3MiLCJyZW1vdmVEZXRhaWxzIiwiY3Vyc29yIiwicHVzaFJpZ2h0QmVmb3JlSW5wdXQiLCJwb3BTdGF0ZSIsInB1c2hMZWZ0QmVmb3JlSW5wdXQiLCJwdXNoUmlnaHRCZWZvcmVGaWxsZWQiLCJvayIsInB1c2hMZWZ0QmVmb3JlUmVxdWlyZWQiLCJwdXNoTGVmdEJlZm9yZUZpbGxlZCIsInB1c2hSaWdodEJlZm9yZVJlcXVpcmVkIiwidG90YWwiLCJuYW1lIiwibWFza2VkQmxvY2tzIiwiaW5kaWNlcyIsImdpIiwiSW5wdXREZWZpbml0aW9uIiwiRml4ZWREZWZpbml0aW9uIiwiY2h1bmtzIiwidGFpbENodW5rIiwibGFzdENodW5rIiwiZXh0ZW5kTGFzdCIsImZpcnN0VGFpbENodW5rIiwiY2h1bmsiLCJsYXN0QmxvY2tJdGVyIiwiY2h1bmtCbG9jayIsInBoRGV0YWlscyIsInJlbWFpbkNoYXJzIiwiYyIsInByb3BzIiwiY3N0YXRlIiwiY2h1bmtTaGlmdFBvcyIsIl9sb2ciLCJwdXNoU3RhdGUiLCJwb3AiLCJiaW5kQmxvY2siLCJfcHVzaExlZnQiLCJfdGhpcyRibG9jayIsIl9wdXNoUmlnaHQiLCJfaXNSYXdJbnB1dCIsIm1pblBvcyIsIm1heFBvcyIsImFwcGVuZEVhZ2VyIiwiaXNSZXNvbHZlZCIsImJvdW5kUG9zIiwiTUFTS0VEIiwiVU5NQVNLRUQiLCJUWVBFRCIsInBpcGVBcmdzIiwiX21hdGNoRnJvbSIsImZyb21TdHIiLCJ0b1N0ciIsInNhbWVDaGFyc0NvdW50IiwiYm91bmRhcmllcyIsIm1pbnN0ciIsIm1heHN0ciIsInBsYWNlaG9sZGVyIiwibmV4dFZhbCIsImZpcnN0Tm9uWmVybyIsInNlYXJjaCIsIkNvb2tpZXMiLCJOZXZpZ2VuT25lU3RlcENoZWNrb3V0Iiwib3B0aW9ucyIsIkpvb21sYSIsImdldE9wdGlvbnMiLCJjb250cm9sbGVyIiwiY3NyZiIsInVzZV9tYXNrIiwicmFiYXR0IiwiY29udGFpbmVyQ2FydEVkaXRNZWVzYWdlIiwicXVlcnlTZWxlY3RvciIsInVzZXIiLCJjb250YWluZXJMb2dpbk1lZXNhZ2UiLCJmb3JtVmFsaWRhdGlvbk1lc3NhZ2UiLCJmb3JtVmFsaWRhdGlvbiIsImxvYWRBY3Rpb25zIiwibmV2aWdlbk9uZVN0ZXBDaGVja291dCIsImZvcm12YWxpZGF0b3IiLCJpc1ZhbGlkIiwiYWdiIiwiZXJyb3IiLCJjaGVja2VkIiwiY2xhc3NMaXN0IiwiYWRkIiwicGF5bWVudFZhbGlkIiwianNob3AiLCJmb3JtcyIsImNoZWNrUGF5bWVudEZvcm0iLCJzZXRQcmVsb2FkZXIiLCJzdWJtaXQiLCJhZGRyZXNzZXMiLCJhZGRyZXNzRmllbGRzIiwicXVlcnlTZWxlY3RvckFsbCIsImZpZWxkIiwiZ2V0QXR0cmlidXRlIiwic2F2ZUZvcm1EYXRhIiwicGF5bWVudE1ldGhvZHMiLCJwYXltZW50cyIsInBheW1lbnRBY3RpdmUiLCJwYXJhbXNQYXltZW50Iiwic2F2ZU1ldGhvZHNQYXJhbXMiLCJzaGlwcGluZ01ldGhvZHMiLCJzaGlwcGluZyIsInNoaXBwaW5nQWN0aXZlIiwiaWQiLCJwYXJhbXNTaGlwcGluZyIsInF1YW50aXR5SW5wdXRzIiwicGFyc2VJbnQiLCJjYXJ0RWRpdENoYW5nZVF1YW50aXR5IiwicXVhbnRpdHlCdXR0b25zIiwiYnV0dG9uIiwidHlwZSIsImNvbnRhaW5lciIsImNsb3Nlc3QiLCJ1cGRhdGUiLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJhamF4RGF0YSIsIkZvcm1EYXRhIiwicGF5bWVudCIsInNldCIsImZpZWxkcyIsInBhcmFtIiwibmFtZVBhcmFtIiwic2VuZEFqYXgiLCJ0aGVuIiwicmVzcG9uc2UiLCJkYXRhIiwicmVsb2FkIiwicmVsb2FkU2Nyb2xsUGFnZSIsImNhdGNoIiwic2V0TWVzc2FnZSIsIm1lc3NhZ2UiLCJlbGVtZW50IiwibWF0Y2hlcyIsInRyaWdnZXJFdmVudCIsInF1YW50aXR5IiwiY2FydFByaWNlIiwiaW5uZXJIVE1MIiwicHJpY2UiLCJjYXJ0U3VtIiwicHJvZHVjdFN1bSIsInN1bSIsImNhcnRFZGl0VXBkYXRlVG90YWwiLCJjYXJ0IiwiY2FydEVkaXRSZW1vdmVQcm9kdWN0IiwicHJvZHVjdF9pZCIsInN1Y2Nlc3MiLCJwcm9kdWN0cyIsInByb2R1Y3RzRnJvbVNlcnZlciIsInByb2R1Y3RzQ2FydCIsInByb2R1Y3RzQmxvY2siLCJwcm9kdWN0IiwiY2xvc2UiLCJidWJibGVzIiwidG90YWxzIiwiY2FydFJhYmJhdCIsImRpc2FibGVSYWJiYXQiLCJzZXROZXZpZ2VuQm9udXNlc0NhcnRQb2ludHMiLCJwb2ludHNfc3ViIiwibG9naW4iLCJtZXRob2RBamF4IiwibWV0aG9kIiwiUHJvbWlzZSIsInJlamVjdCIsInJlcXVlc3QiLCJ1cmwiLCJvblN1Y2Nlc3MiLCJyZXNwIiwiSlNPTiIsIm9uRXJyb3IiLCJyZW1vdmVNZXNzYWdlcyIsInJlbmRlck1lc3NhZ2VzIiwibmVlZFNjcm9sbCIsInNjcm9sbCIsImdldCIsIndpbmRvdyIsInNjcm9sbFkiLCJsb2NhdGlvbiIsInByZWxvYWRlclNvdXJjZSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiZGlzcGxheSIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiTmV2aWdlbk9uZVN0ZXBDaGVja291dENsYXNzIl0sInNvdXJjZVJvb3QiOiIifQ==