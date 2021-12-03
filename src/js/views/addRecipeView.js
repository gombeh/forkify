import View from "./view";
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded :)';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        this._AddIngredientEvent();
        this._removeIngredientEvent();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    _clearFormErrors() {
        Array.from(document.querySelectorAll('.errors'))
            .forEach(inputErr => {
                inputErr.classList.remove('errors');
                if (inputErr.getAttribute('name').startsWith('ingredient') &&
                    inputErr.closest('.form-group').nextElementSibling?.classList.contains('error-msg-ings'))
                    inputErr.closest('.form-group').nextElementSibling.remove();
                else if (inputErr.nextElementSibling?.classList.contains('error-msg'))
                    inputErr.nextElementSibling.remove();
            });
    }

    clearInputError() {
        Array.from(document.querySelectorAll('.errors'))
            .forEach(inputErr => {
                inputErr.addEventListener('keydown', function () {
                    if (this.classList.contains('errors')) {
                        this.classList.remove('errors');
                        if (this.getAttribute('name').startsWith('ingredient')) {
                            const name = this.getAttribute('name').split('[')[1]?.replace(']', '');
                            const errorGroup = this.closest('.form-group').nextElementSibling;
                            const errorLi = errorGroup?.querySelector(`.${name}`);
                            if (errorLi)
                                errorLi.remove();
                            if (!errorGroup.querySelector('li'))
                                errorGroup.remove();
                        } else {
                            this.nextElementSibling.remove();
                        }
                    }
                });
            });
    }

    _formUpload(form, handler, e) {
        e.preventDefault();
        const dataArr = [...(new FormData(form))];
        const data = Object.fromEntries(dataArr);
        this._clearFormErrors();
        handler(data);
    }

    addHandlerUpload(handler) {
        const form = this._parentElement;
        form.addEventListener('submit', this._formUpload.bind(this, form, handler))
    }

    _AddIngredientEvent() {
        this._parentElement.addEventListener('click', function (e) {
            const link = e.target.closest('#addIngredient');
            if (!link) return;
            let number = Array.from(document.querySelectorAll('.ings'))
                .map(a => a.dataset.number)
                .sort((a, b) => b - a)
                .shift() ?? 6;
            number++;
            const markup =
                `
                <div class="ing-container${number} upload__column ings" data-number="${number}">
                    <label>Ingredient ${number}</label>
                        <div class="form-group" data-id="ingredient-${number}">
                        <input type="text" name="ingredient-${number}[quantity]" value=""  placeholder="3">
                        <input value="" type="text" name="ingredient-${number}[unit]" placeholder="kg"/>
                        <input type="text" name="ingredient-${number}[description]" value=""  placeholder="Avocado">
                        <button type="button" class="btn-danger removeIngredient" data-number="${number}">
                        <svg>
                          <use href="${icons}#icon-minus-circle"></use>
                        </svg>
                      </button>
                    </div>
                </div>
            `;
            link.insertAdjacentHTML('beforebegin', markup);
        });
    }
    renderErrorIngredient(errors) {
        Array.from(document.querySelectorAll('.form-group'))
            .filter(ele => {
                const id = ele.dataset.id;
                return errors?.ingredients && errors?.ingredients[id];
            })
            .forEach(ele => {
                const id = ele.dataset.id;
                const ingErrors = errors.ingredients[id];
                Object.keys(ingErrors).forEach(key => {
                    const input = ele.querySelector(`input[name="${id}[${key}]"]`);
                    input.classList.add('errors');
                });
                const markup = `
                    <div class="error-msg-ings">
                        <div></div>
                        <ol>
                        ${Object.keys(ingErrors).reverse()
                        .map(key => `<li class="${key}">${ingErrors[key]}</li>`)
                        .join('')
                    }
                        </ol>
                    </div>
                `;
                ele.insertAdjacentHTML('afterend', markup);
            });
    }

    _removeIngredientEvent() {
        this._parentElement.addEventListener('click', function (e) {
            const link = e.target.closest('.removeIngredient');
            if (!link) return;
            let number = link.dataset.number;
            document.querySelector(`.ing-container${number}`).remove();
        });
    }

    _generateMarkup() { }

}

export default new AddRecipeView();