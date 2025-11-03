// src/pages/CartPage.jsx
import React, { useState, useCallback } from "react";
import { useCart } from "../context/CartContext";

// 🔗 URL base del backend
const API =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE) ||
  (import.meta && import.meta.env?.VITE_API_BASE) ||
  "http://localhost:4000";

// ---------- Componente Toast ----------
function Toast({ open, type = "success", message, onClose }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: type === "success" ? "#16a34a" : "#ef4444",
        color: "#fff",
        padding: "16px 24px",
        borderRadius: 12,
        boxShadow: "0 10px 24px rgba(0,0,0,.3)",
        zIndex: 9999,
        transition: "all 0.3s ease",
      }}
    >
      <strong style={{ display: "block", fontSize: 18, marginBottom: 4 }}>
        {type === "success" ? "✅ Compra exitosa" : "❌ Error en compra"}
      </strong>
      <p style={{ margin: 0 }}>{message}</p>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          marginTop: 6,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Cerrar ✕
      </button>
    </div>
  );
}

// ---------- Página principal ----------
const CartPage = () => {
  const { items, total, clearCart, removeFromCart, setQty, decOne } = useCart();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  const showToast = useCallback((type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast({ open: false, type, message: "" }), 3500);
  }, []);

  const handlePayment = async () => {
    if (items.length === 0) {
      showToast("error", "Tu carrito está vacío 🛒");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.ok) {
        await clearCart();
        showToast("success", data.message || "Compra completada correctamente");
      } else {
        showToast("error", data?.message || "No se pudo completar la compra");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      showToast("error", "Error al procesar el pago.");
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
                      <button
                        onClick={() => decOne(p.id)}
                        style={{
                          padding: "4px 10px",
                          marginRight: 6,
                          background: "#1e293b",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          minWidth: 30,
                          display: "inline-block",
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      >
                        {p.qty}
                      </span>
                      <button
                        onClick={() => setQty(p.id, p.qty + 1)}
                        style={{
                          padding: "4px 10px",
                          marginLeft: 6,
                          background: "#22c55e",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
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
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Controles inferiores */}
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
      </div>

      {/* Pop-out de resultado */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ open: false, type: toast.type, message: "" })}
      />
    </main>
  );
};

export default CartPage;
