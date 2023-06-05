const { Schema, model } = require('mongoose');

const cuentaSchema =  Schema({
  noCuenta: {
    type: String,
    required: true
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  saldo: {
    type: Number,
    default: 0
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Cuenta', cuentaSchema);
