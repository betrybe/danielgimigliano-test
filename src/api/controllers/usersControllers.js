const services = require('../services');

// criação de usuário
// tem como requisitos : name, email, password
const createUser = async (req, res) => {
    const newUser = req.body;
    
    const { status, err, includeNewUser } = await services.usersService.createUser(newUser);
    if (err) return res.status(status).json({ message: err.message });
    
    res.status(status).json({ user: includeNewUser });
};

// criação de usuário admin
// tem como requisitos : name, email, password
// precisa estar logado
const createUserAdmin = async (req, res) => {
    const newUser = req.body;
    const { authorization } = req.headers;
    
    const { 
        status, 
        err, 
        includeNewUser,
    } = await services.usersService.createUserAdmin(newUser, authorization);
    if (err) return res.status(status).json({ message: err.message });
    
    res.status(status).json({ user: includeNewUser });
};

module.exports = { 
    createUser,
    createUserAdmin,
};
