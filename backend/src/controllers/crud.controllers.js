
const { pool } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Registrar una nueva entrada
const registrarEntrada = async (req, res) => {
    try {
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
            cantidad,
        } = req.body;

        if (!codigo_lote || !estado || !cantidad) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Verificar si el lote ya existe
        const loteExistente = await pool.query(
            'SELECT * FROM lotes WHERE codigo_lote = $1',
            [codigo_lote]
        );

        if (loteExistente.rows.length > 0) {
            return res.status(409).json({ message: 'El código de lote ya existe en la base de datos' });
        }

        // Insertar nuevo lote
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
                cantidad,
            ]
        );

        res.status(201).json({
            message: 'Entrada registrada con éxito',
            entrada: result.rows[0],
        });
    } catch (error) {
        console.error('Error al registrar entrada:', error.message);
        res.status(500).json({ message: 'Error en el servidor al registrar la entrada' });
    }
};
// Registrar una nueva salida
const registrarSalida = async (req, res) => {
    try {
        const { codigo_lote, cantidad, cliente_id, fecha, observaciones } = req.body;

        // Verificar si se proporcionaron todos los datos necesarios
        if (!codigo_lote || !cantidad || !cliente_id || !fecha) {
            return res.status(400).json({ message: 'Faltan datos obligatorios.' });
        }

        // Verificar si el lote existe
        const loteExistente = await pool.query("SELECT cantidad FROM lotes WHERE codigo_lote = $1", [codigo_lote]);
        if (loteExistente.rows.length === 0) {
            return res.status(404).json({ message: 'El lote no existe.' });
        }

        const stockActual = loteExistente.rows[0].cantidad;

        // Verificar si el stock es suficiente para realizar la salida
        if (stockActual < cantidad) {
            return res.status(400).json({
                message: `Stock insuficiente. Cantidad disponible: ${stockActual}, cantidad solicitada: ${cantidad}.`,
            });
        }

        // Registrar el movimiento de salida
        await pool.query(
            `INSERT INTO movimientos (lote_id, tipo_movimiento, descripcion, cantidad, responsable, fecha_movimiento)
             VALUES ($1, 'Salida', $2, $3, $4, $5)`,
            [codigo_lote, observaciones || 'Registro de salida', cantidad, req.user?.nombre || 'Desconocido', fecha]
        );

        // Actualizar el stock del lote
        await pool.query(
            "UPDATE lotes SET cantidad = cantidad - $1 WHERE codigo_lote = $2",
            [cantidad, codigo_lote]
        );

        res.status(201).json({ message: 'Salida registrada exitosamente.' });
    } catch (error) {
        console.error('Error al registrar salida:', error.message);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};
// Registrar un traslado
const registrarTraslado = async (req, res) => {
    const { codigo_lote, ubicacion_origen, ubicacion_destino, cantidad, observaciones, responsable } = req.body;

    try {
        // Verificar si el lote existe
        const lote = await pool.query(
            `SELECT * FROM lotes WHERE codigo_lote = $1`,
            [codigo_lote]
        );

        if (lote.rowCount === 0) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // Verificar que la ubicación de origen coincida
        if (lote.rows[0].ubicacion !== ubicacion_origen) {
            return res.status(400).json({ message: 'La ubicación de origen no coincide con la ubicación actual del lote' });
        }

        // Actualizar estado de las ubicaciones
        await pool.query(
            `UPDATE ubicaciones SET ocupado = false WHERE codigo = $1`,
            [ubicacion_origen]
        );
        await pool.query(
            `UPDATE ubicaciones SET ocupado = true WHERE codigo = $1`,
            [ubicacion_destino]
        );

        // Actualizar la ubicación del lote
        const updatedLote = await pool.query(
            `UPDATE lotes SET ubicacion = $1 WHERE codigo_lote = $2::text RETURNING *`,
            [ubicacion_destino, codigo_lote]
        );

        // Solo enviar una respuesta
        return res.status(201).json({
            message: "Traslado registrado exitosamente",
            updatedLote: updatedLote.rows[0]
        });

    } catch (error) {
        console.error("Error al registrar el traslado:", error.message);

        // Solo enviar una respuesta de error
        return res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
    }
};
const validarLote = async (req, res) => {
    try {
        const { codigo_lote } = req.query;

        if (!codigo_lote) {
            return res.status(400).json({ message: 'El código de lote es obligatorio.' });
        }

        const result = await pool.query("SELECT * FROM lotes WHERE codigo_lote = $1", [codigo_lote]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'El lote no existe' });
        }

        res.status(200).json(result.rows[0]); // Devuelve el lote encontrado
    } catch (error) {
        console.error("Error al buscar el lote:", error.message);
        res.status(500).json({ message: "Error en el servidor al buscar el lote" });
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
const getUltimaActividad = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                u.nombre AS usuario,
                m.tipo_movimiento AS accion,
                m.fecha_movimiento AS fecha
             FROM movimientos m
             LEFT JOIN usuarios u ON m.responsable = u.id
             WHERE m.tipo_movimiento IN ('Entrada', 'Salida', 'Traslado')
             ORDER BY m.fecha_movimiento DESC
             LIMIT 1`
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No hay actividades registradas" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener la última actividad:", error.message);
        res.status(500).json({ message: "Error en el servidor al obtener la última actividad" });
    }
};

const getUbicaciones = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.id, 
                u.codigo, 
                u.ocupado, 
                u.seccion, 
                u.fila, 
                u.casilla, 
                u.posicion,
                l.modelo_sku AS sku,
                l.codigo_lote,
                l.proyecto
            FROM ubicaciones u
            LEFT JOIN lotes l ON u.codigo = l.ubicacion
            ORDER BY u.seccion, u.fila, u.casilla, u.posicion
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener ubicaciones:', error.message);
        res.status(500).json({ message: 'Error al obtener ubicaciones' });
    }
};
const getCodigosUbicacionesDisponibles = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT codigo 
            FROM ubicaciones
            WHERE ocupado = false
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los códigos de ubicaciones disponibles:', error.message);
        res.status(500).json({ message: 'Error al obtener los códigos de ubicaciones disponibles' });
    }
};

const actualizarEstadoUbicacion = async (req, res) => {
    try {
        const { codigo } = req.params; // Obtiene el código de la ubicación desde los parámetros
        const { ocupado } = req.body; // Obtiene el estado "ocupado" del cuerpo de la solicitud

        if (ocupado === undefined) {
            return res.status(400).json({ message: 'Falta el estado "ocupado"' });
        }

        const result = await pool.query(
            `UPDATE ubicaciones 
             SET ocupado = $1 
             WHERE codigo = $2 
             RETURNING *`,
            [ocupado, codigo]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Ubicación no encontrada' });
        }

        res.status(200).json({
            message: 'Estado de la ubicación actualizado con éxito',
            ubicacion: result.rows[0],
        });
    } catch (error) {
        console.error('Error al actualizar el estado de la ubicación:', error.message);
        res.status(500).json({ message: 'Error al actualizar el estado de la ubicación' });
    }
};

const getStockByLote = async (req, res) => {
    try {
        const query = `
            SELECT 
                lote_id,
                SUM(CASE WHEN tipo_movimiento = 'Entrada' THEN cantidad ELSE 0 END) AS total_entradas,
                SUM(CASE WHEN tipo_movimiento = 'Salida' THEN cantidad ELSE 0 END) AS total_salidas,
                SUM(CASE WHEN tipo_movimiento = 'Entrada' THEN cantidad ELSE 0 END) -
                SUM(CASE WHEN tipo_movimiento = 'Salida' THEN cantidad ELSE 0 END) AS stock_actual
            FROM 
                movimientos
            GROUP BY 
                lote_id
            ORDER BY 
                lote_id;
        `;
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No hay datos de lotes disponibles" });
        }

        res.json({
            data: result.rows,
            message: 'Datos de inventario obtenidos con éxito'
        });
    } catch (error) {
        console.error("Error al obtener los datos de inventario:", error.message);
        res.status(500).json({ message: 'Error al obtener los datos de inventario' });
    }
};
const getReportes = async (req, res) => {
    try {
        // Consulta para obtener todos los movimientos
        const query = `
            SELECT lote_id, fecha_movimiento, tipo_movimiento, descripcion, cantidad, responsable
            FROM movimientos;
        `;
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron movimientos' });
        }

        res.status(200).json({
            data: result.rows,
            message: 'Reportes obtenidos con éxito'
        });
    } catch (error) {
        console.error('Error al obtener reportes:', error.message);
        res.status(500).json({ message: 'Error en el servidor al obtener los reportes' });
    }
};
const getMovimientos = async (req, res) => {

    try {
        const query = `
            SELECT lote_id, fecha_movimiento, tipo_movimiento, descripcion, cantidad, responsable
            FROM movimientos;
        `;
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No hay movimientos disponibles" });
        }

        res.json({
            data: result.rows,
            message: 'Movimientos obtenidos con éxito'
        });
    } catch (error) {
        console.error("Error al obtener los movimientos:", error.message);
        res.status(500).json({ message: 'Error al obtener los movimientos' });
    }
};
const getsettings = async (req, res) => {
    //en esta funcion se obtendran todos los nombre de las areas
    try {
        //consulta que obtendra las columnas de los nombres
        const result = await pool.query(
            'SELECT modo FROM usuarios Where id = $1',
            [req.user.id]
        );
        //Aqui se muestran todos los nombres de las areas
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Error" });
    }
}
const putsettings = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE usuarios SET modo = $1 WHERE id= $2',
            [req.body.theme, req.user.id]
        );

        console.log(result.rows);
        // Solo una respuesta
        return res.status(200).json({ message: "Tema actualizado correctamente" });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "Error del servidor" });
    }
};


// const getUsuarios = async (req, res) => {
//     try {
//         const result = await pool.query('SELECT id, nombre, correo, rol FROM usuarios ORDER BY id');
//         //obtener el rol del usuario
//         const rolUsuario = await pool.query('SELECT rol FROM usuarios WHERE id = $1', [req.user.id]);
//         result.rows.forEach((row) => {
//             row.rol = rolUsuario.rows[0].rol;
//         });


//         res.status(200).json(result.rows); // Asegúrate de devolver `result.rows`, que es un arreglo
//     } catch (error) {
//         console.error('Error al obtener usuarios:', error.message);
//         res.status(500).json({ message: 'Error al obtener usuarios' });
//     }
// };

const getUsuarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, correo, rol FROM usuarios ORDER BY id');
        res.status(200).json(result.rows); // Asegúrate de devolver `result.rows`, que es un arreglo
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};
// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
    try {
        const { nombre, correo, clave, rol } = req.body;

        if (!nombre || !correo || !clave || !rol) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Verificar si el correo ya está registrado
        const existeUsuario = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        if (existeUsuario.rows.length > 0) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(clave, 10);

        const result = await pool.query(
            'INSERT INTO usuarios (nombre, correo, clave, rol) VALUES ($1, $2, $3, $4) RETURNING  nombre, correo,clave, rol',
            [nombre, correo, clave, rol]
        );

        res.status(201).json({
            message: 'Usuario creado con éxito',
            usuario: result.rows[0],
        });
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};
// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};
//
const getUsuarioAutenticado = async (req, res) => {
    try {
        const { id } = req.user; // Extraer el ID del usuario del token decodificado
        const result = await pool.query(
            'SELECT id, correo, nombre, rol FROM usuarios WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error.message);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, clave, rol } = req.body;

        if (!id || !nombre || !correo || !rol) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Construcción dinámica de la consulta
        let query = 'UPDATE usuarios SET nombre = $1, correo = $2, rol = $3';
        const values = [nombre, correo, rol];
        let index = 4; // Índice para los parámetros adicionales

        if (clave) {
            const hashedPassword = await bcrypt.hash(clave, 10);
            query += `, clave = $${index}`;
            values.push(hashedPassword);
            index++;
        }

        query += ` WHERE id = $${index} RETURNING id, nombre, correo, rol`;
        values.push(id);

        // Ejecutar la consulta
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({
            message: 'Usuario actualizado con éxito',
            usuario: result.rows[0],
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

const actualizarUsuario_admin = async (req, res) => {
    try {
        const { id } = req.user; // ID del usuario autenticado
        const { correo, clave, nombre, claveAntigua } = req.body;

        if (!correo || !nombre) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Validar la contraseña antigua si se proporciona una nueva contraseña
        if (clave) {
            const usuario = await pool.query('SELECT clave FROM usuarios WHERE id = $1', [id]);

            if (usuario.rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            // Comparar la contraseña antigua proporcionada con la almacenada
            const claveValida = await bcrypt.compare(claveAntigua, usuario.rows[0].clave);

            if (!claveValida) {
                return res.status(400).json({ message: 'La contraseña antigua es incorrecta.' });
            }

            // Hashear la nueva contraseña antes de guardarla
            const nuevaClaveHasheada = await bcrypt.hash(clave, 10);

            const result = await pool.query(
                'UPDATE usuarios SET correo = $1, clave = $2, nombre = $3 WHERE id = $4 RETURNING *',
                [correo, nuevaClaveHasheada, nombre, id]
            );

            return res.status(200).json({
                message: 'Usuario actualizado con éxito.',
                usuario: result.rows[0],
            });
        } else {
            const result = await pool.query(
                'UPDATE usuarios SET correo = $1, nombre = $2 WHERE id = $3 RETURNING *',
                [correo, nombre, id]
            );

            return res.status(200).json({
                message: 'Usuario actualizado con éxito.',
                usuario: result.rows[0],
            });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error.message);
        res.status(500).json({ message: 'Error en el servidor al actualizar el usuario.' });
    }
};
const eliminarFilas = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron IDs válidos para eliminar' });
        }

        // Inicia una transacción
        await pool.query('BEGIN');

        // Obtener las ubicaciones asociadas a los lotes que se eliminarán
        const ubicacionesQuery = await pool.query(
            `SELECT DISTINCT ubicacion FROM lotes WHERE codigo_lote = ANY($1)`,
            [ids]
        );

        const ubicaciones = ubicacionesQuery.rows.map((row) => row.ubicacion);

        // Eliminar filas de la tabla "movimientos"
        const movimientosResult = await pool.query(
            `DELETE FROM movimientos WHERE lote_id = ANY($1)`,
            [ids]
        );

        // Eliminar filas de la tabla "lotes"
        const lotesResult = await pool.query(
            `DELETE FROM lotes WHERE codigo_lote = ANY($1)`,
            [ids]
        );

        // Actualizar las ubicaciones asociadas a "disponible" (ocupado: false)
        await pool.query(
            `UPDATE ubicaciones SET ocupado = false WHERE codigo = ANY($1)`,
            [ubicaciones]
        );

        // Confirma la transacción
        await pool.query('COMMIT');

        res.status(200).json({
            message: 'Filas eliminadas y ubicaciones actualizadas con éxito',
            eliminados: {
                movimientos: movimientosResult.rowCount,
                lotes: lotesResult.rowCount,
            },
        });

    } catch (error) {
        // Revierte la transacción en caso de error
        await pool.query('ROLLBACK');
        console.error('Error al eliminar filas:', error.message);
        res.status(500).json({ message: 'Error en el servidor al eliminar filas' });
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
    getUsuarioAutenticado,
    actualizarUsuario,
    actualizarUsuario_admin,
    getUltimaActividad,
    getUbicaciones,
    getCodigosUbicacionesDisponibles,
    actualizarEstadoUbicacion,
    getStockByLote,
    getReportes,
    getMovimientos,
    getUsuarios,
    crearUsuario,
    eliminarUsuario,
    eliminarFilas,
    getsettings,
    putsettings,
}
