const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema para Donacion
const EntradaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  cantidad: {
    type: Number,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  fechaEntrada: {
    type: Date,
    required: true,
    default: Date.now
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Referencia al modelo de usuario
    required: true
  }
});


const Entradas = mongoose.model('Entradas', EntradaSchema)

module.exports = Entradas;