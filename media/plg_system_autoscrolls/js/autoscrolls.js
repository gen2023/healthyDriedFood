document.addEventListener('DOMContentLoaded', function () {
    if (!Array.isArray(window.autoscrolls)) {
        console.error('Не удалось загрузить конфигурации автоскроллинга');
        return;
    }

    window.autoscrolls.forEach(config => {
        const paginationSelector = config.paginationClass || '.pagination';
        const contentSelector = config.blockClass || '.items-container';
        const disable_mob_px = parseInt(config.disable_mob_px, 10) || 0;
        const scroll_top = parseInt(config.scroll_top, 10) || 0;
        const hide_pagination = !!parseInt(config.hide_pagination, 10);
        const add_btn = !!parseInt(config.add_btn, 10);
        const name_btn = config.name_btn || 'Show more';

        function isMobileScreen() {
            return window.innerWidth < disable_mob_px;
        }

        if (isMobileScreen()) {
            return;
        }

        if (hide_pagination) {
            const paginationElement = document.querySelector(paginationSelector);
            if (paginationElement) {
                paginationElement.classList.add('hiddenPagination');
            }
        }

        const preloader = document.createElement('div');
        preloader.className = 'autoscroll-preloader';
        preloader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(preloader);

        function getNextPageLink() {
            const pagination = document.querySelector(paginationSelector);
            if (!pagination) return null;

            const activePage = pagination.querySelector('.active.page-item');
            if (activePage) {
                let nextPage = activePage.nextElementSibling;
                
                while (nextPage && !nextPage.querySelector('a.page-link')) {
                    nextPage = nextPage.nextElementSibling;
                }

                return nextPage ? nextPage.querySelector('a.page-link') : null;
            }

            const pageLinks = pagination.querySelectorAll('a.page-link');
            return pageLinks.length > 0 ? pageLinks[pageLinks.length - 1] : null;
        }

        function createLoadMoreButton() {
            const button = document.createElement('button');
            button.className = 'btn autoScrollBtn icon-load';
            button.innerText = name_btn;

            button.addEventListener('click', () => {
                const nextPageLink = getNextPageLink();
                if (nextPageLink) {
                    showPreloader();
                    loadMoreItems(nextPageLink.href);
                    button.remove(); 
                }
            });

            return button;
        }

        function addLoadMoreButton() {
            const container = document.querySelector(contentSelector);
            const nextPageLink = getNextPageLink();

            if (container && nextPageLink) {
                removeLoadMoreButton(); 
                container.appendChild(createLoadMoreButton());
            }
        }

        function removeLoadMoreButton() {
            document.querySelectorAll('.autoScrollBtn').forEach(btn => btn.remove());
        }

        if (add_btn) {
            addLoadMoreButton();
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const nextPageLink = getNextPageLink();
                        if (nextPageLink) {
                            showPreloader();
                            loadMoreItems(nextPageLink.href);
                            removeLoadMoreButton(); 
                        }
                    }
                });
            });

            const pagination = document.querySelector(paginationSelector);
            if (pagination) {
                observer.observe(pagination);
            }
        }

        function showPreloader() {
            preloader.style.display = 'block';
        }

        function hidePreloader() {
            preloader.style.display = 'none';
        }

        function loadMoreItems(url) {
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const html = parser.parseFromString(data, 'text/html');
                    const newContent = html.querySelector(contentSelector);
                    const newPagination = html.querySelector(paginationSelector);

                    if (newContent) {
                        const newElements = Array.from(newContent.children);
                        document.querySelector(contentSelector).append(...newElements);
        
                        if (scroll_top) {
                            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                            const scrollPosition = newElements[0]?.getBoundingClientRect().top + window.scrollY - headerHeight;
        
                            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
                        }
                    }

                    if (newPagination) {
                        document.querySelector(paginationSelector).innerHTML = newPagination.innerHTML;
                        if (add_btn) {
                            addLoadMoreButton(); 
                        }
                    } else {
                        document.querySelector(paginationSelector)?.remove();
                    }
                })
                .catch(err => console.error('Ошибка загрузки:', err))
                .finally(hidePreloader);
        }
    });
});
