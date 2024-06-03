const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema para Donacion
const InventarioSchema = new Schema({
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
  fechaSalida: {
    type: Date,
    required: false,
    
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Referencia al modelo de usuario
    required: true
  }
});


const Inventario = mongoose.model('inventarios', InventarioSchema)

module.exports = Inventario;