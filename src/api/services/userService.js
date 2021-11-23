const models = require('../models');
const { userValidation } = require('../schemas');
const { REQUEST_INVALID_ENTRIES, CONFLICT_EMAIL, CREATED_STATUS } = require('../helpers');

// criação de usuário
const createUser = async (newUser, role = 'user') => {
    const { email } = newUser;
    
    const { error } = userValidation.validate(newUser);
    if (error) return REQUEST_INVALID_ENTRIES;
    
    const emailExist = await models.userModel.userByEmail(email);
    if (emailExist) return CONFLICT_EMAIL;

    const user = newUser;
    user.role = role;

    const addNewUser = await models.userModel.createUser(user);
    delete addNewUser.password;

    return { status: CREATED_STATUS, addNewUser };
};

module.exports = {
  createUser
};