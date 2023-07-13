const { Schema, model } = require('mongoose');

const userSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'The name is required']
  },
  userName: {
    type: String,
    required: [true, 'The nickname is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  Dpi: {
    type: Number,
    required: [true, 'Dpi is required']
  },
  Celular: {
    type: Number,
    required: [true, 'Celular is required']
  },
  direccion: {
    type: String,
    required: [true, 'Direccion is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  NamefromWork: {
    type: String,
    required: [true, 'The work name is required']
  },
  IngresosMensauales: {
    type: Number,
    //srequired: [true, 'Monthly income is required']
  },
  rol: {
    type: String,
    default: 'USER_ROL'
  },
  estado: {
    type: Boolean,
    default: true
  },

});

module.exports = model('User', userSchema);