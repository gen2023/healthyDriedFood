/******/ (() => { // webpackBootstrap
/******/ 	/************************************************************************/
var __webpack_exports__ = {};
/*!*************************************************************************!*\
  !*** ./plg_system_nevigen_jshop_onestepcheckout/es6/fields/sorting.es6 ***!
  \*************************************************************************/
/*
 * @package    Nevigen JShop OneStepCheckout Package
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */
document.addEventListener('DOMContentLoaded', () => {
  let sorting = document.querySelectorAll('[data-nevigen-jshop-onestepcheckout-sorting]');
  if (sorting.length > 0) {
    sorting.forEach(sort => {
      let id = sort.getAttribute('data-nevigen-jshop-onestepcheckout-sorting');
      console.log(window.global);
      if (id && dragula) {
        let dragulaList = dragula({
          containers: [sort]
        });

        // let dragulaList = dragula([sort], {});
        // console.log(dragulaList);
        // dragulaList.on('dragend', () => {
        // 	console.log('dragend')
        // });
      }
    });
  }
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvZmllbGRzL3NvcnRpbmcuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxRQUFRLENBQUNDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE1BQU07RUFDbkQsSUFBSUMsT0FBTyxHQUFHRixRQUFRLENBQUNHLGdCQUFnQixDQUFDLDhDQUE4QyxDQUFDO0VBQ3ZGLElBQUlELE9BQU8sQ0FBQ0UsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN2QkYsT0FBTyxDQUFDRyxPQUFPLENBQUdDLElBQUksSUFBSTtNQUN6QixJQUFJQyxFQUFFLEdBQUdELElBQUksQ0FBQ0UsWUFBWSxDQUFDLDRDQUE0QyxDQUFDO01BQ3hFQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0MsTUFBTSxDQUFDQyxNQUFNLENBQUM7TUFDMUIsSUFBSUwsRUFBRSxJQUFJTSxPQUFPLEVBQUM7UUFDakIsSUFBSUMsV0FBVyxHQUFHRCxPQUFPLENBQUM7VUFDekJFLFVBQVUsRUFBRSxDQUFDVCxJQUFJO1FBQ2xCLENBQUMsQ0FBQzs7UUFFRjtRQUNBO1FBQ0E7UUFDQTtRQUNBO01BQ0Q7SUFDRCxDQUFDLENBQUM7RUFFSDtBQUNELENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGtnX25ldmlnZW5fanNob3Bfb25lc3RlcGNoZWNrb3V0Ly4vcGxnX3N5c3RlbV9uZXZpZ2VuX2pzaG9wX29uZXN0ZXBjaGVja291dC9lczYvZmllbGRzL3NvcnRpbmcuZXM2Il0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBAcGFja2FnZSAgICBOZXZpZ2VuIEpTaG9wIE9uZVN0ZXBDaGVja291dCBQYWNrYWdlXG4gKiBAdmVyc2lvbiAgICBfX0RFUExPWV9WRVJTSU9OX19cbiAqIEBhdXRob3IgICAgIE5ldmlnZW4uY29tIC0gaHR0cHM6Ly9uZXZpZ2VuLmNvbVxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IMKpIE5ldmlnZW4uY29tLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogQGxpY2Vuc2UgICAgUHJvcHJpZXRhcnkuIENvcHlyaWdodGVkIENvbW1lcmNpYWwgU29mdHdhcmVcbiAqIEBsaW5rICAgICAgIGh0dHBzOi8vbmV2aWdlbi5jb21cbiAqL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0bGV0IHNvcnRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uZXZpZ2VuLWpzaG9wLW9uZXN0ZXBjaGVja291dC1zb3J0aW5nXScpXG5cdGlmIChzb3J0aW5nLmxlbmd0aCA+IDApIHtcblx0XHRzb3J0aW5nLmZvckVhY2goIChzb3J0KT0+IHtcblx0XHRcdGxldCBpZCA9IHNvcnQuZ2V0QXR0cmlidXRlKCdkYXRhLW5ldmlnZW4tanNob3Atb25lc3RlcGNoZWNrb3V0LXNvcnRpbmcnKTtcblx0XHRcdGNvbnNvbGUubG9nKHdpbmRvdy5nbG9iYWwpO1xuXHRcdFx0aWYgKGlkICYmIGRyYWd1bGEpe1xuXHRcdFx0XHRsZXQgZHJhZ3VsYUxpc3QgPSBkcmFndWxhKHtcblx0XHRcdFx0XHRjb250YWluZXJzOiBbc29ydF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gbGV0IGRyYWd1bGFMaXN0ID0gZHJhZ3VsYShbc29ydF0sIHt9KTtcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coZHJhZ3VsYUxpc3QpO1xuXHRcdFx0XHQvLyBkcmFndWxhTGlzdC5vbignZHJhZ2VuZCcsICgpID0+IHtcblx0XHRcdFx0Ly8gXHRjb25zb2xlLmxvZygnZHJhZ2VuZCcpXG5cdFx0XHRcdC8vIH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH1cbn0pO1xuIl0sIm5hbWVzIjpbImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInNvcnRpbmciLCJxdWVyeVNlbGVjdG9yQWxsIiwibGVuZ3RoIiwiZm9yRWFjaCIsInNvcnQiLCJpZCIsImdldEF0dHJpYnV0ZSIsImNvbnNvbGUiLCJsb2ciLCJ3aW5kb3ciLCJnbG9iYWwiLCJkcmFndWxhIiwiZHJhZ3VsYUxpc3QiLCJjb250YWluZXJzIl0sInNvdXJjZVJvb3QiOiIifQ==