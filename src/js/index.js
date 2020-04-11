import '../css/style.css';
import Search from './models/Search';
import * as searchView from './views/searchView';

import { elements } from './views/base';

/* global State
// search object
// current recipe object
// shopping list object
// liked recipes
*/
const state = {};

const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. new search and add to state
        state.search = new Search(query);
        // 3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        // 4. search for recipes
        await state.search.getResults();

        // 5. render results on UI
        searchView.renderResults(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})