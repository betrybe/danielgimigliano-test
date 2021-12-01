const models = require('../models');
const { userValidation } = require('../schemas');
const { tokenValidation } = require('./tokenValidation');
const { roles } = require("../../api/enums");

const { 
  REQUEST_INVALID_ENTRIES, 
  CONFLICT_EMAIL, 
  CREATED_STATUS,
  FORBIDDEN_ACCESS_STATUS,
} = require('../helpers');

// criação de usuário
const createUser = async (newUser, role = roles.user.user) => {
    const { email } = newUser;
    
    const { error } = userValidation.validate(newUser);
    if (error) return REQUEST_INVALID_ENTRIES;
    
    const emailExist = await models.usersModel.userByEmail(email);
    if (emailExist) return CONFLICT_EMAIL;

    const user = newUser;
    user.role = role;

    const includeNewUser = await models.usersModel.createUser(user);
    delete includeNewUser.password;

    return { status: CREATED_STATUS, includeNewUser };
};

// criação de usuário admin
const createUserAdmin = async (newUser, authorization) => {
  const { status, err, data } = await tokenValidation(authorization);
  if (err) return { status, err };

  if (data.role === roles.user.admin) {
    return createUser(newUser, data.role);
  }

  return FORBIDDEN_ACCESS_STATUS;
};

module.exports = {
  createUser,
  createUserAdmin,
};