// src/model/Permiso.js — v1.1.0
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');

const Permiso = sequelize.define('Permiso', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  recurso:     { type: DataTypes.STRING(50), allowNull: false },
  accion:      { type: DataTypes.STRING(20), allowNull: false },
  descripcion: { type: DataTypes.TEXT, defaultValue: '' }
}, { tableName: 'permisos', underscored: true, timestamps: false });

module.exports = Permiso;
