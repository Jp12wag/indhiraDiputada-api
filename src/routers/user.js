// src/routers/user.js — v1.0.0 (Sequelize / PostgreSQL)
const express = require('express');
const User    = require('../model/user');
const auth    = require('../middleware/auth');
const router  = new express.Router();

// Crear usuario — solo Administrador
router.post('/users', auth, async (req, res) => {
  if (req.user.roles !== 'Administrador') {
    return res.status(403).json({ error: 'Sin permiso para crear usuarios' });
  }
  try {
    const user = await User.create({
      name:     req.body.name,
      email:    req.body.email,
      password: req.body.password,
      nameUser: req.body.nameUser,
      roles:    req.body.roles || 'usuario'
    });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Login — devuelve user, token y permisos del rol
router.post('/users/login', async (req, res) => {
  try {
    const user    = await User.findByCredentials(req.body.nameUser, req.body.password);
    const token   = await user.generateAuthToken();
    const jwt     = require('jsonwebtoken');
    const decoded = jwt.decode(token);
    res.json({ user, token, permisos: decoded.permisos || [] });
  } catch (e) {
    res.status(400).json({ error: 'Credenciales incorrectas' });
  }
});

// Logout (stateless JWT — solo responde ok)
router.post('/users/logout', auth, (req, res) => res.json({ ok: true }));
router.post('/logout',       auth, (req, res) => res.json({ ok: true }));

// Listar todos
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Perfil propio
router.get('/users/me', auth, (req, res) => res.json(req.user));

// Editar perfil propio
router.patch('/users/me', auth, async (req, res) => {
  const allowed = ['name', 'email', 'roles', 'nameUser'];
  const updates = Object.keys(req.body).filter(k => allowed.includes(k));
  try {
    updates.forEach(k => { req.user[k] = req.body[k]; });
    await req.user.save();
    res.json(req.user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Editar cualquier usuario (admin) — acepta _id o id en body
router.patch('/users', auth, async (req, res) => {
  const bodyId = req.body._id || req.body.id;
  const allowed = ['name', 'email', 'roles'];
  try {
    const user = await User.findByPk(bodyId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    allowed.forEach(k => { if (req.body[k] !== undefined) user[k] = req.body[k]; });
    await user.save();
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Eliminar usuario — solo Administrador
router.delete('/users/:id', auth, async (req, res) => {
  if (req.user.roles !== 'Administrador') {
    return res.status(403).json({ error: 'Sin permiso para eliminar usuarios' });
  }
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
