const jwt = require('jsonwebtoken');
const models = require('../models');
const { secret } = require('./loginService');

const { MALFORMED_TOKEN_JWT, MISSING_AUTH_TOKEN } = require('../helpers');

const tokenValidation = async (token) => {
  if (!token) return MISSING_AUTH_TOKEN;
  
  try {
    const decodedToken = jwt.verify(token, secret);
    const { email } = decodedToken.data;
    const user = await models.usersModel.userByEmail(email);
    if (!user) return MALFORMED_TOKEN_JWT;
    
    return { data: decodedToken.data };
  } catch (error) {
    return MALFORMED_TOKEN_JWT;
  }
};

module.exports = { 
  tokenValidation,
};
