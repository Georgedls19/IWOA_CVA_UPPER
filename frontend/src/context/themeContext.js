import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(null); // null mientras carga

    // useEffect
    useEffect(() => {


        const fetchTheme = async () => {//Funcion para la que se obtiene el tema del usuario
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:4000/configuracion/tema', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setTheme(data.modo);
                } else {
                    setTheme('light'); //fallback si falla
                    toast.error("No se encontró el tema del usuario");
                }
            } catch (err) {
                console.error("Error al cargar el tema:", err);
                setTheme('light'); //fallback
            }
        };
        fetchTheme();
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const applyTheme = async (newTheme) => {
        const token = localStorage.getItem('token');
        try {
            await fetch('http://localhost:4000/tema', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ theme: newTheme }),
            });
            toast.info('Tema actualizado correctamente');
            setTheme(newTheme);
        } catch (error) {
            console.error("Error al aplicar el tema:", error);
        }
    };

    if (!theme) return <div>Cargando tema...</div>; // <- evita que toda la app quede en blanco

    return (
        <ThemeContext.Provider value={{ theme, applyTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


export const useTheme = () => useContext(ThemeContext);

