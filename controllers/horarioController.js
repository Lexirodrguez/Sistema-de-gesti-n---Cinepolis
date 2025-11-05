const Horario = require('../models/Horario');
const Funcion = require('../models/Funcion');

class HorarioController {
  // GET /api/horarios - Obtener todos los horarios
  static getAll() {
    return new Promise((resolve, reject) => {
      Horario.getAll()
        .then(horarios => {
          resolve(horarios);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // GET /api/horarios/:id - Obtener un horario por ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      // Validación de negocio
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de horario inválido'));
        return;
      }

      Horario.getById(id)
        .then(horario => {
          if (!horario) {
            reject(new Error('Horario no encontrado'));
            return;
          }
          resolve(horario);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // POST /api/horarios - Crear un nuevo horario
  static create(horarioData) {
    return new Promise((resolve, reject) => {
      // Lógica de negocio: validaciones
      const { nombre_horario, hora_horario } = horarioData;
      
      if (!nombre_horario || nombre_horario.trim() === '') {
        reject(new Error('El nombre del horario es requerido'));
        return;
      }
      
      if (!hora_horario) {
        reject(new Error('La hora del horario es requerida'));
        return;
      }
      
      // Validar formato de hora (HH:MM)
      const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horaRegex.test(hora_horario)) {
        reject(new Error('El formato de hora debe ser HH:MM (ej: 14:30)'));
        return;
      }
      
      // Verificar duplicados
      Horario.getAll()
        .then(horariosExistentes => {
          const existeDuplicado = horariosExistentes.some(
            h => h.hora_horario === hora_horario
          );
          
          if (existeDuplicado) {
            reject(new Error('Ya existe un horario con esa hora'));
            return;
          }
          
          return Horario.create({
            nombre_horario: nombre_horario.trim(),
            hora_horario
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

  // PUT /api/horarios/:id - Actualizar un horario
  static update(id, horarioData) {
    return new Promise((resolve, reject) => {
      // Validación del ID
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de horario inválido'));
        return;
      }
      
      // Lógica de negocio: validaciones
      const { nombre_horario, hora_horario } = horarioData;
      
      if (!nombre_horario || nombre_horario.trim() === '') {
        reject(new Error('El nombre del horario es requerido'));
        return;
      }
      
      if (!hora_horario) {
        reject(new Error('La hora del horario es requerida'));
        return;
      }
      
      // Validar formato de hora (HH:MM)
      const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horaRegex.test(hora_horario)) {
        reject(new Error('El formato de hora debe ser HH:MM (ej: 14:30)'));
        return;
      }
      
      Horario.getById(id)
        .then(horario => {
          if (!horario) {
            reject(new Error('Horario no encontrado'));
            return;
          }
          
          // Verificar duplicados (excluyendo el horario actual)
          return Horario.getAll()
            .then(horariosExistentes => {
              const existeDuplicado = horariosExistentes.some(
                h => h.id_horario !== parseInt(id) 
                && h.hora_horario === hora_horario
              );
              
              if (existeDuplicado) {
                reject(new Error('Ya existe otro horario con esa hora'));
                return;
              }
              
              return Horario.update(id, {
                nombre_horario: nombre_horario.trim(),
                hora_horario
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

  // DELETE /api/horarios/:id - Eliminar un horario
  static delete(id) {
    return new Promise((resolve, reject) => {
      // Validación del ID
      if (!id || isNaN(id) || id <= 0) {
        reject(new Error('ID de horario inválido'));
        return;
      }
      
      Horario.getById(id)
        .then(horario => {
          if (!horario) {
            reject(new Error('Horario no encontrado'));
            return;
          }
          
          // Verificar si el horario está siendo usado en funciones
          return Funcion.getAll()
            .then(funcionesExistentes => {
              const tieneFunciones = funcionesExistentes.some(f => f.id_horariofuncion === parseInt(id));
              
              if (tieneFunciones) {
                reject(new Error('No se puede eliminar el horario porque tiene funciones asignadas'));
                return;
              }
              
              return Horario.delete(id);
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

module.exports = HorarioController;
