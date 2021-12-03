import View from "./view";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPage = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1, and there are other pages
        if (curPage === 1 && numPage > 1) {
            return `
                <button class="btn--inline pagination__btn--next autoSize" data-goto="${curPage + 1}">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
                <div class="autoSize numberPages">${numPage}</div>
                <div class="autoSize"></div>
            `;
        }

        // Last Page
        if (curPage === numPage && numPage > 1) {
            return `
                <div class="autoSize"></div>
                <div class="autoSize numberPages">${numPage}</div>
                <button class="btn--inline pagination__btn--prev autoSize" data-goto="${curPage - 1}">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `;
        }

        // Other Page
        if (curPage < numPage) {
            return `
                <button class="btn--inline pagination__btn--next autoSize" data-goto="${curPage + 1}">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
                <div class="autoSize numberPages">${numPage}</div>
                <button class="btn--inline pagination__btn--prev autoSize" data-goto="${curPage - 1}">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `;
        }

        // Page 1, and there are no other pages
        return '';
    }

}

export default new PaginationView();