const Horario = require('../models/Horario');

// Validaciones simples
const validarHorario = (datos) => {
    const errores = [];
    
    if (!datos.nombre_horario || datos.nombre_horario.trim() === '') {
        errores.push('El nombre del horario es requerido');
    }
    
    if (!datos.hora_horario) {
        errores.push('La hora del horario es requerida');
    } else {
        // Validar formato de hora (HH:MM)
        const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!horaRegex.test(datos.hora_horario)) {
            errores.push('El formato de hora debe ser HH:MM (ej: 14:30)');
        }
    }
    
    return errores;
};

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
        
        // Validación simple del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de horario inválido'
            });
        }
        
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
        
        // Aplicar validaciones
        const errores = validarHorario({ nombre_horario, hora_horario });
        
        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores: errores
            });
        }
        
        const nuevoHorario = await Horario.create({
            nombre_horario: nombre_horario.trim(),
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
        
        // Validación del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de horario inválido'
            });
        }
        
        // Verificar si el horario existe
        const horarioExistente = await Horario.getById(id);
        if (!horarioExistente) {
            return res.status(404).json({
                success: false,
                message: 'Horario no encontrado'
            });
        }
        
        // Aplicar validaciones
        const errores = validarHorario({ nombre_horario, hora_horario });
        
        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores: errores
            });
        }
        
        const updated = await Horario.update(id, {
            nombre_horario: nombre_horario.trim(),
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
        
        // Validación del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de horario inválido'
            });
        }
        
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