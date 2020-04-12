import '../css/style.css';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

import Search from './models/Search';
import Recipe from './models/Recipe';

import { elements, renderLoader, clearLoader } from './views/base';

/** global state
 * - search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
*/

const state = {};

/** search controller
 * 1. get query from view
 * 2. create search object and add to global state
 * 3. prepare UI for results listing
 * 4. search for recipes
 * 5. render results on the UI
 */

const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. create search object and add to global state
        state.search = new Search(query);
        // 3. prepare UI for results listing
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // 4. search for recipes
            await state.search.getResults();
    
            // 5. render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong... :(')
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResultsPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

/** recipe controller
 * 1. get id from url hash
 * 2. prepare UI for change
 * 3. create new Recipe object
 * 4. get recipe data
 * 5. calculate servings / timings
 * 6. render recipe on UI
 */

const controlRecipe = async () => {
    // 1. get id from url hash
    const id = window.location.hash.replace('#', '');
    if (id) {
        // 2. prepare UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // 3. create new Recipe object
        state.recipe = new Recipe(id);

        try {
            // 4. get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 5. calculate servings / timings
            state.recipe.calcServings();
            state.recipe.calcTime();

            // 6. render recipe on UI
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error);
            alert('Error processing recipe');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));