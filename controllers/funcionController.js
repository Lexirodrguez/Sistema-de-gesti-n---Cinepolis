const Funcion = require('../models/Funcion');
const Pelicula = require('../models/Pelicula');
const Sala = require('../models/Sala');
const Horario = require('../models/Horario');

class FuncionController {
  // GET /api/funciones - Obtener todas las funciones
  static getAll() {
    return new Promise((resolve, reject) => {
      Funcion.getAll()
        .then(funciones => {
          resolve(funciones);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // GET /api/funciones/:id - Obtener una función por ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      // Validación de negocio
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de función inválido'));
        return;
      }

      Funcion.getById(id)
        .then(funcion => {
          if (!funcion) {
            reject(new Error('Función no encontrada'));
            return;
          }
          resolve(funcion);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // POST /api/funciones - Crear una nueva función
  static create(funcionData) {
    return new Promise((resolve, reject) => {
      // Lógica de negocio: validaciones
      const { fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion } = funcionData;
      
      if (!fechahora_funcion) {
        reject(new Error('La fecha y hora son requeridas'));
        return;
      }
      
      const fechaFuncion = new Date(fechahora_funcion);
      const ahora = new Date();
      if (fechaFuncion <= ahora) {
        reject(new Error('La fecha y hora deben ser futuras'));
        return;
      }
      
      if (estado_funcion === undefined || estado_funcion === null) {
        reject(new Error('El estado es requerido'));
        return;
      }
      
      if (!id_peliculasfuncion || id_peliculasfuncion <= 0) {
        reject(new Error('La película es requerida'));
        return;
      }
      
      if (!id_salafuncion || id_salafuncion <= 0) {
        reject(new Error('La sala es requerida'));
        return;
      }
      
      if (!id_horariofuncion || id_horariofuncion <= 0) {
        reject(new Error('El horario es requerido'));
        return;
      }
      
      // Verificar que las entidades relacionadas existen
      Promise.all([
        Pelicula.getById(id_peliculasfuncion),
        Sala.getById(id_salafuncion),
        Horario.getById(id_horariofuncion)
      ])
        .then(([pelicula, sala, horario]) => {
          if (!pelicula) {
            reject(new Error('La película especificada no existe'));
            return;
          }
          if (!sala) {
            reject(new Error('La sala especificada no existe'));
            return;
          }
          if (!horario) {
            reject(new Error('El horario especificado no existe'));
            return;
          }
          
          // Verificar conflictos de horarios
          return Funcion.getAll();
        })
        .then(funcionesExistentes => {
          const conflicto = funcionesExistentes.some(f => {
            const fechaExistente = new Date(f.fechahora_funcion);
            const fechaNueva = new Date(fechahora_funcion);
            return f.id_salafuncion === id_salafuncion 
                && fechaExistente.getTime() === fechaNueva.getTime()
                && f.id_horariofuncion === id_horariofuncion;
          });
          
          if (conflicto) {
            reject(new Error('La sala ya está ocupada en esa fecha y horario'));
            return;
          }
          
          return Funcion.create({
            fechahora_funcion,
            estado_funcion,
            id_peliculasfuncion,
            id_salafuncion,
            id_horariofuncion
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

  // PUT /api/funciones/:id - Actualizar una función
  static update(id, funcionData) {
    return new Promise((resolve, reject) => {
      // Validación del ID
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de función inválido'));
        return;
      }
      
      // Lógica de negocio: validaciones
      const { fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion } = funcionData;
      
      if (!fechahora_funcion) {
        reject(new Error('La fecha y hora son requeridas'));
        return;
      }
      
      const fechaFuncion = new Date(fechahora_funcion);
      const ahora = new Date();
      if (fechaFuncion <= ahora) {
        reject(new Error('La fecha y hora deben ser futuras'));
        return;
      }
      
      if (estado_funcion === undefined || estado_funcion === null) {
        reject(new Error('El estado es requerido'));
        return;
      }
      
      if (!id_peliculasfuncion || id_peliculasfuncion <= 0) {
        reject(new Error('La película es requerida'));
        return;
      }
      
      if (!id_salafuncion || id_salafuncion <= 0) {
        reject(new Error('La sala es requerida'));
        return;
      }
      
      if (!id_horariofuncion || id_horariofuncion <= 0) {
        reject(new Error('El horario es requerido'));
        return;
      }
      
      Funcion.getById(id)
        .then(funcion => {
          if (!funcion) {
            reject(new Error('Función no encontrada'));
            return;
          }
          
          // Verificar que las entidades relacionadas existen
          return Promise.all([
            Pelicula.getById(id_peliculasfuncion),
            Sala.getById(id_salafuncion),
            Horario.getById(id_horariofuncion)
          ]);
        })
        .then(([pelicula, sala, horario]) => {
          if (!pelicula) {
            reject(new Error('La película especificada no existe'));
            return;
          }
          if (!sala) {
            reject(new Error('La sala especificada no existe'));
            return;
          }
          if (!horario) {
            reject(new Error('El horario especificado no existe'));
            return;
          }
          
          // Verificar conflictos de horarios (excluyendo la función actual)
          return Funcion.getAll()
            .then(funcionesExistentes => {
              const conflicto = funcionesExistentes.some(f => {
                const fechaExistente = new Date(f.fechahora_funcion);
                const fechaNueva = new Date(fechahora_funcion);
                return f.id_funcion !== parseInt(id)
                    && f.id_salafuncion === id_salafuncion 
                    && fechaExistente.getTime() === fechaNueva.getTime()
                    && f.id_horariofuncion === id_horariofuncion;
              });
              
              if (conflicto) {
                reject(new Error('La sala ya está ocupada en esa fecha y horario'));
                return;
              }
              
              return Funcion.update(id, {
                fechahora_funcion,
                estado_funcion,
                id_peliculasfuncion,
                id_salafuncion,
                id_horariofuncion
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

  // DELETE /api/funciones/:id - Eliminar una función
  static delete(id) {
    return new Promise((resolve, reject) => {
      // Validación del ID
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de función inválido'));
        return;
      }
      
      Funcion.getById(id)
        .then(funcion => {
          if (!funcion) {
            reject(new Error('Función no encontrada'));
            return;
          }
          
          // No permitir eliminar funciones que ya pasaron
          const fechaFuncion = new Date(funcion.fechahora_funcion);
          const ahora = new Date();
          if (fechaFuncion <= ahora) {
            reject(new Error('No se pueden eliminar funciones que ya han pasado'));
            return;
          }

          return Funcion.delete(id);
        })
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // Obtener datos para renderizar página
  static getDatosParaVista() {
    return new Promise((resolve, reject) => {
      Promise.all([
        Funcion.getAll(),
        Pelicula.getAll(),
        Sala.getAll(),
        Horario.getAll()
      ])
        .then(([funciones, peliculas, salas, horarios]) => {
          resolve({
            funciones,
            peliculas,
            salas,
            horarios
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

module.exports = FuncionController;
