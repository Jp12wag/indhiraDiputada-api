// src/model/Entradas.js — v1.0.0 (Sequelize / PostgreSQL)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');

const Entradas = sequelize.define('Entradas', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING,  allowNull: false },
  cantidad:     { type: DataTypes.INTEGER, allowNull: false },
  descripcion:  { type: DataTypes.TEXT,    defaultValue: '' },
  fechaEntrada: { type: DataTypes.DATE,    defaultValue: DataTypes.NOW }, // → fecha_entrada
  ownerId:      { type: DataTypes.INTEGER }                                // → owner_id
}, {
  tableName:   'entradas',
  underscored: true,
  updatedAt:   false
});

Entradas.prototype.toJSON = function () {
  const v = this.get({ plain: true });
  v._id = v.id;
  return v;
};

module.exports = Entradas;
