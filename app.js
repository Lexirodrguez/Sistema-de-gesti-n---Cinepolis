const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas
const peliculaRoutes = require('./routes/peliculaRoutes');
const funcionRoutes = require('./routes/funcionRoutes');
const salaRoutes = require('./routes/salaRoutes');
const horarioRoutes = require('./routes/horarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para vistas
app.use('/peliculas', peliculaRoutes);
app.use('/funciones', funcionRoutes);
app.use('/salas', salaRoutes);
app.use('/horarios', horarioRoutes);


// Ruta de bienvenida - Página principal
app.get('/', (req, res) => {
  res.render('index', { title: 'Cinepolis - Sistema de Gestión' });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Iniciar servidor directamente sin ./bin/www
app.listen(PORT, () => {
  console.log(`🎬 Servidor Cinepolis corriendo en: http://localhost:${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;