// Importamos el cliente de Supabase
const supabase = require('./supabaseClient');

/**
 * Función 1: Intenta vender un objeto reduciendo su stock en 1.
 * Llama a la función SQL 'decrementar_stock_objeto'.
 *
 * @param {number} id_objeto El ID del objeto a vender.
 * @returns {object} El objeto actualizado con el nuevo stock.
 * @throws {Error} Si no hay stock o si ocurre un error en la DB.
 */
async function venderObjeto(id_objeto) {
  
  console.log(`Intentando vender objeto con id: ${id_objeto}`);

  // Llamamos a la función 'decrementar_stock_objeto' que creaste en Supabase
  const { data, error } = await supabase
    .rpc('decrementar_stock_objeto', {
      p_id_objeto: id_objeto,
      p_cantidad_a_restar: 1
    });

  // Manejo de error general de la base de datos
  if (error) {
    console.error('Error al llamar a RPC "decrementar_stock_objeto":', error.message);
    throw new Error(`Error en la base de datos: ${error.message}`);
  }

  // Si 'data' está vacío, significa que la condición WHERE (stock >= 1) falló.
  if (!data || data.length === 0) {
    console.warn(`Venta fallida: No hay stock suficiente para el objeto ${id_objeto}.`);
    throw new Error('No hay stock suficiente para este objeto.');
  }

  // Si todo salió bien, 'data' contiene un array con el objeto actualizado
  const objetoVendido = data[0];
  console.log(`¡Venta exitosa! Nuevo stock para ${objetoVendido.title}: ${objetoVendido.stock}`);
  
  return objetoVendido;
}

/**
 * Función 2: Llama a la función 'finalizar_compra' en Supabase.
 *
 * @returns {string} El mensaje de éxito de la base de datos.
 * @throws {Error} Si ocurre un error en la DB.
 */
async function finalizarCompra() {
  console.log('Llamando a RPC "finalizar_compra"...');

  const { data, error } = await supabase
    .rpc('finalizar_compra');

  if (error) {
    console.error('Error al llamar a RPC "finalizar_compra":', error.message);
    throw new Error(`Error al finalizar la compra: ${error.message}`);
  }

  // Devuelve el mensaje de éxito (ej: "Compra exitosa")
  console.log('Respuesta de "finalizar_compra":', data);
  return data;
}

// Exportamos ambas funciones para que tu index.js pueda usarlas
module.exports = {
  venderObjeto,
  finalizarCompra
};