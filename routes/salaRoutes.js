const express = require('express');
const router = express.Router();

// Importar controlador de salas
const salaController = require('../controllers/salaController');

// Ruta para renderizar la vista
router.get('/', (req, res) => {
    res.render('salas', { title: 'Gestión de Salas' });
});

// Rutas API
router.get('/api', salaController.getAllSalas);
router.get('/api/:id', salaController.getSalaById);
router.post('/api', salaController.createSala);
router.put('/api/:id', salaController.updateSala);
router.delete('/api/:id', salaController.deleteSala);

module.exports = router;



