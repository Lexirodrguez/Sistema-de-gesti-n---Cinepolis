const Horario = require('../models/Horario');

// Obtener todos los horarios
const getAllHorarios = async (req, res) => {
  try {
    const horarios = await Horario.getAll();
    
    res.json({
      success: true,
      data: horarios,
      count: horarios.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los horarios',
      error: error.message
    });
  }
};

// Obtener horario por ID
const getHorarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const horario = await Horario.getById(id);
    
    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: horario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el horario',
      error: error.message
    });
  }
};

// Crear nuevo horario
const createHorario = async (req, res) => {
  try {
    const { nombre_horario, hora_horario } = req.body;
    
    // Validaciones básicas
    if (!nombre_horario || !hora_horario) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: nombre_horario, hora_horario'
      });
    }
    
    const nuevoHorario = await Horario.create({
      nombre_horario,
      hora_horario
    });
    
    res.status(201).json({
      success: true,
      message: 'Horario creado exitosamente',
      data: nuevoHorario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el horario',
      error: error.message
    });
  }
};

// Actualizar horario
const updateHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_horario, hora_horario } = req.body;
    
    // Verificar si el horario existe
    const horarioExistente = await Horario.getById(id);
    if (!horarioExistente) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }
    
    const updated = await Horario.update(id, {
      nombre_horario,
      hora_horario
    });
    
    if (updated) {
      const horarioActualizado = await Horario.getById(id);
      
      res.json({
        success: true,
        message: 'Horario actualizado exitosamente',
        data: horarioActualizado
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No se pudo actualizar el horario'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el horario',
      error: error.message
    });
  }
};

// Eliminar horario
const deleteHorario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el horario existe
    const horarioExistente = await Horario.getById(id);
    if (!horarioExistente) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }
    
    const deleted = await Horario.delete(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Horario eliminado exitosamente'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No se pudo eliminar el horario'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el horario',
      error: error.message
    });
  }
};

module.exports = {
  getAllHorarios,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario
};




