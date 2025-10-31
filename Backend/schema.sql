-- --- Tabla de Usuarios ---
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla de Productos/Objetos ---
CREATE TABLE Objeto (
  id_objeto SERIAL PRIMARY KEY,
  title VARCHAR(255),
  body TEXT,
  user_id INTEGER REFERENCES users(id), -- Vendedor
  precio DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla del Carrito de Compras ---
CREATE TABLE carrito (
  id_car SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla para los Items dentro del Carrito ---
CREATE TABLE carrito_items (
  id_item SERIAL PRIMARY KEY,
  id_car INTEGER REFERENCES carrito(id_car),
  id_objeto INTEGER REFERENCES Objeto(id_objeto),
  cantidad INTEGER NOT NULL DEFAULT 1
);

-- --- Tabla para registrar las Compras ---
CREATE TABLE compras (
  id_compra SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id), -- Comprador
  id_objeto INTEGER REFERENCES Objeto(id_objeto),
  cantidad INTEGER,
  precio_unitario DECIMAL(10, 2),
  fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);