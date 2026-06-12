// src/routers/entradas.js — v1.0.0 (Sequelize / PostgreSQL)
const express  = require('express');
const Entradas = require('../model/Entradas');
const auth     = require('../middleware/auth');
const router   = new express.Router();

// Registrar entrada de inventario
router.post('/entradas/register', auth, async (req, res) => {
  try {
    const entrada = await Entradas.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(entrada);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Listar todas las entradas
router.get('/entradas', auth, async (req, res) => {
  try {
    const entradas = await Entradas.findAll();
    res.json(entradas);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Detalle por ID
router.get('/entradas/:id', auth, async (req, res) => {
  try {
    const entrada = await Entradas.findByPk(req.params.id);
    if (!entrada) return res.status(404).json({ error: 'Entrada no encontrada' });
    res.json(entrada);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar
router.patch('/entradas/:id', auth, async (req, res) => {
  const allowed = ['nombre', 'cantidad', 'descripcion'];
  try {
    const entrada = await Entradas.findByPk(req.params.id);
    if (!entrada) return res.status(404).json({ error: 'Entrada no encontrada' });
    allowed.forEach(k => { if (req.body[k] !== undefined) entrada[k] = req.body[k]; });
    await entrada.save();
    res.json(entrada);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Eliminar
router.delete('/entradas/:id', auth, async (req, res) => {
  try {
    const entrada = await Entradas.findByPk(req.params.id);
    if (!entrada) return res.status(404).json({ error: 'Entrada no encontrada' });
    await entrada.destroy();
    res.json(entrada);
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar entrada' });
  }
});

module.exports = router;
