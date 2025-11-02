import.meta.env.VITE_API_BASE
// Next: usa process.env.NEXT_PUBLIC_API_BASE
const API =
  (typeof process !== 'undefined' && (process as any).env?.NEXT_PUBLIC_API_BASE) ||
  (import.meta as any).env?.VITE_API_BASE ||
  'http://localhost:4000';

export type CartItem = { id: number; name: string; price: number; qty: number };

export async function getCartDetail(): Promise<CartItem[]> {
  const r = await fetch(`${API}/api/cart`, { cache: 'no-store' });
  if (!r.ok) throw new Error('getCartDetail failed');
  return r.json();
}

export async function addOneToCart(id_objeto: number): Promise<void> {
  const r = await fetch(`${API}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_objeto }), // <-- tu backend V1 espera este campo
  });
  if (!r.ok) throw new Error('addOneToCart failed');
}

export async function setQtyDB(id_objeto: number, qty: number): Promise<void> {
  const r = await fetch(`${API}/api/cart/items/${id_objeto}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty }),
  });
  if (!r.ok) throw new Error('setQtyDB failed');
}

export async function removeFromCartDB(id_objeto: number): Promise<void> {
  const r = await fetch(`${API}/api/cart/items/${id_objeto}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('removeFromCartDB failed');
}

export async function clearCartDB(): Promise<void> {
  const r = await fetch(`${API}/api/cart`, { method: 'DELETE' });
  if (!r.ok) throw new Error('clearCartDB failed');
}
