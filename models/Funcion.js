const db = require('../config/database');

class Funcion {
	// Obtener todas las funciones
	static async getAll() {
		try {
			const [rows] = await db.execute('SELECT * FROM funcion ORDER BY id_funcion DESC');
			return rows;
		} catch (error) {
			throw new Error(`Error al obtener funciones: ${error.message}`);
		}
	}

	// Obtener funcion por ID
	static async getById(id) {
		try {
			const [rows] = await db.execute(
				'SELECT * FROM funcion WHERE id_funcion = ?',
				[id]
			);

			if (rows.length === 0) {
				return null;
			}

			return rows[0];
		} catch (error) {
			throw new Error(`Error al obtener funcion: ${error.message}`);
		}
	}

	// Crear nueva funcion
	static async create(funcionData) {
		const { fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion } = funcionData;
		try {
			const [result] = await db.execute(
				'INSERT INTO funcion (fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion) VALUES (?, ?, ?, ?, ?)',
				[fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion]
			);

			return {
				id_funcion: result.insertId,
				fechahora_funcion,
				estado_funcion,
				id_peliculasfuncion,
				id_salafuncion,
				id_horariofuncion
			};
		} catch (error) {
			throw new Error(`Error al crear funcion: ${error.message}`);
		}
	}

	// Actualizar funcion
	static async update(id, funcionData) {
		const { fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion } = funcionData;
		try {
			const [result] = await db.execute(
				'UPDATE funcion SET fechahora_funcion = ?, estado_funcion = ?, id_peliculasfuncion = ?, id_salafuncion = ?, id_horariofuncion = ? WHERE id_funcion = ?',
				[fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion, id]
			);

			return result.affectedRows > 0;
		} catch (error) {
			throw new Error(`Error al actualizar funcion: ${error.message}`);
		}
	}

	// Eliminar funcion
	static async delete(id) {
		try {
			const [result] = await db.execute(
				'DELETE FROM funcion WHERE id_funcion = ?',
				[id]
			);

			return result.affectedRows > 0;
		} catch (error) {
			throw new Error(`Error al eliminar funcion: ${error.message}`);
		}
	}
}

module.exports = Funcion;
