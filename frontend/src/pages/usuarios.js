import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Card, CardContent, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const UserProfile = ({ user, actualizarPerfil }) => {
    const [formData, setFormData] = useState({ correo: '', clave: '', nombre: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setFormData({ correo: user.correo, clave: '', nombre: user.nombre });
            setLoading(false);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        actualizarPerfil(formData);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
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
                                name="clave"
                                label="Nueva Clave"
                                type="password"
                                value={formData.clave}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Guardar Cambios
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
