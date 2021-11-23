const services = require('../services');

// endpoint para a validação de login
// tem como requisitos : email, password
const login = async (req, res) => {
  const { status, token, err } = await services.loginService.login(req.body);
  if (err) return res.status(status).json(err);
  
  res.status(status).json({ token });
};

module.exports = { 
  login
};