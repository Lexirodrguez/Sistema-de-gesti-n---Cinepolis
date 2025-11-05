const Sala = require('../models/Sala');
const Funcion = require('../models/Funcion');

class SalaController {
  // GET /api/salas - Obtener todas las salas
  static getAll() {
    return new Promise((resolve, reject) => {
      Sala.getAll()
        .then(salas => {
          resolve(salas);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // GET /api/salas/:id - Obtener una sala por ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      // Validación de negocio
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de sala inválido'));
        return;
      }

      Sala.getById(id)
        .then(sala => {
          if (!sala) {
            reject(new Error('Sala no encontrada'));
            return;
          }
          resolve(sala);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // POST /api/salas - Crear una nueva sala
  static create(salaData) {
    return new Promise((resolve, reject) => {
      // Lógica de negocio: validaciones
      const { nombre_sala, tipo_sala, estado_sala } = salaData;
      
      if (!nombre_sala || nombre_sala.trim() === '') {
        reject(new Error('El nombre de la sala es requerido'));
        return;
      }
      
      if (!tipo_sala || tipo_sala.trim() === '') {
        reject(new Error('El tipo de sala es requerido'));
        return;
      }
      
      // Validar tipos de sala permitidos
      const tiposPermitidos = ['2D', '3D', 'IMAX', 'VIP', '4DX'];
      if (!tiposPermitidos.includes(tipo_sala.toUpperCase())) {
        reject(new Error(`El tipo de sala debe ser uno de: ${tiposPermitidos.join(', ')}`));
        return;
      }
      
      if (estado_sala === undefined || estado_sala === null) {
        reject(new Error('El estado es requerido'));
        return;
      }
      
      // Verificar duplicados
      Sala.getAll()
        .then(salasExistentes => {
          const existeDuplicado = salasExistentes.some(
            s => s.nombre_sala.toLowerCase().trim() === nombre_sala.toLowerCase().trim()
          );
          
          if (existeDuplicado) {
            reject(new Error('Ya existe una sala con ese nombre'));
            return;
          }
          
          return Sala.create({
            nombre_sala: nombre_sala.trim(),
            tipo_sala: tipo_sala.toUpperCase(),
            estado_sala
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

  // PUT /api/salas/:id - Actualizar una sala
  static update(id, salaData) {
    return new Promise((resolve, reject) => {
      // Validación del ID
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de sala inválido'));
        return;
      }
      
      // Lógica de negocio: validaciones
      const { nombre_sala, tipo_sala, estado_sala } = salaData;
      
      if (!nombre_sala || nombre_sala.trim() === '') {
        reject(new Error('El nombre de la sala es requerido'));
        return;
      }
      
      if (!tipo_sala || tipo_sala.trim() === '') {
        reject(new Error('El tipo de sala es requerido'));
        return;
      }
      
      // Validar tipos de sala permitidos
      const tiposPermitidos = ['2D', '3D', 'IMAX', 'VIP', '4DX'];
      if (!tiposPermitidos.includes(tipo_sala.toUpperCase())) {
        reject(new Error(`El tipo de sala debe ser uno de: ${tiposPermitidos.join(', ')}`));
        return;
      }
      
      if (estado_sala === undefined || estado_sala === null) {
        reject(new Error('El estado es requerido'));
        return;
      }
      
      Sala.getById(id)
        .then(sala => {
          if (!sala) {
            reject(new Error('Sala no encontrada'));
            return;
          }
          
          // Verificar duplicados (excluyendo la sala actual)
          return Sala.getAll()
            .then(salasExistentes => {
              const existeDuplicado = salasExistentes.some(
                s => s.id_sala !== parseInt(id) 
                && s.nombre_sala.toLowerCase().trim() === nombre_sala.toLowerCase().trim()
              );
              
              if (existeDuplicado) {
                reject(new Error('Ya existe otra sala con ese nombre'));
                return;
              }
              
              return Sala.update(id, {
                nombre_sala: nombre_sala.trim(),
                tipo_sala: tipo_sala.toUpperCase(),
                estado_sala
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

  // DELETE /api/salas/:id - Eliminar una sala
  static delete(id) {
    return new Promise((resolve, reject) => {
      // Validación del ID
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de sala inválido'));
        return;
      }
      
      Sala.getById(id)
        .then(sala => {
          if (!sala) {
            reject(new Error('Sala no encontrada'));
            return;
          }
          
          // Verificar si la sala está siendo usada en funciones
          return Funcion.getAll()
            .then(funcionesExistentes => {
              const tieneFunciones = funcionesExistentes.some(f => f.id_salafuncion === parseInt(id));
              
              if (tieneFunciones) {
                reject(new Error('No se puede eliminar la sala porque tiene funciones asignadas'));
                return;
              }
              
              return Sala.delete(id);
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
}

module.exports = SalaController;
