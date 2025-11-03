// src/components/CheckoutButton.tsx
import { useState } from "react";
import { useCart } from "../context/CartContext";

// Base del backend (VM)
const API =
  (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_API_BASE) ||
  ((import.meta as any).env?.VITE_API_BASE) ||
  "http://localhost:4000";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const { clearCart } = useCart(); // limpia/actualiza el contexto después del pago
  const CAR_ID = 1; // carrito demo

  const onCheckout = async () => {
    if (loading) return; // antirebote simple
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // si en el futuro tienes usuario/logins, manda el id_car real aquí:
        body: JSON.stringify({ cartId: CAR_ID }),
      });

      // Manejo de HTTP-level errors
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => ({} as any));
      // Nuestro backend devuelve { ok: boolean, message: string }
      if (!data?.ok) {
        setMsg(data?.message ?? "❌ Error en checkout");
        return;
      }

      // ÉXITO
      // por compatibilidad, si en el futuro la RPC devuelve total, lo mostramos
      const maybeTotal = typeof data?.total !== "undefined" ? ` — Total $${Number(data.total).toLocaleString("es-CL")}` : "";
      setMsg(`✅ ${data.message || "Compra realizada"}${maybeTotal}`);

      // Limpia el carrito del contexto (y en BD si tu clearCart del contexto llama al backend)
      try { await clearCart(); } catch {}

    } catch (err: any) {
      console.error("Checkout error:", err);
      setMsg(`❌ Error al procesar el pago: ${err?.message || "desconocido"}`);
    } finally {
      // pequeño antirebote
      setTimeout(() => setLoading(false), 300);
    }
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button
        disabled={loading}
        onClick={onCheckout}
        style={{
          padding: "12px 18px",
          borderRadius: 12,
          border: "1px solid #22c55e",
          background: loading ? "#166534" : "#16a34a",
          color: "#fff",
          fontWeight: 800,
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Procesando…" : "Pagar / Checkout"}
      </button>
      {msg && <div style={{ color: msg.startsWith("✅") ? "#22c55e" : "#ef4444" }}>{msg}</div>}
    </div>
  );
}
