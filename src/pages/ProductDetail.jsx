import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const { name, price, stock, image } = product;

  return (
    <main
      style={{
        width: "100%",
        background: "#0b1220",
        minHeight: "calc(100vh - 60px)",
        padding: "24px 20px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "min(1100px, 96vw)",
          background: "#0f172a",
          border: "1px solid #1f2937",
          borderRadius: 16,
          padding: 24,
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1fr) 1.2fr",
          gap: 24,
          color: "#e5e7eb",
        }}
      >
        {/* Imagen grande */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            background: "#111827",
            borderRadius: 12,
            border: "1px solid #1f2937",
          }}
        >
          <img
            src={image}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Info */}
        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>{name}</h1>

          <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e" }}>
            ${Number(price).toLocaleString("es-CL")}
          </div>

          <div style={{ fontSize: 14, color: stock > 0 ? "#a7f3d0" : "#fca5a5" }}>
            {stock > 0 ? `En stock: ${stock} unidades` : "Sin stock"}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              onClick={() => onAddToCart?.(product)}
              disabled={stock <= 0}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "1px solid #22c55e",
                background: stock > 0 ? "#16a34a" : "#374151",
                color: "#fff",
                fontWeight: 800,
                cursor: stock > 0 ? "pointer" : "not-allowed",
              }}
            >
              Añadir al carrito
            </button>

            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #334155",
                background: "#111827",
                color: "#e5e7eb",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
