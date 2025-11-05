const Sala = require('../models/Sala');

// Obtener todas las salas
const getAllSalas = async (req, res) => {
  try {
    const salas = await Sala.getAll();
    
    res.json({
      success: true,
      data: salas,
      count: salas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las salas',
      error: error.message
    });
  }
};

// Obtener sala por ID
const getSalaById = async (req, res) => {
  try {
    const { id } = req.params;
    const sala = await Sala.getById(id);
    
    if (!sala) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: sala
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la sala',
      error: error.message
    });
  }
};

// Crear nueva sala
const createSala = async (req, res) => {
  try {
    const { nombre_sala, tipo_sala, estado_sala } = req.body;
    
    // Validaciones básicas
    if (!nombre_sala || !tipo_sala || estado_sala === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: nombre_sala, tipo_sala, estado_sala'
      });
    }
    
    const nuevaSala = await Sala.create({
      nombre_sala,
      tipo_sala,
      estado_sala
    });
    
    res.status(201).json({
      success: true,
      message: 'Sala creada exitosamente',
      data: nuevaSala
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la sala',
      error: error.message
    });
  }
};

// Actualizar sala
const updateSala = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_sala, tipo_sala, estado_sala } = req.body;
    
    // Verificar si la sala existe
    const salaExistente = await Sala.getById(id);
    if (!salaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }
    
    const updated = await Sala.update(id, {
      nombre_sala,
      tipo_sala,
      estado_sala
    });
    
    if (updated) {
      const salaActualizada = await Sala.getById(id);
      
      res.json({
        success: true,
        message: 'Sala actualizada exitosamente',
        data: salaActualizada
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No se pudo actualizar la sala'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la sala',
      error: error.message
    });
  }
};

// Eliminar sala
const deleteSala = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la sala existe
    const salaExistente = await Sala.getById(id);
    if (!salaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }
    
    const deleted = await Sala.delete(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Sala eliminada exitosamente'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No se pudo eliminar la sala'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la sala',
      error: error.message
    });
  }
};

module.exports = {
  getAllSalas,
  getSalaById,
  createSala,
  updateSala,
  deleteSala
};




