// src/routers/rbac.js — v1.1.0
// Endpoints para consultar roles y permisos del sistema
const express          = require('express');
const auth             = require('../middleware/auth');
const requirePermiso   = require('../middleware/requirePermiso');
const { sequelize }    = require('../db/sequelize');
const router           = express.Router();

// GET /roles — lista roles con sus permisos (requiere leer usuarios)
router.get('/roles', auth, requirePermiso('usuarios', 'leer'), async (req, res) => {
  try {
    const roles = await sequelize.query(`
      SELECT r.id, r.nombre, r.descripcion,
        COALESCE(
          json_agg(
            json_build_object('id', p.id, 'recurso', p.recurso, 'accion', p.accion)
            ORDER BY p.recurso, p.accion
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'::json
        ) AS permisos
      FROM roles r
      LEFT JOIN roles_permisos rp ON rp.rol_id = r.id
      LEFT JOIN permisos p ON p.id = rp.permiso_id
      GROUP BY r.id
      ORDER BY r.id
    `, { type: sequelize.QueryTypes.SELECT });
    res.json(roles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /permisos — lista todos los permisos disponibles
router.get('/permisos', auth, requirePermiso('usuarios', 'leer'), async (req, res) => {
  try {
    const permisos = await sequelize.query(
      'SELECT * FROM permisos ORDER BY recurso, accion',
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(permisos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /permisos/usuario — permisos del usuario autenticado (cualquier rol)
router.get('/permisos/usuario', auth, (req, res) => {
  res.json({
    rol:      req.user.roles,
    permisos: req.user.permisos || []
  });
});

module.exports = router;
