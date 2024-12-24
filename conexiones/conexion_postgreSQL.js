import pg from 'pg';

const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'cva_bd',
    user: 'postgres',
    password: 'upper02'

});

