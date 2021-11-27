const { tokenValidation } = require('./tokenValidation');
const models = require('../models');

const { MALFORMED_TOKEN_JWT } = require('../helpers');
const { roles } = require('../enums');

const permissionValidation = async (idRecipe, authorization) => {
    const { userId } = await models.recipesModel.getRecipeById(idRecipe);
    
    const { status, err, data } = await tokenValidation(authorization);
    if (err) return { status, err };
    
    const { _id, role } = data;
    if (userId === _id || role === roles.user.admin) return { data };

    return MALFORMED_TOKEN_JWT;
};

module.exports = {
    permissionValidation,
};