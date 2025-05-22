import React from 'react';
import { _useTheme } from './context/themeContext';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const ThemeWrapper = ({ children }) => {
    const themeContext = _useTheme();

    // Si el contexto no está disponible (por ejemplo, en el login), usamos 'light' por defecto
    const mode = themeContext?.theme === 'dark' ? 'dark' : 'light';

    const muiTheme = createTheme({
        palette: {
            mode: mode,
        },
    });

    return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
};

export default ThemeWrapper;
