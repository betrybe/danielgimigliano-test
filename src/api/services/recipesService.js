const { recipeValidation } = require('../schemas');
const { tokenValidation } = require('./tokenValidation');
const models = require('../models');

const { CREATED_STATUS, REQUEST_INVALID_ENTRIES, HTTP_OK_STATUS, RECIPE_NOT_FOUND, NO_CONTENT } = require('../helpers');

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

// endpoint para edição de uma receita
const updateRecipeById = async (id, recipe, authorization) => {
    try {
        const { status, err } = await tokenValidation(authorization);
        if (err) return { status, err };
    
        const updateRecipe = await models.recipesModel.updateRecipeById(id, recipe);
        return { status: HTTP_OK_STATUS, updateRecipe };
    } catch (error) {
        return REQUEST_INVALID_ENTRIES;
    }
};

// endpoint para a remoção de uma receita
// TODO - implementar validação de usuário (admin/user)
const deleteRecipe = async (id, authorization) => {
    const { status, err } = await tokenValidation(authorization);
    if (err) return { status, err };
  
    const deletedRecipe = await models.recipesModel.deleteRecipe(id);
    if (!deletedRecipe) return { status: NO_CONTENT };
};

// endpoint para a remoção de uma receita
const includeImage = async (id, authorization) => {
    try {
        const { status, err } = await tokenValidation(authorization);
        if (err) return { status, err };

        const image = `localhost:3000/src/uploads/${id}.jpeg`;

        const includeRecipeImage = await models.recipesModel.includeImage(id, image);
        return { status: 200, includeRecipeImage };
    } catch (error) {
        return REQUEST_INVALID_ENTRIES;
    }
};

module.exports = {
    createRecipe,
    getRecipeList,
    getRecipeById,
    updateRecipeById,
    deleteRecipe,
    includeImage
}