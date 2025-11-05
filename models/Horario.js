const db = require('../config/database');

class Horario {
  static getTableName() {
    return 'horario';
  }

  static getIdField() {
    return 'id_horario';
  }

  // Obtener todos los horarios
  static async getAll() {
    const [rows] = await db.execute(
      `SELECT * FROM ${this.getTableName()} ORDER BY ${this.getIdField()} DESC`
    );
    return rows;
  }

  // Obtener horario por ID
  static async getById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM ${this.getTableName()} WHERE ${this.getIdField()} = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear nuevo horario
  static async create(horarioData) {
    const { nombre_horario, hora_horario } = horarioData;
    
    const [result] = await db.execute(
      `INSERT INTO ${this.getTableName()} (nombre_horario, hora_horario) VALUES (?, ?)`,
      [nombre_horario, hora_horario]
    );
    
    return {
      id_horario: result.insertId,
      ...horarioData
    };
  }

  // Actualizar horario
  static async update(id, horarioData) {
    const { nombre_horario, hora_horario } = horarioData;
    
    const [result] = await db.execute(
      `UPDATE ${this.getTableName()} SET nombre_horario = ?, hora_horario = ? WHERE ${this.getIdField()} = ?`,
      [nombre_horario, hora_horario, id]
    );
    
    return result.affectedRows > 0;
  }

  // Eliminar horario
  static async delete(id) {
    const [result] = await db.execute(
      `DELETE FROM ${this.getTableName()} WHERE ${this.getIdField()} = ?`,
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Horario;
