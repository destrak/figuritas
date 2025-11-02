import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

// Base del backend
const API =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE) ||
  (import.meta && import.meta.env?.VITE_API_BASE) ||
  "http://localhost:4000";

export default function ProductsContainer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/products?estado=disponible`, { cache: "no-store" });
        if (!res.ok) throw new Error("No se pudo cargar el catálogo");
        const data = await res.json(); // [{id,name,price,stock,image}]
        if (alive) setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (alive) setError("Error al cargar productos.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Cargando productos...</p>;
  if (error)   return <p style={{ color: "#ef4444" }}>{error}</p>;
  if (products.length === 0) return <p style={{ color: "#fff" }}>No hay productos disponibles.</p>;

  return (
    <section style={{
      width: "100vw",
      minHeight: "calc(100vh - 64px)",
      background: "#0b1220",
      borderTop: "1px solid #1f2937",
      padding: "24px 24px 40px"
    }}>
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {products.map(p => <ProductCard key={p.id} {...p} />)}
      </div>
    </section>
  );
}
