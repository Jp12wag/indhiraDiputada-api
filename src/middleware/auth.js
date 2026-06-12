// fix(auth): JWT secret movido a process.env.JWT_SECRET — v0.1.0
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

    // Verificar que el token siga activo en la lista del usuario
    const user = await User.findOne({ _id: decode._id, 'tokens.token': token });
    if (!user) throw new Error('Token inválido');

    req.token = token;
    req.user  = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'No autorizado' });
  }
};

module.exports = auth;