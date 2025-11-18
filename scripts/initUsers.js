const bcrypt = require('bcrypt');
const db = require('../config/database');

async function initUsers() {
  try {
    console.log('🔐 Inicializando usuarios...');

    // Crear tabla de usuarios si no existe
    await db.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario int(11) NOT NULL AUTO_INCREMENT,
        username varchar(50) NOT NULL UNIQUE,
        password varchar(255) NOT NULL,
        rol enum('administrador','usuario') NOT NULL DEFAULT 'usuario',
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id_usuario)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    console.log('✅ Tabla de usuarios creada/verificada');

    // Verificar si ya existen usuarios
    const [existingUsers] = await db.execute('SELECT COUNT(*) as count FROM usuarios');
    
    if (existingUsers[0].count > 0) {
      console.log('⚠️  Ya existen usuarios en la base de datos. Saltando inserción.');
      return;
    }

    // Hashear passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('usuario123', 10);

    // Insertar usuario administrador
    await db.execute(
      'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)',
      ['admin', adminPassword, 'administrador']
    );

    // Insertar usuario normal
    await db.execute(
      'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)',
      ['usuario', userPassword, 'usuario']
    );

    console.log('✅ Usuarios creados exitosamente:');
    console.log('   👤 Administrador:');
    console.log('      Username: admin');
    console.log('      Password: admin123');
    console.log('   👤 Usuario:');
    console.log('      Username: usuario');
    console.log('      Password: usuario123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia estas contraseñas en producción!');

  } catch (error) {
    console.error('❌ Error inicializando usuarios:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initUsers()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = initUsers;

