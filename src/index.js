// src/index.js — v1.1.0 (RBAC)
require('dotenv').config();
const { connectPostgres } = require('./db/sequelize');
const express  = require('express');
const cors     = require('cors');

const UserRoute       = require('./routers/user');
const PersonaRoute    = require('./routers/persona');
const DonacionRoute   = require('./routers/donacion');
const InventarioRoute = require('./routers/inventario');
const EntradasRoute   = require('./routers/entradas');
const RbacRoute       = require('./routers/rbac');

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.1.0', db: 'postgres', timestamp: new Date().toISOString() });
});

// Rutas con prefijo /api
app.use('/api', UserRoute);
app.use('/api', PersonaRoute);
app.use('/api', DonacionRoute);
app.use('/api', InventarioRoute);
app.use('/api', EntradasRoute);
app.use('/api', RbacRoute);

// Rutas sin prefijo (compatibilidad con el frontend actual)
app.use(UserRoute);
app.use(PersonaRoute);
app.use(DonacionRoute);
app.use(InventarioRoute);
app.use(EntradasRoute);
app.use(RbacRoute);

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const port = process.env.PORT || 3001;
const host = process.env.HOST || '0.0.0.0';

connectPostgres()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`✅  API corriendo en http://${host}:${port}`);
      console.log(`✅  Health: http://${host}:${port}/health`);
    });
  })
  .catch((err) => {
    console.error('❌  No se pudo conectar a PostgreSQL:', err.message);
    process.exit(1);
  });
