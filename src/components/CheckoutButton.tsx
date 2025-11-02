// src/components/CheckoutButton.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const { clearCart } = useCart() // si sincronizas el contexto
  const CAR_ID = 1  // carrito demo

  const onCheckout = async () => {
    setLoading(true); setMsg(null)
    const { data, error } = await supabase.rpc('checkout_carrito', { p_id_car: CAR_ID })
    setLoading(false)

    if (error) {
      setMsg(`❌ Error RPC: ${error.message}`)
      return
    }
    if (!data?.ok) {
      setMsg(data?.message ?? '❌ Error en checkout')
      return
    }

    // Éxito
    setMsg(`${data.message} — Total $${data.total}`)
    // si usas carrito persistente, refresca o limpia el contexto
    try { await clearCart() } catch {}
  }

  return (
    <div style={{ display:'grid', gap:8 }}>
      <button disabled={loading} onClick={onCheckout}>
        {loading ? 'Procesando…' : 'Pagar / Checkout'}
      </button>
      {msg && <div>{msg}</div>}
    </div>
  )
}
