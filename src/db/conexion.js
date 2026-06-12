// fix(auth): credenciales movidas a .env — v0.1.0
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌  MONGODB_URI no está definida en .env — copia .env.example a .env');
  process.exit(1);
}

const connectionPromise = mongoose.connect(uri)
  .then(() => console.log('✅  Conexión a MongoDB exitosa'))
  .catch((error) => {
    console.error('❌  Error conectando a MongoDB:', error.message);
    process.exit(1);
  });

module.exports = { getConnection: () => connectionPromise };


