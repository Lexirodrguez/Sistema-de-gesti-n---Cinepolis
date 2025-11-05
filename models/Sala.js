const db = require('../config/database');

class Sala {
  // Obtener todas las salas
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM sala ORDER BY id_sala DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener salas: ${error.message}`);
    }
  }

  // Obtener sala por ID
  static async getById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM sala WHERE id_sala = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener sala: ${error.message}`);
    }
  }

  // Crear nueva sala
  static async create(salaData) {
    const { nombre_sala, tipo_sala, estado_sala } = salaData;
    
    try {
      const [result] = await db.execute(
        'INSERT INTO sala (nombre_sala, tipo_sala, estado_sala) VALUES (?, ?, ?)',
        [nombre_sala, tipo_sala, estado_sala]
      );
      
      return {
        id_sala: result.insertId,
        nombre_sala,
        tipo_sala,
        estado_sala
      };
    } catch (error) {
      throw new Error(`Error al crear sala: ${error.message}`);
    }
  }

  // Actualizar sala
  static async update(id, salaData) {
    const { nombre_sala, tipo_sala, estado_sala } = salaData;
    
    try {
      const [result] = await db.execute(
        'UPDATE sala SET nombre_sala = ?, tipo_sala = ?, estado_sala = ? WHERE id_sala = ?',
        [nombre_sala, tipo_sala, estado_sala, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al actualizar sala: ${error.message}`);
    }
  }

  // Eliminar sala
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM sala WHERE id_sala = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al eliminar sala: ${error.message}`);
    }
  }
}

module.exports = Sala;

