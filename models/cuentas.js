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
  tipoCuenta: {
    type: String,
    required: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = model('Cuenta', cuentaSchema);