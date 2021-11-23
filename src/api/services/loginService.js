const { loginValidation } = require('../schemas');
const { UNAUTHORIZED_EMPTY_FIELDS, INVALID_UNAUTHORIZED_DATA, HTTP_OK_STATUS, } = require('../helpers');
const models = require('../models');
const { sign } = require('jsonwebtoken');

// endpoint para a validação de login
const secret = 'mysecrettoken';

// TODO - validar tempo de expiração do token
const jwtConfig = {
  expiresIn: '5h',
  algorithm: 'HS256',
};

const login = async (register) => {
  const { error } = loginValidation.validate(register);
  if (error) return UNAUTHORIZED_EMPTY_FIELDS;

  const userExist = await models.userModel.userByEmail(register.email);
  if (!userExist) return INVALID_UNAUTHORIZED_DATA;

  const token = sign({ data: userExist }, secret, jwtConfig);
  return { status: HTTP_OK_STATUS, token };
};

module.exports = {
  login,
  secret,
  jwtConfig
};
