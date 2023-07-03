const { Router } = require('express');
const { login, register } = require('../controllers/auth');
const {validarCampos} = require('../middlewares/valida-campos')

const router = Router();

router.post('/login',validarCampos,login);

router.post('/register',register)


module.exports = router;