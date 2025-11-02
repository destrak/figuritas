// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getCartDetail, addOneToCart, setQtyDB, clearCartDB, removeFromCartDB } from '../data/api/cart'
import { supabase } from '../lib/supabaseClient'

type CartItem = { id: number; name: string; price: number; qty: number }
type CartCtx = {
  items: CartItem[]
  addToCart: (p: { id: number; name: string; price: number }) => Promise<void>
  decOne: (id: number) => Promise<void>
  setQty: (id: number, qty: number) => Promise<void>
  clearCart: () => Promise<void>
  removeFromCart: (id: number) => Promise<void> // 👈 nuevo
  total: number
  count: number
}

const CartContext = createContext<CartCtx | undefined>(undefined)
export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

const CAR_ID = 1

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  const refresh = useCallback(async () => {
    const data = await getCartDetail()
    setItems(data)
  }, [])

  useEffect(() => { refresh().catch(console.error) }, [refresh])

  useEffect(() => {
    const ch = supabase
      .channel('carrito:1')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'carrito_items', filter: `id_car=eq.${CAR_ID}` },
        () => setTimeout(() => refresh(), 60)
      )
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [refresh])

  const addToCart = async (p: { id: number; name: string; price: number }) => {
    setItems(prev => {
      const i = prev.find(x => x.id === p.id)
      if (i) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x)
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }]
    })
    try { await addOneToCart(p.id) } catch (e) { console.error(e); await refresh() }
  }

  const decOne = async (id: number) => {
    const current = items.find(x => x.id === id)?.qty ?? 0
    const next = current - 1
    setItems(prev => prev.flatMap(x => x.id !== id ? [x] : next > 0 ? [{ ...x, qty: next }] : []))
    try { await setQtyDB(id, next) } catch (e) { console.error(e); await refresh() }
  }

  const setQty = async (id: number, qty: number) => {
    const snapshot = items
    setItems(prev => prev.flatMap(x => x.id !== id ? [x] : qty > 0 ? [{ ...x, qty }] : []))
    try { await setQtyDB(id, qty) } catch (e) { console.error(e); setItems(snapshot) }
  }

  const clearCart = async () => {
    const snapshot = items
    setItems([])
    try { await clearCartDB() } catch (e) { console.error(e); setItems(snapshot) }
  }

  const removeFromCart = async (id: number) => {
    const snapshot = items
    setItems(prev => prev.filter(x => x.id !== id))
    try { await removeFromCartDB(id) } catch (e) { console.error(e); setItems(snapshot) }
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, decOne, setQty, clearCart, removeFromCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}
