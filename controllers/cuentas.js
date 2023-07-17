const { response, request } = require('express');
const Cuenta = require('../models/cuentas');
const User = require('../models/user');

// Obtener todas las cuentas
const getCuentas = async (req, res) => {
  try {
    const cuentas = await Cuenta.find();
    res.json({ msg: 'GET API de Cuentas', cuentas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las cuentas' });
  }
};

// Obtener todas las cuentas vinculadas a un usuario
const getCuentasByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const cuentas = await Cuenta.find({ usuario: usuarioId });
    res.json({ msg: 'GET API de Cuentas por Usuario', cuentas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las cuentas del usuario' });
  }
};

// Crear una nueva cuenta
const createCuenta = async (req, res) => {
  try {
    let randomNoCuenta;
    let existingCuenta;

    do {
      randomNoCuenta = Math.floor(Math.random() * 9000000000) + 1000000000;
      existingCuenta = await Cuenta.findOne({ noCuenta: randomNoCuenta });
    } while (existingCuenta);

    const cuentaData = {
      noCuenta: randomNoCuenta.toString(),
      tipoCuenta: req.body.tipoCuenta,
      saldo: req.body.saldo,
      usuario: req.body.usuario // Asignamos el usuario asociado a la cuenta
    };

    const cuentaDB = new Cuenta(cuentaData);
    await cuentaDB.save();

    // Agregamos la cuenta creada al usuario correspondiente
    await User.findByIdAndUpdate(req.body.usuario, { $push: { cuentas: cuentaDB._id } });

    res.status(201).json({ msg: 'POST API de Cuenta', cuentaDB });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
};

// Actualizar una cuenta
const updateCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const cuentaData = req.body;

    const cuentaActualizada = await Cuenta.findByIdAndUpdate(id, cuentaData, { new: true });

    if (!cuentaActualizada) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    res.json({ msg: 'PUT API de Cuenta', cuentaActualizada });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cuenta' });
  }
};

// Eliminar una cuenta
const deleteCuenta = async (req, res) => {
  try {
    const { id } = req.params;

    const cuentaEliminada = await Cuenta.findByIdAndDelete(id);

    if (!cuentaEliminada) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    res.json({ msg: 'DELETE API de Cuenta', cuentaEliminada });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la cuenta' });
  }
};

const getCuentasDelUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const cuentas = await Cuenta.find({ usuario: usuarioId });
    const numerosDeCuenta = cuentas.map((cuenta) => cuenta.noCuenta);
    res.json({ msg: 'GET API de Cuentas por Usuario', numerosDeCuenta });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las cuentas del usuario' });
  }
};

module.exports = {
  getCuentas,
  getCuentasByUsuario,
  createCuenta,
  updateCuenta,
  deleteCuenta,
  getCuentasDelUsuario
};
