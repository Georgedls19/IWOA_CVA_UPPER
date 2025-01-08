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
        <Container maxWidth="sm" sx={{ mt: 4 }}>
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
