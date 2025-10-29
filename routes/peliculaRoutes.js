
const express = require('express');
const router = express.Router();

// Importar correctamente todas las funciones del controlador
const peliculaController = require('../controllers/peliculaController');

// Ruta para renderizar la vista
router.get('/', (req, res) => {
    res.render('peliculas', { title: 'Gestión de Películas' });
});

// Rutas API
router.get('/api', peliculaController.getAllPeliculas);
router.get('/api/:id', peliculaController.getPeliculaById);
router.post('/api', peliculaController.createPelicula);
router.put('/api/:id', peliculaController.updatePelicula);
router.delete('/api/:id', peliculaController.deletePelicula);

module.exports = router;