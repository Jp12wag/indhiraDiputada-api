  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  // Esquema para Donacion
  const donacionSchema = new Schema({
      donacion: {
        type: String,
        required: true,
        trim: true
      },
      cantidad: {
        type: Number,
        required: true,
        trim: true
      },
      fecha: {
        type: Date,
        required: true,
        default: Date.now
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'persona', // Referencia al modelo de usuario
        required: true
      },
      historial:{
        type: Schema.Types.ObjectId,
        ref: 'user', // Referencia al modelo de usuario
        required: true
      }
    });

    
    const Donacion = mongoose.model('donaciones', donacionSchema)

  module.exports = Donacion;