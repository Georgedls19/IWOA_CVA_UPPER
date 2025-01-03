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
module.exports = {
    validateLogin,
};
