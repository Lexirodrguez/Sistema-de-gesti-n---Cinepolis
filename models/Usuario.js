const db = require('../config/database');

class Usuario {
  // Buscar usuario por username
  static async findByUsername(username) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM usuarios WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuario por ID
  static async findById(id) {
    try {
      // Validar que el ID no sea undefined o null
      if (id === undefined || id === null) {
        return null;
      }

      const [rows] = await db.execute(
        'SELECT id_usuario, username, rol FROM usuarios WHERE id_usuario = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Crear nuevo usuario
  static async create(username, password, rol = 'usuario') {
    try {
      const [result] = await db.execute(
        'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)',
        [username, password, rol]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Usuario;

