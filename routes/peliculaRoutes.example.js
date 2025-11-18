// EJEMPLO: Cómo usar el middleware de autenticación en tus rutas
// Este archivo es solo un ejemplo, no se usa en la aplicación

const express = require('express');
const router = express.Router();
const PeliculaController = require('../controllers/peliculaController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Ruta pública - Cualquiera puede ver las películas
router.get('/', (req, res) => {
  PeliculaController.getAll()
    .then(peliculas => {
      res.send({
        success: true,
        data: peliculas,
        count: peliculas.length
      });
    })
    .catch(error => {
      res.status(500).send({
        success: false,
        message: error.message
      });
    });
});

// Ruta protegida - Solo usuarios autenticados pueden ver una película específica
router.get('/:id', authenticate, (req, res) => {
  PeliculaController.getById(req.params.id)
    .then(pelicula => {
      res.send({
        success: true,
        data: pelicula
      });
    })
    .catch(error => {
      res.status(404).send({
        success: false,
        message: error.message
      });
    });
});

// Ruta solo para administradores - Solo admin puede crear películas
router.post('/', authenticate, isAdmin, (req, res) => {
  PeliculaController.create(req.body)
    .then(result => {
      res.status(201).send({
        success: true,
        message: 'Película creada exitosamente',
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

// Ruta solo para administradores - Solo admin puede actualizar películas
router.put('/:id', authenticate, isAdmin, (req, res) => {
  PeliculaController.update(req.params.id, req.body)
    .then(result => {
      res.send({
        success: true,
        message: 'Película actualizada exitosamente',
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

// Ruta solo para administradores - Solo admin puede eliminar películas
router.delete('/:id', authenticate, isAdmin, (req, res) => {
  PeliculaController.delete(req.params.id)
    .then(result => {
      res.send({
        success: true,
        message: 'Película eliminada exitosamente'
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

