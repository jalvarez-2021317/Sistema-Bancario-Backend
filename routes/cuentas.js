const express = require('express');
const { getCuentas, createCuenta, updateCuenta, deleteCuenta } = require('../controllers/cuentas');
const router = express.Router();

// Ruta para obtener todas las cuentas
router.get('/get', getCuentas);

// Ruta para crear una nueva cuenta
router.post('/create', createCuenta);

// Ruta para actualizar una cuenta
router.put('/update/:id', updateCuenta);

// Ruta para eliminar una cuenta
router.delete('/delete/:id', deleteCuenta);

module.exports = router;
