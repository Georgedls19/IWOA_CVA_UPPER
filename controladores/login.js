import { pool } from './conexiones/conexion_postgreSQL.js';
import express from 'express';
import bcrypt from 'bcrypt'; // Si las contraseñas están cifradas

const app = express();
app.use(express.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const query = 'SELECT * FROM usuarios WHERE correo = $1';
        const values = [username];
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const user = rows[0];

        // Si las contraseñas están cifradas, usar bcrypt para compararlas
        const passwordMatch = await bcrypt.compare(password, user.clave);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        // Generar token o manejar sesión (opcional)
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: 'fake-jwt-token' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Inicia el servidor en el puerto 5000
app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});
