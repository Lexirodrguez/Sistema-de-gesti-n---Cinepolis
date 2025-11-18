const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiar_en_produccion';
const JWT_EXPIRES_IN = '24h'; // El token expira en 24 horas

// Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id_usuario,
      username: user.username,
      rol: user.rol
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que se envíen username y password
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
    }

    // Buscar usuario en la base de datos
    const usuario = await Usuario.findByUsername(username);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar password
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generateToken(usuario);

    // Configurar cookie con el token
    res.cookie('token', token, {
      httpOnly: true, // Previene acceso desde JavaScript del cliente
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict', // Protección CSRF
      maxAge: 24 * 60 * 60 * 1000 // 24 horas en milisegundos
    });

    // Responder con éxito (sin enviar el token en el body por seguridad)
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: usuario.id_usuario,
        username: usuario.username,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
};

// Verificar token y obtener usuario actual
const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No hay token de autenticación'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validar que el token tenga el ID del usuario
    if (!decoded || !decoded.id) {
      res.clearCookie('token');
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Obtener información actualizada del usuario
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: usuario.id_usuario,
        username: usuario.username,
        rol: usuario.rol
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.clearCookie('token');
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    console.error('Error en verifyToken:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login,
  logout,
  verifyToken
};

