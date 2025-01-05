const { pool } = require('../db');


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
            return res.status(400).json({ message: 'Existencias insuficientes' });
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
const PromedioEntradas = async (req, res) => {
    try {
        // Consulta para obtener el promedio de la cantidad de entradas en la tabla 'lotes'
        const result = await pool.query(
            `SELECT AVG(cantidad) AS promedio_cantidad FROM movimientos WHERE cantidad > 0 AND tipo_movimiento = 'Entrada'`
        );
        // Validar si el resultado contiene datos
        if (result.rows.length === 0 || !result.rows[0].promedio_cantidad) {
            return res.status(404).json({ message: 'No se encontraron entradas para calcular el promedio' });
        }
        // Devolver el promedio calculado
        res.status(200).json({
            promedio: parseFloat(result.rows[0].promedio_cantidad).toFixed(2),
            message: 'Promedio calculado exitosamente',
        });
        // console.log(result.rows[0].promedio_cantidad, result.rows[0].promedio_cantidad);
    } catch (error) {
        console.error("Error al obtener el promedio de entradas:", error.message);
        res.status(500).json({ message: 'Error en el servidor al obtener el promedio de entradas' });
    }
};

const PromedioSalidas = async (req, res) => {
    try {
        // Consulta para obtener el promedio de la cantidad de salidas en la tabla 'movimientos'
        const result = await pool.query(
            `SELECT AVG(cantidad) AS promedio_cantidad FROM movimientos WHERE cantidad > 0 AND tipo_movimiento = 'Salida'`
        );
        // Validar si el resultado contiene datos
        if (result.rows.length === 0 || !result.rows[0].promedio_cantidad) {
            return res.status(404).json({ message: 'No se encontraron salidas para calcular el promedio' });
        }
        // Devolver el promedio calculado
        res.status(200).json({
            promedio: parseFloat(result.rows[0].promedio_cantidad).toFixed(2),
            message: 'Promedio calculado exitosamente',
        });
        // console.log(result.rows[0].promedio_cantidad, result.rows[0].promedio_cantidad);
    } catch (error) {
        console.error("Error al obtener el promedio de salidas:", error.message);
        res.status(500).json({ message: 'Error en el servidor al obtener el promedio de salidas' });
    }
};

const getEntradasSalidas = async (req, res) => {
    try {
        const query = `
            SELECT 
                TO_CHAR(fecha_movimiento, 'Month') AS mes,
                tipo_movimiento,
                SUM(cantidad) AS total
            FROM movimientos
            GROUP BY mes, tipo_movimiento, DATE_PART('month', fecha_movimiento)
            ORDER BY DATE_PART('month', fecha_movimiento);
        `;
        const result = await pool.query(query);

        // Procesar datos para frontend
        const months = [];
        const entradas = [];
        const salidas = [];

        result.rows.forEach((row) => {
            const monthIndex = months.indexOf(row.mes.trim());
            if (monthIndex === -1) {
                months.push(row.mes.trim());
                entradas.push(row.tipo_movimiento === 'Entrada' ? row.total : 0);
                salidas.push(row.tipo_movimiento === 'Salida' ? row.total : 0);
            } else {
                if (row.tipo_movimiento === 'Entrada') {
                    entradas[monthIndex] = row.total;
                } else if (row.tipo_movimiento === 'Salida') {
                    salidas[monthIndex] = row.total;
                }
            }
        });

        res.json({ months, entradas, salidas });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getLotes = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query; // Manejo de paginación
        const offset = (page - 1) * limit;

        // Consulta a la base de datos con paginación
        const [rows] = await pool.query(
            `SELECT codigo_lote, cliente, cantidad, ubicacion, estado 
             FROM lotes 
             LIMIT ?, ?`,
            [parseInt(offset, 10), parseInt(limit, 10)]
        );

        // Obtener el total de registros
        const [total] = await pool.query(`SELECT COUNT(*) AS count FROM lotes`);

        res.json({
            data: rows,
            total: total[0].count,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los lotes' });
    }
};

module.exports = {
    registrarEntrada,
    registrarSalida,
    registrarTraslado,
    validarLote,
    getAreas,
    getClientes,
    entradaMovimiento,
    PromedioEntradas,
    PromedioSalidas,
    getEntradasSalidas,
    getLotes,
};
