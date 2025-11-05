const express = require('express');
const router = express.Router();
const HorarioController = require('../controllers/horarioController');

// GET /api/horarios - Obtener todos los horarios
router.get('/', (req, res) => {
  HorarioController.getAll()
    .then(horarios => {
      res.send({
        success: true,
        data: horarios,
        count: horarios.length
      });
    })
    .catch(error => {
      res.status(500).send({
        success: false,
        message: error.message
      });
    });
});

// GET /api/horarios/:id - Obtener un horario por ID
router.get('/:id', (req, res) => {
  HorarioController.getById(req.params.id)
    .then(horario => {
      res.send({
        success: true,
        data: horario
      });
    })
    .catch(error => {
      res.status(404).send({
        success: false,
        message: error.message
      });
    });
});

// POST /api/horarios - Crear un nuevo horario
router.post('/', (req, res) => {
  HorarioController.create(req.body)
    .then(result => {
      res.status(201).send({
        success: true,
        message: 'Horario creado exitosamente',
        data: result
      });
    })
    .catch(error => {
      res.status(400).send({
        success: false,
        message: error.message
      });
    });
});

// PUT /api/horarios/:id - Actualizar un horario
router.put('/:id', (req, res) => {
  HorarioController.update(req.params.id, req.body)
    .then(result => {
      res.send({
        success: true,
        message: 'Horario actualizado exitosamente',
        data: result
      });
    })
    .catch(error => {
      res.status(404).send({
        success: false,
        message: error.message
      });
    });
});

// DELETE /api/horarios/:id - Eliminar un horario
router.delete('/:id', (req, res) => {
  HorarioController.delete(req.params.id)
    .then(result => {
      res.send({
        success: true,
        message: 'Horario eliminado exitosamente'
      });
    })
    .catch(error => {
      res.status(404).send({
        success: false,
        message: error.message
      });
    });
});

module.exports = router;
