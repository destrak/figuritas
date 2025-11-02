import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getCartDetail,
  addOneToCart,
  setQtyDB,
  clearCartDB,
  removeFromCartDB,
  CartItem,
} from '../data/api/cart';

type CartCtx = {
  items: CartItem[];
  addToCart: (p: { id: number; name: string; price: number }) => Promise<void>;
  decOne: (id: number) => Promise<void>;
  setQty: (id: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  total: number;
  count: number;
};

const CartContext = createContext<CartCtx | undefined>(undefined);
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = useCallback(async () => {
    const data = await getCartDetail();
    setItems(data);
  }, []);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const addToCart = async (p: { id: number; name: string; price: number }) => {
    // optimistic
    setItems(prev => {
      const i = prev.find(x => x.id === p.id);
      if (i) return prev.map(x => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
    try {
      await addOneToCart(p.id); // backend espera id_objeto
    } catch (e) {
      console.error(e);
      await refresh(); // rollback
    }
  };

  const decOne = async (id: number) => {
    const current = items.find(x => x.id === id)?.qty ?? 0;
    const next = current - 1;
    setItems(prev => prev.flatMap(x => (x.id !== id ? [x] : next > 0 ? [{ ...x, qty: next }] : [])));
    try {
      await setQtyDB(id, next);
    } catch (e) {
      console.error(e);
      await refresh();
    }
  };

  const setQty = async (id: number, qty: number) => {
    const snap = items;
    setItems(prev => prev.flatMap(x => (x.id !== id ? [x] : qty > 0 ? [{ ...x, qty }] : [])));
    try {
      await setQtyDB(id, qty);
    } catch (e) {
      console.error(e);
      setItems(snap);
    }
  };

  const clearCart = async () => {
    const snap = items;
    setItems([]);
    try {
      await clearCartDB();
    } catch (e) {
      console.error(e);
      setItems(snap);
    }
  };

  const removeFromCart = async (id: number) => {
    const snap = items;
    setItems(prev => prev.filter(x => x.id !== id));
    try {
      await removeFromCartDB(id);
    } catch (e) {
      console.error(e);
      setItems(snap);
    }
  };

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, decOne, setQty, clearCart, removeFromCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
};
