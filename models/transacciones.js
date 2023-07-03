const { Schema, model } = require('mongoose');

const transaccionSchema = Schema({
  cuentaOrigen: {
    type: Schema.Types.ObjectId,
    ref: 'Cuenta',
    required: true
  },
  cuentaDestino: {
    type: Schema.Types.ObjectId,
    ref: 'Cuenta',
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