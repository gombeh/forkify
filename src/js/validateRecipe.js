import { getIngredientsObject } from "./helpers";

class ValidateRecipe {

    validate(newRecipe) {
        let errors = {};

        const checkString = (input) => /^[a-zA-Z_\- ]+$/g.test(input);
        const checkInt = (input) => Number.isInteger(input);
        const checkNumber = (input) => {
            return Number(input) === +input; //float and integer
        }
        const checkUrl = (input) => {
            const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return pattern.test(input);
        }

        if (!checkString(newRecipe.title)) errors.title = 'Title should be string.';
        if (!checkString(newRecipe.publisher)) errors.publisher = 'Publisher should be string.';
        if (!checkUrl(newRecipe.sourceUrl)) errors.sourceUrl = 'Source Url should be URL.';
        if (!checkUrl(newRecipe.image)) errors.image = 'Image url should be URL.';
        if (!checkInt(+newRecipe.cookingTime)) errors.cookingTime = 'Prep time should be Integer.';
        if (!checkInt(+newRecipe.servings)) errors.servings = 'servings time should be Integer.';

        if (newRecipe.title.length < 3) errors.title = 'Title should not be less than 3 chars.';
        if (newRecipe.publisher.length < 3) errors.publisher = 'publisher should not be less than 3 chars.';

        if (!newRecipe.title) errors.title = 'Title should not be empty.';
        if (!newRecipe.publisher) errors.publisher = 'Publisher should not be empty.';
        if (!newRecipe.sourceUrl) errors.sourceUrl = 'Source Url should not be empty.';
        if (!newRecipe.image) errors.image = 'Image url should not be empty.';
        if (!newRecipe.cookingTime) errors.cookingTime = 'Prep time should not be empty.';
        if (!newRecipe.servings) errors.servings = 'servings time should not be empty.';


        //Ingredients
        // if (!newRecipe['ingredient-1[description]']) errors['ingredient-1[description]'] = 'Description should not be empty.';

        const ingredientObject = getIngredientsObject(newRecipe);
         const ingsError = Object.keys(ingredientObject).reduce((acc,key) => {
            acc[key] = acc[key] ?? {};
            if (!ingredientObject[key].description) acc[key]['description'] =  'Description should not be empty.';
            if (ingredientObject[key].unit && !checkString(ingredientObject[key].unit)) acc[key]['unit'] = 'Unit  should be String.';   
            if (ingredientObject[key].unit && !ingredientObject[key].quantity) acc[key]['quantity'] =  'Quantity should not be empty';
            else if (!checkNumber(ingredientObject[key].quantity)) acc[key]['quantity'] = 'Quantity should be Integer.';
            if(Object.keys(acc[key]).length === 0) delete acc[key];
            return acc;
        }, {});
        if(Object.keys(ingsError).length > 0) errors['ingredients'] = ingsError;
        return errors;
    }

}

export default new ValidateRecipe()