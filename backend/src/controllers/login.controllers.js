const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const { pool } = require('../db');

const SECRET_KEY = 'clave_secreta'; // Reemplaza esto con una clave secreta más segura y mantenla en un archivo .env

// Validar inicio de sesión
const validateLogin = async (req, res, next) => {
    try {
        const { correo, clave } = req.body;

        // Verificar si el usuario existe en la base de datos
        const result = await pool.query(
            'SELECT id, nombre, correo FROM usuarios WHERE correo = $1 AND clave = $2',
            [correo, clave]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const usuario = result.rows[0];

        // Generar un token JWT
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo }, // Datos a incluir en el token
            SECRET_KEY, // Clave secreta
            { expiresIn: '1h' } // Tiempo de expiración
        );
        console.log(token);

        res.json({ token });
    } catch (error) {
        console.error("Error en la consulta:", error.message);
        res.status(500).json({ message: 'Error en la conexión a la base de datos' });
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verificar el token
        req.user = decoded; // Adjuntar los datos decodificados a la solicitud
        next(); // Continuar con la siguiente función
    } catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado' });
    }
};


module.exports = {
    validateLogin,
    authenticateToken,
};
