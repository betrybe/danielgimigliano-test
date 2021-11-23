const { recipeValidation } = require('../schemas');
const { tokenValidation } = require('./tokenValidation');
const models = require('../models');

const { CREATED_STATUS, REQUEST_INVALID_ENTRIES } = require('../helpers');

// inclusão de nova receita
const createRecipe = async (newRecipe, authorization) => {
    const { error } = recipeValidation.validate(newRecipe);
    if (error) return REQUEST_INVALID_ENTRIES;

    // TODO - validar comportamento
    const { status, err, data } = await tokenValidation(authorization);
    if (err) return { status, err };

    const { _id: userId } = data;
    const recipe = newRecipe;
    recipe.userId = userId;

    const includeRecipes = await models.recipesModel.createRecipe(recipe);
    return { status: CREATED_STATUS, includeRecipes };
};

module.exports = {
    createRecipe
}