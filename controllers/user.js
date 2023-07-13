const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const createAdminUser = async () => {
  const adminUser = await User.findOne({ rol: "ADMIN_ROLE" });
  if (!adminUser) {
    const salt = bcryptjs.genSaltSync();
    const userData = {
      nombre: "ADMINB",
      userName: "ADMINB",
      password: bcryptjs.hashSync("ADMINB", salt),
      Dpi: 1234567890123,
      Celular: 12345678,
      direccion: "Stret 2",
      NamefromWork: "Admin",
      email: "admin@example.com",
      rol: "ADMIN_ROLE"
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
  try {
    const listaUsers = await User.find(query);
    res.json({ msg: 'GET API de Users', listaUsers });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

const postUser = async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync();
    const existingUser = await User.findOne({ userName: req.body.userName });
    
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    const userData = {
      ...req.body,
      password: bcryptjs.hashSync(req.body.password, salt),
      NoCuenta: null
    };

    const userDB = new User(userData);
    await userDB.save();
    res.status(201).json({ msg: 'POST API de User', userDB });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

const putUser = async ({ params, body }, res) => {
  try {
    const user = await User.findById(params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.userName !== body.userName) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const allowedFields = ['password', 'email', 'nombre', 'Dpi', 'Celular', 'direccion', 'NamefromWork', 'IngresosMensauales'];
    const updates = {};

    for (const field of allowedFields) {
      if (body[field]) {
        updates[field] = body[field];
      }
    }

    const salt = bcryptjs.genSaltSync();
    updates.password = bcryptjs.hashSync(body.password, salt);

    await User.findByIdAndUpdate(params.id, updates);
    res.json({ msg: 'PUT API de User', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userEliminado = await User.findByIdAndDelete(req.params.id);

    if (!userEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ msg: 'DELETE API de User', userEliminado });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

const getUsersByUserRole = async ({ query }, res) => {
  try {
    const listaUsers = await User.find({ rol: "USER_ROL", ...query });
    res.json({ msg: 'GET API de Users con USER_ROLE', listaUsers });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios con USER_ROLE' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
};

module.exports = {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  createAdminUser,
  getUsersByUserRole,
  getUserById
};
