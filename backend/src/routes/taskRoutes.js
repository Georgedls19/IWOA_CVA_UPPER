//Se crearan las rutas para las diferentes acciones que se pueden realizar en la aplicación
const { Router } = require('express');
const { validateLogin } = require('../controllers/login.controllers');
const { registrarEntrada, validarLote, registrarSalida, registrarTraslado, getAreas, getClientes, entradaMovimiento, PromedioEntradas, PromedioSalidas, getEntradasSalidas, getLotes } = require('../controllers/crud.controllers');
const router = Router();
//se crean las rutas para las diferentes acciones que se pueden realizar en la aplicación
router.post('/validateLogin', validateLogin);
router.post('/almacen/registro-lote', registrarEntrada);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.post('/movimientos', entradaMovimiento);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario


// consultas de datos
router.get('/areas', getAreas);
router.get('/clientes', getClientes);

router.post('/almacen/registro-salida', registrarSalida);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.post('/almacen/registro-traslado', registrarTraslado);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.get('/lotes', validarLote);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.get('/promedio-entradas', PromedioEntradas);
router.get('/promedio-salidas', PromedioSalidas);
router.get('/entradas-salidas', getEntradasSalidas);
router.get('/api/lotes', getLotes);
//

module.exports = router;