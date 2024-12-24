const express = require('express'); /*Este paquete es el que se utiliza para crear el servidor web*/
const morgan = require('morgan'); /*Este paquete es el que se utiliza para registrar las peticiones en el servidor web*/
const cors = require('cors'); /*Este paquete es el que se utiliza para permitir las peticiones desde otros dominios*/

const taskRoutes = require('./routes/taskRoutes');

const app = express(); /*Este es el objeto que se utiliza para crear el servidor web*/
app.use(cors());//*Permite conectar los servidores de diferentes dominios
app.use(morgan('dev'));//Opcion para visualizar las peticiones en consola
app.use(express.json()); //El framework de expresss podra leer objetos json


app.use(taskRoutes);/**/    //rutas de las tareas
app.use((err, req, res, next) => {//Este middleware se encarga de manejar errores
    return res.json({
        message: err.message
    });
});

app.listen(4000);
console.log("Server started on port 4000");