// src/middleware/requirePermiso.js — v1.1.0
// Verifica que req.user tenga el permiso requerido.
// Permisos vienen en el JWT como array ["personas:leer", "donaciones:crear", ...]
// Usar siempre DESPUÉS del middleware auth().
//
// Uso: router.post('/ruta', auth, requirePermiso('personas','crear'), handler)

const requirePermiso = (recurso, accion) => (req, res, next) => {
  // Administrador pasa siempre (backward compat)
  if (req.user?.roles === 'Administrador') return next();

  const permisos = req.user?.permisos || [];
  if (permisos.includes(`${recurso}:${accion}`)) return next();

  res.status(403).json({
    error: 'Sin permiso',
    detalle: `Se requiere: ${recurso}:${accion}`
  });
};

module.exports = requirePermiso;
