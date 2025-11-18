const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiar_en_produccion';

// Middleware para verificar autenticación en vistas
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/login');
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validar que el token tenga el ID del usuario
    if (!decoded || !decoded.id) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    // Obtener información del usuario
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    // Agregar información del usuario al request para las vistas
    req.user = {
      id: usuario.id_usuario,
      username: usuario.username,
      rol: usuario.rol
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    console.error('Error en requireAuth middleware:', error);
    res.redirect('/login');
  }
};

// Middleware para verificar que el usuario sea administrador en vistas
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  if (req.user.rol !== 'administrador') {
    return res.status(403).render('error', {
      title: 'Acceso Denegado',
      message: 'Se requieren permisos de administrador para acceder a esta página.'
    });
  }

  next();
};

module.exports = {
  requireAuth,
  requireAdmin
};

