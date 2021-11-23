const Joi = require('joi');

const userValidation = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    userValidation
};