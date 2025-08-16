/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/flatpickr/dist/esm/index.js":
/*!**************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types_options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/options */ "./node_modules/flatpickr/dist/esm/types/options.js");
/* harmony import */ var _l10n_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./l10n/default */ "./node_modules/flatpickr/dist/esm/l10n/default.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/flatpickr/dist/esm/utils/index.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/dom */ "./node_modules/flatpickr/dist/esm/utils/dom.js");
/* harmony import */ var _utils_dates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/dates */ "./node_modules/flatpickr/dist/esm/utils/dates.js");
/* harmony import */ var _utils_formatting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/formatting */ "./node_modules/flatpickr/dist/esm/utils/formatting.js");
/* harmony import */ var _utils_polyfills__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/polyfills */ "./node_modules/flatpickr/dist/esm/utils/polyfills.js");
/* harmony import */ var _utils_polyfills__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_utils_polyfills__WEBPACK_IMPORTED_MODULE_6__);
var __assign = undefined && undefined.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArrays = undefined && undefined.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
  return r;
};







var DEBOUNCED_CHANGE_MS = 300;
function FlatpickrInstance(element, instanceConfig) {
  var self = {
    config: __assign(__assign({}, _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults), flatpickr.defaultConfig),
    l10n: _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"]
  };
  self.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({
    config: self.config,
    l10n: self.l10n
  });
  self._handlers = [];
  self.pluginElements = [];
  self.loadedPlugins = [];
  self._bind = bind;
  self._setHoursFromDate = setHoursFromDate;
  self._positionCalendar = positionCalendar;
  self.changeMonth = changeMonth;
  self.changeYear = changeYear;
  self.clear = clear;
  self.close = close;
  self.onMouseOver = onMouseOver;
  self._createElement = _utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement;
  self.createDay = createDay;
  self.destroy = destroy;
  self.isEnabled = isEnabled;
  self.jumpToDate = jumpToDate;
  self.updateValue = updateValue;
  self.open = open;
  self.redraw = redraw;
  self.set = set;
  self.setDate = setDate;
  self.toggle = toggle;
  function setupHelperFunctions() {
    self.utils = {
      getDaysInMonth: function (month, yr) {
        if (month === void 0) {
          month = self.currentMonth;
        }
        if (yr === void 0) {
          yr = self.currentYear;
        }
        if (month === 1 && (yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0)) return 29;
        return self.l10n.daysInMonth[month];
      }
    };
  }
  function init() {
    self.element = self.input = element;
    self.isOpen = false;
    parseConfig();
    setupLocale();
    setupInputs();
    setupDates();
    setupHelperFunctions();
    if (!self.isMobile) build();
    bindEvents();
    if (self.selectedDates.length || self.config.noCalendar) {
      if (self.config.enableTime) {
        setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj : undefined);
      }
      updateValue(false);
    }
    setCalendarWidth();
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!self.isMobile && isSafari) {
      positionCalendar();
    }
    triggerEvent("onReady");
  }
  function getClosestActiveElement() {
    var _a;
    return ((_a = self.calendarContainer) === null || _a === void 0 ? void 0 : _a.getRootNode()).activeElement || document.activeElement;
  }
  function bindToInstance(fn) {
    return fn.bind(self);
  }
  function setCalendarWidth() {
    var config = self.config;
    if (config.weekNumbers === false && config.showMonths === 1) {
      return;
    } else if (config.noCalendar !== true) {
      window.requestAnimationFrame(function () {
        if (self.calendarContainer !== undefined) {
          self.calendarContainer.style.visibility = "hidden";
          self.calendarContainer.style.display = "block";
        }
        if (self.daysContainer !== undefined) {
          var daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
          self.daysContainer.style.width = daysWidth + "px";
          self.calendarContainer.style.width = daysWidth + (self.weekWrapper !== undefined ? self.weekWrapper.offsetWidth : 0) + "px";
          self.calendarContainer.style.removeProperty("visibility");
          self.calendarContainer.style.removeProperty("display");
        }
      });
    }
  }
  function updateTime(e) {
    if (self.selectedDates.length === 0) {
      var defaultDate = self.config.minDate === undefined || (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(new Date(), self.config.minDate) >= 0 ? new Date() : new Date(self.config.minDate.getTime());
      var defaults = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config);
      defaultDate.setHours(defaults.hours, defaults.minutes, defaults.seconds, defaultDate.getMilliseconds());
      self.selectedDates = [defaultDate];
      self.latestSelectedDateObj = defaultDate;
    }
    if (e !== undefined && e.type !== "blur") {
      timeWrapper(e);
    }
    var prevValue = self._input.value;
    setHoursFromInputs();
    updateValue();
    if (self._input.value !== prevValue) {
      self._debouncedChange();
    }
  }
  function ampm2military(hour, amPM) {
    return hour % 12 + 12 * (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(amPM === self.l10n.amPM[1]);
  }
  function military2ampm(hour) {
    switch (hour % 24) {
      case 0:
      case 12:
        return 12;
      default:
        return hour % 12;
    }
  }
  function setHoursFromInputs() {
    if (self.hourElement === undefined || self.minuteElement === undefined) return;
    var hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24,
      minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60,
      seconds = self.secondElement !== undefined ? (parseInt(self.secondElement.value, 10) || 0) % 60 : 0;
    if (self.amPM !== undefined) {
      hours = ampm2military(hours, self.amPM.textContent);
    }
    var limitMinHours = self.config.minTime !== undefined || self.config.minDate && self.minDateHasTime && self.latestSelectedDateObj && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(self.latestSelectedDateObj, self.config.minDate, true) === 0;
    var limitMaxHours = self.config.maxTime !== undefined || self.config.maxDate && self.maxDateHasTime && self.latestSelectedDateObj && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(self.latestSelectedDateObj, self.config.maxDate, true) === 0;
    if (self.config.maxTime !== undefined && self.config.minTime !== undefined && self.config.minTime > self.config.maxTime) {
      var minBound = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(self.config.minTime.getHours(), self.config.minTime.getMinutes(), self.config.minTime.getSeconds());
      var maxBound = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(self.config.maxTime.getHours(), self.config.maxTime.getMinutes(), self.config.maxTime.getSeconds());
      var currentTime = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(hours, minutes, seconds);
      if (currentTime > maxBound && currentTime < minBound) {
        var result = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.parseSeconds)(minBound);
        hours = result[0];
        minutes = result[1];
        seconds = result[2];
      }
    } else {
      if (limitMaxHours) {
        var maxTime = self.config.maxTime !== undefined ? self.config.maxTime : self.config.maxDate;
        hours = Math.min(hours, maxTime.getHours());
        if (hours === maxTime.getHours()) minutes = Math.min(minutes, maxTime.getMinutes());
        if (minutes === maxTime.getMinutes()) seconds = Math.min(seconds, maxTime.getSeconds());
      }
      if (limitMinHours) {
        var minTime = self.config.minTime !== undefined ? self.config.minTime : self.config.minDate;
        hours = Math.max(hours, minTime.getHours());
        if (hours === minTime.getHours() && minutes < minTime.getMinutes()) minutes = minTime.getMinutes();
        if (minutes === minTime.getMinutes()) seconds = Math.max(seconds, minTime.getSeconds());
      }
    }
    setHours(hours, minutes, seconds);
  }
  function setHoursFromDate(dateObj) {
    var date = dateObj || self.latestSelectedDateObj;
    if (date && date instanceof Date) {
      setHours(date.getHours(), date.getMinutes(), date.getSeconds());
    }
  }
  function setHours(hours, minutes, seconds) {
    if (self.latestSelectedDateObj !== undefined) {
      self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
    }
    if (!self.hourElement || !self.minuteElement || self.isMobile) return;
    self.hourElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(!self.config.time_24hr ? (12 + hours) % 12 + 12 * (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(hours % 12 === 0) : hours);
    self.minuteElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(minutes);
    if (self.amPM !== undefined) self.amPM.textContent = self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(hours >= 12)];
    if (self.secondElement !== undefined) self.secondElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(seconds);
  }
  function onYearInput(event) {
    var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(event);
    var year = parseInt(eventTarget.value) + (event.delta || 0);
    if (year / 1000 > 1 || event.key === "Enter" && !/[^\d]/.test(year.toString())) {
      changeYear(year);
    }
  }
  function bind(element, event, handler, options) {
    if (event instanceof Array) return event.forEach(function (ev) {
      return bind(element, ev, handler, options);
    });
    if (element instanceof Array) return element.forEach(function (el) {
      return bind(el, event, handler, options);
    });
    element.addEventListener(event, handler, options);
    self._handlers.push({
      remove: function () {
        return element.removeEventListener(event, handler, options);
      }
    });
  }
  function triggerChange() {
    triggerEvent("onChange");
  }
  function bindEvents() {
    if (self.config.wrap) {
      ["open", "close", "toggle", "clear"].forEach(function (evt) {
        Array.prototype.forEach.call(self.element.querySelectorAll("[data-" + evt + "]"), function (el) {
          return bind(el, "click", self[evt]);
        });
      });
    }
    if (self.isMobile) {
      setupMobile();
      return;
    }
    var debouncedResize = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.debounce)(onResize, 50);
    self._debouncedChange = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.debounce)(triggerChange, DEBOUNCED_CHANGE_MS);
    if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent)) bind(self.daysContainer, "mouseover", function (e) {
      if (self.config.mode === "range") onMouseOver((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e));
    });
    bind(self._input, "keydown", onKeyDown);
    if (self.calendarContainer !== undefined) {
      bind(self.calendarContainer, "keydown", onKeyDown);
    }
    if (!self.config.inline && !self.config.static) bind(window, "resize", debouncedResize);
    if (window.ontouchstart !== undefined) bind(window.document, "touchstart", documentClick);else bind(window.document, "mousedown", documentClick);
    bind(window.document, "focus", documentClick, {
      capture: true
    });
    if (self.config.clickOpens === true) {
      bind(self._input, "focus", self.open);
      bind(self._input, "click", self.open);
    }
    if (self.daysContainer !== undefined) {
      bind(self.monthNav, "click", onMonthNavClick);
      bind(self.monthNav, ["keyup", "increment"], onYearInput);
      bind(self.daysContainer, "click", selectDate);
    }
    if (self.timeContainer !== undefined && self.minuteElement !== undefined && self.hourElement !== undefined) {
      var selText = function (e) {
        return (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e).select();
      };
      bind(self.timeContainer, ["increment"], updateTime);
      bind(self.timeContainer, "blur", updateTime, {
        capture: true
      });
      bind(self.timeContainer, "click", timeIncrement);
      bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
      if (self.secondElement !== undefined) bind(self.secondElement, "focus", function () {
        return self.secondElement && self.secondElement.select();
      });
      if (self.amPM !== undefined) {
        bind(self.amPM, "click", function (e) {
          updateTime(e);
        });
      }
    }
    if (self.config.allowInput) {
      bind(self._input, "blur", onBlur);
    }
  }
  function jumpToDate(jumpDate, triggerChange) {
    var jumpTo = jumpDate !== undefined ? self.parseDate(jumpDate) : self.latestSelectedDateObj || (self.config.minDate && self.config.minDate > self.now ? self.config.minDate : self.config.maxDate && self.config.maxDate < self.now ? self.config.maxDate : self.now);
    var oldYear = self.currentYear;
    var oldMonth = self.currentMonth;
    try {
      if (jumpTo !== undefined) {
        self.currentYear = jumpTo.getFullYear();
        self.currentMonth = jumpTo.getMonth();
      }
    } catch (e) {
      e.message = "Invalid date supplied: " + jumpTo;
      self.config.errorHandler(e);
    }
    if (triggerChange && self.currentYear !== oldYear) {
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
    if (triggerChange && (self.currentYear !== oldYear || self.currentMonth !== oldMonth)) {
      triggerEvent("onMonthChange");
    }
    self.redraw();
  }
  function timeIncrement(e) {
    var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
    if (~eventTarget.className.indexOf("arrow")) incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
  }
  function incrementNumInput(e, delta, inputElem) {
    var target = e && (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
    var input = inputElem || target && target.parentNode && target.parentNode.firstChild;
    var event = createEvent("increment");
    event.delta = delta;
    input && input.dispatchEvent(event);
  }
  function build() {
    var fragment = window.document.createDocumentFragment();
    self.calendarContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-calendar");
    self.calendarContainer.tabIndex = -1;
    if (!self.config.noCalendar) {
      fragment.appendChild(buildMonthNav());
      self.innerContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-innerContainer");
      if (self.config.weekNumbers) {
        var _a = buildWeeks(),
          weekWrapper = _a.weekWrapper,
          weekNumbers = _a.weekNumbers;
        self.innerContainer.appendChild(weekWrapper);
        self.weekNumbers = weekNumbers;
        self.weekWrapper = weekWrapper;
      }
      self.rContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-rContainer");
      self.rContainer.appendChild(buildWeekdays());
      if (!self.daysContainer) {
        self.daysContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-days");
        self.daysContainer.tabIndex = -1;
      }
      buildDays();
      self.rContainer.appendChild(self.daysContainer);
      self.innerContainer.appendChild(self.rContainer);
      fragment.appendChild(self.innerContainer);
    }
    if (self.config.enableTime) {
      fragment.appendChild(buildTime());
    }
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rangeMode", self.config.mode === "range");
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "animate", self.config.animate === true);
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
    self.calendarContainer.appendChild(fragment);
    var customAppend = self.config.appendTo !== undefined && self.config.appendTo.nodeType !== undefined;
    if (self.config.inline || self.config.static) {
      self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
      if (self.config.inline) {
        if (!customAppend && self.element.parentNode) self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);else if (self.config.appendTo !== undefined) self.config.appendTo.appendChild(self.calendarContainer);
      }
      if (self.config.static) {
        var wrapper = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-wrapper");
        if (self.element.parentNode) self.element.parentNode.insertBefore(wrapper, self.element);
        wrapper.appendChild(self.element);
        if (self.altInput) wrapper.appendChild(self.altInput);
        wrapper.appendChild(self.calendarContainer);
      }
    }
    if (!self.config.static && !self.config.inline) (self.config.appendTo !== undefined ? self.config.appendTo : window.document.body).appendChild(self.calendarContainer);
  }
  function createDay(className, date, _dayNumber, i) {
    var dateIsEnabled = isEnabled(date, true),
      dayElement = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", className, date.getDate().toString());
    dayElement.dateObj = date;
    dayElement.$i = i;
    dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
    if (className.indexOf("hidden") === -1 && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.now) === 0) {
      self.todayDateElem = dayElement;
      dayElement.classList.add("today");
      dayElement.setAttribute("aria-current", "date");
    }
    if (dateIsEnabled) {
      dayElement.tabIndex = -1;
      if (isDateSelected(date)) {
        dayElement.classList.add("selected");
        self.selectedDateElem = dayElement;
        if (self.config.mode === "range") {
          (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(dayElement, "startRange", self.selectedDates[0] && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[0], true) === 0);
          (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(dayElement, "endRange", self.selectedDates[1] && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[1], true) === 0);
          if (className === "nextMonthDay") dayElement.classList.add("inRange");
        }
      }
    } else {
      dayElement.classList.add("flatpickr-disabled");
    }
    if (self.config.mode === "range") {
      if (isDateInRange(date) && !isDateSelected(date)) dayElement.classList.add("inRange");
    }
    if (self.weekNumbers && self.config.showMonths === 1 && className !== "prevMonthDay" && i % 7 === 6) {
      self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
    }
    triggerEvent("onDayCreate", dayElement);
    return dayElement;
  }
  function focusOnDayElem(targetNode) {
    targetNode.focus();
    if (self.config.mode === "range") onMouseOver(targetNode);
  }
  function getFirstAvailableDay(delta) {
    var startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
    var endMonth = delta > 0 ? self.config.showMonths : -1;
    for (var m = startMonth; m != endMonth; m += delta) {
      var month = self.daysContainer.children[m];
      var startIndex = delta > 0 ? 0 : month.children.length - 1;
      var endIndex = delta > 0 ? month.children.length : -1;
      for (var i = startIndex; i != endIndex; i += delta) {
        var c = month.children[i];
        if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj)) return c;
      }
    }
    return undefined;
  }
  function getNextAvailableDay(current, delta) {
    var givenMonth = current.className.indexOf("Month") === -1 ? current.dateObj.getMonth() : self.currentMonth;
    var endMonth = delta > 0 ? self.config.showMonths : -1;
    var loopDelta = delta > 0 ? 1 : -1;
    for (var m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
      var month = self.daysContainer.children[m];
      var startIndex = givenMonth - self.currentMonth === m ? current.$i + delta : delta < 0 ? month.children.length - 1 : 0;
      var numMonthDays = month.children.length;
      for (var i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
        var c = month.children[i];
        if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj) && Math.abs(current.$i - i) >= Math.abs(delta)) return focusOnDayElem(c);
      }
    }
    self.changeMonth(loopDelta);
    focusOnDay(getFirstAvailableDay(loopDelta), 0);
    return undefined;
  }
  function focusOnDay(current, offset) {
    var activeElement = getClosestActiveElement();
    var dayFocused = isInView(activeElement || document.body);
    var startElem = current !== undefined ? current : dayFocused ? activeElement : self.selectedDateElem !== undefined && isInView(self.selectedDateElem) ? self.selectedDateElem : self.todayDateElem !== undefined && isInView(self.todayDateElem) ? self.todayDateElem : getFirstAvailableDay(offset > 0 ? 1 : -1);
    if (startElem === undefined) {
      self._input.focus();
    } else if (!dayFocused) {
      focusOnDayElem(startElem);
    } else {
      getNextAvailableDay(startElem, offset);
    }
  }
  function buildMonthDays(year, month) {
    var firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
    var prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12, year);
    var daysInMonth = self.utils.getDaysInMonth(month, year),
      days = window.document.createDocumentFragment(),
      isMultiMonth = self.config.showMonths > 1,
      prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay",
      nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
    var dayNumber = prevMonthDays + 1 - firstOfMonth,
      dayIndex = 0;
    for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
      days.appendChild(createDay("flatpickr-day " + prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
    }
    for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
      days.appendChild(createDay("flatpickr-day", new Date(year, month, dayNumber), dayNumber, dayIndex));
    }
    for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth && (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
      days.appendChild(createDay("flatpickr-day " + nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
    }
    var dayContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "dayContainer");
    dayContainer.appendChild(days);
    return dayContainer;
  }
  function buildDays() {
    if (self.daysContainer === undefined) {
      return;
    }
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.daysContainer);
    if (self.weekNumbers) (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.weekNumbers);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < self.config.showMonths; i++) {
      var d = new Date(self.currentYear, self.currentMonth, 1);
      d.setMonth(self.currentMonth + i);
      frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
    }
    self.daysContainer.appendChild(frag);
    self.days = self.daysContainer.firstChild;
    if (self.config.mode === "range" && self.selectedDates.length === 1) {
      onMouseOver();
    }
  }
  function buildMonthSwitch() {
    if (self.config.showMonths > 1 || self.config.monthSelectorType !== "dropdown") return;
    var shouldBuildMonth = function (month) {
      if (self.config.minDate !== undefined && self.currentYear === self.config.minDate.getFullYear() && month < self.config.minDate.getMonth()) {
        return false;
      }
      return !(self.config.maxDate !== undefined && self.currentYear === self.config.maxDate.getFullYear() && month > self.config.maxDate.getMonth());
    };
    self.monthsDropdownContainer.tabIndex = -1;
    self.monthsDropdownContainer.innerHTML = "";
    for (var i = 0; i < 12; i++) {
      if (!shouldBuildMonth(i)) continue;
      var month = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("option", "flatpickr-monthDropdown-month");
      month.value = new Date(self.currentYear, i).getMonth().toString();
      month.textContent = (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_5__.monthToStr)(i, self.config.shorthandCurrentMonth, self.l10n);
      month.tabIndex = -1;
      if (self.currentMonth === i) {
        month.selected = true;
      }
      self.monthsDropdownContainer.appendChild(month);
    }
  }
  function buildMonth() {
    var container = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-month");
    var monthNavFragment = window.document.createDocumentFragment();
    var monthElement;
    if (self.config.showMonths > 1 || self.config.monthSelectorType === "static") {
      monthElement = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "cur-month");
    } else {
      self.monthsDropdownContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("select", "flatpickr-monthDropdown-months");
      self.monthsDropdownContainer.setAttribute("aria-label", self.l10n.monthAriaLabel);
      bind(self.monthsDropdownContainer, "change", function (e) {
        var target = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        var selectedMonth = parseInt(target.value, 10);
        self.changeMonth(selectedMonth - self.currentMonth);
        triggerEvent("onMonthChange");
      });
      buildMonthSwitch();
      monthElement = self.monthsDropdownContainer;
    }
    var yearInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("cur-year", {
      tabindex: "-1"
    });
    var yearElement = yearInput.getElementsByTagName("input")[0];
    yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
    if (self.config.minDate) {
      yearElement.setAttribute("min", self.config.minDate.getFullYear().toString());
    }
    if (self.config.maxDate) {
      yearElement.setAttribute("max", self.config.maxDate.getFullYear().toString());
      yearElement.disabled = !!self.config.minDate && self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
    }
    var currentMonth = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-current-month");
    currentMonth.appendChild(monthElement);
    currentMonth.appendChild(yearInput);
    monthNavFragment.appendChild(currentMonth);
    container.appendChild(monthNavFragment);
    return {
      container: container,
      yearElement: yearElement,
      monthElement: monthElement
    };
  }
  function buildMonths() {
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.monthNav);
    self.monthNav.appendChild(self.prevMonthNav);
    if (self.config.showMonths) {
      self.yearElements = [];
      self.monthElements = [];
    }
    for (var m = self.config.showMonths; m--;) {
      var month = buildMonth();
      self.yearElements.push(month.yearElement);
      self.monthElements.push(month.monthElement);
      self.monthNav.appendChild(month.container);
    }
    self.monthNav.appendChild(self.nextMonthNav);
  }
  function buildMonthNav() {
    self.monthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-months");
    self.yearElements = [];
    self.monthElements = [];
    self.prevMonthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-prev-month");
    self.prevMonthNav.innerHTML = self.config.prevArrow;
    self.nextMonthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-next-month");
    self.nextMonthNav.innerHTML = self.config.nextArrow;
    buildMonths();
    Object.defineProperty(self, "_hidePrevMonthArrow", {
      get: function () {
        return self.__hidePrevMonthArrow;
      },
      set: function (bool) {
        if (self.__hidePrevMonthArrow !== bool) {
          (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.prevMonthNav, "flatpickr-disabled", bool);
          self.__hidePrevMonthArrow = bool;
        }
      }
    });
    Object.defineProperty(self, "_hideNextMonthArrow", {
      get: function () {
        return self.__hideNextMonthArrow;
      },
      set: function (bool) {
        if (self.__hideNextMonthArrow !== bool) {
          (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.nextMonthNav, "flatpickr-disabled", bool);
          self.__hideNextMonthArrow = bool;
        }
      }
    });
    self.currentYearElement = self.yearElements[0];
    updateNavigationCurrentMonth();
    return self.monthNav;
  }
  function buildTime() {
    self.calendarContainer.classList.add("hasTime");
    if (self.config.noCalendar) self.calendarContainer.classList.add("noCalendar");
    var defaults = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config);
    self.timeContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-time");
    self.timeContainer.tabIndex = -1;
    var separator = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-time-separator", ":");
    var hourInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-hour", {
      "aria-label": self.l10n.hourAriaLabel
    });
    self.hourElement = hourInput.getElementsByTagName("input")[0];
    var minuteInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-minute", {
      "aria-label": self.l10n.minuteAriaLabel
    });
    self.minuteElement = minuteInput.getElementsByTagName("input")[0];
    self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
    self.hourElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj ? self.latestSelectedDateObj.getHours() : self.config.time_24hr ? defaults.hours : military2ampm(defaults.hours));
    self.minuteElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj ? self.latestSelectedDateObj.getMinutes() : defaults.minutes);
    self.hourElement.setAttribute("step", self.config.hourIncrement.toString());
    self.minuteElement.setAttribute("step", self.config.minuteIncrement.toString());
    self.hourElement.setAttribute("min", self.config.time_24hr ? "0" : "1");
    self.hourElement.setAttribute("max", self.config.time_24hr ? "23" : "12");
    self.hourElement.setAttribute("maxlength", "2");
    self.minuteElement.setAttribute("min", "0");
    self.minuteElement.setAttribute("max", "59");
    self.minuteElement.setAttribute("maxlength", "2");
    self.timeContainer.appendChild(hourInput);
    self.timeContainer.appendChild(separator);
    self.timeContainer.appendChild(minuteInput);
    if (self.config.time_24hr) self.timeContainer.classList.add("time24hr");
    if (self.config.enableSeconds) {
      self.timeContainer.classList.add("hasSeconds");
      var secondInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-second");
      self.secondElement = secondInput.getElementsByTagName("input")[0];
      self.secondElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj ? self.latestSelectedDateObj.getSeconds() : defaults.seconds);
      self.secondElement.setAttribute("step", self.minuteElement.getAttribute("step"));
      self.secondElement.setAttribute("min", "0");
      self.secondElement.setAttribute("max", "59");
      self.secondElement.setAttribute("maxlength", "2");
      self.timeContainer.appendChild((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-time-separator", ":"));
      self.timeContainer.appendChild(secondInput);
    }
    if (!self.config.time_24hr) {
      self.amPM = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-am-pm", self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)((self.latestSelectedDateObj ? self.hourElement.value : self.config.defaultHour) > 11)]);
      self.amPM.title = self.l10n.toggleTitle;
      self.amPM.tabIndex = -1;
      self.timeContainer.appendChild(self.amPM);
    }
    return self.timeContainer;
  }
  function buildWeekdays() {
    if (!self.weekdayContainer) self.weekdayContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekdays");else (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.weekdayContainer);
    for (var i = self.config.showMonths; i--;) {
      var container = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekdaycontainer");
      self.weekdayContainer.appendChild(container);
    }
    updateWeekdays();
    return self.weekdayContainer;
  }
  function updateWeekdays() {
    if (!self.weekdayContainer) {
      return;
    }
    var firstDayOfWeek = self.l10n.firstDayOfWeek;
    var weekdays = __spreadArrays(self.l10n.weekdays.shorthand);
    if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
      weekdays = __spreadArrays(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
    }
    for (var i = self.config.showMonths; i--;) {
      self.weekdayContainer.children[i].innerHTML = "\n      <span class='flatpickr-weekday'>\n        " + weekdays.join("</span><span class='flatpickr-weekday'>") + "\n      </span>\n      ";
    }
  }
  function buildWeeks() {
    self.calendarContainer.classList.add("hasWeeks");
    var weekWrapper = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekwrapper");
    weekWrapper.appendChild((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
    var weekNumbers = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weeks");
    weekWrapper.appendChild(weekNumbers);
    return {
      weekWrapper: weekWrapper,
      weekNumbers: weekNumbers
    };
  }
  function changeMonth(value, isOffset) {
    if (isOffset === void 0) {
      isOffset = true;
    }
    var delta = isOffset ? value : value - self.currentMonth;
    if (delta < 0 && self._hidePrevMonthArrow === true || delta > 0 && self._hideNextMonthArrow === true) return;
    self.currentMonth += delta;
    if (self.currentMonth < 0 || self.currentMonth > 11) {
      self.currentYear += self.currentMonth > 11 ? 1 : -1;
      self.currentMonth = (self.currentMonth + 12) % 12;
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
    buildDays();
    triggerEvent("onMonthChange");
    updateNavigationCurrentMonth();
  }
  function clear(triggerChangeEvent, toInitial) {
    if (triggerChangeEvent === void 0) {
      triggerChangeEvent = true;
    }
    if (toInitial === void 0) {
      toInitial = true;
    }
    self.input.value = "";
    if (self.altInput !== undefined) self.altInput.value = "";
    if (self.mobileInput !== undefined) self.mobileInput.value = "";
    self.selectedDates = [];
    self.latestSelectedDateObj = undefined;
    if (toInitial === true) {
      self.currentYear = self._initialDate.getFullYear();
      self.currentMonth = self._initialDate.getMonth();
    }
    if (self.config.enableTime === true) {
      var _a = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config),
        hours = _a.hours,
        minutes = _a.minutes,
        seconds = _a.seconds;
      setHours(hours, minutes, seconds);
    }
    self.redraw();
    if (triggerChangeEvent) triggerEvent("onChange");
  }
  function close() {
    self.isOpen = false;
    if (!self.isMobile) {
      if (self.calendarContainer !== undefined) {
        self.calendarContainer.classList.remove("open");
      }
      if (self._input !== undefined) {
        self._input.classList.remove("active");
      }
    }
    triggerEvent("onClose");
  }
  function destroy() {
    if (self.config !== undefined) triggerEvent("onDestroy");
    for (var i = self._handlers.length; i--;) {
      self._handlers[i].remove();
    }
    self._handlers = [];
    if (self.mobileInput) {
      if (self.mobileInput.parentNode) self.mobileInput.parentNode.removeChild(self.mobileInput);
      self.mobileInput = undefined;
    } else if (self.calendarContainer && self.calendarContainer.parentNode) {
      if (self.config.static && self.calendarContainer.parentNode) {
        var wrapper = self.calendarContainer.parentNode;
        wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
        if (wrapper.parentNode) {
          while (wrapper.firstChild) wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
          wrapper.parentNode.removeChild(wrapper);
        }
      } else self.calendarContainer.parentNode.removeChild(self.calendarContainer);
    }
    if (self.altInput) {
      self.input.type = "text";
      if (self.altInput.parentNode) self.altInput.parentNode.removeChild(self.altInput);
      delete self.altInput;
    }
    if (self.input) {
      self.input.type = self.input._type;
      self.input.classList.remove("flatpickr-input");
      self.input.removeAttribute("readonly");
    }
    ["_showTimeInput", "latestSelectedDateObj", "_hideNextMonthArrow", "_hidePrevMonthArrow", "__hideNextMonthArrow", "__hidePrevMonthArrow", "isMobile", "isOpen", "selectedDateElem", "minDateHasTime", "maxDateHasTime", "days", "daysContainer", "_input", "_positionElement", "innerContainer", "rContainer", "monthNav", "todayDateElem", "calendarContainer", "weekdayContainer", "prevMonthNav", "nextMonthNav", "monthsDropdownContainer", "currentMonthElement", "currentYearElement", "navigationCurrentMonth", "selectedDateElem", "config"].forEach(function (k) {
      try {
        delete self[k];
      } catch (_) {}
    });
  }
  function isCalendarElem(elem) {
    return self.calendarContainer.contains(elem);
  }
  function documentClick(e) {
    if (self.isOpen && !self.config.inline) {
      var eventTarget_1 = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
      var isCalendarElement = isCalendarElem(eventTarget_1);
      var isInput = eventTarget_1 === self.input || eventTarget_1 === self.altInput || self.element.contains(eventTarget_1) || e.path && e.path.indexOf && (~e.path.indexOf(self.input) || ~e.path.indexOf(self.altInput));
      var lostFocus = !isInput && !isCalendarElement && !isCalendarElem(e.relatedTarget);
      var isIgnored = !self.config.ignoredFocusElements.some(function (elem) {
        return elem.contains(eventTarget_1);
      });
      if (lostFocus && isIgnored) {
        if (self.config.allowInput) {
          self.setDate(self._input.value, false, self.config.altInput ? self.config.altFormat : self.config.dateFormat);
        }
        if (self.timeContainer !== undefined && self.minuteElement !== undefined && self.hourElement !== undefined && self.input.value !== "" && self.input.value !== undefined) {
          updateTime();
        }
        self.close();
        if (self.config && self.config.mode === "range" && self.selectedDates.length === 1) self.clear(false);
      }
    }
  }
  function changeYear(newYear) {
    if (!newYear || self.config.minDate && newYear < self.config.minDate.getFullYear() || self.config.maxDate && newYear > self.config.maxDate.getFullYear()) return;
    var newYearNum = newYear,
      isNewYear = self.currentYear !== newYearNum;
    self.currentYear = newYearNum || self.currentYear;
    if (self.config.maxDate && self.currentYear === self.config.maxDate.getFullYear()) {
      self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
    } else if (self.config.minDate && self.currentYear === self.config.minDate.getFullYear()) {
      self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
    }
    if (isNewYear) {
      self.redraw();
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
  }
  function isEnabled(date, timeless) {
    var _a;
    if (timeless === void 0) {
      timeless = true;
    }
    var dateToCheck = self.parseDate(date, undefined, timeless);
    if (self.config.minDate && dateToCheck && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0 || self.config.maxDate && dateToCheck && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0) return false;
    if (!self.config.enable && self.config.disable.length === 0) return true;
    if (dateToCheck === undefined) return false;
    var bool = !!self.config.enable,
      array = (_a = self.config.enable) !== null && _a !== void 0 ? _a : self.config.disable;
    for (var i = 0, d = void 0; i < array.length; i++) {
      d = array[i];
      if (typeof d === "function" && d(dateToCheck)) return bool;else if (d instanceof Date && dateToCheck !== undefined && d.getTime() === dateToCheck.getTime()) return bool;else if (typeof d === "string") {
        var parsed = self.parseDate(d, undefined, true);
        return parsed && parsed.getTime() === dateToCheck.getTime() ? bool : !bool;
      } else if (typeof d === "object" && dateToCheck !== undefined && d.from && d.to && dateToCheck.getTime() >= d.from.getTime() && dateToCheck.getTime() <= d.to.getTime()) return bool;
    }
    return !bool;
  }
  function isInView(elem) {
    if (self.daysContainer !== undefined) return elem.className.indexOf("hidden") === -1 && elem.className.indexOf("flatpickr-disabled") === -1 && self.daysContainer.contains(elem);
    return false;
  }
  function onBlur(e) {
    var isInput = e.target === self._input;
    var valueChanged = self._input.value.trimEnd() !== getDateStr();
    if (isInput && valueChanged && !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
      self.setDate(self._input.value, true, e.target === self.altInput ? self.config.altFormat : self.config.dateFormat);
    }
  }
  function onKeyDown(e) {
    var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
    var isInput = self.config.wrap ? element.contains(eventTarget) : eventTarget === self._input;
    var allowInput = self.config.allowInput;
    var allowKeydown = self.isOpen && (!allowInput || !isInput);
    var allowInlineKeydown = self.config.inline && isInput && !allowInput;
    if (e.keyCode === 13 && isInput) {
      if (allowInput) {
        self.setDate(self._input.value, true, eventTarget === self.altInput ? self.config.altFormat : self.config.dateFormat);
        self.close();
        return eventTarget.blur();
      } else {
        self.open();
      }
    } else if (isCalendarElem(eventTarget) || allowKeydown || allowInlineKeydown) {
      var isTimeObj = !!self.timeContainer && self.timeContainer.contains(eventTarget);
      switch (e.keyCode) {
        case 13:
          if (isTimeObj) {
            e.preventDefault();
            updateTime();
            focusAndClose();
          } else selectDate(e);
          break;
        case 27:
          e.preventDefault();
          focusAndClose();
          break;
        case 8:
        case 46:
          if (isInput && !self.config.allowInput) {
            e.preventDefault();
            self.clear();
          }
          break;
        case 37:
        case 39:
          if (!isTimeObj && !isInput) {
            e.preventDefault();
            var activeElement = getClosestActiveElement();
            if (self.daysContainer !== undefined && (allowInput === false || activeElement && isInView(activeElement))) {
              var delta_1 = e.keyCode === 39 ? 1 : -1;
              if (!e.ctrlKey) focusOnDay(undefined, delta_1);else {
                e.stopPropagation();
                changeMonth(delta_1);
                focusOnDay(getFirstAvailableDay(1), 0);
              }
            }
          } else if (self.hourElement) self.hourElement.focus();
          break;
        case 38:
        case 40:
          e.preventDefault();
          var delta = e.keyCode === 40 ? 1 : -1;
          if (self.daysContainer && eventTarget.$i !== undefined || eventTarget === self.input || eventTarget === self.altInput) {
            if (e.ctrlKey) {
              e.stopPropagation();
              changeYear(self.currentYear - delta);
              focusOnDay(getFirstAvailableDay(1), 0);
            } else if (!isTimeObj) focusOnDay(undefined, delta * 7);
          } else if (eventTarget === self.currentYearElement) {
            changeYear(self.currentYear - delta);
          } else if (self.config.enableTime) {
            if (!isTimeObj && self.hourElement) self.hourElement.focus();
            updateTime(e);
            self._debouncedChange();
          }
          break;
        case 9:
          if (isTimeObj) {
            var elems = [self.hourElement, self.minuteElement, self.secondElement, self.amPM].concat(self.pluginElements).filter(function (x) {
              return x;
            });
            var i = elems.indexOf(eventTarget);
            if (i !== -1) {
              var target = elems[i + (e.shiftKey ? -1 : 1)];
              e.preventDefault();
              (target || self._input).focus();
            }
          } else if (!self.config.noCalendar && self.daysContainer && self.daysContainer.contains(eventTarget) && e.shiftKey) {
            e.preventDefault();
            self._input.focus();
          }
          break;
        default:
          break;
      }
    }
    if (self.amPM !== undefined && eventTarget === self.amPM) {
      switch (e.key) {
        case self.l10n.amPM[0].charAt(0):
        case self.l10n.amPM[0].charAt(0).toLowerCase():
          self.amPM.textContent = self.l10n.amPM[0];
          setHoursFromInputs();
          updateValue();
          break;
        case self.l10n.amPM[1].charAt(0):
        case self.l10n.amPM[1].charAt(0).toLowerCase():
          self.amPM.textContent = self.l10n.amPM[1];
          setHoursFromInputs();
          updateValue();
          break;
      }
    }
    if (isInput || isCalendarElem(eventTarget)) {
      triggerEvent("onKeyDown", e);
    }
  }
  function onMouseOver(elem, cellClass) {
    if (cellClass === void 0) {
      cellClass = "flatpickr-day";
    }
    if (self.selectedDates.length !== 1 || elem && (!elem.classList.contains(cellClass) || elem.classList.contains("flatpickr-disabled"))) return;
    var hoverDate = elem ? elem.dateObj.getTime() : self.days.firstElementChild.dateObj.getTime(),
      initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(),
      rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()),
      rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime());
    var containsDisabled = false;
    var minRange = 0,
      maxRange = 0;
    for (var t = rangeStartDate; t < rangeEndDate; t += _utils_dates__WEBPACK_IMPORTED_MODULE_4__.duration.DAY) {
      if (!isEnabled(new Date(t), true)) {
        containsDisabled = containsDisabled || t > rangeStartDate && t < rangeEndDate;
        if (t < initialDate && (!minRange || t > minRange)) minRange = t;else if (t > initialDate && (!maxRange || t < maxRange)) maxRange = t;
      }
    }
    var hoverableCells = Array.from(self.rContainer.querySelectorAll("*:nth-child(-n+" + self.config.showMonths + ") > ." + cellClass));
    hoverableCells.forEach(function (dayElem) {
      var date = dayElem.dateObj;
      var timestamp = date.getTime();
      var outOfRange = minRange > 0 && timestamp < minRange || maxRange > 0 && timestamp > maxRange;
      if (outOfRange) {
        dayElem.classList.add("notAllowed");
        ["inRange", "startRange", "endRange"].forEach(function (c) {
          dayElem.classList.remove(c);
        });
        return;
      } else if (containsDisabled && !outOfRange) return;
      ["startRange", "inRange", "endRange", "notAllowed"].forEach(function (c) {
        dayElem.classList.remove(c);
      });
      if (elem !== undefined) {
        elem.classList.add(hoverDate <= self.selectedDates[0].getTime() ? "startRange" : "endRange");
        if (initialDate < hoverDate && timestamp === initialDate) dayElem.classList.add("startRange");else if (initialDate > hoverDate && timestamp === initialDate) dayElem.classList.add("endRange");
        if (timestamp >= minRange && (maxRange === 0 || timestamp <= maxRange) && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.isBetween)(timestamp, initialDate, hoverDate)) dayElem.classList.add("inRange");
      }
    });
  }
  function onResize() {
    if (self.isOpen && !self.config.static && !self.config.inline) positionCalendar();
  }
  function open(e, positionElement) {
    if (positionElement === void 0) {
      positionElement = self._positionElement;
    }
    if (self.isMobile === true) {
      if (e) {
        e.preventDefault();
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        if (eventTarget) {
          eventTarget.blur();
        }
      }
      if (self.mobileInput !== undefined) {
        self.mobileInput.focus();
        self.mobileInput.click();
      }
      triggerEvent("onOpen");
      return;
    } else if (self._input.disabled || self.config.inline) {
      return;
    }
    var wasOpen = self.isOpen;
    self.isOpen = true;
    if (!wasOpen) {
      self.calendarContainer.classList.add("open");
      self._input.classList.add("active");
      triggerEvent("onOpen");
      positionCalendar(positionElement);
    }
    if (self.config.enableTime === true && self.config.noCalendar === true) {
      if (self.config.allowInput === false && (e === undefined || !self.timeContainer.contains(e.relatedTarget))) {
        setTimeout(function () {
          return self.hourElement.select();
        }, 50);
      }
    }
  }
  function minMaxDateSetter(type) {
    return function (date) {
      var dateObj = self.config["_" + type + "Date"] = self.parseDate(date, self.config.dateFormat);
      var inverseDateObj = self.config["_" + (type === "min" ? "max" : "min") + "Date"];
      if (dateObj !== undefined) {
        self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] = dateObj.getHours() > 0 || dateObj.getMinutes() > 0 || dateObj.getSeconds() > 0;
      }
      if (self.selectedDates) {
        self.selectedDates = self.selectedDates.filter(function (d) {
          return isEnabled(d);
        });
        if (!self.selectedDates.length && type === "min") setHoursFromDate(dateObj);
        updateValue();
      }
      if (self.daysContainer) {
        redraw();
        if (dateObj !== undefined) self.currentYearElement[type] = dateObj.getFullYear().toString();else self.currentYearElement.removeAttribute(type);
        self.currentYearElement.disabled = !!inverseDateObj && dateObj !== undefined && inverseDateObj.getFullYear() === dateObj.getFullYear();
      }
    };
  }
  function parseConfig() {
    var boolOpts = ["wrap", "weekNumbers", "allowInput", "allowInvalidPreload", "clickOpens", "time_24hr", "enableTime", "noCalendar", "altInput", "shorthandCurrentMonth", "inline", "static", "enableSeconds", "disableMobile"];
    var userConfig = __assign(__assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
    var formats = {};
    self.config.parseDate = userConfig.parseDate;
    self.config.formatDate = userConfig.formatDate;
    Object.defineProperty(self.config, "enable", {
      get: function () {
        return self.config._enable;
      },
      set: function (dates) {
        self.config._enable = parseDateRules(dates);
      }
    });
    Object.defineProperty(self.config, "disable", {
      get: function () {
        return self.config._disable;
      },
      set: function (dates) {
        self.config._disable = parseDateRules(dates);
      }
    });
    var timeMode = userConfig.mode === "time";
    if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
      var defaultDateFormat = flatpickr.defaultConfig.dateFormat || _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults.dateFormat;
      formats.dateFormat = userConfig.noCalendar || timeMode ? "H:i" + (userConfig.enableSeconds ? ":S" : "") : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
    }
    if (userConfig.altInput && (userConfig.enableTime || timeMode) && !userConfig.altFormat) {
      var defaultAltFormat = flatpickr.defaultConfig.altFormat || _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults.altFormat;
      formats.altFormat = userConfig.noCalendar || timeMode ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K") : defaultAltFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
    }
    Object.defineProperty(self.config, "minDate", {
      get: function () {
        return self.config._minDate;
      },
      set: minMaxDateSetter("min")
    });
    Object.defineProperty(self.config, "maxDate", {
      get: function () {
        return self.config._maxDate;
      },
      set: minMaxDateSetter("max")
    });
    var minMaxTimeSetter = function (type) {
      return function (val) {
        self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i:S");
      };
    };
    Object.defineProperty(self.config, "minTime", {
      get: function () {
        return self.config._minTime;
      },
      set: minMaxTimeSetter("min")
    });
    Object.defineProperty(self.config, "maxTime", {
      get: function () {
        return self.config._maxTime;
      },
      set: minMaxTimeSetter("max")
    });
    if (userConfig.mode === "time") {
      self.config.noCalendar = true;
      self.config.enableTime = true;
    }
    Object.assign(self.config, formats, userConfig);
    for (var i = 0; i < boolOpts.length; i++) self.config[boolOpts[i]] = self.config[boolOpts[i]] === true || self.config[boolOpts[i]] === "true";
    _types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.filter(function (hook) {
      return self.config[hook] !== undefined;
    }).forEach(function (hook) {
      self.config[hook] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(self.config[hook] || []).map(bindToInstance);
    });
    self.isMobile = !self.config.disableMobile && !self.config.inline && self.config.mode === "single" && !self.config.disable.length && !self.config.enable && !self.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    for (var i = 0; i < self.config.plugins.length; i++) {
      var pluginConf = self.config.plugins[i](self) || {};
      for (var key in pluginConf) {
        if (_types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.indexOf(key) > -1) {
          self.config[key] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(pluginConf[key]).map(bindToInstance).concat(self.config[key]);
        } else if (typeof userConfig[key] === "undefined") self.config[key] = pluginConf[key];
      }
    }
    if (!userConfig.altInputClass) {
      self.config.altInputClass = getInputElem().className + " " + self.config.altInputClass;
    }
    triggerEvent("onParseConfig");
  }
  function getInputElem() {
    return self.config.wrap ? element.querySelector("[data-input]") : element;
  }
  function setupLocale() {
    if (typeof self.config.locale !== "object" && typeof flatpickr.l10ns[self.config.locale] === "undefined") self.config.errorHandler(new Error("flatpickr: invalid locale " + self.config.locale));
    self.l10n = __assign(__assign({}, flatpickr.l10ns.default), typeof self.config.locale === "object" ? self.config.locale : self.config.locale !== "default" ? flatpickr.l10ns[self.config.locale] : undefined);
    _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.D = "(" + self.l10n.weekdays.shorthand.join("|") + ")";
    _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.l = "(" + self.l10n.weekdays.longhand.join("|") + ")";
    _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.M = "(" + self.l10n.months.shorthand.join("|") + ")";
    _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.F = "(" + self.l10n.months.longhand.join("|") + ")";
    _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.K = "(" + self.l10n.amPM[0] + "|" + self.l10n.amPM[1] + "|" + self.l10n.amPM[0].toLowerCase() + "|" + self.l10n.amPM[1].toLowerCase() + ")";
    var userConfig = __assign(__assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
    if (userConfig.time_24hr === undefined && flatpickr.defaultConfig.time_24hr === undefined) {
      self.config.time_24hr = self.l10n.time_24hr;
    }
    self.formatDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateFormatter)(self);
    self.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({
      config: self.config,
      l10n: self.l10n
    });
  }
  function positionCalendar(customPositionElement) {
    if (typeof self.config.position === "function") {
      return void self.config.position(self, customPositionElement);
    }
    if (self.calendarContainer === undefined) return;
    triggerEvent("onPreCalendarPosition");
    var positionElement = customPositionElement || self._positionElement;
    var calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, function (acc, child) {
        return acc + child.offsetHeight;
      }, 0),
      calendarWidth = self.calendarContainer.offsetWidth,
      configPos = self.config.position.split(" "),
      configPosVertical = configPos[0],
      configPosHorizontal = configPos.length > 1 ? configPos[1] : null,
      inputBounds = positionElement.getBoundingClientRect(),
      distanceFromBottom = window.innerHeight - inputBounds.bottom,
      showOnTop = configPosVertical === "above" || configPosVertical !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;
    var top = window.pageYOffset + inputBounds.top + (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowTop", !showOnTop);
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowBottom", showOnTop);
    if (self.config.inline) return;
    var left = window.pageXOffset + inputBounds.left;
    var isCenter = false;
    var isRight = false;
    if (configPosHorizontal === "center") {
      left -= (calendarWidth - inputBounds.width) / 2;
      isCenter = true;
    } else if (configPosHorizontal === "right") {
      left -= calendarWidth - inputBounds.width;
      isRight = true;
    }
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowLeft", !isCenter && !isRight);
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowCenter", isCenter);
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowRight", isRight);
    var right = window.document.body.offsetWidth - (window.pageXOffset + inputBounds.right);
    var rightMost = left + calendarWidth > window.document.body.offsetWidth;
    var centerMost = right + calendarWidth > window.document.body.offsetWidth;
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rightMost", rightMost);
    if (self.config.static) return;
    self.calendarContainer.style.top = top + "px";
    if (!rightMost) {
      self.calendarContainer.style.left = left + "px";
      self.calendarContainer.style.right = "auto";
    } else if (!centerMost) {
      self.calendarContainer.style.left = "auto";
      self.calendarContainer.style.right = right + "px";
    } else {
      var doc = getDocumentStyleSheet();
      if (doc === undefined) return;
      var bodyWidth = window.document.body.offsetWidth;
      var centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
      var centerBefore = ".flatpickr-calendar.centerMost:before";
      var centerAfter = ".flatpickr-calendar.centerMost:after";
      var centerIndex = doc.cssRules.length;
      var centerStyle = "{left:" + inputBounds.left + "px;right:auto;}";
      (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rightMost", false);
      (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "centerMost", true);
      doc.insertRule(centerBefore + "," + centerAfter + centerStyle, centerIndex);
      self.calendarContainer.style.left = centerLeft + "px";
      self.calendarContainer.style.right = "auto";
    }
  }
  function getDocumentStyleSheet() {
    var editableSheet = null;
    for (var i = 0; i < document.styleSheets.length; i++) {
      var sheet = document.styleSheets[i];
      if (!sheet.cssRules) continue;
      try {
        sheet.cssRules;
      } catch (err) {
        continue;
      }
      editableSheet = sheet;
      break;
    }
    return editableSheet != null ? editableSheet : createStyleSheet();
  }
  function createStyleSheet() {
    var style = document.createElement("style");
    document.head.appendChild(style);
    return style.sheet;
  }
  function redraw() {
    if (self.config.noCalendar || self.isMobile) return;
    buildMonthSwitch();
    updateNavigationCurrentMonth();
    buildDays();
  }
  function focusAndClose() {
    self._input.focus();
    if (window.navigator.userAgent.indexOf("MSIE") !== -1 || navigator.msMaxTouchPoints !== undefined) {
      setTimeout(self.close, 0);
    } else {
      self.close();
    }
  }
  function selectDate(e) {
    e.preventDefault();
    e.stopPropagation();
    var isSelectable = function (day) {
      return day.classList && day.classList.contains("flatpickr-day") && !day.classList.contains("flatpickr-disabled") && !day.classList.contains("notAllowed");
    };
    var t = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.findParent)((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e), isSelectable);
    if (t === undefined) return;
    var target = t;
    var selectedDate = self.latestSelectedDateObj = new Date(target.dateObj.getTime());
    var shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth || selectedDate.getMonth() > self.currentMonth + self.config.showMonths - 1) && self.config.mode !== "range";
    self.selectedDateElem = target;
    if (self.config.mode === "single") self.selectedDates = [selectedDate];else if (self.config.mode === "multiple") {
      var selectedIndex = isDateSelected(selectedDate);
      if (selectedIndex) self.selectedDates.splice(parseInt(selectedIndex), 1);else self.selectedDates.push(selectedDate);
    } else if (self.config.mode === "range") {
      if (self.selectedDates.length === 2) {
        self.clear(false, false);
      }
      self.latestSelectedDateObj = selectedDate;
      self.selectedDates.push(selectedDate);
      if ((0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(selectedDate, self.selectedDates[0], true) !== 0) self.selectedDates.sort(function (a, b) {
        return a.getTime() - b.getTime();
      });
    }
    setHoursFromInputs();
    if (shouldChangeMonth) {
      var isNewYear = self.currentYear !== selectedDate.getFullYear();
      self.currentYear = selectedDate.getFullYear();
      self.currentMonth = selectedDate.getMonth();
      if (isNewYear) {
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
      triggerEvent("onMonthChange");
    }
    updateNavigationCurrentMonth();
    buildDays();
    updateValue();
    if (!shouldChangeMonth && self.config.mode !== "range" && self.config.showMonths === 1) focusOnDayElem(target);else if (self.selectedDateElem !== undefined && self.hourElement === undefined) {
      self.selectedDateElem && self.selectedDateElem.focus();
    }
    if (self.hourElement !== undefined) self.hourElement !== undefined && self.hourElement.focus();
    if (self.config.closeOnSelect) {
      var single = self.config.mode === "single" && !self.config.enableTime;
      var range = self.config.mode === "range" && self.selectedDates.length === 2 && !self.config.enableTime;
      if (single || range) {
        focusAndClose();
      }
    }
    triggerChange();
  }
  var CALLBACKS = {
    locale: [setupLocale, updateWeekdays],
    showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
    minDate: [jumpToDate],
    maxDate: [jumpToDate],
    positionElement: [updatePositionElement],
    clickOpens: [function () {
      if (self.config.clickOpens === true) {
        bind(self._input, "focus", self.open);
        bind(self._input, "click", self.open);
      } else {
        self._input.removeEventListener("focus", self.open);
        self._input.removeEventListener("click", self.open);
      }
    }]
  };
  function set(option, value) {
    if (option !== null && typeof option === "object") {
      Object.assign(self.config, option);
      for (var key in option) {
        if (CALLBACKS[key] !== undefined) CALLBACKS[key].forEach(function (x) {
          return x();
        });
      }
    } else {
      self.config[option] = value;
      if (CALLBACKS[option] !== undefined) CALLBACKS[option].forEach(function (x) {
        return x();
      });else if (_types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.indexOf(option) > -1) self.config[option] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(value);
    }
    self.redraw();
    updateValue(true);
  }
  function setSelectedDate(inputDate, format) {
    var dates = [];
    if (inputDate instanceof Array) dates = inputDate.map(function (d) {
      return self.parseDate(d, format);
    });else if (inputDate instanceof Date || typeof inputDate === "number") dates = [self.parseDate(inputDate, format)];else if (typeof inputDate === "string") {
      switch (self.config.mode) {
        case "single":
        case "time":
          dates = [self.parseDate(inputDate, format)];
          break;
        case "multiple":
          dates = inputDate.split(self.config.conjunction).map(function (date) {
            return self.parseDate(date, format);
          });
          break;
        case "range":
          dates = inputDate.split(self.l10n.rangeSeparator).map(function (date) {
            return self.parseDate(date, format);
          });
          break;
        default:
          break;
      }
    } else self.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
    self.selectedDates = self.config.allowInvalidPreload ? dates : dates.filter(function (d) {
      return d instanceof Date && isEnabled(d, false);
    });
    if (self.config.mode === "range") self.selectedDates.sort(function (a, b) {
      return a.getTime() - b.getTime();
    });
  }
  function setDate(date, triggerChange, format) {
    if (triggerChange === void 0) {
      triggerChange = false;
    }
    if (format === void 0) {
      format = self.config.dateFormat;
    }
    if (date !== 0 && !date || date instanceof Array && date.length === 0) return self.clear(triggerChange);
    setSelectedDate(date, format);
    self.latestSelectedDateObj = self.selectedDates[self.selectedDates.length - 1];
    self.redraw();
    jumpToDate(undefined, triggerChange);
    setHoursFromDate();
    if (self.selectedDates.length === 0) {
      self.clear(false);
    }
    updateValue(triggerChange);
    if (triggerChange) triggerEvent("onChange");
  }
  function parseDateRules(arr) {
    return arr.slice().map(function (rule) {
      if (typeof rule === "string" || typeof rule === "number" || rule instanceof Date) {
        return self.parseDate(rule, undefined, true);
      } else if (rule && typeof rule === "object" && rule.from && rule.to) return {
        from: self.parseDate(rule.from, undefined),
        to: self.parseDate(rule.to, undefined)
      };
      return rule;
    }).filter(function (x) {
      return x;
    });
  }
  function setupDates() {
    self.selectedDates = [];
    self.now = self.parseDate(self.config.now) || new Date();
    var preloadedDate = self.config.defaultDate || ((self.input.nodeName === "INPUT" || self.input.nodeName === "TEXTAREA") && self.input.placeholder && self.input.value === self.input.placeholder ? null : self.input.value);
    if (preloadedDate) setSelectedDate(preloadedDate, self.config.dateFormat);
    self._initialDate = self.selectedDates.length > 0 ? self.selectedDates[0] : self.config.minDate && self.config.minDate.getTime() > self.now.getTime() ? self.config.minDate : self.config.maxDate && self.config.maxDate.getTime() < self.now.getTime() ? self.config.maxDate : self.now;
    self.currentYear = self._initialDate.getFullYear();
    self.currentMonth = self._initialDate.getMonth();
    if (self.selectedDates.length > 0) self.latestSelectedDateObj = self.selectedDates[0];
    if (self.config.minTime !== undefined) self.config.minTime = self.parseDate(self.config.minTime, "H:i");
    if (self.config.maxTime !== undefined) self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
    self.minDateHasTime = !!self.config.minDate && (self.config.minDate.getHours() > 0 || self.config.minDate.getMinutes() > 0 || self.config.minDate.getSeconds() > 0);
    self.maxDateHasTime = !!self.config.maxDate && (self.config.maxDate.getHours() > 0 || self.config.maxDate.getMinutes() > 0 || self.config.maxDate.getSeconds() > 0);
  }
  function setupInputs() {
    self.input = getInputElem();
    if (!self.input) {
      self.config.errorHandler(new Error("Invalid input element specified"));
      return;
    }
    self.input._type = self.input.type;
    self.input.type = "text";
    self.input.classList.add("flatpickr-input");
    self._input = self.input;
    if (self.config.altInput) {
      self.altInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)(self.input.nodeName, self.config.altInputClass);
      self._input = self.altInput;
      self.altInput.placeholder = self.input.placeholder;
      self.altInput.disabled = self.input.disabled;
      self.altInput.required = self.input.required;
      self.altInput.tabIndex = self.input.tabIndex;
      self.altInput.type = "text";
      self.input.setAttribute("type", "hidden");
      if (!self.config.static && self.input.parentNode) self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
    }
    if (!self.config.allowInput) self._input.setAttribute("readonly", "readonly");
    updatePositionElement();
  }
  function updatePositionElement() {
    self._positionElement = self.config.positionElement || self._input;
  }
  function setupMobile() {
    var inputType = self.config.enableTime ? self.config.noCalendar ? "time" : "datetime-local" : "date";
    self.mobileInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("input", self.input.className + " flatpickr-mobile");
    self.mobileInput.tabIndex = 1;
    self.mobileInput.type = inputType;
    self.mobileInput.disabled = self.input.disabled;
    self.mobileInput.required = self.input.required;
    self.mobileInput.placeholder = self.input.placeholder;
    self.mobileFormatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" : inputType === "date" ? "Y-m-d" : "H:i:S";
    if (self.selectedDates.length > 0) {
      self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
    }
    if (self.config.minDate) self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
    if (self.config.maxDate) self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
    if (self.input.getAttribute("step")) self.mobileInput.step = String(self.input.getAttribute("step"));
    self.input.type = "hidden";
    if (self.altInput !== undefined) self.altInput.type = "hidden";
    try {
      if (self.input.parentNode) self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
    } catch (_a) {}
    bind(self.mobileInput, "change", function (e) {
      self.setDate((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e).value, false, self.mobileFormatStr);
      triggerEvent("onChange");
      triggerEvent("onClose");
    });
  }
  function toggle(e) {
    if (self.isOpen === true) return self.close();
    self.open(e);
  }
  function triggerEvent(event, data) {
    if (self.config === undefined) return;
    var hooks = self.config[event];
    if (hooks !== undefined && hooks.length > 0) {
      for (var i = 0; hooks[i] && i < hooks.length; i++) hooks[i](self.selectedDates, self.input.value, self, data);
    }
    if (event === "onChange") {
      self.input.dispatchEvent(createEvent("change"));
      self.input.dispatchEvent(createEvent("input"));
    }
  }
  function createEvent(name) {
    var e = document.createEvent("Event");
    e.initEvent(name, true, true);
    return e;
  }
  function isDateSelected(date) {
    for (var i = 0; i < self.selectedDates.length; i++) {
      var selectedDate = self.selectedDates[i];
      if (selectedDate instanceof Date && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(selectedDate, date) === 0) return "" + i;
    }
    return false;
  }
  function isDateInRange(date) {
    if (self.config.mode !== "range" || self.selectedDates.length < 2) return false;
    return (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[0]) >= 0 && (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[1]) <= 0;
  }
  function updateNavigationCurrentMonth() {
    if (self.config.noCalendar || self.isMobile || !self.monthNav) return;
    self.yearElements.forEach(function (yearElement, i) {
      var d = new Date(self.currentYear, self.currentMonth, 1);
      d.setMonth(self.currentMonth + i);
      if (self.config.showMonths > 1 || self.config.monthSelectorType === "static") {
        self.monthElements[i].textContent = (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_5__.monthToStr)(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
      } else {
        self.monthsDropdownContainer.value = d.getMonth().toString();
      }
      yearElement.value = d.getFullYear().toString();
    });
    self._hidePrevMonthArrow = self.config.minDate !== undefined && (self.currentYear === self.config.minDate.getFullYear() ? self.currentMonth <= self.config.minDate.getMonth() : self.currentYear < self.config.minDate.getFullYear());
    self._hideNextMonthArrow = self.config.maxDate !== undefined && (self.currentYear === self.config.maxDate.getFullYear() ? self.currentMonth + 1 > self.config.maxDate.getMonth() : self.currentYear > self.config.maxDate.getFullYear());
  }
  function getDateStr(specificFormat) {
    var format = specificFormat || (self.config.altInput ? self.config.altFormat : self.config.dateFormat);
    return self.selectedDates.map(function (dObj) {
      return self.formatDate(dObj, format);
    }).filter(function (d, i, arr) {
      return self.config.mode !== "range" || self.config.enableTime || arr.indexOf(d) === i;
    }).join(self.config.mode !== "range" ? self.config.conjunction : self.l10n.rangeSeparator);
  }
  function updateValue(triggerChange) {
    if (triggerChange === void 0) {
      triggerChange = true;
    }
    if (self.mobileInput !== undefined && self.mobileFormatStr) {
      self.mobileInput.value = self.latestSelectedDateObj !== undefined ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr) : "";
    }
    self.input.value = getDateStr(self.config.dateFormat);
    if (self.altInput !== undefined) {
      self.altInput.value = getDateStr(self.config.altFormat);
    }
    if (triggerChange !== false) triggerEvent("onValueUpdate");
  }
  function onMonthNavClick(e) {
    var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
    var isPrevMonth = self.prevMonthNav.contains(eventTarget);
    var isNextMonth = self.nextMonthNav.contains(eventTarget);
    if (isPrevMonth || isNextMonth) {
      changeMonth(isPrevMonth ? -1 : 1);
    } else if (self.yearElements.indexOf(eventTarget) >= 0) {
      eventTarget.select();
    } else if (eventTarget.classList.contains("arrowUp")) {
      self.changeYear(self.currentYear + 1);
    } else if (eventTarget.classList.contains("arrowDown")) {
      self.changeYear(self.currentYear - 1);
    }
  }
  function timeWrapper(e) {
    e.preventDefault();
    var isKeyDown = e.type === "keydown",
      eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e),
      input = eventTarget;
    if (self.amPM !== undefined && eventTarget === self.amPM) {
      self.amPM.textContent = self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(self.amPM.textContent === self.l10n.amPM[0])];
    }
    var min = parseFloat(input.getAttribute("min")),
      max = parseFloat(input.getAttribute("max")),
      step = parseFloat(input.getAttribute("step")),
      curValue = parseInt(input.value, 10),
      delta = e.delta || (isKeyDown ? e.which === 38 ? 1 : -1 : 0);
    var newValue = curValue + step * delta;
    if (typeof input.value !== "undefined" && input.value.length === 2) {
      var isHourElem = input === self.hourElement,
        isMinuteElem = input === self.minuteElement;
      if (newValue < min) {
        newValue = max + newValue + (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!isHourElem) + ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(isHourElem) && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!self.amPM));
        if (isMinuteElem) incrementNumInput(undefined, -1, self.hourElement);
      } else if (newValue > max) {
        newValue = input === self.hourElement ? newValue - max - (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!self.amPM) : min;
        if (isMinuteElem) incrementNumInput(undefined, 1, self.hourElement);
      }
      if (self.amPM && isHourElem && (step === 1 ? newValue + curValue === 23 : Math.abs(newValue - curValue) > step)) {
        self.amPM.textContent = self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(self.amPM.textContent === self.l10n.amPM[0])];
      }
      input.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(newValue);
    }
  }
  init();
  return self;
}
function _flatpickr(nodeList, config) {
  var nodes = Array.prototype.slice.call(nodeList).filter(function (x) {
    return x instanceof HTMLElement;
  });
  var instances = [];
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    try {
      if (node.getAttribute("data-fp-omit") !== null) continue;
      if (node._flatpickr !== undefined) {
        node._flatpickr.destroy();
        node._flatpickr = undefined;
      }
      node._flatpickr = FlatpickrInstance(node, config || {});
      instances.push(node._flatpickr);
    } catch (e) {
      console.error(e);
    }
  }
  return instances.length === 1 ? instances[0] : instances;
}
if (typeof HTMLElement !== "undefined" && typeof HTMLCollection !== "undefined" && typeof NodeList !== "undefined") {
  HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
    return _flatpickr(this, config);
  };
  HTMLElement.prototype.flatpickr = function (config) {
    return _flatpickr([this], config);
  };
}
var flatpickr = function (selector, config) {
  if (typeof selector === "string") {
    return _flatpickr(window.document.querySelectorAll(selector), config);
  } else if (selector instanceof Node) {
    return _flatpickr([selector], config);
  } else {
    return _flatpickr(selector, config);
  }
};
flatpickr.defaultConfig = {};
flatpickr.l10ns = {
  en: __assign({}, _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"]),
  default: __assign({}, _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"])
};
flatpickr.localize = function (l10n) {
  flatpickr.l10ns.default = __assign(__assign({}, flatpickr.l10ns.default), l10n);
};
flatpickr.setDefaults = function (config) {
  flatpickr.defaultConfig = __assign(__assign({}, flatpickr.defaultConfig), config);
};
flatpickr.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({});
flatpickr.formatDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateFormatter)({});
flatpickr.compareDates = _utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates;
if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
  jQuery.fn.flatpickr = function (config) {
    return _flatpickr(this, config);
  };
}
Date.prototype.fp_incr = function (days) {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
};
if (typeof window !== "undefined") {
  window.flatpickr = flatpickr;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (flatpickr);

/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/l10n/default.js":
/*!*********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/l10n/default.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   english: () => (/* binding */ english)
/* harmony export */ });
var english = {
  weekdays: {
    shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  months: {
    shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  },
  daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  firstDayOfWeek: 0,
  ordinal: function (nth) {
    var s = nth % 100;
    if (s > 3 && s < 21) return "th";
    switch (s % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  },
  rangeSeparator: " to ",
  weekAbbreviation: "Wk",
  scrollTitle: "Scroll to increment",
  toggleTitle: "Click to toggle",
  amPM: ["AM", "PM"],
  yearAriaLabel: "Year",
  monthAriaLabel: "Month",
  hourAriaLabel: "Hour",
  minuteAriaLabel: "Minute",
  time_24hr: false
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (english);

/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/types/options.js":
/*!**********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/types/options.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HOOKS: () => (/* binding */ HOOKS),
/* harmony export */   defaults: () => (/* binding */ defaults)
/* harmony export */ });
var HOOKS = ["onChange", "onClose", "onDayCreate", "onDestroy", "onKeyDown", "onMonthChange", "onOpen", "onParseConfig", "onReady", "onValueUpdate", "onYearChange", "onPreCalendarPosition"];
var defaults = {
  _disable: [],
  allowInput: false,
  allowInvalidPreload: false,
  altFormat: "F j, Y",
  altInput: false,
  altInputClass: "form-control input",
  animate: typeof window === "object" && window.navigator.userAgent.indexOf("MSIE") === -1,
  ariaDateFormat: "F j, Y",
  autoFillDefaultTime: true,
  clickOpens: true,
  closeOnSelect: true,
  conjunction: ", ",
  dateFormat: "Y-m-d",
  defaultHour: 12,
  defaultMinute: 0,
  defaultSeconds: 0,
  disable: [],
  disableMobile: false,
  enableSeconds: false,
  enableTime: false,
  errorHandler: function (err) {
    return typeof console !== "undefined" && console.warn(err);
  },
  getWeek: function (givenDate) {
    var date = new Date(givenDate.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  },
  hourIncrement: 1,
  ignoredFocusElements: [],
  inline: false,
  locale: "default",
  minuteIncrement: 5,
  mode: "single",
  monthSelectorType: "dropdown",
  nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
  noCalendar: false,
  now: new Date(),
  onChange: [],
  onClose: [],
  onDayCreate: [],
  onDestroy: [],
  onKeyDown: [],
  onMonthChange: [],
  onOpen: [],
  onParseConfig: [],
  onReady: [],
  onValueUpdate: [],
  onYearChange: [],
  onPreCalendarPosition: [],
  plugins: [],
  position: "auto",
  positionElement: undefined,
  prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
  shorthandCurrentMonth: false,
  showMonths: 1,
  static: false,
  time_24hr: false,
  weekNumbers: false,
  wrap: false
};

/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/dates.js":
/*!********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/dates.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateSecondsSinceMidnight: () => (/* binding */ calculateSecondsSinceMidnight),
/* harmony export */   compareDates: () => (/* binding */ compareDates),
/* harmony export */   compareTimes: () => (/* binding */ compareTimes),
/* harmony export */   createDateFormatter: () => (/* binding */ createDateFormatter),
/* harmony export */   createDateParser: () => (/* binding */ createDateParser),
/* harmony export */   duration: () => (/* binding */ duration),
/* harmony export */   getDefaultHours: () => (/* binding */ getDefaultHours),
/* harmony export */   isBetween: () => (/* binding */ isBetween),
/* harmony export */   parseSeconds: () => (/* binding */ parseSeconds)
/* harmony export */ });
/* harmony import */ var _formatting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formatting */ "./node_modules/flatpickr/dist/esm/utils/formatting.js");
/* harmony import */ var _types_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types/options */ "./node_modules/flatpickr/dist/esm/types/options.js");
/* harmony import */ var _l10n_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../l10n/default */ "./node_modules/flatpickr/dist/esm/l10n/default.js");



var createDateFormatter = function (_a) {
  var _b = _a.config,
    config = _b === void 0 ? _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults : _b,
    _c = _a.l10n,
    l10n = _c === void 0 ? _l10n_default__WEBPACK_IMPORTED_MODULE_2__.english : _c,
    _d = _a.isMobile,
    isMobile = _d === void 0 ? false : _d;
  return function (dateObj, frmt, overrideLocale) {
    var locale = overrideLocale || l10n;
    if (config.formatDate !== undefined && !isMobile) {
      return config.formatDate(dateObj, frmt, locale);
    }
    return frmt.split("").map(function (c, i, arr) {
      return _formatting__WEBPACK_IMPORTED_MODULE_0__.formats[c] && arr[i - 1] !== "\\" ? _formatting__WEBPACK_IMPORTED_MODULE_0__.formats[c](dateObj, locale, config) : c !== "\\" ? c : "";
    }).join("");
  };
};
var createDateParser = function (_a) {
  var _b = _a.config,
    config = _b === void 0 ? _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults : _b,
    _c = _a.l10n,
    l10n = _c === void 0 ? _l10n_default__WEBPACK_IMPORTED_MODULE_2__.english : _c;
  return function (date, givenFormat, timeless, customLocale) {
    if (date !== 0 && !date) return undefined;
    var locale = customLocale || l10n;
    var parsedDate;
    var dateOrig = date;
    if (date instanceof Date) parsedDate = new Date(date.getTime());else if (typeof date !== "string" && date.toFixed !== undefined) parsedDate = new Date(date);else if (typeof date === "string") {
      var format = givenFormat || (config || _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults).dateFormat;
      var datestr = String(date).trim();
      if (datestr === "today") {
        parsedDate = new Date();
        timeless = true;
      } else if (config && config.parseDate) {
        parsedDate = config.parseDate(date, format);
      } else if (/Z$/.test(datestr) || /GMT$/.test(datestr)) {
        parsedDate = new Date(date);
      } else {
        var matched = void 0,
          ops = [];
        for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
          var token = format[i];
          var isBackSlash = token === "\\";
          var escaped = format[i - 1] === "\\" || isBackSlash;
          if (_formatting__WEBPACK_IMPORTED_MODULE_0__.tokenRegex[token] && !escaped) {
            regexStr += _formatting__WEBPACK_IMPORTED_MODULE_0__.tokenRegex[token];
            var match = new RegExp(regexStr).exec(date);
            if (match && (matched = true)) {
              ops[token !== "Y" ? "push" : "unshift"]({
                fn: _formatting__WEBPACK_IMPORTED_MODULE_0__.revFormat[token],
                val: match[++matchIndex]
              });
            }
          } else if (!isBackSlash) regexStr += ".";
        }
        parsedDate = !config || !config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));
        ops.forEach(function (_a) {
          var fn = _a.fn,
            val = _a.val;
          return parsedDate = fn(parsedDate, val, locale) || parsedDate;
        });
        parsedDate = matched ? parsedDate : undefined;
      }
    }
    if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
      config.errorHandler(new Error("Invalid date provided: " + dateOrig));
      return undefined;
    }
    if (timeless === true) parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
  };
};
function compareDates(date1, date2, timeless) {
  if (timeless === void 0) {
    timeless = true;
  }
  if (timeless !== false) {
    return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
  }
  return date1.getTime() - date2.getTime();
}
function compareTimes(date1, date2) {
  return 3600 * (date1.getHours() - date2.getHours()) + 60 * (date1.getMinutes() - date2.getMinutes()) + date1.getSeconds() - date2.getSeconds();
}
var isBetween = function (ts, ts1, ts2) {
  return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
};
var calculateSecondsSinceMidnight = function (hours, minutes, seconds) {
  return hours * 3600 + minutes * 60 + seconds;
};
var parseSeconds = function (secondsSinceMidnight) {
  var hours = Math.floor(secondsSinceMidnight / 3600),
    minutes = (secondsSinceMidnight - hours * 3600) / 60;
  return [hours, minutes, secondsSinceMidnight - hours * 3600 - minutes * 60];
};
var duration = {
  DAY: 86400000
};
function getDefaultHours(config) {
  var hours = config.defaultHour;
  var minutes = config.defaultMinute;
  var seconds = config.defaultSeconds;
  if (config.minDate !== undefined) {
    var minHour = config.minDate.getHours();
    var minMinutes = config.minDate.getMinutes();
    var minSeconds = config.minDate.getSeconds();
    if (hours < minHour) {
      hours = minHour;
    }
    if (hours === minHour && minutes < minMinutes) {
      minutes = minMinutes;
    }
    if (hours === minHour && minutes === minMinutes && seconds < minSeconds) seconds = config.minDate.getSeconds();
  }
  if (config.maxDate !== undefined) {
    var maxHr = config.maxDate.getHours();
    var maxMinutes = config.maxDate.getMinutes();
    hours = Math.min(hours, maxHr);
    if (hours === maxHr) minutes = Math.min(maxMinutes, minutes);
    if (hours === maxHr && minutes === maxMinutes) seconds = config.maxDate.getSeconds();
  }
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/dom.js":
/*!******************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/dom.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearNode: () => (/* binding */ clearNode),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   createNumberInput: () => (/* binding */ createNumberInput),
/* harmony export */   findParent: () => (/* binding */ findParent),
/* harmony export */   getEventTarget: () => (/* binding */ getEventTarget),
/* harmony export */   toggleClass: () => (/* binding */ toggleClass)
/* harmony export */ });
function toggleClass(elem, className, bool) {
  if (bool === true) return elem.classList.add(className);
  elem.classList.remove(className);
}
function createElement(tag, className, content) {
  var e = window.document.createElement(tag);
  className = className || "";
  content = content || "";
  e.className = className;
  if (content !== undefined) e.textContent = content;
  return e;
}
function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}
function findParent(node, condition) {
  if (condition(node)) return node;else if (node.parentNode) return findParent(node.parentNode, condition);
  return undefined;
}
function createNumberInput(inputClassName, opts) {
  var wrapper = createElement("div", "numInputWrapper"),
    numInput = createElement("input", "numInput " + inputClassName),
    arrowUp = createElement("span", "arrowUp"),
    arrowDown = createElement("span", "arrowDown");
  if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
    numInput.type = "number";
  } else {
    numInput.type = "text";
    numInput.pattern = "\\d*";
  }
  if (opts !== undefined) for (var key in opts) numInput.setAttribute(key, opts[key]);
  wrapper.appendChild(numInput);
  wrapper.appendChild(arrowUp);
  wrapper.appendChild(arrowDown);
  return wrapper;
}
function getEventTarget(event) {
  try {
    if (typeof event.composedPath === "function") {
      var path = event.composedPath();
      return path[0];
    }
    return event.target;
  } catch (error) {
    return event.target;
  }
}

/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/formatting.js":
/*!*************************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/formatting.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formats: () => (/* binding */ formats),
/* harmony export */   monthToStr: () => (/* binding */ monthToStr),
/* harmony export */   revFormat: () => (/* binding */ revFormat),
/* harmony export */   tokenRegex: () => (/* binding */ tokenRegex)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./node_modules/flatpickr/dist/esm/utils/index.js");

var doNothing = function () {
  return undefined;
};
var monthToStr = function (monthNumber, shorthand, locale) {
  return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
};
var revFormat = {
  D: doNothing,
  F: function (dateObj, monthName, locale) {
    dateObj.setMonth(locale.months.longhand.indexOf(monthName));
  },
  G: function (dateObj, hour) {
    dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
  },
  H: function (dateObj, hour) {
    dateObj.setHours(parseFloat(hour));
  },
  J: function (dateObj, day) {
    dateObj.setDate(parseFloat(day));
  },
  K: function (dateObj, amPM, locale) {
    dateObj.setHours(dateObj.getHours() % 12 + 12 * (0,_utils__WEBPACK_IMPORTED_MODULE_0__.int)(new RegExp(locale.amPM[1], "i").test(amPM)));
  },
  M: function (dateObj, shortMonth, locale) {
    dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
  },
  S: function (dateObj, seconds) {
    dateObj.setSeconds(parseFloat(seconds));
  },
  U: function (_, unixSeconds) {
    return new Date(parseFloat(unixSeconds) * 1000);
  },
  W: function (dateObj, weekNum, locale) {
    var weekNumber = parseInt(weekNum);
    var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
    return date;
  },
  Y: function (dateObj, year) {
    dateObj.setFullYear(parseFloat(year));
  },
  Z: function (_, ISODate) {
    return new Date(ISODate);
  },
  d: function (dateObj, day) {
    dateObj.setDate(parseFloat(day));
  },
  h: function (dateObj, hour) {
    dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
  },
  i: function (dateObj, minutes) {
    dateObj.setMinutes(parseFloat(minutes));
  },
  j: function (dateObj, day) {
    dateObj.setDate(parseFloat(day));
  },
  l: doNothing,
  m: function (dateObj, month) {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  n: function (dateObj, month) {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  s: function (dateObj, seconds) {
    dateObj.setSeconds(parseFloat(seconds));
  },
  u: function (_, unixMillSeconds) {
    return new Date(parseFloat(unixMillSeconds));
  },
  w: doNothing,
  y: function (dateObj, year) {
    dateObj.setFullYear(2000 + parseFloat(year));
  }
};
var tokenRegex = {
  D: "",
  F: "",
  G: "(\\d\\d|\\d)",
  H: "(\\d\\d|\\d)",
  J: "(\\d\\d|\\d)\\w+",
  K: "",
  M: "",
  S: "(\\d\\d|\\d)",
  U: "(.+)",
  W: "(\\d\\d|\\d)",
  Y: "(\\d{4})",
  Z: "(.+)",
  d: "(\\d\\d|\\d)",
  h: "(\\d\\d|\\d)",
  i: "(\\d\\d|\\d)",
  j: "(\\d\\d|\\d)",
  l: "",
  m: "(\\d\\d|\\d)",
  n: "(\\d\\d|\\d)",
  s: "(\\d\\d|\\d)",
  u: "(.+)",
  w: "(\\d\\d|\\d)",
  y: "(\\d{2})"
};
var formats = {
  Z: function (date) {
    return date.toISOString();
  },
  D: function (date, locale, options) {
    return locale.weekdays.shorthand[formats.w(date, locale, options)];
  },
  F: function (date, locale, options) {
    return monthToStr(formats.n(date, locale, options) - 1, false, locale);
  },
  G: function (date, locale, options) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(formats.h(date, locale, options));
  },
  H: function (date) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getHours());
  },
  J: function (date, locale) {
    return locale.ordinal !== undefined ? date.getDate() + locale.ordinal(date.getDate()) : date.getDate();
  },
  K: function (date, locale) {
    return locale.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_0__.int)(date.getHours() > 11)];
  },
  M: function (date, locale) {
    return monthToStr(date.getMonth(), true, locale);
  },
  S: function (date) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getSeconds());
  },
  U: function (date) {
    return date.getTime() / 1000;
  },
  W: function (date, _, options) {
    return options.getWeek(date);
  },
  Y: function (date) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getFullYear(), 4);
  },
  d: function (date) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getDate());
  },
  h: function (date) {
    return date.getHours() % 12 ? date.getHours() % 12 : 12;
  },
  i: function (date) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getMinutes());
  },
  j: function (date) {
    return date.getDate();
  },
  l: function (date, locale) {
    return locale.weekdays.longhand[date.getDay()];
  },
  m: function (date) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getMonth() + 1);
  },
  n: function (date) {
    return date.getMonth() + 1;
  },
  s: function (date) {
    return date.getSeconds();
  },
  u: function (date) {
    return date.getTime();
  },
  w: function (date) {
    return date.getDay();
  },
  y: function (date) {
    return String(date.getFullYear()).substring(2);
  }
};

/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/index.js":
/*!********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayify: () => (/* binding */ arrayify),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   int: () => (/* binding */ int),
/* harmony export */   pad: () => (/* binding */ pad)
/* harmony export */ });
var pad = function (number, length) {
  if (length === void 0) {
    length = 2;
  }
  return ("000" + number).slice(length * -1);
};
var int = function (bool) {
  return bool === true ? 1 : 0;
};
function debounce(fn, wait) {
  var t;
  return function () {
    var _this = this;
    var args = arguments;
    clearTimeout(t);
    t = setTimeout(function () {
      return fn.apply(_this, args);
    }, wait);
  };
}
var arrayify = function (obj) {
  return obj instanceof Array ? obj : [obj];
};

/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/polyfills.js":
/*!************************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/polyfills.js ***!
  \************************************************************/
/***/ (() => {

"use strict";


if (typeof Object.assign !== "function") {
  Object.assign = function (target) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (!target) {
      throw TypeError("Cannot convert undefined or null to object");
    }
    var _loop_1 = function (source) {
      if (source) {
        Object.keys(source).forEach(function (key) {
          return target[key] = source[key];
        });
      }
    };
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
      var source = args_1[_a];
      _loop_1(source);
    }
    return target;
  };
}

/***/ }),

/***/ "./node_modules/flatpickr/dist/l10n/ru.js":
/*!************************************************!*\
  !*** ./node_modules/flatpickr/dist/l10n/ru.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
   true ? factory(exports) : 0;
})(this, function (exports) {
  'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined ? window.flatpickr : {
    l10ns: {}
  };
  var Russian = {
    weekdays: {
      shorthand: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      longhand: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
    },
    months: {
      shorthand: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
      longhand: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    },
    firstDayOfWeek: 1,
    ordinal: function () {
      return "";
    },
    rangeSeparator: " — ",
    weekAbbreviation: "Нед.",
    scrollTitle: "Прокрутите для увеличения",
    toggleTitle: "Нажмите для переключения",
    amPM: ["ДП", "ПП"],
    yearAriaLabel: "Год",
    time_24hr: true
  };
  fp.l10ns.ru = Russian;
  var ru = fp.l10ns;
  exports.Russian = Russian;
  exports.default = ru;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

/***/ }),

/***/ "./node_modules/flatpickr/dist/l10n/uk.js":
/*!************************************************!*\
  !*** ./node_modules/flatpickr/dist/l10n/uk.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
   true ? factory(exports) : 0;
})(this, function (exports) {
  'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined ? window.flatpickr : {
    l10ns: {}
  };
  var Ukrainian = {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      longhand: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]
    },
    months: {
      shorthand: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
      longhand: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"]
    },
    time_24hr: true
  };
  fp.l10ns.uk = Ukrainian;
  var uk = fp.l10ns;
  exports.Ukrainian = Ukrainian;
  exports.default = uk;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************************************************!*\
  !*** ./com_nevigen_audit/es6/fields/date/period.es6 ***!
  \******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flatpickr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flatpickr */ "./node_modules/flatpickr/dist/esm/index.js");
/* harmony import */ var flatpickr_dist_l10n_ru_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flatpickr/dist/l10n/ru.js */ "./node_modules/flatpickr/dist/l10n/ru.js");
/* harmony import */ var flatpickr_dist_l10n_ru_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flatpickr_dist_l10n_ru_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flatpickr_dist_l10n_uk_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flatpickr/dist/l10n/uk.js */ "./node_modules/flatpickr/dist/l10n/uk.js");
/* harmony import */ var flatpickr_dist_l10n_uk_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flatpickr_dist_l10n_uk_js__WEBPACK_IMPORTED_MODULE_2__);
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */






document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[nevigen-audit-field-date-period="container"],' + '[data-nevigen-audit-field-date-period="container"]').forEach(container => {
    let selector = container.getAttribute('data-selector'),
      jsOptions = Joomla.getOptions(selector),
      wrapper = container.querySelector('[nevigen-audit-field-date-period="wrapper"],' + '[data-nevigen-audit-field-date-period="wrapper"]'),
      fieldFrom = container.querySelector('[nevigen-audit-field-date-period="input-from"],' + '[data-nevigen-audit-field-date-period="input-from"]'),
      fieldTo = container.querySelector('[nevigen-audit-field-date-period="input-to"],' + '[data-nevigen-audit-field-date-period="input-to"]');
    let locale = null;
    if (jsOptions.locale && jsOptions.locale === 'ru') {
      locale = flatpickr_dist_l10n_ru_js__WEBPACK_IMPORTED_MODULE_1__.Russian;
    } else if (jsOptions.locale && jsOptions.locale === 'ua') {
      locale = flatpickr_dist_l10n_uk_js__WEBPACK_IMPORTED_MODULE_2__.Ukrainian;
    }
    (0,flatpickr__WEBPACK_IMPORTED_MODULE_0__["default"])(wrapper, {
      dateFormat: jsOptions.dateFormat ? jsOptions.dateFormat : 'Y-m-d',
      mode: 'range',
      wrap: true,
      locale: locale,
      defaultDate: jsOptions.defaultDate ? jsOptions.defaultDate : [],
      onClose: dates => {
        let oldValue = {
            from: fieldFrom.value,
            to: fieldTo.value
          },
          newValue = {
            from: '',
            to: ''
          };
        dates.forEach((date, i) => {
          let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            monthFormatted = month < 10 ? '0' + month : month,
            dayFormatted = day < 10 ? '0' + day : day,
            dateString = year + '-' + monthFormatted + '-' + dayFormatted;
          if (i === 0) {
            newValue.from = dateString;
          } else if (i === 1) {
            newValue.to = dateString;
          }
        });
        let change = false;
        if (oldValue.from !== newValue.from) {
          fieldFrom.value = newValue.from;
          change = true;
        }
        if (oldValue.to !== newValue.to) {
          fieldTo.value = newValue.to;
          change = true;
        }
        if (change) {
          fieldFrom.dispatchEvent(new Event('change', {
            'bubbles': true
          }));
        }
      },
      onChange: (dates, string) => {
        if (dates.length === 0 && string === '') {
          fieldFrom.value = '';
          fieldTo.value = '';
          fieldFrom.dispatchEvent(new Event('change', {
            'bubbles': true
          }));
        }
      }
    });
  });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QjRULE1BQU0sR0FBRyxJQUFJO1FBQ2Q7UUFFQSxJQUFJSixRQUFRLENBQUN2VCxFQUFFLEtBQUt1SyxRQUFRLENBQUN2SyxFQUFFLEVBQUU7VUFDaENzVCxPQUFPLENBQUNuakIsS0FBSyxHQUFHb2EsUUFBUSxDQUFDdkssRUFBRTtVQUMzQjJULE1BQU0sR0FBRyxJQUFJO1FBQ2Q7UUFFQSxJQUFJQSxNQUFNLEVBQUU7VUFDWE4sU0FBUyxDQUFDcmQsYUFBYSxDQUFDLElBQUk0ZCxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQUMsU0FBUyxFQUFFO1VBQUksQ0FBQyxDQUFDLENBQUM7UUFDaEU7TUFDRCxDQUFDO01BQ0R0SCxRQUFRLEVBQUVBLENBQUNwSixLQUFLLEVBQUUyUSxNQUFNLEtBQUs7UUFDNUIsSUFBSTNRLEtBQUssQ0FBQzFiLE1BQU0sS0FBSyxDQUFDLElBQUlxc0IsTUFBTSxLQUFLLEVBQUUsRUFBRTtVQUN4Q1IsU0FBUyxDQUFDbGpCLEtBQUssR0FBRyxFQUFFO1VBQ3BCbWpCLE9BQU8sQ0FBQ25qQixLQUFLLEdBQUcsRUFBRTtVQUNsQmtqQixTQUFTLENBQUNyZCxhQUFhLENBQUMsSUFBSTRkLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFBQyxTQUFTLEVBQUU7VUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoRTtNQUNEO0lBQ0QsQ0FBQyxDQUFDO0VBQ0gsQ0FBQyxDQUFDO0FBQ0gsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9hdWRpdC8uL25vZGVfbW9kdWxlcy9mbGF0cGlja3IvZGlzdC9lc20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fYXVkaXQvLi9ub2RlX21vZHVsZXMvZmxhdHBpY2tyL2Rpc3QvZXNtL2wxMG4vZGVmYXVsdC5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9hdWRpdC8uL25vZGVfbW9kdWxlcy9mbGF0cGlja3IvZGlzdC9lc20vdHlwZXMvb3B0aW9ucy5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9hdWRpdC8uL25vZGVfbW9kdWxlcy9mbGF0cGlja3IvZGlzdC9lc20vdXRpbHMvZGF0ZXMuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fYXVkaXQvLi9ub2RlX21vZHVsZXMvZmxhdHBpY2tyL2Rpc3QvZXNtL3V0aWxzL2RvbS5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9hdWRpdC8uL25vZGVfbW9kdWxlcy9mbGF0cGlja3IvZGlzdC9lc20vdXRpbHMvZm9ybWF0dGluZy5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9hdWRpdC8uL25vZGVfbW9kdWxlcy9mbGF0cGlja3IvZGlzdC9lc20vdXRpbHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fYXVkaXQvLi9ub2RlX21vZHVsZXMvZmxhdHBpY2tyL2Rpc3QvZXNtL3V0aWxzL3BvbHlmaWxscy5qcyIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9hdWRpdC8uL25vZGVfbW9kdWxlcy9mbGF0cGlja3IvZGlzdC9sMTBuL3J1LmpzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2F1ZGl0Ly4vbm9kZV9tb2R1bGVzL2ZsYXRwaWNrci9kaXN0L2wxMG4vdWsuanMiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fYXVkaXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fYXVkaXQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fYXVkaXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2F1ZGl0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fYXVkaXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wa2dfbmV2aWdlbl9hdWRpdC8uL2NvbV9uZXZpZ2VuX2F1ZGl0L2VzNi9maWVsZHMvZGF0ZS9wZXJpb2QuZXM2Il0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19zcHJlYWRBcnJheXMgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXlzKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xuICAgIHJldHVybiByO1xufTtcbmltcG9ydCB7IGRlZmF1bHRzIGFzIGRlZmF1bHRPcHRpb25zLCBIT09LUywgfSBmcm9tIFwiLi90eXBlcy9vcHRpb25zXCI7XG5pbXBvcnQgRW5nbGlzaCBmcm9tIFwiLi9sMTBuL2RlZmF1bHRcIjtcbmltcG9ydCB7IGFycmF5aWZ5LCBkZWJvdW5jZSwgaW50LCBwYWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgY2xlYXJOb2RlLCBjcmVhdGVFbGVtZW50LCBjcmVhdGVOdW1iZXJJbnB1dCwgZmluZFBhcmVudCwgdG9nZ2xlQ2xhc3MsIGdldEV2ZW50VGFyZ2V0LCB9IGZyb20gXCIuL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgY29tcGFyZURhdGVzLCBjcmVhdGVEYXRlUGFyc2VyLCBjcmVhdGVEYXRlRm9ybWF0dGVyLCBkdXJhdGlvbiwgaXNCZXR3ZWVuLCBnZXREZWZhdWx0SG91cnMsIGNhbGN1bGF0ZVNlY29uZHNTaW5jZU1pZG5pZ2h0LCBwYXJzZVNlY29uZHMsIH0gZnJvbSBcIi4vdXRpbHMvZGF0ZXNcIjtcbmltcG9ydCB7IHRva2VuUmVnZXgsIG1vbnRoVG9TdHIgfSBmcm9tIFwiLi91dGlscy9mb3JtYXR0aW5nXCI7XG5pbXBvcnQgXCIuL3V0aWxzL3BvbHlmaWxsc1wiO1xudmFyIERFQk9VTkNFRF9DSEFOR0VfTVMgPSAzMDA7XG5mdW5jdGlvbiBGbGF0cGlja3JJbnN0YW5jZShlbGVtZW50LCBpbnN0YW5jZUNvbmZpZykge1xuICAgIHZhciBzZWxmID0ge1xuICAgICAgICBjb25maWc6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucyksIGZsYXRwaWNrci5kZWZhdWx0Q29uZmlnKSxcbiAgICAgICAgbDEwbjogRW5nbGlzaCxcbiAgICB9O1xuICAgIHNlbGYucGFyc2VEYXRlID0gY3JlYXRlRGF0ZVBhcnNlcih7IGNvbmZpZzogc2VsZi5jb25maWcsIGwxMG46IHNlbGYubDEwbiB9KTtcbiAgICBzZWxmLl9oYW5kbGVycyA9IFtdO1xuICAgIHNlbGYucGx1Z2luRWxlbWVudHMgPSBbXTtcbiAgICBzZWxmLmxvYWRlZFBsdWdpbnMgPSBbXTtcbiAgICBzZWxmLl9iaW5kID0gYmluZDtcbiAgICBzZWxmLl9zZXRIb3Vyc0Zyb21EYXRlID0gc2V0SG91cnNGcm9tRGF0ZTtcbiAgICBzZWxmLl9wb3NpdGlvbkNhbGVuZGFyID0gcG9zaXRpb25DYWxlbmRhcjtcbiAgICBzZWxmLmNoYW5nZU1vbnRoID0gY2hhbmdlTW9udGg7XG4gICAgc2VsZi5jaGFuZ2VZZWFyID0gY2hhbmdlWWVhcjtcbiAgICBzZWxmLmNsZWFyID0gY2xlYXI7XG4gICAgc2VsZi5jbG9zZSA9IGNsb3NlO1xuICAgIHNlbGYub25Nb3VzZU92ZXIgPSBvbk1vdXNlT3ZlcjtcbiAgICBzZWxmLl9jcmVhdGVFbGVtZW50ID0gY3JlYXRlRWxlbWVudDtcbiAgICBzZWxmLmNyZWF0ZURheSA9IGNyZWF0ZURheTtcbiAgICBzZWxmLmRlc3Ryb3kgPSBkZXN0cm95O1xuICAgIHNlbGYuaXNFbmFibGVkID0gaXNFbmFibGVkO1xuICAgIHNlbGYuanVtcFRvRGF0ZSA9IGp1bXBUb0RhdGU7XG4gICAgc2VsZi51cGRhdGVWYWx1ZSA9IHVwZGF0ZVZhbHVlO1xuICAgIHNlbGYub3BlbiA9IG9wZW47XG4gICAgc2VsZi5yZWRyYXcgPSByZWRyYXc7XG4gICAgc2VsZi5zZXQgPSBzZXQ7XG4gICAgc2VsZi5zZXREYXRlID0gc2V0RGF0ZTtcbiAgICBzZWxmLnRvZ2dsZSA9IHRvZ2dsZTtcbiAgICBmdW5jdGlvbiBzZXR1cEhlbHBlckZ1bmN0aW9ucygpIHtcbiAgICAgICAgc2VsZi51dGlscyA9IHtcbiAgICAgICAgICAgIGdldERheXNJbk1vbnRoOiBmdW5jdGlvbiAobW9udGgsIHlyKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoID09PSB2b2lkIDApIHsgbW9udGggPSBzZWxmLmN1cnJlbnRNb250aDsgfVxuICAgICAgICAgICAgICAgIGlmICh5ciA9PT0gdm9pZCAwKSB7IHlyID0gc2VsZi5jdXJyZW50WWVhcjsgfVxuICAgICAgICAgICAgICAgIGlmIChtb250aCA9PT0gMSAmJiAoKHlyICUgNCA9PT0gMCAmJiB5ciAlIDEwMCAhPT0gMCkgfHwgeXIgJSA0MDAgPT09IDApKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYubDEwbi5kYXlzSW5Nb250aFttb250aF07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBzZWxmLmVsZW1lbnQgPSBzZWxmLmlucHV0ID0gZWxlbWVudDtcbiAgICAgICAgc2VsZi5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgcGFyc2VDb25maWcoKTtcbiAgICAgICAgc2V0dXBMb2NhbGUoKTtcbiAgICAgICAgc2V0dXBJbnB1dHMoKTtcbiAgICAgICAgc2V0dXBEYXRlcygpO1xuICAgICAgICBzZXR1cEhlbHBlckZ1bmN0aW9ucygpO1xuICAgICAgICBpZiAoIXNlbGYuaXNNb2JpbGUpXG4gICAgICAgICAgICBidWlsZCgpO1xuICAgICAgICBiaW5kRXZlbnRzKCk7XG4gICAgICAgIGlmIChzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoIHx8IHNlbGYuY29uZmlnLm5vQ2FsZW5kYXIpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5lbmFibGVUaW1lKSB7XG4gICAgICAgICAgICAgICAgc2V0SG91cnNGcm9tRGF0ZShzZWxmLmNvbmZpZy5ub0NhbGVuZGFyID8gc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmogOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlVmFsdWUoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHNldENhbGVuZGFyV2lkdGgoKTtcbiAgICAgICAgdmFyIGlzU2FmYXJpID0gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgaWYgKCFzZWxmLmlzTW9iaWxlICYmIGlzU2FmYXJpKSB7XG4gICAgICAgICAgICBwb3NpdGlvbkNhbGVuZGFyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdHJpZ2dlckV2ZW50KFwib25SZWFkeVwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Q2xvc2VzdEFjdGl2ZUVsZW1lbnQoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuICgoKF9hID0gc2VsZi5jYWxlbmRhckNvbnRhaW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFJvb3ROb2RlKCkpXG4gICAgICAgICAgICAuYWN0aXZlRWxlbWVudCB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYmluZFRvSW5zdGFuY2UoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuLmJpbmQoc2VsZik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldENhbGVuZGFyV2lkdGgoKSB7XG4gICAgICAgIHZhciBjb25maWcgPSBzZWxmLmNvbmZpZztcbiAgICAgICAgaWYgKGNvbmZpZy53ZWVrTnVtYmVycyA9PT0gZmFsc2UgJiYgY29uZmlnLnNob3dNb250aHMgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb25maWcubm9DYWxlbmRhciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY2FsZW5kYXJDb250YWluZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRheXNDb250YWluZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF5c1dpZHRoID0gKHNlbGYuZGF5cy5vZmZzZXRXaWR0aCArIDEpICogY29uZmlnLnNob3dNb250aHM7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGF5c0NvbnRhaW5lci5zdHlsZS53aWR0aCA9IGRheXNXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlzV2lkdGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzZWxmLndlZWtXcmFwcGVyICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBzZWxmLndlZWtXcmFwcGVyLm9mZnNldFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInZpc2liaWxpdHlcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2FsZW5kYXJDb250YWluZXIuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRpbWUoZSkge1xuICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIGRlZmF1bHREYXRlID0gc2VsZi5jb25maWcubWluRGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgICAgY29tcGFyZURhdGVzKG5ldyBEYXRlKCksIHNlbGYuY29uZmlnLm1pbkRhdGUpID49IDBcbiAgICAgICAgICAgICAgICA/IG5ldyBEYXRlKClcbiAgICAgICAgICAgICAgICA6IG5ldyBEYXRlKHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgIHZhciBkZWZhdWx0cyA9IGdldERlZmF1bHRIb3VycyhzZWxmLmNvbmZpZyk7XG4gICAgICAgICAgICBkZWZhdWx0RGF0ZS5zZXRIb3VycyhkZWZhdWx0cy5ob3VycywgZGVmYXVsdHMubWludXRlcywgZGVmYXVsdHMuc2Vjb25kcywgZGVmYXVsdERhdGUuZ2V0TWlsbGlzZWNvbmRzKCkpO1xuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZERhdGVzID0gW2RlZmF1bHREYXRlXTtcbiAgICAgICAgICAgIHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqID0gZGVmYXVsdERhdGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUgIT09IHVuZGVmaW5lZCAmJiBlLnR5cGUgIT09IFwiYmx1clwiKSB7XG4gICAgICAgICAgICB0aW1lV3JhcHBlcihlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJldlZhbHVlID0gc2VsZi5faW5wdXQudmFsdWU7XG4gICAgICAgIHNldEhvdXJzRnJvbUlucHV0cygpO1xuICAgICAgICB1cGRhdGVWYWx1ZSgpO1xuICAgICAgICBpZiAoc2VsZi5faW5wdXQudmFsdWUgIT09IHByZXZWYWx1ZSkge1xuICAgICAgICAgICAgc2VsZi5fZGVib3VuY2VkQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYW1wbTJtaWxpdGFyeShob3VyLCBhbVBNKSB7XG4gICAgICAgIHJldHVybiAoaG91ciAlIDEyKSArIDEyICogaW50KGFtUE0gPT09IHNlbGYubDEwbi5hbVBNWzFdKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbWlsaXRhcnkyYW1wbShob3VyKSB7XG4gICAgICAgIHN3aXRjaCAoaG91ciAlIDI0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgIHJldHVybiAxMjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvdXIgJSAxMjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRIb3Vyc0Zyb21JbnB1dHMoKSB7XG4gICAgICAgIGlmIChzZWxmLmhvdXJFbGVtZW50ID09PSB1bmRlZmluZWQgfHwgc2VsZi5taW51dGVFbGVtZW50ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBob3VycyA9IChwYXJzZUludChzZWxmLmhvdXJFbGVtZW50LnZhbHVlLnNsaWNlKC0yKSwgMTApIHx8IDApICUgMjQsIG1pbnV0ZXMgPSAocGFyc2VJbnQoc2VsZi5taW51dGVFbGVtZW50LnZhbHVlLCAxMCkgfHwgMCkgJSA2MCwgc2Vjb25kcyA9IHNlbGYuc2Vjb25kRWxlbWVudCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IChwYXJzZUludChzZWxmLnNlY29uZEVsZW1lbnQudmFsdWUsIDEwKSB8fCAwKSAlIDYwXG4gICAgICAgICAgICA6IDA7XG4gICAgICAgIGlmIChzZWxmLmFtUE0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaG91cnMgPSBhbXBtMm1pbGl0YXJ5KGhvdXJzLCBzZWxmLmFtUE0udGV4dENvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsaW1pdE1pbkhvdXJzID0gc2VsZi5jb25maWcubWluVGltZSAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAoc2VsZi5jb25maWcubWluRGF0ZSAmJlxuICAgICAgICAgICAgICAgIHNlbGYubWluRGF0ZUhhc1RpbWUgJiZcbiAgICAgICAgICAgICAgICBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiAmJlxuICAgICAgICAgICAgICAgIGNvbXBhcmVEYXRlcyhzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiwgc2VsZi5jb25maWcubWluRGF0ZSwgdHJ1ZSkgPT09XG4gICAgICAgICAgICAgICAgICAgIDApO1xuICAgICAgICB2YXIgbGltaXRNYXhIb3VycyA9IHNlbGYuY29uZmlnLm1heFRpbWUgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgKHNlbGYuY29uZmlnLm1heERhdGUgJiZcbiAgICAgICAgICAgICAgICBzZWxmLm1heERhdGVIYXNUaW1lICYmXG4gICAgICAgICAgICAgICAgc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmogJiZcbiAgICAgICAgICAgICAgICBjb21wYXJlRGF0ZXMoc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmosIHNlbGYuY29uZmlnLm1heERhdGUsIHRydWUpID09PVxuICAgICAgICAgICAgICAgICAgICAwKTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1heFRpbWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgc2VsZi5jb25maWcubWluVGltZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5taW5UaW1lID4gc2VsZi5jb25maWcubWF4VGltZSkge1xuICAgICAgICAgICAgdmFyIG1pbkJvdW5kID0gY2FsY3VsYXRlU2Vjb25kc1NpbmNlTWlkbmlnaHQoc2VsZi5jb25maWcubWluVGltZS5nZXRIb3VycygpLCBzZWxmLmNvbmZpZy5taW5UaW1lLmdldE1pbnV0ZXMoKSwgc2VsZi5jb25maWcubWluVGltZS5nZXRTZWNvbmRzKCkpO1xuICAgICAgICAgICAgdmFyIG1heEJvdW5kID0gY2FsY3VsYXRlU2Vjb25kc1NpbmNlTWlkbmlnaHQoc2VsZi5jb25maWcubWF4VGltZS5nZXRIb3VycygpLCBzZWxmLmNvbmZpZy5tYXhUaW1lLmdldE1pbnV0ZXMoKSwgc2VsZi5jb25maWcubWF4VGltZS5nZXRTZWNvbmRzKCkpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gY2FsY3VsYXRlU2Vjb25kc1NpbmNlTWlkbmlnaHQoaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lID4gbWF4Qm91bmQgJiYgY3VycmVudFRpbWUgPCBtaW5Cb3VuZCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBwYXJzZVNlY29uZHMobWluQm91bmQpO1xuICAgICAgICAgICAgICAgIGhvdXJzID0gcmVzdWx0WzBdO1xuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSByZXN1bHRbMV07XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9IHJlc3VsdFsyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChsaW1pdE1heEhvdXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heFRpbWUgPSBzZWxmLmNvbmZpZy5tYXhUaW1lICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyBzZWxmLmNvbmZpZy5tYXhUaW1lXG4gICAgICAgICAgICAgICAgICAgIDogc2VsZi5jb25maWcubWF4RGF0ZTtcbiAgICAgICAgICAgICAgICBob3VycyA9IE1hdGgubWluKGhvdXJzLCBtYXhUaW1lLmdldEhvdXJzKCkpO1xuICAgICAgICAgICAgICAgIGlmIChob3VycyA9PT0gbWF4VGltZS5nZXRIb3VycygpKVxuICAgICAgICAgICAgICAgICAgICBtaW51dGVzID0gTWF0aC5taW4obWludXRlcywgbWF4VGltZS5nZXRNaW51dGVzKCkpO1xuICAgICAgICAgICAgICAgIGlmIChtaW51dGVzID09PSBtYXhUaW1lLmdldE1pbnV0ZXMoKSlcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyA9IE1hdGgubWluKHNlY29uZHMsIG1heFRpbWUuZ2V0U2Vjb25kcygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaW1pdE1pbkhvdXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pblRpbWUgPSBzZWxmLmNvbmZpZy5taW5UaW1lICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyBzZWxmLmNvbmZpZy5taW5UaW1lXG4gICAgICAgICAgICAgICAgICAgIDogc2VsZi5jb25maWcubWluRGF0ZTtcbiAgICAgICAgICAgICAgICBob3VycyA9IE1hdGgubWF4KGhvdXJzLCBtaW5UaW1lLmdldEhvdXJzKCkpO1xuICAgICAgICAgICAgICAgIGlmIChob3VycyA9PT0gbWluVGltZS5nZXRIb3VycygpICYmIG1pbnV0ZXMgPCBtaW5UaW1lLmdldE1pbnV0ZXMoKSlcbiAgICAgICAgICAgICAgICAgICAgbWludXRlcyA9IG1pblRpbWUuZ2V0TWludXRlcygpO1xuICAgICAgICAgICAgICAgIGlmIChtaW51dGVzID09PSBtaW5UaW1lLmdldE1pbnV0ZXMoKSlcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyA9IE1hdGgubWF4KHNlY29uZHMsIG1pblRpbWUuZ2V0U2Vjb25kcygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRIb3Vycyhob3VycywgbWludXRlcywgc2Vjb25kcyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEhvdXJzRnJvbURhdGUoZGF0ZU9iaikge1xuICAgICAgICB2YXIgZGF0ZSA9IGRhdGVPYmogfHwgc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmo7XG4gICAgICAgIGlmIChkYXRlICYmIGRhdGUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICBzZXRIb3VycyhkYXRlLmdldEhvdXJzKCksIGRhdGUuZ2V0TWludXRlcygpLCBkYXRlLmdldFNlY29uZHMoKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0SG91cnMoaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMpIHtcbiAgICAgICAgaWYgKHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqLnNldEhvdXJzKGhvdXJzICUgMjQsIG1pbnV0ZXMsIHNlY29uZHMgfHwgMCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLmhvdXJFbGVtZW50IHx8ICFzZWxmLm1pbnV0ZUVsZW1lbnQgfHwgc2VsZi5pc01vYmlsZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgc2VsZi5ob3VyRWxlbWVudC52YWx1ZSA9IHBhZCghc2VsZi5jb25maWcudGltZV8yNGhyXG4gICAgICAgICAgICA/ICgoMTIgKyBob3VycykgJSAxMikgKyAxMiAqIGludChob3VycyAlIDEyID09PSAwKVxuICAgICAgICAgICAgOiBob3Vycyk7XG4gICAgICAgIHNlbGYubWludXRlRWxlbWVudC52YWx1ZSA9IHBhZChtaW51dGVzKTtcbiAgICAgICAgaWYgKHNlbGYuYW1QTSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgc2VsZi5hbVBNLnRleHRDb250ZW50ID0gc2VsZi5sMTBuLmFtUE1baW50KGhvdXJzID49IDEyKV07XG4gICAgICAgIGlmIChzZWxmLnNlY29uZEVsZW1lbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHNlbGYuc2Vjb25kRWxlbWVudC52YWx1ZSA9IHBhZChzZWNvbmRzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25ZZWFySW5wdXQoZXZlbnQpIHtcbiAgICAgICAgdmFyIGV2ZW50VGFyZ2V0ID0gZ2V0RXZlbnRUYXJnZXQoZXZlbnQpO1xuICAgICAgICB2YXIgeWVhciA9IHBhcnNlSW50KGV2ZW50VGFyZ2V0LnZhbHVlKSArIChldmVudC5kZWx0YSB8fCAwKTtcbiAgICAgICAgaWYgKHllYXIgLyAxMDAwID4gMSB8fFxuICAgICAgICAgICAgKGV2ZW50LmtleSA9PT0gXCJFbnRlclwiICYmICEvW15cXGRdLy50ZXN0KHllYXIudG9TdHJpbmcoKSkpKSB7XG4gICAgICAgICAgICBjaGFuZ2VZZWFyKHllYXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJpbmQoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgICAgICByZXR1cm4gZXZlbnQuZm9yRWFjaChmdW5jdGlvbiAoZXYpIHsgcmV0dXJuIGJpbmQoZWxlbWVudCwgZXYsIGhhbmRsZXIsIG9wdGlvbnMpOyB9KTtcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmZvckVhY2goZnVuY3Rpb24gKGVsKSB7IHJldHVybiBiaW5kKGVsLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7IH0pO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgICAgICBzZWxmLl9oYW5kbGVycy5wdXNoKHtcbiAgICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTsgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyaWdnZXJDaGFuZ2UoKSB7XG4gICAgICAgIHRyaWdnZXJFdmVudChcIm9uQ2hhbmdlXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBiaW5kRXZlbnRzKCkge1xuICAgICAgICBpZiAoc2VsZi5jb25maWcud3JhcCkge1xuICAgICAgICAgICAgW1wib3BlblwiLCBcImNsb3NlXCIsIFwidG9nZ2xlXCIsIFwiY2xlYXJcIl0uZm9yRWFjaChmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChzZWxmLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLVwiICsgZXZ0ICsgXCJdXCIpLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJpbmQoZWwsIFwiY2xpY2tcIiwgc2VsZltldnRdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICBzZXR1cE1vYmlsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZWJvdW5jZWRSZXNpemUgPSBkZWJvdW5jZShvblJlc2l6ZSwgNTApO1xuICAgICAgICBzZWxmLl9kZWJvdW5jZWRDaGFuZ2UgPSBkZWJvdW5jZSh0cmlnZ2VyQ2hhbmdlLCBERUJPVU5DRURfQ0hBTkdFX01TKTtcbiAgICAgICAgaWYgKHNlbGYuZGF5c0NvbnRhaW5lciAmJiAhL2lQaG9uZXxpUGFkfGlQb2QvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKVxuICAgICAgICAgICAgYmluZChzZWxmLmRheXNDb250YWluZXIsIFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIilcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZU92ZXIoZ2V0RXZlbnRUYXJnZXQoZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGJpbmQoc2VsZi5faW5wdXQsIFwia2V5ZG93blwiLCBvbktleURvd24pO1xuICAgICAgICBpZiAoc2VsZi5jYWxlbmRhckNvbnRhaW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBiaW5kKHNlbGYuY2FsZW5kYXJDb250YWluZXIsIFwia2V5ZG93blwiLCBvbktleURvd24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5jb25maWcuaW5saW5lICYmICFzZWxmLmNvbmZpZy5zdGF0aWMpXG4gICAgICAgICAgICBiaW5kKHdpbmRvdywgXCJyZXNpemVcIiwgZGVib3VuY2VkUmVzaXplKTtcbiAgICAgICAgaWYgKHdpbmRvdy5vbnRvdWNoc3RhcnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGJpbmQod2luZG93LmRvY3VtZW50LCBcInRvdWNoc3RhcnRcIiwgZG9jdW1lbnRDbGljayk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJpbmQod2luZG93LmRvY3VtZW50LCBcIm1vdXNlZG93blwiLCBkb2N1bWVudENsaWNrKTtcbiAgICAgICAgYmluZCh3aW5kb3cuZG9jdW1lbnQsIFwiZm9jdXNcIiwgZG9jdW1lbnRDbGljaywgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgICAgICBpZiAoc2VsZi5jb25maWcuY2xpY2tPcGVucyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgYmluZChzZWxmLl9pbnB1dCwgXCJmb2N1c1wiLCBzZWxmLm9wZW4pO1xuICAgICAgICAgICAgYmluZChzZWxmLl9pbnB1dCwgXCJjbGlja1wiLCBzZWxmLm9wZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmRheXNDb250YWluZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYmluZChzZWxmLm1vbnRoTmF2LCBcImNsaWNrXCIsIG9uTW9udGhOYXZDbGljayk7XG4gICAgICAgICAgICBiaW5kKHNlbGYubW9udGhOYXYsIFtcImtleXVwXCIsIFwiaW5jcmVtZW50XCJdLCBvblllYXJJbnB1dCk7XG4gICAgICAgICAgICBiaW5kKHNlbGYuZGF5c0NvbnRhaW5lciwgXCJjbGlja1wiLCBzZWxlY3REYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi50aW1lQ29udGFpbmVyICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHNlbGYubWludXRlRWxlbWVudCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBzZWxmLmhvdXJFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBzZWxUZXh0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0RXZlbnRUYXJnZXQoZSkuc2VsZWN0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYmluZChzZWxmLnRpbWVDb250YWluZXIsIFtcImluY3JlbWVudFwiXSwgdXBkYXRlVGltZSk7XG4gICAgICAgICAgICBiaW5kKHNlbGYudGltZUNvbnRhaW5lciwgXCJibHVyXCIsIHVwZGF0ZVRpbWUsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGJpbmQoc2VsZi50aW1lQ29udGFpbmVyLCBcImNsaWNrXCIsIHRpbWVJbmNyZW1lbnQpO1xuICAgICAgICAgICAgYmluZChbc2VsZi5ob3VyRWxlbWVudCwgc2VsZi5taW51dGVFbGVtZW50XSwgW1wiZm9jdXNcIiwgXCJjbGlja1wiXSwgc2VsVGV4dCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWNvbmRFbGVtZW50ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgYmluZChzZWxmLnNlY29uZEVsZW1lbnQsIFwiZm9jdXNcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5zZWNvbmRFbGVtZW50ICYmIHNlbGYuc2Vjb25kRWxlbWVudC5zZWxlY3QoKTsgfSk7XG4gICAgICAgICAgICBpZiAoc2VsZi5hbVBNICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBiaW5kKHNlbGYuYW1QTSwgXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lKGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5hbGxvd0lucHV0KSB7XG4gICAgICAgICAgICBiaW5kKHNlbGYuX2lucHV0LCBcImJsdXJcIiwgb25CbHVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBqdW1wVG9EYXRlKGp1bXBEYXRlLCB0cmlnZ2VyQ2hhbmdlKSB7XG4gICAgICAgIHZhciBqdW1wVG8gPSBqdW1wRGF0ZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IHNlbGYucGFyc2VEYXRlKGp1bXBEYXRlKVxuICAgICAgICAgICAgOiBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiB8fFxuICAgICAgICAgICAgICAgIChzZWxmLmNvbmZpZy5taW5EYXRlICYmIHNlbGYuY29uZmlnLm1pbkRhdGUgPiBzZWxmLm5vd1xuICAgICAgICAgICAgICAgICAgICA/IHNlbGYuY29uZmlnLm1pbkRhdGVcbiAgICAgICAgICAgICAgICAgICAgOiBzZWxmLmNvbmZpZy5tYXhEYXRlICYmIHNlbGYuY29uZmlnLm1heERhdGUgPCBzZWxmLm5vd1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBzZWxmLmNvbmZpZy5tYXhEYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHNlbGYubm93KTtcbiAgICAgICAgdmFyIG9sZFllYXIgPSBzZWxmLmN1cnJlbnRZZWFyO1xuICAgICAgICB2YXIgb2xkTW9udGggPSBzZWxmLmN1cnJlbnRNb250aDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChqdW1wVG8gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFllYXIgPSBqdW1wVG8uZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRNb250aCA9IGp1bXBUby5nZXRNb250aCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBlLm1lc3NhZ2UgPSBcIkludmFsaWQgZGF0ZSBzdXBwbGllZDogXCIgKyBqdW1wVG87XG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5lcnJvckhhbmRsZXIoZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2UgJiYgc2VsZi5jdXJyZW50WWVhciAhPT0gb2xkWWVhcikge1xuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KFwib25ZZWFyQ2hhbmdlXCIpO1xuICAgICAgICAgICAgYnVpbGRNb250aFN3aXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmlnZ2VyQ2hhbmdlICYmXG4gICAgICAgICAgICAoc2VsZi5jdXJyZW50WWVhciAhPT0gb2xkWWVhciB8fCBzZWxmLmN1cnJlbnRNb250aCAhPT0gb2xkTW9udGgpKSB7XG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnQoXCJvbk1vbnRoQ2hhbmdlXCIpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYucmVkcmF3KCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRpbWVJbmNyZW1lbnQoZSkge1xuICAgICAgICB2YXIgZXZlbnRUYXJnZXQgPSBnZXRFdmVudFRhcmdldChlKTtcbiAgICAgICAgaWYgKH5ldmVudFRhcmdldC5jbGFzc05hbWUuaW5kZXhPZihcImFycm93XCIpKVxuICAgICAgICAgICAgaW5jcmVtZW50TnVtSW5wdXQoZSwgZXZlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYXJyb3dVcFwiKSA/IDEgOiAtMSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluY3JlbWVudE51bUlucHV0KGUsIGRlbHRhLCBpbnB1dEVsZW0pIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUgJiYgZ2V0RXZlbnRUYXJnZXQoZSk7XG4gICAgICAgIHZhciBpbnB1dCA9IGlucHV0RWxlbSB8fFxuICAgICAgICAgICAgKHRhcmdldCAmJiB0YXJnZXQucGFyZW50Tm9kZSAmJiB0YXJnZXQucGFyZW50Tm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgdmFyIGV2ZW50ID0gY3JlYXRlRXZlbnQoXCJpbmNyZW1lbnRcIik7XG4gICAgICAgIGV2ZW50LmRlbHRhID0gZGVsdGE7XG4gICAgICAgIGlucHV0ICYmIGlucHV0LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZCgpIHtcbiAgICAgICAgdmFyIGZyYWdtZW50ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmbGF0cGlja3ItY2FsZW5kYXJcIik7XG4gICAgICAgIHNlbGYuY2FsZW5kYXJDb250YWluZXIudGFiSW5kZXggPSAtMTtcbiAgICAgICAgaWYgKCFzZWxmLmNvbmZpZy5ub0NhbGVuZGFyKSB7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChidWlsZE1vbnRoTmF2KCkpO1xuICAgICAgICAgICAgc2VsZi5pbm5lckNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmbGF0cGlja3ItaW5uZXJDb250YWluZXJcIik7XG4gICAgICAgICAgICBpZiAoc2VsZi5jb25maWcud2Vla051bWJlcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EgPSBidWlsZFdlZWtzKCksIHdlZWtXcmFwcGVyID0gX2Eud2Vla1dyYXBwZXIsIHdlZWtOdW1iZXJzID0gX2Eud2Vla051bWJlcnM7XG4gICAgICAgICAgICAgICAgc2VsZi5pbm5lckNvbnRhaW5lci5hcHBlbmRDaGlsZCh3ZWVrV3JhcHBlcik7XG4gICAgICAgICAgICAgICAgc2VsZi53ZWVrTnVtYmVycyA9IHdlZWtOdW1iZXJzO1xuICAgICAgICAgICAgICAgIHNlbGYud2Vla1dyYXBwZXIgPSB3ZWVrV3JhcHBlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuckNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmbGF0cGlja3ItckNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHNlbGYuckNvbnRhaW5lci5hcHBlbmRDaGlsZChidWlsZFdlZWtkYXlzKCkpO1xuICAgICAgICAgICAgaWYgKCFzZWxmLmRheXNDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRheXNDb250YWluZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLWRheXNcIik7XG4gICAgICAgICAgICAgICAgc2VsZi5kYXlzQ29udGFpbmVyLnRhYkluZGV4ID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidWlsZERheXMoKTtcbiAgICAgICAgICAgIHNlbGYuckNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxmLmRheXNDb250YWluZXIpO1xuICAgICAgICAgICAgc2VsZi5pbm5lckNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxmLnJDb250YWluZXIpO1xuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoc2VsZi5pbm5lckNvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLmVuYWJsZVRpbWUpIHtcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGJ1aWxkVGltZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVDbGFzcyhzZWxmLmNhbGVuZGFyQ29udGFpbmVyLCBcInJhbmdlTW9kZVwiLCBzZWxmLmNvbmZpZy5tb2RlID09PSBcInJhbmdlXCIpO1xuICAgICAgICB0b2dnbGVDbGFzcyhzZWxmLmNhbGVuZGFyQ29udGFpbmVyLCBcImFuaW1hdGVcIiwgc2VsZi5jb25maWcuYW5pbWF0ZSA9PT0gdHJ1ZSk7XG4gICAgICAgIHRvZ2dsZUNsYXNzKHNlbGYuY2FsZW5kYXJDb250YWluZXIsIFwibXVsdGlNb250aFwiLCBzZWxmLmNvbmZpZy5zaG93TW9udGhzID4gMSk7XG4gICAgICAgIHNlbGYuY2FsZW5kYXJDb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICAgICAgICB2YXIgY3VzdG9tQXBwZW5kID0gc2VsZi5jb25maWcuYXBwZW5kVG8gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgc2VsZi5jb25maWcuYXBwZW5kVG8ubm9kZVR5cGUgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLmlubGluZSB8fCBzZWxmLmNvbmZpZy5zdGF0aWMpIHtcbiAgICAgICAgICAgIHNlbGYuY2FsZW5kYXJDb250YWluZXIuY2xhc3NMaXN0LmFkZChzZWxmLmNvbmZpZy5pbmxpbmUgPyBcImlubGluZVwiIDogXCJzdGF0aWNcIik7XG4gICAgICAgICAgICBpZiAoc2VsZi5jb25maWcuaW5saW5lKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjdXN0b21BcHBlbmQgJiYgc2VsZi5lbGVtZW50LnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzZWxmLmNhbGVuZGFyQ29udGFpbmVyLCBzZWxmLl9pbnB1dC5uZXh0U2libGluZyk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5jb25maWcuYXBwZW5kVG8gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcuYXBwZW5kVG8uYXBwZW5kQ2hpbGQoc2VsZi5jYWxlbmRhckNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5jb25maWcuc3RhdGljKSB7XG4gICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLXdyYXBwZXJcIik7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZWxlbWVudC5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgc2VsZi5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHNlbGYuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYWx0SW5wdXQpXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5hbHRJbnB1dCk7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmNhbGVuZGFyQ29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuY29uZmlnLnN0YXRpYyAmJiAhc2VsZi5jb25maWcuaW5saW5lKVxuICAgICAgICAgICAgKHNlbGYuY29uZmlnLmFwcGVuZFRvICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICA/IHNlbGYuY29uZmlnLmFwcGVuZFRvXG4gICAgICAgICAgICAgICAgOiB3aW5kb3cuZG9jdW1lbnQuYm9keSkuYXBwZW5kQ2hpbGQoc2VsZi5jYWxlbmRhckNvbnRhaW5lcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZURheShjbGFzc05hbWUsIGRhdGUsIF9kYXlOdW1iZXIsIGkpIHtcbiAgICAgICAgdmFyIGRhdGVJc0VuYWJsZWQgPSBpc0VuYWJsZWQoZGF0ZSwgdHJ1ZSksIGRheUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KFwic3BhblwiLCBjbGFzc05hbWUsIGRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKCkpO1xuICAgICAgICBkYXlFbGVtZW50LmRhdGVPYmogPSBkYXRlO1xuICAgICAgICBkYXlFbGVtZW50LiRpID0gaTtcbiAgICAgICAgZGF5RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIHNlbGYuZm9ybWF0RGF0ZShkYXRlLCBzZWxmLmNvbmZpZy5hcmlhRGF0ZUZvcm1hdCkpO1xuICAgICAgICBpZiAoY2xhc3NOYW1lLmluZGV4T2YoXCJoaWRkZW5cIikgPT09IC0xICYmXG4gICAgICAgICAgICBjb21wYXJlRGF0ZXMoZGF0ZSwgc2VsZi5ub3cpID09PSAwKSB7XG4gICAgICAgICAgICBzZWxmLnRvZGF5RGF0ZUVsZW0gPSBkYXlFbGVtZW50O1xuICAgICAgICAgICAgZGF5RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidG9kYXlcIik7XG4gICAgICAgICAgICBkYXlFbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiLCBcImRhdGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGVJc0VuYWJsZWQpIHtcbiAgICAgICAgICAgIGRheUVsZW1lbnQudGFiSW5kZXggPSAtMTtcbiAgICAgICAgICAgIGlmIChpc0RhdGVTZWxlY3RlZChkYXRlKSkge1xuICAgICAgICAgICAgICAgIGRheUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWREYXRlRWxlbSA9IGRheUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIikge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVDbGFzcyhkYXlFbGVtZW50LCBcInN0YXJ0UmFuZ2VcIiwgc2VsZi5zZWxlY3RlZERhdGVzWzBdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYXJlRGF0ZXMoZGF0ZSwgc2VsZi5zZWxlY3RlZERhdGVzWzBdLCB0cnVlKSA9PT0gMCk7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUNsYXNzKGRheUVsZW1lbnQsIFwiZW5kUmFuZ2VcIiwgc2VsZi5zZWxlY3RlZERhdGVzWzFdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYXJlRGF0ZXMoZGF0ZSwgc2VsZi5zZWxlY3RlZERhdGVzWzFdLCB0cnVlKSA9PT0gMCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc05hbWUgPT09IFwibmV4dE1vbnRoRGF5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJpblJhbmdlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRheUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImZsYXRwaWNrci1kaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5jb25maWcubW9kZSA9PT0gXCJyYW5nZVwiKSB7XG4gICAgICAgICAgICBpZiAoaXNEYXRlSW5SYW5nZShkYXRlKSAmJiAhaXNEYXRlU2VsZWN0ZWQoZGF0ZSkpXG4gICAgICAgICAgICAgICAgZGF5RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaW5SYW5nZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi53ZWVrTnVtYmVycyAmJlxuICAgICAgICAgICAgc2VsZi5jb25maWcuc2hvd01vbnRocyA9PT0gMSAmJlxuICAgICAgICAgICAgY2xhc3NOYW1lICE9PSBcInByZXZNb250aERheVwiICYmXG4gICAgICAgICAgICBpICUgNyA9PT0gNikge1xuICAgICAgICAgICAgc2VsZi53ZWVrTnVtYmVycy5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgXCI8c3BhbiBjbGFzcz0nZmxhdHBpY2tyLWRheSc+XCIgKyBzZWxmLmNvbmZpZy5nZXRXZWVrKGRhdGUpICsgXCI8L3NwYW4+XCIpO1xuICAgICAgICB9XG4gICAgICAgIHRyaWdnZXJFdmVudChcIm9uRGF5Q3JlYXRlXCIsIGRheUVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gZGF5RWxlbWVudDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZm9jdXNPbkRheUVsZW0odGFyZ2V0Tm9kZSkge1xuICAgICAgICB0YXJnZXROb2RlLmZvY3VzKCk7XG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5tb2RlID09PSBcInJhbmdlXCIpXG4gICAgICAgICAgICBvbk1vdXNlT3Zlcih0YXJnZXROb2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3RBdmFpbGFibGVEYXkoZGVsdGEpIHtcbiAgICAgICAgdmFyIHN0YXJ0TW9udGggPSBkZWx0YSA+IDAgPyAwIDogc2VsZi5jb25maWcuc2hvd01vbnRocyAtIDE7XG4gICAgICAgIHZhciBlbmRNb250aCA9IGRlbHRhID4gMCA/IHNlbGYuY29uZmlnLnNob3dNb250aHMgOiAtMTtcbiAgICAgICAgZm9yICh2YXIgbSA9IHN0YXJ0TW9udGg7IG0gIT0gZW5kTW9udGg7IG0gKz0gZGVsdGEpIHtcbiAgICAgICAgICAgIHZhciBtb250aCA9IHNlbGYuZGF5c0NvbnRhaW5lci5jaGlsZHJlblttXTtcbiAgICAgICAgICAgIHZhciBzdGFydEluZGV4ID0gZGVsdGEgPiAwID8gMCA6IG1vbnRoLmNoaWxkcmVuLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB2YXIgZW5kSW5kZXggPSBkZWx0YSA+IDAgPyBtb250aC5jaGlsZHJlbi5sZW5ndGggOiAtMTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdGFydEluZGV4OyBpICE9IGVuZEluZGV4OyBpICs9IGRlbHRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBtb250aC5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICBpZiAoYy5jbGFzc05hbWUuaW5kZXhPZihcImhpZGRlblwiKSA9PT0gLTEgJiYgaXNFbmFibGVkKGMuZGF0ZU9iaikpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5leHRBdmFpbGFibGVEYXkoY3VycmVudCwgZGVsdGEpIHtcbiAgICAgICAgdmFyIGdpdmVuTW9udGggPSBjdXJyZW50LmNsYXNzTmFtZS5pbmRleE9mKFwiTW9udGhcIikgPT09IC0xXG4gICAgICAgICAgICA/IGN1cnJlbnQuZGF0ZU9iai5nZXRNb250aCgpXG4gICAgICAgICAgICA6IHNlbGYuY3VycmVudE1vbnRoO1xuICAgICAgICB2YXIgZW5kTW9udGggPSBkZWx0YSA+IDAgPyBzZWxmLmNvbmZpZy5zaG93TW9udGhzIDogLTE7XG4gICAgICAgIHZhciBsb29wRGVsdGEgPSBkZWx0YSA+IDAgPyAxIDogLTE7XG4gICAgICAgIGZvciAodmFyIG0gPSBnaXZlbk1vbnRoIC0gc2VsZi5jdXJyZW50TW9udGg7IG0gIT0gZW5kTW9udGg7IG0gKz0gbG9vcERlbHRhKSB7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBzZWxmLmRheXNDb250YWluZXIuY2hpbGRyZW5bbV07XG4gICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IGdpdmVuTW9udGggLSBzZWxmLmN1cnJlbnRNb250aCA9PT0gbVxuICAgICAgICAgICAgICAgID8gY3VycmVudC4kaSArIGRlbHRhXG4gICAgICAgICAgICAgICAgOiBkZWx0YSA8IDBcbiAgICAgICAgICAgICAgICAgICAgPyBtb250aC5jaGlsZHJlbi5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgICAgIDogMDtcbiAgICAgICAgICAgIHZhciBudW1Nb250aERheXMgPSBtb250aC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleDsgaSA+PSAwICYmIGkgPCBudW1Nb250aERheXMgJiYgaSAhPSAoZGVsdGEgPiAwID8gbnVtTW9udGhEYXlzIDogLTEpOyBpICs9IGxvb3BEZWx0YSkge1xuICAgICAgICAgICAgICAgIHZhciBjID0gbW9udGguY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgaWYgKGMuY2xhc3NOYW1lLmluZGV4T2YoXCJoaWRkZW5cIikgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIGlzRW5hYmxlZChjLmRhdGVPYmopICYmXG4gICAgICAgICAgICAgICAgICAgIE1hdGguYWJzKGN1cnJlbnQuJGkgLSBpKSA+PSBNYXRoLmFicyhkZWx0YSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb2N1c09uRGF5RWxlbShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWxmLmNoYW5nZU1vbnRoKGxvb3BEZWx0YSk7XG4gICAgICAgIGZvY3VzT25EYXkoZ2V0Rmlyc3RBdmFpbGFibGVEYXkobG9vcERlbHRhKSwgMCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZvY3VzT25EYXkoY3VycmVudCwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBhY3RpdmVFbGVtZW50ID0gZ2V0Q2xvc2VzdEFjdGl2ZUVsZW1lbnQoKTtcbiAgICAgICAgdmFyIGRheUZvY3VzZWQgPSBpc0luVmlldyhhY3RpdmVFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkpO1xuICAgICAgICB2YXIgc3RhcnRFbGVtID0gY3VycmVudCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGN1cnJlbnRcbiAgICAgICAgICAgIDogZGF5Rm9jdXNlZFxuICAgICAgICAgICAgICAgID8gYWN0aXZlRWxlbWVudFxuICAgICAgICAgICAgICAgIDogc2VsZi5zZWxlY3RlZERhdGVFbGVtICE9PSB1bmRlZmluZWQgJiYgaXNJblZpZXcoc2VsZi5zZWxlY3RlZERhdGVFbGVtKVxuICAgICAgICAgICAgICAgICAgICA/IHNlbGYuc2VsZWN0ZWREYXRlRWxlbVxuICAgICAgICAgICAgICAgICAgICA6IHNlbGYudG9kYXlEYXRlRWxlbSAhPT0gdW5kZWZpbmVkICYmIGlzSW5WaWV3KHNlbGYudG9kYXlEYXRlRWxlbSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gc2VsZi50b2RheURhdGVFbGVtXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGdldEZpcnN0QXZhaWxhYmxlRGF5KG9mZnNldCA+IDAgPyAxIDogLTEpO1xuICAgICAgICBpZiAoc3RhcnRFbGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNlbGYuX2lucHV0LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWRheUZvY3VzZWQpIHtcbiAgICAgICAgICAgIGZvY3VzT25EYXlFbGVtKHN0YXJ0RWxlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXROZXh0QXZhaWxhYmxlRGF5KHN0YXJ0RWxlbSwgb2Zmc2V0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZE1vbnRoRGF5cyh5ZWFyLCBtb250aCkge1xuICAgICAgICB2YXIgZmlyc3RPZk1vbnRoID0gKG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKS5nZXREYXkoKSAtIHNlbGYubDEwbi5maXJzdERheU9mV2VlayArIDcpICUgNztcbiAgICAgICAgdmFyIHByZXZNb250aERheXMgPSBzZWxmLnV0aWxzLmdldERheXNJbk1vbnRoKChtb250aCAtIDEgKyAxMikgJSAxMiwgeWVhcik7XG4gICAgICAgIHZhciBkYXlzSW5Nb250aCA9IHNlbGYudXRpbHMuZ2V0RGF5c0luTW9udGgobW9udGgsIHllYXIpLCBkYXlzID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSwgaXNNdWx0aU1vbnRoID0gc2VsZi5jb25maWcuc2hvd01vbnRocyA+IDEsIHByZXZNb250aERheUNsYXNzID0gaXNNdWx0aU1vbnRoID8gXCJwcmV2TW9udGhEYXkgaGlkZGVuXCIgOiBcInByZXZNb250aERheVwiLCBuZXh0TW9udGhEYXlDbGFzcyA9IGlzTXVsdGlNb250aCA/IFwibmV4dE1vbnRoRGF5IGhpZGRlblwiIDogXCJuZXh0TW9udGhEYXlcIjtcbiAgICAgICAgdmFyIGRheU51bWJlciA9IHByZXZNb250aERheXMgKyAxIC0gZmlyc3RPZk1vbnRoLCBkYXlJbmRleCA9IDA7XG4gICAgICAgIGZvciAoOyBkYXlOdW1iZXIgPD0gcHJldk1vbnRoRGF5czsgZGF5TnVtYmVyKyssIGRheUluZGV4KyspIHtcbiAgICAgICAgICAgIGRheXMuYXBwZW5kQ2hpbGQoY3JlYXRlRGF5KFwiZmxhdHBpY2tyLWRheSBcIiArIHByZXZNb250aERheUNsYXNzLCBuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheU51bWJlciksIGRheU51bWJlciwgZGF5SW5kZXgpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGRheU51bWJlciA9IDE7IGRheU51bWJlciA8PSBkYXlzSW5Nb250aDsgZGF5TnVtYmVyKyssIGRheUluZGV4KyspIHtcbiAgICAgICAgICAgIGRheXMuYXBwZW5kQ2hpbGQoY3JlYXRlRGF5KFwiZmxhdHBpY2tyLWRheVwiLCBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF5TnVtYmVyKSwgZGF5TnVtYmVyLCBkYXlJbmRleCkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGRheU51bSA9IGRheXNJbk1vbnRoICsgMTsgZGF5TnVtIDw9IDQyIC0gZmlyc3RPZk1vbnRoICYmXG4gICAgICAgICAgICAoc2VsZi5jb25maWcuc2hvd01vbnRocyA9PT0gMSB8fCBkYXlJbmRleCAlIDcgIT09IDApOyBkYXlOdW0rKywgZGF5SW5kZXgrKykge1xuICAgICAgICAgICAgZGF5cy5hcHBlbmRDaGlsZChjcmVhdGVEYXkoXCJmbGF0cGlja3ItZGF5IFwiICsgbmV4dE1vbnRoRGF5Q2xhc3MsIG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgZGF5TnVtICUgZGF5c0luTW9udGgpLCBkYXlOdW0sIGRheUluZGV4KSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheUNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJkYXlDb250YWluZXJcIik7XG4gICAgICAgIGRheUNvbnRhaW5lci5hcHBlbmRDaGlsZChkYXlzKTtcbiAgICAgICAgcmV0dXJuIGRheUNvbnRhaW5lcjtcbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGREYXlzKCkge1xuICAgICAgICBpZiAoc2VsZi5kYXlzQ29udGFpbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjbGVhck5vZGUoc2VsZi5kYXlzQ29udGFpbmVyKTtcbiAgICAgICAgaWYgKHNlbGYud2Vla051bWJlcnMpXG4gICAgICAgICAgICBjbGVhck5vZGUoc2VsZi53ZWVrTnVtYmVycyk7XG4gICAgICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuY29uZmlnLnNob3dNb250aHM7IGkrKykge1xuICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLmN1cnJlbnRZZWFyLCBzZWxmLmN1cnJlbnRNb250aCwgMSk7XG4gICAgICAgICAgICBkLnNldE1vbnRoKHNlbGYuY3VycmVudE1vbnRoICsgaSk7XG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGJ1aWxkTW9udGhEYXlzKGQuZ2V0RnVsbFllYXIoKSwgZC5nZXRNb250aCgpKSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5kYXlzQ29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWcpO1xuICAgICAgICBzZWxmLmRheXMgPSBzZWxmLmRheXNDb250YWluZXIuZmlyc3RDaGlsZDtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIiAmJiBzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBvbk1vdXNlT3ZlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkTW9udGhTd2l0Y2goKSB7XG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5zaG93TW9udGhzID4gMSB8fFxuICAgICAgICAgICAgc2VsZi5jb25maWcubW9udGhTZWxlY3RvclR5cGUgIT09IFwiZHJvcGRvd25cIilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIHNob3VsZEJ1aWxkTW9udGggPSBmdW5jdGlvbiAobW9udGgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5taW5EYXRlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRZZWFyID09PSBzZWxmLmNvbmZpZy5taW5EYXRlLmdldEZ1bGxZZWFyKCkgJiZcbiAgICAgICAgICAgICAgICBtb250aCA8IHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0TW9udGgoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAhKHNlbGYuY29uZmlnLm1heERhdGUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFllYXIgPT09IHNlbGYuY29uZmlnLm1heERhdGUuZ2V0RnVsbFllYXIoKSAmJlxuICAgICAgICAgICAgICAgIG1vbnRoID4gc2VsZi5jb25maWcubWF4RGF0ZS5nZXRNb250aCgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5tb250aHNEcm9wZG93bkNvbnRhaW5lci50YWJJbmRleCA9IC0xO1xuICAgICAgICBzZWxmLm1vbnRoc0Ryb3Bkb3duQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgaWYgKCFzaG91bGRCdWlsZE1vbnRoKGkpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gY3JlYXRlRWxlbWVudChcIm9wdGlvblwiLCBcImZsYXRwaWNrci1tb250aERyb3Bkb3duLW1vbnRoXCIpO1xuICAgICAgICAgICAgbW9udGgudmFsdWUgPSBuZXcgRGF0ZShzZWxmLmN1cnJlbnRZZWFyLCBpKS5nZXRNb250aCgpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBtb250aC50ZXh0Q29udGVudCA9IG1vbnRoVG9TdHIoaSwgc2VsZi5jb25maWcuc2hvcnRoYW5kQ3VycmVudE1vbnRoLCBzZWxmLmwxMG4pO1xuICAgICAgICAgICAgbW9udGgudGFiSW5kZXggPSAtMTtcbiAgICAgICAgICAgIGlmIChzZWxmLmN1cnJlbnRNb250aCA9PT0gaSkge1xuICAgICAgICAgICAgICAgIG1vbnRoLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYubW9udGhzRHJvcGRvd25Db250YWluZXIuYXBwZW5kQ2hpbGQobW9udGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkTW9udGgoKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLW1vbnRoXCIpO1xuICAgICAgICB2YXIgbW9udGhOYXZGcmFnbWVudCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIHZhciBtb250aEVsZW1lbnQ7XG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5zaG93TW9udGhzID4gMSB8fFxuICAgICAgICAgICAgc2VsZi5jb25maWcubW9udGhTZWxlY3RvclR5cGUgPT09IFwic3RhdGljXCIpIHtcbiAgICAgICAgICAgIG1vbnRoRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIFwiY3VyLW1vbnRoXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5tb250aHNEcm9wZG93bkNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIiwgXCJmbGF0cGlja3ItbW9udGhEcm9wZG93bi1tb250aHNcIik7XG4gICAgICAgICAgICBzZWxmLm1vbnRoc0Ryb3Bkb3duQ29udGFpbmVyLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgc2VsZi5sMTBuLm1vbnRoQXJpYUxhYmVsKTtcbiAgICAgICAgICAgIGJpbmQoc2VsZi5tb250aHNEcm9wZG93bkNvbnRhaW5lciwgXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZ2V0RXZlbnRUYXJnZXQoZSk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkTW9udGggPSBwYXJzZUludCh0YXJnZXQudmFsdWUsIDEwKTtcbiAgICAgICAgICAgICAgICBzZWxmLmNoYW5nZU1vbnRoKHNlbGVjdGVkTW9udGggLSBzZWxmLmN1cnJlbnRNb250aCk7XG4gICAgICAgICAgICAgICAgdHJpZ2dlckV2ZW50KFwib25Nb250aENoYW5nZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnVpbGRNb250aFN3aXRjaCgpO1xuICAgICAgICAgICAgbW9udGhFbGVtZW50ID0gc2VsZi5tb250aHNEcm9wZG93bkNvbnRhaW5lcjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgeWVhcklucHV0ID0gY3JlYXRlTnVtYmVySW5wdXQoXCJjdXIteWVhclwiLCB7IHRhYmluZGV4OiBcIi0xXCIgfSk7XG4gICAgICAgIHZhciB5ZWFyRWxlbWVudCA9IHllYXJJbnB1dC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdO1xuICAgICAgICB5ZWFyRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIHNlbGYubDEwbi55ZWFyQXJpYUxhYmVsKTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1pbkRhdGUpIHtcbiAgICAgICAgICAgIHllYXJFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1pblwiLCBzZWxmLmNvbmZpZy5taW5EYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1heERhdGUpIHtcbiAgICAgICAgICAgIHllYXJFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1heFwiLCBzZWxmLmNvbmZpZy5tYXhEYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB5ZWFyRWxlbWVudC5kaXNhYmxlZCA9XG4gICAgICAgICAgICAgICAgISFzZWxmLmNvbmZpZy5taW5EYXRlICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0RnVsbFllYXIoKSA9PT0gc2VsZi5jb25maWcubWF4RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJyZW50TW9udGggPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLWN1cnJlbnQtbW9udGhcIik7XG4gICAgICAgIGN1cnJlbnRNb250aC5hcHBlbmRDaGlsZChtb250aEVsZW1lbnQpO1xuICAgICAgICBjdXJyZW50TW9udGguYXBwZW5kQ2hpbGQoeWVhcklucHV0KTtcbiAgICAgICAgbW9udGhOYXZGcmFnbWVudC5hcHBlbmRDaGlsZChjdXJyZW50TW9udGgpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobW9udGhOYXZGcmFnbWVudCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICAgICAgICAgIHllYXJFbGVtZW50OiB5ZWFyRWxlbWVudCxcbiAgICAgICAgICAgIG1vbnRoRWxlbWVudDogbW9udGhFbGVtZW50LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZE1vbnRocygpIHtcbiAgICAgICAgY2xlYXJOb2RlKHNlbGYubW9udGhOYXYpO1xuICAgICAgICBzZWxmLm1vbnRoTmF2LmFwcGVuZENoaWxkKHNlbGYucHJldk1vbnRoTmF2KTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnNob3dNb250aHMpIHtcbiAgICAgICAgICAgIHNlbGYueWVhckVsZW1lbnRzID0gW107XG4gICAgICAgICAgICBzZWxmLm1vbnRoRWxlbWVudHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBtID0gc2VsZi5jb25maWcuc2hvd01vbnRoczsgbS0tOykge1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gYnVpbGRNb250aCgpO1xuICAgICAgICAgICAgc2VsZi55ZWFyRWxlbWVudHMucHVzaChtb250aC55ZWFyRWxlbWVudCk7XG4gICAgICAgICAgICBzZWxmLm1vbnRoRWxlbWVudHMucHVzaChtb250aC5tb250aEVsZW1lbnQpO1xuICAgICAgICAgICAgc2VsZi5tb250aE5hdi5hcHBlbmRDaGlsZChtb250aC5jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYubW9udGhOYXYuYXBwZW5kQ2hpbGQoc2VsZi5uZXh0TW9udGhOYXYpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZE1vbnRoTmF2KCkge1xuICAgICAgICBzZWxmLm1vbnRoTmF2ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZsYXRwaWNrci1tb250aHNcIik7XG4gICAgICAgIHNlbGYueWVhckVsZW1lbnRzID0gW107XG4gICAgICAgIHNlbGYubW9udGhFbGVtZW50cyA9IFtdO1xuICAgICAgICBzZWxmLnByZXZNb250aE5hdiA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIFwiZmxhdHBpY2tyLXByZXYtbW9udGhcIik7XG4gICAgICAgIHNlbGYucHJldk1vbnRoTmF2LmlubmVySFRNTCA9IHNlbGYuY29uZmlnLnByZXZBcnJvdztcbiAgICAgICAgc2VsZi5uZXh0TW9udGhOYXYgPSBjcmVhdGVFbGVtZW50KFwic3BhblwiLCBcImZsYXRwaWNrci1uZXh0LW1vbnRoXCIpO1xuICAgICAgICBzZWxmLm5leHRNb250aE5hdi5pbm5lckhUTUwgPSBzZWxmLmNvbmZpZy5uZXh0QXJyb3c7XG4gICAgICAgIGJ1aWxkTW9udGhzKCk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCBcIl9oaWRlUHJldk1vbnRoQXJyb3dcIiwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLl9faGlkZVByZXZNb250aEFycm93OyB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoYm9vbCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLl9faGlkZVByZXZNb250aEFycm93ICE9PSBib29sKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUNsYXNzKHNlbGYucHJldk1vbnRoTmF2LCBcImZsYXRwaWNrci1kaXNhYmxlZFwiLCBib29sKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fX2hpZGVQcmV2TW9udGhBcnJvdyA9IGJvb2w7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCBcIl9oaWRlTmV4dE1vbnRoQXJyb3dcIiwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLl9faGlkZU5leHRNb250aEFycm93OyB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoYm9vbCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLl9faGlkZU5leHRNb250aEFycm93ICE9PSBib29sKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUNsYXNzKHNlbGYubmV4dE1vbnRoTmF2LCBcImZsYXRwaWNrci1kaXNhYmxlZFwiLCBib29sKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fX2hpZGVOZXh0TW9udGhBcnJvdyA9IGJvb2w7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHNlbGYuY3VycmVudFllYXJFbGVtZW50ID0gc2VsZi55ZWFyRWxlbWVudHNbMF07XG4gICAgICAgIHVwZGF0ZU5hdmlnYXRpb25DdXJyZW50TW9udGgoKTtcbiAgICAgICAgcmV0dXJuIHNlbGYubW9udGhOYXY7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkVGltZSgpIHtcbiAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaGFzVGltZVwiKTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm5vQ2FsZW5kYXIpXG4gICAgICAgICAgICBzZWxmLmNhbGVuZGFyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJub0NhbGVuZGFyXCIpO1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSBnZXREZWZhdWx0SG91cnMoc2VsZi5jb25maWcpO1xuICAgICAgICBzZWxmLnRpbWVDb250YWluZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLXRpbWVcIik7XG4gICAgICAgIHNlbGYudGltZUNvbnRhaW5lci50YWJJbmRleCA9IC0xO1xuICAgICAgICB2YXIgc2VwYXJhdG9yID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgXCJmbGF0cGlja3ItdGltZS1zZXBhcmF0b3JcIiwgXCI6XCIpO1xuICAgICAgICB2YXIgaG91cklucHV0ID0gY3JlYXRlTnVtYmVySW5wdXQoXCJmbGF0cGlja3ItaG91clwiLCB7XG4gICAgICAgICAgICBcImFyaWEtbGFiZWxcIjogc2VsZi5sMTBuLmhvdXJBcmlhTGFiZWwsXG4gICAgICAgIH0pO1xuICAgICAgICBzZWxmLmhvdXJFbGVtZW50ID0gaG91cklucHV0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF07XG4gICAgICAgIHZhciBtaW51dGVJbnB1dCA9IGNyZWF0ZU51bWJlcklucHV0KFwiZmxhdHBpY2tyLW1pbnV0ZVwiLCB7XG4gICAgICAgICAgICBcImFyaWEtbGFiZWxcIjogc2VsZi5sMTBuLm1pbnV0ZUFyaWFMYWJlbCxcbiAgICAgICAgfSk7XG4gICAgICAgIHNlbGYubWludXRlRWxlbWVudCA9IG1pbnV0ZUlucHV0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF07XG4gICAgICAgIHNlbGYuaG91ckVsZW1lbnQudGFiSW5kZXggPSBzZWxmLm1pbnV0ZUVsZW1lbnQudGFiSW5kZXggPSAtMTtcbiAgICAgICAgc2VsZi5ob3VyRWxlbWVudC52YWx1ZSA9IHBhZChzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9ialxuICAgICAgICAgICAgPyBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iai5nZXRIb3VycygpXG4gICAgICAgICAgICA6IHNlbGYuY29uZmlnLnRpbWVfMjRoclxuICAgICAgICAgICAgICAgID8gZGVmYXVsdHMuaG91cnNcbiAgICAgICAgICAgICAgICA6IG1pbGl0YXJ5MmFtcG0oZGVmYXVsdHMuaG91cnMpKTtcbiAgICAgICAgc2VsZi5taW51dGVFbGVtZW50LnZhbHVlID0gcGFkKHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqXG4gICAgICAgICAgICA/IHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqLmdldE1pbnV0ZXMoKVxuICAgICAgICAgICAgOiBkZWZhdWx0cy5taW51dGVzKTtcbiAgICAgICAgc2VsZi5ob3VyRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJzdGVwXCIsIHNlbGYuY29uZmlnLmhvdXJJbmNyZW1lbnQudG9TdHJpbmcoKSk7XG4gICAgICAgIHNlbGYubWludXRlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJzdGVwXCIsIHNlbGYuY29uZmlnLm1pbnV0ZUluY3JlbWVudC50b1N0cmluZygpKTtcbiAgICAgICAgc2VsZi5ob3VyRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtaW5cIiwgc2VsZi5jb25maWcudGltZV8yNGhyID8gXCIwXCIgOiBcIjFcIik7XG4gICAgICAgIHNlbGYuaG91ckVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWF4XCIsIHNlbGYuY29uZmlnLnRpbWVfMjRociA/IFwiMjNcIiA6IFwiMTJcIik7XG4gICAgICAgIHNlbGYuaG91ckVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWF4bGVuZ3RoXCIsIFwiMlwiKTtcbiAgICAgICAgc2VsZi5taW51dGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1pblwiLCBcIjBcIik7XG4gICAgICAgIHNlbGYubWludXRlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtYXhcIiwgXCI1OVwiKTtcbiAgICAgICAgc2VsZi5taW51dGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1heGxlbmd0aFwiLCBcIjJcIik7XG4gICAgICAgIHNlbGYudGltZUNvbnRhaW5lci5hcHBlbmRDaGlsZChob3VySW5wdXQpO1xuICAgICAgICBzZWxmLnRpbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoc2VwYXJhdG9yKTtcbiAgICAgICAgc2VsZi50aW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKG1pbnV0ZUlucHV0KTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRpbWVfMjRocilcbiAgICAgICAgICAgIHNlbGYudGltZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidGltZTI0aHJcIik7XG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5lbmFibGVTZWNvbmRzKSB7XG4gICAgICAgICAgICBzZWxmLnRpbWVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImhhc1NlY29uZHNcIik7XG4gICAgICAgICAgICB2YXIgc2Vjb25kSW5wdXQgPSBjcmVhdGVOdW1iZXJJbnB1dChcImZsYXRwaWNrci1zZWNvbmRcIik7XG4gICAgICAgICAgICBzZWxmLnNlY29uZEVsZW1lbnQgPSBzZWNvbmRJbnB1dC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdO1xuICAgICAgICAgICAgc2VsZi5zZWNvbmRFbGVtZW50LnZhbHVlID0gcGFkKHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqXG4gICAgICAgICAgICAgICAgPyBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iai5nZXRTZWNvbmRzKClcbiAgICAgICAgICAgICAgICA6IGRlZmF1bHRzLnNlY29uZHMpO1xuICAgICAgICAgICAgc2VsZi5zZWNvbmRFbGVtZW50LnNldEF0dHJpYnV0ZShcInN0ZXBcIiwgc2VsZi5taW51dGVFbGVtZW50LmdldEF0dHJpYnV0ZShcInN0ZXBcIikpO1xuICAgICAgICAgICAgc2VsZi5zZWNvbmRFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1pblwiLCBcIjBcIik7XG4gICAgICAgICAgICBzZWxmLnNlY29uZEVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWF4XCIsIFwiNTlcIik7XG4gICAgICAgICAgICBzZWxmLnNlY29uZEVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWF4bGVuZ3RoXCIsIFwiMlwiKTtcbiAgICAgICAgICAgIHNlbGYudGltZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjcmVhdGVFbGVtZW50KFwic3BhblwiLCBcImZsYXRwaWNrci10aW1lLXNlcGFyYXRvclwiLCBcIjpcIikpO1xuICAgICAgICAgICAgc2VsZi50aW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHNlY29uZElucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuY29uZmlnLnRpbWVfMjRocikge1xuICAgICAgICAgICAgc2VsZi5hbVBNID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgXCJmbGF0cGlja3ItYW0tcG1cIiwgc2VsZi5sMTBuLmFtUE1baW50KChzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9ialxuICAgICAgICAgICAgICAgID8gc2VsZi5ob3VyRWxlbWVudC52YWx1ZVxuICAgICAgICAgICAgICAgIDogc2VsZi5jb25maWcuZGVmYXVsdEhvdXIpID4gMTEpXSk7XG4gICAgICAgICAgICBzZWxmLmFtUE0udGl0bGUgPSBzZWxmLmwxMG4udG9nZ2xlVGl0bGU7XG4gICAgICAgICAgICBzZWxmLmFtUE0udGFiSW5kZXggPSAtMTtcbiAgICAgICAgICAgIHNlbGYudGltZUNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxmLmFtUE0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxmLnRpbWVDb250YWluZXI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkV2Vla2RheXMoKSB7XG4gICAgICAgIGlmICghc2VsZi53ZWVrZGF5Q29udGFpbmVyKVxuICAgICAgICAgICAgc2VsZi53ZWVrZGF5Q29udGFpbmVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZsYXRwaWNrci13ZWVrZGF5c1wiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2xlYXJOb2RlKHNlbGYud2Vla2RheUNvbnRhaW5lcik7XG4gICAgICAgIGZvciAodmFyIGkgPSBzZWxmLmNvbmZpZy5zaG93TW9udGhzOyBpLS07KSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZsYXRwaWNrci13ZWVrZGF5Y29udGFpbmVyXCIpO1xuICAgICAgICAgICAgc2VsZi53ZWVrZGF5Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlV2Vla2RheXMoKTtcbiAgICAgICAgcmV0dXJuIHNlbGYud2Vla2RheUNvbnRhaW5lcjtcbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlV2Vla2RheXMoKSB7XG4gICAgICAgIGlmICghc2VsZi53ZWVrZGF5Q29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZpcnN0RGF5T2ZXZWVrID0gc2VsZi5sMTBuLmZpcnN0RGF5T2ZXZWVrO1xuICAgICAgICB2YXIgd2Vla2RheXMgPSBfX3NwcmVhZEFycmF5cyhzZWxmLmwxMG4ud2Vla2RheXMuc2hvcnRoYW5kKTtcbiAgICAgICAgaWYgKGZpcnN0RGF5T2ZXZWVrID4gMCAmJiBmaXJzdERheU9mV2VlayA8IHdlZWtkYXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgd2Vla2RheXMgPSBfX3NwcmVhZEFycmF5cyh3ZWVrZGF5cy5zcGxpY2UoZmlyc3REYXlPZldlZWssIHdlZWtkYXlzLmxlbmd0aCksIHdlZWtkYXlzLnNwbGljZSgwLCBmaXJzdERheU9mV2VlaykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSBzZWxmLmNvbmZpZy5zaG93TW9udGhzOyBpLS07KSB7XG4gICAgICAgICAgICBzZWxmLndlZWtkYXlDb250YWluZXIuY2hpbGRyZW5baV0uaW5uZXJIVE1MID0gXCJcXG4gICAgICA8c3BhbiBjbGFzcz0nZmxhdHBpY2tyLXdlZWtkYXknPlxcbiAgICAgICAgXCIgKyB3ZWVrZGF5cy5qb2luKFwiPC9zcGFuPjxzcGFuIGNsYXNzPSdmbGF0cGlja3Itd2Vla2RheSc+XCIpICsgXCJcXG4gICAgICA8L3NwYW4+XFxuICAgICAgXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRXZWVrcygpIHtcbiAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaGFzV2Vla3NcIik7XG4gICAgICAgIHZhciB3ZWVrV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmbGF0cGlja3Itd2Vla3dyYXBwZXJcIik7XG4gICAgICAgIHdlZWtXcmFwcGVyLmFwcGVuZENoaWxkKGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIFwiZmxhdHBpY2tyLXdlZWtkYXlcIiwgc2VsZi5sMTBuLndlZWtBYmJyZXZpYXRpb24pKTtcbiAgICAgICAgdmFyIHdlZWtOdW1iZXJzID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZsYXRwaWNrci13ZWVrc1wiKTtcbiAgICAgICAgd2Vla1dyYXBwZXIuYXBwZW5kQ2hpbGQod2Vla051bWJlcnMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2Vla1dyYXBwZXI6IHdlZWtXcmFwcGVyLFxuICAgICAgICAgICAgd2Vla051bWJlcnM6IHdlZWtOdW1iZXJzLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGFuZ2VNb250aCh2YWx1ZSwgaXNPZmZzZXQpIHtcbiAgICAgICAgaWYgKGlzT2Zmc2V0ID09PSB2b2lkIDApIHsgaXNPZmZzZXQgPSB0cnVlOyB9XG4gICAgICAgIHZhciBkZWx0YSA9IGlzT2Zmc2V0ID8gdmFsdWUgOiB2YWx1ZSAtIHNlbGYuY3VycmVudE1vbnRoO1xuICAgICAgICBpZiAoKGRlbHRhIDwgMCAmJiBzZWxmLl9oaWRlUHJldk1vbnRoQXJyb3cgPT09IHRydWUpIHx8XG4gICAgICAgICAgICAoZGVsdGEgPiAwICYmIHNlbGYuX2hpZGVOZXh0TW9udGhBcnJvdyA9PT0gdHJ1ZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHNlbGYuY3VycmVudE1vbnRoICs9IGRlbHRhO1xuICAgICAgICBpZiAoc2VsZi5jdXJyZW50TW9udGggPCAwIHx8IHNlbGYuY3VycmVudE1vbnRoID4gMTEpIHtcbiAgICAgICAgICAgIHNlbGYuY3VycmVudFllYXIgKz0gc2VsZi5jdXJyZW50TW9udGggPiAxMSA/IDEgOiAtMTtcbiAgICAgICAgICAgIHNlbGYuY3VycmVudE1vbnRoID0gKHNlbGYuY3VycmVudE1vbnRoICsgMTIpICUgMTI7XG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnQoXCJvblllYXJDaGFuZ2VcIik7XG4gICAgICAgICAgICBidWlsZE1vbnRoU3dpdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnVpbGREYXlzKCk7XG4gICAgICAgIHRyaWdnZXJFdmVudChcIm9uTW9udGhDaGFuZ2VcIik7XG4gICAgICAgIHVwZGF0ZU5hdmlnYXRpb25DdXJyZW50TW9udGgoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYXIodHJpZ2dlckNoYW5nZUV2ZW50LCB0b0luaXRpYWwpIHtcbiAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2VFdmVudCA9PT0gdm9pZCAwKSB7IHRyaWdnZXJDaGFuZ2VFdmVudCA9IHRydWU7IH1cbiAgICAgICAgaWYgKHRvSW5pdGlhbCA9PT0gdm9pZCAwKSB7IHRvSW5pdGlhbCA9IHRydWU7IH1cbiAgICAgICAgc2VsZi5pbnB1dC52YWx1ZSA9IFwiXCI7XG4gICAgICAgIGlmIChzZWxmLmFsdElucHV0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBzZWxmLmFsdElucHV0LnZhbHVlID0gXCJcIjtcbiAgICAgICAgaWYgKHNlbGYubW9iaWxlSW5wdXQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHNlbGYubW9iaWxlSW5wdXQudmFsdWUgPSBcIlwiO1xuICAgICAgICBzZWxmLnNlbGVjdGVkRGF0ZXMgPSBbXTtcbiAgICAgICAgc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmogPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh0b0luaXRpYWwgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNlbGYuY3VycmVudFllYXIgPSBzZWxmLl9pbml0aWFsRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgc2VsZi5jdXJyZW50TW9udGggPSBzZWxmLl9pbml0aWFsRGF0ZS5nZXRNb250aCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5lbmFibGVUaW1lID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgX2EgPSBnZXREZWZhdWx0SG91cnMoc2VsZi5jb25maWcpLCBob3VycyA9IF9hLmhvdXJzLCBtaW51dGVzID0gX2EubWludXRlcywgc2Vjb25kcyA9IF9hLnNlY29uZHM7XG4gICAgICAgICAgICBzZXRIb3Vycyhob3VycywgbWludXRlcywgc2Vjb25kcyk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5yZWRyYXcoKTtcbiAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2VFdmVudClcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChcIm9uQ2hhbmdlXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgc2VsZi5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgaWYgKCFzZWxmLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5jYWxlbmRhckNvbnRhaW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwib3BlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLl9pbnB1dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5faW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0cmlnZ2VyRXZlbnQoXCJvbkNsb3NlXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICBpZiAoc2VsZi5jb25maWcgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChcIm9uRGVzdHJveVwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IHNlbGYuX2hhbmRsZXJzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgc2VsZi5faGFuZGxlcnNbaV0ucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5faGFuZGxlcnMgPSBbXTtcbiAgICAgICAgaWYgKHNlbGYubW9iaWxlSW5wdXQpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm1vYmlsZUlucHV0LnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgc2VsZi5tb2JpbGVJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubW9iaWxlSW5wdXQpO1xuICAgICAgICAgICAgc2VsZi5tb2JpbGVJbnB1dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWxmLmNhbGVuZGFyQ29udGFpbmVyICYmIHNlbGYuY2FsZW5kYXJDb250YWluZXIucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLnN0YXRpYyAmJiBzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IHNlbGYuY2FsZW5kYXJDb250YWluZXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmxhc3RDaGlsZCAmJiB3cmFwcGVyLnJlbW92ZUNoaWxkKHdyYXBwZXIubGFzdENoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAod3JhcHBlci5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh3cmFwcGVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIuZmlyc3RDaGlsZCwgd3JhcHBlcik7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYuY2FsZW5kYXJDb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmFsdElucHV0KSB7XG4gICAgICAgICAgICBzZWxmLmlucHV0LnR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgICAgIGlmIChzZWxmLmFsdElucHV0LnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgc2VsZi5hbHRJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYuYWx0SW5wdXQpO1xuICAgICAgICAgICAgZGVsZXRlIHNlbGYuYWx0SW5wdXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuaW5wdXQpIHtcbiAgICAgICAgICAgIHNlbGYuaW5wdXQudHlwZSA9IHNlbGYuaW5wdXQuX3R5cGU7XG4gICAgICAgICAgICBzZWxmLmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJmbGF0cGlja3ItaW5wdXRcIik7XG4gICAgICAgICAgICBzZWxmLmlucHV0LnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xuICAgICAgICB9XG4gICAgICAgIFtcbiAgICAgICAgICAgIFwiX3Nob3dUaW1lSW5wdXRcIixcbiAgICAgICAgICAgIFwibGF0ZXN0U2VsZWN0ZWREYXRlT2JqXCIsXG4gICAgICAgICAgICBcIl9oaWRlTmV4dE1vbnRoQXJyb3dcIixcbiAgICAgICAgICAgIFwiX2hpZGVQcmV2TW9udGhBcnJvd1wiLFxuICAgICAgICAgICAgXCJfX2hpZGVOZXh0TW9udGhBcnJvd1wiLFxuICAgICAgICAgICAgXCJfX2hpZGVQcmV2TW9udGhBcnJvd1wiLFxuICAgICAgICAgICAgXCJpc01vYmlsZVwiLFxuICAgICAgICAgICAgXCJpc09wZW5cIixcbiAgICAgICAgICAgIFwic2VsZWN0ZWREYXRlRWxlbVwiLFxuICAgICAgICAgICAgXCJtaW5EYXRlSGFzVGltZVwiLFxuICAgICAgICAgICAgXCJtYXhEYXRlSGFzVGltZVwiLFxuICAgICAgICAgICAgXCJkYXlzXCIsXG4gICAgICAgICAgICBcImRheXNDb250YWluZXJcIixcbiAgICAgICAgICAgIFwiX2lucHV0XCIsXG4gICAgICAgICAgICBcIl9wb3NpdGlvbkVsZW1lbnRcIixcbiAgICAgICAgICAgIFwiaW5uZXJDb250YWluZXJcIixcbiAgICAgICAgICAgIFwickNvbnRhaW5lclwiLFxuICAgICAgICAgICAgXCJtb250aE5hdlwiLFxuICAgICAgICAgICAgXCJ0b2RheURhdGVFbGVtXCIsXG4gICAgICAgICAgICBcImNhbGVuZGFyQ29udGFpbmVyXCIsXG4gICAgICAgICAgICBcIndlZWtkYXlDb250YWluZXJcIixcbiAgICAgICAgICAgIFwicHJldk1vbnRoTmF2XCIsXG4gICAgICAgICAgICBcIm5leHRNb250aE5hdlwiLFxuICAgICAgICAgICAgXCJtb250aHNEcm9wZG93bkNvbnRhaW5lclwiLFxuICAgICAgICAgICAgXCJjdXJyZW50TW9udGhFbGVtZW50XCIsXG4gICAgICAgICAgICBcImN1cnJlbnRZZWFyRWxlbWVudFwiLFxuICAgICAgICAgICAgXCJuYXZpZ2F0aW9uQ3VycmVudE1vbnRoXCIsXG4gICAgICAgICAgICBcInNlbGVjdGVkRGF0ZUVsZW1cIixcbiAgICAgICAgICAgIFwiY29uZmlnXCIsXG4gICAgICAgIF0uZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgc2VsZltrXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfKSB7IH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzQ2FsZW5kYXJFbGVtKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2FsZW5kYXJDb250YWluZXIuY29udGFpbnMoZWxlbSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRvY3VtZW50Q2xpY2soZSkge1xuICAgICAgICBpZiAoc2VsZi5pc09wZW4gJiYgIXNlbGYuY29uZmlnLmlubGluZSkge1xuICAgICAgICAgICAgdmFyIGV2ZW50VGFyZ2V0XzEgPSBnZXRFdmVudFRhcmdldChlKTtcbiAgICAgICAgICAgIHZhciBpc0NhbGVuZGFyRWxlbWVudCA9IGlzQ2FsZW5kYXJFbGVtKGV2ZW50VGFyZ2V0XzEpO1xuICAgICAgICAgICAgdmFyIGlzSW5wdXQgPSBldmVudFRhcmdldF8xID09PSBzZWxmLmlucHV0IHx8XG4gICAgICAgICAgICAgICAgZXZlbnRUYXJnZXRfMSA9PT0gc2VsZi5hbHRJbnB1dCB8fFxuICAgICAgICAgICAgICAgIHNlbGYuZWxlbWVudC5jb250YWlucyhldmVudFRhcmdldF8xKSB8fFxuICAgICAgICAgICAgICAgIChlLnBhdGggJiZcbiAgICAgICAgICAgICAgICAgICAgZS5wYXRoLmluZGV4T2YgJiZcbiAgICAgICAgICAgICAgICAgICAgKH5lLnBhdGguaW5kZXhPZihzZWxmLmlucHV0KSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgfmUucGF0aC5pbmRleE9mKHNlbGYuYWx0SW5wdXQpKSk7XG4gICAgICAgICAgICB2YXIgbG9zdEZvY3VzID0gIWlzSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhaXNDYWxlbmRhckVsZW1lbnQgJiZcbiAgICAgICAgICAgICAgICAhaXNDYWxlbmRhckVsZW0oZS5yZWxhdGVkVGFyZ2V0KTtcbiAgICAgICAgICAgIHZhciBpc0lnbm9yZWQgPSAhc2VsZi5jb25maWcuaWdub3JlZEZvY3VzRWxlbWVudHMuc29tZShmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtLmNvbnRhaW5zKGV2ZW50VGFyZ2V0XzEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobG9zdEZvY3VzICYmIGlzSWdub3JlZCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5hbGxvd0lucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0RGF0ZShzZWxmLl9pbnB1dC52YWx1ZSwgZmFsc2UsIHNlbGYuY29uZmlnLmFsdElucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICA/IHNlbGYuY29uZmlnLmFsdEZvcm1hdFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBzZWxmLmNvbmZpZy5kYXRlRm9ybWF0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYudGltZUNvbnRhaW5lciAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWludXRlRWxlbWVudCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaG91ckVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0LnZhbHVlICE9PSBcIlwiICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jb25maWcgJiZcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcubW9kZSA9PT0gXCJyYW5nZVwiICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPT09IDEpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2xlYXIoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoYW5nZVllYXIobmV3WWVhcikge1xuICAgICAgICBpZiAoIW5ld1llYXIgfHxcbiAgICAgICAgICAgIChzZWxmLmNvbmZpZy5taW5EYXRlICYmIG5ld1llYXIgPCBzZWxmLmNvbmZpZy5taW5EYXRlLmdldEZ1bGxZZWFyKCkpIHx8XG4gICAgICAgICAgICAoc2VsZi5jb25maWcubWF4RGF0ZSAmJiBuZXdZZWFyID4gc2VsZi5jb25maWcubWF4RGF0ZS5nZXRGdWxsWWVhcigpKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIG5ld1llYXJOdW0gPSBuZXdZZWFyLCBpc05ld1llYXIgPSBzZWxmLmN1cnJlbnRZZWFyICE9PSBuZXdZZWFyTnVtO1xuICAgICAgICBzZWxmLmN1cnJlbnRZZWFyID0gbmV3WWVhck51bSB8fCBzZWxmLmN1cnJlbnRZZWFyO1xuICAgICAgICBpZiAoc2VsZi5jb25maWcubWF4RGF0ZSAmJlxuICAgICAgICAgICAgc2VsZi5jdXJyZW50WWVhciA9PT0gc2VsZi5jb25maWcubWF4RGF0ZS5nZXRGdWxsWWVhcigpKSB7XG4gICAgICAgICAgICBzZWxmLmN1cnJlbnRNb250aCA9IE1hdGgubWluKHNlbGYuY29uZmlnLm1heERhdGUuZ2V0TW9udGgoKSwgc2VsZi5jdXJyZW50TW9udGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNlbGYuY29uZmlnLm1pbkRhdGUgJiZcbiAgICAgICAgICAgIHNlbGYuY3VycmVudFllYXIgPT09IHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0RnVsbFllYXIoKSkge1xuICAgICAgICAgICAgc2VsZi5jdXJyZW50TW9udGggPSBNYXRoLm1heChzZWxmLmNvbmZpZy5taW5EYXRlLmdldE1vbnRoKCksIHNlbGYuY3VycmVudE1vbnRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOZXdZZWFyKSB7XG4gICAgICAgICAgICBzZWxmLnJlZHJhdygpO1xuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KFwib25ZZWFyQ2hhbmdlXCIpO1xuICAgICAgICAgICAgYnVpbGRNb250aFN3aXRjaCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRW5hYmxlZChkYXRlLCB0aW1lbGVzcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0aW1lbGVzcyA9PT0gdm9pZCAwKSB7IHRpbWVsZXNzID0gdHJ1ZTsgfVxuICAgICAgICB2YXIgZGF0ZVRvQ2hlY2sgPSBzZWxmLnBhcnNlRGF0ZShkYXRlLCB1bmRlZmluZWQsIHRpbWVsZXNzKTtcbiAgICAgICAgaWYgKChzZWxmLmNvbmZpZy5taW5EYXRlICYmXG4gICAgICAgICAgICBkYXRlVG9DaGVjayAmJlxuICAgICAgICAgICAgY29tcGFyZURhdGVzKGRhdGVUb0NoZWNrLCBzZWxmLmNvbmZpZy5taW5EYXRlLCB0aW1lbGVzcyAhPT0gdW5kZWZpbmVkID8gdGltZWxlc3MgOiAhc2VsZi5taW5EYXRlSGFzVGltZSkgPCAwKSB8fFxuICAgICAgICAgICAgKHNlbGYuY29uZmlnLm1heERhdGUgJiZcbiAgICAgICAgICAgICAgICBkYXRlVG9DaGVjayAmJlxuICAgICAgICAgICAgICAgIGNvbXBhcmVEYXRlcyhkYXRlVG9DaGVjaywgc2VsZi5jb25maWcubWF4RGF0ZSwgdGltZWxlc3MgIT09IHVuZGVmaW5lZCA/IHRpbWVsZXNzIDogIXNlbGYubWF4RGF0ZUhhc1RpbWUpID4gMCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICghc2VsZi5jb25maWcuZW5hYmxlICYmIHNlbGYuY29uZmlnLmRpc2FibGUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChkYXRlVG9DaGVjayA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgYm9vbCA9ICEhc2VsZi5jb25maWcuZW5hYmxlLCBhcnJheSA9IChfYSA9IHNlbGYuY29uZmlnLmVuYWJsZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogc2VsZi5jb25maWcuZGlzYWJsZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGQgPSB2b2lkIDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZCA9IGFycmF5W2ldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgICAgICBkKGRhdGVUb0NoZWNrKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9vbDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGQgaW5zdGFuY2VvZiBEYXRlICYmXG4gICAgICAgICAgICAgICAgZGF0ZVRvQ2hlY2sgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgIGQuZ2V0VGltZSgpID09PSBkYXRlVG9DaGVjay5nZXRUaW1lKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJvb2w7XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHZhciBwYXJzZWQgPSBzZWxmLnBhcnNlRGF0ZShkLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQgJiYgcGFyc2VkLmdldFRpbWUoKSA9PT0gZGF0ZVRvQ2hlY2suZ2V0VGltZSgpXG4gICAgICAgICAgICAgICAgICAgID8gYm9vbFxuICAgICAgICAgICAgICAgICAgICA6ICFib29sO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGQgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgICAgICBkYXRlVG9DaGVjayAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgZC5mcm9tICYmXG4gICAgICAgICAgICAgICAgZC50byAmJlxuICAgICAgICAgICAgICAgIGRhdGVUb0NoZWNrLmdldFRpbWUoKSA+PSBkLmZyb20uZ2V0VGltZSgpICYmXG4gICAgICAgICAgICAgICAgZGF0ZVRvQ2hlY2suZ2V0VGltZSgpIDw9IGQudG8uZ2V0VGltZSgpKVxuICAgICAgICAgICAgICAgIHJldHVybiBib29sO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhYm9vbDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNJblZpZXcoZWxlbSkge1xuICAgICAgICBpZiAoc2VsZi5kYXlzQ29udGFpbmVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0uY2xhc3NOYW1lLmluZGV4T2YoXCJoaWRkZW5cIikgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUuaW5kZXhPZihcImZsYXRwaWNrci1kaXNhYmxlZFwiKSA9PT0gLTEgJiZcbiAgICAgICAgICAgICAgICBzZWxmLmRheXNDb250YWluZXIuY29udGFpbnMoZWxlbSkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uQmx1cihlKSB7XG4gICAgICAgIHZhciBpc0lucHV0ID0gZS50YXJnZXQgPT09IHNlbGYuX2lucHV0O1xuICAgICAgICB2YXIgdmFsdWVDaGFuZ2VkID0gc2VsZi5faW5wdXQudmFsdWUudHJpbUVuZCgpICE9PSBnZXREYXRlU3RyKCk7XG4gICAgICAgIGlmIChpc0lucHV0ICYmXG4gICAgICAgICAgICB2YWx1ZUNoYW5nZWQgJiZcbiAgICAgICAgICAgICEoZS5yZWxhdGVkVGFyZ2V0ICYmIGlzQ2FsZW5kYXJFbGVtKGUucmVsYXRlZFRhcmdldCkpKSB7XG4gICAgICAgICAgICBzZWxmLnNldERhdGUoc2VsZi5faW5wdXQudmFsdWUsIHRydWUsIGUudGFyZ2V0ID09PSBzZWxmLmFsdElucHV0XG4gICAgICAgICAgICAgICAgPyBzZWxmLmNvbmZpZy5hbHRGb3JtYXRcbiAgICAgICAgICAgICAgICA6IHNlbGYuY29uZmlnLmRhdGVGb3JtYXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uS2V5RG93bihlKSB7XG4gICAgICAgIHZhciBldmVudFRhcmdldCA9IGdldEV2ZW50VGFyZ2V0KGUpO1xuICAgICAgICB2YXIgaXNJbnB1dCA9IHNlbGYuY29uZmlnLndyYXBcbiAgICAgICAgICAgID8gZWxlbWVudC5jb250YWlucyhldmVudFRhcmdldClcbiAgICAgICAgICAgIDogZXZlbnRUYXJnZXQgPT09IHNlbGYuX2lucHV0O1xuICAgICAgICB2YXIgYWxsb3dJbnB1dCA9IHNlbGYuY29uZmlnLmFsbG93SW5wdXQ7XG4gICAgICAgIHZhciBhbGxvd0tleWRvd24gPSBzZWxmLmlzT3BlbiAmJiAoIWFsbG93SW5wdXQgfHwgIWlzSW5wdXQpO1xuICAgICAgICB2YXIgYWxsb3dJbmxpbmVLZXlkb3duID0gc2VsZi5jb25maWcuaW5saW5lICYmIGlzSW5wdXQgJiYgIWFsbG93SW5wdXQ7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzICYmIGlzSW5wdXQpIHtcbiAgICAgICAgICAgIGlmIChhbGxvd0lucHV0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXREYXRlKHNlbGYuX2lucHV0LnZhbHVlLCB0cnVlLCBldmVudFRhcmdldCA9PT0gc2VsZi5hbHRJbnB1dFxuICAgICAgICAgICAgICAgICAgICA/IHNlbGYuY29uZmlnLmFsdEZvcm1hdFxuICAgICAgICAgICAgICAgICAgICA6IHNlbGYuY29uZmlnLmRhdGVGb3JtYXQpO1xuICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRUYXJnZXQuYmx1cigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNDYWxlbmRhckVsZW0oZXZlbnRUYXJnZXQpIHx8XG4gICAgICAgICAgICBhbGxvd0tleWRvd24gfHxcbiAgICAgICAgICAgIGFsbG93SW5saW5lS2V5ZG93bikge1xuICAgICAgICAgICAgdmFyIGlzVGltZU9iaiA9ICEhc2VsZi50aW1lQ29udGFpbmVyICYmXG4gICAgICAgICAgICAgICAgc2VsZi50aW1lQ29udGFpbmVyLmNvbnRhaW5zKGV2ZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVGltZU9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNBbmRDbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdERhdGUoZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9jdXNBbmRDbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgY2FzZSA0NjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW5wdXQgJiYgIXNlbGYuY29uZmlnLmFsbG93SW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNUaW1lT2JqICYmICFpc0lucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlRWxlbWVudCA9IGdldENsb3Nlc3RBY3RpdmVFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5kYXlzQ29udGFpbmVyICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYWxsb3dJbnB1dCA9PT0gZmFsc2UgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFjdGl2ZUVsZW1lbnQgJiYgaXNJblZpZXcoYWN0aXZlRWxlbWVudCkpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWx0YV8xID0gZS5rZXlDb2RlID09PSAzOSA/IDEgOiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWUuY3RybEtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNPbkRheSh1bmRlZmluZWQsIGRlbHRhXzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VNb250aChkZWx0YV8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNPbkRheShnZXRGaXJzdEF2YWlsYWJsZURheSgxKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNlbGYuaG91ckVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhvdXJFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVsdGEgPSBlLmtleUNvZGUgPT09IDQwID8gMSA6IC0xO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHNlbGYuZGF5c0NvbnRhaW5lciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRUYXJnZXQuJGkgIT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VGFyZ2V0ID09PSBzZWxmLmlucHV0IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRhcmdldCA9PT0gc2VsZi5hbHRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlWWVhcihzZWxmLmN1cnJlbnRZZWFyIC0gZGVsdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzT25EYXkoZ2V0Rmlyc3RBdmFpbGFibGVEYXkoMSksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIWlzVGltZU9iailcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c09uRGF5KHVuZGVmaW5lZCwgZGVsdGEgKiA3KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChldmVudFRhcmdldCA9PT0gc2VsZi5jdXJyZW50WWVhckVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVllYXIoc2VsZi5jdXJyZW50WWVhciAtIGRlbHRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxmLmNvbmZpZy5lbmFibGVUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVGltZU9iaiAmJiBzZWxmLmhvdXJFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaG91ckVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWUoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9kZWJvdW5jZWRDaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1RpbWVPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhvdXJFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubWludXRlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlY29uZEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hbVBNLFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoc2VsZi5wbHVnaW5FbGVtZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4OyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gZWxlbXMuaW5kZXhPZihldmVudFRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZWxlbXNbaSArIChlLnNoaWZ0S2V5ID8gLTEgOiAxKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0YXJnZXQgfHwgc2VsZi5faW5wdXQpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIXNlbGYuY29uZmlnLm5vQ2FsZW5kYXIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZGF5c0NvbnRhaW5lciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5kYXlzQ29udGFpbmVyLmNvbnRhaW5zKGV2ZW50VGFyZ2V0KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5faW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5hbVBNICE9PSB1bmRlZmluZWQgJiYgZXZlbnRUYXJnZXQgPT09IHNlbGYuYW1QTSkge1xuICAgICAgICAgICAgc3dpdGNoIChlLmtleSkge1xuICAgICAgICAgICAgICAgIGNhc2Ugc2VsZi5sMTBuLmFtUE1bMF0uY2hhckF0KDApOlxuICAgICAgICAgICAgICAgIGNhc2Ugc2VsZi5sMTBuLmFtUE1bMF0uY2hhckF0KDApLnRvTG93ZXJDYXNlKCk6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYW1QTS50ZXh0Q29udGVudCA9IHNlbGYubDEwbi5hbVBNWzBdO1xuICAgICAgICAgICAgICAgICAgICBzZXRIb3Vyc0Zyb21JbnB1dHMoKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBzZWxmLmwxMG4uYW1QTVsxXS5jaGFyQXQoMCk6XG4gICAgICAgICAgICAgICAgY2FzZSBzZWxmLmwxMG4uYW1QTVsxXS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKTpcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbVBNLnRleHRDb250ZW50ID0gc2VsZi5sMTBuLmFtUE1bMV07XG4gICAgICAgICAgICAgICAgICAgIHNldEhvdXJzRnJvbUlucHV0cygpO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNJbnB1dCB8fCBpc0NhbGVuZGFyRWxlbShldmVudFRhcmdldCkpIHtcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChcIm9uS2V5RG93blwiLCBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBvbk1vdXNlT3ZlcihlbGVtLCBjZWxsQ2xhc3MpIHtcbiAgICAgICAgaWYgKGNlbGxDbGFzcyA9PT0gdm9pZCAwKSB7IGNlbGxDbGFzcyA9IFwiZmxhdHBpY2tyLWRheVwiOyB9XG4gICAgICAgIGlmIChzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoICE9PSAxIHx8XG4gICAgICAgICAgICAoZWxlbSAmJlxuICAgICAgICAgICAgICAgICghZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2VsbENsYXNzKSB8fFxuICAgICAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5jb250YWlucyhcImZsYXRwaWNrci1kaXNhYmxlZFwiKSkpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgaG92ZXJEYXRlID0gZWxlbVxuICAgICAgICAgICAgPyBlbGVtLmRhdGVPYmouZ2V0VGltZSgpXG4gICAgICAgICAgICA6IHNlbGYuZGF5cy5maXJzdEVsZW1lbnRDaGlsZC5kYXRlT2JqLmdldFRpbWUoKSwgaW5pdGlhbERhdGUgPSBzZWxmLnBhcnNlRGF0ZShzZWxmLnNlbGVjdGVkRGF0ZXNbMF0sIHVuZGVmaW5lZCwgdHJ1ZSkuZ2V0VGltZSgpLCByYW5nZVN0YXJ0RGF0ZSA9IE1hdGgubWluKGhvdmVyRGF0ZSwgc2VsZi5zZWxlY3RlZERhdGVzWzBdLmdldFRpbWUoKSksIHJhbmdlRW5kRGF0ZSA9IE1hdGgubWF4KGhvdmVyRGF0ZSwgc2VsZi5zZWxlY3RlZERhdGVzWzBdLmdldFRpbWUoKSk7XG4gICAgICAgIHZhciBjb250YWluc0Rpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBtaW5SYW5nZSA9IDAsIG1heFJhbmdlID0gMDtcbiAgICAgICAgZm9yICh2YXIgdCA9IHJhbmdlU3RhcnREYXRlOyB0IDwgcmFuZ2VFbmREYXRlOyB0ICs9IGR1cmF0aW9uLkRBWSkge1xuICAgICAgICAgICAgaWYgKCFpc0VuYWJsZWQobmV3IERhdGUodCksIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgY29udGFpbnNEaXNhYmxlZCA9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5zRGlzYWJsZWQgfHwgKHQgPiByYW5nZVN0YXJ0RGF0ZSAmJiB0IDwgcmFuZ2VFbmREYXRlKTtcbiAgICAgICAgICAgICAgICBpZiAodCA8IGluaXRpYWxEYXRlICYmICghbWluUmFuZ2UgfHwgdCA+IG1pblJhbmdlKSlcbiAgICAgICAgICAgICAgICAgICAgbWluUmFuZ2UgPSB0O1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHQgPiBpbml0aWFsRGF0ZSAmJiAoIW1heFJhbmdlIHx8IHQgPCBtYXhSYW5nZSkpXG4gICAgICAgICAgICAgICAgICAgIG1heFJhbmdlID0gdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgaG92ZXJhYmxlQ2VsbHMgPSBBcnJheS5mcm9tKHNlbGYuckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiKjpudGgtY2hpbGQoLW4rXCIgKyBzZWxmLmNvbmZpZy5zaG93TW9udGhzICsgXCIpID4gLlwiICsgY2VsbENsYXNzKSk7XG4gICAgICAgIGhvdmVyYWJsZUNlbGxzLmZvckVhY2goZnVuY3Rpb24gKGRheUVsZW0pIHtcbiAgICAgICAgICAgIHZhciBkYXRlID0gZGF5RWxlbS5kYXRlT2JqO1xuICAgICAgICAgICAgdmFyIHRpbWVzdGFtcCA9IGRhdGUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIG91dE9mUmFuZ2UgPSAobWluUmFuZ2UgPiAwICYmIHRpbWVzdGFtcCA8IG1pblJhbmdlKSB8fFxuICAgICAgICAgICAgICAgIChtYXhSYW5nZSA+IDAgJiYgdGltZXN0YW1wID4gbWF4UmFuZ2UpO1xuICAgICAgICAgICAgaWYgKG91dE9mUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBkYXlFbGVtLmNsYXNzTGlzdC5hZGQoXCJub3RBbGxvd2VkXCIpO1xuICAgICAgICAgICAgICAgIFtcImluUmFuZ2VcIiwgXCJzdGFydFJhbmdlXCIsIFwiZW5kUmFuZ2VcIl0uZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgICAgICAgICBkYXlFbGVtLmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29udGFpbnNEaXNhYmxlZCAmJiAhb3V0T2ZSYW5nZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBbXCJzdGFydFJhbmdlXCIsIFwiaW5SYW5nZVwiLCBcImVuZFJhbmdlXCIsIFwibm90QWxsb3dlZFwiXS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgZGF5RWxlbS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZWxlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGhvdmVyRGF0ZSA8PSBzZWxmLnNlbGVjdGVkRGF0ZXNbMF0uZ2V0VGltZSgpXG4gICAgICAgICAgICAgICAgICAgID8gXCJzdGFydFJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgOiBcImVuZFJhbmdlXCIpO1xuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsRGF0ZSA8IGhvdmVyRGF0ZSAmJiB0aW1lc3RhbXAgPT09IGluaXRpYWxEYXRlKVxuICAgICAgICAgICAgICAgICAgICBkYXlFbGVtLmNsYXNzTGlzdC5hZGQoXCJzdGFydFJhbmdlXCIpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGluaXRpYWxEYXRlID4gaG92ZXJEYXRlICYmIHRpbWVzdGFtcCA9PT0gaW5pdGlhbERhdGUpXG4gICAgICAgICAgICAgICAgICAgIGRheUVsZW0uY2xhc3NMaXN0LmFkZChcImVuZFJhbmdlXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aW1lc3RhbXAgPj0gbWluUmFuZ2UgJiZcbiAgICAgICAgICAgICAgICAgICAgKG1heFJhbmdlID09PSAwIHx8IHRpbWVzdGFtcCA8PSBtYXhSYW5nZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgaXNCZXR3ZWVuKHRpbWVzdGFtcCwgaW5pdGlhbERhdGUsIGhvdmVyRGF0ZSkpXG4gICAgICAgICAgICAgICAgICAgIGRheUVsZW0uY2xhc3NMaXN0LmFkZChcImluUmFuZ2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICAgICAgaWYgKHNlbGYuaXNPcGVuICYmICFzZWxmLmNvbmZpZy5zdGF0aWMgJiYgIXNlbGYuY29uZmlnLmlubGluZSlcbiAgICAgICAgICAgIHBvc2l0aW9uQ2FsZW5kYXIoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb3BlbihlLCBwb3NpdGlvbkVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHBvc2l0aW9uRWxlbWVudCA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uRWxlbWVudCA9IHNlbGYuX3Bvc2l0aW9uRWxlbWVudDsgfVxuICAgICAgICBpZiAoc2VsZi5pc01vYmlsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50VGFyZ2V0ID0gZ2V0RXZlbnRUYXJnZXQoZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VGFyZ2V0LmJsdXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5tb2JpbGVJbnB1dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5tb2JpbGVJbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHNlbGYubW9iaWxlSW5wdXQuY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChcIm9uT3BlblwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWxmLl9pbnB1dC5kaXNhYmxlZCB8fCBzZWxmLmNvbmZpZy5pbmxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgd2FzT3BlbiA9IHNlbGYuaXNPcGVuO1xuICAgICAgICBzZWxmLmlzT3BlbiA9IHRydWU7XG4gICAgICAgIGlmICghd2FzT3Blbikge1xuICAgICAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwib3BlblwiKTtcbiAgICAgICAgICAgIHNlbGYuX2lucHV0LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnQoXCJvbk9wZW5cIik7XG4gICAgICAgICAgICBwb3NpdGlvbkNhbGVuZGFyKHBvc2l0aW9uRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLmVuYWJsZVRpbWUgPT09IHRydWUgJiYgc2VsZi5jb25maWcubm9DYWxlbmRhciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLmFsbG93SW5wdXQgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICAgKGUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICAhc2VsZi50aW1lQ29udGFpbmVyLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCkpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLmhvdXJFbGVtZW50LnNlbGVjdCgpOyB9LCA1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gbWluTWF4RGF0ZVNldHRlcih0eXBlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgdmFyIGRhdGVPYmogPSAoc2VsZi5jb25maWdbXCJfXCIgKyB0eXBlICsgXCJEYXRlXCJdID0gc2VsZi5wYXJzZURhdGUoZGF0ZSwgc2VsZi5jb25maWcuZGF0ZUZvcm1hdCkpO1xuICAgICAgICAgICAgdmFyIGludmVyc2VEYXRlT2JqID0gc2VsZi5jb25maWdbXCJfXCIgKyAodHlwZSA9PT0gXCJtaW5cIiA/IFwibWF4XCIgOiBcIm1pblwiKSArIFwiRGF0ZVwiXTtcbiAgICAgICAgICAgIGlmIChkYXRlT2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzZWxmW3R5cGUgPT09IFwibWluXCIgPyBcIm1pbkRhdGVIYXNUaW1lXCIgOiBcIm1heERhdGVIYXNUaW1lXCJdID1cbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iai5nZXRIb3VycygpID4gMCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZU9iai5nZXRNaW51dGVzKCkgPiAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlT2JqLmdldFNlY29uZHMoKSA+IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZERhdGVzKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZERhdGVzID0gc2VsZi5zZWxlY3RlZERhdGVzLmZpbHRlcihmdW5jdGlvbiAoZCkgeyByZXR1cm4gaXNFbmFibGVkKGQpOyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggJiYgdHlwZSA9PT0gXCJtaW5cIilcbiAgICAgICAgICAgICAgICAgICAgc2V0SG91cnNGcm9tRGF0ZShkYXRlT2JqKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVWYWx1ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuZGF5c0NvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgIHJlZHJhdygpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRlT2JqICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFllYXJFbGVtZW50W3R5cGVdID0gZGF0ZU9iai5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRZZWFyRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUodHlwZSk7XG4gICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50WWVhckVsZW1lbnQuZGlzYWJsZWQgPVxuICAgICAgICAgICAgICAgICAgICAhIWludmVyc2VEYXRlT2JqICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlT2JqICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2VEYXRlT2JqLmdldEZ1bGxZZWFyKCkgPT09IGRhdGVPYmouZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGFyc2VDb25maWcoKSB7XG4gICAgICAgIHZhciBib29sT3B0cyA9IFtcbiAgICAgICAgICAgIFwid3JhcFwiLFxuICAgICAgICAgICAgXCJ3ZWVrTnVtYmVyc1wiLFxuICAgICAgICAgICAgXCJhbGxvd0lucHV0XCIsXG4gICAgICAgICAgICBcImFsbG93SW52YWxpZFByZWxvYWRcIixcbiAgICAgICAgICAgIFwiY2xpY2tPcGVuc1wiLFxuICAgICAgICAgICAgXCJ0aW1lXzI0aHJcIixcbiAgICAgICAgICAgIFwiZW5hYmxlVGltZVwiLFxuICAgICAgICAgICAgXCJub0NhbGVuZGFyXCIsXG4gICAgICAgICAgICBcImFsdElucHV0XCIsXG4gICAgICAgICAgICBcInNob3J0aGFuZEN1cnJlbnRNb250aFwiLFxuICAgICAgICAgICAgXCJpbmxpbmVcIixcbiAgICAgICAgICAgIFwic3RhdGljXCIsXG4gICAgICAgICAgICBcImVuYWJsZVNlY29uZHNcIixcbiAgICAgICAgICAgIFwiZGlzYWJsZU1vYmlsZVwiLFxuICAgICAgICBdO1xuICAgICAgICB2YXIgdXNlckNvbmZpZyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGVsZW1lbnQuZGF0YXNldCB8fCB7fSkpKSwgaW5zdGFuY2VDb25maWcpO1xuICAgICAgICB2YXIgZm9ybWF0cyA9IHt9O1xuICAgICAgICBzZWxmLmNvbmZpZy5wYXJzZURhdGUgPSB1c2VyQ29uZmlnLnBhcnNlRGF0ZTtcbiAgICAgICAgc2VsZi5jb25maWcuZm9ybWF0RGF0ZSA9IHVzZXJDb25maWcuZm9ybWF0RGF0ZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYuY29uZmlnLCBcImVuYWJsZVwiLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYuY29uZmlnLl9lbmFibGU7IH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChkYXRlcykge1xuICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnLl9lbmFibGUgPSBwYXJzZURhdGVSdWxlcyhkYXRlcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYuY29uZmlnLCBcImRpc2FibGVcIiwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLmNvbmZpZy5fZGlzYWJsZTsgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGRhdGVzKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25maWcuX2Rpc2FibGUgPSBwYXJzZURhdGVSdWxlcyhkYXRlcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHRpbWVNb2RlID0gdXNlckNvbmZpZy5tb2RlID09PSBcInRpbWVcIjtcbiAgICAgICAgaWYgKCF1c2VyQ29uZmlnLmRhdGVGb3JtYXQgJiYgKHVzZXJDb25maWcuZW5hYmxlVGltZSB8fCB0aW1lTW9kZSkpIHtcbiAgICAgICAgICAgIHZhciBkZWZhdWx0RGF0ZUZvcm1hdCA9IGZsYXRwaWNrci5kZWZhdWx0Q29uZmlnLmRhdGVGb3JtYXQgfHwgZGVmYXVsdE9wdGlvbnMuZGF0ZUZvcm1hdDtcbiAgICAgICAgICAgIGZvcm1hdHMuZGF0ZUZvcm1hdCA9XG4gICAgICAgICAgICAgICAgdXNlckNvbmZpZy5ub0NhbGVuZGFyIHx8IHRpbWVNb2RlXG4gICAgICAgICAgICAgICAgICAgID8gXCJIOmlcIiArICh1c2VyQ29uZmlnLmVuYWJsZVNlY29uZHMgPyBcIjpTXCIgOiBcIlwiKVxuICAgICAgICAgICAgICAgICAgICA6IGRlZmF1bHREYXRlRm9ybWF0ICsgXCIgSDppXCIgKyAodXNlckNvbmZpZy5lbmFibGVTZWNvbmRzID8gXCI6U1wiIDogXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXJDb25maWcuYWx0SW5wdXQgJiZcbiAgICAgICAgICAgICh1c2VyQ29uZmlnLmVuYWJsZVRpbWUgfHwgdGltZU1vZGUpICYmXG4gICAgICAgICAgICAhdXNlckNvbmZpZy5hbHRGb3JtYXQpIHtcbiAgICAgICAgICAgIHZhciBkZWZhdWx0QWx0Rm9ybWF0ID0gZmxhdHBpY2tyLmRlZmF1bHRDb25maWcuYWx0Rm9ybWF0IHx8IGRlZmF1bHRPcHRpb25zLmFsdEZvcm1hdDtcbiAgICAgICAgICAgIGZvcm1hdHMuYWx0Rm9ybWF0ID1cbiAgICAgICAgICAgICAgICB1c2VyQ29uZmlnLm5vQ2FsZW5kYXIgfHwgdGltZU1vZGVcbiAgICAgICAgICAgICAgICAgICAgPyBcImg6aVwiICsgKHVzZXJDb25maWcuZW5hYmxlU2Vjb25kcyA/IFwiOlMgS1wiIDogXCIgS1wiKVxuICAgICAgICAgICAgICAgICAgICA6IGRlZmF1bHRBbHRGb3JtYXQgKyAoXCIgaDppXCIgKyAodXNlckNvbmZpZy5lbmFibGVTZWNvbmRzID8gXCI6U1wiIDogXCJcIikgKyBcIiBLXCIpO1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLmNvbmZpZywgXCJtaW5EYXRlXCIsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5jb25maWcuX21pbkRhdGU7IH0sXG4gICAgICAgICAgICBzZXQ6IG1pbk1heERhdGVTZXR0ZXIoXCJtaW5cIiksXG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZi5jb25maWcsIFwibWF4RGF0ZVwiLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYuY29uZmlnLl9tYXhEYXRlOyB9LFxuICAgICAgICAgICAgc2V0OiBtaW5NYXhEYXRlU2V0dGVyKFwibWF4XCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG1pbk1heFRpbWVTZXR0ZXIgPSBmdW5jdGlvbiAodHlwZSkgeyByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgc2VsZi5jb25maWdbdHlwZSA9PT0gXCJtaW5cIiA/IFwiX21pblRpbWVcIiA6IFwiX21heFRpbWVcIl0gPSBzZWxmLnBhcnNlRGF0ZSh2YWwsIFwiSDppOlNcIik7XG4gICAgICAgIH07IH07XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLmNvbmZpZywgXCJtaW5UaW1lXCIsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5jb25maWcuX21pblRpbWU7IH0sXG4gICAgICAgICAgICBzZXQ6IG1pbk1heFRpbWVTZXR0ZXIoXCJtaW5cIiksXG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZi5jb25maWcsIFwibWF4VGltZVwiLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYuY29uZmlnLl9tYXhUaW1lOyB9LFxuICAgICAgICAgICAgc2V0OiBtaW5NYXhUaW1lU2V0dGVyKFwibWF4XCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXJDb25maWcubW9kZSA9PT0gXCJ0aW1lXCIpIHtcbiAgICAgICAgICAgIHNlbGYuY29uZmlnLm5vQ2FsZW5kYXIgPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5jb25maWcuZW5hYmxlVGltZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmFzc2lnbihzZWxmLmNvbmZpZywgZm9ybWF0cywgdXNlckNvbmZpZyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9vbE9wdHMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBzZWxmLmNvbmZpZ1tib29sT3B0c1tpXV0gPVxuICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnW2Jvb2xPcHRzW2ldXSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZ1tib29sT3B0c1tpXV0gPT09IFwidHJ1ZVwiO1xuICAgICAgICBIT09LUy5maWx0ZXIoZnVuY3Rpb24gKGhvb2spIHsgcmV0dXJuIHNlbGYuY29uZmlnW2hvb2tdICE9PSB1bmRlZmluZWQ7IH0pLmZvckVhY2goZnVuY3Rpb24gKGhvb2spIHtcbiAgICAgICAgICAgIHNlbGYuY29uZmlnW2hvb2tdID0gYXJyYXlpZnkoc2VsZi5jb25maWdbaG9va10gfHwgW10pLm1hcChiaW5kVG9JbnN0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZWxmLmlzTW9iaWxlID1cbiAgICAgICAgICAgICFzZWxmLmNvbmZpZy5kaXNhYmxlTW9iaWxlICYmXG4gICAgICAgICAgICAgICAgIXNlbGYuY29uZmlnLmlubGluZSAmJlxuICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnLm1vZGUgPT09IFwic2luZ2xlXCIgJiZcbiAgICAgICAgICAgICAgICAhc2VsZi5jb25maWcuZGlzYWJsZS5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAhc2VsZi5jb25maWcuZW5hYmxlICYmXG4gICAgICAgICAgICAgICAgIXNlbGYuY29uZmlnLndlZWtOdW1iZXJzICYmXG4gICAgICAgICAgICAgICAgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuY29uZmlnLnBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwbHVnaW5Db25mID0gc2VsZi5jb25maWcucGx1Z2luc1tpXShzZWxmKSB8fCB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwbHVnaW5Db25mKSB7XG4gICAgICAgICAgICAgICAgaWYgKEhPT0tTLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnW2tleV0gPSBhcnJheWlmeShwbHVnaW5Db25mW2tleV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGJpbmRUb0luc3RhbmNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChzZWxmLmNvbmZpZ1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHVzZXJDb25maWdba2V5XSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWdba2V5XSA9IHBsdWdpbkNvbmZba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXVzZXJDb25maWcuYWx0SW5wdXRDbGFzcykge1xuICAgICAgICAgICAgc2VsZi5jb25maWcuYWx0SW5wdXRDbGFzcyA9XG4gICAgICAgICAgICAgICAgZ2V0SW5wdXRFbGVtKCkuY2xhc3NOYW1lICsgXCIgXCIgKyBzZWxmLmNvbmZpZy5hbHRJbnB1dENsYXNzO1xuICAgICAgICB9XG4gICAgICAgIHRyaWdnZXJFdmVudChcIm9uUGFyc2VDb25maWdcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldElucHV0RWxlbSgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY29uZmlnLndyYXBcbiAgICAgICAgICAgID8gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaW5wdXRdXCIpXG4gICAgICAgICAgICA6IGVsZW1lbnQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldHVwTG9jYWxlKCkge1xuICAgICAgICBpZiAodHlwZW9mIHNlbGYuY29uZmlnLmxvY2FsZSAhPT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgdHlwZW9mIGZsYXRwaWNrci5sMTBuc1tzZWxmLmNvbmZpZy5sb2NhbGVdID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgc2VsZi5jb25maWcuZXJyb3JIYW5kbGVyKG5ldyBFcnJvcihcImZsYXRwaWNrcjogaW52YWxpZCBsb2NhbGUgXCIgKyBzZWxmLmNvbmZpZy5sb2NhbGUpKTtcbiAgICAgICAgc2VsZi5sMTBuID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGZsYXRwaWNrci5sMTBucy5kZWZhdWx0KSwgKHR5cGVvZiBzZWxmLmNvbmZpZy5sb2NhbGUgPT09IFwib2JqZWN0XCJcbiAgICAgICAgICAgID8gc2VsZi5jb25maWcubG9jYWxlXG4gICAgICAgICAgICA6IHNlbGYuY29uZmlnLmxvY2FsZSAhPT0gXCJkZWZhdWx0XCJcbiAgICAgICAgICAgICAgICA/IGZsYXRwaWNrci5sMTBuc1tzZWxmLmNvbmZpZy5sb2NhbGVdXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQpKTtcbiAgICAgICAgdG9rZW5SZWdleC5EID0gXCIoXCIgKyBzZWxmLmwxMG4ud2Vla2RheXMuc2hvcnRoYW5kLmpvaW4oXCJ8XCIpICsgXCIpXCI7XG4gICAgICAgIHRva2VuUmVnZXgubCA9IFwiKFwiICsgc2VsZi5sMTBuLndlZWtkYXlzLmxvbmdoYW5kLmpvaW4oXCJ8XCIpICsgXCIpXCI7XG4gICAgICAgIHRva2VuUmVnZXguTSA9IFwiKFwiICsgc2VsZi5sMTBuLm1vbnRocy5zaG9ydGhhbmQuam9pbihcInxcIikgKyBcIilcIjtcbiAgICAgICAgdG9rZW5SZWdleC5GID0gXCIoXCIgKyBzZWxmLmwxMG4ubW9udGhzLmxvbmdoYW5kLmpvaW4oXCJ8XCIpICsgXCIpXCI7XG4gICAgICAgIHRva2VuUmVnZXguSyA9IFwiKFwiICsgc2VsZi5sMTBuLmFtUE1bMF0gKyBcInxcIiArIHNlbGYubDEwbi5hbVBNWzFdICsgXCJ8XCIgKyBzZWxmLmwxMG4uYW1QTVswXS50b0xvd2VyQ2FzZSgpICsgXCJ8XCIgKyBzZWxmLmwxMG4uYW1QTVsxXS50b0xvd2VyQ2FzZSgpICsgXCIpXCI7XG4gICAgICAgIHZhciB1c2VyQ29uZmlnID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGluc3RhbmNlQ29uZmlnKSwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlbGVtZW50LmRhdGFzZXQgfHwge30pKSk7XG4gICAgICAgIGlmICh1c2VyQ29uZmlnLnRpbWVfMjRociA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBmbGF0cGlja3IuZGVmYXVsdENvbmZpZy50aW1lXzI0aHIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2VsZi5jb25maWcudGltZV8yNGhyID0gc2VsZi5sMTBuLnRpbWVfMjRocjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmZvcm1hdERhdGUgPSBjcmVhdGVEYXRlRm9ybWF0dGVyKHNlbGYpO1xuICAgICAgICBzZWxmLnBhcnNlRGF0ZSA9IGNyZWF0ZURhdGVQYXJzZXIoeyBjb25maWc6IHNlbGYuY29uZmlnLCBsMTBuOiBzZWxmLmwxMG4gfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBvc2l0aW9uQ2FsZW5kYXIoY3VzdG9tUG9zaXRpb25FbGVtZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZi5jb25maWcucG9zaXRpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgc2VsZi5jb25maWcucG9zaXRpb24oc2VsZiwgY3VzdG9tUG9zaXRpb25FbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5jYWxlbmRhckNvbnRhaW5lciA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0cmlnZ2VyRXZlbnQoXCJvblByZUNhbGVuZGFyUG9zaXRpb25cIik7XG4gICAgICAgIHZhciBwb3NpdGlvbkVsZW1lbnQgPSBjdXN0b21Qb3NpdGlvbkVsZW1lbnQgfHwgc2VsZi5fcG9zaXRpb25FbGVtZW50O1xuICAgICAgICB2YXIgY2FsZW5kYXJIZWlnaHQgPSBBcnJheS5wcm90b3R5cGUucmVkdWNlLmNhbGwoc2VsZi5jYWxlbmRhckNvbnRhaW5lci5jaGlsZHJlbiwgKGZ1bmN0aW9uIChhY2MsIGNoaWxkKSB7IHJldHVybiBhY2MgKyBjaGlsZC5vZmZzZXRIZWlnaHQ7IH0pLCAwKSwgY2FsZW5kYXJXaWR0aCA9IHNlbGYuY2FsZW5kYXJDb250YWluZXIub2Zmc2V0V2lkdGgsIGNvbmZpZ1BvcyA9IHNlbGYuY29uZmlnLnBvc2l0aW9uLnNwbGl0KFwiIFwiKSwgY29uZmlnUG9zVmVydGljYWwgPSBjb25maWdQb3NbMF0sIGNvbmZpZ1Bvc0hvcml6b250YWwgPSBjb25maWdQb3MubGVuZ3RoID4gMSA/IGNvbmZpZ1Bvc1sxXSA6IG51bGwsIGlucHV0Qm91bmRzID0gcG9zaXRpb25FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBkaXN0YW5jZUZyb21Cb3R0b20gPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBpbnB1dEJvdW5kcy5ib3R0b20sIHNob3dPblRvcCA9IGNvbmZpZ1Bvc1ZlcnRpY2FsID09PSBcImFib3ZlXCIgfHxcbiAgICAgICAgICAgIChjb25maWdQb3NWZXJ0aWNhbCAhPT0gXCJiZWxvd1wiICYmXG4gICAgICAgICAgICAgICAgZGlzdGFuY2VGcm9tQm90dG9tIDwgY2FsZW5kYXJIZWlnaHQgJiZcbiAgICAgICAgICAgICAgICBpbnB1dEJvdW5kcy50b3AgPiBjYWxlbmRhckhlaWdodCk7XG4gICAgICAgIHZhciB0b3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgK1xuICAgICAgICAgICAgaW5wdXRCb3VuZHMudG9wICtcbiAgICAgICAgICAgICghc2hvd09uVG9wID8gcG9zaXRpb25FbGVtZW50Lm9mZnNldEhlaWdodCArIDIgOiAtY2FsZW5kYXJIZWlnaHQgLSAyKTtcbiAgICAgICAgdG9nZ2xlQ2xhc3Moc2VsZi5jYWxlbmRhckNvbnRhaW5lciwgXCJhcnJvd1RvcFwiLCAhc2hvd09uVG9wKTtcbiAgICAgICAgdG9nZ2xlQ2xhc3Moc2VsZi5jYWxlbmRhckNvbnRhaW5lciwgXCJhcnJvd0JvdHRvbVwiLCBzaG93T25Ub3ApO1xuICAgICAgICBpZiAoc2VsZi5jb25maWcuaW5saW5lKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgbGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCArIGlucHV0Qm91bmRzLmxlZnQ7XG4gICAgICAgIHZhciBpc0NlbnRlciA9IGZhbHNlO1xuICAgICAgICB2YXIgaXNSaWdodCA9IGZhbHNlO1xuICAgICAgICBpZiAoY29uZmlnUG9zSG9yaXpvbnRhbCA9PT0gXCJjZW50ZXJcIikge1xuICAgICAgICAgICAgbGVmdCAtPSAoY2FsZW5kYXJXaWR0aCAtIGlucHV0Qm91bmRzLndpZHRoKSAvIDI7XG4gICAgICAgICAgICBpc0NlbnRlciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29uZmlnUG9zSG9yaXpvbnRhbCA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICBsZWZ0IC09IGNhbGVuZGFyV2lkdGggLSBpbnB1dEJvdW5kcy53aWR0aDtcbiAgICAgICAgICAgIGlzUmlnaHQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZUNsYXNzKHNlbGYuY2FsZW5kYXJDb250YWluZXIsIFwiYXJyb3dMZWZ0XCIsICFpc0NlbnRlciAmJiAhaXNSaWdodCk7XG4gICAgICAgIHRvZ2dsZUNsYXNzKHNlbGYuY2FsZW5kYXJDb250YWluZXIsIFwiYXJyb3dDZW50ZXJcIiwgaXNDZW50ZXIpO1xuICAgICAgICB0b2dnbGVDbGFzcyhzZWxmLmNhbGVuZGFyQ29udGFpbmVyLCBcImFycm93UmlnaHRcIiwgaXNSaWdodCk7XG4gICAgICAgIHZhciByaWdodCA9IHdpbmRvdy5kb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoIC1cbiAgICAgICAgICAgICh3aW5kb3cucGFnZVhPZmZzZXQgKyBpbnB1dEJvdW5kcy5yaWdodCk7XG4gICAgICAgIHZhciByaWdodE1vc3QgPSBsZWZ0ICsgY2FsZW5kYXJXaWR0aCA+IHdpbmRvdy5kb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoO1xuICAgICAgICB2YXIgY2VudGVyTW9zdCA9IHJpZ2h0ICsgY2FsZW5kYXJXaWR0aCA+IHdpbmRvdy5kb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoO1xuICAgICAgICB0b2dnbGVDbGFzcyhzZWxmLmNhbGVuZGFyQ29udGFpbmVyLCBcInJpZ2h0TW9zdFwiLCByaWdodE1vc3QpO1xuICAgICAgICBpZiAoc2VsZi5jb25maWcuc3RhdGljKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLnRvcCA9IHRvcCArIFwicHhcIjtcbiAgICAgICAgaWYgKCFyaWdodE1vc3QpIHtcbiAgICAgICAgICAgIHNlbGYuY2FsZW5kYXJDb250YWluZXIuc3R5bGUubGVmdCA9IGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICBzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLnJpZ2h0ID0gXCJhdXRvXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWNlbnRlck1vc3QpIHtcbiAgICAgICAgICAgIHNlbGYuY2FsZW5kYXJDb250YWluZXIuc3R5bGUubGVmdCA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5zdHlsZS5yaWdodCA9IHJpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGRvYyA9IGdldERvY3VtZW50U3R5bGVTaGVldCgpO1xuICAgICAgICAgICAgaWYgKGRvYyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBib2R5V2lkdGggPSB3aW5kb3cuZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjZW50ZXJMZWZ0ID0gTWF0aC5tYXgoMCwgYm9keVdpZHRoIC8gMiAtIGNhbGVuZGFyV2lkdGggLyAyKTtcbiAgICAgICAgICAgIHZhciBjZW50ZXJCZWZvcmUgPSBcIi5mbGF0cGlja3ItY2FsZW5kYXIuY2VudGVyTW9zdDpiZWZvcmVcIjtcbiAgICAgICAgICAgIHZhciBjZW50ZXJBZnRlciA9IFwiLmZsYXRwaWNrci1jYWxlbmRhci5jZW50ZXJNb3N0OmFmdGVyXCI7XG4gICAgICAgICAgICB2YXIgY2VudGVySW5kZXggPSBkb2MuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGNlbnRlclN0eWxlID0gXCJ7bGVmdDpcIiArIGlucHV0Qm91bmRzLmxlZnQgKyBcInB4O3JpZ2h0OmF1dG87fVwiO1xuICAgICAgICAgICAgdG9nZ2xlQ2xhc3Moc2VsZi5jYWxlbmRhckNvbnRhaW5lciwgXCJyaWdodE1vc3RcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdG9nZ2xlQ2xhc3Moc2VsZi5jYWxlbmRhckNvbnRhaW5lciwgXCJjZW50ZXJNb3N0XCIsIHRydWUpO1xuICAgICAgICAgICAgZG9jLmluc2VydFJ1bGUoY2VudGVyQmVmb3JlICsgXCIsXCIgKyBjZW50ZXJBZnRlciArIGNlbnRlclN0eWxlLCBjZW50ZXJJbmRleCk7XG4gICAgICAgICAgICBzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLmxlZnQgPSBjZW50ZXJMZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5zdHlsZS5yaWdodCA9IFwiYXV0b1wiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldERvY3VtZW50U3R5bGVTaGVldCgpIHtcbiAgICAgICAgdmFyIGVkaXRhYmxlU2hlZXQgPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcbiAgICAgICAgICAgIGlmICghc2hlZXQuY3NzUnVsZXMpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHNoZWV0LmNzc1J1bGVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWRpdGFibGVTaGVldCA9IHNoZWV0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVkaXRhYmxlU2hlZXQgIT0gbnVsbCA/IGVkaXRhYmxlU2hlZXQgOiBjcmVhdGVTdHlsZVNoZWV0KCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZVN0eWxlU2hlZXQoKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgIHJldHVybiBzdHlsZS5zaGVldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVkcmF3KCkge1xuICAgICAgICBpZiAoc2VsZi5jb25maWcubm9DYWxlbmRhciB8fCBzZWxmLmlzTW9iaWxlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBidWlsZE1vbnRoU3dpdGNoKCk7XG4gICAgICAgIHVwZGF0ZU5hdmlnYXRpb25DdXJyZW50TW9udGgoKTtcbiAgICAgICAgYnVpbGREYXlzKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZvY3VzQW5kQ2xvc2UoKSB7XG4gICAgICAgIHNlbGYuX2lucHV0LmZvY3VzKCk7XG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSAhPT0gLTEgfHxcbiAgICAgICAgICAgIG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoc2VsZi5jbG9zZSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2VsZWN0RGF0ZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdmFyIGlzU2VsZWN0YWJsZSA9IGZ1bmN0aW9uIChkYXkpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXkuY2xhc3NMaXN0ICYmXG4gICAgICAgICAgICAgICAgZGF5LmNsYXNzTGlzdC5jb250YWlucyhcImZsYXRwaWNrci1kYXlcIikgJiZcbiAgICAgICAgICAgICAgICAhZGF5LmNsYXNzTGlzdC5jb250YWlucyhcImZsYXRwaWNrci1kaXNhYmxlZFwiKSAmJlxuICAgICAgICAgICAgICAgICFkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibm90QWxsb3dlZFwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHQgPSBmaW5kUGFyZW50KGdldEV2ZW50VGFyZ2V0KGUpLCBpc1NlbGVjdGFibGUpO1xuICAgICAgICBpZiAodCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdDtcbiAgICAgICAgdmFyIHNlbGVjdGVkRGF0ZSA9IChzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiA9IG5ldyBEYXRlKHRhcmdldC5kYXRlT2JqLmdldFRpbWUoKSkpO1xuICAgICAgICB2YXIgc2hvdWxkQ2hhbmdlTW9udGggPSAoc2VsZWN0ZWREYXRlLmdldE1vbnRoKCkgPCBzZWxmLmN1cnJlbnRNb250aCB8fFxuICAgICAgICAgICAgc2VsZWN0ZWREYXRlLmdldE1vbnRoKCkgPlxuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudE1vbnRoICsgc2VsZi5jb25maWcuc2hvd01vbnRocyAtIDEpICYmXG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5tb2RlICE9PSBcInJhbmdlXCI7XG4gICAgICAgIHNlbGYuc2VsZWN0ZWREYXRlRWxlbSA9IHRhcmdldDtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwic2luZ2xlXCIpXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkRGF0ZXMgPSBbc2VsZWN0ZWREYXRlXTtcbiAgICAgICAgZWxzZSBpZiAoc2VsZi5jb25maWcubW9kZSA9PT0gXCJtdWx0aXBsZVwiKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IGlzRGF0ZVNlbGVjdGVkKHNlbGVjdGVkRGF0ZSk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRJbmRleClcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkRGF0ZXMuc3BsaWNlKHBhcnNlSW50KHNlbGVjdGVkSW5kZXgpLCAxKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkRGF0ZXMucHVzaChzZWxlY3RlZERhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIikge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNsZWFyKGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiA9IHNlbGVjdGVkRGF0ZTtcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWREYXRlcy5wdXNoKHNlbGVjdGVkRGF0ZSk7XG4gICAgICAgICAgICBpZiAoY29tcGFyZURhdGVzKHNlbGVjdGVkRGF0ZSwgc2VsZi5zZWxlY3RlZERhdGVzWzBdLCB0cnVlKSAhPT0gMClcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkRGF0ZXMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5nZXRUaW1lKCkgLSBiLmdldFRpbWUoKTsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0SG91cnNGcm9tSW5wdXRzKCk7XG4gICAgICAgIGlmIChzaG91bGRDaGFuZ2VNb250aCkge1xuICAgICAgICAgICAgdmFyIGlzTmV3WWVhciA9IHNlbGYuY3VycmVudFllYXIgIT09IHNlbGVjdGVkRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgc2VsZi5jdXJyZW50WWVhciA9IHNlbGVjdGVkRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgc2VsZi5jdXJyZW50TW9udGggPSBzZWxlY3RlZERhdGUuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIGlmIChpc05ld1llYXIpIHtcbiAgICAgICAgICAgICAgICB0cmlnZ2VyRXZlbnQoXCJvblllYXJDaGFuZ2VcIik7XG4gICAgICAgICAgICAgICAgYnVpbGRNb250aFN3aXRjaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KFwib25Nb250aENoYW5nZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVOYXZpZ2F0aW9uQ3VycmVudE1vbnRoKCk7XG4gICAgICAgIGJ1aWxkRGF5cygpO1xuICAgICAgICB1cGRhdGVWYWx1ZSgpO1xuICAgICAgICBpZiAoIXNob3VsZENoYW5nZU1vbnRoICYmXG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5tb2RlICE9PSBcInJhbmdlXCIgJiZcbiAgICAgICAgICAgIHNlbGYuY29uZmlnLnNob3dNb250aHMgPT09IDEpXG4gICAgICAgICAgICBmb2N1c09uRGF5RWxlbSh0YXJnZXQpO1xuICAgICAgICBlbHNlIGlmIChzZWxmLnNlbGVjdGVkRGF0ZUVsZW0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgc2VsZi5ob3VyRWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkRGF0ZUVsZW0gJiYgc2VsZi5zZWxlY3RlZERhdGVFbGVtLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuaG91ckVsZW1lbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHNlbGYuaG91ckVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBzZWxmLmhvdXJFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICAgICAgICB2YXIgc2luZ2xlID0gc2VsZi5jb25maWcubW9kZSA9PT0gXCJzaW5nbGVcIiAmJiAhc2VsZi5jb25maWcuZW5hYmxlVGltZTtcbiAgICAgICAgICAgIHZhciByYW5nZSA9IHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIiAmJlxuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgICAgICAhc2VsZi5jb25maWcuZW5hYmxlVGltZTtcbiAgICAgICAgICAgIGlmIChzaW5nbGUgfHwgcmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBmb2N1c0FuZENsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdHJpZ2dlckNoYW5nZSgpO1xuICAgIH1cbiAgICB2YXIgQ0FMTEJBQ0tTID0ge1xuICAgICAgICBsb2NhbGU6IFtzZXR1cExvY2FsZSwgdXBkYXRlV2Vla2RheXNdLFxuICAgICAgICBzaG93TW9udGhzOiBbYnVpbGRNb250aHMsIHNldENhbGVuZGFyV2lkdGgsIGJ1aWxkV2Vla2RheXNdLFxuICAgICAgICBtaW5EYXRlOiBbanVtcFRvRGF0ZV0sXG4gICAgICAgIG1heERhdGU6IFtqdW1wVG9EYXRlXSxcbiAgICAgICAgcG9zaXRpb25FbGVtZW50OiBbdXBkYXRlUG9zaXRpb25FbGVtZW50XSxcbiAgICAgICAgY2xpY2tPcGVuczogW1xuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5jbGlja09wZW5zID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbmQoc2VsZi5faW5wdXQsIFwiZm9jdXNcIiwgc2VsZi5vcGVuKTtcbiAgICAgICAgICAgICAgICAgICAgYmluZChzZWxmLl9pbnB1dCwgXCJjbGlja1wiLCBzZWxmLm9wZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5faW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHNlbGYub3Blbik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2lucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZWxmLm9wZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcbiAgICBmdW5jdGlvbiBzZXQob3B0aW9uLCB2YWx1ZSkge1xuICAgICAgICBpZiAob3B0aW9uICE9PSBudWxsICYmIHR5cGVvZiBvcHRpb24gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oc2VsZi5jb25maWcsIG9wdGlvbik7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKENBTExCQUNLU1trZXldICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIENBTExCQUNLU1trZXldLmZvckVhY2goZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHgoKTsgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLmNvbmZpZ1tvcHRpb25dID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoQ0FMTEJBQ0tTW29wdGlvbl0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBDQUxMQkFDS1Nbb3B0aW9uXS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4KCk7IH0pO1xuICAgICAgICAgICAgZWxzZSBpZiAoSE9PS1MuaW5kZXhPZihvcHRpb24pID4gLTEpXG4gICAgICAgICAgICAgICAgc2VsZi5jb25maWdbb3B0aW9uXSA9IGFycmF5aWZ5KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnJlZHJhdygpO1xuICAgICAgICB1cGRhdGVWYWx1ZSh0cnVlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0U2VsZWN0ZWREYXRlKGlucHV0RGF0ZSwgZm9ybWF0KSB7XG4gICAgICAgIHZhciBkYXRlcyA9IFtdO1xuICAgICAgICBpZiAoaW5wdXREYXRlIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgICAgICBkYXRlcyA9IGlucHV0RGF0ZS5tYXAoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIHNlbGYucGFyc2VEYXRlKGQsIGZvcm1hdCk7IH0pO1xuICAgICAgICBlbHNlIGlmIChpbnB1dERhdGUgaW5zdGFuY2VvZiBEYXRlIHx8IHR5cGVvZiBpbnB1dERhdGUgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICBkYXRlcyA9IFtzZWxmLnBhcnNlRGF0ZShpbnB1dERhdGUsIGZvcm1hdCldO1xuICAgICAgICBlbHNlIGlmICh0eXBlb2YgaW5wdXREYXRlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHNlbGYuY29uZmlnLm1vZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwic2luZ2xlXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInRpbWVcIjpcbiAgICAgICAgICAgICAgICAgICAgZGF0ZXMgPSBbc2VsZi5wYXJzZURhdGUoaW5wdXREYXRlLCBmb3JtYXQpXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm11bHRpcGxlXCI6XG4gICAgICAgICAgICAgICAgICAgIGRhdGVzID0gaW5wdXREYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoc2VsZi5jb25maWcuY29uanVuY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChkYXRlKSB7IHJldHVybiBzZWxmLnBhcnNlRGF0ZShkYXRlLCBmb3JtYXQpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJhbmdlXCI6XG4gICAgICAgICAgICAgICAgICAgIGRhdGVzID0gaW5wdXREYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoc2VsZi5sMTBuLnJhbmdlU2VwYXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gc2VsZi5wYXJzZURhdGUoZGF0ZSwgZm9ybWF0KTsgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlbGYuY29uZmlnLmVycm9ySGFuZGxlcihuZXcgRXJyb3IoXCJJbnZhbGlkIGRhdGUgc3VwcGxpZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoaW5wdXREYXRlKSkpO1xuICAgICAgICBzZWxmLnNlbGVjdGVkRGF0ZXMgPSAoc2VsZi5jb25maWcuYWxsb3dJbnZhbGlkUHJlbG9hZFxuICAgICAgICAgICAgPyBkYXRlc1xuICAgICAgICAgICAgOiBkYXRlcy5maWx0ZXIoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQgaW5zdGFuY2VvZiBEYXRlICYmIGlzRW5hYmxlZChkLCBmYWxzZSk7IH0pKTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIilcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWREYXRlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmdldFRpbWUoKSAtIGIuZ2V0VGltZSgpOyB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0RGF0ZShkYXRlLCB0cmlnZ2VyQ2hhbmdlLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2UgPT09IHZvaWQgMCkgeyB0cmlnZ2VyQ2hhbmdlID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gdm9pZCAwKSB7IGZvcm1hdCA9IHNlbGYuY29uZmlnLmRhdGVGb3JtYXQ7IH1cbiAgICAgICAgaWYgKChkYXRlICE9PSAwICYmICFkYXRlKSB8fCAoZGF0ZSBpbnN0YW5jZW9mIEFycmF5ICYmIGRhdGUubGVuZ3RoID09PSAwKSlcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNsZWFyKHRyaWdnZXJDaGFuZ2UpO1xuICAgICAgICBzZXRTZWxlY3RlZERhdGUoZGF0ZSwgZm9ybWF0KTtcbiAgICAgICAgc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmogPVxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZERhdGVzW3NlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgc2VsZi5yZWRyYXcoKTtcbiAgICAgICAganVtcFRvRGF0ZSh1bmRlZmluZWQsIHRyaWdnZXJDaGFuZ2UpO1xuICAgICAgICBzZXRIb3Vyc0Zyb21EYXRlKCk7XG4gICAgICAgIGlmIChzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBzZWxmLmNsZWFyKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVWYWx1ZSh0cmlnZ2VyQ2hhbmdlKTtcbiAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2UpXG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnQoXCJvbkNoYW5nZVwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGFyc2VEYXRlUnVsZXMoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnJcbiAgICAgICAgICAgIC5zbGljZSgpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJ1bGUgPT09IFwic3RyaW5nXCIgfHxcbiAgICAgICAgICAgICAgICB0eXBlb2YgcnVsZSA9PT0gXCJudW1iZXJcIiB8fFxuICAgICAgICAgICAgICAgIHJ1bGUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucGFyc2VEYXRlKHJ1bGUsIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChydWxlICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHJ1bGUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgICAgICBydWxlLmZyb20gJiZcbiAgICAgICAgICAgICAgICBydWxlLnRvKVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGZyb206IHNlbGYucGFyc2VEYXRlKHJ1bGUuZnJvbSwgdW5kZWZpbmVkKSxcbiAgICAgICAgICAgICAgICAgICAgdG86IHNlbGYucGFyc2VEYXRlKHJ1bGUudG8sIHVuZGVmaW5lZCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBydWxlO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoeCkgeyByZXR1cm4geDsgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldHVwRGF0ZXMoKSB7XG4gICAgICAgIHNlbGYuc2VsZWN0ZWREYXRlcyA9IFtdO1xuICAgICAgICBzZWxmLm5vdyA9IHNlbGYucGFyc2VEYXRlKHNlbGYuY29uZmlnLm5vdykgfHwgbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHByZWxvYWRlZERhdGUgPSBzZWxmLmNvbmZpZy5kZWZhdWx0RGF0ZSB8fFxuICAgICAgICAgICAgKChzZWxmLmlucHV0Lm5vZGVOYW1lID09PSBcIklOUFVUXCIgfHxcbiAgICAgICAgICAgICAgICBzZWxmLmlucHV0Lm5vZGVOYW1lID09PSBcIlRFWFRBUkVBXCIpICYmXG4gICAgICAgICAgICAgICAgc2VsZi5pbnB1dC5wbGFjZWhvbGRlciAmJlxuICAgICAgICAgICAgICAgIHNlbGYuaW5wdXQudmFsdWUgPT09IHNlbGYuaW5wdXQucGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgICAgICA6IHNlbGYuaW5wdXQudmFsdWUpO1xuICAgICAgICBpZiAocHJlbG9hZGVkRGF0ZSlcbiAgICAgICAgICAgIHNldFNlbGVjdGVkRGF0ZShwcmVsb2FkZWREYXRlLCBzZWxmLmNvbmZpZy5kYXRlRm9ybWF0KTtcbiAgICAgICAgc2VsZi5faW5pdGlhbERhdGUgPVxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICA/IHNlbGYuc2VsZWN0ZWREYXRlc1swXVxuICAgICAgICAgICAgICAgIDogc2VsZi5jb25maWcubWluRGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5taW5EYXRlLmdldFRpbWUoKSA+IHNlbGYubm93LmdldFRpbWUoKVxuICAgICAgICAgICAgICAgICAgICA/IHNlbGYuY29uZmlnLm1pbkRhdGVcbiAgICAgICAgICAgICAgICAgICAgOiBzZWxmLmNvbmZpZy5tYXhEYXRlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5tYXhEYXRlLmdldFRpbWUoKSA8IHNlbGYubm93LmdldFRpbWUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBzZWxmLmNvbmZpZy5tYXhEYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHNlbGYubm93O1xuICAgICAgICBzZWxmLmN1cnJlbnRZZWFyID0gc2VsZi5faW5pdGlhbERhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgc2VsZi5jdXJyZW50TW9udGggPSBzZWxmLl9pbml0aWFsRGF0ZS5nZXRNb250aCgpO1xuICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiA9IHNlbGYuc2VsZWN0ZWREYXRlc1swXTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1pblRpbWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHNlbGYuY29uZmlnLm1pblRpbWUgPSBzZWxmLnBhcnNlRGF0ZShzZWxmLmNvbmZpZy5taW5UaW1lLCBcIkg6aVwiKTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1heFRpbWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHNlbGYuY29uZmlnLm1heFRpbWUgPSBzZWxmLnBhcnNlRGF0ZShzZWxmLmNvbmZpZy5tYXhUaW1lLCBcIkg6aVwiKTtcbiAgICAgICAgc2VsZi5taW5EYXRlSGFzVGltZSA9XG4gICAgICAgICAgICAhIXNlbGYuY29uZmlnLm1pbkRhdGUgJiZcbiAgICAgICAgICAgICAgICAoc2VsZi5jb25maWcubWluRGF0ZS5nZXRIb3VycygpID4gMCB8fFxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5taW5EYXRlLmdldE1pbnV0ZXMoKSA+IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcubWluRGF0ZS5nZXRTZWNvbmRzKCkgPiAwKTtcbiAgICAgICAgc2VsZi5tYXhEYXRlSGFzVGltZSA9XG4gICAgICAgICAgICAhIXNlbGYuY29uZmlnLm1heERhdGUgJiZcbiAgICAgICAgICAgICAgICAoc2VsZi5jb25maWcubWF4RGF0ZS5nZXRIb3VycygpID4gMCB8fFxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5tYXhEYXRlLmdldE1pbnV0ZXMoKSA+IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcubWF4RGF0ZS5nZXRTZWNvbmRzKCkgPiAwKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0dXBJbnB1dHMoKSB7XG4gICAgICAgIHNlbGYuaW5wdXQgPSBnZXRJbnB1dEVsZW0oKTtcbiAgICAgICAgaWYgKCFzZWxmLmlucHV0KSB7XG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5lcnJvckhhbmRsZXIobmV3IEVycm9yKFwiSW52YWxpZCBpbnB1dCBlbGVtZW50IHNwZWNpZmllZFwiKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5pbnB1dC5fdHlwZSA9IHNlbGYuaW5wdXQudHlwZTtcbiAgICAgICAgc2VsZi5pbnB1dC50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgIHNlbGYuaW5wdXQuY2xhc3NMaXN0LmFkZChcImZsYXRwaWNrci1pbnB1dFwiKTtcbiAgICAgICAgc2VsZi5faW5wdXQgPSBzZWxmLmlucHV0O1xuICAgICAgICBpZiAoc2VsZi5jb25maWcuYWx0SW5wdXQpIHtcbiAgICAgICAgICAgIHNlbGYuYWx0SW5wdXQgPSBjcmVhdGVFbGVtZW50KHNlbGYuaW5wdXQubm9kZU5hbWUsIHNlbGYuY29uZmlnLmFsdElucHV0Q2xhc3MpO1xuICAgICAgICAgICAgc2VsZi5faW5wdXQgPSBzZWxmLmFsdElucHV0O1xuICAgICAgICAgICAgc2VsZi5hbHRJbnB1dC5wbGFjZWhvbGRlciA9IHNlbGYuaW5wdXQucGxhY2Vob2xkZXI7XG4gICAgICAgICAgICBzZWxmLmFsdElucHV0LmRpc2FibGVkID0gc2VsZi5pbnB1dC5kaXNhYmxlZDtcbiAgICAgICAgICAgIHNlbGYuYWx0SW5wdXQucmVxdWlyZWQgPSBzZWxmLmlucHV0LnJlcXVpcmVkO1xuICAgICAgICAgICAgc2VsZi5hbHRJbnB1dC50YWJJbmRleCA9IHNlbGYuaW5wdXQudGFiSW5kZXg7XG4gICAgICAgICAgICBzZWxmLmFsdElucHV0LnR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgICAgIHNlbGYuaW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImhpZGRlblwiKTtcbiAgICAgICAgICAgIGlmICghc2VsZi5jb25maWcuc3RhdGljICYmIHNlbGYuaW5wdXQucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICBzZWxmLmlucHV0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNlbGYuYWx0SW5wdXQsIHNlbGYuaW5wdXQubmV4dFNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5jb25maWcuYWxsb3dJbnB1dClcbiAgICAgICAgICAgIHNlbGYuX2lucHV0LnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIFwicmVhZG9ubHlcIik7XG4gICAgICAgIHVwZGF0ZVBvc2l0aW9uRWxlbWVudCgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbkVsZW1lbnQoKSB7XG4gICAgICAgIHNlbGYuX3Bvc2l0aW9uRWxlbWVudCA9IHNlbGYuY29uZmlnLnBvc2l0aW9uRWxlbWVudCB8fCBzZWxmLl9pbnB1dDtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0dXBNb2JpbGUoKSB7XG4gICAgICAgIHZhciBpbnB1dFR5cGUgPSBzZWxmLmNvbmZpZy5lbmFibGVUaW1lXG4gICAgICAgICAgICA/IHNlbGYuY29uZmlnLm5vQ2FsZW5kYXJcbiAgICAgICAgICAgICAgICA/IFwidGltZVwiXG4gICAgICAgICAgICAgICAgOiBcImRhdGV0aW1lLWxvY2FsXCJcbiAgICAgICAgICAgIDogXCJkYXRlXCI7XG4gICAgICAgIHNlbGYubW9iaWxlSW5wdXQgPSBjcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgc2VsZi5pbnB1dC5jbGFzc05hbWUgKyBcIiBmbGF0cGlja3ItbW9iaWxlXCIpO1xuICAgICAgICBzZWxmLm1vYmlsZUlucHV0LnRhYkluZGV4ID0gMTtcbiAgICAgICAgc2VsZi5tb2JpbGVJbnB1dC50eXBlID0gaW5wdXRUeXBlO1xuICAgICAgICBzZWxmLm1vYmlsZUlucHV0LmRpc2FibGVkID0gc2VsZi5pbnB1dC5kaXNhYmxlZDtcbiAgICAgICAgc2VsZi5tb2JpbGVJbnB1dC5yZXF1aXJlZCA9IHNlbGYuaW5wdXQucmVxdWlyZWQ7XG4gICAgICAgIHNlbGYubW9iaWxlSW5wdXQucGxhY2Vob2xkZXIgPSBzZWxmLmlucHV0LnBsYWNlaG9sZGVyO1xuICAgICAgICBzZWxmLm1vYmlsZUZvcm1hdFN0ciA9XG4gICAgICAgICAgICBpbnB1dFR5cGUgPT09IFwiZGF0ZXRpbWUtbG9jYWxcIlxuICAgICAgICAgICAgICAgID8gXCJZLW0tZFxcXFxUSDppOlNcIlxuICAgICAgICAgICAgICAgIDogaW5wdXRUeXBlID09PSBcImRhdGVcIlxuICAgICAgICAgICAgICAgICAgICA/IFwiWS1tLWRcIlxuICAgICAgICAgICAgICAgICAgICA6IFwiSDppOlNcIjtcbiAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZWxmLm1vYmlsZUlucHV0LmRlZmF1bHRWYWx1ZSA9IHNlbGYubW9iaWxlSW5wdXQudmFsdWUgPSBzZWxmLmZvcm1hdERhdGUoc2VsZi5zZWxlY3RlZERhdGVzWzBdLCBzZWxmLm1vYmlsZUZvcm1hdFN0cik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLm1pbkRhdGUpXG4gICAgICAgICAgICBzZWxmLm1vYmlsZUlucHV0Lm1pbiA9IHNlbGYuZm9ybWF0RGF0ZShzZWxmLmNvbmZpZy5taW5EYXRlLCBcIlktbS1kXCIpO1xuICAgICAgICBpZiAoc2VsZi5jb25maWcubWF4RGF0ZSlcbiAgICAgICAgICAgIHNlbGYubW9iaWxlSW5wdXQubWF4ID0gc2VsZi5mb3JtYXREYXRlKHNlbGYuY29uZmlnLm1heERhdGUsIFwiWS1tLWRcIik7XG4gICAgICAgIGlmIChzZWxmLmlucHV0LmdldEF0dHJpYnV0ZShcInN0ZXBcIikpXG4gICAgICAgICAgICBzZWxmLm1vYmlsZUlucHV0LnN0ZXAgPSBTdHJpbmcoc2VsZi5pbnB1dC5nZXRBdHRyaWJ1dGUoXCJzdGVwXCIpKTtcbiAgICAgICAgc2VsZi5pbnB1dC50eXBlID0gXCJoaWRkZW5cIjtcbiAgICAgICAgaWYgKHNlbGYuYWx0SW5wdXQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHNlbGYuYWx0SW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5pbnB1dC5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgIHNlbGYuaW5wdXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2VsZi5tb2JpbGVJbnB1dCwgc2VsZi5pbnB1dC5uZXh0U2libGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKF9hKSB7IH1cbiAgICAgICAgYmluZChzZWxmLm1vYmlsZUlucHV0LCBcImNoYW5nZVwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgc2VsZi5zZXREYXRlKGdldEV2ZW50VGFyZ2V0KGUpLnZhbHVlLCBmYWxzZSwgc2VsZi5tb2JpbGVGb3JtYXRTdHIpO1xuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KFwib25DaGFuZ2VcIik7XG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnQoXCJvbkNsb3NlXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdG9nZ2xlKGUpIHtcbiAgICAgICAgaWYgKHNlbGYuaXNPcGVuID09PSB0cnVlKVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2xvc2UoKTtcbiAgICAgICAgc2VsZi5vcGVuKGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0cmlnZ2VyRXZlbnQoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBob29rcyA9IHNlbGYuY29uZmlnW2V2ZW50XTtcbiAgICAgICAgaWYgKGhvb2tzICE9PSB1bmRlZmluZWQgJiYgaG9va3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGhvb2tzW2ldICYmIGkgPCBob29rcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICBob29rc1tpXShzZWxmLnNlbGVjdGVkRGF0ZXMsIHNlbGYuaW5wdXQudmFsdWUsIHNlbGYsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudCA9PT0gXCJvbkNoYW5nZVwiKSB7XG4gICAgICAgICAgICBzZWxmLmlucHV0LmRpc3BhdGNoRXZlbnQoY3JlYXRlRXZlbnQoXCJjaGFuZ2VcIikpO1xuICAgICAgICAgICAgc2VsZi5pbnB1dC5kaXNwYXRjaEV2ZW50KGNyZWF0ZUV2ZW50KFwiaW5wdXRcIikpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZUV2ZW50KG5hbWUpIHtcbiAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgICAgICBlLmluaXRFdmVudChuYW1lLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRGF0ZVNlbGVjdGVkKGRhdGUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZERhdGUgPSBzZWxmLnNlbGVjdGVkRGF0ZXNbaV07XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWREYXRlIGluc3RhbmNlb2YgRGF0ZSAmJlxuICAgICAgICAgICAgICAgIGNvbXBhcmVEYXRlcyhzZWxlY3RlZERhdGUsIGRhdGUpID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiICsgaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRGF0ZUluUmFuZ2UoZGF0ZSkge1xuICAgICAgICBpZiAoc2VsZi5jb25maWcubW9kZSAhPT0gXCJyYW5nZVwiIHx8IHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gKGNvbXBhcmVEYXRlcyhkYXRlLCBzZWxmLnNlbGVjdGVkRGF0ZXNbMF0pID49IDAgJiZcbiAgICAgICAgICAgIGNvbXBhcmVEYXRlcyhkYXRlLCBzZWxmLnNlbGVjdGVkRGF0ZXNbMV0pIDw9IDApO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVOYXZpZ2F0aW9uQ3VycmVudE1vbnRoKCkge1xuICAgICAgICBpZiAoc2VsZi5jb25maWcubm9DYWxlbmRhciB8fCBzZWxmLmlzTW9iaWxlIHx8ICFzZWxmLm1vbnRoTmF2KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBzZWxmLnllYXJFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uICh5ZWFyRWxlbWVudCwgaSkge1xuICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLmN1cnJlbnRZZWFyLCBzZWxmLmN1cnJlbnRNb250aCwgMSk7XG4gICAgICAgICAgICBkLnNldE1vbnRoKHNlbGYuY3VycmVudE1vbnRoICsgaSk7XG4gICAgICAgICAgICBpZiAoc2VsZi5jb25maWcuc2hvd01vbnRocyA+IDEgfHxcbiAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5tb250aFNlbGVjdG9yVHlwZSA9PT0gXCJzdGF0aWNcIikge1xuICAgICAgICAgICAgICAgIHNlbGYubW9udGhFbGVtZW50c1tpXS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgIG1vbnRoVG9TdHIoZC5nZXRNb250aCgpLCBzZWxmLmNvbmZpZy5zaG9ydGhhbmRDdXJyZW50TW9udGgsIHNlbGYubDEwbikgKyBcIiBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYubW9udGhzRHJvcGRvd25Db250YWluZXIudmFsdWUgPSBkLmdldE1vbnRoKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHllYXJFbGVtZW50LnZhbHVlID0gZC5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZWxmLl9oaWRlUHJldk1vbnRoQXJyb3cgPVxuICAgICAgICAgICAgc2VsZi5jb25maWcubWluRGF0ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgKHNlbGYuY3VycmVudFllYXIgPT09IHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0RnVsbFllYXIoKVxuICAgICAgICAgICAgICAgICAgICA/IHNlbGYuY3VycmVudE1vbnRoIDw9IHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0TW9udGgoKVxuICAgICAgICAgICAgICAgICAgICA6IHNlbGYuY3VycmVudFllYXIgPCBzZWxmLmNvbmZpZy5taW5EYXRlLmdldEZ1bGxZZWFyKCkpO1xuICAgICAgICBzZWxmLl9oaWRlTmV4dE1vbnRoQXJyb3cgPVxuICAgICAgICAgICAgc2VsZi5jb25maWcubWF4RGF0ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgKHNlbGYuY3VycmVudFllYXIgPT09IHNlbGYuY29uZmlnLm1heERhdGUuZ2V0RnVsbFllYXIoKVxuICAgICAgICAgICAgICAgICAgICA/IHNlbGYuY3VycmVudE1vbnRoICsgMSA+IHNlbGYuY29uZmlnLm1heERhdGUuZ2V0TW9udGgoKVxuICAgICAgICAgICAgICAgICAgICA6IHNlbGYuY3VycmVudFllYXIgPiBzZWxmLmNvbmZpZy5tYXhEYXRlLmdldEZ1bGxZZWFyKCkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXREYXRlU3RyKHNwZWNpZmljRm9ybWF0KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSBzcGVjaWZpY0Zvcm1hdCB8fFxuICAgICAgICAgICAgKHNlbGYuY29uZmlnLmFsdElucHV0ID8gc2VsZi5jb25maWcuYWx0Rm9ybWF0IDogc2VsZi5jb25maWcuZGF0ZUZvcm1hdCk7XG4gICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkRGF0ZXNcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGRPYmopIHsgcmV0dXJuIHNlbGYuZm9ybWF0RGF0ZShkT2JqLCBmb3JtYXQpOyB9KVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZCwgaSwgYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jb25maWcubW9kZSAhPT0gXCJyYW5nZVwiIHx8XG4gICAgICAgICAgICAgICAgc2VsZi5jb25maWcuZW5hYmxlVGltZSB8fFxuICAgICAgICAgICAgICAgIGFyci5pbmRleE9mKGQpID09PSBpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oc2VsZi5jb25maWcubW9kZSAhPT0gXCJyYW5nZVwiXG4gICAgICAgICAgICA/IHNlbGYuY29uZmlnLmNvbmp1bmN0aW9uXG4gICAgICAgICAgICA6IHNlbGYubDEwbi5yYW5nZVNlcGFyYXRvcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZVZhbHVlKHRyaWdnZXJDaGFuZ2UpIHtcbiAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2UgPT09IHZvaWQgMCkgeyB0cmlnZ2VyQ2hhbmdlID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoc2VsZi5tb2JpbGVJbnB1dCAhPT0gdW5kZWZpbmVkICYmIHNlbGYubW9iaWxlRm9ybWF0U3RyKSB7XG4gICAgICAgICAgICBzZWxmLm1vYmlsZUlucHV0LnZhbHVlID1cbiAgICAgICAgICAgICAgICBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgID8gc2VsZi5mb3JtYXREYXRlKHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqLCBzZWxmLm1vYmlsZUZvcm1hdFN0cilcbiAgICAgICAgICAgICAgICAgICAgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuaW5wdXQudmFsdWUgPSBnZXREYXRlU3RyKHNlbGYuY29uZmlnLmRhdGVGb3JtYXQpO1xuICAgICAgICBpZiAoc2VsZi5hbHRJbnB1dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZWxmLmFsdElucHV0LnZhbHVlID0gZ2V0RGF0ZVN0cihzZWxmLmNvbmZpZy5hbHRGb3JtYXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmlnZ2VyQ2hhbmdlICE9PSBmYWxzZSlcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChcIm9uVmFsdWVVcGRhdGVcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW9udGhOYXZDbGljayhlKSB7XG4gICAgICAgIHZhciBldmVudFRhcmdldCA9IGdldEV2ZW50VGFyZ2V0KGUpO1xuICAgICAgICB2YXIgaXNQcmV2TW9udGggPSBzZWxmLnByZXZNb250aE5hdi5jb250YWlucyhldmVudFRhcmdldCk7XG4gICAgICAgIHZhciBpc05leHRNb250aCA9IHNlbGYubmV4dE1vbnRoTmF2LmNvbnRhaW5zKGV2ZW50VGFyZ2V0KTtcbiAgICAgICAgaWYgKGlzUHJldk1vbnRoIHx8IGlzTmV4dE1vbnRoKSB7XG4gICAgICAgICAgICBjaGFuZ2VNb250aChpc1ByZXZNb250aCA/IC0xIDogMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VsZi55ZWFyRWxlbWVudHMuaW5kZXhPZihldmVudFRhcmdldCkgPj0gMCkge1xuICAgICAgICAgICAgZXZlbnRUYXJnZXQuc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYXJyb3dVcFwiKSkge1xuICAgICAgICAgICAgc2VsZi5jaGFuZ2VZZWFyKHNlbGYuY3VycmVudFllYXIgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhcnJvd0Rvd25cIikpIHtcbiAgICAgICAgICAgIHNlbGYuY2hhbmdlWWVhcihzZWxmLmN1cnJlbnRZZWFyIC0gMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdGltZVdyYXBwZXIoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBpc0tleURvd24gPSBlLnR5cGUgPT09IFwia2V5ZG93blwiLCBldmVudFRhcmdldCA9IGdldEV2ZW50VGFyZ2V0KGUpLCBpbnB1dCA9IGV2ZW50VGFyZ2V0O1xuICAgICAgICBpZiAoc2VsZi5hbVBNICE9PSB1bmRlZmluZWQgJiYgZXZlbnRUYXJnZXQgPT09IHNlbGYuYW1QTSkge1xuICAgICAgICAgICAgc2VsZi5hbVBNLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICBzZWxmLmwxMG4uYW1QTVtpbnQoc2VsZi5hbVBNLnRleHRDb250ZW50ID09PSBzZWxmLmwxMG4uYW1QTVswXSldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtaW4gPSBwYXJzZUZsb2F0KGlucHV0LmdldEF0dHJpYnV0ZShcIm1pblwiKSksIG1heCA9IHBhcnNlRmxvYXQoaW5wdXQuZ2V0QXR0cmlidXRlKFwibWF4XCIpKSwgc3RlcCA9IHBhcnNlRmxvYXQoaW5wdXQuZ2V0QXR0cmlidXRlKFwic3RlcFwiKSksIGN1clZhbHVlID0gcGFyc2VJbnQoaW5wdXQudmFsdWUsIDEwKSwgZGVsdGEgPSBlLmRlbHRhIHx8XG4gICAgICAgICAgICAoaXNLZXlEb3duID8gKGUud2hpY2ggPT09IDM4ID8gMSA6IC0xKSA6IDApO1xuICAgICAgICB2YXIgbmV3VmFsdWUgPSBjdXJWYWx1ZSArIHN0ZXAgKiBkZWx0YTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC52YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHZhciBpc0hvdXJFbGVtID0gaW5wdXQgPT09IHNlbGYuaG91ckVsZW1lbnQsIGlzTWludXRlRWxlbSA9IGlucHV0ID09PSBzZWxmLm1pbnV0ZUVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPCBtaW4pIHtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgIG1heCArXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQoIWlzSG91ckVsZW0pICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChpbnQoaXNIb3VyRWxlbSkgJiYgaW50KCFzZWxmLmFtUE0pKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNNaW51dGVFbGVtKVxuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnROdW1JbnB1dCh1bmRlZmluZWQsIC0xLCBzZWxmLmhvdXJFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5ld1ZhbHVlID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPVxuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9PT0gc2VsZi5ob3VyRWxlbWVudCA/IG5ld1ZhbHVlIC0gbWF4IC0gaW50KCFzZWxmLmFtUE0pIDogbWluO1xuICAgICAgICAgICAgICAgIGlmIChpc01pbnV0ZUVsZW0pXG4gICAgICAgICAgICAgICAgICAgIGluY3JlbWVudE51bUlucHV0KHVuZGVmaW5lZCwgMSwgc2VsZi5ob3VyRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5hbVBNICYmXG4gICAgICAgICAgICAgICAgaXNIb3VyRWxlbSAmJlxuICAgICAgICAgICAgICAgIChzdGVwID09PSAxXG4gICAgICAgICAgICAgICAgICAgID8gbmV3VmFsdWUgKyBjdXJWYWx1ZSA9PT0gMjNcbiAgICAgICAgICAgICAgICAgICAgOiBNYXRoLmFicyhuZXdWYWx1ZSAtIGN1clZhbHVlKSA+IHN0ZXApKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hbVBNLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sMTBuLmFtUE1baW50KHNlbGYuYW1QTS50ZXh0Q29udGVudCA9PT0gc2VsZi5sMTBuLmFtUE1bMF0pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gcGFkKG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpbml0KCk7XG4gICAgcmV0dXJuIHNlbGY7XG59XG5mdW5jdGlvbiBfZmxhdHBpY2tyKG5vZGVMaXN0LCBjb25maWcpIHtcbiAgICB2YXIgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgICAgLmNhbGwobm9kZUxpc3QpXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHggaW5zdGFuY2VvZiBIVE1MRWxlbWVudDsgfSk7XG4gICAgdmFyIGluc3RhbmNlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZShcImRhdGEtZnAtb21pdFwiKSAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGlmIChub2RlLl9mbGF0cGlja3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5vZGUuX2ZsYXRwaWNrci5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgbm9kZS5fZmxhdHBpY2tyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5fZmxhdHBpY2tyID0gRmxhdHBpY2tySW5zdGFuY2Uobm9kZSwgY29uZmlnIHx8IHt9KTtcbiAgICAgICAgICAgIGluc3RhbmNlcy5wdXNoKG5vZGUuX2ZsYXRwaWNrcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlcy5sZW5ndGggPT09IDEgPyBpbnN0YW5jZXNbMF0gOiBpbnN0YW5jZXM7XG59XG5pZiAodHlwZW9mIEhUTUxFbGVtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgdHlwZW9mIEhUTUxDb2xsZWN0aW9uICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgdHlwZW9mIE5vZGVMaXN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLmZsYXRwaWNrciA9IE5vZGVMaXN0LnByb3RvdHlwZS5mbGF0cGlja3IgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHJldHVybiBfZmxhdHBpY2tyKHRoaXMsIGNvbmZpZyk7XG4gICAgfTtcbiAgICBIVE1MRWxlbWVudC5wcm90b3R5cGUuZmxhdHBpY2tyID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICByZXR1cm4gX2ZsYXRwaWNrcihbdGhpc10sIGNvbmZpZyk7XG4gICAgfTtcbn1cbnZhciBmbGF0cGlja3IgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGNvbmZpZykge1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIF9mbGF0cGlja3Iod2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLCBjb25maWcpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgcmV0dXJuIF9mbGF0cGlja3IoW3NlbGVjdG9yXSwgY29uZmlnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfZmxhdHBpY2tyKHNlbGVjdG9yLCBjb25maWcpO1xuICAgIH1cbn07XG5mbGF0cGlja3IuZGVmYXVsdENvbmZpZyA9IHt9O1xuZmxhdHBpY2tyLmwxMG5zID0ge1xuICAgIGVuOiBfX2Fzc2lnbih7fSwgRW5nbGlzaCksXG4gICAgZGVmYXVsdDogX19hc3NpZ24oe30sIEVuZ2xpc2gpLFxufTtcbmZsYXRwaWNrci5sb2NhbGl6ZSA9IGZ1bmN0aW9uIChsMTBuKSB7XG4gICAgZmxhdHBpY2tyLmwxMG5zLmRlZmF1bHQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZmxhdHBpY2tyLmwxMG5zLmRlZmF1bHQpLCBsMTBuKTtcbn07XG5mbGF0cGlja3Iuc2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgZmxhdHBpY2tyLmRlZmF1bHRDb25maWcgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZmxhdHBpY2tyLmRlZmF1bHRDb25maWcpLCBjb25maWcpO1xufTtcbmZsYXRwaWNrci5wYXJzZURhdGUgPSBjcmVhdGVEYXRlUGFyc2VyKHt9KTtcbmZsYXRwaWNrci5mb3JtYXREYXRlID0gY3JlYXRlRGF0ZUZvcm1hdHRlcih7fSk7XG5mbGF0cGlja3IuY29tcGFyZURhdGVzID0gY29tcGFyZURhdGVzO1xuaWYgKHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGpRdWVyeS5mbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGpRdWVyeS5mbi5mbGF0cGlja3IgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHJldHVybiBfZmxhdHBpY2tyKHRoaXMsIGNvbmZpZyk7XG4gICAgfTtcbn1cbkRhdGUucHJvdG90eXBlLmZwX2luY3IgPSBmdW5jdGlvbiAoZGF5cykge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLmdldEZ1bGxZZWFyKCksIHRoaXMuZ2V0TW9udGgoKSwgdGhpcy5nZXREYXRlKCkgKyAodHlwZW9mIGRheXMgPT09IFwic3RyaW5nXCIgPyBwYXJzZUludChkYXlzLCAxMCkgOiBkYXlzKSk7XG59O1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuZmxhdHBpY2tyID0gZmxhdHBpY2tyO1xufVxuZXhwb3J0IGRlZmF1bHQgZmxhdHBpY2tyO1xuIiwiZXhwb3J0IHZhciBlbmdsaXNoID0ge1xuICAgIHdlZWtkYXlzOiB7XG4gICAgICAgIHNob3J0aGFuZDogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdLFxuICAgICAgICBsb25naGFuZDogW1xuICAgICAgICAgICAgXCJTdW5kYXlcIixcbiAgICAgICAgICAgIFwiTW9uZGF5XCIsXG4gICAgICAgICAgICBcIlR1ZXNkYXlcIixcbiAgICAgICAgICAgIFwiV2VkbmVzZGF5XCIsXG4gICAgICAgICAgICBcIlRodXJzZGF5XCIsXG4gICAgICAgICAgICBcIkZyaWRheVwiLFxuICAgICAgICAgICAgXCJTYXR1cmRheVwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgbW9udGhzOiB7XG4gICAgICAgIHNob3J0aGFuZDogW1xuICAgICAgICAgICAgXCJKYW5cIixcbiAgICAgICAgICAgIFwiRmViXCIsXG4gICAgICAgICAgICBcIk1hclwiLFxuICAgICAgICAgICAgXCJBcHJcIixcbiAgICAgICAgICAgIFwiTWF5XCIsXG4gICAgICAgICAgICBcIkp1blwiLFxuICAgICAgICAgICAgXCJKdWxcIixcbiAgICAgICAgICAgIFwiQXVnXCIsXG4gICAgICAgICAgICBcIlNlcFwiLFxuICAgICAgICAgICAgXCJPY3RcIixcbiAgICAgICAgICAgIFwiTm92XCIsXG4gICAgICAgICAgICBcIkRlY1wiLFxuICAgICAgICBdLFxuICAgICAgICBsb25naGFuZDogW1xuICAgICAgICAgICAgXCJKYW51YXJ5XCIsXG4gICAgICAgICAgICBcIkZlYnJ1YXJ5XCIsXG4gICAgICAgICAgICBcIk1hcmNoXCIsXG4gICAgICAgICAgICBcIkFwcmlsXCIsXG4gICAgICAgICAgICBcIk1heVwiLFxuICAgICAgICAgICAgXCJKdW5lXCIsXG4gICAgICAgICAgICBcIkp1bHlcIixcbiAgICAgICAgICAgIFwiQXVndXN0XCIsXG4gICAgICAgICAgICBcIlNlcHRlbWJlclwiLFxuICAgICAgICAgICAgXCJPY3RvYmVyXCIsXG4gICAgICAgICAgICBcIk5vdmVtYmVyXCIsXG4gICAgICAgICAgICBcIkRlY2VtYmVyXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICBkYXlzSW5Nb250aDogWzMxLCAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdLFxuICAgIGZpcnN0RGF5T2ZXZWVrOiAwLFxuICAgIG9yZGluYWw6IGZ1bmN0aW9uIChudGgpIHtcbiAgICAgICAgdmFyIHMgPSBudGggJSAxMDA7XG4gICAgICAgIGlmIChzID4gMyAmJiBzIDwgMjEpXG4gICAgICAgICAgICByZXR1cm4gXCJ0aFwiO1xuICAgICAgICBzd2l0Y2ggKHMgJSAxMCkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJldHVybiBcInN0XCI7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibmRcIjtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJyZFwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0aFwiO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByYW5nZVNlcGFyYXRvcjogXCIgdG8gXCIsXG4gICAgd2Vla0FiYnJldmlhdGlvbjogXCJXa1wiLFxuICAgIHNjcm9sbFRpdGxlOiBcIlNjcm9sbCB0byBpbmNyZW1lbnRcIixcbiAgICB0b2dnbGVUaXRsZTogXCJDbGljayB0byB0b2dnbGVcIixcbiAgICBhbVBNOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgIHllYXJBcmlhTGFiZWw6IFwiWWVhclwiLFxuICAgIG1vbnRoQXJpYUxhYmVsOiBcIk1vbnRoXCIsXG4gICAgaG91ckFyaWFMYWJlbDogXCJIb3VyXCIsXG4gICAgbWludXRlQXJpYUxhYmVsOiBcIk1pbnV0ZVwiLFxuICAgIHRpbWVfMjRocjogZmFsc2UsXG59O1xuZXhwb3J0IGRlZmF1bHQgZW5nbGlzaDtcbiIsImV4cG9ydCB2YXIgSE9PS1MgPSBbXG4gICAgXCJvbkNoYW5nZVwiLFxuICAgIFwib25DbG9zZVwiLFxuICAgIFwib25EYXlDcmVhdGVcIixcbiAgICBcIm9uRGVzdHJveVwiLFxuICAgIFwib25LZXlEb3duXCIsXG4gICAgXCJvbk1vbnRoQ2hhbmdlXCIsXG4gICAgXCJvbk9wZW5cIixcbiAgICBcIm9uUGFyc2VDb25maWdcIixcbiAgICBcIm9uUmVhZHlcIixcbiAgICBcIm9uVmFsdWVVcGRhdGVcIixcbiAgICBcIm9uWWVhckNoYW5nZVwiLFxuICAgIFwib25QcmVDYWxlbmRhclBvc2l0aW9uXCIsXG5dO1xuZXhwb3J0IHZhciBkZWZhdWx0cyA9IHtcbiAgICBfZGlzYWJsZTogW10sXG4gICAgYWxsb3dJbnB1dDogZmFsc2UsXG4gICAgYWxsb3dJbnZhbGlkUHJlbG9hZDogZmFsc2UsXG4gICAgYWx0Rm9ybWF0OiBcIkYgaiwgWVwiLFxuICAgIGFsdElucHV0OiBmYWxzZSxcbiAgICBhbHRJbnB1dENsYXNzOiBcImZvcm0tY29udHJvbCBpbnB1dFwiLFxuICAgIGFuaW1hdGU6IHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgPT09IC0xLFxuICAgIGFyaWFEYXRlRm9ybWF0OiBcIkYgaiwgWVwiLFxuICAgIGF1dG9GaWxsRGVmYXVsdFRpbWU6IHRydWUsXG4gICAgY2xpY2tPcGVuczogdHJ1ZSxcbiAgICBjbG9zZU9uU2VsZWN0OiB0cnVlLFxuICAgIGNvbmp1bmN0aW9uOiBcIiwgXCIsXG4gICAgZGF0ZUZvcm1hdDogXCJZLW0tZFwiLFxuICAgIGRlZmF1bHRIb3VyOiAxMixcbiAgICBkZWZhdWx0TWludXRlOiAwLFxuICAgIGRlZmF1bHRTZWNvbmRzOiAwLFxuICAgIGRpc2FibGU6IFtdLFxuICAgIGRpc2FibGVNb2JpbGU6IGZhbHNlLFxuICAgIGVuYWJsZVNlY29uZHM6IGZhbHNlLFxuICAgIGVuYWJsZVRpbWU6IGZhbHNlLFxuICAgIGVycm9ySGFuZGxlcjogZnVuY3Rpb24gKGVycikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS53YXJuKGVycik7XG4gICAgfSxcbiAgICBnZXRXZWVrOiBmdW5jdGlvbiAoZ2l2ZW5EYXRlKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZ2l2ZW5EYXRlLmdldFRpbWUoKSk7XG4gICAgICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDMgLSAoKGRhdGUuZ2V0RGF5KCkgKyA2KSAlIDcpKTtcbiAgICAgICAgdmFyIHdlZWsxID0gbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLCAwLCA0KTtcbiAgICAgICAgcmV0dXJuICgxICtcbiAgICAgICAgICAgIE1hdGgucm91bmQoKChkYXRlLmdldFRpbWUoKSAtIHdlZWsxLmdldFRpbWUoKSkgLyA4NjQwMDAwMCAtXG4gICAgICAgICAgICAgICAgMyArXG4gICAgICAgICAgICAgICAgKCh3ZWVrMS5nZXREYXkoKSArIDYpICUgNykpIC9cbiAgICAgICAgICAgICAgICA3KSk7XG4gICAgfSxcbiAgICBob3VySW5jcmVtZW50OiAxLFxuICAgIGlnbm9yZWRGb2N1c0VsZW1lbnRzOiBbXSxcbiAgICBpbmxpbmU6IGZhbHNlLFxuICAgIGxvY2FsZTogXCJkZWZhdWx0XCIsXG4gICAgbWludXRlSW5jcmVtZW50OiA1LFxuICAgIG1vZGU6IFwic2luZ2xlXCIsXG4gICAgbW9udGhTZWxlY3RvclR5cGU6IFwiZHJvcGRvd25cIixcbiAgICBuZXh0QXJyb3c6IFwiPHN2ZyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHZpZXdCb3g9JzAgMCAxNyAxNyc+PGc+PC9nPjxwYXRoIGQ9J00xMy4yMDcgOC40NzJsLTcuODU0IDcuODU0LTAuNzA3LTAuNzA3IDcuMTQ2LTcuMTQ2LTcuMTQ2LTcuMTQ4IDAuNzA3LTAuNzA3IDcuODU0IDcuODU0eicgLz48L3N2Zz5cIixcbiAgICBub0NhbGVuZGFyOiBmYWxzZSxcbiAgICBub3c6IG5ldyBEYXRlKCksXG4gICAgb25DaGFuZ2U6IFtdLFxuICAgIG9uQ2xvc2U6IFtdLFxuICAgIG9uRGF5Q3JlYXRlOiBbXSxcbiAgICBvbkRlc3Ryb3k6IFtdLFxuICAgIG9uS2V5RG93bjogW10sXG4gICAgb25Nb250aENoYW5nZTogW10sXG4gICAgb25PcGVuOiBbXSxcbiAgICBvblBhcnNlQ29uZmlnOiBbXSxcbiAgICBvblJlYWR5OiBbXSxcbiAgICBvblZhbHVlVXBkYXRlOiBbXSxcbiAgICBvblllYXJDaGFuZ2U6IFtdLFxuICAgIG9uUHJlQ2FsZW5kYXJQb3NpdGlvbjogW10sXG4gICAgcGx1Z2luczogW10sXG4gICAgcG9zaXRpb246IFwiYXV0b1wiLFxuICAgIHBvc2l0aW9uRWxlbWVudDogdW5kZWZpbmVkLFxuICAgIHByZXZBcnJvdzogXCI8c3ZnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgdmlld0JveD0nMCAwIDE3IDE3Jz48Zz48L2c+PHBhdGggZD0nTTUuMjA3IDguNDcxbDcuMTQ2IDcuMTQ3LTAuNzA3IDAuNzA3LTcuODUzLTcuODU0IDcuODU0LTcuODUzIDAuNzA3IDAuNzA3LTcuMTQ3IDcuMTQ2eicgLz48L3N2Zz5cIixcbiAgICBzaG9ydGhhbmRDdXJyZW50TW9udGg6IGZhbHNlLFxuICAgIHNob3dNb250aHM6IDEsXG4gICAgc3RhdGljOiBmYWxzZSxcbiAgICB0aW1lXzI0aHI6IGZhbHNlLFxuICAgIHdlZWtOdW1iZXJzOiBmYWxzZSxcbiAgICB3cmFwOiBmYWxzZSxcbn07XG4iLCJpbXBvcnQgeyB0b2tlblJlZ2V4LCByZXZGb3JtYXQsIGZvcm1hdHMsIH0gZnJvbSBcIi4vZm9ybWF0dGluZ1wiO1xuaW1wb3J0IHsgZGVmYXVsdHMgfSBmcm9tIFwiLi4vdHlwZXMvb3B0aW9uc1wiO1xuaW1wb3J0IHsgZW5nbGlzaCB9IGZyb20gXCIuLi9sMTBuL2RlZmF1bHRcIjtcbmV4cG9ydCB2YXIgY3JlYXRlRGF0ZUZvcm1hdHRlciA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBfYiA9IF9hLmNvbmZpZywgY29uZmlnID0gX2IgPT09IHZvaWQgMCA/IGRlZmF1bHRzIDogX2IsIF9jID0gX2EubDEwbiwgbDEwbiA9IF9jID09PSB2b2lkIDAgPyBlbmdsaXNoIDogX2MsIF9kID0gX2EuaXNNb2JpbGUsIGlzTW9iaWxlID0gX2QgPT09IHZvaWQgMCA/IGZhbHNlIDogX2Q7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRlT2JqLCBmcm10LCBvdmVycmlkZUxvY2FsZSkge1xuICAgICAgICB2YXIgbG9jYWxlID0gb3ZlcnJpZGVMb2NhbGUgfHwgbDEwbjtcbiAgICAgICAgaWYgKGNvbmZpZy5mb3JtYXREYXRlICE9PSB1bmRlZmluZWQgJiYgIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLmZvcm1hdERhdGUoZGF0ZU9iaiwgZnJtdCwgbG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnJtdFxuICAgICAgICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjLCBpLCBhcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRzW2NdICYmIGFycltpIC0gMV0gIT09IFwiXFxcXFwiXG4gICAgICAgICAgICAgICAgPyBmb3JtYXRzW2NdKGRhdGVPYmosIGxvY2FsZSwgY29uZmlnKVxuICAgICAgICAgICAgICAgIDogYyAhPT0gXCJcXFxcXCJcbiAgICAgICAgICAgICAgICAgICAgPyBjXG4gICAgICAgICAgICAgICAgICAgIDogXCJcIjtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKFwiXCIpO1xuICAgIH07XG59O1xuZXhwb3J0IHZhciBjcmVhdGVEYXRlUGFyc2VyID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIF9iID0gX2EuY29uZmlnLCBjb25maWcgPSBfYiA9PT0gdm9pZCAwID8gZGVmYXVsdHMgOiBfYiwgX2MgPSBfYS5sMTBuLCBsMTBuID0gX2MgPT09IHZvaWQgMCA/IGVuZ2xpc2ggOiBfYztcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGUsIGdpdmVuRm9ybWF0LCB0aW1lbGVzcywgY3VzdG9tTG9jYWxlKSB7XG4gICAgICAgIGlmIChkYXRlICE9PSAwICYmICFkYXRlKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGxvY2FsZSA9IGN1c3RvbUxvY2FsZSB8fCBsMTBuO1xuICAgICAgICB2YXIgcGFyc2VkRGF0ZTtcbiAgICAgICAgdmFyIGRhdGVPcmlnID0gZGF0ZTtcbiAgICAgICAgaWYgKGRhdGUgaW5zdGFuY2VvZiBEYXRlKVxuICAgICAgICAgICAgcGFyc2VkRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRhdGUgIT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgIGRhdGUudG9GaXhlZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcGFyc2VkRGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGF0ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IGdpdmVuRm9ybWF0IHx8IChjb25maWcgfHwgZGVmYXVsdHMpLmRhdGVGb3JtYXQ7XG4gICAgICAgICAgICB2YXIgZGF0ZXN0ciA9IFN0cmluZyhkYXRlKS50cmltKCk7XG4gICAgICAgICAgICBpZiAoZGF0ZXN0ciA9PT0gXCJ0b2RheVwiKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VkRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgdGltZWxlc3MgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29uZmlnICYmIGNvbmZpZy5wYXJzZURhdGUpIHtcbiAgICAgICAgICAgICAgICBwYXJzZWREYXRlID0gY29uZmlnLnBhcnNlRGF0ZShkYXRlLCBmb3JtYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoL1okLy50ZXN0KGRhdGVzdHIpIHx8XG4gICAgICAgICAgICAgICAgL0dNVCQvLnRlc3QoZGF0ZXN0cikpIHtcbiAgICAgICAgICAgICAgICBwYXJzZWREYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlZCA9IHZvaWQgMCwgb3BzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG1hdGNoSW5kZXggPSAwLCByZWdleFN0ciA9IFwiXCI7IGkgPCBmb3JtYXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VuID0gZm9ybWF0W2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNCYWNrU2xhc2ggPSB0b2tlbiA9PT0gXCJcXFxcXCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlc2NhcGVkID0gZm9ybWF0W2kgLSAxXSA9PT0gXCJcXFxcXCIgfHwgaXNCYWNrU2xhc2g7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlblJlZ2V4W3Rva2VuXSAmJiAhZXNjYXBlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhTdHIgKz0gdG9rZW5SZWdleFt0b2tlbl07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBuZXcgUmVnRXhwKHJlZ2V4U3RyKS5leGVjKGRhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmIChtYXRjaGVkID0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHNbdG9rZW4gIT09IFwiWVwiID8gXCJwdXNoXCIgOiBcInVuc2hpZnRcIl0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbjogcmV2Rm9ybWF0W3Rva2VuXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsOiBtYXRjaFsrK21hdGNoSW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFpc0JhY2tTbGFzaClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2V4U3RyICs9IFwiLlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJzZWREYXRlID1cbiAgICAgICAgICAgICAgICAgICAgIWNvbmZpZyB8fCAhY29uZmlnLm5vQ2FsZW5kYXJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gbmV3IERhdGUobmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLCAwLCAxLCAwLCAwLCAwLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLnNldEhvdXJzKDAsIDAsIDAsIDApKTtcbiAgICAgICAgICAgICAgICBvcHMuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gX2EuZm4sIHZhbCA9IF9hLnZhbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChwYXJzZWREYXRlID0gZm4ocGFyc2VkRGF0ZSwgdmFsLCBsb2NhbGUpIHx8IHBhcnNlZERhdGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHBhcnNlZERhdGUgPSBtYXRjaGVkID8gcGFyc2VkRGF0ZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIShwYXJzZWREYXRlIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4ocGFyc2VkRGF0ZS5nZXRUaW1lKCkpKSkge1xuICAgICAgICAgICAgY29uZmlnLmVycm9ySGFuZGxlcihuZXcgRXJyb3IoXCJJbnZhbGlkIGRhdGUgcHJvdmlkZWQ6IFwiICsgZGF0ZU9yaWcpKTtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbWVsZXNzID09PSB0cnVlKVxuICAgICAgICAgICAgcGFyc2VkRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlZERhdGU7XG4gICAgfTtcbn07XG5leHBvcnQgZnVuY3Rpb24gY29tcGFyZURhdGVzKGRhdGUxLCBkYXRlMiwgdGltZWxlc3MpIHtcbiAgICBpZiAodGltZWxlc3MgPT09IHZvaWQgMCkgeyB0aW1lbGVzcyA9IHRydWU7IH1cbiAgICBpZiAodGltZWxlc3MgIT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUoZGF0ZTEuZ2V0VGltZSgpKS5zZXRIb3VycygwLCAwLCAwLCAwKSAtXG4gICAgICAgICAgICBuZXcgRGF0ZShkYXRlMi5nZXRUaW1lKCkpLnNldEhvdXJzKDAsIDAsIDAsIDApKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGUxLmdldFRpbWUoKSAtIGRhdGUyLmdldFRpbWUoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wYXJlVGltZXMoZGF0ZTEsIGRhdGUyKSB7XG4gICAgcmV0dXJuICgzNjAwICogKGRhdGUxLmdldEhvdXJzKCkgLSBkYXRlMi5nZXRIb3VycygpKSArXG4gICAgICAgIDYwICogKGRhdGUxLmdldE1pbnV0ZXMoKSAtIGRhdGUyLmdldE1pbnV0ZXMoKSkgK1xuICAgICAgICBkYXRlMS5nZXRTZWNvbmRzKCkgLVxuICAgICAgICBkYXRlMi5nZXRTZWNvbmRzKCkpO1xufVxuZXhwb3J0IHZhciBpc0JldHdlZW4gPSBmdW5jdGlvbiAodHMsIHRzMSwgdHMyKSB7XG4gICAgcmV0dXJuIHRzID4gTWF0aC5taW4odHMxLCB0czIpICYmIHRzIDwgTWF0aC5tYXgodHMxLCB0czIpO1xufTtcbmV4cG9ydCB2YXIgY2FsY3VsYXRlU2Vjb25kc1NpbmNlTWlkbmlnaHQgPSBmdW5jdGlvbiAoaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMpIHtcbiAgICByZXR1cm4gaG91cnMgKiAzNjAwICsgbWludXRlcyAqIDYwICsgc2Vjb25kcztcbn07XG5leHBvcnQgdmFyIHBhcnNlU2Vjb25kcyA9IGZ1bmN0aW9uIChzZWNvbmRzU2luY2VNaWRuaWdodCkge1xuICAgIHZhciBob3VycyA9IE1hdGguZmxvb3Ioc2Vjb25kc1NpbmNlTWlkbmlnaHQgLyAzNjAwKSwgbWludXRlcyA9IChzZWNvbmRzU2luY2VNaWRuaWdodCAtIGhvdXJzICogMzYwMCkgLyA2MDtcbiAgICByZXR1cm4gW2hvdXJzLCBtaW51dGVzLCBzZWNvbmRzU2luY2VNaWRuaWdodCAtIGhvdXJzICogMzYwMCAtIG1pbnV0ZXMgKiA2MF07XG59O1xuZXhwb3J0IHZhciBkdXJhdGlvbiA9IHtcbiAgICBEQVk6IDg2NDAwMDAwLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0SG91cnMoY29uZmlnKSB7XG4gICAgdmFyIGhvdXJzID0gY29uZmlnLmRlZmF1bHRIb3VyO1xuICAgIHZhciBtaW51dGVzID0gY29uZmlnLmRlZmF1bHRNaW51dGU7XG4gICAgdmFyIHNlY29uZHMgPSBjb25maWcuZGVmYXVsdFNlY29uZHM7XG4gICAgaWYgKGNvbmZpZy5taW5EYXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIG1pbkhvdXIgPSBjb25maWcubWluRGF0ZS5nZXRIb3VycygpO1xuICAgICAgICB2YXIgbWluTWludXRlcyA9IGNvbmZpZy5taW5EYXRlLmdldE1pbnV0ZXMoKTtcbiAgICAgICAgdmFyIG1pblNlY29uZHMgPSBjb25maWcubWluRGF0ZS5nZXRTZWNvbmRzKCk7XG4gICAgICAgIGlmIChob3VycyA8IG1pbkhvdXIpIHtcbiAgICAgICAgICAgIGhvdXJzID0gbWluSG91cjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG91cnMgPT09IG1pbkhvdXIgJiYgbWludXRlcyA8IG1pbk1pbnV0ZXMpIHtcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBtaW5NaW51dGVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChob3VycyA9PT0gbWluSG91ciAmJiBtaW51dGVzID09PSBtaW5NaW51dGVzICYmIHNlY29uZHMgPCBtaW5TZWNvbmRzKVxuICAgICAgICAgICAgc2Vjb25kcyA9IGNvbmZpZy5taW5EYXRlLmdldFNlY29uZHMoKTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5tYXhEYXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIG1heEhyID0gY29uZmlnLm1heERhdGUuZ2V0SG91cnMoKTtcbiAgICAgICAgdmFyIG1heE1pbnV0ZXMgPSBjb25maWcubWF4RGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgICAgIGhvdXJzID0gTWF0aC5taW4oaG91cnMsIG1heEhyKTtcbiAgICAgICAgaWYgKGhvdXJzID09PSBtYXhIcilcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBNYXRoLm1pbihtYXhNaW51dGVzLCBtaW51dGVzKTtcbiAgICAgICAgaWYgKGhvdXJzID09PSBtYXhIciAmJiBtaW51dGVzID09PSBtYXhNaW51dGVzKVxuICAgICAgICAgICAgc2Vjb25kcyA9IGNvbmZpZy5tYXhEYXRlLmdldFNlY29uZHMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgaG91cnM6IGhvdXJzLCBtaW51dGVzOiBtaW51dGVzLCBzZWNvbmRzOiBzZWNvbmRzIH07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoZWxlbSwgY2xhc3NOYW1lLCBib29sKSB7XG4gICAgaWYgKGJvb2wgPT09IHRydWUpXG4gICAgICAgIHJldHVybiBlbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZywgY2xhc3NOYW1lLCBjb250ZW50KSB7XG4gICAgdmFyIGUgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZSB8fCBcIlwiO1xuICAgIGNvbnRlbnQgPSBjb250ZW50IHx8IFwiXCI7XG4gICAgZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgaWYgKGNvbnRlbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgZS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG4gICAgcmV0dXJuIGU7XG59XG5leHBvcnQgZnVuY3Rpb24gY2xlYXJOb2RlKG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5maXJzdENoaWxkKVxuICAgICAgICBub2RlLnJlbW92ZUNoaWxkKG5vZGUuZmlyc3RDaGlsZCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudChub2RlLCBjb25kaXRpb24pIHtcbiAgICBpZiAoY29uZGl0aW9uKG5vZGUpKVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUpXG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUucGFyZW50Tm9kZSwgY29uZGl0aW9uKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU51bWJlcklucHV0KGlucHV0Q2xhc3NOYW1lLCBvcHRzKSB7XG4gICAgdmFyIHdyYXBwZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwibnVtSW5wdXRXcmFwcGVyXCIpLCBudW1JbnB1dCA9IGNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCBcIm51bUlucHV0IFwiICsgaW5wdXRDbGFzc05hbWUpLCBhcnJvd1VwID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgXCJhcnJvd1VwXCIpLCBhcnJvd0Rvd24gPSBjcmVhdGVFbGVtZW50KFwic3BhblwiLCBcImFycm93RG93blwiKTtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA5LjBcIikgPT09IC0xKSB7XG4gICAgICAgIG51bUlucHV0LnR5cGUgPSBcIm51bWJlclwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbnVtSW5wdXQudHlwZSA9IFwidGV4dFwiO1xuICAgICAgICBudW1JbnB1dC5wYXR0ZXJuID0gXCJcXFxcZCpcIjtcbiAgICB9XG4gICAgaWYgKG9wdHMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9wdHMpXG4gICAgICAgICAgICBudW1JbnB1dC5zZXRBdHRyaWJ1dGUoa2V5LCBvcHRzW2tleV0pO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobnVtSW5wdXQpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYXJyb3dVcCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChhcnJvd0Rvd24pO1xuICAgIHJldHVybiB3cmFwcGVyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEV2ZW50VGFyZ2V0KGV2ZW50KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBldmVudC5jb21wb3NlZFBhdGggPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdmFyIHBhdGggPSBldmVudC5jb21wb3NlZFBhdGgoKTtcbiAgICAgICAgICAgIHJldHVybiBwYXRoWzBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBldmVudC50YXJnZXQ7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGludCwgcGFkIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG52YXIgZG9Ob3RoaW5nID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuZXhwb3J0IHZhciBtb250aFRvU3RyID0gZnVuY3Rpb24gKG1vbnRoTnVtYmVyLCBzaG9ydGhhbmQsIGxvY2FsZSkgeyByZXR1cm4gbG9jYWxlLm1vbnRoc1tzaG9ydGhhbmQgPyBcInNob3J0aGFuZFwiIDogXCJsb25naGFuZFwiXVttb250aE51bWJlcl07IH07XG5leHBvcnQgdmFyIHJldkZvcm1hdCA9IHtcbiAgICBEOiBkb05vdGhpbmcsXG4gICAgRjogZnVuY3Rpb24gKGRhdGVPYmosIG1vbnRoTmFtZSwgbG9jYWxlKSB7XG4gICAgICAgIGRhdGVPYmouc2V0TW9udGgobG9jYWxlLm1vbnRocy5sb25naGFuZC5pbmRleE9mKG1vbnRoTmFtZSkpO1xuICAgIH0sXG4gICAgRzogZnVuY3Rpb24gKGRhdGVPYmosIGhvdXIpIHtcbiAgICAgICAgZGF0ZU9iai5zZXRIb3VycygoZGF0ZU9iai5nZXRIb3VycygpID49IDEyID8gMTIgOiAwKSArIHBhcnNlRmxvYXQoaG91cikpO1xuICAgIH0sXG4gICAgSDogZnVuY3Rpb24gKGRhdGVPYmosIGhvdXIpIHtcbiAgICAgICAgZGF0ZU9iai5zZXRIb3VycyhwYXJzZUZsb2F0KGhvdXIpKTtcbiAgICB9LFxuICAgIEo6IGZ1bmN0aW9uIChkYXRlT2JqLCBkYXkpIHtcbiAgICAgICAgZGF0ZU9iai5zZXREYXRlKHBhcnNlRmxvYXQoZGF5KSk7XG4gICAgfSxcbiAgICBLOiBmdW5jdGlvbiAoZGF0ZU9iaiwgYW1QTSwgbG9jYWxlKSB7XG4gICAgICAgIGRhdGVPYmouc2V0SG91cnMoKGRhdGVPYmouZ2V0SG91cnMoKSAlIDEyKSArXG4gICAgICAgICAgICAxMiAqIGludChuZXcgUmVnRXhwKGxvY2FsZS5hbVBNWzFdLCBcImlcIikudGVzdChhbVBNKSkpO1xuICAgIH0sXG4gICAgTTogZnVuY3Rpb24gKGRhdGVPYmosIHNob3J0TW9udGgsIGxvY2FsZSkge1xuICAgICAgICBkYXRlT2JqLnNldE1vbnRoKGxvY2FsZS5tb250aHMuc2hvcnRoYW5kLmluZGV4T2Yoc2hvcnRNb250aCkpO1xuICAgIH0sXG4gICAgUzogZnVuY3Rpb24gKGRhdGVPYmosIHNlY29uZHMpIHtcbiAgICAgICAgZGF0ZU9iai5zZXRTZWNvbmRzKHBhcnNlRmxvYXQoc2Vjb25kcykpO1xuICAgIH0sXG4gICAgVTogZnVuY3Rpb24gKF8sIHVuaXhTZWNvbmRzKSB7IHJldHVybiBuZXcgRGF0ZShwYXJzZUZsb2F0KHVuaXhTZWNvbmRzKSAqIDEwMDApOyB9LFxuICAgIFc6IGZ1bmN0aW9uIChkYXRlT2JqLCB3ZWVrTnVtLCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIHdlZWtOdW1iZXIgPSBwYXJzZUludCh3ZWVrTnVtKTtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlT2JqLmdldEZ1bGxZZWFyKCksIDAsIDIgKyAod2Vla051bWJlciAtIDEpICogNywgMCwgMCwgMCwgMCk7XG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIGRhdGUuZ2V0RGF5KCkgKyBsb2NhbGUuZmlyc3REYXlPZldlZWspO1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9LFxuICAgIFk6IGZ1bmN0aW9uIChkYXRlT2JqLCB5ZWFyKSB7XG4gICAgICAgIGRhdGVPYmouc2V0RnVsbFllYXIocGFyc2VGbG9hdCh5ZWFyKSk7XG4gICAgfSxcbiAgICBaOiBmdW5jdGlvbiAoXywgSVNPRGF0ZSkgeyByZXR1cm4gbmV3IERhdGUoSVNPRGF0ZSk7IH0sXG4gICAgZDogZnVuY3Rpb24gKGRhdGVPYmosIGRheSkge1xuICAgICAgICBkYXRlT2JqLnNldERhdGUocGFyc2VGbG9hdChkYXkpKTtcbiAgICB9LFxuICAgIGg6IGZ1bmN0aW9uIChkYXRlT2JqLCBob3VyKSB7XG4gICAgICAgIGRhdGVPYmouc2V0SG91cnMoKGRhdGVPYmouZ2V0SG91cnMoKSA+PSAxMiA/IDEyIDogMCkgKyBwYXJzZUZsb2F0KGhvdXIpKTtcbiAgICB9LFxuICAgIGk6IGZ1bmN0aW9uIChkYXRlT2JqLCBtaW51dGVzKSB7XG4gICAgICAgIGRhdGVPYmouc2V0TWludXRlcyhwYXJzZUZsb2F0KG1pbnV0ZXMpKTtcbiAgICB9LFxuICAgIGo6IGZ1bmN0aW9uIChkYXRlT2JqLCBkYXkpIHtcbiAgICAgICAgZGF0ZU9iai5zZXREYXRlKHBhcnNlRmxvYXQoZGF5KSk7XG4gICAgfSxcbiAgICBsOiBkb05vdGhpbmcsXG4gICAgbTogZnVuY3Rpb24gKGRhdGVPYmosIG1vbnRoKSB7XG4gICAgICAgIGRhdGVPYmouc2V0TW9udGgocGFyc2VGbG9hdChtb250aCkgLSAxKTtcbiAgICB9LFxuICAgIG46IGZ1bmN0aW9uIChkYXRlT2JqLCBtb250aCkge1xuICAgICAgICBkYXRlT2JqLnNldE1vbnRoKHBhcnNlRmxvYXQobW9udGgpIC0gMSk7XG4gICAgfSxcbiAgICBzOiBmdW5jdGlvbiAoZGF0ZU9iaiwgc2Vjb25kcykge1xuICAgICAgICBkYXRlT2JqLnNldFNlY29uZHMocGFyc2VGbG9hdChzZWNvbmRzKSk7XG4gICAgfSxcbiAgICB1OiBmdW5jdGlvbiAoXywgdW5peE1pbGxTZWNvbmRzKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShwYXJzZUZsb2F0KHVuaXhNaWxsU2Vjb25kcykpO1xuICAgIH0sXG4gICAgdzogZG9Ob3RoaW5nLFxuICAgIHk6IGZ1bmN0aW9uIChkYXRlT2JqLCB5ZWFyKSB7XG4gICAgICAgIGRhdGVPYmouc2V0RnVsbFllYXIoMjAwMCArIHBhcnNlRmxvYXQoeWVhcikpO1xuICAgIH0sXG59O1xuZXhwb3J0IHZhciB0b2tlblJlZ2V4ID0ge1xuICAgIEQ6IFwiXCIsXG4gICAgRjogXCJcIixcbiAgICBHOiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuICAgIEg6IFwiKFxcXFxkXFxcXGR8XFxcXGQpXCIsXG4gICAgSjogXCIoXFxcXGRcXFxcZHxcXFxcZClcXFxcdytcIixcbiAgICBLOiBcIlwiLFxuICAgIE06IFwiXCIsXG4gICAgUzogXCIoXFxcXGRcXFxcZHxcXFxcZClcIixcbiAgICBVOiBcIiguKylcIixcbiAgICBXOiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuICAgIFk6IFwiKFxcXFxkezR9KVwiLFxuICAgIFo6IFwiKC4rKVwiLFxuICAgIGQ6IFwiKFxcXFxkXFxcXGR8XFxcXGQpXCIsXG4gICAgaDogXCIoXFxcXGRcXFxcZHxcXFxcZClcIixcbiAgICBpOiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuICAgIGo6IFwiKFxcXFxkXFxcXGR8XFxcXGQpXCIsXG4gICAgbDogXCJcIixcbiAgICBtOiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuICAgIG46IFwiKFxcXFxkXFxcXGR8XFxcXGQpXCIsXG4gICAgczogXCIoXFxcXGRcXFxcZHxcXFxcZClcIixcbiAgICB1OiBcIiguKylcIixcbiAgICB3OiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuICAgIHk6IFwiKFxcXFxkezJ9KVwiLFxufTtcbmV4cG9ydCB2YXIgZm9ybWF0cyA9IHtcbiAgICBaOiBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpOyB9LFxuICAgIEQ6IGZ1bmN0aW9uIChkYXRlLCBsb2NhbGUsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5cy5zaG9ydGhhbmRbZm9ybWF0cy53KGRhdGUsIGxvY2FsZSwgb3B0aW9ucyldO1xuICAgIH0sXG4gICAgRjogZnVuY3Rpb24gKGRhdGUsIGxvY2FsZSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gbW9udGhUb1N0cihmb3JtYXRzLm4oZGF0ZSwgbG9jYWxlLCBvcHRpb25zKSAtIDEsIGZhbHNlLCBsb2NhbGUpO1xuICAgIH0sXG4gICAgRzogZnVuY3Rpb24gKGRhdGUsIGxvY2FsZSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gcGFkKGZvcm1hdHMuaChkYXRlLCBsb2NhbGUsIG9wdGlvbnMpKTtcbiAgICB9LFxuICAgIEg6IGZ1bmN0aW9uIChkYXRlKSB7IHJldHVybiBwYWQoZGF0ZS5nZXRIb3VycygpKTsgfSxcbiAgICBKOiBmdW5jdGlvbiAoZGF0ZSwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUub3JkaW5hbCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGRhdGUuZ2V0RGF0ZSgpICsgbG9jYWxlLm9yZGluYWwoZGF0ZS5nZXREYXRlKCkpXG4gICAgICAgICAgICA6IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIH0sXG4gICAgSzogZnVuY3Rpb24gKGRhdGUsIGxvY2FsZSkgeyByZXR1cm4gbG9jYWxlLmFtUE1baW50KGRhdGUuZ2V0SG91cnMoKSA+IDExKV07IH0sXG4gICAgTTogZnVuY3Rpb24gKGRhdGUsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbW9udGhUb1N0cihkYXRlLmdldE1vbnRoKCksIHRydWUsIGxvY2FsZSk7XG4gICAgfSxcbiAgICBTOiBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gcGFkKGRhdGUuZ2V0U2Vjb25kcygpKTsgfSxcbiAgICBVOiBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gZGF0ZS5nZXRUaW1lKCkgLyAxMDAwOyB9LFxuICAgIFc6IGZ1bmN0aW9uIChkYXRlLCBfLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmdldFdlZWsoZGF0ZSk7XG4gICAgfSxcbiAgICBZOiBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gcGFkKGRhdGUuZ2V0RnVsbFllYXIoKSwgNCk7IH0sXG4gICAgZDogZnVuY3Rpb24gKGRhdGUpIHsgcmV0dXJuIHBhZChkYXRlLmdldERhdGUoKSk7IH0sXG4gICAgaDogZnVuY3Rpb24gKGRhdGUpIHsgcmV0dXJuIChkYXRlLmdldEhvdXJzKCkgJSAxMiA/IGRhdGUuZ2V0SG91cnMoKSAlIDEyIDogMTIpOyB9LFxuICAgIGk6IGZ1bmN0aW9uIChkYXRlKSB7IHJldHVybiBwYWQoZGF0ZS5nZXRNaW51dGVzKCkpOyB9LFxuICAgIGo6IGZ1bmN0aW9uIChkYXRlKSB7IHJldHVybiBkYXRlLmdldERhdGUoKTsgfSxcbiAgICBsOiBmdW5jdGlvbiAoZGF0ZSwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXMubG9uZ2hhbmRbZGF0ZS5nZXREYXkoKV07XG4gICAgfSxcbiAgICBtOiBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gcGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpOyB9LFxuICAgIG46IGZ1bmN0aW9uIChkYXRlKSB7IHJldHVybiBkYXRlLmdldE1vbnRoKCkgKyAxOyB9LFxuICAgIHM6IGZ1bmN0aW9uIChkYXRlKSB7IHJldHVybiBkYXRlLmdldFNlY29uZHMoKTsgfSxcbiAgICB1OiBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gZGF0ZS5nZXRUaW1lKCk7IH0sXG4gICAgdzogZnVuY3Rpb24gKGRhdGUpIHsgcmV0dXJuIGRhdGUuZ2V0RGF5KCk7IH0sXG4gICAgeTogZnVuY3Rpb24gKGRhdGUpIHsgcmV0dXJuIFN0cmluZyhkYXRlLmdldEZ1bGxZZWFyKCkpLnN1YnN0cmluZygyKTsgfSxcbn07XG4iLCJleHBvcnQgdmFyIHBhZCA9IGZ1bmN0aW9uIChudW1iZXIsIGxlbmd0aCkge1xuICAgIGlmIChsZW5ndGggPT09IHZvaWQgMCkgeyBsZW5ndGggPSAyOyB9XG4gICAgcmV0dXJuIChcIjAwMFwiICsgbnVtYmVyKS5zbGljZShsZW5ndGggKiAtMSk7XG59O1xuZXhwb3J0IHZhciBpbnQgPSBmdW5jdGlvbiAoYm9vbCkgeyByZXR1cm4gKGJvb2wgPT09IHRydWUgPyAxIDogMCk7IH07XG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZm4sIHdhaXQpIHtcbiAgICB2YXIgdDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICB0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBmbi5hcHBseShfdGhpcywgYXJncyk7IH0sIHdhaXQpO1xuICAgIH07XG59XG5leHBvcnQgdmFyIGFycmF5aWZ5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBBcnJheSA/IG9iaiA6IFtvYmpdO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuaWYgKHR5cGVvZiBPYmplY3QuYXNzaWduICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgICAgdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiAodGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XSk7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBfYSA9IDAsIGFyZ3NfMSA9IGFyZ3M7IF9hIDwgYXJnc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3NfMVtfYV07XG4gICAgICAgICAgICBfbG9vcF8xKHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xufVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC5ydSA9IHt9KSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGZwID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cuZmxhdHBpY2tyICE9PSB1bmRlZmluZWRcbiAgICAgID8gd2luZG93LmZsYXRwaWNrclxuICAgICAgOiB7XG4gICAgICAgICAgbDEwbnM6IHt9LFxuICAgICAgfTtcbiAgdmFyIFJ1c3NpYW4gPSB7XG4gICAgICB3ZWVrZGF5czoge1xuICAgICAgICAgIHNob3J0aGFuZDogW1wi0JLRgVwiLCBcItCf0L1cIiwgXCLQktGCXCIsIFwi0KHRgFwiLCBcItCn0YJcIiwgXCLQn9GCXCIsIFwi0KHQsVwiXSxcbiAgICAgICAgICBsb25naGFuZDogW1xuICAgICAgICAgICAgICBcItCS0L7RgdC60YDQtdGB0LXQvdGM0LVcIixcbiAgICAgICAgICAgICAgXCLQn9C+0L3QtdC00LXQu9GM0L3QuNC6XCIsXG4gICAgICAgICAgICAgIFwi0JLRgtC+0YDQvdC40LpcIixcbiAgICAgICAgICAgICAgXCLQodGA0LXQtNCwXCIsXG4gICAgICAgICAgICAgIFwi0KfQtdGC0LLQtdGA0LNcIixcbiAgICAgICAgICAgICAgXCLQn9GP0YLQvdC40YbQsFwiLFxuICAgICAgICAgICAgICBcItCh0YPQsdCx0L7RgtCwXCIsXG4gICAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBtb250aHM6IHtcbiAgICAgICAgICBzaG9ydGhhbmQ6IFtcbiAgICAgICAgICAgICAgXCLQr9C90LJcIixcbiAgICAgICAgICAgICAgXCLQpNC10LJcIixcbiAgICAgICAgICAgICAgXCLQnNCw0YDRglwiLFxuICAgICAgICAgICAgICBcItCQ0L/RgFwiLFxuICAgICAgICAgICAgICBcItCc0LDQuVwiLFxuICAgICAgICAgICAgICBcItCY0Y7QvdGMXCIsXG4gICAgICAgICAgICAgIFwi0JjRjtC70YxcIixcbiAgICAgICAgICAgICAgXCLQkNCy0LNcIixcbiAgICAgICAgICAgICAgXCLQodC10L1cIixcbiAgICAgICAgICAgICAgXCLQntC60YJcIixcbiAgICAgICAgICAgICAgXCLQndC+0Y9cIixcbiAgICAgICAgICAgICAgXCLQlNC10LpcIixcbiAgICAgICAgICBdLFxuICAgICAgICAgIGxvbmdoYW5kOiBbXG4gICAgICAgICAgICAgIFwi0K/QvdCy0LDRgNGMXCIsXG4gICAgICAgICAgICAgIFwi0KTQtdCy0YDQsNC70YxcIixcbiAgICAgICAgICAgICAgXCLQnNCw0YDRglwiLFxuICAgICAgICAgICAgICBcItCQ0L/RgNC10LvRjFwiLFxuICAgICAgICAgICAgICBcItCc0LDQuVwiLFxuICAgICAgICAgICAgICBcItCY0Y7QvdGMXCIsXG4gICAgICAgICAgICAgIFwi0JjRjtC70YxcIixcbiAgICAgICAgICAgICAgXCLQkNCy0LPRg9GB0YJcIixcbiAgICAgICAgICAgICAgXCLQodC10L3RgtGP0LHRgNGMXCIsXG4gICAgICAgICAgICAgIFwi0J7QutGC0Y/QsdGA0YxcIixcbiAgICAgICAgICAgICAgXCLQndC+0Y/QsdGA0YxcIixcbiAgICAgICAgICAgICAgXCLQlNC10LrQsNCx0YDRjFwiLFxuICAgICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgZmlyc3REYXlPZldlZWs6IDEsXG4gICAgICBvcmRpbmFsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9LFxuICAgICAgcmFuZ2VTZXBhcmF0b3I6IFwiIOKAlCBcIixcbiAgICAgIHdlZWtBYmJyZXZpYXRpb246IFwi0J3QtdC0LlwiLFxuICAgICAgc2Nyb2xsVGl0bGU6IFwi0J/RgNC+0LrRgNGD0YLQuNGC0LUg0LTQu9GPINGD0LLQtdC70LjRh9C10L3QuNGPXCIsXG4gICAgICB0b2dnbGVUaXRsZTogXCLQndCw0LbQvNC40YLQtSDQtNC70Y8g0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPXCIsXG4gICAgICBhbVBNOiBbXCLQlNCfXCIsIFwi0J/Qn1wiXSxcbiAgICAgIHllYXJBcmlhTGFiZWw6IFwi0JPQvtC0XCIsXG4gICAgICB0aW1lXzI0aHI6IHRydWUsXG4gIH07XG4gIGZwLmwxMG5zLnJ1ID0gUnVzc2lhbjtcbiAgdmFyIHJ1ID0gZnAubDEwbnM7XG5cbiAgZXhwb3J0cy5SdXNzaWFuID0gUnVzc2lhbjtcbiAgZXhwb3J0cy5kZWZhdWx0ID0gcnU7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZmFjdG9yeShnbG9iYWwudWsgPSB7fSkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBmcCA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmZsYXRwaWNrciAhPT0gdW5kZWZpbmVkXG4gICAgICA/IHdpbmRvdy5mbGF0cGlja3JcbiAgICAgIDoge1xuICAgICAgICAgIGwxMG5zOiB7fSxcbiAgICAgIH07XG4gIHZhciBVa3JhaW5pYW4gPSB7XG4gICAgICBmaXJzdERheU9mV2VlazogMSxcbiAgICAgIHdlZWtkYXlzOiB7XG4gICAgICAgICAgc2hvcnRoYW5kOiBbXCLQndC0XCIsIFwi0J/QvVwiLCBcItCS0YJcIiwgXCLQodGAXCIsIFwi0KfRglwiLCBcItCf0YJcIiwgXCLQodCxXCJdLFxuICAgICAgICAgIGxvbmdoYW5kOiBbXG4gICAgICAgICAgICAgIFwi0J3QtdC00ZbQu9GPXCIsXG4gICAgICAgICAgICAgIFwi0J/QvtC90LXQtNGW0LvQvtC6XCIsXG4gICAgICAgICAgICAgIFwi0JLRltCy0YLQvtGA0L7QulwiLFxuICAgICAgICAgICAgICBcItCh0LXRgNC10LTQsFwiLFxuICAgICAgICAgICAgICBcItCn0LXRgtCy0LXRgFwiLFxuICAgICAgICAgICAgICBcItCfJ9GP0YLQvdC40YbRj1wiLFxuICAgICAgICAgICAgICBcItCh0YPQsdC+0YLQsFwiLFxuICAgICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgbW9udGhzOiB7XG4gICAgICAgICAgc2hvcnRoYW5kOiBbXG4gICAgICAgICAgICAgIFwi0KHRltGHXCIsXG4gICAgICAgICAgICAgIFwi0JvRjtGCXCIsXG4gICAgICAgICAgICAgIFwi0JHQtdGAXCIsXG4gICAgICAgICAgICAgIFwi0JrQstGWXCIsXG4gICAgICAgICAgICAgIFwi0KLRgNCwXCIsXG4gICAgICAgICAgICAgIFwi0KfQtdGAXCIsXG4gICAgICAgICAgICAgIFwi0JvQuNC/XCIsXG4gICAgICAgICAgICAgIFwi0KHQtdGAXCIsXG4gICAgICAgICAgICAgIFwi0JLQtdGAXCIsXG4gICAgICAgICAgICAgIFwi0JbQvtCyXCIsXG4gICAgICAgICAgICAgIFwi0JvQuNGBXCIsXG4gICAgICAgICAgICAgIFwi0JPRgNGDXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBsb25naGFuZDogW1xuICAgICAgICAgICAgICBcItCh0ZbRh9C10L3RjFwiLFxuICAgICAgICAgICAgICBcItCb0Y7RgtC40LlcIixcbiAgICAgICAgICAgICAgXCLQkdC10YDQtdC30LXQvdGMXCIsXG4gICAgICAgICAgICAgIFwi0JrQstGW0YLQtdC90YxcIixcbiAgICAgICAgICAgICAgXCLQotGA0LDQstC10L3RjFwiLFxuICAgICAgICAgICAgICBcItCn0LXRgNCy0LXQvdGMXCIsXG4gICAgICAgICAgICAgIFwi0JvQuNC/0LXQvdGMXCIsXG4gICAgICAgICAgICAgIFwi0KHQtdGA0L/QtdC90YxcIixcbiAgICAgICAgICAgICAgXCLQktC10YDQtdGB0LXQvdGMXCIsXG4gICAgICAgICAgICAgIFwi0JbQvtCy0YLQtdC90YxcIixcbiAgICAgICAgICAgICAgXCLQm9C40YHRgtC+0L/QsNC0XCIsXG4gICAgICAgICAgICAgIFwi0JPRgNGD0LTQtdC90YxcIixcbiAgICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHRpbWVfMjRocjogdHJ1ZSxcbiAgfTtcbiAgZnAubDEwbnMudWsgPSBVa3JhaW5pYW47XG4gIHZhciB1ayA9IGZwLmwxMG5zO1xuXG4gIGV4cG9ydHMuVWtyYWluaWFuID0gVWtyYWluaWFuO1xuICBleHBvcnRzLmRlZmF1bHQgPSB1aztcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qXG4gKiBAcGFja2FnZSAgICBOZXZpZ2VuIEF1ZGl0IFBhY2thZ2VcbiAqIEB2ZXJzaW9uICAgIDEuMC43XG4gKiBAYXV0aG9yICAgICBOZXZpZ2VuLmNvbSAtIGh0dHBzOi8vbmV2aWdlbi5jb21cbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCDCqSBOZXZpZ2VuLmNvbS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEBsaWNlbnNlICAgIFByb3ByaWV0YXJ5LiBDb3B5cmlnaHRlZCBDb21tZXJjaWFsIFNvZnR3YXJlXG4gKiBAbGluayAgICAgICBodHRwczovL25ldmlnZW4uY29tXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBmbGF0cGlja3IgZnJvbSAnZmxhdHBpY2tyJ1xuaW1wb3J0IHtSdXNzaWFufSBmcm9tICdmbGF0cGlja3IvZGlzdC9sMTBuL3J1LmpzJ1xuaW1wb3J0IHtVa3JhaW5pYW59IGZyb20gJ2ZsYXRwaWNrci9kaXN0L2wxMG4vdWsuanMnXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuZXZpZ2VuLWF1ZGl0LWZpZWxkLWRhdGUtcGVyaW9kPVwiY29udGFpbmVyXCJdLCcgK1xuXHRcdCdbZGF0YS1uZXZpZ2VuLWF1ZGl0LWZpZWxkLWRhdGUtcGVyaW9kPVwiY29udGFpbmVyXCJdJykuZm9yRWFjaCgoY29udGFpbmVyKSA9PiB7XG5cdFx0bGV0IHNlbGVjdG9yID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RvcicpLFxuXHRcdFx0anNPcHRpb25zID0gSm9vbWxhLmdldE9wdGlvbnMoc2VsZWN0b3IpLFxuXHRcdFx0d3JhcHBlciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbbmV2aWdlbi1hdWRpdC1maWVsZC1kYXRlLXBlcmlvZD1cIndyYXBwZXJcIl0sJyArXG5cdFx0XHRcdCdbZGF0YS1uZXZpZ2VuLWF1ZGl0LWZpZWxkLWRhdGUtcGVyaW9kPVwid3JhcHBlclwiXScpLFxuXHRcdFx0ZmllbGRGcm9tID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tuZXZpZ2VuLWF1ZGl0LWZpZWxkLWRhdGUtcGVyaW9kPVwiaW5wdXQtZnJvbVwiXSwnICtcblx0XHRcdFx0J1tkYXRhLW5ldmlnZW4tYXVkaXQtZmllbGQtZGF0ZS1wZXJpb2Q9XCJpbnB1dC1mcm9tXCJdJyksXG5cdFx0XHRmaWVsZFRvID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tuZXZpZ2VuLWF1ZGl0LWZpZWxkLWRhdGUtcGVyaW9kPVwiaW5wdXQtdG9cIl0sJyArXG5cdFx0XHRcdCdbZGF0YS1uZXZpZ2VuLWF1ZGl0LWZpZWxkLWRhdGUtcGVyaW9kPVwiaW5wdXQtdG9cIl0nKTtcblxuXHRcdGxldCBsb2NhbGUgPSBudWxsO1xuXHRcdGlmIChqc09wdGlvbnMubG9jYWxlICYmIGpzT3B0aW9ucy5sb2NhbGUgPT09ICdydScpIHtcblx0XHRcdGxvY2FsZSA9IFJ1c3NpYW47XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGpzT3B0aW9ucy5sb2NhbGUgJiYganNPcHRpb25zLmxvY2FsZSA9PT0gJ3VhJykge1xuXHRcdFx0bG9jYWxlID0gVWtyYWluaWFuO1xuXHRcdH1cblxuXHRcdGZsYXRwaWNrcih3cmFwcGVyLCB7XG5cdFx0XHRkYXRlRm9ybWF0OiAoanNPcHRpb25zLmRhdGVGb3JtYXQpID8ganNPcHRpb25zLmRhdGVGb3JtYXQgOiAnWS1tLWQnLFxuXHRcdFx0bW9kZTogJ3JhbmdlJyxcblx0XHRcdHdyYXA6IHRydWUsXG5cdFx0XHRsb2NhbGU6IGxvY2FsZSxcblx0XHRcdGRlZmF1bHREYXRlOiAoanNPcHRpb25zLmRlZmF1bHREYXRlKSA/IGpzT3B0aW9ucy5kZWZhdWx0RGF0ZSA6IFtdLFxuXHRcdFx0b25DbG9zZTogKGRhdGVzKSA9PiB7XG5cdFx0XHRcdGxldCBvbGRWYWx1ZSA9IHtmcm9tOiBmaWVsZEZyb20udmFsdWUsIHRvOiBmaWVsZFRvLnZhbHVlfSxcblx0XHRcdFx0XHRuZXdWYWx1ZSA9IHtmcm9tOiAnJywgdG86ICcnfTtcblx0XHRcdFx0ZGF0ZXMuZm9yRWFjaCgoZGF0ZSwgaSkgPT4ge1xuXHRcdFx0XHRcdGxldCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpLFxuXHRcdFx0XHRcdFx0bW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxLFxuXHRcdFx0XHRcdFx0ZGF5ID0gZGF0ZS5nZXREYXRlKCksXG5cdFx0XHRcdFx0XHRtb250aEZvcm1hdHRlZCA9IG1vbnRoIDwgMTAgPyAnMCcgKyBtb250aCA6IG1vbnRoLFxuXHRcdFx0XHRcdFx0ZGF5Rm9ybWF0dGVkID0gZGF5IDwgMTAgPyAnMCcgKyBkYXkgOiBkYXksXG5cdFx0XHRcdFx0XHRkYXRlU3RyaW5nID0geWVhciArICctJyArIG1vbnRoRm9ybWF0dGVkICsgJy0nICsgZGF5Rm9ybWF0dGVkO1xuXHRcdFx0XHRcdGlmIChpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRuZXdWYWx1ZS5mcm9tID0gZGF0ZVN0cmluZztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGkgPT09IDEpIHtcblx0XHRcdFx0XHRcdG5ld1ZhbHVlLnRvID0gZGF0ZVN0cmluZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGxldCBjaGFuZ2UgPSBmYWxzZTtcblx0XHRcdFx0aWYgKG9sZFZhbHVlLmZyb20gIT09IG5ld1ZhbHVlLmZyb20pIHtcblx0XHRcdFx0XHRmaWVsZEZyb20udmFsdWUgPSBuZXdWYWx1ZS5mcm9tO1xuXHRcdFx0XHRcdGNoYW5nZSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob2xkVmFsdWUudG8gIT09IG5ld1ZhbHVlLnRvKSB7XG5cdFx0XHRcdFx0ZmllbGRUby52YWx1ZSA9IG5ld1ZhbHVlLnRvO1xuXHRcdFx0XHRcdGNoYW5nZSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY2hhbmdlKSB7XG5cdFx0XHRcdFx0ZmllbGRGcm9tLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7J2J1YmJsZXMnOiB0cnVlfSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0b25DaGFuZ2U6IChkYXRlcywgc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGlmIChkYXRlcy5sZW5ndGggPT09IDAgJiYgc3RyaW5nID09PSAnJykge1xuXHRcdFx0XHRcdGZpZWxkRnJvbS52YWx1ZSA9ICcnO1xuXHRcdFx0XHRcdGZpZWxkVG8udmFsdWUgPSAnJztcblx0XHRcdFx0XHRmaWVsZEZyb20uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsnYnViYmxlcyc6IHRydWV9KSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG59KTsiXSwibmFtZXMiOlsiX19hc3NpZ24iLCJPYmplY3QiLCJhc3NpZ24iLCJ0IiwicyIsImkiLCJuIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwicCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImFwcGx5IiwiX19zcHJlYWRBcnJheXMiLCJpbCIsInIiLCJBcnJheSIsImsiLCJhIiwiaiIsImpsIiwiZGVmYXVsdHMiLCJkZWZhdWx0T3B0aW9ucyIsIkhPT0tTIiwiRW5nbGlzaCIsImFycmF5aWZ5IiwiZGVib3VuY2UiLCJpbnQiLCJwYWQiLCJjbGVhck5vZGUiLCJjcmVhdGVFbGVtZW50IiwiY3JlYXRlTnVtYmVySW5wdXQiLCJmaW5kUGFyZW50IiwidG9nZ2xlQ2xhc3MiLCJnZXRFdmVudFRhcmdldCIsImNvbXBhcmVEYXRlcyIsImNyZWF0ZURhdGVQYXJzZXIiLCJjcmVhdGVEYXRlRm9ybWF0dGVyIiwiZHVyYXRpb24iLCJpc0JldHdlZW4iLCJnZXREZWZhdWx0SG91cnMiLCJjYWxjdWxhdGVTZWNvbmRzU2luY2VNaWRuaWdodCIsInBhcnNlU2Vjb25kcyIsInRva2VuUmVnZXgiLCJtb250aFRvU3RyIiwiREVCT1VOQ0VEX0NIQU5HRV9NUyIsIkZsYXRwaWNrckluc3RhbmNlIiwiZWxlbWVudCIsImluc3RhbmNlQ29uZmlnIiwic2VsZiIsImNvbmZpZyIsImZsYXRwaWNrciIsImRlZmF1bHRDb25maWciLCJsMTBuIiwicGFyc2VEYXRlIiwiX2hhbmRsZXJzIiwicGx1Z2luRWxlbWVudHMiLCJsb2FkZWRQbHVnaW5zIiwiX2JpbmQiLCJiaW5kIiwiX3NldEhvdXJzRnJvbURhdGUiLCJzZXRIb3Vyc0Zyb21EYXRlIiwiX3Bvc2l0aW9uQ2FsZW5kYXIiLCJwb3NpdGlvbkNhbGVuZGFyIiwiY2hhbmdlTW9udGgiLCJjaGFuZ2VZZWFyIiwiY2xlYXIiLCJjbG9zZSIsIm9uTW91c2VPdmVyIiwiX2NyZWF0ZUVsZW1lbnQiLCJjcmVhdGVEYXkiLCJkZXN0cm95IiwiaXNFbmFibGVkIiwianVtcFRvRGF0ZSIsInVwZGF0ZVZhbHVlIiwib3BlbiIsInJlZHJhdyIsInNldCIsInNldERhdGUiLCJ0b2dnbGUiLCJzZXR1cEhlbHBlckZ1bmN0aW9ucyIsInV0aWxzIiwiZ2V0RGF5c0luTW9udGgiLCJtb250aCIsInlyIiwiY3VycmVudE1vbnRoIiwiY3VycmVudFllYXIiLCJkYXlzSW5Nb250aCIsImluaXQiLCJpbnB1dCIsImlzT3BlbiIsInBhcnNlQ29uZmlnIiwic2V0dXBMb2NhbGUiLCJzZXR1cElucHV0cyIsInNldHVwRGF0ZXMiLCJpc01vYmlsZSIsImJ1aWxkIiwiYmluZEV2ZW50cyIsInNlbGVjdGVkRGF0ZXMiLCJub0NhbGVuZGFyIiwiZW5hYmxlVGltZSIsImxhdGVzdFNlbGVjdGVkRGF0ZU9iaiIsInVuZGVmaW5lZCIsInNldENhbGVuZGFyV2lkdGgiLCJpc1NhZmFyaSIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0cmlnZ2VyRXZlbnQiLCJnZXRDbG9zZXN0QWN0aXZlRWxlbWVudCIsIl9hIiwiY2FsZW5kYXJDb250YWluZXIiLCJnZXRSb290Tm9kZSIsImFjdGl2ZUVsZW1lbnQiLCJkb2N1bWVudCIsImJpbmRUb0luc3RhbmNlIiwiZm4iLCJ3ZWVrTnVtYmVycyIsInNob3dNb250aHMiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJzdHlsZSIsInZpc2liaWxpdHkiLCJkaXNwbGF5IiwiZGF5c0NvbnRhaW5lciIsImRheXNXaWR0aCIsImRheXMiLCJvZmZzZXRXaWR0aCIsIndpZHRoIiwid2Vla1dyYXBwZXIiLCJyZW1vdmVQcm9wZXJ0eSIsInVwZGF0ZVRpbWUiLCJlIiwiZGVmYXVsdERhdGUiLCJtaW5EYXRlIiwiRGF0ZSIsImdldFRpbWUiLCJzZXRIb3VycyIsImhvdXJzIiwibWludXRlcyIsInNlY29uZHMiLCJnZXRNaWxsaXNlY29uZHMiLCJ0eXBlIiwidGltZVdyYXBwZXIiLCJwcmV2VmFsdWUiLCJfaW5wdXQiLCJ2YWx1ZSIsInNldEhvdXJzRnJvbUlucHV0cyIsIl9kZWJvdW5jZWRDaGFuZ2UiLCJhbXBtMm1pbGl0YXJ5IiwiaG91ciIsImFtUE0iLCJtaWxpdGFyeTJhbXBtIiwiaG91ckVsZW1lbnQiLCJtaW51dGVFbGVtZW50IiwicGFyc2VJbnQiLCJzbGljZSIsInNlY29uZEVsZW1lbnQiLCJ0ZXh0Q29udGVudCIsImxpbWl0TWluSG91cnMiLCJtaW5UaW1lIiwibWluRGF0ZUhhc1RpbWUiLCJsaW1pdE1heEhvdXJzIiwibWF4VGltZSIsIm1heERhdGUiLCJtYXhEYXRlSGFzVGltZSIsIm1pbkJvdW5kIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsIm1heEJvdW5kIiwiY3VycmVudFRpbWUiLCJyZXN1bHQiLCJNYXRoIiwibWluIiwibWF4IiwiZGF0ZU9iaiIsImRhdGUiLCJ0aW1lXzI0aHIiLCJvblllYXJJbnB1dCIsImV2ZW50IiwiZXZlbnRUYXJnZXQiLCJ5ZWFyIiwiZGVsdGEiLCJrZXkiLCJ0b1N0cmluZyIsImhhbmRsZXIiLCJvcHRpb25zIiwiZm9yRWFjaCIsImV2IiwiZWwiLCJhZGRFdmVudExpc3RlbmVyIiwicHVzaCIsInJlbW92ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ0cmlnZ2VyQ2hhbmdlIiwid3JhcCIsImV2dCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJzZXR1cE1vYmlsZSIsImRlYm91bmNlZFJlc2l6ZSIsIm9uUmVzaXplIiwibW9kZSIsIm9uS2V5RG93biIsImlubGluZSIsInN0YXRpYyIsIm9udG91Y2hzdGFydCIsImRvY3VtZW50Q2xpY2siLCJjYXB0dXJlIiwiY2xpY2tPcGVucyIsIm1vbnRoTmF2Iiwib25Nb250aE5hdkNsaWNrIiwic2VsZWN0RGF0ZSIsInRpbWVDb250YWluZXIiLCJzZWxUZXh0Iiwic2VsZWN0IiwidGltZUluY3JlbWVudCIsImFsbG93SW5wdXQiLCJvbkJsdXIiLCJqdW1wRGF0ZSIsImp1bXBUbyIsIm5vdyIsIm9sZFllYXIiLCJvbGRNb250aCIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJtZXNzYWdlIiwiZXJyb3JIYW5kbGVyIiwiYnVpbGRNb250aFN3aXRjaCIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJpbmNyZW1lbnROdW1JbnB1dCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiaW5wdXRFbGVtIiwidGFyZ2V0IiwicGFyZW50Tm9kZSIsImZpcnN0Q2hpbGQiLCJjcmVhdGVFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJ0YWJJbmRleCIsImFwcGVuZENoaWxkIiwiYnVpbGRNb250aE5hdiIsImlubmVyQ29udGFpbmVyIiwiYnVpbGRXZWVrcyIsInJDb250YWluZXIiLCJidWlsZFdlZWtkYXlzIiwiYnVpbGREYXlzIiwiYnVpbGRUaW1lIiwiYW5pbWF0ZSIsImN1c3RvbUFwcGVuZCIsImFwcGVuZFRvIiwibm9kZVR5cGUiLCJhZGQiLCJpbnNlcnRCZWZvcmUiLCJuZXh0U2libGluZyIsIndyYXBwZXIiLCJhbHRJbnB1dCIsImJvZHkiLCJfZGF5TnVtYmVyIiwiZGF0ZUlzRW5hYmxlZCIsImRheUVsZW1lbnQiLCJnZXREYXRlIiwiJGkiLCJzZXRBdHRyaWJ1dGUiLCJmb3JtYXREYXRlIiwiYXJpYURhdGVGb3JtYXQiLCJ0b2RheURhdGVFbGVtIiwiaXNEYXRlU2VsZWN0ZWQiLCJzZWxlY3RlZERhdGVFbGVtIiwiaXNEYXRlSW5SYW5nZSIsImluc2VydEFkamFjZW50SFRNTCIsImdldFdlZWsiLCJmb2N1c09uRGF5RWxlbSIsInRhcmdldE5vZGUiLCJmb2N1cyIsImdldEZpcnN0QXZhaWxhYmxlRGF5Iiwic3RhcnRNb250aCIsImVuZE1vbnRoIiwibSIsImNoaWxkcmVuIiwic3RhcnRJbmRleCIsImVuZEluZGV4IiwiYyIsImdldE5leHRBdmFpbGFibGVEYXkiLCJjdXJyZW50IiwiZ2l2ZW5Nb250aCIsImxvb3BEZWx0YSIsIm51bU1vbnRoRGF5cyIsImFicyIsImZvY3VzT25EYXkiLCJvZmZzZXQiLCJkYXlGb2N1c2VkIiwiaXNJblZpZXciLCJzdGFydEVsZW0iLCJidWlsZE1vbnRoRGF5cyIsImZpcnN0T2ZNb250aCIsImdldERheSIsImZpcnN0RGF5T2ZXZWVrIiwicHJldk1vbnRoRGF5cyIsImlzTXVsdGlNb250aCIsInByZXZNb250aERheUNsYXNzIiwibmV4dE1vbnRoRGF5Q2xhc3MiLCJkYXlOdW1iZXIiLCJkYXlJbmRleCIsImRheU51bSIsImRheUNvbnRhaW5lciIsImZyYWciLCJkIiwic2V0TW9udGgiLCJtb250aFNlbGVjdG9yVHlwZSIsInNob3VsZEJ1aWxkTW9udGgiLCJtb250aHNEcm9wZG93bkNvbnRhaW5lciIsImlubmVySFRNTCIsInNob3J0aGFuZEN1cnJlbnRNb250aCIsInNlbGVjdGVkIiwiYnVpbGRNb250aCIsImNvbnRhaW5lciIsIm1vbnRoTmF2RnJhZ21lbnQiLCJtb250aEVsZW1lbnQiLCJtb250aEFyaWFMYWJlbCIsInNlbGVjdGVkTW9udGgiLCJ5ZWFySW5wdXQiLCJ0YWJpbmRleCIsInllYXJFbGVtZW50IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJ5ZWFyQXJpYUxhYmVsIiwiZGlzYWJsZWQiLCJidWlsZE1vbnRocyIsInByZXZNb250aE5hdiIsInllYXJFbGVtZW50cyIsIm1vbnRoRWxlbWVudHMiLCJuZXh0TW9udGhOYXYiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsIl9faGlkZVByZXZNb250aEFycm93IiwiYm9vbCIsIl9faGlkZU5leHRNb250aEFycm93IiwiY3VycmVudFllYXJFbGVtZW50IiwidXBkYXRlTmF2aWdhdGlvbkN1cnJlbnRNb250aCIsInNlcGFyYXRvciIsImhvdXJJbnB1dCIsImhvdXJBcmlhTGFiZWwiLCJtaW51dGVJbnB1dCIsIm1pbnV0ZUFyaWFMYWJlbCIsImhvdXJJbmNyZW1lbnQiLCJtaW51dGVJbmNyZW1lbnQiLCJlbmFibGVTZWNvbmRzIiwic2Vjb25kSW5wdXQiLCJnZXRBdHRyaWJ1dGUiLCJkZWZhdWx0SG91ciIsInRpdGxlIiwidG9nZ2xlVGl0bGUiLCJ3ZWVrZGF5Q29udGFpbmVyIiwidXBkYXRlV2Vla2RheXMiLCJ3ZWVrZGF5cyIsInNob3J0aGFuZCIsInNwbGljZSIsImpvaW4iLCJ3ZWVrQWJicmV2aWF0aW9uIiwiaXNPZmZzZXQiLCJfaGlkZVByZXZNb250aEFycm93IiwiX2hpZGVOZXh0TW9udGhBcnJvdyIsInRyaWdnZXJDaGFuZ2VFdmVudCIsInRvSW5pdGlhbCIsIm1vYmlsZUlucHV0IiwiX2luaXRpYWxEYXRlIiwicmVtb3ZlQ2hpbGQiLCJsYXN0Q2hpbGQiLCJfdHlwZSIsInJlbW92ZUF0dHJpYnV0ZSIsIl8iLCJpc0NhbGVuZGFyRWxlbSIsImVsZW0iLCJldmVudFRhcmdldF8xIiwiaXNDYWxlbmRhckVsZW1lbnQiLCJpc0lucHV0IiwicGF0aCIsImxvc3RGb2N1cyIsInJlbGF0ZWRUYXJnZXQiLCJpc0lnbm9yZWQiLCJpZ25vcmVkRm9jdXNFbGVtZW50cyIsInNvbWUiLCJhbHRGb3JtYXQiLCJkYXRlRm9ybWF0IiwibmV3WWVhciIsIm5ld1llYXJOdW0iLCJpc05ld1llYXIiLCJ0aW1lbGVzcyIsImRhdGVUb0NoZWNrIiwiZW5hYmxlIiwiZGlzYWJsZSIsImFycmF5IiwicGFyc2VkIiwiZnJvbSIsInRvIiwidmFsdWVDaGFuZ2VkIiwidHJpbUVuZCIsImdldERhdGVTdHIiLCJhbGxvd0tleWRvd24iLCJhbGxvd0lubGluZUtleWRvd24iLCJrZXlDb2RlIiwiYmx1ciIsImlzVGltZU9iaiIsInByZXZlbnREZWZhdWx0IiwiZm9jdXNBbmRDbG9zZSIsImRlbHRhXzEiLCJjdHJsS2V5Iiwic3RvcFByb3BhZ2F0aW9uIiwiZWxlbXMiLCJjb25jYXQiLCJmaWx0ZXIiLCJ4Iiwic2hpZnRLZXkiLCJjaGFyQXQiLCJ0b0xvd2VyQ2FzZSIsImNlbGxDbGFzcyIsImhvdmVyRGF0ZSIsImZpcnN0RWxlbWVudENoaWxkIiwiaW5pdGlhbERhdGUiLCJyYW5nZVN0YXJ0RGF0ZSIsInJhbmdlRW5kRGF0ZSIsImNvbnRhaW5zRGlzYWJsZWQiLCJtaW5SYW5nZSIsIm1heFJhbmdlIiwiREFZIiwiaG92ZXJhYmxlQ2VsbHMiLCJkYXlFbGVtIiwidGltZXN0YW1wIiwib3V0T2ZSYW5nZSIsInBvc2l0aW9uRWxlbWVudCIsIl9wb3NpdGlvbkVsZW1lbnQiLCJjbGljayIsIndhc09wZW4iLCJzZXRUaW1lb3V0IiwibWluTWF4RGF0ZVNldHRlciIsImludmVyc2VEYXRlT2JqIiwiYm9vbE9wdHMiLCJ1c2VyQ29uZmlnIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwiZGF0YXNldCIsImZvcm1hdHMiLCJfZW5hYmxlIiwiZGF0ZXMiLCJwYXJzZURhdGVSdWxlcyIsIl9kaXNhYmxlIiwidGltZU1vZGUiLCJkZWZhdWx0RGF0ZUZvcm1hdCIsImRlZmF1bHRBbHRGb3JtYXQiLCJfbWluRGF0ZSIsIl9tYXhEYXRlIiwibWluTWF4VGltZVNldHRlciIsInZhbCIsIl9taW5UaW1lIiwiX21heFRpbWUiLCJob29rIiwibWFwIiwiZGlzYWJsZU1vYmlsZSIsInBsdWdpbnMiLCJwbHVnaW5Db25mIiwiYWx0SW5wdXRDbGFzcyIsImdldElucHV0RWxlbSIsInF1ZXJ5U2VsZWN0b3IiLCJsb2NhbGUiLCJsMTBucyIsIkVycm9yIiwiZGVmYXVsdCIsIkQiLCJsIiwibG9uZ2hhbmQiLCJNIiwibW9udGhzIiwiRiIsIksiLCJjdXN0b21Qb3NpdGlvbkVsZW1lbnQiLCJwb3NpdGlvbiIsImNhbGVuZGFySGVpZ2h0IiwicmVkdWNlIiwiYWNjIiwiY2hpbGQiLCJvZmZzZXRIZWlnaHQiLCJjYWxlbmRhcldpZHRoIiwiY29uZmlnUG9zIiwic3BsaXQiLCJjb25maWdQb3NWZXJ0aWNhbCIsImNvbmZpZ1Bvc0hvcml6b250YWwiLCJpbnB1dEJvdW5kcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImRpc3RhbmNlRnJvbUJvdHRvbSIsImlubmVySGVpZ2h0IiwiYm90dG9tIiwic2hvd09uVG9wIiwidG9wIiwicGFnZVlPZmZzZXQiLCJsZWZ0IiwicGFnZVhPZmZzZXQiLCJpc0NlbnRlciIsImlzUmlnaHQiLCJyaWdodCIsInJpZ2h0TW9zdCIsImNlbnRlck1vc3QiLCJkb2MiLCJnZXREb2N1bWVudFN0eWxlU2hlZXQiLCJib2R5V2lkdGgiLCJjZW50ZXJMZWZ0IiwiY2VudGVyQmVmb3JlIiwiY2VudGVyQWZ0ZXIiLCJjZW50ZXJJbmRleCIsImNzc1J1bGVzIiwiY2VudGVyU3R5bGUiLCJpbnNlcnRSdWxlIiwiZWRpdGFibGVTaGVldCIsInN0eWxlU2hlZXRzIiwic2hlZXQiLCJlcnIiLCJjcmVhdGVTdHlsZVNoZWV0IiwiaGVhZCIsIm1zTWF4VG91Y2hQb2ludHMiLCJpc1NlbGVjdGFibGUiLCJkYXkiLCJzZWxlY3RlZERhdGUiLCJzaG91bGRDaGFuZ2VNb250aCIsInNlbGVjdGVkSW5kZXgiLCJzb3J0IiwiYiIsImNsb3NlT25TZWxlY3QiLCJzaW5nbGUiLCJyYW5nZSIsIkNBTExCQUNLUyIsInVwZGF0ZVBvc2l0aW9uRWxlbWVudCIsIm9wdGlvbiIsInNldFNlbGVjdGVkRGF0ZSIsImlucHV0RGF0ZSIsImZvcm1hdCIsImNvbmp1bmN0aW9uIiwicmFuZ2VTZXBhcmF0b3IiLCJhbGxvd0ludmFsaWRQcmVsb2FkIiwiYXJyIiwicnVsZSIsInByZWxvYWRlZERhdGUiLCJub2RlTmFtZSIsInBsYWNlaG9sZGVyIiwicmVxdWlyZWQiLCJpbnB1dFR5cGUiLCJtb2JpbGVGb3JtYXRTdHIiLCJkZWZhdWx0VmFsdWUiLCJzdGVwIiwiU3RyaW5nIiwiZGF0YSIsImhvb2tzIiwibmFtZSIsImluaXRFdmVudCIsInNwZWNpZmljRm9ybWF0IiwiZE9iaiIsImlzUHJldk1vbnRoIiwiaXNOZXh0TW9udGgiLCJpc0tleURvd24iLCJwYXJzZUZsb2F0IiwiY3VyVmFsdWUiLCJ3aGljaCIsIm5ld1ZhbHVlIiwiaXNIb3VyRWxlbSIsImlzTWludXRlRWxlbSIsIl9mbGF0cGlja3IiLCJub2RlTGlzdCIsIm5vZGVzIiwiSFRNTEVsZW1lbnQiLCJpbnN0YW5jZXMiLCJub2RlIiwiY29uc29sZSIsImVycm9yIiwiSFRNTENvbGxlY3Rpb24iLCJOb2RlTGlzdCIsInNlbGVjdG9yIiwiTm9kZSIsImVuIiwibG9jYWxpemUiLCJzZXREZWZhdWx0cyIsImpRdWVyeSIsImZwX2luY3IiLCJlbmdsaXNoIiwib3JkaW5hbCIsIm50aCIsInNjcm9sbFRpdGxlIiwiYXV0b0ZpbGxEZWZhdWx0VGltZSIsImRlZmF1bHRNaW51dGUiLCJkZWZhdWx0U2Vjb25kcyIsIndhcm4iLCJnaXZlbkRhdGUiLCJ3ZWVrMSIsInJvdW5kIiwib25DaGFuZ2UiLCJvbkNsb3NlIiwib25EYXlDcmVhdGUiLCJvbkRlc3Ryb3kiLCJvbk1vbnRoQ2hhbmdlIiwib25PcGVuIiwib25QYXJzZUNvbmZpZyIsIm9uUmVhZHkiLCJvblZhbHVlVXBkYXRlIiwib25ZZWFyQ2hhbmdlIiwib25QcmVDYWxlbmRhclBvc2l0aW9uIiwicmV2Rm9ybWF0IiwiX2IiLCJfYyIsIl9kIiwiZnJtdCIsIm92ZXJyaWRlTG9jYWxlIiwiZ2l2ZW5Gb3JtYXQiLCJjdXN0b21Mb2NhbGUiLCJwYXJzZWREYXRlIiwiZGF0ZU9yaWciLCJ0b0ZpeGVkIiwiZGF0ZXN0ciIsInRyaW0iLCJtYXRjaGVkIiwib3BzIiwibWF0Y2hJbmRleCIsInJlZ2V4U3RyIiwidG9rZW4iLCJpc0JhY2tTbGFzaCIsImVzY2FwZWQiLCJtYXRjaCIsIlJlZ0V4cCIsImV4ZWMiLCJpc05hTiIsImRhdGUxIiwiZGF0ZTIiLCJjb21wYXJlVGltZXMiLCJ0cyIsInRzMSIsInRzMiIsInNlY29uZHNTaW5jZU1pZG5pZ2h0IiwiZmxvb3IiLCJtaW5Ib3VyIiwibWluTWludXRlcyIsIm1pblNlY29uZHMiLCJtYXhIciIsIm1heE1pbnV0ZXMiLCJ0YWciLCJjb250ZW50IiwiY29uZGl0aW9uIiwiaW5wdXRDbGFzc05hbWUiLCJvcHRzIiwibnVtSW5wdXQiLCJhcnJvd1VwIiwiYXJyb3dEb3duIiwicGF0dGVybiIsImNvbXBvc2VkUGF0aCIsImRvTm90aGluZyIsIm1vbnRoTnVtYmVyIiwibW9udGhOYW1lIiwiRyIsIkgiLCJKIiwic2hvcnRNb250aCIsIlMiLCJzZXRTZWNvbmRzIiwiVSIsInVuaXhTZWNvbmRzIiwiVyIsIndlZWtOdW0iLCJ3ZWVrTnVtYmVyIiwiWSIsInNldEZ1bGxZZWFyIiwiWiIsIklTT0RhdGUiLCJoIiwic2V0TWludXRlcyIsInUiLCJ1bml4TWlsbFNlY29uZHMiLCJ3IiwieSIsInRvSVNPU3RyaW5nIiwic3Vic3RyaW5nIiwibnVtYmVyIiwid2FpdCIsIl90aGlzIiwiYXJncyIsImNsZWFyVGltZW91dCIsIm9iaiIsIl9pIiwiVHlwZUVycm9yIiwiX2xvb3BfMSIsInNvdXJjZSIsImtleXMiLCJhcmdzXzEiLCJnbG9iYWwiLCJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmluZSIsImFtZCIsImdsb2JhbFRoaXMiLCJydSIsImZwIiwiUnVzc2lhbiIsInVrIiwiVWtyYWluaWFuIiwianNPcHRpb25zIiwiSm9vbWxhIiwiZ2V0T3B0aW9ucyIsImZpZWxkRnJvbSIsImZpZWxkVG8iLCJvbGRWYWx1ZSIsIm1vbnRoRm9ybWF0dGVkIiwiZGF5Rm9ybWF0dGVkIiwiZGF0ZVN0cmluZyIsImNoYW5nZSIsIkV2ZW50Iiwic3RyaW5nIl0sInNvdXJjZVJvb3QiOiIifQ==