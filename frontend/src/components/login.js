import React, { useState } from 'react';//useState permite manejar estado de componentes
import 'bootstrap/dist/css/bootstrap.min.css';
import '../utils/style.css'; // Asume que tienes este archivo en tu proyecto
import { useNavigate } from 'react-router-dom';

const LoginCrm = () => {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Función para validar formato de correo
    // const isValidEmail = (email) => {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return emailRegex.test(email);
    // };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {//Funcion para enviar datos al servidor
        e.preventDefault();//permite que el formulario no se envie al servidor

        setErrorMessage(''); // Limpiar errores anteriores
        setLoading(true);    // Mostrar mensaje de carga

        // Validación del lado del cliente
        // if (!isValidEmail(correo)) {
        //     setErrorMessage('Por favor, ingresa un correo electrónico válido');
        //     setLoading(false);
        //     return;
        // }

        if (clave.trim() === '') {
            setErrorMessage('La contraseña no puede estar vacía');
            setLoading(false);
            return;
        }

        try {
            // Solicitud al backend
            const response = await fetch('http://localhost:4000/validateLogin', { //fetch permite realizar peticiones al servidor
                method: 'POST',//POST es el método que se utiliza para enviar datos al servidor
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, clave }),//en esta linea de codigo se envía el formulario al servidor
            });

            const data = await response.json();//aqui se obtiene el resultado de la petición

            if (response.ok) {//En este if se verifica si la petición fue exitosa
                // Almacenar el token y redirigir
                localStorage.setItem('token', data.token);
                navigate('/crm');
            } else {
                setErrorMessage(data.message || 'Error de autenticación');
            }
        } catch (error) {
            setErrorMessage('Error de conexión al servidor');
            console.error(error);
        } finally {
            setLoading(false); // Ocultar mensaje de carga
        }
    };

    return (
        <div className="login-wrapper">
            {/* Imagen centrada */}
            <div className="icon-container text-center">
                <img src="../assets/upper_icono." alt="Icono Upper" />   \
            </div>

            {/* Mensaje de bienvenida */}
            <div className="text-welcome text-center">
                <h1>Bienvenido</h1>
                <h3>Ingresa a tu correo electrónico</h3>
            </div>

            {/* Formulario de Login */}
            <div className="login-container">
                <form onSubmit={handleSubmit}>

                    {/* Correo electrónico */}
                    <div className="mb-3">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            className="form-control"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3">

                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="form-control"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                        />
                    </div>

                    {/* Botón de enviar datos */}
                    <div className="d-flex justify-content-center">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}>
                            {loading ? 'Procesando...' : 'Ingresar'}

                        </button>
                    </div>

                    {/* Mensaje de error */}
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
