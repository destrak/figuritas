import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'


import * as CartAPI from '../data/api/cartapi'
import type { CartItemDTO } from '../data/api/cartapi'

// Define el tipo del producto que usan tus componentes
type Product = { id: number; name: string; price: number };

type CartCtx = {
  items: CartItemDTO[];
  addToCart: (product: Product) => Promise<void>;
  decOne: (id: number) => Promise<void>;
  setQty: (id: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  total: number;
  count: number;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const CartContext = createContext<CartCtx | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// ✅ ELIMINADO: Esta constante ya no es necesaria.
// const CAR_ID = 1; 

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CartAPI.getCartItems();
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh().catch(console.error) }, [refresh]);

  // ✅ ELIMINADO: Se ha quitado el useEffect completo que gestionaba la 
  // suscripción en tiempo real con Supabase.

  // --- Métodos del carrito refactorizados ---

  const handleApiCall = async (apiCall: () => Promise<void>, snapshot: CartItemDTO[]) => {
    clearError();
    try {
      await apiCall();
    } catch (e: any) {
      setError(e.message || 'La operación falló.');
      setItems(snapshot);
    }
  };

  const addToCart = async (product: Product) => {
    const snapshot = items;
    setItems(prev => {
      const i = prev.find(x => x.id === product.id);
      if (i) return prev.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
    await handleApiCall(() => CartAPI.addItemToOneCart(product.id), snapshot);
  };

  const setQty = async (id: number, qty: number) => {
    const snapshot = items;
    setItems(prev => prev.flatMap(x => x.id !== id ? [x] : qty > 0 ? [{ ...x, qty }] : []));
    await handleApiCall(() => CartAPI.updateItemQuantity(id, qty), snapshot);
  };
  
  const decOne = async (id: number) => {
    const currentQty = items.find(item => item.id === id)?.qty ?? 0;
    if (currentQty > 0) {
      await setQty(id, currentQty - 1);
    }
  };

  const clearCart = async () => {
    const snapshot = items;
    setItems([]);
    await handleApiCall(() => CartAPI.clearEntireCart(), snapshot);
  };

  const removeFromCart = async (id: number) => {
    const snapshot = items;
    setItems(prev => prev.filter(x => x.id !== id));
    await handleApiCall(() => CartAPI.removeItemFromCart(id), snapshot);
  };

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addToCart, 
        decOne, 
        setQty, 
        clearCart, 
        removeFromCart, 
        total, 
        count,
        isLoading,
        error,
        clearError
      }}
    >
      {children}
    </CartContext.Provider>
  );
};