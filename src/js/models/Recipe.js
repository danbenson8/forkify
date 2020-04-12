import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error)
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        const numberOfIngredients = this.ingredients.length;
        if (numberOfIngredients > 20) {
            this.time = 120;
        } else {
            this.time = 6*(numberOfIngredients);
        }
    }

    calcServings() {
        this.servings = 4;
    }
    
    /** parse ingredients
     * 1. 1. remove parentheses 2. replace a starting 'a' with 1
     * 2. 1. split out the number (if there) 2. remove match from ingredient string
     * 3. 1. standardise units and split them out (if there) 2. remove match from ingredient string
     */
    parseIngredients() {
        const unitsLong = [
            'tablespoon', 
            'teaspoon',
            'ounce',
            'cup',
            'pound',
            'jar',
            'gram',
            'kilogram',
            'clove',
            'pinch',
            'handful'
        ];
        
        const unitsShort = [
            'tbsp',
            'tsp',
            'oz.',
            'cup',
            'lb',
            'jar',
            'g',
            'kg',
            'clove',
            'pinch',
            'handful'
        ]
        
        const newIngredients = this.ingredients.map(el => {
            // 1. remove parentheses and replace a starting 'a' with 1
            let ingredient = el.toLowerCase();
            ingredient = ingredient.replace(/\((.*?)\)/, '');
            ingredient = ingredient.replace(/^a/, '1');
        
            let splitIngredient = {
                count: 0,
                unit: '',
                ingredient: ingredient.slice(/[A-Za-z]/.exec(ingredient).index),
            };
        
            // 2. get count
            let number = ingredient.split(/ |\-/);
            if (number.length) {
                number.forEach(el => {
                const num = parseFloat(el);
                let temp;
                if (el.includes('/')) {
                    temp = el.split('/');
                if (temp.length == 2) {
                    temp = temp.map(el => parseFloat(el));
                    splitIngredient.count += temp[0] / temp[1];
                    return;
                }
                } else if (num) {
                    splitIngredient.count += num;
                } else if (!splitIngredient.count) {
                    splitIngredient.count = 1;
                }
            })
            
            }
        
            // 3. standardise units and split to count unit and ingredient
            unitsLong.forEach((unit, i) => {
            let unitRegEx = new RegExp(`${unit}s*`);
            let regExResult = unitRegEx.exec(ingredient);
            if (regExResult) {
                splitIngredient.unit = regExResult[0].replace(unitRegEx, unitsShort[i]);
                splitIngredient.ingredient = ingredient.slice(regExResult.index + regExResult[0].length);
                splitIngredient.ingredient = splitIngredient.ingredient.replace('of', '');
            }
            splitIngredient.ingredient = splitIngredient.ingredient.replace(/^ +/, '');
            });

            return splitIngredient;

        });

        this.ingredients = newIngredients;
    }
};