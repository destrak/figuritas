const API_URL = 'http://localhost:4000/api/cart';

// Define un tipo para los productos del carrito que devuelve tu API
export type CartItemDTO = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

// GET /api/cart
export const getCartItems = async (): Promise<CartItemDTO[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudo obtener el carrito.');
  }
  return response.json();
};

// POST /api/cart
export const addItemToOneCart = async (productId: number): Promise<void> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_objeto: productId }),
  });
  if (!response.ok) {
    throw new Error('No se pudo agregar el producto.');
  }
};

// PATCH /api/cart/items/:id
export const updateItemQuantity = async (productId: number, qty: number): Promise<void> => {
  const response = await fetch(`${API_URL}/items/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty }),
  });
  if (!response.ok) {
    throw new Error('No se pudo actualizar la cantidad.');
  }
};

// DELETE /api/cart/items/:id
export const removeItemFromCart = async (productId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/items/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('No se pudo eliminar el producto.');
  }
};

// DELETE /api/cart
export const clearEntireCart = async (): Promise<void> => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('No se pudo vaciar el carrito.');
  }
};