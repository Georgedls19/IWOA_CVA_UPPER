// src/themes.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f5f5f5',
            paper: '#ffffff', // Para menús, tarjetas, etc.
        },
        text: {
            primary: '#000000',
            secondary: '#333333',
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1e1e1e', // Para menús, tarjetas, etc.
        },
        text: {
            primary: '#ffffff',
            secondary: '#cccccc',
        },
    },
});
