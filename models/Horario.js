const db = require('../config/database');

class Horario {
  // Obtener todos los horarios
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM horario ORDER BY id_horario DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener horarios: ${error.message}`);
    }
  }

  // Obtener horario por ID
  static async getById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM horario WHERE id_horario = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener horario: ${error.message}`);
    }
  }

  // Crear nuevo horario
  static async create(horarioData) {
    const { nombre_horario, hora_horario } = horarioData;
    
    try {
      const [result] = await db.execute(
        'INSERT INTO horario (nombre_horario, hora_horario) VALUES (?, ?)',
        [nombre_horario, hora_horario]
      );
      
      return {
        id_horario: result.insertId,
        nombre_horario,
        hora_horario
      };
    } catch (error) {
      throw new Error(`Error al crear horario: ${error.message}`);
    }
  }

  // Actualizar horario
  static async update(id, horarioData) {
    const { nombre_horario, hora_horario } = horarioData;
    
    try {
      const [result] = await db.execute(
        'UPDATE horario SET nombre_horario = ?, hora_horario = ? WHERE id_horario = ?',
        [nombre_horario, hora_horario, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al actualizar horario: ${error.message}`);
    }
  }

  // Eliminar horario
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM horario WHERE id_horario = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al eliminar horario: ${error.message}`);
    }
  }
}

module.exports = Horario;




