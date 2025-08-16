document.addEventListener('DOMContentLoaded', function () {
// console.log(window.JSHOP_SEARCH_INSTANCES);

    if (!window.JSHOP_SEARCH_INSTANCES) return;

  window.JSHOP_SEARCH_INSTANCES.forEach((instance) => {
    const container = document.querySelector(`.jshop_searchajax[data-module-id="${instance.moduleId}"]`);
    if (!container) return;

    const input = container.querySelector('.jshop-search-input');
    const category = container.querySelector('.jshop-category-id');
    const result = container.querySelector('.jshop-search-result');

    let timeoutId = null;
    let xhr = null;

    function search() {
      const query = input.value;
      const catid = encodeURIComponent(category.value);

      if (timeoutId) clearTimeout(timeoutId);

      if (query !== '' && instance.ajaxSearch != 0) {
        timeoutId = setTimeout(() => {
          if (xhr) xhr.abort?.();

          result.style.visibility = 'visible';
          result.classList.add('active');
          result.innerHTML = '<div class="spinner"></div>';

          xhr = new XMLHttpRequest();
          xhr.open('POST', instance.ajaxLink, true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

          const params = new URLSearchParams({
            search: query,
            search_type: instance.searchType,
            category_id: catid,
            displaycount: instance.displayCount,
            more_results: instance.moreResults,
            search_by_name: instance.searchByName,
            search_by_kode: instance.searchByKode,
            setsearchdata: '1'
          });

          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
              result.innerHTML = xhr.responseText;
            }
          };

          xhr.onerror = function () {
            console.error('AJAX error');
          };

          xhr.send(params.toString());
        }, 500);
      } else {
        result.style.visibility = 'hidden';
        result.innerHTML = '';
        result.classList.remove('active');
      }
    }

    input.addEventListener('keyup', search);
    input.addEventListener('focus', search);

    document.addEventListener('click', function () {
      result.style.visibility = 'hidden';
      result.classList.remove('active');
    });

    const categorySelect = container.querySelector('#show_categories_filter');
    if (categorySelect) {
      categorySelect.addEventListener('change', function () {
        category.value = this.value;
      });
    }
  });
});
