// hooks/useDatos.js
import { useState } from 'react';
import axios from 'axios';

export const useDatos = () => {
    const [datos, setDatos] = useState([]);
    const obtenerDatos = async () => {
        try {
            const respuesta = await axios.get('http://localhost:4000/stock-summary');
            setDatos(respuesta.data.data);
        } catch (error) {
            console.error('Error al obtener datos:', error.message);
        }
    };
    return { datos, obtenerDatos };
};
