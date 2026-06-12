// src/db/sequelize.js — v0.2.0
// Conexión a PostgreSQL via Sequelize.
// Los modelos se migraran de Mongoose a Sequelize en v1.0.0.
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'indhira_db',
  process.env.DB_USER || 'indhira',
  process.env.DB_PASS || 'indhira_pass',
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    parseInt(process.env.DB_PORT  || '5432', 10),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000
    }
  }
);

const connectPostgres = async () => {
  await sequelize.authenticate();
  console.log('✅  PostgreSQL conectado');
};

module.exports = { sequelize, connectPostgres };
