const connection = require('./connection');

const COLLECTION_DATA = 'users';

// adicionando usuário
const createUser = async (newUser) => {
    const db = await connection();
    const user = await db.collection(COLLECTION_DATA).insertOne(newUser);
    return user.ops[0];
};

// verificação já existe usuário
const userByEmail = async (email) => {
    const db = await connection();
    let Email = null;
    Email = await db.collection(COLLECTION_DATA).findOne({ email });
    return Email;
};

module.exports = {
    createUser,
    userByEmail,
};
