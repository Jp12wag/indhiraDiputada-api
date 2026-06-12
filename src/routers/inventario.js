// src/routers/inventario.js — v1.0.0 (Sequelize / PostgreSQL)
const express    = require('express');
const Inventario = require('../model/inventario');
const auth       = require('../middleware/auth');
const router     = new express.Router();

// Crear producto de inventario
router.post('/inventario/register', auth, async (req, res) => {
  try {
    const inventario = await Inventario.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(inventario);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Listar todo el inventario
router.get('/inventario', auth, async (req, res) => {
  try {
    const inventario = await Inventario.findAll();
    res.json(inventario);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Detalle por ID
router.get('/inventario/:id', auth, async (req, res) => {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar cantidad / nombre / descripcion
router.patch('/inventario/:id', auth, async (req, res) => {
  const allowed = ['nombre', 'cantidad', 'descripcion'];
  const updates = Object.keys(req.body);
  const isValid = updates.every(u => allowed.includes(u));
  if (!isValid) return res.status(400).json({ error: 'Actualización inválida.' });
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    updates.forEach(k => { item[k] = req.body[k]; });
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Eliminar
router.delete('/inventario/:id', auth, async (req, res) => {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    await item.destroy();
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
