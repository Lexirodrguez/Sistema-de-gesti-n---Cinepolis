const db = require('../config/database');

class Pelicula {
  // Obtener todas las películas
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM peliculas ORDER BY id_peliculas DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener películas: ${error.message}`);
    }
  }

  // Obtener película por ID
  static async getById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM peliculas WHERE id_peliculas = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener película: ${error.message}`);
    }
  }

  // Crear nueva película
  static async create(peliculaData) {
    const { titulo_peliculas, duracion_peliculas, año_peliculas } = peliculaData;
    
    try {
      const [result] = await db.execute(
        'INSERT INTO peliculas (titulo_peliculas, duracion_peliculas, año_peliculas) VALUES (?, ?, ?)',
        [titulo_peliculas, duracion_peliculas, año_peliculas]
      );
      
      return {
        id_peliculas: result.insertId,
        titulo_peliculas,
        duracion_peliculas,
        año_peliculas
      };
    } catch (error) {
      throw new Error(`Error al crear película: ${error.message}`);
    }
  }

  // Actualizar película
  static async update(id, peliculaData) {
    const { titulo_peliculas, duracion_peliculas, año_peliculas } = peliculaData;
    
    try {
      const [result] = await db.execute(
        'UPDATE peliculas SET titulo_peliculas = ?, duracion_peliculas = ?, año_peliculas = ? WHERE id_peliculas = ?',
        [titulo_peliculas, duracion_peliculas, año_peliculas, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al actualizar película: ${error.message}`);
    }
  }

  // Eliminar película
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM peliculas WHERE id_peliculas = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al eliminar película: ${error.message}`);
    }
  }

}

module.exports = Pelicula;