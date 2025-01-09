import React, { useState, useEffect } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    IconButton,

} from '@mui/material';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
const ConfigPage = () => {
    const [settings, setSettings] = useState({
        theme: 'light',
        notifications: true,
        language: 'es',
    });

    const [openUserModal, setOpenUserModal] = useState(false); // Estado para el modal
    const [users, setUsers] = useState([]); // Lista de usuarios
    const [newUser, setNewUser] = useState({
        nombre: '',
        correo: '',
        clave: '',
        rol: '',
    }); // Estado para el nuevo usuario
    const [showCreateUserForm, setShowCreateUserForm] = useState(false); // Estado para mostrar/ocultar el formulario
    const [editUser, setEditUser] = useState(null); // Estado para el usuario que se edita
    const handleSettingChange = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        if (editUser) {
            setEditUser((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewUser((prev) => ({ ...prev, [name]: value }));
        }
    };
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/usuarios');
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setUsers([]);
        }
    };
    const handleAddUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el usuario.');
            }

            toast.success('Usuario creado con éxito');
            setNewUser({ nombre: '', correo: '', clave: '', rol: '' });
            setShowCreateUserForm(false);
            fetchUsers();
        } catch (error) {
            console.error('Error al agregar usuario:', error);
            toast.error(error.message);
        }
    };
    const handleEditUser = async () => {
        try {
            const response = await fetch(`http://localhost:4000/usuarios/${editUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al editar el usuario.');
            }

            toast.success('Usuario actualizado con éxito');
            setEditUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error al editar usuario:', error);
            toast.error(error.message);
        }
    };
    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/usuarios/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el usuario.');
            }

            toast.success('Usuario eliminado con éxito');
            fetchUsers();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box
            sx={{
                padding: '2rem',
                margin: '1rem auto',
                width: '60%',
                maxWidth: '1200px',
            }}


        >
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    color: '#2c3e50', // Color elegante y profesional
                    fontWeight: 'bold', // Texto más prominente
                    letterSpacing: '0.2em', // Espaciado para darle más estilo
                    textTransform: 'uppercase', // Todo en mayúsculas para un encabezado llamativo
                    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', // Sombra suave para mayor impacto                    
                    background: 'black', // Gradiente suave
                    WebkitBackgroundClip: 'text', // Usamos el gradiente como color del texto
                    WebkitTextFillColor: 'transparent', // Hacemos que el fondo rellene el texto
                    marginLeft: '1rem',
                    marginBottom: '2rem',
                }}

            >
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenUserModal(true)}
                                >
                                    Gestionar Usuarios
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Modal para Gestión de Usuarios */}
            <Modal
                open={openUserModal}
                onClose={() => setOpenUserModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 800,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h5" mb={2}>
                        Gestión de Usuarios
                    </Typography>
                    { /* Aqui se mostrará el formulario para crear nuevos usuarios */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenUserModal(false)}
                        sx={{ mb: 2 }}
                    >
                        Cerrar
                    </Button>
                    { /* Aquí se mostrará la tabla de usuarios */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Correo</TableCell>
                                    <TableCell>Rol</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.nombre}</TableCell>
                                        <TableCell>{user.correo}</TableCell>
                                        <TableCell>{user.rol}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                sx={{ mr: 1 }}
                                                onClick={() => setEditUser(user)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {editUser && (
                        <Box component="form" sx={{ mt: 3, position: 'relative', border: '1px solid #ccc', borderRadius: '8px', padding: 2 }}>
                            <IconButton
                                sx={{ position: 'absolute', top: '-1px', right: '8px' }} // Ajustar posición del botón "X"
                                onClick={() => setEditUser(null)}
                            >
                                <CloseIcon />
                            </IconButton>
                            <TextField
                                name="nombre"
                                label="Nombre"
                                value={editUser.nombre}
                                onChange={handleUserInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="correo"
                                label="Correo"
                                value={editUser.correo}
                                onChange={handleUserInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="rol"
                                label="Rol"
                                value={editUser.rol}
                                onChange={handleUserInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Box sx={{ mt: 3, textAlign: 'right' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEditUser}
                                >
                                    Guardar Cambios
                                </Button>
                            </Box>
                        </Box>
                    )}


                    { /* Aqui se crear el formulario para crear nuevos usuarios */}
                    <Box mt={3}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setShowCreateUserForm((prev) => !prev)}
                        >
                            {showCreateUserForm ? 'Ocultar Formulario' : 'Crear Nuevo Usuario'}
                        </Button>
                    </Box>
                    {showCreateUserForm && (
                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                name="nombre"
                                label="Nombre"
                                value={newUser.nombre}
                                onChange={handleUserInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                name="correo"
                                label="Correo"
                                value={newUser.correo}
                                onChange={handleUserInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                name="clave"
                                label="Contraseña"
                                type="password"
                                value={newUser.clave}
                                onChange={handleUserInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                select
                                name="rol"
                                label="Rol"
                                value={newUser.rol}
                                onChange={handleUserInputChange}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="admin">Administrador</MenuItem>
                                <MenuItem value="user">Usuario</MenuItem>
                            </TextField>
                            <Box sx={{ mt: 3, textAlign: 'right' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddUser}
                                >
                                    Crear Usuario
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>


        </Box>
    );
};

export default ConfigPage;
