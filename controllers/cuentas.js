const { response, request } = require('express');
const Cuenta = require('../models/cuentas');

// Obtener todas las cuentas
const getCuentas = async (req, res) => {
  try {
    const cuentas = await Cuenta.find();
    res.json({ msg: 'GET API de Cuentas', cuentas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las cuentas' });
  }
};

// Crear una nueva cuenta
const createCuenta = async (req, res) => {
  try {
    let randomNoCuenta;
    let existingCuenta;

    do {
      randomNoCuenta = Math.floor(Math.random() * 60000) + 1;
      existingCuenta = await Cuenta.findOne({ noCuenta: randomNoCuenta });
    } while (existingCuenta);

    const cuentaData = {
      noCuenta: randomNoCuenta.toString(),
    };

    const cuentaDB = new Cuenta(cuentaData);
    await cuentaDB.save();

    res.status(201).json({ msg: 'POST API de Cuenta', cuentaDB });
  } catch (error) {
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

module.exports = {
  getCuentas,
  createCuenta,
  updateCuenta,
  deleteCuenta
};
