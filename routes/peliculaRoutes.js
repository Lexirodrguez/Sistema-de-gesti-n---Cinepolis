const express = require('express');
const router = express.Router();
const peliculaController = require('../controllers/peliculaController');

// Ruta para renderizar la vista principal
router.get('/', (req, res) => {
    res.render('peliculas', { title: 'Gestión de Películas' });
});

// Ruta para vista de crear película
router.get('/crear', (req, res) => {
    res.render('pelicula-form', { 
        title: 'Crear Película',
        pelicula: null,
        action: '/peliculas/crear',
        method: 'POST'
    });
});

// Ruta para vista de editar película
router.get('/editar/:id', async (req, res) => {
    try {
        const pelicula = await Pelicula.getById(req.params.id);
        if (!pelicula) {
            return res.redirect('/peliculas');
        }
        res.render('pelicula-form', {
            title: 'Editar Película',
            pelicula: pelicula,
            action: `/peliculas/actualizar/${pelicula.id_peliculas}`,
            method: 'PUT'
        });
    } catch (error) {
        res.redirect('/peliculas');
    }
});

// Rutas API
router.get('/listar', peliculaController.getAllPeliculas);
router.get('/buscar/:id', peliculaController.getPeliculaById);
router.post('/crear', peliculaController.createPelicula);
router.put('/actualizar/:id', peliculaController.updatePelicula);
router.delete('/eliminar/:id', peliculaController.deletePelicula);

module.exports = router;