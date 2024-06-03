const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Esquema para Persona
const personaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  cedula: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  zona: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  sector: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Referencia al modelo de usuario
    required: true
  }
});



const Persona = mongoose.model('personas', personaSchema)

module.exports = Persona;
