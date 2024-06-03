const express = require('express')
const Inventario = require('../model/inventario')
const auth = require('../middleware/auth')
const router = new express.Router();



router.post('/inventario/register', auth, async (req, res) => {
    try {
      
        const inventario = new Inventario({
            ...req.body,
            owner: req.user._id // Asignar el propietario de la persona como el ID del usuario autenticado
        });

        // Guardar la persona en la base de datos
        await inventario.save();
        res.status(201).send(inventario);
    } catch (error) {
        console.error('Error al crear inventario:', error);
        res.status(400).send(error);
    }
});
// Endpoint GET para consultar una persona por su cédula

router.get('/inventario', auth, async (req, res) => {
    try {
        const inventario = await Inventario.find();
        res.send(inventario);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/invetario/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const inventario = await Inventario.find({ _id, owner: req.user._id });

        if (!inventario) {
            return res.status(404).send();
        }

        res.send(inventario);
    } catch (error) {
        res.status(500).send();
    }
});




router.patch('/inventario/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['nombre', 'cantidad', 'descripcion'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    console.log();
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Actualización inválida.' });
    }
    try {
        const inventario = await Inventario.findOne({ _id: req.params.id, owner: req.user._id });
        if (!inventario) {
            return res.status(404).send();
        }

        updates.forEach(update => inventario[update] = req.body[update]);
        await inventario.save();

        res.send(inventario);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/inventario/:id', auth, async (req, res) => {
    try {
        const persona = await Inventario.findOneAndDelete({ _id: req.params.id});

        if (!persona) {
            return res.status(404).send();
        }

        res.send(persona);
    } catch (error) {
        res.status(500).send();
    }
});
module.exports = router