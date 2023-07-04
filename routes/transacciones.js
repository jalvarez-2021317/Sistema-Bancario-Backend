const { Router } = require('express');
const { getTransacciones, postTransaccion,  deleteTransaccion } = require('../controllers/Transaccion');

const router = Router();

router.get('/ver', getTransacciones);
router.post('/New', postTransaccion);
router.delete('/transacciones/:id', deleteTransaccion);
// Ruta para obtener todas las transacciones de una cuenta específica
router.get('/cuentas/:cuentaId/transacciones', transaccionController.getTransaccionesPorCuenta);

module.exports = router;