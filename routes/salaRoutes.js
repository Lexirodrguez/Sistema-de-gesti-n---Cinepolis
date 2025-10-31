const express = require('express');
const router = express.Router();

// Importar controlador de salas
const salaController = require('../controllers/salaController');

// Ruta para renderizar la vista
router.get('/', (req, res) => {
    res.render('salas', { title: 'Gestión de Salas' });
});

// Rutas API independientes
router.get('/listar', salaController.getAllSalas);
router.get('/buscar/:id', salaController.getSalaById);
router.post('/crear', salaController.createSala);
router.put('/actualizar/:id', salaController.updateSala);
router.delete('/eliminar/:id', salaController.deleteSala);

module.exports = router;
