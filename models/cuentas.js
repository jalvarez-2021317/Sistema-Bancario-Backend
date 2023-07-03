const { Schema, model } = require('mongoose');

const cuentaSchema = Schema({
  noCuenta: {
    type: String,
    required: true
  },
  saldo: {
    type: Number,
    default: 100
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipoCuenta: {
    type: Schema.Types.ObjectId,
    ref: 'TipoCuenta'
  }
});

module.exports = model('Cuenta', cuentaSchema);
