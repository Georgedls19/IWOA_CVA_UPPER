import React, { useState } from 'react'; // useState permite manejar el estado de los componentes
import 'bootstrap/dist/css/bootstrap.min.css';
import '../utils/style.css'; // Asume que tienes este archivo en tu proyecto
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.svg";
const LoginCrm = () => {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página

        setErrorMessage(''); // Limpiar errores anteriores
        setLoading(true); // Mostrar mensaje de carga

        if (clave.trim() === '') {
            setErrorMessage('La contraseña no puede estar vacía');
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
        <div>
            <div align="center">
                <img
                    src={Logo}
                    alt="Upper Logistics - Sistema de Gestión"
                    style={{
                        height: '40px', // Ajusta el tamaño del logo según sea necesario
                        cursor: 'pointer',
                    }}
                    marginBottom="2rem"
                />
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
                            disabled={loading}
                        >
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
