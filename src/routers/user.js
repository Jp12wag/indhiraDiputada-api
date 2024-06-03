const express = require('express')
const User = require('../model/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(user);

    try {
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.nameUser, req.body.password)
        const token = await user.generateAuthToken() ;
        res.send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})
// Revision
router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})
router.get('/users', auth, async (req, res) => {
    try {
      // Consultar todos los usuarios
      const users = await User.find();
      res.send(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).send('Error interno del servidor');
    }
  });

router.get('/users/me', auth, async (req, res) => {res.send(req.user)})



router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    console.log("Valor"+req.body);
    const allowedUpdates = ['name', 'email', 'roles','nameUser']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
   
    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = req.user

        updates.forEach((update) => user[update] = req.body[update])
        
        await user.save()

        res.send(user)
    } catch (e) {

    }
})

router.patch('/users', auth, async (req, res) => {
    const bodyId = req.body._id; // Obtener el ID del usuario desde el cuerpo de la solicitud
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'roles'];
   

    try {
        // Buscar al usuario por su ID en el cuerpo de la solicitud
        const user = await User.findById(bodyId);

        if (!user) {
            return res.status(404).send({ error: 'User not found!' });
        }

        // Aplicar las actualizaciones al usuario encontrado
        updates.forEach((update) => user[update] = req.body[update]);
        
        await user.save();

        res.send(user);
    } catch (e) {
        // Manejar errores
    }
});


router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// Ruta para eliminar un usuario por su ID
router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Buscar y eliminar el usuario por su ID
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).send('Usuario no encontrado');
      }
  
      res.send(deletedUser);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  

module.exports = router