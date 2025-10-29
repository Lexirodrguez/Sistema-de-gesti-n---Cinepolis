const express = require('express');
const router = express.Router();

// Importar controlador de funciones
const funcionController = require('../controllers/funcionController');

// Ruta para renderizar la vista
router.get('/', funcionController.renderFuncionesPage);

// Rutas API
router.get('/api', funcionController.getAllFunciones);
router.get('/api/:id', funcionController.getFuncionById);
router.post('/api', funcionController.createFuncion);
router.put('/api/:id', funcionController.updateFuncion);
router.delete('/api/:id', funcionController.deleteFuncion);

module.exports = router;



