const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const Donacion = require('../model/donacion');

router.post('/donaciones', async (req, res) => {
    const donacion = new Donacion(req.body);

    try {
        await donacion.save();
        res.status(201).send(donacion);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/donaciones', async (req, res) => {
    try {
        const donaciones = await Donacion.find();
        res.send(donaciones);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/donaciones/:id', async (req, res) => {
    try {
        const donacion = await Donacion.findById(req.params.id);

        if (!donacion) {
            return res.status(404).send();
        }

        res.send(donacion);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtener todas las donaciones por persona (owner)
router.get('/donaciones/persona/:personaId', async (req, res) => {
    try {
        const donaciones = await Donacion.find({ owner: req.params.personaId });

        if (donaciones.length === 0) {
            return res.status(404).send({ message: 'No se encontraron donaciones para esta persona.' });
        }

        res.send(donaciones);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/donaciones/:id', auth, async (req, res) => {
    console.log('DELETE request received');
    console.log('User ID from auth middleware:', req.user._id);
    console.log('Donation ID from params:', req.params.id);

    try {
        const donacion = await Donacion.findOneAndDelete({ _id: req.params.id});

        if (!donacion) {
            console.log('Donation not found or user is not the owner');
            return res.status(404).send({ error: 'Donación no encontrada.' });
        }

        console.log('Donation deleted successfully:', donacion);
        res.status(200).send(donacion);
    } catch (error) {
        console.error('Error al eliminar donación:', error);
        res.status(500).send({ error: 'Error al eliminar la donación.' });
    }
});

module.exports = router;
