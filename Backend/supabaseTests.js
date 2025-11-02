const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;

const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; 

// Validamos que las claves existan
if (!supabaseUrl || !supabaseAnonKey) {
    
    throw new Error("Error: Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env");
}

// Creamos un cliente de Supabase para este módulo
// Usamos la anon_key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 🚨 CAMBIO: Función actualizada para leer los primeros 5 usuarios.
 * Esto es algo que la 'anon_key' PUEDE hacer (si RLS lo permite).
 * La función anterior (get_public_tables) requería la service_key.
 */
async function getDatabaseInfo() {
  
  if (!supabase) {
    throw new Error("Cliente de Supabase no inicializado.");
  }

  console.log('Intentando leer los primeros 5 registros de la tabla "users"...');

  // 1. Llamamos a la tabla 'users'
  const { data, error } = await supabase
    .from('objetos') // Asumiendo que tienes una tabla 'users'
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error al leer la tabla "users":', error.message);
    throw new Error(`Error al leer la tabla "users": ${error.message}. ¿La tabla 'users' existe?`);
  }

  // Si todo salió bien, devuelve la información
  return {
    success: true,
    message: "¡Lectura de la tabla 'users' exitosa!",
    // 🚨 NOTA: Si RLS (Row Level Security) está activado para 'users', 'data' será un array vacío [].
    // Esto no es un error, es la seguridad de Supabase funcionando.
    status: data.length === 0 ? "Respuesta OK, pero la tabla está vacía o RLS está activado." : "Datos obtenidos",
    user_count: data.length,
    users_preview: data 
  };
}

// Exportamos la función para que index.js pueda importarla
module.exports = {
  getDatabaseInfo
};