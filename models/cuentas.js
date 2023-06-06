const { Schema, model } = require('mongoose');

const cuentaSchema =  Schema({
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
  TipoCuenta:{
    type: Schema.Types.ObjectId,
    ref: 'TipeCuenta',
  }
});

module.exports = model('Cuenta', cuentaSchema);
