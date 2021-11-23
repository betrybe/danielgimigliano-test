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

const updateRecipeById = async (id, recipe) => {
    const { name, ingredients, preparation } = recipe;
    const db = await connection();
    await db.collection(COLLECTION_DATA).updateOne(
        { _id: ObjectId(id) },
        { $set: { name, ingredients, preparation } },
    );

    const updatedRecipe = await db.collection(COLLECTION_DATA).findOne({ _id: ObjectId(id) });
    return updatedRecipe;
};

const deleteRecipe = async (id) => {
    const db = await connection();
    await db.collection(COLLECTION_DATA).deleteOne({ _id: ObjectId(id) });
    const delRecipe = await db.collection(COLLECTION_DATA).findOne({ _id: ObjectId(id) });
    return delRecipe;
};

module.exports = {
    createRecipe,
    getRecipeList,
    getRecipeById,
    updateRecipeById,
    deleteRecipe
};
