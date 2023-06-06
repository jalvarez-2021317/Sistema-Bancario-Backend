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
      Dpi: 1234567890123,
      Celular: 1234567890,
      email: "admin@example.com",
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

const getUsers = async ({ query }, res) => {
  const listaUsers = await Promise.all([
    User.countDocuments(query),
    User.find(query)
  ]);
  res.json({ msg: 'GET API de Users', listaUsers });
};

const postUser = async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync();

    const existingUser = await User.findOne({ NoCuenta: req.body.NoCuenta });
    if (existingUser) {
      return res.status(400).json({ error: 'El número de cuenta ya está en uso' });
    }

    const cuenta = new Cuenta({
      noCuenta: req.body.NoCuenta,
      saldo: 0
    });
    await cuenta.save();

    const userData = {
      ...req.body,
      password: bcryptjs.hashSync(req.body.password, salt),
      NoCuenta: cuenta._id
    };

    const userDB = new User(userData);
    await userDB.save();
    res.status(201).json({ msg: 'POST API de User', userDB });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};


const putUser = async ({ params, body }, res) => {
  const allowedFields = ['nombre', 'userName', 'password', 'email'];
  const updates = {};

  for (const field of allowedFields) {
    if (body[field]) {
      updates[field] = body[field];
    }
  }

  const salt = bcryptjs.genSaltSync();
  updates.password = bcryptjs.hashSync(body.password, salt);

  const UserEditado = await User.findByIdAndUpdate(params.id, updates);
  res.json({ msg: 'PUT API de User', UserEditado });
};

const deleteUser = async ({ params }, res) => {
  const UserEliminado = await User.findByIdAndDelete(params.id);
  res.json({ msg: 'DELETE API de User', UserEliminado });
};

module.exports = {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  createAdminUser
};
