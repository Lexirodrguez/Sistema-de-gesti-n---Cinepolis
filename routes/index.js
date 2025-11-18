const express = require('express');
const router = express.Router();
const FuncionController = require('../controllers/funcionController');
const { requireAuth, requireAdmin } = require('../middleware/viewAuthMiddleware');

// GET /login - Página de login
router.get('/login', (req, res) => {
  // Si ya está autenticado, redirigir al inicio
  if (req.cookies.token) {
    return res.redirect('/');
  }
  res.render('login', { 
    title: 'Login - Cinepolis'
  });
});

// GET / - Página principal (requiere autenticación)
router.get('/', requireAuth, (req, res) => {
  res.render('index', { 
    title: 'Cinepolis - Sistema de Gestión',
    message: 'Bienvenido al sistema de gestión de cine',
    user: req.user
  });
});

// GET /peliculas - Vista de películas (requiere autenticación)
router.get('/peliculas', requireAuth, (req, res) => {
  res.render('peliculas', { 
    title: 'Gestión de Películas',
    message: 'Gestión de películas',
    user: req.user
  });
});

// GET /salas - Vista de salas (requiere autenticación y ser admin)
router.get('/salas', requireAuth, requireAdmin, (req, res) => {
  res.render('salas', { 
    title: 'Gestión de Salas',
    message: 'Gestión de salas',
    user: req.user
  });
});

// GET /funciones - Vista de funciones (requiere autenticación)
router.get('/funciones', requireAuth, (req, res) => {
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
        horarios: resultado.horarios,
        user: req.user
      });
    })
    .catch((error) => {
      res.status(500).send('Error al cargar la página de funciones');
    });
});

// GET /horarios - Vista de horarios (requiere autenticación y ser admin)
router.get('/horarios', requireAuth, requireAdmin, (req, res) => {
  res.render('horarios', { 
    title: 'Gestión de Horarios',
    message: 'Gestión de horarios',
    user: req.user
  });
});

module.exports = router;
