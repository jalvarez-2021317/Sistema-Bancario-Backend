const { response, request } = require('express');
const Transaccion = require('../models/transacciones');
const Cuenta = require('../models/cuentas');

const getTransaccionesPorCuenta = async (req, res) => {
  const noCuenta = req.params.noCuenta;
  try {
    // Obtener todas las transacciones relacionadas con la cuenta específica
    const transacciones = await Transaccion.find({
      $or: [
        { cuentaOrigen: { $eq: noCuenta } },
        { cuentaDestino: { $eq: noCuenta } }
      ]
    });
    
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las transacciones de la cuenta' });
  }
};

const getTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.find();
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las transacciones' });
  }
};

const postTransaccion = async (req, res) => {
  const { cuentaOrigen, cuentaDestino, monto, fecha } = req.body;

  const newTransaccion = new Transaccion({
    cuentaOrigen,
    cuentaDestino,
    monto,
    fecha
  });

  // Check if the amount exceeds the limit
  if (monto > 10000) {
    return res.status(400).json({ error: 'Las transferencias deben ser menores a 10,000' });
  }

  try {
    // Check if the source account has enough balance
    const cuentaOrigenInfo = await Cuenta.findOne({ noCuenta: cuentaOrigen });
    if (!cuentaOrigenInfo || cuentaOrigenInfo.saldo < monto) {
      return res.status(400).json({ error: 'No hay saldo suficiente en la cuenta origen' });
    }

    // Subtract the amount from the source account
    await Cuenta.findOneAndUpdate({ noCuenta: cuentaOrigen }, { $inc: { saldo: -monto } });

    // Increase the amount in the destination account
    await Cuenta.findOneAndUpdate({ noCuenta: cuentaDestino }, { $inc: { saldo: monto } });

    // Save the new transaction
    await newTransaccion.save();

    res.json(newTransaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al realizar la transacción' });
  }
};

const deleteTransaccion = async (req, res) => {
  const transaccionId = req.params.id;

  try {
    const transaccion = await Transaccion.findByIdAndRemove(transaccionId);
    if (!transaccion) {
      return res.status(404).json({ error: 'Transaccion no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la transacción' });
  }
};

// Controlador de transacciones
const getTransaccionesPorUsuario = async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    // Buscar las cuentas asociadas al usuario
    const cuentas = await Cuenta.find({ usuario: usuarioId });

    // Obtener los números de cuenta asociados al usuario
    const numerosCuenta = cuentas.map(cuenta => cuenta.noCuenta);

    // Buscar las transacciones que tengan la cuenta de origen o destino asociada al usuario
    const transacciones = await Transaccion.find({
      $or: [
        { cuentaOrigen: { $in: numerosCuenta } },
        { cuentaDestino: { $in: numerosCuenta } }
      ]
    });

    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las transacciones del usuario' });
  }
};

module.exports = {
  getTransaccionesPorCuenta,
  getTransacciones,
  postTransaccion,
  deleteTransaccion,
  getTransaccionesPorUsuario
};
