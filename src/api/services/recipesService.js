const { recipeValidation } = require('../schemas');
const { tokenValidation } = require('./tokenValidation');
const models = require('../models');

const { CREATED_STATUS, REQUEST_INVALID_ENTRIES, HTTP_OK_STATUS, RECIPE_NOT_FOUND } = require('../helpers');

const { idValidation } = require('../schemas');

// inclusão de nova receita
const createRecipe = async (newRecipe, authorization) => {
    const { error } = recipeValidation.validate(newRecipe);
    if (error) return REQUEST_INVALID_ENTRIES;

    const { status, err, data } = await tokenValidation(authorization);
    if (err) return { status, err };

    const { _id: userId } = data;
    const recipe = newRecipe;
    recipe.userId = userId;

    const includeRecipes = await models.recipesModel.createRecipe(recipe);
    return { status: CREATED_STATUS, includeRecipes };
};

// busca todas as receitas no banco
const getRecipeList = async () => {
    const recipeList = await models.recipesModel.getRecipeList();
    return { status: HTTP_OK_STATUS, recipeList };
};

// busca uma receita em específico
const getRecipeById = async (id) => {
    if (!idValidation(id)) return RECIPE_NOT_FOUND;
  
    const recipe = await models.recipesModel.getRecipeById(id);
    if (!recipe) return RECIPE_NOT_FOUND;
  
    return { status: HTTP_OK_STATUS, recipe };
};

module.exports = {
    createRecipe,
    getRecipeList,
    getRecipeById
}