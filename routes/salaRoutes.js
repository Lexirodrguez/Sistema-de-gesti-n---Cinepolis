const express = require('express');
const router = express.Router();
const SalaController = require('../controllers/salaController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Todas las rutas de salas requieren ser administrador
// GET /api/salas - Obtener todas las salas (solo administrador)
router.get('/', authenticate, isAdmin, (req, res) => {
  SalaController.getAll()
    .then(salas => {
      res.send({
        success: true,
        data: salas,
        count: salas.length
      });
    })
    .catch(error => {
      res.status(500).send({
        success: false,
        message: error.message
      });
    });
});

// GET /api/salas/:id - Obtener una sala por ID (solo administrador)
router.get('/:id', authenticate, isAdmin, (req, res) => {
  SalaController.getById(req.params.id)
    .then(sala => {
      res.send({
        success: true,
        data: sala
      });
    })
    .catch(error => {
      res.status(404).send({
        success: false,
        message: error.message
      });
    });
});

// POST /api/salas - Crear una nueva sala (solo administrador)
router.post('/', authenticate, isAdmin, (req, res) => {
  SalaController.create(req.body)
    .then(result => {
      res.status(201).send({
        success: true,
        message: 'Sala creada exitosamente',
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

// PUT /api/salas/:id - Actualizar una sala (solo administrador)
router.put('/:id', authenticate, isAdmin, (req, res) => {
  SalaController.update(req.params.id, req.body)
    .then(result => {
      res.send({
        success: true,
        message: 'Sala actualizada exitosamente',
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

// DELETE /api/salas/:id - Eliminar una sala (solo administrador)
router.delete('/:id', authenticate, isAdmin, (req, res) => {
  SalaController.delete(req.params.id)
    .then(result => {
      res.send({
        success: true,
        message: 'Sala eliminada exitosamente'
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
