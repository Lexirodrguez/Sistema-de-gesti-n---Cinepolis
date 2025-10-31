const express = require('express');
const router = express.Router();

// Importar controlador de horarios
const horarioController = require('../controllers/horarioController');

// Ruta para renderizar la vista
router.get('/', (req, res) => {
    res.render('horarios', { title: 'Gestión de Horarios' });
});

// Rutas API independientes
router.get('/listar', horarioController.getAllHorarios);
router.get('/buscar/:id', horarioController.getHorarioById);
router.post('/crear', horarioController.createHorario);
router.put('/actualizar/:id', horarioController.updateHorario);
router.delete('/eliminar/:id', horarioController.deleteHorario);

module.exports = router;
