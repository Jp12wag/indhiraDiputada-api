// src/model/user.js — v1.0.0 (Sequelize / PostgreSQL)
require('dotenv').config();
const { DataTypes } = require('sequelize');
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const { sequelize } = require('../db/sequelize');

const JWT_SECRET     = process.env.JWT_SECRET     || 'dev-fallback-inseguro';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING
  },
  nameUser: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  roles: {
    type: DataTypes.STRING(50),
    defaultValue: 'usuario'
  }
}, {
  tableName:   'users',
  underscored: true,  // nameUser → name_user, createdAt → created_at
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    }
  }
});

// Compatibilidad con código que usa ._id (heredado de MongoDB)
User.prototype.toJSON = function () {
  const v = this.get({ plain: true });
  delete v.password;
  v._id = v.id;
  return v;
};

User.prototype.generateAuthToken = async function () {
  // Cargar permisos del rol desde la DB
  let permisos = [];
  try {
    const { sequelize: sq } = require('../db/sequelize');
    const rows = await sq.query(
      `SELECT p.recurso || ':' || p.accion AS permiso
       FROM permisos p
       JOIN roles_permisos rp ON rp.permiso_id = p.id
       JOIN roles r ON r.id = rp.rol_id
       WHERE r.nombre = :rolNombre`,
      { replacements: { rolNombre: this.roles }, type: sq.QueryTypes.SELECT }
    );
    permisos = rows.map(r => r.permiso);
  } catch (_) {
    // Si las tablas RBAC no existen aún, continuar sin permisos
  }

  return jwt.sign(
    { id: this.id, roles: this.roles, permisos },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

User.findByCredentials = async (nameUser, password) => {
  const user = await User.findOne({ where: { name_user: nameUser } });
  if (!user) throw new Error('Error de login');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Error de login');
  return user;
};

module.exports = User;
