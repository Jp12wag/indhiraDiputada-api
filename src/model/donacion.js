// src/model/donacion.js — v1.0.0 (Sequelize / PostgreSQL)
// Mapeo de campos MongoDB → PostgreSQL:
//   owner    (persona ObjectId) → persona_id
//   historial (user ObjectId)  → user_id
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');

const Donacion = sequelize.define('Donacion', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  donacion:  { type: DataTypes.STRING,  allowNull: false },
  cantidad:  { type: DataTypes.INTEGER, allowNull: false },
  fecha:     { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
  personaId: { type: DataTypes.INTEGER }, // → persona_id (ex-owner)
  userId:    { type: DataTypes.INTEGER }  // → user_id    (ex-historial)
}, {
  tableName:   'donaciones',
  underscored: true,
  updatedAt:   false   // la tabla donaciones no tiene updated_at
});

Donacion.prototype.toJSON = function () {
  const v = this.get({ plain: true });
  v._id      = v.id;
  v.owner    = v.personaId;    // compatibilidad frontend
  v.historial = v.userId;
  return v;
};

module.exports = Donacion;
