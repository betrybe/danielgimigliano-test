const connection = require('./connection');

const COLLECTION_DATA = 'recipes';

const createRecipe = async (recipe) => {
    const db = await connection();
    const user = await db.collection(COLLECTION_DATA).insertOne(recipe);
    return user.ops[0];
};

const getRecipes = async () => {
    const db = await connection();
    const recipes = await db.collection(COLLECTION_DATA).find({}).toArray();
    return recipes;
};

module.exports = {
    createRecipe,
    getRecipes
};