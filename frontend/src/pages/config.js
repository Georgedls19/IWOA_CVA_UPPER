import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Switch,
    FormControlLabel,
    TextField,
    MenuItem,
} from '@mui/material';

const ConfigPage = () => {
    const [settings, setSettings] = useState({
        theme: 'light',
        notifications: true,
        language: 'es',
    });

    const handleSettingChange = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Configuración
            </Typography>

            <Grid container spacing={4}>
                {/* Ajustes Generales */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Ajustes Generales</Typography>
                            <Box mt={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.notifications}
                                            onChange={(e) =>
                                                handleSettingChange('notifications', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Notificaciones"
                                />
                            </Box>
                            <Box mt={2}>
                                <TextField
                                    select
                                    label="Idioma"
                                    value={settings.language}
                                    onChange={(e) =>
                                        handleSettingChange('language', e.target.value)
                                    }
                                    fullWidth
                                >
                                    <MenuItem value="es">Español</MenuItem>
                                    <MenuItem value="en">Inglés</MenuItem>
                                    <MenuItem value="fr">Francés</MenuItem>
                                </TextField>
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="primary">
                                Guardar Cambios
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Personalización */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Personalización</Typography>
                            <Box mt={2}>
                                <TextField
                                    select
                                    label="Tema"
                                    value={settings.theme}
                                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="light">Claro</MenuItem>
                                    <MenuItem value="dark">Oscuro</MenuItem>
                                </TextField>
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="primary">
                                Aplicar
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Gestión de Usuarios */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Gestión de Usuarios</Typography>
                            <Box mt={2}>
                                <Typography variant="body2">
                                    Aquí puedes gestionar permisos y roles de usuarios.
                                </Typography>
                                <Button variant="outlined" sx={{ mt: 2 }}>
                                    Gestionar Usuarios
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ConfigPage;
