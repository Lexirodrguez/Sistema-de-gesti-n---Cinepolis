const mysql = require('mysql2');

// Crear pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cinepolis',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convertir a promises para usar async/await
const promisePool = pool.promise();

// Probar la conexión
promisePool.getConnection()
  .then(connection => {
    console.log('✅ Conectado a la base de datos Cinepolis');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Error conectando a la base de datos:', error.message);
  });

module.exports = promisePool;