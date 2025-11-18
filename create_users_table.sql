-- Crear tabla de usuarios
-- NOTA: Este script crea la tabla, pero los usuarios deben ser creados usando el script initUsers.js
-- que genera los passwords hasheados correctamente con bcrypt

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `rol` enum('administrador','usuario') NOT NULL DEFAULT 'usuario',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- IMPORTANTE: No insertes usuarios directamente aquí
-- Usa el script: node scripts/initUsers.js
-- Esto creará los usuarios con passwords hasheados correctamente:
--   - admin / admin123 (rol: administrador)
--   - usuario / usuario123 (rol: usuario)

