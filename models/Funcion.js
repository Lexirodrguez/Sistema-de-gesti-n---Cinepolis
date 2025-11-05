const db = require('../config/database');

class Funcion {
  static getTableName() {
    return 'funcion';
  }

  static getIdField() {
    return 'id_funcion';
  }

  // Obtener todas las funciones con datos relacionados
  static async getAll() {
    const [rows] = await db.execute(
      `SELECT 
        f.id_funcion,
        f.fechahora_funcion,
        f.estado_funcion,
        f.id_peliculasfuncion,
        f.id_salafuncion,
        f.id_horariofuncion,
        p.titulo_peliculas as titulo_pelicula,
        s.nombre_sala,
        s.tipo_sala,
        h.nombre_horario,
        h.hora_horario
      FROM ${this.getTableName()} f
      LEFT JOIN peliculas p ON f.id_peliculasfuncion = p.id_peliculas
      LEFT JOIN sala s ON f.id_salafuncion = s.id_sala
      LEFT JOIN horario h ON f.id_horariofuncion = h.id_horario
      ORDER BY f.${this.getIdField()} DESC`
    );
    return rows;
  }

  // Obtener función por ID con datos relacionados
  static async getById(id) {
    const [rows] = await db.execute(
      `SELECT 
        f.id_funcion,
        f.fechahora_funcion,
        f.estado_funcion,
        f.id_peliculasfuncion,
        f.id_salafuncion,
        f.id_horariofuncion,
        p.titulo_peliculas as titulo_pelicula,
        s.nombre_sala,
        s.tipo_sala,
        h.nombre_horario,
        h.hora_horario
      FROM ${this.getTableName()} f
      LEFT JOIN peliculas p ON f.id_peliculasfuncion = p.id_peliculas
      LEFT JOIN sala s ON f.id_salafuncion = s.id_sala
      LEFT JOIN horario h ON f.id_horariofuncion = h.id_horario
      WHERE f.${this.getIdField()} = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear nueva función
  static async create(funcionData) {
    const { fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion } = funcionData;
    
    const [result] = await db.execute(
      `INSERT INTO ${this.getTableName()} (fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion) VALUES (?, ?, ?, ?, ?)`,
      [fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion]
    );
    
    return {
      id_funcion: result.insertId,
      ...funcionData
    };
  }

  // Actualizar función
  static async update(id, funcionData) {
    const { fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion } = funcionData;
    
    const [result] = await db.execute(
      `UPDATE ${this.getTableName()} SET fechahora_funcion = ?, estado_funcion = ?, id_peliculasfuncion = ?, id_salafuncion = ?, id_horariofuncion = ? WHERE ${this.getIdField()} = ?`,
      [fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion, id]
    );
    
    return result.affectedRows > 0;
  }

  // Eliminar función
  static async delete(id) {
    const [result] = await db.execute(
      `DELETE FROM ${this.getTableName()} WHERE ${this.getIdField()} = ?`,
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Funcion;
