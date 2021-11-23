const connection = require('./connection');
const { ObjectId } = require('mongodb');

const COLLECTION_DATA = 'recipes';

const createRecipe = async (recipe) => {
    const db = await connection();
    const user = await db.collection(COLLECTION_DATA).insertOne(recipe);
    return user.ops[0];
};

const getRecipeList = async () => {
    const db = await connection();
    const recipeList = await db.collection(COLLECTION_DATA).find({}).toArray();
    return recipeList;
};

const getRecipeById = async (id) => {
    const db = await connection();
    const recipe = await db.collection(COLLECTION_DATA).findOne({ _id: ObjectId(id) });
    return recipe;
  };

module.exports = {
    createRecipe,
    getRecipeList,
    getRecipeById
};