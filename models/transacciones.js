const { Schema, model } = require('mongoose');

const transaccionSchema = Schema({
  cuentaOrigen: {
    type: String,
    required: true
  },
  cuentaDestino: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Transaccion', transaccionSchema);
