const services = require('../services');

// inclusão de nova receita
// tem como requisitos : name, ingredients, preparation
// precisa estar logado
const createRecipe = async (req, res) => {
    const newRecipe = req.body;
    const { authorization } = req.headers;
    
    const { status, includeRecipes, err } = await services.recipesService.createRecipe(newRecipe, authorization);
    if (err) return res.status(status).json({ message: err.message });

    res.status(status).json({ recipe: includeRecipes });
};

// busca todas as receitas no banco
const getRecipes = async (_req, res) => {
    const { status, recipes } = await services.recipesService.getRecipes();
    res.status(status).json(recipes);
};

module.exports = {
    createRecipe,
    getRecipes
};