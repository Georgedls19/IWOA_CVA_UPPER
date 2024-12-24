const { pool } = require('../db');

// Validar inicio de sesión
const validateLogin = async (req, res, next) => {
    try {
        const { correo, clave } = req.body;

        const result = await pool.query(
            'SELECT * FROM usuarios WHERE correo = $1 AND clave = $2',
            [correo, clave]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        } else {
            res.json({ token: result.rows[0].id });
        }
    } catch (error) {
        console.error("Error en la consulta:", error.message);
        res.status(500).json({ message: 'Error en la conexión a la base de datos' });
    }
};

// Registrar una nueva entrada
const registrarEntrada = async (req, res) => {
    try {
        // Extraer todos los datos enviados en el cuerpo de la solicitud
        const {
            codigo_lote,
            fecha_recepcion,
            ubicacion_id,
            estado,
            fabricante_id,
            numero_serie,
            modelo_sku,
            proyecto,
            numero_proyecto,
            cliente,
            cantidad,
            area_id,
            cliente_id,
        } = req.body;

        // Validación básica para los campos principales
        if (!codigo_lote || !fecha_recepcion || !ubicacion_id || !estado || !cantidad) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Llamar a la función SQL con todos los datos
        const result = await pool.query(
            `INSERT INTO lotes (
                codigo_lote,
                fecha_recepcion,
                ubicacion_id,
                estado,
                no_fabricante,
                no_serie,
                modelo_sku,
                proyecto,
                no_proyecto,
                cliente,
                cantidad,
                area_id,
                cliente_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
            [
                codigo_lote,
                fecha_recepcion,
                ubicacion_id,
                estado,
                fabricante_id,
                numero_serie,
                modelo_sku,
                proyecto,
                numero_proyecto,
                cliente,
                cantidad,
                area_id,
                cliente_id,
            ]
        );

        // Devolver respuesta exitosa con todos los detalles
        res.status(201).json({
            message: 'Entrada registrada con éxito',
            entrada: result.rows[0],
        });
    } catch (error) {
        console.error("Error al registrar entrada:", error.message);
        res.status(500).json({ message: 'Error en el servidor al registrar la entrada' });
    }
};


// Registrar una nueva salida
const registrarSalida = async (req, res) => {
    try {
        const { codigo_lote, cantidad, cliente_id, fecha, observaciones } = req.body;

        if (!codigo_lote || !cantidad || !cliente_id || !fecha) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const result = await pool.query(
            `SELECT registrar_salida($1, $2, $3, $4, $5)`,
            [codigo_lote, cantidad, cliente_id, fecha, observaciones || null]
        );

        res.status(201).json({
            message: 'Salida registrada con éxito',
            result: result.rows[0],
        });
    } catch (error) {
        console.error("Error al registrar salida:", error.message);
        res.status(500).json({ message: 'Error en el servidor al registrar la salida' });
    }
};

// Registrar un traslado
const registrarTraslado = async (req, res) => {
    try {
        const { codigo_lote, cantidad, ubicacion_origen, ubicacion_destino, fecha, responsable } = req.body;

        if (!codigo_lote || !cantidad || !ubicacion_origen || !ubicacion_destino || !fecha) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const result = await pool.query(
            `SELECT registrar_traslado($1, $2, $3, $4, $5, $6)`,
            [codigo_lote, cantidad, ubicacion_origen, ubicacion_destino, fecha, responsable || null]
        );

        res.status(201).json({
            message: 'Traslado registrado con éxito',
            result: result.rows[0],
        });
    } catch (error) {
        console.error("Error al registrar traslado:", error.message);
        res.status(500).json({ message: 'Error en el servidor al registrar el traslado' });
    }
};

const validarLote = async (req, res) => {
    try {
        const { codigo_lote } = req.query;
        const result = await pool.query("SELECT * FROM lotes WHERE codigo_lote = $1", [codigo_lote]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Lote no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al buscar el lote:", error.message);
        res.status(500).json({ message: "Error al buscar el lote" });
    }
};

module.exports = {
    validateLogin,
    registrarEntrada,
    registrarSalida,
    registrarTraslado,
    validarLote,
};
