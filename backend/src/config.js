const { config } = require('dotenv');/*cargas de paquete para llamar a variable de Entorno*/
config();/*cargas de paquete para llamar a variable de Entorno*/

// console.log(process.env.HELLO);// se llama la variable de entorno */
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
module.exports = {
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,

    },
};



