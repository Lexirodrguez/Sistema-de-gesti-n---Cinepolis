const db = require('../config/database');

class Sala {
  static getTableName() {
    return 'sala';
  }

  static getIdField() {
    return 'id_sala';
  }

  // Obtener todas las salas
  static async getAll() {
    const [rows] = await db.execute(
      `SELECT * FROM ${this.getTableName()} ORDER BY ${this.getIdField()} DESC`
    );
    return rows;
  }

  // Obtener sala por ID
  static async getById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM ${this.getTableName()} WHERE ${this.getIdField()} = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear nueva sala
  static async create(salaData) {
    const { nombre_sala, tipo_sala, estado_sala } = salaData;
    
    const [result] = await db.execute(
      `INSERT INTO ${this.getTableName()} (nombre_sala, tipo_sala, estado_sala) VALUES (?, ?, ?)`,
      [nombre_sala, tipo_sala, estado_sala]
    );
    
    return {
      id_sala: result.insertId,
      ...salaData
    };
  }

  // Actualizar sala
  static async update(id, salaData) {
    const { nombre_sala, tipo_sala, estado_sala } = salaData;
    
    const [result] = await db.execute(
      `UPDATE ${this.getTableName()} SET nombre_sala = ?, tipo_sala = ?, estado_sala = ? WHERE ${this.getIdField()} = ?`,
      [nombre_sala, tipo_sala, estado_sala, id]
    );
    
    return result.affectedRows > 0;
  }

  // Eliminar sala
  static async delete(id) {
    const [result] = await db.execute(
      `DELETE FROM ${this.getTableName()} WHERE ${this.getIdField()} = ?`,
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Sala;
