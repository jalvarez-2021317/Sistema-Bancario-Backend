const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    // Validar si el token se envía en los headers
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición',
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);

        // Leer al User que corresponde al uid
        const User = await User.findById(uid);

        // Verificar el uid del User, si no existiera
        if (!User) {
            return res.status(401).json({
                msg: 'Token no válido - User no existe en la base de datos',
            });
        }

        // Verificar si el User está activo (estado: true)
        if (!User.estado) {
            return res.status(401).json({
                msg: 'Token no válido - User inactivo: estado FALSE',
            });
        }

        req.User = User;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido',
            error: error.message,
        });
    }
};

module.exports = {
    validarJWT,
};