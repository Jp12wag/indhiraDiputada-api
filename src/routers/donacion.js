// fix(donaciones): auth requerida en todos los endpoints — v0.1.0
const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth');
const Donacion = require('../model/donacion');

// Crear donación — requiere auth
router.post('/donaciones', auth, async (req, res) => {
  try {
    const donacion = new Donacion({ ...req.body, historial: req.user._id });
    await donacion.save();
    res.status(201).json(donacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todas — requiere auth
router.get('/donaciones', auth, async (req, res) => {
  try {
    const donaciones = await Donacion.find();
    res.json(donaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// IMPORTANTE: la ruta específica /persona/:id debe ir ANTES de /:id
// para que Express no la interprete como un ID de donación
router.get('/donaciones/persona/:personaId', auth, async (req, res) => {
  try {
    const donaciones = await Donacion.find({ owner: req.params.personaId });
    res.json(donaciones); // array vacío si no hay — no lanzar 404
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Detalle de una donación — requiere auth
router.get('/donaciones/:id', auth, async (req, res) => {
  try {
    const donacion = await Donacion.findById(req.params.id);
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    res.json(donacion);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar donación — requiere auth
router.delete('/donaciones/:id', auth, async (req, res) => {
  try {
    const donacion = await Donacion.findOneAndDelete({ _id: req.params.id });
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    res.json(donacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la donación' });
  }
});

module.exports = router;
