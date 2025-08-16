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
 * @version    1.1.0
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
      if (response.success) {
        let productsCart = document.querySelectorAll('[nevigen-onestepcheckout-cart-edit="products"],[data-nevigen-onestepcheckout-cart-edit="products"]');
        if (productsCart.length > 0) {
          productsCart.forEach(productsBlock => {
            let products = productsBlock.querySelectorAll('[nevigen-onestepcheckout-cart-edit="product"],[data-nevigen-onestepcheckout-cart-edit="product"]');
            if (products.length > 0) {
              let count = products.length;
              products.forEach(product => {
                let key = product.getAttribute('data-key');
                if (parseInt(key) === parseInt(product_id)) {
                  product.remove();
                }
                if (count === 1) {
                  let close = document.querySelectorAll('[nevigen-onestepcheckout-cart-edit="close"],[data-nevigen-onestepcheckout-cart-edit="close"]');
                  if (close.length > 0) {
                    close.forEach(button => {
                      if (button) {
                        button.dispatchEvent(new Event('click', {
                          'bubbles': true
                        }));
                      }
                    });
                  }
                }
              });
            }
          });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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NmUsYUFBYSxDQUFDLDBCQUEwQixDQUFDO0VBQ25FLElBQUlzRixVQUFVLEVBQUU7SUFDZkEsVUFBVSxDQUFDcGpCLGdCQUFnQixDQUFDLFFBQVEsRUFBR29GLENBQUMsSUFBSztNQUM1QyxJQUFJOUcsS0FBSyxHQUFHOGtCLFVBQVUsQ0FBQzlrQixLQUFLO01BQzVCLElBQUk4a0IsVUFBVSxDQUFDOUQsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsRUFBRTtRQUNuRCxJQUFJOEQsVUFBVSxDQUFDM0UsT0FBTyxLQUFLLEtBQUssRUFBRTtVQUNqQ25nQixLQUFLLEdBQUcsR0FBRztRQUNaO01BQ0Q7TUFDQStsQixNQUFNLENBQUNoSCxzQkFBc0IsQ0FBQyxDQUFDLENBQUM4RiwyQkFBMkIsQ0FBQzdrQixLQUFLLENBQUM7SUFDbkUsQ0FBQyxDQUFDO0lBQ0YsSUFBSThrQixVQUFVLENBQUM5RCxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssVUFBVSxFQUFFO01BQ25EOEQsVUFBVSxDQUFDcGpCLGdCQUFnQixDQUFDLE9BQU8sRUFBR29GLENBQUMsSUFBSztRQUMzQyxJQUFJOUcsS0FBSyxHQUFHOGtCLFVBQVUsQ0FBQzlrQixLQUFLO1FBRTVCQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ3VLLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO1FBQ3RDdkssS0FBSyxHQUFHQSxLQUFLLENBQUN1SyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztRQUVoQ3VhLFVBQVUsQ0FBQzlrQixLQUFLLEdBQUdBLEtBQUs7TUFFekIsQ0FBQyxDQUFDO0lBQ0g7RUFDRDtBQUNELENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vY29udHJvbHMvaHRtbC1jb250ZW50ZWRpdGFibGUtbWFzay1lbGVtZW50LmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vY29udHJvbHMvaHRtbC1tYXNrLWVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9jb250cm9scy9pbnB1dC5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL2NvbnRyb2xzL21hc2stZWxlbWVudC5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL2NvcmUvYWN0aW9uLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL2NvcmUvaG9sZGVyLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vY29yZS91dGlscy5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL2luZGV4LmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvZGF0ZS5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9keW5hbWljLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL2VudW0uanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9udW1iZXIuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvcGF0dGVybi5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9wYXR0ZXJuL2NodW5rLXRhaWwtZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9wYXR0ZXJuL2N1cnNvci5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvLi9ub2RlX21vZHVsZXMvaW1hc2svZXNtL21hc2tlZC9wYXR0ZXJuL2ZpeGVkLWRlZmluaXRpb24uanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvcGF0dGVybi9pbnB1dC1kZWZpbml0aW9uLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9pbWFzay9lc20vbWFza2VkL3BpcGUuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvcmFuZ2UuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vbm9kZV9tb2R1bGVzL2ltYXNrL2VzbS9tYXNrZWQvcmVnZXhwLmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL25vZGVfbW9kdWxlcy9qcy1jb29raWUvZGlzdC9qcy5jb29raWUubWpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC8uL3BsZ19zeXN0ZW1fbmV2aWdlbl9qc2hvcF9vbmVzdGVwY2hlY2tvdXQvZXM2L21haW4uZXM2Il0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHtcbiAgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307XG4gIHZhciB0YXJnZXQgPSB7fTtcbiAgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuICB2YXIga2V5LCBpO1xuICBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IHNvdXJjZUtleXNbaV07XG4gICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmV4cG9ydCB7IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIGFzIF8gfTtcbiIsImltcG9ydCBIVE1MTWFza0VsZW1lbnQgZnJvbSAnLi9odG1sLW1hc2stZWxlbWVudC5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuL21hc2stZWxlbWVudC5qcyc7XG5cbmNsYXNzIEhUTUxDb250ZW50ZWRpdGFibGVNYXNrRWxlbWVudCBleHRlbmRzIEhUTUxNYXNrRWxlbWVudCB7XG4gIC8qKlxuICAgIFJldHVybnMgSFRNTEVsZW1lbnQgc2VsZWN0aW9uIHN0YXJ0XG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCBfdW5zYWZlU2VsZWN0aW9uU3RhcnQoKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMucm9vdEVsZW1lbnQ7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gcm9vdC5nZXRTZWxlY3Rpb24gJiYgcm9vdC5nZXRTZWxlY3Rpb24oKTtcbiAgICBjb25zdCBhbmNob3JPZmZzZXQgPSBzZWxlY3Rpb24gJiYgc2VsZWN0aW9uLmFuY2hvck9mZnNldDtcbiAgICBjb25zdCBmb2N1c09mZnNldCA9IHNlbGVjdGlvbiAmJiBzZWxlY3Rpb24uZm9jdXNPZmZzZXQ7XG4gICAgaWYgKGZvY3VzT2Zmc2V0ID09IG51bGwgfHwgYW5jaG9yT2Zmc2V0ID09IG51bGwgfHwgYW5jaG9yT2Zmc2V0IDwgZm9jdXNPZmZzZXQpIHtcbiAgICAgIHJldHVybiBhbmNob3JPZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiBmb2N1c09mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgIFJldHVybnMgSFRNTEVsZW1lbnQgc2VsZWN0aW9uIGVuZFxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgX3Vuc2FmZVNlbGVjdGlvbkVuZCgpIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5yb290RWxlbWVudDtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSByb290LmdldFNlbGVjdGlvbiAmJiByb290LmdldFNlbGVjdGlvbigpO1xuICAgIGNvbnN0IGFuY2hvck9mZnNldCA9IHNlbGVjdGlvbiAmJiBzZWxlY3Rpb24uYW5jaG9yT2Zmc2V0O1xuICAgIGNvbnN0IGZvY3VzT2Zmc2V0ID0gc2VsZWN0aW9uICYmIHNlbGVjdGlvbi5mb2N1c09mZnNldDtcbiAgICBpZiAoZm9jdXNPZmZzZXQgPT0gbnVsbCB8fCBhbmNob3JPZmZzZXQgPT0gbnVsbCB8fCBhbmNob3JPZmZzZXQgPiBmb2N1c09mZnNldCkge1xuICAgICAgcmV0dXJuIGFuY2hvck9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIGZvY3VzT2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAgU2V0cyBIVE1MRWxlbWVudCBzZWxlY3Rpb25cbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgX3Vuc2FmZVNlbGVjdChzdGFydCwgZW5kKSB7XG4gICAgaWYgKCF0aGlzLnJvb3RFbGVtZW50LmNyZWF0ZVJhbmdlKSByZXR1cm47XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJvb3RFbGVtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgcmFuZ2Uuc2V0U3RhcnQodGhpcy5pbnB1dC5maXJzdENoaWxkIHx8IHRoaXMuaW5wdXQsIHN0YXJ0KTtcbiAgICByYW5nZS5zZXRFbmQodGhpcy5pbnB1dC5sYXN0Q2hpbGQgfHwgdGhpcy5pbnB1dCwgZW5kKTtcbiAgICBjb25zdCByb290ID0gdGhpcy5yb290RWxlbWVudDtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSByb290LmdldFNlbGVjdGlvbiAmJiByb290LmdldFNlbGVjdGlvbigpO1xuICAgIGlmIChzZWxlY3Rpb24pIHtcbiAgICAgIHNlbGVjdGlvbi5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIHNlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAgSFRNTEVsZW1lbnQgdmFsdWVcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICByZXR1cm4gdGhpcy5pbnB1dC50ZXh0Q29udGVudDtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLmlucHV0LnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cbn1cbklNYXNrLkhUTUxDb250ZW50ZWRpdGFibGVNYXNrRWxlbWVudCA9IEhUTUxDb250ZW50ZWRpdGFibGVNYXNrRWxlbWVudDtcblxuZXhwb3J0IHsgSFRNTENvbnRlbnRlZGl0YWJsZU1hc2tFbGVtZW50IGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCBNYXNrRWxlbWVudCBmcm9tICcuL21hc2stZWxlbWVudC5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuXG4vKiogQnJpZGdlIGJldHdlZW4gSFRNTEVsZW1lbnQgYW5kIHtAbGluayBNYXNrZWR9ICovXG5jbGFzcyBIVE1MTWFza0VsZW1lbnQgZXh0ZW5kcyBNYXNrRWxlbWVudCB7XG4gIC8qKiBNYXBwaW5nIGJldHdlZW4gSFRNTEVsZW1lbnQgZXZlbnRzIGFuZCBtYXNrIGludGVybmFsIGV2ZW50cyAqL1xuXG4gIC8qKiBIVE1MRWxlbWVudCB0byB1c2UgbWFzayBvbiAqL1xuXG4gIC8qKlxuICAgIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudHxIVE1MVGV4dEFyZWFFbGVtZW50fSBpbnB1dFxuICAqL1xuICBjb25zdHJ1Y3RvcihpbnB1dCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMuX2hhbmRsZXJzID0ge307XG4gIH1cblxuICAvKiogKi9cbiAgLy8gJEZsb3dGaXhNZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmxvdy9pc3N1ZXMvMjgzOVxuICBnZXQgcm9vdEVsZW1lbnQoKSB7XG4gICAgdmFyIF90aGlzJGlucHV0JGdldFJvb3RObywgX3RoaXMkaW5wdXQkZ2V0Um9vdE5vMiwgX3RoaXMkaW5wdXQ7XG4gICAgcmV0dXJuIChfdGhpcyRpbnB1dCRnZXRSb290Tm8gPSAoX3RoaXMkaW5wdXQkZ2V0Um9vdE5vMiA9IChfdGhpcyRpbnB1dCA9IHRoaXMuaW5wdXQpLmdldFJvb3ROb2RlKSA9PT0gbnVsbCB8fCBfdGhpcyRpbnB1dCRnZXRSb290Tm8yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRpbnB1dCRnZXRSb290Tm8yLmNhbGwoX3RoaXMkaW5wdXQpKSAhPT0gbnVsbCAmJiBfdGhpcyRpbnB1dCRnZXRSb290Tm8gIT09IHZvaWQgMCA/IF90aGlzJGlucHV0JGdldFJvb3RObyA6IGRvY3VtZW50O1xuICB9XG5cbiAgLyoqXG4gICAgSXMgZWxlbWVudCBpbiBmb2N1c1xuICAgIEByZWFkb25seVxuICAqL1xuICBnZXQgaXNBY3RpdmUoKSB7XG4gICAgLy8kRmxvd0ZpeE1lXG4gICAgcmV0dXJuIHRoaXMuaW5wdXQgPT09IHRoaXMucm9vdEVsZW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgIFJldHVybnMgSFRNTEVsZW1lbnQgc2VsZWN0aW9uIHN0YXJ0XG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCBfdW5zYWZlU2VsZWN0aW9uU3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXQuc2VsZWN0aW9uU3RhcnQ7XG4gIH1cblxuICAvKipcbiAgICBSZXR1cm5zIEhUTUxFbGVtZW50IHNlbGVjdGlvbiBlbmRcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IF91bnNhZmVTZWxlY3Rpb25FbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXQuc2VsZWN0aW9uRW5kO1xuICB9XG5cbiAgLyoqXG4gICAgU2V0cyBIVE1MRWxlbWVudCBzZWxlY3Rpb25cbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgX3Vuc2FmZVNlbGVjdChzdGFydCwgZW5kKSB7XG4gICAgdGhpcy5pbnB1dC5zZXRTZWxlY3Rpb25SYW5nZShzdGFydCwgZW5kKTtcbiAgfVxuXG4gIC8qKlxuICAgIEhUTUxFbGVtZW50IHZhbHVlXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dC52YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLmlucHV0LnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICBCaW5kcyBIVE1MRWxlbWVudCBldmVudHMgdG8gbWFzayBpbnRlcm5hbCBldmVudHNcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgYmluZEV2ZW50cyhoYW5kbGVycykge1xuICAgIE9iamVjdC5rZXlzKGhhbmRsZXJzKS5mb3JFYWNoKGV2ZW50ID0+IHRoaXMuX3RvZ2dsZUV2ZW50SGFuZGxlcihIVE1MTWFza0VsZW1lbnQuRVZFTlRTX01BUFtldmVudF0sIGhhbmRsZXJzW2V2ZW50XSkpO1xuICB9XG5cbiAgLyoqXG4gICAgVW5iaW5kcyBIVE1MRWxlbWVudCBldmVudHMgdG8gbWFzayBpbnRlcm5hbCBldmVudHNcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgdW5iaW5kRXZlbnRzKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuX2hhbmRsZXJzKS5mb3JFYWNoKGV2ZW50ID0+IHRoaXMuX3RvZ2dsZUV2ZW50SGFuZGxlcihldmVudCkpO1xuICB9XG5cbiAgLyoqICovXG4gIF90b2dnbGVFdmVudEhhbmRsZXIoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICBpZiAodGhpcy5faGFuZGxlcnNbZXZlbnRdKSB7XG4gICAgICB0aGlzLmlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuX2hhbmRsZXJzW2V2ZW50XSk7XG4gICAgICBkZWxldGUgdGhpcy5faGFuZGxlcnNbZXZlbnRdO1xuICAgIH1cbiAgICBpZiAoaGFuZGxlcikge1xuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgIHRoaXMuX2hhbmRsZXJzW2V2ZW50XSA9IGhhbmRsZXI7XG4gICAgfVxuICB9XG59XG5IVE1MTWFza0VsZW1lbnQuRVZFTlRTX01BUCA9IHtcbiAgc2VsZWN0aW9uQ2hhbmdlOiAna2V5ZG93bicsXG4gIGlucHV0OiAnaW5wdXQnLFxuICBkcm9wOiAnZHJvcCcsXG4gIGNsaWNrOiAnY2xpY2snLFxuICBmb2N1czogJ2ZvY3VzJyxcbiAgY29tbWl0OiAnYmx1cidcbn07XG5JTWFzay5IVE1MTWFza0VsZW1lbnQgPSBIVE1MTWFza0VsZW1lbnQ7XG5cbmV4cG9ydCB7IEhUTUxNYXNrRWxlbWVudCBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBfIGFzIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIH0gZnJvbSAnLi4vX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy02YjNiZDQwNC5qcyc7XG5pbXBvcnQgeyBvYmplY3RJbmNsdWRlcywgRElSRUNUSU9OIH0gZnJvbSAnLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgQWN0aW9uRGV0YWlscyBmcm9tICcuLi9jb3JlL2FjdGlvbi1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi4vbWFza2VkL2RhdGUuanMnO1xuaW1wb3J0IGNyZWF0ZU1hc2ssIHsgbWFza2VkQ2xhc3MgfSBmcm9tICcuLi9tYXNrZWQvZmFjdG9yeS5qcyc7XG5pbXBvcnQgTWFza0VsZW1lbnQgZnJvbSAnLi9tYXNrLWVsZW1lbnQuanMnO1xuaW1wb3J0IEhUTUxNYXNrRWxlbWVudCBmcm9tICcuL2h0bWwtbWFzay1lbGVtZW50LmpzJztcbmltcG9ydCBIVE1MQ29udGVudGVkaXRhYmxlTWFza0VsZW1lbnQgZnJvbSAnLi9odG1sLWNvbnRlbnRlZGl0YWJsZS1tYXNrLWVsZW1lbnQuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4uL21hc2tlZC9wYXR0ZXJuLmpzJztcbmltcG9ydCAnLi4vbWFza2VkL2Jhc2UuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NvbnRpbnVvdXMtdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi4vbWFza2VkL3BhdHRlcm4vaW5wdXQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgJy4uL21hc2tlZC9wYXR0ZXJuL2ZpeGVkLWRlZmluaXRpb24uanMnO1xuaW1wb3J0ICcuLi9tYXNrZWQvcGF0dGVybi9jaHVuay10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuLi9tYXNrZWQvcGF0dGVybi9jdXJzb3IuanMnO1xuaW1wb3J0ICcuLi9tYXNrZWQvcmVnZXhwLmpzJztcbmltcG9ydCAnLi4vbWFza2VkL3JhbmdlLmpzJztcblxuY29uc3QgX2V4Y2x1ZGVkID0gW1wibWFza1wiXTtcblxuLyoqIExpc3RlbnMgdG8gZWxlbWVudCBldmVudHMgYW5kIGNvbnRyb2xzIGNoYW5nZXMgYmV0d2VlbiBlbGVtZW50IGFuZCB7QGxpbmsgTWFza2VkfSAqL1xuY2xhc3MgSW5wdXRNYXNrIHtcbiAgLyoqXG4gICAgVmlldyBlbGVtZW50XG4gICAgQHJlYWRvbmx5XG4gICovXG5cbiAgLyoqXG4gICAgSW50ZXJuYWwge0BsaW5rIE1hc2tlZH0gbW9kZWxcbiAgICBAcmVhZG9ubHlcbiAgKi9cblxuICAvKipcbiAgICBAcGFyYW0ge01hc2tFbGVtZW50fEhUTUxJbnB1dEVsZW1lbnR8SFRNTFRleHRBcmVhRWxlbWVudH0gZWxcbiAgICBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAqL1xuICBjb25zdHJ1Y3RvcihlbCwgb3B0cykge1xuICAgIHRoaXMuZWwgPSBlbCBpbnN0YW5jZW9mIE1hc2tFbGVtZW50ID8gZWwgOiBlbC5pc0NvbnRlbnRFZGl0YWJsZSAmJiBlbC50YWdOYW1lICE9PSAnSU5QVVQnICYmIGVsLnRhZ05hbWUgIT09ICdURVhUQVJFQScgPyBuZXcgSFRNTENvbnRlbnRlZGl0YWJsZU1hc2tFbGVtZW50KGVsKSA6IG5ldyBIVE1MTWFza0VsZW1lbnQoZWwpO1xuICAgIHRoaXMubWFza2VkID0gY3JlYXRlTWFzayhvcHRzKTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLl92YWx1ZSA9ICcnO1xuICAgIHRoaXMuX3VubWFza2VkVmFsdWUgPSAnJztcbiAgICB0aGlzLl9zYXZlU2VsZWN0aW9uID0gdGhpcy5fc2F2ZVNlbGVjdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uSW5wdXQgPSB0aGlzLl9vbklucHV0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSB0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRHJvcCA9IHRoaXMuX29uRHJvcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRm9jdXMgPSB0aGlzLl9vbkZvY3VzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGljayA9IHRoaXMuX29uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmFsaWduQ3Vyc29yID0gdGhpcy5hbGlnbkN1cnNvci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWxpZ25DdXJzb3JGcmllbmRseSA9IHRoaXMuYWxpZ25DdXJzb3JGcmllbmRseS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIC8vIHJlZnJlc2hcbiAgICB0aGlzLnVwZGF0ZVZhbHVlKCk7XG4gICAgdGhpcy5fb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBSZWFkIG9yIHVwZGF0ZSBtYXNrICovXG4gIGdldCBtYXNrKCkge1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC5tYXNrO1xuICB9XG4gIG1hc2tFcXVhbHMobWFzaykge1xuICAgIHZhciBfdGhpcyRtYXNrZWQ7XG4gICAgcmV0dXJuIG1hc2sgPT0gbnVsbCB8fCAoKF90aGlzJG1hc2tlZCA9IHRoaXMubWFza2VkKSA9PT0gbnVsbCB8fCBfdGhpcyRtYXNrZWQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJG1hc2tlZC5tYXNrRXF1YWxzKG1hc2spKTtcbiAgfVxuICBzZXQgbWFzayhtYXNrKSB7XG4gICAgaWYgKHRoaXMubWFza0VxdWFscyhtYXNrKSkgcmV0dXJuO1xuXG4gICAgLy8gJEZsb3dGaXhNZSBObyBpZGVhcyAuLi4gYWZ0ZXIgdXBkYXRlXG4gICAgaWYgKCEobWFzayBpbnN0YW5jZW9mIElNYXNrLk1hc2tlZCkgJiYgdGhpcy5tYXNrZWQuY29uc3RydWN0b3IgPT09IG1hc2tlZENsYXNzKG1hc2spKSB7XG4gICAgICB0aGlzLm1hc2tlZC51cGRhdGVPcHRpb25zKHtcbiAgICAgICAgbWFza1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1hc2tlZCA9IGNyZWF0ZU1hc2soe1xuICAgICAgbWFza1xuICAgIH0pO1xuICAgIG1hc2tlZC51bm1hc2tlZFZhbHVlID0gdGhpcy5tYXNrZWQudW5tYXNrZWRWYWx1ZTtcbiAgICB0aGlzLm1hc2tlZCA9IG1hc2tlZDtcbiAgfVxuXG4gIC8qKiBSYXcgdmFsdWUgKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUoc3RyKSB7XG4gICAgaWYgKHRoaXMudmFsdWUgPT09IHN0cikgcmV0dXJuO1xuICAgIHRoaXMubWFza2VkLnZhbHVlID0gc3RyO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbCgpO1xuICAgIHRoaXMuYWxpZ25DdXJzb3IoKTtcbiAgfVxuXG4gIC8qKiBVbm1hc2tlZCB2YWx1ZSAqL1xuICBnZXQgdW5tYXNrZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdW5tYXNrZWRWYWx1ZTtcbiAgfVxuICBzZXQgdW5tYXNrZWRWYWx1ZShzdHIpIHtcbiAgICBpZiAodGhpcy51bm1hc2tlZFZhbHVlID09PSBzdHIpIHJldHVybjtcbiAgICB0aGlzLm1hc2tlZC51bm1hc2tlZFZhbHVlID0gc3RyO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbCgpO1xuICAgIHRoaXMuYWxpZ25DdXJzb3IoKTtcbiAgfVxuXG4gIC8qKiBUeXBlZCB1bm1hc2tlZCB2YWx1ZSAqL1xuICBnZXQgdHlwZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXNrZWQudHlwZWRWYWx1ZTtcbiAgfVxuICBzZXQgdHlwZWRWYWx1ZSh2YWwpIHtcbiAgICBpZiAodGhpcy5tYXNrZWQudHlwZWRWYWx1ZUVxdWFscyh2YWwpKSByZXR1cm47XG4gICAgdGhpcy5tYXNrZWQudHlwZWRWYWx1ZSA9IHZhbDtcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgICB0aGlzLmFsaWduQ3Vyc29yKCk7XG4gIH1cblxuICAvKiogRGlzcGxheSB2YWx1ZSAqL1xuICBnZXQgZGlzcGxheVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC5kaXNwbGF5VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICBTdGFydHMgbGlzdGVuaW5nIHRvIGVsZW1lbnQgZXZlbnRzXG4gICAgQHByb3RlY3RlZFxuICAqL1xuICBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLmVsLmJpbmRFdmVudHMoe1xuICAgICAgc2VsZWN0aW9uQ2hhbmdlOiB0aGlzLl9zYXZlU2VsZWN0aW9uLFxuICAgICAgaW5wdXQ6IHRoaXMuX29uSW5wdXQsXG4gICAgICBkcm9wOiB0aGlzLl9vbkRyb3AsXG4gICAgICBjbGljazogdGhpcy5fb25DbGljayxcbiAgICAgIGZvY3VzOiB0aGlzLl9vbkZvY3VzLFxuICAgICAgY29tbWl0OiB0aGlzLl9vbkNoYW5nZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAgU3RvcHMgbGlzdGVuaW5nIHRvIGVsZW1lbnQgZXZlbnRzXG4gICAgQHByb3RlY3RlZFxuICAgKi9cbiAgX3VuYmluZEV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5lbCkgdGhpcy5lbC51bmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgIEZpcmVzIGN1c3RvbSBldmVudFxuICAgIEBwcm90ZWN0ZWRcbiAgICovXG4gIF9maXJlRXZlbnQoZXYpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2XTtcbiAgICBpZiAoIWxpc3RlbmVycykgcmV0dXJuO1xuICAgIGxpc3RlbmVycy5mb3JFYWNoKGwgPT4gbCguLi5hcmdzKSk7XG4gIH1cblxuICAvKipcbiAgICBDdXJyZW50IHNlbGVjdGlvbiBzdGFydFxuICAgIEByZWFkb25seVxuICAqL1xuICBnZXQgc2VsZWN0aW9uU3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnNvckNoYW5naW5nID8gdGhpcy5fY2hhbmdpbmdDdXJzb3JQb3MgOiB0aGlzLmVsLnNlbGVjdGlvblN0YXJ0O1xuICB9XG5cbiAgLyoqIEN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uICovXG4gIGdldCBjdXJzb3JQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnNvckNoYW5naW5nID8gdGhpcy5fY2hhbmdpbmdDdXJzb3JQb3MgOiB0aGlzLmVsLnNlbGVjdGlvbkVuZDtcbiAgfVxuICBzZXQgY3Vyc29yUG9zKHBvcykge1xuICAgIGlmICghdGhpcy5lbCB8fCAhdGhpcy5lbC5pc0FjdGl2ZSkgcmV0dXJuO1xuICAgIHRoaXMuZWwuc2VsZWN0KHBvcywgcG9zKTtcbiAgICB0aGlzLl9zYXZlU2VsZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICBTdG9yZXMgY3VycmVudCBzZWxlY3Rpb25cbiAgICBAcHJvdGVjdGVkXG4gICovXG4gIF9zYXZlU2VsZWN0aW9uKCAvKiBldiAqL1xuICApIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5VmFsdWUgIT09IHRoaXMuZWwudmFsdWUpIHtcbiAgICAgIGNvbnNvbGUud2FybignRWxlbWVudCB2YWx1ZSB3YXMgY2hhbmdlZCBvdXRzaWRlIG9mIG1hc2suIFN5bmNyb25pemUgbWFzayB1c2luZyBgbWFzay51cGRhdGVWYWx1ZSgpYCB0byB3b3JrIHByb3Blcmx5LicpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG5cbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7XG4gICAgICBzdGFydDogdGhpcy5zZWxlY3Rpb25TdGFydCxcbiAgICAgIGVuZDogdGhpcy5jdXJzb3JQb3NcbiAgICB9O1xuICB9XG5cbiAgLyoqIFN5bmNyb25pemVzIG1vZGVsIHZhbHVlIGZyb20gdmlldyAqL1xuICB1cGRhdGVWYWx1ZSgpIHtcbiAgICB0aGlzLm1hc2tlZC52YWx1ZSA9IHRoaXMuZWwudmFsdWU7XG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLm1hc2tlZC52YWx1ZTtcbiAgfVxuXG4gIC8qKiBTeW5jcm9uaXplcyB2aWV3IGZyb20gbW9kZWwgdmFsdWUsIGZpcmVzIGNoYW5nZSBldmVudHMgKi9cbiAgdXBkYXRlQ29udHJvbCgpIHtcbiAgICBjb25zdCBuZXdVbm1hc2tlZFZhbHVlID0gdGhpcy5tYXNrZWQudW5tYXNrZWRWYWx1ZTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMubWFza2VkLnZhbHVlO1xuICAgIGNvbnN0IG5ld0Rpc3BsYXlWYWx1ZSA9IHRoaXMuZGlzcGxheVZhbHVlO1xuICAgIGNvbnN0IGlzQ2hhbmdlZCA9IHRoaXMudW5tYXNrZWRWYWx1ZSAhPT0gbmV3VW5tYXNrZWRWYWx1ZSB8fCB0aGlzLnZhbHVlICE9PSBuZXdWYWx1ZTtcbiAgICB0aGlzLl91bm1hc2tlZFZhbHVlID0gbmV3VW5tYXNrZWRWYWx1ZTtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmICh0aGlzLmVsLnZhbHVlICE9PSBuZXdEaXNwbGF5VmFsdWUpIHRoaXMuZWwudmFsdWUgPSBuZXdEaXNwbGF5VmFsdWU7XG4gICAgaWYgKGlzQ2hhbmdlZCkgdGhpcy5fZmlyZUNoYW5nZUV2ZW50cygpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgb3B0aW9ucyB3aXRoIGRlZXAgZXF1YWwgY2hlY2ssIHJlY3JlYXRlcyBAe2xpbmsgTWFza2VkfSBtb2RlbCBpZiBtYXNrIHR5cGUgY2hhbmdlcyAqL1xuICB1cGRhdGVPcHRpb25zKG9wdHMpIHtcbiAgICBjb25zdCB7XG4gICAgICAgIG1hc2tcbiAgICAgIH0gPSBvcHRzLFxuICAgICAgcmVzdE9wdHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShvcHRzLCBfZXhjbHVkZWQpO1xuICAgIGNvbnN0IHVwZGF0ZU1hc2sgPSAhdGhpcy5tYXNrRXF1YWxzKG1hc2spO1xuICAgIGNvbnN0IHVwZGF0ZU9wdHMgPSAhb2JqZWN0SW5jbHVkZXModGhpcy5tYXNrZWQsIHJlc3RPcHRzKTtcbiAgICBpZiAodXBkYXRlTWFzaykgdGhpcy5tYXNrID0gbWFzaztcbiAgICBpZiAodXBkYXRlT3B0cykgdGhpcy5tYXNrZWQudXBkYXRlT3B0aW9ucyhyZXN0T3B0cyk7XG4gICAgaWYgKHVwZGF0ZU1hc2sgfHwgdXBkYXRlT3B0cykgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gIH1cblxuICAvKiogVXBkYXRlcyBjdXJzb3IgKi9cbiAgdXBkYXRlQ3Vyc29yKGN1cnNvclBvcykge1xuICAgIGlmIChjdXJzb3JQb3MgPT0gbnVsbCkgcmV0dXJuO1xuICAgIHRoaXMuY3Vyc29yUG9zID0gY3Vyc29yUG9zO1xuXG4gICAgLy8gYWxzbyBxdWV1ZSBjaGFuZ2UgY3Vyc29yIGZvciBtb2JpbGUgYnJvd3NlcnNcbiAgICB0aGlzLl9kZWxheVVwZGF0ZUN1cnNvcihjdXJzb3JQb3MpO1xuICB9XG5cbiAgLyoqXG4gICAgRGVsYXlzIGN1cnNvciB1cGRhdGUgdG8gc3VwcG9ydCBtb2JpbGUgYnJvd3NlcnNcbiAgICBAcHJpdmF0ZVxuICAqL1xuICBfZGVsYXlVcGRhdGVDdXJzb3IoY3Vyc29yUG9zKSB7XG4gICAgdGhpcy5fYWJvcnRVcGRhdGVDdXJzb3IoKTtcbiAgICB0aGlzLl9jaGFuZ2luZ0N1cnNvclBvcyA9IGN1cnNvclBvcztcbiAgICB0aGlzLl9jdXJzb3JDaGFuZ2luZyA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmVsKSByZXR1cm47IC8vIGlmIHdhcyBkZXN0cm95ZWRcbiAgICAgIHRoaXMuY3Vyc29yUG9zID0gdGhpcy5fY2hhbmdpbmdDdXJzb3JQb3M7XG4gICAgICB0aGlzLl9hYm9ydFVwZGF0ZUN1cnNvcigpO1xuICAgIH0sIDEwKTtcbiAgfVxuXG4gIC8qKlxuICAgIEZpcmVzIGN1c3RvbSBldmVudHNcbiAgICBAcHJvdGVjdGVkXG4gICovXG4gIF9maXJlQ2hhbmdlRXZlbnRzKCkge1xuICAgIHRoaXMuX2ZpcmVFdmVudCgnYWNjZXB0JywgdGhpcy5faW5wdXRFdmVudCk7XG4gICAgaWYgKHRoaXMubWFza2VkLmlzQ29tcGxldGUpIHRoaXMuX2ZpcmVFdmVudCgnY29tcGxldGUnLCB0aGlzLl9pbnB1dEV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgIEFib3J0cyBkZWxheWVkIGN1cnNvciB1cGRhdGVcbiAgICBAcHJpdmF0ZVxuICAqL1xuICBfYWJvcnRVcGRhdGVDdXJzb3IoKSB7XG4gICAgaWYgKHRoaXMuX2N1cnNvckNoYW5naW5nKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fY3Vyc29yQ2hhbmdpbmcpO1xuICAgICAgZGVsZXRlIHRoaXMuX2N1cnNvckNoYW5naW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBbGlnbnMgY3Vyc29yIHRvIG5lYXJlc3QgYXZhaWxhYmxlIHBvc2l0aW9uICovXG4gIGFsaWduQ3Vyc29yKCkge1xuICAgIHRoaXMuY3Vyc29yUG9zID0gdGhpcy5tYXNrZWQubmVhcmVzdElucHV0UG9zKHRoaXMubWFza2VkLm5lYXJlc3RJbnB1dFBvcyh0aGlzLmN1cnNvclBvcywgRElSRUNUSU9OLkxFRlQpKTtcbiAgfVxuXG4gIC8qKiBBbGlnbnMgY3Vyc29yIG9ubHkgaWYgc2VsZWN0aW9uIGlzIGVtcHR5ICovXG4gIGFsaWduQ3Vyc29yRnJpZW5kbHkoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uU3RhcnQgIT09IHRoaXMuY3Vyc29yUG9zKSByZXR1cm47IC8vIHNraXAgaWYgcmFuZ2UgaXMgc2VsZWN0ZWRcbiAgICB0aGlzLmFsaWduQ3Vyc29yKCk7XG4gIH1cblxuICAvKiogQWRkcyBsaXN0ZW5lciBvbiBjdXN0b20gZXZlbnQgKi9cbiAgb24oZXYsIGhhbmRsZXIpIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tldl0pIHRoaXMuX2xpc3RlbmVyc1tldl0gPSBbXTtcbiAgICB0aGlzLl9saXN0ZW5lcnNbZXZdLnB1c2goaGFuZGxlcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBjdXN0b20gZXZlbnQgbGlzdGVuZXIgKi9cbiAgb2ZmKGV2LCBoYW5kbGVyKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbZXZdKSByZXR1cm4gdGhpcztcbiAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcnNbZXZdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNvbnN0IGhJbmRleCA9IHRoaXMuX2xpc3RlbmVyc1tldl0uaW5kZXhPZihoYW5kbGVyKTtcbiAgICBpZiAoaEluZGV4ID49IDApIHRoaXMuX2xpc3RlbmVyc1tldl0uc3BsaWNlKGhJbmRleCwgMSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogSGFuZGxlcyB2aWV3IGlucHV0IGV2ZW50ICovXG4gIF9vbklucHV0KGUpIHtcbiAgICB0aGlzLl9pbnB1dEV2ZW50ID0gZTtcbiAgICB0aGlzLl9hYm9ydFVwZGF0ZUN1cnNvcigpO1xuXG4gICAgLy8gZml4IHN0cmFuZ2UgSUUgYmVoYXZpb3JcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbikgcmV0dXJuIHRoaXMudXBkYXRlVmFsdWUoKTtcbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IEFjdGlvbkRldGFpbHMoXG4gICAgLy8gbmV3IHN0YXRlXG4gICAgdGhpcy5lbC52YWx1ZSwgdGhpcy5jdXJzb3JQb3MsXG4gICAgLy8gb2xkIHN0YXRlXG4gICAgdGhpcy5kaXNwbGF5VmFsdWUsIHRoaXMuX3NlbGVjdGlvbik7XG4gICAgY29uc3Qgb2xkUmF3VmFsdWUgPSB0aGlzLm1hc2tlZC5yYXdJbnB1dFZhbHVlO1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMubWFza2VkLnNwbGljZShkZXRhaWxzLnN0YXJ0Q2hhbmdlUG9zLCBkZXRhaWxzLnJlbW92ZWQubGVuZ3RoLCBkZXRhaWxzLmluc2VydGVkLCBkZXRhaWxzLnJlbW92ZURpcmVjdGlvbiwge1xuICAgICAgaW5wdXQ6IHRydWUsXG4gICAgICByYXc6IHRydWVcbiAgICB9KS5vZmZzZXQ7XG5cbiAgICAvLyBmb3JjZSBhbGlnbiBpbiByZW1vdmUgZGlyZWN0aW9uIG9ubHkgaWYgbm8gaW5wdXQgY2hhcnMgd2VyZSByZW1vdmVkXG4gICAgLy8gb3RoZXJ3aXNlIHdlIHN0aWxsIG5lZWQgdG8gYWxpZ24gd2l0aCBOT05FICh0byBnZXQgb3V0IGZyb20gZml4ZWQgc3ltYm9scyBmb3IgaW5zdGFuY2UpXG4gICAgY29uc3QgcmVtb3ZlRGlyZWN0aW9uID0gb2xkUmF3VmFsdWUgPT09IHRoaXMubWFza2VkLnJhd0lucHV0VmFsdWUgPyBkZXRhaWxzLnJlbW92ZURpcmVjdGlvbiA6IERJUkVDVElPTi5OT05FO1xuICAgIGxldCBjdXJzb3JQb3MgPSB0aGlzLm1hc2tlZC5uZWFyZXN0SW5wdXRQb3MoZGV0YWlscy5zdGFydENoYW5nZVBvcyArIG9mZnNldCwgcmVtb3ZlRGlyZWN0aW9uKTtcbiAgICBpZiAocmVtb3ZlRGlyZWN0aW9uICE9PSBESVJFQ1RJT04uTk9ORSkgY3Vyc29yUG9zID0gdGhpcy5tYXNrZWQubmVhcmVzdElucHV0UG9zKGN1cnNvclBvcywgRElSRUNUSU9OLk5PTkUpO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbCgpO1xuICAgIHRoaXMudXBkYXRlQ3Vyc29yKGN1cnNvclBvcyk7XG4gICAgZGVsZXRlIHRoaXMuX2lucHV0RXZlbnQ7XG4gIH1cblxuICAvKiogSGFuZGxlcyB2aWV3IGNoYW5nZSBldmVudCBhbmQgY29tbWl0cyBtb2RlbCB2YWx1ZSAqL1xuICBfb25DaGFuZ2UoKSB7XG4gICAgaWYgKHRoaXMuZGlzcGxheVZhbHVlICE9PSB0aGlzLmVsLnZhbHVlKSB7XG4gICAgICB0aGlzLnVwZGF0ZVZhbHVlKCk7XG4gICAgfVxuICAgIHRoaXMubWFza2VkLmRvQ29tbWl0KCk7XG4gICAgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gICAgdGhpcy5fc2F2ZVNlbGVjdGlvbigpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdmlldyBkcm9wIGV2ZW50LCBwcmV2ZW50cyBieSBkZWZhdWx0ICovXG4gIF9vbkRyb3AoZXYpIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgLyoqIFJlc3RvcmUgbGFzdCBzZWxlY3Rpb24gb24gZm9jdXMgKi9cbiAgX29uRm9jdXMoZXYpIHtcbiAgICB0aGlzLmFsaWduQ3Vyc29yRnJpZW5kbHkoKTtcbiAgfVxuXG4gIC8qKiBSZXN0b3JlIGxhc3Qgc2VsZWN0aW9uIG9uIGZvY3VzICovXG4gIF9vbkNsaWNrKGV2KSB7XG4gICAgdGhpcy5hbGlnbkN1cnNvckZyaWVuZGx5KCk7XG4gIH1cblxuICAvKiogVW5iaW5kIHZpZXcgZXZlbnRzIGFuZCByZW1vdmVzIGVsZW1lbnQgcmVmZXJlbmNlICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdW5iaW5kRXZlbnRzKCk7XG4gICAgLy8gJEZsb3dGaXhNZSB3aHkgbm90IGRvIHNvP1xuICAgIHRoaXMuX2xpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBkZWxldGUgdGhpcy5lbDtcbiAgfVxufVxuSU1hc2suSW5wdXRNYXNrID0gSW5wdXRNYXNrO1xuXG5leHBvcnQgeyBJbnB1dE1hc2sgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcblxuLyoqXG4gIEdlbmVyaWMgZWxlbWVudCBBUEkgdG8gdXNlIHdpdGggbWFza1xuICBAaW50ZXJmYWNlXG4qL1xuY2xhc3MgTWFza0VsZW1lbnQge1xuICAvKiogKi9cblxuICAvKiogKi9cblxuICAvKiogKi9cblxuICAvKiogU2FmZWx5IHJldHVybnMgc2VsZWN0aW9uIHN0YXJ0ICovXG4gIGdldCBzZWxlY3Rpb25TdGFydCgpIHtcbiAgICBsZXQgc3RhcnQ7XG4gICAgdHJ5IHtcbiAgICAgIHN0YXJ0ID0gdGhpcy5fdW5zYWZlU2VsZWN0aW9uU3RhcnQ7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gc3RhcnQgIT0gbnVsbCA/IHN0YXJ0IDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gIH1cblxuICAvKiogU2FmZWx5IHJldHVybnMgc2VsZWN0aW9uIGVuZCAqL1xuICBnZXQgc2VsZWN0aW9uRW5kKCkge1xuICAgIGxldCBlbmQ7XG4gICAgdHJ5IHtcbiAgICAgIGVuZCA9IHRoaXMuX3Vuc2FmZVNlbGVjdGlvbkVuZDtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBlbmQgIT0gbnVsbCA/IGVuZCA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICB9XG5cbiAgLyoqIFNhZmVseSBzZXRzIGVsZW1lbnQgc2VsZWN0aW9uICovXG4gIHNlbGVjdChzdGFydCwgZW5kKSB7XG4gICAgaWYgKHN0YXJ0ID09IG51bGwgfHwgZW5kID09IG51bGwgfHwgc3RhcnQgPT09IHRoaXMuc2VsZWN0aW9uU3RhcnQgJiYgZW5kID09PSB0aGlzLnNlbGVjdGlvbkVuZCkgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl91bnNhZmVTZWxlY3Qoc3RhcnQsIGVuZCk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuXG4gIC8qKiBTaG91bGQgYmUgb3ZlcnJpZGVuIGluIHN1YmNsYXNzZXMgKi9cbiAgX3Vuc2FmZVNlbGVjdChzdGFydCwgZW5kKSB7fVxuICAvKiogU2hvdWxkIGJlIG92ZXJyaWRlbiBpbiBzdWJjbGFzc2VzICovXG4gIGdldCBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLyoqIFNob3VsZCBiZSBvdmVycmlkZW4gaW4gc3ViY2xhc3NlcyAqL1xuICBiaW5kRXZlbnRzKGhhbmRsZXJzKSB7fVxuICAvKiogU2hvdWxkIGJlIG92ZXJyaWRlbiBpbiBzdWJjbGFzc2VzICovXG4gIHVuYmluZEV2ZW50cygpIHt9XG59XG5JTWFzay5NYXNrRWxlbWVudCA9IE1hc2tFbGVtZW50O1xuXG5leHBvcnQgeyBNYXNrRWxlbWVudCBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBESVJFQ1RJT04gfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAnLi9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vaG9sZGVyLmpzJztcblxuLyoqIFByb3ZpZGVzIGRldGFpbHMgb2YgY2hhbmdpbmcgaW5wdXQgKi9cbmNsYXNzIEFjdGlvbkRldGFpbHMge1xuICAvKiogQ3VycmVudCBpbnB1dCB2YWx1ZSAqL1xuXG4gIC8qKiBDdXJyZW50IGN1cnNvciBwb3NpdGlvbiAqL1xuXG4gIC8qKiBPbGQgaW5wdXQgdmFsdWUgKi9cblxuICAvKiogT2xkIHNlbGVjdGlvbiAqL1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlLCBjdXJzb3JQb3MsIG9sZFZhbHVlLCBvbGRTZWxlY3Rpb24pIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5jdXJzb3JQb3MgPSBjdXJzb3JQb3M7XG4gICAgdGhpcy5vbGRWYWx1ZSA9IG9sZFZhbHVlO1xuICAgIHRoaXMub2xkU2VsZWN0aW9uID0gb2xkU2VsZWN0aW9uO1xuXG4gICAgLy8gZG91YmxlIGNoZWNrIGlmIGxlZnQgcGFydCB3YXMgY2hhbmdlZCAoYXV0b2ZpbGxpbmcsIG90aGVyIG5vbi1zdGFuZGFyZCBpbnB1dCB0cmlnZ2VycylcbiAgICB3aGlsZSAodGhpcy52YWx1ZS5zbGljZSgwLCB0aGlzLnN0YXJ0Q2hhbmdlUG9zKSAhPT0gdGhpcy5vbGRWYWx1ZS5zbGljZSgwLCB0aGlzLnN0YXJ0Q2hhbmdlUG9zKSkge1xuICAgICAgLS10aGlzLm9sZFNlbGVjdGlvbi5zdGFydDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBTdGFydCBjaGFuZ2luZyBwb3NpdGlvblxuICAgIEByZWFkb25seVxuICAqL1xuICBnZXQgc3RhcnRDaGFuZ2VQb3MoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKHRoaXMuY3Vyc29yUG9zLCB0aGlzLm9sZFNlbGVjdGlvbi5zdGFydCk7XG4gIH1cblxuICAvKipcbiAgICBJbnNlcnRlZCBzeW1ib2xzIGNvdW50XG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCBpbnNlcnRlZENvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmN1cnNvclBvcyAtIHRoaXMuc3RhcnRDaGFuZ2VQb3M7XG4gIH1cblxuICAvKipcbiAgICBJbnNlcnRlZCBzeW1ib2xzXG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCBpbnNlcnRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZS5zdWJzdHIodGhpcy5zdGFydENoYW5nZVBvcywgdGhpcy5pbnNlcnRlZENvdW50KTtcbiAgfVxuXG4gIC8qKlxuICAgIFJlbW92ZWQgc3ltYm9scyBjb3VudFxuICAgIEByZWFkb25seVxuICAqL1xuICBnZXQgcmVtb3ZlZENvdW50KCkge1xuICAgIC8vIE1hdGgubWF4IGZvciBvcHBvc2l0ZSBvcGVyYXRpb25cbiAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5vbGRTZWxlY3Rpb24uZW5kIC0gdGhpcy5zdGFydENoYW5nZVBvcyB8fFxuICAgIC8vIGZvciBEZWxldGVcbiAgICB0aGlzLm9sZFZhbHVlLmxlbmd0aCAtIHRoaXMudmFsdWUubGVuZ3RoLCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgIFJlbW92ZWQgc3ltYm9sc1xuICAgIEByZWFkb25seVxuICAqL1xuICBnZXQgcmVtb3ZlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5vbGRWYWx1ZS5zdWJzdHIodGhpcy5zdGFydENoYW5nZVBvcywgdGhpcy5yZW1vdmVkQ291bnQpO1xuICB9XG5cbiAgLyoqXG4gICAgVW5jaGFuZ2VkIGhlYWQgc3ltYm9sc1xuICAgIEByZWFkb25seVxuICAqL1xuICBnZXQgaGVhZCgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZS5zdWJzdHJpbmcoMCwgdGhpcy5zdGFydENoYW5nZVBvcyk7XG4gIH1cblxuICAvKipcbiAgICBVbmNoYW5nZWQgdGFpbCBzeW1ib2xzXG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCB0YWlsKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLnN1YnN0cmluZyh0aGlzLnN0YXJ0Q2hhbmdlUG9zICsgdGhpcy5pbnNlcnRlZENvdW50KTtcbiAgfVxuXG4gIC8qKlxuICAgIFJlbW92ZSBkaXJlY3Rpb25cbiAgICBAcmVhZG9ubHlcbiAgKi9cbiAgZ2V0IHJlbW92ZURpcmVjdGlvbigpIHtcbiAgICBpZiAoIXRoaXMucmVtb3ZlZENvdW50IHx8IHRoaXMuaW5zZXJ0ZWRDb3VudCkgcmV0dXJuIERJUkVDVElPTi5OT05FO1xuXG4gICAgLy8gYWxpZ24gcmlnaHQgaWYgZGVsZXRlIGF0IHJpZ2h0XG4gICAgcmV0dXJuICh0aGlzLm9sZFNlbGVjdGlvbi5lbmQgPT09IHRoaXMuY3Vyc29yUG9zIHx8IHRoaXMub2xkU2VsZWN0aW9uLnN0YXJ0ID09PSB0aGlzLmN1cnNvclBvcykgJiZcbiAgICAvLyBpZiBub3QgcmFuZ2UgcmVtb3ZlZCAoZXZlbnQgd2l0aCBiYWNrc3BhY2UpXG4gICAgdGhpcy5vbGRTZWxlY3Rpb24uZW5kID09PSB0aGlzLm9sZFNlbGVjdGlvbi5zdGFydCA/IERJUkVDVElPTi5SSUdIVCA6IERJUkVDVElPTi5MRUZUO1xuICB9XG59XG5cbmV4cG9ydCB7IEFjdGlvbkRldGFpbHMgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IElNYXNrIGZyb20gJy4vaG9sZGVyLmpzJztcblxuLyoqXG4gIFByb3ZpZGVzIGRldGFpbHMgb2YgY2hhbmdpbmcgbW9kZWwgdmFsdWVcbiAgQHBhcmFtIHtPYmplY3R9IFtkZXRhaWxzXVxuICBAcGFyYW0ge3N0cmluZ30gW2RldGFpbHMuaW5zZXJ0ZWRdIC0gSW5zZXJ0ZWQgc3ltYm9sc1xuICBAcGFyYW0ge2Jvb2xlYW59IFtkZXRhaWxzLnNraXBdIC0gQ2FuIHNraXAgY2hhcnNcbiAgQHBhcmFtIHtudW1iZXJ9IFtkZXRhaWxzLnJlbW92ZUNvdW50XSAtIFJlbW92ZWQgc3ltYm9scyBjb3VudFxuICBAcGFyYW0ge251bWJlcn0gW2RldGFpbHMudGFpbFNoaWZ0XSAtIEFkZGl0aW9uYWwgb2Zmc2V0IGlmIGFueSBjaGFuZ2VzIG9jY3VycmVkIGJlZm9yZSB0YWlsXG4qL1xuY2xhc3MgQ2hhbmdlRGV0YWlscyB7XG4gIC8qKiBJbnNlcnRlZCBzeW1ib2xzICovXG5cbiAgLyoqIENhbiBza2lwIGNoYXJzICovXG5cbiAgLyoqIEFkZGl0aW9uYWwgb2Zmc2V0IGlmIGFueSBjaGFuZ2VzIG9jY3VycmVkIGJlZm9yZSB0YWlsICovXG5cbiAgLyoqIFJhdyBpbnNlcnRlZCBpcyB1c2VkIGJ5IGR5bmFtaWMgbWFzayAqL1xuXG4gIGNvbnN0cnVjdG9yKGRldGFpbHMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgIGluc2VydGVkOiAnJyxcbiAgICAgIHJhd0luc2VydGVkOiAnJyxcbiAgICAgIHNraXA6IGZhbHNlLFxuICAgICAgdGFpbFNoaWZ0OiAwXG4gICAgfSwgZGV0YWlscyk7XG4gIH1cblxuICAvKipcbiAgICBBZ2dyZWdhdGUgY2hhbmdlc1xuICAgIEByZXR1cm5zIHtDaGFuZ2VEZXRhaWxzfSBgdGhpc2BcbiAgKi9cbiAgYWdncmVnYXRlKGRldGFpbHMpIHtcbiAgICB0aGlzLnJhd0luc2VydGVkICs9IGRldGFpbHMucmF3SW5zZXJ0ZWQ7XG4gICAgdGhpcy5za2lwID0gdGhpcy5za2lwIHx8IGRldGFpbHMuc2tpcDtcbiAgICB0aGlzLmluc2VydGVkICs9IGRldGFpbHMuaW5zZXJ0ZWQ7XG4gICAgdGhpcy50YWlsU2hpZnQgKz0gZGV0YWlscy50YWlsU2hpZnQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogVG90YWwgb2Zmc2V0IGNvbnNpZGVyaW5nIGFsbCBjaGFuZ2VzICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFpbFNoaWZ0ICsgdGhpcy5pbnNlcnRlZC5sZW5ndGg7XG4gIH1cbn1cbklNYXNrLkNoYW5nZURldGFpbHMgPSBDaGFuZ2VEZXRhaWxzO1xuXG5leHBvcnQgeyBDaGFuZ2VEZXRhaWxzIGFzIGRlZmF1bHQgfTtcbiIsIi8qKiBQcm92aWRlcyBkZXRhaWxzIG9mIGNvbnRpbnVvdXMgZXh0cmFjdGVkIHRhaWwgKi9cbmNsYXNzIENvbnRpbnVvdXNUYWlsRGV0YWlscyB7XG4gIC8qKiBUYWlsIHZhbHVlIGFzIHN0cmluZyAqL1xuXG4gIC8qKiBUYWlsIHN0YXJ0IHBvc2l0aW9uICovXG5cbiAgLyoqIFN0YXJ0IHBvc2l0aW9uICovXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IHZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnJztcbiAgICBsZXQgZnJvbSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgICBsZXQgc3RvcCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmZyb20gPSBmcm9tO1xuICAgIHRoaXMuc3RvcCA9IHN0b3A7XG4gIH1cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cbiAgZXh0ZW5kKHRhaWwpIHtcbiAgICB0aGlzLnZhbHVlICs9IFN0cmluZyh0YWlsKTtcbiAgfVxuICBhcHBlbmRUbyhtYXNrZWQpIHtcbiAgICByZXR1cm4gbWFza2VkLmFwcGVuZCh0aGlzLnRvU3RyaW5nKCksIHtcbiAgICAgIHRhaWw6IHRydWVcbiAgICB9KS5hZ2dyZWdhdGUobWFza2VkLl9hcHBlbmRQbGFjZWhvbGRlcigpKTtcbiAgfVxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgZnJvbTogdGhpcy5mcm9tLFxuICAgICAgc3RvcDogdGhpcy5zdG9wXG4gICAgfTtcbiAgfVxuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHN0YXRlKTtcbiAgfVxuICB1bnNoaWZ0KGJlZm9yZVBvcykge1xuICAgIGlmICghdGhpcy52YWx1ZS5sZW5ndGggfHwgYmVmb3JlUG9zICE9IG51bGwgJiYgdGhpcy5mcm9tID49IGJlZm9yZVBvcykgcmV0dXJuICcnO1xuICAgIGNvbnN0IHNoaWZ0Q2hhciA9IHRoaXMudmFsdWVbMF07XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuc2xpY2UoMSk7XG4gICAgcmV0dXJuIHNoaWZ0Q2hhcjtcbiAgfVxuICBzaGlmdCgpIHtcbiAgICBpZiAoIXRoaXMudmFsdWUubGVuZ3RoKSByZXR1cm4gJyc7XG4gICAgY29uc3Qgc2hpZnRDaGFyID0gdGhpcy52YWx1ZVt0aGlzLnZhbHVlLmxlbmd0aCAtIDFdO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICByZXR1cm4gc2hpZnRDaGFyO1xuICB9XG59XG5cbmV4cG9ydCB7IENvbnRpbnVvdXNUYWlsRGV0YWlscyBhcyBkZWZhdWx0IH07XG4iLCIvKipcbiAqIEFwcGxpZXMgbWFzayBvbiBlbGVtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR8SFRNTFRleHRBcmVhRWxlbWVudHxNYXNrRWxlbWVudH0gZWwgLSBFbGVtZW50IHRvIGFwcGx5IG1hc2tcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gQ3VzdG9tIG1hc2sgb3B0aW9uc1xuICogQHJldHVybiB7SW5wdXRNYXNrfVxuICovXG5mdW5jdGlvbiBJTWFzayhlbCkge1xuICBsZXQgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIC8vIGN1cnJlbnRseSBhdmFpbGFibGUgb25seSBmb3IgaW5wdXQtbGlrZSBlbGVtZW50c1xuICByZXR1cm4gbmV3IElNYXNrLklucHV0TWFzayhlbCwgb3B0cyk7XG59XG5cbmV4cG9ydCB7IElNYXNrIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCBDaGFuZ2VEZXRhaWxzIGZyb20gJy4vY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuL2hvbGRlci5qcyc7XG5cbi8qKiBDaGVja3MgaWYgdmFsdWUgaXMgc3RyaW5nICovXG5mdW5jdGlvbiBpc1N0cmluZyhzdHIpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnIHx8IHN0ciBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxuLyoqXG4gIERpcmVjdGlvblxuICBAcHJvcCB7c3RyaW5nfSBOT05FXG4gIEBwcm9wIHtzdHJpbmd9IExFRlRcbiAgQHByb3Age3N0cmluZ30gRk9SQ0VfTEVGVFxuICBAcHJvcCB7c3RyaW5nfSBSSUdIVFxuICBAcHJvcCB7c3RyaW5nfSBGT1JDRV9SSUdIVFxuKi9cbmNvbnN0IERJUkVDVElPTiA9IHtcbiAgTk9ORTogJ05PTkUnLFxuICBMRUZUOiAnTEVGVCcsXG4gIEZPUkNFX0xFRlQ6ICdGT1JDRV9MRUZUJyxcbiAgUklHSFQ6ICdSSUdIVCcsXG4gIEZPUkNFX1JJR0hUOiAnRk9SQ0VfUklHSFQnXG59O1xuLyoqXG4gIERpcmVjdGlvblxuICBAZW51bSB7c3RyaW5nfVxuKi9cblxuLyoqIFJldHVybnMgbmV4dCBjaGFyIGluZGV4IGluIGRpcmVjdGlvbiAqL1xuZnVuY3Rpb24gaW5kZXhJbkRpcmVjdGlvbihwb3MsIGRpcmVjdGlvbikge1xuICBpZiAoZGlyZWN0aW9uID09PSBESVJFQ1RJT04uTEVGVCkgLS1wb3M7XG4gIHJldHVybiBwb3M7XG59XG5cbi8qKiBSZXR1cm5zIG5leHQgY2hhciBwb3NpdGlvbiBpbiBkaXJlY3Rpb24gKi9cbmZ1bmN0aW9uIHBvc0luRGlyZWN0aW9uKHBvcywgZGlyZWN0aW9uKSB7XG4gIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcbiAgICBjYXNlIERJUkVDVElPTi5GT1JDRV9MRUZUOlxuICAgICAgcmV0dXJuIC0tcG9zO1xuICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxuICAgIGNhc2UgRElSRUNUSU9OLkZPUkNFX1JJR0hUOlxuICAgICAgcmV0dXJuICsrcG9zO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gcG9zO1xuICB9XG59XG5cbi8qKiAqL1xuZnVuY3Rpb24gZm9yY2VEaXJlY3Rpb24oZGlyZWN0aW9uKSB7XG4gIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcbiAgICAgIHJldHVybiBESVJFQ1RJT04uRk9SQ0VfTEVGVDtcbiAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcbiAgICAgIHJldHVybiBESVJFQ1RJT04uRk9SQ0VfUklHSFQ7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gIH1cbn1cblxuLyoqIEVzY2FwZXMgcmVndWxhciBleHByZXNzaW9uIGNvbnRyb2wgY2hhcnMgKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59XG5mdW5jdGlvbiBub3JtYWxpemVQcmVwYXJlKHByZXApIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkocHJlcCkgPyBwcmVwIDogW3ByZXAsIG5ldyBDaGFuZ2VEZXRhaWxzKCldO1xufVxuXG4vLyBjbG9uZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXBvYmVyZXpraW4vZmFzdC1kZWVwLWVxdWFsIHdpdGggc21hbGwgY2hhbmdlc1xuZnVuY3Rpb24gb2JqZWN0SW5jbHVkZXMoYiwgYSkge1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHRydWU7XG4gIHZhciBhcnJBID0gQXJyYXkuaXNBcnJheShhKSxcbiAgICBhcnJCID0gQXJyYXkuaXNBcnJheShiKSxcbiAgICBpO1xuICBpZiAoYXJyQSAmJiBhcnJCKSB7XG4gICAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIGlmICghb2JqZWN0SW5jbHVkZXMoYVtpXSwgYltpXSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYXJyQSAhPSBhcnJCKSByZXR1cm4gZmFsc2U7XG4gIGlmIChhICYmIGIgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnICYmIHR5cGVvZiBiID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBkYXRlQSA9IGEgaW5zdGFuY2VvZiBEYXRlLFxuICAgICAgZGF0ZUIgPSBiIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBpZiAoZGF0ZUEgJiYgZGF0ZUIpIHJldHVybiBhLmdldFRpbWUoKSA9PSBiLmdldFRpbWUoKTtcbiAgICBpZiAoZGF0ZUEgIT0gZGF0ZUIpIHJldHVybiBmYWxzZTtcbiAgICB2YXIgcmVnZXhwQSA9IGEgaW5zdGFuY2VvZiBSZWdFeHAsXG4gICAgICByZWdleHBCID0gYiBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgICBpZiAocmVnZXhwQSAmJiByZWdleHBCKSByZXR1cm4gYS50b1N0cmluZygpID09IGIudG9TdHJpbmcoKTtcbiAgICBpZiAocmVnZXhwQSAhPSByZWdleHBCKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgICAvLyBpZiAoa2V5cy5sZW5ndGggIT09IE9iamVjdC5rZXlzKGIpLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspXG4gICAgLy8gJEZsb3dGaXhNZSAuLi4gPz8/XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwga2V5c1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykgaWYgKCFvYmplY3RJbmNsdWRlcyhiW2tleXNbaV1dLCBhW2tleXNbaV1dKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGEgJiYgYiAmJiB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBhLnRvU3RyaW5nKCkgPT09IGIudG9TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKiBTZWxlY3Rpb24gcmFuZ2UgKi9cblxuZXhwb3J0IHsgRElSRUNUSU9OLCBlc2NhcGVSZWdFeHAsIGZvcmNlRGlyZWN0aW9uLCBpbmRleEluRGlyZWN0aW9uLCBpc1N0cmluZywgbm9ybWFsaXplUHJlcGFyZSwgb2JqZWN0SW5jbHVkZXMsIHBvc0luRGlyZWN0aW9uIH07XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIElucHV0TWFzayB9IGZyb20gJy4vY29udHJvbHMvaW5wdXQuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4vY29yZS9ob2xkZXIuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCB9IGZyb20gJy4vY29yZS9ob2xkZXIuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXNrZWQgfSBmcm9tICcuL21hc2tlZC9iYXNlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWFza2VkUGF0dGVybiB9IGZyb20gJy4vbWFza2VkL3BhdHRlcm4uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXNrZWRFbnVtIH0gZnJvbSAnLi9tYXNrZWQvZW51bS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hc2tlZFJhbmdlIH0gZnJvbSAnLi9tYXNrZWQvcmFuZ2UuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXNrZWROdW1iZXIgfSBmcm9tICcuL21hc2tlZC9udW1iZXIuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXNrZWREYXRlIH0gZnJvbSAnLi9tYXNrZWQvZGF0ZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hc2tlZFJlZ0V4cCB9IGZyb20gJy4vbWFza2VkL3JlZ2V4cC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hc2tlZEZ1bmN0aW9uIH0gZnJvbSAnLi9tYXNrZWQvZnVuY3Rpb24uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXNrZWREeW5hbWljIH0gZnJvbSAnLi9tYXNrZWQvZHluYW1pYy5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNyZWF0ZU1hc2sgfSBmcm9tICcuL21hc2tlZC9mYWN0b3J5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWFza0VsZW1lbnQgfSBmcm9tICcuL2NvbnRyb2xzL21hc2stZWxlbWVudC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEhUTUxNYXNrRWxlbWVudCB9IGZyb20gJy4vY29udHJvbHMvaHRtbC1tYXNrLWVsZW1lbnQuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBIVE1MQ29udGVudGVkaXRhYmxlTWFza0VsZW1lbnQgfSBmcm9tICcuL2NvbnRyb2xzL2h0bWwtY29udGVudGVkaXRhYmxlLW1hc2stZWxlbWVudC5qcyc7XG5leHBvcnQgeyBQSVBFX1RZUEUsIGNyZWF0ZVBpcGUsIHBpcGUgfSBmcm9tICcuL21hc2tlZC9waXBlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hhbmdlRGV0YWlscyB9IGZyb20gJy4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy02YjNiZDQwNC5qcyc7XG5pbXBvcnQgJy4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgJy4vY29yZS9hY3Rpb24tZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vbWFza2VkL3BhdHRlcm4vaW5wdXQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgJy4vbWFza2VkL3BhdHRlcm4vZml4ZWQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgJy4vbWFza2VkL3BhdHRlcm4vY2h1bmstdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9tYXNrZWQvcGF0dGVybi9jdXJzb3IuanMnO1xuXG50cnkge1xuICBnbG9iYWxUaGlzLklNYXNrID0gSU1hc2s7XG59IGNhdGNoIChlKSB7fVxuIiwiaW1wb3J0IENoYW5nZURldGFpbHMgZnJvbSAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgQ29udGludW91c1RhaWxEZXRhaWxzIGZyb20gJy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0IHsgaXNTdHJpbmcsIG5vcm1hbGl6ZVByZXBhcmUsIERJUkVDVElPTiwgZm9yY2VEaXJlY3Rpb24gfSBmcm9tICcuLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCBJTWFzayBmcm9tICcuLi9jb3JlL2hvbGRlci5qcyc7XG5cbi8qKiBTdXBwb3J0ZWQgbWFzayB0eXBlICovXG5cbi8qKiBBcHBlbmQgZmxhZ3MgKi9cblxuLyoqIEV4dHJhY3QgZmxhZ3MgKi9cblxuLyoqIFByb3ZpZGVzIGNvbW1vbiBtYXNraW5nIHN0dWZmICovXG5jbGFzcyBNYXNrZWQge1xuICAvLyAkU2hhcGU8TWFza2VkT3B0aW9ucz47IFRPRE8gYWZ0ZXIgZml4IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy80NzczXG5cbiAgLyoqIEB0eXBlIHtNYXNrfSAqL1xuXG4gIC8qKiAqLyAvLyAkRmxvd0ZpeE1lIG5vIGlkZWFzXG4gIC8qKiBUcmFuc2Zvcm1zIHZhbHVlIGJlZm9yZSBtYXNrIHByb2Nlc3NpbmcgKi9cbiAgLyoqIFZhbGlkYXRlcyBpZiB2YWx1ZSBpcyBhY2NlcHRhYmxlICovXG4gIC8qKiBEb2VzIGFkZGl0aW9uYWwgcHJvY2Vzc2luZyBpbiB0aGUgZW5kIG9mIGVkaXRpbmcgKi9cbiAgLyoqIEZvcm1hdCB0eXBlZCB2YWx1ZSB0byBzdHJpbmcgKi9cbiAgLyoqIFBhcnNlIHN0cmdpbiB0byBnZXQgdHlwZWQgdmFsdWUgKi9cbiAgLyoqIEVuYWJsZSBjaGFyYWN0ZXJzIG92ZXJ3cml0aW5nICovXG4gIC8qKiAqL1xuICAvKiogKi9cbiAgLyoqICovXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICB0aGlzLl92YWx1ZSA9ICcnO1xuICAgIHRoaXMuX3VwZGF0ZShPYmplY3QuYXNzaWduKHt9LCBNYXNrZWQuREVGQVVMVFMsIG9wdHMpKTtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqIFNldHMgYW5kIGFwcGxpZXMgbmV3IG9wdGlvbnMgKi9cbiAgdXBkYXRlT3B0aW9ucyhvcHRzKSB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyhvcHRzKS5sZW5ndGgpIHJldHVybjtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgdGhpcy53aXRoVmFsdWVSZWZyZXNoKHRoaXMuX3VwZGF0ZS5iaW5kKHRoaXMsIG9wdHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgIFNldHMgbmV3IG9wdGlvbnNcbiAgICBAcHJvdGVjdGVkXG4gICovXG4gIF91cGRhdGUob3B0cykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0cyk7XG4gIH1cblxuICAvKiogTWFzayBzdGF0ZSAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIF92YWx1ZTogdGhpcy52YWx1ZVxuICAgIH07XG4gIH1cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBzdGF0ZS5fdmFsdWU7XG4gIH1cblxuICAvKiogUmVzZXRzIHZhbHVlICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX3ZhbHVlID0gJyc7XG4gIH1cblxuICAvKiogKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLnJlc29sdmUodmFsdWUpO1xuICB9XG5cbiAgLyoqIFJlc29sdmUgbmV3IHZhbHVlICovXG4gIHJlc29sdmUodmFsdWUpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5hcHBlbmQodmFsdWUsIHtcbiAgICAgIGlucHV0OiB0cnVlXG4gICAgfSwgJycpO1xuICAgIHRoaXMuZG9Db21taXQoKTtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKiAqL1xuICBnZXQgdW5tYXNrZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuICBzZXQgdW5tYXNrZWRWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLmFwcGVuZCh2YWx1ZSwge30sICcnKTtcbiAgICB0aGlzLmRvQ29tbWl0KCk7XG4gIH1cblxuICAvKiogKi9cbiAgZ2V0IHR5cGVkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9QYXJzZSh0aGlzLnZhbHVlKTtcbiAgfVxuICBzZXQgdHlwZWRWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLmRvRm9ybWF0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBWYWx1ZSB0aGF0IGluY2x1ZGVzIHJhdyB1c2VyIGlucHV0ICovXG4gIGdldCByYXdJbnB1dFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmV4dHJhY3RJbnB1dCgwLCB0aGlzLnZhbHVlLmxlbmd0aCwge1xuICAgICAgcmF3OiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgc2V0IHJhd0lucHV0VmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5hcHBlbmQodmFsdWUsIHtcbiAgICAgIHJhdzogdHJ1ZVxuICAgIH0sICcnKTtcbiAgICB0aGlzLmRvQ29tbWl0KCk7XG4gIH1cbiAgZ2V0IGRpc3BsYXlWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKiAqL1xuICBnZXQgaXNDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKiAqL1xuICBnZXQgaXNGaWxsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNDb21wbGV0ZTtcbiAgfVxuXG4gIC8qKiBGaW5kcyBuZWFyZXN0IGlucHV0IHBvc2l0aW9uIGluIGRpcmVjdGlvbiAqL1xuICBuZWFyZXN0SW5wdXRQb3MoY3Vyc29yUG9zLCBkaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gY3Vyc29yUG9zO1xuICB9XG4gIHRvdGFsSW5wdXRQb3NpdGlvbnMoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy52YWx1ZS5sZW5ndGgsIHRvUG9zIC0gZnJvbVBvcyk7XG4gIH1cblxuICAvKiogRXh0cmFjdHMgdmFsdWUgaW4gcmFuZ2UgY29uc2lkZXJpbmcgZmxhZ3MgKi9cbiAgZXh0cmFjdElucHV0KCkge1xuICAgIGxldCBmcm9tUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUuc2xpY2UoZnJvbVBvcywgdG9Qb3MpO1xuICB9XG5cbiAgLyoqIEV4dHJhY3RzIHRhaWwgaW4gcmFuZ2UgKi9cbiAgZXh0cmFjdFRhaWwoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IENvbnRpbnVvdXNUYWlsRGV0YWlscyh0aGlzLmV4dHJhY3RJbnB1dChmcm9tUG9zLCB0b1BvcyksIGZyb21Qb3MpO1xuICB9XG5cbiAgLyoqIEFwcGVuZHMgdGFpbCAqL1xuICAvLyAkRmxvd0ZpeE1lIG5vIGlkZWFzXG4gIGFwcGVuZFRhaWwodGFpbCkge1xuICAgIGlmIChpc1N0cmluZyh0YWlsKSkgdGFpbCA9IG5ldyBDb250aW51b3VzVGFpbERldGFpbHMoU3RyaW5nKHRhaWwpKTtcbiAgICByZXR1cm4gdGFpbC5hcHBlbmRUbyh0aGlzKTtcbiAgfVxuXG4gIC8qKiBBcHBlbmRzIGNoYXIgKi9cbiAgX2FwcGVuZENoYXJSYXcoY2gpIHtcbiAgICBpZiAoIWNoKSByZXR1cm4gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICB0aGlzLl92YWx1ZSArPSBjaDtcbiAgICByZXR1cm4gbmV3IENoYW5nZURldGFpbHMoe1xuICAgICAgaW5zZXJ0ZWQ6IGNoLFxuICAgICAgcmF3SW5zZXJ0ZWQ6IGNoXG4gICAgfSk7XG4gIH1cblxuICAvKiogQXBwZW5kcyBjaGFyICovXG4gIF9hcHBlbmRDaGFyKGNoKSB7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBsZXQgY2hlY2tUYWlsID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY29uc2lzdGVudFN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgZGV0YWlscztcbiAgICBbY2gsIGRldGFpbHNdID0gbm9ybWFsaXplUHJlcGFyZSh0aGlzLmRvUHJlcGFyZShjaCwgZmxhZ3MpKTtcbiAgICBkZXRhaWxzID0gZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5fYXBwZW5kQ2hhclJhdyhjaCwgZmxhZ3MpKTtcbiAgICBpZiAoZGV0YWlscy5pbnNlcnRlZCkge1xuICAgICAgbGV0IGNvbnNpc3RlbnRUYWlsO1xuICAgICAgbGV0IGFwcGVuZGVkID0gdGhpcy5kb1ZhbGlkYXRlKGZsYWdzKSAhPT0gZmFsc2U7XG4gICAgICBpZiAoYXBwZW5kZWQgJiYgY2hlY2tUYWlsICE9IG51bGwpIHtcbiAgICAgICAgLy8gdmFsaWRhdGlvbiBvaywgY2hlY2sgdGFpbFxuICAgICAgICBjb25zdCBiZWZvcmVUYWlsU3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICBpZiAodGhpcy5vdmVyd3JpdGUgPT09IHRydWUpIHtcbiAgICAgICAgICBjb25zaXN0ZW50VGFpbCA9IGNoZWNrVGFpbC5zdGF0ZTtcbiAgICAgICAgICBjaGVja1RhaWwudW5zaGlmdCh0aGlzLnZhbHVlLmxlbmd0aCAtIGRldGFpbHMudGFpbFNoaWZ0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdGFpbERldGFpbHMgPSB0aGlzLmFwcGVuZFRhaWwoY2hlY2tUYWlsKTtcbiAgICAgICAgYXBwZW5kZWQgPSB0YWlsRGV0YWlscy5yYXdJbnNlcnRlZCA9PT0gY2hlY2tUYWlsLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgLy8gbm90IG9rLCB0cnkgc2hpZnRcbiAgICAgICAgaWYgKCEoYXBwZW5kZWQgJiYgdGFpbERldGFpbHMuaW5zZXJ0ZWQpICYmIHRoaXMub3ZlcndyaXRlID09PSAnc2hpZnQnKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9IGJlZm9yZVRhaWxTdGF0ZTtcbiAgICAgICAgICBjb25zaXN0ZW50VGFpbCA9IGNoZWNrVGFpbC5zdGF0ZTtcbiAgICAgICAgICBjaGVja1RhaWwuc2hpZnQoKTtcbiAgICAgICAgICB0YWlsRGV0YWlscyA9IHRoaXMuYXBwZW5kVGFpbChjaGVja1RhaWwpO1xuICAgICAgICAgIGFwcGVuZGVkID0gdGFpbERldGFpbHMucmF3SW5zZXJ0ZWQgPT09IGNoZWNrVGFpbC50b1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgb2ssIHJvbGxiYWNrIHN0YXRlIGFmdGVyIHRhaWxcbiAgICAgICAgaWYgKGFwcGVuZGVkICYmIHRhaWxEZXRhaWxzLmluc2VydGVkKSB0aGlzLnN0YXRlID0gYmVmb3JlVGFpbFN0YXRlO1xuICAgICAgfVxuXG4gICAgICAvLyByZXZlcnQgYWxsIGlmIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICBpZiAoIWFwcGVuZGVkKSB7XG4gICAgICAgIGRldGFpbHMgPSBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgICAgICB0aGlzLnN0YXRlID0gY29uc2lzdGVudFN0YXRlO1xuICAgICAgICBpZiAoY2hlY2tUYWlsICYmIGNvbnNpc3RlbnRUYWlsKSBjaGVja1RhaWwuc3RhdGUgPSBjb25zaXN0ZW50VGFpbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cblxuICAvKiogQXBwZW5kcyBvcHRpb25hbCBwbGFjZWhvbGRlciBhdCBlbmQgKi9cbiAgX2FwcGVuZFBsYWNlaG9sZGVyKCkge1xuICAgIHJldHVybiBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICB9XG5cbiAgLyoqIEFwcGVuZHMgb3B0aW9uYWwgZWFnZXIgcGxhY2Vob2xkZXIgYXQgZW5kICovXG4gIF9hcHBlbmRFYWdlcigpIHtcbiAgICByZXR1cm4gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgfVxuXG4gIC8qKiBBcHBlbmRzIHN5bWJvbHMgY29uc2lkZXJpbmcgZmxhZ3MgKi9cbiAgLy8gJEZsb3dGaXhNZSBubyBpZGVhc1xuICBhcHBlbmQoc3RyLCBmbGFncywgdGFpbCkge1xuICAgIGlmICghaXNTdHJpbmcoc3RyKSkgdGhyb3cgbmV3IEVycm9yKCd2YWx1ZSBzaG91bGQgYmUgc3RyaW5nJyk7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgY29uc3QgY2hlY2tUYWlsID0gaXNTdHJpbmcodGFpbCkgPyBuZXcgQ29udGludW91c1RhaWxEZXRhaWxzKFN0cmluZyh0YWlsKSkgOiB0YWlsO1xuICAgIGlmIChmbGFncyAhPT0gbnVsbCAmJiBmbGFncyAhPT0gdm9pZCAwICYmIGZsYWdzLnRhaWwpIGZsYWdzLl9iZWZvcmVUYWlsU3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIGZvciAobGV0IGNpID0gMDsgY2kgPCBzdHIubGVuZ3RoOyArK2NpKSB7XG4gICAgICBjb25zdCBkID0gdGhpcy5fYXBwZW5kQ2hhcihzdHJbY2ldLCBmbGFncywgY2hlY2tUYWlsKTtcbiAgICAgIGlmICghZC5yYXdJbnNlcnRlZCAmJiAhdGhpcy5kb1NraXBJbnZhbGlkKHN0cltjaV0sIGZsYWdzLCBjaGVja1RhaWwpKSBicmVhaztcbiAgICAgIGRldGFpbHMuYWdncmVnYXRlKGQpO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZCB0YWlsIGJ1dCBhZ2dyZWdhdGUgb25seSB0YWlsU2hpZnRcbiAgICBpZiAoY2hlY2tUYWlsICE9IG51bGwpIHtcbiAgICAgIGRldGFpbHMudGFpbFNoaWZ0ICs9IHRoaXMuYXBwZW5kVGFpbChjaGVja1RhaWwpLnRhaWxTaGlmdDtcbiAgICAgIC8vIFRPRE8gaXQncyBhIGdvb2QgaWRlYSB0byBjbGVhciBzdGF0ZSBhZnRlciBhcHBlbmRpbmcgZW5kc1xuICAgICAgLy8gYnV0IGl0IGNhdXNlcyBidWdzIHdoZW4gb25lIGFwcGVuZCBjYWxscyBhbm90aGVyICh3aGVuIGR5bmFtaWMgZGlzcGF0Y2ggc2V0IHJhd0lucHV0VmFsdWUpXG4gICAgICAvLyB0aGlzLl9yZXNldEJlZm9yZVRhaWxTdGF0ZSgpO1xuICAgIH1cblxuICAgIGlmICgodGhpcy5lYWdlciA9PT0gdHJ1ZSB8fCB0aGlzLmVhZ2VyID09PSAnYXBwZW5kJykgJiYgZmxhZ3MgIT09IG51bGwgJiYgZmxhZ3MgIT09IHZvaWQgMCAmJiBmbGFncy5pbnB1dCAmJiBzdHIpIHtcbiAgICAgIGRldGFpbHMuYWdncmVnYXRlKHRoaXMuX2FwcGVuZEVhZ2VyKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuXG4gIC8qKiAqL1xuICByZW1vdmUoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMudmFsdWUuc2xpY2UoMCwgZnJvbVBvcykgKyB0aGlzLnZhbHVlLnNsaWNlKHRvUG9zKTtcbiAgICByZXR1cm4gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgfVxuXG4gIC8qKiBDYWxscyBmdW5jdGlvbiBhbmQgcmVhcHBsaWVzIGN1cnJlbnQgdmFsdWUgKi9cbiAgd2l0aFZhbHVlUmVmcmVzaChmbikge1xuICAgIGlmICh0aGlzLl9yZWZyZXNoaW5nIHx8ICF0aGlzLmlzSW5pdGlhbGl6ZWQpIHJldHVybiBmbigpO1xuICAgIHRoaXMuX3JlZnJlc2hpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJhd0lucHV0ID0gdGhpcy5yYXdJbnB1dFZhbHVlO1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICBjb25zdCByZXQgPSBmbigpO1xuICAgIHRoaXMucmF3SW5wdXRWYWx1ZSA9IHJhd0lucHV0O1xuICAgIC8vIGFwcGVuZCBsb3N0IHRyYWlsaW5nIGNoYXJzIGF0IGVuZFxuICAgIGlmICh0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUgIT09IHZhbHVlICYmIHZhbHVlLmluZGV4T2YodGhpcy52YWx1ZSkgPT09IDApIHtcbiAgICAgIHRoaXMuYXBwZW5kKHZhbHVlLnNsaWNlKHRoaXMudmFsdWUubGVuZ3RoKSwge30sICcnKTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuX3JlZnJlc2hpbmc7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKiAqL1xuICBydW5Jc29sYXRlZChmbikge1xuICAgIGlmICh0aGlzLl9pc29sYXRlZCB8fCAhdGhpcy5pc0luaXRpYWxpemVkKSByZXR1cm4gZm4odGhpcyk7XG4gICAgdGhpcy5faXNvbGF0ZWQgPSB0cnVlO1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCByZXQgPSBmbih0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgZGVsZXRlIHRoaXMuX2lzb2xhdGVkO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKiogKi9cbiAgZG9Ta2lwSW52YWxpZChjaCkge1xuICAgIHJldHVybiB0aGlzLnNraXBJbnZhbGlkO1xuICB9XG5cbiAgLyoqXG4gICAgUHJlcGFyZXMgc3RyaW5nIGJlZm9yZSBtYXNrIHByb2Nlc3NpbmdcbiAgICBAcHJvdGVjdGVkXG4gICovXG4gIGRvUHJlcGFyZShzdHIpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIHJldHVybiB0aGlzLnByZXBhcmUgPyB0aGlzLnByZXBhcmUoc3RyLCB0aGlzLCBmbGFncykgOiBzdHI7XG4gIH1cblxuICAvKipcbiAgICBWYWxpZGF0ZXMgaWYgdmFsdWUgaXMgYWNjZXB0YWJsZVxuICAgIEBwcm90ZWN0ZWRcbiAgKi9cbiAgZG9WYWxpZGF0ZShmbGFncykge1xuICAgIHJldHVybiAoIXRoaXMudmFsaWRhdGUgfHwgdGhpcy52YWxpZGF0ZSh0aGlzLnZhbHVlLCB0aGlzLCBmbGFncykpICYmICghdGhpcy5wYXJlbnQgfHwgdGhpcy5wYXJlbnQuZG9WYWxpZGF0ZShmbGFncykpO1xuICB9XG5cbiAgLyoqXG4gICAgRG9lcyBhZGRpdGlvbmFsIHByb2Nlc3NpbmcgaW4gdGhlIGVuZCBvZiBlZGl0aW5nXG4gICAgQHByb3RlY3RlZFxuICAqL1xuICBkb0NvbW1pdCgpIHtcbiAgICBpZiAodGhpcy5jb21taXQpIHRoaXMuY29tbWl0KHRoaXMudmFsdWUsIHRoaXMpO1xuICB9XG5cbiAgLyoqICovXG4gIGRvRm9ybWF0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0ID8gdGhpcy5mb3JtYXQodmFsdWUsIHRoaXMpIDogdmFsdWU7XG4gIH1cblxuICAvKiogKi9cbiAgZG9QYXJzZShzdHIpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZSA/IHRoaXMucGFyc2Uoc3RyLCB0aGlzKSA6IHN0cjtcbiAgfVxuXG4gIC8qKiAqL1xuICBzcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50LCBpbnNlcnRlZCwgcmVtb3ZlRGlyZWN0aW9uKSB7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiB7XG4gICAgICBpbnB1dDogdHJ1ZVxuICAgIH07XG4gICAgY29uc3QgdGFpbFBvcyA9IHN0YXJ0ICsgZGVsZXRlQ291bnQ7XG4gICAgY29uc3QgdGFpbCA9IHRoaXMuZXh0cmFjdFRhaWwodGFpbFBvcyk7XG4gICAgY29uc3QgZWFnZXJSZW1vdmUgPSB0aGlzLmVhZ2VyID09PSB0cnVlIHx8IHRoaXMuZWFnZXIgPT09ICdyZW1vdmUnO1xuICAgIGxldCBvbGRSYXdWYWx1ZTtcbiAgICBpZiAoZWFnZXJSZW1vdmUpIHtcbiAgICAgIHJlbW92ZURpcmVjdGlvbiA9IGZvcmNlRGlyZWN0aW9uKHJlbW92ZURpcmVjdGlvbik7XG4gICAgICBvbGRSYXdWYWx1ZSA9IHRoaXMuZXh0cmFjdElucHV0KDAsIHRhaWxQb3MsIHtcbiAgICAgICAgcmF3OiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0Q2hhbmdlUG9zID0gc3RhcnQ7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG5cbiAgICAvLyBpZiBpdCBpcyBqdXN0IGRlbGV0aW9uIHdpdGhvdXQgaW5zZXJ0aW9uXG4gICAgaWYgKHJlbW92ZURpcmVjdGlvbiAhPT0gRElSRUNUSU9OLk5PTkUpIHtcbiAgICAgIHN0YXJ0Q2hhbmdlUG9zID0gdGhpcy5uZWFyZXN0SW5wdXRQb3Moc3RhcnQsIGRlbGV0ZUNvdW50ID4gMSAmJiBzdGFydCAhPT0gMCAmJiAhZWFnZXJSZW1vdmUgPyBESVJFQ1RJT04uTk9ORSA6IHJlbW92ZURpcmVjdGlvbik7XG5cbiAgICAgIC8vIGFkanVzdCB0YWlsU2hpZnQgaWYgc3RhcnQgd2FzIGFsaWduZWRcbiAgICAgIGRldGFpbHMudGFpbFNoaWZ0ID0gc3RhcnRDaGFuZ2VQb3MgLSBzdGFydDtcbiAgICB9XG4gICAgZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5yZW1vdmUoc3RhcnRDaGFuZ2VQb3MpKTtcbiAgICBpZiAoZWFnZXJSZW1vdmUgJiYgcmVtb3ZlRGlyZWN0aW9uICE9PSBESVJFQ1RJT04uTk9ORSAmJiBvbGRSYXdWYWx1ZSA9PT0gdGhpcy5yYXdJbnB1dFZhbHVlKSB7XG4gICAgICBpZiAocmVtb3ZlRGlyZWN0aW9uID09PSBESVJFQ1RJT04uRk9SQ0VfTEVGVCkge1xuICAgICAgICBsZXQgdmFsTGVuZ3RoO1xuICAgICAgICB3aGlsZSAob2xkUmF3VmFsdWUgPT09IHRoaXMucmF3SW5wdXRWYWx1ZSAmJiAodmFsTGVuZ3RoID0gdGhpcy52YWx1ZS5sZW5ndGgpKSB7XG4gICAgICAgICAgZGV0YWlscy5hZ2dyZWdhdGUobmV3IENoYW5nZURldGFpbHMoe1xuICAgICAgICAgICAgdGFpbFNoaWZ0OiAtMVxuICAgICAgICAgIH0pKS5hZ2dyZWdhdGUodGhpcy5yZW1vdmUodmFsTGVuZ3RoIC0gMSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHJlbW92ZURpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkZPUkNFX1JJR0hUKSB7XG4gICAgICAgIHRhaWwudW5zaGlmdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscy5hZ2dyZWdhdGUodGhpcy5hcHBlbmQoaW5zZXJ0ZWQsIGZsYWdzLCB0YWlsKSk7XG4gIH1cbiAgbWFza0VxdWFscyhtYXNrKSB7XG4gICAgcmV0dXJuIHRoaXMubWFzayA9PT0gbWFzaztcbiAgfVxuICB0eXBlZFZhbHVlRXF1YWxzKHZhbHVlKSB7XG4gICAgY29uc3QgdHZhbCA9IHRoaXMudHlwZWRWYWx1ZTtcbiAgICByZXR1cm4gdmFsdWUgPT09IHR2YWwgfHwgTWFza2VkLkVNUFRZX1ZBTFVFUy5pbmNsdWRlcyh2YWx1ZSkgJiYgTWFza2VkLkVNUFRZX1ZBTFVFUy5pbmNsdWRlcyh0dmFsKSB8fCB0aGlzLmRvRm9ybWF0KHZhbHVlKSA9PT0gdGhpcy5kb0Zvcm1hdCh0aGlzLnR5cGVkVmFsdWUpO1xuICB9XG59XG5NYXNrZWQuREVGQVVMVFMgPSB7XG4gIGZvcm1hdDogU3RyaW5nLFxuICBwYXJzZTogdiA9PiB2LFxuICBza2lwSW52YWxpZDogdHJ1ZVxufTtcbk1hc2tlZC5FTVBUWV9WQUxVRVMgPSBbdW5kZWZpbmVkLCBudWxsLCAnJ107XG5JTWFzay5NYXNrZWQgPSBNYXNrZWQ7XG5cbmV4cG9ydCB7IE1hc2tlZCBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgTWFza2VkUGF0dGVybiBmcm9tICcuL3BhdHRlcm4uanMnO1xuaW1wb3J0IE1hc2tlZFJhbmdlIGZyb20gJy4vcmFuZ2UuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy02YjNiZDQwNC5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9iYXNlLmpzJztcbmltcG9ydCAnLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vcGF0dGVybi9pbnB1dC1kZWZpbml0aW9uLmpzJztcbmltcG9ydCAnLi9mYWN0b3J5LmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2ZpeGVkLWRlZmluaXRpb24uanMnO1xuaW1wb3J0ICcuL3BhdHRlcm4vY2h1bmstdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2N1cnNvci5qcyc7XG5pbXBvcnQgJy4vcmVnZXhwLmpzJztcblxuLyoqIERhdGUgbWFzayAqL1xuY2xhc3MgTWFza2VkRGF0ZSBleHRlbmRzIE1hc2tlZFBhdHRlcm4ge1xuICAvKiogUGF0dGVybiBtYXNrIGZvciBkYXRlIGFjY29yZGluZyB0byB7QGxpbmsgTWFza2VkRGF0ZSNmb3JtYXR9ICovXG5cbiAgLyoqIFN0YXJ0IGRhdGUgKi9cblxuICAvKiogRW5kIGRhdGUgKi9cblxuICAvKiogKi9cblxuICAvKipcbiAgICBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIoT2JqZWN0LmFzc2lnbih7fSwgTWFza2VkRGF0ZS5ERUZBVUxUUywgb3B0cykpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIF91cGRhdGUob3B0cykge1xuICAgIGlmIChvcHRzLm1hc2sgPT09IERhdGUpIGRlbGV0ZSBvcHRzLm1hc2s7XG4gICAgaWYgKG9wdHMucGF0dGVybikgb3B0cy5tYXNrID0gb3B0cy5wYXR0ZXJuO1xuICAgIGNvbnN0IGJsb2NrcyA9IG9wdHMuYmxvY2tzO1xuICAgIG9wdHMuYmxvY2tzID0gT2JqZWN0LmFzc2lnbih7fSwgTWFza2VkRGF0ZS5HRVRfREVGQVVMVF9CTE9DS1MoKSk7XG4gICAgLy8gYWRqdXN0IHllYXIgYmxvY2tcbiAgICBpZiAob3B0cy5taW4pIG9wdHMuYmxvY2tzLlkuZnJvbSA9IG9wdHMubWluLmdldEZ1bGxZZWFyKCk7XG4gICAgaWYgKG9wdHMubWF4KSBvcHRzLmJsb2Nrcy5ZLnRvID0gb3B0cy5tYXguZ2V0RnVsbFllYXIoKTtcbiAgICBpZiAob3B0cy5taW4gJiYgb3B0cy5tYXggJiYgb3B0cy5ibG9ja3MuWS5mcm9tID09PSBvcHRzLmJsb2Nrcy5ZLnRvKSB7XG4gICAgICBvcHRzLmJsb2Nrcy5tLmZyb20gPSBvcHRzLm1pbi5nZXRNb250aCgpICsgMTtcbiAgICAgIG9wdHMuYmxvY2tzLm0udG8gPSBvcHRzLm1heC5nZXRNb250aCgpICsgMTtcbiAgICAgIGlmIChvcHRzLmJsb2Nrcy5tLmZyb20gPT09IG9wdHMuYmxvY2tzLm0udG8pIHtcbiAgICAgICAgb3B0cy5ibG9ja3MuZC5mcm9tID0gb3B0cy5taW4uZ2V0RGF0ZSgpO1xuICAgICAgICBvcHRzLmJsb2Nrcy5kLnRvID0gb3B0cy5tYXguZ2V0RGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKG9wdHMuYmxvY2tzLCB0aGlzLmJsb2NrcywgYmxvY2tzKTtcblxuICAgIC8vIGFkZCBhdXRvZml4XG4gICAgT2JqZWN0LmtleXMob3B0cy5ibG9ja3MpLmZvckVhY2goYmsgPT4ge1xuICAgICAgY29uc3QgYiA9IG9wdHMuYmxvY2tzW2JrXTtcbiAgICAgIGlmICghKCdhdXRvZml4JyBpbiBiKSAmJiAnYXV0b2ZpeCcgaW4gb3B0cykgYi5hdXRvZml4ID0gb3B0cy5hdXRvZml4O1xuICAgIH0pO1xuICAgIHN1cGVyLl91cGRhdGUob3B0cyk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZG9WYWxpZGF0ZSgpIHtcbiAgICBjb25zdCBkYXRlID0gdGhpcy5kYXRlO1xuICAgIHJldHVybiBzdXBlci5kb1ZhbGlkYXRlKC4uLmFyZ3VtZW50cykgJiYgKCF0aGlzLmlzQ29tcGxldGUgfHwgdGhpcy5pc0RhdGVFeGlzdCh0aGlzLnZhbHVlKSAmJiBkYXRlICE9IG51bGwgJiYgKHRoaXMubWluID09IG51bGwgfHwgdGhpcy5taW4gPD0gZGF0ZSkgJiYgKHRoaXMubWF4ID09IG51bGwgfHwgZGF0ZSA8PSB0aGlzLm1heCkpO1xuICB9XG5cbiAgLyoqIENoZWNrcyBpZiBkYXRlIGlzIGV4aXN0cyAqL1xuICBpc0RhdGVFeGlzdChzdHIpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtYXQodGhpcy5wYXJzZShzdHIsIHRoaXMpLCB0aGlzKS5pbmRleE9mKHN0cikgPj0gMDtcbiAgfVxuXG4gIC8qKiBQYXJzZWQgRGF0ZSAqL1xuICBnZXQgZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZFZhbHVlO1xuICB9XG4gIHNldCBkYXRlKGRhdGUpIHtcbiAgICB0aGlzLnR5cGVkVmFsdWUgPSBkYXRlO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCB0eXBlZFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmlzQ29tcGxldGUgPyBzdXBlci50eXBlZFZhbHVlIDogbnVsbDtcbiAgfVxuICBzZXQgdHlwZWRWYWx1ZSh2YWx1ZSkge1xuICAgIHN1cGVyLnR5cGVkVmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBtYXNrRXF1YWxzKG1hc2spIHtcbiAgICByZXR1cm4gbWFzayA9PT0gRGF0ZSB8fCBzdXBlci5tYXNrRXF1YWxzKG1hc2spO1xuICB9XG59XG5NYXNrZWREYXRlLkRFRkFVTFRTID0ge1xuICBwYXR0ZXJuOiAnZHsufWBtey59YFknLFxuICBmb3JtYXQ6IGRhdGUgPT4ge1xuICAgIGlmICghZGF0ZSkgcmV0dXJuICcnO1xuICAgIGNvbnN0IGRheSA9IFN0cmluZyhkYXRlLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBtb250aCA9IFN0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIFtkYXksIG1vbnRoLCB5ZWFyXS5qb2luKCcuJyk7XG4gIH0sXG4gIHBhcnNlOiBzdHIgPT4ge1xuICAgIGNvbnN0IFtkYXksIG1vbnRoLCB5ZWFyXSA9IHN0ci5zcGxpdCgnLicpO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XG4gIH1cbn07XG5NYXNrZWREYXRlLkdFVF9ERUZBVUxUX0JMT0NLUyA9ICgpID0+ICh7XG4gIGQ6IHtcbiAgICBtYXNrOiBNYXNrZWRSYW5nZSxcbiAgICBmcm9tOiAxLFxuICAgIHRvOiAzMSxcbiAgICBtYXhMZW5ndGg6IDJcbiAgfSxcbiAgbToge1xuICAgIG1hc2s6IE1hc2tlZFJhbmdlLFxuICAgIGZyb206IDEsXG4gICAgdG86IDEyLFxuICAgIG1heExlbmd0aDogMlxuICB9LFxuICBZOiB7XG4gICAgbWFzazogTWFza2VkUmFuZ2UsXG4gICAgZnJvbTogMTkwMCxcbiAgICB0bzogOTk5OVxuICB9XG59KTtcbklNYXNrLk1hc2tlZERhdGUgPSBNYXNrZWREYXRlO1xuXG5leHBvcnQgeyBNYXNrZWREYXRlIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IF8gYXMgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UgfSBmcm9tICcuLi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzJztcbmltcG9ydCB7IERJUkVDVElPTiwgbm9ybWFsaXplUHJlcGFyZSwgb2JqZWN0SW5jbHVkZXMgfSBmcm9tICcuLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCBDaGFuZ2VEZXRhaWxzIGZyb20gJy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0IGNyZWF0ZU1hc2sgZnJvbSAnLi9mYWN0b3J5LmpzJztcbmltcG9ydCBNYXNrZWQgZnJvbSAnLi9iYXNlLmpzJztcbmltcG9ydCBJTWFzayBmcm9tICcuLi9jb3JlL2hvbGRlci5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuXG5jb25zdCBfZXhjbHVkZWQgPSBbXCJjb21waWxlZE1hc2tzXCIsIFwiY3VycmVudE1hc2tSZWZcIiwgXCJjdXJyZW50TWFza1wiXSxcbiAgX2V4Y2x1ZGVkMiA9IFtcIm1hc2tcIl07XG4vKiogRHluYW1pYyBtYXNrIGZvciBjaG9vc2luZyBhcHJvcHJpYXRlIG1hc2sgaW4gcnVuLXRpbWUgKi9cbmNsYXNzIE1hc2tlZER5bmFtaWMgZXh0ZW5kcyBNYXNrZWQge1xuICAvKiogQ3VycmVudGx5IGNob3NlbiBtYXNrICovXG5cbiAgLyoqIENvbXBsaWxlZCB7QGxpbmsgTWFza2VkfSBvcHRpb25zICovXG5cbiAgLyoqIENob29zZXMge0BsaW5rIE1hc2tlZH0gZGVwZW5kaW5nIG9uIGlucHV0IHZhbHVlICovXG5cbiAgLyoqXG4gICAgQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgKi9cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHN1cGVyKE9iamVjdC5hc3NpZ24oe30sIE1hc2tlZER5bmFtaWMuREVGQVVMVFMsIG9wdHMpKTtcbiAgICB0aGlzLmN1cnJlbnRNYXNrID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBfdXBkYXRlKG9wdHMpIHtcbiAgICBzdXBlci5fdXBkYXRlKG9wdHMpO1xuICAgIGlmICgnbWFzaycgaW4gb3B0cykge1xuICAgICAgLy8gbWFzayBjb3VsZCBiZSB0b3RhbGx5IGR5bmFtaWMgd2l0aCBvbmx5IGBkaXNwYXRjaGAgb3B0aW9uXG4gICAgICB0aGlzLmNvbXBpbGVkTWFza3MgPSBBcnJheS5pc0FycmF5KG9wdHMubWFzaykgPyBvcHRzLm1hc2subWFwKG0gPT4gY3JlYXRlTWFzayhtKSkgOiBbXTtcblxuICAgICAgLy8gdGhpcy5jdXJyZW50TWFzayA9IHRoaXMuZG9EaXNwYXRjaCgnJyk7IC8vIHByb2JhYmx5IG5vdCBuZWVkZWQgYnV0IGxldHMgc2VlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIF9hcHBlbmRDaGFyUmF3KGNoKSB7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBjb25zdCBkZXRhaWxzID0gdGhpcy5fYXBwbHlEaXNwYXRjaChjaCwgZmxhZ3MpO1xuICAgIGlmICh0aGlzLmN1cnJlbnRNYXNrKSB7XG4gICAgICBkZXRhaWxzLmFnZ3JlZ2F0ZSh0aGlzLmN1cnJlbnRNYXNrLl9hcHBlbmRDaGFyKGNoLCB0aGlzLmN1cnJlbnRNYXNrRmxhZ3MoZmxhZ3MpKSk7XG4gICAgfVxuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG4gIF9hcHBseURpc3BhdGNoKCkge1xuICAgIGxldCBhcHBlbmRlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBsZXQgdGFpbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gICAgY29uc3QgcHJldlZhbHVlQmVmb3JlVGFpbCA9IGZsYWdzLnRhaWwgJiYgZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZSAhPSBudWxsID8gZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZS5fdmFsdWUgOiB0aGlzLnZhbHVlO1xuICAgIGNvbnN0IGlucHV0VmFsdWUgPSB0aGlzLnJhd0lucHV0VmFsdWU7XG4gICAgY29uc3QgaW5zZXJ0VmFsdWUgPSBmbGFncy50YWlsICYmIGZsYWdzLl9iZWZvcmVUYWlsU3RhdGUgIT0gbnVsbCA/XG4gICAgLy8gJEZsb3dGaXhNZSAtIHRpcmVkIHRvIGZpZ2h0IHdpdGggdHlwZSBzeXN0ZW1cbiAgICBmbGFncy5fYmVmb3JlVGFpbFN0YXRlLl9yYXdJbnB1dFZhbHVlIDogaW5wdXRWYWx1ZTtcbiAgICBjb25zdCB0YWlsVmFsdWUgPSBpbnB1dFZhbHVlLnNsaWNlKGluc2VydFZhbHVlLmxlbmd0aCk7XG4gICAgY29uc3QgcHJldk1hc2sgPSB0aGlzLmN1cnJlbnRNYXNrO1xuICAgIGNvbnN0IGRldGFpbHMgPSBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIGNvbnN0IHByZXZNYXNrU3RhdGUgPSBwcmV2TWFzayA9PT0gbnVsbCB8fCBwcmV2TWFzayA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJldk1hc2suc3RhdGU7XG5cbiAgICAvLyBjbG9uZSBmbGFncyB0byBwcmV2ZW50IG92ZXJ3cml0aW5nIGBfYmVmb3JlVGFpbFN0YXRlYFxuICAgIHRoaXMuY3VycmVudE1hc2sgPSB0aGlzLmRvRGlzcGF0Y2goYXBwZW5kZWQsIE9iamVjdC5hc3NpZ24oe30sIGZsYWdzKSwgdGFpbCk7XG5cbiAgICAvLyByZXN0b3JlIHN0YXRlIGFmdGVyIGRpc3BhdGNoXG4gICAgaWYgKHRoaXMuY3VycmVudE1hc2spIHtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRNYXNrICE9PSBwcmV2TWFzaykge1xuICAgICAgICAvLyBpZiBtYXNrIGNoYW5nZWQgcmVhcHBseSBpbnB1dFxuICAgICAgICB0aGlzLmN1cnJlbnRNYXNrLnJlc2V0KCk7XG4gICAgICAgIGlmIChpbnNlcnRWYWx1ZSkge1xuICAgICAgICAgIC8vICRGbG93Rml4TWUgLSBpdCdzIG9rLCB3ZSBkb24ndCBjaGFuZ2UgY3VycmVudCBtYXNrIGFib3ZlXG4gICAgICAgICAgY29uc3QgZCA9IHRoaXMuY3VycmVudE1hc2suYXBwZW5kKGluc2VydFZhbHVlLCB7XG4gICAgICAgICAgICByYXc6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkZXRhaWxzLnRhaWxTaGlmdCA9IGQuaW5zZXJ0ZWQubGVuZ3RoIC0gcHJldlZhbHVlQmVmb3JlVGFpbC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhaWxWYWx1ZSkge1xuICAgICAgICAgIC8vICRGbG93Rml4TWUgLSBpdCdzIG9rLCB3ZSBkb24ndCBjaGFuZ2UgY3VycmVudCBtYXNrIGFib3ZlXG4gICAgICAgICAgZGV0YWlscy50YWlsU2hpZnQgKz0gdGhpcy5jdXJyZW50TWFzay5hcHBlbmQodGFpbFZhbHVlLCB7XG4gICAgICAgICAgICByYXc6IHRydWUsXG4gICAgICAgICAgICB0YWlsOiB0cnVlXG4gICAgICAgICAgfSkudGFpbFNoaWZ0O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEaXNwYXRjaCBjYW4gZG8gc29tZXRoaW5nIGJhZCB3aXRoIHN0YXRlLCBzb1xuICAgICAgICAvLyByZXN0b3JlIHByZXYgbWFzayBzdGF0ZVxuICAgICAgICB0aGlzLmN1cnJlbnRNYXNrLnN0YXRlID0gcHJldk1hc2tTdGF0ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cbiAgX2FwcGVuZFBsYWNlaG9sZGVyKCkge1xuICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLl9hcHBseURpc3BhdGNoKC4uLmFyZ3VtZW50cyk7XG4gICAgaWYgKHRoaXMuY3VycmVudE1hc2spIHtcbiAgICAgIGRldGFpbHMuYWdncmVnYXRlKHRoaXMuY3VycmVudE1hc2suX2FwcGVuZFBsYWNlaG9sZGVyKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuXG4gIC8qKlxuICAgQG92ZXJyaWRlXG4gICovXG4gIF9hcHBlbmRFYWdlcigpIHtcbiAgICBjb25zdCBkZXRhaWxzID0gdGhpcy5fYXBwbHlEaXNwYXRjaCguLi5hcmd1bWVudHMpO1xuICAgIGlmICh0aGlzLmN1cnJlbnRNYXNrKSB7XG4gICAgICBkZXRhaWxzLmFnZ3JlZ2F0ZSh0aGlzLmN1cnJlbnRNYXNrLl9hcHBlbmRFYWdlcigpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cbiAgYXBwZW5kVGFpbCh0YWlsKSB7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgaWYgKHRhaWwpIGRldGFpbHMuYWdncmVnYXRlKHRoaXMuX2FwcGx5RGlzcGF0Y2goJycsIHt9LCB0YWlsKSk7XG4gICAgcmV0dXJuIGRldGFpbHMuYWdncmVnYXRlKHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLmFwcGVuZFRhaWwodGFpbCkgOiBzdXBlci5hcHBlbmRUYWlsKHRhaWwpKTtcbiAgfVxuICBjdXJyZW50TWFza0ZsYWdzKGZsYWdzKSB7XG4gICAgdmFyIF9mbGFncyRfYmVmb3JlVGFpbFN0YSwgX2ZsYWdzJF9iZWZvcmVUYWlsU3RhMjtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZmxhZ3MsIHtcbiAgICAgIF9iZWZvcmVUYWlsU3RhdGU6ICgoX2ZsYWdzJF9iZWZvcmVUYWlsU3RhID0gZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZSkgPT09IG51bGwgfHwgX2ZsYWdzJF9iZWZvcmVUYWlsU3RhID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZmxhZ3MkX2JlZm9yZVRhaWxTdGEuY3VycmVudE1hc2tSZWYpID09PSB0aGlzLmN1cnJlbnRNYXNrICYmICgoX2ZsYWdzJF9iZWZvcmVUYWlsU3RhMiA9IGZsYWdzLl9iZWZvcmVUYWlsU3RhdGUpID09PSBudWxsIHx8IF9mbGFncyRfYmVmb3JlVGFpbFN0YTIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mbGFncyRfYmVmb3JlVGFpbFN0YTIuY3VycmVudE1hc2spIHx8IGZsYWdzLl9iZWZvcmVUYWlsU3RhdGVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb0Rpc3BhdGNoKGFwcGVuZGVkKSB7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBsZXQgdGFpbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goYXBwZW5kZWQsIHRoaXMsIGZsYWdzLCB0YWlsKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb1ZhbGlkYXRlKGZsYWdzKSB7XG4gICAgcmV0dXJuIHN1cGVyLmRvVmFsaWRhdGUoZmxhZ3MpICYmICghdGhpcy5jdXJyZW50TWFzayB8fCB0aGlzLmN1cnJlbnRNYXNrLmRvVmFsaWRhdGUodGhpcy5jdXJyZW50TWFza0ZsYWdzKGZsYWdzKSkpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvUHJlcGFyZShzdHIpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGxldCBbcywgZGV0YWlsc10gPSBub3JtYWxpemVQcmVwYXJlKHN1cGVyLmRvUHJlcGFyZShzdHIsIGZsYWdzKSk7XG4gICAgaWYgKHRoaXMuY3VycmVudE1hc2spIHtcbiAgICAgIGxldCBjdXJyZW50RGV0YWlscztcbiAgICAgIFtzLCBjdXJyZW50RGV0YWlsc10gPSBub3JtYWxpemVQcmVwYXJlKHN1cGVyLmRvUHJlcGFyZShzLCB0aGlzLmN1cnJlbnRNYXNrRmxhZ3MoZmxhZ3MpKSk7XG4gICAgICBkZXRhaWxzID0gZGV0YWlscy5hZ2dyZWdhdGUoY3VycmVudERldGFpbHMpO1xuICAgIH1cbiAgICByZXR1cm4gW3MsIGRldGFpbHNdO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIHJlc2V0KCkge1xuICAgIHZhciBfdGhpcyRjdXJyZW50TWFzaztcbiAgICAoX3RoaXMkY3VycmVudE1hc2sgPSB0aGlzLmN1cnJlbnRNYXNrKSA9PT0gbnVsbCB8fCBfdGhpcyRjdXJyZW50TWFzayA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkY3VycmVudE1hc2sucmVzZXQoKTtcbiAgICB0aGlzLmNvbXBpbGVkTWFza3MuZm9yRWFjaChtID0+IG0ucmVzZXQoKSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRNYXNrID8gdGhpcy5jdXJyZW50TWFzay52YWx1ZSA6ICcnO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgIHN1cGVyLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHVubWFza2VkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLnVubWFza2VkVmFsdWUgOiAnJztcbiAgfVxuICBzZXQgdW5tYXNrZWRWYWx1ZSh1bm1hc2tlZFZhbHVlKSB7XG4gICAgc3VwZXIudW5tYXNrZWRWYWx1ZSA9IHVubWFza2VkVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IHR5cGVkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLnR5cGVkVmFsdWUgOiAnJztcbiAgfVxuXG4gIC8vIHByb2JhYmx5IHR5cGVkVmFsdWUgc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggZHluYW1pY1xuICBzZXQgdHlwZWRWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCB1bm1hc2tlZFZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblxuICAgIC8vIGRvdWJsZSBjaGVjayBpdFxuICAgIGlmICh0aGlzLmN1cnJlbnRNYXNrKSB7XG4gICAgICB0aGlzLmN1cnJlbnRNYXNrLnR5cGVkVmFsdWUgPSB2YWx1ZTtcbiAgICAgIHVubWFza2VkVmFsdWUgPSB0aGlzLmN1cnJlbnRNYXNrLnVubWFza2VkVmFsdWU7XG4gICAgfVxuICAgIHRoaXMudW5tYXNrZWRWYWx1ZSA9IHVubWFza2VkVmFsdWU7XG4gIH1cbiAgZ2V0IGRpc3BsYXlWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TWFzayA/IHRoaXMuY3VycmVudE1hc2suZGlzcGxheVZhbHVlIDogJyc7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IGlzQ29tcGxldGUoKSB7XG4gICAgdmFyIF90aGlzJGN1cnJlbnRNYXNrMjtcbiAgICByZXR1cm4gQm9vbGVhbigoX3RoaXMkY3VycmVudE1hc2syID0gdGhpcy5jdXJyZW50TWFzaykgPT09IG51bGwgfHwgX3RoaXMkY3VycmVudE1hc2syID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRjdXJyZW50TWFzazIuaXNDb21wbGV0ZSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IGlzRmlsbGVkKCkge1xuICAgIHZhciBfdGhpcyRjdXJyZW50TWFzazM7XG4gICAgcmV0dXJuIEJvb2xlYW4oKF90aGlzJGN1cnJlbnRNYXNrMyA9IHRoaXMuY3VycmVudE1hc2spID09PSBudWxsIHx8IF90aGlzJGN1cnJlbnRNYXNrMyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkY3VycmVudE1hc2szLmlzRmlsbGVkKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICByZW1vdmUoKSB7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgaWYgKHRoaXMuY3VycmVudE1hc2spIHtcbiAgICAgIGRldGFpbHMuYWdncmVnYXRlKHRoaXMuY3VycmVudE1hc2sucmVtb3ZlKC4uLmFyZ3VtZW50cykpXG4gICAgICAvLyB1cGRhdGUgd2l0aCBkaXNwYXRjaFxuICAgICAgLmFnZ3JlZ2F0ZSh0aGlzLl9hcHBseURpc3BhdGNoKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgdmFyIF90aGlzJGN1cnJlbnRNYXNrNDtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3VwZXIuc3RhdGUsIHtcbiAgICAgIF9yYXdJbnB1dFZhbHVlOiB0aGlzLnJhd0lucHV0VmFsdWUsXG4gICAgICBjb21waWxlZE1hc2tzOiB0aGlzLmNvbXBpbGVkTWFza3MubWFwKG0gPT4gbS5zdGF0ZSksXG4gICAgICBjdXJyZW50TWFza1JlZjogdGhpcy5jdXJyZW50TWFzayxcbiAgICAgIGN1cnJlbnRNYXNrOiAoX3RoaXMkY3VycmVudE1hc2s0ID0gdGhpcy5jdXJyZW50TWFzaykgPT09IG51bGwgfHwgX3RoaXMkY3VycmVudE1hc2s0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRjdXJyZW50TWFzazQuc3RhdGVcbiAgICB9KTtcbiAgfVxuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBjb25zdCB7XG4gICAgICAgIGNvbXBpbGVkTWFza3MsXG4gICAgICAgIGN1cnJlbnRNYXNrUmVmLFxuICAgICAgICBjdXJyZW50TWFza1xuICAgICAgfSA9IHN0YXRlLFxuICAgICAgbWFza2VkU3RhdGUgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzdGF0ZSwgX2V4Y2x1ZGVkKTtcbiAgICB0aGlzLmNvbXBpbGVkTWFza3MuZm9yRWFjaCgobSwgbWkpID0+IG0uc3RhdGUgPSBjb21waWxlZE1hc2tzW21pXSk7XG4gICAgaWYgKGN1cnJlbnRNYXNrUmVmICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY3VycmVudE1hc2sgPSBjdXJyZW50TWFza1JlZjtcbiAgICAgIHRoaXMuY3VycmVudE1hc2suc3RhdGUgPSBjdXJyZW50TWFzaztcbiAgICB9XG4gICAgc3VwZXIuc3RhdGUgPSBtYXNrZWRTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBleHRyYWN0SW5wdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLmV4dHJhY3RJbnB1dCguLi5hcmd1bWVudHMpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZXh0cmFjdFRhaWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLmV4dHJhY3RUYWlsKC4uLmFyZ3VtZW50cykgOiBzdXBlci5leHRyYWN0VGFpbCguLi5hcmd1bWVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGRvQ29tbWl0KCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRNYXNrKSB0aGlzLmN1cnJlbnRNYXNrLmRvQ29tbWl0KCk7XG4gICAgc3VwZXIuZG9Db21taXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBuZWFyZXN0SW5wdXRQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudE1hc2sgPyB0aGlzLmN1cnJlbnRNYXNrLm5lYXJlc3RJbnB1dFBvcyguLi5hcmd1bWVudHMpIDogc3VwZXIubmVhcmVzdElucHV0UG9zKC4uLmFyZ3VtZW50cyk7XG4gIH1cbiAgZ2V0IG92ZXJ3cml0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TWFzayA/IHRoaXMuY3VycmVudE1hc2sub3ZlcndyaXRlIDogc3VwZXIub3ZlcndyaXRlO1xuICB9XG4gIHNldCBvdmVyd3JpdGUob3ZlcndyaXRlKSB7XG4gICAgY29uc29sZS53YXJuKCdcIm92ZXJ3cml0ZVwiIG9wdGlvbiBpcyBub3QgYXZhaWxhYmxlIGluIGR5bmFtaWMgbWFzaywgdXNlIHRoaXMgb3B0aW9uIGluIHNpYmxpbmdzJyk7XG4gIH1cbiAgZ2V0IGVhZ2VyKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRNYXNrID8gdGhpcy5jdXJyZW50TWFzay5lYWdlciA6IHN1cGVyLmVhZ2VyO1xuICB9XG4gIHNldCBlYWdlcihlYWdlcikge1xuICAgIGNvbnNvbGUud2FybignXCJlYWdlclwiIG9wdGlvbiBpcyBub3QgYXZhaWxhYmxlIGluIGR5bmFtaWMgbWFzaywgdXNlIHRoaXMgb3B0aW9uIGluIHNpYmxpbmdzJyk7XG4gIH1cbiAgZ2V0IHNraXBJbnZhbGlkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRNYXNrID8gdGhpcy5jdXJyZW50TWFzay5za2lwSW52YWxpZCA6IHN1cGVyLnNraXBJbnZhbGlkO1xuICB9XG4gIHNldCBza2lwSW52YWxpZChza2lwSW52YWxpZCkge1xuICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQgfHwgc2tpcEludmFsaWQgIT09IE1hc2tlZC5ERUZBVUxUUy5za2lwSW52YWxpZCkge1xuICAgICAgY29uc29sZS53YXJuKCdcInNraXBJbnZhbGlkXCIgb3B0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW4gZHluYW1pYyBtYXNrLCB1c2UgdGhpcyBvcHRpb24gaW4gc2libGluZ3MnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgbWFza0VxdWFscyhtYXNrKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkobWFzaykgJiYgdGhpcy5jb21waWxlZE1hc2tzLmV2ZXJ5KChtLCBtaSkgPT4ge1xuICAgICAgaWYgKCFtYXNrW21pXSkgcmV0dXJuO1xuICAgICAgY29uc3QgX21hc2skbWkgPSBtYXNrW21pXSxcbiAgICAgICAge1xuICAgICAgICAgIG1hc2s6IG9sZE1hc2tcbiAgICAgICAgfSA9IF9tYXNrJG1pLFxuICAgICAgICByZXN0T3B0cyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9tYXNrJG1pLCBfZXhjbHVkZWQyKTtcbiAgICAgIHJldHVybiBvYmplY3RJbmNsdWRlcyhtLCByZXN0T3B0cykgJiYgbS5tYXNrRXF1YWxzKG9sZE1hc2spO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIHR5cGVkVmFsdWVFcXVhbHModmFsdWUpIHtcbiAgICB2YXIgX3RoaXMkY3VycmVudE1hc2s1O1xuICAgIHJldHVybiBCb29sZWFuKChfdGhpcyRjdXJyZW50TWFzazUgPSB0aGlzLmN1cnJlbnRNYXNrKSA9PT0gbnVsbCB8fCBfdGhpcyRjdXJyZW50TWFzazUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJGN1cnJlbnRNYXNrNS50eXBlZFZhbHVlRXF1YWxzKHZhbHVlKSk7XG4gIH1cbn1cbk1hc2tlZER5bmFtaWMuREVGQVVMVFMgPSB7XG4gIGRpc3BhdGNoOiAoYXBwZW5kZWQsIG1hc2tlZCwgZmxhZ3MsIHRhaWwpID0+IHtcbiAgICBpZiAoIW1hc2tlZC5jb21waWxlZE1hc2tzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGlucHV0VmFsdWUgPSBtYXNrZWQucmF3SW5wdXRWYWx1ZTtcblxuICAgIC8vIHNpbXVsYXRlIGlucHV0XG4gICAgY29uc3QgaW5wdXRzID0gbWFza2VkLmNvbXBpbGVkTWFza3MubWFwKChtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgaXNDdXJyZW50ID0gbWFza2VkLmN1cnJlbnRNYXNrID09PSBtO1xuICAgICAgY29uc3Qgc3RhcnRJbnB1dFBvcyA9IGlzQ3VycmVudCA/IG0udmFsdWUubGVuZ3RoIDogbS5uZWFyZXN0SW5wdXRQb3MobS52YWx1ZS5sZW5ndGgsIERJUkVDVElPTi5GT1JDRV9MRUZUKTtcbiAgICAgIGlmIChtLnJhd0lucHV0VmFsdWUgIT09IGlucHV0VmFsdWUpIHtcbiAgICAgICAgbS5yZXNldCgpO1xuICAgICAgICBtLmFwcGVuZChpbnB1dFZhbHVlLCB7XG4gICAgICAgICAgcmF3OiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICghaXNDdXJyZW50KSB7XG4gICAgICAgIG0ucmVtb3ZlKHN0YXJ0SW5wdXRQb3MpO1xuICAgICAgfVxuICAgICAgbS5hcHBlbmQoYXBwZW5kZWQsIG1hc2tlZC5jdXJyZW50TWFza0ZsYWdzKGZsYWdzKSk7XG4gICAgICBtLmFwcGVuZFRhaWwodGFpbCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbmRleCxcbiAgICAgICAgd2VpZ2h0OiBtLnJhd0lucHV0VmFsdWUubGVuZ3RoLFxuICAgICAgICB0b3RhbElucHV0UG9zaXRpb25zOiBtLnRvdGFsSW5wdXRQb3NpdGlvbnMoMCwgTWF0aC5tYXgoc3RhcnRJbnB1dFBvcywgbS5uZWFyZXN0SW5wdXRQb3MobS52YWx1ZS5sZW5ndGgsIERJUkVDVElPTi5GT1JDRV9MRUZUKSkpXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gcG9wIG1hc2tzIHdpdGggbG9uZ2VyIHZhbHVlcyBmaXJzdFxuICAgIGlucHV0cy5zb3J0KChpMSwgaTIpID0+IGkyLndlaWdodCAtIGkxLndlaWdodCB8fCBpMi50b3RhbElucHV0UG9zaXRpb25zIC0gaTEudG90YWxJbnB1dFBvc2l0aW9ucyk7XG4gICAgcmV0dXJuIG1hc2tlZC5jb21waWxlZE1hc2tzW2lucHV0c1swXS5pbmRleF07XG4gIH1cbn07XG5JTWFzay5NYXNrZWREeW5hbWljID0gTWFza2VkRHluYW1pYztcblxuZXhwb3J0IHsgTWFza2VkRHluYW1pYyBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgTWFza2VkUGF0dGVybiBmcm9tICcuL3BhdHRlcm4uanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy02YjNiZDQwNC5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9iYXNlLmpzJztcbmltcG9ydCAnLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vcGF0dGVybi9pbnB1dC1kZWZpbml0aW9uLmpzJztcbmltcG9ydCAnLi9mYWN0b3J5LmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2ZpeGVkLWRlZmluaXRpb24uanMnO1xuaW1wb3J0ICcuL3BhdHRlcm4vY2h1bmstdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2N1cnNvci5qcyc7XG5pbXBvcnQgJy4vcmVnZXhwLmpzJztcblxuLyoqIFBhdHRlcm4gd2hpY2ggdmFsaWRhdGVzIGVudW0gdmFsdWVzICovXG5jbGFzcyBNYXNrZWRFbnVtIGV4dGVuZHMgTWFza2VkUGF0dGVybiB7XG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICovXG4gIF91cGRhdGUob3B0cykge1xuICAgIC8vIFRPRE8gdHlwZVxuICAgIGlmIChvcHRzLmVudW0pIG9wdHMubWFzayA9ICcqJy5yZXBlYXQob3B0cy5lbnVtWzBdLmxlbmd0aCk7XG4gICAgc3VwZXIuX3VwZGF0ZShvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb1ZhbGlkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLmVudW0uc29tZShlID0+IGUuaW5kZXhPZih0aGlzLnVubWFza2VkVmFsdWUpID49IDApICYmIHN1cGVyLmRvVmFsaWRhdGUoLi4uYXJndW1lbnRzKTtcbiAgfVxufVxuSU1hc2suTWFza2VkRW51bSA9IE1hc2tlZEVudW07XG5cbmV4cG9ydCB7IE1hc2tlZEVudW0gYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCBJTWFzayBmcm9tICcuLi9jb3JlL2hvbGRlci5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuXG4vKiogR2V0IE1hc2tlZCBjbGFzcyBieSBtYXNrIHR5cGUgKi9cbmZ1bmN0aW9uIG1hc2tlZENsYXNzKG1hc2spIHtcbiAgaWYgKG1hc2sgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbWFzayBwcm9wZXJ0eSBzaG91bGQgYmUgZGVmaW5lZCcpO1xuICB9XG5cbiAgLy8gJEZsb3dGaXhNZVxuICBpZiAobWFzayBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIElNYXNrLk1hc2tlZFJlZ0V4cDtcbiAgLy8gJEZsb3dGaXhNZVxuICBpZiAoaXNTdHJpbmcobWFzaykpIHJldHVybiBJTWFzay5NYXNrZWRQYXR0ZXJuO1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChtYXNrIGluc3RhbmNlb2YgRGF0ZSB8fCBtYXNrID09PSBEYXRlKSByZXR1cm4gSU1hc2suTWFza2VkRGF0ZTtcbiAgLy8gJEZsb3dGaXhNZVxuICBpZiAobWFzayBpbnN0YW5jZW9mIE51bWJlciB8fCB0eXBlb2YgbWFzayA9PT0gJ251bWJlcicgfHwgbWFzayA9PT0gTnVtYmVyKSByZXR1cm4gSU1hc2suTWFza2VkTnVtYmVyO1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmIChBcnJheS5pc0FycmF5KG1hc2spIHx8IG1hc2sgPT09IEFycmF5KSByZXR1cm4gSU1hc2suTWFza2VkRHluYW1pYztcbiAgLy8gJEZsb3dGaXhNZVxuICBpZiAoSU1hc2suTWFza2VkICYmIG1hc2sucHJvdG90eXBlIGluc3RhbmNlb2YgSU1hc2suTWFza2VkKSByZXR1cm4gbWFzaztcbiAgLy8gJEZsb3dGaXhNZVxuICBpZiAobWFzayBpbnN0YW5jZW9mIElNYXNrLk1hc2tlZCkgcmV0dXJuIG1hc2suY29uc3RydWN0b3I7XG4gIC8vICRGbG93Rml4TWVcbiAgaWYgKG1hc2sgaW5zdGFuY2VvZiBGdW5jdGlvbikgcmV0dXJuIElNYXNrLk1hc2tlZEZ1bmN0aW9uO1xuICBjb25zb2xlLndhcm4oJ01hc2sgbm90IGZvdW5kIGZvciBtYXNrJywgbWFzayk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAvLyAkRmxvd0ZpeE1lXG4gIHJldHVybiBJTWFzay5NYXNrZWQ7XG59XG5cbi8qKiBDcmVhdGVzIG5ldyB7QGxpbmsgTWFza2VkfSBkZXBlbmRpbmcgb24gbWFzayB0eXBlICovXG5mdW5jdGlvbiBjcmVhdGVNYXNrKG9wdHMpIHtcbiAgLy8gJEZsb3dGaXhNZVxuICBpZiAoSU1hc2suTWFza2VkICYmIG9wdHMgaW5zdGFuY2VvZiBJTWFzay5NYXNrZWQpIHJldHVybiBvcHRzO1xuICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0cyk7XG4gIGNvbnN0IG1hc2sgPSBvcHRzLm1hc2s7XG5cbiAgLy8gJEZsb3dGaXhNZVxuICBpZiAoSU1hc2suTWFza2VkICYmIG1hc2sgaW5zdGFuY2VvZiBJTWFzay5NYXNrZWQpIHJldHVybiBtYXNrO1xuICBjb25zdCBNYXNrZWRDbGFzcyA9IG1hc2tlZENsYXNzKG1hc2spO1xuICBpZiAoIU1hc2tlZENsYXNzKSB0aHJvdyBuZXcgRXJyb3IoJ01hc2tlZCBjbGFzcyBpcyBub3QgZm91bmQgZm9yIHByb3ZpZGVkIG1hc2ssIGFwcHJvcHJpYXRlIG1vZHVsZSBuZWVkcyB0byBiZSBpbXBvcnQgbWFudWFsbHkgYmVmb3JlIGNyZWF0aW5nIG1hc2suJyk7XG4gIHJldHVybiBuZXcgTWFza2VkQ2xhc3Mob3B0cyk7XG59XG5JTWFzay5jcmVhdGVNYXNrID0gY3JlYXRlTWFzaztcblxuZXhwb3J0IHsgY3JlYXRlTWFzayBhcyBkZWZhdWx0LCBtYXNrZWRDbGFzcyB9O1xuIiwiaW1wb3J0IE1hc2tlZCBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuLi9jb3JlL3V0aWxzLmpzJztcblxuLyoqIE1hc2tpbmcgYnkgY3VzdG9tIEZ1bmN0aW9uICovXG5jbGFzcyBNYXNrZWRGdW5jdGlvbiBleHRlbmRzIE1hc2tlZCB7XG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICovXG4gIF91cGRhdGUob3B0cykge1xuICAgIGlmIChvcHRzLm1hc2spIG9wdHMudmFsaWRhdGUgPSBvcHRzLm1hc2s7XG4gICAgc3VwZXIuX3VwZGF0ZShvcHRzKTtcbiAgfVxufVxuSU1hc2suTWFza2VkRnVuY3Rpb24gPSBNYXNrZWRGdW5jdGlvbjtcblxuZXhwb3J0IHsgTWFza2VkRnVuY3Rpb24gYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgZXNjYXBlUmVnRXhwLCBub3JtYWxpemVQcmVwYXJlLCBESVJFQ1RJT04gfSBmcm9tICcuLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCBDaGFuZ2VEZXRhaWxzIGZyb20gJy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0IE1hc2tlZCBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vY29yZS9jb250aW51b3VzLXRhaWwtZGV0YWlscy5qcyc7XG5cbi8qKlxuICBOdW1iZXIgbWFza1xuICBAcGFyYW0ge09iamVjdH0gb3B0c1xuICBAcGFyYW0ge3N0cmluZ30gb3B0cy5yYWRpeCAtIFNpbmdsZSBjaGFyXG4gIEBwYXJhbSB7c3RyaW5nfSBvcHRzLnRob3VzYW5kc1NlcGFyYXRvciAtIFNpbmdsZSBjaGFyXG4gIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gb3B0cy5tYXBUb1JhZGl4IC0gQXJyYXkgb2Ygc2luZ2xlIGNoYXJzXG4gIEBwYXJhbSB7bnVtYmVyfSBvcHRzLm1pblxuICBAcGFyYW0ge251bWJlcn0gb3B0cy5tYXhcbiAgQHBhcmFtIHtudW1iZXJ9IG9wdHMuc2NhbGUgLSBEaWdpdHMgYWZ0ZXIgcG9pbnRcbiAgQHBhcmFtIHtib29sZWFufSBvcHRzLnNpZ25lZCAtIEFsbG93IG5lZ2F0aXZlXG4gIEBwYXJhbSB7Ym9vbGVhbn0gb3B0cy5ub3JtYWxpemVaZXJvcyAtIEZsYWcgdG8gcmVtb3ZlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHplcm9zIGluIHRoZSBlbmQgb2YgZWRpdGluZ1xuICBAcGFyYW0ge2Jvb2xlYW59IG9wdHMucGFkRnJhY3Rpb25hbFplcm9zIC0gRmxhZyB0byBwYWQgdHJhaWxpbmcgemVyb3MgYWZ0ZXIgcG9pbnQgaW4gdGhlIGVuZCBvZiBlZGl0aW5nXG4qL1xuY2xhc3MgTWFza2VkTnVtYmVyIGV4dGVuZHMgTWFza2VkIHtcbiAgLyoqIFNpbmdsZSBjaGFyICovXG5cbiAgLyoqIFNpbmdsZSBjaGFyICovXG5cbiAgLyoqIEFycmF5IG9mIHNpbmdsZSBjaGFycyAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiBEaWdpdHMgYWZ0ZXIgcG9pbnQgKi9cblxuICAvKiogKi9cblxuICAvKiogRmxhZyB0byByZW1vdmUgbGVhZGluZyBhbmQgdHJhaWxpbmcgemVyb3MgaW4gdGhlIGVuZCBvZiBlZGl0aW5nICovXG5cbiAgLyoqIEZsYWcgdG8gcGFkIHRyYWlsaW5nIHplcm9zIGFmdGVyIHBvaW50IGluIHRoZSBlbmQgb2YgZWRpdGluZyAqL1xuXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCBNYXNrZWROdW1iZXIuREVGQVVMVFMsIG9wdHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBfdXBkYXRlKG9wdHMpIHtcbiAgICBzdXBlci5fdXBkYXRlKG9wdHMpO1xuICAgIHRoaXMuX3VwZGF0ZVJlZ0V4cHMoKTtcbiAgfVxuXG4gIC8qKiAqL1xuICBfdXBkYXRlUmVnRXhwcygpIHtcbiAgICBsZXQgc3RhcnQgPSAnXicgKyAodGhpcy5hbGxvd05lZ2F0aXZlID8gJ1srfFxcXFwtXT8nIDogJycpO1xuICAgIGxldCBtaWQgPSAnXFxcXGQqJztcbiAgICBsZXQgZW5kID0gKHRoaXMuc2NhbGUgPyBcIihcIi5jb25jYXQoZXNjYXBlUmVnRXhwKHRoaXMucmFkaXgpLCBcIlxcXFxkezAsXCIpLmNvbmNhdCh0aGlzLnNjYWxlLCBcIn0pP1wiKSA6ICcnKSArICckJztcbiAgICB0aGlzLl9udW1iZXJSZWdFeHAgPSBuZXcgUmVnRXhwKHN0YXJ0ICsgbWlkICsgZW5kKTtcbiAgICB0aGlzLl9tYXBUb1JhZGl4UmVnRXhwID0gbmV3IFJlZ0V4cChcIltcIi5jb25jYXQodGhpcy5tYXBUb1JhZGl4Lm1hcChlc2NhcGVSZWdFeHApLmpvaW4oJycpLCBcIl1cIiksICdnJyk7XG4gICAgdGhpcy5fdGhvdXNhbmRzU2VwYXJhdG9yUmVnRXhwID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAodGhpcy50aG91c2FuZHNTZXBhcmF0b3IpLCAnZycpO1xuICB9XG5cbiAgLyoqICovXG4gIF9yZW1vdmVUaG91c2FuZHNTZXBhcmF0b3JzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UodGhpcy5fdGhvdXNhbmRzU2VwYXJhdG9yUmVnRXhwLCAnJyk7XG4gIH1cblxuICAvKiogKi9cbiAgX2luc2VydFRob3VzYW5kc1NlcGFyYXRvcnModmFsdWUpIHtcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTAxMTAyL2hvdy10by1wcmludC1hLW51bWJlci13aXRoLWNvbW1hcy1hcy10aG91c2FuZHMtc2VwYXJhdG9ycy1pbi1qYXZhc2NyaXB0XG4gICAgY29uc3QgcGFydHMgPSB2YWx1ZS5zcGxpdCh0aGlzLnJhZGl4KTtcbiAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yKTtcbiAgICByZXR1cm4gcGFydHMuam9pbih0aGlzLnJhZGl4KTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb1ByZXBhcmUoY2gpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGNoID0gdGhpcy5fcmVtb3ZlVGhvdXNhbmRzU2VwYXJhdG9ycyh0aGlzLnNjYWxlICYmIHRoaXMubWFwVG9SYWRpeC5sZW5ndGggJiYgKFxuICAgIC8qXG4gICAgICByYWRpeCBzaG91bGQgYmUgbWFwcGVkIHdoZW5cbiAgICAgIDEpIGlucHV0IGlzIGRvbmUgZnJvbSBrZXlib2FyZCA9IGZsYWdzLmlucHV0ICYmIGZsYWdzLnJhd1xuICAgICAgMikgdW5tYXNrZWQgdmFsdWUgaXMgc2V0ID0gIWZsYWdzLmlucHV0ICYmICFmbGFncy5yYXdcbiAgICAgIGFuZCBzaG91bGQgbm90IGJlIG1hcHBlZCB3aGVuXG4gICAgICAxKSB2YWx1ZSBpcyBzZXQgPSBmbGFncy5pbnB1dCAmJiAhZmxhZ3MucmF3XG4gICAgICAyKSByYXcgdmFsdWUgaXMgc2V0ID0gIWZsYWdzLmlucHV0ICYmIGZsYWdzLnJhd1xuICAgICovXG4gICAgZmxhZ3MuaW5wdXQgJiYgZmxhZ3MucmF3IHx8ICFmbGFncy5pbnB1dCAmJiAhZmxhZ3MucmF3KSA/IGNoLnJlcGxhY2UodGhpcy5fbWFwVG9SYWRpeFJlZ0V4cCwgdGhpcy5yYWRpeCkgOiBjaCk7XG4gICAgY29uc3QgW3ByZXBDaCwgZGV0YWlsc10gPSBub3JtYWxpemVQcmVwYXJlKHN1cGVyLmRvUHJlcGFyZShjaCwgZmxhZ3MpKTtcbiAgICBpZiAoY2ggJiYgIXByZXBDaCkgZGV0YWlscy5za2lwID0gdHJ1ZTtcbiAgICByZXR1cm4gW3ByZXBDaCwgZGV0YWlsc107XG4gIH1cblxuICAvKiogKi9cbiAgX3NlcGFyYXRvcnNDb3VudCh0bykge1xuICAgIGxldCBleHRlbmRPblNlcGFyYXRvcnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgZm9yIChsZXQgcG9zID0gMDsgcG9zIDwgdG87ICsrcG9zKSB7XG4gICAgICBpZiAodGhpcy5fdmFsdWUuaW5kZXhPZih0aGlzLnRob3VzYW5kc1NlcGFyYXRvciwgcG9zKSA9PT0gcG9zKSB7XG4gICAgICAgICsrY291bnQ7XG4gICAgICAgIGlmIChleHRlbmRPblNlcGFyYXRvcnMpIHRvICs9IHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgLyoqICovXG4gIF9zZXBhcmF0b3JzQ291bnRGcm9tU2xpY2UoKSB7XG4gICAgbGV0IHNsaWNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0aGlzLl92YWx1ZTtcbiAgICByZXR1cm4gdGhpcy5fc2VwYXJhdG9yc0NvdW50KHRoaXMuX3JlbW92ZVRob3VzYW5kc1NlcGFyYXRvcnMoc2xpY2UpLmxlbmd0aCwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZXh0cmFjdElucHV0KCkge1xuICAgIGxldCBmcm9tUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gICAgW2Zyb21Qb3MsIHRvUG9zXSA9IHRoaXMuX2FkanVzdFJhbmdlV2l0aFNlcGFyYXRvcnMoZnJvbVBvcywgdG9Qb3MpO1xuICAgIHJldHVybiB0aGlzLl9yZW1vdmVUaG91c2FuZHNTZXBhcmF0b3JzKHN1cGVyLmV4dHJhY3RJbnB1dChmcm9tUG9zLCB0b1BvcywgZmxhZ3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBfYXBwZW5kQ2hhclJhdyhjaCkge1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgaWYgKCF0aGlzLnRob3VzYW5kc1NlcGFyYXRvcikgcmV0dXJuIHN1cGVyLl9hcHBlbmRDaGFyUmF3KGNoLCBmbGFncyk7XG4gICAgY29uc3QgcHJldkJlZm9yZVRhaWxWYWx1ZSA9IGZsYWdzLnRhaWwgJiYgZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZSA/IGZsYWdzLl9iZWZvcmVUYWlsU3RhdGUuX3ZhbHVlIDogdGhpcy5fdmFsdWU7XG4gICAgY29uc3QgcHJldkJlZm9yZVRhaWxTZXBhcmF0b3JzQ291bnQgPSB0aGlzLl9zZXBhcmF0b3JzQ291bnRGcm9tU2xpY2UocHJldkJlZm9yZVRhaWxWYWx1ZSk7XG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLl9yZW1vdmVUaG91c2FuZHNTZXBhcmF0b3JzKHRoaXMudmFsdWUpO1xuICAgIGNvbnN0IGFwcGVuZERldGFpbHMgPSBzdXBlci5fYXBwZW5kQ2hhclJhdyhjaCwgZmxhZ3MpO1xuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5faW5zZXJ0VGhvdXNhbmRzU2VwYXJhdG9ycyh0aGlzLl92YWx1ZSk7XG4gICAgY29uc3QgYmVmb3JlVGFpbFZhbHVlID0gZmxhZ3MudGFpbCAmJiBmbGFncy5fYmVmb3JlVGFpbFN0YXRlID8gZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZS5fdmFsdWUgOiB0aGlzLl92YWx1ZTtcbiAgICBjb25zdCBiZWZvcmVUYWlsU2VwYXJhdG9yc0NvdW50ID0gdGhpcy5fc2VwYXJhdG9yc0NvdW50RnJvbVNsaWNlKGJlZm9yZVRhaWxWYWx1ZSk7XG4gICAgYXBwZW5kRGV0YWlscy50YWlsU2hpZnQgKz0gKGJlZm9yZVRhaWxTZXBhcmF0b3JzQ291bnQgLSBwcmV2QmVmb3JlVGFpbFNlcGFyYXRvcnNDb3VudCkgKiB0aGlzLnRob3VzYW5kc1NlcGFyYXRvci5sZW5ndGg7XG4gICAgYXBwZW5kRGV0YWlscy5za2lwID0gIWFwcGVuZERldGFpbHMucmF3SW5zZXJ0ZWQgJiYgY2ggPT09IHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yO1xuICAgIHJldHVybiBhcHBlbmREZXRhaWxzO1xuICB9XG5cbiAgLyoqICovXG4gIF9maW5kU2VwYXJhdG9yQXJvdW5kKHBvcykge1xuICAgIGlmICh0aGlzLnRob3VzYW5kc1NlcGFyYXRvcikge1xuICAgICAgY29uc3Qgc2VhcmNoRnJvbSA9IHBvcyAtIHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yLmxlbmd0aCArIDE7XG4gICAgICBjb25zdCBzZXBhcmF0b3JQb3MgPSB0aGlzLnZhbHVlLmluZGV4T2YodGhpcy50aG91c2FuZHNTZXBhcmF0b3IsIHNlYXJjaEZyb20pO1xuICAgICAgaWYgKHNlcGFyYXRvclBvcyA8PSBwb3MpIHJldHVybiBzZXBhcmF0b3JQb3M7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfVxuICBfYWRqdXN0UmFuZ2VXaXRoU2VwYXJhdG9ycyhmcm9tLCB0bykge1xuICAgIGNvbnN0IHNlcGFyYXRvckFyb3VuZEZyb21Qb3MgPSB0aGlzLl9maW5kU2VwYXJhdG9yQXJvdW5kKGZyb20pO1xuICAgIGlmIChzZXBhcmF0b3JBcm91bmRGcm9tUG9zID49IDApIGZyb20gPSBzZXBhcmF0b3JBcm91bmRGcm9tUG9zO1xuICAgIGNvbnN0IHNlcGFyYXRvckFyb3VuZFRvUG9zID0gdGhpcy5fZmluZFNlcGFyYXRvckFyb3VuZCh0byk7XG4gICAgaWYgKHNlcGFyYXRvckFyb3VuZFRvUG9zID49IDApIHRvID0gc2VwYXJhdG9yQXJvdW5kVG9Qb3MgKyB0aGlzLnRob3VzYW5kc1NlcGFyYXRvci5sZW5ndGg7XG4gICAgcmV0dXJuIFtmcm9tLCB0b107XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGxldCBmcm9tUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgW2Zyb21Qb3MsIHRvUG9zXSA9IHRoaXMuX2FkanVzdFJhbmdlV2l0aFNlcGFyYXRvcnMoZnJvbVBvcywgdG9Qb3MpO1xuICAgIGNvbnN0IHZhbHVlQmVmb3JlUG9zID0gdGhpcy52YWx1ZS5zbGljZSgwLCBmcm9tUG9zKTtcbiAgICBjb25zdCB2YWx1ZUFmdGVyUG9zID0gdGhpcy52YWx1ZS5zbGljZSh0b1Bvcyk7XG4gICAgY29uc3QgcHJldkJlZm9yZVRhaWxTZXBhcmF0b3JzQ291bnQgPSB0aGlzLl9zZXBhcmF0b3JzQ291bnQodmFsdWVCZWZvcmVQb3MubGVuZ3RoKTtcbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX2luc2VydFRob3VzYW5kc1NlcGFyYXRvcnModGhpcy5fcmVtb3ZlVGhvdXNhbmRzU2VwYXJhdG9ycyh2YWx1ZUJlZm9yZVBvcyArIHZhbHVlQWZ0ZXJQb3MpKTtcbiAgICBjb25zdCBiZWZvcmVUYWlsU2VwYXJhdG9yc0NvdW50ID0gdGhpcy5fc2VwYXJhdG9yc0NvdW50RnJvbVNsaWNlKHZhbHVlQmVmb3JlUG9zKTtcbiAgICByZXR1cm4gbmV3IENoYW5nZURldGFpbHMoe1xuICAgICAgdGFpbFNoaWZ0OiAoYmVmb3JlVGFpbFNlcGFyYXRvcnNDb3VudCAtIHByZXZCZWZvcmVUYWlsU2VwYXJhdG9yc0NvdW50KSAqIHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yLmxlbmd0aFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIG5lYXJlc3RJbnB1dFBvcyhjdXJzb3JQb3MsIGRpcmVjdGlvbikge1xuICAgIGlmICghdGhpcy50aG91c2FuZHNTZXBhcmF0b3IpIHJldHVybiBjdXJzb3JQb3M7XG4gICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgRElSRUNUSU9OLk5PTkU6XG4gICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxuICAgICAgY2FzZSBESVJFQ1RJT04uRk9SQ0VfTEVGVDpcbiAgICAgICAge1xuICAgICAgICAgIGNvbnN0IHNlcGFyYXRvckF0TGVmdFBvcyA9IHRoaXMuX2ZpbmRTZXBhcmF0b3JBcm91bmQoY3Vyc29yUG9zIC0gMSk7XG4gICAgICAgICAgaWYgKHNlcGFyYXRvckF0TGVmdFBvcyA+PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBzZXBhcmF0b3JBdExlZnRFbmRQb3MgPSBzZXBhcmF0b3JBdExlZnRQb3MgKyB0aGlzLnRob3VzYW5kc1NlcGFyYXRvci5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoY3Vyc29yUG9zIDwgc2VwYXJhdG9yQXRMZWZ0RW5kUG9zIHx8IHRoaXMudmFsdWUubGVuZ3RoIDw9IHNlcGFyYXRvckF0TGVmdEVuZFBvcyB8fCBkaXJlY3Rpb24gPT09IERJUkVDVElPTi5GT1JDRV9MRUZUKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZXBhcmF0b3JBdExlZnRQb3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcbiAgICAgIGNhc2UgRElSRUNUSU9OLkZPUkNFX1JJR0hUOlxuICAgICAgICB7XG4gICAgICAgICAgY29uc3Qgc2VwYXJhdG9yQXRSaWdodFBvcyA9IHRoaXMuX2ZpbmRTZXBhcmF0b3JBcm91bmQoY3Vyc29yUG9zKTtcbiAgICAgICAgICBpZiAoc2VwYXJhdG9yQXRSaWdodFBvcyA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VwYXJhdG9yQXRSaWdodFBvcyArIHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvclBvcztcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb1ZhbGlkYXRlKGZsYWdzKSB7XG4gICAgLy8gdmFsaWRhdGUgYXMgc3RyaW5nXG4gICAgbGV0IHZhbGlkID0gQm9vbGVhbih0aGlzLl9yZW1vdmVUaG91c2FuZHNTZXBhcmF0b3JzKHRoaXMudmFsdWUpLm1hdGNoKHRoaXMuX251bWJlclJlZ0V4cCkpO1xuICAgIGlmICh2YWxpZCkge1xuICAgICAgLy8gdmFsaWRhdGUgYXMgbnVtYmVyXG4gICAgICBjb25zdCBudW1iZXIgPSB0aGlzLm51bWJlcjtcbiAgICAgIHZhbGlkID0gdmFsaWQgJiYgIWlzTmFOKG51bWJlcikgJiYgKFxuICAgICAgLy8gY2hlY2sgbWluIGJvdW5kIGZvciBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgIHRoaXMubWluID09IG51bGwgfHwgdGhpcy5taW4gPj0gMCB8fCB0aGlzLm1pbiA8PSB0aGlzLm51bWJlcikgJiYgKFxuICAgICAgLy8gY2hlY2sgbWF4IGJvdW5kIGZvciBwb3NpdGl2ZSB2YWx1ZXNcbiAgICAgIHRoaXMubWF4ID09IG51bGwgfHwgdGhpcy5tYXggPD0gMCB8fCB0aGlzLm51bWJlciA8PSB0aGlzLm1heCk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZCAmJiBzdXBlci5kb1ZhbGlkYXRlKGZsYWdzKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb0NvbW1pdCgpIHtcbiAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgY29uc3QgbnVtYmVyID0gdGhpcy5udW1iZXI7XG4gICAgICBsZXQgdmFsaWRudW0gPSBudW1iZXI7XG5cbiAgICAgIC8vIGNoZWNrIGJvdW5kc1xuICAgICAgaWYgKHRoaXMubWluICE9IG51bGwpIHZhbGlkbnVtID0gTWF0aC5tYXgodmFsaWRudW0sIHRoaXMubWluKTtcbiAgICAgIGlmICh0aGlzLm1heCAhPSBudWxsKSB2YWxpZG51bSA9IE1hdGgubWluKHZhbGlkbnVtLCB0aGlzLm1heCk7XG4gICAgICBpZiAodmFsaWRudW0gIT09IG51bWJlcikgdGhpcy51bm1hc2tlZFZhbHVlID0gdGhpcy5kb0Zvcm1hdCh2YWxpZG51bSk7XG4gICAgICBsZXQgZm9ybWF0dGVkID0gdGhpcy52YWx1ZTtcbiAgICAgIGlmICh0aGlzLm5vcm1hbGl6ZVplcm9zKSBmb3JtYXR0ZWQgPSB0aGlzLl9ub3JtYWxpemVaZXJvcyhmb3JtYXR0ZWQpO1xuICAgICAgaWYgKHRoaXMucGFkRnJhY3Rpb25hbFplcm9zICYmIHRoaXMuc2NhbGUgPiAwKSBmb3JtYXR0ZWQgPSB0aGlzLl9wYWRGcmFjdGlvbmFsWmVyb3MoZm9ybWF0dGVkKTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gZm9ybWF0dGVkO1xuICAgIH1cbiAgICBzdXBlci5kb0NvbW1pdCgpO1xuICB9XG5cbiAgLyoqICovXG4gIF9ub3JtYWxpemVaZXJvcyh2YWx1ZSkge1xuICAgIGNvbnN0IHBhcnRzID0gdGhpcy5fcmVtb3ZlVGhvdXNhbmRzU2VwYXJhdG9ycyh2YWx1ZSkuc3BsaXQodGhpcy5yYWRpeCk7XG5cbiAgICAvLyByZW1vdmUgbGVhZGluZyB6ZXJvc1xuICAgIHBhcnRzWzBdID0gcGFydHNbMF0ucmVwbGFjZSgvXihcXEQqKSgwKikoXFxkKikvLCAobWF0Y2gsIHNpZ24sIHplcm9zLCBudW0pID0+IHNpZ24gKyBudW0pO1xuICAgIC8vIGFkZCBsZWFkaW5nIHplcm9cbiAgICBpZiAodmFsdWUubGVuZ3RoICYmICEvXFxkJC8udGVzdChwYXJ0c1swXSkpIHBhcnRzWzBdID0gcGFydHNbMF0gKyAnMCc7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcnRzWzFdID0gcGFydHNbMV0ucmVwbGFjZSgvMCokLywgJycpOyAvLyByZW1vdmUgdHJhaWxpbmcgemVyb3NcbiAgICAgIGlmICghcGFydHNbMV0ubGVuZ3RoKSBwYXJ0cy5sZW5ndGggPSAxOyAvLyByZW1vdmUgZnJhY3Rpb25hbFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9pbnNlcnRUaG91c2FuZHNTZXBhcmF0b3JzKHBhcnRzLmpvaW4odGhpcy5yYWRpeCkpO1xuICB9XG5cbiAgLyoqICovXG4gIF9wYWRGcmFjdGlvbmFsWmVyb3ModmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlKSByZXR1cm4gdmFsdWU7XG4gICAgY29uc3QgcGFydHMgPSB2YWx1ZS5zcGxpdCh0aGlzLnJhZGl4KTtcbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikgcGFydHMucHVzaCgnJyk7XG4gICAgcGFydHNbMV0gPSBwYXJ0c1sxXS5wYWRFbmQodGhpcy5zY2FsZSwgJzAnKTtcbiAgICByZXR1cm4gcGFydHMuam9pbih0aGlzLnJhZGl4KTtcbiAgfVxuXG4gIC8qKiAqL1xuICBkb1NraXBJbnZhbGlkKGNoKSB7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBsZXQgY2hlY2tUYWlsID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgZHJvcEZyYWN0aW9uYWwgPSB0aGlzLnNjYWxlID09PSAwICYmIGNoICE9PSB0aGlzLnRob3VzYW5kc1NlcGFyYXRvciAmJiAoY2ggPT09IHRoaXMucmFkaXggfHwgY2ggPT09IE1hc2tlZE51bWJlci5VTk1BU0tFRF9SQURJWCB8fCB0aGlzLm1hcFRvUmFkaXguaW5jbHVkZXMoY2gpKTtcbiAgICByZXR1cm4gc3VwZXIuZG9Ta2lwSW52YWxpZChjaCwgZmxhZ3MsIGNoZWNrVGFpbCkgJiYgIWRyb3BGcmFjdGlvbmFsO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCB1bm1hc2tlZFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZW1vdmVUaG91c2FuZHNTZXBhcmF0b3JzKHRoaXMuX25vcm1hbGl6ZVplcm9zKHRoaXMudmFsdWUpKS5yZXBsYWNlKHRoaXMucmFkaXgsIE1hc2tlZE51bWJlci5VTk1BU0tFRF9SQURJWCk7XG4gIH1cbiAgc2V0IHVubWFza2VkVmFsdWUodW5tYXNrZWRWYWx1ZSkge1xuICAgIHN1cGVyLnVubWFza2VkVmFsdWUgPSB1bm1hc2tlZFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCB0eXBlZFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmRvUGFyc2UodGhpcy51bm1hc2tlZFZhbHVlKTtcbiAgfVxuICBzZXQgdHlwZWRWYWx1ZShuKSB7XG4gICAgdGhpcy5yYXdJbnB1dFZhbHVlID0gdGhpcy5kb0Zvcm1hdChuKS5yZXBsYWNlKE1hc2tlZE51bWJlci5VTk1BU0tFRF9SQURJWCwgdGhpcy5yYWRpeCk7XG4gIH1cblxuICAvKiogUGFyc2VkIE51bWJlciAqL1xuICBnZXQgbnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGVkVmFsdWU7XG4gIH1cbiAgc2V0IG51bWJlcihudW1iZXIpIHtcbiAgICB0aGlzLnR5cGVkVmFsdWUgPSBudW1iZXI7XG4gIH1cblxuICAvKipcbiAgICBJcyBuZWdhdGl2ZSBhbGxvd2VkXG4gICAgQHJlYWRvbmx5XG4gICovXG4gIGdldCBhbGxvd05lZ2F0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLnNpZ25lZCB8fCB0aGlzLm1pbiAhPSBudWxsICYmIHRoaXMubWluIDwgMCB8fCB0aGlzLm1heCAhPSBudWxsICYmIHRoaXMubWF4IDwgMDtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICB0eXBlZFZhbHVlRXF1YWxzKHZhbHVlKSB7XG4gICAgLy8gaGFuZGxlICAwIC0+ICcnIGNhc2UgKHR5cGVkID0gMCBldmVuIGlmIHZhbHVlID0gJycpXG4gICAgLy8gZm9yIGRldGFpbHMgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91Tm1Bbk5lUi9pbWFza2pzL2lzc3Vlcy8xMzRcbiAgICByZXR1cm4gKHN1cGVyLnR5cGVkVmFsdWVFcXVhbHModmFsdWUpIHx8IE1hc2tlZE51bWJlci5FTVBUWV9WQUxVRVMuaW5jbHVkZXModmFsdWUpICYmIE1hc2tlZE51bWJlci5FTVBUWV9WQUxVRVMuaW5jbHVkZXModGhpcy50eXBlZFZhbHVlKSkgJiYgISh2YWx1ZSA9PT0gMCAmJiB0aGlzLnZhbHVlID09PSAnJyk7XG4gIH1cbn1cbk1hc2tlZE51bWJlci5VTk1BU0tFRF9SQURJWCA9ICcuJztcbk1hc2tlZE51bWJlci5ERUZBVUxUUyA9IHtcbiAgcmFkaXg6ICcsJyxcbiAgdGhvdXNhbmRzU2VwYXJhdG9yOiAnJyxcbiAgbWFwVG9SYWRpeDogW01hc2tlZE51bWJlci5VTk1BU0tFRF9SQURJWF0sXG4gIHNjYWxlOiAyLFxuICBzaWduZWQ6IGZhbHNlLFxuICBub3JtYWxpemVaZXJvczogdHJ1ZSxcbiAgcGFkRnJhY3Rpb25hbFplcm9zOiBmYWxzZSxcbiAgcGFyc2U6IE51bWJlcixcbiAgZm9ybWF0OiBuID0+IG4udG9Mb2NhbGVTdHJpbmcoJ2VuLVVTJywge1xuICAgIHVzZUdyb3VwaW5nOiBmYWxzZSxcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIwXG4gIH0pXG59O1xuTWFza2VkTnVtYmVyLkVNUFRZX1ZBTFVFUyA9IFsuLi5NYXNrZWQuRU1QVFlfVkFMVUVTLCAwXTtcbklNYXNrLk1hc2tlZE51bWJlciA9IE1hc2tlZE51bWJlcjtcblxuZXhwb3J0IHsgTWFza2VkTnVtYmVyIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCB7IF8gYXMgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UgfSBmcm9tICcuLi9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLTZiM2JkNDA0LmpzJztcbmltcG9ydCB7IERJUkVDVElPTiB9IGZyb20gJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0IENoYW5nZURldGFpbHMgZnJvbSAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgTWFza2VkIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgUGF0dGVybklucHV0RGVmaW5pdGlvbiwgeyBERUZBVUxUX0lOUFVUX0RFRklOSVRJT05TIH0gZnJvbSAnLi9wYXR0ZXJuL2lucHV0LWRlZmluaXRpb24uanMnO1xuaW1wb3J0IFBhdHRlcm5GaXhlZERlZmluaXRpb24gZnJvbSAnLi9wYXR0ZXJuL2ZpeGVkLWRlZmluaXRpb24uanMnO1xuaW1wb3J0IENodW5rc1RhaWxEZXRhaWxzIGZyb20gJy4vcGF0dGVybi9jaHVuay10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0IFBhdHRlcm5DdXJzb3IgZnJvbSAnLi9wYXR0ZXJuL2N1cnNvci5qcyc7XG5pbXBvcnQgY3JlYXRlTWFzayBmcm9tICcuL2ZhY3RvcnkuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi9yZWdleHAuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NvbnRpbnVvdXMtdGFpbC1kZXRhaWxzLmpzJztcblxuY29uc3QgX2V4Y2x1ZGVkID0gW1wiX2Jsb2Nrc1wiXTtcblxuLyoqXG4gIFBhdHRlcm4gbWFza1xuICBAcGFyYW0ge09iamVjdH0gb3B0c1xuICBAcGFyYW0ge09iamVjdH0gb3B0cy5ibG9ja3NcbiAgQHBhcmFtIHtPYmplY3R9IG9wdHMuZGVmaW5pdGlvbnNcbiAgQHBhcmFtIHtzdHJpbmd9IG9wdHMucGxhY2Vob2xkZXJDaGFyXG4gIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmRpc3BsYXlDaGFyXG4gIEBwYXJhbSB7Ym9vbGVhbn0gb3B0cy5sYXp5XG4qL1xuY2xhc3MgTWFza2VkUGF0dGVybiBleHRlbmRzIE1hc2tlZCB7XG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiBTaW5nbGUgY2hhciBmb3IgZW1wdHkgaW5wdXQgKi9cblxuICAvKiogU2luZ2xlIGNoYXIgZm9yIGZpbGxlZCBpbnB1dCAqL1xuXG4gIC8qKiBTaG93IHBsYWNlaG9sZGVyIG9ubHkgd2hlbiBuZWVkZWQgKi9cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgLy8gVE9ETyB0eXBlICRTaGFwZTxNYXNrZWRQYXR0ZXJuT3B0aW9ucz49e30gZG9lcyBub3Qgd29ya1xuICAgIG9wdHMuZGVmaW5pdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0lOUFVUX0RFRklOSVRJT05TLCBvcHRzLmRlZmluaXRpb25zKTtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCBNYXNrZWRQYXR0ZXJuLkRFRkFVTFRTLCBvcHRzKSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgICBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAqL1xuICBfdXBkYXRlKCkge1xuICAgIGxldCBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICBvcHRzLmRlZmluaXRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZpbml0aW9ucywgb3B0cy5kZWZpbml0aW9ucyk7XG4gICAgc3VwZXIuX3VwZGF0ZShvcHRzKTtcbiAgICB0aGlzLl9yZWJ1aWxkTWFzaygpO1xuICB9XG5cbiAgLyoqICovXG4gIF9yZWJ1aWxkTWFzaygpIHtcbiAgICBjb25zdCBkZWZzID0gdGhpcy5kZWZpbml0aW9ucztcbiAgICB0aGlzLl9ibG9ja3MgPSBbXTtcbiAgICB0aGlzLl9zdG9wcyA9IFtdO1xuICAgIHRoaXMuX21hc2tlZEJsb2NrcyA9IHt9O1xuICAgIGxldCBwYXR0ZXJuID0gdGhpcy5tYXNrO1xuICAgIGlmICghcGF0dGVybiB8fCAhZGVmcykgcmV0dXJuO1xuICAgIGxldCB1bm1hc2tpbmdCbG9jayA9IGZhbHNlO1xuICAgIGxldCBvcHRpb25hbEJsb2NrID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXR0ZXJuLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgX2RlZnMkY2hhciwgX2RlZnMkY2hhcjI7XG4gICAgICBpZiAodGhpcy5ibG9ja3MpIHtcbiAgICAgICAgY29uc3QgcCA9IHBhdHRlcm4uc2xpY2UoaSk7XG4gICAgICAgIGNvbnN0IGJOYW1lcyA9IE9iamVjdC5rZXlzKHRoaXMuYmxvY2tzKS5maWx0ZXIoYk5hbWUgPT4gcC5pbmRleE9mKGJOYW1lKSA9PT0gMCk7XG4gICAgICAgIC8vIG9yZGVyIGJ5IGtleSBsZW5ndGhcbiAgICAgICAgYk5hbWVzLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpO1xuICAgICAgICAvLyB1c2UgYmxvY2sgbmFtZSB3aXRoIG1heCBsZW5ndGhcbiAgICAgICAgY29uc3QgYk5hbWUgPSBiTmFtZXNbMF07XG4gICAgICAgIGlmIChiTmFtZSkge1xuICAgICAgICAgIC8vICRGbG93Rml4TWUgbm8gaWRlYXNcbiAgICAgICAgICBjb25zdCBtYXNrZWRCbG9jayA9IGNyZWF0ZU1hc2soT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgICBsYXp5OiB0aGlzLmxhenksXG4gICAgICAgICAgICBlYWdlcjogdGhpcy5lYWdlcixcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyQ2hhcjogdGhpcy5wbGFjZWhvbGRlckNoYXIsXG4gICAgICAgICAgICBkaXNwbGF5Q2hhcjogdGhpcy5kaXNwbGF5Q2hhcixcbiAgICAgICAgICAgIG92ZXJ3cml0ZTogdGhpcy5vdmVyd3JpdGVcbiAgICAgICAgICB9LCB0aGlzLmJsb2Nrc1tiTmFtZV0pKTtcbiAgICAgICAgICBpZiAobWFza2VkQmxvY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2Jsb2Nrcy5wdXNoKG1hc2tlZEJsb2NrKTtcblxuICAgICAgICAgICAgLy8gc3RvcmUgYmxvY2sgaW5kZXhcbiAgICAgICAgICAgIGlmICghdGhpcy5fbWFza2VkQmxvY2tzW2JOYW1lXSkgdGhpcy5fbWFza2VkQmxvY2tzW2JOYW1lXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbWFza2VkQmxvY2tzW2JOYW1lXS5wdXNoKHRoaXMuX2Jsb2Nrcy5sZW5ndGggLSAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaSArPSBiTmFtZS5sZW5ndGggLSAxO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgY2hhciA9IHBhdHRlcm5baV07XG4gICAgICBsZXQgaXNJbnB1dCA9IChjaGFyIGluIGRlZnMpO1xuICAgICAgaWYgKGNoYXIgPT09IE1hc2tlZFBhdHRlcm4uU1RPUF9DSEFSKSB7XG4gICAgICAgIHRoaXMuX3N0b3BzLnB1c2godGhpcy5fYmxvY2tzLmxlbmd0aCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGNoYXIgPT09ICd7JyB8fCBjaGFyID09PSAnfScpIHtcbiAgICAgICAgdW5tYXNraW5nQmxvY2sgPSAhdW5tYXNraW5nQmxvY2s7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGNoYXIgPT09ICdbJyB8fCBjaGFyID09PSAnXScpIHtcbiAgICAgICAgb3B0aW9uYWxCbG9jayA9ICFvcHRpb25hbEJsb2NrO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFyID09PSBNYXNrZWRQYXR0ZXJuLkVTQ0FQRV9DSEFSKSB7XG4gICAgICAgICsraTtcbiAgICAgICAgY2hhciA9IHBhdHRlcm5baV07XG4gICAgICAgIGlmICghY2hhcikgYnJlYWs7XG4gICAgICAgIGlzSW5wdXQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hc2tPcHRzID0gKF9kZWZzJGNoYXIgPSBkZWZzW2NoYXJdKSAhPT0gbnVsbCAmJiBfZGVmcyRjaGFyICE9PSB2b2lkIDAgJiYgX2RlZnMkY2hhci5tYXNrICYmICEoKChfZGVmcyRjaGFyMiA9IGRlZnNbY2hhcl0pID09PSBudWxsIHx8IF9kZWZzJGNoYXIyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZGVmcyRjaGFyMi5tYXNrLnByb3RvdHlwZSkgaW5zdGFuY2VvZiBJTWFzay5NYXNrZWQpID8gZGVmc1tjaGFyXSA6IHtcbiAgICAgICAgbWFzazogZGVmc1tjaGFyXVxuICAgICAgfTtcbiAgICAgIGNvbnN0IGRlZiA9IGlzSW5wdXQgPyBuZXcgUGF0dGVybklucHV0RGVmaW5pdGlvbihPYmplY3QuYXNzaWduKHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICBpc09wdGlvbmFsOiBvcHRpb25hbEJsb2NrLFxuICAgICAgICBsYXp5OiB0aGlzLmxhenksXG4gICAgICAgIGVhZ2VyOiB0aGlzLmVhZ2VyLFxuICAgICAgICBwbGFjZWhvbGRlckNoYXI6IHRoaXMucGxhY2Vob2xkZXJDaGFyLFxuICAgICAgICBkaXNwbGF5Q2hhcjogdGhpcy5kaXNwbGF5Q2hhclxuICAgICAgfSwgbWFza09wdHMpKSA6IG5ldyBQYXR0ZXJuRml4ZWREZWZpbml0aW9uKHtcbiAgICAgICAgY2hhcixcbiAgICAgICAgZWFnZXI6IHRoaXMuZWFnZXIsXG4gICAgICAgIGlzVW5tYXNraW5nOiB1bm1hc2tpbmdCbG9ja1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9ibG9ja3MucHVzaChkZWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN1cGVyLnN0YXRlLCB7XG4gICAgICBfYmxvY2tzOiB0aGlzLl9ibG9ja3MubWFwKGIgPT4gYi5zdGF0ZSlcbiAgICB9KTtcbiAgfVxuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBjb25zdCB7XG4gICAgICAgIF9ibG9ja3NcbiAgICAgIH0gPSBzdGF0ZSxcbiAgICAgIG1hc2tlZFN0YXRlID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc3RhdGUsIF9leGNsdWRlZCk7XG4gICAgdGhpcy5fYmxvY2tzLmZvckVhY2goKGIsIGJpKSA9PiBiLnN0YXRlID0gX2Jsb2Nrc1tiaV0pO1xuICAgIHN1cGVyLnN0YXRlID0gbWFza2VkU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICB0aGlzLl9ibG9ja3MuZm9yRWFjaChiID0+IGIucmVzZXQoKSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IGlzQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Jsb2Nrcy5ldmVyeShiID0+IGIuaXNDb21wbGV0ZSk7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZ2V0IGlzRmlsbGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9ibG9ja3MuZXZlcnkoYiA9PiBiLmlzRmlsbGVkKTtcbiAgfVxuICBnZXQgaXNGaXhlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYmxvY2tzLmV2ZXJ5KGIgPT4gYi5pc0ZpeGVkKTtcbiAgfVxuICBnZXQgaXNPcHRpb25hbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYmxvY2tzLmV2ZXJ5KGIgPT4gYi5pc09wdGlvbmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBkb0NvbW1pdCgpIHtcbiAgICB0aGlzLl9ibG9ja3MuZm9yRWFjaChiID0+IGIuZG9Db21taXQoKSk7XG4gICAgc3VwZXIuZG9Db21taXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBnZXQgdW5tYXNrZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYmxvY2tzLnJlZHVjZSgoc3RyLCBiKSA9PiBzdHIgKz0gYi51bm1hc2tlZFZhbHVlLCAnJyk7XG4gIH1cbiAgc2V0IHVubWFza2VkVmFsdWUodW5tYXNrZWRWYWx1ZSkge1xuICAgIHN1cGVyLnVubWFza2VkVmFsdWUgPSB1bm1hc2tlZFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCB2YWx1ZSgpIHtcbiAgICAvLyBUT0RPIHJldHVybiBfdmFsdWUgd2hlbiBub3QgaW4gY2hhbmdlP1xuICAgIHJldHVybiB0aGlzLl9ibG9ja3MucmVkdWNlKChzdHIsIGIpID0+IHN0ciArPSBiLnZhbHVlLCAnJyk7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgc3VwZXIudmFsdWUgPSB2YWx1ZTtcbiAgfVxuICBnZXQgZGlzcGxheVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9ibG9ja3MucmVkdWNlKChzdHIsIGIpID0+IHN0ciArPSBiLmRpc3BsYXlWYWx1ZSwgJycpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGFwcGVuZFRhaWwodGFpbCkge1xuICAgIHJldHVybiBzdXBlci5hcHBlbmRUYWlsKHRhaWwpLmFnZ3JlZ2F0ZSh0aGlzLl9hcHBlbmRQbGFjZWhvbGRlcigpKTtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBfYXBwZW5kRWFnZXIoKSB7XG4gICAgdmFyIF90aGlzJF9tYXBQb3NUb0Jsb2NrO1xuICAgIGNvbnN0IGRldGFpbHMgPSBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIGxldCBzdGFydEJsb2NrSW5kZXggPSAoX3RoaXMkX21hcFBvc1RvQmxvY2sgPSB0aGlzLl9tYXBQb3NUb0Jsb2NrKHRoaXMudmFsdWUubGVuZ3RoKSkgPT09IG51bGwgfHwgX3RoaXMkX21hcFBvc1RvQmxvY2sgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJF9tYXBQb3NUb0Jsb2NrLmluZGV4O1xuICAgIGlmIChzdGFydEJsb2NrSW5kZXggPT0gbnVsbCkgcmV0dXJuIGRldGFpbHM7XG5cbiAgICAvLyBUT0RPIHRlc3QgaWYgaXQgd29ya3MgZm9yIG5lc3RlZCBwYXR0ZXJuIG1hc2tzXG4gICAgaWYgKHRoaXMuX2Jsb2Nrc1tzdGFydEJsb2NrSW5kZXhdLmlzRmlsbGVkKSArK3N0YXJ0QmxvY2tJbmRleDtcbiAgICBmb3IgKGxldCBiaSA9IHN0YXJ0QmxvY2tJbmRleDsgYmkgPCB0aGlzLl9ibG9ja3MubGVuZ3RoOyArK2JpKSB7XG4gICAgICBjb25zdCBkID0gdGhpcy5fYmxvY2tzW2JpXS5fYXBwZW5kRWFnZXIoKTtcbiAgICAgIGlmICghZC5pbnNlcnRlZCkgYnJlYWs7XG4gICAgICBkZXRhaWxzLmFnZ3JlZ2F0ZShkKTtcbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgX2FwcGVuZENoYXJSYXcoY2gpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGNvbnN0IGJsb2NrSXRlciA9IHRoaXMuX21hcFBvc1RvQmxvY2sodGhpcy52YWx1ZS5sZW5ndGgpO1xuICAgIGNvbnN0IGRldGFpbHMgPSBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIGlmICghYmxvY2tJdGVyKSByZXR1cm4gZGV0YWlscztcbiAgICBmb3IgKGxldCBiaSA9IGJsb2NrSXRlci5pbmRleDs7ICsrYmkpIHtcbiAgICAgIHZhciBfZmxhZ3MkX2JlZm9yZVRhaWxTdGEsIF9mbGFncyRfYmVmb3JlVGFpbFN0YTI7XG4gICAgICBjb25zdCBibG9jayA9IHRoaXMuX2Jsb2Nrc1tiaV07XG4gICAgICBpZiAoIWJsb2NrKSBicmVhaztcbiAgICAgIGNvbnN0IGJsb2NrRGV0YWlscyA9IGJsb2NrLl9hcHBlbmRDaGFyKGNoLCBPYmplY3QuYXNzaWduKHt9LCBmbGFncywge1xuICAgICAgICBfYmVmb3JlVGFpbFN0YXRlOiAoX2ZsYWdzJF9iZWZvcmVUYWlsU3RhID0gZmxhZ3MuX2JlZm9yZVRhaWxTdGF0ZSkgPT09IG51bGwgfHwgX2ZsYWdzJF9iZWZvcmVUYWlsU3RhID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX2ZsYWdzJF9iZWZvcmVUYWlsU3RhMiA9IF9mbGFncyRfYmVmb3JlVGFpbFN0YS5fYmxvY2tzKSA9PT0gbnVsbCB8fCBfZmxhZ3MkX2JlZm9yZVRhaWxTdGEyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZmxhZ3MkX2JlZm9yZVRhaWxTdGEyW2JpXVxuICAgICAgfSkpO1xuICAgICAgY29uc3Qgc2tpcCA9IGJsb2NrRGV0YWlscy5za2lwO1xuICAgICAgZGV0YWlscy5hZ2dyZWdhdGUoYmxvY2tEZXRhaWxzKTtcbiAgICAgIGlmIChza2lwIHx8IGJsb2NrRGV0YWlscy5yYXdJbnNlcnRlZCkgYnJlYWs7IC8vIGdvIG5leHQgY2hhclxuICAgIH1cblxuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGV4dHJhY3RUYWlsKCkge1xuICAgIGxldCBmcm9tUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgY29uc3QgY2h1bmtUYWlsID0gbmV3IENodW5rc1RhaWxEZXRhaWxzKCk7XG4gICAgaWYgKGZyb21Qb3MgPT09IHRvUG9zKSByZXR1cm4gY2h1bmtUYWlsO1xuICAgIHRoaXMuX2ZvckVhY2hCbG9ja3NJblJhbmdlKGZyb21Qb3MsIHRvUG9zLCAoYiwgYmksIGJGcm9tUG9zLCBiVG9Qb3MpID0+IHtcbiAgICAgIGNvbnN0IGJsb2NrQ2h1bmsgPSBiLmV4dHJhY3RUYWlsKGJGcm9tUG9zLCBiVG9Qb3MpO1xuICAgICAgYmxvY2tDaHVuay5zdG9wID0gdGhpcy5fZmluZFN0b3BCZWZvcmUoYmkpO1xuICAgICAgYmxvY2tDaHVuay5mcm9tID0gdGhpcy5fYmxvY2tTdGFydFBvcyhiaSk7XG4gICAgICBpZiAoYmxvY2tDaHVuayBpbnN0YW5jZW9mIENodW5rc1RhaWxEZXRhaWxzKSBibG9ja0NodW5rLmJsb2NrSW5kZXggPSBiaTtcbiAgICAgIGNodW5rVGFpbC5leHRlbmQoYmxvY2tDaHVuayk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNodW5rVGFpbDtcbiAgfVxuXG4gIC8qKlxuICAgIEBvdmVycmlkZVxuICAqL1xuICBleHRyYWN0SW5wdXQoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuICAgIGlmIChmcm9tUG9zID09PSB0b1BvcykgcmV0dXJuICcnO1xuICAgIGxldCBpbnB1dCA9ICcnO1xuICAgIHRoaXMuX2ZvckVhY2hCbG9ja3NJblJhbmdlKGZyb21Qb3MsIHRvUG9zLCAoYiwgXywgZnJvbVBvcywgdG9Qb3MpID0+IHtcbiAgICAgIGlucHV0ICs9IGIuZXh0cmFjdElucHV0KGZyb21Qb3MsIHRvUG9zLCBmbGFncyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG4gIF9maW5kU3RvcEJlZm9yZShibG9ja0luZGV4KSB7XG4gICAgbGV0IHN0b3BCZWZvcmU7XG4gICAgZm9yIChsZXQgc2kgPSAwOyBzaSA8IHRoaXMuX3N0b3BzLmxlbmd0aDsgKytzaSkge1xuICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuX3N0b3BzW3NpXTtcbiAgICAgIGlmIChzdG9wIDw9IGJsb2NrSW5kZXgpIHN0b3BCZWZvcmUgPSBzdG9wO2Vsc2UgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBzdG9wQmVmb3JlO1xuICB9XG5cbiAgLyoqIEFwcGVuZHMgcGxhY2Vob2xkZXIgZGVwZW5kaW5nIG9uIGxhemluZXNzICovXG4gIF9hcHBlbmRQbGFjZWhvbGRlcih0b0Jsb2NrSW5kZXgpIHtcbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICBpZiAodGhpcy5sYXp5ICYmIHRvQmxvY2tJbmRleCA9PSBudWxsKSByZXR1cm4gZGV0YWlscztcbiAgICBjb25zdCBzdGFydEJsb2NrSXRlciA9IHRoaXMuX21hcFBvc1RvQmxvY2sodGhpcy52YWx1ZS5sZW5ndGgpO1xuICAgIGlmICghc3RhcnRCbG9ja0l0ZXIpIHJldHVybiBkZXRhaWxzO1xuICAgIGNvbnN0IHN0YXJ0QmxvY2tJbmRleCA9IHN0YXJ0QmxvY2tJdGVyLmluZGV4O1xuICAgIGNvbnN0IGVuZEJsb2NrSW5kZXggPSB0b0Jsb2NrSW5kZXggIT0gbnVsbCA/IHRvQmxvY2tJbmRleCA6IHRoaXMuX2Jsb2Nrcy5sZW5ndGg7XG4gICAgdGhpcy5fYmxvY2tzLnNsaWNlKHN0YXJ0QmxvY2tJbmRleCwgZW5kQmxvY2tJbmRleCkuZm9yRWFjaChiID0+IHtcbiAgICAgIGlmICghYi5sYXp5IHx8IHRvQmxvY2tJbmRleCAhPSBudWxsKSB7XG4gICAgICAgIC8vICRGbG93Rml4TWUgYF9ibG9ja3NgIG1heSBub3QgYmUgcHJlc2VudFxuICAgICAgICBjb25zdCBhcmdzID0gYi5fYmxvY2tzICE9IG51bGwgPyBbYi5fYmxvY2tzLmxlbmd0aF0gOiBbXTtcbiAgICAgICAgY29uc3QgYkRldGFpbHMgPSBiLl9hcHBlbmRQbGFjZWhvbGRlciguLi5hcmdzKTtcbiAgICAgICAgdGhpcy5fdmFsdWUgKz0gYkRldGFpbHMuaW5zZXJ0ZWQ7XG4gICAgICAgIGRldGFpbHMuYWdncmVnYXRlKGJEZXRhaWxzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuXG4gIC8qKiBGaW5kcyBibG9jayBpbiBwb3MgKi9cbiAgX21hcFBvc1RvQmxvY2socG9zKSB7XG4gICAgbGV0IGFjY1ZhbCA9ICcnO1xuICAgIGZvciAobGV0IGJpID0gMDsgYmkgPCB0aGlzLl9ibG9ja3MubGVuZ3RoOyArK2JpKSB7XG4gICAgICBjb25zdCBibG9jayA9IHRoaXMuX2Jsb2Nrc1tiaV07XG4gICAgICBjb25zdCBibG9ja1N0YXJ0UG9zID0gYWNjVmFsLmxlbmd0aDtcbiAgICAgIGFjY1ZhbCArPSBibG9jay52YWx1ZTtcbiAgICAgIGlmIChwb3MgPD0gYWNjVmFsLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGluZGV4OiBiaSxcbiAgICAgICAgICBvZmZzZXQ6IHBvcyAtIGJsb2NrU3RhcnRQb3NcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogKi9cbiAgX2Jsb2NrU3RhcnRQb3MoYmxvY2tJbmRleCkge1xuICAgIHJldHVybiB0aGlzLl9ibG9ja3Muc2xpY2UoMCwgYmxvY2tJbmRleCkucmVkdWNlKChwb3MsIGIpID0+IHBvcyArPSBiLnZhbHVlLmxlbmd0aCwgMCk7XG4gIH1cblxuICAvKiogKi9cbiAgX2ZvckVhY2hCbG9ja3NJblJhbmdlKGZyb21Qb3MpIHtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIGxldCBmbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGZyb21CbG9ja0l0ZXIgPSB0aGlzLl9tYXBQb3NUb0Jsb2NrKGZyb21Qb3MpO1xuICAgIGlmIChmcm9tQmxvY2tJdGVyKSB7XG4gICAgICBjb25zdCB0b0Jsb2NrSXRlciA9IHRoaXMuX21hcFBvc1RvQmxvY2sodG9Qb3MpO1xuICAgICAgLy8gcHJvY2VzcyBmaXJzdCBibG9ja1xuICAgICAgY29uc3QgaXNTYW1lQmxvY2sgPSB0b0Jsb2NrSXRlciAmJiBmcm9tQmxvY2tJdGVyLmluZGV4ID09PSB0b0Jsb2NrSXRlci5pbmRleDtcbiAgICAgIGNvbnN0IGZyb21CbG9ja1N0YXJ0UG9zID0gZnJvbUJsb2NrSXRlci5vZmZzZXQ7XG4gICAgICBjb25zdCBmcm9tQmxvY2tFbmRQb3MgPSB0b0Jsb2NrSXRlciAmJiBpc1NhbWVCbG9jayA/IHRvQmxvY2tJdGVyLm9mZnNldCA6IHRoaXMuX2Jsb2Nrc1tmcm9tQmxvY2tJdGVyLmluZGV4XS52YWx1ZS5sZW5ndGg7XG4gICAgICBmbih0aGlzLl9ibG9ja3NbZnJvbUJsb2NrSXRlci5pbmRleF0sIGZyb21CbG9ja0l0ZXIuaW5kZXgsIGZyb21CbG9ja1N0YXJ0UG9zLCBmcm9tQmxvY2tFbmRQb3MpO1xuICAgICAgaWYgKHRvQmxvY2tJdGVyICYmICFpc1NhbWVCbG9jaykge1xuICAgICAgICAvLyBwcm9jZXNzIGludGVybWVkaWF0ZSBibG9ja3NcbiAgICAgICAgZm9yIChsZXQgYmkgPSBmcm9tQmxvY2tJdGVyLmluZGV4ICsgMTsgYmkgPCB0b0Jsb2NrSXRlci5pbmRleDsgKytiaSkge1xuICAgICAgICAgIGZuKHRoaXMuX2Jsb2Nrc1tiaV0sIGJpLCAwLCB0aGlzLl9ibG9ja3NbYmldLnZhbHVlLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcm9jZXNzIGxhc3QgYmxvY2tcbiAgICAgICAgZm4odGhpcy5fYmxvY2tzW3RvQmxvY2tJdGVyLmluZGV4XSwgdG9CbG9ja0l0ZXIuaW5kZXgsIDAsIHRvQmxvY2tJdGVyLm9mZnNldCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIHJlbW92ZSgpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIGNvbnN0IHJlbW92ZURldGFpbHMgPSBzdXBlci5yZW1vdmUoZnJvbVBvcywgdG9Qb3MpO1xuICAgIHRoaXMuX2ZvckVhY2hCbG9ja3NJblJhbmdlKGZyb21Qb3MsIHRvUG9zLCAoYiwgXywgYkZyb21Qb3MsIGJUb1BvcykgPT4ge1xuICAgICAgcmVtb3ZlRGV0YWlscy5hZ2dyZWdhdGUoYi5yZW1vdmUoYkZyb21Qb3MsIGJUb1BvcykpO1xuICAgIH0pO1xuICAgIHJldHVybiByZW1vdmVEZXRhaWxzO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIG5lYXJlc3RJbnB1dFBvcyhjdXJzb3JQb3MpIHtcbiAgICBsZXQgZGlyZWN0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBESVJFQ1RJT04uTk9ORTtcbiAgICBpZiAoIXRoaXMuX2Jsb2Nrcy5sZW5ndGgpIHJldHVybiAwO1xuICAgIGNvbnN0IGN1cnNvciA9IG5ldyBQYXR0ZXJuQ3Vyc29yKHRoaXMsIGN1cnNvclBvcyk7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLk5PTkUpIHtcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIE5PTkUgc2hvdWxkIG9ubHkgZ28gb3V0IGZyb20gZml4ZWQgdG8gdGhlIHJpZ2h0IVxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgaWYgKGN1cnNvci5wdXNoUmlnaHRCZWZvcmVJbnB1dCgpKSByZXR1cm4gY3Vyc29yLnBvcztcbiAgICAgIGN1cnNvci5wb3BTdGF0ZSgpO1xuICAgICAgaWYgKGN1cnNvci5wdXNoTGVmdEJlZm9yZUlucHV0KCkpIHJldHVybiBjdXJzb3IucG9zO1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIEZPUkNFIGlzIG9ubHkgYWJvdXQgYXwqIG90aGVyd2lzZSBpcyAwXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkxFRlQgfHwgZGlyZWN0aW9uID09PSBESVJFQ1RJT04uRk9SQ0VfTEVGVCkge1xuICAgICAgLy8gdHJ5IHRvIGJyZWFrIGZhc3Qgd2hlbiAqfGFcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTi5MRUZUKSB7XG4gICAgICAgIGN1cnNvci5wdXNoUmlnaHRCZWZvcmVGaWxsZWQoKTtcbiAgICAgICAgaWYgKGN1cnNvci5vayAmJiBjdXJzb3IucG9zID09PSBjdXJzb3JQb3MpIHJldHVybiBjdXJzb3JQb3M7XG4gICAgICAgIGN1cnNvci5wb3BTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBmb3J3YXJkIGZsb3dcbiAgICAgIGN1cnNvci5wdXNoTGVmdEJlZm9yZUlucHV0KCk7XG4gICAgICBjdXJzb3IucHVzaExlZnRCZWZvcmVSZXF1aXJlZCgpO1xuICAgICAgY3Vyc29yLnB1c2hMZWZ0QmVmb3JlRmlsbGVkKCk7XG5cbiAgICAgIC8vIGJhY2t3YXJkIGZsb3dcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTi5MRUZUKSB7XG4gICAgICAgIGN1cnNvci5wdXNoUmlnaHRCZWZvcmVJbnB1dCgpO1xuICAgICAgICBjdXJzb3IucHVzaFJpZ2h0QmVmb3JlUmVxdWlyZWQoKTtcbiAgICAgICAgaWYgKGN1cnNvci5vayAmJiBjdXJzb3IucG9zIDw9IGN1cnNvclBvcykgcmV0dXJuIGN1cnNvci5wb3M7XG4gICAgICAgIGN1cnNvci5wb3BTdGF0ZSgpO1xuICAgICAgICBpZiAoY3Vyc29yLm9rICYmIGN1cnNvci5wb3MgPD0gY3Vyc29yUG9zKSByZXR1cm4gY3Vyc29yLnBvcztcbiAgICAgICAgY3Vyc29yLnBvcFN0YXRlKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3Vyc29yLm9rKSByZXR1cm4gY3Vyc29yLnBvcztcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTi5GT1JDRV9MRUZUKSByZXR1cm4gMDtcbiAgICAgIGN1cnNvci5wb3BTdGF0ZSgpO1xuICAgICAgaWYgKGN1cnNvci5vaykgcmV0dXJuIGN1cnNvci5wb3M7XG4gICAgICBjdXJzb3IucG9wU3RhdGUoKTtcbiAgICAgIGlmIChjdXJzb3Iub2spIHJldHVybiBjdXJzb3IucG9zO1xuXG4gICAgICAvLyBjdXJzb3IucG9wU3RhdGUoKTtcbiAgICAgIC8vIGlmIChcbiAgICAgIC8vICAgY3Vyc29yLnB1c2hSaWdodEJlZm9yZUlucHV0KCkgJiZcbiAgICAgIC8vICAgLy8gVE9ETyBIQUNLIGZvciBsYXp5IGlmIGhhcyBhbGlnbmVkIGxlZnQgaW5zaWRlIGZpeGVkIGFuZCBoYXMgY2FtZSB0byB0aGUgc3RhcnQgLSB1c2Ugc3RhcnQgcG9zaXRpb25cbiAgICAgIC8vICAgKCF0aGlzLmxhenkgfHwgdGhpcy5leHRyYWN0SW5wdXQoKSlcbiAgICAgIC8vICkgcmV0dXJuIGN1cnNvci5wb3M7XG5cbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uID09PSBESVJFQ1RJT04uUklHSFQgfHwgZGlyZWN0aW9uID09PSBESVJFQ1RJT04uRk9SQ0VfUklHSFQpIHtcbiAgICAgIC8vIGZvcndhcmQgZmxvd1xuICAgICAgY3Vyc29yLnB1c2hSaWdodEJlZm9yZUlucHV0KCk7XG4gICAgICBjdXJzb3IucHVzaFJpZ2h0QmVmb3JlUmVxdWlyZWQoKTtcbiAgICAgIGlmIChjdXJzb3IucHVzaFJpZ2h0QmVmb3JlRmlsbGVkKCkpIHJldHVybiBjdXJzb3IucG9zO1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkZPUkNFX1JJR0hUKSByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGg7XG5cbiAgICAgIC8vIGJhY2t3YXJkIGZsb3dcbiAgICAgIGN1cnNvci5wb3BTdGF0ZSgpO1xuICAgICAgaWYgKGN1cnNvci5vaykgcmV0dXJuIGN1cnNvci5wb3M7XG4gICAgICBjdXJzb3IucG9wU3RhdGUoKTtcbiAgICAgIGlmIChjdXJzb3Iub2spIHJldHVybiBjdXJzb3IucG9zO1xuICAgICAgcmV0dXJuIHRoaXMubmVhcmVzdElucHV0UG9zKGN1cnNvclBvcywgRElSRUNUSU9OLkxFRlQpO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yUG9zO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIHRvdGFsSW5wdXRQb3NpdGlvbnMoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICBsZXQgdG90YWwgPSAwO1xuICAgIHRoaXMuX2ZvckVhY2hCbG9ja3NJblJhbmdlKGZyb21Qb3MsIHRvUG9zLCAoYiwgXywgYkZyb21Qb3MsIGJUb1BvcykgPT4ge1xuICAgICAgdG90YWwgKz0gYi50b3RhbElucHV0UG9zaXRpb25zKGJGcm9tUG9zLCBiVG9Qb3MpO1xuICAgIH0pO1xuICAgIHJldHVybiB0b3RhbDtcbiAgfVxuXG4gIC8qKiBHZXQgYmxvY2sgYnkgbmFtZSAqL1xuICBtYXNrZWRCbG9jayhuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkQmxvY2tzKG5hbWUpWzBdO1xuICB9XG5cbiAgLyoqIEdldCBhbGwgYmxvY2tzIGJ5IG5hbWUgKi9cbiAgbWFza2VkQmxvY2tzKG5hbWUpIHtcbiAgICBjb25zdCBpbmRpY2VzID0gdGhpcy5fbWFza2VkQmxvY2tzW25hbWVdO1xuICAgIGlmICghaW5kaWNlcykgcmV0dXJuIFtdO1xuICAgIHJldHVybiBpbmRpY2VzLm1hcChnaSA9PiB0aGlzLl9ibG9ja3NbZ2ldKTtcbiAgfVxufVxuTWFza2VkUGF0dGVybi5ERUZBVUxUUyA9IHtcbiAgbGF6eTogdHJ1ZSxcbiAgcGxhY2Vob2xkZXJDaGFyOiAnXydcbn07XG5NYXNrZWRQYXR0ZXJuLlNUT1BfQ0hBUiA9ICdgJztcbk1hc2tlZFBhdHRlcm4uRVNDQVBFX0NIQVIgPSAnXFxcXCc7XG5NYXNrZWRQYXR0ZXJuLklucHV0RGVmaW5pdGlvbiA9IFBhdHRlcm5JbnB1dERlZmluaXRpb247XG5NYXNrZWRQYXR0ZXJuLkZpeGVkRGVmaW5pdGlvbiA9IFBhdHRlcm5GaXhlZERlZmluaXRpb247XG5JTWFzay5NYXNrZWRQYXR0ZXJuID0gTWFza2VkUGF0dGVybjtcblxuZXhwb3J0IHsgTWFza2VkUGF0dGVybiBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgeyBfIGFzIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIH0gZnJvbSAnLi4vLi4vX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy02YjNiZDQwNC5qcyc7XG5pbXBvcnQgQ2hhbmdlRGV0YWlscyBmcm9tICcuLi8uLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgQ29udGludW91c1RhaWxEZXRhaWxzIGZyb20gJy4uLy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uLy4uL2NvcmUvaG9sZGVyLmpzJztcblxuY29uc3QgX2V4Y2x1ZGVkID0gW1wiY2h1bmtzXCJdO1xuY2xhc3MgQ2h1bmtzVGFpbERldGFpbHMge1xuICAvKiogKi9cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgY2h1bmtzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbXTtcbiAgICBsZXQgZnJvbSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgICB0aGlzLmNodW5rcyA9IGNodW5rcztcbiAgICB0aGlzLmZyb20gPSBmcm9tO1xuICB9XG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmNodW5rcy5tYXAoU3RyaW5nKS5qb2luKCcnKTtcbiAgfVxuXG4gIC8vICRGbG93Rml4TWUgbm8gaWRlYXNcbiAgZXh0ZW5kKHRhaWxDaHVuaykge1xuICAgIGlmICghU3RyaW5nKHRhaWxDaHVuaykpIHJldHVybjtcbiAgICBpZiAoaXNTdHJpbmcodGFpbENodW5rKSkgdGFpbENodW5rID0gbmV3IENvbnRpbnVvdXNUYWlsRGV0YWlscyhTdHJpbmcodGFpbENodW5rKSk7XG4gICAgY29uc3QgbGFzdENodW5rID0gdGhpcy5jaHVua3NbdGhpcy5jaHVua3MubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgZXh0ZW5kTGFzdCA9IGxhc3RDaHVuayAmJiAoXG4gICAgLy8gaWYgc3RvcHMgYXJlIHNhbWUgb3IgdGFpbCBoYXMgbm8gc3RvcFxuICAgIGxhc3RDaHVuay5zdG9wID09PSB0YWlsQ2h1bmsuc3RvcCB8fCB0YWlsQ2h1bmsuc3RvcCA9PSBudWxsKSAmJlxuICAgIC8vIGlmIHRhaWwgY2h1bmsgZ29lcyBqdXN0IGFmdGVyIGxhc3QgY2h1bmtcbiAgICB0YWlsQ2h1bmsuZnJvbSA9PT0gbGFzdENodW5rLmZyb20gKyBsYXN0Q2h1bmsudG9TdHJpbmcoKS5sZW5ndGg7XG4gICAgaWYgKHRhaWxDaHVuayBpbnN0YW5jZW9mIENvbnRpbnVvdXNUYWlsRGV0YWlscykge1xuICAgICAgLy8gY2hlY2sgdGhlIGFiaWxpdHkgdG8gZXh0ZW5kIHByZXZpb3VzIGNodW5rXG4gICAgICBpZiAoZXh0ZW5kTGFzdCkge1xuICAgICAgICAvLyBleHRlbmQgcHJldmlvdXMgY2h1bmtcbiAgICAgICAgbGFzdENodW5rLmV4dGVuZCh0YWlsQ2h1bmsudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhcHBlbmQgbmV3IGNodW5rXG4gICAgICAgIHRoaXMuY2h1bmtzLnB1c2godGFpbENodW5rKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRhaWxDaHVuayBpbnN0YW5jZW9mIENodW5rc1RhaWxEZXRhaWxzKSB7XG4gICAgICBpZiAodGFpbENodW5rLnN0b3AgPT0gbnVsbCkge1xuICAgICAgICAvLyB1bndyYXAgZmxvYXRpbmcgY2h1bmtzIHRvIHBhcmVudCwga2VlcGluZyBgZnJvbWAgcG9zXG4gICAgICAgIGxldCBmaXJzdFRhaWxDaHVuaztcbiAgICAgICAgd2hpbGUgKHRhaWxDaHVuay5jaHVua3MubGVuZ3RoICYmIHRhaWxDaHVuay5jaHVua3NbMF0uc3RvcCA9PSBudWxsKSB7XG4gICAgICAgICAgZmlyc3RUYWlsQ2h1bmsgPSB0YWlsQ2h1bmsuY2h1bmtzLnNoaWZ0KCk7XG4gICAgICAgICAgZmlyc3RUYWlsQ2h1bmsuZnJvbSArPSB0YWlsQ2h1bmsuZnJvbTtcbiAgICAgICAgICB0aGlzLmV4dGVuZChmaXJzdFRhaWxDaHVuayk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGFpbCBjaHVuayBzdGlsbCBoYXMgdmFsdWVcbiAgICAgIGlmICh0YWlsQ2h1bmsudG9TdHJpbmcoKSkge1xuICAgICAgICAvLyBpZiBjaHVua3MgY29udGFpbnMgc3RvcHMsIHRoZW4gcG9wdXAgc3RvcCB0byBjb250YWluZXJcbiAgICAgICAgdGFpbENodW5rLnN0b3AgPSB0YWlsQ2h1bmsuYmxvY2tJbmRleDtcbiAgICAgICAgdGhpcy5jaHVua3MucHVzaCh0YWlsQ2h1bmspO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhcHBlbmRUbyhtYXNrZWQpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgaWYgKCEobWFza2VkIGluc3RhbmNlb2YgSU1hc2suTWFza2VkUGF0dGVybikpIHtcbiAgICAgIGNvbnN0IHRhaWwgPSBuZXcgQ29udGludW91c1RhaWxEZXRhaWxzKHRoaXMudG9TdHJpbmcoKSk7XG4gICAgICByZXR1cm4gdGFpbC5hcHBlbmRUbyhtYXNrZWQpO1xuICAgIH1cbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICBmb3IgKGxldCBjaSA9IDA7IGNpIDwgdGhpcy5jaHVua3MubGVuZ3RoICYmICFkZXRhaWxzLnNraXA7ICsrY2kpIHtcbiAgICAgIGNvbnN0IGNodW5rID0gdGhpcy5jaHVua3NbY2ldO1xuICAgICAgY29uc3QgbGFzdEJsb2NrSXRlciA9IG1hc2tlZC5fbWFwUG9zVG9CbG9jayhtYXNrZWQudmFsdWUubGVuZ3RoKTtcbiAgICAgIGNvbnN0IHN0b3AgPSBjaHVuay5zdG9wO1xuICAgICAgbGV0IGNodW5rQmxvY2s7XG4gICAgICBpZiAoc3RvcCAhPSBudWxsICYmIChcbiAgICAgIC8vIGlmIGJsb2NrIG5vdCBmb3VuZCBvciBzdG9wIGlzIGJlaGluZCBsYXN0QmxvY2tcbiAgICAgICFsYXN0QmxvY2tJdGVyIHx8IGxhc3RCbG9ja0l0ZXIuaW5kZXggPD0gc3RvcCkpIHtcbiAgICAgICAgaWYgKGNodW5rIGluc3RhbmNlb2YgQ2h1bmtzVGFpbERldGFpbHMgfHxcbiAgICAgICAgLy8gZm9yIGNvbnRpbnVvdXMgYmxvY2sgYWxzbyBjaGVjayBpZiBzdG9wIGlzIGV4aXN0XG4gICAgICAgIG1hc2tlZC5fc3RvcHMuaW5kZXhPZihzdG9wKSA+PSAwKSB7XG4gICAgICAgICAgY29uc3QgcGhEZXRhaWxzID0gbWFza2VkLl9hcHBlbmRQbGFjZWhvbGRlcihzdG9wKTtcbiAgICAgICAgICBkZXRhaWxzLmFnZ3JlZ2F0ZShwaERldGFpbHMpO1xuICAgICAgICB9XG4gICAgICAgIGNodW5rQmxvY2sgPSBjaHVuayBpbnN0YW5jZW9mIENodW5rc1RhaWxEZXRhaWxzICYmIG1hc2tlZC5fYmxvY2tzW3N0b3BdO1xuICAgICAgfVxuICAgICAgaWYgKGNodW5rQmxvY2spIHtcbiAgICAgICAgY29uc3QgdGFpbERldGFpbHMgPSBjaHVua0Jsb2NrLmFwcGVuZFRhaWwoY2h1bmspO1xuICAgICAgICB0YWlsRGV0YWlscy5za2lwID0gZmFsc2U7IC8vIGFsd2F5cyBpZ25vcmUgc2tpcCwgaXQgd2lsbCBiZSBzZXQgb24gbGFzdFxuICAgICAgICBkZXRhaWxzLmFnZ3JlZ2F0ZSh0YWlsRGV0YWlscyk7XG4gICAgICAgIG1hc2tlZC5fdmFsdWUgKz0gdGFpbERldGFpbHMuaW5zZXJ0ZWQ7XG5cbiAgICAgICAgLy8gZ2V0IG5vdCBpbnNlcnRlZCBjaGFyc1xuICAgICAgICBjb25zdCByZW1haW5DaGFycyA9IGNodW5rLnRvU3RyaW5nKCkuc2xpY2UodGFpbERldGFpbHMucmF3SW5zZXJ0ZWQubGVuZ3RoKTtcbiAgICAgICAgaWYgKHJlbWFpbkNoYXJzKSBkZXRhaWxzLmFnZ3JlZ2F0ZShtYXNrZWQuYXBwZW5kKHJlbWFpbkNoYXJzLCB7XG4gICAgICAgICAgdGFpbDogdHJ1ZVxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXRhaWxzLmFnZ3JlZ2F0ZShtYXNrZWQuYXBwZW5kKGNodW5rLnRvU3RyaW5nKCksIHtcbiAgICAgICAgICB0YWlsOiB0cnVlXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjaHVua3M6IHRoaXMuY2h1bmtzLm1hcChjID0+IGMuc3RhdGUpLFxuICAgICAgZnJvbTogdGhpcy5mcm9tLFxuICAgICAgc3RvcDogdGhpcy5zdG9wLFxuICAgICAgYmxvY2tJbmRleDogdGhpcy5ibG9ja0luZGV4XG4gICAgfTtcbiAgfVxuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBjb25zdCB7XG4gICAgICAgIGNodW5rc1xuICAgICAgfSA9IHN0YXRlLFxuICAgICAgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzdGF0ZSwgX2V4Y2x1ZGVkKTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHByb3BzKTtcbiAgICB0aGlzLmNodW5rcyA9IGNodW5rcy5tYXAoY3N0YXRlID0+IHtcbiAgICAgIGNvbnN0IGNodW5rID0gXCJjaHVua3NcIiBpbiBjc3RhdGUgPyBuZXcgQ2h1bmtzVGFpbERldGFpbHMoKSA6IG5ldyBDb250aW51b3VzVGFpbERldGFpbHMoKTtcbiAgICAgIC8vICRGbG93Rml4TWUgYWxyZWFkeSBjaGVja2VkIGFib3ZlXG4gICAgICBjaHVuay5zdGF0ZSA9IGNzdGF0ZTtcbiAgICAgIHJldHVybiBjaHVuaztcbiAgICB9KTtcbiAgfVxuICB1bnNoaWZ0KGJlZm9yZVBvcykge1xuICAgIGlmICghdGhpcy5jaHVua3MubGVuZ3RoIHx8IGJlZm9yZVBvcyAhPSBudWxsICYmIHRoaXMuZnJvbSA+PSBiZWZvcmVQb3MpIHJldHVybiAnJztcbiAgICBjb25zdCBjaHVua1NoaWZ0UG9zID0gYmVmb3JlUG9zICE9IG51bGwgPyBiZWZvcmVQb3MgLSB0aGlzLmZyb20gOiBiZWZvcmVQb3M7XG4gICAgbGV0IGNpID0gMDtcbiAgICB3aGlsZSAoY2kgPCB0aGlzLmNodW5rcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNodW5rID0gdGhpcy5jaHVua3NbY2ldO1xuICAgICAgY29uc3Qgc2hpZnRDaGFyID0gY2h1bmsudW5zaGlmdChjaHVua1NoaWZ0UG9zKTtcbiAgICAgIGlmIChjaHVuay50b1N0cmluZygpKSB7XG4gICAgICAgIC8vIGNodW5rIHN0aWxsIGNvbnRhaW5zIHZhbHVlXG4gICAgICAgIC8vIGJ1dCBub3Qgc2hpZnRlZCAtIG1lYW5zIG5vIG1vcmUgYXZhaWxhYmxlIGNoYXJzIHRvIHNoaWZ0XG4gICAgICAgIGlmICghc2hpZnRDaGFyKSBicmVhaztcbiAgICAgICAgKytjaTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNsZWFuIGlmIGNodW5rIGhhcyBubyB2YWx1ZVxuICAgICAgICB0aGlzLmNodW5rcy5zcGxpY2UoY2ksIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHNoaWZ0Q2hhcikgcmV0dXJuIHNoaWZ0Q2hhcjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHNoaWZ0KCkge1xuICAgIGlmICghdGhpcy5jaHVua3MubGVuZ3RoKSByZXR1cm4gJyc7XG4gICAgbGV0IGNpID0gdGhpcy5jaHVua3MubGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAoMCA8PSBjaSkge1xuICAgICAgY29uc3QgY2h1bmsgPSB0aGlzLmNodW5rc1tjaV07XG4gICAgICBjb25zdCBzaGlmdENoYXIgPSBjaHVuay5zaGlmdCgpO1xuICAgICAgaWYgKGNodW5rLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgLy8gY2h1bmsgc3RpbGwgY29udGFpbnMgdmFsdWVcbiAgICAgICAgLy8gYnV0IG5vdCBzaGlmdGVkIC0gbWVhbnMgbm8gbW9yZSBhdmFpbGFibGUgY2hhcnMgdG8gc2hpZnRcbiAgICAgICAgaWYgKCFzaGlmdENoYXIpIGJyZWFrO1xuICAgICAgICAtLWNpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2xlYW4gaWYgY2h1bmsgaGFzIG5vIHZhbHVlXG4gICAgICAgIHRoaXMuY2h1bmtzLnNwbGljZShjaSwgMSk7XG4gICAgICB9XG4gICAgICBpZiAoc2hpZnRDaGFyKSByZXR1cm4gc2hpZnRDaGFyO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuZXhwb3J0IHsgQ2h1bmtzVGFpbERldGFpbHMgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgRElSRUNUSU9OIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgJy4uLy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuLi8uLi9jb3JlL2hvbGRlci5qcyc7XG5cbmNsYXNzIFBhdHRlcm5DdXJzb3Ige1xuICBjb25zdHJ1Y3RvcihtYXNrZWQsIHBvcykge1xuICAgIHRoaXMubWFza2VkID0gbWFza2VkO1xuICAgIHRoaXMuX2xvZyA9IFtdO1xuICAgIGNvbnN0IHtcbiAgICAgIG9mZnNldCxcbiAgICAgIGluZGV4XG4gICAgfSA9IG1hc2tlZC5fbWFwUG9zVG9CbG9jayhwb3MpIHx8IChwb3MgPCAwID9cbiAgICAvLyBmaXJzdFxuICAgIHtcbiAgICAgIGluZGV4OiAwLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSA6XG4gICAgLy8gbGFzdFxuICAgIHtcbiAgICAgIGluZGV4OiB0aGlzLm1hc2tlZC5fYmxvY2tzLmxlbmd0aCxcbiAgICAgIG9mZnNldDogMFxuICAgIH0pO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB0aGlzLm9rID0gZmFsc2U7XG4gIH1cbiAgZ2V0IGJsb2NrKCkge1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC5fYmxvY2tzW3RoaXMuaW5kZXhdO1xuICB9XG4gIGdldCBwb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLl9ibG9ja1N0YXJ0UG9zKHRoaXMuaW5kZXgpICsgdGhpcy5vZmZzZXQ7XG4gIH1cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICBvazogdGhpcy5va1xuICAgIH07XG4gIH1cbiAgc2V0IHN0YXRlKHMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHMpO1xuICB9XG4gIHB1c2hTdGF0ZSgpIHtcbiAgICB0aGlzLl9sb2cucHVzaCh0aGlzLnN0YXRlKTtcbiAgfVxuICBwb3BTdGF0ZSgpIHtcbiAgICBjb25zdCBzID0gdGhpcy5fbG9nLnBvcCgpO1xuICAgIHRoaXMuc3RhdGUgPSBzO1xuICAgIHJldHVybiBzO1xuICB9XG4gIGJpbmRCbG9jaygpIHtcbiAgICBpZiAodGhpcy5ibG9jaykgcmV0dXJuO1xuICAgIGlmICh0aGlzLmluZGV4IDwgMCkge1xuICAgICAgdGhpcy5pbmRleCA9IDA7XG4gICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgfVxuICAgIGlmICh0aGlzLmluZGV4ID49IHRoaXMubWFza2VkLl9ibG9ja3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLmluZGV4ID0gdGhpcy5tYXNrZWQuX2Jsb2Nrcy5sZW5ndGggLSAxO1xuICAgICAgdGhpcy5vZmZzZXQgPSB0aGlzLmJsb2NrLnZhbHVlLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgX3B1c2hMZWZ0KGZuKSB7XG4gICAgdGhpcy5wdXNoU3RhdGUoKTtcbiAgICBmb3IgKHRoaXMuYmluZEJsb2NrKCk7IDAgPD0gdGhpcy5pbmRleDsgLS10aGlzLmluZGV4LCB0aGlzLm9mZnNldCA9ICgoX3RoaXMkYmxvY2sgPSB0aGlzLmJsb2NrKSA9PT0gbnVsbCB8fCBfdGhpcyRibG9jayA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkYmxvY2sudmFsdWUubGVuZ3RoKSB8fCAwKSB7XG4gICAgICB2YXIgX3RoaXMkYmxvY2s7XG4gICAgICBpZiAoZm4oKSkgcmV0dXJuIHRoaXMub2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vayA9IGZhbHNlO1xuICB9XG4gIF9wdXNoUmlnaHQoZm4pIHtcbiAgICB0aGlzLnB1c2hTdGF0ZSgpO1xuICAgIGZvciAodGhpcy5iaW5kQmxvY2soKTsgdGhpcy5pbmRleCA8IHRoaXMubWFza2VkLl9ibG9ja3MubGVuZ3RoOyArK3RoaXMuaW5kZXgsIHRoaXMub2Zmc2V0ID0gMCkge1xuICAgICAgaWYgKGZuKCkpIHJldHVybiB0aGlzLm9rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub2sgPSBmYWxzZTtcbiAgfVxuICBwdXNoTGVmdEJlZm9yZUZpbGxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHVzaExlZnQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYmxvY2suaXNGaXhlZCB8fCAhdGhpcy5ibG9jay52YWx1ZSkgcmV0dXJuO1xuICAgICAgdGhpcy5vZmZzZXQgPSB0aGlzLmJsb2NrLm5lYXJlc3RJbnB1dFBvcyh0aGlzLm9mZnNldCwgRElSRUNUSU9OLkZPUkNFX0xFRlQpO1xuICAgICAgaWYgKHRoaXMub2Zmc2V0ICE9PSAwKSByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuICBwdXNoTGVmdEJlZm9yZUlucHV0KCkge1xuICAgIC8vIGNhc2VzOlxuICAgIC8vIGZpbGxlZCBpbnB1dDogMDB8XG4gICAgLy8gb3B0aW9uYWwgZW1wdHkgaW5wdXQ6IDAwW118XG4gICAgLy8gbmVzdGVkIGJsb2NrOiBYWDxbXT58XG4gICAgcmV0dXJuIHRoaXMuX3B1c2hMZWZ0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmJsb2NrLmlzRml4ZWQpIHJldHVybjtcbiAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5ibG9jay5uZWFyZXN0SW5wdXRQb3ModGhpcy5vZmZzZXQsIERJUkVDVElPTi5MRUZUKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG4gIHB1c2hMZWZ0QmVmb3JlUmVxdWlyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3B1c2hMZWZ0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmJsb2NrLmlzRml4ZWQgfHwgdGhpcy5ibG9jay5pc09wdGlvbmFsICYmICF0aGlzLmJsb2NrLnZhbHVlKSByZXR1cm47XG4gICAgICB0aGlzLm9mZnNldCA9IHRoaXMuYmxvY2submVhcmVzdElucHV0UG9zKHRoaXMub2Zmc2V0LCBESVJFQ1RJT04uTEVGVCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuICBwdXNoUmlnaHRCZWZvcmVGaWxsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3B1c2hSaWdodCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5ibG9jay5pc0ZpeGVkIHx8ICF0aGlzLmJsb2NrLnZhbHVlKSByZXR1cm47XG4gICAgICB0aGlzLm9mZnNldCA9IHRoaXMuYmxvY2submVhcmVzdElucHV0UG9zKHRoaXMub2Zmc2V0LCBESVJFQ1RJT04uRk9SQ0VfUklHSFQpO1xuICAgICAgaWYgKHRoaXMub2Zmc2V0ICE9PSB0aGlzLmJsb2NrLnZhbHVlLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cbiAgcHVzaFJpZ2h0QmVmb3JlSW5wdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3B1c2hSaWdodCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5ibG9jay5pc0ZpeGVkKSByZXR1cm47XG5cbiAgICAgIC8vIGNvbnN0IG8gPSB0aGlzLm9mZnNldDtcbiAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5ibG9jay5uZWFyZXN0SW5wdXRQb3ModGhpcy5vZmZzZXQsIERJUkVDVElPTi5OT05FKTtcbiAgICAgIC8vIEhBQ0sgY2FzZXMgbGlrZSAoU1RJTEwgRE9FUyBOT1QgV09SSyBGT1IgTkVTVEVEKVxuICAgICAgLy8gYWF8WFxuICAgICAgLy8gYWE8WHxbXT5YXyAgICAtIHRoaXMgd2lsbCBub3Qgd29ya1xuICAgICAgLy8gaWYgKG8gJiYgbyA9PT0gdGhpcy5vZmZzZXQgJiYgdGhpcy5ibG9jayBpbnN0YW5jZW9mIFBhdHRlcm5JbnB1dERlZmluaXRpb24pIGNvbnRpbnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cbiAgcHVzaFJpZ2h0QmVmb3JlUmVxdWlyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3B1c2hSaWdodCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5ibG9jay5pc0ZpeGVkIHx8IHRoaXMuYmxvY2suaXNPcHRpb25hbCAmJiAhdGhpcy5ibG9jay52YWx1ZSkgcmV0dXJuO1xuXG4gICAgICAvLyBUT0RPIGNoZWNrIHxbKl1YWF9cbiAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5ibG9jay5uZWFyZXN0SW5wdXRQb3ModGhpcy5vZmZzZXQsIERJUkVDVElPTi5OT05FKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7IFBhdHRlcm5DdXJzb3IgYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IENoYW5nZURldGFpbHMgZnJvbSAnLi4vLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5pbXBvcnQgeyBESVJFQ1RJT04sIGlzU3RyaW5nIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscy5qcyc7XG5pbXBvcnQgQ29udGludW91c1RhaWxEZXRhaWxzIGZyb20gJy4uLy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuLi8uLi9jb3JlL2hvbGRlci5qcyc7XG5cbi8qKiAqL1xuXG5jbGFzcyBQYXR0ZXJuRml4ZWREZWZpbml0aW9uIHtcbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgLyoqICovXG5cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0cyk7XG4gICAgdGhpcy5fdmFsdWUgPSAnJztcbiAgICB0aGlzLmlzRml4ZWQgPSB0cnVlO1xuICB9XG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cbiAgZ2V0IHVubWFza2VkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNVbm1hc2tpbmcgPyB0aGlzLnZhbHVlIDogJyc7XG4gIH1cbiAgZ2V0IGRpc3BsYXlWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLl9pc1Jhd0lucHV0ID0gZmFsc2U7XG4gICAgdGhpcy5fdmFsdWUgPSAnJztcbiAgfVxuICByZW1vdmUoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLl92YWx1ZS5sZW5ndGg7XG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLl92YWx1ZS5zbGljZSgwLCBmcm9tUG9zKSArIHRoaXMuX3ZhbHVlLnNsaWNlKHRvUG9zKTtcbiAgICBpZiAoIXRoaXMuX3ZhbHVlKSB0aGlzLl9pc1Jhd0lucHV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gIH1cbiAgbmVhcmVzdElucHV0UG9zKGN1cnNvclBvcykge1xuICAgIGxldCBkaXJlY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IERJUkVDVElPTi5OT05FO1xuICAgIGNvbnN0IG1pblBvcyA9IDA7XG4gICAgY29uc3QgbWF4UG9zID0gdGhpcy5fdmFsdWUubGVuZ3RoO1xuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxuICAgICAgY2FzZSBESVJFQ1RJT04uRk9SQ0VfTEVGVDpcbiAgICAgICAgcmV0dXJuIG1pblBvcztcbiAgICAgIGNhc2UgRElSRUNUSU9OLk5PTkU6XG4gICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcbiAgICAgIGNhc2UgRElSRUNUSU9OLkZPUkNFX1JJR0hUOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG1heFBvcztcbiAgICB9XG4gIH1cbiAgdG90YWxJbnB1dFBvc2l0aW9ucygpIHtcbiAgICBsZXQgZnJvbVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICBsZXQgdG9Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMuX3ZhbHVlLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5faXNSYXdJbnB1dCA/IHRvUG9zIC0gZnJvbVBvcyA6IDA7XG4gIH1cbiAgZXh0cmFjdElucHV0KCkge1xuICAgIGxldCBmcm9tUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy5fdmFsdWUubGVuZ3RoO1xuICAgIGxldCBmbGFncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG4gICAgcmV0dXJuIGZsYWdzLnJhdyAmJiB0aGlzLl9pc1Jhd0lucHV0ICYmIHRoaXMuX3ZhbHVlLnNsaWNlKGZyb21Qb3MsIHRvUG9zKSB8fCAnJztcbiAgfVxuICBnZXQgaXNDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBnZXQgaXNGaWxsZWQoKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5fdmFsdWUpO1xuICB9XG4gIF9hcHBlbmRDaGFyKGNoKSB7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBjb25zdCBkZXRhaWxzID0gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICBpZiAodGhpcy5pc0ZpbGxlZCkgcmV0dXJuIGRldGFpbHM7XG4gICAgY29uc3QgYXBwZW5kRWFnZXIgPSB0aGlzLmVhZ2VyID09PSB0cnVlIHx8IHRoaXMuZWFnZXIgPT09ICdhcHBlbmQnO1xuICAgIGNvbnN0IGFwcGVuZGVkID0gdGhpcy5jaGFyID09PSBjaDtcbiAgICBjb25zdCBpc1Jlc29sdmVkID0gYXBwZW5kZWQgJiYgKHRoaXMuaXNVbm1hc2tpbmcgfHwgZmxhZ3MuaW5wdXQgfHwgZmxhZ3MucmF3KSAmJiAoIWZsYWdzLnJhdyB8fCAhYXBwZW5kRWFnZXIpICYmICFmbGFncy50YWlsO1xuICAgIGlmIChpc1Jlc29sdmVkKSBkZXRhaWxzLnJhd0luc2VydGVkID0gdGhpcy5jaGFyO1xuICAgIHRoaXMuX3ZhbHVlID0gZGV0YWlscy5pbnNlcnRlZCA9IHRoaXMuY2hhcjtcbiAgICB0aGlzLl9pc1Jhd0lucHV0ID0gaXNSZXNvbHZlZCAmJiAoZmxhZ3MucmF3IHx8IGZsYWdzLmlucHV0KTtcbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxuICBfYXBwZW5kRWFnZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcGVuZENoYXIodGhpcy5jaGFyLCB7XG4gICAgICB0YWlsOiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgX2FwcGVuZFBsYWNlaG9sZGVyKCkge1xuICAgIGNvbnN0IGRldGFpbHMgPSBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICAgIGlmICh0aGlzLmlzRmlsbGVkKSByZXR1cm4gZGV0YWlscztcbiAgICB0aGlzLl92YWx1ZSA9IGRldGFpbHMuaW5zZXJ0ZWQgPSB0aGlzLmNoYXI7XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cbiAgZXh0cmFjdFRhaWwoKSB7XG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IENvbnRpbnVvdXNUYWlsRGV0YWlscygnJyk7XG4gIH1cblxuICAvLyAkRmxvd0ZpeE1lIG5vIGlkZWFzXG4gIGFwcGVuZFRhaWwodGFpbCkge1xuICAgIGlmIChpc1N0cmluZyh0YWlsKSkgdGFpbCA9IG5ldyBDb250aW51b3VzVGFpbERldGFpbHMoU3RyaW5nKHRhaWwpKTtcbiAgICByZXR1cm4gdGFpbC5hcHBlbmRUbyh0aGlzKTtcbiAgfVxuICBhcHBlbmQoc3RyLCBmbGFncywgdGFpbCkge1xuICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLl9hcHBlbmRDaGFyKHN0clswXSwgZmxhZ3MpO1xuICAgIGlmICh0YWlsICE9IG51bGwpIHtcbiAgICAgIGRldGFpbHMudGFpbFNoaWZ0ICs9IHRoaXMuYXBwZW5kVGFpbCh0YWlsKS50YWlsU2hpZnQ7XG4gICAgfVxuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG4gIGRvQ29tbWl0KCkge31cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBfdmFsdWU6IHRoaXMuX3ZhbHVlLFxuICAgICAgX2lzUmF3SW5wdXQ6IHRoaXMuX2lzUmF3SW5wdXRcbiAgICB9O1xuICB9XG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgc3RhdGUpO1xuICB9XG59XG5cbmV4cG9ydCB7IFBhdHRlcm5GaXhlZERlZmluaXRpb24gYXMgZGVmYXVsdCB9O1xuIiwiaW1wb3J0IHsgXyBhcyBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSB9IGZyb20gJy4uLy4uL19yb2xsdXBQbHVnaW5CYWJlbEhlbHBlcnMtNmIzYmQ0MDQuanMnO1xuaW1wb3J0IGNyZWF0ZU1hc2sgZnJvbSAnLi4vZmFjdG9yeS5qcyc7XG5pbXBvcnQgQ2hhbmdlRGV0YWlscyBmcm9tICcuLi8uLi9jb3JlL2NoYW5nZS1kZXRhaWxzLmpzJztcbmltcG9ydCB7IERJUkVDVElPTiB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0ICcuLi8uLi9jb3JlL2hvbGRlci5qcyc7XG5cbmNvbnN0IF9leGNsdWRlZCA9IFtcInBhcmVudFwiLCBcImlzT3B0aW9uYWxcIiwgXCJwbGFjZWhvbGRlckNoYXJcIiwgXCJkaXNwbGF5Q2hhclwiLCBcImxhenlcIiwgXCJlYWdlclwiXTtcblxuLyoqICovXG5cbmNvbnN0IERFRkFVTFRfSU5QVVRfREVGSU5JVElPTlMgPSB7XG4gICcwJzogL1xcZC8sXG4gICdhJzogL1tcXHUwMDQxLVxcdTAwNUFcXHUwMDYxLVxcdTAwN0FcXHUwMEFBXFx1MDBCNVxcdTAwQkFcXHUwMEMwLVxcdTAwRDZcXHUwMEQ4LVxcdTAwRjZcXHUwMEY4LVxcdTAyQzFcXHUwMkM2LVxcdTAyRDFcXHUwMkUwLVxcdTAyRTRcXHUwMkVDXFx1MDJFRVxcdTAzNzAtXFx1MDM3NFxcdTAzNzZcXHUwMzc3XFx1MDM3QS1cXHUwMzdEXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFLVxcdTAzQTFcXHUwM0EzLVxcdTAzRjVcXHUwM0Y3LVxcdTA0ODFcXHUwNDhBLVxcdTA1MjdcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MS1cXHUwNTg3XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgxNVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA4NDAtXFx1MDg1OFxcdTA4QTBcXHUwOEEyLVxcdTA4QUNcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzEtXFx1MDk3N1xcdTA5NzktXFx1MDk3RlxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjcxXFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzMzXFx1MEMzNS1cXHUwQzM5XFx1MEMzRFxcdTBDNThcXHUwQzU5XFx1MEM2MFxcdTBDNjFcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENjBcXHUwRDYxXFx1MEQ3QS1cXHUwRDdGXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBFMDEtXFx1MEUzMFxcdTBFMzJcXHUwRTMzXFx1MEU0MC1cXHUwRTQ2XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4N1xcdTBFODhcXHUwRThBXFx1MEU4RFxcdTBFOTQtXFx1MEU5N1xcdTBFOTktXFx1MEU5RlxcdTBFQTEtXFx1MEVBM1xcdTBFQTVcXHUwRUE3XFx1MEVBQVxcdTBFQUJcXHUwRUFELVxcdTBFQjBcXHUwRUIyXFx1MEVCM1xcdTBFQkRcXHUwRUMwLVxcdTBFQzRcXHUwRUM2XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxMEQwLVxcdTEwRkFcXHUxMEZDLVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzODAtXFx1MTM4RlxcdTEzQTAtXFx1MTNGNFxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3ODAtXFx1MTdCM1xcdTE3RDdcXHUxN0RDXFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxQ1xcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QzEtXFx1MTlDN1xcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFBQTdcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjgzLVxcdTFCQTBcXHUxQkFFXFx1MUJBRlxcdTFCQkEtXFx1MUJFNVxcdTFDMDAtXFx1MUMyM1xcdTFDNEQtXFx1MUM0RlxcdTFDNUEtXFx1MUM3RFxcdTFDRTktXFx1MUNFQ1xcdTFDRUUtXFx1MUNGMVxcdTFDRjVcXHUxQ0Y2XFx1MUQwMC1cXHUxREJGXFx1MUUwMC1cXHUxRjE1XFx1MUYxOC1cXHUxRjFEXFx1MUYyMC1cXHUxRjQ1XFx1MUY0OC1cXHUxRjREXFx1MUY1MC1cXHUxRjU3XFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1Ri1cXHUxRjdEXFx1MUY4MC1cXHUxRkI0XFx1MUZCNi1cXHUxRkJDXFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzYtXFx1MUZDQ1xcdTFGRDAtXFx1MUZEM1xcdTFGRDYtXFx1MUZEQlxcdTFGRTAtXFx1MUZFQ1xcdTFGRjItXFx1MUZGNFxcdTFGRjYtXFx1MUZGQ1xcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MjEwMlxcdTIxMDdcXHUyMTBBLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEyRi1cXHUyMTM5XFx1MjEzQy1cXHUyMTNGXFx1MjE0NS1cXHUyMTQ5XFx1MjE0RVxcdTIxODNcXHUyMTg0XFx1MkMwMC1cXHUyQzJFXFx1MkMzMC1cXHUyQzVFXFx1MkM2MC1cXHUyQ0U0XFx1MkNFQi1cXHUyQ0VFXFx1MkNGMlxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyRTJGXFx1MzAwNVxcdTMwMDZcXHUzMDMxLVxcdTMwMzVcXHUzMDNCXFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUQtXFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkMtXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZDQ1xcdUEwMDAtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGRFxcdUE1MDAtXFx1QTYwQ1xcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY0MC1cXHVBNjZFXFx1QTY3Ri1cXHVBNjk3XFx1QTZBMC1cXHVBNkU1XFx1QTcxNy1cXHVBNzFGXFx1QTcyMi1cXHVBNzg4XFx1QTc4Qi1cXHVBNzhFXFx1QTc5MC1cXHVBNzkzXFx1QTdBMC1cXHVBN0FBXFx1QTdGOC1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5Q0ZcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTYwLVxcdUFBNzZcXHVBQTdBXFx1QUE4MC1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCLVxcdUFBRERcXHVBQUUwLVxcdUFBRUFcXHVBQUYyLVxcdUFBRjRcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQkMwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjIxLVxcdUZGM0FcXHVGRjQxLVxcdUZGNUFcXHVGRjY2LVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdLyxcbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjIwNzUwNzBcbiAgJyonOiAvLi9cbn07XG5cbi8qKiAqL1xuY2xhc3MgUGF0dGVybklucHV0RGVmaW5pdGlvbiB7XG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIC8qKiAqL1xuXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBjb25zdCB7XG4gICAgICAgIHBhcmVudCxcbiAgICAgICAgaXNPcHRpb25hbCxcbiAgICAgICAgcGxhY2Vob2xkZXJDaGFyLFxuICAgICAgICBkaXNwbGF5Q2hhcixcbiAgICAgICAgbGF6eSxcbiAgICAgICAgZWFnZXJcbiAgICAgIH0gPSBvcHRzLFxuICAgICAgbWFza09wdHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShvcHRzLCBfZXhjbHVkZWQpO1xuICAgIHRoaXMubWFza2VkID0gY3JlYXRlTWFzayhtYXNrT3B0cyk7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XG4gICAgICBwYXJlbnQsXG4gICAgICBpc09wdGlvbmFsLFxuICAgICAgcGxhY2Vob2xkZXJDaGFyLFxuICAgICAgZGlzcGxheUNoYXIsXG4gICAgICBsYXp5LFxuICAgICAgZWFnZXJcbiAgICB9KTtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmlzRmlsbGVkID0gZmFsc2U7XG4gICAgdGhpcy5tYXNrZWQucmVzZXQoKTtcbiAgfVxuICByZW1vdmUoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICBpZiAoZnJvbVBvcyA9PT0gMCAmJiB0b1BvcyA+PSAxKSB7XG4gICAgICB0aGlzLmlzRmlsbGVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcy5tYXNrZWQucmVtb3ZlKGZyb21Qb3MsIHRvUG9zKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gIH1cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC52YWx1ZSB8fCAodGhpcy5pc0ZpbGxlZCAmJiAhdGhpcy5pc09wdGlvbmFsID8gdGhpcy5wbGFjZWhvbGRlckNoYXIgOiAnJyk7XG4gIH1cbiAgZ2V0IHVubWFza2VkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLnVubWFza2VkVmFsdWU7XG4gIH1cbiAgZ2V0IGRpc3BsYXlWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXNrZWQudmFsdWUgJiYgdGhpcy5kaXNwbGF5Q2hhciB8fCB0aGlzLnZhbHVlO1xuICB9XG4gIGdldCBpc0NvbXBsZXRlKCkge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMubWFza2VkLnZhbHVlKSB8fCB0aGlzLmlzT3B0aW9uYWw7XG4gIH1cbiAgX2FwcGVuZENoYXIoY2gpIHtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGlmICh0aGlzLmlzRmlsbGVkKSByZXR1cm4gbmV3IENoYW5nZURldGFpbHMoKTtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMubWFza2VkLnN0YXRlO1xuICAgIC8vIHNpbXVsYXRlIGlucHV0XG4gICAgY29uc3QgZGV0YWlscyA9IHRoaXMubWFza2VkLl9hcHBlbmRDaGFyKGNoLCBmbGFncyk7XG4gICAgaWYgKGRldGFpbHMuaW5zZXJ0ZWQgJiYgdGhpcy5kb1ZhbGlkYXRlKGZsYWdzKSA9PT0gZmFsc2UpIHtcbiAgICAgIGRldGFpbHMuaW5zZXJ0ZWQgPSBkZXRhaWxzLnJhd0luc2VydGVkID0gJyc7XG4gICAgICB0aGlzLm1hc2tlZC5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cbiAgICBpZiAoIWRldGFpbHMuaW5zZXJ0ZWQgJiYgIXRoaXMuaXNPcHRpb25hbCAmJiAhdGhpcy5sYXp5ICYmICFmbGFncy5pbnB1dCkge1xuICAgICAgZGV0YWlscy5pbnNlcnRlZCA9IHRoaXMucGxhY2Vob2xkZXJDaGFyO1xuICAgIH1cbiAgICBkZXRhaWxzLnNraXAgPSAhZGV0YWlscy5pbnNlcnRlZCAmJiAhdGhpcy5pc09wdGlvbmFsO1xuICAgIHRoaXMuaXNGaWxsZWQgPSBCb29sZWFuKGRldGFpbHMuaW5zZXJ0ZWQpO1xuICAgIHJldHVybiBkZXRhaWxzO1xuICB9XG4gIGFwcGVuZCgpIHtcbiAgICAvLyBUT0RPIHByb2JhYmx5IHNob3VsZCBiZSBkb25lIHZpYSBfYXBwZW5kQ2hhclxuICAgIHJldHVybiB0aGlzLm1hc2tlZC5hcHBlbmQoLi4uYXJndW1lbnRzKTtcbiAgfVxuICBfYXBwZW5kUGxhY2Vob2xkZXIoKSB7XG4gICAgY29uc3QgZGV0YWlscyA9IG5ldyBDaGFuZ2VEZXRhaWxzKCk7XG4gICAgaWYgKHRoaXMuaXNGaWxsZWQgfHwgdGhpcy5pc09wdGlvbmFsKSByZXR1cm4gZGV0YWlscztcbiAgICB0aGlzLmlzRmlsbGVkID0gdHJ1ZTtcbiAgICBkZXRhaWxzLmluc2VydGVkID0gdGhpcy5wbGFjZWhvbGRlckNoYXI7XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cbiAgX2FwcGVuZEVhZ2VyKCkge1xuICAgIHJldHVybiBuZXcgQ2hhbmdlRGV0YWlscygpO1xuICB9XG4gIGV4dHJhY3RUYWlsKCkge1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC5leHRyYWN0VGFpbCguLi5hcmd1bWVudHMpO1xuICB9XG4gIGFwcGVuZFRhaWwoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFza2VkLmFwcGVuZFRhaWwoLi4uYXJndW1lbnRzKTtcbiAgfVxuICBleHRyYWN0SW5wdXQoKSB7XG4gICAgbGV0IGZyb21Qb3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgbGV0IHRvUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICBsZXQgZmxhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdGhpcy5tYXNrZWQuZXh0cmFjdElucHV0KGZyb21Qb3MsIHRvUG9zLCBmbGFncyk7XG4gIH1cbiAgbmVhcmVzdElucHV0UG9zKGN1cnNvclBvcykge1xuICAgIGxldCBkaXJlY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IERJUkVDVElPTi5OT05FO1xuICAgIGNvbnN0IG1pblBvcyA9IDA7XG4gICAgY29uc3QgbWF4UG9zID0gdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgY29uc3QgYm91bmRQb3MgPSBNYXRoLm1pbihNYXRoLm1heChjdXJzb3JQb3MsIG1pblBvcyksIG1heFBvcyk7XG4gICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XG4gICAgICBjYXNlIERJUkVDVElPTi5GT1JDRV9MRUZUOlxuICAgICAgICByZXR1cm4gdGhpcy5pc0NvbXBsZXRlID8gYm91bmRQb3MgOiBtaW5Qb3M7XG4gICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcbiAgICAgIGNhc2UgRElSRUNUSU9OLkZPUkNFX1JJR0hUOlxuICAgICAgICByZXR1cm4gdGhpcy5pc0NvbXBsZXRlID8gYm91bmRQb3MgOiBtYXhQb3M7XG4gICAgICBjYXNlIERJUkVDVElPTi5OT05FOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGJvdW5kUG9zO1xuICAgIH1cbiAgfVxuICB0b3RhbElucHV0UG9zaXRpb25zKCkge1xuICAgIGxldCBmcm9tUG9zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIGxldCB0b1BvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUuc2xpY2UoZnJvbVBvcywgdG9Qb3MpLmxlbmd0aDtcbiAgfVxuICBkb1ZhbGlkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLm1hc2tlZC5kb1ZhbGlkYXRlKC4uLmFyZ3VtZW50cykgJiYgKCF0aGlzLnBhcmVudCB8fCB0aGlzLnBhcmVudC5kb1ZhbGlkYXRlKC4uLmFyZ3VtZW50cykpO1xuICB9XG4gIGRvQ29tbWl0KCkge1xuICAgIHRoaXMubWFza2VkLmRvQ29tbWl0KCk7XG4gIH1cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtYXNrZWQ6IHRoaXMubWFza2VkLnN0YXRlLFxuICAgICAgaXNGaWxsZWQ6IHRoaXMuaXNGaWxsZWRcbiAgICB9O1xuICB9XG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIHRoaXMubWFza2VkLnN0YXRlID0gc3RhdGUubWFza2VkO1xuICAgIHRoaXMuaXNGaWxsZWQgPSBzdGF0ZS5pc0ZpbGxlZDtcbiAgfVxufVxuXG5leHBvcnQgeyBERUZBVUxUX0lOUFVUX0RFRklOSVRJT05TLCBQYXR0ZXJuSW5wdXREZWZpbml0aW9uIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCBjcmVhdGVNYXNrIGZyb20gJy4vZmFjdG9yeS5qcyc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnLi4vY29yZS9ob2xkZXIuanMnO1xuaW1wb3J0ICcuLi9jb3JlL3V0aWxzLmpzJztcbmltcG9ydCAnLi4vY29yZS9jaGFuZ2UtZGV0YWlscy5qcyc7XG5cbi8qKiBNYXNrIHBpcGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiB0eXBlcyAqL1xuY29uc3QgUElQRV9UWVBFID0ge1xuICBNQVNLRUQ6ICd2YWx1ZScsXG4gIFVOTUFTS0VEOiAndW5tYXNrZWRWYWx1ZScsXG4gIFRZUEVEOiAndHlwZWRWYWx1ZSdcbn07XG5cbi8qKiBDcmVhdGVzIG5ldyBwaXBlIGZ1bmN0aW9uIGRlcGVuZGluZyBvbiBtYXNrIHR5cGUsIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gb3B0aW9ucyAqL1xuZnVuY3Rpb24gY3JlYXRlUGlwZShtYXNrKSB7XG4gIGxldCBmcm9tID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBQSVBFX1RZUEUuTUFTS0VEO1xuICBsZXQgdG8gPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFBJUEVfVFlQRS5NQVNLRUQ7XG4gIGNvbnN0IG1hc2tlZCA9IGNyZWF0ZU1hc2sobWFzayk7XG4gIHJldHVybiB2YWx1ZSA9PiBtYXNrZWQucnVuSXNvbGF0ZWQobSA9PiB7XG4gICAgbVtmcm9tXSA9IHZhbHVlO1xuICAgIHJldHVybiBtW3RvXTtcbiAgfSk7XG59XG5cbi8qKiBQaXBlcyB2YWx1ZSB0aHJvdWdoIG1hc2sgZGVwZW5kaW5nIG9uIG1hc2sgdHlwZSwgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBvcHRpb25zICovXG5mdW5jdGlvbiBwaXBlKHZhbHVlKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBwaXBlQXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgcGlwZUFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG4gIHJldHVybiBjcmVhdGVQaXBlKC4uLnBpcGVBcmdzKSh2YWx1ZSk7XG59XG5JTWFzay5QSVBFX1RZUEUgPSBQSVBFX1RZUEU7XG5JTWFzay5jcmVhdGVQaXBlID0gY3JlYXRlUGlwZTtcbklNYXNrLnBpcGUgPSBwaXBlO1xuXG5leHBvcnQgeyBQSVBFX1RZUEUsIGNyZWF0ZVBpcGUsIHBpcGUgfTtcbiIsImltcG9ydCBNYXNrZWRQYXR0ZXJuIGZyb20gJy4vcGF0dGVybi5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0IHsgbm9ybWFsaXplUHJlcGFyZSB9IGZyb20gJy4uL2NvcmUvdXRpbHMuanMnO1xuaW1wb3J0IElNYXNrIGZyb20gJy4uL2NvcmUvaG9sZGVyLmpzJztcbmltcG9ydCAnLi4vX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy02YjNiZDQwNC5qcyc7XG5pbXBvcnQgJy4vYmFzZS5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY29udGludW91cy10YWlsLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuL3BhdHRlcm4vaW5wdXQtZGVmaW5pdGlvbi5qcyc7XG5pbXBvcnQgJy4vZmFjdG9yeS5qcyc7XG5pbXBvcnQgJy4vcGF0dGVybi9maXhlZC1kZWZpbml0aW9uLmpzJztcbmltcG9ydCAnLi9wYXR0ZXJuL2NodW5rLXRhaWwtZGV0YWlscy5qcyc7XG5pbXBvcnQgJy4vcGF0dGVybi9jdXJzb3IuanMnO1xuaW1wb3J0ICcuL3JlZ2V4cC5qcyc7XG5cbi8qKiBQYXR0ZXJuIHdoaWNoIGFjY2VwdHMgcmFuZ2VzICovXG5jbGFzcyBNYXNrZWRSYW5nZSBleHRlbmRzIE1hc2tlZFBhdHRlcm4ge1xuICAvKipcbiAgICBPcHRpb25hbGx5IHNldHMgbWF4IGxlbmd0aCBvZiBwYXR0ZXJuLlxuICAgIFVzZWQgd2hlbiBwYXR0ZXJuIGxlbmd0aCBpcyBsb25nZXIgdGhlbiBgdG9gIHBhcmFtIGxlbmd0aC4gUGFkcyB6ZXJvcyBhdCBzdGFydCBpbiB0aGlzIGNhc2UuXG4gICovXG5cbiAgLyoqIE1pbiBib3VuZCAqL1xuXG4gIC8qKiBNYXggYm91bmQgKi9cblxuICAvKiogKi9cblxuICBnZXQgX21hdGNoRnJvbSgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXhMZW5ndGggLSBTdHJpbmcodGhpcy5mcm9tKS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgX3VwZGF0ZShvcHRzKSB7XG4gICAgLy8gVE9ETyB0eXBlXG4gICAgb3B0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdG86IHRoaXMudG8gfHwgMCxcbiAgICAgIGZyb206IHRoaXMuZnJvbSB8fCAwLFxuICAgICAgbWF4TGVuZ3RoOiB0aGlzLm1heExlbmd0aCB8fCAwXG4gICAgfSwgb3B0cyk7XG4gICAgbGV0IG1heExlbmd0aCA9IFN0cmluZyhvcHRzLnRvKS5sZW5ndGg7XG4gICAgaWYgKG9wdHMubWF4TGVuZ3RoICE9IG51bGwpIG1heExlbmd0aCA9IE1hdGgubWF4KG1heExlbmd0aCwgb3B0cy5tYXhMZW5ndGgpO1xuICAgIG9wdHMubWF4TGVuZ3RoID0gbWF4TGVuZ3RoO1xuICAgIGNvbnN0IGZyb21TdHIgPSBTdHJpbmcob3B0cy5mcm9tKS5wYWRTdGFydChtYXhMZW5ndGgsICcwJyk7XG4gICAgY29uc3QgdG9TdHIgPSBTdHJpbmcob3B0cy50bykucGFkU3RhcnQobWF4TGVuZ3RoLCAnMCcpO1xuICAgIGxldCBzYW1lQ2hhcnNDb3VudCA9IDA7XG4gICAgd2hpbGUgKHNhbWVDaGFyc0NvdW50IDwgdG9TdHIubGVuZ3RoICYmIHRvU3RyW3NhbWVDaGFyc0NvdW50XSA9PT0gZnJvbVN0cltzYW1lQ2hhcnNDb3VudF0pICsrc2FtZUNoYXJzQ291bnQ7XG4gICAgb3B0cy5tYXNrID0gdG9TdHIuc2xpY2UoMCwgc2FtZUNoYXJzQ291bnQpLnJlcGxhY2UoLzAvZywgJ1xcXFwwJykgKyAnMCcucmVwZWF0KG1heExlbmd0aCAtIHNhbWVDaGFyc0NvdW50KTtcbiAgICBzdXBlci5fdXBkYXRlKG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICovXG4gIGdldCBpc0NvbXBsZXRlKCkge1xuICAgIHJldHVybiBzdXBlci5pc0NvbXBsZXRlICYmIEJvb2xlYW4odGhpcy52YWx1ZSk7XG4gIH1cbiAgYm91bmRhcmllcyhzdHIpIHtcbiAgICBsZXQgbWluc3RyID0gJyc7XG4gICAgbGV0IG1heHN0ciA9ICcnO1xuICAgIGNvbnN0IFssIHBsYWNlaG9sZGVyLCBudW1dID0gc3RyLm1hdGNoKC9eKFxcRCopKFxcZCopKFxcRCopLykgfHwgW107XG4gICAgaWYgKG51bSkge1xuICAgICAgbWluc3RyID0gJzAnLnJlcGVhdChwbGFjZWhvbGRlci5sZW5ndGgpICsgbnVtO1xuICAgICAgbWF4c3RyID0gJzknLnJlcGVhdChwbGFjZWhvbGRlci5sZW5ndGgpICsgbnVtO1xuICAgIH1cbiAgICBtaW5zdHIgPSBtaW5zdHIucGFkRW5kKHRoaXMubWF4TGVuZ3RoLCAnMCcpO1xuICAgIG1heHN0ciA9IG1heHN0ci5wYWRFbmQodGhpcy5tYXhMZW5ndGgsICc5Jyk7XG4gICAgcmV0dXJuIFttaW5zdHIsIG1heHN0cl07XG4gIH1cblxuICAvLyBUT0RPIHN0ciBpcyBhIHNpbmdsZSBjaGFyIGV2ZXJ5dGltZVxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZG9QcmVwYXJlKGNoKSB7XG4gICAgbGV0IGZsYWdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBsZXQgZGV0YWlscztcbiAgICBbY2gsIGRldGFpbHNdID0gbm9ybWFsaXplUHJlcGFyZShzdXBlci5kb1ByZXBhcmUoY2gucmVwbGFjZSgvXFxEL2csICcnKSwgZmxhZ3MpKTtcbiAgICBpZiAoIXRoaXMuYXV0b2ZpeCB8fCAhY2gpIHJldHVybiBjaDtcbiAgICBjb25zdCBmcm9tU3RyID0gU3RyaW5nKHRoaXMuZnJvbSkucGFkU3RhcnQodGhpcy5tYXhMZW5ndGgsICcwJyk7XG4gICAgY29uc3QgdG9TdHIgPSBTdHJpbmcodGhpcy50bykucGFkU3RhcnQodGhpcy5tYXhMZW5ndGgsICcwJyk7XG4gICAgbGV0IG5leHRWYWwgPSB0aGlzLnZhbHVlICsgY2g7XG4gICAgaWYgKG5leHRWYWwubGVuZ3RoID4gdGhpcy5tYXhMZW5ndGgpIHJldHVybiAnJztcbiAgICBjb25zdCBbbWluc3RyLCBtYXhzdHJdID0gdGhpcy5ib3VuZGFyaWVzKG5leHRWYWwpO1xuICAgIGlmIChOdW1iZXIobWF4c3RyKSA8IHRoaXMuZnJvbSkgcmV0dXJuIGZyb21TdHJbbmV4dFZhbC5sZW5ndGggLSAxXTtcbiAgICBpZiAoTnVtYmVyKG1pbnN0cikgPiB0aGlzLnRvKSB7XG4gICAgICBpZiAodGhpcy5hdXRvZml4ID09PSAncGFkJyAmJiBuZXh0VmFsLmxlbmd0aCA8IHRoaXMubWF4TGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbJycsIGRldGFpbHMuYWdncmVnYXRlKHRoaXMuYXBwZW5kKGZyb21TdHJbbmV4dFZhbC5sZW5ndGggLSAxXSArIGNoLCBmbGFncykpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b1N0cltuZXh0VmFsLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICByZXR1cm4gY2g7XG4gIH1cblxuICAvKipcbiAgICBAb3ZlcnJpZGVcbiAgKi9cbiAgZG9WYWxpZGF0ZSgpIHtcbiAgICBjb25zdCBzdHIgPSB0aGlzLnZhbHVlO1xuICAgIGNvbnN0IGZpcnN0Tm9uWmVybyA9IHN0ci5zZWFyY2goL1teMF0vKTtcbiAgICBpZiAoZmlyc3ROb25aZXJvID09PSAtMSAmJiBzdHIubGVuZ3RoIDw9IHRoaXMuX21hdGNoRnJvbSkgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgW21pbnN0ciwgbWF4c3RyXSA9IHRoaXMuYm91bmRhcmllcyhzdHIpO1xuICAgIHJldHVybiB0aGlzLmZyb20gPD0gTnVtYmVyKG1heHN0cikgJiYgTnVtYmVyKG1pbnN0cikgPD0gdGhpcy50byAmJiBzdXBlci5kb1ZhbGlkYXRlKC4uLmFyZ3VtZW50cyk7XG4gIH1cbn1cbklNYXNrLk1hc2tlZFJhbmdlID0gTWFza2VkUmFuZ2U7XG5cbmV4cG9ydCB7IE1hc2tlZFJhbmdlIGFzIGRlZmF1bHQgfTtcbiIsImltcG9ydCBNYXNrZWQgZnJvbSAnLi9iYXNlLmpzJztcbmltcG9ydCBJTWFzayBmcm9tICcuLi9jb3JlL2hvbGRlci5qcyc7XG5pbXBvcnQgJy4uL2NvcmUvY2hhbmdlLWRldGFpbHMuanMnO1xuaW1wb3J0ICcuLi9jb3JlL2NvbnRpbnVvdXMtdGFpbC1kZXRhaWxzLmpzJztcbmltcG9ydCAnLi4vY29yZS91dGlscy5qcyc7XG5cbi8qKiBNYXNraW5nIGJ5IFJlZ0V4cCAqL1xuY2xhc3MgTWFza2VkUmVnRXhwIGV4dGVuZHMgTWFza2VkIHtcbiAgLyoqXG4gICAgQG92ZXJyaWRlXG4gICAgQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgKi9cbiAgX3VwZGF0ZShvcHRzKSB7XG4gICAgaWYgKG9wdHMubWFzaykgb3B0cy52YWxpZGF0ZSA9IHZhbHVlID0+IHZhbHVlLnNlYXJjaChvcHRzLm1hc2spID49IDA7XG4gICAgc3VwZXIuX3VwZGF0ZShvcHRzKTtcbiAgfVxufVxuSU1hc2suTWFza2VkUmVnRXhwID0gTWFza2VkUmVnRXhwO1xuXG5leHBvcnQgeyBNYXNrZWRSZWdFeHAgYXMgZGVmYXVsdCB9O1xuIiwiLyohIGpzLWNvb2tpZSB2My4wLjUgfCBNSVQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuZnVuY3Rpb24gYXNzaWduICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXRcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xudmFyIGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gIHJlYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXG4gICAgICAvJSgyWzM0NkJGXXwzW0FDLUZdfDQwfDVbQkRFXXw2MHw3W0JDRF0pL2csXG4gICAgICBkZWNvZGVVUklDb21wb25lbnRcbiAgICApXG4gIH1cbn07XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuZnVuY3Rpb24gaW5pdCAoY29udmVydGVyLCBkZWZhdWx0QXR0cmlidXRlcykge1xuICBmdW5jdGlvbiBzZXQgKG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGU1KTtcbiAgICB9XG4gICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKVxuICAgICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcblxuICAgIHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcbiAgICAgIC8vIC4uLlxuICAgICAgLy8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuICAgICAgLy8gICAgIGNoYXJhY3RlcjpcbiAgICAgIC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG4gICAgICAvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cbiAgICAgIC8vIC4uLlxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9XG4gICAgICBuYW1lICsgJz0nICsgY29udmVydGVyLndyaXRlKHZhbHVlLCBuYW1lKSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcylcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldCAobmFtZSkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IChhcmd1bWVudHMubGVuZ3RoICYmICFuYW1lKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuICAgIC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgdmFyIGphciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZm91bmQgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICBqYXJbZm91bmRdID0gY29udmVydGVyLnJlYWQodmFsdWUsIGZvdW5kKTtcblxuICAgICAgICBpZiAobmFtZSA9PT0gZm91bmQpIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHJldHVybiBuYW1lID8gamFyW25hbWVdIDogamFyXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICB7XG4gICAgICBzZXQsXG4gICAgICBnZXQsXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIChuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHNldChcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgICcnLFxuICAgICAgICAgIGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xuICAgICAgICAgICAgZXhwaXJlczogLTFcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIHdpdGhBdHRyaWJ1dGVzOiBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgICAgICByZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxuICAgICAgfSxcbiAgICAgIHdpdGhDb252ZXJ0ZXI6IGZ1bmN0aW9uIChjb252ZXJ0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgYXR0cmlidXRlczogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShkZWZhdWx0QXR0cmlidXRlcykgfSxcbiAgICAgIGNvbnZlcnRlcjogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShjb252ZXJ0ZXIpIH1cbiAgICB9XG4gIClcbn1cblxudmFyIGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG5leHBvcnQgeyBhcGkgYXMgZGVmYXVsdCB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKlxuICogQHBhY2thZ2UgICAgTmV2aWdlbiBKU2hvcCBPbmVTdGVwQ2hlY2tvdXQgUGFja2FnZVxuICogQHZlcnNpb24gICAgMS4xLjBcbiAqIEBhdXRob3IgICAgIE5ldmlnZW4uY29tIC0gaHR0cHM6Ly9uZXZpZ2VuLmNvbVxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IMKpIE5ldmlnZW4uY29tLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogQGxpY2Vuc2UgICAgUHJvcHJpZXRhcnkuIENvcHlyaWdodGVkIENvbW1lcmNpYWwgU29mdHdhcmVcbiAqIEBsaW5rICAgICAgIGh0dHBzOi8vbmV2aWdlbi5jb21cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IENvb2tpZXMgZnJvbSAnanMtY29va2llJztcbmltcG9ydCBJTWFzayBmcm9tICdpbWFzayc7XG5cbmNsYXNzIE5ldmlnZW5PbmVTdGVwQ2hlY2tvdXQge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLm9wdGlvbnMgPSBKb29tbGEuZ2V0T3B0aW9ucygnbmV2aWdlbl9vbmVzdGVwY2hlY2tvdXQnKTtcblx0XHR0aGlzLmNvbnRyb2xsZXIgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmNvbnRyb2xsZXIgPyB0aGlzLm9wdGlvbnMuY29udHJvbGxlciA6IGZhbHNlO1xuXHRcdHRoaXMuY3NyZiA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY3NyZiA/IHRoaXMub3B0aW9ucy5jc3JmIDogZmFsc2U7XG5cdFx0dGhpcy51c2VfbWFzayA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMudXNlX21hc2sgPyB0aGlzLm9wdGlvbnMudXNlX21hc2sgOiBmYWxzZTtcblx0XHR0aGlzLm1hc2sgPSB0aGlzLnVzZV9tYXNrICYmIHRoaXMub3B0aW9ucy5tYXNrID8gdGhpcy5vcHRpb25zLm1hc2sgOiBmYWxzZTtcblx0XHR0aGlzLnJhYmF0dCA9IGZhbHNlO1xuXHRcdHRoaXMuY29udGFpbmVyQ2FydEVkaXRNZWVzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0PVwibWVzc2FnZVwiXScpO1xuXHRcdGlmICghdGhpcy5jb250YWluZXJDYXJ0RWRpdE1lZXNhZ2UpIHtcblx0XHRcdHRoaXMuY29udGFpbmVyQ2FydEVkaXRNZWVzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdD1cIm1lc3NhZ2VcIl0nKTtcblxuXHRcdH1cblx0XHRpZiAodGhpcy5vcHRpb25zLnVzZXIgPT09IDApIHtcblx0XHRcdHRoaXMuY29udGFpbmVyTG9naW5NZWVzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtbG9naW49XCJtZXNzYWdlXCJdJyk7XG5cdFx0XHRpZiAoIXRoaXMuY29udGFpbmVyTG9naW5NZWVzYWdlKSB7XG5cdFx0XHRcdHRoaXMuY29udGFpbmVyTG9naW5NZWVzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWxvZ2luPVwibWVzc2FnZVwiXScpO1xuXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuZm9ybVZhbGlkYXRpb25NZXNzYWdlID0gJyc7XG5cdFx0dGhpcy5mb3JtVmFsaWRhdGlvbiA9IHRydWU7XG5cdH1cblxuXHRsb2FkQWN0aW9ucygpIHtcblx0XHRsZXQgbmV2aWdlbk9uZVN0ZXBDaGVja291dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm1bbmFtZT1cIm5ldmlnZW5PbmVTdGVwQ2hlY2tvdXRcIl0nKTtcblx0XHRpZiAobmV2aWdlbk9uZVN0ZXBDaGVja291dCkge1xuXHRcdFx0dGhpcy5yYWJhdHQgPSBuZXZpZ2VuT25lU3RlcENoZWNrb3V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJyYWJhdHRcIl0nKTtcblx0XHRcdG5ldmlnZW5PbmVTdGVwQ2hlY2tvdXQuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRpZiAoZG9jdW1lbnQuZm9ybXZhbGlkYXRvci5pc1ZhbGlkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm1bbmFtZT1cIm5ldmlnZW5PbmVTdGVwQ2hlY2tvdXRcIl0nKSkpIHtcblx0XHRcdFx0XHRsZXQgYWdiID0gbmV2aWdlbk9uZVN0ZXBDaGVja291dC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiYWdiXCJdW3R5cGU9XCJjaGVja2JveFwiXScpLFxuXHRcdFx0XHRcdFx0ZXJyb3IgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAoYWdiKSB7XG5cdFx0XHRcdFx0XHRpZiAoIWFnYi5jaGVja2VkKSB7XG5cdFx0XHRcdFx0XHRcdGFnYi5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wtZGFuZ2VyJyk7XG5cdFx0XHRcdFx0XHRcdGFnYi5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG5cdFx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGFnYi5jbGFzc0xpc3QucmVtb3ZlKCdmb3JtLWNvbnRyb2wtZGFuZ2VyJyk7XG5cdFx0XHRcdFx0XHRcdGFnYi5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkJyk7XG5cdFx0XHRcdFx0XHRcdGVycm9yID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxldCBwYXltZW50VmFsaWQgPSB0cnVlO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YganNob3AgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5mb3Jtc1sncGF5bWVudF9mb3JtJ10gPSBkb2N1bWVudC5mb3Jtc1snbmV2aWdlbk9uZVN0ZXBDaGVja291dCddO1xuXHRcdFx0XHRcdFx0cGF5bWVudFZhbGlkID0ganNob3AuY2hlY2tQYXltZW50Rm9ybSgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChlcnJvciA9PT0gZmFsc2UgJiYgcGF5bWVudFZhbGlkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldFByZWxvYWRlcigpO1xuXHRcdFx0XHRcdFx0bmV2aWdlbk9uZVN0ZXBDaGVja291dC5zdWJtaXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSk7XG5cdFx0XHRsZXQgYWRkcmVzc2VzID0gbmV2aWdlbk9uZVN0ZXBDaGVja291dC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dD1cImFkZHJlc3NcIl0nKTtcblx0XHRcdGlmIChhZGRyZXNzZXMpIHtcblx0XHRcdFx0bGV0IGFkZHJlc3NGaWVsZHMgPSBhZGRyZXNzZXMucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIHNlbGVjdCx0ZXh0YXJlYScpXG5cdFx0XHRcdGlmIChhZGRyZXNzRmllbGRzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRhZGRyZXNzRmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgbmFtZSA9IGZpZWxkLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdFx0XHRcdFx0aWYgKG5hbWUpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMudXNlX21hc2sgJiYgdGhpcy5tYXNrICYmIHRoaXMudXNlX21hc2suaW5jbHVkZXMobmFtZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRJTWFzayhmaWVsZCwge1xuXHRcdFx0XHRcdFx0XHRcdFx0bWFzazogdGhpcy5tYXNrXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2F2ZUZvcm1EYXRhKCdhZGRyZXNzJywgZmllbGQpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bGV0IHBheW1lbnRNZXRob2RzID0gbmV2aWdlbk9uZVN0ZXBDaGVja291dC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dD1cInBheW1lbnRcIl0nKTtcblx0XHRcdGlmIChwYXltZW50TWV0aG9kcykge1xuXHRcdFx0XHRsZXQgcGF5bWVudHMgPSBwYXltZW50TWV0aG9kcy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwicGF5bWVudF9tZXRob2RcIl0nKVxuXHRcdFx0XHRpZiAocGF5bWVudHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGxldCBwYXltZW50QWN0aXZlID0gcGF5bWVudE1ldGhvZHMucXVlcnlTZWxlY3RvcignaW5wdXQ6Y2hlY2tlZCcpO1xuXHRcdFx0XHRcdGlmIChwYXltZW50QWN0aXZlICYmIHBheW1lbnRBY3RpdmUudmFsdWUpIHtcblx0XHRcdFx0XHRcdGxldCBwYXJhbXNQYXltZW50ID0gbmV2aWdlbk9uZVN0ZXBDaGVja291dC5xdWVyeVNlbGVjdG9yQWxsKCdbbmFtZSo9XCJwYXJhbXNbJyArIHBheW1lbnRBY3RpdmUudmFsdWUgKyAnXVwiXScpO1xuXHRcdFx0XHRcdFx0aWYgKHBhcmFtc1BheW1lbnQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRwYXJhbXNQYXltZW50LmZvckVhY2goKGZpZWxkKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuc2F2ZU1ldGhvZHNQYXJhbXMoJ3BheW1lbnQnLCBmaWVsZCk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwYXltZW50cy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGZpZWxkLmdldEF0dHJpYnV0ZSgnbmFtZScpKSB7XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zYXZlRm9ybURhdGEoJ3BheW1lbnQnLCBmaWVsZCk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsZXQgc2hpcHBpbmdNZXRob2RzID0gbmV2aWdlbk9uZVN0ZXBDaGVja291dC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dD1cInNoaXBwaW5nXCJdJyk7XG5cdFx0XHRpZiAoc2hpcHBpbmdNZXRob2RzKSB7XG5cdFx0XHRcdGxldCBzaGlwcGluZyA9IHNoaXBwaW5nTWV0aG9kcy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwic2hfcHJfbWV0aG9kX2lkXCJdJylcblx0XHRcdFx0aWYgKHNoaXBwaW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRsZXQgc2hpcHBpbmdBY3RpdmUgPSBzaGlwcGluZ01ldGhvZHMucXVlcnlTZWxlY3RvcignaW5wdXQ6Y2hlY2tlZCcpO1xuXHRcdFx0XHRcdGlmIChzaGlwcGluZ0FjdGl2ZSAmJiBzaGlwcGluZ0FjdGl2ZS52YWx1ZSkge1xuXHRcdFx0XHRcdFx0bGV0IGlkID0gc2hpcHBpbmdBY3RpdmUuZ2V0QXR0cmlidXRlKCdkYXRhLXNoaXBwaW5nX2lkJyk7XG5cdFx0XHRcdFx0XHRpZiAoaWQpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtc1NoaXBwaW5nID0gbmV2aWdlbk9uZVN0ZXBDaGVja291dC5xdWVyeVNlbGVjdG9yQWxsKCdbbmFtZSo9XCJwYXJhbXNbJyArIGlkICsgJ11cIl0nKTtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmFtc1NoaXBwaW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRwYXJhbXNTaGlwcGluZy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5zYXZlTWV0aG9kc1BhcmFtcygnc2hpcHBpbmcnLCBmaWVsZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzaGlwcGluZy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGZpZWxkLmdldEF0dHJpYnV0ZSgnbmFtZScpKSB7XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zYXZlRm9ybURhdGEoJ3NoaXBwaW5nJywgZmllbGQpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBxdWFudGl0eUlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eS1pbnB1dF0saW5wdXRbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcXVhbnRpdHktaW5wdXRdJylcblx0XHRpZiAocXVhbnRpdHlJbnB1dHMubGVuZ3RoID4gMCkge1xuXHRcdFx0cXVhbnRpdHlJbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcblx0XHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZXZlbnQgPT4ge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZS5yZXBsYWNlKC9bXi5cXGRdKy9nLCAnJykucmVwbGFjZSgvXihbXi5dKlxcLil8XFwuL2csICckMScpO1xuXHRcdFx0XHRcdGxldCBrZXkgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eS1pbnB1dCcpO1xuXHRcdFx0XHRcdGlmICgha2V5KSBrZXkgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5LWlucHV0Jyk7XG5cdFx0XHRcdFx0aWYgKGtleSkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gcGFyc2VJbnQoaW5wdXQudmFsdWUpO1xuXG5cdFx0XHRcdFx0XHR0aGlzLmNhcnRFZGl0Q2hhbmdlUXVhbnRpdHkoa2V5LCAodmFsdWUgPD0gMCkgPyAxIDogdmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0bGV0IHF1YW50aXR5QnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcXVhbnRpdHldLFtkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eV0nKVxuXHRcdGlmIChxdWFudGl0eUJ1dHRvbnMubGVuZ3RoID4gMCkge1xuXHRcdFx0cXVhbnRpdHlCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRsZXQgdHlwZSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eScpO1xuXHRcdFx0XHRcdGlmICghdHlwZSkgdHlwZSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5Jyk7XG5cdFx0XHRcdFx0aWYgKHR5cGUpIHtcblx0XHRcdFx0XHRcdGxldCBjb250YWluZXIgPSBidXR0b24uY2xvc2VzdCgnW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eS1jb250YWluZXJdLFtkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1xdWFudGl0eS1jb250YWluZXJdJyk7XG5cdFx0XHRcdFx0XHRpZiAoY29udGFpbmVyKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBpbnB1dCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcXVhbnRpdHktaW5wdXRdLGlucHV0W2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0LXF1YW50aXR5LWlucHV0XScpLFxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gaW5wdXQudmFsdWUsXG5cdFx0XHRcdFx0XHRcdFx0dXBkYXRlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gcGFyc2VJbnQodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlID09PSAnKycpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlucHV0LnZhbHVlID0gdmFsdWUgKyAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0dXBkYXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICctJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpbnB1dC52YWx1ZSA9IHZhbHVlIC0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dXBkYXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAodXBkYXRlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJywgeydidWJibGVzJzogdHJ1ZX0pKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0c2F2ZUZvcm1EYXRhKHR5cGUsIGZpZWxkKSB7XG5cdFx0aWYgKCF0eXBlIHx8ICFmaWVsZCkgcmV0dXJuO1xuXHRcdGxldCBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YSxcblx0XHRcdHBheW1lbnQgPSAnJyxcblx0XHRcdHNoaXBwaW5nID0gJycsXG5cdFx0XHRuYW1lID0gZmllbGQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0YWpheERhdGEuc2V0KCd0eXBlJywgdHlwZSk7XG5cdFx0YWpheERhdGEuc2V0KCdzYXZlZm9ybWRhdGFbJyArIG5hbWUgKyAnXScsIGZpZWxkLnZhbHVlKTtcblx0XHRpZiAodHlwZSA9PT0gJ3BheW1lbnQnKSB7XG5cdFx0XHRwYXltZW50ID0gZmllbGQuY2xvc2VzdCgnW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtcGF5bWVudD1cIicgKyBmaWVsZC52YWx1ZSArICdcIl0nKTtcblx0XHRcdGlmIChwYXltZW50KSB7XG5cdFx0XHRcdGxldCBmaWVsZHMgPSBwYXltZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lKj1cInBhcmFtc1snICsgZmllbGQudmFsdWUgKyAnXCJdJyk7XG5cdFx0XHRcdGlmIChmaWVsZHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZpZWxkcy5mb3JFYWNoKChwYXJhbSkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IG5hbWVQYXJhbSA9IHBhcmFtLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdFx0XHRcdFx0bmFtZVBhcmFtID0gbmFtZVBhcmFtLnJlcGxhY2UoJ3BhcmFtcycsICdbcGFyYW1zXScpO1xuXHRcdFx0XHRcdFx0YWpheERhdGEuc2V0KCdzYXZlZm9ybWRhdGEnICsgbmFtZVBhcmFtLCBwYXJhbS52YWx1ZSk7XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3NoaXBwaW5nJykge1xuXHRcdFx0c2hpcHBpbmcgPSBmaWVsZC5jbG9zZXN0KCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1zaGlwcGluZz1cIicgKyBmaWVsZC52YWx1ZSArICdcIl0nKTtcblx0XHRcdGlmIChzaGlwcGluZykge1xuXHRcdFx0XHRsZXQgZmllbGRzID0gc2hpcHBpbmcucXVlcnlTZWxlY3RvckFsbCgnW25hbWUqPVwicGFyYW1zWycgKyBmaWVsZC52YWx1ZSArICdcIl0nKTtcblx0XHRcdFx0aWYgKGZpZWxkcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZmllbGRzLmZvckVhY2goKHBhcmFtKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgbmFtZVBhcmFtID0gcGFyYW0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdFx0XHRuYW1lUGFyYW0gPSBuYW1lUGFyYW0ucmVwbGFjZSgncGFyYW1zJywgJ1twYXJhbXNdJyk7XG5cdFx0XHRcdFx0XHRhamF4RGF0YS5zZXQoJ3NhdmVmb3JtZGF0YScgKyBuYW1lUGFyYW0sIHBhcmFtLnZhbHVlKTtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuc2VuZEFqYXgoJ3Bvc3QnLCAnc2F2ZUZvcm1EYXRhJywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2FkZHJlc3MnICYmIHJlc3BvbnNlLmRhdGEucmVsb2FkKSB7XG5cdFx0XHRcdHRoaXMucmVsb2FkU2Nyb2xsUGFnZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGUgPT09ICdwYXltZW50JyB8fCB0eXBlID09PSAnc2hpcHBpbmcnKSB7XG5cdFx0XHRcdHRoaXMucmVsb2FkU2Nyb2xsUGFnZSgpO1xuXHRcdFx0fVxuXG5cblx0XHR9KS5jYXRjaCgoZXJyb3IpID0+IHtcblx0XHRcdHRoaXMuc2V0TWVzc2FnZSgnZXJyb3InLCBlcnJvci5tZXNzYWdlKTtcblx0XHR9KTtcblx0fVxuXG5cdHNhdmVNZXRob2RzUGFyYW1zKHR5cGUsIGVsZW1lbnQsIHJlbG9hZCkge1xuXHRcdGlmICghdHlwZSB8fCAhZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGxldCBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YSxcblx0XHRcdG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdGFqYXhEYXRhLnNldCgndHlwZScsIHR5cGUpO1xuXHRcdGFqYXhEYXRhLnNldChuYW1lLCBlbGVtZW50LnZhbHVlKTtcblx0XHR0aGlzLnNlbmRBamF4KCdwb3N0JywgJ3NhdmVNZXRob2RzUGFyYW1zJywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRpZiAocmVsb2FkKSB7XG5cdFx0XHRcdHRoaXMucmVsb2FkU2Nyb2xsUGFnZSgpO1xuXHRcdFx0fVxuXHRcdFx0bGV0IG1hdGNoZXMgPSBuYW1lLm1hdGNoKC8oPzw9XFxbKS4qPyg/PVxcXSkvZyksXG5cdFx0XHRcdGlkID0gMDtcblx0XHRcdGlmIChtYXRjaGVzICYmIG1hdGNoZXNbMV0pIHtcblx0XHRcdFx0aWQgPSBtYXRjaGVzWzBdO1xuXHRcdFx0XHRuYW1lID0gbWF0Y2hlc1sxXTtcblx0XHRcdH1cblx0XHRcdHRoaXMudHJpZ2dlckV2ZW50KCduZXZpZ2VuT25lU3RlcENoZWNrb3V0QWZ0ZXJTYXZlTWV0aG9kc1BhcmFtcycsIHtcblx0XHRcdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0aWQ6IGlkXG5cdFx0XHR9KTtcblxuXHRcdH0pLmNhdGNoKChlcnJvcikgPT4ge1xuXHRcdFx0dGhpcy5zZXRNZXNzYWdlKCdlcnJvcicsIGVycm9yLm1lc3NhZ2UsIHRoaXMuY29udGFpbmVyTG9naW5NZWVzYWdlKVxuXHRcdH0pO1xuXHR9XG5cblx0Y2FydEVkaXRDaGFuZ2VRdWFudGl0eShrZXksIHF1YW50aXR5KSB7XG5cdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdGFqYXhEYXRhLnNldCgncHJvZHVjdF9pZCcsIGtleSk7XG5cdFx0YWpheERhdGEuc2V0KCdxdWFudGl0eScsIHF1YW50aXR5KTtcblx0XHR0aGlzLnNlbmRBamF4KCdwb3N0JywgJ2NhcnRDaGFuZ2VRdWFudGl0eUFqYXgnLCBhamF4RGF0YSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdGlmIChyZXNwb25zZS5kYXRhKSB7XG5cdFx0XHRcdGxldCBjYXJ0UHJpY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcHJvZHVjdC1wcmljZT1cIicgKyBrZXkgKyAnXCJdLFtkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdC1wcm9kdWN0LXByaWNlPVwiJyArIGtleSArICdcIl0nKTtcblx0XHRcdFx0aWYgKGNhcnRQcmljZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0Y2FydFByaWNlLmZvckVhY2goKGNhcnRQcmljZSkgPT4ge1xuXHRcdFx0XHRcdFx0Y2FydFByaWNlLmlubmVySFRNTCA9IHJlc3BvbnNlLmRhdGEucHJpY2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGNhcnRTdW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcHJvZHVjdC1zdW09XCInICsga2V5ICsgJ1wiXSxbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQtcHJvZHVjdC1zdW09XCInICsga2V5ICsgJ1wiXScpO1xuXHRcdFx0XHRpZiAoY2FydFN1bS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0Y2FydFN1bS5mb3JFYWNoKChwcm9kdWN0U3VtKSA9PiB7XG5cdFx0XHRcdFx0XHRwcm9kdWN0U3VtLmlubmVySFRNTCA9IHJlc3BvbnNlLmRhdGEuc3VtO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY2FydEVkaXRVcGRhdGVUb3RhbChyZXNwb25zZS5kYXRhLmNhcnQpO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHRoaXMuc2V0TWVzc2FnZSgnZXJyb3InLCBlcnJvci5tZXNzYWdlLCB0aGlzLmNvbnRhaW5lckNhcnRFZGl0TWVlc2FnZSlcblx0XHR9KTtcblx0fVxuXG5cdGNhcnRFZGl0UmVtb3ZlUHJvZHVjdChwcm9kdWN0X2lkKSB7XG5cdFx0bGV0IGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhO1xuXHRcdGFqYXhEYXRhLnNldCgncHJvZHVjdF9pZCcsIHByb2R1Y3RfaWQpO1xuXHRcdHRoaXMuc2VuZEFqYXgoJ3Bvc3QnLCAnY2FydFJlbW92ZVByb2R1Y3RBamF4JywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuXHRcdFx0XHRsZXQgcHJvZHVjdHNDYXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdD1cInByb2R1Y3RzXCJdLFtkYXRhLW5ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdD1cInByb2R1Y3RzXCJdJylcblx0XHRcdFx0aWYgKHByb2R1Y3RzQ2FydC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0cHJvZHVjdHNDYXJ0LmZvckVhY2goKHByb2R1Y3RzQmxvY2spID0+IHtcblx0XHRcdFx0XHRcdGxldCBwcm9kdWN0cyA9IHByb2R1Y3RzQmxvY2sucXVlcnlTZWxlY3RvckFsbCgnW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0LWNhcnQtZWRpdD1cInByb2R1Y3RcIl0sW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0PVwicHJvZHVjdFwiXScpXG5cdFx0XHRcdFx0XHRpZiAocHJvZHVjdHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRsZXQgY291bnQgPSBwcm9kdWN0cy5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRsZXQga2V5ID0gcHJvZHVjdC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5Jyk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KGtleSkgPT09IHBhcnNlSW50KHByb2R1Y3RfaWQpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9kdWN0LnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZiAoY291bnQgPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBjbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQ9XCJjbG9zZVwiXSxbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQ9XCJjbG9zZVwiXScpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGNsb3NlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xvc2UuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGJ1dHRvbikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnV0dG9uLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjbGljaycsIHsnYnViYmxlcyc6IHRydWV9KSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHRoaXMuc2V0TWVzc2FnZSgnZXJyb3InLCBlcnJvci5tZXNzYWdlLCB0aGlzLmNvbnRhaW5lckNhcnRFZGl0TWVlc2FnZSk7XG5cdFx0fSk7XG5cdH1cblxuXHRjYXJ0RWRpdFVwZGF0ZVRvdGFsKHN1bSkge1xuXHRcdGlmIChzdW0pIHtcblx0XHRcdGxldCB0b3RhbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uZXZpZ2VuLW9uZXN0ZXBjaGVja291dC1jYXJ0LWVkaXQ9XCJ0b3RhbFwiXSxbbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQtY2FydC1lZGl0PVwidG90YWxcIl0nKVxuXHRcdFx0aWYgKHRvdGFscy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHRvdGFscy5mb3JFYWNoKCh0b3RhbCkgPT4ge1xuXHRcdFx0XHRcdHRvdGFsLmlubmVySFRNTCA9IHN1bTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y2FydFJhYmJhdCgpIHtcblx0XHRpZiAodGhpcy5yYWJhdHQgJiYgdGhpcy5yYWJhdHQudmFsdWUpIHtcblx0XHRcdGxldCBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YTtcblx0XHRcdGFqYXhEYXRhLnNldCgncmFiYXR0JywgdGhpcy5yYWJhdHQudmFsdWUpO1xuXHRcdFx0dGhpcy5zZW5kQWpheCgncG9zdCcsICdyYWJhdHRBamF4JywgYWpheERhdGEpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdHRoaXMucmVsb2FkU2Nyb2xsUGFnZSgpO1xuXHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHR0aGlzLnNldE1lc3NhZ2UoJ2Vycm9yJywgZXJyb3IubWVzc2FnZSlcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHNldE5ldmlnZW5Cb251c2VzQ2FydFBvaW50cyhwb2ludHNfc3ViID0gbnVsbCkge1xuXHRcdGlmIChwb2ludHNfc3ViID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YTtcblx0XHRhamF4RGF0YS5zZXQoJ3BvaW50c19zdWInLCBwb2ludHNfc3ViKTtcblx0XHR0aGlzLnNlbmRBamF4KCdwb3N0JywgJ3NldE5ldmlnZW5Cb251c2VzQ2FydFBvaW50c0FqYXgnLCBhamF4RGF0YSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdHRoaXMucmVsb2FkU2Nyb2xsUGFnZSgpO1xuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHRoaXMuc2V0TWVzc2FnZSgnZXJyb3InLCBlcnJvci5tZXNzYWdlKVxuXHRcdH0pO1xuXHR9XG5cblx0bG9naW4oKSB7XG5cdFx0aWYgKHRoaXMub3B0aW9ucy51c2VyID09PSAwKSB7XG5cdFx0XHRsZXQgZmllbGRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW25hbWVePVwibmV2aWdlbm9uZXN0ZXBjaGVja291dGxvZ2luXCJdJyksXG5cdFx0XHRcdHZhbGlkID0gdHJ1ZTtcblx0XHRcdGlmIChmaWVsZHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRsZXQgYWpheERhdGEgPSBuZXcgRm9ybURhdGE7XG5cdFx0XHRcdGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuXHRcdFx0XHRcdGlmIChmaWVsZC52YWx1ZSA9PT0gJycpIHtcblx0XHRcdFx0XHRcdGZpZWxkLmNsYXNzTGlzdC5hZGQoJ2lzLWludmFsaWQnKTtcblx0XHRcdFx0XHRcdHZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChmaWVsZC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuXHRcdFx0XHRcdFx0XHRpZiAoZmllbGQuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0XHRcdGFqYXhEYXRhLnNldChmaWVsZC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSwgZmllbGQudmFsdWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhamF4RGF0YS5zZXQoZmllbGQuZ2V0QXR0cmlidXRlKCduYW1lJyksIGZpZWxkLnZhbHVlKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZmllbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW52YWxpZCcpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMudHJpZ2dlckV2ZW50KCduZXZpZ2VuT25lU3RlcENoZWNrb3V0TG9naW5Gb3JtVmFsaWRGaWVsZCcsIGZpZWxkKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKHZhbGlkKSB7XG5cdFx0XHRcdFx0dGhpcy5zZW5kQWpheCgncG9zdCcsICdsb2dpbkFqYXgnLCBhamF4RGF0YSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucmVsb2FkU2Nyb2xsUGFnZSgpO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0TWVzc2FnZSgnZXJyb3InLCBlcnJvci5tZXNzYWdlLCB0aGlzLmNvbnRhaW5lckxvZ2luTWVlc2FnZSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHNlbmRBamF4KG1ldGhvZEFqYXgsIG1ldGhvZCwgYWpheERhdGEpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0aWYgKCFhamF4RGF0YSB8fCAhbWV0aG9kQWpheCB8fCAhbWV0aG9kKSB7XG5cdFx0XHRcdHJlamVjdCgnRXJyb3IgYWpheCBkYXRhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLmNzcmYpIHtcblx0XHRcdFx0YWpheERhdGEuc2V0KHRoaXMuY3NyZiwgMSlcblx0XHRcdH1cblx0XHRcdGFqYXhEYXRhLnNldCgndGFzaycsIG1ldGhvZCk7XG5cdFx0XHRKb29tbGEucmVxdWVzdCh7XG5cdFx0XHRcdHVybDogdGhpcy5jb250cm9sbGVyLFxuXHRcdFx0XHRtZXRob2Q6IG1ldGhvZEFqYXgsXG5cdFx0XHRcdGRhdGE6IGFqYXhEYXRhLFxuXHRcdFx0XHRvblN1Y2Nlc3M6IHJlc3AgPT4ge1xuXHRcdFx0XHRcdGxldCByZXNwb25zZTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3ApO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBKU09OJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZWplY3QocmVzcG9uc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0b25FcnJvcjogcmVzcCA9PiB7XG5cdFx0XHRcdFx0bGV0IHJlc3BvbnNlO1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcC5yZXNwb25zZSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHBhcnNlIEpTT04nKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZWplY3QocmVzcG9uc2UpO1xuXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pXG5cdH1cblxuXHRzZXRNZXNzYWdlKHR5cGUsIG1lc3NhZ2UsIGNvbnRhaW5lcikge1xuXHRcdGlmICghdHlwZSB8fCAhbWVzc2FnZSkgcmV0dXJuO1xuXHRcdEpvb21sYS5yZW1vdmVNZXNzYWdlcyhjb250YWluZXIpO1xuXHRcdEpvb21sYS5yZW5kZXJNZXNzYWdlcyh7XG5cdFx0XHRbdHlwZV06IFttZXNzYWdlXVxuXHRcdH0sIGNvbnRhaW5lcik7XG5cdH1cblxuXHRyZWxvYWRTY3JvbGxQYWdlKG5lZWRTY3JvbGwpIHtcblx0XHRpZiAobmVlZFNjcm9sbCkge1xuXHRcdFx0bGV0IHNjcm9sbCA9IENvb2tpZXMuZ2V0KCduZXZpZ2VuX29uZXN0ZXBjaGVja291dF9zY3JvbGwnKTtcblx0XHRcdGlmIChzY3JvbGwpIHtcblx0XHRcdFx0d2luZG93LnNjcm9sbCgwLCBzY3JvbGwpO1xuXHRcdFx0XHRDb29raWVzLnJlbW92ZSgnbmV2aWdlbl9vbmVzdGVwY2hlY2tvdXRfc2Nyb2xsJyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2V0UHJlbG9hZGVyKCk7XG5cdFx0XHRpZiAod2luZG93LnNjcm9sbFkpIHtcblx0XHRcdFx0Q29va2llcy5zZXQoJ25ldmlnZW5fb25lc3RlcGNoZWNrb3V0X3Njcm9sbCcsIHdpbmRvdy5zY3JvbGxZKVxuXHRcdFx0fVxuXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHR9XG5cblx0fVxuXG5cdHNldFByZWxvYWRlcigpIHtcblx0XHRsZXQgcHJlbG9hZGVyU291cmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmV2aWdlbi1vbmVzdGVwY2hlY2tvdXQ9XCJwcmVsb2FkZXJcIl0nKTtcblx0XHRpZiAoIXByZWxvYWRlclNvdXJjZSkge1xuXHRcdFx0cHJlbG9hZGVyU291cmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25ldmlnZW4tb25lc3RlcGNoZWNrb3V0PVwicHJlbG9hZGVyXCJdJyk7XG5cdFx0fVxuXHRcdGlmIChwcmVsb2FkZXJTb3VyY2UpIHtcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocHJlbG9hZGVyU291cmNlKTtcblx0XHRcdHByZWxvYWRlclNvdXJjZS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0fVxuXHR9XG5cblx0dHJpZ2dlckV2ZW50KG5hbWUsIGRhdGEsIGVsZW1lbnQpIHtcblx0XHRpZiAoIW5hbWUgfHwgIWRhdGEpIHJldHVybjtcblxuXHRcdGlmIChuYW1lKSB7XG5cdFx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChuYW1lLCB7XG5cdFx0XHRcdGRldGFpbDogZGF0YVxuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBOZXZpZ2VuT25lU3RlcENoZWNrb3V0O1xuXG53aW5kb3cuTmV2aWdlbk9uZVN0ZXBDaGVja291dENsYXNzID0gbnVsbDtcblxud2luZG93Lk5ldmlnZW5PbmVTdGVwQ2hlY2tvdXQgPSAoKSA9PiB7XG5cdGlmICh3aW5kb3cuTmV2aWdlbk9uZVN0ZXBDaGVja291dENsYXNzID09PSBudWxsKSB7XG5cdFx0d2luZG93Lk5ldmlnZW5PbmVTdGVwQ2hlY2tvdXRDbGFzcyA9IG5ldyBOZXZpZ2VuT25lU3RlcENoZWNrb3V0KCk7XG5cdH1cblx0cmV0dXJuIHdpbmRvdy5OZXZpZ2VuT25lU3RlcENoZWNrb3V0Q2xhc3M7XG59O1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHR3aW5kb3cuTmV2aWdlbk9uZVN0ZXBDaGVja291dCgpLmxvYWRBY3Rpb25zKCk7XG5cdGxldCBwb2ludHNfc3ViID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInBvaW50c19zdWJcIl0nKTtcblx0aWYgKHBvaW50c19zdWIpIHtcblx0XHRwb2ludHNfc3ViLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRsZXQgdmFsdWUgPSBwb2ludHNfc3ViLnZhbHVlO1xuXHRcdFx0aWYgKHBvaW50c19zdWIuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcblx0XHRcdFx0aWYgKHBvaW50c19zdWIuY2hlY2tlZCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHR2YWx1ZSA9ICcwJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0d2luZG93Lk5ldmlnZW5PbmVTdGVwQ2hlY2tvdXQoKS5zZXROZXZpZ2VuQm9udXNlc0NhcnRQb2ludHModmFsdWUpXG5cdFx0fSk7XG5cdFx0aWYgKHBvaW50c19zdWIuZ2V0QXR0cmlidXRlKCd0eXBlJykgIT09ICdjaGVja2JveCcpIHtcblx0XHRcdHBvaW50c19zdWIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuXHRcdFx0XHRsZXQgdmFsdWUgPSBwb2ludHNfc3ViLnZhbHVlO1xuXG5cdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZSgvW14wLTksLl0vZywgXCJcIik7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZSgvLC9nLCAnLicpO1xuXG5cdFx0XHRcdHBvaW50c19zdWIudmFsdWUgPSB2YWx1ZTtcblxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59KTtcbiJdLCJuYW1lcyI6WyJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSIsInNvdXJjZSIsImV4Y2x1ZGVkIiwidGFyZ2V0Iiwic291cmNlS2V5cyIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJpIiwibGVuZ3RoIiwiaW5kZXhPZiIsIl8iLCJIVE1MTWFza0VsZW1lbnQiLCJJTWFzayIsIkhUTUxDb250ZW50ZWRpdGFibGVNYXNrRWxlbWVudCIsIl91bnNhZmVTZWxlY3Rpb25TdGFydCIsInJvb3QiLCJyb290RWxlbWVudCIsInNlbGVjdGlvbiIsImdldFNlbGVjdGlvbiIsImFuY2hvck9mZnNldCIsImZvY3VzT2Zmc2V0IiwiX3Vuc2FmZVNlbGVjdGlvbkVuZCIsIl91bnNhZmVTZWxlY3QiLCJzdGFydCIsImVuZCIsImNyZWF0ZVJhbmdlIiwicmFuZ2UiLCJzZXRTdGFydCIsImlucHV0IiwiZmlyc3RDaGlsZCIsInNldEVuZCIsImxhc3RDaGlsZCIsInJlbW92ZUFsbFJhbmdlcyIsImFkZFJhbmdlIiwidmFsdWUiLCJ0ZXh0Q29udGVudCIsImRlZmF1bHQiLCJNYXNrRWxlbWVudCIsImNvbnN0cnVjdG9yIiwiX2hhbmRsZXJzIiwiX3RoaXMkaW5wdXQkZ2V0Um9vdE5vIiwiX3RoaXMkaW5wdXQkZ2V0Um9vdE5vMiIsIl90aGlzJGlucHV0IiwiZ2V0Um9vdE5vZGUiLCJjYWxsIiwiZG9jdW1lbnQiLCJpc0FjdGl2ZSIsImFjdGl2ZUVsZW1lbnQiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkVuZCIsInNldFNlbGVjdGlvblJhbmdlIiwiYmluZEV2ZW50cyIsImhhbmRsZXJzIiwiZm9yRWFjaCIsImV2ZW50IiwiX3RvZ2dsZUV2ZW50SGFuZGxlciIsIkVWRU5UU19NQVAiLCJ1bmJpbmRFdmVudHMiLCJoYW5kbGVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZWxlY3Rpb25DaGFuZ2UiLCJkcm9wIiwiY2xpY2siLCJmb2N1cyIsImNvbW1pdCIsIm9iamVjdEluY2x1ZGVzIiwiRElSRUNUSU9OIiwiQWN0aW9uRGV0YWlscyIsImNyZWF0ZU1hc2siLCJtYXNrZWRDbGFzcyIsIl9leGNsdWRlZCIsIklucHV0TWFzayIsImVsIiwib3B0cyIsImlzQ29udGVudEVkaXRhYmxlIiwidGFnTmFtZSIsIm1hc2tlZCIsIl9saXN0ZW5lcnMiLCJfdmFsdWUiLCJfdW5tYXNrZWRWYWx1ZSIsIl9zYXZlU2VsZWN0aW9uIiwiYmluZCIsIl9vbklucHV0IiwiX29uQ2hhbmdlIiwiX29uRHJvcCIsIl9vbkZvY3VzIiwiX29uQ2xpY2siLCJhbGlnbkN1cnNvciIsImFsaWduQ3Vyc29yRnJpZW5kbHkiLCJfYmluZEV2ZW50cyIsInVwZGF0ZVZhbHVlIiwibWFzayIsIm1hc2tFcXVhbHMiLCJfdGhpcyRtYXNrZWQiLCJNYXNrZWQiLCJ1cGRhdGVPcHRpb25zIiwidW5tYXNrZWRWYWx1ZSIsInN0ciIsInVwZGF0ZUNvbnRyb2wiLCJ0eXBlZFZhbHVlIiwidmFsIiwidHlwZWRWYWx1ZUVxdWFscyIsImRpc3BsYXlWYWx1ZSIsIl91bmJpbmRFdmVudHMiLCJfZmlyZUV2ZW50IiwiZXYiLCJfbGVuIiwiYXJndW1lbnRzIiwiYXJncyIsIkFycmF5IiwiX2tleSIsImxpc3RlbmVycyIsImwiLCJfY3Vyc29yQ2hhbmdpbmciLCJfY2hhbmdpbmdDdXJzb3JQb3MiLCJjdXJzb3JQb3MiLCJwb3MiLCJzZWxlY3QiLCJjb25zb2xlIiwid2FybiIsIl9zZWxlY3Rpb24iLCJuZXdVbm1hc2tlZFZhbHVlIiwibmV3VmFsdWUiLCJuZXdEaXNwbGF5VmFsdWUiLCJpc0NoYW5nZWQiLCJfZmlyZUNoYW5nZUV2ZW50cyIsInJlc3RPcHRzIiwidXBkYXRlTWFzayIsInVwZGF0ZU9wdHMiLCJ1cGRhdGVDdXJzb3IiLCJfZGVsYXlVcGRhdGVDdXJzb3IiLCJfYWJvcnRVcGRhdGVDdXJzb3IiLCJzZXRUaW1lb3V0IiwiX2lucHV0RXZlbnQiLCJpc0NvbXBsZXRlIiwiY2xlYXJUaW1lb3V0IiwibmVhcmVzdElucHV0UG9zIiwiTEVGVCIsIm9uIiwicHVzaCIsIm9mZiIsImhJbmRleCIsInNwbGljZSIsImUiLCJkZXRhaWxzIiwib2xkUmF3VmFsdWUiLCJyYXdJbnB1dFZhbHVlIiwib2Zmc2V0Iiwic3RhcnRDaGFuZ2VQb3MiLCJyZW1vdmVkIiwiaW5zZXJ0ZWQiLCJyZW1vdmVEaXJlY3Rpb24iLCJyYXciLCJOT05FIiwiZG9Db21taXQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImRlc3Ryb3kiLCJvbGRWYWx1ZSIsIm9sZFNlbGVjdGlvbiIsInNsaWNlIiwiTWF0aCIsIm1pbiIsImluc2VydGVkQ291bnQiLCJzdWJzdHIiLCJyZW1vdmVkQ291bnQiLCJtYXgiLCJoZWFkIiwic3Vic3RyaW5nIiwidGFpbCIsIlJJR0hUIiwiQ2hhbmdlRGV0YWlscyIsImFzc2lnbiIsInJhd0luc2VydGVkIiwic2tpcCIsInRhaWxTaGlmdCIsImFnZ3JlZ2F0ZSIsIkNvbnRpbnVvdXNUYWlsRGV0YWlscyIsInVuZGVmaW5lZCIsImZyb20iLCJzdG9wIiwidG9TdHJpbmciLCJleHRlbmQiLCJTdHJpbmciLCJhcHBlbmRUbyIsImFwcGVuZCIsIl9hcHBlbmRQbGFjZWhvbGRlciIsInN0YXRlIiwidW5zaGlmdCIsImJlZm9yZVBvcyIsInNoaWZ0Q2hhciIsInNoaWZ0IiwiaXNTdHJpbmciLCJGT1JDRV9MRUZUIiwiRk9SQ0VfUklHSFQiLCJpbmRleEluRGlyZWN0aW9uIiwiZGlyZWN0aW9uIiwicG9zSW5EaXJlY3Rpb24iLCJmb3JjZURpcmVjdGlvbiIsImVzY2FwZVJlZ0V4cCIsInJlcGxhY2UiLCJub3JtYWxpemVQcmVwYXJlIiwicHJlcCIsImlzQXJyYXkiLCJiIiwiYSIsImFyckEiLCJhcnJCIiwiZGF0ZUEiLCJEYXRlIiwiZGF0ZUIiLCJnZXRUaW1lIiwicmVnZXhwQSIsIlJlZ0V4cCIsInJlZ2V4cEIiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsIk1hc2tlZFBhdHRlcm4iLCJNYXNrZWRFbnVtIiwiTWFza2VkUmFuZ2UiLCJNYXNrZWROdW1iZXIiLCJNYXNrZWREYXRlIiwiTWFza2VkUmVnRXhwIiwiTWFza2VkRnVuY3Rpb24iLCJNYXNrZWREeW5hbWljIiwiUElQRV9UWVBFIiwiY3JlYXRlUGlwZSIsInBpcGUiLCJnbG9iYWxUaGlzIiwiX3VwZGF0ZSIsIkRFRkFVTFRTIiwiaXNJbml0aWFsaXplZCIsIndpdGhWYWx1ZVJlZnJlc2giLCJyZXNldCIsInJlc29sdmUiLCJkb1BhcnNlIiwiZG9Gb3JtYXQiLCJleHRyYWN0SW5wdXQiLCJpc0ZpbGxlZCIsInRvdGFsSW5wdXRQb3NpdGlvbnMiLCJmcm9tUG9zIiwidG9Qb3MiLCJleHRyYWN0VGFpbCIsImFwcGVuZFRhaWwiLCJfYXBwZW5kQ2hhclJhdyIsImNoIiwiX2FwcGVuZENoYXIiLCJmbGFncyIsImNoZWNrVGFpbCIsImNvbnNpc3RlbnRTdGF0ZSIsImRvUHJlcGFyZSIsImNvbnNpc3RlbnRUYWlsIiwiYXBwZW5kZWQiLCJkb1ZhbGlkYXRlIiwiYmVmb3JlVGFpbFN0YXRlIiwib3ZlcndyaXRlIiwidGFpbERldGFpbHMiLCJfYXBwZW5kRWFnZXIiLCJFcnJvciIsIl9iZWZvcmVUYWlsU3RhdGUiLCJjaSIsImQiLCJkb1NraXBJbnZhbGlkIiwiZWFnZXIiLCJyZW1vdmUiLCJmbiIsIl9yZWZyZXNoaW5nIiwicmF3SW5wdXQiLCJyZXQiLCJydW5Jc29sYXRlZCIsIl9pc29sYXRlZCIsInNraXBJbnZhbGlkIiwicHJlcGFyZSIsInZhbGlkYXRlIiwicGFyZW50IiwiZm9ybWF0IiwicGFyc2UiLCJkZWxldGVDb3VudCIsInRhaWxQb3MiLCJlYWdlclJlbW92ZSIsInZhbExlbmd0aCIsInR2YWwiLCJFTVBUWV9WQUxVRVMiLCJpbmNsdWRlcyIsInYiLCJwYXR0ZXJuIiwiYmxvY2tzIiwiR0VUX0RFRkFVTFRfQkxPQ0tTIiwiWSIsImdldEZ1bGxZZWFyIiwidG8iLCJtIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiYmsiLCJhdXRvZml4IiwiZGF0ZSIsImlzRGF0ZUV4aXN0IiwiZGF5IiwicGFkU3RhcnQiLCJtb250aCIsInllYXIiLCJqb2luIiwic3BsaXQiLCJtYXhMZW5ndGgiLCJfZXhjbHVkZWQyIiwiY3VycmVudE1hc2siLCJjb21waWxlZE1hc2tzIiwibWFwIiwiX2FwcGx5RGlzcGF0Y2giLCJjdXJyZW50TWFza0ZsYWdzIiwicHJldlZhbHVlQmVmb3JlVGFpbCIsImlucHV0VmFsdWUiLCJpbnNlcnRWYWx1ZSIsIl9yYXdJbnB1dFZhbHVlIiwidGFpbFZhbHVlIiwicHJldk1hc2siLCJwcmV2TWFza1N0YXRlIiwiZG9EaXNwYXRjaCIsIl9mbGFncyRfYmVmb3JlVGFpbFN0YSIsIl9mbGFncyRfYmVmb3JlVGFpbFN0YTIiLCJjdXJyZW50TWFza1JlZiIsImRpc3BhdGNoIiwicyIsImN1cnJlbnREZXRhaWxzIiwiX3RoaXMkY3VycmVudE1hc2siLCJfdGhpcyRjdXJyZW50TWFzazIiLCJCb29sZWFuIiwiX3RoaXMkY3VycmVudE1hc2szIiwiX3RoaXMkY3VycmVudE1hc2s0IiwibWFza2VkU3RhdGUiLCJtaSIsImV2ZXJ5IiwiX21hc2skbWkiLCJvbGRNYXNrIiwiX3RoaXMkY3VycmVudE1hc2s1IiwiaW5wdXRzIiwiaW5kZXgiLCJpc0N1cnJlbnQiLCJzdGFydElucHV0UG9zIiwid2VpZ2h0Iiwic29ydCIsImkxIiwiaTIiLCJlbnVtIiwicmVwZWF0Iiwic29tZSIsIk51bWJlciIsIkZ1bmN0aW9uIiwiTWFza2VkQ2xhc3MiLCJfdXBkYXRlUmVnRXhwcyIsImFsbG93TmVnYXRpdmUiLCJtaWQiLCJzY2FsZSIsImNvbmNhdCIsInJhZGl4IiwiX251bWJlclJlZ0V4cCIsIl9tYXBUb1JhZGl4UmVnRXhwIiwibWFwVG9SYWRpeCIsIl90aG91c2FuZHNTZXBhcmF0b3JSZWdFeHAiLCJ0aG91c2FuZHNTZXBhcmF0b3IiLCJfcmVtb3ZlVGhvdXNhbmRzU2VwYXJhdG9ycyIsIl9pbnNlcnRUaG91c2FuZHNTZXBhcmF0b3JzIiwicGFydHMiLCJwcmVwQ2giLCJfc2VwYXJhdG9yc0NvdW50IiwiZXh0ZW5kT25TZXBhcmF0b3JzIiwiY291bnQiLCJfc2VwYXJhdG9yc0NvdW50RnJvbVNsaWNlIiwiX2FkanVzdFJhbmdlV2l0aFNlcGFyYXRvcnMiLCJwcmV2QmVmb3JlVGFpbFZhbHVlIiwicHJldkJlZm9yZVRhaWxTZXBhcmF0b3JzQ291bnQiLCJhcHBlbmREZXRhaWxzIiwiYmVmb3JlVGFpbFZhbHVlIiwiYmVmb3JlVGFpbFNlcGFyYXRvcnNDb3VudCIsIl9maW5kU2VwYXJhdG9yQXJvdW5kIiwic2VhcmNoRnJvbSIsInNlcGFyYXRvclBvcyIsInNlcGFyYXRvckFyb3VuZEZyb21Qb3MiLCJzZXBhcmF0b3JBcm91bmRUb1BvcyIsInZhbHVlQmVmb3JlUG9zIiwidmFsdWVBZnRlclBvcyIsInNlcGFyYXRvckF0TGVmdFBvcyIsInNlcGFyYXRvckF0TGVmdEVuZFBvcyIsInNlcGFyYXRvckF0UmlnaHRQb3MiLCJ2YWxpZCIsIm1hdGNoIiwibnVtYmVyIiwiaXNOYU4iLCJ2YWxpZG51bSIsImZvcm1hdHRlZCIsIm5vcm1hbGl6ZVplcm9zIiwiX25vcm1hbGl6ZVplcm9zIiwicGFkRnJhY3Rpb25hbFplcm9zIiwiX3BhZEZyYWN0aW9uYWxaZXJvcyIsInNpZ24iLCJ6ZXJvcyIsIm51bSIsInRlc3QiLCJwYWRFbmQiLCJkcm9wRnJhY3Rpb25hbCIsIlVOTUFTS0VEX1JBRElYIiwibiIsInNpZ25lZCIsInRvTG9jYWxlU3RyaW5nIiwidXNlR3JvdXBpbmciLCJtYXhpbXVtRnJhY3Rpb25EaWdpdHMiLCJQYXR0ZXJuSW5wdXREZWZpbml0aW9uIiwiREVGQVVMVF9JTlBVVF9ERUZJTklUSU9OUyIsIlBhdHRlcm5GaXhlZERlZmluaXRpb24iLCJDaHVua3NUYWlsRGV0YWlscyIsIlBhdHRlcm5DdXJzb3IiLCJkZWZpbml0aW9ucyIsIl9yZWJ1aWxkTWFzayIsImRlZnMiLCJfYmxvY2tzIiwiX3N0b3BzIiwiX21hc2tlZEJsb2NrcyIsInVubWFza2luZ0Jsb2NrIiwib3B0aW9uYWxCbG9jayIsIl9kZWZzJGNoYXIiLCJfZGVmcyRjaGFyMiIsInAiLCJiTmFtZXMiLCJmaWx0ZXIiLCJiTmFtZSIsIm1hc2tlZEJsb2NrIiwibGF6eSIsInBsYWNlaG9sZGVyQ2hhciIsImRpc3BsYXlDaGFyIiwiY2hhciIsImlzSW5wdXQiLCJTVE9QX0NIQVIiLCJFU0NBUEVfQ0hBUiIsIm1hc2tPcHRzIiwiZGVmIiwiaXNPcHRpb25hbCIsImlzVW5tYXNraW5nIiwiYmkiLCJpc0ZpeGVkIiwicmVkdWNlIiwiX3RoaXMkX21hcFBvc1RvQmxvY2siLCJzdGFydEJsb2NrSW5kZXgiLCJfbWFwUG9zVG9CbG9jayIsImJsb2NrSXRlciIsImJsb2NrIiwiYmxvY2tEZXRhaWxzIiwiY2h1bmtUYWlsIiwiX2ZvckVhY2hCbG9ja3NJblJhbmdlIiwiYkZyb21Qb3MiLCJiVG9Qb3MiLCJibG9ja0NodW5rIiwiX2ZpbmRTdG9wQmVmb3JlIiwiX2Jsb2NrU3RhcnRQb3MiLCJibG9ja0luZGV4Iiwic3RvcEJlZm9yZSIsInNpIiwidG9CbG9ja0luZGV4Iiwic3RhcnRCbG9ja0l0ZXIiLCJlbmRCbG9ja0luZGV4IiwiYkRldGFpbHMiLCJhY2NWYWwiLCJibG9ja1N0YXJ0UG9zIiwiZnJvbUJsb2NrSXRlciIsInRvQmxvY2tJdGVyIiwiaXNTYW1lQmxvY2siLCJmcm9tQmxvY2tTdGFydFBvcyIsImZyb21CbG9ja0VuZFBvcyIsInJlbW92ZURldGFpbHMiLCJjdXJzb3IiLCJwdXNoUmlnaHRCZWZvcmVJbnB1dCIsInBvcFN0YXRlIiwicHVzaExlZnRCZWZvcmVJbnB1dCIsInB1c2hSaWdodEJlZm9yZUZpbGxlZCIsIm9rIiwicHVzaExlZnRCZWZvcmVSZXF1aXJlZCIsInB1c2hMZWZ0QmVmb3JlRmlsbGVkIiwicHVzaFJpZ2h0QmVmb3JlUmVxdWlyZWQiLCJ0b3RhbCIsIm5hbWUiLCJtYXNrZWRCbG9ja3MiLCJpbmRpY2VzIiwiZ2kiLCJJbnB1dERlZmluaXRpb24iLCJGaXhlZERlZmluaXRpb24iLCJjaHVua3MiLCJ0YWlsQ2h1bmsiLCJsYXN0Q2h1bmsiLCJleHRlbmRMYXN0IiwiZmlyc3RUYWlsQ2h1bmsiLCJjaHVuayIsImxhc3RCbG9ja0l0ZXIiLCJjaHVua0Jsb2NrIiwicGhEZXRhaWxzIiwicmVtYWluQ2hhcnMiLCJjIiwicHJvcHMiLCJjc3RhdGUiLCJjaHVua1NoaWZ0UG9zIiwiX2xvZyIsInB1c2hTdGF0ZSIsInBvcCIsImJpbmRCbG9jayIsIl9wdXNoTGVmdCIsIl90aGlzJGJsb2NrIiwiX3B1c2hSaWdodCIsIl9pc1Jhd0lucHV0IiwibWluUG9zIiwibWF4UG9zIiwiYXBwZW5kRWFnZXIiLCJpc1Jlc29sdmVkIiwiYm91bmRQb3MiLCJNQVNLRUQiLCJVTk1BU0tFRCIsIlRZUEVEIiwicGlwZUFyZ3MiLCJfbWF0Y2hGcm9tIiwiZnJvbVN0ciIsInRvU3RyIiwic2FtZUNoYXJzQ291bnQiLCJib3VuZGFyaWVzIiwibWluc3RyIiwibWF4c3RyIiwicGxhY2Vob2xkZXIiLCJuZXh0VmFsIiwiZmlyc3ROb25aZXJvIiwic2VhcmNoIiwiQ29va2llcyIsIk5ldmlnZW5PbmVTdGVwQ2hlY2tvdXQiLCJvcHRpb25zIiwiSm9vbWxhIiwiZ2V0T3B0aW9ucyIsImNvbnRyb2xsZXIiLCJjc3JmIiwidXNlX21hc2siLCJyYWJhdHQiLCJjb250YWluZXJDYXJ0RWRpdE1lZXNhZ2UiLCJxdWVyeVNlbGVjdG9yIiwidXNlciIsImNvbnRhaW5lckxvZ2luTWVlc2FnZSIsImZvcm1WYWxpZGF0aW9uTWVzc2FnZSIsImZvcm1WYWxpZGF0aW9uIiwibG9hZEFjdGlvbnMiLCJuZXZpZ2VuT25lU3RlcENoZWNrb3V0IiwiZm9ybXZhbGlkYXRvciIsImlzVmFsaWQiLCJhZ2IiLCJlcnJvciIsImNoZWNrZWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJwYXltZW50VmFsaWQiLCJqc2hvcCIsImZvcm1zIiwiY2hlY2tQYXltZW50Rm9ybSIsInNldFByZWxvYWRlciIsInN1Ym1pdCIsImFkZHJlc3NlcyIsImFkZHJlc3NGaWVsZHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZmllbGQiLCJnZXRBdHRyaWJ1dGUiLCJzYXZlRm9ybURhdGEiLCJwYXltZW50TWV0aG9kcyIsInBheW1lbnRzIiwicGF5bWVudEFjdGl2ZSIsInBhcmFtc1BheW1lbnQiLCJzYXZlTWV0aG9kc1BhcmFtcyIsInNoaXBwaW5nTWV0aG9kcyIsInNoaXBwaW5nIiwic2hpcHBpbmdBY3RpdmUiLCJpZCIsInBhcmFtc1NoaXBwaW5nIiwicXVhbnRpdHlJbnB1dHMiLCJwYXJzZUludCIsImNhcnRFZGl0Q2hhbmdlUXVhbnRpdHkiLCJxdWFudGl0eUJ1dHRvbnMiLCJidXR0b24iLCJ0eXBlIiwiY29udGFpbmVyIiwiY2xvc2VzdCIsInVwZGF0ZSIsImRpc3BhdGNoRXZlbnQiLCJFdmVudCIsImFqYXhEYXRhIiwiRm9ybURhdGEiLCJwYXltZW50Iiwic2V0IiwiZmllbGRzIiwicGFyYW0iLCJuYW1lUGFyYW0iLCJzZW5kQWpheCIsInRoZW4iLCJyZXNwb25zZSIsImRhdGEiLCJyZWxvYWQiLCJyZWxvYWRTY3JvbGxQYWdlIiwiY2F0Y2giLCJzZXRNZXNzYWdlIiwibWVzc2FnZSIsImVsZW1lbnQiLCJtYXRjaGVzIiwidHJpZ2dlckV2ZW50IiwicXVhbnRpdHkiLCJjYXJ0UHJpY2UiLCJpbm5lckhUTUwiLCJwcmljZSIsImNhcnRTdW0iLCJwcm9kdWN0U3VtIiwic3VtIiwiY2FydEVkaXRVcGRhdGVUb3RhbCIsImNhcnQiLCJjYXJ0RWRpdFJlbW92ZVByb2R1Y3QiLCJwcm9kdWN0X2lkIiwic3VjY2VzcyIsInByb2R1Y3RzQ2FydCIsInByb2R1Y3RzQmxvY2siLCJwcm9kdWN0cyIsInByb2R1Y3QiLCJjbG9zZSIsInRvdGFscyIsImNhcnRSYWJiYXQiLCJzZXROZXZpZ2VuQm9udXNlc0NhcnRQb2ludHMiLCJwb2ludHNfc3ViIiwibG9naW4iLCJtZXRob2RBamF4IiwibWV0aG9kIiwiUHJvbWlzZSIsInJlamVjdCIsInJlcXVlc3QiLCJ1cmwiLCJvblN1Y2Nlc3MiLCJyZXNwIiwiSlNPTiIsIm9uRXJyb3IiLCJyZW1vdmVNZXNzYWdlcyIsInJlbmRlck1lc3NhZ2VzIiwibmVlZFNjcm9sbCIsInNjcm9sbCIsImdldCIsIndpbmRvdyIsInNjcm9sbFkiLCJsb2NhdGlvbiIsInByZWxvYWRlclNvdXJjZSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiZGlzcGxheSIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiTmV2aWdlbk9uZVN0ZXBDaGVja291dENsYXNzIl0sInNvdXJjZVJvb3QiOiIifQ==