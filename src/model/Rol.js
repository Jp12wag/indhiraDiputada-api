// src/model/Rol.js — v1.1.0
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');

const Rol = sequelize.define('Rol', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:      { type: DataTypes.STRING(50), unique: true, allowNull: false },
  descripcion: { type: DataTypes.TEXT, defaultValue: '' }
}, { tableName: 'roles', underscored: true, timestamps: false });

module.exports = Rol;
