const Pelicula = require('../models/Pelicula');

class PeliculaController {
  // GET /api/peliculas - Obtener todas las películas
  static getAll() {
    return new Promise((resolve, reject) => {
      Pelicula.getAll()
        .then(peliculas => {
          resolve(peliculas);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // GET /api/peliculas/:id - Obtener una película por ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      // Validación de negocio
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de película inválido'));
        return;
      }

      Pelicula.getById(id)
        .then(pelicula => {
          if (!pelicula) {
            reject(new Error('Película no encontrada'));
            return;
          }
          resolve(pelicula);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // POST /api/peliculas - Crear una nueva película
  static create(peliculaData) {
    return new Promise((resolve, reject) => {
      // Lógica de negocio: validaciones
      const { titulo_peliculas, duracion_peliculas, año_peliculas } = peliculaData;
      
      if (!titulo_peliculas || titulo_peliculas.trim() === '') {
        reject(new Error('El título es requerido'));
        return;
      }
      
      if (!duracion_peliculas || duracion_peliculas <= 0) {
        reject(new Error('La duración debe ser mayor a 0 minutos'));
        return;
      }
      
      if (!año_peliculas) {
        reject(new Error('El año es requerido'));
        return;
      }
      
      const añoActual = new Date().getFullYear();
      if (año_peliculas < 1900 || año_peliculas > añoActual + 1) {
        reject(new Error(`El año debe estar entre 1900 y ${añoActual + 1}`));
        return;
      }
      
      // Verificar duplicados
      Pelicula.getAll()
        .then(peliculasExistentes => {
          const existeDuplicado = peliculasExistentes.some(
            p => p.titulo_peliculas.toLowerCase().trim() === titulo_peliculas.toLowerCase().trim() 
            && p.año_peliculas === año_peliculas
          );
          
          if (existeDuplicado) {
            reject(new Error('Ya existe una película con el mismo título y año'));
            return;
          }
          
          return Pelicula.create({
            titulo_peliculas: titulo_peliculas.trim(),
            duracion_peliculas,
            año_peliculas
          });
        })
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // PUT /api/peliculas/:id - Actualizar una película
  static update(id, peliculaData) {
    return new Promise((resolve, reject) => {
      // Validación del ID
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de película inválido'));
        return;
      }
      
      // Lógica de negocio: validaciones
      const { titulo_peliculas, duracion_peliculas, año_peliculas } = peliculaData;
      
      if (!titulo_peliculas || titulo_peliculas.trim() === '') {
        reject(new Error('El título es requerido'));
        return;
      }
      
      if (!duracion_peliculas || duracion_peliculas <= 0) {
        reject(new Error('La duración debe ser mayor a 0 minutos'));
        return;
      }
      
      if (!año_peliculas) {
        reject(new Error('El año es requerido'));
        return;
      }
      
      const añoActual = new Date().getFullYear();
      if (año_peliculas < 1900 || año_peliculas > añoActual + 1) {
        reject(new Error(`El año debe estar entre 1900 y ${añoActual + 1}`));
        return;
      }
      
      Pelicula.getById(id)
        .then(pelicula => {
          if (!pelicula) {
            reject(new Error('Película no encontrada'));
            return;
          }
          
          // Verificar duplicados (excluyendo la película actual)
          return Pelicula.getAll()
            .then(peliculasExistentes => {
              const existeDuplicado = peliculasExistentes.some(
                p => p.id_peliculas !== parseInt(id) 
                && p.titulo_peliculas.toLowerCase().trim() === titulo_peliculas.toLowerCase().trim() 
                && p.año_peliculas === año_peliculas
              );
              
              if (existeDuplicado) {
                reject(new Error('Ya existe otra película con el mismo título y año'));
                return;
              }
              
              return Pelicula.update(id, {
                titulo_peliculas: titulo_peliculas.trim(),
                duracion_peliculas,
                año_peliculas
              });
            });
        })
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // DELETE /api/peliculas/:id - Eliminar una película
  static delete(id) {
    return new Promise((resolve, reject) => {
      // Validación del ID
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de película inválido'));
        return;
      }
      
      Pelicula.getById(id)
        .then(pelicula => {
          if (!pelicula) {
            reject(new Error('Película no encontrada'));
            return;
          }

          return Pelicula.delete(id);
        })
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

module.exports = PeliculaController;
