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
            ubicacion,
            estado,
            no_fabricante,
            no_serie,
            modelo_sku,
            proyecto,
            cliente,
            area,
            no_proyecto,
            fecha_recepcion,
            cantidad
        } = req.body;

        // Validación básica para los campos principales
        if (!codigo_lote || !estado || !cantidad) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Llamar a la función SQL con todos los datos
        const result = await pool.query(
            `INSERT INTO lotes (
                codigo_lote,                
                ubicacion,
                estado,
                no_fabricante,
                no_serie,
                modelo_sku,
                proyecto,
                cliente,
                area,
                no_proyecto,            
                fecha_recepcion,
                cantidad
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [
                codigo_lote,
                ubicacion,
                estado,
                no_fabricante,
                no_serie,
                modelo_sku,
                proyecto,
                cliente,
                area,
                no_proyecto,
                fecha_recepcion,
                cantidad
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

        // Validar que todos los datos requeridos estén presentes
        if (!codigo_lote || !cantidad || !cliente_id || !fecha) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Verificar si el lote existe y tiene suficiente cantidad
        const loteResult = await pool.query(
            'SELECT * FROM lotes WHERE codigo_lote = $1',
            [codigo_lote]
        );

        if (loteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        const lote = loteResult.rows[0];

        if (lote.cantidad < cantidad) {
            return res.status(400).json({ message: 'Cantidad insuficiente en el lote' });
        }

        // Registrar la salida en la tabla de movimientos
        const movimientoResult = await pool.query(
            `INSERT INTO movimientos (
                lote_id, fecha_movimiento, tipo_movimiento, descripcion, cantidad, responsable
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                lote.id, // Se usa el ID del lote
                fecha,
                'Salida',
                observaciones || 'Registro de salida',
                cantidad,
                cliente_id // Puede ser usado como responsable o un campo específico
            ]
        );

        // Actualizar la cantidad en la tabla de lotes
        const actualizarLoteResult = await pool.query(
            'UPDATE lotes SET cantidad = cantidad - $1 WHERE id = $2 RETURNING *',
            [cantidad, lote.id]
        );

        // Responder con el resultado
        res.status(201).json({
            message: 'Salida registrada con éxito',
            movimiento: movimientoResult.rows[0],
            loteActualizado: actualizarLoteResult.rows[0],
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
        res.json(result.rows[0]); //Aqui se devuelve el lote
    } catch (error) {
        console.error("Error al buscar el lote:", error.message);
        res.status(500).json({ message: "Error al buscar el lote" });
    }
};

const getAreas = async (req, res) => {
    //en esta funcion se obtendran todos los nombre de las areas
    try {
        //consulta que obtendra las columnas de los nombres
        const result = await pool.query(
            'SELECT * FROM areas'
        );
        //Aqui se muestran todos los nombres de las areas
        res.json(result.rows);

    } catch (error) {
        console.error("Error al buscar las areas:", error.message);
        res.status(500).json({ message: "Error al buscar las areas" });
    }
};

const getClientes = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM clientes'
        );
        res.json(result.rows);

    } catch (error) {
        console.error("Error al buscar los clientes:", error.message);
        res.status(500).json({ message: "Error al buscar los clientes" });
    }
};

const entradaMovimiento = async (req, res) => {
    try {
        const { lote_id, fecha_movimiento, tipo_movimiento, descripcion, cantidad, responsable } = req.body;

        if (!lote_id || !cantidad || !responsable || !tipo_movimiento || !fecha_movimiento) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const result = await pool.query(
            `INSERT INTO movimientos (
                lote_id,                
                fecha_movimiento,
                tipo_movimiento,
                descripcion,
                cantidad,
                responsable
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                lote_id,
                fecha_movimiento,
                tipo_movimiento,
                descripcion,
                cantidad,
                responsable
            ]


        );

        res.status(201).json({
            message: 'Entrada movimiento registrada con a',
            result: result.rows[0],
        });
    } catch (error) {
        console.error("Error al registrar entrada movimiento:", error.message);
        res.status(500).json({ message: 'Error en el servidor al registrar la entrada movimiento' });
    }


};

module.exports = {
    validateLogin,
    registrarEntrada,
    registrarSalida,
    registrarTraslado,
    validarLote,
    getAreas,
    getClientes,
    entradaMovimiento,

};
