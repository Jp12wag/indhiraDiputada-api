// index.js
const { getConnection } = require('./db/conexion.js');
const express = require('express');
const cors = require('cors');
const UserRoute = require('./routers/user');
const PersonaRoute = require('./routers/persona.js');
const DonacionRoute = require('./routers/donacion.js');
const InventarioRoute = require('./routers/inventario.js');
const EntradasRoute = require('./routers/entradas.js');

const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para el análisis del cuerpo de la solicitud JSON
app.use(express.json());

// Rutas de la API
app.use(UserRoute);
app.use(PersonaRoute);
app.use(DonacionRoute);
app.use(InventarioRoute);
app.use(EntradasRoute);

const port = process.env.PORT || 3001;
const host = process.env.HOST || '0.0.0.0';

// Esperar a que la conexión se establezca antes de iniciar el servidor
getConnection().then(() => {
    app.listen(port, host, () => {
        console.log('Server running... http://' + host + ':' + port);
    });
});
