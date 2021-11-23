const services = require('../services');

// criação de usuário
// tem como requisitos : name, email, password
const createUser = async (req, res) => {
    const newUser = req.body;
    
    const { status, err, addNewUser } = await services.userService.createUser(newUser);
    if (err) return res.status(status).json({ message: err.message });
    
    res.status(status).json({ user: addNewUser });
};

module.exports = { 
    createUser
};
