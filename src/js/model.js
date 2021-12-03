import { async } from 'regenerator-runtime/runtime';
// import { getJson, sendJson } from './helpers';
import { AJAX, getIngredientsObject, getParameters } from './helpers';
import { API_URL, RES_PER_PAGE, KEY } from './config';


export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: []
};


const createRecipeObject = function (data) {
    let { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    }
}


export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
}

export const loadSearchResults = async function (query, init = false) {
    state.search.query = query;
    try {
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        const recipesPromise = data.data.recipes.map(async recipe => await AJAX(`${API_URL}${recipe.id}?key=${KEY}`));
        const recipes = await Promise.all(recipesPromise);
        state.search.results = recipes.map(data => {
            const { recipe } = data.data;
            return {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image_url,
                publisher: recipe.publisher,
                ingredientsCount: recipe.ingredients.length,
                cookingTime: recipe.cooking_time,
                ...(recipe.key && { key: recipe.key })
            };
        })
            .sort((a, b) => {
                return a.id > b.id ? 1 : -1;
            });
        if (!init) state.search.page = 1;
    } catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;  //0
    const end = page * state.search.resultsPerPage;  //9
    return state.search.results.slice(start, end);
}

export const getSortedResultPage = function (value) {
    state.search.results = state.search.results.sort((a, b) => {
        switch (value) {
            case "1":
                return a.cookingTime - b.cookingTime;
            case "2":
                return b.cookingTime - a.cookingTime;
            case "3":
                return a.ingredientsCount - b.ingredientsCount;
            case "4":
                return b.ingredientsCount - a.ingredientsCount;
            default:
                return a.id > b.id ? 1 : -1
        }
    });
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
        //newQt = oldQt * newServings / oldServing // 2 * 8 /4 = 4
    });

    state.recipe.servings = newServings;
}

const persistBookmarks = function (bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recpire as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks(state.bookmarks);
}

export const deleteBookmark = function (id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recpire as NOT bookmark
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks(state.bookmarks);
}

const clearBookmark = function () {
    localStorage.clear('bookmark');
}
// clearBookmark();

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.values(getIngredientsObject(newRecipe));
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.cookingTime,
            ingredients
        }

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
}

const initBookmarks = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}

const initSearchResults = function () {
    const params = getParameters();
    const query = params?.s;
    state.search.query = query ?? '';
    state.search.page = +(params?.page) ?? 1;
}

const init = function () {
    initBookmarks();
    initSearchResults();
}

init();


