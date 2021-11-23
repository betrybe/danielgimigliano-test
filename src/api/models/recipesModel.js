const connection = require('./connection');

const COLLECTION_DATA = 'recipes';

const createRecipe = async (recipe) => {
    const db = await connection();
    const user = await db.collection(COLLECTION_DATA).insertOne(recipe);
    return user.ops[0];
};

module.exports = {
    createRecipe
};