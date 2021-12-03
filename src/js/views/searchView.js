import { getParameters } from "../helpers";

class SearchView {
    #parentElement = document.querySelector('.search');

    getQuery() {
        const query = this.#parentElement.querySelector('.search__field').value;
        this.#clearInput();
        return query;
    }

    #clearInput() {
        // this.#parentElement.querySelector('.search__field').value = '';
    }

    addTextToInput() {
        this.#parentElement.querySelector('input[type=text]').value = getParameters()?.s ?? '';
    }

    addHandlerSearch(handler) {
        this.#parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            document.querySelector('#sortBy').value = ""
            handler();
        })
    }

}

export default new SearchView();