import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, total, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = () => {
    if (items.length === 0) return alert("Tu carrito está vacío 🛒");
    setTimeout(() => {
      setShowSuccess(true);
      clearCart();
    }, 800); // simula el tiempo del pago
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
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #1f2937" }}>
                  <td style={{ padding: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    {p.name}
                  </td>
                  <td style={{ textAlign: "center", padding: 8 }}>{p.qty}</td>
                  <td style={{ textAlign: "right", padding: 8 }}>
                    ${(p.price * p.qty).toLocaleString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Total: ${total.toLocaleString("es-CL")}</h3>
          <button
            onClick={handlePayment}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid #22c55e",
              background: "#16a34a",
              color: "#fff",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Realizar pago
          </button>
        </div>
      </div>

      {/* 🔔 Pop-up de compra exitosa */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "grid",
            placeItems: "center",
          }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            style={{
              background: "#0f172a",
              padding: 32,
              borderRadius: 16,
              border: "2px solid #22c55e",
              textAlign: "center",
              color: "#e5e7eb",
              boxShadow: "0 0 30px rgba(34,197,94,.4)",
              animation: "pop 0.3s ease",
            }}
          >
            <h2 style={{ color: "#22c55e", marginBottom: 10 }}>✅ Compra Exitosa</h2>
            <p>¡Gracias por tu compra!</p>
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                marginTop: 16,
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#111827",
                color: "#fff",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
