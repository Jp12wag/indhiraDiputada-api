// src/model/inventario.js — v1.0.0 (Sequelize / PostgreSQL)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');

const Inventario = sequelize.define('Inventario', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING, allowNull: false },
  cantidad:     { type: DataTypes.INTEGER, defaultValue: 0 },
  descripcion:  { type: DataTypes.TEXT,    defaultValue: '' },
  fechaEntrada: { type: DataTypes.DATE,    defaultValue: DataTypes.NOW }, // → fecha_entrada
  fechaSalida:  { type: DataTypes.DATE },                                  // → fecha_salida
  ownerId:      { type: DataTypes.INTEGER }                                // → owner_id
}, {
  tableName:   'productos',
  underscored: true
});

Inventario.prototype.toJSON = function () {
  const v = this.get({ plain: true });
  v._id = v.id;
  return v;
};

module.exports = Inventario;
