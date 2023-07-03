const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const Cuenta = require('../models/cuentas');

const createAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ role: "ADMIN_ROLE" }).maxTimeMS(20000);
    if (!adminUser) {
      const salt = bcryptjs.genSaltSync();
      const userData = {
        nombre: "ADMINB",
        userName: "ADMINB",
        password: bcryptjs.hashSync("ADMINB", salt),
        Dpi: 1234567890123,
        Celular: 12345678,
        email: "admin@example.com",
        role: "ADMIN_ROLE"
      };

      const userDB = new User(userData);
      await userDB.save();
      console.log('Usuario administrador creado automáticamente');
    } else {
      console.log('Ya existe un usuario administrador en la base de datos');
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
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

// Resto del código del controlador...

const postUser = async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync();

    const existingUser = await User.findOne({ userName: req.body.userName });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    if (req.body.IngresosMensauales < 100) {
      return res.status(400).json({ error: 'Los ingresos mensuales deben ser mayores o iguales a 100' });
    }

    const userData = {
      ...req.body,
      password: bcryptjs.hashSync(req.body.password, salt)
    };

    const userDB = new User(userData);
    await userDB.save();

    let randomNoCuenta;
    let existingCuenta;

    do {
      randomNoCuenta = Math.floor(Math.random() * 90000) + 10000; // Generar un número de cuenta aleatorio de 5 dígitos
      existingCuenta = await Cuenta.findOne({ noCuenta: randomNoCuenta });
    } while (existingCuenta);

    const cuentaData = {
      saldo: req.body.IngresosMensauales,
      userId: userDB._id,
      usuario: userDB._id,
      noCuenta: randomNoCuenta.toString() // Asignar el número de cuenta aleatorio
    };

    const cuentaDB = new Cuenta(cuentaData);
    await cuentaDB.save();

    if (userDB.NoCuenta) {
      userDB.NoCuenta.push(cuentaDB._id);
    } else {
      userDB.NoCuenta = [cuentaDB._id];
    }
    await userDB.save();

    res.status(201).json({ msg: 'POST API de User', user: userDB });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};


const putUser = async ({ params, body }, res) => {
  const user = await User.findById(params.id);

  if (user.userName !== body.userName) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const allowedFields = ['password', 'email'];
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
};

const deleteUser = async ({ params }, res) => {
  const UserEliminado = await User.findByIdAndDelete(params.id);
  res.json({ msg: 'DELETE API de User', UserEliminado });
};

const getUsersByUserRole = async ({ query }, res) => {
  const listaUsers = await User.find({ role: "USER_ROL", ...query });
  res.json({ msg: 'GET API de Users con USER_ROLE', listaUsers });
};

module.exports = {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  createAdminUser,
  getUsersByUserRole
};
