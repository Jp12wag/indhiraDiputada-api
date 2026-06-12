// src/model/persona.js — v1.0.0 (Sequelize / PostgreSQL)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');

const Persona = sequelize.define('Persona', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:   { type: DataTypes.STRING,  allowNull: false },
  cedula:   { type: DataTypes.STRING(20), unique: true, allowNull: false },
  telefono: { type: DataTypes.STRING(20), allowNull: false },
  zona:     { type: DataTypes.STRING,  defaultValue: '' },
  direccion:{ type: DataTypes.STRING,  defaultValue: '' },
  sector:   { type: DataTypes.STRING,  defaultValue: '' },
  ownerId:  { type: DataTypes.INTEGER } // → owner_id via underscored
}, {
  tableName:   'personas',
  underscored: true
});

Persona.prototype.toJSON = function () {
  const v = this.get({ plain: true });
  v._id = v.id;
  return v;
};

module.exports = Persona;
