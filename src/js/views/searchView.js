import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPage.innerHTML = '';
}

const limitRecipeTitle = (title, limit=17) => {
    if (title.length > limit) {
        const newTitle = [];
        title.split(' ').reduce((acc,cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length;
        }, 0)
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

const markupButton = (direction, page) => `
    <button class="btn-inline results__btn--${direction}" data-goto="${(direction == 'next') ? page + 1 : page - 1}">
    <span>Page ${(direction == 'next') ? page + 1 : page - 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${(direction == 'next') ? 'right' : 'left'}"></use>
        </svg>
    </button>`;

const renderButtons = (page, numberOfResults, resultsPerPage) => {
    const numberOfPages = Math.ceil(numberOfResults / resultsPerPage);
    const next = markupButton('next', page);
    const previous = markupButton('prev', page)

    if (page === 1 && numberOfPages > 1) {
        elements.searchResultsPage.insertAdjacentHTML('beforeend', next);
    } else if (page === numberOfPages && numberOfPages > 1) {
        elements.searchResultsPage.insertAdjacentHTML('beforeend', previous);
    } else {
        elements.searchResultsPage.insertAdjacentHTML('beforeend', previous);
        elements.searchResultsPage.insertAdjacentHTML('beforeend', next);
    }
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    const start = 0 + (page-1)*resultsPerPage;
    const end = page*resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resultsPerPage);
};