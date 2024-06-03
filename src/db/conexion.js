require('dotenv').config();
const mongoose = require('mongoose');
const database = 'indhiraDiputada';
const uri = `mongodb+srv://walcantara:Jipon1212@indhiradiputada.gtnkrco.mongodb.net/?retryWrites=true&w=majority&appName=${database}`;

const connectionPromise =mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conexión a MongoDB en la nube exitosa');
})
.catch((error) => {
  console.error('Error al conectar a MongoDB en la nube:', error);
});

module.exports = {
    getConnection: () => connectionPromise,
};


