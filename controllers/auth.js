const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });

        if (!user) return res.status(404).json({ msg: 'userName de User no existe en la base de datos 404' });
        if (!user.estado) return res.status(400).json({ msg: 'La cuenta del User está inactiva' });

        const validarPassword = bcryptjs.compareSync(password, user.password);
        if (!validarPassword) return res.status(400).json({ msg: 'La contraseña es incorrecta' });

        const token = await generarJWT(user.id);
     

        res.json({  
            nombre: user.nombre,
            rol: user.rol,
            userName, password,
            token 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json
        ({ msg: 'Hable con el admin' });
    }
};

const register = async (req = request, res = response) => {
    const { userName, password } = req.body;

    try {
        // Verificar si el User ya existe
        const UserExistente = await User.findOne({ userName });
        if (UserExistente) {
            return res.status(400).json({ msg: 'El userName ya está registrado' });
        }

        const User = new User(req.body);

        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        User.password = bcryptjs.hashSync(password, salt);

        // Guardar en la base de datos
        await User.save();

        // Generar JWT
        const token = await generarJWT(User.id);

        res.json({ msg: '¡Registro exitoso!', userName, password, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hable con el admin' });
    }
};


module.exports = { login, register };

