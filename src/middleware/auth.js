// src/middleware/auth.js — v1.0.0 (Sequelize / PostgreSQL)
// JWT es stateless: verificamos firma + que el usuario exista en DB.
require('dotenv').config();
const jwt  = require('jsonwebtoken');
const User = require('../model/user');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌  JWT_SECRET no está definido en .env');
  process.exit(1);
}

const auth = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const token  = header.replace('Bearer ', '');
    const decode = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decode.id);
    if (!user) throw new Error('Usuario no encontrado');

    req.token        = token;
    req.user         = user;
    req.user.permisos = decode.permisos || [];  // del JWT
    next();
  } catch (e) {
    res.status(401).json({ error: 'No autorizado' });
  }
};

module.exports = auth;
