const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Ruta de login
router.post('/login', authController.login);

// Ruta de logout
router.post('/logout', authenticate, authController.logout);

// Ruta para verificar token y obtener usuario actual
router.get('/verify', authenticate, authController.verifyToken);

module.exports = router;

