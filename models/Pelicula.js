const db = require('../config/database');

class Pelicula {
  static getTableName() {
    return 'peliculas';
  }

  static getIdField() {
    return 'id_peliculas';
  }

  // Obtener todas las películas
  static async getAll() {
    const [rows] = await db.execute(
      `SELECT * FROM ${this.getTableName()} ORDER BY ${this.getIdField()} DESC`
    );
    return rows;
  }

  // Obtener película por ID
  static async getById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM ${this.getTableName()} WHERE ${this.getIdField()} = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear nueva película
  static async create(peliculaData) {
    const { titulo_peliculas, duracion_peliculas, año_peliculas } = peliculaData;
    
    const [result] = await db.execute(
      `INSERT INTO ${this.getTableName()} (titulo_peliculas, duracion_peliculas, año_peliculas) VALUES (?, ?, ?)`,
      [titulo_peliculas, duracion_peliculas, año_peliculas]
    );
    
    return {
      id_peliculas: result.insertId,
      ...peliculaData
    };
  }

  // Actualizar película
  static async update(id, peliculaData) {
    const { titulo_peliculas, duracion_peliculas, año_peliculas } = peliculaData;
    
    const [result] = await db.execute(
      `UPDATE ${this.getTableName()} SET titulo_peliculas = ?, duracion_peliculas = ?, año_peliculas = ? WHERE ${this.getIdField()} = ?`,
      [titulo_peliculas, duracion_peliculas, año_peliculas, id]
    );
    
    return result.affectedRows > 0;
  }

  // Eliminar película
  static async delete(id) {
    const [result] = await db.execute(
      `DELETE FROM ${this.getTableName()} WHERE ${this.getIdField()} = ?`,
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Pelicula;
