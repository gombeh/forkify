import View from "./view";
import icons from 'url:../../img/icons.svg';
import route from "../route";

class PreviewView extends View {
    _parentElement = '';

    addHandleRoute(handler) {
        // debugger;
        Array.from(document.querySelectorAll('.preview'))
            .forEach(ele => ele.addEventListener('click', function (e) {
                e.preventDefault();
                const link = e.target.closest('.preview__link');
                if (!link) return;
                const path = link.dataset.path;
                const id = link.dataset.id;
                handler(path, id);
            })
            );
    }

    _generateMarkup() {
        return `
            <li class="preview">
                <a class="preview__link ${this._data.id === this._id ? 'preview__link--active' : ''}" href="${window.location.origin}${route.get(`/recipes/${this._data.id}`)}" data-path="${route.get(`/recipes/${this._data.id}`)}" data-id="${this._data.id}">
                <figure class="preview__fig">
                    <img src="${this._data.image}" alt="${this._data.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${this._data.title}</h4>
                    <p class="preview__publisher">${this._data.publisher}</p>
                    <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
                        <svg>
                        <use href="${icons}#icon-user"></use>
                        </svg>
                    </div>
                </div>
                </a>
            </li>
        `
    }
}

export default new PreviewView();