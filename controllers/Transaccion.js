const { response, request } = require('express');
const  Transaccion = require('../models/transacciones');
const Cuenta = require('../models/cuentas');


const getTransacciones = async (req, res) => {
  const transacciones = await Transaccion.find();
  res.json(transacciones);
};

const postTransaccion = async (req, res) => {

  const newTransaccion = new Transaccion({
    cuentaOrigen: req.body.cuentaOrigen,
    cuentaDestino: req.body.cuentaDestino,
    monto: req.body.monto,
    fecha: req.body.fecha
  });

  // Check if the source account has enough balance
  const cuentaOrigenInfo = await Cuenta.findById(req.body.cuentaOrigen);
  if (cuentaOrigenInfo.saldo < req.body.monto) {
    return res.status(400).json({ error: 'No hay saldo suficiente en la cuenta origen' });
  }

  // Subtract the amount from the source account
  await Cuenta.findByIdAndUpdate(req.body.cuentaOrigen, {
    $inc: { saldo: -req.body.monto }
  });

  // Increase the amount from the destination account
  await Cuenta.findByIdAndUpdate(req.body.cuentaDestino, {
    $inc: { saldo: req.body.monto }
  });

  await newTransaccion.save();
  res.json(newTransaccion);
};



const deleteTransaccion = async (req, res) => {
  const transaccion = await Transaccion.findByIdAndRemove(req.params.id);
  if (!transaccion) {
    return res.status(404).json({ error: 'Transaccion no encontrada' });
  }

  res.json({ success: true });
};

module.exports = {
  getTransacciones,
  postTransaccion,
  deleteTransaccion
};
