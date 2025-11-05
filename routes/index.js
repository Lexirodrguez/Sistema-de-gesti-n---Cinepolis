const express = require('express');
const router = express.Router();
const FuncionController = require('../controllers/funcionController');

// GET / - Página principal
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Cinepolis - Sistema de Gestión',
    message: 'Bienvenido al sistema de gestión de cine'
  });
});

// GET /peliculas - Vista de películas
router.get('/peliculas', (req, res) => {
  res.render('peliculas', { 
    title: 'Gestión de Películas',
    message: 'Gestión de películas'
  });
});

// GET /salas - Vista de salas
router.get('/salas', (req, res) => {
  res.render('salas', { 
    title: 'Gestión de Salas',
    message: 'Gestión de salas'
  });
});

// GET /funciones - Vista de funciones
router.get('/funciones', (req, res) => {
  FuncionController.getDatosParaVista()
    .then((resultado) => {
      const { pelicula, sala, horario } = req.query;
      
      let funciones = resultado.funciones;
      
      // Aplicar filtros si existen
      if (pelicula) {
        funciones = funciones.filter(f => String(f.id_peliculasfuncion || f.id_peliculas) === String(pelicula));
      }
      if (sala) {
        funciones = funciones.filter(f => String(f.id_salafuncion || f.id_sala) === String(sala));
      }
      if (horario) {
        funciones = funciones.filter(f => String(f.id_horariofuncion || f.id_horario) === String(horario));
      }
      
      res.render('funciones', {
        title: 'Gestión de Funciones',
        funciones,
        peliculas: resultado.peliculas,
        salas: resultado.salas,
        horarios: resultado.horarios
      });
    })
    .catch((error) => {
      res.status(500).send('Error al cargar la página de funciones');
    });
});

// GET /horarios - Vista de horarios
router.get('/horarios', (req, res) => {
  res.render('horarios', { 
    title: 'Gestión de Horarios',
    message: 'Gestión de horarios'
  });
});

module.exports = router;
