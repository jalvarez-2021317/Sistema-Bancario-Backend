const { Router } = require('express');
const { getTransacciones, postTransaccion,  deleteTransaccion, getTransaccionesPorCuenta, getTransaccionesPorUsuario } = require('../controllers/Transaccion');

const router = Router();

router.get('/ver', getTransacciones);
router.post('/New', postTransaccion);
router.delete('/transacciones/:id', deleteTransaccion);
// Ruta para obtener todas las transacciones de una cuenta específica
router.get('/cuentas/:cuentaId/transacciones',getTransaccionesPorCuenta);
router.get('/user/:id', getTransaccionesPorUsuario)
router.get('/usuarios/:usuarioId/transacciones',getTransaccionesPorUsuario);

module.exports = router;