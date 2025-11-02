import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Base del backend
const API =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE) ||
  (import.meta && import.meta.env?.VITE_API_BASE) ||
  "http://localhost:4000";

export default function ProductDetail() {
  const { id } = useParams();
  const numId = Number(id);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/products/${numId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("No se pudo cargar el producto");
        const data = await res.json(); // { id, name, descripcion, price, stock, image }
        if (alive) setProduct(data ?? null);
      } catch (e) {
        console.error(e);
        if (alive) setProduct(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [numId]);

  if (loading) return <h2 style={{ color: "#fff" }}>Cargando...</h2>;
  if (!product) return <h2 style={{ color: "#fff" }}>Producto no encontrado</h2>;

  const { id: pid, name, price, stock, image, descripcion } = product;

  return (
    <main style={{ width: "100%", minHeight: "calc(100vh - 60px)", background: "#0b1220",
                   padding: "24px 20px", display: "grid", placeItems: "center", color: "#e5e7eb" }}>
      <div style={{ width: "min(1100px, 96vw)", background: "#0f172a", border: "1px solid #1f2937",
                    borderRadius: 16, padding: 24, display: "grid",
                    gridTemplateColumns: "minmax(260px, 1fr) 1.2fr", gap: 24 }}>
        <img src={image || "/vite.svg"} alt={name}
             style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 12 }} />
        <div style={{ display: "grid", gap: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>{name}</h1>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e" }}>
            ${Number(price).toLocaleString("es-CL")}
          </div>
          {descripcion && <p>{descripcion}</p>}
          <p>{stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}</p>
          <button
            disabled={stock <= 0}
            onClick={() => addToCart({ id: pid, name, price })}
            style={{ padding: "12px 18px", borderRadius: 12, border: "1px solid #22c55e",
                     background: stock > 0 ? "#16a34a" : "#374151", color: "#fff", fontWeight: 800 }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
