-- v1.2.0 — Productos: campos de código de barras y control de stock mínimo
ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS codigo_barras VARCHAR(50),
  ADD COLUMN IF NOT EXISTS tipo_codigo   VARCHAR(20) NOT NULL DEFAULT 'CODE128',
  ADD COLUMN IF NOT EXISTS stock_minimo  INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unidad        VARCHAR(20) NOT NULL DEFAULT 'unidad',
  ADD COLUMN IF NOT EXISTS categoria     VARCHAR(50) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ubicacion     VARCHAR(100) NOT NULL DEFAULT '';

-- Índice único parcial: solo aplica cuando hay código registrado y no es vacío
CREATE UNIQUE INDEX IF NOT EXISTS idx_productos_codigo_barras
  ON productos(codigo_barras)
  WHERE codigo_barras IS NOT NULL AND codigo_barras <> '';
