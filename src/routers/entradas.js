const express = require('express')
const Entradas = require('../model/Entradas')
const auth = require('../middleware/auth')
const router = new express.Router();



router.post('/entradas/register', auth, async (req, res) => {
    try {
      
        const entradas = new Entradas({
            ...req.body,
            owner: req.user._id // Asignar el propietario de la persona como el ID del usuario autenticado
        });

        // Guardar la entradas en la base de datos
        await entradas.save();
        res.status(201).send(entradas);
    } catch (error) {
        console.error('Error al crear inventario:', error);
        res.status(400).send(error);
    }
});
// Endpoint GET para consultar una persona por su cédula

router.get('/entradas', auth, async (req, res) => {
    try {
        const entradas = await Entradas.find();
        res.send(entradas);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/entradas/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const inventario = await Entradas.find({ _id, owner: req.user._id });

        if (!inventario) {
            return res.status(404).send();
        }

        res.send(inventario);
    } catch (error) {
        res.status(500).send();
    }
});




router.patch('/entradas/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['nombre', 'cantidad', 'descripcion'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    console.log();
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Actualización inválida.' });
    }
    try {
        const inventario = await Entradas.findOne({ _id: req.params.id, owner: req.user._id });
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
        const persona = await Entradas.findOneAndDelete({ _id: req.params.id});

        if (!persona) {
            return res.status(404).send();
        }

        res.send(persona);
    } catch (error) {
        res.status(500).send();
    }
});
module.exports = router