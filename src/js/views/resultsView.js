import View from "./view";
import previewView from "./previewView";

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for query! please try again :)';
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    addHandlerSortBy(handler) {
        document.querySelector('#sortBy').addEventListener('change', function (e) {
            handler(this.value)
        })
    }

    _generateMarkup() {
        return this._data.map(result => previewView.render(result, false, this._id)).join('');
    }
}

export default new ResultsView();