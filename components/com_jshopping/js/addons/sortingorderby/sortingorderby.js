function submitListsSortingOrderBy() {
	var selectedOptionData = jQuery('#sortingOrderBy option:selected').data('order');
	jQuery('#sort_count #orderby').val(selectedOptionData);
	jshop.submitListProductFilters();
}

document.addEventListener('DOMContentLoaded', function () {
	
	const listSort = document.querySelector('.list_sort');

	if (listSort) {
		const activeSpan = listSort.querySelector('.active');
		const items = listSort.querySelectorAll('ul li');

		listSort.addEventListener('click', function () {
			this.classList.toggle('active');
		});

		items.forEach(item => {
			item.addEventListener('click', function () {
				activeSpan.textContent = this.textContent;

				items.forEach(i => i.classList.remove('active'));
				this.classList.add('active');

				const order = this.getAttribute('data-order');
				document.querySelector('#sort_count #orderby').value = order;

				if (typeof jshop !== 'undefined' && typeof jshop.submitListProductFilters === 'function') {
					jshop.submitListProductFilters();
				}
			});
		});
	}
});