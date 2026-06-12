-- ============================================================
-- RBAC v1.1.0 — aplicar a BD existente
-- docker exec -i indhira_postgres psql -U indhira -d indhira_db < db/rbac_migration.sql
-- ============================================================

-- ── Tablas RBAC ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS permisos (
  id          SERIAL PRIMARY KEY,
  recurso     VARCHAR(50) NOT NULL,
  accion      VARCHAR(20) NOT NULL,
  descripcion TEXT DEFAULT '',
  UNIQUE (recurso, accion)
);

CREATE TABLE IF NOT EXISTS roles_permisos (
  rol_id     INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permiso_id INTEGER REFERENCES permisos(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

-- ── Seed: 4 roles ──────────────────────────────────────────
INSERT INTO roles (nombre, descripcion) VALUES
  ('Administrador', 'Acceso total al sistema'),
  ('Gestor',        'Gestión de personas, donaciones e inventario'),
  ('Operador',      'Registro de donaciones y entradas de inventario'),
  ('Consultor',     'Solo lectura en todos los módulos')
ON CONFLICT (nombre) DO NOTHING;

-- ── Seed: 20 permisos (5 recursos × 4 acciones) ────────────
INSERT INTO permisos (recurso, accion) VALUES
  ('usuarios',   'crear'),    ('usuarios',   'leer'),
  ('usuarios',   'actualizar'),('usuarios',  'eliminar'),
  ('personas',   'crear'),    ('personas',   'leer'),
  ('personas',   'actualizar'),('personas',  'eliminar'),
  ('inventario', 'crear'),    ('inventario', 'leer'),
  ('inventario', 'actualizar'),('inventario','eliminar'),
  ('donaciones', 'crear'),    ('donaciones', 'leer'),
  ('donaciones', 'actualizar'),('donaciones','eliminar'),
  ('entradas',   'crear'),    ('entradas',   'leer'),
  ('entradas',   'actualizar'),('entradas',  'eliminar')
ON CONFLICT (recurso, accion) DO NOTHING;

-- ── Administrador: todos los permisos ──────────────────────
INSERT INTO roles_permisos (rol_id, permiso_id)
  SELECT r.id, p.id FROM roles r, permisos p
  WHERE r.nombre = 'Administrador'
ON CONFLICT DO NOTHING;

-- ── Gestor: todo menos eliminar usuarios ───────────────────
INSERT INTO roles_permisos (rol_id, permiso_id)
  SELECT r.id, p.id FROM roles r
  JOIN permisos p ON NOT (p.recurso = 'usuarios' AND p.accion = 'eliminar')
  WHERE r.nombre = 'Gestor'
ON CONFLICT DO NOTHING;

-- ── Operador: leer usuarios, CRUD reducido ─────────────────
INSERT INTO roles_permisos (rol_id, permiso_id)
  SELECT r.id, p.id FROM roles r
  JOIN permisos p ON (
    (p.recurso = 'usuarios'   AND p.accion = 'leer') OR
    (p.recurso = 'personas'   AND p.accion IN ('crear','leer','actualizar')) OR
    (p.recurso = 'inventario' AND p.accion IN ('leer','actualizar')) OR
    (p.recurso = 'donaciones' AND p.accion IN ('crear','leer','eliminar')) OR
    (p.recurso = 'entradas'   AND p.accion IN ('crear','leer'))
  )
  WHERE r.nombre = 'Operador'
ON CONFLICT DO NOTHING;

-- ── Consultor: solo leer ───────────────────────────────────
INSERT INTO roles_permisos (rol_id, permiso_id)
  SELECT r.id, p.id FROM roles r
  JOIN permisos p ON p.accion = 'leer'
  WHERE r.nombre = 'Consultor'
ON CONFLICT DO NOTHING;
