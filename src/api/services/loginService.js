const { sign } = require('jsonwebtoken');
const { loginValidation } = require('../schemas');
const models = require('../models');

const { 
  UNAUTHORIZED_EMPTY_FIELDS, 
  INVALID_UNAUTHORIZED_DATA, 
  HTTP_OK_STATUS,
} = require('../helpers');

// endpoint para a validação de login
// TODO - validar nome
const secret = 'mysecretdetoken';

// TODO - validar tempo de expiração do token
const jwtConfig = {
  expiresIn: '5h',
  algorithm: 'HS256',
};

const login = async (register) => {
  const { error } = loginValidation.validate(register);
  if (error) return UNAUTHORIZED_EMPTY_FIELDS;

  const userExist = await models.usersModel.userByEmail(register.email);
  if (!userExist) return INVALID_UNAUTHORIZED_DATA;

  const token = sign({ data: userExist }, secret, jwtConfig);
  return { status: HTTP_OK_STATUS, token };
};

module.exports = {
  login,
  secret,
  jwtConfig,
};
