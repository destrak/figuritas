import { supabase } from '../../lib/supabaseClient'

const CAR_ID = 1 // carrito demo global

type Row = {
  id_item: number
  id_objeto: number
  cantidad: number
  objetos: { id_objeto: number; titulo: string; precio: number } | null
}

// Devuelve [{id, name, price, qty}]
export async function getCartDetail() {
  const { data, error } = await supabase
    .from('carrito_items')
    .select('id_item,id_objeto,cantidad, objetos (id_objeto,titulo,precio)')
    .eq('id_car', CAR_ID)
    .order('id_item', { ascending: true })

  if (error) throw error
  const rows = (data as unknown as Row[]) ?? []

  return rows
    .filter(r => r.objetos)
    .map(r => ({
      id: r.id_objeto,
      name: r.objetos!.titulo,
      price: Number(r.objetos!.precio ?? 0),
      qty: r.cantidad,
    }))
}
export async function removeFromCartDB(id_objeto: number) {
  const { error } = await supabase
    .from('carrito_items')
    .delete()
    .match({ id_car: CAR_ID, id_objeto })
  if (error) throw error
}
export async function addOneToCart(id_objeto: number) {
  const { data: found, error: e1 } = await supabase
    .from('carrito_items')
    .select('id_item,cantidad')
    .eq('id_car', CAR_ID)
    .eq('id_objeto', id_objeto)
    .maybeSingle()
  if (e1) throw e1

  if (found) {
    const { error } = await supabase
      .from('carrito_items')
      .update({ cantidad: found.cantidad + 1 })
      .eq('id_item', found.id_item)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('carrito_items')
      .insert({ id_car: CAR_ID, id_objeto, cantidad: 1 })
    if (error) throw error
  }
}

export async function setQtyDB(id_objeto: number, qty: number) {
  if (qty <= 0) {
    const { error } = await supabase
      .from('carrito_items')
      .delete()
      .match({ id_car: CAR_ID, id_objeto })
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('carrito_items')
      .update({ cantidad: qty })
      .match({ id_car: CAR_ID, id_objeto })
    if (error) throw error
  }
}

export async function clearCartDB() {
  const { error } = await supabase
    .from('carrito_items')
    .delete()
    .eq('id_car', CAR_ID)
  if (error) throw error
}
