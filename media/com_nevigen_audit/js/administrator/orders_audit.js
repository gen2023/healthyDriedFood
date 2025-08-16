/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./com_nevigen_audit/es6/administrator/orders_audit.es6 ***!
  \**************************************************************/
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */



window.showContent = (btn, targetClass) => {
  if (!targetClass || !btn) {
    return;
  }
  if (btn.classList.contains('active')) {
    return;
  }
  let buttons = document.querySelectorAll('#orders-audit-collapse .orders-collapse-btn');
  if (buttons.length > 0) {
    let targets = document.querySelectorAll('.' + targetClass);
    if (targets.length === 0) {
      return;
    }
    buttons.forEach(button => {
      if (btn === button) {
        btn.classList.add('active');
        document.querySelector('[data-orders-audit-collapse="title"]').innerText = '«' + btn.innerText + '»';
      } else {
        button.classList.remove('active');
      }
    });
    document.querySelectorAll('.orders-collapse-content').forEach(content => {
      if (content.classList.contains(targetClass)) {
        content.style.display = '';
      } else {
        content.style.display = 'none';
      }
    });
  }
};
})();

// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./com_nevigen_audit/scss/administrator/orders_audit.scss ***!
  \****************************************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYWRtaW5pc3RyYXRvci9vcmRlcnNfYXVkaXQuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWJBLE1BQU0sQ0FBQ0MsV0FBVyxHQUFHLENBQUNDLEdBQUcsRUFBRUMsV0FBVyxLQUFLO0VBQzFDLElBQUksQ0FBQ0EsV0FBVyxJQUFJLENBQUNELEdBQUcsRUFBRTtJQUN6QjtFQUNEO0VBQ0EsSUFBSUEsR0FBRyxDQUFDRSxTQUFTLENBQUNDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUNyQztFQUNEO0VBQ0EsSUFBSUMsT0FBTyxHQUFHQyxRQUFRLENBQUNDLGdCQUFnQixDQUFDLDZDQUE2QyxDQUFDO0VBQ3RGLElBQUlGLE9BQU8sQ0FBQ0csTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN2QixJQUFJQyxPQUFPLEdBQUdILFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsR0FBRyxHQUFHTCxXQUFXLENBQUM7SUFDMUQsSUFBSU8sT0FBTyxDQUFDRCxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQ3pCO0lBQ0Q7SUFDQUgsT0FBTyxDQUFDSyxPQUFPLENBQUNDLE1BQU0sSUFBSTtNQUN6QixJQUFJVixHQUFHLEtBQUtVLE1BQU0sRUFBRTtRQUNuQlYsR0FBRyxDQUFDRSxTQUFTLENBQUNTLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDM0JOLFFBQVEsQ0FBQ08sYUFBYSxDQUFDLHNDQUFzQyxDQUFDLENBQUNDLFNBQVMsR0FBRyxHQUFHLEdBQUNiLEdBQUcsQ0FBQ2EsU0FBUyxHQUFDLEdBQUc7TUFDakcsQ0FBQyxNQUFNO1FBQ05ILE1BQU0sQ0FBQ1IsU0FBUyxDQUFDWSxNQUFNLENBQUMsUUFBUSxDQUFDO01BQ2xDO0lBQ0QsQ0FBQyxDQUFDO0lBQ0ZULFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUMsQ0FBQ0csT0FBTyxDQUFDTSxPQUFPLElBQUk7TUFDeEUsSUFBSUEsT0FBTyxDQUFDYixTQUFTLENBQUNDLFFBQVEsQ0FBQ0YsV0FBVyxDQUFDLEVBQUU7UUFDNUNjLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDQyxPQUFPLEdBQUcsRUFBRTtNQUMzQixDQUFDLE1BQU07UUFDTkYsT0FBTyxDQUFDQyxLQUFLLENBQUNDLE9BQU8sR0FBRyxNQUFNO01BQy9CO0lBQ0QsQ0FBQyxDQUFDO0VBRUg7QUFDRCxDQUFDLEM7Ozs7Ozs7OztBQ3pDRCIsInNvdXJjZXMiOlsid2VicGFjazovL3BrZ19uZXZpZ2VuX2F1ZGl0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2F1ZGl0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fYXVkaXQvLi9jb21fbmV2aWdlbl9hdWRpdC9lczYvYWRtaW5pc3RyYXRvci9vcmRlcnNfYXVkaXQuZXM2Iiwid2VicGFjazovL3BrZ19uZXZpZ2VuX2F1ZGl0Ly4vY29tX25ldmlnZW5fYXVkaXQvc2Nzcy9hZG1pbmlzdHJhdG9yL29yZGVyc19hdWRpdC5zY3NzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKlxuICogQHBhY2thZ2UgICAgTmV2aWdlbiBBdWRpdCBQYWNrYWdlXG4gKiBAdmVyc2lvbiAgICAxLjAuN1xuICogQGF1dGhvciAgICAgTmV2aWdlbi5jb20gLSBodHRwczovL25ldmlnZW4uY29tXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgwqkgTmV2aWdlbi5jb20uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBAbGljZW5zZSAgICBQcm9wcmlldGFyeS4gQ29weXJpZ2h0ZWQgQ29tbWVyY2lhbCBTb2Z0d2FyZVxuICogQGxpbmsgICAgICAgaHR0cHM6Ly9uZXZpZ2VuLmNvbVxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG53aW5kb3cuc2hvd0NvbnRlbnQgPSAoYnRuLCB0YXJnZXRDbGFzcykgPT4ge1xuXHRpZiAoIXRhcmdldENsYXNzIHx8ICFidG4pIHtcblx0XHRyZXR1cm47XG5cdH1cblx0aWYgKGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGxldCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI29yZGVycy1hdWRpdC1jb2xsYXBzZSAub3JkZXJzLWNvbGxhcHNlLWJ0bicpO1xuXHRpZiAoYnV0dG9ucy5sZW5ndGggPiAwKSB7XG5cdFx0bGV0IHRhcmdldHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRhcmdldENsYXNzKTtcblx0XHRpZiAodGFyZ2V0cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0YnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG5cdFx0XHRpZiAoYnRuID09PSBidXR0b24pIHtcblx0XHRcdFx0YnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1vcmRlcnMtYXVkaXQtY29sbGFwc2U9XCJ0aXRsZVwiXScpLmlubmVyVGV4dCA9ICfCqycrYnRuLmlubmVyVGV4dCsnwrsnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcmRlcnMtY29sbGFwc2UtY29udGVudCcpLmZvckVhY2goY29udGVudCA9PiB7XG5cdFx0XHRpZiAoY29udGVudC5jbGFzc0xpc3QuY29udGFpbnModGFyZ2V0Q2xhc3MpKSB7XG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH1cbn1cblxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbIndpbmRvdyIsInNob3dDb250ZW50IiwiYnRuIiwidGFyZ2V0Q2xhc3MiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImJ1dHRvbnMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJsZW5ndGgiLCJ0YXJnZXRzIiwiZm9yRWFjaCIsImJ1dHRvbiIsImFkZCIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lclRleHQiLCJyZW1vdmUiLCJjb250ZW50Iiwic3R5bGUiLCJkaXNwbGF5Il0sInNvdXJjZVJvb3QiOiIifQ==