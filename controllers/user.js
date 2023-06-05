const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');


const createAdminUser = async () => {
    const adminUser = await User.findOne({ role: "Administrador" });
    if (!adminUser) {
      const salt = bcryptjs.genSaltSync();
      const userData = {
        nombre: "ADMINB",
        userName: "ADMINB",
        password: bcryptjs.hashSync("ADMINB", salt),
        NoCuenta: "123456789",
        Dpi: 1234567890123,
        Celular: 1234567890,
        email: "admin@example.com",
        IngresosMensauales: 5000,
        role: "Administrador"
      };
  
      const userDB = new User(userData);
      await userDB.save();
      console.log('Usuario administrador creado automáticamente');
    } else {
      console.log('Ya existe un usuario administrador en la base de datos');
    }
  };
  
  // Llama a la función para crear el usuario administrador al iniciar el proyecto
  createAdminUser();

const getUsers = async ({query}, res) => {
    const listaUsers = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);
    res.json({msg: 'GET API de Users', listaUsers});
}

const postUser = async ({ body }, res) => {
  const salt = bcryptjs.genSaltSync();
  const randomNoCuenta = Math.floor(Math.random() * 5000) + 1;

  // Verificar si ya existe un usuario con el mismo NoCuenta
  const existingUser = await User.findOne({ NoCuenta: randomNoCuenta });
  if (existingUser) {
    // Si existe, generar otro número de cuenta único
    return postUser({ body }, res);
  }

  const userData = {
    ...body,
    password: bcryptjs.hashSync(body.password, salt),
    NoCuenta: randomNoCuenta
  };

  const userDB = new User(userData);
  await userDB.save();
  res.status(201).json({ msg: 'POST API de User', userDB });
};


const putUser = async ({params, body}, res) => {
    const salt = bcryptjs.genSaltSync();
    const UserEditado = await User.findByIdAndUpdate(params.id, {...body, password: bcryptjs.hashSync(body.password, salt)});
    res.json({msg: 'PUT API de User', UserEditado});
}

const deleteUser = async ({params}, res) => {
    const UserEliminado = await User.findByIdAndDelete(params.id);
    res.json({msg: 'DELETE API de User', UserEliminado});
}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser,
    createAdminUser
}