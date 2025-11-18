const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiar_en_produccion';

// Middleware para verificar autenticación
const authenticate = async (req, res, next) => {
  try {
    // Obtener token de las cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: Token no proporcionado'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validar que el token tenga el ID del usuario
    if (!decoded || !decoded.id) {
      res.clearCookie('token');
      return res.status(401).json({
        success: false,
        message: 'No autorizado: Token inválido'
      });
    }

    // Obtener información del usuario
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: Usuario no encontrado'
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: usuario.id_usuario,
      username: usuario.username,
      rol: usuario.rol
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.clearCookie('token');
      return res.status(401).json({
        success: false,
        message: 'No autorizado: Token inválido o expirado'
      });
    }

    console.error('Error en authenticate middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar que el usuario sea administrador
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado: Debe estar autenticado'
    });
  }

  if (req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requieren permisos de administrador'
    });
  }

  next();
};

// Middleware para verificar que el usuario sea administrador o usuario normal
// (útil si quieres permitir acceso a ambos roles)
const isAdminOrUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado: Debe estar autenticado'
    });
  }

  if (req.user.rol !== 'administrador' && req.user.rol !== 'usuario') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Rol no válido'
    });
  }

  next();
};

module.exports = {
  authenticate,
  isAdmin,
  isAdminOrUser
};

