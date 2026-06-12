// src/routers/inventario.js — v1.2.0 (barcode + alertas + buscar + RBAC)
const express        = require('express');
const { Op }         = require('sequelize');
const Inventario     = require('../model/inventario');
const auth           = require('../middleware/auth');
const requirePermiso = require('../middleware/requirePermiso');
const router         = new express.Router();

// ── Crear producto ──────────────────────────────────────────────────────────
router.post('/inventario/register', auth, requirePermiso('inventario', 'crear'), async (req, res) => {
  try {
    const inventario = await Inventario.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(inventario);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── Buscar por código de barras — ANTES de /:id ─────────────────────────────
router.get('/inventario/buscar', auth, async (req, res) => {
  const { codigo } = req.query;
  if (!codigo) return res.status(400).json({ error: 'Parametro "codigo" requerido' });
  try {
    const item = await Inventario.findOne({ where: { codigoBarras: codigo } });
    if (!item) return res.status(404).json({ error: 'Producto no encontrado para ese codigo' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Productos con stock igual o por debajo del mínimo — ANTES de /:id ───────
router.get('/inventario/alertas', auth, async (req, res) => {
  try {
    const { sequelize: sq } = require('../db/sequelize');
    const items = await Inventario.findAll({
      where: sq.literal('cantidad <= stock_minimo AND stock_minimo > 0'),
      order: [['cantidad', 'ASC']]
    });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Imagen PNG del código de barras — ANTES de /:id ─────────────────────────
router.get('/inventario/:id/barcode.png', auth, async (req, res) => {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item)              return res.status(404).json({ error: 'Producto no encontrado' });
    if (!item.codigoBarras) return res.status(422).json({ error: 'El producto no tiene codigo de barras' });

    const bwipjs = require('bwip-js');
    const tipo   = (item.tipoCodigo || 'CODE128').toUpperCase();
    const bcid   = tipo === 'QR'
      ? 'qrcode'
      : tipo === 'EAN13' ? 'ean13'
      : tipo === 'UPC'   ? 'upca'
      : 'code128';

    const png = await bwipjs.toBuffer({
      bcid,
      text:        item.codigoBarras,
      scale:       3,
      height:      10,
      includetext: true
    });
    res.set('Content-Type', 'image/png').send(png);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Listar todo ─────────────────────────────────────────────────────────────
router.get('/inventario', auth, requirePermiso('inventario', 'leer'), async (req, res) => {
  try {
    const inventario = await Inventario.findAll({ order: [['nombre', 'ASC']] });
    res.json(inventario);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Detalle por ID ──────────────────────────────────────────────────────────
router.get('/inventario/:id', auth, requirePermiso('inventario', 'leer'), async (req, res) => {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Actualizar ──────────────────────────────────────────────────────────────
router.patch('/inventario/:id', auth, requirePermiso('inventario', 'actualizar'), async (req, res) => {
  const allowed = [
    'nombre', 'cantidad', 'descripcion',
    'codigoBarras', 'tipoCodigo', 'stockMinimo', 'unidad', 'categoria', 'ubicacion'
  ];
  const updates = Object.keys(req.body);
  const isValid = updates.every(u => allowed.includes(u));
  if (!isValid) return res.status(400).json({ error: 'Actualizacion invalida.' });
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    updates.forEach(k => { item[k] = req.body[k]; });
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── Eliminar ────────────────────────────────────────────────────────────────
router.delete('/inventario/:id', auth, requirePermiso('inventario', 'eliminar'), async (req, res) => {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    await item.destroy();
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
