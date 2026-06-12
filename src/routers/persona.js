// fix(personas): auth en todas las rutas + resolver conflicto /:cedula vs /:id — v0.1.0
const express = require('express');
const Persona = require('../model/persona');
const auth    = require('../middleware/auth');
const router  = new express.Router();

// Crear persona
router.post('/personas/register', auth, async (req, res) => {
  try {
    const persona = new Persona({ ...req.body, owner: req.user._id });
    await persona.save();
    res.status(201).json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todas las personas
router.get('/personas', auth, async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// FIX: rutas específicas ANTES de la ruta genérica /:param
// Buscar por cédula — ruta explícita con prefijo "cedula"
// El frontend llama GET /personas/cedula/000-0000000-0
router.get('/personas/cedula/:cedula', auth, async (req, res) => {
  try {
    const persona = await Persona.findOne({ cedula: req.params.cedula });
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Buscar por ID de MongoDB
router.get('/personas/:id', auth, async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




router.patch('/personas/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['nombre', 'cedula', 'telefono', 'zona', 'direccion','sector'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Actualización inválida.' });
    }

    try {
        // Buscar la persona por id y dueño
        const persona = await Persona.findOne({ _id: req.params.id, owner: req.user._id });

        if (!persona) {
            return res.status(404).send();
        }

        // Actualizar los campos permitidos
        updates.forEach(update => persona[update] = req.body[update]);
        await persona.save();

        res.send(persona);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/personas/:id', auth, async (req, res) => {
    try {
        const persona = await Persona.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!persona) {
            return res.status(404).send();
        }

        res.send(persona);
    } catch (error) {
        res.status(500).send();
    }
});
module.exports = router