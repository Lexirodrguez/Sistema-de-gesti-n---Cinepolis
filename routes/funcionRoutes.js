const express = require('express');
const router = express.Router();

// Importar controlador de funciones
const funcionController = require('../controllers/funcionController');

// Ruta para renderizar la vista
router.get('/', funcionController.renderFuncionesPage);

// Rutas API independientes
router.get('/listar', funcionController.getAllFunciones);
router.get('/buscar/:id', funcionController.getFuncionById);
router.post('/crear', funcionController.createFuncion);
router.put('/actualizar/:id', funcionController.updateFuncion);
router.delete('/eliminar/:id', funcionController.deleteFuncion);

module.exports = router;



