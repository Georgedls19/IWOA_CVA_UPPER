import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Card, CardContent, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const UserProfile = ({ user, actualizarPerfil }) => {
    const [formData, setFormData] = useState({ correo: '', clave: '', nombre: '', claveAntigua: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setFormData({ correo: user.correo, clave: '', nombre: user.nombre, claveAntigua: '' });
            setLoading(false);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verificar que si se desea cambiar la clave, la clave antigua sea proporcionada
            if (formData.clave && !formData.claveAntigua) {
                toast.error("Por favor, ingresa tu contraseña antigua.");
                return;
            }

            // Llamar al backend para actualizar el perfil
            await actualizarPerfil(formData);
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            toast.error("Error al actualizar el perfil.");
        }
    };

    return (
        <Container sx={{
            padding: '2rem',
            margin: '1rem auto',
            width: '60%',
            maxWidth: '1200px',
        }}
        >
            <Box><Typography
                variant="h5"
                gutterBottom
                sx={{
                    marginBottom: '1rem',
                    color: '#2c3e50', // Color elegante y profesional
                    fontWeight: 'bold', // Texto más prominente
                    letterSpacing: '0.2em', // Espaciado para darle más estilo
                    textTransform: 'uppercase', // Todo en mayúsculas para un encabezado llamativo
                    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', // Sombra suave para mayor impacto                    
                    background: 'black', // Gradiente suave
                    WebkitBackgroundClip: 'text', // Usamos el gradiente como color del texto
                    WebkitTextFillColor: 'transparent', // Hacemos que el fondo rellene el texto
                }}

            >Perfil</Typography></Box>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom color='black'>
                        Editar Perfil
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
                            <TextField
                                name="correo"
                                label="Correo"
                                value={formData.correo}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                name="nombre"
                                label="Nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                name="claveAntigua"
                                label="Contraseña Antigua"
                                type="password"
                                value={formData.claveAntigua}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="clave"
                                label="Nueva Contraseña"
                                type="password"
                                value={formData.clave}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 1, mb: 2 }}
                                // disabled={!formData.nombre || !formData.apellido || !formData.email || !formData.clave}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserProfile;
