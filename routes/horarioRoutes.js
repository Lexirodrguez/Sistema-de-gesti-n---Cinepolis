const express = require('express');
const router = express.Router();

// Importar controlador de horarios
const horarioController = require('../controllers/horarioController');

// Ruta para renderizar la vista
router.get('/', (req, res) => {
    res.render('horarios', { title: 'Gestión de Horarios' });
});

// Rutas API
router.get('/api', horarioController.getAllHorarios);
router.get('/api/:id', horarioController.getHorarioById);
router.post('/api', horarioController.createHorario);
router.put('/api/:id', horarioController.updateHorario);
router.delete('/api/:id', horarioController.deleteHorario);

module.exports = router;



