// src/model/inventario.js — v1.2.0 (barcode + stock mínimo + unidad/categoria/ubicacion)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');

const Inventario = sequelize.define('Inventario', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING,  allowNull: false },
  cantidad:     { type: DataTypes.INTEGER, defaultValue: 0 },
  descripcion:  { type: DataTypes.TEXT,    defaultValue: '' },
  codigoBarras: { type: DataTypes.STRING(50) },                              // → codigo_barras
  tipoCodigo:   { type: DataTypes.STRING(20), defaultValue: 'CODE128' },    // → tipo_codigo
  stockMinimo:  { type: DataTypes.INTEGER,    defaultValue: 0 },            // → stock_minimo
  unidad:       { type: DataTypes.STRING(20), defaultValue: 'unidad' },
  categoria:    { type: DataTypes.STRING(50), defaultValue: '' },
  ubicacion:    { type: DataTypes.STRING(100), defaultValue: '' },
  fechaEntrada: { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },   // → fecha_entrada
  fechaSalida:  { type: DataTypes.DATE },                                    // → fecha_salida
  ownerId:      { type: DataTypes.INTEGER }                                  // → owner_id
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
