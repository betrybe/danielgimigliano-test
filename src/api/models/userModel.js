const connection = require('./connection');

const COLLECTION_NAME = 'users';

// adicionando usuário
const createUser = async (newUser) => {
    const db = await connection();
    const user = await db.collection(COLLECTION_NAME).insertOne(newUser);
    return user.ops[0];
};

// verificação já existe usuário
const usersByEmail = async (email) => {
    const db = await connection();
    let Email = null;
    Email = await db.collection(COLLECTION_NAME).findOne({ email });
    return Email;
};

module.exports = {
    createUser,
    usersByEmail,
};
