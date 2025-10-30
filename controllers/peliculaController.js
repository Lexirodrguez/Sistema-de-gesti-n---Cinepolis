const Pelicula = require('../models/Pelicula');

// Obtener todas las películas
const getAllPeliculas = async (req, res) => {
  try {
    const peliculas = await Pelicula.getAll();
    
    res.json({
      success: true,
      data: peliculas,
      count: peliculas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las películas',
      error: error.message
    });
  }
};

// Obtener película por ID
const getPeliculaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pelicula = await Pelicula.getById(id);
    
    if (!pelicula) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: pelicula
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la película',
      error: error.message
    });
  }
};

// Crear nueva película
const createPelicula = async (req, res) => {
  try {
    const { titulo_peliculas, duracion_peliculas, año_peliculas } = req.body;
    
    // Validaciones básicas
    if (!titulo_peliculas || !duracion_peliculas || !año_peliculas) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: titulo_peliculas, duracion_peliculas, año_peliculas'
      });
    }
    
    const nuevaPelicula = await Pelicula.create({
      titulo_peliculas,
      duracion_peliculas,
      año_peliculas
    });
    
    res.status(201).json({
      success: true,
      message: 'Película creada exitosamente',
      data: nuevaPelicula
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la película',
      error: error.message
    });
  }
};

// Actualizar película
const updatePelicula = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo_peliculas, duracion_peliculas, año_peliculas } = req.body;
    
    // Verificar si la película existe
    const peliculaExistente = await Pelicula.getById(id);
    if (!peliculaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    const updated = await Pelicula.update(id, {
      titulo_peliculas,
      duracion_peliculas,
      año_peliculas
    });
    
    if (updated) {
      const peliculaActualizada = await Pelicula.getById(id);
      
      res.json({
        success: true,
        message: 'Película actualizada exitosamente',
        data: peliculaActualizada
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No se pudo actualizar la película'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la película',
      error: error.message
    });
  }
};

// Eliminar película
const deletePelicula = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la película existe
    const peliculaExistente = await Pelicula.getById(id);
    if (!peliculaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    const deleted = await Pelicula.delete(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Película eliminada exitosamente'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No se pudo eliminar la película'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la película',
      error: error.message
    });
  }
};


// Asegúrate de que todas las funciones estén exportadas correctamente
module.exports = {
  getAllPeliculas,
  getPeliculaById,
  createPelicula,
  updatePelicula,
  deletePelicula
};