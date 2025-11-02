const express = require('express');
const cors = require('cors');


const supabase = require('./supabaseClient');

const app = express();
const port = 4000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// --- RUTAS (API) ---
app.get('/api/saludo', (req, res) => {
  res.json({ message: '¡Hola desde el backend!' });
});

// Importamos las funciones de prueba
// (Este archivo AHORA también usará el cliente compartido)
const { getDatabaseInfo } = require('./supabaseTests');

//Funciones
const { venderObjeto, finalizarCompra } = require('./controlObjetos');

app.post('api/comprar/:id', async (req, res) => {try {
    const idObjeto = parseInt(req.params.id, 10);
    
    if (isNaN(idObjeto)) {
      return res.status(400).json({ error: 'ID de objeto inválido.' });
    }

    const objetoActualizado = await venderObjeto(idObjeto);
    res.status(200).json({ success: true, objeto: objetoActualizado });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/finalizar-compra', async (req, res) => {
  try {
    const mensaje = await finalizarCompra();
    res.status(200).json({ success: true, message: mensaje });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Ruta para obtener información de la base de datos
app.get('/api/database-info', async (req, res) => {
  try {
    const dbInfo = await getDatabaseInfo();
    res.json(dbInfo);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});