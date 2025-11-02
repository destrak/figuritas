const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// 1. Cargar las variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// 2. Validar que las claves existan
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Error: Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env");
}

// 3. Crear y exportar el cliente
// NOTA: Para un backend, lo ideal es usar la SERVICE_KEY (llave de servicio),
// ya que la ANON_KEY (llave anónima) está limitada por RLS.
// Pero continuamos con la anon_key según tu configuración.
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Cliente de Supabase inicializado una sola vez.");

module.exports = supabase;