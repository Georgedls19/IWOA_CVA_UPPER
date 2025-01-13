//Se crearan las rutas para las diferentes acciones que se pueden realizar en la aplicación
const { Router } = require('express');
const { validateLogin, authenticateToken } = require('../controllers/login.controllers');
const { registrarEntrada,
    validarLote,
    registrarSalida,
    registrarTraslado,
    getAreas,
    getClientes,
    entradaMovimiento,
    PromedioEntradas,
    PromedioSalidas,
    getEntradasSalidas,
    getLotes,
    getUsuarioAutenticado,
    actualizarUsuario,
    actualizarUsuario_admin,
    getUltimaActividad,
    getUbicaciones,
    getCodigosUbicacionesDisponibles,
    actualizarEstadoUbicacion,
    getStockByLote,
    getReportes,
    getUsuarios,
    crearUsuario,
    eliminarUsuario,
    eliminarFilas,


} = require('../controllers/crud.controllers');
const router = Router();
//se crean las rutas para las diferentes acciones que se pueden realizar en la aplicación
router.post('/validateLogin', validateLogin);
router.post('/almacen/registro-lote', registrarEntrada);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.post('/movimientos', entradaMovimiento);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.post('/usuarios', crearUsuario);// Ruta para obtener todos los usuarios

// consultas de datos
router.get('/areas', getAreas);
router.get('/clientes', getClientes);

router.post('/almacen/registro-salida', registrarSalida);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.post('/traslados', registrarTraslado);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.get('/lotes', validarLote);//El put es para actualizar un usuario, el post es para crear un nuevo usuario, el delete es para eliminar un usuario
router.get('/promedio-entradas', PromedioEntradas);
router.get('/promedio-salidas', PromedioSalidas);
router.get('/entradas-salidas', getEntradasSalidas);
router.get('/api/lotes', getLotes);
router.get('/usuario', authenticateToken, getUsuarioAutenticado);
router.get('/usuarios', getUsuarios);// Ruta para obtener todos los usuarios
router.put('/usuarios/:id', actualizarUsuario);// Ruta para actualizar un usuario
router.put('/usuario', authenticateToken, actualizarUsuario_admin);
router.delete('/usuarios/:id', eliminarUsuario);// Ruta para eliminar un usuario
router.get('/actividades/ultima', getUltimaActividad);
router.get('/ubicaciones', getUbicaciones);
router.get('/ubicaciones/codigos-disponibles', getCodigosUbicacionesDisponibles);
router.put('/ubicaciones/ocupado/:codigo', actualizarEstadoUbicacion);
router.get('/inventario/stock', getStockByLote);
router.get('/stock-summary', getStockByLote);
router.delete('/eliminar-filas', eliminarFilas);


// Ruta para obtener los reportes
router.get('/reportes', getReportes);

// consultas de datos
router.get('/usuarios/actividad', (req, res) => {
    res.json({ message: 'Ruta de actividad de usuarios' });
});
router.get('/ubicaciones', (req, res) => {
    res.json({ message: 'Ruta de actividad de ubicaciones' });
});




module.exports = router;