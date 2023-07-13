const { Router } = require('express');
const UserController = require('../controllers/user');

const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const { check } = require('express-validator');
const { emailExiste } = require('../helpers/db-validators');
const { esRoleValido } = require('../helpers/db-validators');
const { existeUserPorId } = require('../helpers/db-validators');
const { getUsers, postUser, putUser, deleteUser, getUsersByUserRole, getUserById} = UserController;


const router = Router()
    .get('/mostrar', getUsers)
    .get('/mostrarUser', getUsersByUserRole)
    .get('/mostrarEditar/:id', getUserById)
    .post('/agregar', [
        check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
        check('password', 'La password es obligatorio para el post').not().isEmpty(),
        check('password', 'La passwarod debe ser mayor a 6 letras').isLength({ min: 6 }),
        check('email', 'El email no es valido').isEmail(),
        check('email').custom( emailExiste ),
       // check('rol', 'El rol es obligatorio para el post').not().isEmpty(),
        //check('rol').custom( esRoleValido )
    ], postUser)
    .put('/editar/:id',[
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom( existeUserPorId ),
        check('email', 'El email no es valido').isEmail(),
        check('email').custom( emailExiste ),
        check('password', 'La password es obligatorio para el post').not().isEmpty(),
        check('password', 'La passwarod debe ser mayor a 6 letras').isLength({ min: 6 }),
        check('rol').custom( esRoleValido )
    ], putUser)
    .delete('/eliminar/:id', [
        //validarJWT,
        //esAdminRole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom( existeUserPorId )
    ] ,deleteUser);

module.exports = router;