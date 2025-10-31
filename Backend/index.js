// servidor/index.js

const express = require('express');
const cors = require('cors'); //  Importa cors
const app = express();
const port = 3001;

// --- MIDDLEWARE ---
app.use(cors()); // Permite todas las solicitudes (para desarrollo)
app.use(express.json()); // Permite al servidor entender JSON

// --- RUTAS (API) ---
app.get('/api/saludo', (req, res) => {
  res.json({ message: '¡Hola desde el backend!' });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});