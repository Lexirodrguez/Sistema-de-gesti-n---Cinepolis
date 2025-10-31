const Pelicula = require('../models/Pelicula');

// Validaciones simples
const validarPelicula = (datos) => {
    const errores = [];
    
    if (!datos.titulo_peliculas || datos.titulo_peliculas.trim() === '') {
        errores.push('El título es requerido');
    }
    
    if (!datos.duracion_peliculas || datos.duracion_peliculas <= 0) {
        errores.push('La duración debe ser mayor a 0 minutos');
    }
    
    if (!datos.año_peliculas) {
        errores.push('El año es requerido');
    } else {
        const añoActual = new Date().getFullYear();
        if (datos.año_peliculas < 1900 || datos.año_peliculas > añoActual + 1) {
            errores.push(`El año debe estar entre 1900 y ${añoActual + 1}`);
        }
    }
    
    return errores;
};

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
        
        // Validación simple del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de película inválido'
            });
        }
        
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
        
        // Aplicar validaciones
        const errores = validarPelicula({ titulo_peliculas, duracion_peliculas, año_peliculas });
        
        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores: errores
            });
        }
        
        const nuevaPelicula = await Pelicula.create({
            titulo_peliculas: titulo_peliculas.trim(),
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
        
        // Validación del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de película inválido'
            });
        }
        
        // Verificar si la película existe
        const peliculaExistente = await Pelicula.getById(id);
        if (!peliculaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Película no encontrada'
            });
        }
        
        // Aplicar validaciones
        const errores = validarPelicula({ titulo_peliculas, duracion_peliculas, año_peliculas });
        
        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores: errores
            });
        }
        
        const updated = await Pelicula.update(id, {
            titulo_peliculas: titulo_peliculas.trim(),
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
        
        // Validación del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de película inválido'
            });
        }
        
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

module.exports = {
    getAllPeliculas,
    getPeliculaById,
    createPelicula,
    updatePelicula,
    deletePelicula
};