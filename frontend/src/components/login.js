import React, { useState } from 'react';
import { Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../utils/style.css';
import { useNavigate } from 'react-router-dom';
import logoUpper from '../assets/upper_icono.png';
import { useTheme } from '@mui/material/styles';
const LoginCrm = () => {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage(''); // Limpiar errores anteriores
        setLoading(true);    // Mostrar mensaje de carga

        if (correo.trim() === '' || clave.trim() === '') {//trim elimina espacios en blanco al principia y final
            setErrorMessage('Por favor, complete todos los campos');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/validateLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, clave }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/crm');
            } else {
                if (data.message?.includes('Error en la conexión')) {
                    setErrorMessage('Error al conectar con la base de datos. Intente más tarde.');
                } else if (data.message?.includes('Usuario o contraseña incorrectos')) {

                    setErrorMessage('El usuario no existe o las credenciales son incorrectas.');
                } else {
                    setErrorMessage(data.message || 'Error de autenticación.');
                }
            }
        } catch (error) {
            setErrorMessage('Error de conexión con el servidor. Verifique su red e intente de nuevo.');
            console.error(error);
        } finally {
            setLoading(false); // Ocultar mensaje de carga
        }
    };

    return (
        <div

            className="wrapper">
            <span className="bg-animate"></span>
            <div className="form-box login">
                <div className="logo-container">
                    <img src={logoUpper} alt="Logo_UPPER" />
                </div>

                <h2>Bienvenido</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                        <label>Email</label>
                    </div>

                    <div className="input-box">
                        <input
                            type="password"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                        />
                        <label>Password</label>
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Ingresar'}
                    </button>

                    {/* Mensaje de error debajo del botón */}
                    {errorMessage && (
                        <div className="mt-3 text-center text-danger">
                            {errorMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LoginCrm;
