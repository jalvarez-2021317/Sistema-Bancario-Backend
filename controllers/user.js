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

const getUsers = async ({ query }, res) => {
  const listaUsers = await Promise.all([
    User.countDocuments(query),
    User.find(query)
  ]);
  res.json({ msg: 'GET API de Users', listaUsers });
};

const postUser = async ({ body }, res) => {
  const salt = bcryptjs.genSaltSync();
  let randomNoCuenta = Math.floor(Math.random() * 5000) + 1;

  let existingUser = await User.findOne({ NoCuenta: randomNoCuenta });
  let attempts = 0;
  const maxAttempts = 10;

  while (existingUser && attempts < maxAttempts) {
    randomNoCuenta = Math.floor(Math.random() * 5000) + 1;
    existingUser = await User.findOne({ NoCuenta: randomNoCuenta });
    attempts++;
  }

  if (existingUser) {
    return res.status(400).json({ error: 'No se pudo generar un número de cuenta único' });
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
