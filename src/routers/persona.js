const express = require('express')
const Persona = require('../model/persona')
const auth = require('../middleware/auth')
const router = new express.Router();


router.post('/personas/register', auth, async (req, res) => {
    try {
       
        const persona = new Persona({
            ...req.body,
            owner: req.user._id // Asignar el propietario de la persona como el ID del usuario autenticado
        });
        console.log(req.body);
        // Guardar la persona en la base de datos
        await persona.save();
        res.status(201).send(persona);
    } catch (error) {
        console.error('Error al crear persona:', error.message);
        res.status(400).send(error.message);
    }
});
// Endpoint GET para consultar una persona por su cédula
router.get('/personas/:cedula', async (req, res) => {
    const cedula = req.params.cedula; // Obtiene la cédula de los parámetros de la URL

    try {
        // Realiza la consulta a la base de datos para encontrar la persona por su cédula
        const persona = await Persona.findOne({ cedula });

        // Si no se encuentra ninguna persona con esa cédula, devuelve un código de estado 404
        if (!persona) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }

        // Si se encuentra la persona, devuelve los datos de la persona como respuesta
        res.json(persona);
    } catch (error) {
        // Si ocurre algún error durante la consulta, devuelve un código de estado 500
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/personas', auth, async (req, res) => {
    try {
        const personas = await Persona.find();
        res.send(personas);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/personas/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const persona = await Persona.findOne({ _id, owner: req.user._id });

        if (!persona) {
            return res.status(404).send();
        }

        res.send(persona);
    } catch (error) {
        res.status(500).send();
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