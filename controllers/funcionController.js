const Funcion = require('../models/Funcion');
const Pelicula = require('../models/Pelicula');
const Sala = require('../models/Sala');
const Horario = require('../models/Horario');

// Validaciones simples
const validarFuncion = (datos) => {
    const errores = [];
    
    if (!datos.fechahora_funcion) {
        errores.push('La fecha y hora son requeridas');
    } else {
        const fechaFuncion = new Date(datos.fechahora_funcion);
        const ahora = new Date();
        if (fechaFuncion <= ahora) {
            errores.push('La fecha y hora deben ser futuras');
        }
    }
    
    if (datos.estado_funcion === undefined || datos.estado_funcion === null) {
        errores.push('El estado es requerido');
    }
    
    if (!datos.id_peliculasfuncion || datos.id_peliculasfuncion <= 0) {
        errores.push('La película es requerida');
    }
    
    if (!datos.id_salafuncion || datos.id_salafuncion <= 0) {
        errores.push('La sala es requerida');
    }
    
    if (!datos.id_horariofuncion || datos.id_horariofuncion <= 0) {
        errores.push('El horario es requerido');
    }
    
    return errores;
};

// Obtener todas las funciones
const getAllFunciones = async (req, res) => {
    try {
        const funciones = await Funcion.getAll();
        
        res.json({
            success: true,
            data: funciones,
            count: funciones.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las funciones',
            error: error.message
        });
    }
};

// Obtener función por ID
const getFuncionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validación simple del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de función inválido'
            });
        }
        
        const funcion = await Funcion.getById(id);
        
        if (!funcion) {
            return res.status(404).json({
                success: false,
                message: 'Función no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: funcion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la función',
            error: error.message
        });
    }
};

// Crear nueva función
const createFuncion = async (req, res) => {
    try {
        const { fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion } = req.body;
        
        // Aplicar validaciones
        const errores = validarFuncion({ 
            fechahora_funcion, 
            estado_funcion, 
            id_peliculasfuncion, 
            id_salafuncion, 
            id_horariofuncion 
        });
        
        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores: errores
            });
        }
        
        const nuevaFuncion = await Funcion.create({
            fechahora_funcion,
            estado_funcion,
            id_peliculasfuncion,
            id_salafuncion,
            id_horariofuncion
        });
        
        res.status(201).json({
            success: true,
            message: 'Función creada exitosamente',
            data: nuevaFuncion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la función',
            error: error.message
        });
    }
};

// Actualizar función
const updateFuncion = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechahora_funcion, estado_funcion, id_peliculasfuncion, id_salafuncion, id_horariofuncion } = req.body;
        
        // Validación del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de función inválido'
            });
        }
        
        // Verificar si la función existe
        const funcionExistente = await Funcion.getById(id);
        if (!funcionExistente) {
            return res.status(404).json({
                success: false,
                message: 'Función no encontrada'
            });
        }
        
        // Aplicar validaciones
        const errores = validarFuncion({ 
            fechahora_funcion, 
            estado_funcion, 
            id_peliculasfuncion, 
            id_salafuncion, 
            id_horariofuncion 
        });
        
        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores: errores
            });
        }
        
        const updated = await Funcion.update(id, {
            fechahora_funcion,
            estado_funcion,
            id_peliculasfuncion,
            id_salafuncion,
            id_horariofuncion
        });
        
        if (updated) {
            const funcionActualizada = await Funcion.getById(id);
            
            res.json({
                success: true,
                message: 'Función actualizada exitosamente',
                data: funcionActualizada
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la función'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la función',
            error: error.message
        });
    }
};

// Eliminar función
const deleteFuncion = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validación del ID
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de función inválido'
            });
        }
        
        // Verificar si la función existe
        const funcionExistente = await Funcion.getById(id);
        if (!funcionExistente) {
            return res.status(404).json({
                success: false,
                message: 'Función no encontrada'
            });
        }
        
        const deleted = await Funcion.delete(id);
        
        if (deleted) {
            res.json({
                success: true,
                message: 'Función eliminada exitosamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la función'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la función',
            error: error.message
        });
    }
};

// Renderizar la página de funciones con datos necesarios
const renderFuncionesPage = async (req, res) => {
    try {
        // obtener datos desde el modelo
        let funciones = await Funcion.getAll();
        const peliculas = await Pelicula.getAll();
        const salas = await Sala.getAll();
        const horarios = await Horario.getAll();

        // Usar parámetros de consulta (req.query) para filtrar si vienen
        const { pelicula, sala, horario } = req.query;
        if (pelicula) {
            funciones = funciones.filter(f => String(f.id_peliculasfuncion || f.id_peliculas) === String(pelicula));
        }
        if (sala) {
            funciones = funciones.filter(f => String(f.id_salafuncion || f.id_sala) === String(sala));
        }
        if (horario) {
            funciones = funciones.filter(f => String(f.id_horariofuncion || f.id_horario) === String(horario));
        }

        // Renderizar con res: usamos explícitamente req y res aquí
        return res.render('funciones', {
            title: 'Gestión de Funciones',
            funciones,
            peliculas,
            salas,
            horarios
        });
    } catch (error) {
        return res.status(500).send('Error al cargar la página de funciones');
    }
};

module.exports = {
    getAllFunciones,
    getFuncionById,
    createFuncion,
    updateFuncion,
    deleteFuncion,
    renderFuncionesPage
};