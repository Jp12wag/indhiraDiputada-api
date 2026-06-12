-- ============================================================
-- Indhira Diputada — Esquema PostgreSQL v0.2.0
-- Ejecutado automáticamente al crear el contenedor postgres
-- ============================================================

-- ── Tabla: users ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE,
  password    VARCHAR(255),
  name_user   VARCHAR(255) UNIQUE NOT NULL,
  roles       VARCHAR(50)  NOT NULL DEFAULT 'usuario',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabla: personas ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS personas (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(255) NOT NULL,
  cedula     VARCHAR(20)  UNIQUE NOT NULL,
  telefono   VARCHAR(20)  NOT NULL,
  zona       VARCHAR(255) NOT NULL DEFAULT '',
  direccion  VARCHAR(255) NOT NULL DEFAULT '',
  sector     VARCHAR(255) NOT NULL DEFAULT '',
  owner_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabla: productos (inventario) ──────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(255) NOT NULL,
  cantidad      INTEGER      NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
  descripcion   TEXT         NOT NULL DEFAULT '',
  fecha_entrada TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  fecha_salida  TIMESTAMPTZ,
  owner_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabla: donaciones ──────────────────────────────────────
-- donacion = nombre del producto entregado (string denormalizado por velocidad)
-- persona_id = quién recibió
-- user_id    = quién registró (staff)
CREATE TABLE IF NOT EXISTS donaciones (
  id         SERIAL PRIMARY KEY,
  donacion   VARCHAR(255) NOT NULL,
  cantidad   INTEGER      NOT NULL CHECK (cantidad > 0),
  fecha      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabla: entradas (movimientos de entrada al inventario) ─
CREATE TABLE IF NOT EXISTS entradas (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(255) NOT NULL,
  cantidad      INTEGER      NOT NULL CHECK (cantidad > 0),
  descripcion   TEXT         NOT NULL DEFAULT '',
  fecha_entrada TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  owner_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Función + triggers para updated_at automático ──────────
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated_at') THEN
    CREATE TRIGGER trg_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_personas_updated_at') THEN
    CREATE TRIGGER trg_personas_updated_at
      BEFORE UPDATE ON personas
      FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_productos_updated_at') THEN
    CREATE TRIGGER trg_productos_updated_at
      BEFORE UPDATE ON productos
      FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
  END IF;
END $$;

-- ── Índices ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_personas_cedula    ON personas(cedula);
CREATE INDEX IF NOT EXISTS idx_donaciones_persona ON donaciones(persona_id);
CREATE INDEX IF NOT EXISTS idx_donaciones_fecha   ON donaciones(fecha);
CREATE INDEX IF NOT EXISTS idx_productos_nombre   ON productos(nombre);
