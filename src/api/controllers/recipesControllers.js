const services = require('../services');

// inclusão de nova receita
// tem como requisitos : { name, ingredients, preparation }
// precisa estar logado
const createRecipe = async (req, res) => {
    const newRecipe = req.body;
    const { authorization } = req.headers;
    
    const { status, includeRecipes, err } = await services.recipesService.createRecipe(newRecipe, authorization);
    if (err) return res.status(status).json({ message: err.message });

    res.status(status).json({ recipe: includeRecipes });
};

// busca todas as receitas no banco
const getRecipeList = async (_req, res) => {
    const { status, recipeList } = await services.recipesService.getRecipeList();
    res.status(status).json(recipeList);
};

// busca uma receita em específica
// tem como requisitos : idRecipe
const getRecipeById = async (req, res) => {
    const { id } = req.params;
    
    const { status, recipe, err } = await services.recipesService.getRecipeById(id);
    if (err) return res.status(status).json({ message: err.message });
    
    res.status(status).json(recipe);
};

// endpoint para edição de uma receita
// tem como requisitos : idRecipe, { name, ingredients, preparation }
// precisa estar logado
const updateRecipeById = async (req, res) => {
    const { id } = req.params;
    const recipe = req.body;
    const { authorization } = req.headers;
    
    const { status, updateRecipe, err } = await services.recipesService.updateRecipeById(id, recipe, authorization);
    if (err) return res.status(status).json({ message: err.message });
    
    res.status(status).json(updateRecipe);
};

// endpoint para a remoção de uma receita
// tem como requisitos : idRecipe
// precisa estar logado
const deleteRecipe = async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;
  
    const { status, err } = await services.recipesService.deleteRecipe(id, authorization);
    if (err) return res.status(status).json({ message: err.message });
    
    res.status(status).json();
};

module.exports = {
    createRecipe,
    getRecipeList,
    getRecipeById,
    updateRecipeById,
    deleteRecipe
};