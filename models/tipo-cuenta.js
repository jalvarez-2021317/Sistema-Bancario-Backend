const { Schema, model } = require('mongoose');

const TipeCuentaSchema = Schema({
    TipeCuenta: {
        type: String,
        required: [true, 'El TipeCuenta es obligatorio']
    }
});

module.exports = model('TipeCuenta', TipeCuentaSchema);