// src/routers/persona.js — v1.0.0 (Sequelize / PostgreSQL)
const express = require('express');
const { Op }  = require('sequelize');
const Persona = require('../model/persona');
const auth    = require('../middleware/auth');
const router  = new express.Router();

// Crear persona
router.post('/personas/register', auth, async (req, res) => {
  try {
    const persona = await Persona.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(persona);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Listar todas
router.get('/personas', auth, async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.json(personas);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Buscar por cédula — ruta específica ANTES de /:id
router.get('/personas/cedula/:cedula', auth, async (req, res) => {
  try {
    const persona = await Persona.findOne({ where: { cedula: req.params.cedula } });
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(persona);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Buscar por ID — también acepta cédula para compatibilidad con frontend
router.get('/personas/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    // Si el param tiene guiones, es una cédula; si es número, es ID
    const persona = isNaN(id)
      ? await Persona.findOne({ where: { cedula: id } })
      : await Persona.findByPk(id);
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(persona);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar
router.patch('/personas/:id', auth, async (req, res) => {
  const allowed = ['nombre', 'cedula', 'telefono', 'zona', 'direccion', 'sector'];
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });
    allowed.forEach(k => { if (req.body[k] !== undefined) persona[k] = req.body[k]; });
    await persona.save();
    res.json(persona);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Eliminar
router.delete('/personas/:id', auth, async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });
    await persona.destroy();
    res.json(persona);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
