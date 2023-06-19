const { Router } = require('express');
const { getTransacciones, postTransaccion,  deleteTransaccion } = require('../controllers/Transaccion');

const router = Router();

router.get('/ver', getTransacciones);
router.post('/New', postTransaccion);
router.delete('/transacciones/:id', deleteTransaccion);

module.exports = router;