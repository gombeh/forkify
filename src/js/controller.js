import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODEL_CLOSE_SEC } from './config.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';
import previewView from './views/previewView.js';
import { async } from 'regenerator-runtime';
import { getParameters } from './helpers.js';
import route from './route.js';
import validateRecipe from './validateRecipe.js';

export const controlRecipe = async function (id) {
  try {
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage(), id);


    // 1) Upadate bookmark
    bookmarksView.update(model.state.bookmarks, id);

    // 2) Loading recipe
    await model.loadRecipe(id);


    // 3) Rendering recipe
    recipeView.render(model.state.recipe, true, id);

  } catch (err) {
    recipeView.renderError();
    // recipeView.renderError(`${err} 💥💥💥💥`);
    console.error(err);
  }
}

const controlSearchResults = async function () {
  try {
    // 1) Get query search
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    // 2) Load search results
    await model.loadSearchResults(query);

    //Add page as parameter to url
    window.history.pushState(null, '', `?s=${model.state.search.query}&page=1`);

    // 3) Render results  
    resultsView.render(model.getSearchResultsPage());

    // event change url and load recipe
    previewView.addHandleRoute(function (path, id) {
      window.history.pushState(null, '', `${path}`);
      controlRecipe(id);
    });

    // 4) Render initial pagination button
    paginationView.render(model.state.search, true);

  } catch (err) {
    recipeView.renderError();
    // recipeView.renderError(`${err} 💥💥💥💥`);
  }
}

const controlPagination = function (goToPage) {

  //Add page as parameter to url
  window.history.pushState(null, '', `?s=${model.state.search.query}&page=${goToPage}`);

  // 1) Render results  
  resultsView.render(model.getSearchResultsPage(goToPage));

  // event change url and load recipe
  previewView.addHandleRoute(function (path, id) {
    window.history.pushState(null, '', `${path}`);
    controlRecipe(id);
  });

  // 3) Render initial pagination button
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update resipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

export const conrolBookmark = function () {
  bookmarksView.render(model.state.bookmarks, true, model.state.id);

  // event change url and load recipe
  previewView.addHandleRoute(function (path, id) {
    window.history.pushState(null, '', `${path}`);
    controlRecipe(id);
  });
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // perform validation
    const errors = validateRecipe.validate(newRecipe);
    if (Object.keys(errors).length !== 0) {
      addRecipeView.renderErrorInInputs(errors);
      addRecipeView.renderErrorIngredient(errors);
      addRecipeView.clearInputError();
      return;
    }

    // Show loading spinner
    recipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', route.get(`/recipes/${model.state.recipe.id}`));

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);

  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
}

const controlAddSearchResult = async function () {
  const query = model.state.search.query;
  if (query != '') {
    await model.loadSearchResults(query, true);
    controlPagination(model.state.search.page)
  }
}

const controlSortBy = function (value) {
  model.getSortedResultPage(value);
  resultsView.renderSpinner();
  resultsView.render(model.getSearchResultsPage(model.state.search.page));
  previewView.addHandleRoute(function (path, id) {
    window.history.pushState(null, '', `${path}`);
    controlRecipe(id);
  });
}

const controlSearch = async function () {
  try {
    if (Object.keys(getParameters()).length !== 0) {
      await controlAddSearchResult();
      resultsView.renderSpinner();
      resultsView.render(model.getSearchResultsPage(model.state.search.page));
      resultsView.addHandlerSortBy(controlSortBy)
      // event change url and load recipe
      previewView.addHandleRoute(function (path, id) {
        window.history.pushState(null, '', `${path}`);
        controlRecipe(id);
      });
    }
    searchView.addTextToInput();
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
}

export const init = async function () {
  try {
    recipeView.renderMessage('Start by searching for a recipe or an ingredient. Have fun!');
    conrolBookmark();
    await controlSearch();
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    addRecipeView.addHandlerUpload(controlAddRecipe);
    console.log('Welcome!');
  }
  catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
}
