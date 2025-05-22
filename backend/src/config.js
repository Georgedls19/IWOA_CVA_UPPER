const path = require('path');
const { config } = require('dotenv');

config({
    path: path.resolve(__dirname, '../../.env'), // Ajusta al .env en raíz
});



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



