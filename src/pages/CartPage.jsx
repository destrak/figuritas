// src/pages/CartPage.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabaseClient";

const CartPage = () => {
  const { items, total, clearCart, removeFromCart, setQty, decOne } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePayment = async () => {
    if (items.length === 0) return alert("Tu carrito está vacío 🛒");
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.rpc("checkout_carrito", { p_id_car: 1 });
      if (error) throw error;

      if (data?.ok) {
        setMessage(data.message || "✅ Compra exitosa");
        await clearCart();
      } else {
        setMessage(data?.message || "❌ Error en la compra");
      }
    } catch (err) {
      console.error("Error RPC:", err);
      setMessage("❌ Error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        width: "100%",
        minHeight: "calc(100vh - 60px)",
        background: "#0b1220",
        padding: "24px 20px",
        display: "flex",
        justifyContent: "center",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "min(900px, 96vw)",
          background: "#0f172a",
          border: "1px solid #1f2937",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,.3)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>🛒 Carrito de Compras</h2>

        {items.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 20,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #1f2937" }}>
                  <th style={{ textAlign: "left", padding: 8 }}>Producto</th>
                  <th style={{ textAlign: "center", padding: 8 }}>Cantidad</th>
                  <th style={{ textAlign: "right", padding: 8 }}>Precio</th>
                  <th style={{ textAlign: "center", padding: 8 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #1f2937" }}>
                    <td style={{ padding: 8 }}>{p.name}</td>
                    <td style={{ textAlign: "center", padding: 8 }}>
                      {/* Controles de cantidad (opcional) */}
                      <button
                        onClick={() => decOne(p.id)}
                        style={{ padding: "2px 8px", marginRight: 6 }}
                        title="Quitar 1"
                      >
                        −
                      </button>
                      <span style={{ minWidth: 24, display: "inline-block", textAlign: "center" }}>
                        {p.qty}
                      </span>
                      <button
                        onClick={() => setQty(p.id, p.qty + 1)}
                        style={{ padding: "2px 8px", marginLeft: 6 }}
                        title="Agregar 1"
                      >
                        +
                      </button>
                    </td>
                    <td style={{ textAlign: "right", padding: 8 }}>
                      ${(p.price * p.qty).toLocaleString("es-CL")}
                    </td>
                    <td style={{ textAlign: "center", padding: 8 }}>
                      <button
                        onClick={() => removeFromCart(p.id)}
                        style={{
                          background: "#ef4444",
                          border: "none",
                          color: "#fff",
                          padding: "6px 10px",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                        title="Eliminar del carrito"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Botones inferiores */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Total: ${total.toLocaleString("es-CL")}</h3>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={clearCart}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid #334155",
                    background: "#111827",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Vaciar carrito
                </button>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid #22c55e",
                    background: loading ? "#166534" : "#16a34a",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Procesando..." : "Realizar pago"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Mensaje de compra */}
        {message && (
          <p style={{ marginTop: 20, color: message.includes("✅") ? "#22c55e" : "#ef4444" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
};

export default CartPage;
