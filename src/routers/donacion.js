// src/routers/donacion.js — v1.0.0 (Sequelize / PostgreSQL)
// Frontend envía: { donacion, cantidad, owner: persona._id, historial: usuario._id }
// Mapeamos: owner → personaId, historial → userId
const express  = require('express');
const Donacion = require('../model/donacion');
const auth     = require('../middleware/auth');
const router   = new express.Router();

// Crear donación
router.post('/donaciones', auth, async (req, res) => {
  try {
    const donacion = await Donacion.create({
      donacion:  req.body.donacion,
      cantidad:  req.body.cantidad,
      personaId: req.body.owner      || req.body.personaId,
      userId:    req.user.id
    });
    res.status(201).json(donacion);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Listar todas
router.get('/donaciones', auth, async (req, res) => {
  try {
    const donaciones = await Donacion.findAll();
    res.json(donaciones);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// IMPORTANTE: ruta específica /persona/:id ANTES de /:id
router.get('/donaciones/persona/:personaId', auth, async (req, res) => {
  try {
    const donaciones = await Donacion.findAll({
      where: { persona_id: req.params.personaId }
    });
    res.json(donaciones);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Detalle de una donación
router.get('/donaciones/:id', auth, async (req, res) => {
  try {
    const donacion = await Donacion.findByPk(req.params.id);
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    res.json(donacion);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar donación
router.delete('/donaciones/:id', auth, async (req, res) => {
  try {
    const donacion = await Donacion.findByPk(req.params.id);
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    await donacion.destroy();
    res.json(donacion);
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar la donación' });
  }
});

module.exports = router;
