// src/index.js — v0.1.0
require('dotenv').config();
const { getConnection } = require('./db/conexion.js');
const express  = require('express');
const cors     = require('cors');

const UserRoute      = require('./routers/user');
const PersonaRoute   = require('./routers/persona.js');
const DonacionRoute  = require('./routers/donacion.js');
const InventarioRoute = require('./routers/inventario.js');
const EntradasRoute  = require('./routers/entradas.js');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS no permitido: ' + origin));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Health check — sin auth
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() });
});

// Rutas de la API (prefijo /api para claridad)
app.use('/api', UserRoute);
app.use('/api', PersonaRoute);
app.use('/api', DonacionRoute);
app.use('/api', InventarioRoute);
app.use('/api', EntradasRoute);

// Mantener rutas sin prefijo por compatibilidad con el frontend actual
app.use(UserRoute);
app.use(PersonaRoute);
app.use(DonacionRoute);
app.use(InventarioRoute);
app.use(EntradasRoute);

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const port = process.env.PORT || 3001;
const host = process.env.HOST || '0.0.0.0';

getConnection().then(() => {
  app.listen(port, host, () => {
    console.log(`✅  API corriendo en http://${host}:${port}`);
    console.log(`✅  Health: http://${host}:${port}/health`);
  });
});
